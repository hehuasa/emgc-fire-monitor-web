import { createContext } from 'react';

export interface IOrganizationContext {
  treeValue: string;
  setTreeValue: (data: string) => void;
}

export const OrganizationContext = createContext<IOrganizationContext>({
  treeValue: '',
  setTreeValue: (data) => {
    //
  },
});
