import { atom } from 'recoil';

export interface IMenuItem {
  id: string;
  parentId: string;
  functionName: string;
  icon: string;
  url: string;
  hidden?: boolean;
  fullname?: string;
  functionCode: string;
  parentNames?: { name: string; url: string }[];
  children?: IMenuItem[];
  funType: 1 | 2 | 3;
  isEnable: 0 | 1;
  menuType: 0 | 1 | 2 | string; //  类别 1为后台管理功能菜单 2为前端菜单功能 3为移动端菜单
  systemSign: string;
  sortIndex: number;
  parentIds?: string[]; // 存储所以上级菜单的id，某些场景需要
}
export type LoginItems = {
  user: string;
  password: string;
  remberme: boolean;
};

export interface IUserRes {
  cardNo: number;
  idCardNo: number;
  loginAccount: string;
  loginId: string;
  mobile: number;
  officeNum: number;
  sex: string;
  userCode: string;
  userId: string;
  userName: string;
  userState: number;
  id: string;
  // [key: string]: string | number | boolean;
}

export interface IUserInfo extends IUserRes {
  clientType: string;
}
export const menuModel = atom<IMenuItem[]>({
  key: 'menu_',
  default: [],
});
export const flatMenuModel = atom<IMenuItem[]>({
  key: 'flatMenu_',
  default: [],
});
export const isLoginModel = atom<boolean>({
  key: 'islogin_',
  default: true,
});
export const buttonAuthMenus = atom<IMenuItem[]>({
  key: 'buttonAuthMenus_',
  default: [],
});

export const stationFlagsMultipleMoedl = atom<any[]>({
  key: 'stationFlagsMultipleMoedl_',
  default: [],
});

export const stationFlagsMoedl = atom<any[]>({
  key: 'stationFlagsMoedl_',
  default: [],
});

export const centerStationFlagsSourceMoedl = atom<any[]>({
  key: 'centerStationFlagsSourceMoedl_',
  default: [],
});
