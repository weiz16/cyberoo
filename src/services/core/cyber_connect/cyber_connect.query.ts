import { gql } from "@apollo/client";
import { client } from "../../index";
import { UserIdentity } from "./cyber_connect.interface";

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

// Quries
export const GET_IDENTITY = gql`query GetIdentity($address: String!) {
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