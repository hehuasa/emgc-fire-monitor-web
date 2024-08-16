/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapOp } from '@/components/Map';
import AlarmAnimateIcon from '@/components/Map/AlarmAnimateIcon';

import CustomAlarmIcon from '@/components/Map/CustomAlarmIcon';
import { alarmTypeModel, currentAlarmModel, IAlarmDetail, ISuppData } from '@/models/alarm';
import { isInIconModel, isSpaceQueryingModel } from '@/models/map';
import {
  currentGpsInfoModel,
  currentResModel,
  IGpsDetail,
  IGpsInfo,
  IResItem,
} from '@/models/resource';
import { initGeoJson } from '@/utils/mapUtils';
import { request } from '@/utils/request';
import { featureCollection, polygon } from '@turf/turf';
import { useMount, useUnmount } from 'ahooks';
import { MapMouseEvent } from 'maplibre-gl';
import { useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IAlarmClusterItem } from '../page';
import { LineLayer, PointLayer, PolygonLayer, Scene } from '@antv/l7';
// import test from 'public/map/test.png'

const { clusterZoom, flyToZoom } = mapOp;

export type IL7LayerEventTarget = {
  x: number; // 鼠标  在地图位置 x 坐标
  y: number;  //鼠标  在地图位置 y 坐标
  type: string;  //鼠标事件类型
  lngLat: { lng: number, lat: number };  // 鼠标所在位置经纬度 经度度对象
  feature: any;  //数据选中的地理要素信息
  featureId: number | null;  //数据选中的地理要素的 ID
  preventDefault: () => void;  //阻止默认事件
}
interface IProps {

  scene: Scene;
  hoveAreaCluster: (currentAreaClusterData: IAlarmClusterItem, popuplnglat: number[]) => void;
  handleClusterMouseleave: () => void;
  genMapRightMenuFun: (e: IL7LayerEventTarget) => void;
  handleAreaClick: (e: IL7LayerEventTarget) => void;
  layerInitCallBack: () => void; // 图层初始化完成后的回调
}

const source = initGeoJson();


const LaryerInit = ({ scene, hoveAreaCluster, handleClusterMouseleave, handleAreaClick, genMapRightMenuFun, layerInitCallBack }: IProps) => {
  // 监听是否进行查周边，用以是否阻止相关图层的鼠标事件
  const isSpaceQuerying = useRecoilValue(isSpaceQueryingModel);
  const isSpaceQueryingRef = useRef(isSpaceQuerying);

  const alarmTypes = useRecoilValue(alarmTypeModel);
  const setCurrentGpsInfo = useSetRecoilState(currentGpsInfoModel);

  // 被选中的资源
  const setCurrentRes = useSetRecoilState(currentResModel);
  // 鼠标是否移入图标
  const setIsInIcon = useSetRecoilState(isInIconModel);
  // 被选中的报警
  const setCurrentAlarmDeatil = useSetRecoilState(currentAlarmModel);

  // 线图层动画timer
  // const lineAnimateTimer = useRef<NodeJS.Timer | null>(null);

  useMount(() => {


    console.info('=========LaryerInit===useMount==============');
    genAlarmIconLayer();
    genResLayers();
    genVideoIconLayer();
    genAlarmClusterLayer();
    genAreaLayers();
    genSreachResLayers();

    if (layerInitCallBack) {
      layerInitCallBack()
    }
    // genHoverAreas();
    // genGpsLayer();

  });

  // 自定义报警图标
  const genAlarmImgs = () => {
    // 首先加载一个默认图标
    map.loadImage(
      `${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/map/${'OTH_ALA'}.png`,
      (error, defaultImage) => {
        if (error) {
          return;
        }

        for (const { alarmType, iconPlaySpeed, iconColour } of alarmTypes) {
          // 图标背后扩散

          const imgname = alarmType + '_';
          const animateImgname = alarmType + '_animate';
          if (!map.hasImage(animateImgname)) {
            const alarmAnimateImage = new AlarmAnimateIcon({
              color: iconColour,
              speed: iconPlaySpeed,
              size: 70,
            });

            map.addImage(animateImgname, alarmAnimateImage);
          }

          if (!map.hasImage(imgname)) {
            map.loadImage(
              `${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/map/${alarmType}.png`,
              (error, image) => {
                if (error) {
                  console.info('============alarmType==error============', alarmType);
                  if (defaultImage) {
                    const imgname = alarmType + '_';
                    const customAlarmIcon = new CustomAlarmIcon({
                      size: 48,
                      image: defaultImage,
                      color: iconColour,
                    });
                    map.addImage(imgname, customAlarmIcon);
                  }

                  return;
                }

                if (image) {
                  // 报警图标
                  const imgname = alarmType + '_';
                  const customAlarmIcon = new CustomAlarmIcon({
                    size: 48,
                    image,
                    color: iconColour,
                  });
                  map.addImage(imgname, customAlarmIcon);
                }
              }
            );
          }
        }
      }
    );
  };
  const genAlarmLayers = () => {
    map.addSource('test', initGeoJson());
    const animateCircle: maplibregl.LayerSpecification = {
      id: 'animateCircle',
      type: 'symbol',
      source: 'test',
      // minzoom: clusterZoom,
      layout: {
        'icon-image': ['concat', ['get', 'alarmType'], '_animate'],
        // 'icon-image': 'FAS_animate',

        'icon-allow-overlap': true,
        'icon-offset': [-4, -6],
      },
    };

    const alarmIconLayer: maplibregl.LayerSpecification = {
      type: 'symbol',
      id: 'alarmIconLayer',
      source: 'test',
      layout: {
        // "icon-image": "FAS_",

        'icon-image': ['concat', ['get', 'alarmType'], '_'],
        'icon-allow-overlap': true,

        // "visibility": "none"
      },
    };

    map.addLayer(animateCircle);
    map.addLayer(alarmIconLayer);
  };
  //
  const addNewAlarms = async () => {
    const res = await request({ url: '/mockalarm.json' });

    console.info('============res==============', res);
    const source = map.getSource('test') as maplibregl.GeoJSONSource;
    console.info('============source==============', source);

    if (source) {
      source.setData(res as unknown as GeoJSON.GeoJSON);
    }
  };

  // 人员定位图层
  // const genGpsLayer = () => {

  //   //人员定位图层
  //   map.addSource('gps', source);
  //   //人员定位hover图层
  //   map.addSource('gps_h', source);

  //   const gpsLayer: maplibregl.LayerSpecification = {
  //     id: 'gps',
  //     type: 'symbol',
  //     source: 'gps',

  //     layout: {
  //       // 'icon-image': ['case', ['get', 'hover'], 'popup_h', 'popup'],
  //       'icon-image': 'gps_Location',
  //       'icon-allow-overlap': true,
  //       'icon-offset': [0, -22],
  //       'text-field': '{userName}',
  //       'text-offset': [0, -3.5],
  //       'text-font': ['Open Sans Regular'],
  //     },
  //   };

  //   const gpsLayer_h: maplibregl.LayerSpecification = {
  //     id: 'gps_h',
  //     type: 'symbol',
  //     source: 'gps_h',

  //     layout: {
  //       'icon-image': 'gps_Location_h',
  //       'icon-allow-overlap': true,
  //       'icon-offset': [0, -32],
  //     },
  //   };

  //   map.on('click', 'gps', handleGpsLayerClick);

  //   map.addLayer(gpsLayer);
  //   map.addLayer(gpsLayer_h);
  // };

  const handleGpsLayerClick = async (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    if (e.features && e.features[0]) {
      const properties = e.features[0].properties as IGpsInfo;
      const url = `/cx-alarm/resource/findPositionUserInfo?resourceId=${properties.id}`;
      const res = await request<IGpsDetail>({ url });
      if (res.code === 200) {
        // const detail = { ...properties, ...res.data };
        const detail = { ...res.data, id: properties.id };
        setCurrentGpsInfo(detail);
      } else {
        const detail = { ...properties };
        setCurrentGpsInfo(detail as IGpsDetail);
      }
    }
  };

  // 视频图标图层
  const genVideoIconLayer = () => {


    const videolayer = new PointLayer({
      name: "videolayer"
    }).source(source).size(32).shape("res_Video")
    scene.addLayer(videolayer);

  };

  // 区域图层
  const genAreaLayers = async () => {


    const areaFillLayer = new PolygonLayer({
      name: "areaFillLayer"
    }).shape("fill").color('rgba(0, 120, 236, 0.50)')

    scene.addLayer(areaFillLayer);
    areaFillLayer.on("click", (e) => {
      handleAreaClick(e);
    })
    areaFillLayer.on("contextmenu", (e) => {
      genMapRightMenuFun(e);
    })
  };

  // 资源图层
  const genResLayers = () => {

    const reslayer = new PointLayer({
      name: "reslayer"
    }).source(source).size(32).shape("resTypeCode", () => {
      return "res_Alarm";
    })
    const reslayerLineLayer = new LineLayer({
      name: "reslayerLineLayer"
    }).color('#00f').source(source).size(2).shape("line")

    scene.addLayer(reslayer);
    scene.addLayer(reslayerLineLayer);

    reslayer.on("click", resLayerClick)
    reslayerLineLayer.on("click", resLayerClick)

    // map.on('mouseenter', 'reslayerLine', () => {
    //   map.getCanvas().style.cursor = 'default';
    //   resLayerEnter();
    // });

    // map.on('mouseleave', 'reslayerLine', () => {
    //   map.getCanvas().style.cursor = '';
    //   resLayerLeave();
    // });
  };

  // 资源图层点击事件
  const resLayerClick = (
    e: IL7LayerEventTarget
  ) => {
    console.log('点击资源');
    e.preventDefault();

    if (isSpaceQueryingRef.current) {
      return;
    }

    if (e.feature) {
      const res = e.feature as unknown as { properties: IResItem };
      setCurrentRes(res.properties);
    }
  };
  //搜索结果图层
  const genSreachResLayers = () => {

    const serachResLayer = new PointLayer({
      name: "serachResLayer"
    }).shape("icon", () => {

    })
    const serachResLineLayer = new LineLayer({
      name: "serachResLineLayer"
    }).shape("line").color("#00f").size(2)


    // const reslayerP: maplibregl.LayerSpecification = {
    //   id: 'serachRes_p',
    //   type: 'symbol',
    //   source: 'serachRes',

    //   layout: {
    //     //'icon-image': 'popup_h',
    //     'icon-image': ['case', ['get', 'hover'], 'popup_h', 'popup'],
    //     'icon-allow-overlap': true,
    //     'icon-anchor': 'bottom',
    //     'icon-offset': [0, -4],
    //     'text-field': '{sort}',
    //     'text-font': ['Open Sans Regular'],
    //     'text-offset': [0, -1.75],
    //     'text-allow-overlap': true,
    //   },
    //   paint: {
    //     'text-color': '#fff',
    //   },
    //   filter: ['all', ['==', '$type', 'Point']],
    // };
    // const reslayerC: maplibregl.LayerSpecification = {
    //   id: 'serachRes_c',
    //   type: 'circle',
    //   source: 'serachRes',

    //   paint: {
    //     'circle-radius': 32,
    //     'circle-color': 'red',
    //     'circle-opacity': 0,
    //     'circle-translate': [8, 0],
    //   },
    // };
    // const currentReslayer: maplibregl.LayerSpecification = {
    //   id: 'currentReslayer',
    //   type: 'symbol',
    //   source: 'currentReslayer',

    //   layout: {
    //     'icon-image': '{icon}',
    //     'icon-allow-overlap': true,
    //     'icon-offset': [0, -30],
    //   },
    // };

    // const currentReslayer_h: maplibregl.LayerSpecification = {
    //   id: 'currentReslayer_h',
    //   type: 'symbol',
    //   source: 'currentReslayer_h',

    //   layout: {
    //     'icon-image': '{icon}',
    //     'icon-allow-overlap': true,
    //     'icon-offset': [0, -30],
    //   },
    // };



    scene.addLayer(serachResLineLayer);
    scene.addLayer(serachResLayer);

    serachResLayer.on("click", searchResLayerClick)
    serachResLayer.on("serachResLineLayer", searchResLayerClick)
    // serachResLayer.on("mouseenter", resLayerEnter)



  };

  // 生成报警图标图层
  const genAlarmIconLayer = () => {


    // 报警相关图层，点击事件允许透传
    const alarmIconLayer = new PointLayer({
      name: "alarmIcon",
      minZoom: clusterZoom,
      enablePropagation: true,
    }).source(source).shape("circle")

    const alarmLineLayer = new LineLayer({
      name: "alarmLine",
      minZoom: clusterZoom,
      enablePropagation: true
    }).color('#f00').source(source).size(2).shape("line")

    const alarmLineCenterPointLayer = new PointLayer({
      name: "alarmLineCenterPoint",
      minZoom: clusterZoom,
      enablePropagation: true
    }).source(source).shape("circle")
    // 新增周界中心点图层

    scene.addLayer(alarmIconLayer);

    scene.addLayer(alarmLineLayer);
    scene.addLayer(alarmLineCenterPointLayer);

    alarmIconLayer.on("click", handleAlarmIconClick)
    alarmLineLayer.on("click", handleAlarmIconClick)
    alarmLineCenterPointLayer.on("click", handleAlarmIconClick)


    // map.on('mouseenter', 'alarmIcon', resLayerEnter);

    // map.on('mouseleave', 'alarmIcon', resLayerLeave);

    // map.on('mouseenter', 'alarmLineLayer', () => {
    //   map.getCanvas().style.cursor = 'default';
    //   resLayerEnter();
    // });

    // map.on('mouseleave', 'alarmLineLayer', () => {
    //   map.getCanvas().style.cursor = '';
    //   resLayerLeave();
    // });

    // const layer_h: maplibregl.LayerSpecification = {
    //   id: 'alarmIcon_h',
    //   type: 'symbol',
    //   source: 'alarmIcon_h',
    //   layout: {
    //     'icon-image': 'alarmIcon',
    //     'icon-allow-overlap': true,
    //     'icon-pitch-alignment': 'map',
    //   },
    //   filter: ['==', '$type', 'Point'],
    // };
    // const layer1_h: maplibregl.LayerSpecification = {
    //   id: 'alarmIcon1_h',
    //   type: 'symbol',
    //   source: 'alarmIcon_h',
    //   layout: {
    //     // 'icon-image': ['concat', ['to-string', ['get', 'layerId']], '_h'],
    //     'icon-image': '{layerId}',

    //     'icon-allow-overlap': true,
    //     'icon-anchor': 'bottom',
    //     'icon-offset': [0, -2],
    //   },
    //   filter: ['==', '$type', 'Point'],
    // };

    // const alarmLineIcon_h: maplibregl.LayerSpecification = {
    //   id: 'alarmLineIcon_h',
    //   type: 'line',
    //   source: 'alarmIcon_h',
    //   paint: {
    //     'line-width': 6,
    //     'line-color': 'red',
    //   },
    //   // layout: {
    //   //   "li"
    //   // },
    //   filter: ['==', '$type', 'LineString'],
    // };
    // map.addLayer(layer_h);

    // map.addLayer(layer1_h);
    // map.addLayer(alarmLineIcon_h, 'alarmIcon1_h');

    // 线条动画

    // if (lineAnimateTimer.current) {
    //   clearInterval(lineAnimateTimer.current);
    // }
    // // let number = 0.2;
    // lineAnimateTimer.current = setInterval(() => {
    //   // number += 0.1;

    //   const centerPointsource = map.getSource('alarmLineCenterPoint') as maplibregl.GeoJSONSource;

    //   const data = centerPointsource._data as FeatureCollection<
    //     Point,
    //     {
    //       layerId: string;
    //       opacity: number;
    //       currentAlarm: IAlarm;
    //       alarmId: string;
    //       alarmAreaId: string;
    //       floorLevel: string;
    //       isUp: boolean;
    //     }
    //   >;
    //   for (const iterator of data.features) {
    //     const op = iterator.properties.currentAlarm.alarmType === 'PON' ? 0.2 : 0.1;
    //     if (iterator.properties.isUp) {
    //       iterator.properties.opacity += op;
    //       if (iterator.properties.opacity >= 1) {
    //         iterator.properties.isUp = false;
    //       }
    //     } else {
    //       iterator.properties.opacity -= op;
    //       if (iterator.properties.opacity <= 0.2) {
    //         iterator.properties.isUp = true;
    //       }
    //     }
    //   }
    //   // if (number > 1) {
    //   //   number = 0;
    //   // }
    //   centerPointsource?.setData(data as unknown as GeoJSON.GeoJSON);
    // }, 100);

    // 周界报警，动画图层

  };

  //报警聚合图层
  const genAlarmClusterLayer = () => {


    const alarmCluster_count = new PointLayer({
      name: "alarmCluster_count"
    }).source(source).shape("alarmCount", "text").style({

    });
    const alarmCluster_circle = new PointLayer({
      name: "alarmCluster_circle"
    }).source(source).size(18).color('rgba(255, 170, 27, 1)').shape("circle").style({
      stroke: 'rgba(249, 42, 42, 0.16)',
      strokeWidth: 1,
    })

    scene.addLayer(alarmCluster_count);
    scene.addLayer(alarmCluster_circle);

    alarmCluster_count.on("click", handleClusterClick)
    alarmCluster_circle.on("click", handleClusterClick)


    alarmCluster_circle.on("mousemove", handleClusterMousemove)
    alarmCluster_circle.on("mouseleave", handleClusterMouseleave)

  };
  const handleClusterClick = (e: IL7LayerEventTarget) => {
    if (isSpaceQueryingRef.current) {
      return;
    }
    e.preventDefault();
    scene.setZoomAndCenter(flyToZoom, e.lngLat)
  }

  const handleClusterMousemove = (
    e: IL7LayerEventTarget
  ) => {
    if (isSpaceQueryingRef.current) {
      return;
    }
    if (e.feature && e.feature.properties) {
      // e.feature.properties.countDetails = JSON.parse(e.feature.properties.countDetails);

      // e.features[0].properties.centralPoint = JSON.parse(e.features[0].properties.centralPoint);
      hoveAreaCluster(e.feature.properties, e.feature.properties.centralPoint.coordinates);
    }
  };

  // 报警图标点击事件
  const handleAlarmIconClick = async (e: IL7LayerEventTarget) => {
    console.log('报警图标点击');
    //阻止冒泡
    e.preventDefault();
    if (isSpaceQueryingRef.current) {
      return;
    }

    if (e.feature && e.feature.properties) {
      const alarmId = e.feature.properties.alarmId;

      if (alarmId) {
        setCurrentAlarmDeatil(null);

        const res = await request<IAlarmDetail>({ url: `/cx-alarm/alm/alarm/find/${alarmId}` });

        if (res.code === 200) {
          const newSuppData: ISuppData[] = res.data.suppData.map((item, index) => {
            if (item.infoType !== 0) {
              const newItem: any = { ...item };
              const path = new URL(newItem.infoValue);
              const newImgUrl = '/minio' + path.pathname;
              newItem.infoValue = newImgUrl;

              return newItem;
            }
            return item;
          });
          console.log('debug-------4-------', {
            ...res.data,
            suppData: newSuppData,
          });
          setCurrentAlarmDeatil({
            ...res.data,
            suppData: newSuppData,
          });
        }
      }
    }
  };

  const resLayerEnter = () => {
    setIsInIcon(true);
  };
  const resLayerLeave = () => {
    setIsInIcon(false);
  };
  // 搜索结果点击事件
  const searchResLayerClick = (
    e: IL7LayerEventTarget
  ) => {
    e.preventDefault();

    if (e.feature && e.feature.properties) {
      setCurrentRes(e.feature.properties as IResItem);
    }
  };

  // 新建一个图层，用于展示高亮区域
  const genHoverAreas = () => {


    // const area_hover: maplibregl.LayerSpecification = {
    //   id: 'area_hover',
    //   type: 'fill',
    //   source: 'area_hover',
    //   // maxzoom: clusterZoom,

    //   paint: {
    //     'fill-color': 'rgba(0, 120, 236, 0.70)',
    //     'fill-outline-color': 'rgba(0, 120, 236, 1)',
    //     'fill-opacity': 1,
    //   },
    //   // filter: ['==', 'areaId', ''],
    // };

    // map.on('mousemove', 'zhuangzhi_v1_4', mouseInArea);
    // map.on('mouseleave', 'zhuangzhi_v1_4', mouseOutArea);

    // map.on('mousemove', 'zhuangzhi_v1_3', mouseInArea);
    // map.on('mouseleave', 'zhuangzhi_v1_3', mouseOutArea);
    // map.addLayer(area_hover, 'alarmIcon');
  };
  // 高亮区域
  const mouseInArea = (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    const geom = polygon(e.features[0].geometry.coordinates);
    const source = map.getSource('area_hover') as maplibregl.GeoJSONSource;

    source.setData(featureCollection([geom]) as GeoJSON.GeoJSON);
  };

  // 取消高亮区域
  const mouseOutArea = () => {
    const source = map.getSource('area_hover') as maplibregl.GeoJSONSource;

    source.setData(featureCollection([]) as GeoJSON.GeoJSON);
  };

  useUnmount(() => {
    // if (lineAnimateTimer.current) {
    //   clearInterval(lineAnimateTimer.current);
    //   lineAnimateTimer.current = null;
    // }

    // 单独卸载three的图层
    // const line = map.getLayer('alarmLineAndPerson') as any;
    // if (line) {
    //   line.implementation.clear();
    // }

    // const lineNear = map.getLayer('alarmLineAndPerson_near') as any;
    // if (lineNear) {
    //   lineNear.implementation.clear();
    // }
    // map.removeLayer('alarmLineAndPerson');
    // map.removeLayer('alarmLineAndPerson_near');
  });

  return null;
};

export default LaryerInit;
