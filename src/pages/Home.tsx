import React from 'react';
import { Link } from 'react-router-dom';

const Home = (): JSX.Element => {
  return (
    <section>
      <h1>p2paradies, p2panda, p2parachute</h1>
      <h2>Hallo, hier ist alles schön :)</h2>
      <p>this is the landing page</p>
      <p>
        <Link to="/createevents">Create an Event</Link>
      </p>
      <p>
        <Link to="/createres">Create a Resource</Link>
      </p>
      <p>List of created events:</p>
      <ul>
        <li>
          <Link to="/eventdetails">pandaparty</Link>
        </li>
        <li>gaming night</li>
        <li>salsa tasting</li>
      </ul>
      <p>List of resources:</p>
      <ul>
        <li>
          <Link to="/resdetails">time</Link>
        </li>
        <li>donuts and cinnamon rolls</li>
        <li>well equiped kitchen</li>
        <li>...</li>
      </ul>
    </section>
  );
};

export default Home;
