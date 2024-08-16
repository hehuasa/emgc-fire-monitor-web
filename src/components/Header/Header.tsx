'use client';
import logo from '@/assets/login/logo.png';
// ----------
import Indices from '@/assets/system/indices.png';
import result from '@/assets/system/result.png';
import Spi from '@/assets/system/SPI.png';
//-----------
import PhoneBookComponent from '@/components/PhoneBook';
import RealTime from '@/components/RealTime';
import { showAlarmToastModel } from '@/models/alarm';
import { notReadNumberModel } from '@/models/global';
import { isSpaceQueryingModel } from '@/models/map';
import { searchParamModel, searchResModel } from '@/models/resource';
import { IUserInfo, menuModel } from '@/models/user';
import { request } from '@/utils/request';
import { downFileByUrl, flagMenuFn, privateKey, publicKey } from '@/utils/util';
import {
  WarningTwoIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useNumberInput,
  VStack,
} from '@chakra-ui/react';
import { useLocalStorageState, useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import type { JSEncrypt } from 'jsencrypt';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parse, stringify } from 'qs';
import { useRef, useState } from 'react';
import { AiFillBell, AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { FaCircleUser } from 'react-icons/fa6';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import UploadBtn from '../Upload/uploadBtn';
import NavLink from './NavLink';
import { useLocale, useTranslations } from 'next-intl';

import { Badge, Dropdown, MenuProps } from 'antd';
import LocaleLink from '../LocaleLink';

const Header = () => {

  const locale = useLocale();

  const setSearchRes = useSetRecoilState(searchResModel);
  const setSearchParam = useSetRecoilState(searchParamModel);

  const setIsSpaceQuerying = useSetRecoilState(isSpaceQueryingModel);
  const [showAlarmToast, setShowAlarmToast] = useRecoilState(showAlarmToastModel);
  const formatMessage = useTranslations("base");
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

  const timer = useRef<NodeJS.Timer | null>(null); // api数据数据请求定时器
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
    const Jsencrypt = (await import('jsencrypt')).default;
    jsencryptRef.current = new Jsencrypt();

    jsencryptRef.current.setPublicKey(publicKey);
    jsencryptRef.current.setPrivateKey(privateKey);

    getUnRead();
  });

  const encrypt = (val: string) => {
    const newVal = jsencryptRef.current?.encrypt(val) as string;
    return newVal;
  };
  const decrypt = (val: string) => {
    const newVal = jsencryptRef.current?.decrypt(val) as string;
    return newVal;
  };

  // 获取未读消息数量
  const getUnRead = useMemoizedFn(async () => {
    const { code, data } = await request<number>({
      url: `/ms-gateway/ms-system/sys/message/query_no_read_count`,
    });
    if (code === 200) {
      setNotReadNumber(data);
    }
  });

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
    {
      key: '1',
      label: (
        <LocaleLink href={'/emgc/personalCenter'} className='flex items-center'>
          <AiOutlineUser className='mr-2' />
          {formatMessage('personalInfo')}
        </LocaleLink>

      ),
    },
    {
      key: '2',
      label: (
        <span
          onClick={logOut}
          className="flex items-center gap-1 text-base"
        >
          <AiOutlineLogout className='mr-2' />
          {formatMessage('loginOut')}
        </span>
      ),
    },
  ];
  return (
    <>
      <div className='z-50 px-5 text-white shadow-md bg-blue-600' >
        <div className='h-16 flex items-center justify-between' >


          <div className='flex items-center'>
            <Image src={logo} alt="login" width="30" height="24" />

            <div className='text-xl font-bold ml-2 text-white'>
              {formatMessage('sysName')}
            </div>
          </div>
          <div className='flex'>
            <div>

              <NavLink links={links} flagMenu={flagMenu} />
            </div>

          </div>
          <div className='flex items-center'>


            <div className='mr-4 '>
              <LocaleLink href={'/stationMessage'} className='flex items-center'>
                <Badge count={5}>
                  <AiFillBell className='w-6 h-6 text-white' />
                </Badge>
              </LocaleLink>
            </div>


            {/* <SwitchLanguage /> */}


            <RealTime />

            <Dropdown menu={{ items }}>
              <div className="ml-5 flex items-center h-full cursor-pointer">
                <div className="mr-2 w-5 h-5 text-[#3377FF]">
                  <FaCircleUser fontSize={20} />
                </div>
                <div>{currentUserInfo?.userName}</div>
              </div>
            </Dropdown>

          </div>
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py="0" textAlign="left" lineHeight="2.75rem" fontSize="lg">
            {formatMessage('logout')}
          </ModalHeader>
          <ModalCloseButton h="11" top="0" lineHeight="2.75rem" />
          <ModalBody color="font.100" backgroundColor="backs.200" py="5" borderRadius={'md'}>
            <Flex alignItems={'center'}>
              <WarningTwoIcon color={'pri.red.300'} />
              <Text ml={'2'}>{formatMessage('logoutmsg')} ！</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Stack direction={'row'}>
              <Button
                fontWeight="400"
                mr="2.5"
                bg="pri.gray.200"
                color="pri.dark.100"
                borderColor="pri.dark.400"
                borderWidth="1px"
                borderRadius="20px"
                w="20"
                onClick={handleCancel}
              >
                {formatMessage('cancel')}
              </Button>
              <Button
                fontWeight="400"
                ml="2.5"
                bg="pri.blue.100"
                color="pri.white.100"
                borderRadius="20px"
                w="20"
                onClick={loginOut}
              >
                {formatMessage('ok')}
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenPhoneBook} onClose={onClosePhoenBook} size="5xl">
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader bgColor={'pri.gray.100'} borderTopRadius={'10px'}>
            通讯录
          </ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>
            <PhoneBookComponent />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={openPic} onClose={onClosePic} isCentered size={'4xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor={'pri.gray.100'} borderTopRadius={'10px'}>
            报警优化
          </ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>
            <HStack justifyContent={'center'}>
              <HStack>
                <Box>Point1:</Box>
                <VStack>
                  <Box>
                    x: <Input value={'1.00'} w={20}></Input>
                  </Box>
                  <Box>
                    y: <Input value={'0.84'} w={20}></Input>
                  </Box>
                </VStack>
              </HStack>
              <HStack>
                <Box>Point2:</Box>
                <VStack>
                  <Box>
                    x: <Input value={'6.00'} w={20}></Input>
                  </Box>
                  <Box>
                    y: <Input value={'-0.05'} w={20}></Input>
                  </Box>
                </VStack>
              </HStack>
              <HStack>
                <Box>Point3:</Box>
                <VStack>
                  <Box>
                    x: <Input value={'7..00'} w={20}></Input>
                  </Box>
                  <Box>
                    y: <Input value={'0.09'} w={20}></Input>
                  </Box>
                </VStack>
              </HStack>
              <Button onClick={handleCalc}>计算</Button>
            </HStack>
            <Center w={'full'} margin={'auto 0'} textAlign={'center'} minH={'200px'}>
              {isShowPic && (
                <Image
                  loader={() => result.src}
                  src={result}
                  objectFit="cover"
                  alt={'报警优化'}
                ></Image>
              )}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={openSpi} onClose={onCloseSpi} isCentered size={'6xl'} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>
            <VStack>
              <Image
                loader={() => Indices.src}
                src={Indices}
                objectFit="cover"
                alt={'报警预测'}
              ></Image>
              <Image loader={() => Spi.src} src={Spi} objectFit="cover" alt={'报警预测'}></Image>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenEvlation} onClose={oncloseEvlation}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader bgColor={'pri.gray.100'} borderTopRadius={'10px'}>
            安全评估
          </ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>
            <UploadBtn action="" fileSize={14} uploadCallBack={uploadCallBack}>
              <Button bg="pri.blue.100" color="pri.white.100">
                {btnText}
              </Button>
            </UploadBtn>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Header;
