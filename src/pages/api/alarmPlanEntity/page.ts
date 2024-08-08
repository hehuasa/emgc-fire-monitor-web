import { NextApiRequest, NextApiResponse } from 'next';
import { stringify } from 'qs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];

  // const param = stringify({ ...req.body }, { indices: false });
  console.log('参数', req.body);

  let page = '';
  if (Object.hasOwn(req.body, 'page')) {
    const newPage = Object.assign({}, page, { ...req.body['page'] });
    page = stringify(newPage, { indices: false });
  }

  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-plan/alarmPlanEntity/page?${page}`,
    {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token as string,
        reqType: reqType as string,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
      body: JSON.stringify({ planName: req.body['planName'] }),
    }
  );

  const status = res_.status;

  const json = await res_.json();
  const newObj: any = {
    status: status == 200 ? 0 : status,
    msg: '',
    data: {
      items: json.data?.records,
      total: json.data?.total,
    },
  };

  res.json(newObj);
};

export default handler;
