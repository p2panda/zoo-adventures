import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js';
import p2panda from 'p2panda-js';

const endpoint = 'http://localhost:2020';

type SessionProps = {
  keyPair: string;
  endpoint: string;
};

export type Entry = {
  encoded_entry: string;
  encoded_message: string;
  entry_hash: string;
  decoded?: any;
};

type EntryArgs = any;
export class Session {
  private client = null;
  log = [];

  constructor({ endpoint }: SessionProps) {
    const transport = new HTTPTransport(endpoint);
    this.client = new Client(new RequestManager([transport]));
  }

  async getNextEntryArgs(author: string, schema: string): Promise<EntryArgs> {
    // do rpc call
    const result = await this.client.request({
      method: 'panda_getEntryArguments',
      params: { author, schema },
    });
    console.log('panda_getEntryArguments', result);
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
    console.log('panda_publishEntry');
  }

  async queryEntries(): Promise<Entry[]> {
    return this.log;
  }
}

type InstanceArgs = {
  keyPair: any;
  schema: string;
  session: Session;
};

type Fields = {
  // currently only a schema with only a message is supported
  // [fieldname: string]: boolean | number | string;
  message: string;
};

type SearchParams = any;

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
    console.log('Instance.create session log', session.log);
    return entry;
  }

  // static async update(
  //   instanceId: string,
  //   fields: Fields,
  //   { author, schema, session }: InstanceArgs,
  // ): Promise<Entry> {
  //   this._init();
  //   //
  // }

  static async query(
    searchParams: SearchParams,
    { session }: Pick<InstanceArgs, 'session'>,
  ): Promise<Entry[]> {
    this._init();
    console.log('query', searchParams);
    const entries = await session.queryEntries();
    return Promise.all(
      entries.map(async (entry) => ({
        ...entry,
        decoded: await this.p2panda.decodeEntry(
          entry.encoded_entry,
          entry.encoded_message,
        ),
      })),
    );
  }
}
