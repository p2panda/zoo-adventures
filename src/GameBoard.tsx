import React from 'react';
import styled from 'styled-components';

// All dimensions in pixels
const FIELD_SIZE = 60;
const GAP_SIZE = 17;
const ICON_SIZE = 28;

type Props = {
  animal: string;
  fields: string[];
  onSetField: (index: number) => void;
};

export const GameBoard: React.FC<Props> = ({ fields, onSetField, animal }) => {
  return (
    <StyledGameBoard boardSize={Math.sqrt(fields.length)}>
      {fields.map((field, index) => {
        const fieldIndex = index + 1;

        // Was this field already set by this player?
        const alreadySet = field === animal;

        return (
          <GameBoardField
            key={`field-${fieldIndex}`}
            alreadySet={alreadySet}
            onClick={() => {
              if (alreadySet) {
                return;
              }

              onSetField(fieldIndex);
            }}
          >
            {field}
          </GameBoardField>
        );
      })}
    </StyledGameBoard>
  );
};

const StyledGameBoard = styled.div<{ boardSize: number }>`
  display: grid;
  font-size: ${ICON_SIZE}px;
  gap: ${GAP_SIZE}px;
  grid-auto-rows: ${FIELD_SIZE}px;
  grid-template-columns: ${(props) =>
    `repeat(${props.boardSize}, ${FIELD_SIZE}px)`};
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
