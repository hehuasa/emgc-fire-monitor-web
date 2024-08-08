import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];

  console.info('============req.body==============', req.body);
  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-plan/alarmPlanEntity/delete`,
    {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token as string,
        reqType: reqType as string,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
      body: JSON.stringify(req.body['strings']),
    }
  );

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
