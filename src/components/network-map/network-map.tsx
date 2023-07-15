import React, { CSSProperties, ReactElement } from "react";
import { aggregateSourceConnection, ConnectionProfile, getConnectionsForCyberConnect, getConnectionsForOpenSea, getConnectionsForTransfer, getRecommendedConnections, LinkedConnections, SourceConnection } from "services";
import loadable from '@loadable/component';

const ForceGraph2D = loadable(() => import('./graph'))

import { HexColorPicker } from "react-colorful";
import { uniq, uniqBy } from "lodash";


const DEFAULT_COLOR = 'black';

const NodeExplorer: React.FC<{ node: any, initColor: string, initConnections: LinkedConnections, onUpdate: (color: string, connections: SourceConnection[]) => void }> = ({ node,  initConnections, initColor, onUpdate }) => {
  const [color, setColor] = React.useState(initColor);

  const style: CSSProperties = {
    background: color,
    width: '86px',
    height: '86px'
  };

  const addConnections = async (type: 'cyberconnect' | 'transfer' | 'opensea' | 'recommended') => {
    const props = { 
      address: node.id,
      pageSize: 5,
      offset: Math.floor(Math.random() * 11)
    };

    const connectionConfig = {
      'recommended': () => getRecommendedConnections(node.id),
      'transfer': () => getConnectionsForTransfer(props),
      'opensea': () => getConnectionsForOpenSea(props),
      'cyberconnect': () => getConnectionsForCyberConnect(props),
    }
    onUpdate(color, await connectionConfig[type]());
  };

  const profile = initConnections[node.id];

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
      <div className="flex flex-col p-2 m-2">
        {profile?.map((p) => {
          return (
            <div className="flex flex-col">
              <div>{p.type.description}</div>
              <div>{p.type.label}</div>
              <div>{p.address}</div>
              <div>{p.sourceAddress}</div>
            </div>
          );
        })}
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

  const [connections, setConnections] = React.useState<SourceConnection[]>(profile?.connections || []);

  const allConnections = [ ...connections ];
  const initConnections = aggregateSourceConnection(connections || []);
  
  const onNodeClicked = (node: any) : void => {
    showModal(<NodeExplorer node={node} initConnections={initConnections} initColor={mainNodes?.[node?.id] as string || DEFAULT_COLOR} onUpdate={(color, connections) => {
      const mergedConnections = [...(allConnections || []), ...connections || []];
      if (connections?.length) {
        setConnections(mergedConnections);
      }
      mainNodes[node.id] = color;
      setMainNodes(mainNodes);
    }}/>);
  };


  // Get all unique address to create nodes
  const profileAddresses = Object.keys(initConnections);
  const uniqAddrs = uniq(uniqBy(allConnections, (c) => c?.address).map((c) => c?.address).concat(profileAddresses)).filter(Boolean);

  let links: any[] = allConnections?.map((c) => (
    {
      source: c.sourceAddress,
      target: c.address
    }
  ));
  const data = {
    nodes: uniqAddrs.map((addr) => ({ id: addr })),
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