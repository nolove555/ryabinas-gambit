import type { Game } from "../../data/games";
import { Link } from "react-router-dom";

type GameCardProps = {
  game: Game;
};

function GameCard({ game }: GameCardProps) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="group block overflow-hidden rounded-xl border border-[#49351f] bg-[#0c0e0d] transition-all duration-300 hover:-translate-y-1 hover:border-[#8a5d2a]"
    >
      {/* Image */}
      <div className="flex h-40 items-center justify-center overflow-hidden bg-[#181611]">
        <img
          src="/images/chess-image.png"
          alt={game.players}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Information */}
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
            ★ {game.rating.toFixed(1)}
          </span>

        </div>

      </div>
    </Link>
  );
}

export default GameCard;