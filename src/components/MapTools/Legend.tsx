import { Box, Flex } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { ILayerItem, ISprite } from './LayerList';
import SmoothScrollbar from 'smooth-scrollbar';
import { useMount } from 'ahooks';
import { CloseIcon } from '@chakra-ui/icons';
// import { mapLayer } from '../../../mock';

interface IProps {
  layers: ILayerItem[];
  spriteJson: ISprite;
  handleClose: () => void;
}
const Legend = ({ layers, spriteJson, handleClose }: IProps) => {
  const domWarp = useRef<HTMLDivElement | null>(null);

  useMount(() => {
    if (domWarp.current) {
      SmoothScrollbar.init(domWarp.current);
    }
  });
  return (
    <Box
      position="absolute"
      boxShadow=" 0px 3px 6px 1px rgba(119,140,162,0.16);"
      borderRadius="5px"
      top={0}
      right="0"
      zIndex={4}
      bg="pri.white.100"
      w="max-content"
    >
      <Flex
        color="pri.dark.100"
        px="2.5"
        borderBottomWidth="1px"
        borderBottomColor="pri.gray.100"
        h="10"
        align="center"
        justify="space-between"
      >
        <Box>图例</Box>
        <CloseIcon w="3" h="3" _hover={{ color: 'pri.blue.100' }} cursor="pointer" onClick={handleClose} />
      </Flex>
      <Box h="110" ref={domWarp} p="2.5" minW={'160px'}>
        {/* {mapLayer.map((item) => {
          const img_h = spriteJson[item.icon + '_p_h'];
          return (
            <HStack key={item.id} borderRadius="12px" my="1" px="2.5" py="1" color="pri.dark.100">
              {img_h ? (
                <Box
                  w={`${img_h.width}px`}
                  h={`${img_h.height}px`}
                  backgroundImage={`url(${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/map-server/styles/baseMap/sprite.png)`}
                  backgroundPosition={`-${img_h.x}px  -${img_h.y}px`}
                />
              ) : (
                <Box />
              )}
              <Box>{item.layerName}</Box>
            </HStack>
          );
        })} */}
      </Box>
    </Box>
  );
};

export default Legend;
