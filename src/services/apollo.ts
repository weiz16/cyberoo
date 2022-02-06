
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://api.cybertino.io/connect/",
  cache: new InMemoryCache()  
});
