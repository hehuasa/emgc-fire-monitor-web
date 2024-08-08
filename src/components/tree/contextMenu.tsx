import { Box, List, ListItem, ListIcon } from '@chakra-ui/react';
import { useMouse, useClickAway } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { contextMenuType } from './tree';

type propsType = {
  click?: (menu: contextMenuType) => void;
  contextMenu?: Array<contextMenuType>;
};

const ContextMenu = (props: propsType) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<any>(null);
  const mouse = useMouse(ref);

  // 右键监听
  const handleContextMenu = (e: any) => {
    e.preventDefault();
    setVisible(true);
    if (ref.current) {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const right = sw - mouse.clientX > mouse.elementW;
      const left = !right;
      const top = sh - mouse.clientY > mouse.elementH;
      const bottom = !top;

      if (right) {
        ref.current.style.left = `${mouse.clientX}px`;
      }
      if (left) {
        ref.current.style.left = `${mouse.clientX - mouse.elementW}px`;
      }
      if (top) {
        ref.current.style.top = `${mouse.clientY}px`;
      }
      if (bottom) {
        ref.current.style.top = `${mouse.clientY - mouse.elementH}px`;
      }
    }
  };

  // 菜单元素外关闭
  const closeContext = () => setVisible(false);
  useClickAway(() => {
    closeContext();
  }, ref);

  // useEventListener('contextmenu', handleContextMenu, {
  //   target: node,
  // });
  // useEventListener('scroll', closeContext, {
  //   target: node,
  // });

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('scroll', closeContext);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('scroll', closeContext);
    };
  });

  return (
    <Box
      ref={ref}
      borderRadius={5}
      bg={'pri.blacks.100'}
      pos="fixed"
      top={0}
      left={0}
      w="150px"
      textAlign="center"
      zIndex={'modal'}
    >
      {visible && (
        <List p={5}>
          {props?.contextMenu?.map((menu) => {
            return (
              <ListItem
                key={menu.text}
                textAlign="center"
                _hover={{
                  color: '#FFF',
                  bg: 'backs.400',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  closeContext();
                  props.click ? props.click(menu) : '';
                }}
              >
                {menu.icon && <ListIcon as={menu.icon}></ListIcon>}
                {menu.text}
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default ContextMenu;
