import React from 'react';
import { DecodedEntry } from './DecodedEntry';
import { Entry } from './Entry';
import { KeyPair } from './KeyPair';
import { PublishEntry } from './PublishEntry';

type Props = any;

export const DebugView = ({
  publicKey,
  privateKey,
  newEntryHash,
  newMessageHash,
  decodedEntry,
  handleNewEntry,
}: Props): JSX.Element => (
  <div className="panel-one">
    <h1>p2🐼</h1>
    <p>How to publish messages using p2panda:</p>
    <KeyPair privateKey={privateKey} publicKey={publicKey} />
    <PublishEntry
      privateKey={privateKey}
      publicKey={publicKey}
      onNewEntry={handleNewEntry}
    />
    <Entry entryHash={newEntryHash} messageHash={newMessageHash} />
    <DecodedEntry decodedEntry={decodedEntry} />
  </div>
);
