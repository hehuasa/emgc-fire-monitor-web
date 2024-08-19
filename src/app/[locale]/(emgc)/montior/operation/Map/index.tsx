import AreaFloors from '@/app/(emgc)/emgc/montior/operation/AreaFloors';
import { CircleClose, PhoneIcon } from '@/components/Icons';
import { mapOp } from '@/components/Map';
import Marker from '@/components/L7Map/Marker';
import Popup from '@/components/L7Map/Popup';
import {
  alarmTypeModel,
  currentAlarmModel,
  currentAlarmStatusModel,
  dealAlarmModalVisibleModal,
  foldModel,
} from '@/models/alarm';
import { callNumberVisibleModel } from '@/models/callNumber';
import { currentAreaFloorsModel, IArea, isInIconModel, isSpaceQueryingModel } from '@/models/map';
import { currentResModel, IResItem } from '@/models/resource';
import { genHoverLayerIconId } from '@/utils/mapUtils';
import { request } from '@/utils/request';
import { Box, Flex, HStack } from '@chakra-ui/react';
import {
  center,

  featureCollection,
  lineString,
  point,
  polygon,
} from '@turf/turf';
import { useMemoizedFn, useUnmount } from 'ahooks';

import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { IAlarmClusterItem } from '../page';
import LaryerInit, { IL7LayerEventTarget } from './LaryerInit';
import RightClickMenu from './RightClickMenu';
import MapLibreMap from '@/components/L7Map/MapLibreMap';
import { Scene } from '@antv/l7';
import { useTranslations } from 'next-intl';
import { FeatureCollection, LineString, Point, Polygon, Position } from 'geojson';

const { clusterZoom, flyToZoom } = mapOp;

interface IProps {
  getMapObj: ({ scene }: { scene: Scene }) => void;
}

const Map = ({ getMapObj }: IProps) => {
  const mapRef = useRef<null | maplibregl.Map>(null);
  const formatMessage = useTranslations('alarm');

  const mapSceneRef = useRef<null | Scene>(null);
  const [mapScene, setMapScene] = useState<null | Scene>(null);
  const setCallNumberShow = useSetRecoilState(callNumberVisibleModel);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentAlarm, setCurrentAlarmDeatil] = useRecoilState(currentAlarmModel);
  const [currentAreaClusterData, setcurrentAreaClusterData] = useState<null | IAlarmClusterItem>(
    null
  );
  const alarmStatus = useRecoilValue(currentAlarmStatusModel);
  const alarmTypes = useRecoilValue(alarmTypeModel);
  const setFold = useSetRecoilState(foldModel);

  const setDealAlarmVisible = useSetRecoilState(dealAlarmModalVisibleModal);

  // 多楼层数据
  const setCurrentAreaFloors = useSetRecoilState(currentAreaFloorsModel);

  // 鼠标是否移入图标
  const inInIcon = useRecoilValue(isInIconModel);
  // 鼠标是否移入图标----增加一个ref控制，方便本组件内部共享
  const isIconRef = useRef(false);

  const isSpaceQuerying = useRecoilValue(isSpaceQueryingModel);

  const [currentAreaData, setCurrentAreaData] = useState<IArea | null>(null);



  // 地图气泡窗（聚合）
  const [showPopup, setShowPopup] = useState(false);
  const [popuplnglat, setPopupLngLat] = useState([0, 0]);
  // 地图气泡窗（区域信息）
  const [showAreaPopup, setAreaShowPopup] = useState(false);
  const [areaPopuplnglat, setAreaPopupLngLat] = useState([0, 0]);

  // 地图右键控制
  const [showMapRightMenu, setMapRightMenuShow] = useState(false);
  const showMapRightMenuRef = useRef(false);
  const [rightMenulnglat, setRightMenulnglat] = useState([0, 0]);
  //鼠标右键点击的区域
  const rightMenuAreaName = useRef<{ areaName: string; latlng: number[]; areaId: string }>({
    areaName: '',
    latlng: [0, 0],
    areaId: '',
  });

  const currentRes = useRecoilValue(currentResModel);

  // 监听是否进行查周边，用以是否阻止相关图层的鼠标事件
  const isSpaceQueryingRef = useRef(isSpaceQuerying);
  const alarmStatusRef = useRef(alarmStatus);
  const alarmGroupRef = useRef(alarmTypes);

  //楼层数据
  const currentAreaFloors = useRecoilValue(currentAreaFloorsModel);

  // 同时设置组件内外，是否移入资源、报警图标的状态
  // const setIsInIcon = (isIn: boolean) => {
  //   setIsInIcon_(isIn);
  //   useInIconRef.current = isIn
  // }
  useEffect(() => {
    isIconRef.current = inInIcon;
  }, [inInIcon]);

  useEffect(() => {
    isSpaceQueryingRef.current = isSpaceQuerying;
  }, [isSpaceQuerying]);

  useEffect(() => {
    alarmStatusRef.current = alarmStatus;
  }, [alarmStatus]);

  useEffect(() => {
    alarmGroupRef.current = alarmTypes;
  }, [alarmTypes]);

  const getMapObj_ = (scene: Scene) => {
    mapSceneRef.current = scene;

    setMapLoaded(true);

    // 地图右键点击
    // scene.on('contextmenu', genMapRightMenuFun);
    scene.on('click', genMapClick);
  };
  const layerInitCallBack = () => {
    getMapObj({ scene: mapSceneRef.current as Scene });

  }
  useUnmount(() => {
    // 清理注册的地图事件
    if (mapRef.current) {
      // mapRef.current.off('contextmenu', genMapRightMenuFun);
      mapRef.current.off('click', genMapClick);
    }
  });

  // 封装右键点击对hook的改变(state 以及 ref )
  const changeMapRightMenuShow = (show: boolean) => {
    setMapRightMenuShow(show);
    showMapRightMenuRef.current = show;
  };
  // 地图左键点击事件
  const genMapClick = () => {
    if (showMapRightMenuRef.current) {
      changeMapRightMenuShow(false);
      setRightMenulnglat([0, 0]);
    }
  };
  // 地图右键事件
  const genMapRightMenuFun = (e: IL7LayerEventTarget) => {


    if (e.feature && e.feature.properties) {
      rightMenuAreaName.current.areaName = e.feature.properties.areaName;
      rightMenuAreaName.current.areaId = e.feature.properties.areaId;
      rightMenuAreaName.current.latlng = e.lngLat.toArray();

      setRightMenulnglat(e.lngLat.toArray());
      changeMapRightMenuShow(true);
    }
  };

  // 当前选中报警
  useEffect(() => {
    if (mapRef.current && currentAlarm !== null && currentAlarm.coordinate?.coordinates) {
      setFold(false);
      // const level = currentAlarm.alarmLevel === 'null' || currentAlarm.alarmLevel === null ? '09' : currentAlarm.alarmLevel;
      const source = mapRef.current.getSource('alarmIcon_h') as maplibregl.GeoJSONSource;

      const { type } = currentAlarm.coordinate;

      let fea;

      if (type === 'LineString') {
        fea = lineString(currentAlarm.coordinate.coordinates as unknown as Position[], {
          layerId: genHoverLayerIconId(currentAlarm),
          ...currentAlarm,
        });
      } else if (type === 'Polygon') {
        fea = polygon(currentAlarm.coordinate.coordinates as unknown as Position[][], {
          layerId: genHoverLayerIconId(currentAlarm),
          ...currentAlarm,
        });
      } else {
        fea = point(currentAlarm.coordinate.coordinates, {
          layerId: genHoverLayerIconId(currentAlarm),
          ...currentAlarm,
        });
      }
      const center_ = center(fea.geometry, {
        properties: {
          layerId: genHoverLayerIconId(currentAlarm),
          ...currentAlarm,
        },
      });
      const fes = [fea];
      // 非点图层，点击后在中心点画一个图标，周界除外
      if (
        type !== 'Point' &&
        currentAlarm.alarmType !== 'PON' &&
        currentAlarm.alarmType !== 'PON_M'
      ) {
        fes.push(center_);
      }

      const sourcedata = featureCollection<LineString | Point | Polygon>(fes);

      console.log('sourcedatasourcedata', sourcedata);

      source.setData(sourcedata as unknown as GeoJSON.GeoJSON);

      //地图跳转
      try {
        mapRef.current.flyTo({
          center: center_.geometry.coordinates as LngLatLike,
          zoom: flyToZoom,
        });
      } catch (e) {
        console.log('eeeeeerrror', e);
      }

      setPopupLngLat(currentAlarm.coordinate.coordinates);
    } else {
      if (mapRef.current && currentAlarm === null) {
        setShowPopup(false);

        setPopupLngLat([0, 0]);

        const source = mapRef.current.getSource('alarmIcon_h') as maplibregl.GeoJSONSource;

        const sourcedata = featureCollection([]);

        source.setData(sourcedata as unknown as GeoJSON.GeoJSON);
      }
    }
  }, [currentAlarm]);

  // 监听 currentRes ，绘制选中的资源图标
  useEffect(() => {
    if (mapRef.current && currentRes) {
      const source = mapRef.current.getSource('currentReslayer_h') as maplibregl.GeoJSONSource;
      if (source) {
        const coordinate = JSON.parse(
          JSON.stringify(currentRes.coordinate)
        ) as IResItem['coordinate'];
        let newCoordinate: Point | LineString | Polygon;
        if (typeof coordinate === 'string') {
          newCoordinate = JSON.parse(coordinate);
        } else {
          newCoordinate = coordinate;
        }

        if (newCoordinate.coordinates) {
          const { type } = newCoordinate;

          setFold(false);
          let fea;
          switch (type) {
            case 'Point':
              fea = point(newCoordinate.coordinates as unknown as Position, {
                ...currentRes,
                icon: currentRes.icon + '_h',
              });
              break;
            case 'LineString':
              fea = lineString(newCoordinate.coordinates as unknown as Position[], {
                ...currentRes,
                icon: currentRes.icon + '_h',
              });
              break;
            case 'Polygon':
              fea = polygon(newCoordinate.coordinates as unknown as Position[][], {
                ...currentRes,
                icon: currentRes.icon + '_h',
              });
              break;
            default:
              break;
          }

          if (fea) {
            const center_ = center(fea, { properties: fea.properties });

            const sourcedata = featureCollection<LineString | Point | Polygon>([center_]);
            console.info('============sourcedata==============', sourcedata);
            source.setData(sourcedata as unknown as GeoJSON.GeoJSON);
            //地图跳转
            try {
              mapRef.current.flyTo({
                center: center_.geometry.coordinates as LngLatLike,
                zoom: flyToZoom,
              });
            } catch (e) {
              console.log('eeeeeerrror', e);
            }
          }
        }
      }
    } else {
      if (mapRef.current) {
        const source = mapRef.current.getSource('currentReslayer_h') as maplibregl.GeoJSONSource;
        source?.setData?.(featureCollection([]));
      }
    }
  }, [currentRes]);

  // 区域点击事件
  const handleAreaClick = useMemoizedFn(
    (
      e: IL7LayerEventTarget
    ) => {
      if (isSpaceQueryingRef.current) {
        return;
      }

      if (showPopup) {
        return;
      }
      if (isIconRef.current) {
        return;
      }
      if (e.feature && e.feature.properties) {
        const area = e.feature.properties;

        console.log('area', area);
        // area.centralPoint = JSON.parse(features[0].properties.centralPoint);
        getAreaFloors(area, area.centralPoint.coordinates);
      }
    }
  );

  const handleClusterMouseleave = () => {
    if (isSpaceQueryingRef.current) {
      return;
    }
    setShowPopup(false);
    setcurrentAreaClusterData(null);
    setPopupLngLat([0, 0]);
  };

  const handlePopupClose = () => {
    setShowPopup(false);

    setPopupLngLat([0, 0]);
    setCurrentAlarmDeatil(null);
  };

  // 聚合的鼠标交互
  const hoveAreaCluster = (currentAreaClusterData: IAlarmClusterItem, popuplnglat: number[]) => {
    setcurrentAreaClusterData(currentAreaClusterData);
    setPopupLngLat(popuplnglat);
    setShowPopup(true);
  };

  // 打开区域信息窗时
  const getAreaFloors = async (currentAreaData_: IArea, popuplnglat: number[]) => {
    // 如果有多楼层，请求楼层信息
    if (currentAreaData) {
      if (currentAreaData.areaId !== currentAreaData_.areaId) {
        setCurrentAreaFloors([]);
        if (currentAreaData_.hasMulFloors !== 1) {
          request({
            url: `/cx-alarm/dc/area/areaMap/floors?areaId=${currentAreaData_.areaId}`,
          }).then((res) => {
            const areaMapRes = res as unknown as FeatureCollection<Polygon, IArea>;

            // 默认一楼选中
            const areas = [{ ...currentAreaData_, isChecked: true }];
            if (!areaMapRes.features) {
              return;
            }
            for (const area of areaMapRes.features) {
              const constNewArea = { ...area.properties, isChecked: false };
              areas.push(constNewArea);
            }

            setCurrentAreaFloors(areas);
          });
        }
      }
    } else {
      setCurrentAreaFloors([]);

      request({ url: `/cx-alarm/dc/area/areaMap/floors?areaId=${currentAreaData_.areaId}` }).then(
        (res) => {
          const areaMapRes = res as unknown as FeatureCollection<Polygon, IArea>;

          // 默认一楼选中
          const areas = [{ ...currentAreaData_, isChecked: true }];
          if (!areaMapRes.features) {
            return;
          }
          for (const area of areaMapRes.features) {
            const constNewArea = { ...area.properties, isChecked: false };
            areas.push(constNewArea);
          }

          setCurrentAreaFloors(areas);
        }
      );
    }

    setCurrentAreaData(currentAreaData_);
    setAreaPopupLngLat(popuplnglat);
    setAreaShowPopup(true);
  };

  //   区域信息窗关闭
  const handleAPopupClose = () => {
    setAreaShowPopup(false);

    setAreaPopupLngLat([0, 0]);
    setCurrentAreaData(null);
  };

  // 高亮区域
  const mouseInArea = (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    const geom = polygon(e.features[0].geometry.coordinates);
    const source = mapRef.current?.getSource('area_hover') as maplibregl.GeoJSONSource;

    source.setData(featureCollection([geom]) as GeoJSON.GeoJSON);
  };

  // 取消高亮区域
  const mouseOutArea = () => {
    const source = mapRef.current?.getSource('area_hover') as maplibregl.GeoJSONSource;

    source.setData(featureCollection([]) as GeoJSON.GeoJSON);
  };

  return (
    <>
      {/*   {showPopup && mapRef.current && currentAreaClusterData && ( */}
      <MapLibreMap getMapScence={getMapObj_} />
      {mapLoaded && mapSceneRef.current && (
        <LaryerInit
          scene={mapSceneRef.current}
          handleAreaClick={handleAreaClick}
          genMapRightMenuFun={genMapRightMenuFun}
          hoveAreaCluster={hoveAreaCluster}
          layerInitCallBack={layerInitCallBack}
          handleClusterMouseleave={handleClusterMouseleave}
        />
      )}

      {showPopup && mapRef.current && currentAreaClusterData && (
        <Popup

          lngLat={popuplnglat}
          onClose={handlePopupClose}

        >
          <div
            onMouseEnter={() => {
              hoveAreaCluster(currentAreaClusterData, popuplnglat);
            }}
            onMouseLeave={handlePopupClose}
            className='text-base rounded-lg pt-3 px-4'
            style={{
              boxShadow: '0px 3px 6px 1px rgba(0,0,0,0.16);',
            }}

          >
            {currentAreaClusterData.countDetails.map((item, index) => {
              return (
                <div key={item.alarmTypeName + index}>
                  <div className='flex justify-between items-center h-7'>
                    <HStack>
                      <Box borderRadius="50%" bg="pri.red.100" w="1.5" h="1.5"></Box>
                      <HStack>
                        <Box>{item.alarmTypeName}</Box>
                        <Box fontWeight={600}>:</Box>
                      </HStack>
                    </HStack>

                    <Box ml="2" color="pri.red.100">
                      {item.count}
                    </Box>
                  </div>
                </div>
              );
            })}
            {alarmStatus == '01' && (
              <Box
                borderTopWidth="1px"
                borderTopColor="pri.gray.300"
                lineHeight="44px"
                color="pri.blue.100"
                cursor="pointer"
                textAlign="center"
                _hover={{ color: 'pri.blue.200' }}
                onClick={() => {
                  setDealAlarmVisible({ visible: true, param: { currentAreaClusterData } });
                }}
              >
                {formatMessage('alarm.deal.muti')}
              </Box>
            )}


          </div>
        </Popup>
      )}

      {showAreaPopup && mapRef.current && currentAreaData && (
        <Popup
          maxWidth="none"
          closeButton={false}
          map={mapRef.current}
          onClose={handleAPopupClose}
          closeOnClick={false}
          longitude={areaPopuplnglat[0]}
          latitude={areaPopuplnglat[1]}
        >
          <Box fontSize="16px" borderRadius="10px" minW="60">
            <Flex
              bg="pri.yellow.200"
              justify="space-between"
              align="center"
              color="pri.dark.100"
              h="10"
              px="2.5"
              overflow="hidden"
              whiteSpace="nowrap"
              fontWeight="bold"
              borderTopRadius="10px"
            >
              <Box>{currentAreaData.areaName}</Box>
              <CircleClose
                _hover={{ fill: 'pri.blue.100' }}
                w={4}
                h={4}
                fill="pri.dark.100"
                cursor="pointer"
                opacity="0.8"
                onClick={handleAPopupClose}
              />
            </Flex>
            {currentAreaFloors.length > 0 && <AreaFloors map={mapRef.current} />}
            <HStack p={2} alignItems="flex-start" pb={0}>
              <Box color="pri.dark.300" justifyContent="flex-start">
                {formatMessage('alarm.director.user')} :
              </Box>
              <HStack color="pri.dark.100" flex={1}>
                {currentAreaData.chargeInfo?.split(',')?.map((item) => {
                  return (
                    <React.Fragment key={item}>
                      <Flex
                        color="pri.blue.100"
                        cursor="pointer"
                        textAlign="center"
                        _hover={{ color: 'pri.blue.200' }}
                        onClick={(e) => {
                          const info = item;
                          if (info) {
                            const name = info.split(' ')[0];
                            const number = info.split(' ')[1];
                            setCallNumberShow({ visible: true, name, number });
                          }
                        }}
                      >
                        {item}
                        <PhoneIcon ml="1" color="pri.green.200" />
                      </Flex>
                    </React.Fragment>
                  );
                })}
              </HStack>
            </HStack>
            <HStack p={2}>
              <Box color="pri.dark.300">{formatMessage('alarm.director.org')} : </Box>
              <Box color="pri.dark.100">{currentAreaData.deptName}</Box>
            </HStack>

          </Box>
        </Popup>
      )}
      {showMapRightMenu && mapRef.current && (
        <Marker longitude={rightMenulnglat[0]} latitude={rightMenulnglat[1]} map={mapRef.current}>
          <RightClickMenu close={() => setMapRightMenuShow(false)} {...rightMenuAreaName.current} />
        </Marker>
      )}



    </>
  );
};

export default Map;
