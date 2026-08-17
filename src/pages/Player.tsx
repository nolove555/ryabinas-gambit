import { ArrowLeft, Trophy } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { players } from "../data/players";
import { useGames } from "../context/GameContext";
import GameCard from "../components/layout/GameCard";

function Player() {
  const { games } = useGames();
  const { playerId } = useParams();

  const player = players.find(
    (player) => player.id === playerId
  );

  /*
   * --------------------------------------------------
   * PLAYER NOT FOUND
   * --------------------------------------------------
   */

  if (!player) {
    return (
      <div className="min-h-screen bg-[#080a09] p-10 text-[#d4c4a6]">

        <h1 className="font-serif text-3xl">
          Player not found
        </h1>

        <p className="mt-3 text-[#786d5b]">
          There is no player with that identity
          in the library.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-[#a67b36] hover:text-[#d4c4a6]"
        >
          <ArrowLeft size={16} />

          Return home
        </Link>

      </div>
    );
  }


  /*
   * --------------------------------------------------
   * FIND PLAYER'S GAMES
   * --------------------------------------------------
   */

  const playerGames = games.filter(
    (game) =>
      game.white === player.name ||
      game.black === player.name
  );


  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#080a09] px-10 py-12">

      {/* ==================================================
          BACK
          ================================================== */}

      <Link
        to="/"
        className="inline-flex items-center gap-2 font-serif text-sm text-[#806c4e] transition-colors hover:text-[#d4c4a6]"
      >
        <ArrowLeft size={16} />

        Back to home
      </Link>


      {/* ==================================================
          PLAYER HEADER
          ================================================== */}

      <section className="mt-8 border-b border-[#2b2117] pb-10">

        <div className="flex items-start gap-6">

          {/* PLAYER ICON */}

          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-[#493822] bg-[#181611] text-5xl text-[#705c3b]">
            ♟
          </div>


          {/* PLAYER INFORMATION */}

          <div>

            <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">
              GRANDMASTER
            </p>

            <h1 className="mt-2 font-serif text-5xl text-[#d9c8aa]">
              {player.name}
            </h1>

            <p className="mt-2 font-serif text-sm text-[#8e806b]">
              {player.title} · {player.country}
            </p>

            <p className="mt-5 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">
              {player.description}
            </p>

          </div>

        </div>


        {/* ==================================================
            PLAYER STATISTICS
            ================================================== */}

        <div className="mt-8 grid max-w-3xl grid-cols-3 gap-4">

          <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">

            <p className="text-xs tracking-[0.15em] text-[#786d5b]">
              RATING
            </p>

            <p className="mt-2 font-serif text-2xl text-[#b73527]">
              {player.rating}
            </p>

          </div>


          <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">

            <p className="text-xs tracking-[0.15em] text-[#786d5b]">
              GAMES
            </p>

            <p className="mt-2 font-serif text-2xl text-[#b73527]">
              {player.games}
            </p>

          </div>


          <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">

            <p className="text-xs tracking-[0.15em] text-[#786d5b]">
              ARCHIVE
            </p>

            <p className="mt-2 flex items-center gap-2 font-serif text-2xl text-[#b73527]">

              <Trophy size={20} />

              Active

            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          PLAYER GAMES
          ================================================== */}

      <section className="mt-10">

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="font-serif text-xs tracking-[0.2em] text-[#806c4e]">
              THE ARCHIVE
            </p>

            <h2 className="mt-2 font-serif text-3xl text-[#d4c4a6]">
              Games by {player.name}
            </h2>

          </div>

          <p className="font-serif text-sm text-[#786d5b]">
            {playerGames.length} games
          </p>

        </div>


        {playerGames.length > 0 ? (

          <div className="grid grid-cols-3 gap-5">

            {playerGames.map((game) => (

              <GameCard
                key={game.id}
                game={game}
              />

            ))}

          </div>

        ) : (

          <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-12 text-center">

            <p className="font-serif text-[#786d5b]">
              No games from this player have
              been added to the library yet.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default Player;