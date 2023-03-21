import { GraphQLClient } from 'graphql-request';

export const GRAPHQL_ENDPOINT = 'https://harbour-movies.vercel.app/api/graphql';

export const client = (operation?: string) => {
  const endpoint = operation
    ? GRAPHQL_ENDPOINT + `?op=${operation}`
    : GRAPHQL_ENDPOINT;
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
