export type EntryArgs = {
  entryHashSkiplink: string | null;
  entryHashBacklink: string | null;
  lastSeqNum: number | null;
  logId: number;
};

export type EntryRecordEncoded = {
  author: string;
  entryBytes: string;
  entryHash: string;
  logId: number;
  payloadBytes: string;
  payloadHash: string;
  seqNum: number;
};

export type EntryRecord = EntryRecordEncoded & {
  decoded: Entry;
};

export type Entry = {
  entryHashBacklink: string | null;
  entryHashSkiplink: string | null;
  logId: number;
  message: Message | null;
  seqNum: number;
};

export type Message = {
  action: 'create' | 'update' | 'delete';
  schema: string;
  fields: Fields;
};

export type Fields = {
  // currently only a schema with only a message is supported
  // [fieldname: string]: boolean | number | string;
  [fieldname: string]: MessageValueText;
};

export type MessageValueText = {
  Text: string;
};
