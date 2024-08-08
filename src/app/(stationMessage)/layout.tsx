'use client';
import { ChakraProvider } from '@chakra-ui/react';

import React, { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

import { CacheProvider } from '@chakra-ui/next-js';
import { lightTheme } from '@/styles';
import { IntlProvider } from 'react-intl';
import zhCN from '@/locales/zh-CN';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <RecoilRoot>
        <IntlProvider locale={'zh'} messages={zhCN}>
          <CacheProvider>
            <ChakraProvider theme={lightTheme}>{children}</ChakraProvider>
          </CacheProvider>
        </IntlProvider>
      </RecoilRoot>
    </>
  );
};

export default Layout;
