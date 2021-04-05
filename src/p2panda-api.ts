import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js';

type NextEntryArgs = any;

const transport = new HTTPTransport('http://localhost:2020');
const client = new Client(new RequestManager([transport]));

const getNextEntryArgs = async (author, schema): Promise<NextEntryArgs> => {
  // do rpc call
  const result = await client.request({
    method: 'panda_getEntryArguments',
    params: { author, schema },
  });
  console.log('panda_getEntryArguments', result);
  return result;
};

const publishEntry = async (entryEncoded, messageEncoded): Promise<void> => {
  await client.request({
    method: 'panda_publishEntry',
    params: { entryEncoded, messageEncoded },
  });
  console.log('panda_publishEntry');
};

export default {
  getNextEntryArgs,
  publishEntry,
};
