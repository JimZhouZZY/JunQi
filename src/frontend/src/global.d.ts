// global.d.ts
export {};

declare global {
  interface Window {
    moveHandler?: (move: string) => void;
    swapHandler?: (move: string) => boolean;
    jzn?: string;
    game_phase?: string;
    updateBoardFromFEN;
    det_color?: 'r' | 'b' | '0';
    oppo_color: 'red' | 'blue';
  }
}