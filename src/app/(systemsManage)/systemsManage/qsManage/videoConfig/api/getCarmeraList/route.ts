import { NextResponse } from 'next/server';
import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  // const { searchParams } = new URL();
  const { searchParams } = new URL(request.url);

  const cameraName = searchParams.get('cameraName') as string;

  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/device-manger/camera/list`;
  const res = await requestFetch<{ [key: string]: any }>({
    url,
    options: {
      headers: { 'content-type': 'application/json' },
      method: 'post',
      body: JSON.stringify({ cameraName }),
    },
    token,
  });

  const data =
    res.data &&
    res.data.map((v: any, i: number) => {
      return {
        ...v,
        cameraId: v.id,
        cameraState: v.online,
        index: i + 1,
      };
    });

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
