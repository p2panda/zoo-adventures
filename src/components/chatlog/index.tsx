import React from 'react';
import { Entry } from '~/p2panda-api';
import { SyntaxHighlighter } from '~/syntaxHighlighter';
import { PublishEntry } from './PublishEntry';

type Props = {
  log: Entry[];
  setCurrentMessage: (message: string) => void;
  handlePublish: (message: string) => Promise<void>;
};

export const Chatlog = ({
  log,
  setCurrentMessage,
  handlePublish,
}: Props): JSX.Element => (
  <div className="panel-two">
    <h2>Entry Log</h2>{' '}
    <div className="messages">
      {log.reverse().map((entry) => (
        <div key={entry.entry_hash}>
          <h3>Hash {entry.entry_hash.slice(0, 8)}</h3>
          <SyntaxHighlighter>{entry.debugDecoded}</SyntaxHighlighter>
        </div>
      ))}
    </div>
    <PublishEntry
      handlePublish={handlePublish}
      setCurrentMessage={setCurrentMessage}
    />
  </div>
);
