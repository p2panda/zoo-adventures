import React, { useEffect } from 'react';

import { ENDPOINT, CHAT_SCHEMA } from '~/configs';
import { Session } from '~/p2panda-api';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

import type { EntryRecord } from '~/p2panda-api/types';

type Props = {
  keyPair: Session['p2panda']['KeyPair'];
  session: Session;
  currentMessage: string;
  entries: EntryRecord[];
  debugEntry: EntryRecord | null;
};

export const Instructions = ({
  keyPair,
  session,
  currentMessage,
  entries,
  debugEntry,
}: Props): JSX.Element => {
  const publicKey = keyPair ? keyPair.publicKey() : null;
  const privateKey = keyPair ? keyPair.privateKey() : null;

  // Scroll to debug entry anchor when it changes
  useEffect(() => {
    location.hash = '#debugEntry';
    setTimeout(() => {
      location.hash = '';
    }, 50);
  }, [debugEntry]);

  return (
    <div className="debug-view flex-column">
      <h1>p2🐼</h1>
      <p>How to publish messages using p2panda:</p>

      <div>
        <h2>Make a key pair</h2>
        <SyntaxHighlighter>
          {`const { KeyPair } = await p2panda;
const keyPair = new KeyPair();
const publicKey = keyPair.publicKey();
// => ${publicKey}
const privateKey = keyPair.privateKey();
// => ${privateKey}`}
        </SyntaxHighlighter>
      </div>

      <div>
        <h2>Connect to a node</h2>
        <p>Running on your own computer or in the cloud.</p>
        <SyntaxHighlighter>
          {`const endpoint = '${ENDPOINT}';
const session = new Session(ENDPOINT);
${session ? `// => ${session}` : ''}`}
        </SyntaxHighlighter>
      </div>

      <div>
        <h2>Choose a schema</h2>
        <p>...or publish your own.</p>
        <SyntaxHighlighter>
          {`const CHAT_SCHEMA = '${CHAT_SCHEMA.slice(0, 12)}...';`}
        </SyntaxHighlighter>
      </div>

      <div>
        <h2>Publish Entry</h2>
        <p>Make sure to include all fields specified by the chosen schema.</p>
        <SyntaxHighlighter>{`const fields = {
  message: '${currentMessage}'
};
const entry = await Instance.create(
  fields,
  { schema: CHAT_SCHEMA, session, keyPair },
);`}</SyntaxHighlighter>
      </div>

      <div>
        <h2>Query entries</h2>
        <p>
          <span
            role="img"
            aria-label="pointy finger"
            style={{ marginRight: '5px' }}
          >
            👉
          </span>
          Click a chat message on the right to display its debug representation
          below.
        </p>
        <SyntaxHighlighter>
          {`const entries = await Instance.query({}, {
  schema: CHAT_SCHEMA,
  session
});
// entries.length => ${entries.length}`}
        </SyntaxHighlighter>
        {debugEntry && (
          <>
            <p id="debugEntry">
              This is the entry for the message you clicked:{' '}
            </p>
            <SyntaxHighlighter>{`${JSON.stringify(
              debugEntry.decoded,
              null,
              2,
            )}`}</SyntaxHighlighter>
          </>
        )}
      </div>
    </div>
  );
};
