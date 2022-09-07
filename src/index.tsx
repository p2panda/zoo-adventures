// SPDX-License-Identifier: MIT

import React from 'react';

import { Game, InitWasm } from './components';

import type { Configuration } from './types';

const defaultConfiguration: Configuration = {
  boardSize: 4,
  winSize: 3,
  documentId:
    '00206e635f39093c4a78942cfb9ee07dc148daac373efd9882e2b651a39153eea75d',
  endpoint: 'https://welle.liebechaos.org/graphql',
  schemaId:
    'zoo_adventures_0020d0ab014720c6849d99ab17f694bcedbc267614021acfb9559f2ee7f64bce396f',
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
