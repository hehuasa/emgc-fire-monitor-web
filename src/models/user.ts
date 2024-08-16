/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from 'recoil';

export interface IMenuItem {
  functionCode: any;
  id: string;
  parentId: string;
  functionName: string;
  icon: string | null;
  url: string;
  hidden?: boolean;
  fullname?: string;
  permissionCode: string;
  parentNames?: { name: string; url: string }[];
  children: IMenuItem[];
  funType: number; //1 | 2 | 3
  isEnable: number; //0 | 1
  menuType: number | null; //0 | 1 | 2 | string  类别 1为后台管理功能菜单 2为前端菜单功能 3为移动端菜单
  systemSign: string;
  sortIndex: number;
  isChecked?: boolean;
  key?: string;
  keys_?: string[];
  parentIds?: string[]; // 存储所以上级菜单的id，某些场景需要
}
export type LoginItems = {
  user: string;
  password: string;
  remberme: boolean;
};

export interface IUserRes {
  id?: string;
  accountId: string;
  address: string;
  email: string;
  enable: boolean;
  gesturePwd: string;
  headPortraitId: string;
  locking: boolean;
  loginAccount: string;
  loginId: string;
  loginPhoneNumber: string;
  mobile: string;
  pwd: string;
  remark: string;
  userCode: string;
  userConfig: string;
  userId: string;
  userName: string;
  userType: string;
  permissions: string[];
  permissionsObj: { [key: string]: any };
  orgName: string;
  orgId: string;
  tenantId: string;
  // [key: string]: string | number | boolean;
}

//用户详情
export interface IUserDetails {
  userId: string;
  accountId: string;
  address: string;
  comId: string;
  comName: string;
  email: string;
  enable: true;
  faceId: string;
  headPortraitId: string;
  id: string;
  idCard: string;
  loginAccount: string;
  mobile: string;
  orgId: string;
  orgName: string;
  positionId: string[];
  positionName: string[];
  remark: string;
  reportFileIds: string[];
  roleCodes: string[];
  roleIds: string[];
  sex: 1 | 2;
  tenantId: string;
  userCode: string;
  userConfig: null;
  userName: string;
  roleNames: string[];
  children?: IUserDetails[];
  permissions: string[];
  permissionsObj: { [key: string]: any };
}

//岗位
export interface IPosition {
  id: string;
  positionCode: string;
  positionDuty: null;
  positionName: string;
  positionRemark: null;
  positionType: 0;
}

//角色

export interface IRole {
  creator: string;
  id: string;
  isDefault: 0;
  isEnable: string;
  parentRoleId: string;
  parentRoleName: string;
  roleCode: string;
  roleDes: string;
  roleIndex: string;
  roleName: string;
  children?: IRole[];
}

//文件
export interface IUploadFile {
  fileName: string;
  fileSize: 0;
  id: string;
  md5: string;
  realFileName: string;
  showUrl: string;
  url: string;
}

export interface IUserInfo extends IUserRes {
  clientType: string;
}
export const menuModel = atom<IMenuItem[]>({
  key: 'menu_',
  default: [],
});

//扁平菜单数据

export const flatModel = atom<IMenuItem[]>({
  key: 'flatmenu_',
  default: [],
});
export const flatMenuModel = atom<IMenuItem[]>({
  key: 'flatMenu_',
  default: [],
});
export interface IProjectItem {
  key: string;
  label: string;
  id: string;
  organizationId: string;
  projectApproval: 0; // 0审批中，1审批通过，2审批未通过，3撤销
  projectCode: string;
  projectEndDate: string;
  projectLeaderInfos: any[];
  projectLevel: 0; // :0A级,1B级,2C级
  projectLocation: string;
  projectName: string;
  projectStartDate: string;
  projectStatus: string;
}

export const projectInfoModel = atom<IProjectItem>({
  key: 'userInfo_',
  default: {} as IProjectItem,
});
