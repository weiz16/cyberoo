// API for core

import { NextApiRequest, NextApiResponse } from "next";
import { discoverConnection } from "services";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.body as { query: string };
	
  res.send(await discoverConnection({ address: '0x148d59faf10b52063071eddf4aaf63a395f2d41c' } ));
}
