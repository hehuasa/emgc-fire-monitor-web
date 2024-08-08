import { ArrayToTree } from '@/utils/util';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];

  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-scws/chemicalTypeEntity/list`,
    {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token as string,
        reqType: reqType as string,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
      body: JSON.stringify({}),
    }
  );
  const status = res_.status;

  const json = await res_.json();

  const resData = ArrayToTree(json.data, '0');
  console.log('---resData--', resData);

  const newData = {
    status: status == 200 ? 0 : status,
    data: { data: resData?.children ? resData.children : null },
    msg: json.msg,
  };

  res.json(newData);
};

export default handler;
