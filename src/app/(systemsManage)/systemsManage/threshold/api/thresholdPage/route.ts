import { NextResponse } from 'next/server';
import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  // const { searchParams } = new URL();
  const params = await request.json();
  console.log('params----', params);

  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/alm/alarm_monitor/page`;
  const res = await requestFetch<{ [key: string]: any }>({
    url,
    options: {
      method: 'post',
      body: JSON.stringify(params),
    },
    token,
  });

  console.log('res', res);

  const json = {
    msg: res.msg,
    status: res.code === 200 ? 0 : res.code,
    data: {
      items: res.data.records,
      total: res.data.total,
    },
  };

  return NextResponse.json(json);
}
