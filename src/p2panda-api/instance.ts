import { Resolved } from '~/typescript/helpers';

import { Session } from '.';

type InstanceArgs = {
  // @ts-expect requires types exported from rust
  keyPair: Resolved<Session['p2panda']['KeyPair']>;
  schema: string;
  session: Session;
};

const create = async (
  fields: { message: string },
  { keyPair, schema, session }: InstanceArgs,
): Promise<void> => {
  const {
    MessageFields,
    encodeCreateMessage,
    signEncodeEntry,
    KeyPair,
  } = await session.loadWasm();

  // Hard coded field type for now
  const FIELD_TYPE = 'text';

  // Fetch next entry args from aquadoggo if they don't already exist
  // This only happens on the first call to aquadoggo
  const entryArgs = await session.getNextEntryArgs(keyPair.publicKey(), schema);

  // Create message
  const messageFields = new MessageFields();
  messageFields.add(FIELD_TYPE, fields.message);

  // Encode message
  const encodedMessage = encodeCreateMessage(schema, messageFields);

  // If lastSeqNum is null don't try and convert to BigInt
  // Can this be handled better in the wasm code?
  const lastSeqNum = entryArgs.lastSeqNum
    ? BigInt(entryArgs.lastSeqNum)
    : entryArgs.lastSeqNum;

  // Sign and encode entry passing in copy of keyPair
  const { entryEncoded, entryHash } = signEncodeEntry(
    KeyPair.fromPrivateKey(keyPair.privateKey()),
    encodedMessage,
    entryArgs.entryHashSkiplink,
    entryArgs.entryHashBacklink,
    lastSeqNum,
    BigInt(entryArgs.logId),
  );

  // Publish entry and store returned entryArgs for next entry
  const nextEntryArgs = await session.publishEntry(
    entryEncoded,
    encodedMessage,
  );
  session.setNextEntryArgs(keyPair.publicKey(), schema, nextEntryArgs);
};

export default { create };
