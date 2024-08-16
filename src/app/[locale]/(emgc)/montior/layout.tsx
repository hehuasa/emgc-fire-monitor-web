'use client';
import WebSocket, { Refs as IWebSocketFun } from '@/components/socket/webSocket';
import { useMount } from 'ahooks';
import { ReactNode, useRef } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const socket = useRef<IWebSocketFun | null>(null);

  useMount(() => {
    socket.current?.initWebSocket();
  });

  return (
    <>
      {children}
      <WebSocket ref={socket} />
    </>
  );
};

export default Layout;
