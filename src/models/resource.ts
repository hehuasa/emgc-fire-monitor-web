import { LineString, Point, Polygon } from '@turf/turf';
import { createContext } from 'react';
import { atom } from 'recoil';

export interface IResItem {
  areaId: string;
  area_id: string;
  layerId?: string;
  sort?: number;
  address: string;
  deptName: string;
  deptId: number;
  areaName: string;
  equipmentid: number;
  floorLevel: string;
  id: string;
  layerid: string;
  icon: string;
  resourceName: string;
  equipmentId: string;
  productName: string;
  resourceNo: string;
  coordinate: Point | LineString | Polygon;
  //coordinates: Point;
  deptname: string;
  iotDeviceId: string;
  hasVideo: number;
  hover?: boolean;
  isClick?: boolean;
  situationType?: string;
}
export interface IResourcePage {
  current: number;
  pages: number;
  records: IResItem[];
  size: number;
  total: number;
}
export interface IGpsInfo {
  address: string;
  areaId: string;
  areaName: string;
  coordinate: { coordinates: number[]; type: 'Point' };
  id: string;
  iotDeviceId: string;
  iotSubDeviceId: string;
  resourceName: string;
  resourceNo: string;
  userId: string;
  userName: string;
}
export interface IGpsDetail extends IGpsInfo {
  address: string;
  email: string;
  id: string;
  idCardNo: string;
  loginAccount: string;
  mobile: string;
  orgId: string;
  orgName: string;
  positionId: string[];
  positionName: string[];
  sex: string;
  shortNum: string;
  userCode: string;
  userName: string;
  iotDeviceId: string;
  iotSubDeviceId: string;
  userState: 0 | 1; // 用户状态（0： 禁用， 1：启用 ）
}

export interface IGpsList {
  userName: string;
  resourceNo: string;
  department: string;
  resourceId: string;
}

export const TimerContext = createContext<NodeJS.Timer | null>(null);

export const currentResModel = atom<IResItem | null>({
  key: 'currentRes_',
  default: null,
});
export const searchHoverResIdModel = atom<string>({
  key: 'searchHoverResId_',
  default: '',
});
export const searchTypeModel = atom<'text' | 'sapce' | ''>({
  key: 'searchType_',
  default: 'text',
});
export const searchParamModel = atom<string>({
  key: 'searchParam_',
  default: JSON.stringify({}),
});

export const searchResModel = atom<IResItem[]>({
  key: 'searchRes_',
  default: [],
});
export interface IResAreaCount {
  [key: string]: number;
}
export const resAreaCountModel = atom<IResAreaCount>({
  key: 'resAreaCount_',
  default: {},
});
export const currentGpsInfoModel = atom<IGpsDetail | null>({
  key: 'currentGpsInfo_',
  default: null,
});

export const currentGpsListModel = atom<IGpsList[] | null>({
  key: 'currentGpsList_',
  default: null,
});

// 清空地图搜索框
export const clearMapSearchModel = atom<number | null>({
  key: 'clearMapSearchModel_',
  default: null,
});

// 应急指挥底部菜单选中项
export const emgcCommandFooterActiveModel = atom<string>({
  key: 'emgcCommandFooterActiveModel_',
  default: '',
});

// 应急指挥事件事发物质查看详情
export const incidentMatterShowDetailModel = atom<boolean>({
  key: 'incidentMatterShowDetailModel_',
  default: false,
});

// 应急指挥事件事发物质
export const incidentMatterModel = atom<string>({
  key: 'incidentMatterModel_',
  default: '',
});

// 监测预警图层选中项
export const checkedLayersModel = atom<string[]>({
  key: 'checkedLayers_',
  default: [],
});

export const emgcGpsTimerModel = atom<NodeJS.Timer | null>({
  key: 'emgcGpsTimer_',
  default: null,
});
