import React, { useEffect, useState } from 'react';
import p2panda from 'p2panda-js';

import { SyntaxHighlighter } from '~/syntaxHighlighter';

export const PublishEntry = ({ handlePublish }): JSX.Element => {
  const [entryMessage, setEntryMessage] = useState<string>('');

  // Set draft entry message on input change
  const handleChange = (event) => {
    setEntryMessage(event.target.value);
  };

  const handleSubmit = () => {
    setEntryMessage('');
    handlePublish(entryMessage);
  };

  return (
    <div>
      <h2>Publish Entry</h2>
      <SyntaxHighlighter>{`const endpoint = 'http://localhost:2020';
const CHAT_SCHEMA = '0040cf94f6d6...'
const session = new Session({ keyPair, endpoint: ENDPOINT });
const message = '${entryMessage}';
await Instance.create(
  { message },
  { schema: CHAT_SCHEMA, session, keyPair },
);`}</SyntaxHighlighter>
      <label>
        Message:{' '}
        <input type="text" onChange={handleChange} value={entryMessage} />
      </label>
      <input type="submit" value="Submit" onClick={handleSubmit} />
    </div>
  );
};
