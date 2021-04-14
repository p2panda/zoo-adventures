/**
 * Arguments for publishing the next entry
 */
export type EntryArgs = {
  entryHashSkiplink: string | null;
  entryHashBacklink: string | null;
  lastSeqNum: number | null;
  logId: number;
};

/**
 * Entry record received from aquadoggo
 */
export type EntryRecordEncoded = {
  author: string;
  entryBytes: string;
  entryHash: string;
  logId: number;
  payloadBytes: string;
  payloadHash: string;
  seqNum: number;
};

/**
 * Entry record from aquadoggo with decoded `Entry`
 */
export type EntryRecord = EntryRecordEncoded & {
  decoded: Entry;
};

/**
 * Decoded entry containing optional `Message`
 */
export type Entry = {
  entryHashBacklink: string | null;
  entryHashSkiplink: string | null;
  logId: number;
  message: Message | null;
  seqNum: number;
};

/**
 * Decoded form of a message, which can create, update or delete instances
 */
export type Message = {
  action: 'create' | 'update' | 'delete';
  schema: string;
  fields: Fields;
};

/**
 * Object containing values to be set on an instance
 */
export type Fields = {
  // currently only a schema with only a message is supported
  // [fieldname: string]: boolean | number | string;
  [fieldname: string]: MessageValueText;
};

/**
 * A message value of `string` type
 */
export type MessageValueText = {
  Text: string;
};
