import React from 'react';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

export const KeyPair = ({ keyPair }) => {
  const publicKey = keyPair ? keyPair.publicKey() : null;
  const privateKey = keyPair ? keyPair.privateKey() : null;
  return (
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
  );
};
