import React, { useEffect } from 'react';
import { Entry, Session } from '~/p2panda-api';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

type Props = {
  keyPair: any;
  session: Session;
  currentMessage: string;
  entries: Entry[];
  debugEntry: Entry | null;
};

// This is all just to format the entry object nicely so it can be displayed correctly
// There must be a better way.... I'm sure I am missing something simple ;-p

const textToString = ({ Text }) => {
  return `{ Text: '${Text}' }`;
};

const fieldsToString = ({ text }) => {
  return `{
          text: ${textToString(text)},
        }`;
};

const messageToString = ({ action, fields, schema, version }) => {
  return `{
      action: '${action}',
      fields:
        ${fieldsToString(fields)},
      schema: '${schema}',
      version: ${version},
    }`;
};

const entryToString = ({
  entryHashBacklink,
  entryHashSkiplink,
  logId,
  message,
}) => {
  const skiplink = entryHashSkiplink ? `'${entryHashSkiplink}'` : `null`;
  return `{
  entryHashBacklink: '${entryHashBacklink}',
  entryHashSkiplink: ${skiplink},
  logId: ${logId},
  message:
    ${messageToString(message)},
}`;
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
            <SyntaxHighlighter>{`${entryToString(
              debugEntry.decoded,
            )}`}</SyntaxHighlighter>
          </>
        )}
      </div>
    </div>
  );
};
