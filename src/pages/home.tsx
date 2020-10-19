import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section>
      <h1>p2paradies, p2panda, p2parachute</h1>
      <h2>Hallo, hier ist alles schön :)</h2>
      <p>this is the landing page</p>
      <p>
        <Link to="/createevents">Create an Event</Link>
      </p>
      <p>
        <Link to="/createres">Create a Ressource</Link>
      </p>
      <p>
        List of created events:
        <ul>
          <li>pandaparty</li>
          <li>gaming night</li>
          <li>salsa tasting</li>
        </ul>
      </p>
    </section>
  );
};

export default Home;
