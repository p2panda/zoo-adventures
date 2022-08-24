import React from 'react';
import styled from 'styled-components';

type Props = {
  animal: string;
};

export const MyAnimal: React.FC<Props> = ({ animal }) => {
  return <StyledMyAnimal>You're playing {animal}</StyledMyAnimal>;
};

const StyledMyAnimal = styled.div`
  font-size: 15px;
  margin: 20px;
  text-align: center;
`;
