import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js';
import p2panda from 'p2panda-js';
import debug from 'debug';

const log = debug('p2panda');

type SessionProps = {
  keyPair: string;
  endpoint: string;
};

export type Entry = {
  encoded_entry: string;
  encoded_message: string;
  entry_hash: string;
  debugDecoded?: any;
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
    await this.client.request({
      method: 'panda_publishEntry',
      params: { entryEncoded, messageEncoded },
    });
    log('panda_publishEntry');
  }

  async queryEntries(): Promise<Entry[]> {
    return this.log;
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
type SearchParams = Record<string, unknown>;

export class Instance {
  static p2panda = null;

  static async _init(): Promise<void> {
    if (this.p2panda != null) return;
    this.p2panda = await p2panda;
  }

  static async create(
    fields: Fields,
    { keyPair, schema, session }: InstanceArgs,
  ): Promise<Entry> {
    await this._init();

    const {
      MessageFields,
      encodeCreateMessage,
      signEntry,
      KeyPair,
    } = await this.p2panda;

    // Hard coded field type for now
    const FIELD_TYPE = 'text';

    // Create message
    const messageFields = new MessageFields();
    messageFields.add(FIELD_TYPE, fields.message);

    // Fetch next entry args from aquadoggo
    const args = await session.getNextEntryArgs(keyPair.publicKey(), schema);
    // If lastSeqNum is null don't try and convert to BigInt
    // Can this be handled better in the wasm code?
    const lastSeqNum = args.lastSeqNum
      ? BigInt(args.lastSeqNum)
      : args.lastSeqNum;

    // Encode message
    const encodedMessage = encodeCreateMessage(schema, messageFields);

    // Sign and encode entry passing in copy of keyPair
    const { entryEncoded, entryHash } = signEntry(
      KeyPair.fromPrivateKey(keyPair.privateKey()),
      encodedMessage,
      args.entryHashSkiplink,
      args.entryHashBacklink,
      lastSeqNum,
      BigInt(args.logId),
    );

    // Publish entry
    await session.publishEntry(entryEncoded, encodedMessage);

    const newEntry = {
      encoded_entry: entryEncoded,
      entry_hash: entryHash,
      encoded_message: encodedMessage,
    };

    session.log.push(newEntry);

    return newEntry;
  }

  static async query(
    searchParams: SearchParams,
    { session }: Pick<InstanceArgs, 'session' | 'schema'>,
  ): Promise<Entry[]> {
    await this._init();
    const entries = await session.queryEntries();
    return Promise.all(
      entries.map(async (entry) => ({
        ...entry,
        debugDecoded: await this.p2panda.decodeEntry(
          entry.encoded_entry,
          entry.encoded_message,
        ),
      })),
    );
  }
}
