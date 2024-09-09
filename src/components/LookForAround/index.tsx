/* eslint-disable @typescript-eslint/ban-ts-comment */
// 查周边逻辑组件
import { request } from '@/utils/request';
import { featureCollection, point, polygon } from '@turf/turf';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { LngLat, LngLatBounds, LngLatLike } from 'mapbox-gl';
import { forwardRef, Ref, useImperativeHandle } from 'react';
import { IResItem } from '@/models/resource';
import { Feature, Point, Position } from 'geojson';

/** 将circle转为 包含地理范围信息的polygon
 * @param circle leaflet 的 circle对象
 */
export function circleTopolygon(circleBounds: LngLatBounds) {
  const { abs, cos, sin } = Math;
  // 获取圆的边界经纬度

  const northEast = circleBounds.getNorthEast();
  // 获取圆心经纬度
  const { lat, lng } = circleBounds.getCenter();
  // 圆以经纬度为刻度的半径
  const xradius = abs(northEast.lat - lat);
  const yradius = abs(northEast.lng - lng);
  // 构造polygon 圆
  const param = 360; // 等分为360个线段--根据精度来确定
  let index = 1; // 角度
  const points1: LngLatLike[] = [];

  while (index <= param) {
    const rad = getRad(index); // 当前角度的弧度
    const x = cos(rad) * xradius + lat;
    const y = sin(rad) * yradius + lng;
    points1.push([y, x]);

    index += 1;
  }

  points1.push(points1[0]);

  // // 默认返回 gejson 对象
  const jsonObj1 = polygon([points1] as unknown as Position[][]);

  return jsonObj1;
}

/** 求弧度
 *@param angle: number 角度 */
const getRad = (angle: number) => {
  const { PI } = Math;
  return (PI * angle) / 180;
};

interface Props {
  map: maplibregl.Map | null;
  coordinates?: number[];
  layerType?: 'reslayer' | 'serachRes';
}

interface GetDataProps {
  coordinate: Feature<Point>;
  radius: number;
}

export type IAroundRefs = {
  clearAroundData: () => void;
  getAroundData: () => void;
};

const LookForAround = (
  { map, coordinates, layerType = 'reslayer' }: Props,
  ref: Ref<IAroundRefs>
) => {
  useMount(() => {
    genCircleLayers();
  });

  //初始化图层 没有就重新注册
  const genCircleLayers = () => {
    const oldcircleFillLayers = map?.getLayer('circleFillLayers');
    const oldcircleLineLayers = map?.getLayer('circleLineLayers');
    const oldsource = map?.getSource('circleFill_source');

    if (!oldcircleFillLayers && !oldcircleLineLayers && !oldsource) {
      //数据
      const source: maplibregl.GeoJSONSourceSpecification = {
        type: 'geojson',
        data: featureCollection([]),
      };
      map?.addSource('circleFill_source', source);
      //普通图层
      const circleFillLayers: maplibregl.LayerSpecification = {
        id: 'circleFillLayers',
        type: 'fill',
        source: 'circleFill_source',

        layout: {},
        paint: {
          'fill-color': 'rgba(0, 120, 236, 0.50)',
          'fill-outline-color': 'rgba(0, 120, 236, 1)',
          'fill-opacity': 0.2,
        },
      };
      //外侧线图层
      const circleLineLayers: maplibregl.LayerSpecification = {
        id: 'circleLineLayers',
        type: 'line',
        source: 'circleFill_source',
        layout: {},
        paint: {
          'line-color': 'red',
          'line-opacity': 0.8,
        },
      };
      map?.addLayer(circleFillLayers);
      map?.addLayer(circleLineLayers);
    }
  };

  //初始化圆形 默认半径是50
  const getAroundData = useMemoizedFn(() => {
    //当前事件的坐标
    if (coordinates) {
      const lngLat = { lng: coordinates[0], lat: coordinates[1] } as LngLat;
      renderCircle(lngLat, 50);

      getData({ coordinate: point(coordinates), radius: 50 });
    }
  });

  //画原型
  const renderCircle = (center: maplibregl.LngLat, radius: number) => {
    // @ts-ignore
    const newBouns = LngLatBounds.fromLngLat(center, radius);
    const newGeoJson = circleTopolygon(newBouns);
    const source = map?.getSource('circleFill_source') as maplibregl.GeoJSONSource;

    source?.setData(newGeoJson);
  };

  const clearAroundData = useMemoizedFn(() => {
    try {
      const circleFill_source = map?.getSource('circleFill_source') as maplibregl.GeoJSONSource;
      circleFill_source?.setData(featureCollection([]));

      const source = map?.getSource(layerType) as maplibregl.GeoJSONSource;
      source?.setData(featureCollection([]));
    } catch (e) {
      //
    }
  });

  //查询周边数据 /cx-alarm/resource/findSurroundSituation
  const getData = useMemoizedFn(async (e: GetDataProps) => {
    const { code, data } = await request<IResItem[]>({
      url: `/cx-alarm/resource/findSurroundSituation`,
      options: {
        method: 'post',
        body: JSON.stringify({
          ...e,
          coordinate: e.coordinate.geometry,
        }),
      },
    });
    const arr: Feature<Point, IResItem>[] = [];
    if (code === 200) {
      data.forEach((item) => {
        const v = item.coordinate as Point;
        arr.push(point(v.coordinates, item));
      });
      const source = map?.getSource(layerType) as maplibregl.GeoJSONSource;
      source?.setData(featureCollection(arr));
    }
  });

  useUnmount(() => {
    clearAroundData();
  });

  useImperativeHandle(ref, () => ({ clearAroundData, getAroundData }));

  return null;
};

export default forwardRef(LookForAround);
