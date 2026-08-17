import {
  Edit,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type { GameData } from "../../data/games";

import { useGames } from "../../hooks/useGames";


type GameCardProps = {
  game: GameData;
};


function GameCard({
  game,
}: GameCardProps) {

  const navigate =
    useNavigate();

  const {
    deleteGame,
  } = useGames();


  /*
   * --------------------------------------------------
   * DELETE
   * --------------------------------------------------
   */

  const handleDelete = (
    event: React.MouseEvent
  ) => {

    /*
     * Prevent the card's main click
     * from opening the game.
     */

    event.stopPropagation();


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
  };


  /*
   * --------------------------------------------------
   * EDIT
   * --------------------------------------------------
   */

  const handleEdit = (
    event: React.MouseEvent
  ) => {

    event.stopPropagation();


    navigate(
      `/games/edit/${game.id}`
    );
  };


  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <article
      onClick={() =>
        navigate(
          `/games/${game.id}`
        )
      }
      className="cursor-pointer overflow-hidden rounded-xl border border-[#49351f] bg-[#0c0e0d] transition-transform duration-200 hover:-translate-y-1 hover:border-[#76542b]"
    >

      {/* IMAGE */}

      <div className="flex h-40 items-center justify-center bg-[#181611]">

        <span className="font-serif text-5xl text-[#705c3b]">
          ♟
        </span>

      </div>


      {/* INFORMATION */}

      <div className="p-4">

        <h3 className="font-serif text-base text-[#d4c4a6]">
          {game.players}
        </h3>


        <p className="mt-1 text-xs text-[#786d5b]">
          {game.event}
        </p>


        <div className="mt-4 flex items-center justify-between">

          <span className="rounded-md bg-[#321b16] px-2 py-1 text-[10px] text-[#c85a45]">
            {game.category}
          </span>


          <span className="text-sm text-[#c08b3c]">
            ★ {game.rating}
          </span>

        </div>


        {/* ACTION BUTTONS */}

        <div className="mt-4 flex gap-2">

          <button
            onClick={
              handleEdit
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#49351f] px-3 py-2 text-xs text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
          >

            <Edit size={14} />

            Edit

          </button>


          <button
            onClick={
              handleDelete
            }
            className="flex items-center justify-center rounded-lg border border-[#5a2820] px-3 py-2 text-xs text-[#b73527] transition-colors hover:bg-[#241512]"
            title="Delete game"
          >

            <Trash2 size={14} />

          </button>

        </div>

      </div>

    </article>
  );
}


export default GameCard;