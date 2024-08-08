import { NextApiRequest, NextApiResponse } from 'next';
import { stringify } from 'qs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];

  console.info('============req.body==============', req.body);
  const param = stringify({ ...req.body }, { indices: false });

  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-scws/chemicalTypeEntity/save`,
    {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token as string,
        reqType: reqType as string,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
      body: JSON.stringify(req.body),
    }
  );

  const status = res_.status;

  const json = await res_.json();

  console.log('status', status, json);

  const newData = {
    status: status == 200 ? 0 : status,
    data: {},
    msg: json.msg || json.data,
  };

  res.json(newData);
};

export default handler;
