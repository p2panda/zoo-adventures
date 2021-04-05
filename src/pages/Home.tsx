/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/prop-types */
import '../../static/styles/main.css';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import React, { useState, useEffect } from 'react';
import p2panda from 'p2panda-js';

// Code snippets
const keyPairSnippet = `const { KeyPair } = await p2panda;
const keyPair = new KeyPair();
const publicKey = keyPair.publicKey();
const privateKey = keyPair.privateKey();`;
const getEntryArgsSnippet = `// JSON-RPC call to server node
const entryArgs = await getFirstEntryArgs(publicKey, schema);`;
const signEncodeSnippet = `const { signEncode } = await p2panda;
const message = 'Hello Panda!'
const {encodedEntryHash, encodedMessageHash} = await signEncode(
  publicKey,
  message,
  entryArgs.skiplinkHash,
  entryArgs.backlinkHash,
  entryArgs.lastSeqNum,
);`;
const decodeEntrySnippet = `const { decodeEntry } = await p2panda;
const decodedEntry = decodeEntry(encodedEntryHash, encodedMessageHash);`;

// Dummy API calls

const getFirstEntryArgs = async (author, entry) => {
  return {
    entryHashBacklink: null,
    entryHashSkiplink: null,
    lastSeqNum: null,
    logId: 1,
  };
};

const KeyPair = (props) => {
  return (
    <div>
      <h2>Key pair</h2>
      <SyntaxHighlighter language="javascript" style={vs2015}>
        {keyPairSnippet}
      </SyntaxHighlighter>
      <p>
        private key:{' '}
        {props.privateKey ? props.privateKey : 'Generating key pair...'}
      </p>
      <p>
        public key:{' '}
        {props.publicKey ? props.publicKey : 'Generating key pair...'}
      </p>
    </div>
  );
};

const PublishEntry = (props) => {
  const [backlinkHash, setBacklinkHash] = useState<string>();
  const [skiplinkHash, setSkiplinkHash] = useState<string>();
  const [lastSeqNum, setLastSeqNum] = useState<number>();
  const [logId, setLogId] = useState<number>();
  const [draftMessage, setDraftMessage] = useState<string>();
  const [entryMessage, setEntryMessage] = useState<string>();
  const [newEntryHashes, setNewEntryHashes] = useState({
    entry: null,
    message: null,
  });

  // Set entry message on form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    setEntryMessage(draftMessage);
  };

  // Set draft entry message on input change
  const handleChange = (event) => {
    setDraftMessage(event.target.value);
  };

  // Get next entryArgs when newEntryHash changes
  // This needs to be hooked up to aquadoggo getEntryArgs API call
  useEffect(() => {
    const asyncEffect = async () => {
      const args = await getFirstEntryArgs(props.publicKey, null);
      setBacklinkHash(args.entryHashBacklink);
      setSkiplinkHash(args.entryHashSkiplink);
      setLastSeqNum(args.lastSeqNum);
      setLogId(args.logId);
    };
    asyncEffect();
  }, [newEntryHashes]);

  // When entryMessage is set encode new entry
  useEffect(() => {
    if (!entryMessage) {
      return;
    }
    const asyncEffect = async () => {
      const { signEncode } = await p2panda;
      // Create signed & encoded entry
      const entry = await signEncode(
        props.publicKey,
        entryMessage,
        skiplinkHash,
        backlinkHash,
        null,
      );
      setNewEntryHashes({
        entry: entry.encoded_entry,
        message: entry.encoded_message,
      });
    };
    asyncEffect();
  }, [entryMessage]);

  // When new entry is encoded call method passed from parent
  useEffect(() => {
    if (newEntryHashes.entry) {
      props.onNewEntry(newEntryHashes);
    }
  }, [newEntryHashes]);

  return (
    <div>
      <h2>Entry Arguments</h2>
      <SyntaxHighlighter language="javascript" style={vs2015}>
        {getEntryArgsSnippet}
      </SyntaxHighlighter>
      <p>
        entryHashBacklink:{' '}
        {backlinkHash ? backlinkHash : 'Not present on first entry'}
      </p>
      <p>
        entryHashSkiplink:{' '}
        {skiplinkHash ? skiplinkHash : 'Not present on first entry'}
      </p>
      <p>
        lastSeqNum: {lastSeqNum ? lastSeqNum : 'Not present on first entry'}
      </p>
      <p>logId: {logId ? logId : 'Fetching bamboo log ID'}</p>
      <h2>Publish Entry</h2>
      <SyntaxHighlighter language="javascript" style={vs2015}>
        {signEncodeSnippet}
      </SyntaxHighlighter>
      <form onSubmit={handleSubmit}>
        <label>
          Message: <input type="text" onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

const Entry = (props) => {
  return (
    <div>
      <p>
        Entry hash: {props.entryHash ? props.entryHash : 'No entries created.'}
      </p>
      <p>
        Message hash:{' '}
        {props.messageHash ? props.messageHash : 'No entries created.'}
      </p>
    </div>
  );
};

const DecodedEntry = (props) => {
  return (
    <div>
      <h2>Decoded Entry</h2>
      <SyntaxHighlighter language="javascript" style={vs2015}>
        {decodeEntrySnippet}
      </SyntaxHighlighter>
      <pre>
        {props.decodedEntry ? props.decodedEntry : 'No entries to decode.'}
      </pre>
    </div>
  );
};

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.onNewEntry = this.onNewEntry.bind(this);
    this.state = {
      publicKey: null,
      privateKey: null,
      newEntryHash: null,
      newMessageHash: null,
      decodedEntry: null,
    };
  }

  // Create keypair when component is mounted
  async componentDidMount() {
    const { KeyPair } = await p2panda;
    const keyPair = new KeyPair();
    this.setState({
      publicKey: keyPair.publicKey(),
      privateKey: keyPair.privateKey(),
    });
  }

  // Set entry and message hashes and decoded data
  async onNewEntry(newEntryHashes) {
    const { decodeEntry } = await p2panda;
    const { entry, message } = newEntryHashes;
    const decodedEntry = decodeEntry(entry, message);
    this.setState({
      newEntryHash: entry,
      newMessageHash: message,
      decodedEntry,
    });
  }

  render() {
    return (
      <section>
        <div className="home-wrapper">
          <div className="panel-one">
            <KeyPair
              privateKey={this.state.privateKey}
              publicKey={this.state.publicKey}
            />
            <PublishEntry
              privateKey={this.state.privateKey}
              publicKey={this.state.publicKey}
              onNewEntry={this.onNewEntry}
            />
            <Entry
              entryHash={this.state.newEntryHash}
              messageHash={this.state.newMessageHash}
            />
            <DecodedEntry decodedEntry={this.state.decodedEntry} />
          </div>
          <div className="panel-two"></div>
        </div>
      </section>
    );
  }
}

export default Home;
