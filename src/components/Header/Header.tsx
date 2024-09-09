'use client';
// ----------
// import Indices from '@/assets/system/indices.png';
// import result from '@/assets/system/result.png';
// import Spi from '@/assets/system/SPI.png';
//-----------
// import PhoneBookComponent from '@/components/PhoneBook';
import RealTime from '@/components/RealTime';
import { isSpaceQueryingModel } from '@/models/map';
import { searchParamModel, searchResModel } from '@/models/resource';
import { IUserInfo, menuModel } from '@/models/user';
import { request } from '@/utils/request';
import { flagMenuFn } from '@/utils/util';
// import { WarningTwoIcon } from '@chakra-ui/icons';

import config from '@/assets/header/config.png';
import user from '@/assets/header/user.png';

import { useLocalStorageState, useMount, useUnmount } from 'ahooks';
import type { JSEncrypt } from 'jsencrypt';
import { useLocale, useTranslations } from 'next-intl';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
// import UploadBtn from '../Upload/uploadBtn';
import NavLink from './NavLink';

import Image from 'next/image';
import SwitchLanguage from '../SwitchLanguage';

const Header = () => {
  const locale = useLocale();

  const setSearchRes = useSetRecoilState(searchResModel);
  const setSearchParam = useSetRecoilState(searchParamModel);

  const setIsSpaceQuerying = useSetRecoilState(isSpaceQueryingModel);
  const formatMessage = useTranslations('base');
  const [currentUserInfo] = useLocalStorageState<null | IUserInfo>('emgc_web_currentUserInfo');

  const timer = useRef<NodeJS.Timeout | null>(null); // api数据数据请求定时器

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  });

  const router = useRouter();

  const jsencryptRef = useRef<JSEncrypt | null>(null);
  const links = useRecoilValue(menuModel)
    .filter((val) => !val.hidden)
    .sort((prev, next) => {
      return prev.sortIndex - next.sortIndex;
    });

  const flagMenu = flagMenuFn(links);

  const loginOut = async () => {
    router.replace('/login');

    request({ url: '/ms-gateway/ms-login/user/logout', options: { method: 'post' } });
    localStorage.setItem(
      process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
        ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_clientType`
        : 'clientType',
      ''
    );
    setSearchRes([]);
    setSearchParam(JSON.stringify({}));
    setIsSpaceQuerying(false);
  };

  useMount(async () => {});

  const encrypt = (val: string) => {
    const newVal = jsencryptRef.current?.encrypt(val) as string;
    return newVal;
  };
  const decrypt = (val: string) => {
    const newVal = jsencryptRef.current?.decrypt(val) as string;
    return newVal;
  };

  return (
    <>
      <div className="z-50 px-5 text-white shadow-md bg-[#0078EC]">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center">
            {/* <Image src={logo} alt="login" width="30" height="24" /> */}

            <div className="text-xl font-bold ml-2 text-white">{formatMessage('sysName')}</div>
          </div>
          <div className="flex">
            <div>
              <NavLink links={links} flagMenu={flagMenu} />
            </div>
          </div>
          <div className="flex items-center gap-x-4 ">
            <RealTime />
            <SwitchLanguage className="w-6 h-6 text-white" />
            <Image className="w-6 h-6 text-white" src={config} alt="config" />
            <Image className="w-6 h-6 text-white" src={user} alt="user" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
