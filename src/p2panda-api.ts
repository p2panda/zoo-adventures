import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js';
import p2panda from 'p2panda-js';
import debug from 'debug';

const log = debug('p2panda');

type SessionProps = {
  keyPair: string;
  endpoint: string;
};

export type Entry = {
  author: string;
  encoded: string;
  messageEncoded: string;
  hash: string;
  logId: number;
  seqNum: number;
  decoded: any;
};

type EntryRecord = {
  author: string;
  entry_bytes: string;
  entry_hash: string;
  log_id: number;
  payload_bytes: string;
  payload_hash: string;
  seq_num: number;
};

type EntryArgs = {
  entryHashSkiplink: string | null;
  entryHashBacklink: string | null;
  lastSeqNum: number | null;
  logId: number;
};
export class Session {
  endpoint: string = null;
  private client = null;
  log = [];

  constructor({ endpoint }: SessionProps) {
    this.endpoint = endpoint;
    const transport = new HTTPTransport(endpoint);
    this.client = new Client(new RequestManager([transport]));
  }

  async getNextEntryArgs(author: string, schema: string): Promise<EntryArgs> {
    // do rpc call
    const result = await this.client.request({
      method: 'panda_getEntryArguments',
      params: { author, schema },
    });
    log('panda_getEntryArguments', result);
    return result;
  }

  async publishEntry(
    entryEncoded: string,
    messageEncoded: string,
  ): Promise<void> {
    const result = await this.client.request({
      method: 'panda_publishEntry',
      params: { entryEncoded, messageEncoded },
    });
    log('panda_publishEntry');
    return result;
  }

  async queryEntries(schema: string): Promise<EntryRecord[]> {
    const result = await this.client.request({
      method: 'panda_queryEntries',
      params: { schema },
    });
    log('panda_queryEntries', result);
    return result.entries;
  }

  toString(): string {
    return `<Session ${this.endpoint}>`;
  }
}

type InstanceArgs = {
  // @ts-expect requires types exported from rust
  keyPair: any;
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
type SearchParams = {
  schema: string;
};

export class Instance {
  static p2panda = null;
  static entryArgs = null;

  static async _init(): Promise<void> {
    if (this.p2panda != null) return;
    this.p2panda = await p2panda;
  }

  static async create(
    fields: Fields,
    { keyPair, schema, session }: InstanceArgs,
  ): Promise<void> {
    await this._init();

    const {
      MessageFields,
      encodeCreateMessage,
      signEncodeEntry,
      KeyPair,
      decodeEntry,
    } = await this.p2panda;

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
    { schema }: SearchParams,
    { session }: Pick<InstanceArgs, 'session' | 'schema'>,
  ): Promise<Entry[]> {
    await this._init();
    const entries = await session.queryEntries(schema);
    return Promise.all(
      entries.map(
        async ({
          author,
          entry_bytes,
          entry_hash,
          log_id,
          payload_bytes,
          seq_num,
        }) => ({
          author,
          decoded: await this.p2panda.decodeEntry(entry_bytes, payload_bytes),
          encoded: entry_bytes,
          messageEncoded: payload_bytes,
          hash: entry_hash,
          logId: log_id,
          seqNum: seq_num,
        }),
      ),
    );
  }
}
