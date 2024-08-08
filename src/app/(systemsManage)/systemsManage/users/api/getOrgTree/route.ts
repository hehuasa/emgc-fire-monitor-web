import { requestNode } from '@/utils/request';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const reqType = headersList.get('Reqtype') as string;
  const res = await requestNode<any>({
    url: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/user/list-org-tree`,
    token,
    reqType,
  });

  console.log('ressssss````````````', res);

  return NextResponse.json({ status: 0, data: { options: res.data }, msg: '' });
}
