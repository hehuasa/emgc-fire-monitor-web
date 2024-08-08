import { NextApiRequest, NextApiResponse } from 'next';
import { stringify } from 'qs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];

  const param = stringify({ ...req.query }, { indices: false });

  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-plan/dc_dict/list_item?${param}`,
    {
      method: 'get',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-auth-token': token as string,
        reqType: reqType as string,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
    }
  );

  const status = res_.status;

  const json = await res_.json();

  const items =
    status > 0 &&
    json.data.map((v: any) => {
      return {
        label: v.cnName,
        value: v.value,
        id: v.id,
      };
    });

  const newObj: any = {
    status: status == 200 ? 0 : status,
    msg: '',
    data: {
      items: items,
    },
  };

  res.json(newObj);
};

export default handler;
