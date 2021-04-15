import React from 'react';

import type { EntryRecord } from '~/p2panda-api/types';

type Props = {
  entry: EntryRecord;
};

const formatEntryHash = (hash: string): string =>
  `${hash.slice(hash.length - 8, hash.length - 4)} ${hash.slice(
    hash.length - 4,
  )}`;

const formatCheckHash = (hash: string): string => {
  if (!hash) return 'null';
  return `#${hash.slice(-4)}`;
};

const formatMessage = (message: string): string => {
  if (message.length <= 12) return `'${message}'`;
  return `'${message.slice(-12)}...'`;
};

export const LogEntry = ({ entry }: Props): JSX.Element => {
  const { message, entryHashBacklink, entryHashSkiplink } = entry.decoded;
  return (
    <div className="flex-column">
      <div className="entry-data flex-row">
        <div>{entry.seqNum}</div>
        <div>{formatEntryHash(entry.entryHash)}</div>
      </div>
      <div className="entry-content flex-row">
        <div className="flex-column">
          <b>{message.action}</b>
          <ul>
            <li>Schema: {formatCheckHash(message.schema)}</li>
            <li>Message: {formatMessage(message.fields.message.Text)}</li>
            <li>BackLink: {formatCheckHash(entryHashBacklink)}</li>
            <li>SkipLink: {formatCheckHash(entryHashSkiplink)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
