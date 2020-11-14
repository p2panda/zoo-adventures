import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function toHexString (byteArray: Uint8Array): string {
  return Array.from(byteArray, (byte: number) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

const LogWindow = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // @ts-ignore
    import('sesamoid').then(({ KeyPair, setWasmPanicHook }) => {
      // Set panic hooks for better logging of wasm errors. See:
      // https://github.com/rustwasm/console_error_panic_hook
      setWasmPanicHook();

      const keyPair = new KeyPair();
      setMessage(`Sesamoid says: ${toHexString(keyPair.publicKeyBytes())} and ${toHexString(keyPair.privateKeyBytes())}`);
    });
  }, []);

  return message ? <p>{message}</p> : null;
};

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
      <LogWindow />
    </section>
  );
};

export default Home;
