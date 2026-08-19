// src/components/chess/ChessGame.tsx — full replace
import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard, type PieceDropHandlerArgs } from "react-chessboard";
import { useGames } from "../../hooks/useGames";
import type { MoveRecord } from "../../data/games";

type ChessGameProps = {
  pgn: string;
  gameId: string;
  editMode?: boolean;
  onExitEditMode?: () => void;
};

function ChessGame({ pgn, gameId, editMode = false, onExitEditMode }: ChessGameProps) {
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
    updateGameMoves,
  } = useGames();

  const currentGame = games.find((game) => game.id === gameId);
  const variations = currentGame?.variations ?? [];

  const moves = useMemo<MoveRecord[]>(() => {
    if (!pgn.trim()) return [];
    try {
      const loadedGame = new Chess();
      loadedGame.loadPgn(pgn);
      const history = loadedGame.history();
      const replayGame = new Chess();
      return history.map((san) => {
        const move = replayGame.move(san);
        return { san: move.san, fen: replayGame.fen() };
      });
    } catch (error) {
      console.error("Failed to load PGN:", error);
      return [];
    }
  }, [pgn]);

  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [activeVariationId, setActiveVariationId] = useState<string | null>(null);
  const [variationMoveIndex, setVariationMoveIndex] = useState(-1);
  const [editingAnalysis, setEditingAnalysis] = useState(false);
  const [analysisDraft, setAnalysisDraft] = useState("");

  const [draftMoves, setDraftMoves] = useState<MoveRecord[]>([]);
  const [draftBaseIndex, setDraftBaseIndex] = useState<number | null>(null);
  const [draftMoveIndex, setDraftMoveIndex] = useState(-1);
  const [savingDraft, setSavingDraft] = useState(false);

  const [editMoves, setEditMoves] = useState<MoveRecord[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  const clearDraft = () => {
    setDraftMoves([]);
    setDraftBaseIndex(null);
    setDraftMoveIndex(-1);
  };

  useEffect(() => {
    setCurrentMoveIndex(-1);
    setActiveVariationId(null);
    setVariationMoveIndex(-1);
    setAnalysisDraft("");
    setEditingAnalysis(false);
    clearDraft();
  }, [pgn]);

  useEffect(() => {
    if (editMode) {
      setEditMoves(moves);
      clearDraft();
      setActiveVariationId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  const mainAnalysis = currentGame?.analysis ?? {};
  const activeVariation = variations.find((variation) => variation.id === activeVariationId);
  const variationAnalysis = activeVariation?.analysis ?? {};

  const getMainLinePosition = (moveIndex: number): Chess => {
    if (moveIndex < 0) return new Chess();
    const move = moves[moveIndex];
    if (!move) return new Chess();
    try {
      return new Chess(move.fen);
    } catch {
      return new Chess();
    }
  };

  const getVariationStartPosition = (branchFromMoveIndex: number): Chess =>
    getMainLinePosition(branchFromMoveIndex);

  const boardGame = useMemo(() => {
    if (editMode) {
      if (editMoves.length === 0) return new Chess();
      try {
        return new Chess(editMoves[editMoves.length - 1].fen);
      } catch {
        return new Chess();
      }
    }

    if (draftBaseIndex !== null) {
      if (draftMoveIndex >= 0) {
        const move = draftMoves[draftMoveIndex];
        if (move) {
          try {
            return new Chess(move.fen);
          } catch {
            return getMainLinePosition(draftBaseIndex);
          }
        }
      }
      return getMainLinePosition(draftBaseIndex);
    }

    if (activeVariation) {
      if (variationMoveIndex >= 0) {
        const move = activeVariation.moves[variationMoveIndex];
        if (move) {
          try {
            return new Chess(move.fen);
          } catch {
            return getVariationStartPosition(activeVariation.branchFromMoveIndex);
          }
        }
      }
      return getVariationStartPosition(activeVariation.branchFromMoveIndex);
    }

    return getMainLinePosition(currentMoveIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, editMoves, activeVariation, currentMoveIndex, moves, variationMoveIndex, draftBaseIndex, draftMoveIndex, draftMoves]);

  const handleVariationClick = (variationId: string) => {
    const variation = variations.find((item) => item.id === variationId);
    if (!variation) return;
    clearDraft();
    setActiveVariationId(variationId);
    setVariationMoveIndex(-1);
    setAnalysisDraft(variation.analysis?.[-1] ?? "");
    setEditingAnalysis(false);
  };

  const handleReturnToMainLine = () => {
    setActiveVariationId(null);
    setVariationMoveIndex(-1);
    setAnalysisDraft(currentMoveIndex >= 0 ? mainAnalysis[currentMoveIndex] ?? "" : "");
    setEditingAnalysis(false);
  };

  const handleMoveClick = (index: number) => {
    const selectedMove = moves[index];
    if (!selectedMove) return;
    clearDraft();
    setActiveVariationId(null);
    setVariationMoveIndex(-1);
    setCurrentMoveIndex(index);
    setAnalysisDraft(mainAnalysis[index] ?? "");
    setEditingAnalysis(false);
  };

  const handleVariationMoveClick = (index: number) => {
    if (!activeVariation) return;
    const selectedMove = activeVariation.moves[index];
    if (!selectedMove) return;
    setVariationMoveIndex(index);
    setAnalysisDraft(activeVariation.analysis?.[index] ?? "");
    setEditingAnalysis(false);
  };

  const handlePieceDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
    if (!targetSquare) return false;

    const gameCopy = new Chess(boardGame.fen());

    try {
      const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (!move) return false;

      const newMove: MoveRecord = { san: move.san, fen: gameCopy.fen() };

      if (editMode) {
        setEditMoves((prev) => [...prev, newMove]);
        return true;
      }

      if (activeVariationId && activeVariation) {
        const variationId = activeVariationId;
        const currentVariationIndex = variationMoveIndex;

        const saveVariationMove = async () => {
          try {
            if (currentVariationIndex < activeVariation.moves.length - 1) {
              await deleteVariationMovesAfter(gameId, variationId, currentVariationIndex);
            }
            await addVariationMove(gameId, variationId, newMove);
          } catch (error) {
            console.error("Failed to save variation move:", error);
          }
        };

        void saveVariationMove();
        setVariationMoveIndex(currentVariationIndex + 1);
        return true;
      }

      const isFirstDraftMove = draftBaseIndex === null;
      const baseIndex = isFirstDraftMove ? currentMoveIndex : draftBaseIndex!;
      const newDraftMoves = isFirstDraftMove
        ? [newMove]
        : [...draftMoves.slice(0, draftMoveIndex + 1), newMove];

      setDraftBaseIndex(baseIndex);
      setDraftMoves(newDraftMoves);
      setDraftMoveIndex(newDraftMoves.length - 1);

      return true;
    } catch (error) {
      console.error("Failed to make move:", error);
      return false;
    }
  };

  const handleSaveDraft = async () => {
    if (draftBaseIndex === null || draftMoves.length === 0) return;
    setSavingDraft(true);
    try {
      const newVariationId = await addVariation(gameId, draftBaseIndex);
      for (let i = 0; i < draftMoves.length; i++) {
        await addVariationMove(gameId, newVariationId, draftMoves[i]);
      }
      clearDraft();
      setActiveVariationId(newVariationId);
      setVariationMoveIndex(draftMoves.length - 1);
    } catch (error) {
      console.error("Failed to save draft as variation:", error);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleDiscardDraft = () => clearDraft();

  const handleSaveEditedMoves = async () => {
    setSavingEdit(true);
    try {
      const payload: MoveRecord[] = editMoves.map((m, i) => ({ moveIndex: i, san: m.san, fen: m.fen }));
      await updateGameMoves(gameId, payload);
      onExitEditMode?.();
    } catch (error) {
      console.error("Failed to save edited moves:", error);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMoves(moves);
    onExitEditMode?.();
  };

  const handleUndoEditMove = () => {
    setEditMoves((prev) => prev.slice(0, -1));
  };

  const handleSaveAnalysis = async () => {
    try {
      if (activeVariationId) {
        if (variationMoveIndex < -1) return;
        await saveVariationAnalysis(gameId, activeVariationId, variationMoveIndex, analysisDraft);
        setEditingAnalysis(false);
        return;
      }
      if (currentMoveIndex < 0) return;
      await saveAnalysis(gameId, currentMoveIndex, analysisDraft);
      setEditingAnalysis(false);
    } catch (error) {
      console.error("Failed to save analysis:", error);
    }
  };

  const handleEditAnalysis = () => {
    if (activeVariationId) {
      setAnalysisDraft(activeVariation?.analysis?.[variationMoveIndex] ?? "");
      setEditingAnalysis(true);
      return;
    }
    if (currentMoveIndex < 0) return;
    setAnalysisDraft(mainAnalysis[currentMoveIndex] ?? "");
    setEditingAnalysis(true);
  };

  const handleDeleteAnalysis = async () => {
    try {
      if (activeVariationId) {
        await deleteVariationAnalysis(gameId, activeVariationId, variationMoveIndex);
        setAnalysisDraft("");
        setEditingAnalysis(false);
        return;
      }
      if (currentMoveIndex < 0) return;
      await deleteAnalysis(gameId, currentMoveIndex);
      setAnalysisDraft("");
      setEditingAnalysis(false);
    } catch (error) {
      console.error("Failed to delete analysis:", error);
    }
  };

  const handleAnalysisKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSaveAnalysis();
      event.currentTarget.blur();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (editMode || draftBaseIndex !== null) return;

      if (activeVariation) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          const previousIndex = variationMoveIndex - 1;
          if (previousIndex >= 0) {
            handleVariationMoveClick(previousIndex);
          } else {
            setVariationMoveIndex(-1);
            setAnalysisDraft(activeVariation.analysis?.[-1] ?? "");
            setEditingAnalysis(false);
          }
          return;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          const nextIndex = variationMoveIndex + 1;
          if (nextIndex < activeVariation.moves.length) handleVariationMoveClick(nextIndex);
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
          setCurrentMoveIndex(-1);
          setAnalysisDraft("");
          setEditingAnalysis(false);
        }
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = currentMoveIndex + 1;
        if (nextIndex < moves.length) handleMoveClick(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVariation, currentMoveIndex, moves, variationMoveIndex, draftBaseIndex, editMode]);

  const getMoveNumber = (index: number) => Math.floor(index / 2) + 1;
  const currentMove = currentMoveIndex >= 0 ? moves[currentMoveIndex] : null;

  const currentAnalysis = activeVariationId
    ? variationAnalysis[variationMoveIndex]
    : currentMoveIndex >= 0
      ? mainAnalysis[currentMoveIndex]
      : undefined;

  const currentVariationMove =
    activeVariation && variationMoveIndex >= 0 ? activeVariation.moves[variationMoveIndex] : null;

  const currentDraftMove = draftBaseIndex !== null && draftMoveIndex >= 0 ? draftMoves[draftMoveIndex] : null;
  const inDraft = draftBaseIndex !== null;

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex items-start justify-center">
        <div className="aspect-square w-full max-w-[700px]">
          <Chessboard
            options={{
              position: boardGame.fen(),
              onPieceDrop: handlePieceDrop,
              boardStyle: { borderRadius: "8px" },
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {editMode && (
          <div className="rounded-xl border border-[#7c5a1f] bg-[#1a1408] p-4">
            <p className="text-[10px] tracking-[0.2em] text-[#c99a3f]">EDITING MAIN LINE</p>
            <p className="mt-1 font-serif text-sm text-[#e8d4a0]">
              {editMoves.map((m) => m.san).join(" ") || "No moves yet."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => void handleSaveEditedMoves()}
                disabled={savingEdit}
                className="rounded-lg bg-[#a72c20] px-3 py-2 text-xs font-serif text-[#f0d8b0] transition-colors hover:bg-[#c13a2b] disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Moves"}
              </button>
              <button
                onClick={handleUndoEditMove}
                disabled={editMoves.length === 0}
                className="rounded-lg border border-[#49351f] px-3 py-2 text-xs font-serif text-[#cdbd9f] transition-colors hover:bg-[#17130f] disabled:opacity-50"
              >
                Undo Last Move
              </button>
              <button
                onClick={handleCancelEdit}
                className="rounded-lg border border-[#49351f] px-3 py-2 text-xs font-serif text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!editMode && (
          <section className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">
            <h2 className="font-serif text-lg text-[#d4c4a6]">Moves</h2>

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
                              !activeVariationId && !inDraft && currentMoveIndex === whiteIndex
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
                              !activeVariationId && !inDraft && currentMoveIndex === blackIndex
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
                <p className="mb-3 text-[10px] tracking-[0.2em] text-[#806c4e]">SAVED VARIATIONS</p>

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
                          onClick={() => void deleteVariation(gameId, variation.id)}
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
                                  setActiveVariationId(variation.id);
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
        )}

        {!editMode && activeVariation && (
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

        {!editMode && inDraft && (
          <div className="rounded-xl border border-[#7c5a1f] bg-[#1a1408] p-4">
            <p className="text-[10px] tracking-[0.2em] text-[#c99a3f]">UNSAVED VARIATION</p>
            <p className="mt-1 font-serif text-sm text-[#e8d4a0]">
              {draftMoves.map((move) => move.san).join(" ")}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => void handleSaveDraft()}
                disabled={savingDraft}
                className="rounded-lg bg-[#a72c20] px-3 py-2 text-xs font-serif text-[#f0d8b0] transition-colors hover:bg-[#c13a2b] disabled:opacity-50"
              >
                {savingDraft ? "Saving..." : "Save as Variation"}
              </button>

              <button
                onClick={handleDiscardDraft}
                className="rounded-lg border border-[#49351f] px-3 py-2 text-xs font-serif text-[#cdbd9f] transition-colors hover:bg-[#17130f]"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {!editMode && (
          <section className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">
            <p className="text-xs tracking-[0.15em] text-[#786d5b]">CURRENT MOVE</p>

            <h2 className="mt-2 font-serif text-xl text-[#d4c4a6]">
              {inDraft
                ? currentDraftMove
                  ? `Draft · ${currentDraftMove.san}`
                  : "Draft starting position"
                : activeVariation
                  ? currentVariationMove
                    ? `Variation · ${variationMoveIndex + 1}. ${currentVariationMove.san}`
                    : "Variation starting position"
                  : currentMove
                    ? `${getMoveNumber(currentMoveIndex)}${currentMoveIndex % 2 === 0 ? "." : "..."} ${currentMove.san}`
                    : "Starting position"}
            </h2>

            {inDraft && (
              <p className="mt-4 text-sm text-[#786d5b]">Save this as a variation to add analysis to it.</p>
            )}

            {!inDraft && !activeVariation && currentMoveIndex === -1 && (
              <p className="mt-4 text-sm text-[#786d5b]">Use the right arrow or select a move to begin.</p>
            )}

            {!inDraft && activeVariation && variationMoveIndex === -1 && (
              <p className="mt-4 text-sm text-[#786d5b]">
                This is the position where the variation begins.
                <br />
                Move a piece on the board to create the continuation.
              </p>
            )}

            {!inDraft && (activeVariation ? true : currentMoveIndex >= 0) && editingAnalysis && (
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
                    onClick={() => void handleSaveAnalysis()}
                    className="rounded-lg bg-[#a72c20] px-4 py-2 text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => void handleDeleteAnalysis()}
                    className="rounded-lg border border-[#49351f] px-4 py-2 text-sm text-[#b73527] transition-colors hover:bg-[#241512]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {!inDraft && (activeVariation ? !editingAnalysis : currentMoveIndex >= 0 && !editingAnalysis) && (
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
                    {currentAnalysis ? "Edit" : "Add analysis"}
                  </button>

                  {currentAnalysis && (
                    <button
                      onClick={() => void handleDeleteAnalysis()}
                      className="rounded-lg border border-[#49351f] px-4 py-2 text-sm text-[#b73527] transition-colors hover:bg-[#241512]"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default ChessGame;