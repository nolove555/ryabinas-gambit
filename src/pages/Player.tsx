// src/pages/Player.tsx — full replace
import { useState } from "react";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { usePlayers } from "../hooks/usePlayers";
import { useGames } from "../hooks/useGames";
import GameCard from "../components/layout/GameCard";

function Player() {
  const navigate = useNavigate();
  const { players, deletePlayer } = usePlayers();
  const { games } = useGames();
  const { playerId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const player = players.find((player) => player.id === playerId);

  if (!player) {
    return (
      <div className="min-h-screen bg-[#080a09] p-10 text-[#d4c4a6]">
        <h1 className="font-serif text-3xl">Player not found</h1>

        <p className="mt-3 text-[#786d5b]">
          There is no player with that identity in the library.
        </p>

        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-[#a67b36] hover:text-[#d4c4a6]">
          <ArrowLeft size={16} />
          Return home
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${player.name}? This won't delete their games.`);
    if (!confirmed) return;
    await deletePlayer(player.id);
    navigate("/");
  };

  const playerGames = games.filter((game) => {
    const matchesPlayer =
      game.white.toLowerCase() === player.name.toLowerCase() ||
      game.black.toLowerCase() === player.name.toLowerCase() ||
      game.playerId === player.id;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      (game.event ?? "").toLowerCase().includes(query) ||
      (game.category ?? "").toLowerCase().includes(query);

    return matchesPlayer && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#080a09] px-6 py-12 md:px-10">
      <Link to="/" className="inline-flex items-center gap-2 font-serif text-sm text-[#806c4e] transition-colors hover:text-[#d4c4a6]">
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <section className="mt-8 border-b border-[#2b2117] pb-10">
        <div className="flex items-start gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#493822] bg-[#181611] text-5xl text-[#705c3b]">
            {player.imageUrl ? (
              <img src={player.imageUrl} alt={player.name} className="h-full w-full object-cover" />
            ) : (
              "♟"
            )}
          </div>

          <div>
            <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">GRANDMASTER</p>

            <h1 className="mt-2 font-serif text-5xl text-[#d9c8aa]">{player.name}</h1>

            <p className="mt-2 font-serif text-sm text-[#8e806b]">
              {[player.title, player.country].filter(Boolean).join(" · ")}
            </p>

            {player.description && (
              <p className="mt-5 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">
                {player.description}
              </p>
            )}

            <button
              onClick={() => void handleDelete()}
              className="mt-4 flex items-center gap-2 rounded-lg border border-[#5a2820] px-4 py-2 font-serif text-xs text-[#b73527] transition-colors hover:bg-[#241512]"
            >
              <Trash2 size={14} />
              Delete Grandmaster
            </button>
          </div>
        </div>

        {player.rating && (
          <div className="mt-8 grid max-w-sm grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">
              <p className="text-xs tracking-[0.15em] text-[#786d5b]">RATING</p>
              <p className="mt-2 font-serif text-2xl text-[#b73527]">{player.rating}</p>
            </div>

            <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">
              <p className="text-xs tracking-[0.15em] text-[#786d5b]">GAMES</p>
              <p className="mt-2 font-serif text-2xl text-[#b73527]">{playerGames.length}</p>
            </div>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-xs tracking-[0.2em] text-[#806c4e]">THE ARCHIVE</p>
            <h2 className="mt-2 font-serif text-3xl text-[#d4c4a6]">Games by {player.name}</h2>
          </div>

          <p className="font-serif text-sm text-[#786d5b]">{playerGames.length} games</p>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-lg border border-[#49351f] bg-[#0c0e0d] px-4 py-3">
          <Search size={16} className="text-[#956b32]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Filter by event or category..."
            className="w-full bg-transparent font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#5f5649]"
          />
        </div>

        {playerGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {playerGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-12 text-center">
            <p className="font-serif text-[#786d5b]">
              No games from this player have been added to the library yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Player;