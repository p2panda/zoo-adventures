import React, { useEffect, useState } from 'react';
import p2panda from 'p2panda-js';

import { SyntaxHighlighter } from '~/syntaxHighlighter';

const getFirstEntryArgs = async (author, entry) => {
  return {
    entryHashBacklink: null,
    entryHashSkiplink: null,
    lastSeqNum: null,
    logId: 1,
  };
};

const getEntryArgsSnippet = `// JSON-RPC call to server node
const entryArgs = await getFirstEntryArgs(publicKey, schema);`;
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

export const PublishEntry = (props) => {
  const [backlinkHash, setBacklinkHash] = useState<string>();
  const [skiplinkHash, setSkiplinkHash] = useState<string>();
  const [lastSeqNum, setLastSeqNum] = useState<number>();
  const [logId, setLogId] = useState<number>();
  const [draftMessage, setDraftMessage] = useState<string>();
  const [entryMessage, setEntryMessage] = useState<string>();
  const [newEntryHashes, setNewEntryHashes] = useState({
    entry: null,
    message: null,
  });

  // Set entry message on form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    setEntryMessage(draftMessage);
  };

  // Set draft entry message on input change
  const handleChange = (event) => {
    setDraftMessage(event.target.value);
  };

  // Get next entryArgs when newEntryHash changes
  // This needs to be hooked up to aquadoggo getEntryArgs API call
  useEffect(() => {
    const asyncEffect = async () => {
      const args = await getFirstEntryArgs(props.publicKey, null);
      setBacklinkHash(args.entryHashBacklink);
      setSkiplinkHash(args.entryHashSkiplink);
      setLastSeqNum(args.lastSeqNum);
      setLogId(args.logId);
    };
    asyncEffect();
  }, [newEntryHashes]);

  // When entryMessage is set encode new entry
  useEffect(() => {
    if (!entryMessage) {
      return;
    }
    const asyncEffect = async () => {
      const { signEncode } = await p2panda;
      // Create signed & encoded entry
      const entry = await signEncode(
        props.publicKey,
        entryMessage,
        skiplinkHash,
        backlinkHash,
        null,
      );
      setNewEntryHashes({
        entry: entry.encoded_entry,
        message: entry.encoded_message,
      });
    };
    asyncEffect();
  }, [entryMessage]);

  // When new entry is encoded call method passed from parent
  useEffect(() => {
    if (newEntryHashes.entry) {
      props.onNewEntry(newEntryHashes);
    }
  }, [newEntryHashes]);

  return (
    <div>
      <h2>Entry Arguments</h2>
      <SyntaxHighlighter>{getEntryArgsSnippet}</SyntaxHighlighter>
      <span className="break-line">
        <SyntaxHighlighter>
          {`{ backlinkHash: ${backlinkHash}, \nskiplinkHash: ${skiplinkHash}, \nlastSeqNum: ${lastSeqNum}, \nlogId: ${logId} }`}
        </SyntaxHighlighter>
      </span>

      <h2>Publish Entry</h2>
      <SyntaxHighlighter>{signEncodeSnippet}</SyntaxHighlighter>
      <form onSubmit={handleSubmit}>
        <label>
          Message: <input type="text" onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
