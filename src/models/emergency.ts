import { createContext } from 'react';
import { atom } from 'recoil';

export interface EventItem {
  alarmContent: string;
  alarmId: string;
  alarmUserName: string;
  alarmUserPhone: string;
  areaName: string;
  geom: {
    coordinates: number[];
    type: string;
  }; // 报警点位坐标
  coordinate: {
    coordinates: number[];
    type: string;
  }; // 报警点位坐标
  incidentTypeName: string;
  id: string;
  incidentAddress: string;
  incidentCause: string;
  incidentContent: string;
  incidentDeath: string;
  incidentDisappear: null;
  incidentInjured: string;
  incidentIsbomb: string;
  incidentIscasualty: string;
  incidentIsdrill: null;
  incidentIspoison: string;
  incidentIstrapped: string;
  incidentLevel: string;
  incidentMessage: string;
  incidentName: string;
  incidentResponselevel: string;
  //0未开始 1分析研判阶段 2启动应急阶段 3应急终止 4结束
  incidentStatus: 0 | 1 | 2 | 3 | 9;
  incidentSummary: null;
  incidentTendency: string;
  incidentTime: string;
  incidentType: string;
  incidentUseMeasure: string;
  orgName: null;
  incidentMatter: string;
  incidentResourceName: string;
  incidentTrap: string;
}

export interface IEventFeature {
  createDate: string;
  creatorName: string;
  featureDesc: string;
  featureName: string;
  featureTag: string;
  featureType: string;
  featureTypeName: string;
  featureUnit: string;
  featureValue: string;
  id: string;
}

export interface IPlanItem {
  actionTime: null;
  createDate: string;
  creator: string;
  deleted: 0;
  deptId: string;
  emgcOrgId: null;
  filePath: string;
  id: string;
  planName: string;
  planNo: string;
  planTime: string;
  planType: string;
  planVersion: string;
  records: string;
  updateDate: string;
  updateTimes: 11;
  updatedBy: string;
}
interface EmergencyFn {
  getEventList: () => void;
  getEventInfo: (id: string) => Promise<void>;
  eventInfoLoading: boolean;
  entryEmgcStatus: ({ incidentId }: largeOpetator) => void;
  execOperate: ({ incidentId, removeKeep, operationAction }: IexecOperate) => void;
  exitEmgcStatus: ({ incidentId }: largeOpetator) => void;
}

export interface largeOpetator {
  incidentId: string;
}

export interface IexecOperate extends largeOpetator {
  operationAction: IOperationAction;
  removeKeep?: boolean;
  //广播分区id集合
  param?: { partitionIds: string[] };
}

/*
  UPDATE_INCIDENT-更新事件信息
  UPDATE_PLAN-更新实施方案
  DOOR-打开/关闭门禁
  BROADCAST-播放/停止广播
  ESCAPE-打开/关闭逃生路线
*/

type IOperationAction =
  | 'UPDATE_INCIDENT'
  | 'UPDATE_PLAN'
  | 'DOOR'
  | 'BROADCAST'
  | 'ESCAPE'
  | 'SURROUND';

export interface IExecutePlan {
  planId: string;
  matchingRate: string;
  planName: string;
}

export const EmergencyFnContext = createContext<EmergencyFn>({
  getEventList: () => {
    //
  },

  getEventInfo: async () => {
    //
  },
  eventInfoLoading: false,
  entryEmgcStatus: () => {
    //
  },
  execOperate: () => {
    //
  },
  exitEmgcStatus: () => {
    //
  },
});

//需要查看事件详情
export const eventInfoModal = atom<Partial<EventItem>>({
  key: 'eventInfoModal_',
  default: {},
});

//更新事件列表
export const lastUpdateEventModel = atom<number>({
  key: 'lastUpdateEventModel_',
  default: 0,
});

//动态跟踪更新指令任务
export const updateTrackCommandModel = atom<number>({
  key: 'UpdateTrackCommandModel_',
  default: 0,
});
