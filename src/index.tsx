import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { GraphQLClient } from 'graphql-request';
import { initWebAssembly } from 'p2panda-js';

import { fetchBoard, updateBoardField } from './board';
import { loadKeyPair, loadLastMove, storeLastMove } from './storage';
import { publicKeyToAnimal } from './animals';

const BOARD_SIZE = 4;
const UPDATE_INTERVAL = 2000; // ms

type GameBoardProps = {
  fields: string[];
  animal: string;
  onSetField: (index: number) => void;
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

const GameBoard: React.FC<GameBoardProps> = ({
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
  config: Configuration;
};

const Game: React.FC<GameProps> = ({ config }) => {
  const keyPair = useMemo(() => {
    return loadKeyPair();
  }, []);

  const client = useMemo(() => {
    return new GraphQLClient(config.endpoint);
  }, [config.endpoint]);

  const animal = useMemo(() => {
    return publicKeyToAnimal(keyPair.publicKey());
  }, [keyPair]);

  const [viewId, setViewId] = useState<string>();
  const [fields, setFields] = useState<string[]>();
  const [lastMove, setLastMove] = useState<string | null>(() => {
    return loadLastMove();
  });

  const onSetField = useCallback(
    async (fieldIndex: number) => {
      if (!viewId) {
        return;
      }

      // Do not allow making a move when player already did it one round ago
      if (lastMove === viewId) {
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

      // Send update to node.
      //
      // The method gives us back the "latest" view id, that is, we assume that
      // our last write is now the latest edge of the operation graph. But who
      // knows, maybe some concurrent write by someone decided something else!
      const latestViewId = await updateBoardField(
        client,
        keyPair,
        config.schemaId,
        viewId,
        fieldIndex,
        animal,
      );

      // Set and persist last move
      setLastMove(latestViewId);
      storeLastMove(latestViewId);

      // Temporarily guess that this might be the latest viewId from the
      // perspective of the node as well. The next update will proof us right
      // or wrong ..
      //
      // At least it helps us to block the player until the next update!
      setViewId(latestViewId);
    },
    [viewId, client, lastMove, keyPair, config, animal],
  );

  useEffect(() => {
    const updateBoard = async () => {
      const board = await fetchBoard(
        client,
        config.schemaId,
        config.documentId,
        BOARD_SIZE,
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
  }, [client, config.schemaId, config.documentId]);

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

export const ZooAdventures: React.FC<Configuration> = (config) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initWebAssembly();
      setReady(true);
    };

    init();
  }, []);

  return ready ? <Game config={config} /> : null;
};
