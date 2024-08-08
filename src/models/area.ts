import { atom } from 'recoil';

export interface IAreaTreeItem {
  areaCode: string;
  areaName: string;
  deptId: string;
  children: IAreaTreeItem[];
}

export const areaTreeModel = atom<IAreaTreeItem>({
  key: 'areaTree_',
  default: {
    areaCode: '',
    areaName: '',
    children: [
      {
        areaCode: '',
        areaName: '',
        children: [],
        deptId: '',
      },
    ],
    deptId: '',
  },
});
