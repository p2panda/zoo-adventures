import React, { useEffect, useState } from 'react';
import p2panda from 'p2panda-js';

import { BambooLog } from '~/components/BambooLog';
import { Chatlog } from '~/components/Chatlog';
import { ENDPOINT, CHAT_SCHEMA } from '~/configs';
import { Instance, Session } from '~/p2panda-api';
import { Instructions } from '~/components/Instructions';

import type { EntryRecord } from '~/p2panda-api/types';

import '~/styles.css';

const session = new Session(ENDPOINT);
let syncInterval: number;

const App = (): JSX.Element => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [debugEntry, setDebugEntry] = useState<EntryRecord>(null);
  const [keyPair, setKeyPair] = useState(null);
  const [entries, setEntries] = useState<EntryRecord[]>([]);
  const [isSyncToggled, setSyncToggled] = useState<boolean>(true);

  const syncEntries = async () => {
    const unsortedEntries = await session.queryEntries(CHAT_SCHEMA);
    setEntries(
      unsortedEntries.sort(({ decoded: entryA }, { decoded: entryB }) => {
        return entryA.message.fields.date.Text > entryB.message.fields.date.Text
          ? 1
          : -1;
      }),
    );
  };

  // Load incoming messages frequently when sync checkbox is toggled
  useEffect(() => {
    if (isSyncToggled) {
      syncEntries();
      syncInterval = window.setInterval(syncEntries, 5000);
    } else {
      clearInterval(syncInterval);
    }
    return () => clearInterval(syncInterval);
  }, [isSyncToggled]);

  useEffect(() => {
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
          isSyncToggled={isSyncToggled}
          toggleSync={() => setSyncToggled(!isSyncToggled)}
        />
        <BambooLog log={myEntries} setDebugEntry={setDebugEntry} />
      </div>
    </div>
  );
};

export default App;
