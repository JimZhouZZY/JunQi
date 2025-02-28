/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const { node } = require("./types/junqiNode.js");
const JunqiBoard = require("./types/junqiBoard");

class JunqiGame {
  constructor(
    jzn = "0".repeat(60) + " r 0 0",
    color = "0",
    game_phase = "MOVING",
  ) {
    this.rows = 12;
    this.cols = 5;
    this.jzn = jzn; // JZN stands for 'Jim-Zhou Notation'
    this.board = new JunqiBoard();
    this.is_terminal = false;
    this.winner = "";
    this.skipped_actions = new Map([
      ["r", 3],
      ["b", 3],
    ]);
    this.layout = new Map();
    this.color = color;
    this.oppo_color = color === "0" ? "0" : color === "r" ? "b" : "r";
    this.game_phase = game_phase;
  }

  static changeString(str, index, change) {
    return str.slice(0, index) + change + str.slice(index + 1);
  }

  static splitBySpace(inputString) {
    // 使用空格分割字符串
    return inputString.split(" ");
  }

  static getColor(piece) {
    return piece === piece.toLowerCase() ? "r" : "b";
  }

  isLegalAction(request) {
    const blockedNodes = new Set();
    const boardState = this.jzn;

    const canMoveAsEngineer = (start, end, blockedNodes = new Set()) => {
      start = node(start, "railway");
      end = node(end, "railway");
      if (start.type !== "railway" || end.type !== "railway") {
        return false; // 起点或终点必须是铁路节点
      }

      // BFS
      let queue = [start];
      let visited = new Set();
      visited.add(start);

      while (queue.length > 0) {
        const current = queue.shift();

        if (current === end) {
          return true; // 找到通路
        }

        // 遍历所有邻接节点
        for (const neighbor of this.board.getNeighbors(current)) {
          if (
            neighbor.type === "railway" && // 必须是铁路节点
            !visited.has(neighbor) && // 未访问过
            (!blockedNodes.has(neighbor) || end === neighbor) // 未被阻挡
          ) {
            queue.push(neighbor);
            visited.add(neighbor);
          }
        }
      }
      return false; // 未找到通路
    };

    const boardArray = JunqiGame.splitBySpace(boardState);
    const short_jzn = boardArray[0];

    const headI = request.charCodeAt(0) - 97;
    const headJ = Number(request[1]) - 1;
    const headPosition = `${headI}-${headJ}`;
    if (
      JunqiGame.getColor(this.jzn[headI * 5 + headJ]) !==
      this.getCurrentPlayer()
    ) {
      return false;
    }

    const tailI = request.charCodeAt(2) - 97;
    const tailJ = Number(request[3]) - 1;
    const tailPosition = `${tailI}-${tailJ}`;

    // 记录被阻挡的节点
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 5; j++) {
        if (short_jzn[i * 5 + j] !== "0") {
          blockedNodes.add(node(`${i}-${j}`, "railway"));
        }
      }
    }

    // 判断目标和当前位置的兵种
    const target = short_jzn[headI * 5 + headJ];
    const goal = short_jzn[tailI * 5 + tailJ];

    // 同类相吃
    const targetCode = target.charCodeAt(0) - 65;
    const goalCode = goal.charCodeAt(0) - 65;

    if (
      (targetCode >= 0 &&
        targetCode <= 26 &&
        goalCode >= 0 &&
        goalCode <= 26) ||
      (targetCode > 26 && goalCode > 26)
    ) {
      return false;
    }

    // 行营不能动
    if (
      [
        "2-1",
        "2-3",
        "3-2",
        "4-1",
        "4-3",
        "7-1",
        "7-3",
        "8-2",
        "9-1",
        "9-3",
      ].includes(tailPosition) &&
      goalCode !== -17
    ) {
      return false;
    }

    // 自己走自己
    if (headPosition === tailPosition) {
      return false;
    }

    // 本身就是空的
    if (target === "0") {
      return false;
    }

    let flag = true;

    if (target === "d" || target === "D") {
      if (
        this.board.adjList.has(node(headPosition, "railway")) &&
        this.board.adjList.has(node(tailPosition, "railway"))
      ) {
        flag = canMoveAsEngineer(headPosition, tailPosition, blockedNodes);
      } else {
        flag = this.board.areAdjacent(node(headPosition), node(tailPosition));
      }
    } else if (
      ["a", "A", "c", "C"].includes(target) ||
      headPosition === "0-1" ||
      headPosition === "11-1" ||
      headPosition === "0-3" ||
      headPosition === "11-3"
    ) {
      flag = false;
    } else {
      if (
        this.board.adjList.has(node(headPosition, "railway")) &&
        this.board.adjList.has(node(tailPosition, "railway"))
      ) {
        if (
          (headI !== tailI && headJ !== tailJ) ||
          (headI === tailI && ![1, 5, 6, 10].includes(headI)) ||
          (headJ === tailJ && ![0, 4].includes(headJ))
        ) {
          flag = false;
        } else {
          if (headI === tailI) {
            if (tailJ > headJ) {
              for (let i = headJ + 1; i < tailJ; i++) {
                let point = node(`${headI}-${i}`, "railway");
                if (blockedNodes.has(point)) {
                  flag = false;
                }
              }
            } else {
              for (let i = headJ - 1; i > tailJ; i--) {
                let point = node(`${headI}-${i}`, "railway");
                if (blockedNodes.has(point)) {
                  flag = false;
                }
              }
            }
          }
          if (headJ === tailJ) {
            if (
              (headJ === 1 || headJ === 3) &&
              ((headI === 5 && tailI === 6) || (tailI === 5 && headI === 6))
            ) {
              flag = false;
            }
            if (tailI > headI) {
              for (let i = headI + 1; i < tailI; i++) {
                let point = node(`${i}-${headJ}`, "railway");
                if (blockedNodes.has(point)) {
                  flag = false;
                }
              }
            } else {
              for (let i = headI - 1; i > tailI; i--) {
                let point = node(`${i}-${headJ}`, "railway");
                if (blockedNodes.has(point)) {
                  flag = false;
                }
              }
            }
          }
        }
      } else {
        flag = false;
      }

      flag =
        flag || this.board.areAdjacent(node(headPosition), node(tailPosition));
    }

    return flag;
  }

  applyAction(request) {
    const boardState = this.jzn;
    const splitResult = JunqiGame.splitBySpace(boardState);
    let short_jzn = splitResult[0];
    let curr_player = splitResult[1];
    let semi_moves = Number(splitResult[2]);
    let total_moves = Number(splitResult[3]);

    const headI = request.charCodeAt(0) - 97;
    const headJ = Number(request[1]) - 1;
    const tailI = request.charCodeAt(2) - 97;
    const tailJ = Number(request[3]) - 1;

    const currPiece = short_jzn[headI * 5 + headJ];
    const goalPiece = short_jzn[tailI * 5 + tailJ];
    let peaceMove = true;

    function updateStringAtIndex(str, index, newChar) {
      return str.slice(0, index) + newChar + str.slice(index + 1);
    }

    let targetCharCode = currPiece.charCodeAt(0);
    let goalCharCode = goalPiece.charCodeAt(0);

    // 转为小写字母
    if (targetCharCode < 97) {
      targetCharCode += 32;
    }
    if (goalCharCode < 97) {
      goalCharCode += 32;
    }

    const targetLower = String.fromCharCode(targetCharCode);
    const goalLower = String.fromCharCode(goalCharCode);

    if (goalPiece === "0") {
      short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
      short_jzn = updateStringAtIndex(short_jzn, tailI * 5 + tailJ, currPiece);
      // TODO: peaceMove 逻辑可能有问题
      peaceMove = false;
    }
    // 处理棋子 "d" 或 "D"
    else if (currPiece === "d" || currPiece === "D") {
      if (goalPiece === "d" || goalPiece === "D") {
        short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
        short_jzn = updateStringAtIndex(short_jzn, tailI * 5 + tailJ, "0");
        peaceMove = false;
      } else {
        if (goalPiece === "c" || goalPiece === "C") {
          short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
          short_jzn = updateStringAtIndex(
            short_jzn,
            tailI * 5 + tailJ,
            currPiece,
          );
          peaceMove = false;
        } else if (goalPiece === "b" || goalPiece === "B") {
          short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
          short_jzn = updateStringAtIndex(short_jzn, tailI * 5 + tailJ, "0");
          peaceMove = false;
        } else if (goalPiece === "a" || goalPiece === "A") {
          short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, currPiece);
          short_jzn = updateStringAtIndex(short_jzn, tailI * 5 + tailJ, currPiece);
          peaceMove = false;
        }
        else {
          short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
          peaceMove = false;
        }
      }
    }

    // 处理棋子 "b" 或 "B"
    else if (
      currPiece === "b" ||
      currPiece === "B" ||
      goalPiece === "b" ||
      goalPiece === "B"
    ) {
      short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
      short_jzn = updateStringAtIndex(short_jzn, tailI * 5 + tailJ, "0");
      peaceMove = false;
    } else if (goalPiece === "c" || goalPiece === "C") {
      short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
      peaceMove = false;
    }

    // 比较目标棋子的大小
    else {
      if (targetLower > goalLower) {
        short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
        short_jzn = updateStringAtIndex(
          short_jzn,
          tailI * 5 + tailJ,
          currPiece,
        );
        peaceMove = false;
      } else {
        if (targetLower < goalLower) {
          short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
          peaceMove = false;
        } else {
          short_jzn = updateStringAtIndex(short_jzn, headI * 5 + headJ, "0");
          short_jzn = updateStringAtIndex(short_jzn, tailI * 5 + tailJ, "0");
          peaceMove = false;
        }
      }
    }

    total_moves += 1;
    if (!peaceMove) {
      semi_moves = 1;
    }

    // 切换当前玩家
    curr_player = curr_player === "r" ? "b" : "r";

    const updatedState = `${short_jzn} ${curr_player} ${String(semi_moves)} ${String(total_moves)}`;
    this.jzn = updatedState;

    return updatedState;
  }

  isTerminal() {
    const red_string = this.getMaskedJzn("r");
    const blue_string = this.getMaskedJzn("b");
    const length = this.rows * this.cols;

    const splitResult = JunqiGame.splitBySpace(this.jzn);
    let special_check = splitResult[0];
    if (special_check === "0".repeat(length)) {
      return false;
    }

    if (
      (red_string[1] != "a" && red_string[3] != "a") ||
      (blue_string[56] != "A" && blue_string[58] != "A")
    ) {
      return true;
    }

    let red_count = 0;
    let blue_count = 0;

    for (let i = 0; i < length; i++) {
      if (
        red_string[i] != "0" &&
        red_string[i] != "#" &&
        red_string[i] != "c" &&
        i != 1 &&
        i != 3 &&
        i != 56 &&
        i != 58
      ) {
        red_count++;
      }
      if (
        blue_string[i] != "0" &&
        blue_string[i] != "#" &&
        blue_string[i] != "C" &&
        i != 1 &&
        i != 3 &&
        i != 56 &&
        i != 58
      ) {
        blue_count++;
      }
    }

    if (red_count === 0 || blue_count === 0) {
      return true;
    }

    const red_result = JunqiGame.splitBySpace(red_string);
    const blue_result = JunqiGame.splitBySpace(blue_string);

    if (Number(red_result[2]) === 31 || Number(blue_result[2]) === 31) {
      return true;
    }
    if (this.skipped_actions["r"] < 0 || this.skipped_actions["b"] < 0) {
      return true;
    }

    return false;
  }

  getWinner() {
    const red_string = this.getMaskedJzn("r");
    const blue_string = this.getMaskedJzn("b");
    const length = this.rows * this.cols;

    if (red_string[1] != "a" && red_string[3] != "a") {
      return "b";
    }
    if (blue_string[56] != "A" && blue_string[58] != "A") {
      return "r";
    }
    let red_count = 0;
    let blue_count = 0;

    for (let i = 0; i < length; i++) {
      if (
        red_string[i] != "0" &&
        red_string[i] != "#" &&
        red_string[i] != "c" &&
        i != 1 &&
        i != 3 &&
        i != 56 &&
        i != 58
      ) {
        red_count++;
      }
      if (
        blue_string[i] != "0" &&
        blue_string[i] != "#" &&
        blue_string[i] != "C" &&
        i != 1 &&
        i != 3 &&
        i != 56 &&
        i != 58
      ) {
        blue_count++;
      }
    }

    if (red_count === 0 && blue_count > 0) {
      return "b";
    }
    if (red_count > 0 && blue_count === 0) {
      return "r";
    }
    if (red_count === 0 && blue_count === 0) {
      return "0";
    }
    const red_result = JunqiGame.splitBySpace(red_string);
    const blue_result = JunqiGame.splitBySpace(blue_string);

    if (Number(red_result[2]) === 31) {
      return "b";
    }
    if (Number(blue_result[2]) === 31) {
      return "r";
    }
  }

  isLegalLayout(layout_original) {
    function Checkout(busket) {
      const chess1 = ["l", "L", "k", "K", "a", "A"];
      const chess2 = ["j", "J", "i", "I", "h", "H", "g", "G", "b", "B"];
      const chess3 = ["f", "F", "e", "E", "d", "D", "c", "C"];

      let number_eachchess = busket.get("0");
      if (number_eachchess !== 5) {
        return false;
      }
      for (const key of busket.keys()) {
        let number_eachchess = busket.get(key);
        if (chess1.includes(key)) {
          if (number_eachchess !== 1) {
            return false;
          }
        }
        if (chess2.includes(key)) {
          if (number_eachchess !== 2) {
            return false;
          }
        }
        if (chess3.includes(key)) {
          if (number_eachchess !== 3) {
            return false;
          }
        }
      }
      return true;
    }

    function reverseString(str) {
      return str.split("").reverse().join("");
    }
    let layout;
    if (layout_original.charCodeAt(0) < 97 && layout_original[0] != "0") {
      layout = reverseString(layout_original);
    } else {
      layout = layout_original;
    }
    let busket = new Map();
    const board_number = layout.length;
    if (board_number > 30) {
      return false;
    }
    let flag = false;
    if (
      layout[1] === "a" ||
      layout[3] === "a" ||
      layout[1] === "A" ||
      layout[3] === "A"
    ) {
      flag = true;
    }
    if (flag != true) {
      return false;
    }
    if (
      layout[11] != "0" ||
      layout[13] != "0" ||
      layout[17] != "0" ||
      layout[21] != "0" ||
      layout[23] != "0"
    ) {
      return false;
    }

    for (let i = 0; i < board_number; i++) {
      if (i > 9 && (layout[i] === "c" || layout[i] === "C")) {
        return false;
      }
      if (i > 24 && (layout[i] === "b" || layout[i] === "B")) {
        return false;
      }
      if (busket.get(layout[i]) == undefined) {
        busket.set(layout[i], 1);
      } else {
        let old_number = busket.get(layout[i]);
        busket.set(layout[i], old_number + 1);
      }
    }

    return Checkout(busket);
  }

  applyLayout(layout) {
    const ascii_number = layout.charCodeAt(0);
    let player, start;
    if (ascii_number < 97) {
      player = "b";
      start = 30;
    } else {
      player = "r";
      start = 0;
    }

    for (let i = start; i < start + 30; i++) {
      this.jzn = JunqiGame.changeString(this.jzn, i, layout[i - start]);
    }
    this.layout = this.layout.set(player, layout);
  }

  getMaskedJzn(player) {
    let ascii_min, ascii_max, commander, flag;
    if (player === "b") {
      ascii_min = "a".charCodeAt(0);
      ascii_max = "z".charCodeAt(0);
      commander = "l";
      flag = "a";
    } else {
      ascii_min = "A".charCodeAt(0);
      ascii_max = "Z".charCodeAt(0);
      commander = "L";
      flag = "A";
    }

    const length = this.rows * this.cols;
    let masked_jzn = this.jzn;
    let position = 100; //a number that is not in the range of 0-59
    for (let i = 0; i < length; i++) {
      if (masked_jzn[i] === flag) {
        position = i;
      }

      if (
        masked_jzn[i].charCodeAt(0) >= ascii_min &&
        masked_jzn[i].charCodeAt(0) <= ascii_max
      ) {
        masked_jzn = JunqiGame.changeString(masked_jzn, i, "#");
      }
    }
    let commander_state = false;
    for (let i = 0; i < length; i++) {
      if (this.jzn[i] === commander) {
        commander_state = true;
        break;
      }
    }
    if (!commander_state && position != 100) {
      if (player === "r") {
        masked_jzn = JunqiGame.changeString(masked_jzn, position, "A");
      } else {
        masked_jzn = JunqiGame.changeString(masked_jzn, position, "a");
      }
    }

    return masked_jzn;
  }

  skipAction(player) {
    let number = this.skipped_actions.get(player);
    this.skipped_actions.set(player, number - 1);
  }

  getJzn() {
    return this.jzn;
  }

  getCurrentPlayer() {
    return this.jzn.split(" ")[1];
  }

  applySkip(color='0') {    
    const boardState = this.jzn;
    const splitResult = JunqiGame.splitBySpace(boardState);
    let short_jzn = splitResult[0];
    let curr_player = splitResult[1];
    let semi_moves = Number(splitResult[2]);
    let total_moves = Number(splitResult[3]);

    color = color === '0' ? this.getCurrentPlayer() : color;
    const prev_skips = this.skipped_actions.get(color);
    this.skipped_actions.set(color, prev_skips - 1);

    if (prev_skips <= 1) {
      this.is_terminal = true;
    }
    
    curr_player = curr_player === "r" ? "b" : "r";
    semi_moves += 1;
    total_moves += 1;

    const updatedState = `${short_jzn} ${curr_player} ${String(semi_moves)} ${String(total_moves)}`;
    this.jzn = updatedState;
  }
}

module.exports = JunqiGame;
