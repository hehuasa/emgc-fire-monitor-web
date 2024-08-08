import { NextResponse } from 'next/server';
import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';

/**
 *
 * @param equipmentId
 * @param switchStatus
 */

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

const setList = (list: listType[]) => {
  let newList: listType[] = [];
  for (let index = 0; index < list.length; index++) {
    newList.push(list[index]);
    if (list[index].children.length > 0) {
      // setList(list[index].children);
      // list[index].children = [];
      newList.pop();
      newList = newList.concat([...list[index].children]);
      list[index].children = [];
    }
  }
  return newList;
};

export async function POST(request: Request) {
  // const { searchParams } = new URL();
  const params = await request.json();

  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/device/manager/query_equipment_tree`;
  const res = await requestFetch<listType[]>({
    url,
    options: {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'get',
    },
    token,
  });

  const newData = setList(res.data || []);
  // console.log('参数', newData.length);
  let itemList: listType[] = [];

  if (params.equipmentId) {
    itemList = newData.filter((item) => item.resourceNo.startsWith(params.equipmentId));
  }
  if (params.switchStatus) {
    itemList = newData.filter((item) => item.switchStatus == params.switchStatus);
  }

  if (params.switchStatus && params.equipmentId) {
    itemList = newData.filter(
      (item) =>
        item.switchStatus == params.switchStatus && item.resourceNo.startsWith(params.equipmentId)
    );
  }

  if (Object.getOwnPropertyNames(params).length === 0) {
    itemList = newData;
  }

  const json = {
    msg: res.msg,
    status: res.code === 200 ? 0 : res.code,
    data: {
      items: itemList,
    },
  };

  return NextResponse.json(json);
}
