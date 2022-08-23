import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { GraphQLClient, gql } from 'graphql-request';
import {
  KeyPair,
  encodeOperation,
  initWebAssembly,
  signAndEncodeEntry,
} from 'p2panda-js';

import { ANIMALS } from './animals';

import type { FunctionComponent } from 'react';

type Animal = string;
type DocumentViewId = string;
type FieldIndex = number;
type Fields = string[];

const PRIVATE_KEY_STORE = 'privateKey';
const BOARD_SIZE = 4;
const UPDATE_INTERVAL = 2000; // ms

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

async function nextArgs(
  client: GraphQLClient,
  publicKey: string,
  viewId?: DocumentViewId,
): Promise<NextArgs> {
  const result = await client.request(GQL_NEXT_ARGS, {
    publicKey,
    viewId,
  });

  return result.nextArgs;
}

async function publish(
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

function initialiseKeyPair(): KeyPair {
  const privateKey = window.localStorage.getItem(PRIVATE_KEY_STORE);
  if (privateKey) {
    return new KeyPair(privateKey);
  }

  const keyPair = new KeyPair();
  window.localStorage.setItem(PRIVATE_KEY_STORE, keyPair.privateKey());
  return keyPair;
}

function publicKeyToAnimal(publicKey: string): string {
  const value = parseInt(publicKey.slice(0, 8), 16);
  return ANIMALS[value % ANIMALS.length];
}

async function updateBoardField(
  client: GraphQLClient,
  keyPair: KeyPair,
  schemaId: string,
  viewId: DocumentViewId,
  fieldIndex: FieldIndex,
  animal: string,
): Promise<void> {
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
}

async function fetchBoard(
  client: GraphQLClient,
  schemaId: string,
  documentId: string,
): Promise<{ viewId: DocumentViewId; fields: Fields }> {
  const fields = new Array(BOARD_SIZE * BOARD_SIZE).fill(0).map((_, index) => {
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

type GameBoardProps = {
  fields: Fields;
  animal: Animal;
  onSetField: (index: FieldIndex) => void;
};

const StyledGameBoard = styled.div`
  display: grid;
  font-size: 28px;
  gap: 17px;
  grid-auto-rows: 60px;
  grid-template-columns: repeat(${BOARD_SIZE}, 60px);
`;

const GameBoardField = styled.div<{ alreadySet: boolean }>`
  align-content: center;
  background-color: #efefef;
  border-radius: 50%;
  border: 0 #efefef solid;
  cursor: ${(props) => (props.alreadySet ? 'normal' : 'pointer')};
  display: inline-grid;
  text-align: center;
  transition: background-color linear 20ms;
  user-select: none;

  ${(props) => {
    if (props.alreadySet) {
      return;
    }

    return `
      &:hover {
        background-color: #ddd;
      }
    `;
  }}
`;

const GameBoard: FunctionComponent<GameBoardProps> = ({
  fields,
  onSetField,
  animal,
}) => {
  return (
    <StyledGameBoard>
      {fields.map((field, index) => {
        const alreadySet = field === animal;

        return (
          <GameBoardField
            key={`field-${index}`}
            alreadySet={alreadySet}
            onClick={() => {
              if (alreadySet) {
                return;
              }

              onSetField(index + 1);
            }}
          >
            {field}
          </GameBoardField>
        );
      })}
    </StyledGameBoard>
  );
};

type GameProps = {
  keyPair: KeyPair;
  config: Configuration;
};

const Game: FunctionComponent<GameProps> = ({ keyPair, config }) => {
  const client = useMemo(() => {
    return new GraphQLClient(config.endpoint);
  }, [config.endpoint]);

  const publicKey = useMemo(() => {
    return keyPair.publicKey();
  }, [keyPair]);

  const animal = useMemo(() => {
    return publicKeyToAnimal(publicKey);
  }, [publicKey]);

  const [viewId, setViewId] = useState<DocumentViewId>();
  const [fields, setFields] = useState<Fields>();

  const onSetField = useCallback(
    async (fieldIndex: FieldIndex) => {
      if (!viewId) {
        return;
      }

      // Apply update locally first
      setFields((value) => {
        if (!value) {
          return;
        }

        value[fieldIndex - 1] = animal;
        return [...value];
      });

      // Send update to node
      await updateBoardField(
        client,
        keyPair,
        config.schemaId,
        viewId,
        fieldIndex,
        animal,
      );
    },
    [viewId, client, keyPair, config, animal],
  );

  useEffect(() => {
    const updateBoard = async () => {
      const board = await fetchBoard(
        client,
        config.schemaId,
        config.documentId,
      );

      setViewId(board.viewId);
      setFields(board.fields);
    };

    const interval = window.setInterval(() => {
      updateBoard();
    }, UPDATE_INTERVAL);

    updateBoard();

    return () => {
      window.clearInterval(interval);
    };
  }, [client, publicKey, config.schemaId, config.documentId]);

  return (
    <>
      {fields && (
        <GameBoard fields={fields} animal={animal} onSetField={onSetField} />
      )}
    </>
  );
};

export type Configuration = {
  endpoint: string;
  schemaId: string;
  documentId: string;
};

export const ZooAdventures: FunctionComponent<Configuration> = (config) => {
  const [keyPair, setKeyPair] = useState<KeyPair>();

  useEffect(() => {
    const init = async () => {
      await initWebAssembly();
      setKeyPair(initialiseKeyPair());
    };

    init();
  }, []);

  return keyPair ? <Game keyPair={keyPair} config={config} /> : null;
};
