import { Point } from 'geojson';
import { createContext } from 'react';
import { atom } from 'recoil';
import { IAlarmStatus } from './alarm';
import { IUeMap } from '@/components/UeMap';
import { Scene } from '@antv/l7';

export const MapSceneContext = createContext<Scene | null>(null);
export type MapContextValue = maplibregl.Map;
export const MapContext = createContext<MapContextValue | null>(null);

type MapContext3DValue = IUeMap;
export const MapContext3D = createContext<MapContext3DValue | null>(null);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const UpdateAlarmfnContext = createContext<UpdateAlarmListFn>();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const UpdateAlarmfnContextSms = createContext<UpdateAlarmListFnSms>();
interface UpdateAlarmListFn {
  updateAlarmCluster: (data: UpdateAlarmListParam) => void;
  getAlalrmList: (data: UpdateAlarmListParam) => void;
}

interface UpdateAlarmListFnSms {
  updateAlarmClusterSms: (data: UpdateAlarmListParamSms) => void;
  getAlalrmList: (data: IAlarmStatus) => void;
}

export interface UpdateAlarmListParam {
  currentAlarmStatus_: IAlarmStatus;
  alarmTypes_: string;
  alarmDepartment_: string;
}

export interface UpdateAlarmListParamSms {
  currentAlarmStatus_: IAlarmStatus;
  alarmTypes_: string;
  alarmDepartment_: string[];
}

//应急指挥地图实例
export const EmergencyCommandMapContext = createContext<MapContextValue | null>(null);

export interface IArea {
  areaId: string;
  areaName: string;
  centralPoint: Point;
  chargeInfo: string;
  chargePhone: string; // 电话号码
  deptName: string;
  floorLevel: string;
  areaCode: string;
  hasMulFloors: number;
  mapLayer: string;
}

export interface IAreaFloorCounts extends IArea {
  // areaId: string;
  // areaName: string;

  // floorLevel: string;
  isChecked: boolean;

  // ct: number; // 报警数据统计
  // resCount: number;
}
export const isSpaceQueryingModel = atom<boolean>({
  key: 'isSpaceQuerying_',
  default: false,
});

export const currentAreaFloorsModel = atom<IAreaFloorCounts[]>({
  key: 'currentAreaFloors_',
  default: [],
});

//广播弹窗是否展示
export const broadcastVisibleModel = atom<boolean>({
  key: 'broadcastVisibleModel',
  default: false,
});

//门禁弹窗展示
export const accessControltVisibleModel = atom<boolean>({
  key: 'accessControltVisibleModel',
  default: false,
});

export const isInIconModel = atom<boolean>({
  key: 'isInIcon_',
  default: false,
});
