import React from 'react';
import { EntryRecord } from '~/p2panda-api/types';
import { PublishEntry } from './PublishEntry';

type Props = {
  log: EntryRecord[];
  setCurrentMessage: (message: string) => void;
  setDebugEntry: (entry: EntryRecord) => void;
  handlePublish: (message: string) => Promise<void>;
};

const formatAuthor = ({ author }) => `${author.slice(0, 6)}`;

export const Chatlog = ({
  log,
  setCurrentMessage,
  setDebugEntry,
  handlePublish,
}: Props): JSX.Element => (
  <div className="chat-log flex-column">
    <h2>Message Log</h2>{' '}
    <PublishEntry
      handlePublish={handlePublish}
      setCurrentMessage={setCurrentMessage}
    />
    <div className="messages">
      {log.map((entry) => (
        <div
          key={`${entry.logId}-${entry.seqNum}`}
          onClick={() => setDebugEntry(entry)}
        >
          <h3>
            {formatAuthor(entry)}: {entry.decoded.message.fields.text.Text}
          </h3>
        </div>
      ))}
    </div>
  </div>
);
