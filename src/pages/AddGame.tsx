// src/pages/AddGame.tsx — full replace
import { useState } from "react";
import { ArrowLeft, Save, RotateCcw, Zap } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";

type Mode = "pgn" | "manual";
type GameType = "GM_GAME" | "USER_GAME" | "ANONYMOUS";

function AddGame() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const { games, addGame, updateGame } = useGames();
  const { players } = usePlayers();

  const editingGame = gameId ? games.find((game) => game.id === gameId) : undefined;
  const isEditing = Boolean(editingGame);
  const prefillPlayerId = searchParams.get("playerId") ?? "";

  const [gameType, setGameType] = useState<GameType>(
    prefillPlayerId ? "GM_GAME" : "ANONYMOUS"
  );
  const [playerId, setPlayerId] = useState(prefillPlayerId);
  const [mode, setMode] = useState<Mode>("pgn");

  const [white, setWhite] = useState(editingGame?.white ?? "");
  const [black, setBlack] = useState(editingGame?.black ?? "");
  const [whitePlatform, setWhitePlatform] = useState("");
  const [blackPlatform, setBlackPlatform] = useState("");
  const [event, setEvent] = useState(editingGame?.event ?? "");
  const [category, setCategory] = useState(editingGame?.category ?? "");
  const [rating, setRating] = useState(editingGame?.rating ?? "");
  const [pgn, setPgn] = useState(editingGame?.pgn ?? "");

  const [manualMoves, setManualMoves] = useState<string[]>([]);
  const manualBoard = (() => {
    const chess = new Chess();
    manualMoves.forEach((san) => {
      try { chess.move(san); } catch { /* ignore */ }
    });
    return chess;
  })();
  const manualPgn = manualBoard.pgn();

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleManualPieceDrop = ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
    if (!targetSquare) return false;
    const gameCopy = new Chess();
    manualMoves.forEach((san) => gameCopy.move(san));
    try {
      const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (!move) return false;
      setManualMoves((prev) => [...prev, move.san]);
      return true;
    } catch {
      return false;
    }
  };

  const handleResetBoard = () => setManualMoves([]);

  const buildGameData = (finalPgn: string) => ({
    gameType,
    white: gameType === "ANONYMOUS" ? null : white.trim() || null,
    black: gameType === "ANONYMOUS" ? null : black.trim() || null,
    whitePlatform: gameType === "USER_GAME" ? (whitePlatform || null) : null,
    blackPlatform: gameType === "USER_GAME" ? (blackPlatform || null) : null,
    event: event.trim() || null,
    category: category.trim() || null,
    rating: rating.trim() || null,
    pgn: finalPgn,
    playerId: gameType === "GM_GAME" ? (playerId || null) : null,
  });

  const handleQuickAdd = async () => {
    setSaving(true);
    setError("");
    try {
      await addGame(buildGameData("") as never);
      navigate("/games");
    } catch (error) {
      console.error("Quick add failed:", error);
      setError("Could not create the game.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    setError("");

    const finalPgn = mode === "pgn" ? pgn.trim() : manualPgn.trim();

    if (gameType === "GM_GAME" && !playerId) {
      setError("Select a grandmaster.");
      return;
    }

    if (gameType === "USER_GAME" && !white.trim() && !black.trim()) {
      setError("Add at least one player name.");
      return;
    }

    if (mode === "pgn" && finalPgn) {
      try {
        const chess = new Chess();
        chess.loadPgn(finalPgn);
      } catch (error) {
        console.error("Invalid PGN:", error);
        setError("The PGN could not be read. Check that the moves are valid.");
        return;
      }
    }

    setSaving(true);
    try {
      const gameData = buildGameData(finalPgn);

      if (isEditing && editingGame) {
        await updateGame(editingGame.id, gameData as never);
        navigate(`/games/${editingGame.id}`);
        return;
      }

      await addGame(gameData as never);
      navigate("/games");
    } catch (error) {
      console.error("Failed to save game:", error);
      setError("Could not save the game. Check the server is running.");
    } finally {
      setSaving(false);
    }
  };

  if (gameId && !editingGame) {
    return (
      <div className="min-h-screen bg-[#080a09] p-10">
        <h1 className="font-serif text-3xl text-[#d4c4a6]">Game not found</h1>
        <Link to="/games" className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#49351f] px-5 py-3 font-serif text-sm text-[#cdbd9f] hover:bg-[#17130f]">
          <ArrowLeft size={16} />
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a09] px-6 py-12 md:px-10">
      <header className="border-b border-[#2b2117] pb-8">
        <Link to={isEditing ? `/games/${editingGame?.id}` : "/games"} className="inline-flex items-center gap-2 font-serif text-sm text-[#806c4e] transition-colors hover:text-[#d4c4a6]">
          <ArrowLeft size={16} />
          {isEditing ? "Back to Game" : "Back to Library"}
        </Link>

        <h1 className="mt-8 font-serif text-4xl text-[#d9c8aa] md:text-5xl">
          {isEditing ? "Edit Game" : "Add Game"}
        </h1>

        {!isEditing && (
          <button
            type="button"
            onClick={() => void handleQuickAdd()}
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-lg border border-[#49351f] px-4 py-2 font-serif text-xs text-[#cdbd9f] transition-colors hover:bg-[#17130f] disabled:opacity-50"
          >
            <Zap size={14} />
            Quick Add (skip the form, start on the board)
          </button>
        )}
      </header>

      <form onSubmit={handleSubmit} className="mt-10 max-w-4xl">
        {!isEditing && (
          <div className="flex gap-2 border-b border-[#2b2117] pb-6">
            {(["ANONYMOUS", "USER_GAME", "GM_GAME"] as GameType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setGameType(type)}
                className={`rounded-lg px-4 py-2 font-serif text-sm transition-colors ${
                  gameType === type
                    ? "bg-[#a72c20] text-[#f0d8b0]"
                    : "border border-[#49351f] text-[#cdbd9f] hover:bg-[#17130f]"
                }`}
              >
                {type === "ANONYMOUS" ? "Anonymous" : type === "USER_GAME" ? "My Game" : "Grandmaster Game"}
              </button>
            ))}
          </div>
        )}

        {gameType === "GM_GAME" && (
          <div className="mt-6">
            <label className="font-serif text-sm text-[#cdbd9f]">Grandmaster</label>
            <select
              value={playerId}
              onChange={(event) => setPlayerId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#352819] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none focus:border-[#80602f]"
            >
              <option value="">Select a grandmaster</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {gameType === "USER_GAME" && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Field label="White (optional)" value={white} onChange={setWhite} placeholder="Your name or handle" />
              <select value={whitePlatform} onChange={(e) => setWhitePlatform(e.target.value)} className="mt-2 w-full rounded-lg border border-[#352819] bg-[#080a09] px-4 py-2 font-serif text-xs text-[#d4c4a6] outline-none focus:border-[#80602f]">
                <option value="">Platform (optional)</option>
                <option value="CHESS_COM">Chess.com</option>
                <option value="LICHESS">Lichess</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <Field label="Black (optional)" value={black} onChange={setBlack} placeholder="Opponent name or handle" />
              <select value={blackPlatform} onChange={(e) => setBlackPlatform(e.target.value)} className="mt-2 w-full rounded-lg border border-[#352819] bg-[#080a09] px-4 py-2 font-serif text-xs text-[#d4c4a6] outline-none focus:border-[#80602f]">
                <option value="">Platform (optional)</option>
                <option value="CHESS_COM">Chess.com</option>
                <option value="LICHESS">Lichess</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Field label="Event (optional)" value={event} onChange={setEvent} placeholder="Candidates Tournament" />
          <Field label="Category (optional)" value={category} onChange={setCategory} placeholder="Brilliant Attack" />
          <Field label="Rating (optional)" value={rating} onChange={setRating} placeholder="4.9" />
        </div>

        <div className="mt-8 flex gap-2 border-b border-[#2b2117] pb-4">
          <button type="button" onClick={() => setMode("pgn")} className={`rounded-lg px-4 py-2 font-serif text-sm transition-colors ${mode === "pgn" ? "bg-[#a72c20] text-[#f0d8b0]" : "border border-[#49351f] text-[#cdbd9f] hover:bg-[#17130f]"}`}>
            Paste PGN
          </button>
          <button type="button" onClick={() => setMode("manual")} className={`rounded-lg px-4 py-2 font-serif text-sm transition-colors ${mode === "manual" ? "bg-[#a72c20] text-[#f0d8b0]" : "border border-[#49351f] text-[#cdbd9f] hover:bg-[#17130f]"}`}>
            Play on Board
          </button>
        </div>

        {mode === "pgn" ? (
          <div className="mt-6">
            <label className="font-serif text-sm text-[#cdbd9f]">PGN (optional)</label>
            <textarea
              value={pgn}
              onChange={(event) => setPgn(event.target.value)}
              placeholder={`Leave blank to start empty, or paste a PGN.`}
              className="mt-3 min-h-[280px] w-full resize-y rounded-xl border border-[#352819] bg-[#080a09] p-5 font-mono text-sm leading-relaxed text-[#d4c4a6] outline-none placeholder:text-[#51493e] focus:border-[#80602f]"
            />
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label className="font-serif text-sm text-[#cdbd9f]">Play the game</label>
              <button type="button" onClick={handleResetBoard} className="flex items-center gap-2 rounded-lg border border-[#49351f] px-3 py-2 text-xs font-serif text-[#cdbd9f] hover:bg-[#17130f]">
                <RotateCcw size={14} />
                Reset Board
              </button>
            </div>

            <div className="mt-4 max-w-[500px]">
              <Chessboard options={{ position: manualBoard.fen(), onPieceDrop: handleManualPieceDrop, boardStyle: { borderRadius: "8px" } }} />
            </div>

            {manualPgn && (
              <div className="mt-4 rounded-lg border border-[#352819] bg-[#080a09] p-4">
                <p className="font-mono text-sm text-[#d4c4a6]">{manualPgn}</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-[#633025] bg-[#21100d] px-4 py-3 text-sm text-[#d75a45]">{error}</div>
        )}

        <div className="mt-8 flex items-center gap-3">
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#a72c20] px-6 py-3 font-serif text-sm text-[#f0d8b0] hover:bg-[#c13a2b] disabled:opacity-50">
            <Save size={17} />
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Game"}
          </button>
          <Link to={isEditing ? `/games/${editingGame?.id}` : "/games"} className="rounded-lg border border-[#49351f] px-6 py-3 font-serif text-sm text-[#cdbd9f] hover:bg-[#17130f]">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

type FieldProps = { label: string; value: string; onChange: (value: string) => void; placeholder: string };

function Field({ label, value, onChange, placeholder }: FieldProps) {
  return (
    <div>
      <label className="font-serif text-sm text-[#cdbd9f]">{label}</label>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-[#352819] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#51493e] focus:border-[#80602f]" />
    </div>
  );
}

export default AddGame;