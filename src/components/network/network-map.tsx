import React from "react";
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

interface NetworkMapProps {
  
}
 
interface NetworkMapState {
  
}
 
const nodes = new DataSet([
  { id: 1, label: 'Node 1' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
  { id: 4, label: 'Node 4' },
  { id: 5, label: 'Node 5' }
]);

// create an array with edges
const edges = new DataSet([
  { id: 1, from: 1, to: 3 },
  { id: 2, from: 1, to: 2 },
  { id: 3, from: 2, to: 4 },
  { id: 4, from: 2, to: 5 }
]);

const data = {
  nodes: nodes,
  edges: edges
};
const options = {};

class NetworkMap extends React.Component<NetworkMapProps, NetworkMapState> {

  private containerRef!: HTMLDivElement;

  private network!: Network;

  constructor(props: NetworkMapProps) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    this.network = new Network(this.containerRef, data as any, options);
  }

  render() { 
    return ( 
      <div className="h-99 mt-3 bg-zinc-500" ref={(el) => this.containerRef = el as HTMLDivElement }></div>
    );
  }
}
 
export default NetworkMap;