import { NextResponse } from 'next/server';
import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';

type itemType = {
  areaCode: string;
  areaId: string;
  areaName: string;
  users: Array<{ userName: string; id: string }>;
  userIds: string[];
  userNames: string[];
};

export async function POST(request: Request) {
  // const { searchParams } = new URL();
  const params = await request.json();

  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/alm/troubleshooting/page_approves`;
  const res = await requestFetch<{ [key: string]: any }>({
    url,
    options: {
      headers: { 'content-type': 'application/json' },
      method: 'post',
      body: JSON.stringify(params),
    },
    token,
  });

  console.log('res', res);

  const items =
    res.data?.records &&
    res.data?.records.map((item: itemType) => {
      const users = item.userIds.map((id, i) => {
        return {
          userName: item.userNames[i],
          id: id,
        };
      });
      return {
        ...item,
        users,
      };
    });

  const json = {
    msg: res.msg,
    status: res.code === 200 ? 0 : res.code,
    data: {
      items: items || [],
      total: res.data?.total || 0,
    },
  };

  return NextResponse.json(json);
}
