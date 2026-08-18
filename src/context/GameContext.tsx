// src/context/GameContext.tsx — full replace
import { createContext, useEffect, useState } from "react";
import type { GameData, VariationMove } from "../data/games";

const API_URL = "http://localhost:4000";

type GameContextType = {
  games: GameData[];
  loading: boolean;
  refetch: () => Promise<void>;
  addGame: (game: Omit<GameData, "id">) => Promise<void>;
  updateGame: (id: string, updatedGame: Omit<GameData, "id">) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  saveAnalysis: (gameId: string, moveIndex: number, text: string) => Promise<void>;
  deleteAnalysis: (gameId: string, moveIndex: number) => Promise<void>;
  addVariation: (gameId: string, branchFromMoveIndex: number) => Promise<void>;
  deleteVariation: (gameId: string, variationId: string) => Promise<void>;
  addVariationMove: (gameId: string, variationId: string, move: VariationMove) => Promise<void>;
  deleteVariationMovesAfter: (gameId: string, variationId: string, moveIndex: number) => Promise<void>;
  saveVariationAnalysis: (gameId: string, variationId: string, moveIndex: number, text: string) => Promise<void>;
  deleteVariationAnalysis: (gameId: string, variationId: string, moveIndex: number) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GameContext = createContext<GameContextType | undefined>(undefined);
type RawAnalysis = { moveIndex: number; text: string };
type RawVariationMove = { moveIndex: number; san: string; fen: string };
type RawVariation = {
  id: string;
  branchFromMoveIndex: number;
  moves: RawVariationMove[];
  analysis: RawAnalysis[];
};
type RawGame = {
  id: string;
  white: string;
  black: string;
  event: string;
  category: string;
  rating: string;
  pgn: string;
  analysis: RawAnalysis[];
  variations: RawVariation[];
};
function normalizeGame(raw: RawGame): GameData {
  const analysis: Record<number, string> = {};
   (raw.analysis ?? []).forEach((a: RawAnalysis) => {
    analysis[a.moveIndex] = a.text;
  });

  const variations = (raw.variations ?? []).map((v: RawVariation) => {
    const vAnalysis: Record<number, string> = {};
    (v.analysis ?? []).forEach((a: RawAnalysis) => {
      vAnalysis[a.moveIndex] = a.text;
    });

    return {
      id: v.id,
      branchFromMoveIndex: v.branchFromMoveIndex,
      moves: (v.moves ?? [])
        .sort((a: RawVariationMove, b: RawVariationMove) => a.moveIndex - b.moveIndex)
        .map((m: RawVariationMove) => ({ san: m.san, fen: m.fen })),
      analysis: vAnalysis,
    };
  });

  return {
    id: raw.id,
    players: `${raw.white} vs ${raw.black}`,
    white: raw.white,
    black: raw.black,
    event: raw.event,
    category: raw.category,
    rating: raw.rating,
    pgn: raw.pgn,
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
      const res = await fetch(`${API_URL}/games`);
      const data = await res.json();
      setGames(data.map(normalizeGame));
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/games`);
        const data = await res.json();
        if (!cancelled) setGames(data.map(normalizeGame));
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addGame = async (game: Omit<GameData, "id">) => {
    await fetch(`${API_URL}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(game),
    });
    await refetch();
  };

  const updateGame = async (id: string, updatedGame: Omit<GameData, "id">) => {
    await fetch(`${API_URL}/games/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedGame),
    });
    await refetch();
  };

  const deleteGame = async (id: string) => {
    await fetch(`${API_URL}/games/${id}`, { method: "DELETE" });
    await refetch();
  };

  const saveAnalysis = async (gameId: string, moveIndex: number, text: string) => {
    await fetch(`${API_URL}/games/${gameId}/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moveIndex, text }),
    });
    await refetch();
  };

  const deleteAnalysis = async (gameId: string, moveIndex: number) => {
    await fetch(`${API_URL}/games/${gameId}/analysis/${moveIndex}`, { method: "DELETE" });
    await refetch();
  };

  const addVariation = async (gameId: string, branchFromMoveIndex: number) => {
    await fetch(`${API_URL}/games/${gameId}/variations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branchFromMoveIndex }),
    });
    await refetch();
  };

  const deleteVariation = async (gameId: string, variationId: string) => {
    await fetch(`${API_URL}/variations/${variationId}`, { method: "DELETE" });
    await refetch();
  };

  const addVariationMove = async (gameId: string, variationId: string, move: VariationMove) => {
    const existingVariation = games
      .find((g) => g.id === gameId)
      ?.variations?.find((v) => v.id === variationId);
    const moveIndex = existingVariation ? existingVariation.moves.length : 0;

    await fetch(`${API_URL}/variations/${variationId}/moves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moveIndex, san: move.san, fen: move.fen }),
    });
    await refetch();
  };

  const deleteVariationMovesAfter = async (_gameId: string, variationId: string, moveIndex: number) => {
    await fetch(`${API_URL}/variations/${variationId}/moves-after/${moveIndex}`, { method: "DELETE" });
    await refetch();
  };

  const saveVariationAnalysis = async (_gameId: string, variationId: string, moveIndex: number, text: string) => {
    await fetch(`${API_URL}/variations/${variationId}/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moveIndex, text }),
    });
    await refetch();
  };

  const deleteVariationAnalysis = async (_gameId: string, variationId: string, moveIndex: number) => {
    await fetch(`${API_URL}/variations/${variationId}/analysis/${moveIndex}`, { method: "DELETE" });
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