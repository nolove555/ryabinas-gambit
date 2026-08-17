import { useNavigate } from "react-router-dom";
import type { GameData } from "../../data/games";

type GameCardProps = {
  game: GameData;
};

function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/games/${game.id}`)}
      className="cursor-pointer overflow-hidden rounded-xl border border-[#49351f] bg-[#0c0e0d] transition-transform duration-200 hover:-translate-y-1 hover:border-[#76542b]"
    >

      {/* Temporary image */}

      <div className="flex h-40 items-center justify-center bg-[#181611]">

        <span className="font-serif text-5xl text-[#705c3b]">
          ♟
        </span>

      </div>


      {/* Game information */}

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

      </div>

    </article>
  );
}

export default GameCard;