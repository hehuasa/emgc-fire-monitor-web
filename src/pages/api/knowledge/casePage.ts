import { NextApiRequest, NextApiResponse } from 'next';
import { stringify } from 'qs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];

  let page = '';
  if (Object.hasOwn(req.body, 'page')) {
    const newPage = Object.assign({}, page, { ...req.body['page'] });
    page = stringify(newPage, { indices: false });
  }
  console.log('page参数', req.body);

  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-scws/accidentCaseEntity/page?${page}`,
    {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token as string,
        reqType: reqType as string,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
      body: JSON.stringify({
        accidentType: req.body['accidentType'],
        accidentTime: req.body['accidentTime'],
        // accidentEnterpriseIn: req.body['accidentEnterpriseIn'],
        accidentTitle: req.body['accidentTitle'],
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
