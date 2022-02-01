import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.cybertino.io/connect/",
  cache: new InMemoryCache()  
});

export const GET_FOLLOWERS = (address: string) => {
  return gql`query GetFollowers {
    identity(address: "${address}") {
      address
      followingCount
      followerCount
      followers {
        list {
          address
        }
      }
      followings {
        list{
          address
        }
      }
    }
  }`
};

export default client;