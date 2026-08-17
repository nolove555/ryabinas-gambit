import Hero from "../components/layout/Hero";
import StatsPanel from "../components/layout/StatsPanel";
import FeaturedGames from "../components/layout/FeaturedGames";

function Home() {
  return (
    <div className="min-h-screen bg-[#080a09]">
      <Hero />
      <StatsPanel />
      <FeaturedGames />
    </div>
  );
}

export default Home;