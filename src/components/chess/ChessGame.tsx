// src/components/chess/ChessGame.tsx — full replace
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useGames } from "../../hooks/useGames";

type MoveRecord = { san: string; fen: string };
type ChessGameProps = { pgn: string; gameId: string };

function ChessGame({ pgn, gameId }: ChessGameProps) {
  const {
    games,
    saveAnalysis,
    deleteAnalysis,
    addVariation,
    deleteVariation,
    addVariationMove,
    deleteVariationMovesAfter,
    saveVariationAnalysis,
    deleteVariationAnalysis,
  } = useGames();

  const currentGame = games.find((game) => game.id === gameId);
  const variations = currentGame?.variations ?? [];

  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [activeVariationId, setActiveVariationId] = useState<string | null>(null);
  const [variationMoveIndex, setVariationMoveIndex] = useState(-1);
  const [editingAnalysis, setEditingAnalysis] = useState(false);
  const [analysisDraft, setAnalysisDraft] = useState("");

  useEffect(() => {
    const loadedGame = new Chess();
    try {
      loadedGame.loadPgn(pgn);
      const history = loadedGame.history();
      const replayGame = new Chess();
      const loadedMoves: MoveRecord[] = [];

      history.forEach((san) => {
        const move = replayGame.move(san);
        loadedMoves.push({ san: move.san, fen: replayGame.fen() });
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMoves(loadedMoves);
      setGame(new Chess());
      setCurrentMoveIndex(-1);
      setActiveVariationId(null);
      setVariationMoveIndex(-1);
      setAnalysisDraft("");
      setEditingAnalysis(false);
    } catch (error) {
      console.error("Failed to load PGN:", error);
      setMoves([]);
      setGame(new Chess());
      setCurrentMoveIndex(-1);
      setActiveVariationId(null);
      setVariationMoveIndex(-1);
      setAnalysisDraft("");
      setEditingAnalysis(false);
    }
  }, [pgn]);

  const activeVariation = variations.find((v) => v.id === activeVariationId);
  const mainAnalysis = currentGame?.analysis ?? {};
  const variationAnalysis = activeVariation?.analysis ?? {};

  const getMainLinePosition = (moveIndex: number) => {
    if (moveIndex < 0) return new Chess();
    const move = moves[moveIndex];
    if (!move) return new Chess();
    return new Chess(move.fen);
  };

  const getVariationStartPosition = (branchFromMoveIndex: number) =>
    getMainLinePosition(branchFromMoveIndex);

  const handleVariationClick = (variationId: string) => {
    const variation = variations.find((v) => v.id === variationId);
    if (!variation) return;

    setActiveVariationId(variationId);
    setVariationMoveIndex(-1);
    setGame(getVariationStartPosition(variation.branchFromMoveIndex));

    const savedAnalysis = variation.analysis?.[-1];
    setAnalysisDraft(savedAnalysis ?? "");
    setEditingAnalysis(!savedAnalysis);
  };

  const handleReturnToMainLine = () => {
    setActiveVariationId(null);
    setVariationMoveIndex(-1);

    if (currentMoveIndex >= 0) {
      setGame(new Chess(moves[currentMoveIndex].fen));
      const savedAnalysis = mainAnalysis[currentMoveIndex];
      setAnalysisDraft(savedAnalysis ?? "");
      setEditingAnalysis(!savedAnalysis);
    } else {
      setGame(new Chess());
      setAnalysisDraft("");
      setEditingAnalysis(false);
    }
  };

  const handlePieceDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => {
    if (!targetSquare) return false;

    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!move) return false;

      if (activeVariationId) {
        const runVariationMove = async () => {
          if (variationMoveIndex < activeVariation!.moves.length - 1) {
            await deleteVariationMovesAfter(
              gameId,
              activeVariationId,
              variationMoveIndex
            );
          }

          const newMove: MoveRecord = { san: move.san, fen: gameCopy.fen() };
          await addVariationMove(gameId, activeVariationId, newMove);
        };

        runVariationMove();

        const newIndex = variationMoveIndex + 1;
        setVariationMoveIndex(newIndex);
        setGame(gameCopy);
        setAnalysisDraft("");
        setEditingAnalysis(true);
        return true;
      }

      const newMove: MoveRecord = { san: move.san, fen: gameCopy.fen() };
      const newMoves = [...moves.slice(0, currentMoveIndex + 1), newMove];
      setMoves(newMoves);

      const newIndex = newMoves.length - 1;
      setCurrentMoveIndex(newIndex);
      setGame(gameCopy);
      setAnalysisDraft("");
      setEditingAnalysis(true);
      return true;
    } catch {
      console.log("Illegal move");
      return false;
    }
  };

  const handleMoveClick = (index: number) => {
    const selectedMove = moves[index];
    if (!selectedMove) return;

    setActiveVariationId(null);
    setVariationMoveIndex(-1);
    setGame(new Chess(selectedMove.fen));
    setCurrentMoveIndex(index);

    const savedAnalysis = mainAnalysis[index];
    setAnalysisDraft(savedAnalysis ?? "");
    setEditingAnalysis(!savedAnalysis);
  };

  const handleVariationMoveClick = (index: number) => {
    if (!activeVariation) return;
    const selectedMove = activeVariation.moves[index];
    if (!selectedMove) return;

    setVariationMoveIndex(index);
    setGame(new Chess(selectedMove.fen));

    const savedAnalysis = activeVariation.analysis?.[index];
    setAnalysisDraft(savedAnalysis ?? "");
    setEditingAnalysis(!savedAnalysis);
  };

  const handleSaveAnalysis = async () => {
    if (activeVariationId) {
      if (variationMoveIndex < -1) return;
      await saveVariationAnalysis(
        gameId,
        activeVariationId,
        variationMoveIndex,
        analysisDraft
      );
      setEditingAnalysis(false);
      return;
    }

    if (currentMoveIndex === -1) return;
    await saveAnalysis(gameId, currentMoveIndex, analysisDraft);
    setEditingAnalysis(false);
  };

  const handleEditAnalysis = () => {
    if (activeVariationId) {
      setAnalysisDraft(activeVariation?.analysis?.[variationMoveIndex] ?? "");
      setEditingAnalysis(true);
      return;
    }

    if (currentMoveIndex === -1) return;
    setAnalysisDraft(mainAnalysis[currentMoveIndex] ?? "");
    setEditingAnalysis(true);
  };

  const handleDeleteAnalysis = async () => {
    if (activeVariationId) {
      await deleteVariationAnalysis(gameId, activeVariationId, variationMoveIndex);
      setAnalysisDraft("");
      setEditingAnalysis(true);
      return;
    }

    if (currentMoveIndex === -1) return;
    await deleteAnalysis(gameId, currentMoveIndex);
    setAnalysisDraft("");
    setEditingAnalysis(true);
  };

  const handleAnalysisKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSaveAnalysis();
      event.currentTarget.blur();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (activeVariation) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          const previousIndex = variationMoveIndex - 1;

          if (previousIndex >= 0) {
            handleVariationMoveClick(previousIndex);
          } else {
            setVariationMoveIndex(-1);
            setGame(getVariationStartPosition(activeVariation.branchFromMoveIndex));
            const savedAnalysis = activeVariation.analysis?.[-1];
            setAnalysisDraft(savedAnalysis ?? "");
            setEditingAnalysis(!savedAnalysis);
          }
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          const nextIndex = variationMoveIndex + 1;
          if (nextIndex < activeVariation.moves.length) {
            handleVariationMoveClick(nextIndex);
          }
          return;
        }
        return;
      }

      if (moves.length === 0) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const previousIndex = currentMoveIndex - 1;

        if (previousIndex >= 0) {
          handleMoveClick(previousIndex);
        } else {
          setGame(new Chess());
          setCurrentMoveIndex(-1);
          setAnalysisDraft("");
          setEditingAnalysis(false);
        }
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = currentMoveIndex + 1;
        if (nextIndex < moves.length) handleMoveClick(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moves, currentMoveIndex, activeVariation, activeVariationId, variationMoveIndex, mainAnalysis]);

  const getMoveNumber = (index: number) => Math.floor(index / 2) + 1;

  const currentMove = currentMoveIndex >= 0 ? moves[currentMoveIndex] : null;

  const currentAnalysis = activeVariationId
    ? variationAnalysis[variationMoveIndex]
    : currentMoveIndex >= 0
      ? mainAnalysis[currentMoveIndex]
      : undefined;

  const currentVariationMove =
    activeVariation && variationMoveIndex >= 0
      ? activeVariation.moves[variationMoveIndex]
      : null;

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex items-start justify-center">
        <div className="aspect-square w-full max-w-[700px]">
          <Chessboard
            options={{
              position: game.fen(),
              onPieceDrop: handlePieceDrop,
              boardStyle: { borderRadius: "8px" },
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-[#d4c4a6]">Moves</h2>

            {currentMoveIndex >= 0 && !activeVariationId && (
              <button
                onClick={() => addVariation(gameId, currentMoveIndex)}
                className="rounded-lg border border-[#49351f] px-3 py-2 text-xs font-serif text-[#cdbd9f] transition-colors hover:bg-[#17130f] hover:text-[#d4c4a6]"
              >
                + Variation
              </button>
            )}
          </div>

          <div className="mt-4 max-h-[300px] overflow-y-auto">
            {moves.length === 0 ? (
              <p className="text-sm text-[#786d5b]">No moves loaded.</p>
            ) : (
              <div className="space-y-1">
                {Array.from({ length: Math.ceil(moves.length / 2) }, (_, moveNumber) => {
                  const whiteIndex = moveNumber * 2;
                  const blackIndex = moveNumber * 2 + 1;

                  return (
                    <div key={moveNumber} className="flex items-center gap-2 font-serif text-sm">
                      <span className="w-8 text-right text-[#786d5b]">{moveNumber + 1}.</span>

                      {moves[whiteIndex] && (
                        <button
                          onClick={() => handleMoveClick(whiteIndex)}
                          className={`rounded px-2 py-1 transition-colors ${
                            !activeVariationId && currentMoveIndex === whiteIndex
                              ? "bg-[#3a1712] text-[#d75a45]"
                              : "text-[#d4c4a6] hover:bg-[#17130f]"
                          }`}
                        >
                          {moves[whiteIndex].san}
                        </button>
                      )}

                      {moves[blackIndex] && (
                        <button
                          onClick={() => handleMoveClick(blackIndex)}
                          className={`rounded px-2 py-1 transition-colors ${
                            !activeVariationId && currentMoveIndex === blackIndex
                              ? "bg-[#3a1712] text-[#d75a45]"
                              : "text-[#d4c4a6] hover:bg-[#17130f]"
                          }`}
                        >
                          {moves[blackIndex].san}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {variations.length > 0 && (
            <div className="mt-6 border-t border-[#2b2117] pt-5">
              <p className="mb-3 text-[10px] tracking-[0.2em] text-[#806c4e]">VARIATIONS</p>

              <div className="space-y-2">
                {variations.map((variation, index) => (
                  <div
                    key={variation.id}
                    className={`rounded-lg border p-3 ${
                      activeVariationId === variation.id
                        ? "border-[#76542b] bg-[#17130f]"
                        : "border-[#352819] bg-[#080a09]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button onClick={() => handleVariationClick(variation.id)} className="text-left">
                        <p className="font-serif text-sm text-[#d4c4a6]">Variation {index + 1}</p>
                        <p className="mt-1 text-[11px] text-[#786d5b]">
                          Branches after move {variation.branchFromMoveIndex + 1}
                        </p>
                      </button>

                      <button
                        onClick={() => deleteVariation(gameId, variation.id)}
                        className="rounded-md border border-[#49351f] px-2 py-1 text-xs text-[#b73527] transition-colors hover:bg-[#241512]"
                      >
                        Delete
                      </button>
                    </div>

                    {variation.moves.length > 0 && (
                      <div className="mt-3 border-t border-[#2b2117] pt-3">
                        <div className="flex flex-wrap gap-1">
                          {variation.moves.map((variationMove, moveIndex) => (
                            <button
                              key={`${variation.id}-${moveIndex}`}
                              onClick={() => {
                                handleVariationClick(variation.id);
                                handleVariationMoveClick(moveIndex);
                              }}
                              className={`rounded px-2 py-1 font-serif text-xs transition-colors ${
                                activeVariationId === variation.id && variationMoveIndex === moveIndex
                                  ? "bg-[#3a1712] text-[#d75a45]"
                                  : "text-[#d4c4a6] hover:bg-[#17130f]"
                              }`}
                            >
                              {variationMove.san}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {activeVariation && (
          <div className="rounded-xl border border-[#49351f] bg-[#17130f] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-[#806c4e]">ACTIVE VARIATION</p>
                <p className="mt-1 font-serif text-sm text-[#d4c4a6]">
                  Branch after move {activeVariation.branchFromMoveIndex + 1}
                </p>
              </div>

              <button
                onClick={handleReturnToMainLine}
                className="rounded-lg border border-[#49351f] px-3 py-2 text-xs font-serif text-[#cdbd9f] transition-colors hover:bg-[#241b13]"
              >
                ← Main line
              </button>
            </div>
          </div>
        )}

        <section className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">
          <p className="text-xs tracking-[0.15em] text-[#786d5b]">CURRENT MOVE</p>

          <h2 className="mt-2 font-serif text-xl text-[#d4c4a6]">
            {activeVariation
              ? currentVariationMove
                ? `Variation · ${variationMoveIndex + 1}. ${currentVariationMove.san}`
                : "Variation starting position"
              : currentMove
                ? `${getMoveNumber(currentMoveIndex)}${currentMoveIndex % 2 === 0 ? "." : "..."} ${currentMove.san}`
                : "Starting position"}
          </h2>

          {!activeVariation && currentMoveIndex === -1 && (
            <p className="mt-4 text-sm text-[#786d5b]">Use the right arrow or select a move to begin.</p>
          )}

          {activeVariation && variationMoveIndex === -1 && (
            <p className="mt-4 text-sm text-[#786d5b]">
              This is the position where the variation begins.
              <br />
              Move a piece on the board to create the continuation.
            </p>
          )}

          {(activeVariation ? true : currentMoveIndex >= 0) && editingAnalysis && (
            <div className="mt-4">
              <textarea
                autoFocus
                value={analysisDraft}
                onChange={(event) => setAnalysisDraft(event.target.value)}
                onKeyDown={handleAnalysisKeyDown}
                placeholder="Write your analysis of this move..."
                className="min-h-[220px] w-full resize-y rounded-lg border border-[#352819] bg-[#080a09] p-4 font-serif text-sm leading-relaxed text-[#d4c4a6] outline-none placeholder:text-[#5f5649] focus:border-[#80602f]"
              />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleSaveAnalysis}
                  className="rounded-lg bg-[#a72c20] px-4 py-2 text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
                >
                  Save
                </button>

                <button
                  onClick={handleDeleteAnalysis}
                  className="rounded-lg border border-[#49351f] px-4 py-2 text-sm text-[#b73527] transition-colors hover:bg-[#241512]"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {(activeVariation ? !editingAnalysis : currentMoveIndex >= 0 && !editingAnalysis) && (
            <div className="mt-4">
              <div className="min-h-[220px] rounded-lg border border-[#352819] bg-[#080a09] p-4">
                {currentAnalysis ? (
                  <p className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-[#d4c4a6]">
                    {currentAnalysis}
                  </p>
                ) : (
                  <p className="font-serif text-sm text-[#5f5649]">No analysis written yet.</p>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleEditAnalysis}
                  className="rounded-lg bg-[#594124] px-4 py-2 text-sm text-[#e1cda9] transition-colors hover:bg-[#70532d]"
                >
                  Edit
                </button>

                <button
                  onClick={handleDeleteAnalysis}
                  className="rounded-lg border border-[#49351f] px-4 py-2 text-sm text-[#b73527] transition-colors hover:bg-[#241512]"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ChessGame;