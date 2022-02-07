import React from "react";
import { LinkedConnections } from "services";


interface NetworkMapProps {
  connections: LinkedConnections;
  address: string;
}
 
interface NetworkMapState {
  
}
class NetworkMap extends React.Component<NetworkMapProps, NetworkMapState> {

  private containerRef!: HTMLDivElement;


  constructor(props: NetworkMapProps) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    const { address, connections } = this.props;



    
  }

  render() { 
    return ( 
      <div className=" w-full h-full" ref={(el) => this.containerRef = el as HTMLDivElement }></div>
    );
  }
}
 
export default NetworkMap;