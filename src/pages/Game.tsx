import { Link, useParams } from "react-router-dom";
import { games } from "../data/games";

function Game() {
  const { gameId } = useParams();

  const game = games.find((game) => game.id === gameId);

  if (!game) {
    return (
      <div className="min-h-screen bg-[#080a09] px-10 py-16 text-[#d8c7a5]">
        <h1 className="font-serif text-4xl text-[#b73527]">
          Game not found
        </h1>

        <p className="mt-4 text-[#8e806b]">
          The game you're looking for doesn't exist.
        </p>

        <Link
          to="/games"
          className="mt-8 inline-block rounded-lg bg-[#a92d20] px-6 py-3 font-serif text-sm text-[#f0d8b0]"
        >
          Back to Games
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a09] px-10 py-10 text-[#d8c7a5]">

      {/* Back */}
      <Link
        to="/games"
        className="text-sm text-[#9f8250] transition-colors hover:text-[#d8c7a5]"
      >
        ← Back to Games
      </Link>

      {/* Header */}
      <header className="mt-8 border-b border-[#2b2117] pb-8">

        <p className="font-serif text-sm tracking-[0.2em] text-[#806c4e]">
          {game.event}
        </p>

        <h1 className="mt-3 font-serif text-5xl text-[#d9c8aa]">
          {game.players}
        </h1>

        <div className="mt-4 flex items-center gap-4">

          <span className="rounded-md bg-[#321b16] px-3 py-1 text-xs text-[#c85a45]">
            {game.category}
          </span>

          <span className="text-sm text-[#c08b3c]">
            ★ {game.rating.toFixed(1)}
          </span>

        </div>

      </header>

      {/* Main game area */}
      <div className="mt-10 grid grid-cols-[minmax(400px,700px)_1fr] gap-10">

        {/* Chess board placeholder */}
        <section className="rounded-xl border border-[#49351f] bg-[#0c0e0d] p-5">

          <div className="aspect-square w-full overflow-hidden rounded-lg">
            <img
              src="/images/chess-image.png"
              alt={`${game.players} chess game`}
              className="h-full w-full object-cover"
            />
          </div>

        </section>

        {/* Analysis */}
        <section className="rounded-xl border border-[#49351f] bg-[#0c0e0d] p-6">

          <h2 className="font-serif text-xl text-[#d4c4a6]">
            Analysis
          </h2>

          <p className="mt-2 text-sm text-[#786d5b]">
            Human analysis for this game will appear here.
          </p>

          <div className="mt-8 rounded-lg border border-[#352819] bg-[#080a09] p-5">

            <p className="text-xs tracking-[0.15em] text-[#806c4e]">
              CURRENT POSITION
            </p>

            <p className="mt-3 font-serif text-lg text-[#d8c7a5]">
              Starting position
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Game;