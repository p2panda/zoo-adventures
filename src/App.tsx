import React, { useEffect, useState } from 'react';
import p2panda from 'p2panda-js';
import { DebugView } from '~/components/debugview';
import { Chatlog } from './components/chatlog';

import '~/styles.css';

const App = (): JSX.Element => {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [newEntryHash, setNewEntryHash] = useState(null);
  const [newMessageHash, setNewMessageHash] = useState(null);
  const [decodedEntry, setDecodedEntry] = useState(null);
  const [log, setLog] = useState([]);

  useEffect(() => {
    const asyncEffect = async () => {
      const { KeyPair } = await p2panda;
      let pKey = window.localStorage.getItem('privateKey');
      if (!pKey) {
        const keyPair = new KeyPair();
        pKey = keyPair.privateKey();
        window.localStorage.setItem('privateKey', pKey);
      }
      setPrivateKey(pKey);
      setPublicKey(KeyPair.fromPrivateKey(pKey).publicKey());
    };
    asyncEffect();
  }, []);

  const handleNewEntry = async (newEntryHashes) => {
    const { decodeEntry } = await p2panda;
    const { entry, message } = newEntryHashes;
    const decodedEntry = decodeEntry(entry, message);
    setNewEntryHash(entry);
    setNewMessageHash(message);
    setDecodedEntry(decodedEntry);
    setLog([...log, decodedEntry]);
  };

  return (
    <div className="home-wrapper">
      <DebugView
        publicKey={publicKey}
        privateKey={privateKey}
        newEntryHash={newEntryHash}
        newMessageHash={newMessageHash}
        decodedEntry={decodedEntry}
        handleNewEntry={handleNewEntry}
      />
      <Chatlog log={log} />
    </div>
  );
};

export default App;
