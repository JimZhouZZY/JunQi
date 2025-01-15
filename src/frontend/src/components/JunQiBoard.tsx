import React, { useState, useRef, useEffect } from "react";
import './JunQiBoard.css';

type Piece = {
  type: string;
  color: 'red' | 'blue';
  row: number;
  col: number;
};

type MoveHandler = (move: string) => void;

interface JunQiBoardProps {
  moveHandler?: MoveHandler;
}

//window.moveHandler = (move) => {
//  console.log(`Move ${move}`);
//}

window.jzn = '000000000000000000000000000000000000000000000000000000000000';

const JunQiBoard: React.FC<JunQiBoardProps> = ({
  moveHandler = window.moveHandler
}) => {
  const [board, setBoard] = useState<(Piece | null)[][]>(Array(12).fill(null).map(() => Array(5).fill(null)));
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  function updateBoardFromFEN(fen: string) {
    const jzn_splitted = fen.split(" ")[0];
    const pieces = jzn_splitted.split('').filter(char => /^[a-zA-Z0-9]$/.test(char));

    const newBoard: (Piece | null)[][] = Array(12)
      .fill(null)
      .map(() => Array(5).fill(null));

    let idx = 0;
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
          const color = char === char.toUpperCase() ? 'blue' : 'red';
          const type = char.toUpperCase(); // Use uppercase letters for piece type
          newBoard[row][col] = { type, color, row, col };
          idx++;
        }
      }
    });
    setBoard(newBoard);
  };

  function convertToChessNotation(row: number, col: number): string {
    const rowString = String.fromCharCode(97 + row); // 97 是 'a' 的 ASCII 值
    const colString = (col + 1).toString(); // 将 col 转换为从 1 开始
    return rowString + colString;
}
  function handleClick(row: number, col: number) {
    const piece = board[row][col];
    if (selectedPiece && piece && selectedPiece.color != piece.color) {
      const move = convertToChessNotation(selectedPiece.row, selectedPiece.col) + convertToChessNotation(row, col);
      if (window.moveHandler) {
        window.moveHandler(move);
      } else {
        console.error("moveHandler function is not available");
      }
      setSelectedPiece(null);
    }
    if (piece) {
      // If a piece is clicked, set it as selected
      setSelectedPiece(piece);
      console.log(`Piece selected: ${piece.type} (${piece.color}) at (${row}, ${col})`);
    } else {
      // If no piece is clicked, handle an empty space click (e.g., move the selected piece)
      if (selectedPiece) {
        const move = convertToChessNotation(selectedPiece.row, selectedPiece.col) + convertToChessNotation(row, col);
        if (window.moveHandler) {
          window.moveHandler(move);
        } else {
          console.error("moveHandler function is not available");
        }
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
  };

  function renderSquare(row: number, col: number) {
    const isBlack = (row + col) % 2 === 1;
    const piece = board[row][col];

    // Function to render SVG based on piece type and color
    const renderPieceSVG = (piece: Piece) => {
      const { color, type } = piece;
      const fillColor = color === 'red' ? 'red' : 'blue';

      return (
        <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" fill={fillColor} />
          <text x="50%" y="50%" fontSize="30" textAnchor="middle" dy=".3em" fill="white">
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
          backgroundColor: isBlack ? 'black' : 'white',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid gray',
        }}
        onClick={() => handleClick(row, col)} // Add onClick event here
      >
        {piece && renderPieceSVG(piece)}
      </div>
    );
  };

  const renderRow = (row: number) => (
    <div key={row} className="row" style={{ display: 'flex' }}>
      {Array.from({ length: 5 }).map((_, col) => renderSquare(row, col))}
    </div>
  );


  useEffect(() => {
    window.updateBoardFromFEN = updateBoardFromFEN; // 可选：暴露到全局对象
  }, []);

  return (
    <div className="chess-board" style={{ display: 'inline-block' }}>
      {Array.from({ length: 12 }).map((_, row) => renderRow(row))}
      <button
        onClick={() =>
          updateBoardFromFEN(
            '0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0' // Example FEN string
          )
        }
      >
        Set Board
      </button>
    </div>
  );
};

export default JunQiBoard;