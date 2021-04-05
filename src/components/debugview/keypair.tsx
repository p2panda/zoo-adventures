import React from 'react';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

const keyPairSnippet = `const { KeyPair } = await p2panda;
const keyPair = new KeyPair();
const publicKey = keyPair.publicKey();
const privateKey = keyPair.privateKey();`;

export const KeyPair = ({ privateKey, publicKey }) => {
  return (
    <div>
      <h2>Key pair</h2>
      <SyntaxHighlighter>{keyPairSnippet}</SyntaxHighlighter>
      <SyntaxHighlighter>
        {`{ privateKey: ${privateKey}, \npublicKey: ${publicKey} }`}
      </SyntaxHighlighter>
    </div>
  );
};
