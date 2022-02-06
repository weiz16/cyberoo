import { ISourceConnectionProps, SourceConnection } from "../core.interface";
import { BasicInfoConnection } from "./cyber_connect.interface";
import { getUserIdentity } from "./cyber_connect.query";


/**
 * Get CyberConnection using cyperconnect api and convert data into source connection that 
 * can be aggregated 
 * @param props props
 * @returns connection
 */
 export async function getConnectionsForCyberConnect(props: ISourceConnectionProps): Promise<SourceConnection[]> {
  const { address } = props || {};

  let connections: SourceConnection[] = [];
  const { followers, friends, followings } = await getUserIdentity(address) || {} as BasicInfoConnection[];
  connections = connections.concat(
    followers?.list?.map((item) => {
      return {
        address: item.address,
        link: `https://app.cyberconnect.me/address/${item.address}`,
        type: {
          label: 'CyberConnect',
          description: 'followed'
        }
      };
    })
  );

  connections = connections.concat(
    followings?.list?.map((item) => {
      return {
        address: item.address,
        link: `https://app.cyberconnect.me/address/${item.address}`,
        type: {
          label: 'CyberConnect',
          description: 'following'
        }
      };
    })
  );

  connections =connections.concat(
    friends?.list?.map((item) => {
      return {
        address: item.address,
        link: `https://app.cyberconnect.me/address/${item.address}`,
        type: {
          label: 'CyberConnect',
          description: 'friend'
        }
      };
    })
  );
  
  return connections;
}
