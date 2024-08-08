import { initPageData, IPageData } from '@/utils/publicData';
import { createContext } from 'react';

export interface IStructuralBaseInfoFrom {
  planName: string;
  deptId: string;
  planType: string;
  areaId: string;
  planLevel: string;
  emgcOrgId: string;
  incidentType: string;
  planRemark: string;
}

export interface IStructualItem {
  areaId: string;
  areaName: string;
  createDate: string;
  creator: string;
  deleted: 0;
  deptId: string;
  deptName: string;
  emgcOrgId: string;
  emgcOrgName: string;
  id: string;
  incidentType: string;
  pageNumber: string;
  pageSize: string;
  planLevel: string;
  planName: string;
  planRemark: string;
  planTextId: string;
  planType: string;
  planVersion: string;
  status: string;
  updateDate: string;
  updatedBy: string;
  stationFlag?: string;
}

export interface IMatchPlan {
  matchingRate: string;
  planId: string;
  planName: string;
}

//实施方案

export interface ICarryPlan {
  areaId: string;
  areaName: string;
  deptId: string;
  deptName: string;
  emgcOrgId: string;
  emgcOrgName: string;
  id: string;
  incidentType: string;
  incidentTypeName: string;
  planId: string;
  planLevel: string;
  planLevelName: string;
  planRemark: string;
  planType: string;
  planTypeName: string;
  schemeName: string;
  commands: ICommand[];
}

export interface ICommand {
  actionDuration: number;
  actionOrder: number;
  actionPositionId: string;
  actionPositionName: string;
  attention: string;
  commandId: string;
  commandType: string;
  commandTypeName: string;
  disposalContents: string;
  previousAction: null;
  status: number;
}

export interface IPlanItem {
  actionTime: string;
  createDate: string;
  creator: string;
  deleted: number;
  deptId: string;
  emgcOrgId: string;
  filePath: string;
  id: string;
  planName: string;
  planNo: string;
  planTime: string;
  planType: string;
  planVersion: string;
  records: string;
  updateDate: string;
  updateTimes: number;
  updatedBy: string;
  stationFlag?: string;
}

export interface IKeyParam {
  planName?: string;
  deptId?: string;
  stationFlag?: string;
}

export interface GetDataProps {
  pageNum: number;
  pageSize?: number;
}

export interface IPlanContext {
  getData: (data: GetDataProps) => void;
  itemInfo?: IPlanItem;
  setItemInfo: (data?: IPlanItem) => void;
  data: IPageData<IPlanItem>;
}

export const IPlanContext = createContext<IPlanContext>({
  itemInfo: undefined,
  setItemInfo: () => {
    //
  },
  getData: () => {
    //
  },
  data: initPageData,
});

export interface IStructuralPlanContext {
  data: IPageData<IStructualItem>;
  getData: (data: GetDataProps) => void;

  itemInfo?: IStructualItem;
  setItemInfo: (data?: IStructualItem) => void;
}
export const IStructuralPlanContext = createContext<IStructuralPlanContext>({
  getData: () => {
    //
  },

  itemInfo: undefined,
  setItemInfo: () => {
    //
  },
  data: initPageData,
});
