import { Box, Collapse, Flex, Text } from '@chakra-ui/react';
import React, { useRef } from 'react';

import { IMenuItem } from '@/models/user';
import { useRouter, usePathname } from 'next/navigation';
import { cloneDeep } from 'lodash';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { ArrowIcon } from '@/components/Icons';
import SmoothScrollbar from 'smooth-scrollbar';

export interface LinkItemProps {
  url: string;
  name: string;
  icon: unknown;
}

const NavItem = ({ children, item }: { children?: React.ReactNode; item: IMenuItem }) => {
  const pathname = usePathname();
  const isCheck = item.url && pathname?.endsWith(item.url);
  const router = useRouter();
  const [showSubItem, setShowSubItem] = useSafeState(true);

  //是否是跳转按钮
  let isCanJump = false;
  if (item.children) {
    if (!item.children.length) {
      isCanJump = true;
    }
  } else {
    isCanJump = true;
  }

  const onClick = useMemoizedFn(() => {
    if (isCanJump) {
      // router.push(process.env.NEXT_PUBLIC_ANALYTICS_BasePath + item.url);
      router.push(item.url);
    } else {
      setShowSubItem(!showSubItem);
    }
  });

  return (
    <Box px={2}>
      <Flex h="30px" lineHeight="30px" userSelect="none" cursor="pointer" alignItems="center" onClick={onClick}>
        <Text
          _hover={{
            color: isCanJump ? 'pri.blue.200' : '',
          }}
          mr={2}
          color={isCheck ? 'pri.blue.200' : 'black'}
        >
          {item.functionName}
        </Text>
        {item.children && item.children.length ? (
          <ArrowIcon transition="all 0.2s" transform={`rotate(${showSubItem ? 0 : 180}deg)`} />
        ) : null}
      </Flex>

      <Collapse in={showSubItem} unmountOnExit>
        {children}
      </Collapse>
    </Box>
  );
};

const LeftSideBar = ({ linkItems }: { linkItems: Array<IMenuItem> }) => {
  console.log('linkItems', linkItems);
  const domWarp = useRef<HTMLDivElement | null>(null);
  useMount(() => {
    if (domWarp.current) {
      SmoothScrollbar.init(domWarp.current);
    }
  });
  const cloneLinkItems = cloneDeep(linkItems).sort((prev, next) => {
    return prev.sortIndex - next.sortIndex;
  });

  const _renderItem = useMemoizedFn((data: IMenuItem[]) => {
    return data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <NavItem item={item} key={item.id}>
            {_renderItem(item.children)}
          </NavItem>
        );
      }
      return <NavItem item={item} key={item.id} />;
    });
  });

  return (
    <Box px={5} h="full" mr={9} ref={domWarp}>
      {_renderItem(cloneLinkItems)}
    </Box>
  );
};

export default LeftSideBar;
