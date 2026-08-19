// src/context/PlayerContext.tsx — new file
import { createContext, useEffect, useState } from "react";
import type { PlayerData } from "../data/players";

const API_URL = "http://localhost:4000";

type PlayerContextType = {
  players: PlayerData[];
  loading: boolean;
  refetch: () => Promise<void>;
  addPlayer: (player: Omit<PlayerData, "id">) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/players`);
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/players`);
        const data = await res.json();
        if (!cancelled) setPlayers(data);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addPlayer = async (player: Omit<PlayerData, "id">) => {
    await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    await refetch();
  };

  const deletePlayer = async (id: string) => {
    await fetch(`${API_URL}/players/${id}`, { method: "DELETE" });
    await refetch();
  };

  return (
    <PlayerContext.Provider value={{ players, loading, refetch, addPlayer, deletePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export default PlayerProvider;