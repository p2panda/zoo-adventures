import debug from 'debug';

export const log = debug('p2panda');

export type EntryArgs = {
  entryHashSkiplink: string | null;
  entryHashBacklink: string | null;
  lastSeqNum: number | null;
  logId: number;
};

export { default as Session } from './session';
export { default as Instance } from './instance';
export { Entry } from './entry';
