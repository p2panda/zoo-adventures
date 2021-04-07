import React from 'react';
import { Entry } from '~/p2panda-api';
import { PublishEntry } from './PublishEntry';

type Props = {
  log: Entry[];
  setCurrentMessage: (message: string) => void;
  setDebugEntry: (entry: Entry) => void;
  handlePublish: (message: string) => Promise<void>;
};

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
          <h3>{`< ${entry.decoded_entry.message.fields.text.Text} >`}</h3>
        </div>
      ))}
    </div>
  </div>
);
