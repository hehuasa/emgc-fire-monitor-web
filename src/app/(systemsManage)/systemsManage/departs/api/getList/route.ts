import { DepartmentType } from '@/models/userManage';
import { requestNode } from '@/utils/request';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const setList = (list: DepartmentType[], parentCode: null | string) => {
  for (const item of list) {
    if (parentCode) {
      item.parentCode = parentCode;
    }
    if (item.children) {
      setList(item.children, item.id);
    }
  }

  return list;
};

export async function GET() {
  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const reqType = headersList.get('Reqtype') as string;
  const res = await requestNode<any>({
    url: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/user/list-org-tree`,
    token,
    reqType,
  });

  const newData = setList(res.data, null);

  return NextResponse.json({ status: 0, data: { options: newData }, msg: '' });
}
