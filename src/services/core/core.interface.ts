// Interfaces

// Current supported connection label
// CyberConnection -> Connection is valid when you have followed or following or both
// Transfer -> Connectino is valid when you have either sent or receive
export type ConnectionLabel = 'CyberConnect' | 'Transfer';

// Current identified connection type - 'sent' | 'received' | 'following' etc...
export type SourceConnectionType = TransferConnectionType | CyberConnectConnectionType;
export type TransferConnectionType = 'sent' | 'received';
export type CyberConnectConnectionType = 'following' | 'followed' | 'friend';

// Describes a connection profile
// profile - contains a list of all connections linked to the address
export type ConnectionProfile = {
  address: string;
  domain?: string;
  images?: string[];
  twitter?: string;
  linkedConnections?: LinkedConnections;
  pageInfo?: any;
};

// Source information for a profile
export type SourceConnection = {
  address: string;
  link: string; // redirection link
  type: { 
    description: SourceConnectionType,
    label: ConnectionLabel;
  };
  payload?: SourceConnectionPayload; // Addtional payload for this connections
};

export type LinkedConnections = Record<string, PickedConnection[]>;
export type PickedConnection = Pick<SourceConnection, 'link' | 'payload' | 'type'>;

// Describe a connection in detail 
export type SourceConnectionPayload = TransferConnectionPayload | CyberConnectConnectionPayload;
export type TransferConnectionPayload = {
  amount: string; // amount for this transfer
  timestamp: string; // utc format, time this transfer is made
}

// Empty for now, CyberConnect has no more context for describing the connection
export type CyberConnectConnectionPayload = {
}


// Props for finding a connection
// Such as timestamp - If we only wanna to understand a connection between a specfic time
export type ISourceConnectionProps = {
  address: string;
}

