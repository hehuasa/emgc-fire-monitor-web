import { getGpsList } from '@/app/(emgc)/emgc/montior/operation/LeftPanel/GpsLocationList';
import Spin from '@/components/Loading/Spin';
import { MapContext } from '@/models/map';
import { currentGpsListModel, emgcGpsTimerModel, IGpsInfo, IResItem } from '@/models/resource';
import { request } from '@/utils/request';
import { execOperate } from '@/utils/util';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  useOutsideClick,
} from '@chakra-ui/react';
import {
  Feature,
  FeatureCollection,
  featureCollection,
  LineString,
  point,
  Point,
} from '@turf/turf';
import { useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';
import { GeoJSONSource } from 'maplibre-gl';
import { useSearchParams } from 'next/navigation';
import { stringify } from 'qs';
import React, { useContext, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import SmoothScrollbar from 'smooth-scrollbar';

export type ISprite = {
  [key: string]: { width: number; height: number; x: number; y: number; pixelRatio: number };
};

export interface ILayerItem {
  hasLayer: 0 | 1;
  icon: string;
  id: string;
  layerCode: string;
  layerName: string;
  children: ILayerItem[];
  isChecked: boolean;
  resourceCount: number;
}
interface IProps {
  spriteJson: ISprite;
  layers: ILayerItem[];
  theme?: 'deep' | 'shallow';
  gpsTimer: React.MutableRefObject<NodeJS.Timer | null>;
  setLayerVisible: (name: string, visibility: 'visible' | 'none') => void;

  closeShowType?: () => void;
  layerListExpandedIndex: number | number[];
  setLayerListExpandedIndex: React.Dispatch<React.SetStateAction<number | number[]>>;

  checkedLayers: string[];
  setCheckedLayers: (data: string[]) => void;
}
const LayerList = ({
  layers,
  spriteJson,
  setLayerVisible,
  closeShowType,
  setLayerListExpandedIndex,
  layerListExpandedIndex,
  theme = 'shallow',
  checkedLayers,
  setCheckedLayers,
  gpsTimer,
}: IProps) => {
  const domWarp = useRef<HTMLDivElement | null>(null);
  const map = useContext(MapContext);

  const testData = [103.90482526, 31.0531483, 0];
  const [loading, setLoading] = useSafeState(false);
  const searchParams = useSearchParams();
  const eventId = searchParams?.get('eventId');
  const boxRef = useRef<HTMLDivElement | null>(null);

  //扁平化图层数据，方便根据layerCode和id互相查询
  const flatLayer = useRef<{ [key: string]: ILayerItem }>({});

  // 人员定位列表
  const [currentGpsList, setCurrentGpsList] = useRecoilState(currentGpsListModel);
  const [emgcGpsTimer, setEmgcGpsTimer] = useRecoilState(emgcGpsTimerModel);

  useMount(() => {
    if (domWarp.current) {
      SmoothScrollbar.init(domWarp.current);
    }
  });

  useEffect(() => {
    const flatArr: { [key: string]: ILayerItem } = {};
    layers.forEach((item) => {
      flatArr[item.id] = item;
      item.children?.forEach((subItem) => {
        flatArr[subItem.id] = subItem;
      });
    });
    flatLayer.current = flatArr;
  }, [layers]);

  useUnmount(() => {
    gpsTimer.current && clearInterval(gpsTimer.current);
    setEmgcGpsTimer(null);
  });

  useOutsideClick({
    ref: boxRef,
    handler: () => {
      //closeShowType();
    },
  });

  // 获取人员定位列表
  const getGpsLocationList = async () => {
    const gpsList = await getGpsList();
    setCurrentGpsList(gpsList);
  };

  // 人员定位图层
  const getGpsLayerData = async (isChecked: boolean) => {
    return new Promise<void>((reslove) => {
      const source = map?.getSource('gps') as GeoJSONSource;
      const fn = async () => {
        const { data } = await request<IGpsInfo[]>({
          url: `/cx-alarm/resource/findPositionLayers`,
        });
        // const data: any = [
        //   {
        //     id: '1714911047256203266',
        //     resourceNo: '6d0ca047',
        //     resourceName: '3号定位卡',
        //     areaId: '1',
        //     areaName: '6#脱硫站控制室',
        //     address: '6#脱硫站控制室',
        //     iotDeviceId: 'a303212a-aa95-813b-6303-5e879c3cee43',
        //     iotSubDeviceId: '6d0ca047',
        //     coordinate: {
        //       coordinates: [103.823149935, 30.993392532],
        //       type: 'Point',
        //     },
        //     userId: null,
        //     userName: '',
        //   },
        // ];
        const arr: Feature<Point, IGpsInfo>[] = [];
        data?.forEach((item) => {
          item.userName = item.userName || item.resourceName || '';
          if (item.coordinate) {
            arr.push(point(item.coordinate.coordinates, item));
          }
        });
        source?.setData(featureCollection(arr));
      };

      if (isChecked) {
        fn().then(reslove);
        gpsTimer.current && clearInterval(gpsTimer.current);
        setEmgcGpsTimer(null);
        gpsTimer.current = setInterval(fn, 3000);
        setEmgcGpsTimer(gpsTimer.current);
        getGpsLocationList();
      } else {
        source?.setData(featureCollection([]));
        gpsTimer.current && clearInterval(gpsTimer.current);
        setEmgcGpsTimer(null);
        reslove();
        setCurrentGpsList(null);
      }
    });
  };

  //逃生路线
  const getTSLX = useMemoizedFn(async (isChecked: boolean, layerId: string) => {
    const source = map?.getSource('escape') as maplibregl.GeoJSONSource;
    if (isChecked) {
      const obj = { layerIds: [layerId], location: '', radius: 0 };
      const param = stringify(obj, { indices: false });
      const url = `/cx-alarm/resource/list-resource?${param}`;
      const res = (await request<ILayerItem[]>({ url })) as unknown as FeatureCollection<
        LineString,
        IResItem
      >;
      console.log('逃生路线', res);
      source?.setData(res);

      //应急指挥模块需要和大屏联动
      eventId && execOperate({ incidentId: eventId, operationAction: 'ESCAPE' });
    } else {
      source?.setData(featureCollection([]));
      //应急指挥模块需要和大屏联动
      eventId && execOperate({ incidentId: eventId, operationAction: 'ESCAPE', removeKeep: true });
    }

    return Promise.resolve();
  });

  //消防管网
  const getXFGW = useMemoizedFn(async (isChecked: boolean) => {
    if (isChecked) {
      console.log('消防管网图层11', map?.getLayer('firePipeLine'));
      setLayerVisible('firePipeLine', 'visible');
    } else {
      setLayerVisible('firePipeLine', 'none');
    }
  });

  const toggle = useMemoizedFn(async (layer: ILayerItem) => {
    /*
     人员定位 需要单独调用接口，因为需要添加定时器频繁调用
     逃生路线 需要另外一个图层展示
     部分数据需要特殊处理
    */
    setLoading(true);
    let ids = [...checkedLayers];
    const currentLayerId = layer.id;
    const isChecked = ids.includes(currentLayerId);
    if (isChecked) {
      ids = ids.filter((item) => item !== currentLayerId);
    } else {
      ids.push(currentLayerId);
    }
    setCheckedLayers(ids);

    if (layer.layerCode === 'StaffLayer') {
      const isChecked = ids.includes(layer.id);
      await getGpsLayerData(isChecked);
    } else if (layer.layerCode === 'TSLX') {
      const isChecked = ids.includes(layer.id);
      await getTSLX(isChecked, layer.id);
    } else if (layer.layerCode === 'FirePipeNetwork') {
      const isChecked = ids.includes(layer.id);
      await getXFGW(isChecked);
    } else {
      //过滤掉人员定位、逃生路线、消防管网的id
      const needFilterLayerCode = ['StaffLayer', 'TSLX', 'FirePipeNetwork'];
      const afterFilterIds = ids.filter((id) => {
        const layerCode = flatLayer.current[id]?.layerCode;
        if (needFilterLayerCode.includes(layerCode)) {
          return false;
        }
        return true;
      });

      const obj = { layerIds: afterFilterIds, location: '', radius: 0 };
      const param = stringify(obj, { indices: false });
      const url = `/cx-alarm/resource/list-resource?${param}`;
      const res = (await request<ILayerItem[]>({ url })) as unknown as FeatureCollection<
        Point,
        IResItem
      >;
      const source = map?.getSource('reslayer') as maplibregl.GeoJSONSource;
      if (res.features) {
        res.features = res.features.filter((item) => item.geometry);
        source?.setData(res);
      } else {
        source?.setData(featureCollection([]));
      }
    }

    setLoading(false);
  });

  return (
    <Box
      position="absolute"
      boxShadow=" 0px 3px 6px 1px rgba(119,140,162,0.16);"
      borderRadius={theme === 'deep' ? '0' : '12px'}
      top="14"
      zIndex={3}
      bg={theme === 'deep' ? 'emgc.blue.800' : 'pri.white.100'}
      w="75"
      ref={boxRef}
    >
      <Spin spin={loading}>
        <Accordion
          allowMultiple
          py="1.5"
          onChange={setLayerListExpandedIndex}
          index={layerListExpandedIndex}
        >
          <Box ref={domWarp} h="120">
            {layers.map((item, index) => {
              return (
                <AccordionItem
                  _last={{ borderBottomWidth: 0 }}
                  key={item.id}
                  borderBottomWidth="0"
                  borderTopWidth="0"
                >
                  <AccordionButton>
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontWeight="bold"
                      color={theme === 'deep' ? 'emgc.white.100' : ''}
                    >
                      {item.layerName}
                    </Box>
                    <AccordionIcon color={theme === 'deep' ? 'emgc.white.100' : ''} />
                  </AccordionButton>
                  <AccordionPanel p="0">
                    {item.children.map((layer) => {
                      const isChecked = checkedLayers.includes(layer.id);

                      let color = '';

                      if (theme === 'deep') {
                        if (isChecked) {
                          color = 'emgc.blue.400';
                        } else {
                          color = 'emgc.white.100';
                        }
                      } else {
                        if (isChecked) {
                          color = 'pri.blue.100';
                        } else {
                          color = 'pri.dark.500';
                        }
                      }

                      const img = spriteJson[layer.icon + '_p'];
                      const img_h = spriteJson[layer.icon + '_p_h'];
                      //没有数据的图层不显示
                      // if (!layer.resourceCount && layer.layerCode !== 'StaffLayer') {
                      //   return null;
                      // }
                      return (
                        <HStack
                          onClick={() => toggle(layer)}
                          key={layer.id}
                          borderRadius="12px"
                          my="1"
                          p="2.5"
                          //bg="pri.gray.500"
                          //_hover={{ color: 'pri.dark.100' }}
                          color={color}
                          cursor="pointer"
                        >
                          {img ? (
                            <Box
                              w={`${isChecked ? img_h.width : img.width}px`}
                              h={`${isChecked ? img_h.height : img.height}px`}
                              backgroundImage={`url(${process.env.NEXT_PUBLIC_ANALYTICS_Map}/styles/baseMap/sprite.png)`}
                              backgroundPosition={
                                isChecked
                                  ? `-${img_h.x}px  -${img_h.y}px`
                                  : `-${img.x}px  -${img.y}px`
                              }
                            />
                          ) : (
                            <Box />
                          )}

                          <Box>
                            {layer.layerName}
                            {layer.resourceCount ? `(${layer.resourceCount})` : ''}
                          </Box>
                        </HStack>
                      );
                    })}
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Box>
        </Accordion>
      </Spin>
    </Box>
  );
};

export default LayerList;
