import React from 'react';
import { DecodedEntry } from './DecodedEntry';
import { Entry } from './Entry';
import { KeyPair } from './KeyPair';
import { PublishEntry } from './PublishEntry';
import { EntryArgs } from './EntryArgs';

type Props = any;

export const DebugView = ({
  publicKey,
  privateKey,
  encodedEntry,
  encodedMessage,
  decodedEntry,
  entryArgs,
  handlePublish,
}: Props): JSX.Element => (
  <div className="panel-one">
    <h1>p2🐼</h1>
    <p>How to publish messages using p2panda:</p>
    <KeyPair privateKey={privateKey} publicKey={publicKey} />
    <EntryArgs entryArgs={entryArgs} />
    <PublishEntry handlePublish={handlePublish} />
    <Entry encodedEntry={encodedEntry} encodedMessage={encodedMessage} />
    <DecodedEntry decodedEntry={decodedEntry} />
  </div>
);
