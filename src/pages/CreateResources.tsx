import React from 'react';
import { Link } from 'react-router-dom';

export default function CreateResources () {
  return (
    <div>
      <h1>p2paradies, p2panda, p2parachute: jajaja</h1>
      <p>create a resource, yeah</p>
      <form>
        <div>
          <p>
            <label>Resource:</label>
            <input type='text' name='restitle' />
          </p>
          <p>
            <label>Description (optional):</label>
            <textarea
              name='description'
              placeholder='what is it that you can provide, share, contribute?'
            />
          </p>
          <input type='submit' value='Submit' />
        </div>
      </form>
      <p>
        <Link to='/'>back to landing page</Link>
      </p>
    </div>
  );
}
