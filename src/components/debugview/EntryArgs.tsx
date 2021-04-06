import React, { useEffect, useState } from 'react';

import { SyntaxHighlighter } from '~/syntaxHighlighter';

export const EntryArgs = ({ entryArgs }) => {
  return (
    <div>
      <h2>Request next entry arguments</h2>
      <p>Sends a JSON-RPC call to p2panda node</p>
      <SyntaxHighlighter>
        {`const entryArgs = await getNextEntryArgs(publicKey, schema);
// => { entryHashBacklink: ${entryArgs.entryHashBacklink}, \n// entryHashSkiplink: ${entryArgs.entryHashSkiplink}, \n// lastSeqNum: ${entryArgs.lastSeqNum}, \n// logId: ${entryArgs.logId} }`}
      </SyntaxHighlighter>
    </div>
  );
};
