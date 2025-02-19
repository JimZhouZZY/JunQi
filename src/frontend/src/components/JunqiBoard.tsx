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

const typeToChineseMap: Record<string, string> = {
  "L": "司令",
  "K": "军长",
  "J": "师长",
  "I": "旅长",
  "H": "团长",
  "G": "营长",
  "F": "连长",
  "E": "排长",
  "D": "工兵",
  "C": "地雷",
  "B": "炸弹",
  "A": "军旗",
  '#': "    ",
};

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
          if (char !== "#") {
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
    console.log(newBoard);
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
      let real_start_row = selectedPiece.row;
      let real_start_col = selectedPiece.col;
      let real_end_row = row;
      let real_end_col = col;
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
      let real_start_row = selectedPiece.row;
      let real_start_col = selectedPiece.col;
      let real_end_row = row;
      let real_end_col = col;
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
    // const isBlack = (row + col) % 2 === 1;
    const isBlack = false;
    const piece = board[row][col];

    const size_mult = 1.5;
    // Function to render SVG based on piece type and color
    const renderPieceSVG = (piece: Piece) => {
      const { color, type, selected } = piece;
      let fillColor = color === "red" ? "#ba1818" : "#181eba";
      fillColor = selected ? "purple" : fillColor;

      return (
        <svg
          style={{ userSelect: "none", zIndex: 3}}
          width="60"
          height="40"
          viewBox="0 0 60 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Define gradient effect */}
          <defs>
            <filter id="shadow_f1" x="0" y="0" width="150%" height="150%">
              <feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="black" />
            </filter>
            <filter id="shadow_f2" x="0" y="0" width="150%" height="150%">
              <feDropShadow dx="1" dy="1" stdDeviation="0" flood-color="gray" />
            </filter>
          </defs>

          <rect
            x="5"
            y="4"
            width="50"
            height="30"
            fill={fillColor}
            filter="url(#shadow_f1)" // Use shadow
            rx="2"
            ry="2"  
            // stroke="purple"             // Set the border color to white
            // stroke-width="2"  
          />

          <text
            style={{ pointerEvents: "none"}}
            x="50%"
            y="50%"
            fontSize="20"
            textAnchor="middle"
            dy=".3em"
            fill="white"
            filter="url(#shadow_f2)"
          >
            {typeToChineseMap[type.toUpperCase()] || type}
          </text>
        </svg>
      );
    };

    const renderTexture = (row: number, col: number) => {
      const VerticalLine = () => {
        return
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "2px",
            height: "100%",
            backgroundColor: "black",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        />
      }

      const TopLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "2px",
              height: "50%",
              backgroundColor: "black",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          />);
      }

      const BottomLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "2px",
              height: "100%",
              backgroundColor: "black",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          />
        );
      }

      const TopRail = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "4px",
              height: "50%",
              backgroundColor: "black",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          />);
      }

      const BottomRail = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "4px",
              height: "50%",
              backgroundColor: "black",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          />
        );
      }

      const HorizontalLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "black",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
        );
      }

      const LeftLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-25%",
              width: "75%",
              height: "2px",
              backgroundColor: "black",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
        );
      }

      const RightLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "75%",
              height: "2px",
              backgroundColor: "black",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
        );
      }
      const LeftRail = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "50%",
              height: "4px",
              backgroundColor: "black",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
        );
      }

      const RightRail = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "50%",
              height: "4px",
              backgroundColor: "black",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
        );
      }

      const TopLeftDiagLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "0%",
              left: "0%",
              width: "70%",  // 调整为想要的长度
              height: "2px",
              backgroundColor: "black",
              transform: "translate(-50%, -50%) rotate(31deg)",
              zIndex: 1,
            }}
          />
        );
      }

      const TopRightDiagLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "0%",
              left: "100%",
              width: "70%",  // 调整为想要的长度
              height: "2px",
              backgroundColor: "black",
              transform: "translate(-50%, -50%) rotate(-31deg)",
              zIndex: 1,
            }}
          />
        );
      }

      const BottomLeftDiagLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0%",
              width: "70%",  // 调整为想要的长度
              height: "2px",
              backgroundColor: "black",
              transform: "translate(-50%, -50%) rotate(149deg)",
              zIndex: 1,
            }}
          />
        );
      }

      const BottomRightDiagLine = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "100%",
              width: "70%",  // 调整为想要的长度
              height: "2px",
              backgroundColor: "black",
              transform: "translate(-50%, -50%) rotate(-149deg)",
              zIndex: 1,
            }}
          />
        );
      }

      const CampCircle = () => {
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "35px",  // 设置圆的大小
              height: "35px",
              borderRadius: "50%",  // 使其成为圆形
              border: "4px solid black",  // 设置边框为 2px
              transform: "translate(-50%, -50%)",
              backgroundColor: "lightgray",  // 设置背景颜色
              zIndex: 2,
            }}
          />
        );
      }

      const GarrisonRect = () => {
        return (
          <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "30px",  // 设置矩形宽度
            height: "20px",  // 设置矩形高度
            borderRadius: "6px",  // 圆角半径
            border: "3px solid black",  // 边框样式
            transform: "translate(-50%, -50%)",
            backgroundColor: "lightgray",  // 设置矩形背景颜色
            zIndex: 2,
          }}
        />
      );
      }

      const boardMap = [
        [1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2],
        [2, 0, 1, 0, 2],
        [2, 1, 0, 1, 2],
        [2, 0, 1, 0, 2],
        [2, 3, 2, 3, 2],
        [2, 3, 2, 3, 2],
        [2, 0, 1, 0, 2],
        [2, 1, 0, 1, 2],
        [2, 0, 1, 0, 2],
        [2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1],
      ]

      const top = (row - 1 >= 0) ? boardMap[row - 1][col] : null;
      const bottom = (row + 1 < 12) ? boardMap[row + 1][col] : null;
      const left = (col - 1 >= 0) ? boardMap[row][col - 1] : null;
      const right = (col + 1 < 5) ? boardMap[row][col + 1] : null;

      if (boardMap[row][col] === 1) {
        return (
          <div>
            {<GarrisonRect />}
            {(top !== null) && <TopLine />}
            {(bottom !== null) && <BottomLine />}
            {(left !== null) && <LeftLine />}
            {(right !== null) && <RightLine />}
          </div>
        );
      } else if (boardMap[row][col] === 2) {
        console.log(left);
        return (
          <div>
            {<GarrisonRect />}
            {(top !== null) && (top === 2 || top === 3) ? <TopRail /> : <TopLine />}
            {(bottom !== null) && (bottom === 2 || bottom === 3) ? <BottomRail /> : <BottomLine />}
            {(left !== null) ? ((left === 2 || left === 3) ? <LeftRail /> : <LeftLine />) : null}
            {(right !== null) ? ((right === 2 || right === 3) ? <RightRail /> : <RightLine />) : null}
          </div>
        );
      } else if (boardMap[row][col] === 3) {
        return (
          <div>
            {<GarrisonRect />}
            <LeftRail />
            <RightRail />
          </div>
        );
      } else if (boardMap[row][col] === 0) {
        return (
          <div>
            {<CampCircle />}
            <TopLine />
            <BottomLine />
            <TopLeftDiagLine />
            <TopRightDiagLine />
            <BottomLeftDiagLine />
            <BottomRightDiagLine />
          </div>
        );
      }
    }

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
        }}
        onClick={() => handleClick(row, col)} // Add onClick event here
      >
        {renderTexture(row, col)}
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
