import {
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useGames } from "../hooks/useGames";

import ChessGame from "../components/chess/ChessGame";


function Game() {

  const navigate =
    useNavigate();

  const { gameId } =
    useParams();

  const {
    games,
    deleteGame,
  } = useGames();


  const game =
    games.find(
      (game) =>
        game.id === gameId
    );


  /*
   * --------------------------------------------------
   * GAME NOT FOUND
   * --------------------------------------------------
   */

  if (!game) {

    return (
      <div className="min-h-screen bg-[#080a09] p-10">

        <h1 className="font-serif text-3xl text-[#d4c4a6]">
          Game not found
        </h1>

        <p className="mt-3 text-[#786d5b]">
          The game you're looking for doesn't exist.
        </p>

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


  /*
   * --------------------------------------------------
   * DELETE
   * --------------------------------------------------
   */

  const handleDelete =
    () => {

      const confirmed =
        window.confirm(
          `Delete "${game.players}" from the library?\n\nThis cannot be undone.`
        );


      if (!confirmed) {
        return;
      }


      deleteGame(
        game.id
      );


      navigate(
        "/games"
      );
    };


  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#080a09] p-10">

      {/* ==================================================
          HEADER
          ================================================== */}

      <section className="mb-8">

        <Link
          to="/games"
          className="mb-6 inline-flex items-center gap-2 font-serif text-sm text-[#806c4e] transition-colors hover:text-[#d4c4a6]"
        >

          <ArrowLeft size={16} />

          Back to Library

        </Link>


        <div className="flex items-start justify-between gap-8">

          <div>

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

          </div>


          {/* ACTIONS */}

          <div className="flex shrink-0 gap-2">

            <Link
              to={`/games/edit/${game.id}`}
              className="flex items-center gap-2 rounded-lg border border-[#49351f] px-4 py-3 font-serif text-sm text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
            >

              <Edit size={16} />

              Edit

            </Link>


            <button
              onClick={
                handleDelete
              }
              className="flex items-center gap-2 rounded-lg border border-[#5a2820] px-4 py-3 font-serif text-sm text-[#b73527] transition-colors hover:bg-[#241512]"
            >

              <Trash2 size={16} />

              Delete

            </button>

          </div>

        </div>

      </section>


      {/* ==================================================
          CHESS WORKSPACE
          ================================================== */}

      <section className="rounded-xl border border-[#352819] bg-[#080a09] p-6">

        <ChessGame
  pgn={game.pgn}
  gameId={game.id}
/>

      </section>

    </div>
  );
}


export default Game;