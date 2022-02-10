
// Utils for core module

import { SourceConnection, LinkedConnections } from "./index";

/**
 * aggregate all source connections into a single source profile
 * also perform transform on data, for instance, [Follow each other] - is a result of combining connection following + followed
 * and strip out duplicate information
 * @param sourceConnections 
 * @param address 
 * @returns Connectinon profile
 */
 export function aggregateSourceConnection(sourceConnections: SourceConnection[]): LinkedConnections {
  let combinedConnections: LinkedConnections = {};
  sourceConnections.forEach((c: SourceConnection) => {
    const { address, link, payload, sourceAddress } = c || {};
    const { description, label } = c?.type || {};
    combinedConnections[address] = combinedConnections[address] || [];
    combinedConnections[address].push(
      {
        address,
        sourceAddress,
        link,
        type: {
          description,
          label
        },
        payload: payload || {}
      }
    );   

  });
  return combinedConnections;
}
