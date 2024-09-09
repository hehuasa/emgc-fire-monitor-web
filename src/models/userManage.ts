/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from 'recoil';

// 一般响应类型
export type resType<T extends string | undefined> = {
  code: number;
  data: T;
  msg?: string;
};

// 分页参数
export interface PageType {
  pageIndex: number;
  pageSize: number;
}

// 通用表格响应参数类型
export type resParamsType<T> = {
  total?: number;
  size?: number;
  pages?: number;
  current?: number;
  records?: Array<T>;
  data?: Array<T>;
};

// 分页条参数类型
export type pagenationType = {
  current: number;
  pages: number;
  size: number;
  total: number;
};

// 用户表格请求参数类型
export type reqParamsType = {
  mobile?: string;
  orgId?: string;
  pageIndex?: number;
  pageSize?: number;
  positionId?: string;
  userCode?: string;
  userName?: string;
};

//用户管理table

export interface tableBaseType {
  id: string;
  userName: string;
  userCode: string;
  userPhone: string;
}

export interface TableColType extends tableBaseType {
  userAccount: string;
  userSex: string;
  userJob: string;
  userEmail: string;
  userType: string;
  userState: string;
  positionName: Array<string>;
}

// 角色管理 表格查询参数类型
export type RoleTableType = {
  pageIndex?: number;
  pageSize?: number;
};
export type TableColumnsType = {
  id?: string;
  roleCode?: string;
  roleName: string;
  roleDesc?: string;
  roleEffect: string;
};

// 部门管理
export type DepartmentType = {
  children?: DepartmentType[];
  id: string;
  orgCode: string;
  orgName: string;
  parentCode: string;
  shortIndex?: string;
  shortName?: string;
  droppable?: boolean;
  [key: string]: any;
};
// 树形数据类型
export type FormatTreeDataType = {
  id: string | string;
  parent: string | number;
  text: string;
  code: string;
  droppable?: boolean;
  checked?: boolean;
  isIndeterminate?: boolean;
  name?: string;
};

// 岗位响应数据类型
export type resPositionParamsType = {
  id: string;
  positionName: string;
  positionDuty?: string;
  remark?: string;
};

// 菜单管理
export type menuListType = {
  systemName: string;
  systemSign: string;
};

type nodeType = {
  id: string | number; // 节点唯一标识符
  parent: string | number; // 父节点标识符
  text: string; // 文字内容
  droppable?: boolean; // 是否有下级数据
  [key: string]: unknown;
};

export const tableDataModal = atom<TableColType[]>({
  key: 'getUserTableList_',
  default: [],
});
export const userQueryForm = atom<reqParamsType>({
  key: 'userQueryForm_',
  default: {},
});

export const departmentData = atom<FormatTreeDataType[]>({
  key: 'departmentData_',
  default: [],
});
export const departmentDataTree = atom<DepartmentType[]>({
  key: 'departmentDataTree_',
  default: [],
});
export const modalState = atom({
  key: 'getModalState',
  default: false,
});
