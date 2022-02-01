import React from 'react';

import { PublishEntry } from '~/components/Chatlog/PublishEntry';

import type { EntryRecord } from 'p2panda-js';

type Props = {
  log: EntryRecord[];
  setCurrentMessage: (message: string) => void;
  setDebugEntry: (entry: EntryRecord) => void;
  handlePublish: (message: string) => Promise<void>;
  isSyncToggled: boolean;
  toggleSync: () => void;
  error?: string;
};

const formatAuthor = ({ author }) => `${author.slice(0, 6)}`;

export const Chatlog = ({
  log,
  setCurrentMessage,
  setDebugEntry,
  handlePublish,
  isSyncToggled,
  toggleSync,
  error,
}: Props): JSX.Element => (
  <div className="chat-log flex-column">
    <h2>Message Log</h2>{' '}
    <div>
      <PublishEntry
        handlePublish={handlePublish}
        setCurrentMessage={setCurrentMessage}
      />
      <label style={{ marginLeft: '.5em' }}>
        <input type="checkbox" checked={isSyncToggled} onChange={toggleSync} />{' '}
        Sync
      </label>
    </div>
    {error && <div className="error-message">{error}</div>}
    <div className="messages">
      {log
        .slice(-10)
        .reverse()
        .map((entry) => (
          <div
            key={`${entry.logId}-${entry.seqNum}-${entry.encoded.author}`}
            onClick={() => setDebugEntry(entry)}
          >
            <h3 className="message">
              {formatAuthor(entry.encoded)}: {entry.operation.fields.url}{' '}
              {entry.operation.fields.title}
            </h3>
          </div>
        ))}
    </div>
  </div>
);
