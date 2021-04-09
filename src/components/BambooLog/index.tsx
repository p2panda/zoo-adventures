import React from 'react';
import { LogEntry } from './LogEntry';
import { Entry } from '~/p2panda-api';

type Props = {
  log: Entry[];
};

export const BambooLog = ({ log }: Props): JSX.Element => (
  <div className="bamboo-log flex-column">
    <h2>Bamboo Log</h2>{' '}
    <div className="flex-row">
      {log.map((entry) => (
        <div className="log-item" key={entry.hash}>
          <LogEntry entry={entry} />
        </div>
      ))}
    </div>
  </div>
);
