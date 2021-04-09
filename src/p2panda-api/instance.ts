import { Resolved } from '~/typescript/helpers';
import { Entry, Session } from '.';

type InstanceArgs = {
  // @ts-expect requires types exported from rust
  keyPair: Resolved<Session['p2panda']['KeyPair']>;
  schema: string;
  session: Session;
};

type Fields = {
  // currently only a schema with only a message is supported
  // [fieldname: string]: boolean | number | string;
  message: string;
};

// this is just an empty object now, but it will contain search params once we
// have an api for that
type SearchParams = Record<string, null>;

export default class Instance {
  static entryArgs = null;

  static async create(
    fields: Fields,
    { keyPair, schema, session }: InstanceArgs,
  ): Promise<void> {
    await session._init();

    const {
      MessageFields,
      encodeCreateMessage,
      signEncodeEntry,
      KeyPair,
    } = session.p2panda;

    // Hard coded field type for now
    const FIELD_TYPE = 'text';

    if (!this.entryArgs) {
      // Fetch next entry args from aquadoggo if they don't already exist
      // This only happens on the first call to aquadoggo
      this.entryArgs = await session.getNextEntryArgs(
        keyPair.publicKey(),
        schema,
      );
    }

    // Create message
    const messageFields = new MessageFields();
    messageFields.add(FIELD_TYPE, fields.message);

    // Encode message
    const encodedMessage = encodeCreateMessage(schema, messageFields);

    // If lastSeqNum is null don't try and convert to BigInt
    // Can this be handled better in the wasm code?
    const lastSeqNum = this.entryArgs.lastSeqNum
      ? BigInt(this.entryArgs.lastSeqNum)
      : this.entryArgs.lastSeqNum;

    // Sign and encode entry passing in copy of keyPair
    const { entryEncoded, entryHash } = signEncodeEntry(
      KeyPair.fromPrivateKey(keyPair.privateKey()),
      encodedMessage,
      this.entryArgs.entryHashSkiplink,
      this.entryArgs.entryHashBacklink,
      lastSeqNum,
      BigInt(this.entryArgs.logId),
    );

    // Publish entry and store returned entryArgs for next entry
    this.entryArgs = await session.publishEntry(entryEncoded, encodedMessage);
  }

  static async query(
    _searchParams: SearchParams,
    { session, schema }: Pick<InstanceArgs, 'session' | 'schema'>,
  ): Promise<Entry[]> {
    await session._init();
    const entries = await session.queryEntries(schema);
    return Promise.all(
      entries.map(
        async ({
          author,
          entryBytes,
          entryHash,
          logId,
          payloadBytes,
          seqNum,
        }) => ({
          author,
          decoded: await session.p2panda.decodeEntry(entryBytes, payloadBytes),
          encoded: entryBytes,
          messageEncoded: payloadBytes,
          hash: entryHash,
          logId,
          seqNum,
        }),
      ),
    );
  }
}
