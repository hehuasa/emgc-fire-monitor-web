/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, HStack, useOutsideClick, useToast } from '@chakra-ui/react';
import { SpaceSquare } from '@/components/Icons';
import Legend from '@/components/MapTools/Legend';
import React, { useMemo, useRef } from 'react';
//import SpaceQuerySquare from './SpaceQuerySquare';
import { ILayerItem, ISprite } from './LayerList';
import { useIntl } from 'react-intl';
import { clearMapSearchModel, emgcCommandFooterActiveModel } from '@/models/resource';
import { useRecoilValue, useSetRecoilState } from 'recoil';

interface IProps {
  spaceQueryCircle: boolean;
  setSpaceQueryCircle: (value: React.SetStateAction<boolean>) => void;
  spaceQuerySquare: boolean;
  setSpaceQuerySquare: (value: React.SetStateAction<boolean>) => void;
  mapLegend: boolean;
  setMapLegend: (value: React.SetStateAction<boolean>) => void;
  closeShowType: () => void;
  layers: ILayerItem[];
  spriteJson: ISprite;
  theme?: 'deep' | 'shallow';
}

const Tools = ({
  spaceQueryCircle,
  setSpaceQueryCircle,
  mapLegend,
  setMapLegend,
  setSpaceQuerySquare,
  spaceQuerySquare,
  closeShowType,
  layers,
  spriteJson,
  theme = 'shallow',
}: IProps) => {
  const emgcCommandFooterActive = useRecoilValue(emgcCommandFooterActiveModel);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const { formatMessage } = useIntl();
  const setClearMapSearch = useSetRecoilState(clearMapSearchModel);
  useOutsideClick({
    ref: boxRef,
    handler: () => {
      setMapLegend(false);
      if (!spaceQuerySquare) {
        //closeShowType();
      }
    },
  });

  const getLegendLayers = (layers: ILayerItem[]) => {
    const cache: ILayerItem[] = [];
    for (const layer of layers) {
      if (layer.children && layer.children.length > 0) {
        for (const item of layer.children) {
          cache.push(item);
        }
      } else {
        cache.push(layer);
      }
    }

    return cache;
  };

  const color = useMemo(() => {
    if (theme === 'deep') {
      if (spaceQuerySquare) {
        return 'emgc.blue.400';
      } else {
        return 'emgc.white.100';
      }
    } else {
      if (spaceQuerySquare) {
        return 'pri.blue.100';
      } else {
        return 'pri.dark.500';
      }
    }
  }, [spaceQuerySquare]);

  // console.info('============currentAreaFloors==============', currentAreaFloors);
  return (
    <>
      <Box
        position="absolute"
        boxShadow=" 0px 3px 6px 1px rgba(119,140,162,0.16);"
        //borderRadius="12px"
        borderRadius={theme === 'deep' ? 0 : '12px'}
        top="14"
        right="0"
        zIndex={3}
        bg={theme === 'deep' ? 'emgc.blue.800' : 'pri.white.100'}
        p="2.5"
        ref={boxRef}
      >
        {/* <HStack
          onClick={() => {
            setSpaceQuerySquare(false);
            closeShowType();
          }}
          borderRadius="12px"
          my="1"
          p="2.5"
          bg="pri.gray.500"
          _hover={{ color: 'pri.blue.100', fill: 'pri.blue.100' }}
          color={spaceQueryCircle ? 'pri.blue.100' : 'pri.dark.500'}
          fill={spaceQueryCircle ? 'pri.blue.100' : 'pri.dark.500'}
          cursor="pointer"
        >
          <SpaceCircle w="3.5" h="3.5" />

          <Box>查周边（圆形）</Box>
        </HStack> */}
        <HStack
          onClick={() => {
            if (emgcCommandFooterActive === '1') {
              toast({ status: 'info', position: 'top', title: '请关闭查周边', duration: 2000 });
              return;
            }
            setSpaceQuerySquare(true);
            closeShowType();
            setClearMapSearch(new Date().getTime());
          }}
          borderRadius="12px"
          my="1"
          p="2.5"
          bg={theme === 'deep' ? '' : 'pri.gray.500'}
          //_hover={{ color }}
          color={color}
          fill={color}
          cursor="pointer"
        >
          <SpaceSquare w="3.5" h="3.5" />

          <Box>
            {formatMessage({ id: 'spacequery' })}({formatMessage({ id: 'rectangular' })})
          </Box>
        </HStack>
        {mapLegend && (
          <Legend
            handleClose={() => {
              setMapLegend(false);
            }}
            layers={getLegendLayers(layers)}
            spriteJson={spriteJson}
          />
        )}
      </Box>
    </>
  );
};

export default Tools;
