// src/context/GameContext.tsx — full replace
import { createContext, useEffect, useState } from "react";

import type { GameData, Variation, VariationMove } from "../data/games";
import { games as initialGames } from "../data/games";


type GameContextType = {
  games: GameData[];
  addGame: (game: Omit<GameData, "id">) => void;
  updateGame: (id: string, updatedGame: Omit<GameData, "id">) => void;
  deleteGame: (id: string) => void;
  saveAnalysis: (gameId: string, moveIndex: number, text: string) => void;
  deleteAnalysis: (gameId: string, moveIndex: number) => void;
  addVariation: (gameId: string, branchFromMoveIndex: number) => void;
  deleteVariation: (gameId: string, variationId: string) => void;
  addVariationMove: (
    gameId: string,
    variationId: string,
    move: VariationMove
  ) => void;
  deleteVariationMovesAfter: (
    gameId: string,
    variationId: string,
    moveIndex: number
  ) => void;
  saveVariationAnalysis: (
    gameId: string,
    variationId: string,
    moveIndex: number,
    text: string
  ) => void;
  deleteVariationAnalysis: (
    gameId: string,
    variationId: string,
    moveIndex: number
  ) => void;
};
// eslint-disable-next-line react-refresh/only-export-components
export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

function GameProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<GameData[]>(() => {
    try {
      const savedGames = localStorage.getItem("ryabina-games");
      if (savedGames) {
        return JSON.parse(savedGames) as GameData[];
      }
    } catch (error) {
      console.error("Failed to load saved games:", error);
    }
    return initialGames;
  });

  useEffect(() => {
    try {
      localStorage.setItem("ryabina-games", JSON.stringify(games));
    } catch (error) {
      console.error("Failed to save games:", error);
    }
  }, [games]);

  const addGame = (game: Omit<GameData, "id">) => {
    const id = `${game.white}-vs-${game.black}-${Date.now()}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newGame: GameData = { id, ...game };

    setGames((previousGames) => [...previousGames, newGame]);
  };

  const updateGame = (id: string, updatedGame: Omit<GameData, "id">) => {
    setGames((previousGames) =>
      previousGames.map((game) =>
        game.id === id ? { id, ...updatedGame } : game
      )
    );
  };

  const deleteGame = (id: string) => {
    setGames((previousGames) =>
      previousGames.filter((game) => game.id !== id)
    );
  };

  const saveAnalysis = (
    gameId: string,
    moveIndex: number,
    text: string
  ) => {
    setGames((previousGames) =>
      previousGames.map((game) => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          analysis: { ...(game.analysis ?? {}), [moveIndex]: text },
        };
      })
    );
  };

  const deleteAnalysis = (gameId: string, moveIndex: number) => {
    setGames((previousGames) =>
      previousGames.map((game) => {
        if (game.id !== gameId) return game;
        const updatedAnalysis = { ...(game.analysis ?? {}) };
        delete updatedAnalysis[moveIndex];
        return { ...game, analysis: updatedAnalysis };
      })
    );
  };

  const addVariation = (gameId: string, branchFromMoveIndex: number) => {
    const variation: Variation = {
      id: crypto.randomUUID(),
      branchFromMoveIndex,
      moves: [],
      analysis: {},
    };

    setGames((previousGames) =>
      previousGames.map((game) => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          variations: [...(game.variations ?? []), variation],
        };
      })
    );
  };

  const deleteVariation = (gameId: string, variationId: string) => {
    setGames((previousGames) =>
      previousGames.map((game) => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          variations: (game.variations ?? []).filter(
            (variation) => variation.id !== variationId
          ),
        };
      })
    );
  };

  const addVariationMove = (
    gameId: string,
    variationId: string,
    move: VariationMove
  ) => {
    setGames((previousGames) =>
      previousGames.map((game) => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          variations: (game.variations ?? []).map((variation) => {
            if (variation.id !== variationId) return variation;
            return { ...variation, moves: [...variation.moves, move] };
          }),
        };
      })
    );
  };

  const deleteVariationMovesAfter = (
    gameId: string,
    variationId: string,
    moveIndex: number
  ) => {
    setGames((previousGames) =>
      previousGames.map((game) => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          variations: (game.variations ?? []).map((variation) => {
            if (variation.id !== variationId) return variation;
            return {
              ...variation,
              moves: variation.moves.slice(0, moveIndex + 1),
            };
          }),
        };
      })
    );
  };

  const saveVariationAnalysis = (
    gameId: string,
    variationId: string,
    moveIndex: number,
    text: string
  ) => {
    setGames((previousGames) =>
      previousGames.map((game) => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          variations: (game.variations ?? []).map((variation) => {
            if (variation.id !== variationId) return variation;
            return {
              ...variation,
              analysis: { ...(variation.analysis ?? {}), [moveIndex]: text },
            };
          }),
        };
      })
    );
  };

  const deleteVariationAnalysis = (
    gameId: string,
    variationId: string,
    moveIndex: number
  ) => {
    setGames((previousGames) =>
      previousGames.map((game) => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          variations: (game.variations ?? []).map((variation) => {
            if (variation.id !== variationId) return variation;
            const updatedAnalysis = { ...(variation.analysis ?? {}) };
            delete updatedAnalysis[moveIndex];
            return { ...variation, analysis: updatedAnalysis };
          }),
        };
      })
    );
  };

  return (
    <GameContext.Provider
      value={{
        games,
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