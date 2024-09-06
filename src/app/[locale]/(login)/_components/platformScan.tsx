'use client';

import { useLocalStorageState, useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import QRCode from 'qrcode.react';
import React from 'react';
import { clientType, IResData, request } from '@/utils/request';
import { useInterval } from 'ahooks';
import { IUserRes } from '@/models/user';
import { useRouter } from 'next/navigation';



interface IGetSavedTokenRes {
	success: boolean;
	//token: string;
	userInfo: IUserRes;
}

const PlatformScan = () => {
	const router = useRouter();
	const [qrcodeId, setQrcodeId] = useSafeState('');
	const [_, setUserInfo] = useLocalStorageState<null | IUserRes>('userInfo', {
		defaultValue: null,
	});
	//获取token
	const getToken = useMemoizedFn(async () => {
		const { data } = await request<{ data: { qrcodeId: string } }>({
			url: '/ms-system/login/getLoginQrcode',
			options: {
				dataReturnConfig: {
					showErrorTip: true,
					onlyReturnSuccess: true,
				},
			},
		});
		setQrcodeId(data.data.qrcodeId);
	});

	//获取用户扫码保存后的token
	const getSavedToken = useMemoizedFn(async () => {
		if (qrcodeId) {
			const url = `/ms-system/login/getQrcodeToken?qrcodeId=${qrcodeId}`;

			const res = await fetch(
				url.indexOf('http') === -1
					? (process.env.NEXT_PUBLIC_ANALYTICS_BasePath as string) + url
					: url,
				{
					headers: {
						reqType: clientType,
					},
				}
			);

			const resToken = res.headers.get('x-auth-token');
			if (resToken) {
				const { data } = (await res.json()) as IResData<IGetSavedTokenRes>;
				localStorage.setItem(`x-auth-token`, resToken);
				saveUserInfo(data.userInfo);
				router.push('/homepage');
			}
			console.log('resres', resToken);
		}
	});

	const getTokenClear = useInterval(getToken, 1000 * 30);

	const getSavedTokenClear = useInterval(getSavedToken, 1000 * 1.5);

	//保存用户信息
	const saveUserInfo = useMemoizedFn((data: IUserRes) => {
		const newData = JSON.parse(JSON.stringify(data)) as IUserRes;
		//把权限转换成对象，方便获取
		const permissions = newData.permissions;
		const permissionsObj: { [key: string]: unknown } = {};
		permissions.forEach((item) => (permissionsObj[item] = true));
		data.permissionsObj = permissionsObj;
		data.permissions = [];
		setUserInfo(data);
	});

	useMount(() => {
		getToken();
	});

	useUnmount(() => {
		getTokenClear();
		getSavedTokenClear();
	});

	return (
		<div className="w-full">
			<div className="w-[232px] h-[232px] my-7 mx-auto">
				{qrcodeId ? <QRCode value={JSON.stringify({ qrcodeId })} size={232} /> : null}
			</div>
			<div className=" text-center">点阵平台小程序扫码登录</div>
		</div>
	);
};

export default PlatformScan;
