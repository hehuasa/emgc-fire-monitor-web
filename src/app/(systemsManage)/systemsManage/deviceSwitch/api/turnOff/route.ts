import { NextResponse } from 'next/server';
import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';
interface listType {
  areaName: string;
  equipmentId: string;
  id: string;
  iotDeviceId: string | null;
  iotSubDeviceId: string | null;
  resourceNo: string;
  switchStatus: 1 | 0;
  children: [] | listType[];
  resources: [] | listType[];
}
export async function POST(request: Request) {
  // const { searchParams } = new URL();
  const {
    id,
    turnOffWay = 2,
    resourceIds,
  }: { id: string; turnOffWay: number; resourceIds: Array<listType> } = await request.json();

  let idsList;

  if (resourceIds && resourceIds.length > 0) {
    const item = resourceIds.filter((v) => v.id === id);
    if (item) {
      console.log('---item---', JSON.stringify(item));

      const ids = item[0].resources
        .filter((v) => v.switchStatus === 1)
        .map((v) => {
          return v.id;
        });
      console.log('---ids-----', ids);

      idsList = [...ids];
      idsList.push(id);
    }
  }

  console.log('----参数---', id, idsList, resourceIds.length);

  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/alm/turnoff/turnOffResource`;
  const res = await requestFetch<{ data: string }>({
    url,
    options: {
      headers: { 'content-type': 'application/json' },
      method: 'put',
      body: JSON.stringify({
        turnOffWay,
        resourceIds: idsList,
      }),
    },
    token,
  });

  const json = {
    msg: res.code,
    code: res.code,
    data: res.data,
  };

  return NextResponse.json(json);
}
