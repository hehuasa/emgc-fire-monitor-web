import { clientType } from '@/utils/request';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];

  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/sys_audit_log/page`,
    {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token as string,
        reqType: clientType,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
      body: JSON.stringify({
        ...req.body,
      }),
    }
  );
  const status = res_.status;

  const json = await res_.json();

  console.log('结果page', status, json);

  const data =
    json.data?.records &&
    json.data?.records.map((v: any, i: number) => {
      return {
        ...v,
        username: v.username || '管理员',
        index: i + 1,
      };
    });

  const newData = {
    status: status == 200 ? 0 : status,
    data: {
      items: data,
      total: json.data?.total,
    },
    msg: json.msg,
  };

  res.json(newData);
};

export default handler;
