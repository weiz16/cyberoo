import { gql } from "@apollo/client";
import { client, ISourceConnectionProps } from "../../index";
import { UserIdentity } from "./cyber_connect.interface";

/**
 * Return cyber connect's user identity
 * @param address eth address
 * @returns user identity
 */
 export function getUserIdentity(props: ISourceConnectionProps, query = GET_IDENTITY): Promise<UserIdentity> {
  const { address, pageSize, offset } = props || {};
  return client.query({ query, variables: { address, pageSize, offset: `${offset === 0? '-1' : offset || 0}` }}).then(async (res) => {
    const identity: UserIdentity = res?.data?.identity || {};
    return identity;
  }).catch((_) => {
    return {} as UserIdentity;
  });
}

export function getFollowers(props: ISourceConnectionProps): Promise<UserIdentity> {
  return getUserIdentity(props, GET_FOLLOWER);
}

export function getFollowings(props: ISourceConnectionProps): Promise<UserIdentity> {
  return getUserIdentity(props, GET_FOLLOWING);
}

// Quries
const GET_FOLLOWER = gql`query GetIdentity($address: String!, $pageSize: Int = 5, $offset: String! = "0") {
  identity(address: $address) {
    address
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
  }
}`;

const GET_FOLLOWING = gql`query GetIdentity($address: String!, $pageSize: Int = 5, $offset: String! = "0") {
  identity(address: $address) {
    address
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


const GET_IDENTITY = gql`query GetIdentity($address: String!, $pageSize: Int = 5, $offset: String! = "0") {
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