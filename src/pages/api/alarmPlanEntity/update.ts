import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];

  console.info('============req.body==============', req.body);
  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-plan/alarmPlanEntity/update`,
    {
      method: 'put',
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token as string,
        reqType: reqType as string,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
      body: JSON.stringify({ ...req.body }),
    }
  );

  const json = await res_.json();
  console.log('修改', json);

  const newData = {
    status: json.code == 200 ? 0 : json.code,
    data: {},
    msg: json.msg,
  };

  res.json(newData);
};

export default handler;
