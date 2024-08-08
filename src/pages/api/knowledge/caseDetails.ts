import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];
  console.log('参数', req.body['id']);

  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-scws/accidentCaseEntity/get/${req.body['id']}`,
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

  console.log('详情', status, json);

  const fileListUrl: string[] = [];
  if (status) {
    json.data.caseFiles.forEach((files: any) => {
      // fileListUrl = files.fileUrl;
      fileListUrl.push(files.fileUrl);
    });
  }
  const newData = {
    status: status == 200 ? 0 : status,
    data: {
      ...json.data,
      fileListUrl,
    },
    msg: json.msg,
  };

  res.json(newData);
};

export default handler;
