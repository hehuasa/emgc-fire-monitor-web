'use server';
import Database from 'better-sqlite3';
import { resolve } from 'path';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { getAmisPages } from './cache';

import { existsSync, mkdirSync } from 'fs';

const dev = process.env.NODE_ENV !== 'production';

const curretnPath = process.cwd();

const dirPath = resolve(curretnPath, './public/libs/sqlite3');
if (!existsSync(dirPath)) {
	if (!existsSync(resolve(curretnPath, './public/libs'))) {
		mkdirSync(resolve(curretnPath, './public/libs'));
	}
	if (!existsSync(resolve(curretnPath, './public/libs/sqlite3'))) {
		mkdirSync(resolve(curretnPath, './public/libs/sqlite3'));
	}
}

const dbPath = resolve(dirPath, dev ? './frontEndDev.db' : './frontEnd.db');

const db = new Database(dbPath, { verbose: console.log });
// db.run('PRAGMA busy_timeout = 5000');

const initTables = () => {
	db.exec(
		`CREATE TABLE IF NOT EXISTS amisContent (
    "name" TEXT,
  "id" INTEGER NOT NULL,
  "content" TEXT,
  "updateAt" text,
  "createAt" text,
  "cacheId" text,
  PRIMARY KEY ("id")
      );`
	);

	db.exec(`DELETE FROM "amisContent"`);
};

process.env.isBuilding && initTables();

const amisContentGet = db.prepare('SELECT content, cacheId FROM amisContent WHERE id = ?');
const amisContentInsert = db.prepare(
	`INSERT INTO amisContent (id, content, cacheId, createAt, updateAt) VALUES (?, ?, ?, ?, ?)`
);
const amisContentUpdate = db.prepare(
	`UPDATE amisContent SET content = @content , cacheId =  @cacheId, updateAt =  @updateAt WHERE id =  @id`
);
const getSqlDataFun = (
	id: number,
	resolve: (value: any) => void,
	reject: (reason?: any) => void
) => {
	try {
		console.info('============id==============', id);
		const res = amisContentGet.get(id);
		console.info('========amisContentGet====res==============', res);

		resolve(res);
	} catch (error) {
		reject(false);
	}
};
export const getSqlData = (id: number) => {
	return new Promise<any>((resolve, reject) => {
		getSqlDataFun(id, resolve, reject);
	});
};
const insertSqlDataFun = (
	id: number,
	content: string,
	cacheId: string,
	date: string,
	resolve: (value: any) => void,
	reject: (reason?: any) => void
) => {
	try {
		const res = amisContentInsert.run(id, content, cacheId, date, date);
		resolve(res);
	} catch (error) {
		reject(false);
	}
};
const insertSqlData = (id: number, content: string, cacheId: string) => {
	const date = moment().format('YYYY-MM-DD HH:mm:ss');
	return new Promise<boolean>((resolve, reject) => {
		insertSqlDataFun(id, content, cacheId, date, resolve, reject);
	});
};

const updateSqlDataFun = (
	id: number,
	content: string,
	cacheId: string,
	date: string,
	resolve: (value: any) => void,
	reject: (reason?: any) => void
) => {
	const res = amisContentUpdate.run({
		id,
		content,
		cacheId,
		date,
	});

	if (res.changes > 0) {
		resolve(true);

		console.log('更新成功');
	} else {
		console.log('更新失败');
		reject(false);
	}
};
const updateSqlData = (id: number, content: string, cacheId: string) => {
	const date = moment().format('YYYY-MM-DD HH:mm:ss');
	return new Promise<boolean>((resolve, reject) => {
		updateSqlDataFun(id, content, cacheId, date, resolve, reject);
	});
};
const getRemoteData = async (id: number) => {
	const fetchUrl =
		process.env.NEXT_PUBLIC_ANALYTICS_Strapi_Server +
		`/api/cpecc-amis-pages/${id}?fields[0]=content`;
	console.info('=========getRemoteData============执行=====', id);

	const res = await fetch(fetchUrl, { cache: 'no-cache' });

	const json = await res.json();
	return json;
};

const getAndUpadte = async (id: number, cacheId: string) => {
	const resJson = await getRemoteData(Number(id));
	const json = JSON.stringify(resJson.data);
	const newJson = json.replaceAll("'", '&#39;');

	try {
		const insertRes = await updateSqlData(Number(id), newJson, cacheId);

		if (insertRes) {
			const data = JSON.parse(json);
			return Response.json({ data, status: 0, msg: '操作成功' });
		} else {
			return Response.json({ status: 500, msg: '操作成功', data: {} });
		}
	} catch {
		return Response.json({ status: 500, msg: '操作成功', data: {} });
	}
};
const getAndInsert = async (id: number, cacheId: string) => {
	const resJson = await getRemoteData(Number(id));
	const json = JSON.stringify(resJson.data);
	const newJson = json.replaceAll("'", '&#39;');

	try {
		const res = await getSqlData(Number(id));
		const insertRes =
			res && res.content
				? await updateSqlData(Number(id), newJson, cacheId)
				: await insertSqlData(Number(id), newJson, cacheId);

		if (insertRes) {
			const data = JSON.parse(json);
			return Response.json({ data, status: 0, msg: '操作成功' });
		} else {
			return Response.json({ status: 500, msg: '操作成功', data: {} });
		}
	} catch {
		return Response.json({ status: 500, msg: '操作成功', data: {} });
	}
};
// getSqlData会存在极短时间请求同一个id的情况，如果执行sql写，会重复操作，因此做一个缓存 只限构建环节
const getSqlDataObj: any = {};
const getSqlDataCacheFun = async (id: number) => {
	return new Promise<any>((resolve) => {
		if (getSqlDataObj[id]) {
			console.info('=========getSqlDataCacheFun============延迟执行=====', id);
			setTimeout(() => {
				getSqlData(id).then((res) => {
					resolve(res);
				});
			}, 3 * 1000);
		} else {
			getSqlDataObj[id] = 1;
			getSqlData(id).then((res) => {
				resolve(res);
			});
		}
	});
};
const cacheAmis = async () => {
	// 如果是打包环境，执行一次amis缓存
	console.info(
		'============cacheAmis========执行======',
		process.env.buildCacheId,
		process.env.isBuilding
	);
	if (process.env.isBuilding) {
		const amisPagesInfos = await getAmisPages();
		for (const {
			attributes: { content },
		} of amisPagesInfos) {
			for (const { id } of content) {
				const cacheId = process.env.buildCacheId || uuidv4();
				handleCache(id, cacheId);
			}
		}
	}
};
export async function handleCache(id: number, cacheId?: string) {
	const res = process.env.isBuilding
		? await getSqlDataCacheFun(Number(id))
		: await getSqlData(Number(id));

	if (res && res.content) {
		// 缓存id不一致，请求最新数据只限构建环节，生产环境不执行
		// console.info(
		// 	'=======id=====res.cacheId========cacheId===process.env.isBuilding===',
		// 	id,
		// 	res.cacheId,
		// 	cacheId,
		// 	process.env.isBuilding
		// );

		if (process.env.isBuilding && res.cacheId !== cacheId) {
			console.info('============getAndUpadte===执行==id===cacheId======', id, cacheId);
			const res = await getAndUpadte(id, cacheId!);
			return res;
		} else {
			const data = JSON.parse(res.content.replaceAll('&#39;', "'"));
			console.info('============handleCache===执行==id===cacheId======', id, cacheId);
			return Response.json({ data, status: 0, msg: '操作成功' });
		}
	} else {
		const res = await getAndInsert(id, cacheId!);
		setTimeout(() => {
			if (getSqlDataObj[id]) {
				delete getSqlDataObj[id];
			}
		}, 10);
		return res;
	}
}

cacheAmis();
