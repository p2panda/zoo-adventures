import React from 'react';
import { DecodedEntry } from './DecodedEntry';
import { Entry } from './Entry';
import { KeyPair } from './KeyPair';
import { PublishEntry } from './PublishEntry';
import { EntryArgs } from './EntryArgs';

type Props = any;

export const DebugView = ({ keyPair, handlePublish }: Props): JSX.Element => (
  <div className="panel-one">
    <h1>p2🐼</h1>
    <p>How to publish messages using p2panda:</p>
    <KeyPair keyPair={keyPair} />
    <PublishEntry handlePublish={handlePublish} />
  </div>
);
