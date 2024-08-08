import { clientType } from '@/utils/request';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  console.info('============req.body==============', req.body);
  const res_ = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/dc/area/delete`, {
    method: 'delete',
    headers: {
      'content-type': 'application/json',
      'x-auth-token': token as string,
      reqType: clientType,
      systemCode: 'cx_alarm',
      'User-Agent': userAgent as string,
    },
    body: JSON.stringify(req.body['strings']),
  });

  const status = res_.status;

  console.info('============status==============', status);
  const json = await res_.json();
  console.log('data-del', json);

  const newData = {
    status: status == 200 ? 0 : status,
    data: {},
    msg: json.msg || json.data,
  };

  res.json(newData);
};

export default handler;
