import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'https://prod-holaplex.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
});
