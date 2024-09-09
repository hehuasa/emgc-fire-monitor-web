import { Point } from 'geojson';
import { atom } from 'recoil';

export interface listType {
  name: string;
  code: string;
}

export interface moduleType {
  code: string;
  name: string;
  list: Array<listType>;
}

export interface tagMap {
  system: string;
  systemName: string;
  module: Array<moduleType>;
}

//码表数据
export interface DCItem {
  cnName: string;
  defaulted: null;
  dictCode: string;
  enName: null;
  icon: null;
  id: string;
  remark: null;
  sort: 1;
  status: 0;
  value: string;
}

export interface ILayer {
  hasLayer: number;
  icon: string;
  id: string;
  layerCode: string;
  layerName: string;
  parentId: string;
  sortNo: number;
  children?: ILayer[];
}

export interface IDeviceListItem {
  address: string;
  areaId: string;
  areaName: string;
  coordinate: Point;
  deptId: string;
  deptName: string;

  floorLevel: string;
  geoType: string;
  hasRelevanceVideo: number;
  hasVideo: null;
  icon: string;
  id: string;
  iotDeviceId: string;
  iotSubDeviceId: string;
  layerName: string;
  resourceName: string;
  resourceNo: string;
  stationFlag: string;
  sortNo: string;
  productId: string;
  layerId: string;
  equipmentId: string;
  cellId: string;
  switchStatus: 1 | 0;
}

export interface IDepartment {
  id: string;
  orgCode: string;
  orgName: string;
  parentCode: null;
  shortIndex: number;
  shortName: null;
  children?: IDepartment[];
}

export interface IDeviceType {
  contacts: null;
  deleted: 0;
  description: null;
  id: string;
  major: string;
  manufacturer: null;
  model: null;
  nickname: null;
  productName: string;
  type: number;
}

export interface IAreaCell {
  areaId: string; //1
  id: string;
  productionCellCode: string;
  productionCellName: string;
}

export interface IRoleType {
  id: string;
  isEnable: '0' | '1';
  roleCode: string;
  roleDes: string;
  roleName: string;
}

export interface IAlarmType {
  alarmGroup: string;
  alarmGroupName: string;
  alarmSound: string;
  alarmType: string;
  alarmTypeName: string;
  hasShow: 0 | 1;
  icon: string;
  productId: string;
  productName: string;
}

export interface deviceProperty {
  fieldCode: string;
  fieldName: string;
  fieldType: string;
  id: string;
  productId: string;
  sub: boolean;
  unit: string;
}
export interface IUploadFileRespond {
  fileName: string;
  realFileName: string;
  url: string;
}

export const systemTagModal = atom<Map<string, tagMap> | null>({
  key: 'systemTagModal_',
  default: null,
});
