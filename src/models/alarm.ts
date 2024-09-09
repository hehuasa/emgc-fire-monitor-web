// import { Point } from "@turf/turf";
import { IAlarmClusterItem } from '@/app/[locale]/(emgc)/monitor/operation/page';
import { AlarmLevelRefer } from '@/utils/util';
import { Feature, Polygon } from 'geojson';
import { atom } from 'recoil';

export interface IAlarm {
  address: string; // 报警具体位置
  alarmNo: string; // 报警编号
  // alarmAreaId: string; // 报警具体位置
  // alarmAreaName: string; // 报警区域名称
  // alarmDeviceId: string; // 报警具体位置
  // alarmDeviceName: string; // 报警具体位置
  alarmId: string; // 报警id
  iotAlarmId: string;
  alarmAreaId: string;
  floorLevel: string;
  // alarmNum: number; // 报警具体位置
  alarmType: string; // 报警类型
  alarmTypeName: string; // 报警类型
  coordinate: {
    coordinates: number[];
    type: string;
  }; // 报警点位坐标
  // deptName: string; // 报警具体位置
  // durationTime: number; // 报警具体位置
  alarmFirstTime: string; // 开始时间
  alarmLastTime: string; // 结束时间
  alarmLevel: '00' | '01' | '02' | '03' | '04' | '09' | 'null';
  // location: {
  //   coordinates: number[];
  //   type: string;
  // };
  alarmUserName: string;
  linkPhone: string;
  // hasExplode?: number; // 报警具体位置
  // hasHophead?: number; // 报警具体位置
  // hasInjuries?: number; // 报警具体位置
  // hasTrapped?: number; // 报警具体位置
  // alarmUserName?: string; // 报警具体位置
  // contactPhone?: string; // 报警具体位置
  // remark?: string; // 报警具体位置
  alarmDesc: string;
  deptName: string;
  alarmAreaName: string;
  cellId: string; // 周界跨越方位
  resourceNo: string;
}

export interface ISuppData {
  alarmId: string;
  deleted: number;
  id: string;
  infoName: string;
  infoType: number;
  infoValue: string;
}

export interface IAlarmDetail extends IAlarm {
  key: string;
  address: string;
  alarmAreaId: string;
  alarmAreaName: string;
  alarmFirstTime: string;
  alarmFrequency: number;
  stationFlag: string;
  alarmId: string;
  alarmLastTime: string;
  iotAlarmId: string;
  resourceNo: string;
  alarmLevelName: string;
  alarmNo: string;
  alarmType: string;
  alarmUserId: string;
  alarmTypeName: string;
  alarmUserName: string;
  coordinate: {
    coordinates: number[];
    type: string;
  };
  geom: {
    coordinates: number[];
    type: string;
  };
  deptId: string;
  deptName: string;
  devName: string;
  durationTime: number;
  linkPhone: string;
  resourceId: string;
  status: '01' | '02' | '03'; // 01-未处理 02-处理中 03-已处理
  statusView: string;
  supplement: string;
  dealUserName: string;
  dealTime: string;
  dealResultView: string;
  dealWayView: string;
  alarmLevelRefer: AlarmLevelRefer;
  iotDeviceId: string;
  iotSubDeviceId: string;
  firstAlarm?: boolean;
  firstDpAlarm?: boolean;
  almAlarmDeals: {
    dealResult: string;
    dealResultView: string;
    dealTime: string;
    dealUserName: string;
    dealWayView: string;
    dealExplain: string;
  }[];
  suppData: ISuppData[];
  fromSocket?: boolean;
  isClick?: boolean;
  almAlarmDataBaseVo?: {
    overrunSign?: number;
    upLimit?: string;
    lowerLimit?: string;
    maxValue?: string;
    unit?: string;
  };
}
export type IAlarmStatus = '01' | '02' | '03';

export interface earthquakeType {
  type: 0 | 1; // 0 正式，1 演习、测试
  eventId: number;
  magnitude: number; //震级
  depth: number; //震源深度
  epicenter: string; //震中
  longitude: number; // 震中经度
  latitude: number; // 震中纬度
  startAt: number; // 发震时刻
  updateAt: number; // 更新时刻
  signature: Array<string>; //减灾所署名
  nearbyCity: Array<{
    province: string;
    city: string;
    geocode: number; // 城市编码
    longitude: number; // 城市经度
    latitude: number; // 城市纬度
    countDown: number; // 城市预警时间
    intensity: number; //城市预估烈度
    distance: number; // 和震中的距离
  }>;
  nearbyCounty: Array<{
    province: string;
    city: string;
    county: string;
    geocode: number; // 城市编码
    longitude: number; // 城市经度
    latitude: number; // 城市纬度
    countDown: number; // 城市预警时间
    intensity: number; //城市预估烈度
    distance: number; // 和震中的距离
  }>;
  points: Array<{
    id: number; // 设备号或编号
    longitude: number;
    latitude: number;
    countDown: number;
    intensity: number;
    distance: number; //震中距
  }>;
}

export interface IAlarmGroup {
  cnName: string;
  defaulted: string;
  dictCode: string;
  enName: string;
  icon: string;
  id: string;
  remark: string;
  sort: string;
  status: number;
  value: string;
  isChecked: boolean;
}

export interface IAlarmHistory {
  address: string;
  alarmEndTime: string;
  alarmFirstTime: string;
  alarmTimes: number;
  alarmTypeName: string;
  alarmAreaName: string;
  devicePointName: string;
  docNo: string;
  alarmId: string;
  processTime: string;

  alarmLastTime: string;
  alarmLevel: string;
  alarmLevelName: string;
  alarmNo: string; // 报警编号
  alarmType: string;

  dealResultView: string;
  durationTime: number;
}

export interface IAlarmHistoryDeail {
  alarmUserName: string;
  contactPhone: string;
  hasDeal: number;
  hasExplode: number;
  hasHophead: number;
  hasInjuries: number;
  hasTrapped: number;
  location: string;
  processResult: string;
  remark: string;
}
export interface IAlarmDeail extends IAlarmHistory, IAlarmHistoryDeail {}

export interface IHandleAlarmParams {
  visible: boolean;
  param?: {
    areaName: string;
    areaId: string;
    latlng: number[];
  };
}

export interface IDealAlarmParams {
  visible: boolean;
  param?: {
    currentAreaClusterData: IAlarmClusterItem;
  };
}

export interface IAlarmCount {
  alarmCount: number;
  alarmType: string;
}
export interface IAlarmTypeItem {
  alarmGroup: string; // 报警类型分组
  alarmSound: string; // 报警声音
  alarmType: string; // 报警类型
  alarmTypeName: string; // 报警类型名称
  icon: string; // 报警图标
  iconColour: string;
  iconPlaySpeed: 1 | 2 | 3 | 4 | 5;
  isChecked: boolean;
}
export interface IAlarmDealType {
  cnName: string; //
  value: string; //
  sort: number; //
  id: string;
}

export interface INewAlarmDealType {
  alarmStatus: string;
  dealResult: string;
  dealResultView: string;
  dealType: string;
  id: string;
}

export interface IAlarmPage {
  current: number;
  pages: number;
  records: IAlarmDetail[];
  size: number;
  total: number;
}

export interface IeventType extends IAlarm {
  incidentName: string;
  incidentAddress: string;
  incidentType: string;
  incidentTime: string;
  incidentLevel: string;
  alarmUserName: string;
  linkPhone: string;
  measure: string;
}

// 查询条件组合类型
export interface QueryConditionType {
  name: string;
  queryConfigId: string;
  restore: boolean;
  status: string;
  troubleshooting: boolean;
  [key: string]: unknown;
}

export const alarmListModel = atom<IAlarm[]>({
  key: 'alarmList_',
  default: [],
});
export const currentAlarmStatusModel = atom<IAlarmStatus>({
  key: 'currentAlarmStatus_',
  default: '01',
});
export const alarmGroupModel = atom<IAlarmGroup[]>({
  key: 'alarmGroup_',
  default: [],
});
export const dealMutiAlarmModel = atom<boolean>({
  key: 'dealMutiAlarm_',
  default: false,
});
export const alarmCountModel = atom<IAlarmCount[]>({
  key: 'alarmCount_',
  default: [],
});
export const currentAlarmModel = atom<IAlarmDetail | null>({
  key: 'currentAlarm_',
  default: null,
});

export const currentDpIncidentModel = atom<IAlarmDetail | null>({
  key: 'currentDpIncident_',
  default: null,
});

export const currentDpAlarmModel = atom<IAlarmDetail | null>({
  key: 'currentDpAlarm_',
  default: null,
});
export const alarmDealTypeModel = atom<IAlarmDealType[]>({
  key: 'alarmDealType_',
  default: [],
});

export const lastUpdateAlarmTimeModel = atom<number>({
  key: 'lastUpdateAlarmTime_',
  default: 1,
});

// 新增应急事件
export const addIncidentModel = atom<boolean>({
  key: 'addIncident_',
  default: false,
});

// 应急事件更新
export const lastUpdateIncidentModel = atom<number>({
  key: 'lastUpdateIncident_',
  default: 0,
});

// 应急指挥
export const currentEmgcModel = atom<boolean>({
  key: 'currentEmgc_',
  default: false,
});

// 应急预案
export const currentPlanModel = atom<number>({
  key: 'currentPlan_',
  default: 0,
});

// 逃生路线
export const currentEscapeModel = atom<boolean>({
  key: 'currentEscape_',
  default: false,
});

// 逃生路线
export const currentSurroundModel = atom<boolean>({
  key: 'currentSurround_',
  default: false,
});

// 广播
export const currentBoradcastModel = atom<boolean>({
  key: 'currentBoradcast_',
  default: false,
});

// 广播区域id
export const currentPartitionIdsModel = atom<string[]>({
  key: 'currentPartitionIds_',
  default: [],
});

// 非新增或删除的报警，额外加一个标识。避免更新太频繁
export const lastUpdateAlarmTimeWithNotNewModel = atom<number>({
  key: 'lastUpdateAlarmTimeWithNotNew_',
  default: 0,
});
export const checkedAlarmIdsModel = atom<string[]>({
  key: 'checkedAlarmIdsModel_',
  default: [],
});

export const checkedDeviceAlarmIdsModel = atom<string[]>({
  key: 'checkedDeviceAlarmIdsModel_',
  default: [],
});

export const alarmTypeModel = atom<IAlarmTypeItem[]>({
  key: 'alarmTypeModel_',
  default: [],
});
export const alarmTypeDpModel = atom<IAlarmTypeItem[]>({
  key: 'alarmTypeDpModel_',
  default: [],
});
export const foldModel = atom<boolean>({
  key: 'foldModel_',
  default: false,
});
export const alarmLevelModal = atom<IAlarmDealType[]>({
  key: 'alarmLevelModal_',
  default: [],
});

//处理处理弹窗显示和隐藏
export const dealAlarmModalVisibleModal = atom<IDealAlarmParams>({
  key: 'dealAlarmModalVisible_',
  default: {
    visible: false,
  },
});

// 报警区域数据
export const alarmAreaModal = atom<Feature<Polygon, IAlarmClusterItem>[]>({
  key: 'alarmAreaModal_',
  default: [],
});

//手动报警弹窗显示和隐藏
export const handleAlarmModel = atom<IHandleAlarmParams>({
  key: 'handleAlarmModel_',
  default: {
    visible: false,
  },
});

//是否展示报警提示窗

export const showAlarmToastModel = atom<boolean>({
  key: 'showAlarmToast_',
  default: false,
});

// 所属部门
export const departModal = atom<string[]>({
  key: 'departModal_',
  default: [],
});
export const alarmFilterModel = atom<boolean>({
  key: 'alarmFilterModel_',
  default: false,
});

//当前报警列表部门
export const alarmDepartmentModel = atom<string>({
  key: 'alarmDepartmentModel_',
  default: '',
});

// 报警处理类型
// 未响应的
export const untreatAlarmDealTypeModal = atom<INewAlarmDealType[]>({
  key: 'noAlarmDealTypeModal_',
  default: [],
});
// 已响应的
export const resAlarmDealTypeModal = atom<INewAlarmDealType[]>({
  key: 'resAlarmDealTypeModal_',
  default: [],
});

// 勾选的报警
export const checkedAlarmModal = atom<string[]>({
  key: 'checkedAlarmModal_',
  default: [],
});
