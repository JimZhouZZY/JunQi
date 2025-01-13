import React, { useState } from 'react';
import './JunQiBoard.css';

type Piece = {
  type: string;
  color: 'red' | 'blue';
};

const JunQiBoard: React.FC = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(
    Array(12).fill(null).map(() => Array(5).fill(null))
  );

  const updateBoardFromFEN = (fen: string) => {
    const pieces = fen.split('').filter(char => /^[a-zA-Z0-9]$/.test(char));

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
          newBoard[row][col] = { type, color };
          idx++;
        }
      }
    });

    setBoard(newBoard);
  };

  const renderSquare = (row: number, col: number) => {
    const isBlack = (row + col) % 2 === 1;
    const piece = board[row][col];

    // Function to render SVG based on piece type and color
    const renderPieceSVG = (piece: Piece) => {
      const { color, type } = piece;
      const fillColor = color === 'red' ? 'red' : 'blue';

      // Here we use the type as a placeholder for the character, replace with appropriate logic later
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