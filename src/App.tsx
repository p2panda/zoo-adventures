import React, { useEffect, useState } from 'react';
import p2panda from 'p2panda-js';
import p2pandaApi from '~/p2panda-api';
import { DebugView } from '~/components/debugview';
import { Chatlog } from './components/chatlog';

import '~/styles.css';

const CHAT_SCHEMA =
  '0040cf94f6d605657e90c543b0c919070cdaaf7209c5e1ea58acb8f3568fa2114268dc9ac3bafe12af277d286fce7dc59b7c0c348973c4e9dacbe79485e56ac2a702';

const App = (): JSX.Element => {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [encodedEntry, setEncodedEntry] = useState(null);
  const [encodedMessage, setEncodedMessage] = useState(null);
  const [decodedEntry, setDecodedEntry] = useState(null);
  const [entryArgs, setEntryArgs] = useState({});
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

  // const handleNewEntry = async (encodedEntryes) => {
  //   const { decodeEntry } = await p2panda;
  //   const { entry, message } = encodedEntryes;
  //   const decodedEntry = decodeEntry(entry, message);
  //   setencodedEntry(entry);
  //   setEncodedMessage(message);
  //   setDecodedEntry(decodedEntry);
  //   setLog([...log, decodedEntry]);
  // };

  const handlePublish = async (message) => {
    console.log(message);
    const { decodeEntry, signEncode } = await p2panda;

    const args = await p2pandaApi.getNextEntryArgs(publicKey, CHAT_SCHEMA);
    setEntryArgs(args);

    // Create signed & encoded entry
    const entry = await signEncode(
      publicKey,
      message,
      args.entryHashSkiplink,
      args.entryHashBacklink,
      args.lastSeqNum,
    );
    setEncodedEntry(entry.encoded_entry);
    setEncodedMessage(entry.encoded_message);

    await p2pandaApi.publishEntry(entry.encoded_entry, entry.encoded_message);
    const decodedEntry = decodeEntry(
      entry.encoded_entry,
      entry.encoded_message,
    );

    setDecodedEntry(decodedEntry);
    setLog([...log, decodedEntry]);
  };

  return (
    <div className="home-wrapper">
      <DebugView
        publicKey={publicKey}
        privateKey={privateKey}
        encodedEntry={encodedEntry}
        encodedMessage={encodedMessage}
        decodedEntry={decodedEntry}
        entryArgs={entryArgs}
        handlePublish={handlePublish}
      />
      <Chatlog log={log} />
    </div>
  );
};

export default App;
