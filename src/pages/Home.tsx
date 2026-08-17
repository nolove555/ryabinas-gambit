import {
  Plus,
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Hero from "../components/layout/Hero";
import StatsPanel from "../components/layout/StatsPanel";
import FeaturedGames from "../components/layout/FeaturedGames";


function Home() {
  return (
    <div className="min-h-screen bg-[#080a09]">

      <Hero />

      <StatsPanel />


      {/* ==================================================
          ADD GAME
          ================================================== */}

      <section className="px-10 py-6">

        <div className="flex items-center justify-between overflow-hidden rounded-xl border border-[#49351f] bg-[#0c0e0d] px-7 py-6">

          <div>

            <p className="font-serif text-xs tracking-[0.2em] text-[#806c4e]">
              CONTRIBUTE TO THE ARCHIVE
            </p>

            <h2 className="mt-2 font-serif text-2xl text-[#d4c4a6]">
              Add a game to Ryabina's Gambit
            </h2>

            <p className="mt-2 max-w-xl font-serif text-sm leading-relaxed text-[#786d5b]">
              Add a position worth studying,
              annotate it, and give it a place
              in the archive.
            </p>

          </div>


          <Link
            to="/games/add"
            className="flex shrink-0 items-center gap-3 rounded-lg bg-[#a72c20] px-6 py-4 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
          >

            <Plus size={18} />

            Add Game

            <ArrowRight size={17} />

          </Link>

        </div>

      </section>


      <FeaturedGames />

    </div>
  );
}


export default Home;