/**
 * Zoo Adventures game configuration.
 */
export type Configuration = {
  /** Dimensions of the board, set to 4 when it is a 4x4 board */
  boardSize: number;

  /** Required number of pieces in horizontal, vertical, diagonal row to win */
  winSize: number;

  /** All players play on the same board, this is the document id of it */
  documentId: string;

  /** URL of the p2panda node */
  endpoint: string;

  /** ID of the game board schema, make sure the board size matches the fields */
  schemaId: string;

  /** Interval to fetch latest board game state from node in milliseconds */
  updateIntervalMs: number;
};

/**
 * Winning player with related combination on the board.
 */
export type Winner = {
  /** Animal character of the player */
  player: string;

  /** Positions in the board which represent the winner */
  combination: number[];
};
