import React from 'react';

import type { EntryRecord } from 'p2panda-js';

type Props = {
  entry: EntryRecord;
};

const formatEntryHash = (hash: string): string => hash.slice(4, 10);

const formatCheckHash = (hash: string): string => {
  if (!hash) return 'null';
  return `#${hash.slice(4, 10)}`;
};

const formatMessage = (message: string): string => {
  if (message.length <= 12) return `'${message}'`;
  return `'${message.slice(-12)}...'`;
};

export const LogEntry = ({ entry }: Props): JSX.Element => {
  const { operation, entryHashBacklink, entryHashSkiplink } = entry;

  return (
    <div className="flex-column">
      <div className="entry-data flex-row">
        <div>{entry.seqNum}</div>
        <div>{formatEntryHash(entry.encoded.entryHash)}</div>
      </div>
      <div className="entry-content flex-row">
        <div className="flex-column">
          <b>{operation.action}</b>
          <ul>
            <li>Schema: {formatCheckHash(operation.schema)}</li>
            <li>Message: {formatMessage(operation.fields.url)}</li>
            <li>BackLink: {formatCheckHash(entryHashBacklink)}</li>
            <li>SkipLink: {formatCheckHash(entryHashSkiplink)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
