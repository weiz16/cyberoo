import React from "react";
import { LinkedConnections, PickedConnection } from "services";
import { Graph } from "react-d3-graph";


interface NetworkMapProps {
  connections: LinkedConnections;
  address: string;
}
 
interface NetworkMapState {
  data: any;
}

class NetworkMap extends React.Component<NetworkMapProps, NetworkMapState> {

  private containerRef!: HTMLDivElement;


  // the graph configuration, just override the ones you need
  private onClickNode = (nodeId) => {
    window.alert(`Clicked node ${nodeId}`);
  };

  private onClickLink = (source, target) => {
    window.alert(`Clicked link between ${source} and ${target}`);
  };


  private myConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
    },
  };
  
  constructor(props: NetworkMapProps) {
    super(props);
    this.state = { data: {} };
    
    const addresses = Object.keys(this.props.connections);

    // graph payload (with minimalist structure)
    this.state = { data: {
        nodes: [
          { id: this.props.address},
          ...addresses?.map((key) => {
            return {
              id: key
            }
          })
        ],
        links: addresses.map((key) =>{
          return {
            source: this.props.address, 
            target: key
          };
        })
      }
    };

  }

  componentDidMount() {
    const { address, connections } = this.props;



    
  }

  render() { 
    return ( 
      <Graph
        id="graph-id" // id is mandatory
        data={this.state.data}
        config={this.myConfig}
        onClickNode={this.onClickNode}
        onClickLink={this.onClickLink}
      />
    );
  }
}
 
export default NetworkMap;