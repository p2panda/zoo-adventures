import React from 'react';

import { LogEntry } from '~/components/BambooLog/LogEntry';

import type { EntryRecord } from 'p2panda-js';

type Props = {
  log: EntryRecord[];
  setDebugEntry: (entry: EntryRecord) => void;
};

export const BambooLog = ({ log, setDebugEntry }: Props): JSX.Element => (
  <div className="bamboo-log flex-column">
    <h2>Bamboo Log</h2>{' '}
    <div className="flex-row">
      {log.map((entry) => (
        <div
          className="log-item"
          key={entry._meta.id}
          onClick={() => setDebugEntry(entry)}
        >
          <LogEntry entry={entry} />
        </div>
      ))}
    </div>
  </div>
);
