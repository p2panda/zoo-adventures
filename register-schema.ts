// SPDX-License-Identifier: MIT

import fs from 'fs';

import yargs from 'yargs';
import { GraphQLClient, gql } from 'graphql-request';
import {
  KeyPair,
  OperationFields,
  encodeOperation,
  signAndEncodeEntry,
} from 'p2panda-js';
import { hideBin } from 'yargs/helpers';

// This fixes getting an ECONNREFUSED when making a request against localhost
import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');

type NextArgs = {
  logId: string;
  seqNum: string;
  backlink?: string;
  skiplink?: string;
};

async function nextArgs(
  client: GraphQLClient,
  publicKey: string,
  viewId?: string,
): Promise<NextArgs> {
  const query = gql`
    query NextArgs($publicKey: String!, $viewId: String) {
      nextArgs(publicKey: $publicKey, viewId: $viewId) {
        logId
        seqNum
        backlink
        skiplink
      }
    }
  `;

  const result = await client.request(query, {
    publicKey,
    viewId,
  });

  return result.nextArgs;
}

async function publish(
  client: GraphQLClient,
  entry: string,
  operation: string,
): Promise<NextArgs> {
  const query = gql`
    mutation Publish($entry: String!, $operation: String!) {
      publish(entry: $entry, operation: $operation) {
        logId
        seqNum
        backlink
        skiplink
      }
    }
  `;

  const result = await client.request(query, {
    entry,
    operation,
  });

  return result.publish;
}

async function createFields(
  client: GraphQLClient,
  keyPair: KeyPair,
  boardSize: number,
): Promise<string[]> {
  const fields: string[] = [];

  for (let i = 0; i < boardSize * boardSize; i += 1) {
    const args = await nextArgs(client, keyPair.publicKey());

    const operation = encodeOperation({
      action: 'create',
      schemaId: 'schema_field_definition_v1',
      fields: {
        name: `game_field_${i + 1}`,
        type: 'str',
      },
    });

    const entry = signAndEncodeEntry(
      {
        ...args,
        operation,
      },
      keyPair,
    );

    const { backlink } = await publish(client, entry, operation);
    console.log(`Created schema field ${backlink}`);
    fields.push(backlink);
  }

  return fields;
}

async function createSchema(
  client: GraphQLClient,
  keyPair: KeyPair,
  fields: string[],
): Promise<string> {
  const args = await nextArgs(client, keyPair.publicKey());
  const name = 'zoo_adventures';

  const operationFields = new OperationFields({
    name,
    description: 'Hang out with the other animals in the zoo',
  });

  operationFields.insert(
    'fields',
    'pinned_relation_list',
    fields.map((operationId) => {
      return [operationId];
    }),
  );

  const operation = encodeOperation({
    action: 'create',
    schemaId: 'schema_definition_v1',
    fields: operationFields,
  });

  const entry = signAndEncodeEntry(
    {
      ...args,
      operation,
    },
    keyPair,
  );

  const { backlink } = await publish(client, entry, operation);
  console.log(`Created schema ${name}_${backlink}`);
  return `${name}_${backlink}`;
}

async function createBoard(
  client: GraphQLClient,
  keyPair: KeyPair,
  schemaId: string,
  boardSize: number,
): Promise<string> {
  const args = await nextArgs(client, keyPair.publicKey());

  const fields = new Array(boardSize * boardSize)
    .fill(0)
    .reduce((acc, _, index) => {
      acc[`game_field_${index + 1}`] = '';
      return acc;
    }, {});

  const operation = encodeOperation({
    action: 'create',
    schemaId,
    fields,
  });

  const entry = signAndEncodeEntry(
    {
      ...args,
      operation,
    },
    keyPair,
  );

  const { backlink } = await publish(client, entry, operation);
  console.log(`Created board document ${backlink}`);
  return backlink;
}

function loadKeyPair(path: string) {
  if (!path) {
    const privateKey =
      '1f9e81007da0c007314a151be11be392de4cdc76888fbc5a8c62aa03c6730c6a';
    return new KeyPair(privateKey);
  }

  try {
    const privateKey = fs.readFileSync(path, 'utf8').replace('\n', '');
    return new KeyPair(privateKey);
  } catch (error) {
    throw new Error(`Could not load private key from ${path}`);
  }
}

async function run(keyPair: KeyPair, boardSize: number, endpoint: string) {
  console.log('Create and deploy new "zoo_adventures" schema');

  const client = new GraphQLClient(endpoint);

  // Create the schema
  const fields = await createFields(client, keyPair, boardSize);
  const schemaId = await createSchema(client, keyPair, fields);

  // Wait a little bit for node to register schema before we continue with
  // creating the first game board
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create the game board which will be used by all players
  const documentId = await createBoard(client, keyPair, schemaId, boardSize);

  console.log(`\nSchema ID: ${schemaId}\nDocument ID: ${documentId}`);
}

const { argv } = yargs(hideBin(process.argv))
  .usage('Usage: --privateKey [path] --boardSize [num] --endpoint [url]')
  .option('privateKey', {
    alias: 'k',
    describe: 'Path to file holding private key',
    type: 'string',
  })
  .option('boardSize', {
    alias: 's',
    describe: 'Size of the game board, use 4 for "4x4" for example',
    type: 'number',
    default: 4,
  })
  .option('endpoint', {
    alias: 'e',
    describe: 'Endpoint of p2panda node',
    type: 'string',
    default: 'http://localhost:2020/graphql',
  });

type Args = {
  boardSize: number;
  privateKey: string | undefined;
  endpoint: string;
};

const { boardSize, privateKey, endpoint } = argv as unknown as Args;
const keyPair = loadKeyPair(privateKey);

run(keyPair, boardSize, endpoint);
