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
    const pieces = fen.split('').filter(char => /^[a-zA-Z0-9]$/.test(char));;

    const newBoard: (Piece | null)[][] = Array(12)
      .fill(null)
      .map(() => Array(5).fill(null));

    let idx = 0;
    pieces.forEach((piece, piecesIndex) => {
      for (const char of piece) {
        if (!isNaN(Number(char)) && Number(char) <= 5) {
          if (Number(char) != 0) {
            idx += Number(char); //  This line is in case for condensed FEN
          } else {
            idx++; // 0 represents empty
          }
        } else {
          const row = Math.floor(idx /5);
          const col = idx % 5;
          const color = char === char.toUpperCase() ? 'red' : 'blue';
          const type = char.toUpperCase(); // 使用大写字母表示棋子类型
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
        {piece && (
          <div
            style={{
              color: piece.color === 'red' ? 'red' : 'blue',
              fontWeight: 'bold',
            }}
          >
            {piece.type}
          </div>
        )}
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
            '0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0' // 示例FEN字符串
          )
        }
      >
        Set Board
      </button>
    </div>
  );
};

export default JunQiBoard;