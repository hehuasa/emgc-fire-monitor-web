'use client';

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
import { IArea, MapSceneContext, UpdateAlarmfnContext } from '@/models/map';
import { genAlarmClusterData, genAlarmIcons, genAlarmLineIcons } from '@/utils/mapUtils';
import { request } from '@/utils/request';
import { featureCollection } from '@turf/turf';
import { useUnmount } from 'ahooks';
import dynamic from 'next/dynamic';
import { stringify } from 'qs';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { FeatureCollection, Point, Polygon } from 'geojson';
import { Scene } from '@antv/l7';
import Videos from './Videos';

// const MapToolBar = dynamic(() => import('@/components/MapTools/MaptoolBar'), { ssr: false });
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
  const mapSceneRef = useRef<null | Scene>(null);
  const [mapScene, setMapScene] = useState<null | Scene>(null);

  const [mapObj, setMapObj] = useState<null | maplibregl.Map>(null);


  const setAlarmList = useSetRecoilState(alarmListModel);
  const lastUpdateAlarmTime = useRecoilValue(lastUpdateAlarmTimeModel);
  // 报警太频繁，非首次报警，5秒更新一次
  const lastUpdateAlarmTimeWithNotNew = useRecoilValue(lastUpdateAlarmTimeWithNotNewModel);
  const alarmTypes = useRecoilValue(alarmTypeModel);
  const alarmDepartment = useRecoilValue(alarmDepartmentModel);

  const currentAlarmStatus = useRecoilValue(currentAlarmStatusModel);
  const isGetAlarmList = useRef(false);

  // 报警列表
  const getAlalrmList = async () => {


    const res = await request<IAlarm[]>({
      url: `/mock/alarmList.json`,
    });

    if (res.code === 200) {
      setAlarmList(res.data);
      // 函数式的方式绘制、或更新地图图标。原因是报警列表数据量可能很大，进行hook依赖监听成本高
      if (mapSceneRef.current) {
        const featurePointCollections = genAlarmIcons(res.data);
        const featureLineCollections = genAlarmIcons(res.data);

        console.info('============featurePointCollections==============', featurePointCollections);

        const genAlarmLineIconsSources = genAlarmLineIcons(res.data);

        const alarmIconLayer = mapSceneRef.current?.getLayerByName('alarmIconLayer');
        const alarmLineLayer = mapSceneRef.current?.getLayerByName('alarmLineLayer');
        const alarmLineCenterPointLayer = mapSceneRef.current?.getLayerByName(
          'alarmLineCenterPointLayer'
        );

        featurePointCollections.features = featurePointCollections.features.filter(
          (val) => val.geometry && val.geometry.type === 'Point'
        );
        featureLineCollections.features = featureLineCollections.features.filter(
          (val) => val.geometry && val.geometry.type === 'LineString'
        );

        alarmIconLayer?.setData(featurePointCollections as GeoJSON.GeoJSON);
        alarmLineLayer?.setData(featureLineCollections as GeoJSON.GeoJSON);
        alarmLineCenterPointLayer?.setData(genAlarmLineIconsSources as GeoJSON.GeoJSON);

        // 周界报警，动画图层
        // const genAlarmLineIconsSources = genAlarmLineIcons(res.data);
        // const centerPointsource = mapRef.current.getSource(
        //   'alarmLineCenterPoint'
        // ) as maplibregl.GeoJSONSource;
        // centerPointsource?.setData(genAlarmLineIconsSources as unknown as GeoJSON.GeoJSON);

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
    const url = `/ms-gateway/cx-alarm/alm/alarm/alarmMap?${param}`;

    const res = (await request({ url })) as unknown as FeatureCollection<
      Polygon,
      IAlarmClusterItem
    >;
    const alarmCluster_count = mapSceneRef.current?.getLayerByName('alarmCluster_count');

    const alarmCluster_circle = mapSceneRef.current?.getLayerByName('alarmCluster_circle');

    if (res.features) {
      const featureCollections = genAlarmClusterData(res.features);
      console.info('============featureCollections==============', featureCollections);
      console.info('============alarmCluster_count==============', alarmCluster_count);
      console.info('============alarmCluster_circle==============', alarmCluster_circle);

      if (alarmCluster_count) {
        alarmCluster_count.setData(featureCollections as GeoJSON.GeoJSON);
      }
      if (alarmCluster_circle) {
        alarmCluster_circle.setData(featureCollections as GeoJSON.GeoJSON);
      }
    }
  };

  const currentAlarmStatusRef = useRef(currentAlarmStatus);
  useEffect(() => {
    currentAlarmStatusRef.current = currentAlarmStatus;
  }, [currentAlarmStatus]);

  // 监听 lastUpdateAlarmTime， 更新地图报警聚合数据
  console.info('============lastUpdateAlarmTime==============', lastUpdateAlarmTime);
  useEffect(() => {
    if (lastUpdateAlarmTime) {
      if (mapSceneRef.current) {


        getAlalrmList();
      }
    }
  }, [lastUpdateAlarmTime]);

  // 报警太频繁，非首次报警，5秒更新一次
  useEffect(() => {
    if (lastUpdateAlarmTimeWithNotNew) {
      if (mapRef.current) {

        getAlalrmList();
      }

    }
  }, [lastUpdateAlarmTimeWithNotNew]);

  // 获取区域数据
  const getAreaDatas = async () => {
    if (mapRef.current) {
      const url = `/ms-gateway/cx-alarm/dc/area/areaMap`;
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
  const getMapObj = ({ scene }: { scene: Scene }) => {
    // console.log('getMapObj', scene);
    // setMapObj(map);
    // mapRef.current = map;

    mapSceneRef.current = scene;
    setMapScene(scene);
    setMapLoaded(true);


  };

  //页面加成成功时获取报警列表和聚合 只执行一次
  //alarmTypes有可能在页面加载完成的时候有可能没有值，所以用在effect里面
  useEffect(() => {
    if (mapLoaded && !isGetAlarmList.current) {

      getAlalrmList();

      isGetAlarmList.current = true;
    }
  }, [alarmTypes, mapLoaded]);



  // 2、3 d 地图中心
  const centerRef = useRef<{ lat: number; lng: number; height: number }>({
    lat: 0,
    lng: 0,
    height: 0,
  });
  // 3d地图，暂不做聚合相关

  const disable2dMap = () => {
    console.info('===========disable2dMap===============');

    setMapLoaded(false);
    setMapObj(null);
    isGetAlarmList.current = false;
    mapRef.current = null;
  };


  useUnmount(() => {
    disable2dMap();
  });

  return (
    <div
      className="w-full h-full relative "

    // css={{
    //   '&  .maplibregl-canvas': {
    //     cursor: spaceQuerySquare ? 'default' : 'pointer',
    //   },
    // }}
    >
      {/* <Wenet /> */}

      <BaseMap getMapObj={getMapObj} />
      {mapLoaded && mapSceneRef.current && (
        <UpdateAlarmfnContext.Provider value={{ getAlalrmList, updateAlarmCluster }}>
          <MapSceneContext.Provider value={mapScene}>
            {/* <LeftPanel /> */}
            {/* <MapToolBar /> */}
            <Videos />
          </MapSceneContext.Provider>
        </UpdateAlarmfnContext.Provider>
      )}

    </div>
  );
};

export default Page;
