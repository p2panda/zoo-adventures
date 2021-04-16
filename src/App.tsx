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
  const [entries, setEntries] = useState<EntryRecord[]>([]);
  const [session, setSession] = useState<Session>(null);

  const syncEntries = async () => {
    const unsortedEntries = await session.queryEntries(CHAT_SCHEMA);
    setEntries(
      unsortedEntries.sort((entryA, entryB) => {
        return entryB.decoded.message.fields.date >
          entryA.decoded.message.fields.date
          ? 1
          : -1;
      }),
    );
  }, [session]);

  useEffect(() => {
    // Load incoming messages frequently
    syncEntries();
    window.setInterval(syncEntries, 5000);

  // Generate or load key pair on initial page load
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

  // Publish entries and refresh chat log to get the new message in the log
  const handlePublish = async (message: string) => {
    await Instance.create(
      {
        message: {
          Text: message,
        },
        date: {
          Text: new Date().toISOString(),
        },
      },
      { schema: CHAT_SCHEMA, session, keyPair },
    );
    syncEntries();
  };

  // Filter my personal entries
  const myEntries = entries.filter((entry) => {
    return entry.author === keyPair.publicKey();
  });

  return (
    <div className="home-wrapper flex-row">
      <div className="left-panel-wrapper flex-column">
        <Instructions
          currentMessage={currentMessage}
          debugEntry={debugEntry}
          entries={entries}
          keyPair={keyPair}
          session={session}
        />
      </div>
      <div className="right-panel-wrapper flex-column">
        <Chatlog
          handlePublish={handlePublish}
          log={entries}
          setCurrentMessage={setCurrentMessage}
          setDebugEntry={setDebugEntry}
        />
        <BambooLog log={myEntries} />
      </div>
    </div>
  );
};

export default App;
