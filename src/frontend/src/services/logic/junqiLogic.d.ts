/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import { node } from "./types/junqiNode.mjs";
import JunqiBoard from "./types/junqiBoard.mjs";

export default class JunqiGame {
  rows: number;
  cols: number;
  jzn: string;
  board: JunqiBoard;
  is_terminal: boolean;
  winner: string;
  skipped_actions: Map<string, number>;
  layout: Map<string, string>;
  color: string;
  oppo_color: string;
  game_phase: string;

  constructor(jzn?: string, color?: string, game_phase?: string);

  private static changeString(
    str: string,
    index: number,
    change: string,
  ): string;
  private static splitBySpace(inputString: string): string[];
  static getColor(piece: string): string;

  public isLegalAction(request: string): boolean;
  public applyAction(request: string): string;
  public isTerminal(): boolean;
  public getWinner(): string;
  public isLegalLayout(layout: string): boolean;
  public getMaskedJzn(color: string): string;
  public getCurrentPlayer(): string;
  public applyLayout(layout: string): void;
}
