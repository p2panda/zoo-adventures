import React from 'react';
import { Entry } from '~/p2panda-api';

type Props = {
  entry: Entry;
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
  const { message, entryHashBacklink, entryHashSkiplink } = entry.decoded_entry;
  return (
    <div className="flex-column">
      <div className="entry-data flex-row">
        <div>{entry.seq_num}</div>
        <div>{formatEntryHash(entry.entry_hash)}</div>
      </div>
      <div className="entry-content flex-row">
        <div className="flex-column">
          <b>{message.action}</b>
          <ul>
            <li>Schema: {formatCheckHash(message.schema)}</li>
            <li>Message: {formatMessage(message.fields.text.Text)}</li>
            <li>BackLink: {formatCheckHash(entryHashBacklink)}</li>
            <li>SkipLink: {formatCheckHash(entryHashSkiplink)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
