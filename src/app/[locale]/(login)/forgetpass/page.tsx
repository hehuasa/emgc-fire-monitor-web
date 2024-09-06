'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useMount, useSafeState, useUnmount } from 'ahooks';

import { Form, Input, Button, message } from 'antd';
import React, { useRef, useState } from 'react';

import { request } from '@/utils/request';
import Link from 'next/link';
import LoginTempl from "../_components/LoginTempl";

import { v4 } from 'uuid';
import { checkIfPasswordsMatch, passwordRule } from '@/utils/rule';
import { useRouter } from 'next/navigation';

const { Item: FormItem } = Form;
const Page = () => {
	const t = useTranslations('login');

	const locale = useLocale();
	//短信登录获取二维码倒计时
	const countDownTimer = useRef<NodeJS.Timeout>();

	//倒计时时间
	const [countDownTime, setCountDownTime] = useSafeState(0);

	const router = useRouter();

	const [messageApi, contextHolder] = message.useMessage();
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

	useMount(() => { });
	const [form] = Form.useForm();
	const [step, setStep] = useState<1 | 2>(1);

	const getCode = async () => {
		const phoneNum = form.getFieldValue('phoneNumber');

		if (!phoneNum) {
			messageApi.open({
				type: 'error',
				content: t('typePhoneNum'),
			});
			return;
		}

		if (!phoneNum.match(/^1\d{10}$/)) {
			messageApi.open({
				type: 'error',
				content: t('PhoneNumberFormatError'),
			});
			return;
		}

		const url = `/ms-system/sys_account/getForgetSmsCode?phone=${phoneNum}`;
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
		} else {
			console.info('============res.msg==============', res.msg);

			messageApi.open({
				type: 'error',
				content: res.msg,
			});
		}
	};

	const handleFoget = async (values: {
		phoneNumber: string;
		verifyCode: string;
		password: string;
	}) => {
		const url = `/ms-system/sys_account/forgetPassword`;
		console.info('============values==============', values);
		const { phoneNumber, verifyCode, password } = values;
		const id = v4();

		const pubKeyRes = await request<string>({
			url: `/ms-system/login/getPubKey?id=${id}`,
		});

		if (pubKeyRes && pubKeyRes.code === 200) {
			const Jsencrypt = (await import('jsencrypt')).default;
			const jsencrypt = new Jsencrypt();

			jsencrypt.setPublicKey(pubKeyRes.data);
			const newPassword = jsencrypt.encrypt(password);

			const obj = {
				clientUUid: id,
				phoneNumber,
				verifyCode,
				newPassword,
			};
			const res = await request({
				url,
				options: {
					method: 'post',
					body: JSON.stringify(obj),
				},
			});

			if (res && res.code === 200) {
				messageApi
					.open({
						type: 'success',
						content: res.msg ? res.msg : '修改密码成功',
					})
					.then(() => {
						router.push('/login');
					});
			} else {
				messageApi.open({
					type: 'error',
					content: res.msg ? res.msg : '修改密码失败',
				});
			}
		} else {
			messageApi.open({
				type: 'error',
				content: pubKeyRes.msg ? pubKeyRes.msg : '请求公钥失败',
			});
		}
	};

	useUnmount(() => {
		clearInterval(countDownTimer.current);
	});

	return (
		<LoginTempl>
			<>
				{contextHolder}
				<div className="flex justify-between items-start mb-16">
					<div className="text-[24px] font-bold">{t('forgotPass')}</div>
				</div>
				<Form
					{...formItemLayout}
					form={form}
					variant="filled"
					onFinish={(values: { phoneNumber: string; verifyCode: string; password: string; }) => {
						if (step === 1) {
							setStep(2);
						} else {
							handleFoget(values);
						}
					}}
					style={{ maxWidth: 600 }}
				>
					<FormItem
						name="phoneNumber"
						rules={[
							{ required: true, message: t('typePhoneNum') },
							{
								pattern: /^1\d{10}$/,
								message: t('PhoneNumberFormatError'),
							},
						]}
					>
						<Input placeholder={t('typePhoneNum')} />
					</FormItem>

					<FormItem
						name="verifyCode"
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
									className="absolute cursor-pointer  right-2 top-1/2 -translate-y-1/2 text-[#3377FF] hover:text-[#6F9FFF]"
									onClick={getCode}
								>
									{t('getVerificationCode')}
								</div>
							)}
						</div>
					</FormItem>

					{step === 2 && (
						<>
							<FormItem
								name="password"
								rules={[
									{ required: true, message: t('typePass') },
									{
										pattern: passwordRule.pattern,
										message: t('password-check-tip'),
									},
								]}
							>
								<Input.Password type="password" className="mt-4" placeholder={t('typePass')} />
							</FormItem>

							<FormItem
								name="comfirmPassword"
								rules={[
									{ required: true, message: t('inconsistentPass') },
									{
										validator: (role, value) =>
											checkIfPasswordsMatch(value, form, t('inconsistentPass'), 'password'),
									},
								]}
							>
								<Input.Password
									type="password"
									className="mt-4"
									placeholder={t('enterPpasswordAgain')}
								/>
							</FormItem>
						</>
					)}

					<FormItem wrapperCol={{ offset: 0, span: 24 }}>
						<Button type="primary" className="w-full" htmlType="submit">
							{step === 1 ? t('nextStep') : t('submit')}
						</Button>
					</FormItem>
				</Form>

				<div className="mt-16 flex w-full justify-center">
					<Link className="ml-2 text-[#3377FF] hover:text-[#6F9FFF]" href={'/' + locale + '/login'}>
						{t('loginNow')}
					</Link>
				</div>
			</>
		</LoginTempl>
	);
};

export default Page;
