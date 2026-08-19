// src/data/games.ts — full replace
export type MoveRecord = {
  moveIndex?: number;
  san: string;
  fen: string;
};

export type VariationMove = {
  san: string;
  fen: string;
};

export type Variation = {
  id: string;
  branchFromMoveIndex: number;
  moves: VariationMove[];
  analysis: Record<number, string>;
};

export type GameData = {
  id: string;
  players: string;
  gameType?: "GM_GAME" | "USER_GAME" | "ANONYMOUS";
  white: string;
  black: string;
  whitePlatform?: "CHESS_COM" | "LICHESS" | "OTHER";
  blackPlatform?: "CHESS_COM" | "LICHESS" | "OTHER";
  event: string;
  category: string;
  rating: string;
  pgn: string;
  playerId?: string | null;
  analysis: Record<number, string>;
  variations: Variation[];
};