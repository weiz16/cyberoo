import { gql } from "@apollo/client";
import { client } from "../../index";
import { UserIdentity } from "./cyber_connect.interface";

/**
 * Return cyber connect's user identity
 * @param address eth address
 * @returns user identity
 */
 export function getUserIdentity(address: string): Promise<UserIdentity> {
  return client.query({ query: GET_IDENTITY, variables: { address }}).then(async (res) => {
    const identity: UserIdentity = res?.data?.identity || {};
    return identity;
  });
}

// Quries
export const GET_IDENTITY = gql`query GetIdentity($address: String!) {
  identity(address: $address) {
    address
    domain
    social {
      twitter
    }
    followingCount
    followerCount
    followers(first: 50) {
      list {
        address
        domain
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
			}
    }
    followings(first: 50) {
      list {
        address
        domain
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
			}
    }
  }
}`;