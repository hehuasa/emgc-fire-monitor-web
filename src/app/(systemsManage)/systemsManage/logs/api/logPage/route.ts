import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // const { searchParams } = new URL();
  const params = await request.json();

  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/sys_audit_log/page`;
  const reqType = headersList.get('Reqtype') as string;
  const res = await requestFetch<{ [key: string]: any }>({
    url,
    options: {
      headers: { 'content-type': 'application/json' },
      method: 'post',
      body: JSON.stringify(params),
    },
    token,
    reqType,
  });

  const data =
    res.data?.records &&
    res.data?.records.map((v: any, i: number) => {
      return {
        ...v,
        username: v.username || '管理员',
        index: i + 1,
      };
    });
  console.log('data', data);
  const json = {
    msg: res.msg,
    status: res.code === 200 ? 0 : res.code,
    data: {
      items: data || [],
      total: res.data.total,
    },
  };

  return NextResponse.json(json);
}
