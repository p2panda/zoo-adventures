import React, { useEffect, useState } from 'react';
import p2panda from 'p2panda-js';

import { BambooLog } from '~/components/BambooLog';
import { Chatlog } from '~/components/Chatlog';
import { ENDPOINT, CHAT_SCHEMA } from '~/configs';
import { Instance, Session } from '~/p2panda-api';
import { Instructions } from '~/components/Instructions';

import type { EntryRecord } from '~/p2panda-api/types';

import '~/styles.css';

const App = (): JSX.Element => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [debugEntry, setDebugEntry] = useState<EntryRecord>(null);
  const [keyPair, setKeyPair] = useState(null);
  const [log, setLog] = useState<EntryRecord[]>([]);
  const [session, setSession] = useState<Session>(null);

  // Generate or load key pair on initial page load
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

  // Establish session with node when key pair is set
  useEffect(() => {
    setSession(new Session(ENDPOINT));
  }, [keyPair]);

  // Refresh chatlog when session is ready
  useEffect(() => {
    if (!session) return;
    const asyncEffect = async () => {
      const entries = await session.queryEntries(CHAT_SCHEMA);
      setLog(entries);
    };
    asyncEffect();
  }, [session]);

  // Publish entries and refresh chat log to get the new message in the log
  const handlePublish = async (message: string) => {
    await Instance.create(
      {
        message: {
          Text: message,
        },
      },
      { schema: CHAT_SCHEMA, session, keyPair },
    );
    setLog(await session.queryEntries(CHAT_SCHEMA));
  };

  return (
    <div className="home-wrapper flex-row">
      <div className="left-panel-wrapper flex-column">
        <Instructions
          currentMessage={currentMessage}
          debugEntry={debugEntry}
          entries={log}
          keyPair={keyPair}
          session={session}
        />
      </div>
      <div className="right-panel-wrapper flex-column">
        <Chatlog
          handlePublish={handlePublish}
          log={log}
          setCurrentMessage={setCurrentMessage}
          setDebugEntry={setDebugEntry}
        />
        <BambooLog log={log} />
      </div>
    </div>
  );
};

export default App;
