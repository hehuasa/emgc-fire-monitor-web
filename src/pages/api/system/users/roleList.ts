import { clientType } from '@/utils/request';
import { NextApiRequest, NextApiResponse } from 'next';
import { stringify } from 'qs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];

  const param = stringify({ ...req.query }, { indices: false });
  const res_ = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/role/list/page?${param}`, {
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-auth-token': token as string,
      reqType: clientType,
      systemCode: 'cx_alarm',
      'User-Agent': userAgent as string,
    },
  });
  const status = res_.status;

  const json = await res_.json();

  const resData =
    json.data.records &&
    json.data.records.map((v: any) => {
      return {
        ...v,
      };
    });
  const newData = {
    status: status == 200 ? 0 : status,
    data: {
      items: resData,
      count: json.data.total,
    },
    msg: json.msg,
  };

  res.json(newData);
};

export default handler;
