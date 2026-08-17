import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { GameData } from "../data/games";
import { games as initialGames } from "../data/games";


type GameContextType = {
  games: GameData[];

  addGame: (
    game: Omit<GameData, "id">
  ) => void;

  updateGame: (
    id: string,
    updatedGame: Omit<GameData, "id">
  ) => void;

  deleteGame: (
    id: string
  ) => void;
};


const GameContext =
  createContext<GameContextType | undefined>(
    undefined
  );


function GameProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  /*
   * --------------------------------------------------
   * LOAD GAMES
   * --------------------------------------------------
   *
   * First try localStorage.
   *
   * If nothing exists yet, use the games
   * from games.ts.
   */

  const [games, setGames] =
    useState<GameData[]>(() => {

      try {
        const savedGames =
          localStorage.getItem(
            "ryabina-games"
          );

        if (savedGames) {
          return JSON.parse(
            savedGames
          ) as GameData[];
        }
      } catch (error) {
        console.error(
          "Failed to load saved games:",
          error
        );
      }

      return initialGames;
    });


  /*
   * --------------------------------------------------
   * SAVE GAMES
   * --------------------------------------------------
   *
   * Every time games changes, update
   * localStorage.
   */

  useEffect(() => {

    try {
      localStorage.setItem(
        "ryabina-games",
        JSON.stringify(games)
      );
    } catch (error) {
      console.error(
        "Failed to save games:",
        error
      );
    }

  }, [games]);


  /*
   * --------------------------------------------------
   * ADD GAME
   * --------------------------------------------------
   */

  const addGame = (
    game: Omit<GameData, "id">
  ) => {

    const id =
      `${game.white}-vs-${game.black}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");


    const newGame: GameData = {
      id,
      ...game,
    };


    setGames((previousGames) => [
      ...previousGames,
      newGame,
    ]);
  };


  /*
   * --------------------------------------------------
   * UPDATE GAME
   * --------------------------------------------------
   */

  const updateGame = (
    id: string,
    updatedGame: Omit<GameData, "id">
  ) => {

    setGames((previousGames) =>
      previousGames.map((game) =>
        game.id === id
          ? {
              id,
              ...updatedGame,
            }
          : game
      )
    );
  };


  /*
   * --------------------------------------------------
   * DELETE GAME
   * --------------------------------------------------
   */

  const deleteGame = (
    id: string
  ) => {

    setGames((previousGames) =>
      previousGames.filter(
        (game) => game.id !== id
      )
    );
  };


  return (
    <GameContext.Provider
      value={{
        games,
        addGame,
        updateGame,
        deleteGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}


/*
 * --------------------------------------------------
 * CUSTOM HOOK
 * --------------------------------------------------
 */

export function useGames() {

  const context =
    useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGames must be used inside GameProvider"
    );
  }

  return context;
}


export default GameProvider;