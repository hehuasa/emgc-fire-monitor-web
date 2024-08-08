'use client';
import { Box } from '@chakra-ui/react';
import { useLocalStorageState } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import { IUserInfo } from './login/page';

const Page = () => {
  const router = useRouter();

  const [currentUserInfo] = useLocalStorageState<null | IUserInfo>('currentUserInfo_cx_alarm');

  useEffect(() => {
    console.log('初始化');
  }, []);

  useLayoutEffect(() => {
    if (currentUserInfo && currentUserInfo.userId) {
      console.info('============currentUserInfo==============', currentUserInfo);
      router.push('/emgc/montior/operation');
    } else {
      if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'yb') {
        router.push('/singleLogin');
      } else {
        router.push('/login');
      }
    }
  }, []);

  return <Box m="20"></Box>;
};

export default Page;
