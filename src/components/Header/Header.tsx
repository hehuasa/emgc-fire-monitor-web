'use client';
// ----------
// import Indices from '@/assets/system/indices.png';
// import result from '@/assets/system/result.png';
// import Spi from '@/assets/system/SPI.png';
//-----------
// import PhoneBookComponent from '@/components/PhoneBook';
import RealTime from '@/components/RealTime';
import { showAlarmToastModel } from '@/models/alarm';
import { notReadNumberModel } from '@/models/global';
import { isSpaceQueryingModel } from '@/models/map';
import { searchParamModel, searchResModel } from '@/models/resource';
import { IUserInfo, menuModel } from '@/models/user';
import { request } from '@/utils/request';
import { downFileByUrl, flagMenuFn } from '@/utils/util';
// import { WarningTwoIcon } from '@chakra-ui/icons';

import config from '@/assets/header/config.png';
import user from '@/assets/header/user.png';
import {
  // Box,
  // Button,
  // Center,
  // Flex,
  // HStack,
  // Input,
  // Modal,
  // ModalBody,
  // ModalCloseButton,
  // ModalContent,
  // ModalFooter,
  // ModalHeader,
  // ModalOverlay,
  // Stack,
  // Text,
  useDisclosure,
  useNumberInput,
  // VStack,
} from '@chakra-ui/react';
import { useLocalStorageState, useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import type { JSEncrypt } from 'jsencrypt';
import { useLocale, useTranslations } from 'next-intl';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parse, stringify } from 'qs';
import { useRef, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
// import UploadBtn from '../Upload/uploadBtn';
import NavLink from './NavLink';

import { MenuProps } from 'antd';
import Image from 'next/image';
import SwitchLanguage from '../SwitchLanguage';

const Header = () => {
  const locale = useLocale();

  const setSearchRes = useSetRecoilState(searchResModel);
  const setSearchParam = useSetRecoilState(searchParamModel);

  const setIsSpaceQuerying = useSetRecoilState(isSpaceQueryingModel);
  const [showAlarmToast, setShowAlarmToast] = useRecoilState(showAlarmToastModel);
  const formatMessage = useTranslations('base');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUserInfo] = useLocalStorageState<null | IUserInfo>('emgc_web_currentUserInfo');

  const {
    isOpen: isOpenPhoneBook,
    onOpen: onOpenPhoneBook,
    onClose: onClosePhoenBook,
  } = useDisclosure();

  const { isOpen: openPic, onOpen: onOpenPic, onClose: onClosePic } = useDisclosure();
  const { isOpen: openSpi, onOpen: onOpenSpi, onClose: onCloseSpi } = useDisclosure();
  const {
    isOpen: isOpenEvlation,
    onOpen: onOpenEvlation,
    onClose: oncloseEvlation,
  } = useDisclosure();

  const timer = useRef<NodeJS.Timeout | null>(null); // api数据数据请求定时器
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnText, setBtnText] = useState('上传安全评估体系');
  const [isShowPic, setIshowPic] = useState(false);

  const { getInputProps } = useNumberInput({
    min: 1,
  });

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  });

  const router = useRouter();
  const [modalOpen, setModalOpen] = useSafeState(false);
  const jsencryptRef = useRef<JSEncrypt | null>(null);
  const links = useRecoilValue(menuModel)
    .filter((val) => !val.hidden)
    .sort((prev, next) => {
      return prev.sortIndex - next.sortIndex;
    });

  const flagMenu = flagMenuFn(links);
  const [notReadNumber, setNotReadNumber] = useRecoilState(notReadNumberModel);

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

  const handleCancel = useMemoizedFn(() => {
    setModalOpen(false);
  });

  const logOut = useMemoizedFn(async () => {
    setModalOpen(true);
  });

  const handleRouter = useMemoizedFn(() => {
    if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx') {
      router.push('/emgc/personalCenter');
    }
  });

  const openVideoClient = useMemoizedFn(async () => {
    try {
      const userLoginInfo = localStorage.getItem('user');
      if (userLoginInfo) {
        const userAndPassword = decrypt(userLoginInfo);
        const { user, password, remberme } = parse(userAndPassword) as unknown as {
          user: string;
          password: string;
          remberme: string;
        };
        const str = stringify({ user, password });
        window.open(`${process.env.NEXT_PUBLIC_ANALYTICS_videoClientUrl}/login?${encrypt(str)}`);
        // window.open(`http://172.30.7.31:3200/login?${encrypt(str)}`);
      }
    } catch (e) {
      //
    }
  });

  const openMessages = useMemoizedFn(() => {
    // 站内信
    router.push('/stationMessage');
  });

  useMount(async () => {


  });

  const encrypt = (val: string) => {
    const newVal = jsencryptRef.current?.encrypt(val) as string;
    return newVal;
  };
  const decrypt = (val: string) => {
    const newVal = jsencryptRef.current?.decrypt(val) as string;
    return newVal;
  };


  //-------------------------
  const uploadCallBack = useMemoizedFn(async (e: File) => {
    setBtnLoading(true);
    // const formData = new FormData();
    // formData.append('file', e);
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(e);
    fileReader.onloadend = (ev) => {
      console.log('ev', ev.target?.result);
      setBtnText('计算中');
      const timer = setTimeout(() => {
        setBtnLoading(false);
        setBtnText('上传安全评估体系');
        clearTimeout(timer);
        const url = `${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/test/evaluation.csv`;
        downFileByUrl(url)
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            oncloseEvlation();
          });
      }, 2000);
    };
  });

  const handleCalc = useMemoizedFn(() => {
    const timer = setTimeout(() => {
      setIshowPic(true);
      clearTimeout(timer);
    }, 1500);
  });

  const items: MenuProps['items'] = [
    // {
    //   key: '1',
    //   label: (
    //     <LocaleLink href={'/emgc/personalCenter'} className="flex items-center">
    //       <AiOutlineUser className="mr-2" />
    //       {formatMessage('personalInfo')}
    //     </LocaleLink>
    //   ),
    // },
    {
      key: '2',
      label: (
        <span onClick={logOut} className="flex items-center gap-1 text-base">
          <AiOutlineLogout className="mr-2" />
          {formatMessage('logout')}
        </span>
      ),
    },
  ];
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
