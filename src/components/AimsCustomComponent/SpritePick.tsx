import { request } from '@/utils/request';
import { useRef, useState } from 'react';
import { ILayerItem, ISprite } from '../MapTools/LayerList';

import { Box, SimpleGrid, VStack } from '@chakra-ui/react';
import { useMount } from 'ahooks';
import { FormItem } from 'amis';
import SmoothScrollbar from 'smooth-scrollbar';
// import { ISprite } from '@/app/(command)/command/MapToolBar/LayerList';

interface IProps {
  value: string;

  onChange: (val: string) => void;
}
const SpritePick = ({ value, onChange }: IProps) => {
  const [spriteJson, setSpriteJson] = useState<ISprite>({});
  const warp = useRef<HTMLDivElement | null>(null);
  const scrollbar = useRef<SmoothScrollbar | null>(null);

  useMount(() => {
    getSp();
    setTimeout(() => {
      if (warp.current) {
        scrollbar.current = SmoothScrollbar.init(warp.current);
      }
    }, 2 * 100);
  });

  const getSp = async () => {
    const res = (await request<ILayerItem[]>({
      url: `${process.env.NEXT_PUBLIC_ANALYTICS_Map}/styles/baseMap/sprite.json`,
    })) as unknown as ISprite;
    setSpriteJson(res);
  };

  const handelClick = (val: string) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <Box h="150" ref={warp}>
      <SimpleGrid columns={8}>
        {Object.entries(spriteJson)
          .filter(
            (val) =>
              val[0].substr(val[0].length - 5, 5).indexOf('_h') === -1 &&
              val[0].substr(val[0].length - 5, 5).indexOf('_p') === -1
          )
          .map(([name, item]) => {
            const isChecked = value === name;
            return (
              <VStack
                key={name}
                align="center"
                onClick={() => handelClick(name)}
                cursor="pointer"
                bg={isChecked ? 'pri.blue.400' : ''}
                color={isChecked ? 'pri.blue.100' : ''}
                _hover={{ bg: 'pri.blue.400', color: 'pri.blue.100' }}
              >
                <Box
                  w={`${item.width}px`}
                  h={`${item.height}px`}
                  backgroundImage={`url(${process.env.NEXT_PUBLIC_ANALYTICS_Map}/styles/baseMap/sprite.png)`}
                  backgroundPosition={`-${item.x}px  -${item.y}px`}
                />

                <Box>{name}</Box>
              </VStack>
            );
          })}
      </SimpleGrid>
    </Box>
  );
};

export default FormItem({
  type: 'SpritePick',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
})(SpritePick);
