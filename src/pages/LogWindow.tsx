// Pulled this out of our earlier version, thought we might want to use the perf code somewhere

import React, { useState, useEffect } from 'react';
import p2panda from 'p2panda-js';

const NUM_ITERATIONS = 250;

const log = [];

const LogWindow = () => {
  const [debugMsg, setDebugMsg] = useState('');

  const [perfLoad, setPerfLoad] = useState<number>();
  const [perfKeyPair, setPerfKeyPair] = useState<number>();
  const [perfEncodeEntry, setPerfEncodeEntry] = useState<number>();
  const [perfDecodeEntry, setPerfDecodeEntry] = useState<number>();

  useEffect(() => {
    const asyncEffect = async () => {
      const timeStart = performance.now();
      const { KeyPair, decodeEntry, signEncode } = await p2panda;

      const timeP2PandaLoaded = performance.now();
      setPerfLoad(timeP2PandaLoaded - timeStart);

      const keyPair = new KeyPair();
      setDebugMsg(`${keyPair.publicKey()}, ${keyPair.privateKey()}`);
      const timeKeyPair = performance.now();
      setPerfKeyPair(timeKeyPair - timeP2PandaLoaded);

      const private_key = keyPair.privateKey();
      const timeBeforeEntry = performance.now();
      for (const i of new Array(NUM_ITERATIONS).fill(1))
        await sendMessage(private_key, 'test');
      const timeAfterEntry = performance.now();
      setPerfEncodeEntry((timeAfterEntry - timeBeforeEntry) / NUM_ITERATIONS);

      const result = await sendMessage(private_key, 'test');
      const timeBeforeDecode = performance.now();
      for (const i of new Array(NUM_ITERATIONS).fill(1))
        await decodeEntry(result.encoded_entry);
      const timeAfterDecode = performance.now();
      setPerfDecodeEntry((timeAfterDecode - timeBeforeDecode) / NUM_ITERATIONS);
    };
    asyncEffect();
  }, []);

  return (
    <div>
      <h2>Key pair</h2>
      <p>p2panda says: {debugMsg ? debugMsg : 'Generating key pair...'}</p>
      <h2>Performance</h2>
      <p>Loading p2panda lib: {perfLoad}ms</p>
      <p>Generating key pair: {perfKeyPair}ms</p>
      <p>Encoding an entry: {perfEncodeEntry}ms</p>
      <p>Decoding an entry: {perfDecodeEntry}ms</p>
    </div>
  );
};

const getEntryHash = (seqNum, log) => {
  // Offset seqNum by -1 to retrieve correct entry from log array
  return log[seqNum - 1].entry_hash;
};

const sendMessage = async (privateKey: string, message: string) => {
  const { signEncode, getSkipLink, decodeEntry } = await p2panda;

  const logLength = log.length;
  let seqNum: number = null;
  let skipLink: number = null;
  let skipLinkHash: string = null;
  let backLinkHash: string = null;
  let backLink: number = null;

  if (logLength > 0) {
    seqNum = logLength + 1;
    backLink = logLength;
    // Get skipLink sequence number
    skipLink = getSkipLink(seqNum);
    // Calculate skiplink entry hash
    skipLinkHash = getEntryHash(skipLink, log);
    console.log({ skipLinkHash });
    // Calculate backlink entry hash
    backLinkHash = getEntryHash(backLink, log);
    console.log({ backLinkHash });
  }

  // Create signed & encoded entry
  const entry = await signEncode(
    privateKey,
    message,
    skipLinkHash,
    backLinkHash,
    seqNum,
  );

  console.log(entry);
  // Push entry to log
  log.push(entry);
  const decodedEntry = await decodeEntry(
    entry.encoded_entry,
    entry.encoded_message,
  );
  console.log({ decodedEntry });
  return entry;
};

export default LogWindow;
