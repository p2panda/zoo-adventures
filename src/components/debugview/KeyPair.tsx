import React from 'react';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

export const KeyPair = ({ privateKey, publicKey }) => {
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
