// src/pages/Analysis.tsx — full replace
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useGames } from "../hooks/useGames";
import GameCard from "../components/layout/GameCard";
import type { GameData, Variation } from "../data/games";

function Analysis() {
  const { games } = useGames();

  const analyzedGames = games.filter((game: GameData) => {
    const hasMainAnalysis =
      game.analysis && Object.keys(game.analysis).length > 0;

    const hasVariationAnalysis = (game.variations ?? []).some(
      (variation: Variation) =>
        variation.analysis && Object.keys(variation.analysis).length > 0
    );

    return hasMainAnalysis || hasVariationAnalysis;
  });

  return (
    <div className="min-h-screen bg-[#080a09] px-6 py-12 md:px-10">
      <header className="border-b border-[#2b2117] pb-8">
        <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">
          YOUR NOTES
        </p>

        <h1 className="mt-3 font-serif text-4xl text-[#d9c8aa] md:text-5xl">
          Saved Analysis
        </h1>

        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">
          Games with at least one written note, on the main line or a
          variation.
        </p>
      </header>

      <section className="mt-8">
        {analyzedGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {analyzedGames.map((game: GameData) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#49351f] bg-[#181611]">
              <Bookmark size={22} className="text-[#806c4e]" />
            </div>

            <h2 className="mt-5 font-serif text-xl text-[#d4c4a6]">
              No analysis yet
            </h2>

            <p className="mx-auto mt-2 max-w-md font-serif text-sm leading-relaxed text-[#786d5b]">
              Open a game and write a note on any move to see it here.
            </p>

            <Link
              to="/games"
              className="mt-6 inline-block rounded-lg bg-[#a72c20] px-5 py-3 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
            >
              Browse Library
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Analysis;