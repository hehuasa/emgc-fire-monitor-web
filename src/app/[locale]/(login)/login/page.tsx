'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useLocalStorageState, useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';

import { Form, Input, Button, Tabs, message, Checkbox, Image as AntdIamge } from 'antd';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import login_QR_code from '@/assets/login/login_QR_code.png';
import platform_back from '@/assets/login/platform_back.png';
import face from '@/assets/login/face.png';
import wechat from '@/assets/login/wechat.png';
import { request } from '@/utils/request';
import { IUserRes } from '@/models/user';
import Link from 'next/link';
import LoginTempl from '@/components/LoginTempl';
import { formatUserInfo, hasCameraAccess, privateKey, publicKey } from '@/utils/util';

import JSEncrypt from 'jsencrypt';
import { ILoginCodeImg, IogingType } from './type';
import { v4 } from 'uuid';
import PlatformScan from '../_components/platformScan';
import FaceWeb from '@/components/FaceApi/web';
import { useRouter } from 'next/navigation';

const { Item: FormItem } = Form;

const Login = () => {
	const [faceVisible, setFaceVisible] = useSafeState(false);

	//登录方式
	const [loginType, setLoginType] = useSafeState<IogingType>('normal');
	const [loading, setLoading] = useSafeState(false);
	const t = useTranslations('login');
	const locale = useLocale();
	//验证码图片
	const [verifyImg, setVerifyImg] = useSafeState('');

	//图片验证码
	const captchaKey = useRef('');

	//短信登录获取二维码倒计时
	const countDownTimer = useRef<NodeJS.Timeout>();

	//倒计时时间
	const [countDownTime, setCountDownTime] = useSafeState(0);

	const [rememberme, setRemberme] = useLocalStorageState('rememberme', { defaultValue: false });

	const [showRemberMeCheckBox, setShowRemberMeCheckBox] = useState(false);
	const [userAndPassword, setUserAndPassword] = useLocalStorageState('userAndPassword', {
		defaultValue: '',
	});
	const jsencryptRef = useRef<JSEncrypt | null>(null);
	const [activeKey, setActiveKey] = useState('1');

	const router = useRouter();
	const [_, setUserInfo] = useLocalStorageState<null | IUserRes>('userInfo', {
		defaultValue: null,
	});

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 6 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 24 },
		},
	};
	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm();

	useMount(async () => {
		localStorage.removeItem('projectId'); //清除项目信息
		setShowRemberMeCheckBox(true);
		const Jsencrypt = (await import('jsencrypt')).default;
		jsencryptRef.current = new Jsencrypt();

		jsencryptRef.current.setPublicKey(publicKey);
		jsencryptRef.current.setPrivateKey(privateKey);

		try {
			if (rememberme && userAndPassword) {
				const userAndPassword_ = decrypt(userAndPassword);
				const { user, password } = JSON.parse(userAndPassword_) as unknown as {
					user: string;
					password: string;
				};

				form.setFieldValue('password', password);
				form.setFieldValue('user', user);
			}
		} catch (e) {
			//
		}

		getCodeImg();
	});

	const encrypt = (val: string) => {
		const newVal = jsencryptRef.current?.encrypt(val) as string;
		return newVal;
	};
	const decrypt = (val: string) => {
		const newVal = jsencryptRef.current?.decrypt(val) as string;
		return newVal;
	};

	//获取验证码
	const getCode = async () => {
		const mobile = form.getFieldValue('mobile');

		if (!mobile) {
			messageApi.open({
				type: 'error',
				content: t('typePhoneNum'),
			});
			return;
		}

		if (!mobile.match(/^1\d{10}$/)) {
			messageApi.open({
				type: 'error',
				content: t('PhoneNumberFormatError'),
			});
			return;
		}

		const url = `/ms-system/login/sendMobileVerifyCode?mobile=${mobile}`;
		const res = await request<string>({ url });
		console.info('============res==============', res);
		if (res.code && res.code === 200) {
			countDownTimer.current = setInterval(() => {
				setCountDownTime((e) => {
					if (e === 0) {
						clearInterval(countDownTimer.current);
						return 0;
					}
					return e - 1;
				});
			}, 1000);

			setCountDownTime(60);

			form.setFieldValue('reqKey', res.data);
		} else {
			messageApi.open({
				type: 'error',
				content: res.msg,
			});
		}
	};

	//获取验证码图片
	const getCodeImg = useMemoizedFn(async () => {
		const { data, code } = await request<ILoginCodeImg>({
			url: '/ms-system/login/verify',
			options: {
				method: 'post',
			},
		});
		if (code === 200) {
			setVerifyImg(data.captchaImg);
			captchaKey.current = data.captchaKey;
		}
	});

	const loginItms = [
		{
			key: '1',
			label: t('loginWhthPassword'),
			children: (
				<>
					<FormItem name="user" rules={[{ required: true, message: t('typeAccount') }]}>
						<Input placeholder={t('typeAccount')} />
					</FormItem>
					<FormItem name="password" rules={[{ required: true, message: t('typePass') }]}>
						<Input.Password type="password" placeholder={t('typePass')} />
					</FormItem>

					<div className="flex">
						<div className="flex-1 mr-2">
							<FormItem
								name="verfiyCode"
								rules={[{ required: true, message: t('typeVerificationCode') }]}
								style={{
									marginBottom: 0,
								}}
							>
								<Input placeholder={t('typeVerificationCode')} />
							</FormItem>
						</div>
						<div className=" flex items-center">
							{verifyImg ? (
								<>
									<AntdIamge
										alt=""
										src={verifyImg}
										fallback="data:image/png;base64,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"
									/>
									<span
										className="text-blue-600 cursor-pointer underline ml-2"
										onClick={getCodeImg}
									>
										{t('changeOne')}
									</span>
								</>
							) : null}
						</div>
					</div>
				</>
			),
		},
		{
			key: '2',
			label: t('text'),
			children: (
				<>
					<FormItem name="reqKey" className="opacity-0 absolute -z-10">
						<Input placeholder={'reqKey'} />
					</FormItem>
					<FormItem
						name="mobile"
						rules={[
							{
								required: true,
								message: t('typePhoneNum'),
							},
							{
								pattern: /^1\d{10}$/,
								message: t('PhoneNumberFormatError'),
							},
						]}
					>
						<Input placeholder={t('typePhoneNum')} />
					</FormItem>
					<FormItem
						name="verfiyCode"
						rules={[{ required: true, message: t('typeVerificationCode') }]}
					>
						<div className="relative">
							<Input className="relative top-0 left-0" placeholder={t('typeVerificationCode')} />

							{countDownTime > 0 ? (
								<div className="absolute cursor-pointer  right-2 top-1/2 -translate-y-1/2 text-[#3377FF] hover:text-[#6F9FFF]">
									{countDownTime}s
								</div>
							) : (
								<div
									className=" absolute cursor-pointer  right-2 top-1/2 -translate-y-1/2 text-[#3377FF] hover:text-[#6F9FFF]"
									onClick={getCode}
								>
									{t('getVerificationCode')}
								</div>
							)}
						</div>
					</FormItem>
				</>
			),
		},
	];

	const handlelogin = async ({
		user,
		password,
		verfiyCode,
		reqKey,
		mobile,
	}: {
		user: string;
		password: string;
		verfiyCode: string;
		reqKey: string;
		mobile: string;
	}) => {
		setLoading(true);
		try {
			if (activeKey === '1') {
				if (rememberme) {
					const userAndPassword = encrypt(JSON.stringify({ user, password }));
					setUserAndPassword(userAndPassword);
				}

				const id = v4();

				const pubKeyRes = await request<string>({
					url: `/ms-system/login/getPubKey?id=${id}`,
					options: {
						dataReturnConfig: {
							showErrorTip: true,
							onlyReturnSuccess: true,
						},
					},
				});

				const Jsencrypt = (await import('jsencrypt')).default;
				const jsencrypt = new Jsencrypt();

				jsencrypt.setPublicKey(pubKeyRes.data);
				const password_ = jsencrypt.encrypt(password);

				const loginRes = await request<{
					loginUser: IUserRes;
					success: boolean;
					errMsg: string;
					errCode: string;
				}>({
					url: `/ms-system/login/login_with_verify`,
					options: {
						headers: {
							'content-type': 'application/json;charset=utf-8',
						},
						method: 'POST',
						body: JSON.stringify({
							captchaKey: captchaKey.current,
							clientUUid: id,
							login: user,
							password: password_,
							verifyCode: verfiyCode,
						}),
					},
				});

				if (loginRes && loginRes.code === 200) {
					if (loginRes.data.success) {
						const newInfo = formatUserInfo(loginRes.data.loginUser);
						setUserInfo(newInfo);
						//设置租户ID
						localStorage.setItem('tenant_id', loginRes.data.loginUser.tenantId);
						router.push('/homepage');
					} else {
						messageApi.open({
							type: 'error',
							content: loginRes.data.errMsg,
						});
					}
				} else {
					getCodeImg();
					messageApi.error(loginRes.msg);
				}
			} else {
				const url = `/ms-system/login/mobileVerifyLogin`;
				const res = await request<{
					loginUser: IUserRes;
					success: boolean;
					errMsg: string;
					errCode: string;
				}>({
					url,
					options: {
						method: 'post',
						body: JSON.stringify({ verfiyCode, reqKey, mobile }),
					},
				});

				if (res.code === 200) {
					if (res.data.success) {
						const newInfo = formatUserInfo(res.data.loginUser);
						setUserInfo(newInfo);
						router.push('/homepage');
					} else {
						messageApi.open({
							type: 'error',
							content: res.data.errMsg,
						});
					}
				} else {
					messageApi.open({
						type: 'error',
						content: res.msg,
					});
				}
			}
		} catch (e) {
			//
		}
		setLoading(false);
	};

	const handleRemberMe = () => {
		setRemberme(!rememberme);
	};

	useUnmount(() => {
		clearInterval(countDownTimer.current);
	});

	const changeLoginType = useMemoizedFn(() => {
		if (loginType === 'normal') {
			setLoginType('platformSacn');
		} else {
			setLoginType('normal');
		}
	});

	return (
		<>
			<LoginTempl>
				<>
					{contextHolder}
					<div className="flex justify-between items-start">
						<div className="text-[24px] font-bold">{t('welcomeLogin')}</div>
						<div
							className="cursor-pointer w-[57px] h-[57px]"
							title={t('login_QR_code')}
							onClick={changeLoginType}
						>
							<Image
								src={loginType === 'normal' ? login_QR_code : platform_back}
								width={57}
								height={57}
								alt={t('login_QR_code')}
							/>
						</div>
					</div>
					{loginType === 'normal' ? (
						<>
							<Form
								onFinish={handlelogin}
								form={form}
								{...formItemLayout}
								variant="filled"
								style={{ maxWidth: 600 }}
							>
								<Tabs
									defaultActiveKey="1"
									destroyInactiveTabPane
									items={loginItms}
									onChange={(activeKey) => {
										setShowRemberMeCheckBox(activeKey === '1');
										setActiveKey(activeKey);
									}}
								/>

								<FormItem wrapperCol={{ offset: 0, span: 24 }}>
									<Button
										type="primary"
										className="w-full mt-4 h-12"
										htmlType="submit"
										loading={loading}
									>
										{t('login')}
									</Button>
								</FormItem>
							</Form>
							<div className="flex justify-between">
								<div>
									{showRemberMeCheckBox && (
										<Checkbox checked={rememberme} onChange={handleRemberMe}>
											{t('rememberme')}
										</Checkbox>
									)}
								</div>

								<div className="flex text-[#6E788E]">
									<Link href={'/' + locale + '/forgetpass'}>{t('forgotPass')}</Link>
									<div className="mx-2">|</div>
									<Link href={'/' + locale + '/register'}>{t('register')}</Link>
								</div>
							</div>

							<div className=" w-full text-center mt-14 text-[#6E788E]">{t('otherLoginWays')}</div>
						</>
					) : (
						<PlatformScan />
					)}

					<div className="flex justify-center mt-5">
						<Link
							href={'/' + locale + '/register'}
							title={t('loginWhthWechat')}
							className="p-3.5 bg-[#F1F4F6] rounded-lg mr-5"
						>
							<Image src={wechat} width={24} height={20} alt={t('loginWhthWechat')} />
						</Link>

						<div
							className=" p-3.5 bg-[#F1F4F6] rounded-lg ml-5 cursor-pointer"
							onClick={async () => {
								try {
									await hasCameraAccess();
									setFaceVisible(true);
								} catch (e) {
									messageApi.error(t('failed-to-obtain-permission'));
								}
							}}
						>
							<Image src={face} width={21} height={21} alt={t('loginWhthFace')} />
						</div>
					</div>
				</>
			</LoginTempl>

			{/* 人脸识别 */}
			<FaceWeb
				open={faceVisible}
				closeModal={() => setFaceVisible(false)}
				title="人脸登录"
				checkType={0}
			/>
		</>
	);
};

export default Login;
