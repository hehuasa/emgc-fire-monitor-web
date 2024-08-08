'use client';
import LeftPanel from '@/app/(emgc)/emgc/montior/operation/LeftPanel';
import Videos from '@/app/(emgc)/emgc/montior/operation/Videos';
import { mapOp } from '@/components/Map';
import AccessControl from '@/components/MapTools/AccessControl';
import Broadcast from '@/components/MapTools/Broadcast';
import { IUeMap } from '@/components/UeMap';
import Wenet from '@/components/Wenet';
import {
  alarmDepartmentModel,
  alarmListModel,
  alarmTypeModel,
  currentAlarmStatusModel,
  IAlarm,
  IAlarmStatus,
  lastUpdateAlarmTimeModel,
  lastUpdateAlarmTimeWithNotNewModel,
} from '@/models/alarm';
import { IArea, isSpaceQueryingModel, MapContext, UpdateAlarmfnContext } from '@/models/map';
import { genAlarmClusterData, genAlarmIcons, genAlarmLineIcons } from '@/utils/mapUtils';
import { request } from '@/utils/request';
import { genUmapIcons } from '@/utils/umapUtils';
import { Box, Flex } from '@chakra-ui/react';
import { featureCollection, FeatureCollection, Point, Polygon } from '@turf/turf';
import { useMount, useUnmount } from 'ahooks';
import dynamic from 'next/dynamic';
import { stringify } from 'qs';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import UeMap from './UeMap';

const MapToolBar = dynamic(() => import('@/components/MapTools/MaptoolBar'), { ssr: false });
const BaseMap = dynamic(() => import('./Map'), { ssr: false });

export interface IAlarmClusterItem {
  alarmCount: number;
  areaId: string;
  areaName: string;
  centralPoint: Point;
  floorLevel: string;
  areaCode: string;
  countDetails: {
    alarmType: string;
    alarmTypeName: string;
    count: number;
  }[];
  deptName: string;
}

const Page = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<null | maplibregl.Map>(null);
  const [mapObj, setMapObj] = useState<null | maplibregl.Map>(null);
  const spaceQuerySquare = useRecoilValue(isSpaceQueryingModel);
  const [mapType, setMapType] = useState<'3d' | '2d'>(
    process.env.NEXT_PUBLIC_ANALYTICS_mapType as '2d'
  );

  const setAlarmList = useSetRecoilState(alarmListModel);
  const lastUpdateAlarmTime = useRecoilValue(lastUpdateAlarmTimeModel);
  // 报警太频繁，非首次报警，5秒更新一次
  const lastUpdateAlarmTimeWithNotNew = useRecoilValue(lastUpdateAlarmTimeWithNotNewModel);
  const alarmTypes = useRecoilValue(alarmTypeModel);
  const alarmDepartment = useRecoilValue(alarmDepartmentModel);

  const currentAlarmStatus = useRecoilValue(currentAlarmStatusModel);
  const isGetAlarmList = useRef(false);

  // 报警列表
  const getAlalrmList = async ({
    currentAlarmStatus_,
    alarmTypes_,
    alarmDepartment_,
  }: {
    currentAlarmStatus_: IAlarmStatus;
    alarmTypes_: string;
    alarmDepartment_: string;
  }) => {
    const obj = {
      status: currentAlarmStatus_,
      alarmTypes: alarmTypes_ === '' ? 'null' : alarmTypes_,
      dept_id: alarmDepartment_,
    };

    const param = stringify(obj, { indices: false });
    const res = await request<IAlarm[]>({ url: `/cx-alarm/alm/alarm/findList?${param}` });

    if (res.code === 200) {
      setAlarmList(res.data);
      // 3d 地图绘制图标
      if (ueMapRef.current && ueMapRef.current.emitMessage) {
        const newList = genUmapIcons(res.data);
        console.info('=========emitMessage=================', newList);
        // setTimeout(() => {
        ueMapRef.current.emitMessage({
          type: 'alarmList',
          values: newList,
        });
        // }, 5 * 1000);

        return;
      }
      // 函数式的方式绘制、或更新地图图标。原因是报警列表数据量可能很大，进行hook依赖监听成本高
      if (mapRef.current && mapRef.current.getSource) {
        const featureCollections = genAlarmIcons(res.data);
        const source = mapRef.current.getSource('alarmIcon') as maplibregl.GeoJSONSource;
        source?.setData(featureCollections as GeoJSON.GeoJSON);

        // 周界报警，动画图层
        const genAlarmLineIconsSources = genAlarmLineIcons(res.data);
        const centerPointsource = mapRef.current.getSource(
          'alarmLineCenterPoint'
        ) as maplibregl.GeoJSONSource;
        centerPointsource?.setData(genAlarmLineIconsSources as unknown as GeoJSON.GeoJSON);

        // const line = mapRef.current.getLayer("alarmLineAndPerson") as any;
        // if (line) {
        //   line.implementation.update(featureCollections)
        // }

        // const lineNear = mapRef.current.getLayer("alarmLineAndPerson_near") as any;
        // if (lineNear) {
        //   lineNear.implementation.update(featureCollections)
        // }
      }
    }
  };

  const updateAlarmCluster = async ({
    currentAlarmStatus_,
    alarmTypes_,
    alarmDepartment_,
  }: {
    currentAlarmStatus_: IAlarmStatus;
    alarmTypes_: string;
    alarmDepartment_: string;
  }) => {
    const obj = {
      status: currentAlarmStatus_,
      alarmTypes: alarmTypes_ === '' ? 'null' : alarmTypes_,
      dept_id: alarmDepartment_,
    };

    const param = stringify(obj, { indices: false });
    const url = `/cx-alarm/alm/alarm/alarmMap?${param}`;

    const res = (await request({ url })) as unknown as FeatureCollection<
      Polygon,
      IAlarmClusterItem
    >;

    const alarmCluster_count = mapRef.current?.getSource(
      'alarmCluster_count'
    ) as maplibregl.GeoJSONSource;

    if (alarmCluster_count && res.features) {
      const featureCollections = genAlarmClusterData(res.features);
      alarmCluster_count.setData(featureCollections as GeoJSON.GeoJSON);
    }
  };

  const currentAlarmStatusRef = useRef(currentAlarmStatus);
  useEffect(() => {
    currentAlarmStatusRef.current = currentAlarmStatus;
  }, [currentAlarmStatus]);

  // 监听 lastUpdateAlarmTime， 更新地图报警聚合数据
  useEffect(() => {
    if (lastUpdateAlarmTime) {
      let alarmGroup = '';
      if (mapRef.current) {
        const newG = alarmTypes.filter((val) => val.isChecked);
        for (const [index, { alarmType }] of newG.entries()) {
          alarmGroup += index < newG.length - 1 ? `${alarmType},` : `${alarmType}`;
        }

        updateAlarmCluster({
          currentAlarmStatus_: currentAlarmStatusRef.current,
          alarmTypes_: alarmGroup,
          alarmDepartment_: alarmDepartment,
        });
        getAlalrmList({
          currentAlarmStatus_: currentAlarmStatusRef.current,
          alarmTypes_: alarmGroup,
          alarmDepartment_: alarmDepartment,
        });
      }
      if (ueMapRef.current) {
        getAlalrmList({
          currentAlarmStatus_: currentAlarmStatusRef.current,
          alarmDepartment_: alarmDepartment,
          alarmTypes_: alarmGroup,
        });
      }
    }
  }, [lastUpdateAlarmTime]);

  // 报警太频繁，非首次报警，5秒更新一次
  useEffect(() => {
    if (lastUpdateAlarmTimeWithNotNew) {
      let alarmGroup = '';
      if (mapRef.current) {
        const newG = alarmTypes.filter((val) => val.isChecked);
        for (const [index, { alarmType }] of newG.entries()) {
          alarmGroup += index < newG.length - 1 ? `${alarmType},` : `${alarmType}`;
        }

        updateAlarmCluster({
          currentAlarmStatus_: currentAlarmStatusRef.current,
          alarmTypes_: alarmGroup,
          alarmDepartment_: alarmDepartment,
        });
        getAlalrmList({
          currentAlarmStatus_: currentAlarmStatusRef.current,
          alarmTypes_: alarmGroup,
          alarmDepartment_: alarmDepartment,
        });
      }
      if (ueMapRef.current) {
        getAlalrmList({
          currentAlarmStatus_: currentAlarmStatusRef.current,
          alarmTypes_: alarmGroup,
          alarmDepartment_: alarmDepartment,
        });
      }
    }
  }, [lastUpdateAlarmTimeWithNotNew]);

  // 获取区域数据
  const getAreaDatas = async () => {
    if (mapRef.current) {
      const url = `/cx-alarm/dc/area/areaMap`;
      const res = (await request({ url })) as unknown as FeatureCollection<Polygon, IArea>;
      res.features = res.features?.filter((item) => item.geometry.type);
      const alarmCluster_fill = mapRef.current.getSource('area_fill') as maplibregl.GeoJSONSource;
      if (alarmCluster_fill) {
        alarmCluster_fill.setData(
          featureCollection(
            res.features?.filter((val) => val.properties.floorLevel === '1')
          ) as GeoJSON.GeoJSON
        );
      }
    }
  };
  const getMapObj = ({ map }: { map: maplibregl.Map }) => {
    console.log('getMapObj', map);
    setMapObj(map);
    mapRef.current = map;

    setMapLoaded(true);

    getAreaDatas();

    if (centerRef.current.lng) {
      mapRef.current.flyTo({
        center: [centerRef.current.lng, centerRef.current.lat],
        zoom: mapOp.flyToZoom,
      });
    }
  };

  //页面加成成功时获取报警列表和聚合 只执行一次
  //alarmTypes有可能在页面加载完成的时候有可能没有值，所以用在effect里面
  useEffect(() => {
    if (mapLoaded && alarmTypes && alarmTypes.length && !isGetAlarmList.current) {
      updateAlarmCluster({
        currentAlarmStatus_: currentAlarmStatus,
        alarmTypes_: alarmTypes.map((item) => item.alarmType).join(','),
        alarmDepartment_: alarmDepartment,
      });
      getAlalrmList({
        currentAlarmStatus_: currentAlarmStatus,
        alarmTypes_: alarmTypes.map((item) => item.alarmType).join(','),
        alarmDepartment_: alarmDepartment,
      });

      isGetAlarmList.current = true;
    }
  }, [alarmTypes, mapLoaded]);

  // 3d地图注册
  const ueMapRef = useRef<IUeMap | null>(null);

  // 2、3 d 地图中心
  const centerRef = useRef<{ lat: number; lng: number; height: number }>({
    lat: 0,
    lng: 0,
    height: 0,
  });
  // 3d地图，暂不做聚合相关
  const getUeMapObj = ({ map }: { map: IUeMap }) => {
    //console.clear();

    ueMapRef.current = map;
    setMapLoaded(true);
    getAlalrmList({
      currentAlarmStatus_: currentAlarmStatus,
      alarmDepartment_: alarmDepartment,
      alarmTypes_: alarmTypes.map((item) => item.alarmType).join(','),
    });

    // 2 3 d地图中心联动
    if (centerRef.current.lat > 0 && ueMapRef.current.emitMessage) {
      console.info('============centerRef.current==============', centerRef.current);
      ueMapRef.current.emitMessage({
        type: 'center',
        values: centerRef.current,
      });
    }

    // 3 d地图中心
    if (ueMapRef.current && ueMapRef.current.addEventListener) {
      ueMapRef.current.addEventListener('message', ({ detail }) => {
        if (detail && detail === 'connecting!') {
          return;
        }
        console.info('============detail==============', detail);

        const msg = JSON.parse(detail);

        console.info('============msg==============', msg);
        if (msg && msg.type && msg.type === 'center') {
          const obj = msg.values;

          centerRef.current.lat = obj.lat;
          centerRef.current.lng = obj.lng;
        }
      });
    }
  };

  const changeMapType = (type: '2d' | '3d') => {
    if (type === '2d' && mapRef.current) {
      const center = mapRef.current.getCenter().toArray();
      centerRef.current.lat = center[1];
      centerRef.current.lng = center[0];
      // mapRef.current = null
    } else {
      if (ueMapRef.current && ueMapRef.current.emitMessage) {
        ueMapRef.current.emitMessage({
          type: 'disconnect',
          values: '',
        });
      }
    }
    if (type === '3d') {
      disable3dMap();
    } else {
      disable2dMap();
    }
    requestAnimationFrame(() => {
      setMapType(type === '3d' ? '2d' : '3d');
    });
  };

  const disable2dMap = () => {
    console.info('===========disable2dMap===============');

    setMapLoaded(false);
    setMapObj(null);
    isGetAlarmList.current = false;
    mapRef.current = null;
  };
  const disable3dMap = () => {
    console.info('===========disable3dMap===============');
    ueMapRef.current = null;
    setMapLoaded(false);
    isGetAlarmList.current = false;
  };
  useMount(() => {
    if (window) {
      window.gpsTimer = null;
    }
  });
  useUnmount(() => {
    disable2dMap();
    disable3dMap();

    if (gpsTimer) {
      clearInterval(gpsTimer);
      gpsTimer = null;
    }
  });
  return (
    <Box
      h="full"
      position="relative"
      css={{
        '&  .maplibregl-canvas': {
          cursor: spaceQuerySquare ? 'default' : 'pointer',
        },
      }}
    >
      <Wenet />

      {process.env.NEXT_PUBLIC_ANALYTICS_debug3d && (
        <Flex
          position="absolute"
          bottom="72"
          right={9}
          boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
          borderRadius="10px"
          justifyContent="center"
          align="center"
          w="10"
          h="10"
          zIndex={2}
          bg="pri.white.100"
          cursor="pointer"
          _hover={{ stroke: 'pri.blue.100' }}
          onClick={() => {
            changeMapType(mapType);
          }}
        >
          {mapType === '3d' ? <Box>2d</Box> : <Box>3d</Box>}
        </Flex>
      )}

      {mapType === '2d' && <BaseMap getMapObj={getMapObj} />}
      {mapType === '2d' && mapLoaded && mapRef.current && (
        <UpdateAlarmfnContext.Provider value={{ getAlalrmList, updateAlarmCluster }}>
          <MapContext.Provider value={mapObj}>
            <LeftPanel />
            <MapToolBar />
            <Videos />
          </MapContext.Provider>
        </UpdateAlarmfnContext.Provider>
      )}

      {mapType === '3d' && <UeMap getMapObj={getUeMapObj} />}
      {mapType === '3d' && (
        <UpdateAlarmfnContext.Provider value={{ getAlalrmList, updateAlarmCluster }}>
          <LeftPanel />
          <MapToolBar />
          <Videos />
        </UpdateAlarmfnContext.Provider>
      )}

      {/* <Flex
        position="absolute"
        bottom="72"
        right={9}
        boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
        borderRadius="10px"
        justifyContent="center"
        align="center"
        w="10"
        h="10"
        zIndex={2}
        bg="pri.white.100"
        cursor="pointer"
        _hover={{ stroke: 'pri.blue.100' }}
        onClick={() => {
          changeMapType(mapType);
        }}
      >
        {mapType === '3d' ? <Box>2d</Box> : <Box>3d</Box>}
      </Flex> */}

      {/* <UeMap getUeMapObj={getUeMapObj} />
      <LeftPanel />
      <Videos /> */}
      {/* 广播 */}
      <Broadcast />
      {/* 门禁 */}
      <AccessControl />
    </Box>
  );
};

export default Page;
