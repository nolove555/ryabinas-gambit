// src/pages/Games.tsx — full replace
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import GameCard from "../components/layout/GameCard";
import { useGames } from "../hooks/useGames";
import type { GameData } from "../data/games";

function Games() {
  const { games } = useGames();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(games.map((game: GameData) => game.category))),
  ];

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return games.filter((game: GameData) => {
      const matchesSearch =
        query === "" ||
        game.players.toLowerCase().includes(query) ||
        game.white.toLowerCase().includes(query) ||
        game.black.toLowerCase().includes(query) ||
        game.event.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || game.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, games]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const filtersActive = searchQuery !== "" || selectedCategory !== "All";

  return (
    <div className="min-h-screen bg-[#080a09] px-6 py-12 md:px-10">
      <header className="border-b border-[#2b2117] pb-8">
        <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">
          THE LIBRARY
        </p>

        <h1 className="mt-3 font-serif text-4xl text-[#d9c8aa] md:text-5xl">
          Games
        </h1>

        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">
          Explore games as ideas, positions, decisions, mistakes, and
          moments of clarity.
        </p>
      </header>

      <section className="py-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-lg border border-[#49351f] bg-[#0c0e0d] px-4 py-3">
            <Search size={17} className="shrink-0 text-[#956b32]" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search players, events, categories..."
              className="w-full bg-transparent font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#5f5649]"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#786d5b] transition-colors hover:text-[#d4c4a6]"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#49351f] px-5 py-3 font-serif text-sm text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 font-serif text-xs transition-colors ${
                selectedCategory === category
                  ? "border-[#7c3428] bg-[#321712] text-[#d75a45]"
                  : "border-[#49351f] text-[#786d5b] hover:bg-[#17130f] hover:text-[#cdbd9f]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif text-sm text-[#786d5b]">
          Showing{" "}
          <span className="text-[#cdbd9f]">{filteredGames.length}</span> of{" "}
          <span className="text-[#cdbd9f]">{games.length}</span> games
        </p>

        <div className="flex items-center gap-4">
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="font-serif text-xs text-[#9f8250] transition-colors hover:text-[#d4c4a6]"
            >
              Clear filters
            </button>
          )}

          <Link
            to="/games/add"
            className="rounded-lg bg-[#a72c20] px-5 py-3 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
          >
            + Add Game
          </Link>
        </div>
      </div>

      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game: GameData) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] px-6 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#49351f] bg-[#181611]">
            <Search size={22} className="text-[#806c4e]" />
          </div>

          <h2 className="mt-5 font-serif text-xl text-[#d4c4a6]">
            No games found
          </h2>

          <p className="mx-auto mt-2 max-w-md font-serif text-sm leading-relaxed text-[#786d5b]">
            Nothing in the library matches your search. Try another
            player, event, or category.
          </p>

          <button
            onClick={clearFilters}
            className="mt-6 rounded-lg bg-[#a72c20] px-5 py-3 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Games;