// SPDX-License-Identifier: MIT

import { KeyPair } from 'p2panda-js';

const PRIVATE_KEY_STORE = 'privateKey';
const LAST_MOVE_STORE = 'lastMove';

export function loadKeyPair(): KeyPair {
  const privateKey = window.localStorage.getItem(PRIVATE_KEY_STORE);
  if (privateKey) {
    return new KeyPair(privateKey);
  }

  const keyPair = new KeyPair();
  window.localStorage.setItem(PRIVATE_KEY_STORE, keyPair.privateKey());
  return keyPair;
}

export function loadLastMove(): string | null {
  return window.localStorage.getItem(LAST_MOVE_STORE);
}

export function storeLastMove(viewId: string) {
  window.localStorage.setItem(LAST_MOVE_STORE, viewId);
}
