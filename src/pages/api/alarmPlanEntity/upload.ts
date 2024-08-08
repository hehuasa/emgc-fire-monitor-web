import fetch from 'node-fetch';

import FormData from 'form-data';
import multer from 'multer';

import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const upload = multer({
  fileFilter(req, file, callback) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    callback(null, true);
  },
}).any();

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const handler = async (req: NextApiRequest & any, res: NextApiResponse) => {
  await runMiddleware(req, res, upload);
  const token = req.headers['x-auth-token'];
  const userAgent = req.headers['user-agent'];
  const reqType = req.headers['reqtype'];

  const form = new FormData();

  for (const iterator of req.files) {
    form.append(iterator.fieldname, iterator.buffer, iterator.originalname);
  }

  const headers = form.getHeaders();
  const res_ = await fetch(
    `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/file/upload_file`,
    {
      method: 'post',
      headers: {
        ...headers,

        'x-auth-token': token as string,
        reqType: reqType as string,
        systemCode: 'cx_alarm',
        'User-Agent': userAgent as string,
      },
      body: form,
    }
  );

  const json: any = await res_.json();

  console.log('上传结果', json);

  const newObj: any = {
    status: json.code == 200 ? 0 : json.code,
    msg: json.msg,
    data: {
      value: json.data ? json.data.realFileName : '',
      fileName: json.data ? json.data.fileName : '',
      realFileName: json.data ? json.data.realFileName : '',
      url: json.data ? json.data.url : '',
    },
  };

  res.json(newObj);
};

export default handler;
