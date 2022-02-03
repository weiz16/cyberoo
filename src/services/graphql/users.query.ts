import { gql } from "@apollo/client";
import { client } from "services";

// Quries
const GET_IDENTITY = gql`query GetIdentity($address: String!) {
  identity(address: $address) {
    address
    followingCount
    followerCount
    followers(first:5) {
      list {
        address
        domain
        
      }
    }
    followings(first:5) {
      list {
        address
        domain
        
      }
    }
  }
}`;

// Service calls
/**
 * Return cyber connect's user identity
 * @param address eth address
 * @returns user identity
 */
export function getUserIdentity(address: string): Promise<UserIdentity> {
  return client.query({ query: GET_IDENTITY, variables: { address }}).then((res) => {
    return res?.data?.identity || {};
  });
}


// Interfaces
// TODO: Move to a dedicated folder for interfaces/types
export type UserIdentity = {
  address: string;
  domain: string;
  social: Social;
  avatar: string;
  joinTime: string;
  followerCount: number;
  followingCount: number;
  followings: BasicInfoConnection;
  followers: BasicInfoConnection;
  friends: BasicInfoConnection;
}

export type Social = {
  twitter: string;
}

export type BasicInfoConnection = {
  list: Connect[];
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
