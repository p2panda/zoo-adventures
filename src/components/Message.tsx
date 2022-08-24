import React from 'react';
import styled from 'styled-components';

type Props = {
  onClose: () => void;
  message: string;
};

export const Message: React.FC<Props> = ({ message, onClose }) => {
  return (
    <BlockingOverlay>
      <StyledMessage>
        <MessageValue>{message}</MessageValue>
        <MessageButton onClick={onClose}>Okay</MessageButton>
      </StyledMessage>
    </BlockingOverlay>
  );
};

const BlockingOverlay = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const StyledMessage = styled.div`
  align-items: center;
  background-color: #8ac18a;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px;
  margin: 75px 25px;
  padding: 10px;
`;

const MessageValue = styled.p`
  font-size: 20px;
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
`;

const MessageButton = styled.button`
  background-color: #a68ac1;
  border-radius: 15px;
  border: 0;
  color: #f2eef6;
  cursor: pointer;
  font-size: 15px;
  margin-bottom: 10px;
  outline: 0;
  padding: 10px;

  &:hover {
    background-color: #b199c9;
  }
`;
