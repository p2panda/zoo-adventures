// SPDX-License-Identifier: MIT

import fs from 'fs';

import yargs from 'yargs';
import { KeyPair, OperationFields, Session } from 'shirokuma';
import { hideBin } from 'yargs/helpers';

// This fixes getting an ECONNREFUSED when making a request against localhost
import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');

async function createFields(
  session: Session,
  boardSize: number,
): Promise<string[]> {
  const fields: string[] = [];

  for (let i = 0; i < boardSize * boardSize; i += 1) {
    const documentViewId = await session.create(
      {
        name: `game_field_${i + 1}`,
        type: 'str',
      },
      {
        schemaId: 'schema_field_definition_v1',
      },
    );

    console.log(`Created schema field ${documentViewId}`);
    fields.push(documentViewId as string);
  }

  return fields;
}

async function createSchema(
  session: Session,
  fields: string[],
): Promise<string> {
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

  const documentViewId = await session.create(operationFields, {
    schemaId: 'schema_definition_v1',
  });

  console.log(`Created schema ${name}_${documentViewId}`);
  return `${name}_${documentViewId}`;
}

async function createBoard(
  session: Session,
  schemaId: string,
  boardSize: number,
): Promise<string> {
  const fields = new Array(boardSize * boardSize)
    .fill(0)
    .reduce((acc, _, index) => {
      acc[`game_field_${index + 1}`] = '';
      return acc;
    }, {});

  const documentViewId = await session.create(fields, {
    schemaId,
  });

  console.log(`Created board document ${documentViewId}`);
  return documentViewId as string;
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

  const session = new Session(endpoint).setKeyPair(keyPair);

  // Create the schema
  const fields = await createFields(session, boardSize);
  const schemaId = await createSchema(session, fields);

  // Wait a little bit for node to register schema before we continue with
  // creating the first game board
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create the game board which will be used by all players
  const documentId = await createBoard(session, schemaId, boardSize);

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
const keyPair = loadKeyPair(privateKey as string);

run(keyPair, boardSize, endpoint);
