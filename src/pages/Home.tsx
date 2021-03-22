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
        await signEncode(private_key, 'test');
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

const sendMessage = async (privateKey: string, message: string) => {
  const { signEncode } = await p2panda;
  // @TODO
  // 1. Get the skiplink sequence number from wasm method first
  // 2. Pass over backlink entry hash, skiplink entry hash, sequence number from log ..
  const entry = await signEncode(privateKey, message);
  console.log(entry);
  // Push entry to log
  log.push(entry);
  return entry;
};

const Home = (): JSX.Element => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [privateKey, setPrivateKey] = useState<string>();
  const [entryEncoded, setEntryEncoded] = useState<string>();
  const [entry, setEntry] = useState<string>();
  const [messageEncoded, setMessageEncoded] = useState<string>();
  const [hash, setHash] = useState<string>();

  useEffect(() => {
    const asyncEffect = async () => {
      const { KeyPair } = await p2panda;
      if (!window.localStorage.getItem('privateKey')) {
        const keyPair = new KeyPair();
        window.localStorage.setItem('privateKey', keyPair.privateKey());
      }
      setPrivateKey(window.localStorage.getItem('privateKey'));
    };
    asyncEffect();
  }, []);

  const handleClick = async () => {
    const result = await sendMessage(privateKey, currentMessage);
    setCurrentMessage('');
    setEntryEncoded(result.encoded_entry);
    setMessageEncoded(result.encoded_message);
    setHash(result.entry_hash);
  };

  useEffect(() => {
    const asyncEffect = async () => {
      const { decodeEntry } = await p2panda;
      const decodedEntry = await decodeEntry(entryEncoded);
      setEntry(decodedEntry);
    };
    asyncEffect();
  }, [entryEncoded]);

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
      <div>
        <h1>p2paradies, p2panda, p2parachute</h1>
        <h2>Hallo, hier ist alles schön :)</h2>
        <input
          type="text"
          onChange={({ target: { value } }) => setCurrentMessage(value)}
          value={currentMessage}
        />
        <button onClick={() => handleClick()}>bœp</button>
        <h2>hier beginnt das Abenteuer:</h2>
        <textarea
          rows={20}
          cols={80}
          onChange={({ target: { value } }) => setEntryEncoded(value)}
          value={entryEncoded}
        ></textarea>

        <LogWindow />
      </div>
      <div>
        <pre>{entry}</pre>
        <p style={{ maxWidth: '30em', wordBreak: 'break-all' }}>
          {hash && 'Hash:'} {hash}
        </p>
        <p style={{ maxWidth: '30em', wordBreak: 'break-all' }}>
          {messageEncoded && 'Message:'} {messageEncoded}
        </p>
      </div>
    </section>
  );
};

export default Home;
