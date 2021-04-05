import React from 'react';
import { SyntaxHighlighter } from '~/syntaxHighlighter';

type Props = any;

export const Entry = ({ entryHash, messageHash }: Props): JSX.Element => {
  return (
    <div>
      <span className="break-line">
        <SyntaxHighlighter>
          {`{ entryHash: ${entryHash}, \nmessageHash: ${messageHash}}`}
        </SyntaxHighlighter>
      </span>
    </div>
  );
};
