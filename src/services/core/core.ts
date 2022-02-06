// Core Connection utils
// Will source from different api provider such cyberconnect/etherscan (//TODO: find more provider)
// Connections will be identified as the following:
// - Transfer - sent/recieved
// - CyerConnect - following/followed

import { concat } from "lodash";
import { ConnectionProfile, ISourceConnectionProps, SourceConnection } from "./core.interface";
import { aggregateSourceConnection } from "./core.utils";
import { getConnectionsForCyberConnect } from "./cyber_connect/cyber_connect";
import { getConnectionsForTransfer } from "./transfer/transfer";


// Provider for connection data
const CONNECTION_PROVIDERS: ((props: ISourceConnectionProps) => Promise<SourceConnection[]>)[] = [
  (props: ISourceConnectionProps) => getConnectionsForCyberConnect(props),
  (props: ISourceConnectionProps) => getConnectionsForTransfer(props)
]; 


/**
 * Will be used as an entry point for the core api, it will discover 
 * connection associate to a given address from different provider specified;
 * @param source Source to discover this connection
 * @returns 
 */
 export async function discoverConnection(props: ISourceConnectionProps): Promise<ConnectionProfile> {
  const { address } = props || {};
  // All source connections
  const sourceConnections = concat(...await Promise.all(
    CONNECTION_PROVIDERS.map(f => f?.(props))
  ));
  return aggregateSourceConnection(sourceConnections, address) || { address, connections: []};
}
