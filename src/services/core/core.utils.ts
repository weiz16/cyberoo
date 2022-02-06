
// Utils for core module

import { SourceConnection, ConnectionProfile } from "./index";

/**
 * aggregate all source connections into a single source profile
 * also perform transform on data, for instance, [Follow each other] - is a result of combining connection following + followed
 * and strip out duplicate information
 * @param sourceConnections 
 * @param address 
 * @returns Connectinon profile
 */
 export function aggregateSourceConnection(sourceConnections: SourceConnection[], address: string): ConnectionProfile {
  const connection: ConnectionProfile = {
    address, 
    linkedConnections: {}
  }
  sourceConnections.forEach((c: SourceConnection) => {
    const { address, link, payload } = c || {};
    const { description, label } = c?.type || {};
    connection.linkedConnections[address] = connection.linkedConnections[address] || [];
    connection.linkedConnections[address].push(
      {
        link,
        type: {
          description,
          label
        },
        payload
      }
    );   

  });
  return connection;
}
