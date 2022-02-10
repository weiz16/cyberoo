import { convertWeiToEther } from "helpers";
import { ISourceConnectionProps, SourceConnection } from "../core.interface";
import { PageInfo } from "../cyber_connect/cyber_connect.interface";
import { EScanTransaction } from "./transfer.interface";


const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';


export function getTransactionURL(hash: string): string {
  return `https://etherscan.io/tx/${hash}`;
}

export function getAddressProfile(address: string): string {
  return `https://etherscan.io/address/${address}`;
}

/**
 * Get balance of an address in eth format
 * @param addrses 
 * @returns 
 */
export async function getAddressBalance(address: string): Promise<string> {

  const FIELDS: any = {
    module: 'account',
    action: 'balance',
    address,
    tag: 'latest',
    apiKey: process.env.ETHERSCAN_API_KEY
  };
  
  const ENDPOINT = `${ETHERSCAN_API_URL}?${Object.keys(FIELDS).map((key) => `${key}=${FIELDS[key]}`).join('&')}`
  return await fetch(ENDPOINT, { method: 'GET'}).then(async (res) => {
    try {
      const data = await res.json();
      return convertWeiToEther(data?.result || '0');
    } catch (_)  {
      return '00.00';
    }
  }, () => {
    return '00.00';
  });
}

/**
 * Extracts connection from eterscan and label each connection found
 * @param props props
 * @returns connection
 */
 export async function getConnectionsForTransfer(props: ISourceConnectionProps): Promise<SourceConnection[]> {
  const { address, pageSize, offset } = props || {};
  const transactions = await getNormalTransactionsByAddress(props.address, `${pageSize || 1}`, `${offset || 10}`);
  const connections: SourceConnection[]= (transactions || [])?.map((tx) => {
    const isSender = address === tx.from;
    return {
      sourceAddress: address,
      address: isSender ? tx.to : tx.from,
      link: getTransactionURL(tx.hash),
      type: {
        description: isSender ? 'sent' : 'received',
        label: 'Transfer'
      },
      payload: {
        tx,
        timestamp: tx.timeStamp,
        amount: convertWeiToEther(tx.value)
      }
    };
  });
  return connections;
}

/**
 * Get a list of most recent transaction by address
 * @param address 
 * @param page 
 * @param offset 
 * @returns 
 */
export async function getNormalTransactionsByAddress(address: string, page = '1', offset = '10'): Promise<EScanTransaction[]> {

  const FIELDS: any = {
    module: 'account',
    action: 'txlist',
    address,
    startBlock: '0',
    endBlock: '99999999',
    page: page === '0' ? '1' : page,
    offset,
    sort: 'desc',
    apiKey: process.env.ETHERSCAN_API_KEY
  };
  
  const ENDPOINT = `${ETHERSCAN_API_URL}?${Object.keys(FIELDS).map((key) => `${key}=${FIELDS[key]}`).join('&')}`
  return await fetch(ENDPOINT, { method: 'GET'}).then(async (res) => {
    try {
      const data = await res.json();
      return data?.result || [];
    } catch (_) {
      return [];
    }
  }, () => {
    return [];
  });
}