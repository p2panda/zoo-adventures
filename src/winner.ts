import { validAnimal } from './animals';

function horizontal(
  x: number,
  y: number,
  boardSize: number,
  winSize: number,
): number[][] {
  const from = x + y * boardSize;
  const to = from + winSize - 1;

  if (to < y * boardSize + boardSize) {
    return [
      new Array(winSize).fill(0).map((_, index) => {
        return from + index;
      }),
    ];
  }

  return [];
}

function vertical(
  x: number,
  y: number,
  boardSize: number,
  winSize: number,
): number[][] {
  const from = x + y * boardSize;
  const to = from + (winSize - 1) * boardSize;

  if (to < boardSize * boardSize) {
    return [
      new Array(winSize).fill(0).map((_, index) => {
        return from + index * boardSize;
      }),
    ];
  }

  return [];
}

function diagonal(
  x: number,
  y: number,
  boardSize: number,
  winSize: number,
): number[][] {
  const from = x + y * boardSize;
  const to = from + (winSize - 1) * boardSize + (winSize - 1);

  if (to < boardSize * boardSize) {
    if (to < (y + winSize) * boardSize) {
      return [
        new Array(winSize).fill(0).map((_, index) => {
          return from + index * (boardSize + 1);
        }),
      ];
    }
  }

  return [];
}

/**
 * Calculate all combinations on the board where player wins.
 */
export function winCombinations(
  boardSize: number,
  winSize: number,
): number[][] {
  let result: number[][] = [];

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
 */
export function detectWinner(fields: string[], combinations: number[][]) {
  // Gather all current players and their positions
  const players = fields.reduce<{ [field: string]: number[] }>(
    (acc, field, index) => {
      // Ignore invalid players
      if (!validAnimal(field)) {
        return acc;
      }

      if (!(field in acc)) {
        acc[field] = [];
      }
      acc[field].push(index);

      return acc;
    },
    {},
  );

  console.log(combinations, players);
}
