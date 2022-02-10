import React, { CSSProperties, ReactElement } from "react";
import { aggregateSourceConnection, ConnectionProfile, getConnectionsForCyberConnect, getConnectionsForOpenSea, getConnectionsForTransfer, getRecommendedConnections, SourceConnection } from "services";
import loadable from '@loadable/component';

const ForceGraph2D = loadable(() => import('./graph'))

import { HexColorPicker } from "react-colorful";


const DEFAULT_COLOR = 'black';

const NodeExplorer: React.FC<{ node: any, initColor: string, onUpdate: (color: string, connections: SourceConnection[]) => void }> = ({ node, initColor, onUpdate }) => {
  const [color, setColor] = React.useState(initColor);

  const style: CSSProperties = {
    background: color,
    width: '86px',
    height: '86px'
  };

  const addConnections = async (type: 'cyberconnect' | 'transfer' | 'opensea' | 'recommended') => {
    let connections: SourceConnection[] = [];
    
    const props = { 
      address: node.id,
      pageSize: 5,
      offset: Math.floor(Math.random() * 11)
    };

    if (type === 'recommended') {
      connections = await getRecommendedConnections(node.id);
    }

    if (type === 'transfer') {
      connections = await getConnectionsForTransfer(props);
    }

    if (type === 'opensea') {
      connections = await getConnectionsForOpenSea(props);
    }

    if (type === 'cyberconnect') {
      connections = await getConnectionsForCyberConnect(props);
    }

    onUpdate(color, connections);
    
  };

  const buttonClass = "p-2 mb-2 bg-yellow-300 text-center truncate text-color-black cursor-pointer rounded-lg"
  return (
    <div className="flex justify-start flex-col absolute top-1/2 p-4 items-center rounded-lg left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6/12 h-2/3 bg-white">
      <div className="rounded-full" style={style}></div>
      <div>{node?.id}</div>
      <div>Color</div>
      <div>Customize this node </div>
      <div className="flex items-center w-full">
        <HexColorPicker className="inline-block" color={initColor} onChange={(color) => { 
            setColor(color);
            onUpdate(color, []);
          }
        }/>
      </div>
      <div className="mr-auto mt-4 mb-4">
        Expand on this node to find more connections
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          <div onClick={ () => addConnections('recommended')} className={buttonClass}>Recommended</div>
          <div onClick={ () => addConnections('cyberconnect')} className={buttonClass + ' text-white bg-black'}>Cyber Connect</div>
          <div onClick={ () => addConnections('transfer')} className={buttonClass + ' text-white'}>Transfer</div> 
          <div onClick={ () => addConnections('opensea')} className={buttonClass + ' bg-blue-400 text-white'}>Open Sea</div>
        </div>
      </div>
  </div>
  );
}

const NetworkMap: React.FC<{ profile: ConnectionProfile, showModal: (children: ReactElement) => void }> = ({ profile, showModal })  => {
  
  const [mainNodes, setMainNodes] = React.useState({
    [profile?.address]: 'red'
  });

  const [connections, setConnections] = React.useState<SourceConnection[]>([]);

  profile.connections = [...(profile?.connections || []), ...connections ];
  const initConnections = aggregateSourceConnection(profile.connections || []);

  const onNodeClicked = (node: any) : void => {
    showModal(<NodeExplorer node={node} initColor={mainNodes?.[node?.id] as string || DEFAULT_COLOR} onUpdate={(color, connections) => {
      const mergedConnections = [...(profile?.connections || []), ...connections || []];
      if (connections?.length) {
        setConnections(mergedConnections);
      }
      mainNodes[node.id] = color;
      setMainNodes(mainNodes);
    }}/>);
  };

  const otherAddresses = Object.keys(initConnections);
  const otherNodes: { id: string} [] = otherAddresses?.map( addr => {
    return {
      id: addr,
      payload: initConnections[addr]
    };
  });

  let links: any[] = [];
  otherAddresses.forEach((addrKey) => {
    initConnections[addrKey].forEach((c) => {
      const link = links.find((l) => l.id === c.address);
      if (!link) {
        links.push({
          source: c.sourceAddress, 
          target: c.address
        });
      }
    });
  });
  const data = {
    nodes: [
      ...[{ id: profile.address, mainNode: true, connections: profile.connections }],
      ...otherNodes
    ],
    links
  };


  return (
    <div className="flex flex-col">
      <ForceGraph2D
          width={500}
          height={500}
          graphData={data}
          onNodeClick={(node: any) => onNodeClicked(node)}
          nodeColor={(node: any) => {
            return mainNodes[node.id] || DEFAULT_COLOR;
          }}
          nodeLabel={(node: any) => `${node.id}`}
          />
    </div>
  );
}

export default NetworkMap;