import GameCard from "../components/layout/GameCard";
import { games } from "../data/games";

function Games() {
  return (
    <div className="min-h-screen bg-[#080a09] px-10 py-12">

      {/* Header */}
      <header className="border-b border-[#2b2117] pb-8">

        <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">
          THE LIBRARY
        </p>

        <h1 className="mt-3 font-serif text-5xl text-[#d9c8aa]">
          Games
        </h1>

        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">
          Explore games as ideas, positions, decisions, mistakes, and moments of clarity.
        </p>

      </header>

      {/* Game count */}
      <div className="flex items-center justify-between py-8">

        <p className="font-serif text-sm text-[#786d5b]">
          {games.length} games in the library
        </p>

        <button className="rounded-lg border border-[#49351f] px-5 py-3 font-serif text-sm text-[#cdbd9f] transition-colors hover:bg-[#17130f]">
          Filter
        </button>

      </div>

      {/* Games */}
      <div className="grid grid-cols-3 gap-5">

        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
          />
        ))}

      </div>

    </div>
  );
}

export default Games;