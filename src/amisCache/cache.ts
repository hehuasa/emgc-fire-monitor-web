import { stringify } from 'qs';

export interface IAimsPageInfoItem {
	id: number;
	attributes: {
		projectName: string;
		remark: string;
		projectCode: string;
		content: { name: string; id: number }[];
	};
}

export const getAmisPages = async () => {
	const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Strapi_Server}/api/project-of-cpecc-amis-ids?filters[user][$eq]=${process.env.NEXT_PUBLIC_ANALYTICS_ProductCode}`;
	const params = stringify({
		projectCode: process.env.NEXT_PUBLIC_ANALYTICS_ProductCode,
	});
	const res = await fetch(url, { cache: 'no-store' });
	console.info('============url==============', `${url}?${params}`);

	const json = await res.json();
	console.info('============json==============', json);

	return json.data as IAimsPageInfoItem[];
};
