import { atom } from 'recoil';

interface IWellheadDetail {
  name: string;
  youya: number;
  taoya: number;
}

export const wellheadDetailModel = atom<IWellheadDetail | null>({
  key: 'wellheadDetail',
  default: null,
});
