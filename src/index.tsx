import React from 'react';

import { Game, InitWasm } from './components';

import type { Configuration } from './types';

const defaultConfiguration: Configuration = {
  boardSize: 4,
  winSize: 3,
  documentId:
    '0020c301d6595e12cbd472d21ac4c1bdfde02ec4e8d7ea299f723130d64eb65e500d',
  endpoint: 'http://localhost:2020/graphql',
  schemaId:
    'zoo_adventures_00209403784eea2ba5236f9083472f040a90babf4df1b64efbbaae58eb51aa67fd4d',
  updateIntervalMs: 2000,
};

export const ZooAdventures: React.FC<Partial<Configuration>> = (
  userConfiguration,
) => {
  const config = {
    ...defaultConfiguration,
    ...userConfiguration,
  };

  if (config.boardSize < 3) {
    throw new Error('boardSize can not be smaller than 2');
  }

  if (config.winSize < 2) {
    throw new Error('winSize can not be smaller than 1');
  }

  if (config.boardSize < config.winSize) {
    throw new Error('winSize can not be larger than boardSize');
  }

  return (
    <InitWasm>
      <Game config={config} />
    </InitWasm>
  );
};
