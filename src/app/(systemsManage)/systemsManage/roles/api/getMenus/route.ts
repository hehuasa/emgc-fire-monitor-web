import { IMenuItem } from '@/models/user';
import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const getParentIds = (menus: IMenuItem[], parentIds: string[]) => {
  for (const menu of menus) {
    menu.parentIds = [...parentIds];

    // if (menu.parentId) {
    //   menu.parentIds.push(menu.parentId);
    // }

    if (menu.children) {
      getParentIds(menu.children, [...menu.parentIds, menu.id]);
    }
  }

  return menus;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const systemCode = searchParams.get('systemCode') as string;
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/menu/list-menu?systemCode=${systemCode}`;
  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const reqType = headersList.get('Reqtype') as string;
  const res = await requestFetch<IMenuItem[]>({ url, token, reqType });

  const newMenus = getParentIds(res.data || [], []);
  const json = {
    msg: res.msg,
    status: res.code === 200 ? 0 : res.code,
    data: {
      items: newMenus,
    },
  };

  return NextResponse.json(json);
}
