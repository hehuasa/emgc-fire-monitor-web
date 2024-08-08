import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { requestNode } from '@/utils/request';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('orgId') as string;

  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const reqType = headersList.get('Reqtype') as string;
  const res = await requestNode<any>({
    url: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/org/list-position?orgId=${orgId}`,
    token,
    reqType
  });

  return NextResponse.json({ status: 0, data: { items: res.data }, msg: '' });
}
