// global.d.ts
export {};

declare global {
  interface Window {
    moveHandler?: (move: string) => void;
    jzn?: string;
    game_state?: string;
    updateBoardFromFEN?;
  }
}