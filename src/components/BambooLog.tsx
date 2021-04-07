import React from 'react';
import { Entry } from '~/p2panda-api';

type Props = {
  log: Entry[];
};

export const BambooLog = ({ log }: Props): JSX.Element => (
  <div className="bamboo-log flex-column">
    <h2>Entry Log</h2>{' '}
    <div className="bamboo-log flex-row">
      {log.reverse().map((entry) => (
        <div key={entry.entry_hash} className="log-entry">
          <div className="entry-data">
            <div>1</div>
            <div>{entry.entry_hash.slice(0, 8)}</div>
          </div>
          <div className="green-box">
            <div className="orange-box entry-message">
              <ul>
                <li>Create</li>
                <ul>
                  <li>Schema: Post</li>
                  <li>Id: #7G3H</li>
                  <li>Message: "hello"</li>
                </ul>
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
