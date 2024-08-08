import { IUserRes } from '@/models/user';
import { requestNode } from '@/utils/request';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stringify } from 'qs';

type IResBody<T> = {
  records: Array<T>;
  total: number;
};
type obj = {
  [key: string]: string;
};
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParams: obj = {};
  for (const key of searchParams.keys()) {
    Object.assign(queryParams, {
      [key]: searchParams.get(key),
    });
  }

  const params = stringify(queryParams, { indices: false });
  console.log('参数', params);

  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/user/list/page?${params}`;
  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const reqType = headersList.get('Reqtype') as string;
  const res = await requestNode<IResBody<IUserRes>>({ url, token, reqType });

  const json = {
    msg: res.msg,
    status: res.code === 200 ? 0 : res.code,
    data: {
      items: res.data?.records || [],
      total: res.data?.total || 0,
    },
  };

  return NextResponse.json(json);
}
