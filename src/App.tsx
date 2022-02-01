import React, { useEffect, useState } from 'react';
import { createKeyPair, Session, wasm } from 'p2panda-js';

// import { BambooLog } from '~/components/BambooLog';
import { Chatlog } from '~/components/Chatlog';
import { ENDPOINT, CHAT_SCHEMA } from '~/configs';
import { Instructions } from '~/components/Instructions';

import type { EntryRecord } from 'p2panda-js';

import '~/styles.css';

const session = new Session(ENDPOINT);
let syncInterval: number;

type Document = {
  _meta: {
    author: string;
    deleted: boolean;
    edited: boolean;
    entries: string[];
    id: string;
    last_operation: string;
    schema: string;
  };
};

type Bookmark = Document & {
  created: string;
  title: string;
  url: string;
};

const App = (): JSX.Element => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [debugEntry, setDebugEntry] = useState<EntryRecord>(null);
  const [keyPair, setKeyPair] = useState(null);
  const [entries, setEntries] = useState<Bookmark[]>([]);
  const [isSyncToggled, setSyncToggled] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const syncEntries = async () => {
    setError(null);

    let unsortedEntries: Bookmark[] = [];
    try {
      unsortedEntries = await session.query({ schema: CHAT_SCHEMA });
    } catch (err) {
      setError(err.message);
      setSyncToggled(false);
      console.log('Error fetching entries', err);
    }

    setEntries(
      unsortedEntries.sort(({ created: createdA }, { created: createdB }) => {
        return new Date(createdA) > new Date(createdB) ? 1 : -1;
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
      let privateKey = window.localStorage.getItem('privateKey');
      if (!privateKey) {
        const keyPair = await createKeyPair();
        privateKey = keyPair.privateKey();
        window.localStorage.setItem('privateKey', privateKey);
      }
      const { KeyPair } = await wasm;
      setKeyPair(KeyPair.fromPrivateKey(privateKey));
    };
    asyncEffect();
  }, []);

  // Publish entries and refresh chat log to get the new message in the log
  const handlePublish = async (message: string) => {
    const [url, ...titleSegments] = message.split(' ');
    const title = titleSegments.join(' ');
    await session.create(
      {
        url: url,
        title: title,
        created: new Date().toISOString(),
      },
      { schema: CHAT_SCHEMA, session, keyPair },
    );
    syncEntries();
  };

  // Filter my personal entries
  // const myEntries = entries.filter(({ _meta: { author } }) => {
  //   return author === keyPair.publicKey();
  // });

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
          error={error}
        />
      </div>
    </div>
  );
};

export default App;
