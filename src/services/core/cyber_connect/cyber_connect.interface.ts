// Cyber connect service model
export type UserIdentity = {
  address: string;
  domain: string;
  social: Social;
  avatar: string;
  joinTime: string;
  followerCount: string;
  followingCount: string;
  followings: BasicInfoConnection;
  followers: BasicInfoConnection;
  friends: BasicInfoConnection;
}

export type Social = {
  twitter: string;
}

export type BasicInfoConnection = {
  list: Connect[];
  pageInfo: PageInfo;
}

export type PageInfo = {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type Connect = {
  address: string;
  domain: string;
  avatar: string;
  alias: string;
  namespace: string;
  lastModifiedTime: string;
  verifiable: boolean;
}
