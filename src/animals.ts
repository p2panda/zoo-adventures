const ANIMALS = [
  '🐒',
  '🦍',
  '🐶',
  '🐕',
  '🐩',
  '🐺',
  '🦊',
  '🦝',
  '🐱',
  '🐈',
  '🦁',
  '🐯',
  '🐅',
  '🐆',
  '🐴',
  '🐎',
  '🦄',
  '🦓',
  '🦌',
  '🐮',
  '🐂',
  '🐃',
  '🐄',
  '🐷',
  '🐖',
  '🐗',
  '🐽',
  '🐏',
  '🐑',
  '🐐',
  '🐪',
  '🐫',
  '🦙',
  '🦒',
  '🐘',
  '🦏',
  '🦛',
  '🐭',
  '🐁',
  '🐀',
  '🐹',
  '🐰',
  '🐇',
  '🦔',
  '🦇',
  '🐻',
  '🐨',
  '🐼',
  '🦘',
  '🦡',
  '🦃',
  '🐔',
  '🐓',
  '🐣',
  '🐤',
  '🐥',
  '🐦',
  '🐧',
  '🕊',
  '🦅',
  '🦆',
  '🦢',
  '🦉',
  '🦚',
  '🦜',
  '🐸',
  '🐊',
  '🐢',
  '🦎',
  '🐍',
  '🐲',
  '🐉',
  '🦕',
  '🦖',
  '🐳',
  '🐋',
  '🐬',
  '🐟',
  '🐠',
  '🐡',
  '🦈',
  '🐙',
  '🐚',
  '🦀',
  '🦞',
  '🦐',
  '🦑',
  '🐌',
  '🦋',
  '🐛',
  '🐜',
  '🐝',
  '🐞',
  '🦗',
  '🕷',
  '🦂',
  '🦟',
  '🦠',
];

export function validAnimal(value: string): boolean {
  return ANIMALS.includes(value);
}

export function publicKeyToAnimal(publicKey: string): string {
  const value = parseInt(publicKey.slice(0, 8), 16);
  return ANIMALS[value % ANIMALS.length];
}
