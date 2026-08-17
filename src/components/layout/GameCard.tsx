type GameCardProps = {
  players: string;
  event: string;
  category: string;
  rating: string;
};

function GameCard({
  players,
  event,
  category,
  rating,
}: GameCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#49351f] bg-[#0c0e0d]">

      {/* Temporary image */}
      <div className="flex h-40 items-center justify-center bg-[#181611]">
        <span className="font-serif text-5xl text-[#705c3b]">
          ♟
        </span>
      </div>

      <div className="p-4">

        <h3 className="font-serif text-base text-[#d4c4a6]">
          {players}
        </h3>

        <p className="mt-1 text-xs text-[#786d5b]">
          {event}
        </p>

        <div className="mt-4 flex items-center justify-between">

          <span className="rounded-md bg-[#321b16] px-2 py-1 text-[10px] text-[#c85a45]">
            {category}
          </span>

          <span className="text-sm text-[#c08b3c]">
            ★ {rating}
          </span>

        </div>

      </div>

    </article>
  );
}

export default GameCard;