// import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({ msg: 'hello' });
};

export default handler;
