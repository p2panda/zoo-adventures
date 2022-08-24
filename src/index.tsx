import React from 'react';

import { Game } from './Game';
import { InitWasm } from './InitWasm';

import type { Configuration } from './types';

const defaultConfiguration: Configuration = {
  boardSize: 4,
  winSize: 4,
  documentId:
    '0020c301d6595e12cbd472d21ac4c1bdfde02ec4e8d7ea299f723130d64eb65e500d',
  endpoint: 'http://localhost:2020/graphql',
  schemaId:
    'zoo_adventures_00209403784eea2ba5236f9083472f040a90babf4df1b64efbbaae58eb51aa67fd4d',
  updateIntervalMs: 2000,
};

export const ZooAdventures: React.FC<Partial<Configuration>> = (config) => {
  return (
    <InitWasm>
      <Game config={{ ...defaultConfiguration, ...config }} />
    </InitWasm>
  );
};
