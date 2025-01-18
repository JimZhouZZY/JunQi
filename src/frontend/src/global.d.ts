// global.d.ts
export {};

declare global {
  interface Window {
    moveHandler?: (move: string) => void;
    jzn?: string;
    game_phase?: string;
    updateBoardFromFEN;
    oppo_color: 'red' | 'blue';
  }
}