import React from 'react';
import './JunQiBoard.css';

const JunQiBoard: React.FC = () => {
  const renderSquare = (row: number, col: number) => {
    const isBlack = (row + col) % 2 === 1;
    return (
      <div
        key={`${row}-${col}`}
        className="square"
        style={{
          backgroundColor: isBlack ? 'black' : 'white',
          width: '50px',
          height: '50px',
        }}
      />
    );
  };

  const renderRow = (row: number) => (
    <div key={row} className="row" style={{ display: 'flex' }}>
      {Array.from({ length: 8 }).map((_, col) => renderSquare(row, col))}
    </div>
  );

  return (
    <div className="chess-board" style={{ display: 'inline-block' }}>
      {Array.from({ length: 8 }).map((_, row) => renderRow(row))}
    </div>
  );
};

export default JunQiBoard;
