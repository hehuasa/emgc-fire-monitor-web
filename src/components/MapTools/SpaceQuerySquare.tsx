import { isInIconModel, isSpaceQueryingModel, MapContext } from '@/models/map';
import { searchParamModel } from '@/models/resource';
import { initGeoJson } from '@/utils/mapUtils';
import {
  FeatureCollection,
  Polygon,
  Feature,
  featureCollection,
  Point,
  point,
  bbox,
  bboxPolygon,
  distance,
  bearing,
  transformTranslate,
  lineString,
  polygon,
} from '@turf/turf';
import { useMount, useUnmount } from 'ahooks';
import { MapMouseEvent } from 'maplibre-gl';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';

const priColor = 'rgba(0, 120, 236, 1)';

// 空dom组件，用于承载地图相关事件的注册及销毁
const SpaceQuerySquare = () => {
  const map = useContext(MapContext);

  const setIsSpaceQuerying = useSetRecoilState(isSpaceQueryingModel);
  const [searchParam, setSearchParam] = useRecoilState(searchParamModel);
  const isInIcon = useRecoilValue(isInIconModel);

  const startPoint = useRef([0, 0]);
  const startPointScreen = useRef([0, 0]); // 增加屏幕坐标，适配地图旋转情况

  const newPolygon = useRef<FeatureCollection<Polygon, any>>(featureCollection([]));
  const newPoints = useRef<FeatureCollection<Point, any>>(featureCollection([]));
  const isDrag = useRef(false);
  const isResize = useRef(false);
  const isAdd = useRef(false);
  const isInCircle = useRef(false);
  const oriPointRef = useRef(point([0, 0]));
  const currentPointIndexRef = useRef(-1);
  const currentPointIndex_lastRef = useRef(-1);

  const currentPointIndex_nextRef = useRef(-1);

  const polygonSource = useRef<maplibregl.GeoJSONSource>();
  const pointSource = useRef<maplibregl.GeoJSONSource>();

  const screenPointSource = useRef<{ point: [number, number]; index: number }[]>([]);

  // 事件都注册为ref，避免重新实例化
  const squeareMouseUp = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const squeareMove = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const handleClick = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const spaceQuery_s_fillEnter = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const spaceQuery_s_fillLeave = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const spaceQuery_s_fillDown = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const spaceQuery_s_circle_hideEnter = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const spaceQuery_s_circle_hideLeave = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const spaceQuery_s_circle_hideDown = useRef<(ev: MapMouseEvent & { features?: any }) => void>();
  const addSquareMoveEvent = useRef<(ev: MapMouseEvent & { features?: any }) => void>();

  const isInIconRef = useRef(false);
  // 监听鼠标是否在图标上
  useEffect(() => {
    isInIconRef.current = isInIcon;
  }, [isInIcon]);

  const initLayerAndEvent = () => {
    const source = initGeoJson();

    if (map) {
      // map.on('sourcedata', sourcedataEvent);

      map.addSource('spaceQuery_s', source);
      map.addSource('spaceQuery_s_circle', source);

      map.addLayer(
        {
          type: 'fill',
          id: 'spaceQuery_s_fill',
          source: 'spaceQuery_s',
          paint: {
            'fill-color': ['case', ['boolean', ['get', 'hover'], false], '#fff', priColor],
            'fill-opacity': 0.5,
          },
        },
        'serachRes'
      );
      map.addLayer(
        {
          type: 'line',
          id: 'spaceQuery_s_line',
          source: 'spaceQuery_s',
          paint: {
            'line-color': priColor,
            'line-width': 2,
          },
        },
        'serachRes'
      );
      map.addLayer(
        {
          id: 'spaceQuery_s_circle',
          type: 'circle',
          source: 'spaceQuery_s_circle',
          paint: {
            'circle-color': ['case', ['boolean', ['get', 'hover'], false], 'yellow', priColor],
            // 'circle-stroke-color': ['case', ['boolean', ['get', 'hover'], false], 'gray', priColor],
            // 'circle-stroke-width': 2,

            'circle-radius': 6,
            // 'circle-translate': [-3, 3],

            // 'circle-radius': ['case', ['boolean', ['get', 'hover'], false], 12, 6],
          },
          // layout: {
          //   ""
          // }
        },
        'serachRes'
      );
      map.addLayer(
        {
          id: 'spaceQuery_s_circle_hide',
          type: 'circle',
          source: 'spaceQuery_s_circle',
          paint: {
            'circle-opacity': 0,
            'circle-radius': 12,
          },
        },
        'serachRes'
      );
    }
  };

  const initSquareEvent = () => {
    spaceQuery_s_fillEnter.current = (e: MapMouseEvent) => {
      if (isInIconRef.current) {
        return;
      }
      e.target.dragPan.disable();
      newPolygon.current.features[0].properties.hover = true;

      if (!isInCircle.current && !isResize.current) {
        polygonSource.current?.setData(newPolygon.current);
      }
    };
    spaceQuery_s_fillLeave.current = (e: MapMouseEvent) => {
      if (!isDrag.current && !isResize.current) {
        newPolygon.current.features[0].properties.hover = false;

        if (!isInCircle.current) {
          polygonSource.current?.setData(newPolygon.current);

          e.target.dragPan.enable();
        }
      }
    };
    spaceQuery_s_fillDown.current = (e: MapMouseEvent) => {
      if (isInIconRef.current) {
        return;
      }
      if (isResize.current || isAdd.current || isInCircle.current) {
        return;
      }
      oriPointRef.current.geometry.coordinates = e.lngLat.toArray();
      isDrag.current = true;
    };
    spaceQuery_s_circle_hideEnter.current = (e: MapMouseEvent & { features?: any }) => {
      if (e.features && e.features[0]) {
        const currentFe = e.features[0] as any;

        isInCircle.current = true;
        isDrag.current = false;
        const fe = newPoints.current.features.find(
          (val) => val.properties.index === currentFe.properties.index
        );
        if (fe) {
          fe.properties.hover = true;
        }
        pointSource.current?.setData(newPoints.current);
      }
      e.target.dragPan.disable();
    };
    spaceQuery_s_circle_hideLeave.current = () => {
      isInCircle.current = false;
      for (const fe of newPoints.current.features) {
        fe.properties.hover = false;
      }
      pointSource.current?.setData(newPoints.current);
    };
    spaceQuery_s_circle_hideDown.current = (e: MapMouseEvent & { features?: any }) => {
      if (isDrag.current || isAdd.current) {
        return;
      }
      isResize.current = true;
      if (e.features && e.features[0]) {
        const fe = e.features[0] as Feature<Point, any>;

        currentPointIndexRef.current = fe.properties.index;
        if (currentPointIndexRef.current === 0) {
          currentPointIndex_lastRef.current = 3;
          currentPointIndex_nextRef.current = 1;
        }
        if (currentPointIndexRef.current === 3) {
          currentPointIndex_lastRef.current = 2;
          currentPointIndex_nextRef.current = 0;
        }
        if (currentPointIndexRef.current !== 3 && currentPointIndexRef.current !== 0) {
          currentPointIndex_lastRef.current = currentPointIndexRef.current - 1;
          currentPointIndex_nextRef.current = currentPointIndexRef.current + 1;
        }
        // currentPoint = e.features[0].geometry
      }
    };
    // 矩形鼠标抬起事件

    squeareMouseUp.current = (e) => {
      if (isResize.current) {
        isResize.current = false;

        newPolygon.current = polygonSource.current?._data as any;
        const points = genPoints(newPolygon.current.features[0]);
        newPoints.current = points;
        pointSource.current?.setData(points);

        doQuery(newPolygon.current.features[0].geometry);
      }
      if (isDrag.current) {
        isDrag.current = false;
        newPolygon.current = polygonSource.current?._data as any;
        newPoints.current = pointSource.current?._data as any;
        doQuery(newPolygon.current.features[0].geometry);
      }
    };

    // 矩形拖动事件
    squeareMove.current = (e: MapMouseEvent) => {
      if (isResize.current) {
        const newP = e.lngLat.toArray();
        const newScreenPoint = e.point;

        // 动态计算各个端点的坐标，保证四个点实现最小矩形。 由于各个顶点的xy情况不同，需要做不同的判断
        for (const feature of newPoints.current.features) {
          if (currentPointIndexRef.current === 0 || currentPointIndexRef.current === 2) {
            if (feature.properties.index === currentPointIndex_lastRef.current) {
              // feature.geometry.coordinates[0] = newP[0];
              feature.geometry.coordinates = map!.unproject(newScreenPoint).toArray();
            }
            if (feature.properties.index === currentPointIndex_nextRef.current) {
              // feature.geometry.coordinates[1] = newP[1];
              feature.geometry.coordinates = map!.unproject(newScreenPoint).toArray();
            }
          }
          if (currentPointIndexRef.current === 1 || currentPointIndexRef.current === 3) {
            if (feature.properties.index === currentPointIndex_lastRef.current) {
              // feature.geometry.coordinates[1] = newP[1];
              feature.geometry.coordinates = map!.unproject(newScreenPoint).toArray();
            }
            if (feature.properties.index === currentPointIndex_nextRef.current) {
              // feature.geometry.coordinates[0] = newP[0];
              feature.geometry.coordinates = map!.unproject(newScreenPoint).toArray();
            }
          }

          if (feature.properties.index === currentPointIndexRef.current) {
            // feature.geometry.coordinates = newP;
            feature.geometry.coordinates = map!.unproject(newP).toArray();
          }
        }

        // 重置屏幕坐标数组
        for (const screenPoint of screenPointSource.current) {
          if (currentPointIndexRef.current === 0 || currentPointIndexRef.current === 2) {
            if (screenPoint.index === currentPointIndex_lastRef.current) {
              screenPoint.point[0] = newScreenPoint.x;
            }
            if (screenPoint.index === currentPointIndex_nextRef.current) {
              screenPoint.point[1] = newScreenPoint.y;
            }
          }

          if (currentPointIndexRef.current === 1 || currentPointIndexRef.current === 3) {
            if (screenPoint.index === currentPointIndex_lastRef.current) {
              screenPoint.point[1] = newScreenPoint.y;
            }
            if (screenPoint.index === currentPointIndex_nextRef.current) {
              screenPoint.point[0] = newScreenPoint.x;
            }
          }
          if (screenPoint.index === currentPointIndexRef.current) {
            screenPoint.point = [newScreenPoint.x, newScreenPoint.y];
          }
        }

        const point_0 = map!.unproject(screenPointSource.current[0].point);
        const point_1 = map!.unproject(screenPointSource.current[1].point);
        const point_2 = map!.unproject(screenPointSource.current[2].point);
        const point_3 = map!.unproject(screenPointSource.current[3].point);

        newPolygon.current = featureCollection([
          polygon([
            [
              point_0.toArray(),
              point_1.toArray(),
              point_2.toArray(),
              point_3.toArray(),
              point_0.toArray(),
            ],
          ]),
        ]);
        polygonSource.current?.setData(newPolygon.current);

        const points = featureCollection([
          point(point_0.toArray(), { index: 0 }),
          point(point_1.toArray(), { index: 2 }),
          point(point_2.toArray(), { index: 2 }),
          point(point_3.toArray(), { index: 3 }),
        ]);
        newPoints.current = points;
        polygonSource.current?.setData(newPolygon.current);

        pointSource.current?.setData(newPoints.current);
      }
      if (isDrag.current) {
        const newPoint = point(e.lngLat.toArray());

        const distance_ = distance(oriPointRef.current, newPoint);
        const bearing_ = bearing(oriPointRef.current, newPoint);
        const newP = transformTranslate(newPolygon.current, distance_, bearing_);
        newPoints.current = genPoints(newP.features[0]);
        pointSource.current?.setData(newPoints.current);

        polygonSource.current?.setData(newP);
      }
    };
    if (map) {
      map.on('mouseenter', 'spaceQuery_s_fill', spaceQuery_s_fillEnter.current!);
      map.on('mouseleave', 'spaceQuery_s_fill', spaceQuery_s_fillLeave.current!);
      map.on('mousedown', 'spaceQuery_s_fill', spaceQuery_s_fillDown.current!);

      map.on('mouseenter', 'spaceQuery_s_circle_hide', spaceQuery_s_circle_hideEnter.current!);
      map.on('mouseleave', 'spaceQuery_s_circle_hide', spaceQuery_s_circle_hideLeave.current!);
      map.on('mousedown', 'spaceQuery_s_circle_hide', spaceQuery_s_circle_hideDown.current!);

      // 需要重置一下端点数据，因为经过拖拽，源数据的index与其对应的位置可能已错乱
      map.on('mouseup', squeareMouseUp.current!);
      map.on('mousemove', squeareMove.current!);
    }
  };

  // 根据矩形数据，重新生成矩形端点数据
  const genPoints = (bboxPolygon_: Feature<Polygon, any>) => {
    const points = [];
    for (const [index, iterator] of bboxPolygon_.geometry.coordinates[0].entries()) {
      if (index === bboxPolygon_.geometry.coordinates[0].length - 1) {
        break;
      }
      points.push(point(iterator, { index, hover: false }));
    }

    return featureCollection(points);
  };

  // 关闭矩形查周边，清除图层\事件
  const offSquareQuery = () => {
    offMapEvent();
    clearLayers();

    setIsSpaceQuerying(false);
    isAdd.current = false;
    isResize.current = false;
    isDrag.current = false;
    isInCircle.current = false;
  };
  //  清除图层
  const clearLayers = () => {
    pointSource.current = undefined;
    polygonSource.current = undefined;
    if (map) {
      if (map.getLayer('spaceQuery_s_circle_hide')) {
        map.removeLayer('spaceQuery_s_fill');
        map.removeLayer('spaceQuery_s_line');

        map.removeLayer('spaceQuery_s_circle');

        map.removeLayer('spaceQuery_s_circle_hide');

        map.removeSource('spaceQuery_s_circle');
        map.removeSource('spaceQuery_s');
      }
    }
  };

  // 注销相关地图事件
  const offMapEvent = () => {
    if (map) {
      map.off('mouseup', squeareMouseUp.current!);
      map.off('mousemove', squeareMove.current!);
      map.off('click', handleClick.current!);
      map.off('mouseenter', 'spaceQuery_s_fill', spaceQuery_s_fillEnter.current!);
      map.off('mouseleave', 'spaceQuery_s_fill', spaceQuery_s_fillLeave.current!);
      map.off('mousedown', 'spaceQuery_s_fill', spaceQuery_s_fillDown.current!);

      map.off('mouseenter', 'spaceQuery_s_circle_hide', spaceQuery_s_circle_hideEnter.current!);
      map.off('mouseleave', 'spaceQuery_s_circle_hide', spaceQuery_s_circle_hideLeave.current!);
      map.off('mousedown', 'spaceQuery_s_circle_hide', spaceQuery_s_circle_hideDown.current!);
      // map.off('sourcedata', sourcedataEvent);
    }
  };
  // 执行查周边
  const doQuery = useCallback(
    async (polygon: Polygon) => {
      const obj = JSON.stringify({
        layerIds: null,
        polygon: JSON.stringify(polygon),
        pageIndex: 1,
        pageSize: 10,
      });
      setSearchParam(obj);
    },
    [searchParam]
  );

  useMount(() => {
    initLayerAndEvent();
    setIsSpaceQuerying(true);
    //绘制矩形的鼠标移动事件
    addSquareMoveEvent.current = (ev: MapMouseEvent) => {
      const endPoint = ev.lngLat.toArray();

      // 经纬度的矩形框
      const line = lineString([startPoint.current, endPoint]);
      const bbox_ = bbox(line);
      const bboxPolygon_ = bboxPolygon(bbox_);

      // 增加屏幕坐标，适配地图旋转情况
      const point_0 = point(startPoint.current, {
        index: 0,
        hover: false,
      });

      const point_1 = point(map!.unproject([ev.point.x, startPointScreen.current[1]]).toArray(), {
        index: 1,
        hover: false,
      });
      const point_2 = point(endPoint, {
        index: 2,
        hover: false,
      });

      const point_3 = point(map!.unproject([startPointScreen.current[0], ev.point.y]).toArray(), {
        index: 3,
        hover: false,
      });
      screenPointSource.current = [
        {
          point: [startPointScreen.current[0], startPointScreen.current[1]],
          index: 0,
        },
        { point: [ev.point.x, startPointScreen.current[1]], index: 1 },
        { point: [ev.point.x, ev.point.y], index: 2 },
        { point: [startPointScreen.current[0], ev.point.y], index: 3 },
      ];
      const screenBbox = polygon([
        [
          point_0.geometry.coordinates,
          point_1.geometry.coordinates,
          point_2.geometry.coordinates,
          point_3.geometry.coordinates,
          point_0.geometry.coordinates,
        ],
      ]);
      // const bboxPolygon_ = transformRotate(bboxPolygon(bbox_), 55, { pivot: startPoint.current });

      // const points = genPoints(bboxPolygon_);
      // newPolygon.current = featureCollection([bboxPolygon_]);

      const points = featureCollection([point_0, point_1, point_2, point_3]);
      newPolygon.current = featureCollection([screenBbox]);
      newPoints.current = points;
      polygonSource.current?.setData(newPolygon.current);

      pointSource.current?.setData(newPoints.current);
    };
    // 开始绘制矩形的点击事件
    handleClick.current = (e: MapMouseEvent) => {
      console.log('矩形选择开始··········');
      if (isInIconRef.current) {
        return;
      }
      if (!polygonSource.current) {
        polygonSource.current = e.target.getSource('spaceQuery_s') as maplibregl.GeoJSONSource;
      }
      if (!pointSource.current) {
        pointSource.current = e.target.getSource('spaceQuery_s_circle') as maplibregl.GeoJSONSource;
      }

      if (isAdd.current) {
        e.target.off('mousemove', addSquareMoveEvent.current!);
        isAdd.current = false;
        doQuery(newPolygon.current.features[0].geometry);
        setTimeout(() => {
          initSquareEvent();
        }, 1 * 100);
        e.target.off('click', handleClick.current!);
        return;
      }
      startPoint.current = e.lngLat.toArray();
      startPointScreen.current = [e.point.x, e.point.y]; // 增加屏幕坐标，适配地图旋转情况

      isAdd.current = true;
      e.target.on('mousemove', addSquareMoveEvent.current!);
    };

    if (map) {
      map.on('click', handleClick.current);
    }
  });
  useUnmount(() => {
    offSquareQuery();
    //关闭框选的时候打开地图拖动功能
    map?.dragPan.enable();
  });

  return null;
};

export default SpaceQuerySquare;
