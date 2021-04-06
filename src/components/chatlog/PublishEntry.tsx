import React, { useState } from 'react';

type Props = {
  handlePublish: (message: string) => Promise<void>;
  setCurrentMessage: (message: string) => void;
};

export const PublishEntry = ({
  handlePublish,
  setCurrentMessage,
}: Props): JSX.Element => {
  const [entryMessage, setEntryMessage] = useState<string>('');

  // Set draft entry message on input change
  const handleChange = (event) => {
    setEntryMessage(event.target.value);
    setCurrentMessage(event.target.value);
  };

  const handleSubmit = () => {
    setEntryMessage('');
    handlePublish(entryMessage);
  };

  return (
    <div className="composer">
      <label>
        Message:{' '}
        <input type="text" onChange={handleChange} value={entryMessage} />
      </label>
      <input type="submit" value="Send" onClick={handleSubmit} />
    </div>
  );
};
