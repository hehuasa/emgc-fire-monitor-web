import { atom } from 'recoil';

export interface ICallNumberVisibleModel {
  visible: boolean;
  name?: string;
  number?: string;
  path?: string;
  isbroadcast?: boolean;
  eventId?: string;
}

//是否展示打电话弹框
export const callNumberVisibleModel = atom<ICallNumberVisibleModel>({
  key: 'callNumberVisibleModel_',
  default: {
    visible: false,
  },
});

//电话是否已经接通 1未拨打2拨打中3已接通
export type IPhoneStatu = 1 | 2 | 3;

export const phoneStatuModel = atom<IPhoneStatu>({
  key: 'phoneStatuModel_',
  default: 1,
});
