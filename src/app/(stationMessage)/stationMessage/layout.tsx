'use client';
import Header from '@/components/Header/Header';
import { IMenuItem, IUserInfo, menuModel } from '@/models/user';
import { request } from '@/utils/request';
import { Box, Flex } from '@chakra-ui/react';
import { useLocalStorageState, useMount } from 'ahooks';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useSetRecoilState } from 'recoil';

const genParentName = (menu: IMenuItem) => {
  if (menu.children) {
    for (const item of menu.children) {
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

const StationMessage = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const setMenuModel = useSetRecoilState(menuModel);
  const [currentUserInfo, _] = useLocalStorageState<null | IUserInfo>('emgc_web_currentUserInfo');
  useMount(() => {
    getMenus();
  });

  const getMenus = async () => {
    const url = `/ms-system/menu/list-auth-menu?systemCode=SystemSign&userId=${currentUserInfo ? currentUserInfo.userId : 0
      }`;
    // const url = `/api/menus`;
    const res = await request<IMenuItem[]>({
      url,
      options: {},
    });
    if (res.code === 200) {
      const menus = res.data;
      for (const menu of menus) {
        genParentName(menu);
      }

      setMenuModel(menus);
      // // 铺平菜单数据
      // const flatMenus: IMenuItem[] = [];
      // const flatMenus_ = (menus: IMenuItem[]) => {
      //   for (const iterator of menus) {
      //     flatMenus.push(iterator);
      //     if (iterator.children) {
      //       flatMenus_(iterator.children);
      //     }
      //   }
      // };
      // flatMenus_(menus);
      // setFlatMenuModel(flatMenus);

      // 筛选出按钮权限菜单
      // const buttonAuthMenuList = flatMenus.filter((menu) => menu.funType === 2);
      // setButtonAuth(buttonAuthMenuList);

      //开始连接socket
      // socket.current?.initWebSocket();
      // phoneSocket.current?.initPhoneSocketFun();
    } else {
      // 无权限或未登录
      if (res.noAuth) {
        router.push('/login');
      }
    }
  };

  return (
    <Box h="full">
      <Flex direction="column" h="full">
        <Header />
        <Box flex="1" overflowY="auto">
          <Box h="full">
            <Flex h="full">
              <Box flex={1} h="full">
                <Box
                  height={'full'}
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
    </Box>
  );
};

export default StationMessage;
