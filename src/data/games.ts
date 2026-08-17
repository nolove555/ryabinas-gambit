export type VariationMove = {
  san: string;
  fen: string;
};

export type Variation = {
  id: string;
  branchFromMoveIndex: number;
  moves: VariationMove[];
  analysis?: Record<number, string>;
};

export type GameData = {
  id: string;
  players: string;
  white: string;
  black: string;
  event: string;
  category: string;
  rating: string;
  pgn: string;
  analysis?: Record<number, string>;
  variations?: Variation[];
};

export const games: GameData[] = [];