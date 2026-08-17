import {
  Search,
  ArrowRight,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-[620px] overflow-hidden border-b border-[#2b2117] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/images/background.png')",
      }}
    >

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-black/70" />


      {/* ==================================================
          TOP BAR
          ================================================== */}

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-8 md:px-10">

        {/* SEARCH */}

        <div className="flex w-full max-w-[370px] items-center gap-3 rounded-xl border border-[#3a2b1b] bg-[#0b0d0c]/80 px-4 py-3">

          <Search
            size={17}
            className="text-[#956b32]"
          />

          <input
            type="text"
            placeholder="Search games, players, ideas..."
            className="w-full bg-transparent font-serif text-sm text-[#d8c7a5] outline-none placeholder:text-[#71634f]"
          />

        </div>


        {/* ACCOUNT BUTTONS */}

        <div className="flex items-center gap-3">


          <button
            type="button"
            className="rounded-lg border border-[#49351f] px-6 py-3 font-serif text-sm text-[#d3c2a2] transition-colors hover:bg-[#17130f]"
          >
            Log in
          </button>

          <button
            type="button"
            className="rounded-lg bg-[#a72c20] px-6 py-3 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
          >
            Join Ryabina
          </button>

        </div>

      </div>


      {/* ==================================================
          HERO CONTENT
          ================================================== */}

        <div className="relative z-10 grid grid-cols-1 gap-10 px-6 pt-10 md:grid-cols-[1fr_1.2fr] md:px-12">
        {/* TEXT */}

        <div className="max-w-xl pt-10">

          <h1 className="font-serif text-5xl leading-[1.1] text-[#d9c8aa]">

            Chess
            <br />

            Analyzed by

            <br />

            <span className="text-[#b43225]">
              Humans
            </span>

            <br />

            of All Ratings

          </h1>


          <p className="mt-8 max-w-md font-serif text-lg leading-relaxed text-[#8e806b]">
            See how other players of all
            ratings think. Learn from the
            higher rated, and recognize the
            mistakes of others.
          </p>


          {/* BUTTONS */}

          <div className="mt-8 flex gap-4">

            <button
              onClick={() =>
                navigate("/games")
              }
              className="flex items-center gap-5 rounded-lg bg-[#a92d20] px-6 py-4 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
            >
              Explore Games

              <ArrowRight size={18} />

            </button>


            <button
              type="button"
              className="flex items-center gap-3 rounded-lg border border-[#594124] px-6 py-4 font-serif text-sm text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
            >
              How it works

              <PlayCircle size={17} />

            </button>

          </div>

        </div>


        {/* ==================================================
            CHESS IMAGE
            ================================================== */}

        <div className="flex items-center justify-center">

          <div className="relative flex h-[430px] w-[430px] items-center justify-center">

            <div className="absolute inset-0 rounded-full border border-[#5a421f]/50" />

            <div className="absolute inset-8 rounded-full border border-[#5a421f]/30" />


            <img
              src="/images/chess-image.png"
              alt="Ryabina's Gambit chess composition"
              className="relative z-10 h-[800px] w-[800px] max-w-none object-contain"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;