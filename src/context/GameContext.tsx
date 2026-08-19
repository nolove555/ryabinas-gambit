// src/context/GameContext.tsx — full replace
import { createContext, useEffect, useState } from "react";
import type { GameData, MoveRecord, VariationMove } from "../data/games";

const API_URL = "http://localhost:4000";

type GameContextType = {
  games: GameData[];
  loading: boolean;
  refetch: () => Promise<void>;
  addGame: (game: Partial<Omit<GameData, "id">>) => Promise<void>;
  updateGame: (id: string, updatedGame: Partial<Omit<GameData, "id">>) => Promise<void>;
  updateGameMoves: (gameId: string, moves: MoveRecord[]) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  saveAnalysis: (gameId: string, moveIndex: number, text: string) => Promise<void>;
  deleteAnalysis: (gameId: string, moveIndex: number) => Promise<void>;
  addVariation: (gameId: string, branchFromMoveIndex: number) => Promise<string>;
  deleteVariation: (gameId: string, variationId: string) => Promise<void>;
  addVariationMove: (gameId: string, variationId: string, move: VariationMove) => Promise<void>;
  deleteVariationMovesAfter: (gameId: string, variationId: string, moveIndex: number) => Promise<void>;
  saveVariationAnalysis: (gameId: string, variationId: string, moveIndex: number, text: string) => Promise<void>;
  deleteVariationAnalysis: (gameId: string, variationId: string, moveIndex: number) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GameContext = createContext<GameContextType | undefined>(undefined);

type RawAnalysis = { moveIndex: number; text: string };
type RawGameMove = { moveIndex: number; san: string; fen: string };
type RawVariationMove = { moveIndex: number; san: string; fen: string };
type RawVariation = {
  id: string;
  branchFromMoveIndex: number;
  moves: RawVariationMove[];
  analysis: RawAnalysis[];
};
type RawGame = {
  id: string;
  gameType?: "GM_GAME" | "USER_GAME" | "ANONYMOUS";
  white: string | null;
  black: string | null;
  whitePlatform?: "CHESS_COM" | "LICHESS" | "OTHER" | null;
  blackPlatform?: "CHESS_COM" | "LICHESS" | "OTHER" | null;
  event: string | null;
  category: string | null;
  rating: string | null;
  pgn: string;
  playerId?: string | null;
  analysis: RawAnalysis[];
  variations: RawVariation[];
  moves: RawGameMove[];
};

function normalizeGame(raw: RawGame): GameData {
  const analysis: Record<number, string> = {};
  (raw.analysis ?? []).forEach((item) => {
    analysis[item.moveIndex] = item.text;
  });

  const variations = (raw.variations ?? []).map((variation) => {
    const variationAnalysis: Record<number, string> = {};
    (variation.analysis ?? []).forEach((item) => {
      variationAnalysis[item.moveIndex] = item.text;
    });

    const variationMoves = [...(variation.moves ?? [])]
      .sort((a, b) => a.moveIndex - b.moveIndex)
      .map((move) => ({ san: move.san, fen: move.fen }));

    return {
      id: variation.id,
      branchFromMoveIndex: variation.branchFromMoveIndex,
      moves: variationMoves,
      analysis: variationAnalysis,
    };
  });

  return {
    id: raw.id,
    players: `${raw.white ?? ""} vs ${raw.black ?? ""}`,
    gameType: raw.gameType,
    white: raw.white ?? "",
    black: raw.black ?? "",
    whitePlatform: raw.whitePlatform ?? undefined,
    blackPlatform: raw.blackPlatform ?? undefined,
    event: raw.event ?? "",
    category: raw.category ?? "",
    rating: raw.rating ?? "",
    pgn: raw.pgn,
    playerId: raw.playerId ?? null,
    analysis,
    variations,
  };
}

function GameProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/games`);
      if (!response.ok) throw new Error(`GET /games failed with status ${response.status}`);
      const data: RawGame[] = await response.json();
      setGames(data.map(normalizeGame));
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/games`);
        if (!response.ok) throw new Error(`GET /games failed with status ${response.status}`);
        const data: RawGame[] = await response.json();
        if (!cancelled) setGames(data.map(normalizeGame));
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadGames();
    return () => {
      cancelled = true;
    };
  }, []);

  const addGame = async (game: Partial<Omit<GameData, "id">>) => {
    const response = await fetch(`${API_URL}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameType: game.gameType,
        white: game.white,
        black: game.black,
        whitePlatform: game.whitePlatform,
        blackPlatform: game.blackPlatform,
        event: game.event,
        category: game.category,
        rating: game.rating,
        pgn: game.pgn,
        playerId: game.playerId,
      }),
    });

    if (!response.ok) throw new Error(`POST /games failed with status ${response.status}`);
    await refetch();
  };

  const updateGame = async (id: string, updatedGame: Partial<Omit<GameData, "id">>) => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameType: updatedGame.gameType,
        white: updatedGame.white,
        black: updatedGame.black,
        whitePlatform: updatedGame.whitePlatform,
        blackPlatform: updatedGame.blackPlatform,
        event: updatedGame.event,
        category: updatedGame.category,
        rating: updatedGame.rating,
        pgn: updatedGame.pgn,
        playerId: updatedGame.playerId,
      }),
    });

    if (!response.ok) throw new Error(`PUT /games/${id} failed with status ${response.status}`);
    await refetch();
  };

  const updateGameMoves = async (gameId: string, moves: MoveRecord[]) => {
    const response = await fetch(`${API_URL}/games/${gameId}/moves`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moves }),
    });

    if (!response.ok) throw new Error(`PUT moves failed with status ${response.status}`);
    await refetch();
  };

  const deleteGame = async (id: string) => {
    const response = await fetch(`${API_URL}/games/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`DELETE /games/${id} failed with status ${response.status}`);
    await refetch();
  };

  const saveAnalysis = async (gameId: string, moveIndex: number, text: string) => {
    const response = await fetch(`${API_URL}/games/${gameId}/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moveIndex, text }),
    });
    if (!response.ok) throw new Error(`POST analysis failed with status ${response.status}`);
    await refetch();
  };

  const deleteAnalysis = async (gameId: string, moveIndex: number) => {
    const response = await fetch(`${API_URL}/games/${gameId}/analysis/${moveIndex}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`DELETE analysis failed with status ${response.status}`);
    await refetch();
  };

  const addVariation = async (gameId: string, branchFromMoveIndex: number) => {
    const response = await fetch(`${API_URL}/games/${gameId}/variations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branchFromMoveIndex }),
    });
    if (!response.ok) throw new Error(`POST variation failed with status ${response.status}`);
    const created: { id: string } = await response.json();
    await refetch();
    return created.id;
  };

  const deleteVariation = async (_gameId: string, variationId: string) => {
    const response = await fetch(`${API_URL}/variations/${variationId}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`DELETE variation failed with status ${response.status}`);
    await refetch();
  };

  const addVariationMove = async (gameId: string, variationId: string, move: VariationMove) => {
    const existingVariation = games
      .find((game) => game.id === gameId)
      ?.variations?.find((variation) => variation.id === variationId);

    const moveIndex = existingVariation?.moves.length ?? 0;

    const response = await fetch(`${API_URL}/variations/${variationId}/moves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moveIndex, san: move.san, fen: move.fen }),
    });

    if (!response.ok) throw new Error(`POST variation move failed with status ${response.status}`);
    await refetch();
  };

  const deleteVariationMovesAfter = async (_gameId: string, variationId: string, moveIndex: number) => {
    const response = await fetch(`${API_URL}/variations/${variationId}/moves-after/${moveIndex}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`DELETE variation moves failed with status ${response.status}`);
    await refetch();
  };

  const saveVariationAnalysis = async (_gameId: string, variationId: string, moveIndex: number, text: string) => {
    const response = await fetch(`${API_URL}/variations/${variationId}/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moveIndex, text }),
    });
    if (!response.ok) throw new Error(`POST variation analysis failed with status ${response.status}`);
    await refetch();
  };

  const deleteVariationAnalysis = async (_gameId: string, variationId: string, moveIndex: number) => {
    const response = await fetch(`${API_URL}/variations/${variationId}/analysis/${moveIndex}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`DELETE variation analysis failed with status ${response.status}`);
    await refetch();
  };

  return (
    <GameContext.Provider
      value={{
        games,
        loading,
        refetch,
        addGame,
        updateGame,
        updateGameMoves,
        deleteGame,
        saveAnalysis,
        deleteAnalysis,
        addVariation,
        deleteVariation,
        addVariationMove,
        deleteVariationMovesAfter,
        saveVariationAnalysis,
        deleteVariationAnalysis,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;