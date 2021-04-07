import React from 'react';
import { Entry } from '~/p2panda-api';

type Props = {
  entry: Entry;
};

export const LogEntry = ({ entry }: Props): JSX.Element => (
  <div className="log-item flex-column">
    <div className="entry-data flex-row">
      <div>1</div>
      <div>{entry.entry_hash.slice(0, 8)}</div>
    </div>
    <div className="entry-content-wrapper flex-row">
      <div className="entry-content flex-column">
        <b>Create</b>
        <ul>
          <li>Schema: Post</li>
          <li>Id: #7G3H</li>
          <li>Message: "hello"</li>
        </ul>
      </div>
    </div>
  </div>
);
