import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Chess } from "chess.js";

import { useGames } from "../hooks/useGames";


function AddGame() {
  const navigate = useNavigate();

  const { gameId } = useParams();

  const {
    games,
    addGame,
    updateGame,
  } = useGames();


  /*
   * --------------------------------------------------
   * EDIT MODE
   * --------------------------------------------------
   *
   * If the URL contains a gameId, we're editing
   * an existing game.
   *
   * Example:
   *
   * /games/add
   *
   * = CREATE
   *
   * /games/edit/tal-vs-petrosian-1960
   *
   * = EDIT
   */

  const editingGame =
    gameId
      ? games.find(
          (game) =>
            game.id === gameId
        )
      : undefined;


  const isEditing =
    Boolean(editingGame);


  /*
   * --------------------------------------------------
   * FORM STATE
   * --------------------------------------------------
   */

  const [white, setWhite] =
    useState(
      editingGame?.white ?? ""
    );

  const [black, setBlack] =
    useState(
      editingGame?.black ?? ""
    );

  const [event, setEvent] =
    useState(
      editingGame?.event ?? ""
    );

  const [category, setCategory] =
    useState(
      editingGame?.category ?? ""
    );

  const [rating, setRating] =
    useState(
      editingGame?.rating ?? ""
    );

  const [pgn, setPgn] =
    useState(
      editingGame?.pgn ?? ""
    );

  const [error, setError] =
    useState("");


  /*
   * --------------------------------------------------
   * SUBMIT
   * --------------------------------------------------
   */

  const handleSubmit = (
    formEvent: React.FormEvent<HTMLFormElement>
  ) => {

    formEvent.preventDefault();

    setError("");


    /*
     * REQUIRED FIELDS
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
     * VALIDATE PGN
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
     * COMMON GAME DATA
     */

    const gameData = {
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
    };


    /*
     * EDIT EXISTING GAME
     */

    if (
      isEditing &&
      editingGame
    ) {

      updateGame(
        editingGame.id,
        gameData
      );

      navigate(
        `/games/${editingGame.id}`
      );

      return;
    }


    /*
     * CREATE NEW GAME
     */

    addGame(
      gameData
    );

    navigate(
      "/games"
    );
  };


  /*
   * --------------------------------------------------
   * GAME NOT FOUND
   * --------------------------------------------------
   */

  if (
    gameId &&
    !editingGame
  ) {

    return (
      <div className="min-h-screen bg-[#080a09] p-10">

        <h1 className="font-serif text-3xl text-[#d4c4a6]">
          Game not found
        </h1>

        <p className="mt-3 text-sm text-[#786d5b]">
          The game you're trying to edit doesn't exist.
        </p>

        <Link
          to="/games"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#49351f] px-5 py-3 font-serif text-sm text-[#cdbd9f] hover:bg-[#17130f]"
        >
          <ArrowLeft size={16} />
          Back to Library
        </Link>

      </div>
    );
  }


  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#080a09] px-10 py-12">

      {/* HEADER */}

      <header className="border-b border-[#2b2117] pb-8">

        <Link
          to={
            isEditing
              ? `/games/${editingGame?.id}`
              : "/games"
          }
          className="inline-flex items-center gap-2 font-serif text-sm text-[#806c4e] transition-colors hover:text-[#d4c4a6]"
        >
          <ArrowLeft size={16} />

          {isEditing
            ? "Back to Game"
            : "Back to Library"}

        </Link>


        <p className="mt-8 font-serif text-xs tracking-[0.25em] text-[#806c4e]">
          {isEditing
            ? "EDIT GAME"
            : "CONTRIBUTE TO THE ARCHIVE"}
        </p>


        <h1 className="mt-3 font-serif text-5xl text-[#d9c8aa]">
          {isEditing
            ? "Edit Game"
            : "Add Game"}
        </h1>


        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">

          {isEditing
            ? "Correct the details, update the PGN, or refine the classification of this game."
            : "Add a game to the Ryabina's Gambit archive and make it available for analysis."}

        </p>

      </header>


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="mt-10 max-w-4xl"
      >

        <div className="grid grid-cols-2 gap-6">

          {/* WHITE */}

          <FormField
            label="White Player"
            value={white}
            onChange={setWhite}
            placeholder="Mikhail Tal"
          />


          {/* BLACK */}

          <FormField
            label="Black Player"
            value={black}
            onChange={setBlack}
            placeholder="Tigran Petrosian"
          />


          {/* EVENT */}

          <FormField
            label="Event"
            value={event}
            onChange={setEvent}
            placeholder="Candidates Tournament"
          />


          {/* CATEGORY */}

          <FormField
            label="Category"
            value={category}
            onChange={setCategory}
            placeholder="Brilliant Attack"
          />


          {/* RATING */}

          <FormField
            label="Rating"
            value={rating}
            onChange={setRating}
            placeholder="4.9"
          />

        </div>


        {/* PGN */}

        <div className="mt-6">

          <label className="font-serif text-sm text-[#cdbd9f]">
            PGN
          </label>

          <p className="mt-1 text-xs text-[#786d5b]">
            Paste the complete PGN of the game here.
          </p>


          <textarea
            value={pgn}
            onChange={(event) =>
              setPgn(
                event.target.value
              )
            }
            placeholder={`[Event "Candidates Tournament"]

1. e4 c6 2. d4 d5 3. Nc3 dxe4`}
            className="mt-3 min-h-[280px] w-full resize-y rounded-xl border border-[#352819] bg-[#080a09] p-5 font-mono text-sm leading-relaxed text-[#d4c4a6] outline-none placeholder:text-[#51493e] focus:border-[#80602f]"
          />

        </div>


        {/* ERROR */}

        {error && (

          <div className="mt-5 rounded-lg border border-[#633025] bg-[#21100d] px-4 py-3 text-sm text-[#d75a45]">

            {error}

          </div>

        )}


        {/* ACTIONS */}

        <div className="mt-8 flex items-center gap-3">

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#a72c20] px-6 py-3 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
          >

            <Save size={17} />

            {isEditing
              ? "Save Changes"
              : "Save Game"}

          </button>


          <Link
            to={
              isEditing
                ? `/games/${editingGame?.id}`
                : "/games"
            }
            className="rounded-lg border border-[#49351f] px-6 py-3 font-serif text-sm text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>
  );
}


/*
 * --------------------------------------------------
 * REUSABLE FORM FIELD
 * --------------------------------------------------
 */

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
};


function FormField({
  label,
  value,
  onChange,
  placeholder,
}: FormFieldProps) {

  return (
    <div>

      <label className="font-serif text-sm text-[#cdbd9f]">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-[#352819] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#51493e] focus:border-[#80602f]"
      />

    </div>
  );
}


export default AddGame;