'use client';
import enUs from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';
import { localesModal } from '@/models/global';
import { lightTheme } from '@/styles';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { useRecoilValue } from 'recoil';

const Layout = ({ children }: { children: ReactNode }) => {
  const intl = useRecoilValue(localesModal);

  return (
    <IntlProvider locale={'zh'} messages={intl === 'zh' ? zhCN : enUs}>
      <CacheProvider>
        <ChakraProvider theme={lightTheme}>{children}</ChakraProvider>
      </CacheProvider>
    </IntlProvider>
  );
};

export default Layout;
