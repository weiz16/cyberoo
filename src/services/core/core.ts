// Core Connection utils
// Will source from different api provider such cyberconnect/etherscan (//TODO: find more provider)
// Connections will be identified as the following:
// - Transfer - sent/recieved
// - CyerConnect - following/followed
// - OpenSea

import { shuffle } from "lodash";
import { getAddressAsset, getConnectionsForOpenSea, getUserIdentity } from ".";
import { ConnectionProfile, ISourceConnectionProps, SourceConnection } from "./core.interface";
import { getConnectionsForCyberConnect } from "./cyber_connect/cyber_connect";
import { getAddressBalance, getConnectionsForTransfer } from "./transfer/transfer";


/**
 * Will be used as an entry point for the core api, it will discover 
 * connection associate to a given address from different provider specified;
 * @param source Source to discover this connection
 * @returns 
 */
 export async function discoverConnection(props: ISourceConnectionProps): Promise<ConnectionProfile> {
  const { address } = props || {};
  // All source connections
  const identity = await getUserIdentity({ address, pageSize: 20, offset: 0}) || {};
  const connection: ConnectionProfile = {
    ...identity,
    balance: await getAddressBalance(address),
    connections: await getRecommendedConnections(address),
    images: await getAddressAsset({ address })
  };
  return connection;
}

/**
 * Get random list of connections from cyber connect, etherscan, open sea 
 * and shuffles the list
 * @param address 
 * @returns 
 */
export async function getRecommendedConnections(address: string): Promise<SourceConnection[]> {
  const props = { 
    address,
    pageSize: 5,
    offset: Math.floor(Math.random() * 11)
  };
  // get random connection from cyber connect/open sea / eterscan
  const connections: SourceConnection[] = [...new Set((await Promise.all([
    getConnectionsForTransfer(props),
    getConnectionsForCyberConnect(props),
    getConnectionsForOpenSea(props)
  ])).flat())]
;
  return shuffle(connections);
}