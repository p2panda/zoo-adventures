import {
  KeyPair,
  OperationFields,
  encodeOperation,
  initWebAssembly,
  signAndEncodeEntry,
} from 'p2panda-js';
import { GraphQLClient, gql } from 'graphql-request';

// This fixes getting an ECONNREFUSED when making a request against localhost
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const PRIVATE_KEY =
  '1f9e81007da0c007314a151be11be392de4cdc76888fbc5a8c62aa03c6730c6a';
const ENDPOINT = 'http://localhost:2020/graphql';
const GAME_SIZE = 4 * 4;

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

const GQL_PUBLISH = gql`
  mutation Publish($entry: String!, $operation: String!) {
    publish(entry: $entry, operation: $operation) {
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

async function nextArgs(publicKey, viewId) {
  const result = await client.request(GQL_NEXT_ARGS, {
    publicKey,
    viewId,
  });

  return result.nextArgs;
}

async function publish(entry, operation) {
  const result = await client.request(GQL_PUBLISH, {
    entry,
    operation,
  });

  return result.publish;
}

async function createFields(keyPair, size = GAME_SIZE) {
  const fields = [];

  for (let i = 0; i < size; i += 1) {
    const args = await nextArgs(keyPair.publicKey());

    const payload = encodeOperation({
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
        payload,
      },
      keyPair,
    );

    const { backlink } = await publish(entry, payload);
    fields.push(backlink);
  }

  return fields;
}

async function createSchema(keyPair, fields) {
  const args = await nextArgs(keyPair.publicKey());
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

  const payload = encodeOperation({
    action: 'create',
    schemaId: 'schema_definition_v1',
    fields: operationFields,
  });

  const entry = signAndEncodeEntry(
    {
      ...args,
      payload,
    },
    keyPair,
  );

  const { backlink } = await publish(entry, payload);
  return `${name}_${backlink}`;
}

async function createBoard(keyPair, schemaId, size = GAME_SIZE) {
  const args = await nextArgs(keyPair.publicKey());

  const fields = new Array(size).fill().reduce((acc, _, index) => {
    acc[`game_field_${index + 1}`] = '';
    return acc;
  }, {});

  const payload = encodeOperation({
    action: 'create',
    schemaId,
    fields,
  });

  const entry = signAndEncodeEntry(
    {
      ...args,
      payload,
    },
    keyPair,
  );

  const { backlink } = await publish(entry, payload);
  return backlink;
}

async function register() {
  await initWebAssembly();

  // Initialise key pair
  const keyPair = new KeyPair(PRIVATE_KEY);

  // Create the schema
  const fields = await createFields(keyPair);
  const schemaId = await createSchema(keyPair, fields);

  // Wait a little bit for node to register schema before we continue with
  // creating the first game board
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create the game board which will be used by all players
  const documentId = await createBoard(keyPair, schemaId);

  console.log(`Schema ID: ${schemaId}\nDocument ID: ${documentId}`);
}

register();
