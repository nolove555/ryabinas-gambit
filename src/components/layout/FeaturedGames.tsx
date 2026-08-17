import { useNavigate } from "react-router-dom";
import GameCard from "./GameCard";
import { useGames } from "../../hooks/useGames";

function FeaturedGames() {
  const navigate = useNavigate();
  const { games } = useGames();

  return (
    <section className="border-t border-[#2b2117] px-10 py-8">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="font-serif text-lg tracking-[0.15em] text-[#cdbd9f]">
          ✦ FEATURED GAMES
        </h2>

        <button
          onClick={() => navigate("/games")}
          className="font-serif text-sm text-[#9f8250] hover:text-[#d4c4a6]"
        >
          View all →
        </button>

      </div>

      <div className="grid grid-cols-5 gap-4">

        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
          />
        ))}

      </div>

    </section>
  );
}

export default FeaturedGames;