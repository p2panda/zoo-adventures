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
  debugDecoded?: string;
};

type EntryArgs = {
  entryHashSkiplink: string | null;
  entryHashBacklink: string | null;
  lastSeqNum: number | null;
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
    this._init();

    const args = await session.getNextEntryArgs(keyPair.publicKey(), schema);
    const entry = await this.p2panda.signEncode(
      keyPair.privateKey(),
      fields.message,
      args.entryHashSkiplink,
      args.entryHashBacklink,
      args.lastSeqNum,
    );
    await session.publishEntry(entry.encoded_entry, entry.encoded_message);
    session.log.push(entry);
    return entry;
  }

  static async query(
    searchParams: SearchParams,
    { session }: Pick<InstanceArgs, 'session' | 'schema'>,
  ): Promise<Entry[]> {
    this._init();
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
