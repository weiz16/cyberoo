import { gql } from "@apollo/client";
import { client, ISourceConnectionProps } from "../../index";
import { UserIdentity } from "./cyber_connect.interface";

/**
 * Return cyber connect's user identity
 * @param address eth address
 * @returns user identity
 */
 export function getUserIdentity(props: ISourceConnectionProps): Promise<UserIdentity> {
  const { address, pageSize, offset } = props || {};
  return client.query({ query: GET_IDENTITY, variables: { address, pageSize, offset: `${offset ? '-1' : offset} || 0` }}).then(async (res) => {
    const identity: UserIdentity = res?.data?.identity || {};
    return identity;
  }).catch((_) => {
    return {} as UserIdentity;
  });
}

// Quries
export const GET_IDENTITY = gql`query GetIdentity($address: String!, $pageSize: Int = 5, $offset: String! = "0") {
  identity(address: $address) {
    address
    domain
    social {
      twitter
    }
    followingCount
    followerCount
    followers(first: $pageSize, after: $offset) {
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
    followings(first: $pageSize, after: $offset) {
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