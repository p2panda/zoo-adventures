import React, { useEffect, useState } from 'react';

import { SyntaxHighlighter } from '~/syntaxHighlighter';

export const EntryArgs = ({ entryArgs }) => {
  return (
    <div>
      <h2>Request next entry arguments</h2>
      <p>Sends a JSON-RPC call to p2panda node</p>
      <SyntaxHighlighter>
        {`const entryArgs = await getNextEntryArgs(publicKey, schema);
// => { backlinkEntry: ${entryArgs.backlinkEntry}, \n// skiplinkEntry: ${entryArgs.skiplinkEntry}, \n// lastSeqNum: ${entryArgs.lastSeqNum}, \n// logId: ${entryArgs.logId} }`}
      </SyntaxHighlighter>
    </div>
  );
};
