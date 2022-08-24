import React from 'react';
import styled from 'styled-components';

import { validAnimal } from '../services/animals';

import type { Winner } from '../types';

// All dimensions in pixels
const FIELD_SIZE = 60;
const GAP_SIZE = 17;
const ICON_SIZE = 28;

type Props = {
  onSetField: (index: number) => void;
  animal: string;
  fields: string[];
  winners: Winner[];
};

export const GameBoard: React.FC<Props> = ({
  onSetField,
  animal,
  fields,
  winners,
}) => {
  return (
    <StyledGameBoard boardSize={Math.sqrt(fields.length)}>
      {fields.map((field, index) => {
        const fieldIndex = index + 1;

        // Was this field already set by this player?
        const alreadySet = field === animal;

        // Is this a winning field?
        const winner = winners.some(({ player, combination }) => {
          return field === player && combination.includes(index);
        });

        return (
          <GameBoardField
            onClick={() => {
              if (alreadySet) {
                return;
              }

              onSetField(fieldIndex);
            }}
            alreadySet={alreadySet}
            key={`field-${fieldIndex}`}
            winner={winner}
          >
            {validAnimal(field) && field}
          </GameBoardField>
        );
      })}
    </StyledGameBoard>
  );
};

const StyledGameBoard = styled.div<{ boardSize: number }>`
  display: inline-grid;
  font-size: ${ICON_SIZE}px;
  gap: ${GAP_SIZE}px;
  grid-auto-rows: ${FIELD_SIZE}px;
  grid-template-columns: ${(props) =>
    `repeat(${props.boardSize}, ${FIELD_SIZE}px)`};
`;

const GameBoardField = styled.div<{ alreadySet: boolean; winner: boolean }>`
  align-content: center;
  background-color: ${(props) => (props.winner ? '#ffdb9a' : '#efefef')};
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
        background-color: ${props.winner ? '#ffc04d' : '#ddd'};
      }
    `;
  }}
`;
