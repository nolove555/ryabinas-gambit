// src/pages/Home.tsx — full replace
import { Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Hero from "../components/layout/Hero";
import FeaturedGames from "../components/layout/FeaturedGames";

function Home() {
  return (
    <div className="min-h-screen bg-[#080a09]">
      <Hero />

      <section className="px-6 py-6 md:px-10">
        <div className="flex flex-col items-start gap-4 overflow-hidden rounded-xl border border-[#49351f] bg-[#0c0e0d] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="font-serif text-xs tracking-[0.2em] text-[#806c4e]">
              CONTRIBUTE TO THE ARCHIVE
            </p>

            <h2 className="mt-2 font-serif text-2xl text-[#d4c4a6]">
              Add a game to Ryabina's Gambit
            </h2>

            <p className="mt-2 max-w-xl font-serif text-sm leading-relaxed text-[#786d5b]">
              Add a position worth studying, annotate it, and give it a
              place in the archive.
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