import { IOritreeData } from '@/components/Montior/Tree';
import { createContext } from 'react';
import { DictCodeType } from './global';
import { IArea } from './map';
import {
  GetPageKey,
  IDataItem,
} from '@/app/(emgcPreparation)/emgcPreparation/resources/goodsAndMaterials/page';

export interface IEmgcResourceContext {
  depTree: IOritreeData[];
  areaList: IArea[];
  resourceType: DictCodeType[];
  itemInfo?: IDataItem;
  setItemfo: (data?: IDataItem) => void;
  inOrOutType: 1 | 2;
  setInOrOutType: (type: 1 | 2) => void;
  getData: (data: GetPageKey) => void;
}

export const EmgcResourceContext = createContext<IEmgcResourceContext>({
  depTree: [],
  areaList: [],
  resourceType: [],
  itemInfo: undefined,
  setItemfo: () => {
    //
  },
  inOrOutType: 2,
  setInOrOutType: (type: 1 | 2) => {
    //
  },
  getData: () => {
    //
  },
});
