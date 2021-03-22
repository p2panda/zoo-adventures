import React, { useState, useEffect } from 'react';
import p2panda from 'p2panda-js';
import { Link } from 'react-router-dom';

const LogWindow = () => {
  const [message, setMessage] = useState('');
  const [perfLoad, setPerfLoad] = useState<number>();
  const [perfKeyPair, setPerfKeyPair] = useState<number>();

  useEffect(() => {
    const asyncEffect = async () => {
      const timeStart = performance.now();
      const { KeyPair } = await p2panda;

      const timeP2PandaLoaded = performance.now();
      setPerfLoad(timeP2PandaLoaded - timeStart);

      const keyPair = new KeyPair();
      setMessage(`${keyPair.publicKey()}, ${keyPair.privateKey()}`);
      const timeKeyPair = performance.now();
      setPerfKeyPair(timeKeyPair - timeP2PandaLoaded);
    };
    asyncEffect();
  }, []);

  return (
    <div>
      <h2>Key pair</h2>
      <p>p2panda says: {message ? message : 'Generating key pair...'}</p>
      <h2>Performance</h2>
      <p>Loading p2panda lib: {perfLoad}ms</p>
      <p>Generating key pair: {perfKeyPair}ms</p>
    </div>
  );
};

const sendMessage = async (privateKey: string, message: string) => {
  const { signEncode } = await p2panda;
  const entry = await signEncode(privateKey, message);
  return entry;
};

const Home = (): JSX.Element => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [privateKey, setPrivateKey] = useState<string>();
  const [entryEncoded, setEntryEncoded] = useState<string>();
  const [entry, setEntry] = useState<any>();

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
    const entry = await sendMessage(privateKey, currentMessage);
    setCurrentMessage('');
    console.log(entry);
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
    <section>
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
      ></textarea>
      <pre>{entry}</pre>
      <LogWindow />
    </section>
  );
};

export default Home;
