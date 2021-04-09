import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js';
import p2panda from 'p2panda-js';

import { Resolved } from '~/typescript/helpers';

import { log } from '.';
import { EntryArgs, EntryRecord, EntryRecordEncoded } from './types';

export default class Session {
  endpoint: string = null;
  private client = null;
  p2panda: Resolved<typeof p2panda> = null;

  constructor(endpoint: Session['endpoint']) {
    this.endpoint = endpoint;
    const transport = new HTTPTransport(endpoint);
    this.client = new Client(new RequestManager([transport]));
  }

  // Load the WebAssembly p2panda library. Always await this function before
  // using this.p2panda. Unfortunately this cannot be handled in the
  // constructor as that cannot be asynchronous.
  async init(): Promise<void> {
    if (this.p2panda != null) return;
    this.p2panda = await p2panda;
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

  async queryEntriesEncoded(schema: string): Promise<EntryRecordEncoded[]> {
    const result = await this.client.request({
      method: 'panda_queryEntries',
      params: { schema },
    });
    log('panda_queryEntries', result);
    return result.entries;
  }

  async queryEntries(schema: string): Promise<EntryRecord[]> {
    await this.init();

    const result = await this.queryEntriesEncoded(schema);
    return Promise.all(
      result.map(async (entry) => ({
        ...entry,
        decoded: await this.p2panda.decodeEntry(
          entry.entryBytes,
          entry.payloadBytes,
        ),
      })),
    );
  }

  toString(): string {
    return `<Session ${this.endpoint}>`;
  }
}
