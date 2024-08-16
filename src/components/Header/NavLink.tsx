'use client';

import { localesModal } from '@/models/global';
import { IMenuItem } from '@/models/user';
import { menuGetOutNode } from '@/utils/util';
import { Box, HStack } from '@chakra-ui/react';
import { useMemoizedFn } from 'ahooks';
import { ConfigProvider, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

const getFirstNode = (tree: IMenuItem[], func: (arg: IMenuItem) => number | undefined) => {
  let node;
  const list = tree.filter((v) => !v.hidden && v.funType !== 2);
  while ((node = list.shift())) {
    if (func(node) === 0) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      list.unshift(...node.children);
    }
  }
};

const NavLink = ({
  links,
  flagMenu,
}: {
  links: IMenuItem[];
  flagMenu: { [key: string]: IMenuItem };
}) => {
  const [locales, setLocales] = useRecoilState(localesModal);

  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleHover = useMemoizedFn(() => {
    setShow(true);
  });
  const handleOut = useMemoizedFn(() => {
    setShow(false);
  });
  const pathname = usePathname();

  //当前url的对应扁平化数据里面的菜单
  const urlLink = Object.values(flagMenu).find((item) => item.url === pathname);
  //当前url的对应扁平化数据里面的最外层菜单

  let isFirstCheck = false;
  if (urlLink) {
    const outParent = menuGetOutNode(flagMenu, urlLink);
    if (outParent.id === link.id) {
      isFirstCheck = true;
    }
  }
  const genMenus = (links: IMenuItem[]) => {
    const arrays = [];

    for (const link of links) {
      const obj = {
        ...link,
        icon: null,
        label: link.functionName,
        key: link.functionCode,
      }
      if (link.children && link.children.length > 0) {
        obj.children = genMenus(link.children)
      } else {
        obj.children = undefined

      }
      arrays.push(obj)

    }
    return arrays

  }
  const menus = genMenus(links);


  return <ConfigProvider
    theme={{
      token: {
        fontSize: 18
      },
      components: {
        Menu: {
          horizontalLineHeight: "64px",
          horizontalItemHoverBg: "red",
          activeBarHeight: 0,

          itemBg: 'transparent',
          popupBg: 'blue',
          itemColor: "#fff",
          // itemHoverBg: "red"
          /* 这里是你的组件 token */
        },
      },
    }}
  >
    <Menu selectedKeys={[]} mode="horizontal" items={menus} />
  </ConfigProvider>

  return (
    <Box position="relative">
      <Box
        h="16"
        marginRight={'0'}
        cursor="pointer"
        bg={
          isFirstCheck
            ? 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255, 255, 255, 0.2) 100%)'
            : 'none'
        }
        // 国际化
        fontSize={locales === 'zh' ? 'xl' : '16px'}
        _hover={{
          // 国际化
          fontSize: locales === 'zh' ? 'xl' : '16px',
        }}
        lineHeight="64px"
        borderBottomColor="pri.white.100"
        onMouseEnter={handleHover}
        onMouseLeave={handleOut}
        color="pri.white.100"
        onClick={() => {
          // 重定向一级菜单到该菜单下的最下级第一个菜单
          //川西的路由菜单和其他项目有点不一样
          //目前川西的应急准备和系统管理会有二级或者三级路由

          if (
            link.children &&
            link.children.length > 0 &&
            process.env.NEXT_PUBLIC_ANALYTICS_Ms_type !== 'cx'
          ) {
            const nodeLink = getFirstNode(link.children, (node) => node.children?.length);
            if (nodeLink) {
              router.push(nodeLink.url);
            } else {
              router.push(link.url);
            }
          } else {
            //2004系统管理 2005应急准备
            const hasSubMenuCode = ['2004', '2005', '2006'];
            if (hasSubMenuCode.includes(link.functionCode)) {
              const nodeLink = getFirstNode(link.children || [], (node) => node.children?.length);
              nodeLink && router.push(nodeLink.url);
            } else {
              router.push(link.url);
            }
          }
        }}
      >
        <Box
          // 国际化
          px={process.env.NEXT_PUBLIC_ANALYTICS_cx_param1 === '1' ? '15px' : '4.5'}
        >
          {/* {link.functionName} */}
          {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx'
            ? locales === 'zh'
              ? link.functionName
              : link.icon
            : link.functionName}
        </Box>

        {/* 二级菜单 不包括系统管理 和应急准备*/}
        {!link.url.includes('systemsManage') &&
          !link.url.includes('emgcPreparation') &&
          !link.url.includes('dataManage') &&
          process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx' &&
          show &&
          link.children &&
          link.children.length ? (
          <Box
            position="absolute"
            top={16}
            left="50%"
            zIndex={10}
            textAlign="center"
            bg="pri.blue.100"
            boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
            whiteSpace="nowrap"
            py="1"
            minW="full"
            transform="translateX(-50%)"
          >
            {link.children.map((item) => {
              return (
                <HStack
                  minW="full"
                  key={item.id}
                  justifyContent="center"
                  lineHeight="10"
                  height={10}
                >
                  <Box
                    borderBottom={'2px'}
                    borderBottomColor="transparent"
                    px="2"
                    // 国际化
                    fontSize={locales === 'zh' ? 'xl' : '16px'}
                    _hover={{ borderColor: 'pri.white.100' }}
                    onClick={(e) => {
                      // router.push(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + link.url);
                      router.push(item.url);
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    borderColor={pathname?.includes(item.url) ? 'pri.white.100' : ''}
                    minW="full"
                  >
                    {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx'
                      ? locales === 'zh'
                        ? item.functionName
                        : item.icon
                      : item.functionName}
                  </Box>
                </HStack>
              );
            })}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default NavLink;
