import { ILayerItem } from '@/components/MapTools/LayerList';
import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/resource/list-layer`;
  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const reqType = headersList.get('Reqtype') as string;
  const res = await requestFetch<ILayerItem[]>({ url, token, reqType });

  // if (res.data) {
  //   for (const item of res.data) {
  //     if (item.children) {
  //       for (const it of item.children) {
  //         if (it.children && it.children.length === 0) {
  //           it.children = null as any;
  //         }
  //       }
  //     }
  //   }
  // }
  const json = {
    msg: res.msg,
    status: res.code === 200 ? 0 : res.code,
    data: {
      items: res.data,
    },
  };

  return NextResponse.json(json);
}
