import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/dc/area/page?current=1&size=100`;
  const reqType = headersList.get('Reqtype') as string;
  const res = await requestFetch<{ [key: string]: any }>({ url, token, reqType });

  const json = {
    msg: res.msg,
    status: res.code === 200 ? 0 : res.code,
    data: {
      items: res.data.records,
    },
  };

  return NextResponse.json(json);
}
