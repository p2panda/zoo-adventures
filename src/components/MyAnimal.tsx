// SPDX-License-Identifier: MIT

import React from 'react';
import styled from 'styled-components';

type Props = {
  animal: string;
  winSize: number;
};

export const MyAnimal: React.FC<Props> = ({ animal, winSize }) => {
  return (
    <StyledMyAnimal>
      Put {winSize}x {animal} in a row to win
    </StyledMyAnimal>
  );
};

const StyledMyAnimal = styled.div`
  font-size: 15px;
  margin: 20px;
  text-align: center;
`;
