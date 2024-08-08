'use client';
import { ChakraProvider } from '@chakra-ui/react';

import Script from 'next/script';
import { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';

import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';
import { localesModal } from '@/models/global';
import { lightTheme } from '@/styles';
import { CacheProvider } from '@chakra-ui/next-js';
import { IntlProvider } from 'react-intl';

const Layout = ({ children }: { children: ReactNode }) => {
  const locales = useRecoilValue(localesModal);

  return (
    <>
      {/* <Script
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/wenet/js/recorder/recorder-core.js`}
      />
      <Script
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/wenet/js/recorder/extensions/lib.fft.js`}
      />
      <Script
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/wenet/js/recorder/engine/pcm.js`}
      ></Script>
      <Script
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/wenet/js/SoundRecognizer.js`}
      ></Script>
      <Script
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/webrtclib/srsSdk.js`}
      /> */}
      <Script
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/nodeMedia/NodePlayer-simd.min.js`}
      />

      <IntlProvider locale={locales} messages={locales === 'zh' ? zhCN : enUS}>
        <CacheProvider>
          <ChakraProvider theme={lightTheme}>{children}</ChakraProvider>
        </CacheProvider>
      </IntlProvider>
    </>
  );
};

export default Layout;
