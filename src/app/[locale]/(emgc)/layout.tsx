'use client';
import { IMenuItem } from '@/models/user';
// import Image from 'next/image';
import { IUserInfo } from '@/models/user';
import { useLocalStorageState, useUnmount } from 'ahooks';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Header from '@/components/Header/Header';
// import NoAuth from './NoAuth';

const genParentName = (menu: IMenuItem) => {
  if (menu.children) {
    for (const item of menu.children) {
      //item.url = item.url.includes('/emgc') ? item.url : '/emgc' + item.url;
      item.parentNames = menu.parentNames
        ? [...menu.parentNames, { name: item.functionName, url: item.url }]
        : [
            { name: menu.functionName, url: menu.url },
            { name: item.functionName, url: item.url },
          ];
      genParentName(item);
    }
  }
};

const version = '0.28';

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [currentUserInfo, _] = useLocalStorageState<null | IUserInfo>('emgc_web_currentUserInfo');

  const updateTokernTimer = useRef<NodeJS.Timeout>();

  // 获取到权限后，再加载下级====因为演示，临时取消权限判断
  const [authLoad, setAuthLoad] = useState(true);

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
      <audio
        preload="auto"
        id="alarmAudio"
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/audios/alarm0425.mp3`}
      />
      <audio
        preload="auto"
        id="earthquakeAudio"
        loop
        muted
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/audios/earthquake.mp3`}
      />
      <div className="h-full overflow-hidden">
        <div className="flex h-full flex-col">
          <Header />

          <div className="relative flex-1 overflow-hidden">{authLoad && children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
