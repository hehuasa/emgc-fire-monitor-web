'use client';
import { isLoginModel } from '@/models/user';
import { clientType, request } from '@/utils/request';
import { Box, Skeleton } from '@chakra-ui/react';
import { useLocalStorageState, useMount } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { IUserInfo, IUserRes, LoginItems } from '../login/page';
const SingleLogin = () => {
	const setLoginStatus = useSetRecoilState(isLoginModel);
	const [currentUserInfo, setCurrentUserInfo] = useLocalStorageState<null | IUserInfo>(
		'currentUserInfo_cx_alarm',
		{
			defaultValue: null,
		}
	);
	const [auth, setAuth] = useLocalStorageState<'f' | 't'>('Auth');

	const router = useRouter();
	const [text, setText] = useState('');

	// 单点登录
	const singleLogin = async () => {
		//
		const paramTokenReg = new RegExp('(^|&)token=([^&]*)(&|$)', 'i');
		const regExpMatchArray = window.location.search.substr(1).match(paramTokenReg);
		const token =
			regExpMatchArray != null ? decodeURI(regExpMatchArray[2]) : localStorage.getItem('token');
		if (token) {
			localStorage.setItem('token', token);
		}

		const request = new XMLHttpRequest();
		request.open(
			'GET',
			process.env.NEXT_PUBLIC_ANALYTICS_Ms_SINGLESIGNON + '/harmony/kepler/upms/u/users/current',
			true
		);
		request.setRequestHeader('Authorization', 'Bearer ' + token);
		request.send(null);
		request.onreadystatechange = function () {
			if (request.readyState === 4 && request.status === 200) {
				const response = JSON.parse(request.responseText);
				handleLogin({ user: response.data.username, password: 'yuanba@2023', remberme: true });
			}
			if (request.readyState === 4 && request.status === 401) {
				window.location.href =
					request.getResponseHeader('Redirect-Login-Page') + '?redirect=' + window.location.href;
			}
			// 未授权，接⼝返回403
			if (request.readyState === 4 && request.status === 403) {
				const response = JSON.parse(request.responseText);
				setText(response.message);
			}
		};
	};

	useMount(() => {
		singleLogin();
	});

	const handleLogin = async ({ user, password, remberme }: LoginItems) => {
		const id = uuidv4();
		if (remberme) {
			localStorage.setItem('user', user);
			localStorage.setItem('password', password);
		} else {
			localStorage.removeItem('user');
			localStorage.removeItem('password');
		}

		const pubKeyRes = await request<string>({
			url: `/ms-login/user/getPubKey?id=${id}`,
		});

		if (pubKeyRes.code === 200) {
			const Jsencrypt = (await import('jsencrypt')).default;
			const jsencrypt = new Jsencrypt();

			jsencrypt.setPublicKey(pubKeyRes.data);
			const password_ = jsencrypt.encrypt(password);

			const loginRes = await request<IUserRes>({
				url: `/ms-login/user/login`,
				options: {
					headers: {
						'content-type': 'application/json;charset=utf-8',
						reqType: clientType,
					},
					method: 'POST',
					body: JSON.stringify({ clientUUid: id, login: user, password: password_ }),
				},
			});
			if (loginRes.code === 200) {
				const currentUserInfo: IUserInfo = { ...loginRes.data, clientType };
				setLoginStatus(true);
				setCurrentUserInfo(currentUserInfo);
				setAuth('t');
				if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'yb') {
					router.push('/sms/operation');
					return;
				}
			}
		}
	};

	return (
		<Skeleton>
			<Box w={'full'} h={'100vh'}>
				{text && <Box>{text}</Box>}
			</Box>
		</Skeleton>
	);
};

export default SingleLogin;
