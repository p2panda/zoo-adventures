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

const CHAT_SCHEMA =
  '0040cf94f6d605657e90c543b0c919070cdaaf7209c5e1ea58acb8f3568fa2114268dc9ac3bafe12af277d286fce7dc59b7c0c348973c4e9dacbe79485e56ac2a702';

export const PublishEntry = (props) => {
  const [backlinkHash, setBacklinkHash] = useState<string>();
  const [skiplinkHash, setSkiplinkHash] = useState<string>();
  const [lastSeqNum, setLastSeqNum] = useState<number>();
  const [logId, setLogId] = useState<number>();
  const [entryMessage, setEntryMessage] = useState<string>();
  const [newEntryHashes, setNewEntryHashes] = useState({
    entry: null,
    message: null,
  });

  // Set entry message on form submit
  const handleSubmit = async () => {
    const { signEncode } = await p2panda;
    // Create signed & encoded entry
    const entry = await signEncode(
      props.publicKey,
      entryMessage,
      skiplinkHash,
      backlinkHash,
      null,
    );

    await p2pandaApi.publishEntry(entry.encoded_entry, entry.encoded_message);

    setEntryMessage('');
    setNewEntryHashes({
      entry: entry.encoded_entry,
      message: entry.encoded_message,
    });
  };

  // Set draft entry message on input change
  const handleChange = (event) => {
    setEntryMessage(event.target.value);
  };

  // Get next entryArgs when newEntryHash changes
  // This needs to be hooked up to aquadoggo getEntryArgs API call
  useEffect(() => {
    if (props.publicKey == null) return;
    const asyncEffect = async () => {
      const args = await p2pandaApi.getNextEntryArgs(
        props.publicKey,
        CHAT_SCHEMA,
      );
      setBacklinkHash(args.entryHashBacklink);
      setSkiplinkHash(args.entryHashSkiplink);
      setLastSeqNum(args.lastSeqNum);
      setLogId(args.logId);
    };
    asyncEffect();
  }, [newEntryHashes, props.publicKey]);

  // When new entry is encoded call method passed from parent
  useEffect(() => {
    if (newEntryHashes.entry) {
      props.onNewEntry(newEntryHashes);
    }
  }, [newEntryHashes]);

  return (
    <div>
      <h2>Request next entry arguments</h2>
      <p>Sends a JSON-RPC call to p2panda node</p>
      <SyntaxHighlighter>
        {`const entryArgs = await getNextEntryArgs(publicKey, schema);
// => { backlinkHash: ${backlinkHash}, \n// skiplinkHash: ${skiplinkHash}, \n// lastSeqNum: ${lastSeqNum}, \n// logId: ${logId} }`}
      </SyntaxHighlighter>

      <h2>Publish Entry</h2>
      <SyntaxHighlighter>{signEncodeSnippet}</SyntaxHighlighter>
      <label>
        Message: <input type="text" onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" onClick={handleSubmit} />
    </div>
  );
};
