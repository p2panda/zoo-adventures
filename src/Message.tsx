import React from 'react';

type Props = {
  onClose: () => void;
  message: string;
};

export const Message: React.FC<Props> = ({ message, onClose }) => {
  return (
    <>
      <p>{message}</p>
      <button onClick={onClose}>Okay</button>
    </>
  );
};
