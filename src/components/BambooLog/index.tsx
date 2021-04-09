import React from 'react';
import { LogEntry } from './LogEntry';
import type { EntryRecord } from '~/p2panda-api/types';

type Props = {
  log: EntryRecord[];
};

export const BambooLog = ({ log }: Props): JSX.Element => (
  <div className="bamboo-log flex-column">
    <h2>Bamboo Log</h2>{' '}
    <div className="flex-row">
      {log.map((entry) => (
        <div className="log-item" key={entry.entryHash}>
          <LogEntry entry={entry} />
        </div>
      ))}
    </div>
  </div>
);
