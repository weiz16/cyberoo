
// Open sea service code here

import { pick } from "lodash";
import { ConnectionLabel } from "..";
import { ISourceConnectionProps, SourceConnection } from "../core.interface";
import { OpenSeaAssets, OpenSeaEvent } from "./opensea.interface";


const OPENSEA_API = 'https://api.opensea.io/api/v1/';


const OPENSEA_ASSET_API = `${OPENSEA_API}assets/`;
const OPENSEA_GET_OPTIONS = { 
  headers: {Accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_API_KEY},  
  method: 'GET'
};

/**
 * Given an address, return a NFT asset owned
 * @param address address
 * @returns image url
 */
export async function getAddressAsset(props: ISourceConnectionProps): Promise<string[]> {
  const { address } = props || {};

  return await fetch(`${OPENSEA_ASSET_API}?limit=1&offset=0&order_by=sale_price&owner=${address}`, OPENSEA_GET_OPTIONS as any).then(async (res) =>{
    const data = await res.json();
    return ((data as OpenSeaAssets).assets)?.map((item) => item.image_url);
  });
}

export async function getAddressEvent(props: ISourceConnectionProps): Promise<OpenSeaEvent> {
  const { address, pageSize, offset } = props || {};
  return await fetch(`${OPENSEA_API}events?account_address=${address}&only_opensea=false&offset=${offset}&limit=${pageSize}`, OPENSEA_GET_OPTIONS as any).then(async (res) =>{
    try {
      const data = await res.json();
      return data;
    } catch (_) {
      return {};
    }
    // return ((data as OpenSeaAssets).assets)?.map((item) => item.image_url);
  }).catch(() => { return {}; });;
}

/**
 * Extracts connection from open sea and label each connection found
 * @param props 
 * @returns 
 */
export async function getConnectionsForOpenSea(props: ISourceConnectionProps): Promise<SourceConnection[]> { 
  const { address } = props || {};
  const events = await getAddressEvent(props);
  const connections = events?.asset_events?.map((event) => {
    const { from_account, to_account, asset } = event || {};
    const isSender = from_account?.address === address;
    const { image_url } = asset || {};
    return {
      address: isSender ? to_account?.address : from_account?.address,
      sourceAddress: address,
      link: event.permalink,
      type: {
        description: event.event_type,
        label: 'OpenSea'
      },
      payload: {
        // timestamp: transcation?.timeStamp,
        to_account,
        from_account,
        price: event.total_price,
        image_url
      }
    };
  } )as SourceConnection[];
  return connections;
}
