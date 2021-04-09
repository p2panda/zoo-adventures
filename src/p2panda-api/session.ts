import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js';
import p2panda from 'p2panda-js';

import { Resolved } from '~/typescript/helpers';

import { EntryArgs, log } from '.';

type SessionProps = {
  keyPair: string;
  endpoint: string;
};

type EntryRecord = {
  author: string;
  entryBytes: string;
  entryHash: string;
  logId: number;
  payloadBytes: string;
  payloadHash: string;
  seqNum: number;
};

export default class Session {
  endpoint: string = null;
  private client = null;
  log = [];
  p2panda: Resolved<p2panda> = null;

  constructor({ endpoint }: SessionProps) {
    this.endpoint = endpoint;
    const transport = new HTTPTransport(endpoint);
    this.client = new Client(new RequestManager([transport]));
  }

  async _init(): Promise<void> {
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
