// import theme from '@/styles/index';
import './app.css'

import { Providers } from './provider';


export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <Providers>{children}</Providers>

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
