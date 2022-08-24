// SPDX-License-Identifier: MIT

import { GraphQLClient, gql } from 'graphql-request';

const GQL_NEXT_ARGS = gql`
  query NextArgs($publicKey: String!, $viewId: String) {
    nextArgs(publicKey: $publicKey, viewId: $viewId) {
      logId
      seqNum
      backlink
      skiplink
    }
  }
`;

const GQL_PUBLISH = gql`
  mutation Publish($entry: String!, $operation: String!) {
    publish(entry: $entry, operation: $operation) {
      logId
      seqNum
      backlink
      skiplink
    }
  }
`;

type NextArgs = {
  logId: string;
  seqNum: string;
  backlink?: string;
  skiplink?: string;
};

export async function nextArgs(
  client: GraphQLClient,
  publicKey: string,
  viewId?: string,
): Promise<NextArgs> {
  const result = await client.request(GQL_NEXT_ARGS, {
    publicKey,
    viewId,
  });

  return result.nextArgs;
}

export async function publish(
  client: GraphQLClient,
  entry: string,
  operation: string,
): Promise<NextArgs> {
  const result = await client.request(GQL_PUBLISH, {
    entry,
    operation,
  });

  return result.publish;
}
