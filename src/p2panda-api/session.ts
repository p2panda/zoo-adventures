import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js';
import p2panda from 'p2panda-js';

import { Resolved } from '~/typescript/helpers';

import { log } from '.';
import { Entry, EntryArgs, EntryRecord, EntryRecordEncoded } from './types';

export default class Session {
  endpoint: string = null;
  private client = null;
  p2panda: Resolved<typeof p2panda> = null;
  nextEntryArgs: { [cacheKey: string]: EntryArgs } = {};

  constructor(endpoint: Session['endpoint']) {
    this.endpoint = endpoint;
    const transport = new HTTPTransport(endpoint);
    this.client = new Client(new RequestManager([transport]));
    this.loadWasm();
  }

  // Load and return the WebAssembly p2panda library.
  //
  // Always await this function before
  // using `this.p2panda`. Unfortunately this cannot be handled in the
  // constructor as the contructor cannot be async.
  async loadWasm(): Promise<Session['p2panda']> {
    if (this.p2panda == null) {
      this.p2panda = await p2panda;
    }
    return this.p2panda;
  }

  async getNextEntryArgs(author: string, schema: string): Promise<EntryArgs> {
    const cacheKey = `${author}/${schema}`;
    let rv = this.nextEntryArgs[cacheKey];
    if (rv) {
      // use cache
      delete this.nextEntryArgs[cacheKey];
      log('panda_getEntryArguments [cached]', rv);
      return rv;
    } else {
      // do rpc call
      rv = await this.client.request({
        method: 'panda_getEntryArguments',
        params: { author, schema },
      });
      log('panda_getEntryArguments', rv);
    }

    return rv;
  }

  setNextEntryArgs(author: string, schema: string, entryArgs: EntryArgs): void {
    const cacheKey = `${author}/${schema}`;
    this.nextEntryArgs[cacheKey] = entryArgs;
  }

  async publishEntry(
    entryEncoded: string,
    messageEncoded: string,
  ): Promise<EntryArgs> {
    const result = await this.client.request({
      method: 'panda_publishEntry',
      params: { entryEncoded, messageEncoded },
    });
    log('panda_publishEntry');
    return result;
  }

  async queryEntriesEncoded(schema: string): Promise<EntryRecordEncoded[]> {
    const result = await this.client.request({
      method: 'panda_queryEntries',
      params: { schema },
    });
    log('panda_queryEntries', result);
    return result.entries;
  }

  async queryEntries(schema: string): Promise<EntryRecord[]> {
    const { decodeEntry } = await this.loadWasm();

    const result = await this.queryEntriesEncoded(schema);
    return Promise.all(
      result.map(async (entry) => ({
        ...entry,
        decoded: await decodeEntry(entry.entryBytes, entry.payloadBytes),
      })),
    );
  }

  toString(): string {
    return `<Session ${this.endpoint}>`;
  }
}
