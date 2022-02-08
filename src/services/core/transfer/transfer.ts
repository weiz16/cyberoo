import { convertWeiToEther } from "helpers";
import { ISourceConnectionProps, SourceConnection } from "../core.interface";
import { PageInfo } from "../cyber_connect/cyber_connect.interface";
import { EScanTransaction } from "./transfer.interface";


const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';


export function getTransactionURL(hash: string): string {
  return `https://etherscan.io/tx/${hash}`;
}
/**
 * Get transfer connection using eternscan api and convert data into source connection that 
 * can be aggregated
 * @param props props
 * @returns connection
 */
 export async function getConnectionsForTransfer(props: ISourceConnectionProps): Promise<{ connections: SourceConnection[], pageInfo: PageInfo}> {
  const { address } = props || {};
  const pageInfo: PageInfo = {
    startCursor: "",
    endCursor: "",
    hasNextPage: false,
    hasPreviousPage: false
  };
  
  const transactions = await getNormalTransactionsByAddress(props.address);
  const connections: SourceConnection[]= transactions.map((tx) => {
    const isSender = address === tx.from;
    return {
      address: isSender ? tx.to : tx.from,
      link: getTransactionURL(tx.hash),
      type: {
        description: isSender ? 'sent' : 'received',
        label: 'Transfer'
      },
      payload: {
        timestamp: tx.timeStamp,
        amount: convertWeiToEther(tx.value)
      }
    };
  });
  return { connections, pageInfo };
}

/**
 * Get a list of transaction by address
 * @param address 
 * @param page 
 * @param offset 
 * @returns 
 */
export async function getNormalTransactionsByAddress(address: string, page = 1, offset = 10): Promise<EScanTransaction[]> {

  const FIELDS: any = {
    module: 'account',
    action: 'txlist',
    address,
    startBlock: '0',
    endBlock: '99999999',
    page,
    offset,
    sort: 'asc',
    apiKey: process.env.ETHERSCAN_API_KEY
  };
  
  const ENDPOINT = `${ETHERSCAN_API_URL}?${Object.keys(FIELDS).map((key) => `${key}=${FIELDS[key]}`).join('&')}`
  return await fetch(ENDPOINT, { method: 'GET'}).then(async (res) => {
    const data = await res.json();
    return data?.result || [];
  }, () => {
    return [];
  });
}