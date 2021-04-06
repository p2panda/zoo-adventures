import React from 'react';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

type Props = any;

export const Entry = ({ encodedEntry, encodedMessage }: Props): JSX.Element => {
  return (
    <div>
      <span className="break-line">
        <SyntaxHighlighter>
          {`{ encodedEntry: ${encodedEntry}, \nencodedMessage: ${encodedMessage}}`}
        </SyntaxHighlighter>
      </span>
    </div>
  );
};
