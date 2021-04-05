import React from 'react';

export const Chatlog = ({ log }) => (
  <div className="panel-two">
    <h2>Entry Log</h2>{' '}
    {log.map((entry) => (
      <div key={entry}>
        <ul>
          <li>ENTRY HASH</li>
          <li>SEQUENCE NUMBER</li>
          <li>MESSAGE</li>
        </ul>
        <pre>{entry}</pre>
      </div>
    ))}
  </div>
);
