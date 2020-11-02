import React from 'react';
import { Link } from 'react-router-dom';

export default function ResDetails () {
  return (
    <div>
      <h3>time</h3>
      <p>you may request more time from me :)</p>
      <p>request / assign to event</p>
      <p>
        <Link to='/'>back to eventslisting</Link>
      </p>
    </div>
  );
}
