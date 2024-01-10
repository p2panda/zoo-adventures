// SPDX-License-Identifier: MIT

import { GraphQLClient, gql } from 'graphql-request';
import { DocumentViewId, KeyPair, Session } from 'shirokuma';

/**
 * We're making a move. Send that update to the node.
 */
export async function updateBoard(
  session: Session,
  keyPair: KeyPair,
  schemaId: string,
  previous: string,
  fieldIndex: number,
  animal: string,
): Promise<DocumentViewId> {
  const documentViewId = await session.update(
    {
      [`game_field_${fieldIndex}`]: animal,
    },
    previous,
    { schemaId, keyPair },
  );

  return documentViewId;
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

  const result = await client.request<{
    board: {
      meta: {
        viewId: string;
      };
      fields: {
        [fieldName: string]: string;
      };
    };
  }>(query, {
    documentId,
  });

  return {
    viewId: result.board.meta.viewId,
    fields: fields.map((fieldName) => {
      return result.board.fields[fieldName];
    }),
  };
}
