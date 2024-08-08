/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { defaultData } from '../providers/pagination-provider';

const methods = ['itemRender', 'setCurrentPage'];
const nonMethods = Object.keys(defaultData).filter((k) => !methods.includes(k));

export const filterProps = (props: any) => {
  const validProps = nonMethods.reduce((acc: any[], nxt: string) => {
    acc.push(props[nxt]);
    return acc;
  }, []);
  // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
  return React.useMemo(() => props, validProps);
};
