import GameCard from "./GameCard";

const games = [
  {
    players: "Tal vs Petrosian",
    event: "1960 Candidates",
    category: "Brilliant Attack",
    rating: "4.9",
  },
  {
    players: "Kasparov vs Topalov",
    event: "Wijk aan Zee 1999",
    category: "Deep Preparation",
    rating: "4.8",
  },
  {
    players: "Carlsen vs Anand",
    event: "World Championship 2014",
    category: "Endgame Mastery",
    rating: "4.9",
  },
  {
    players: "Fischer vs Spassky",
    event: "Reykjavik 1972",
    category: "The Match of the Century",
    rating: "5.0",
  },
  {
    players: "Karpov vs Kasparov",
    event: "Moscow 1985",
    category: "World Championship",
    rating: "4.8",
  },
];

function FeaturedGames() {
  return (
    <section className="border-t border-[#2b2117] px-10 py-8">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="font-serif text-lg tracking-[0.15em] text-[#cdbd9f]">
          ✦ FEATURED GAMES
        </h2>

        <button className="font-serif text-sm text-[#9f8250]">
          View all →
        </button>

      </div>

      <div className="grid grid-cols-5 gap-4">

        {games.map((game) => (
          <GameCard
            key={game.players}
            {...game}
          />
        ))}

      </div>

    </section>
  );
}

export default FeaturedGames;