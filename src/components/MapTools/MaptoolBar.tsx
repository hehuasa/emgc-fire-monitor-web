import { AngelIcon, CtrlToolIcon, ToolIcon } from '@/components/Icons';
import LayerList, { ILayerItem, ISprite } from '@/components/MapTools/LayerList';
import LinkageEquipment from '@/components/MapTools/LinkageEquipment';
import Search from '@/components/MapTools/Search';
import Tools from '@/components/MapTools/Tools';
import { CloseIcon } from '@chakra-ui/icons';

import SpaceQuerySquare from '@/components/MapTools/SpaceQuerySquare';
import { foldModel } from '@/models/alarm';
import { isSpaceQueryingModel, MapContext } from '@/models/map';
import { checkedLayersModel, clearMapSearchModel, emgcGpsTimerModel } from '@/models/resource';
import { request } from '@/utils/request';
import { Box, Flex } from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import { useContext, useMemo, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useTranslations } from 'next-intl';

export interface Props {
  theme?: 'deep' | 'shallow';
}

const MapToolBar = ({ theme = 'shallow' }: Props) => {
  const formatMessage = useTranslations("base");
  const [fold] = useRecoilState(foldModel);
  const [showType, setShowTypes] = useState<'' | 'layer' | 'tool' | 'ctrlTool'>('');
  const [layers, setLayers] = useState<ILayerItem[]>([]);
  const map = useContext(MapContext);
  const [spriteJson, setSpriteJson] = useState<ISprite>({});
  const [checkedLayers, setCheckedLayers] = useRecoilState(checkedLayersModel);
  // const [checkedLayers, setCheckedLayers] = useState<string[]>([]);
  // 查周边圆形
  const [spaceQueryCircle, setSpaceQueryCircle] = useState(false);
  // 查周边矩形
  const [spaceQuerySquare, setSpaceQuerySquare] = useRecoilState(isSpaceQueryingModel);
  // 图例展示
  const [mapLegend, setMapLegend] = useState(false);
  const setClearMapSearch = useSetRecoilState(clearMapSearchModel);
  const gpsTimer = useRef<NodeJS.Timer>(null);
  const [emgcGpsTimer, setEmgcGpsTimer] = useRecoilState(emgcGpsTimerModel);
  //
  const [layerListExpandedIndex, setLayerListExpandedIndex] = useSafeState<number | number[]>([]);

  useMount(() => {
    getLayers();
    getSprite();
  });

  useUnmount(() => {
    gpsTimer.current && clearInterval(gpsTimer.current);
    setEmgcGpsTimer(null);

    if (checkedLayers && checkedLayers.length !== 0) {
      setCheckedLayers([]);
    }
  });

  // 获取图层列表
  const getLayers = async () => {
    const res = await request<ILayerItem[]>({ url: '/cx-alarm/resource/list-layer' });

    if (res.code === 200) {
      setLayers(res.data);
    }
  };
  // 获取雪碧图及配置
  const getSprite = async () => {
    const res = (await request<ILayerItem[]>({
      url: `${process.env.NEXT_PUBLIC_ANALYTICS_Map}/styles/baseMap/sprite.json`,
    })) as unknown as ISprite;
    setSpriteJson(res);
  };

  const showLayers = showType === 'layer';
  const showTools = showType === 'tool';
  const showCtrlTool = showType === 'ctrlTool';

  const closeShowType = useMemoizedFn(() => {
    setShowTypes('');
  });

  const setLayerVisible = useMemoizedFn((name: string, visibility: 'visible' | 'none') => {
    map?.setLayoutProperty(name, 'visibility', visibility);
  });

  const showCtrlToolColor = useMemo(() => {
    if (theme === 'deep') {
      if (showCtrlTool) {
        return 'emgc.blue.400';
      } else {
        return 'emgc.white.100';
      }
    } else {
      if (showCtrlTool) {
        return 'pri.blue.100';
      } else {
        return 'pri.dark.400';
      }
    }
  }, [showCtrlTool]);

  const showLayersColor = useMemo(() => {
    if (theme === 'deep') {
      if (showLayers) {
        return 'emgc.blue.400';
      } else {
        return 'emgc.white.100';
      }
    } else {
      if (showLayers) {
        return 'pri.blue.100';
      } else {
        return 'pri.dark.400';
      }
    }
  }, [showLayers]);

  const showToolsColor = useMemo(() => {
    if (theme === 'deep') {
      if (showTools) {
        return 'emgc.blue.400';
      } else {
        return 'emgc.white.100';
      }
    } else {
      if (showTools) {
        return 'pri.blue.100';
      } else {
        return 'pri.dark.400';
      }
    }
  }, [showTools]);

  return (
    <>
      <Flex
        position="absolute"
        zIndex={3}
        //left="110"
        top={theme === 'deep' ? 20 : 7.5}
        left={fold ? '10' : '110'}
        transition="all 0.15s"
        alignItems="flex-start"
        pointerEvents="none"
      >
        <Box position="relative" mr="2.5" pointerEvents="auto">
          <Flex
            bg={theme === 'deep' ? 'emgc.blue.800' : 'pri.white.100'}
            borderRadius={theme === 'deep' ? '0' : '10px'}
            boxShadow={theme === 'deep' ? '' : '0px 3px 6px 1px rgba(0,0,0,0.16)'}
            color={theme === 'deep' ? 'emgc.white.100' : ''}
            py="2"
            h="10"
          >
            {theme === 'shallow' ? (
              <Flex
                borderRightWidth={'1px'}
                borderRightColor={'pri.gray.700'}
                borderRightStyle="dashed"
                px="2"
                h="full"
                align="center"
                cursor="pointer"
                color={showCtrlToolColor}
                onClick={() => setShowTypes(showCtrlTool ? '' : 'ctrlTool')}
              >
                <CtrlToolIcon mr="1" />
                <Box userSelect="none" mr="1">
                  {formatMessage({ id: 'interlockingEquipment' })}
                </Box>
                <AngelIcon w="3" h="3" transform={showCtrlTool ? 'rotate(180deg)' : ''} />
              </Flex>
            ) : null}

            <Flex
              borderRightWidth={theme === 'deep' ? '0px' : '1px'}
              borderRightColor={theme === 'deep' ? '' : 'pri.gray.700'}
              borderRightStyle="dashed"
              px="2"
              h="full"
              align="center"
              cursor="pointer"
              fill={showLayersColor}
              color={showLayersColor}
              onClick={() => setShowTypes(showLayers ? '' : 'layer')}
            >
              <CtrlToolIcon mr="1" />
              <Box userSelect="none" mr="1">
                {formatMessage({ id: 'layers' })}
              </Box>
              <AngelIcon w="3" h="3" transform={showLayers ? 'rotate(180deg)' : ''} />
            </Flex>

            <Flex
              onClick={() => {
                if (showTools) {
                  setMapLegend(false);
                }
                setShowTypes(showTools ? '' : 'tool');
              }}
              px="2"
              h="full"
              align="center"
              cursor="pointer"
              fill={showToolsColor}
              color={showToolsColor}
            >
              <ToolIcon mr="1" />
              <Box userSelect="none" mr="1">
                {formatMessage({ id: 'toolbox' })}
              </Box>
              <AngelIcon w="3" h="3" transform={showTools ? 'rotate(180deg)' : ''} />
            </Flex>
          </Flex>
          {showCtrlTool && <LinkageEquipment closeShowType={closeShowType} />}
          {showLayers && (
            <LayerList
              closeShowType={closeShowType}
              layers={layers}
              spriteJson={spriteJson}
              setLayerVisible={setLayerVisible}
              layerListExpandedIndex={layerListExpandedIndex}
              setLayerListExpandedIndex={setLayerListExpandedIndex}
              theme={theme}
              gpsTimer={gpsTimer}
              checkedLayers={checkedLayers}
              setCheckedLayers={setCheckedLayers}
            />
          )}
          {showTools && (
            <Tools
              mapLegend={mapLegend}
              setMapLegend={setMapLegend}
              setSpaceQueryCircle={setSpaceQueryCircle}
              setSpaceQuerySquare={setSpaceQuerySquare}
              spaceQueryCircle={spaceQueryCircle}
              spaceQuerySquare={spaceQuerySquare}
              closeShowType={closeShowType}
              layers={layers}
              spriteJson={spriteJson}
              theme={theme}
            />
          )}
        </Box>
        {/* 地图矩形选择逻辑组件 */}
        {spaceQuerySquare && <SpaceQuerySquare />}

        <Box pointerEvents="auto">
          <Search theme={theme} />
        </Box>
        {spaceQuerySquare && (
          <Box ml="3" pointerEvents="auto">
            <Flex
              alignItems="center"
              bg="#FFFFE1"
              p="5px"
              borderRadius="6px"
              boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
            >
              <Box mr="14px">请在地图上框选区域</Box>
              <CloseIcon
                fontSize="12px"
                onClick={() => {
                  setSpaceQuerySquare(false);
                  setClearMapSearch(new Date().getTime());
                }}
                cursor="pointer"
              />
            </Flex>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default MapToolBar;
