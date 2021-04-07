import React from 'react';
import { Entry } from '~/p2panda-api';
import { PublishEntry } from './PublishEntry';

type Props = {
  log: Entry[];
  setCurrentMessage: (message: string) => void;
  setDebugEntry: (entry: Entry) => void;
  handlePublish: (message: string) => Promise<void>;
};

const formatEntryHash = (hash: string): string =>
  `<Entry ${hash.slice(hash.length - 8, hash.length - 4)} ${hash.slice(
    hash.length - 4,
  )}>`;

export const Chatlog = ({
  log,
  setCurrentMessage,
  setDebugEntry,
  handlePublish,
}: Props): JSX.Element => (
  <div className="chat-log flex-column">
    <h2>Entry Log</h2>{' '}
    <PublishEntry
      handlePublish={handlePublish}
      setCurrentMessage={setCurrentMessage}
    />
    <div className="messages">
      {log.map((entry) => (
        <div key={entry.entry_hash} onClick={() => setDebugEntry(entry)}>
          <h3>{formatEntryHash(entry.entry_hash)}</h3>
        </div>
      ))}
    </div>
  </div>
);
