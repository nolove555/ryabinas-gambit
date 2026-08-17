import { useParams } from "react-router-dom";
import { useGames } from "../context/GameContext";
import ChessGame from "../components/chess/ChessGame";

function Game() {
  const { games } = useGames();
  const { gameId } = useParams();

  const game = games.find(
    (game) => game.id === gameId
  );

  if (!game) {
    return (
      <div className="min-h-screen bg-[#080a09] p-10 text-[#d4c4a6]">

        <h1 className="font-serif text-3xl">
          Game not found
        </h1>

        <p className="mt-3 text-[#786d5b]">
          The game you're looking for doesn't exist.
        </p>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a09] p-10">

      {/* GAME HEADER */}

      <section className="mb-8">

        <p className="text-xs tracking-[0.2em] text-[#806c4e]">
          {game.event}
        </p>

        <h1 className="mt-2 font-serif text-4xl text-[#d4c4a6]">
          {game.players}
        </h1>

        <div className="mt-3 flex gap-6 text-sm text-[#786d5b]">

          <span>
            White: {game.white}
          </span>

          <span>
            Black: {game.black}
          </span>

        </div>

      </section>

      {/* CHESS WORKSPACE */}

      <section className="rounded-xl border border-[#352819] bg-[#080a09] p-6">

        <ChessGame
          pgn={game.pgn}
        />

      </section>

    </div>
  );
}

export default Game;