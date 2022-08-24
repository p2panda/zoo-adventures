import { GraphQLClient, gql } from 'graphql-request';
import {
  encodeOperation,
  generateHash,
  KeyPair,
  signAndEncodeEntry,
} from 'p2panda-js';

import { nextArgs, publish } from './request';

/**
 * We're making a move. Send that update to the node.
 */
export async function updateBoard(
  client: GraphQLClient,
  keyPair: KeyPair,
  schemaId: string,
  viewId: string,
  fieldIndex: number,
  animal: string,
): Promise<string> {
  const args = await nextArgs(client, keyPair.publicKey(), viewId);

  const payload = encodeOperation({
    action: 'update',
    previousOperations: viewId.split('_'),
    schemaId,
    fields: {
      [`game_field_${fieldIndex}`]: animal,
    },
  });

  const entry = signAndEncodeEntry(
    {
      ...args,
      payload,
    },
    keyPair,
  );

  await publish(client, entry, payload);

  // Assume that our last operation id will be the latest view id for this node
  return generateHash(entry);
}

/**
 * Get the latest board game state from the node.
 */
export async function fetchBoard(
  client: GraphQLClient,
  schemaId: string,
  documentId: string,
  boardSize: number,
): Promise<{ viewId: string; fields: string[] }> {
  const fields = new Array(boardSize * boardSize).fill(0).map((_, index) => {
    return `game_field_${index + 1}`;
  });

  const query = gql`
    query FetchBoard($documentId: String!) {
      board: ${schemaId}(id: $documentId) {
        meta {
          viewId
        }
        fields {
          ${fields.join(' ')}
        }
      }
    }
  `;

  const result = await client.request(query, {
    documentId,
  });

  return {
    viewId: result.board.meta.viewId,
    fields: fields.map((fieldName) => {
      return result.board.fields[fieldName];
    }),
  };
}
