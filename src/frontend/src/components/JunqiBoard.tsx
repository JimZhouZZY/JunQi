/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./JunqiBoard.css";
import { useGameContext } from "../contexts/GameContext";
import useGameHandler from "../services/GameHandler";

type Piece = {
  type: string;
  color: "red" | "blue";
  row: number;
  col: number;
  selected: boolean;
};

// Define the type for the external API
export interface JunqiBoardRef {
  updateBoardFromFEN: (fen: string) => void;
}

const JunqiBoard = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(
    Array(12)
      .fill(null)
      .map(() => Array(5).fill(null)),
  );
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const { gameRef, setGame, color } = useGameContext();
  const { moveHandler, swapHandler } = useGameHandler();

  const detColorRef = useRef(window.det_color);

  function getDirection(idx: number, mode: "row" | "col") {
    if (mode === "row") return gameRef.current.color === "b" ? idx : 11 - idx;
    else if (mode === "col")
      return gameRef.current.color === "b" ? idx : 4 - idx;
    else return idx;
  }

  function revDirection(idx: number, mode: "row" | "col") {
    console.log(gameRef.current.color, idx, mode);
    if (mode === "row") return 11 - idx;
    else if (mode === "col") return 4 - idx;
    else return idx;
  }

  window.updateBoardFromFEN = function (fen: string) {
    console.log(`Updating board with game:`);
    console.log(gameRef.current);
    const jzn_splitted = fen.split(" ")[0];
    const pieces = jzn_splitted
      .split("")
      .filter((char) => /^[#a-zA-Z0-9]$/.test(char));

    const newBoard: (Piece | null)[][] = Array(12)
      .fill(null)
      .map(() => Array(5).fill(null));

    let idx = 0;

    function detColor() {
      pieces.forEach((piece) => {
        for (const char of piece) {
          if (char !== "#" && char !== "0") {
            detColorRef.current = char === char.toUpperCase() ? "b" : "r";
            console.log(`Determined color ${detColorRef.current}`);
            console.log(`Game(Class) color ${gameRef.current.color}`);
            break;
          }
        }
      });
    }
    if (
      gameRef.current.color === "0" &&
      gameRef.current.game_phase === "MOVING"
    )
      detColor();

    pieces.forEach((piece) => {
      for (const char of piece) {
        if (!isNaN(Number(char)) && Number(char) <= 5) {
          if (Number(char) !== 0) {
            idx += Number(char); // Handle compressed FEN
          } else {
            idx++; // 0 represents empty space
          }
        } else {
          const row = Math.floor(idx / 5);
          const col = idx % 5;
          let curr_color: "red" | "blue";
          if (char != "#") {
            curr_color = char === char.toUpperCase() ? "blue" : "red";
          } else {
            curr_color = gameRef.current.color === "r" ? "blue" : "red";
          }
          const type = char.toUpperCase(); // Use uppercase letters for piece type
          const selected = false;
          // console.log(`TEST: ${type}, ${color}, ${row}, ${col} , ${selected}`);
          newBoard[getDirection(row, "row")][getDirection(col, "col")] = {
            type,
            color: curr_color,
            row: getDirection(row, "row"),
            col: getDirection(col, "col"),
            selected,
          };
          idx++;
        }
      }
    });
    setBoard(newBoard);
  };

  function updatePiece(
    updates: { row: number; col: number; newPiece: Piece | null }[],
  ) {
    let newBoard = [...board]; // Create a copy of the board
    const n = updates.length;
    for (let i = 0; i < n; i++) {
      const { row, col, newPiece } = updates[i];
      const update_piece = {
        type: newPiece!.type,
        row: row,
        col: col,
        color: newPiece!.color,
        selected: newPiece!.selected,
      };

      newBoard = newBoard.map((rowArray, j) =>
        j === row
          ? rowArray.map((cell, k) => (k === col ? update_piece : cell))
          : rowArray,
      );
    }

    // Update the board state
    setBoard(newBoard);
  }

  function convertToChessNotation(row: number, col: number): string {
    const rowString = String.fromCharCode(97 + row); // 97 是 'a' 的 ASCII 值
    const colString = (col + 1).toString(); // 将 col 转换为从 1 开始
    return rowString + colString;
  }

  function handleClick(row: number, col: number) {
    const piece = board[row][col];
    if (
      selectedPiece &&
      piece &&
      selectedPiece.color != piece.color &&
      gameRef.current.game_phase == "MOVING"
    ) {
      // Attack another piece
      var real_start_row = selectedPiece.row;
      var real_start_col = selectedPiece.col;
      var real_end_row = row;
      var real_end_col = col;
      console.log(gameRef.current.color);
      console.log(real_start_row, real_start_col, real_end_row, real_end_col);
      if (selectedPiece.color === "red") {
        real_start_row = revDirection(real_start_row, "row");
        real_start_col = revDirection(real_start_col, "col");
        real_end_row = revDirection(real_end_row, "row");
        real_end_col = revDirection(real_end_col, "col");
      }
      const move =
        convertToChessNotation(real_start_row, real_start_col) +
        convertToChessNotation(real_end_row, real_end_col);
      if (moveHandler) {
        moveHandler(move);
      } else {
        console.error("moveHandler function is not available");
      }
      updatePiece([
        {
          row: selectedPiece!.row,
          col: selectedPiece!.col,
          newPiece: {
            type: selectedPiece!.type,
            color: selectedPiece!.color,
            row: selectedPiece!.row,
            col: selectedPiece!.col,
            selected: false,
          },
        },
      ]);
      setSelectedPiece(null);
    } else if (
      gameRef.current.game_phase == "DEPLOYING" &&
      selectedPiece &&
      piece &&
      selectedPiece.color == piece.color
    ) {
      // Swap pieces during deployment phase
      const temp_piece: Piece = {
        type: piece.type,
        row: piece.row,
        col: piece.col,
        color: piece.color,
        selected: false,
      };
      const swap =
        convertToChessNotation(selectedPiece.row, selectedPiece.col) +
        convertToChessNotation(piece.row, piece.col);
      let canSwap = false;
      if (swapHandler) {
        canSwap = swapHandler(swap);
      } else {
        console.error("swapHandler function is not available");
      }
      if (canSwap) {
        updatePiece([
          { row: piece.row, col: piece.col, newPiece: selectedPiece },
          {
            row: selectedPiece.row,
            col: selectedPiece.col,
            newPiece: temp_piece,
          },
        ]);
        setSelectedPiece(null);
      }
    } else if (piece && piece.type !== "#") {
      // If a piece is clicked, set it as selected
      const updates = [];
      if (selectedPiece) {
        updates.push({
          row: selectedPiece.row,
          col: selectedPiece.col,
          newPiece: {
            type: selectedPiece.type,
            color: selectedPiece.color,
            row: selectedPiece.row,
            col: selectedPiece.col,
            selected: false,
          },
        });
      }
      setSelectedPiece(piece);
      updates.push({
        row: piece!.row,
        col: piece!.col,
        newPiece: {
          type: piece!.type,
          color: piece!.color,
          row: piece!.row,
          col: piece!.col,
          selected: true,
        },
      });
      updatePiece(updates);
      console.log(
        `Piece selected: ${piece.type} (${piece.color}) at (${row}, ${col})`,
      );
    } else if (selectedPiece && gameRef.current.game_phase == "MOVING") {
      // Move to an empty square
      var real_start_row = selectedPiece.row;
      var real_start_col = selectedPiece.col;
      var real_end_row = row;
      var real_end_col = col;
      console.log(gameRef.current);
      console.log(gameRef.current.color);
      console.log(real_start_row, real_start_col, real_end_row, real_end_col);
      if (selectedPiece.color === "red") {
        real_start_row = revDirection(real_start_row, "row");
        real_start_col = revDirection(real_start_col, "col");
        real_end_row = revDirection(real_end_row, "row");
        real_end_col = revDirection(real_end_col, "col");
      }
      console.log(real_start_row, real_start_col, real_end_row, real_end_col);
      const move =
        convertToChessNotation(real_start_row, real_start_col) +
        convertToChessNotation(real_end_row, real_end_col);
      if (moveHandler) {
        moveHandler(move);
      } else {
        console.error("moveHandler function is not available");
      }
      updatePiece([
        {
          row: selectedPiece!.row,
          col: selectedPiece!.col,
          newPiece: {
            type: selectedPiece!.type,
            color: selectedPiece!.color,
            row: selectedPiece!.row,
            col: selectedPiece!.col,
            selected: false,
          },
        },
      ]);
      setSelectedPiece(null);
      /* DEBUG */
      /*
        console.log(`Move ${selectedPiece.type} to (${row}, ${col})`);
        // Example of moving the piece, implement your move logic here
        const newBoard = [...board];
        newBoard[row][col] = selectedPiece;
        newBoard[selectedPiece.row!][selectedPiece.col!] = null; // Remove piece from previous position
        setBoard(newBoard);
        setSelectedPiece(null); // Deselect the piece after moving
        */
    }
  }

  function renderSquare(row: number, col: number) {
    const isBlack = (row + col) % 2 === 1;
    const piece = board[row][col];

    const size_mult = 1.5;
    // Function to render SVG based on piece type and color
    const renderPieceSVG = (piece: Piece) => {
      const { color, type, selected } = piece;
      let fillColor = color === "red" ? "red" : "blue";
      fillColor = selected ? "purple" : fillColor;

      return (
        <svg
          style={{ userSelect: "none" }}
          width="30"
          height="30"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="10" width="80" height="80" fill={fillColor} />
          <text
            style={{ pointerEvents: "none" }}
            x="50%"
            y="50%"
            fontSize="30"
            textAnchor="middle"
            dy=".3em"
            fill="white"
          >
            {type}
          </text>
        </svg>
      );
    };
    return (
      <div
        key={`${row}-${col}`}
        className="square"
        style={{
          backgroundColor: isBlack ? "black" : "white",
          width: `${size_mult * 50}px`,
          height: `${size_mult * 30}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid gray",
        }}
        onClick={() => handleClick(row, col)} // Add onClick event here
      >
        {piece && renderPieceSVG(piece)}
      </div>
    );
  }

  const renderRow = (row: number) => (
    <div key={row} className="row" style={{ display: "flex" }}>
      {Array.from({ length: 5 }).map((_, col) => renderSquare(row, col))}
    </div>
  );

  useEffect(() => {
    default_setup();
  }, []);

  function default_setup() {
    const default_jzn =
      "000000000000000000000000000000LKJJII0H0HGG0FFF0E0EEDDDBBCCAC r 0 0";
    window.updateBoardFromFEN(default_jzn);
  }

  return (
    <div className="chess-board" style={{ display: "inline-block" }}>
      {Array.from({ length: 12 }).map((_, row) => renderRow(row))}
    </div>
  );
};

export default JunqiBoard;
