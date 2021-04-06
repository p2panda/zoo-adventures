import React from 'react';
import { Entry, Session } from '~/p2panda-api';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

type Props = {
  keyPair: any;
  session: Session;
  currentMessage: string;
  entries: Entry[];
};

export const DebugView = ({
  keyPair,
  session,
  currentMessage,
  entries,
}: Props): JSX.Element => {
  const publicKey = keyPair ? keyPair.publicKey() : null;
  const privateKey = keyPair ? keyPair.privateKey() : null;
  return (
    <div className="panel-one">
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
          {`const endpoint = 'http://localhost:2020';
const session = new Session({
endpoint: ENDPOINT
});
${session ? `// => ${session}` : ''}`}
        </SyntaxHighlighter>
      </div>

      <div>
        <h2>Choose a schema</h2>
        <p>...or publish your own.</p>
        <SyntaxHighlighter>
          {`const CHAT_SCHEMA = '0040cf94f6d6...';`}
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
        <SyntaxHighlighter>
          {`const entries = await Instance.query({}, {
  schema: CHAT_SCHEMA,
  session
});
// entries.length => ${entries.length}`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
