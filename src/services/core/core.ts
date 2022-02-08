// Core Connection utils
// Will source from different api provider such cyberconnect/etherscan (//TODO: find more provider)
// Connections will be identified as the following:
// - Transfer - sent/recieved
// - CyerConnect - following/followed

import { ConnectionProfile, ISourceConnectionProps, SourceConnection } from "./core.interface";
import { aggregateSourceConnection } from "./core.utils";
import { getConnectionsForCyberConnect } from "./cyber_connect/cyber_connect";
import { getConnectionsForTransfer } from "./transfer/transfer";


/**
 * Will be used as an entry point for the core api, it will discover 
 * connection associate to a given address from different provider specified;
 * @param source Source to discover this connection
 * @returns 
 */
 export async function discoverConnection(props: ISourceConnectionProps): Promise<ConnectionProfile> {
  const { address } = props || {};
  // All source connections
  let { domain, connections, social } = await getConnectionsForCyberConnect(props);
  const { connections: transferConnections, pageInfo } = await getConnectionsForTransfer(props);
  connections = connections.concat(transferConnections);
  const connection =  aggregateSourceConnection(connections, address) || { address, connections: []};
  connection.domain = domain || '';
  connection.twitter = social?.twitter || '';
  connection.pageInfo = pageInfo; 
  return connection;
}
