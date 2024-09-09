'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useMount, useSafeState, useUnmount } from 'ahooks';

import { Form, Input, Button, message } from 'antd';
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';

import { request } from '@/utils/request';
import Link from 'next/link';
import LoginTempl from '../_components/LoginTempl';

const { Item: FormItem } = Form;
const Page = () => {
  const t = useTranslations('login');
  const locale = useLocale();

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

  useMount(() => {});
  const [form] = Form.useForm();
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

    const url = `/ms-gateway/ms-system/sys_account/getSmsCode?phone=${phoneNum}`;
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

  const handleRegister = async (values: any) => {
    console.info('============values==============', values);

    const url = `/ms-gateway/ms-system/sys_account/register`;

    const res = await request({
      url,
      options: {
        method: 'post',
        body: JSON.stringify(values),
      },
    });

    console.info('============res==============', res);
    if (res.code === 200) {
      router.push('/login');
    } else {
      messageApi.open({
        type: 'error',
        content: res.msg,
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
          <div className="text-[24px] font-bold">{t('persionRegister')}</div>
        </div>
        <Form
          {...formItemLayout}
          form={form}
          variant="filled"
          onFinish={handleRegister}
          style={{ maxWidth: 600 }}
        >
          <FormItem name="userName" rules={[{ required: true, message: t('typeName') }]}>
            <Input placeholder={t('typeName')} />
          </FormItem>

          <FormItem name="idCardNo" rules={[{ required: true, message: t('typeIDCode') }]}>
            <Input placeholder={t('typeIDCode')} />
          </FormItem>

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

              {countDownTime ? (
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

          <FormItem
            name="temporaryCompany"
            rules={[{ required: true, message: t('typeCompanyName') }]}
          >
            <Input placeholder={t('typeCompanyName')} />
          </FormItem>

          <FormItem wrapperCol={{ offset: 0, span: 24 }}>
            <Button type="primary" className="w-full" htmlType="submit">
              {t('register')}
            </Button>
          </FormItem>
        </Form>

        <div className="mt-16 flex w-full justify-center">
          <div>{t('alreadyHaveAccount')},</div>
          <Link className="ml-2 text-[#3377FF] hover:text-[#6F9FFF]" href={'/' + locale + '/login'}>
            {t('loginNow')}
          </Link>
        </div>
      </>
    </LoginTempl>
  );
};

export default Page;
