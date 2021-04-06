import React, { useEffect, useState } from 'react';
import p2panda from 'p2panda-js';

import { SyntaxHighlighter } from '~/syntaxHighlighter';
import p2pandaApi from '~/p2panda-api';

const signEncodeSnippet = `const { signEncode } =
await p2panda;
const message = 'Hello Panda!'
const {encodedEntryHash, encodedMessageHash} = await signEncode(
  publicKey,
  message,
  entryArgs.skiplinkHash,
  entryArgs.backlinkHash,
  entryArgs.lastSeqNum,
);`;

export const PublishEntry = ({ handlePublish }) => {
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
      <SyntaxHighlighter>{signEncodeSnippet}</SyntaxHighlighter>
      <label>
        Message:{' '}
        <input type="text" onChange={handleChange} value={entryMessage} />
      </label>
      <input type="submit" value="Submit" onClick={handleSubmit} />
    </div>
  );
};
