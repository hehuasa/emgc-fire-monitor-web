import { clientType } from '@/utils/request';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];

  const res_ = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/device/manager/list_device`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'x-auth-token': token as string,
      reqType: clientType,
      systemCode: 'cx_alarm',
      'User-Agent': userAgent as string,
    },
    body: JSON.stringify({
      areaId: req.query.areaId,
    }),
  });
  const status = res_.status;

  const json = await res_.json();

  let items = [];
  if (req.query.idList) {
    const ids = (req.query.idList as any).split(',');
    items = json.data.filter((item: any) => !ids.includes(item.id));
  }

  const newData = {
    status: status == 200 ? 0 : status,
    data: {
      items: items.length ? items : json.data,
    },
    msg: json.msg,
  };

  res.json(newData);
};

export default handler;
