import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

import { GameBoard } from './GameBoard';
import { fetchBoard, updateBoardField } from './board';
import { loadKeyPair, loadLastMove, storeLastMove } from './storage';
import { publicKeyToAnimal } from './animals';

import type { Configuration } from './types';

type Props = {
  config: Configuration;
};

export const Game: React.FC<Props> = ({ config }) => {
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
        config.boardSize,
      );

      setViewId(board.viewId);
      setFields(board.fields);
    };

    const interval = window.setInterval(() => {
      updateBoard();
    }, config.updateIntervalMs);

    updateBoard();

    return () => {
      window.clearInterval(interval);
    };
  }, [
    client,
    config.boardSize,
    config.documentId,
    config.schemaId,
    config.updateIntervalMs,
  ]);

  return (
    <>
      {fields && (
        <GameBoard fields={fields} animal={animal} onSetField={onSetField} />
      )}
    </>
  );
};
