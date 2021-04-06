import React, { useEffect, useState } from 'react';
import p2panda from 'p2panda-js';
import { Entry, Instance, Session } from '~/p2panda-api';
import { DebugView } from '~/components/DebugView';
import { Chatlog } from './components/chatlog';

import '~/styles.css';

const ENDPOINT = 'http://localhost:2020';
const CHAT_SCHEMA =
  '0040cf94f6d605657e90c543b0c919070cdaaf7209c5e1ea58acb8f3568fa2114268dc9ac3bafe12af277d286fce7dc59b7c0c348973c4e9dacbe79485e56ac2a702';

const App = (): JSX.Element => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [debugEntry, setDebugEntry] = useState<Entry>(null);
  const [keyPair, setKeyPair] = useState(null);
  const [log, setLog] = useState<Entry[]>([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const asyncEffect = async () => {
      const { KeyPair } = await p2panda;
      let privateKey = window.localStorage.getItem('privateKey');
      if (!privateKey) {
        const keyPair = new KeyPair();
        privateKey = keyPair.privateKey();
        window.localStorage.setItem('privateKey', privateKey);
      }
      setKeyPair(KeyPair.fromPrivateKey(privateKey));
    };
    asyncEffect();
  }, []);

  useEffect(() => {
    setSession(new Session({ keyPair, endpoint: ENDPOINT }));
  }, [keyPair]);

  const handlePublish = async (message) => {
    await Instance.create(
      { message },
      { schema: CHAT_SCHEMA, session, keyPair },
    );
    setLog(await Instance.query({}, { session, schema: CHAT_SCHEMA }));
  };

  return (
    <div className="home-wrapper">
      <DebugView
        currentMessage={currentMessage}
        debugEntry={debugEntry}
        entries={log}
        keyPair={keyPair}
        session={session}
      />
      <Chatlog
        handlePublish={handlePublish}
        log={log}
        setCurrentMessage={setCurrentMessage}
        setDebugEntry={setDebugEntry}
      />
    </div>
  );
};

export default App;
