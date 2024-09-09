'use client';

import { localesModal } from '@/models/global';
import { IMenuItem } from '@/models/user';
import { menuGetOutNode } from '@/utils/util';
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
    if (outParent.id === urlLink.id) {
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

};

export default NavLink;
