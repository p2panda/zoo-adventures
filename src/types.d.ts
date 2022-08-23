/**
 * Zoo Adventures game configuration.
 */
export type Configuration = {
  /** Dimensions of the board, set to 4 when it is a 4x4 board */
  boardSize: number;

  /** All players play on the same board, this is the document id of it */
  documentId: string;

  /** URL of the p2panda node */
  endpoint: string;

  /** ID of the game board schema, make sure the board size matches the fields */
  schemaId: string;

  /** Interval to fetch latest board game state from node in milliseconds */
  updateIntervalMs: number;
};
