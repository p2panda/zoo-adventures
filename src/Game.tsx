import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

import { GameBoard } from './GameBoard';
import { fetchBoard, updateBoard } from './board';
import { loadKeyPair, loadLastMove, storeLastMove } from './storage';
import { publicKeyToAnimal } from './animals';
import { detectWinner, winCombinations } from './winner';

import type { Configuration } from './types';

type Props = {
  config: Configuration;
};

export const Game: React.FC<Props> = ({ config }) => {
  const keyPair = useMemo(() => {
    return loadKeyPair();
  }, []);

  const animal = useMemo(() => {
    return publicKeyToAnimal(keyPair.publicKey());
  }, [keyPair]);

  const client = useMemo(() => {
    return new GraphQLClient(config.endpoint);
  }, [config.endpoint]);

  // Latest document view id of the game board
  const [viewId, setViewId] = useState<string>();

  // State of the game board
  const [fields, setFields] = useState<string[]>();

  // Remember document view id of our last move, this helps us to detect if we
  // are the last player who updated the board
  const [lastMove, setLastMove] = useState<string | null>(() => {
    return loadLastMove();
  });

  // Remember what the last update was, this helps us to detect if the node
  // could send us something new
  const [lastUpdate, setLastUpdate] = useState<string>();

  // Block the user interface when we just made a move and we're waiting for
  // updates from the node
  const [ready, setReady] = useState(true);

  // Calculate all combinations on the board where a player wins. We only need
  // to do that once.
  const combinations = useMemo(() => {
    return winCombinations(config.boardSize, config.winSize);
  }, [config.boardSize, config.winSize]);

  // Calculate if we have any winners on the board.
  const winners = useMemo(() => {
    if (!fields) {
      return [];
    }

    return detectWinner(fields, combinations);
  }, [fields, combinations]);

  const update = useCallback(async () => {
    const board = await fetchBoard(
      client,
      config.schemaId,
      config.documentId,
      config.boardSize,
    );

    // Make sure to only affect the board state when we really have something
    // new for the client. This prevents overriding temporarily set local-only
    // state
    if (lastUpdate !== board.viewId) {
      setViewId(board.viewId);
      setFields(board.fields);
      setLastUpdate(board.viewId);
      setReady(true);
    }
  }, [
    client,
    config.boardSize,
    config.documentId,
    config.schemaId,
    lastUpdate,
  ]);

  const onSetField = useCallback(
    async (fieldIndex: number) => {
      // Do not do allow making a move when we're waiting for the latest state
      // from the node
      if (!viewId || !ready) {
        return;
      }

      // Do not allow making a move when player already did it one round ago
      if (lastMove === viewId) {
        return;
      }

      setReady(false);

      // Apply update locally first to see the changes directly
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
      const latestViewId = await updateBoard(
        client,
        keyPair,
        config.schemaId,
        viewId,
        fieldIndex,
        animal,
      );

      // Set and persist last move so we remember it when we come back later
      setLastMove(latestViewId);
      storeLastMove(latestViewId);
    },
    [viewId, client, lastMove, keyPair, config, animal, ready],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      update();
    }, config.updateIntervalMs);

    update();

    return () => {
      window.clearInterval(interval);
    };
  }, [client, update, config.updateIntervalMs]);

  return (
    <>
      {fields && (
        <GameBoard
          onSetField={onSetField}
          animal={animal}
          fields={fields}
          winners={winners}
        />
      )}
    </>
  );
};
