'use client';
import { flatMenuModel, IMenuItem, menuModel } from '@/models/user';
import { request } from '@/utils/request';
import { Box, Flex, useToast } from '@chakra-ui/react';
// import Image from 'next/image';
import { IUserInfo } from '@/app/login/page';
import CallNumberContainer, {
  Refs as IphoneSocketFun,
} from '@/components/CallPhone/CreateContainer';
import { Refs as earthquakeType } from '@/components/Earthquake';
import { IOritreeData } from '@/components/Montior/Tree';
import { useMenuAuthor } from '@/customHooks';
import {
  alarmDealTypeModel,
  alarmTypeModel,
  departModal,
  IAlarmDealType,
  IAlarmTypeItem,
} from '@/models/alarm';
import { areaTreeModel, IAreaTreeItem } from '@/models/area';
import { depTreeModal, dictionaryModal, objectType } from '@/models/global';
import { IDepartment } from '@/models/system';
import { useLocalStorageState, useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
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
  const { estimateMenuAuthor } = useMenuAuthor();

  const setMenuModel = useSetRecoilState(menuModel);
  const [flatMenus, setFlatMenuModel] = useRecoilState(flatMenuModel);
  const [alarmType, setAlarmType] = useRecoilState(alarmTypeModel);
  const setAlarmDealType = useSetRecoilState(alarmDealTypeModel);
  const setAreaTree = useSetRecoilState(areaTreeModel);
  const setAllDict = useSetRecoilState(dictionaryModal);
  const [localAllDict, setLocalAllDict] = useLocalStorageState<objectType>('dictionary');
  const pathname = usePathname();
  const [currentUserInfo, _] = useLocalStorageState<null | IUserInfo>('emgc_web_currentUserInfo');
  const setDepartment = useSetRecoilState(departModal);
  const setDepTreeModal = useSetRecoilState(depTreeModal);
  const updateTokernTimer = useRef<NodeJS.Timer>();

  const phoneSocket = useRef<IphoneSocketFun | null>(null);
  const earthquakeSocket = useRef<earthquakeType | null>(null);
  const router = useRouter();
  const toast = useToast();

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

  useMount(() => {
    // 获取菜单
    getDepartment();
    getMenus()
      .then(() => {
        getDict();
        // if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx') {
        //   getAlarmType();
        // } else {
        // }
        getAlarmTypes();

        getAlarmDealTypes();
        updateVeision();
      })
      .finally(() => {
        //console.log('最后获取到菜单emgc');
        console.log('sokcet初始化');

        earthquakeSocket.current?.initSocketFun();
      });
  });

  // 获取全部字典
  const getDict = async () => {
    const { data, code } = await request<objectType>({
      url: `/ms-gateway/cx-alarm/dc_dict/dictionary`,
    });
    if (code === 200) {
      setAllDict(data);
      setLocalAllDict(data);
    }
  };

  // 该账户拥有的 报警类型,所属部门  数据权限
  const getAlarmTypes = () => {
    request<{
      alarmTypes: Array<string>;
      almAlarmTypeVos: Array<IAlarmTypeItem>;
      orgIds: Array<string>;
    }>({
      url: '/ms-gateway/cx-alarm/alm/alarm_auth/now_user_data_auth',
      options: {
        method: 'post',
      },
    }).then((res) => {
      if (res.code === 200) {
        for (const iterator of res.data.almAlarmTypeVos) {
          iterator.isChecked = true;
          iterator.iconColour = iterator.iconColour || 'rgba(236, 12, 12, 1)';
          iterator.iconPlaySpeed = iterator.iconPlaySpeed || 3;
        }

        res.data.almAlarmTypeVos.forEach((item) => (item.isChecked = true));
        setAlarmType(res.data.almAlarmTypeVos);
        if (res.data.almAlarmTypeVos.length === 0) {
          getAlarmType();
        }
        setDepartment(res.data.orgIds);
        setAuthLoad(true);
      }
    });
  };

  // 报警处理类型
  const getAlarmDealTypes = () => {
    request<IAlarmDealType[]>({
      url: '/ms-gateway/cx-alarm/dc_dict/list_item?dictCode=deal_result_view',
    }).then((res) => {
      if (res.code === 200) {
        setAlarmDealType(res.data.sort((a, b) => a.sort - b.sort));
      }
    });
  };

  // 报警类型（全部）
  const getAlarmType = async () => {
    const { code, data } = await request<IAlarmTypeItem[]>({
      url: `/ms-gateway/cx-alarm/alm/alarm/getAlarmType`,
    });
    if (code === 200) {
      for (const item of data) {
        item.isChecked = true;
      }
      setAlarmType(data);
    }
  };

  // 获取区域列表
  const getAreaList = () => {
    request<IAreaTreeItem>({ url: '/ms-gateway/ms-alarm/area/list-tree' }).then((res) => {
      if (res.code === 200) {
        if (!res.data.areaCode) {
          res.data.areaCode = 'parent';
        }
        setAreaTree(res.data);
      }
    });
  };
  // 更新token
  const updateToken = () => {
    if (updateTokernTimer.current) {
      clearInterval(updateTokernTimer.current);
      updateTokernTimer.current = undefined;
    }
    if (updateTokernTimer.current === undefined) {
      updateTokernTimer.current = setInterval(() => {
        request<string>({ url: '/ms-gateway/ms-login/user/token/refresh', options: { method: 'post' } }).then(
          (res) => {
            if (res.code === 200) {
              localStorage.setItem(
                process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType
                  ? `${process.env.NEXT_PUBLIC_ANALYTICS_cx_factoryType}_token`
                  : 'cx_token',
                res.data
              );
            }
          }
        );
      }, 1000 * 2 * 4);
    }
  };

  // 检查版本更新

  const updateVeision = () => {
    if (updateTokernTimer.current) {
      clearInterval(updateTokernTimer.current);
      updateTokernTimer.current = undefined;
    }
    if (updateTokernTimer.current === undefined) {
      updateTokernTimer.current = setInterval(() => {
        request<{ version: string }>({ url: '/emgcVersion.json' }).then((res) => {
          if (res.code === 200) {
            if (res.data.version !== version) {
              toast({
                title: '监测到版本更新，即将刷新浏览器',
                position: 'bottom-right',
              });
              setTimeout(() => {
                window.location.reload();
              }, 5 * 1000);
            }
          }
        });
      }, 1000 * 60 * 4);
    }
  };

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

  const getMenus = async () => {
    //TODO: 请求本地菜单调试
    const url = `/ms-gateway/ms-system/menu/list-auth-menu?systemCode=SystemSign&userId=${currentUserInfo ? currentUserInfo.userId : 0
      }`;
    // const url = `/api/menus`;
    const res = await request<IMenuItem[]>({
      url,
    });

    if (res.code === 200) {
      const menus = res.data;
      console.log('menus', menus);

      for (const menu of menus) {
        genParentName(menu);
      }

      setMenuModel(menus);
      // 铺平菜单数据
      const flatMenus: IMenuItem[] = [];
      const flatMenus_ = (menus: IMenuItem[]) => {
        for (const iterator of menus) {
          flatMenus.push(iterator);
          if (iterator.children) {
            flatMenus_(iterator.children);
          }
        }
      };

      flatMenus_(menus);
      setFlatMenuModel(flatMenus);
      estimateMenuAuthor(flatMenus);
      //开始连接socket
      phoneSocket.current?.initPhoneSocketFun();
    } else {
      // 无权限或未登录
      if (res.noAuth) {
        // router.push('/login');
      }
    }
  };

  //获取部门
  const getDepartment = useMemoizedFn(async () => {
    const res = await request<IDepartment[]>({ url: '/ms-gateway/ms-system/org/list-org-tree' });
    if (res.code === 200) {
      const fn = (list: IDepartment[]) => {
        const data: IOritreeData[] = [];
        for (const item of list) {
          if (item.children && item.children.length) {
            data.push({
              name: item.orgName,
              id: item.id,
              children: fn(item.children),
            });
          } else {
            data.push({
              name: item.orgName,
              id: item.id,
            });
          }
        }
        return data;
      };

      const newData = fn(res.data);

      setDepTreeModal(newData);
    }
  });


  return (
    <>
      {/* {authRoute ? ( */}
      <Box h="full" overflow="hidden">
        {/* {currentUserInfo && <WebSocketComponent currentUserInfo={currentUserInfo} />} */}
        {/* <Script strategy="afterInteractive" src="/wenet/js/recorder/recorder-core.js"></Script>
    <Script strategy="afterInteractive" src="/wenet/js/recorder/extensions/lib.fft.js"></Script>
    <Script strategy="afterInteractive" src="/wenet/js/recorder/extensions/frequency.histogram.view.js"></Script>
    <Script strategy="afterInteractive" src="/wenet/js/recorder/engine/pcm.js"></Script>
    <Script strategy="afterInteractive" src="/wenet/js/SoundRecognizer.js"></Script> */}
        <Flex direction="column" h="full">
          <Header />
          {/* { hideHeader ? null } */}

          {/* <Button
            bg="test.100"
            onClick={() => {
              setTheme({
                ...lightTheme,
                colors: {
                  ...lightTheme.colors,
                  pri: {
                    ...lightTheme.colors.pri,
                    'blue.100': 'rgba(249, 42, 42, 1)',
                  },
                },
              });
            }}
          >
            测试颜色替换
          </Button> */}
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
          <Box flex="1" overflow="hidden" position="relative">

            {authLoad && children}
          </Box>

          <CallNumberContainer ref={phoneSocket} />
        </Flex>
      </Box>
      {/* ) : (
        1122333
        // <NoAuth />
      )} */}
    </>
  );
};

export default Layout;
