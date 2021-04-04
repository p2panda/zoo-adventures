/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/prop-types */
// import '../../static/styles/app.css';

import React, { useState, useEffect } from 'react';
import p2panda from 'p2panda-js';

// Dummy API calls

const getEntryArgs = async (author, entry) => {
  return {
    entryHashBacklink:
      '0040485ff3de6b39bf43eca318e220d7e6ffbf903b0277a53feb0940c523afcd05d144353f14db8bed63d1c442945e008992e049d959a2e0d8f34ccb6fa02fddc5c7',
    entryHashSkiplink:
      '0040533d218ac2c654a22ddb3c90c7e4f4c9fcc850bdaf64efbd86290947de9f3d0b1c2189351bc28cdc7094dd0c54083c0fb652386f4149e195854ec47807882e73',
    lastSeqNum: 12,
    logId: 1,
  };
};

const KeyPair = (props) => {
  return (
    <div>
      <h2>Key pair</h2>
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
  const [newMessageHash, setNewMessageHash] = useState<string>();
  const [newEntryHash, setNewEntryHash] = useState<string>();

  const handleSubmit = (event) => {
    setEntryMessage(draftMessage);
    event.preventDefault();
  };

  const handleChange = (event) => {
    setDraftMessage(event.target.value);
  };

  useEffect(() => {
    const asyncEffect = async () => {
      const args = await getEntryArgs(props.publicKey, null);
      setBacklinkHash(args.entryHashBacklink);
      setSkiplinkHash(args.entryHashSkiplink);
      setLastSeqNum(args.lastSeqNum);
      setLogId(args.logId);
    };
    asyncEffect();
  }, []);

  useEffect(() => {
    const asyncEffect = async () => {
      const { signEncode } = await p2panda;

      // Create signed & encoded entry
      const entry = await signEncode(
        props.privateKey,
        entryMessage,
        skiplinkHash,
        backlinkHash,
        lastSeqNum + 1,
      );
      console.log(entry);
      setNewEntryHash(entry.encoded_entry);
      setNewMessageHash(entry.encoded_message);
    };
    asyncEffect();
  }, [entryMessage]);

  useEffect(() => {
    props.onNewEntry(newEntryHash, newMessageHash);
  }, [newMessageHash, newEntryHash]);

  return (
    <div>
      <h2>Entry Arguments</h2>
      <p>
        entryHashBacklink:{' '}
        {backlinkHash ? backlinkHash : 'Fetching entry backlink hash'}
      </p>
      <p>
        entryHashSkiplink:{' '}
        {skiplinkHash ? skiplinkHash : 'Fetching entry skipling hash'}
      </p>
      <p>
        lastSeqNum:{' '}
        {lastSeqNum
          ? lastSeqNum
          : 'Fetching last sequence number of bamboo log'}
      </p>
      <p>logId: {logId ? logId : 'Fetching bamboo log ID'}</p>
      <h2>Publish Entry</h2>
      <form onSubmit={handleSubmit}>
        {' '}
        <label>
          Name:
          <input type="text" onChange={handleChange} />{' '}
        </label>
        <input type="submit" value="Submit" />
      </form>{' '}
    </div>
  );
};

const NewEntry = (props) => {
  return (
    <div>
      <h2>New Entry</h2>
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

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.onNewEntry = this.onNewEntry.bind(this);
    this.state = {
      publicKey: '',
      privateKey: '',
      newEntryHash: '',
      newMessageHash: '',
    };
  }

  async componentDidMount() {
    const { KeyPair } = await p2panda;
    const keyPair = new KeyPair();
    this.setState({
      publicKey: keyPair.publicKey(),
      privateKey: keyPair.privateKey(),
    });
  }

  onNewEntry(newEntryHash, newMessageHash) {
    this.setState({ newEntryHash, newMessageHash });
  }

  render() {
    return (
      <section>
        <KeyPair
          privateKey={this.state.privateKey}
          publicKey={this.state.publicKey}
        />
        <PublishEntry
          privateKey={this.state.privateKey}
          publicKey={this.state.publicKey}
          onNewEntry={this.onNewEntry}
        />
        <NewEntry
          entryHash={this.state.newEntryHash}
          messageHash={this.state.newMessageHash}
        />
      </section>
    );
  }
}

export default Home;
