import { mapOp } from '@/components/Map';
import AlarmAnimateIcon from '@/components/Map/AlarmAnimateIcon';
import AlarmAnimateIconNew from '@/components/Map/AlarmAnimateIconNew';

import CustomAlarmIcon from '@/components/Map/CustomAlarmIcon';
import { alarmTypeModel, currentAlarmModel, IAlarm, IAlarmDetail, ISuppData } from '@/models/alarm';
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
import { feature, FeatureCollection, featureCollection, Point, polygon } from '@turf/turf';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { LayerSpecification, MapMouseEvent } from 'maplibre-gl';
import { useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IAlarmClusterItem } from '../page';
// import test from 'public/map/test.png'

const { clusterZoom, flyToZoom } = mapOp;
interface IProps {
  map: maplibregl.Map;
  hoveAreaCluster: (currentAreaClusterData: IAlarmClusterItem, popuplnglat: number[]) => void;
  handleClusterMouseleave: () => void;
  handleAreaClick: (
    e: MapMouseEvent & {
      features?: any;
    },
    features: any[]
  ) => void;
}

const LaryerInit = ({ map, hoveAreaCluster, handleClusterMouseleave, handleAreaClick }: IProps) => {
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
  const lineAnimateTimer = useRef<NodeJS.Timer | null>(null);

  useMount(() => {
    genWellLayer();
    genAlarmImgs();

    genAlarmIconLayer();
    genResLayers();
    genVideoIconLayer();
    genAlarmClusterLayer();
    genAreaLayers();
    genSreachResLayers();
    genHoverAreas();
    genGpsLayer();
    // const imgs = ["PON_S", "PON_N", "PON_W", "PON_E", "PON_M_E", "PON_M_N", "PON_M_S", "PON_M_W"]
    // const imgs = ["FAS"]

    // genAlarmLayers()

    // setTimeout(() => {
    //   addNewAlarms()

    // }, 2 * 1000);
    // for (const img of imgs) {
    //   map.loadImage(`/map/${img}.png`, (error, image) => {
    //     if (error) throw error;
    //     if (image) {
    //       // map.addImage(img, image);

    //       setTimeout(() => {
    //         const customAlarmIcon = new CustomAlarmIcon({ size: 48, image });
    //         map.addImage("customAlarmIcon", customAlarmIcon)
    //         const feas = featureCollection([]);
    //         // 测试新图标

    //         map.addSource("test", initGeoJson())

    //         const layer: maplibregl.LayerSpecification = {
    //           id: 'testa',
    //           type: 'symbol',
    //           source: 'test',
    //           // minzoom: clusterZoom,

    //           layout: {
    //             'icon-image': 'alarmIconRedPointAnimated',
    //             'icon-allow-overlap': true,
    //             "icon-offset": [-4, -6]
    //             // 'icon-pitch-alignment': 'map',
    //           },
    //         };
    //         // map.addLayer(layer)
    //         map.addLayer({
    //           type: "symbol",
    //           id: "test",
    //           source: "test",
    //           layout: {
    //             "icon-image": "customAlarmIcon",
    //             "icon-allow-overlap": true,
    //           },
    //           paint: {
    //             // "icon-color": ["get", "color"]
    //             "icon-color": "red"
    //           }
    //         });

    //         map.on("click", (e) => {
    //           const array = e.lngLat.toArray();
    //           const pointf = point(array, {
    //             color: '#' + Math.random().toString(16).substr(-6)
    //           });
    //           feas.features.push(pointf)

    //           console.info('============feas==============', JSON.stringify(feas));
    //           const source = e.target.getSource("test") as maplibregl.GeoJSONSource;;
    //           if (source) {

    //             source.setData(feas)

    //           }
    //         })
    //       }, 2 * 1000);

    //     }
    //   })
    // }
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
  const genGpsLayer = () => {
    const source = initGeoJson();

    //人员定位图层
    map.addSource('gps', source);
    //人员定位hover图层
    map.addSource('gps_h', source);

    const gpsLayer: maplibregl.LayerSpecification = {
      id: 'gps',
      type: 'symbol',
      source: 'gps',

      layout: {
        // 'icon-image': ['case', ['get', 'hover'], 'popup_h', 'popup'],
        'icon-image': 'gps_Location',
        'icon-allow-overlap': true,
        'icon-offset': [0, -22],
        'text-field': '{userName}',
        'text-offset': [0, -3.5],
        'text-font': ['Open Sans Regular'],
      },
    };

    const gpsLayer_h: maplibregl.LayerSpecification = {
      id: 'gps_h',
      type: 'symbol',
      source: 'gps_h',

      layout: {
        'icon-image': 'gps_Location_h',
        'icon-allow-overlap': true,
        'icon-offset': [0, -32],
      },
    };

    map.on('click', 'gps', handleGpsLayerClick);

    map.addLayer(gpsLayer);
    map.addLayer(gpsLayer_h);
  };

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

  //井口图层
  const genWellLayer = useMemoizedFn(() => {
    const source = initGeoJson();
    const layer: maplibregl.LayerSpecification = {
      id: 'well',
      type: 'fill',
      source: 'well',
      paint: {
        'fill-antialias': true,
        'fill-color': '#AFCFE4',
        'fill-opacity': 0.1,
      },
    };

    map.addSource('well', source);
    map.addLayer(layer);
    map.on('click', 'well', resLayerClick);
    // 加载默认图层
    request<any[]>({
      url: '/cx-alarm/resource/list-default-resource',
      options: {
        method: 'post',
      },
    }).then((res) => {
      if (res.code === 200) {
        const feas = featureCollection([]);
        for (const data of res.data) {
          feas.features.push(feature(data.coordinate, { ...data }));
        }
        const wellSource = map.getSource('well') as maplibregl.GeoJSONSource;
        wellSource.setData(feas as unknown as GeoJSON.GeoJSON);
      }
    });
  });

  // 视频图标图层
  const genVideoIconLayer = () => {
    const source = initGeoJson();
    map.addSource('video', source);
    map.addSource('video_h', source);

    const layer: maplibregl.LayerSpecification = {
      id: 'video',
      type: 'symbol',
      source: 'video',
      layout: {
        'icon-image': 'res_Video',
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'map',
      },
    };
    const layer_popup: maplibregl.LayerSpecification = {
      id: 'video1',
      type: 'symbol',
      source: 'video',
      layout: {
        'icon-image': 'popup',
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
        'icon-offset': [0, -5],
        'text-field': '{index}',
        'text-font': ['Open Sans Regular'],
        'text-offset': [0, -1.75],
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#fff',
      },
    };

    map.addLayer(layer);

    map.addLayer(layer_popup);

    const layer_popup_h: maplibregl.LayerSpecification = {
      id: 'video_h',
      type: 'symbol',
      source: 'video_h',
      layout: {
        'icon-image': 'popup_h',
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
        'icon-offset': [0, -5],
        'text-field': '{index}',
        'text-font': ['Open Sans Regular'],
        'text-offset': [0, -1.75],
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#fff',
      },
    };

    map.addLayer(layer_popup_h);
  };

  // 区域图层
  const genAreaLayers = async () => {
    const source = initGeoJson();

    map.addSource('area_fill', source);
    const area_fill: maplibregl.LayerSpecification = {
      id: 'area_fill',
      type: 'fill',
      source: 'area_fill',
      // maxzoom: clusterZoom,

      paint: {
        'fill-color': 'rgba(0, 120, 236, 0.50)',
        'fill-outline-color': 'rgba(0, 120, 236, 1)',
        'fill-opacity': 1,
      },
      filter: ['==', 'areaId', ''],
    };
    const area_fill_hide: maplibregl.LayerSpecification = {
      id: 'area_fill_hide',
      type: 'fill',
      source: 'area_fill',
      // maxzoom: clusterZoom,
      paint: {
        'fill-opacity': 0,
      },
    };

    map.on('click', 'area_fill_hide', (e) => {
      console.log('点击区域');
      const features = e.features;
      handleAreaClick(e, features as any[]);
    });

    map.addLayer(area_fill);
    map.addLayer(area_fill_hide);
  };

  // 资源图层
  const genResLayers = () => {
    const source = initGeoJson();

    map.addSource('reslayer', source);

    const reslayer: maplibregl.LayerSpecification = {
      id: 'reslayer',
      type: 'symbol',
      source: 'reslayer',

      layout: {
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
        'icon-offset': [0, -15],
      },
      filter: ['all', ['==', '$type', 'Point']],
    };

    const reslayerLine: maplibregl.LayerSpecification = {
      id: 'reslayerLine',
      type: 'line',
      source: 'reslayer',

      paint: {
        'line-color': 'blue',
        'line-width': 7,
        'line-opacity': 1,

        // 'circle-radius': 16,
        // 'circle-color': 'red',
        // 'circle-opacity': 1,
        // 'circle-pitch-alignment': 'map',
        // 'circle-pitch-scale': 'viewport',
      },
      filter: ['all', ['==', '$type', 'LineString']],
      // filter: ['==', ["get", "alarmType"], 'PON'],
    };

    map.on('click', 'reslayer', resLayerClick);
    map.on('click', 'reslayerLine', resLayerClick);

    map.addLayer(reslayer, 'alarmIcon');
    map.addLayer(reslayerLine, 'alarmIcon');

    map.on('mouseenter', 'reslayerLine', () => {
      map.getCanvas().style.cursor = 'default';
      resLayerEnter();
    });

    map.on('mouseleave', 'reslayerLine', () => {
      map.getCanvas().style.cursor = '';
      resLayerLeave();
    });
  };

  // 资源图层点击事件
  const resLayerClick = (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    console.log('点击资源');
    e.preventDefault();

    if (isSpaceQueryingRef.current) {
      return;
    }

    if (e.features && e.features[0]) {
      const res = e.features[0] as unknown as { properties: IResItem };
      setCurrentRes(res.properties);
    }
  };
  //搜索结果图层
  const genSreachResLayers = () => {
    const source = initGeoJson();
    map.addSource('serachRes', source);

    map.addSource('currentReslayer', source);
    map.addSource('currentReslayer_h', source);

    const reslayer: maplibregl.LayerSpecification = {
      id: 'serachRes',
      type: 'symbol',
      source: 'serachRes',

      layout: {
        'icon-image': '{icon}',
        // 'icon-anchor': 'bottom',
        'icon-allow-overlap': true,
      },
      filter: ['all', ['==', '$type', 'Point']],
    };
    const serachResLine: maplibregl.LayerSpecification = {
      id: 'serachResLine',
      type: 'line',
      source: 'serachRes',

      paint: {
        'line-color': 'blue',
        'line-width': 7,
        'line-opacity': 1,

        // 'circle-radius': 16,
        // 'circle-color': 'red',
        // 'circle-opacity': 1,
        // 'circle-pitch-alignment': 'map',
        // 'circle-pitch-scale': 'viewport',
      },
      filter: ['all', ['==', '$type', 'LineString']],
    };

    const reslayerP: maplibregl.LayerSpecification = {
      id: 'serachRes_p',
      type: 'symbol',
      source: 'serachRes',

      layout: {
        //'icon-image': 'popup_h',
        'icon-image': ['case', ['get', 'hover'], 'popup_h', 'popup'],
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
        'icon-offset': [0, -4],
        'text-field': '{sort}',
        'text-font': ['Open Sans Regular'],
        'text-offset': [0, -1.75],
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#fff',
      },
      filter: ['all', ['==', '$type', 'Point']],
    };
    const reslayerC: maplibregl.LayerSpecification = {
      id: 'serachRes_c',
      type: 'circle',
      source: 'serachRes',

      paint: {
        'circle-radius': 32,
        'circle-color': 'red',
        'circle-opacity': 0,
        'circle-translate': [8, 0],
      },
    };
    const currentReslayer: maplibregl.LayerSpecification = {
      id: 'currentReslayer',
      type: 'symbol',
      source: 'currentReslayer',

      layout: {
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
        'icon-offset': [0, -30],
      },
    };

    const currentReslayer_h: maplibregl.LayerSpecification = {
      id: 'currentReslayer_h',
      type: 'symbol',
      source: 'currentReslayer_h',

      layout: {
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
        'icon-offset': [0, -30],
      },
    };

    map.on('click', 'serachRes', searchResLayerClick);
    map.on('click', 'serachResLine', searchResLayerClick);

    map.on('click', 'serachRes_p', searchResLayerClick);

    map.on('mouseenter', 'serachRes', resLayerEnter);
    map.on('mouseenter', 'serachRes_p', resLayerEnter);

    map.on('mouseleave', 'serachRes_c', resLayerLeave);

    map.addLayer(reslayerC);

    map.addLayer(reslayer);
    map.addLayer(serachResLine);

    map.addLayer(reslayerP);

    map.addLayer(currentReslayer);
    map.addLayer(currentReslayer_h);
  };

  // 生成报警图标图层
  const genAlarmIconLayer = () => {
    const source = initGeoJson();
    map.addSource('alarmIcon', source);
    map.addSource('alarmIcon_h', source);

    const alarmMapImage = new AlarmAnimateIconNew({
      rgbArray: [255, 0, 0],
    });
    if (!map.hasImage('alarmIconRedPointAnimated')) {
      map.addImage('alarmIconRedPointAnimated', alarmMapImage, { pixelRatio: 1 });
    }
    const animateCircle: maplibregl.LayerSpecification = {
      id: 'animateCircle',
      type: 'symbol',
      source: 'alarmIcon',
      minzoom: clusterZoom,

      // minzoom: clusterZoom,
      layout: {
        'icon-image': ['concat', ['get', 'alarmType'], '_animate'],
        // 'icon-image': 'FAS_animate',

        // "visibility": "none",
        'icon-allow-overlap': true,
        'icon-offset': [0, 8],
        'icon-anchor': 'bottom',
      },
      filter: ['==', '$type', 'Point'],
    };
    // const animateTest: maplibregl.LayerSpecification = {
    //   id: 'animateTest',
    //   type: 'circle',
    //   source: 'alarmIcon',
    //   minzoom: clusterZoom,

    //   // minzoom: clusterZoom,
    //   paint: {
    //     "circle-color": "blue",
    //     "circle-radius": 4,
    //   },
    //   filter: ['==', '$type', 'Point'],

    // };
    const alarmIconLayer: maplibregl.LayerSpecification = {
      type: 'symbol',
      id: 'alarmIcon',
      source: 'alarmIcon',
      minzoom: clusterZoom,

      layout: {
        // "icon-image": "FAS_",

        'icon-image': ['concat', ['get', 'alarmType'], '_'],
        'icon-allow-overlap': true,
        'icon-offset': [3.5, 3],
        'icon-anchor': 'bottom',
        // "visibility": "none"
      },
      filter: ['==', '$type', 'Point'],
    };

    // const layer: maplibregl.LayerSpecification = {
    //   id: 'alarmIcon',
    //   type: 'symbol',
    //   source: 'alarmIcon',
    //   minzoom: clusterZoom,

    //   layout: {
    //     'icon-image': 'alarmIconRedPointAnimated',
    //     'icon-allow-overlap': true,
    //     // 'icon-pitch-alignment': 'map',
    //   },
    //   filter: ['==', '$type', 'Point'],
    // };
    // const layer1: maplibregl.LayerSpecification = {
    //   id: 'alarmIcon1',
    //   type: 'symbol',
    //   source: 'alarmIcon',
    //   minzoom: clusterZoom,

    //   layout: {
    //     'icon-image': '{layerId}',
    //     'icon-allow-overlap': true,
    //     'icon-anchor': 'bottom',
    //     'icon-offset': [0, -10],
    //   },
    //   filter: ['==', '$type', 'Point'],
    // };

    // const layerCircle: LayerSpecification = {
    //   id: 'layerCircle',
    //   type: 'circle',
    //   source: 'alarmIcon',
    //   minzoom: clusterZoom,
    //   paint: {
    //     'circle-radius': 16,
    //     'circle-color': 'red',
    //     'circle-opacity': 0,
    //     'circle-pitch-alignment': 'map',
    //     'circle-pitch-scale': 'viewport',
    //   },
    //   filter: ['==', '$type', 'Point'],
    // };

    const alarmLineLayer: LayerSpecification = {
      id: 'alarmLineLayer',
      type: 'line',
      source: 'alarmIcon',
      // minzoom: clusterZoom,
      paint: {
        'line-color': 'red',
        'line-width': 7,
        'line-opacity': ['case', ['==', ['get', 'alarmType'], 'PON_M'], 0, 1],

        // 'circle-radius': 16,
        // 'circle-color': 'red',
        // 'circle-opacity': 1,
        // 'circle-pitch-alignment': 'map',
        // 'circle-pitch-scale': 'viewport',
      },
      filter: ['all', ['==', '$type', 'LineString']],
      // filter: ['==', ["get", "alarmType"], 'PON'],
    };

    // map.addLayer(layer);

    map.addLayer(alarmIconLayer);

    map.addLayer(animateCircle, 'alarmIcon');
    map.addLayer(alarmLineLayer, 'alarmIcon');
    // map.addLayer(animateTest);

    // 新增周界中心点图层
    map.addSource('alarmLineCenterPoint', source);
    const alarmLineCenterPoint: LayerSpecification = {
      id: 'alarmLineCenterPoint',
      type: 'symbol',
      source: 'alarmLineCenterPoint',
      // minzoom: clusterZoom,
      layout: {
        'icon-image': '{layerId}',
        'icon-allow-overlap': true,
        // 'icon-pitch-alignment': 'map',
        'icon-size': 0.6,
      },
      paint: {
        'icon-opacity': ['get', 'opacity'],
      },
      filter: ['==', '$type', 'Point'],
    };

    map.addLayer(alarmLineCenterPoint, 'alarmIcon');

    map.on('click', 'animateCircle', handleAlarmIconClick);

    map.on('click', 'alarmIcon', handleAlarmIconClick);
    map.on('click', 'alarmLineLayer', handleAlarmIconClick);
    map.on('click', 'alarmLineCenterPoint', handleAlarmIconClick);

    map.on('mouseenter', 'alarmIcon', resLayerEnter);

    map.on('mouseleave', 'alarmIcon', resLayerLeave);

    map.on('mouseenter', 'alarmLineLayer', () => {
      map.getCanvas().style.cursor = 'default';
      resLayerEnter();
    });

    map.on('mouseleave', 'alarmLineLayer', () => {
      map.getCanvas().style.cursor = '';
      resLayerLeave();
    });

    const layer_h: maplibregl.LayerSpecification = {
      id: 'alarmIcon_h',
      type: 'symbol',
      source: 'alarmIcon_h',
      layout: {
        'icon-image': 'alarmIcon',
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'map',
      },
      filter: ['==', '$type', 'Point'],
    };
    const layer1_h: maplibregl.LayerSpecification = {
      id: 'alarmIcon1_h',
      type: 'symbol',
      source: 'alarmIcon_h',
      layout: {
        // 'icon-image': ['concat', ['to-string', ['get', 'layerId']], '_h'],
        'icon-image': '{layerId}',

        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
        'icon-offset': [0, -2],
      },
      filter: ['==', '$type', 'Point'],
    };

    const alarmLineIcon_h: maplibregl.LayerSpecification = {
      id: 'alarmLineIcon_h',
      type: 'line',
      source: 'alarmIcon_h',
      paint: {
        'line-width': 6,
        'line-color': 'red',
      },
      // layout: {
      //   "li"
      // },
      filter: ['==', '$type', 'LineString'],
    };
    map.addLayer(layer_h);

    map.addLayer(layer1_h);
    map.addLayer(alarmLineIcon_h, 'alarmIcon1_h');

    // 线条动画

    if (lineAnimateTimer.current) {
      clearInterval(lineAnimateTimer.current);
    }
    // let number = 0.2;
    lineAnimateTimer.current = setInterval(() => {
      // number += 0.1;

      const centerPointsource = map.getSource('alarmLineCenterPoint') as maplibregl.GeoJSONSource;

      const data = centerPointsource._data as FeatureCollection<
        Point,
        {
          layerId: string;
          opacity: number;
          currentAlarm: IAlarm;
          alarmId: string;
          alarmAreaId: string;
          floorLevel: string;
          isUp: boolean;
        }
      >;
      for (const iterator of data.features) {
        const op = iterator.properties.currentAlarm.alarmType === 'PON' ? 0.2 : 0.1;
        if (iterator.properties.isUp) {
          iterator.properties.opacity += op;
          if (iterator.properties.opacity >= 1) {
            iterator.properties.isUp = false;
          }
        } else {
          iterator.properties.opacity -= op;
          if (iterator.properties.opacity <= 0.2) {
            iterator.properties.isUp = true;
          }
        }
      }
      // if (number > 1) {
      //   number = 0;
      // }
      centerPointsource?.setData(data as unknown as GeoJSON.GeoJSON);
    }, 100);

    // 周界报警，动画图层
    // const path = process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/map/cross.png';
    // const pathNear = process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/map/near.png';

    // const lineLayerNear = new AlarmLineAndPerson(
    //   'alarmLineAndPerson_near',
    //   'PON_M',
    //   '#FFB30F',
    //   pathNear,
    //   true,
    //   16,
    //   false,
    //   1,
    //   1,
    //   featureCollection([])
    // ) as maplibregl.CustomLayerInterface;
    // const lineLayer = new AlarmLineAndPerson(
    //   'alarmLineAndPerson',
    //   'PON',
    //   'red',
    //   path,
    //   true,
    //   16,
    //   true,
    //   1,
    //   2,
    //   featureCollection([])
    // ) as maplibregl.CustomLayerInterface;

    // map.addLayer(lineLayer);
    // map.addLayer(lineLayerNear);
  };

  //报警聚合图层
  const genAlarmClusterLayer = () => {
    const source = initGeoJson();
    map.addSource('alarmCluster_count', source);

    const alarmCluster_count: maplibregl.LayerSpecification = {
      id: 'alarmCluster_count',
      type: 'symbol',
      source: 'alarmCluster_count',
      maxzoom: clusterZoom,

      layout: {
        'text-field': '{alarmCount}',
        'text-font': ['Open Sans Regular'],
        'text-allow-overlap': true,
        'text-size': 18,
      },
      paint: {
        'text-color': '#fff',
        'text-halo-blur': 0.5,
        'text-halo-color': '#fff',
        'text-halo-width': 0.5,
      },
    };

    const alarmCluster_circle: LayerSpecification = {
      id: 'alarmCluster_circle',
      type: 'circle',
      source: 'alarmCluster_count',
      maxzoom: clusterZoom,
      paint: {
        'circle-radius': 18,
        'circle-color': 'rgba(255, 170, 27, 1)',
        'circle-opacity': 1,
        'circle-pitch-alignment': 'map',
        'circle-pitch-scale': 'viewport',
        'circle-stroke-color': 'rgba(249, 42, 42, 0.16)',
        'circle-stroke-width': 7,
      },
    };
    map.addLayer(alarmCluster_circle, 'alarmIcon');
    map.addLayer(alarmCluster_count);

    map.on('mousemove', 'alarmCluster_circle', handleClusterMousemove);
    map.on('mouseleave', 'alarmCluster_circle', handleClusterMouseleave);

    map.on('click', 'alarmCluster_circle', (e) => {
      if (isSpaceQueryingRef.current) {
        return;
      }
      e.preventDefault();
      e.target.flyTo({
        center: e.lngLat,
        zoom: flyToZoom,
      });
    });
  };

  const handleClusterMousemove = (
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    if (isSpaceQueryingRef.current) {
      return;
    }
    if (e.features && e.features.length > 0) {
      e.features[0].properties.countDetails = JSON.parse(e.features[0].properties.countDetails);

      e.features[0].properties.centralPoint = JSON.parse(e.features[0].properties.centralPoint);
      hoveAreaCluster(e.features[0].properties, e.features[0].properties.centralPoint.coordinates);
    }
  };

  // 报警图标点击事件
  const handleAlarmIconClick = async (e: any) => {
    console.log('报警图标点击');
    //阻止冒泡
    e.preventDefault();
    if (isSpaceQueryingRef.current) {
      return;
    }

    if (e.features && e.features[0] && e.features[0].properties) {
      const alarmId = e.features[0].properties.alarmId;

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
    e: MapMouseEvent & {
      features?: any;
    }
  ) => {
    e.preventDefault();

    if (e.features && e.features[0]) {
      const res = e.features[0] as unknown as { properties: IResItem };

      setCurrentRes(res.properties);
    }
  };

  // 新建一个图层，用于展示高亮区域
  const genHoverAreas = () => {
    const source = initGeoJson();

    map.addSource('area_hover', source);
    const area_hover: maplibregl.LayerSpecification = {
      id: 'area_hover',
      type: 'fill',
      source: 'area_hover',
      // maxzoom: clusterZoom,

      paint: {
        'fill-color': 'rgba(0, 120, 236, 0.70)',
        'fill-outline-color': 'rgba(0, 120, 236, 1)',
        'fill-opacity': 1,
      },
      // filter: ['==', 'areaId', ''],
    };

    map.on('mousemove', 'zhuangzhi_v1_4', mouseInArea);
    map.on('mouseleave', 'zhuangzhi_v1_4', mouseOutArea);

    map.on('mousemove', 'zhuangzhi_v1_3', mouseInArea);
    map.on('mouseleave', 'zhuangzhi_v1_3', mouseOutArea);
    map.addLayer(area_hover, 'alarmIcon');
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
    if (lineAnimateTimer.current) {
      clearInterval(lineAnimateTimer.current);
      lineAnimateTimer.current = null;
    }

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
