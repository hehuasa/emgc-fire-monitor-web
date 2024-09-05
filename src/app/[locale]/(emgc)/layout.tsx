'use client';
// import Image from 'next/image';
import { useLocalStorageState, useUnmount } from 'ahooks';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Header from '@/components/Header/Header';
// import NoAuth from './NoAuth';


const version = '0.28';

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const updateTokernTimer = useRef<NodeJS.Timeout>();



  // 路由权限判断
  const [localRouteUrls, setLocalRouteUrls] = useLocalStorageState<null | Array<string>>(
    'SystemSignRouteUrls'
  );
  const [authRoute, setAuthRoute] = useState(true);

  useEffect(() => {
    console.log('监测预警localRouteUrls', localRouteUrls);
    if (pathname && localRouteUrls) {
      const hasAuth = localRouteUrls.includes(pathname);
      setAuthRoute(hasAuth);
      if (pathname.includes('personalCenter')) {
        setAuthRoute(true);
      }
    }
  }, [pathname]);

  // 取消更新token
  const delToken = () => {
    if (updateTokernTimer.current) {
      clearInterval(updateTokernTimer.current);
      updateTokernTimer.current = undefined;
    }
  };

  useUnmount(() => {
    delToken();
  });

  return (
    <>

      <div className="h-full overflow-hidden">
        <div className="flex h-full flex-col">
          <Header />

          <div className="relative flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
