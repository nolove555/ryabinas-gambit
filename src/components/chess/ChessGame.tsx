import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

type MoveRecord = {
  san: string;
  fen: string;
};

function ChessGame() {
  const [game, setGame] = useState(new Chess());

  const [moves, setMoves] = useState<MoveRecord[]>([]);

  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  const [analysis, setAnalysis] = useState<Record<number, string>>({});

  const [editingAnalysis, setEditingAnalysis] = useState(false);

  const [analysisDraft, setAnalysisDraft] = useState("");

  /*
   * --------------------------------------------------
   * MAKE A CHESS MOVE
   * --------------------------------------------------
   */

  const handlePieceDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => {
    if (!targetSquare) {
      return false;
    }

    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!move) {
        return false;
      }

      const newMove: MoveRecord = {
        san: move.san,
        fen: gameCopy.fen(),
      };

      /*
       * If we're viewing an older move and make
       * a new move, discard everything after it.
       */
      const newMoves = [
        ...moves.slice(0, currentMoveIndex + 1),
        newMove,
      ];

      setMoves(newMoves);

      const newIndex = newMoves.length - 1;

      setCurrentMoveIndex(newIndex);

      setGame(gameCopy);

      /*
       * A newly created move starts with no analysis.
       */
      setEditingAnalysis(true);
      setAnalysisDraft("");

      return true;
    } catch {
      console.log("Illegal move");

      return false;
    }
  };

  /*
   * --------------------------------------------------
   * CLICK A MOVE
   * --------------------------------------------------
   */

  const handleMoveClick = (index: number) => {
    const selectedMove = moves[index];

    if (!selectedMove) {
      return;
    }

    const position = new Chess(selectedMove.fen);

    setGame(position);

    setCurrentMoveIndex(index);

    /*
     * Load the saved analysis for this move.
     */
    setAnalysisDraft(analysis[index] ?? "");

    /*
     * If analysis exists, show it.
     * If it doesn't, allow the user to start writing.
     */
    setEditingAnalysis(!analysis[index]);
  };

  /*
   * --------------------------------------------------
   * SAVE ANALYSIS
   * --------------------------------------------------
   */

  const handleSaveAnalysis = () => {
    if (currentMoveIndex === -1) {
      return;
    }

    setAnalysis((previous) => ({
      ...previous,
      [currentMoveIndex]: analysisDraft,
    }));

    setEditingAnalysis(false);
  };

  /*
   * --------------------------------------------------
   * EDIT ANALYSIS
   * --------------------------------------------------
   */

  const handleEditAnalysis = () => {
    if (currentMoveIndex === -1) {
      return;
    }

    setAnalysisDraft(analysis[currentMoveIndex] ?? "");

    setEditingAnalysis(true);
  };

  /*
   * --------------------------------------------------
   * DELETE ANALYSIS
   * --------------------------------------------------
   */

  const handleDeleteAnalysis = () => {
    if (currentMoveIndex === -1) {
      return;
    }

    setAnalysis((previous) => {
      const updated = { ...previous };

      delete updated[currentMoveIndex];

      return updated;
    });

    setAnalysisDraft("");

    setEditingAnalysis(true);
  };

  /*
   * --------------------------------------------------
   * KEYBOARD NAVIGATION
   * --------------------------------------------------
   */

  const handleAnalysisKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    /*
     * Enter = save analysis
     *
     * Shift + Enter = normal newline
     */
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSaveAnalysis();

      /*
       * Remove focus immediately so the arrow keys
       * can control move navigation.
       */
      event.currentTarget.blur();
    }
  };

  /*
   * Global keyboard navigation.
   *
   * Left arrow  = previous move
   * Right arrow = next move
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      /*
       * Don't hijack keyboard arrows while the user
       * is typing into an input or textarea.
       */
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (moves.length === 0) {
        return;
      }

      /*
       * LEFT ARROW
       */
      if (event.key === "ArrowLeft") {
        event.preventDefault();

        const previousIndex = currentMoveIndex - 1;

        if (previousIndex >= 0) {
          const previousMove = moves[previousIndex];

          setGame(new Chess(previousMove.fen));

          setCurrentMoveIndex(previousIndex);

          setAnalysisDraft(
            analysis[previousIndex] ?? ""
          );

          setEditingAnalysis(
            !analysis[previousIndex]
          );
        } else {
          /*
           * Go back to starting position.
           */
          setGame(new Chess());

          setCurrentMoveIndex(-1);

          setAnalysisDraft("");

          setEditingAnalysis(false);
        }
      }

      /*
       * RIGHT ARROW
       */
      if (event.key === "ArrowRight") {
        event.preventDefault();

        const nextIndex = currentMoveIndex + 1;

        if (nextIndex < moves.length) {
          const nextMove = moves[nextIndex];

          setGame(new Chess(nextMove.fen));

          setCurrentMoveIndex(nextIndex);

          setAnalysisDraft(
            analysis[nextIndex] ?? ""
          );

          setEditingAnalysis(
            !analysis[nextIndex]
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [moves, currentMoveIndex, analysis]);

  /*
   * --------------------------------------------------
   * MOVE NUMBER
   * --------------------------------------------------
   */

  const getMoveNumber = (index: number) => {
    return Math.floor(index / 2) + 1;
  };

  /*
   * --------------------------------------------------
   * CURRENT MOVE
   * --------------------------------------------------
   */

  const currentMove =
    currentMoveIndex >= 0
      ? moves[currentMoveIndex]
      : null;

  const currentAnalysis =
    currentMoveIndex >= 0
      ? analysis[currentMoveIndex]
      : undefined;

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="grid items-start grid-cols-[minmax(0,1fr)_380px] gap-8">

      {/* ================================
          CHESSBOARD
          ================================= */}

      <div className="flex items-start justify-center">
        <div className="aspect-square w-full max-w-[700px]">
          <Chessboard
            options={{
              position: game.fen(),

              onPieceDrop: handlePieceDrop,

              boardStyle: {
                borderRadius: "8px",
              },
            }}
          />
        </div>
      </div>

      {/* ================================
          RIGHT SIDE
          ================================= */}

      <div className="flex flex-col gap-6">

        {/* ================================
            MOVE LIST
            ================================= */}

        <section className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">

          <h2 className="font-serif text-lg text-[#d4c4a6]">
            Moves
          </h2>

          <div className="mt-4 max-h-[300px] overflow-y-auto">

            {moves.length === 0 ? (
              <p className="text-sm text-[#786d5b]">
                No moves yet.
              </p>
            ) : (
              <div className="space-y-1">

                {Array.from(
                  {
                    length: Math.ceil(
                      moves.length / 2
                    ),
                  },
                  (_, moveNumber) => {
                    const whiteIndex =
                      moveNumber * 2;

                    const blackIndex =
                      moveNumber * 2 + 1;

                    return (
                      <div
                        key={moveNumber}
                        className="flex items-center gap-2 font-serif text-sm"
                      >

                        {/* MOVE NUMBER */}

                        <span className="w-8 text-right text-[#786d5b]">
                          {moveNumber + 1}.
                        </span>

                        {/* WHITE MOVE */}

                        {moves[whiteIndex] && (
                          <button
                            onClick={() =>
                              handleMoveClick(
                                whiteIndex
                              )
                            }
                            className={`rounded px-2 py-1 transition-colors ${
                              currentMoveIndex ===
                              whiteIndex
                                ? "bg-[#3a1712] text-[#d75a45]"
                                : "text-[#d4c4a6] hover:bg-[#17130f]"
                            }`}
                          >
                            {moves[whiteIndex].san}
                          </button>
                        )}

                        {/* BLACK MOVE */}

                        {moves[blackIndex] && (
                          <button
                            onClick={() =>
                              handleMoveClick(
                                blackIndex
                              )
                            }
                            className={`rounded px-2 py-1 transition-colors ${
                              currentMoveIndex ===
                              blackIndex
                                ? "bg-[#3a1712] text-[#d75a45]"
                                : "text-[#d4c4a6] hover:bg-[#17130f]"
                            }`}
                          >
                            {moves[blackIndex].san}
                          </button>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </section>

        {/* ================================
            ANALYSIS
            ================================= */}

        <section className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-5">

          <p className="text-xs tracking-[0.15em] text-[#786d5b]">
            CURRENT MOVE
          </p>

          <h2 className="mt-2 font-serif text-xl text-[#d4c4a6]">

            {currentMove
              ? `${getMoveNumber(
                  currentMoveIndex
                )}${
                  currentMoveIndex % 2 === 0
                    ? "."
                    : "..."
                } ${currentMove.san}`
              : "Starting position"}

          </h2>

          {/* ================================
              NO MOVE SELECTED
              ================================= */}

          {currentMoveIndex === -1 && (
            <p className="mt-4 text-sm text-[#786d5b]">
              Make a move to begin writing analysis.
            </p>
          )}

          {/* ================================
              EDITING ANALYSIS
              ================================= */}

          {currentMoveIndex >= 0 &&
            editingAnalysis && (
              <div className="mt-4">

                <textarea
                  autoFocus
                  value={analysisDraft}
                  onChange={(event) =>
                    setAnalysisDraft(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleAnalysisKeyDown
                  }
                  placeholder="Write your analysis of this move..."
                  className="min-h-[220px] w-full resize-y rounded-lg border border-[#352819] bg-[#080a09] p-4 font-serif text-sm leading-relaxed text-[#d4c4a6] outline-none placeholder:text-[#5f5649] focus:border-[#80602f]"
                />

                {/* BUTTONS */}

                <div className="mt-3 flex gap-2">

                  <button
                    onClick={
                      handleSaveAnalysis
                    }
                    className="rounded-lg bg-[#a72c20] px-4 py-2 text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
                  >
                    Save
                  </button>

                  <button
                    onClick={
                      handleDeleteAnalysis
                    }
                    className="rounded-lg border border-[#49351f] px-4 py-2 text-sm text-[#b73527] transition-colors hover:bg-[#241512]"
                  >
                    Delete
                  </button>

                </div>

              </div>
            )}

          {/* ================================
              SAVED ANALYSIS
              ================================= */}

          {currentMoveIndex >= 0 &&
            !editingAnalysis && (
              <div className="mt-4">

                <div className="min-h-[220px] rounded-lg border border-[#352819] bg-[#080a09] p-4">

                  {currentAnalysis ? (
                    <p className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-[#d4c4a6]">
                      {currentAnalysis}
                    </p>
                  ) : (
                    <p className="font-serif text-sm text-[#5f5649]">
                      No analysis written yet.
                    </p>
                  )}

                </div>

                {/* BUTTONS */}

                <div className="mt-3 flex gap-2">

                  <button
                    onClick={
                      handleEditAnalysis
                    }
                    className="rounded-lg bg-[#594124] px-4 py-2 text-sm text-[#e1cda9] transition-colors hover:bg-[#70532d]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={
                      handleDeleteAnalysis
                    }
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