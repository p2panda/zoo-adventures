import { validAnimal } from './animals';

const SEPARATOR = '|';

function horizontal(
  x: number,
  y: number,
  boardSize: number,
  winSize: number,
): string[] {
  const from = x + y * boardSize;
  const to = from + winSize - 1;

  if (to < y * boardSize + boardSize) {
    return [
      new Array(winSize)
        .fill(0)
        .map((_, index) => {
          return from + index;
        })
        .join(SEPARATOR),
    ];
  }

  return [];
}

function vertical(
  x: number,
  y: number,
  boardSize: number,
  winSize: number,
): string[] {
  const from = x + y * boardSize;
  const to = from + (winSize - 1) * boardSize;

  if (to < boardSize * boardSize) {
    return [
      new Array(winSize)
        .fill(0)
        .map((_, index) => {
          return from + index * boardSize;
        })
        .join(SEPARATOR),
    ];
  }

  return [];
}

function diagonal(
  x: number,
  y: number,
  boardSize: number,
  winSize: number,
): string[] {
  const from = x + y * boardSize;
  const to = from + (winSize - 1) * boardSize + (winSize - 1);

  if (to < boardSize * boardSize) {
    if (to < (y + winSize) * boardSize) {
      return [
        new Array(winSize)
          .fill(0)
          .map((_, index) => {
            return from + index * (boardSize + 1);
          })
          .join(SEPARATOR),
      ];
    }
  }

  return [];
}

/**
 * Calculate all combinations on the board where player wins.
 *
 * Given a boardSize of 3 and winSize of 3, we would receive the following
 * combinations (as string values, with separator in-between):
 *
 * ```
 * Board:
 *
 * 0 1 2
 * 3 4 5
 * 6 7 8
 *
 * Combinations:
 *
 * 0|1|2
 * 3|4|5
 * 6|7|8
 * 0|3|6
 * 1|4|7
 * 2|5|8
 * 0|4|8
 * ```
 */
export function winCombinations(boardSize: number, winSize: number): string[] {
  let result: string[] = [];

  for (let x = 0; x < boardSize; x += 1) {
    for (let y = 0; y < boardSize; y += 1) {
      result = result.concat([
        ...horizontal(x, y, boardSize, winSize),
        ...vertical(x, y, boardSize, winSize),
        ...diagonal(x, y, boardSize, winSize),
      ]);
    }
  }

  return result;
}

/**
 * Detect if a player won on the board.
 *
 * Since we represent all winning combinations as strings we can simply match
 * strings against each other to see if a player fullfills at least one
 * combination.
 */
export function detectWinner(
  fields: string[],
  combinations: string[],
): string[] {
  const winners: string[] = [];

  // Gather all current players and their positions
  const players = fields.reduce<{ [field: string]: string }>(
    (acc, field, index) => {
      // Ignore invalid players
      if (!validAnimal(field)) {
        return acc;
      }

      if (!(field in acc)) {
        acc[field] = '';
      }

      acc[field] = `${acc[field]}${SEPARATOR}${index}`;

      return acc;
    },
    {},
  );

  // See if at least one winning combination string matches player position string
  const playerKeys = Object.keys(players);
  for (let p = 0; p < playerKeys.length; p += 1) {
    for (let c = 0; c < combinations.length; c += 1) {
      const player = playerKeys[p];
      const positions = players[player];
      const combination = combinations[c];

      if (positions.includes(combination) && !winners.includes(player)) {
        winners.push(player);
      }
    }
  }

  return winners;
}
