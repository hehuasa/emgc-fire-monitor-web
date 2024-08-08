import { clientType } from '@/utils/request';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  console.info('============req.body==============', req.body);
  const res_ = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/area/exportExcel`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'x-auth-token': token as string,
      reqType: clientType,
      systemCode: 'cx_alarm',
      'User-Agent': userAgent as string,
    },
    body: JSON.stringify(req.body),
  });

  const status = res_.status;

  console.info('============status==============', status);
  const blob = await res_.blob();
  console.log('data-del', blob);

  const newData = {
    status: status == 200 ? 0 : status,
    data: blob,
    msg: '',
  };

  res.json(newData);
};

export default handler;
