import { IOritreeData } from '@/components/Montior/Tree';
import { atom } from 'recoil';
import { IArea } from './map';

type Ilocales = 'zh' | 'en';
export const localesModal = atom<Ilocales>({
  key: 'localesModel_',
  default: 'zh',
});

export type DictionaryType = {
  cnName: string;
  code: string;
  enName: string;
  id: string;
};

export type DictCodeType = {
  cnName: string;
  defaulted: 0 | 1;
  dictCode: string;
  enName: string;
  id: string;
  status: 0 | 1;
  sort: number;
  value: string;
  [key: string]: string | number;
};

export type objectType = {
  [key: string]: {
    [key: string]: string;
  };
};
export const dictionaryModal = atom<objectType>({
  key: 'dictionaryModal_',
  default: {},
});

//部门数据
export const depTreeModal = atom<IOritreeData[]>({
  key: 'depTreeModal_',
  default: [],
});

//区域数据
export const areaModal = atom<IArea[]>({
  key: 'areaModal_',
  default: [],
});

// 消息通知
export const notReadNumberModel = atom<number>({
  key: 'notReadNumberModel_',
  default: 0,
});
