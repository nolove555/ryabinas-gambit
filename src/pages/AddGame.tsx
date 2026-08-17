import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import { useGames } from "../context/GameContext";

function AddGame() {
  
  const navigate = useNavigate();

  const { addGame } = useGames();

  const [white, setWhite] = useState("");
  const [black, setBlack] = useState("");
  const [event, setEvent] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [pgn, setPgn] = useState("");

  const [error, setError] = useState("");

  /*
   * --------------------------------------------------
   * SAVE GAME
   * --------------------------------------------------
   */

  const handleSubmit = (
  formEvent: React.FormEvent<HTMLFormElement>
) => {

  formEvent.preventDefault();

  setError("");


  /*
   * --------------------------------------------------
   * REQUIRED FIELDS
   * --------------------------------------------------
   */

  if (
    !white.trim() ||
    !black.trim() ||
    !event.trim() ||
    !category.trim() ||
    !rating.trim() ||
    !pgn.trim()
  ) {

    setError(
      "Every field is required."
    );

    return;
  }


  /*
   * --------------------------------------------------
   * VALIDATE PGN
   * --------------------------------------------------
   */

  try {

    const chess =
      new Chess();

    chess.loadPgn(
      pgn.trim()
    );

  } catch (error) {

    console.error(
      "Invalid PGN:",
      error
    );

    setError(
      "The PGN could not be read. Check that the moves are valid."
    );

    return;
  }


  /*
   * --------------------------------------------------
   * CREATE GAME
   * --------------------------------------------------
   */

  addGame({
    players:
      `${white.trim()} vs ${black.trim()}`,

    white:
      white.trim(),

    black:
      black.trim(),

    event:
      event.trim(),

    category:
      category.trim(),

    rating:
      rating.trim(),

    pgn:
      pgn.trim(),
  });


  /*
   * --------------------------------------------------
   * RETURN TO LIBRARY
   * --------------------------------------------------
   */

  navigate("/games");
};


  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#080a09] px-10 py-12">

      {/* ==================================================
          BACK
          ================================================== */}

      <Link
        to="/games"
        className="inline-flex items-center gap-2 font-serif text-sm text-[#806c4e] transition-colors hover:text-[#d4c4a6]"
      >
        <ArrowLeft size={16} />

        Back to library
      </Link>


      {/* ==================================================
          HEADER
          ================================================== */}

      <header className="mt-8 border-b border-[#2b2117] pb-8">

        <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">
          LIBRARY
        </p>

        <h1 className="mt-3 font-serif text-5xl text-[#d9c8aa]">
          Add Game
        </h1>

        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">
          Add a game to the Ryabina archive
          and give it a place in the library.
        </p>

      </header>


      {/* ==================================================
          FORM
          ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="mt-10 max-w-4xl"
      >

        {/* ==================================================
            PLAYERS
            ================================================== */}

        <section className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-6">

          <h2 className="font-serif text-xl text-[#d4c4a6]">
            Players
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-5">

            {/* WHITE */}

            <div>

              <label className="font-serif text-xs tracking-[0.15em] text-[#786d5b]">
                WHITE
              </label>

              <input
                value={white}
                onChange={(event) =>
                  setWhite(event.target.value)
                }
                placeholder="Mikhail Tal"
                className="mt-2 w-full rounded-lg border border-[#49351f] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#5f5649] focus:border-[#80602f]"
              />

            </div>


            {/* BLACK */}

            <div>

              <label className="font-serif text-xs tracking-[0.15em] text-[#786d5b]">
                BLACK
              </label>

              <input
                value={black}
                onChange={(event) =>
                  setBlack(event.target.value)
                }
                placeholder="Tigran Petrosian"
                className="mt-2 w-full rounded-lg border border-[#49351f] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#5f5649] focus:border-[#80602f]"
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            GAME INFORMATION
            ================================================== */}

        <section className="mt-5 rounded-xl border border-[#352819] bg-[#0c0e0d] p-6">

          <h2 className="font-serif text-xl text-[#d4c4a6]">
            Game Information
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-5">

            {/* EVENT */}

            <div>

              <label className="font-serif text-xs tracking-[0.15em] text-[#786d5b]">
                EVENT
              </label>

              <input
                value={event}
                onChange={(event) =>
                  setEvent(event.target.value)
                }
                placeholder="Candidates Tournament"
                className="mt-2 w-full rounded-lg border border-[#49351f] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#5f5649] focus:border-[#80602f]"
              />

            </div>


            {/* CATEGORY */}

            <div>

              <label className="font-serif text-xs tracking-[0.15em] text-[#786d5b]">
                CATEGORY
              </label>

              <input
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="Brilliant Attack"
                className="mt-2 w-full rounded-lg border border-[#49351f] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#5f5649] focus:border-[#80602f]"
              />

            </div>


            {/* RATING */}

            <div>

              <label className="font-serif text-xs tracking-[0.15em] text-[#786d5b]">
                RATING
              </label>

              <input
                value={rating}
                onChange={(event) =>
                  setRating(event.target.value)
                }
                placeholder="4.9"
                className="mt-2 w-full rounded-lg border border-[#49351f] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#5f5649] focus:border-[#80602f]"
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            PGN
            ================================================== */}

        <section className="mt-5 rounded-xl border border-[#352819] bg-[#0c0e0d] p-6">

          <h2 className="font-serif text-xl text-[#d4c4a6]">
            PGN
          </h2>

          <p className="mt-2 font-serif text-sm text-[#786d5b]">
            Paste the PGN of the game below.
          </p>

          <textarea
            value={pgn}
            onChange={(event) =>
              setPgn(event.target.value)
            }
            placeholder={`[Event "Example"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6`}
            className="mt-5 min-h-[300px] w-full resize-y rounded-lg border border-[#49351f] bg-[#080a09] p-4 font-mono text-sm leading-relaxed text-[#d4c4a6] outline-none placeholder:text-[#4f473b] focus:border-[#80602f]"
          />

        </section>


        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (

          <div className="mt-5 rounded-lg border border-[#6e2920] bg-[#24110e] px-4 py-3">

            <p className="font-serif text-sm text-[#d75a45]">
              {error}
            </p>

          </div>

        )}


        {/* ==================================================
            ACTIONS
            ================================================== */}

        <div className="mt-6 flex items-center justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/games")
            }
            className="rounded-lg border border-[#49351f] px-6 py-3 font-serif text-sm text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
          >
            Cancel
          </button>


          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#a72c20] px-6 py-3 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
          >
            <Save size={16} />

            Save Game
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddGame;