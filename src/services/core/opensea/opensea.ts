
// Open sea service code here

import { OpenSeaAssets } from "services";

const OPENSEA_API = 'https://api.opensea.io/api/v1/';


const OPENSEA_ASSET_API = `${OPENSEA_API}assets/`;

/**
 * Given an address, return a NFT asset owned
 * @param address address
 * @returns image url
 */
export async function getAddressAsset(address: string, options: any): Promise<string[]> {
  return await fetch(`${OPENSEA_ASSET_API}?limit=10&offset=0&order_by=sale_price&owner=${address}`, options).then(async (res) =>{
    const data = await res.json();
    return ((data as OpenSeaAssets).assets)?.map((item) => item.image_url);
  });
}