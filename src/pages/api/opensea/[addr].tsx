
// API for core

import { isAddressValid } from "helpers";
import { NextApiRequest, NextApiResponse } from "next";
import { getConnectionsForOpenSea } from "services";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { addr },
    method,
  } = req

  switch (method) {
    case 'GET':
      // Get data from your database
      if (typeof addr === 'string' && isAddressValid(addr)) {
        const profile = await getConnectionsForOpenSea({ address: addr, pageSize: 0, offset: 5 });
        res.status(200).json(profile);
      } else {
        res.status(405).end(`Address ['${addr}'] is not an valid address`);
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}