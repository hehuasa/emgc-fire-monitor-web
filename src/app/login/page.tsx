'use client';

import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import back3d from '@/assets/login/back3d.png';
import zgsh from '@/assets/login/zgsh.png';
import { localesModal } from '@/models/global';
import { flatMenuModel, IMenuItem, isLoginModel } from '@/models/user';
import { request } from '@/utils/request';
import {
	getCxFirstRouter,
	privateKey as userPrivateKey,
	publicKey as userPublicKey,
} from '@/utils/util';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	useTheme,
	useToast,
} from '@chakra-ui/react';
import { useLocalStorageState, useMemoizedFn, useMount, useSafeState } from 'ahooks';
import JSEncrypt from 'jsencrypt';
import Image from 'next/image';
import { parse, stringify } from 'qs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

export type LoginItems = {
	user: string;
	password: string;
	remberme: boolean;
};

export interface IUserRes {
	cardNo: number;
	idCardNo: number;
	loginAccount: string;
	loginId: string;
	mobile: number;
	officeNum: number;
	sex: string;
	userCode: string;
	userId: string;
	userName: string;
	userState: number;
}
export interface IUserInfo extends IUserRes {
	clientType: string;
}

const genParentName = (menu: IMenuItem) => {
	if (menu.children) {
		for (const item of menu.children) {
			// item.url = item.url.includes('/emgc') ? item.url : '/emgc' + item.url;
			item.parentNames = menu.parentNames
				? [...menu.parentNames, { name: item.functionName, url: item.url }]
				: [
						{ name: menu.functionName, url: menu.url },
						{ name: item.functionName, url: item.url },
				  ];
			genParentName(item);
		}
	}
};

function Login() {
	const [locales, setLocales] = useRecoilState(localesModal);

	const toast = useToast();
	const theme = useTheme();
	const clientType = 'web-show';
	const [loginErrorText, setLoginErrorText] = useSafeState('');
	const router = useRouter();
	// const userAndPasswordJSEncrypt = useRef<JSEncrypt | null>(null);
	const [passShow, setPassShow] = useState(false);
	const setLoginStatus = useSetRecoilState(isLoginModel);
	const { formatMessage } = useIntl();
	const [currentUserInfo, setCurrentUserInfo] = useLocalStorageState<null | IUserInfo>(
		'currentUserInfo_cx_alarm',
		{
			defaultValue: null,
		}
	);
	const [auth, setAuth] = useLocalStorageState<'f' | 't'>('Auth');
	const jsencryptRef = useRef<JSEncrypt | null>(null);
	const methods = useForm<LoginItems>({
		defaultValues: {
			user: '',
			password: '',
		},
	});
	// const setMenuModel = useSetRecoilState(menuModel);
	const [flatMenus, setFlatMenuModel] = useRecoilState(flatMenuModel);
	// const [rolesId, setRolesId] = useState<string[]>([]);

	const [localRouteUrls, setLocalRouteUrls] = useLocalStorageState<null | Array<string>>(
		'SystemSignRouteUrls'
	);
	const [localHomepage, setLocalHomepage] = useLocalStorageState<null | string>(
		'SystemSignHomepage'
	);
	const [localLogin, setLocalLogin] = useLocalStorageState<null | string>('SystemSignLogin');

	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		control,
	} = methods;

	useMount(async () => {
		const isAuth = sessionStorage.getItem('login');
		if (isAuth && isAuth == 'f') {
			toast({
				title: '登录已过期，请重新登录！',
				status: 'error',
				position: 'top',
				isClosable: true,
			});
		}
	});

	const getMenus = async (userId: string) => {
		const url = `/ms-system/menu/list-auth-menu?systemCode=SystemSign&userId=${userId}`;
		const res = await request<IMenuItem[]>({
			url,
		});
		setFlatMenuModel(res.data);
		return res.data;
	};

	useEffect(() => {
		// 阻止浏览器回退
		const onBeforeUnload = () => window.history.pushState({}, '');
		window.addEventListener('beforeunload', onBeforeUnload);

		return () => window.removeEventListener('beforeunload', onBeforeUnload);
	}, []);

	//账号密码回填还有加密
	useMount(async () => {
		const Jsencrypt = (await import('jsencrypt')).default;
		jsencryptRef.current = new Jsencrypt();

		jsencryptRef.current.setPublicKey(userPublicKey);
		jsencryptRef.current.setPrivateKey(userPrivateKey);

		try {
			const userLoginInfo = localStorage.getItem('user');
			if (userLoginInfo) {
				const userAndPassword = decrypt(userLoginInfo);
				const { user, password, remberme } = parse(userAndPassword) as unknown as {
					user: string;
					password: string;
					remberme: string;
				};

				if (remberme === 'true') {
					setValue('password', password);
					setValue('user', user);
					setValue('remberme', true);
				}
			}
		} catch (e) {
			//
		}
	});

	const encrypt = (val: string) => {
		const newVal = jsencryptRef.current?.encrypt(val) as string;
		return newVal;
	};
	const decrypt = (val: string) => {
		const newVal = jsencryptRef.current?.decrypt(val) as string;
		return newVal;
	};

	/*
   判断登录后第一个展示的路由
   川西路由比较特殊：
  */
	const estimateRouter = useMemoizedFn(async (userId: string) => {
		const menu = await getMenus(userId);
		console.log('川西登录', menu);

		// 铺平菜单数据
		const flatMenus: IMenuItem[] = [];
		const flatMenus_ = (menus: IMenuItem[]) => {
			for (const iterator of menus) {
				flatMenus.push(iterator);
				if (iterator.children) {
					flatMenus_(iterator.children);
				}
			}
		};

		flatMenus_(menu);
		// 路由权限判断
		const newRouteUrls = []; // 路由数组
		for (const menu of flatMenus) {
			newRouteUrls.push(menu.url);
		}

		setLocalRouteUrls(newRouteUrls);
		setLocalHomepage('/emgc/montior/operation');
		setLocalLogin('/login');

		//如果有检测预警优先跳转到检测预警
		const JCYJMenu = menu.find((item) => item.functionCode === '2001');
		if (JCYJMenu) {
			router.push(JCYJMenu.url);
		} else {
			const firstRouterUrl = getCxFirstRouter(menu);
			if (firstRouterUrl) {
				router.push(firstRouterUrl);
			} else {
				toast({
					title: '暂无权限',
					status: 'error',
					position: 'top',
					isClosable: true,
				});
			}
		}
	});

	const handleLogin = async ({ user, password, remberme }: LoginItems) => {
		localStorage.setItem(
			process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
				? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_clientType`
				: 'clientType',
			clientType
		);

		//保存账号和密码，因为需要登录到视频客户端，所以需要加密报销账号和密码
		const userAndPassword = encrypt(stringify({ user, password, remberme }));

		localStorage.setItem('user', userAndPassword);

		const id = uuidv4();

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
					clientType: 'web-show',
				},
			});
			if (loginRes.code === 200) {
				const currentUserInfo: IUserInfo = { ...loginRes.data, clientType };
				setLoginStatus(true);
				setCurrentUserInfo(currentUserInfo);
				setAuth('t');
				switch (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type) {
					case 'yb':
					case 'zk':
						router.push('/sms/operation');
						setLocalHomepage('/sms/operation');
						setLocalLogin('/singleLogin');
						return;
					case 'cx':
						estimateRouter(currentUserInfo.userId);
						return;
					case 'fire':
						router.push('/fireAlarm/montior/operation');
				}
			} else {
				setLoginErrorText(loginRes.msg);
			}
		}
	};

	const clearLoginErrorText = useMemoizedFn(() => {
		setLoginErrorText('');
	});

	const handlePassShow = useCallback(() => setPassShow(!passShow), [passShow]);

	return (
		<Flex
			w="full"
			h="full"
			bg="emgc.white.100"
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					handleSubmit(handleLogin)();
				}
			}}
		>
			{/* <Box position="fixed" right="4" top="2">
        <SwitchLanguage stroke="#000" />
      </Box> */}

			<Box
				flex={1}
				h="full"
				backgroundImage={back3d.src}
				backgroundSize={'100% 100%'}
				backgroundRepeat="no-repeat"
			/>
			{
				// 国际化
			}
			{process.env.NEXT_PUBLIC_ANALYTICS_cx_param1 === '1' && (
				<Box
					pos="absolute"
					w="27px"
					h="27px"
					top="10px"
					right="10px"
					cursor="pointer"
					title={locales === 'zh' ? '中文/English' : 'English/中文'}
					onClick={() => {
						setLocales(locales === 'zh' ? 'en' : 'zh');
					}}
				>
					{locales === 'zh' ? (
						<Icon viewBox="0 0 97.218 93.045" w="100%" h="100%">
							<g data-name="组 4">
								<g fill="#000" data-name="组 1">
									<path
										d="M20.72 32.357a22.055 22.055 0 0 0 5.6 8.789 23.044 23.044 0 0 0 4.959-8.789H20.72Z"
										data-name="路径 1"
									/>
									<path
										d="M89.558 12.619H48.314L45.958 0h-38.3a7.67 7.67 0 0 0-7.66 7.66v65.106a7.669 7.669 0 0 0 7.66 7.66h34.91l-2.797 12.619h49.787a7.669 7.669 0 0 0 7.66-7.66V20.278a7.669 7.669 0 0 0-7.66-7.66Zm-52 38.691a38.813 38.813 0 0 1-11.244-6.236 29.044 29.044 0 0 1-11.637 6.137l-1.571-2.6a27.879 27.879 0 0 0 11.146-5.45 25.045 25.045 0 0 1-6.334-10.753H13.65V29.46h11.146a20.15 20.15 0 0 0-2.6-3.683l2.946-1.08a23.908 23.908 0 0 1 2.8 4.714h10.651v2.946h-4.272a28.553 28.553 0 0 1-5.944 10.606 38.7 38.7 0 0 0 10.8 5.794l-1.62 2.553Zm55.827 34.026a3.835 3.835 0 0 1-3.83 3.83H44.583l1.915-8.789h14.386l-8.2-45.712-.049.245-.344-1.817.1.049-3-16.694h40.217a3.835 3.835 0 0 1 3.83 3.83v65.058Z"
										data-name="路径 2"
									/>
									<path
										d="M62.259 49.198h10.557v-2.8H62.259v-5.6h11.239v-2.8H58.969V58.13h14.976v-2.8H62.259v-6.138Zm22.046-6.039a4.954 4.954 0 0 0-2.406.54 5.758 5.758 0 0 0-1.915 1.571v-1.718h-3.192V58.13h3.192v-8.789a3.954 3.954 0 0 1 1.178-2.7 2.98 2.98 0 0 1 2.062-.835c2.209 0 3.29 1.178 3.29 3.584v8.691h3.192V49.1c.098-3.977-1.768-5.942-5.401-5.942Z"
										data-name="路径 3"
									/>
								</g>
							</g>
						</Icon>
					) : (
						<Icon viewBox="0 0 97.218 93.045" w="100%" h="100%">
							<g fill="#000" data-name="组 5">
								<path
									d="M84.562 63.363a38.953 38.953 0 0 1-11.243-6.235 29.021 29.021 0 0 1-11.638 6.137l-1.571-2.602a27.707 27.707 0 0 0 11.146-5.45 25.171 25.171 0 0 1-6.335-10.754H60.65v-2.945h11.146a20.225 20.225 0 0 0-2.6-3.683l2.943-1.08a24.042 24.042 0 0 1 2.8 4.713h10.654v2.947h-4.272a28.731 28.731 0 0 1-5.941 10.606 38.831 38.831 0 0 0 10.8 5.793l-1.62 2.553ZM67.72 44.411a21.953 21.953 0 0 0 5.6 8.789 23.081 23.081 0 0 0 4.96-8.789Z"
									data-name="减去 1"
								/>
								<path
									d="M89.558 93.045H39.771l2.8-12.619H7.66A7.669 7.669 0 0 1 0 72.766V7.66A7.669 7.669 0 0 1 7.66 0h38.3l2.357 12.619h41.241a7.669 7.669 0 0 1 7.66 7.66v65.106a7.669 7.669 0 0 1-7.66 7.66ZM46.5 80.377l-1.915 8.788h44.974a3.834 3.834 0 0 0 3.829-3.829h.049V20.278a3.834 3.834 0 0 0-3.83-3.83H49.395l3 16.694-.1-.05.344 1.817.049-.246 8.2 45.713H46.5ZM29.73 33.629v14.582h3.191v-8.788a3.944 3.944 0 0 1 1.179-2.7 2.981 2.981 0 0 1 2.062-.834c2.213 0 3.289 1.172 3.289 3.584v8.691h3.191v-8.987a6.081 6.081 0 0 0-1.381-4.547 5.394 5.394 0 0 0-4.02-1.394 4.926 4.926 0 0 0-2.406.54 5.776 5.776 0 0 0-1.915 1.571v-1.718ZM11.906 28.08v20.131h14.976v-2.8H15.2v-6.136h10.553v-2.8H15.2v-5.6h11.24v-2.8Z"
									data-name="减去 2"
								/>
							</g>
						</Icon>
					)}
				</Box>
			)}

			<Flex flex={1} h="full" flexDirection="column" justifyContent="center" alignItems="center">
				<Flex alignItems="center" justify="start">
					{process.env.NEXT_PUBLIC_ANALYTICS_cx_param1 !== '1' && (
						<Image src={zgsh} alt="login" width="95" height="98" />
					)}

					<Flex
						direction="column"
						ml={process.env.NEXT_PUBLIC_ANALYTICS_cx_param1 !== '1' ? '5' : '0'}
					>
						<Box color="pri.black.300" fontSize="30px" fontWeight="600">
							{process.env.NEXT_PUBLIC_ANALYTICS_cx_param1 !== '1'
								? formatMessage({ id: 'sysName' })
								: '安全管控指挥系统'}
						</Box>
						<Box color="pri.black.300" fontSize="22px">
							{process.env.NEXT_PUBLIC_ANALYTICS_SUB_SYSTEM_NAME}
						</Box>
					</Flex>
				</Flex>
				<form>
					<Box w="577px" position="relative">
						<Stack w="94" spacing={8} pt={'120px'}>
							<Stack align="flex-start">
								<Box color="pri.blue.100" fontSize={'4xl'} letterSpacing="4px" fontWeight="bold">
									{/* {formatMessage({ id: "login" })} */}
								</Box>
							</Stack>
							<Box>
								<Box>
									<FormControl isInvalid={!!errors.user} mb="10">
										<FormLabel color="pri.blue.100">{formatMessage({ id: 'account' })}</FormLabel>
										<Controller
											control={control}
											rules={{
												required: {
													value: true,
													message: formatMessage({ id: 'accountPlaceHoder' }),
												},
											}}
											render={({ field: { onChange, onBlur, value } }) => (
												<Input
													placeholder={formatMessage({ id: 'accountPlaceHoder' })}
													variant="flushed"
													onBlur={onBlur}
													onChange={(e) => {
														onChange(e);
														clearLoginErrorText();
													}}
													value={value}
												/>
											)}
											name="user"
										/>
										<FormErrorMessage>
											{errors.user ? (errors.user.message as unknown as string) : null}
										</FormErrorMessage>
									</FormControl>
									<FormControl isInvalid={!!errors.password}>
										<FormLabel color="pri.blue.100">{formatMessage({ id: 'pass' })}</FormLabel>
										<Controller
											control={control}
											rules={{
												required: {
													value: true,
													message: formatMessage({ id: 'passPlaceHoder' }),
												},
											}}
											name="password"
											render={({ field: { onChange, onBlur, value } }) => (
												<InputGroup>
													<Input
														placeholder={formatMessage({ id: 'passPlaceHoder' })}
														variant="flushed"
														type={passShow ? 'text' : 'password'}
														onBlur={onBlur}
														onChange={(e) => {
															onChange(e);
															clearLoginErrorText();
														}}
														value={value}
													/>
													<InputRightElement width="4.5rem">
														<IconButton
															aria-label="show password"
															icon={passShow ? <ViewIcon /> : <ViewOffIcon />}
															h="1.75rem"
															size="sm"
															bg="transparent"
															onClick={handlePassShow}
														/>
													</InputRightElement>
												</InputGroup>
											)}
										/>

										<FormErrorMessage>
											{errors.password ? (errors.password.message as unknown as string) : null}
										</FormErrorMessage>
									</FormControl>

									{loginErrorText ? <Box color="pri.red.100">{loginErrorText}</Box> : null}

									<Stack
										mt="10px"
										direction={{
											base: 'column',
											sm: 'row',
										}}
										align={'start'}
										justify={'space-between'}
										css={{
											'&>.chakra-checkbox>.chakra-checkbox__control[data-checked]': {
												background: `${theme.colors.pri['blue.100']}`,
											},
										}}
									>
										<Controller
											control={control}
											name="remberme"
											render={({ field: { onChange, onBlur, value } }) => {
												return (
													<Checkbox isChecked={!!value} onChange={onChange} onBlur={onBlur}>
														{formatMessage({ id: 'rememberMe' })}
													</Checkbox>
												);
											}}
										/>
									</Stack>
								</Box>
							</Box>
							<Box
								position="absolute"
								right="220px"
								top="120px"
								bg="rgba(163, 220, 240, 0.80)"
								w="31px"
								h="31px"
								borderRadius="31px"
							/>
							<Box
								position="absolute"
								right="70px"
								top="120px"
								bg="rgba(163, 220, 240, 0.80)"
								w="71px"
								h="71px"
								borderRadius="71px"
							/>
							<Box
								position="absolute"
								right="0px"
								bottom="120px"
								bg="rgba(139, 201, 247, 1)"
								w="99px"
								h="99px"
								borderRadius="99px"
							/>
						</Stack>
						<Box textAlign="center" mt="80px">
							<Button
								h="17"
								color={'pri.white.100'}
								_hover={{
									bg: 'blue.400',
								}}
								w="374px"
								isLoading={isSubmitting}
								borderRadius="32px"
								type="button"
								bg="linear-gradient(180deg, rgba(38,149,255,0.65) 0%, #95DAF5 100%)"
								//boxShadow=" 0px 3px 20px 1px #8BC9F7, inset 0px 3px 20px 1px #8BC9F7"
								fontSize="2xl"
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSubmit(handleLogin);
									}
								}}
								onClick={handleSubmit(handleLogin)}
								mx="auto"
							>
								{formatMessage({ id: 'login' })}
							</Button>
						</Box>
					</Box>
				</form>
			</Flex>
		</Flex>
	);
}

export default Login;
