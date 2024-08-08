/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IAlarmClusterItem } from '@/app/(emgc)/emgc/montior/operation/page';
import { IAlarm, IAlarmStatus } from '@/models/alarm';
import { IResItem } from '@/models/resource';
import {
  center,
  Feature,
  feature,
  FeatureCollection,
  featureCollection,
  lineString,
  point,
  Polygon,
} from '@turf/turf';
import { clone } from 'lodash';
import { PointLike } from 'maplibre-gl';
import { stringify } from 'qs';
import { request } from './request';
import { IEventItem } from '@/models/event';

const alarmTypeImgs = [
  'THU',
  'PON',
  'TSM_OPEN_ALA',
  'LT_ALA',
  'NOPLAN_ALA',
  'DL_ALA',
  'FAS',
  'GAS',
  'WEA',
  'OTH_ALA',
  'BAD',
  'CTL_BRA_ALA',
  'CTL_DOOR_ALA',
];

const changeType = (alarmType: string) => {
  let type = alarmType;
  if (alarmType === 'LT_ALA') {
    type = 'NOPLAN_ALA';
  }
  if (alarmType === 'TSM_OPEN_ALA') {
    type = 'CTL_DOOR_ALA';
  }
  if (!alarmTypeImgs.includes(type)) {
    type = 'OTH_ALA';
  }

  return type;
};

export const genLayerIconId = (alarm: IAlarm) => {
  const level = alarm.alarmLevel === 'null' || alarm.alarmLevel === null ? '09' : alarm.alarmLevel;
  const type = changeType(alarm.alarmType);

  const layerId = alarm.alarmType && type + '_' + level;

  return layerId;
};
export const genHoverLayerIconId = (alarm: IAlarm) => {
  const level = alarm.alarmLevel === 'null' || alarm.alarmLevel === null ? '09' : alarm.alarmLevel;
  const type = changeType(alarm.alarmType);

  return alarm.alarmType && type + '_h' + '_' + level;
};
//  膛路熄火 NOPLAN_ALA LT_ALA 逃生门打开: TSM_OPEN_ALA
// , 'BAD', 'CTL_BRA_ALA', 'CTL_DOOR_ALA'

// 根据报警列表数据，生成报警图标图层需要的geojson数据
// 增加线图层报警
export const genAlarmIcons = (alarmList: IAlarm[]) => {
  const features = [];

  for (const alarm of alarmList) {
    if (!alarm.coordinate) {
      continue;
    }

    //const level = '';

    const feature_ = feature(alarm.coordinate, {
      layerId: genLayerIconId(alarm),
      currentAlarm: alarm,
      alarmId: alarm.alarmId,
      alarmAreaId: alarm.alarmAreaId,
      floorLevel: alarm.floorLevel,
      alarmType: alarm.alarmType,
    });
    // 线或面图层，生成一个中心点，用于绘制图标.周界相关有额外展示，不画图标
    if (
      alarm.coordinate.type !== 'Point' &&
      alarm.alarmType !== 'PON' &&
      alarm.alarmType !== 'PON_M'
    ) {
      const feature_point = center(alarm.coordinate, {
        properties: {
          layerId: genLayerIconId(alarm),
          currentAlarm: alarm,
          alarmId: alarm.alarmId,
          alarmAreaId: alarm.alarmAreaId,
          floorLevel: alarm.floorLevel,
          alarmType: alarm.alarmType,
        },
      });
      features.push(feature_point);
    }

    features.push(feature_);
  }
  const features_ = featureCollection(features);

  return features_;
};

// 生成周界图层中心点图层，用于点击事件

export const genAlarmLineIcons = (alarmList: IAlarm[]) => {
  const features = [];

  // const alarms = alarmList.filter((val) => !val.coordinate);
  // console.info('==========alarms================', alarms);
  for (const alarm of alarmList.filter(
    (val) =>
      val.coordinate &&
      val.coordinate.type === 'LineString' &&
      (val.alarmType === 'PON' || val.alarmType === 'PON_M')
  )) {
    // const level = alarm.alarmLevel === 'null' || alarm.alarmLevel === null ? '09' : alarm.alarmLevel;

    const cellId = alarm.cellId || 'N';
    const layerId = alarm.alarmType + '_' + cellId;

    const center_ = center(alarm.coordinate, {
      properties: {
        layerId: layerId,
        // layerId: 'BAD_h_03',
        isUp: true,
        opacity: 0.2,
        currentAlarm: alarm,
        alarmId: alarm.alarmId,
        alarmAreaId: alarm.alarmAreaId,
        floorLevel: alarm.floorLevel,
      },
    });

    // const point =
    //const level = '';
    // const feature_ = feature(center_, {
    //   layerId: alarm.alarmType && alarmTypeImgs.includes(alarm.alarmType) ? alarm.alarmType + '_' + level : 'OTH_ALA' + '_' + level,
    //   currentAlarm: alarm,
    //   alarmId: alarm.alarmId,
    //   alarmAreaId: alarm.alarmAreaId,
    //   floorLevel: alarm.floorLevel,
    // });

    features.push(center_);
  }

  const features_ = featureCollection(features);

  return features_;
};
// 生成报警聚合需要的额geojson数据
export const genAlarmClusterData = (clusterDatas: Feature<Polygon, IAlarmClusterItem>[]) => {
  const features = [];
  for (const clusterData of clusterDatas) {
    const feature_ = feature(clusterData.properties.centralPoint, {
      ...clusterData.properties,
    });
    features.push(feature_);
  }

  // 临时增加判断，非1楼数据合并到对应的1楼。非1楼不展示
  for (const feature of features) {
    if (feature.properties.floorLevel !== '1') {
      const level1 = features.find(
        (val) =>
          val.properties.areaCode === feature.properties.areaCode &&
          val.properties.floorLevel === '1'
      );
      if (level1) {
        //所有楼层楼都可能没有数据，这里加一个默认值[]
        level1.properties.countDetails = level1.properties.countDetails ?? [];
        feature.properties.countDetails = feature.properties.countDetails ?? [];
        //报警数量叠加
        level1.properties.alarmCount += feature.properties.alarmCount;
        for (const countDetail of level1.properties.countDetails) {
          countDetail.alarmTypeName += `(${level1.properties.floorLevel} 楼)`;
        }
        for (const countDetail of feature.properties.countDetails) {
          countDetail.alarmTypeName += `(${feature.properties.floorLevel} 楼)`;
        }
        level1.properties.countDetails.push(...feature.properties.countDetails);
      }
    }
  }
  //过滤掉楼层为2楼和没有报警的数据
  const features_ = featureCollection(
    features.filter((val) => val.properties.floorLevel === '1' && val.properties.alarmCount)
  );
  return features_;
};

// 报警聚合数据获取，并更新对应图层
// 第四个参数为所属部门，用于数据权限
export const updateAlarmCluster = async (
  map: maplibregl.Map,
  alarmTypes: string,
  status: IAlarmStatus,
  orgIds: Array<string>
) => {
  const obj = alarmTypes === '' ? { status } : { alarmTypes, status, orgIds: orgIds };

  const param = stringify(obj, { indices: false });
  const url = `/cx-alarm/alm/alarm/alarmMap?${param}`;

  const res = (await request({ url })) as unknown as FeatureCollection<Polygon, IAlarmClusterItem>;

  const alarmCluster_count = map.getSource('alarmCluster_count') as maplibregl.GeoJSONSource;

  if (alarmCluster_count && res.features) {
    const featureCollections = genAlarmClusterData(res.features);
    alarmCluster_count.setData(featureCollections as GeoJSON.GeoJSON);
  }
};

export const updateAlarmClusterDp = async (
  map: maplibregl.Map,
  alarmTypes: string,
  status: IAlarmStatus
) => {
  const obj = alarmTypes === '' ? { status } : { alarmTypes, status };

  const param = stringify(obj, { indices: false });
  const url = `/cx-alarm/alm/alarm/alarmMapDp?${param}`;

  const res = (await request({ url })) as unknown as FeatureCollection<Polygon, IAlarmClusterItem>;

  const alarmCluster_count = map.getSource('alarmCluster_count') as maplibregl.GeoJSONSource;

  if (alarmCluster_count && res.features) {
    const featureCollections = genAlarmClusterData(res.features);
    alarmCluster_count.setData(featureCollections as GeoJSON.GeoJSON);
  }
};

// 默认地图 空 source的geojson

export const initGeoJson = () => {
  const source: maplibregl.GeoJSONSourceSpecification = {
    type: 'geojson',

    data: featureCollection([]),
    generateId: true,
  };

  return source;
};

// 生成资源搜索结果的图层数据
export const genSearchResGeom = (iterator: IResItem) => {
  // @ts-ignore
  switch (iterator.coordinate.type) {
    case 'Point': // @ts-ignore
      return [point(iterator.coordinate.coordinates, clone({ ...iterator }))];

    case 'LineString': // @ts-ignore
      return [
        center(iterator.coordinate, { properties: clone({ ...iterator }) }),
        lineString(iterator.coordinate.coordinates, clone({ ...iterator })),
      ];

    case 'Polygon': // @ts-ignore
      return [center(iterator.coordinate, { properties: clone({ ...iterator }) })];

    default: // @ts-ignore
      return [center(iterator.coordinate, { properties: clone({ ...iterator }) })];
  }
};

export const genSearchResIcons = (searchRes: IResItem[], hoverId?: string) => {
  const features = [];

  for (const [index, iterator] of searchRes.entries()) {
    iterator.sort = index + 1;
    iterator.layerId = 'popup';
    //添加是否hover属性 列表hover是地图上的图片也可以切换为hover
    if (hoverId === iterator.resourceNo) {
      iterator.hover = true;
    } else {
      iterator.hover = false;
    }

    // @ts-ignore
    if (iterator.coordinate && iterator.coordinate.coordinates.length > 0) {
      const fe = genSearchResGeom(iterator);

      features.push(...fe);
    }
  }

  // @ts-ignore
  return featureCollection(features);
};

/**
 * 判断两个点是否相等
 * @param a
 * @param b
 * @returns
 */
export function arePointsEqual(a?: PointLike, b?: PointLike): boolean {
  const ax = Array.isArray(a) ? a[0] : a ? a.x : 0;
  const ay = Array.isArray(a) ? a[1] : a ? a.y : 0;
  const bx = Array.isArray(b) ? b[0] : b ? b.x : 0;
  const by = Array.isArray(b) ? b[1] : b ? b.y : 0;
  return ax === bx && ay === by;
}
const genEventIcon = (event: IEventItem) => {
  return '';
};
// 生成事件图标图层数据
export const genEventIcons = (envList: IEventItem[]) => {
  const features = [];

  for (const event of envList) {
    if (!event.geom) {
      continue;
    }

    //const level = '';

    const feature_ = feature(event.geom, {
      layerId: genEventIcon(event),
      currentEvent: event,
      eventId: event.id,
      alarmId: event.alarmId,
      incidentTypeName: event.incidentTypeName,
      incidentAddress: event.incidentAddress,
      incidentType: event.incidentType,
      orgName: event.incidentType,
    });
    // 线或面图层，生成一个中心点，用于绘制图标.周界相关有额外展示，不画图标
    if (
      event.geom.type !== 'Point' &&
      event.incidentType !== 'PON' &&
      event.incidentType !== 'PON_M'
    ) {
      const feature_point = center(event.geom, {
        properties: {
          layerId: genEventIcon(event),
          currentEvent: event,
          eventId: event.id,
          alarmId: event.alarmId,
          incidentTypeName: event.incidentTypeName,
          incidentAddress: event.incidentAddress,
          incidentType: event.incidentType,
          orgName: event.incidentType,
        },
      });
      features.push(feature_point);
    }

    features.push(feature_);
  }
  const features_ = featureCollection(features);

  return features_;
};
