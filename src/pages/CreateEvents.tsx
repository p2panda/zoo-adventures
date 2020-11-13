import React from 'react';
import { Link } from 'react-router-dom';

const date = new Date(Date.now()).toISOString().slice(0, 10);

export default function CreateEvents () {
  return (
    <div>
      <h1>p2paradies, p2panda, p2parachute: hallo was geht!</h1>
      <p>create an event ^^</p>
      <form>
        <div>
          <p>
            <label>Eventtitle:</label>
            <input type='text' name='eventtitle' />
          </p>
          <p>
            <label>Description (optional):</label>
            <textarea name='description' placeholder="what's the plan?" />
          </p>
          <p>
            <label>start on:</label>
            <input type='date' name='event-start' value={date} />
          </p>
          <p>
            <label>end on:</label>
            <input type='date' name='event-end' value={date} />
          </p>
          <input type='submit' value='Submit' />
        </div>
      </form>
      <p>
        <Link to='/eventdetail' test={{ hello: 42 }}>back to landing page</Link>
      </p>
    </div>
  );
}
