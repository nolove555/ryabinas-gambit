import { useState } from "react";
import { Chess } from "chess.js";
import {
  Chessboard,
  type PieceDropHandlerArgs,
} from "react-chessboard";

function ChessGame() {
  const [game, setGame] = useState(new Chess());

  function makeMove(sourceSquare: string, targetSquare: string) {
    const gameCopy = new Chess(game.fen());

    try {
      gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      setGame(gameCopy);

      console.log("Move:", sourceSquare, "→", targetSquare);

      return true;
    } catch {
      console.log("Illegal move");

      return false;
    }
  }

  function handlePieceDrop({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) {
    if (!targetSquare) {
      return false;
    }

    return makeMove(sourceSquare, targetSquare);
  }

  const chessboardOptions = {
    position: game.fen(),
    onPieceDrop: handlePieceDrop,
  };

  return (
    <div className="flex justify-center">
      <Chessboard options={chessboardOptions} />
    </div>
  );
}

export default ChessGame;