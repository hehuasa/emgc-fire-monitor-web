import type { NextApiRequest, NextApiResponse } from 'next';
import menus from '@/models/menus';

export default function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  res.status(200).json({ code: 200, data: menus });
}
