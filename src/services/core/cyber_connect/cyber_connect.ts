import { ISourceConnectionProps, SourceConnection } from "../core.interface";
import { BasicInfoConnection, PageInfo, Social } from "./cyber_connect.interface";
import { getUserIdentity } from "./cyber_connect.query";

export const CYBERCONNECT_URL = 'https://app.cyberconnect.me/address/';

/**
 * Extracts connection from cyber connect and label each connection found
 * @param props props
 * @returns connection
 */
 export async function getConnectionsForCyberConnect(props: ISourceConnectionProps): Promise<SourceConnection[]> {

  let connections: SourceConnection[] = [];
  const { followers, friends, followings } = await getUserIdentity(props) || {} as BasicInfoConnection[];
  [{
    data: followers?.list,
    type: {
      label: 'CyberConnect',
      description: 'followed' 
    }
  },{
    data: followings?.list,
    type: {
      label: 'CyberConnect',
      description: 'following'
    }
  },
  {
    data: friends?.list,
    type: {
      label: 'CyberConnect',
      description: 'friend'
    }
  }].forEach((item) => {
    if (item?.data?.length) {
      connections = connections.concat(
        item.data.map((listItem) => {
          return {
            sourceAddress: props?.address,
            address: listItem.address,
            link: getCyberConnectProfileLink(listItem.address),
            type: item.type
          }
        }) as SourceConnection[]
      );
    }
  });

  return connections;
}


/**
 * Return cyber connect's profile link
 * @param address 
 * @returns 
 */
export function getCyberConnectProfileLink(address: string): string {
  return `${CYBERCONNECT_URL}${address}`;
}
