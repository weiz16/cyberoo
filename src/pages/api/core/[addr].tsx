
// API for core

import { isAddressValid } from "helpers";
import { NextApiRequest, NextApiResponse } from "next";
import { discoverConnection } from "services";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { addr },
    method,
  } = req

  switch (method) {
    case 'GET':
      // Get data from database
      if (isAddressValid(addr as string)) {
        try {
          const profile = await discoverConnection({ address: addr as string, pageSize: 5, offset: 0 });
          res.status(200).json(profile);
        } catch (_) {
          res.status(405).end('Unexpected Error!');
        }
      } else {
        res.status(405).end(`Address ['${addr}'] is not an valid address`);
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}