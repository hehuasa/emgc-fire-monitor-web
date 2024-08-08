import { requestNode as requestFetch } from '@/utils/request';
import { headers } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { stringify } from 'qs';

export async function POST(request: NextRequest) {
  const headersList = headers();
  const token = headersList.get('x-auth-token') as string;
  const reqType = headersList.get('Reqtype') as string;
  const requestJson = await request.json();
  const {
    areaId,
    equipmentId,
    layerId,
    pageIndex = 1,
    pageSize = 10,
    productId,
    resourceName,
    resourceNo,
  } = requestJson;

  const obj: { [key: string]: any } = {
    pageIndex,
    pageSize,
  };

  if (areaId) {
    obj.areaId = areaId;
  }
  if (equipmentId) {
    obj.equipmentId = equipmentId;
  }

  if (layerId) {
    obj.layerId = layerId;
  }

  if (productId) {
    obj.productId = productId;
  }
  if (productId) {
    obj.productId = productId;
  }
  if (resourceName) {
    obj.resourceName = resourceName;
  }
  if (resourceNo) {
    obj.resourceNo = resourceNo;
  }
  const param = stringify(obj);

  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/device/manager/page?${param}`;

  const res = await requestFetch<{ [key: string]: any }>({ url, token, reqType });

  const json =
    res.code === 200
      ? {
          msg: res.msg,
          status: 0,
          data: {
            total: res.data.total,
            items: res.data.records,
          },
        }
      : {
          msg: res.msg,
          status: res.code === 200,
          data: {
            total: 0,
            items: [],
          },
        };

  return NextResponse.json(json);
}
