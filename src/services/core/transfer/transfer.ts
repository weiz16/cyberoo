import { ISourceConnectionProps, SourceConnection } from "../core.interface";

/**
 * Get transfer connection using eternscan api and convert data into source connection that 
 * can be aggregated
 * @param props props
 * @returns connection
 */
 export async function getConnectionsForTransfer(props: ISourceConnectionProps): Promise<SourceConnection[]> {
  const { address } = props || {};
  return [
    // {
    //   address,
    //   link: '12',
    //   type: {
    //     label: 'Transfer',
    //     description: 'sent'
    //   },
    //   payload: {
    //     timestamp: new Date().toUTCString(),
    //     amount: '0.666'
    //   }
    // },
    // {
    //   address,
    //   link: '123',
    //   type: {
    //     label: 'Transfer',
    //     description: 'received',
    //   },
    //   payload: {
    //     amount: '0.888',
    //     timestamp: new Date().toUTCString()
    //   }
    // }
  ];
}