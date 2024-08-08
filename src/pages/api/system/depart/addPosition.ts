import { clientType } from '@/utils/request';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];

  const param = { ...req.body };

  const res_ = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/org/add-position/${param.id}`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'x-auth-token': token as string,
      reqType: clientType,
      systemCode: 'cx_alarm',
      'User-Agent': userAgent as string,
    },
    body: JSON.stringify(param.posIds),
  });
  const status = res_.status;

  const json = await res_.json();
  console.log('json---', json);

  const newData = {
    status: status == 200 ? 0 : status,
    data: {
      text: json.msg,
    },
    msg: json.msg,
  };

  res.json(newData);
};

export default handler;
