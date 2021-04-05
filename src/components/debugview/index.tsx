import React from 'react';
import { DecodedEntry } from './decodedentry';
import { Entry } from './entry';
import { KeyPair } from './keypair';
import { PublishEntry } from './publishentry';

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
