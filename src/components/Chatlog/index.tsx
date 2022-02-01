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
};

const formatAuthor = ({ author }) => `${author.slice(0, 6)}`;

export const Chatlog = ({
  log,
  setCurrentMessage,
  setDebugEntry,
  handlePublish,
  isSyncToggled,
  toggleSync,
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
    <div className="messages">
      {log.slice(-10).map((entry) => (
        <div
          key={`${entry.logId}-${entry.seqNum}-${entry.encoded.author}`}
          onClick={() => setDebugEntry(entry)}
        >
          <h3 className="message">
            {formatAuthor(entry.encoded)}: {entry.operation.fields.message}
          </h3>
        </div>
      ))}
    </div>
  </div>
);
