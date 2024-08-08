// import theme from '@/styles/index';

import 'amis/lib/themes/cxd.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Providers } from './provider';
// import Script from 'next/script';
// import { lightTheme } from '@/styles';

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        {/* <Script strategy="lazyOnload" src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/wenet/js/recorder/recorder-core.js`} />
        <Script strategy="lazyOnload" src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/wenet/js/recorder/extensions/lib.fft.js`} />
        <Script strategy="lazyOnload" src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/wenet/js/recorder/engine/pcm.js`}></Script>
        <Script strategy="lazyOnload" src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/wenet/js/SoundRecognizer.js`}></Script>
        <Script strategy="lazyOnload" src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/webrtclib/srsSdk.js`} />
        <Script strategy="lazyOnload" src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/nodeMedia/NodePlayer-simd.min.js`} /> */}
      </head>
      <body>
        <Providers>{children}</Providers>
        {/* <ColorModeScript initialColorMode={lightTheme.config.initialColorMode} />
        <RecoilRoot>
          <App>{children}</App>
        </RecoilRoot> */}
      </body>
    </html>
  );
}

export const metadata = {
  title: process.env.NEXT_PUBLIC_ANALYTICS_SYSTEM_NAME,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
//这里可以切换主题
// const App = ({ children }: { children: JSX.Element }) => {
//   return (
//     <IntlProvider locale={'zh'} messages={zhCN}>
//       <ChakraProvider theme={lightTheme}>{children}</ChakraProvider>
//     </IntlProvider>
//   );
// };
