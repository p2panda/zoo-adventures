import React, { useEffect, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { initWebAssembly, KeyPair } from 'p2panda-js';

import type { FunctionComponent } from 'react';

const ENDPOINT = 'http://localhost:2020/graphql';
const PRIVATE_KEY_STORE = 'privateKey';

const GQL_NEXT_ARGS = gql`
  query NextArgs($publicKey: String!, $viewId: String) {
    nextArgs(publicKey: $publicKey, viewId: $viewId) {
      logId
      seqNum
      backlink
      skiplink
    }
  }
`;

const client = new GraphQLClient(ENDPOINT, {
  mode: 'cors',
});

async function nextArgs(publicKey: string, viewId?: string) {
  const result = await client.request(GQL_NEXT_ARGS, {
    publicKey,
    viewId,
  });

  return result.data;
}

function initialiseKeyPair(): KeyPair {
  const privateKey = window.localStorage.getItem(PRIVATE_KEY_STORE);
  if (privateKey) {
    return new KeyPair(privateKey);
  }

  const keyPair = new KeyPair();
  window.localStorage.setItem(PRIVATE_KEY_STORE, keyPair.privateKey());
  return keyPair;
}

type GameProps = {
  keyPair: KeyPair;
  config: Configuration;
};

const Game: FunctionComponent<GameProps> = ({ keyPair, config }) => {
  useEffect(() => {
    const init = async () => {
      const test = await nextArgs(keyPair.publicKey(), config.documentId);
      console.log(test);
    };

    init();
  }, []);

  return <p>{keyPair.publicKey()}</p>;
};

export type Configuration = {
  endpoint: string;
  schemaId: string;
  documentId: string;
};

export const ZooAdventures: FunctionComponent<Configuration> = (config) => {
  const [keyPair, setKeyPair] = useState<KeyPair>();

  useEffect(() => {
    const init = async () => {
      await initWebAssembly();
      setKeyPair(initialiseKeyPair());
    };

    init();
  }, []);

  return keyPair ? <Game keyPair={keyPair} config={config} /> : null;
};
