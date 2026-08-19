// src/hooks/usePlayers.ts — new file
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

export function usePlayers() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayers must be used inside PlayerProvider");
  }
  return context;
}