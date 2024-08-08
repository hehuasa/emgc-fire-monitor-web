'use client';
import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';
import { localesModal } from '@/models/global';
import { lightTheme } from '@/styles';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { useRecoilValue } from 'recoil';
dynamic(() => import('./systemsManage/area/modal'), { ssr: false });

const Layout = ({ children }: { children: ReactNode }) => {
  const locales = useRecoilValue(localesModal);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/nodeMedia/NodePlayer-simd.min.js`}
      />
      <IntlProvider locale={'zh'} messages={locales === 'zh' ? zhCN : enUS}>
        <CacheProvider>
          <ChakraProvider theme={lightTheme}>{children}</ChakraProvider>
        </CacheProvider>
      </IntlProvider>
    </>
  );
};

export default Layout;
