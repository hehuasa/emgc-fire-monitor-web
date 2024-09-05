'use client';
import WebSocket, { Refs as IWebSocketFun } from '@/components/socket/webSocket';
import { lightTheme } from '@/styles';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { useMount } from 'ahooks';
import { ReactNode, useRef } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const socket = useRef<IWebSocketFun | null>(null);

  useMount(() => {
    socket.current?.initWebSocket();
  });

  return (
    <>
      <CacheProvider>
        <ChakraProvider theme={lightTheme}>      {children}
          <WebSocket ref={socket} /></ChakraProvider>
      </CacheProvider>

    </>
  );
};

export default Layout;
