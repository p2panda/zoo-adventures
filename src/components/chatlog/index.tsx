import React from 'react';
import { Entry } from '~/p2panda-api';
import { SyntaxHighlighter } from '~/syntaxHighlighter';
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
  <div className="panel-two">
    <h2>Entry Log</h2>{' '}
    <div className="messages">
      {log.reverse().map((entry) => (
        <div key={entry.entry_hash} onClick={() => setDebugEntry(entry)}>
          <h3>Entry {entry.entry_hash.slice(0, 8)}</h3>
        </div>
      ))}
    </div>
    <PublishEntry
      handlePublish={handlePublish}
      setCurrentMessage={setCurrentMessage}
    />
  </div>
);
