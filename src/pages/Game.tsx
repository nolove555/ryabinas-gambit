// src/pages/Game.tsx — full replace
import { useState } from "react";
import { ArrowLeft, Edit, Edit3, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useGames } from "../hooks/useGames";
import ChessGame from "../components/chess/ChessGame";

function Game() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { games, deleteGame } = useGames();
  const [editingMoves, setEditingMoves] = useState(false);

  const game = games.find((game) => game.id === gameId);

  if (!game) {
    return (
      <div className="min-h-screen bg-[#080a09] p-10">
        <h1 className="font-serif text-3xl text-[#d4c4a6]">Game not found</h1>

        <p className="mt-3 text-[#786d5b]">The game you're looking for doesn't exist.</p>

        <Link
          to="/games"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#49351f] px-5 py-3 font-serif text-sm text-[#cdbd9f] hover:bg-[#17130f]"
        >
          <ArrowLeft size={16} />
          Back to Library
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${game.players}" from the library?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;
    await deleteGame(game.id);
    navigate("/games");
  };

  return (
    <div className="min-h-screen bg-[#080a09] px-6 py-10 md:p-10">
      <section className="mb-8">
        <Link
          to="/games"
          className="mb-6 inline-flex items-center gap-2 font-serif text-sm text-[#806c4e] transition-colors hover:text-[#d4c4a6]"
        >
          <ArrowLeft size={16} />
          Back to Library
        </Link>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#806c4e]">{game.event}</p>

            <h1 className="mt-2 font-serif text-3xl text-[#d4c4a6] md:text-4xl">{game.players}</h1>

            <div className="mt-3 flex gap-6 text-sm text-[#786d5b]">
              <span>White: {game.white || "?"}</span>
              <span>Black: {game.black || "?"}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={() => setEditingMoves((prev) => !prev)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 font-serif text-sm transition-colors ${
                editingMoves
                  ? "border-[#76542b] bg-[#17130f] text-[#d4c4a6]"
                  : "border-[#49351f] text-[#cdbd9f] hover:bg-[#17130f]"
              }`}
            >
              <Edit3 size={16} />
              {editingMoves ? "Editing Moves..." : "Edit Moves"}
            </button>

            <Link
              to={`/games/edit/${game.id}`}
              className="flex items-center gap-2 rounded-lg border border-[#49351f] px-4 py-3 font-serif text-sm text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
            >
              <Edit size={16} />
              Edit Details
            </Link>

            <button
              onClick={() => void handleDelete()}
              className="flex items-center gap-2 rounded-lg border border-[#5a2820] px-4 py-3 font-serif text-sm text-[#b73527] transition-colors hover:bg-[#241512]"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#352819] bg-[#080a09] p-4 md:p-6">
        <ChessGame
          pgn={game.pgn}
          gameId={game.id}
          editMode={editingMoves}
          onExitEditMode={() => setEditingMoves(false)}
        />
      </section>
    </div>
  );
}

export default Game;