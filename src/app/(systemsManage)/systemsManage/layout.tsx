'use client';

import BreadcrumbName from '@/components/BreadcrumbName';
import Header from '@/components/Header/Header';
import LeftSideBar from '@/components/LefiSideBar/index';
import { IOritreeData } from '@/components/Montior/Tree';
import { allDeviceListModel, deviceType } from '@/models/sms';
import { buttonAuthMenus, IMenuItem, IUserInfo, menuModel } from '@/models/user';
import { request } from '@/utils/request';
import { Box, Flex, useToast } from '@chakra-ui/react';
import { useLocalStorageState, useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
// import LeftSideBar, { } from '@/components/LeftSideBar';
import NoAuth from '@/app/(emgc)/emgc/NoAuth';
import { useMenuAuthor } from '@/customHooks';
import { dictionaryModal, objectType } from '@/models/global';
import { systemTagModal, tagMap } from '@/models/system';
import { departmentDataTree, DepartmentType } from '@/models/userManage';
import { TreeDataParent } from '@/utils/util';
import { cloneDeep } from 'lodash';

let index = 0;

const genParentName = (menu: IMenuItem) => {
  if (menu.children) {
    for (const item of menu.children) {
      if (item.url === '/' || !item.url) {
        index += 1;
        item.url = `/systemsManage/development/${index}`;
      }
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

const SystemsManageLayout = ({ children }: { children: ReactNode }) => {
  const { estimateMenuAuthor } = useMenuAuthor();
  const toast = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const updateTokernTimer = useRef<NodeJS.Timer>();
  const [currentUserInfo, _] = useLocalStorageState<null | IUserInfo>('emgc_web_currentUserInfo');
  const [menus, setMenuModel] = useRecoilState(menuModel);
  const setAllDeviceData = useSetRecoilState(allDeviceListModel);
  const [getTreeData, setTreeData] = useRecoilState(departmentDataTree);
  const [fold, setFold] = useState(false);
  const [leftMune, setLeftMune] = useSafeState<IOritreeData<string>[]>([]);
  const audioRef = useRef<null | HTMLAudioElement>(null);
  const [treeDefaultCheck, setTreeDefaultCheck] = useSafeState<string[]>([]);
  const setButtonAuth = useSetRecoilState(buttonAuthMenus);
  const setModuleTag = useSetRecoilState(systemTagModal);

  const setAllDict = useSetRecoilState(dictionaryModal);
  const [localAllDict, setLocalAllDict] = useLocalStorageState<objectType>('dictionary');

  // 路由权限判断
  const [localRouteUrls] = useLocalStorageState<null | Array<string>>('SystemSignRouteUrls');
  const [authRoute, setAuthRoute] = useState(true);

  useEffect(() => {
    console.log('localRouteUrls', localRouteUrls);
    if (pathname && localRouteUrls) {
      const hasAuth = localRouteUrls.includes(pathname);
      setAuthRoute(hasAuth);
    }
  }, [pathname]);

  useMount(() => {
    // 获取菜单
    getMenus().then(() => {
      // updateToken();
      getAllDeviceLsit();
      getDepartmentData();
      getTagList();
      if (localAllDict && Object.getOwnPropertyNames(localAllDict).length > 0) {
        setAllDict(localAllDict);
      } else {
        getDict();
      }
    });
  });

  //TODO：未来通过node中间件缓存共享数据，比如账号信息等
  const getMenus = async () => {
    const url = `/ms-system/menu/list-auth-menu?systemCode=SystemSign&userId=${currentUserInfo ? currentUserInfo.userId : 0
      }`;
    // const url = '/api/menus';

    const res = await request<IMenuItem[]>({
      url,
      options: {},
    });

    if (res.code === 200) {
      const menus = res.data;
      index = 0;
      for (const menu of menus) {
        genParentName(menu);
      }

      const needShowMune =
        menus.find((item) => item.url.endsWith('/systemsManage'))?.children || [];

      const arr = formatTreeData(needShowMune);
      setLeftMune(arr);

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
      // 筛选出按钮权限菜单
      const buttonAuthMenuList = flatMenus.filter((menu) => menu.funType === 2);
      setButtonAuth(buttonAuthMenuList);

      setMenuModel(menus);
      estimateMenuAuthor(flatMenus);
    } else {
      // 无权限或未登录
      if (res.noAuth) {
        router.push('/login');
      }
    }
  };

  const formatTreeData = useMemoizedFn((data: IMenuItem[]) => {
    const arr: IOritreeData[] = [];
    const format = (data: IMenuItem[], arr: IOritreeData[]) => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        //设置tree默认选中
        if (pathname && item.url.endsWith(pathname)) {
          setTreeDefaultCheck([item.id]);
        }

        if (item.children && item.children.length) {
          const obj = {
            id: item.id,
            name: item.functionName,
            param: item.url,
            children: [],
            sortIndex: item.sortIndex,
          };
          format(item.children, obj.children);
          arr.push(obj);
        } else {
          arr.push({
            id: item.id,
            name: item.functionName,
            param: item.url,
            sortIndex: item.sortIndex,
          });
        }
      }
    };
    format(data, arr);

    return arr;
  });

  // 更新token
  const updateToken = () => {
    if (updateTokernTimer.current) {
      clearInterval(updateTokernTimer.current);
      updateTokernTimer.current = undefined;
    }
    // if (updateTokernTimer.current === undefined) {
    //   updateTokernTimer.current = setInterval(() => {
    //     request<string>({ url: '/ms-login/user/token/refresh', options: { method: 'post' } }).then((res) => {
    //       if (res.code === 200) {
    //         localStorage.setItem('cx_alarm_token', res.data);
    //       }
    //     });
    //   }, 1000 * 60 * 4);
    // }
  };

  // 取消更新token
  const delToken = () => {
    if (updateTokernTimer.current) {
      clearInterval(updateTokernTimer.current);
      updateTokernTimer.current = undefined;
    }
  };

  //请求部门数据
  const getDepartmentData = useMemoizedFn(async () => {
    const { data, code } = await request({
      url: `/ms-system/user/list-org-tree`,
      options: {
        method: 'GET',
      },
    });
    if (code == 200) {
      const newData = TreeDataParent(data as unknown as Array<DepartmentType>);
      // const formatTreeData: FormatTreeDataType[] = FormatTreeData([], newData);
      setTreeData(newData);
    }
  });

  const getTagList = async () => {
    const { code, data } = await request({
      url: `/ms-system/business_data/tag`,
    });
    if (code == 200) {
      const tagMap = new Map();
      Object.entries(data as Map<string, tagMap>).forEach(([key, value]) => {
        tagMap.set(key, value);
      });
      setModuleTag(tagMap);
    }
  };

  // 获取全部设备列表
  const getAllDeviceLsit = async () => {
    const { code, data } = await request({
      url: `/cx-alarm/device/manager/list_device`,
      options: {
        method: 'post',
        body: JSON.stringify({}),
      },
    });
    if (code == 200) {
      setAllDeviceData(data as unknown as deviceType[]);
    }
  };

  const getDict = async () => {
    const { data, code } = await request<objectType>({
      url: `/cx-alarm/dc_dict/dictionary`,
    });
    if (code === 200) {
      setAllDict(data);
      setLocalAllDict(data);
    }
  };
  useUnmount(() => {
    delToken();
  });

  const names = useMemo(() => {
    try {
      let names: undefined | { name: string; url: string }[] = [];
      if (menus && menus.length) {
        const getName = (data_: IMenuItem[]) => {
          const data = [...data_];
          for (const item of data) {
            if (item.children && item.children.length) {
              getName(item.children);
            }
            if (pathname?.endsWith(item.url)) {
              names = item.parentNames;
            }
            // if (item.url === '/' || !item.url) {
            //   console.log('item.url', (item.url = '/6'));
            //   //console.log('iiii', (item.fullname = 'ww'));
            //   //item.url = '/systemsManage/development';
            // }
          }
        };
        getName(menus);
      }
      return names || [];
    } catch (e) {
      console.log('eeee', e);
    }
  }, [menus, pathname]);

  const leftMenus = useMemo(() => {
    // 写死 2004 为后台管理菜单的code
    const systemMenus = menus.find((menu) => menu.functionCode === '2004');
    const leftMenus_ = systemMenus ? cloneDeep(systemMenus.children as IMenuItem[]) : [];
    const sortMenus = leftMenus_.sort((a, b) => a.sortIndex - b.sortIndex);
    return sortMenus || [];
  }, [menus]);

  useEffect(() => {
    audioRef.current = document.getElementById('systemAudio') as HTMLAudioElement;
    audioRef.current?.addEventListener('error', playError);

    return () => {
      audioRef.current?.removeEventListener('error', playError);
    };
  }, []);

  const playError = useMemoizedFn((e) => {
    toast({
      title: '语音播放失败',
      status: 'error',
      position: 'top',
      duration: 2000,
      isClosable: true,
    });
  });

  // const showLeftMenus = ['jobSafety'].find((val) => pathname?.indexOf(val) !== -1);

  return (
    <>
      {authRoute ? (
        <Box h="full">
          <Flex direction="column" h="full">
            <Header />
            <Box flex="1" overflowY="hidden">
              <Box h="full">
                <Flex h="full">
                  <Box overflow="auto" layerStyle="scrollbarStyle" minW={fold ? '0' : '45'}>
                    <LeftSideBar linkItems={leftMenus} fold={fold} />
                  </Box>
                  <Box flex={1} h="full">
                    <BreadcrumbName names={names || []} fold={fold} setFold={setFold} />
                    <Box
                      height={'calc(100% - 40px)'}
                      borderRightRadius="2xl"
                      borderBottomLeftRadius="2xl"
                      bg="pri.blacks.100"
                    >
                      {children}
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Flex>
          <audio preload="auto" id="systemAudio" loop={false} autoPlay={false} />
        </Box>
      ) : (
        <NoAuth />
      )}
    </>
  );
};

export default SystemsManageLayout;
