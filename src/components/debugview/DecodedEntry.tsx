import React from 'react';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

const decodeEntrySnippet = `const { decodeEntry } = await p2panda;
const decodedEntry = decodeEntry(encodedEntryHash, encodedMessageHash);`;

export const DecodedEntry = ({ decodedEntry }) => {
  return (
    <div>
      <h2>Decode Entry</h2>
      <SyntaxHighlighter>{decodeEntrySnippet}</SyntaxHighlighter>
      <span className="break-line">
        <SyntaxHighlighter>
          {`{decodedEntry: ${decodedEntry}}`}
        </SyntaxHighlighter>
      </span>
    </div>
  );
};
