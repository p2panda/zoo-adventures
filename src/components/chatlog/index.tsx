import React from 'react';
import { Entry } from '~/p2panda-api';

type Props = {
  log: Entry[];
};
export const Chatlog = ({ log }: Props): JSX.Element => (
  <div className="panel-two">
    <h2>Entry Log</h2>{' '}
    {log.reverse().map((entry) => (
      <div key={entry.entry_hash}>
        <ul>
          <li>Hash: {entry.entry_hash.slice(0, 8)}</li>
          <li>
            <pre>{entry.debugDecoded}</pre>
          </li>
        </ul>
      </div>
    ))}
  </div>
);
