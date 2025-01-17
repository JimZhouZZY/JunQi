import { node, JunqiNode } from './types/junqiNode.mjs';
import JunqiBoard from './types/junqiBoard.mjs';

export default class JunqiGame {
    constructor(jzn='0'.repeat(60)+' r 0 0') {
        this.rows = 12;
        this.cols = 5;
        this.jzn = jzn; // JZN stands for 'Jim-Zhou Notation'
        this.board = new JunqiBoard();
        this.is_terminal = false;
        this.winner = "";
        this.skipped_actions = new Map([['r', 3],['b', 3]]);
        this.layout = new Map;
    }

    static changeString(str, index, change){
        return str.slice(0, index) + change + s.slice(index + 1);
    }

    isLegalAction(request) {
        const blockedNodes = new Set();
        const boardState = this.jzn;
    
        const canMoveAsEngineer = (start, end, blockedNodes = new Set()) => {
            start = node(start, 'railway');
            end = node(end, 'railway');
            if (start.type !== 'railway' || end.type !== 'railway') {
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
                        (neighbor.type === 'railway') && // 必须是铁路节点
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
    
        const splitBySpace = (inputString) => {
            return inputString.split(" ");
        };
    
        const boardArray = splitBySpace(boardState);
        const row1 = boardArray[0];
        const row2 = boardArray[1];
        const row3 = boardArray[2];
        const row4 = boardArray[3];
    
        const headI = request.charCodeAt(0) - 97;
        const headJ = Number(request[1]) - 1;
        const headPosition = `${headI}-${headJ}`;
    
        const tailI = request.charCodeAt(2) - 97;
        const tailJ = Number(request[3]) - 1;
        const tailPosition = `${tailI}-${tailJ}`;
    
        // 记录被阻挡的节点
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 5; j++) {
                if (row1[i * 5 + j] !== "0") {
                    blockedNodes.add(node(`${i}-${j}`, 'railway'));
                }
            }
        }
    
        // 判断目标和当前位置的兵种
        const target = row1[headI * 5 + headJ];
        const goal = row1[tailI * 5 + tailJ];
    
        // 同类相吃
        const targetCode = target.charCodeAt(0) - 65;
        const goalCode = goal.charCodeAt(0) - 65;
    
        if ((targetCode >= 0 && targetCode <= 26 && goalCode >= 0 && goalCode <= 26) ||
            (targetCode > 26 && goalCode > 26)) {
            return false;
        }
    
        // 行营不能动
        if (["2-1", "2-3", "3-2", "4-1", "4-3", "7-1", "7-3", "8-2", "9-1", "9-3"].includes(tailPosition) && goalCode !== -17) {
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
            if (this.board.adjList.has(node(headPosition, 'railway')) && this.board.adjList.has(node(tailPosition, 'railway'))) {
                flag = canMoveAsEngineer(headPosition, tailPosition, blockedNodes);
            } else {
                flag = this.board.areAdjacent(node(headPosition), node(tailPosition));
            }
        } else if (["a", "A", "c", "C"].includes(target) || headPosition === "0-1" || headPosition === "11-1" ||
                   headPosition === "0-3" || headPosition === "11-3") {
            flag = false;
        } else {
            if (this.board.adjList.has(node(headPosition, 'railway')) && this.board.adjList.has(node(tailPosition, 'railway'))) {
                if ((headI !== tailI && headJ !== tailJ) ||
                    (headI === tailI && ![1, 5, 6, 10].includes(headI)) ||
                    (headJ === tailJ && ![0, 4].includes(headJ))) {
                    flag = false;
                } else {
                    if (headI === tailI) {
                        if (tailJ > headJ) {
                            for (let i = headJ + 1; i < tailJ; i++) {
                                let point = node(`${headI}-${i}`, 'railway');
                                if (blockedNodes.has(point)) {
                                    flag = false;
                                }
                            }
                        } else {
                            for (let i = headJ - 1; i > tailJ; i--) {
                                let point = node(`${headI}-${i}`, 'railway');
                                if (blockedNodes.has(point)) {
                                    flag = false;
                                }
                            }
                        }
                    }
                    if (headJ === tailJ) {
                        if ((headJ === 1 || headJ === 3) && 
                            ((headI === 5 && tailI === 6) || (tailI === 5 && headI === 6))) {
                            flag = false;
                        }
                        if (tailI > headI) {
                            for (let i = headI + 1; i < tailI; i++) {
                                let point = node(`${i}-${headJ}`, 'railway');
                                if (blockedNodes.has(point)) {
                                    flag = false;
                                }
                            }
                        } else {
                            for (let i = headI - 1; i > tailI; i--) {
                                let point = node(`${i}-${headJ}`, 'railway');
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
    
            flag = flag || this.board.areAdjacent(node(headPosition), node(tailPosition));
        }
    
        return flag;
    }

    applyAction(request) {
        function splitBySpace(inputString) {
            // 使用空格分割字符串
            return inputString.split(" ");
        }
    
        const boardState = this.jzn;
        const splitResult = splitBySpace(boardState);
        let row1 = splitResult[0];
        let row2 = splitResult[1];
        let row3 = Number(splitResult[2]);
        let row4 = Number(splitResult[3]);
    
        const headI = request.charCodeAt(0) - 97;
        const headJ = Number(request[1]) - 1;
        const tailI = request.charCodeAt(2) - 97;
        const tailJ = Number(request[3]) - 1;
    
        const targetPiece = row1[headI * 5 + headJ];
        const goalPiece = row1[tailI * 5 + tailJ];
        let moveValid = true;
    
        function updateStringAtIndex(str, index, newChar) {
            return str.slice(0, index) + newChar + str.slice(index + 1);
        }
    
        // 处理棋子 "d" 或 "D"
        if (targetPiece === "d" || targetPiece === "D") {
            if (goalPiece === "d" || goalPiece === "D") {
                row1 = updateStringAtIndex(row1, headI * 5 + headJ, "0");
                row1 = updateStringAtIndex(row1, tailI * 5 + tailJ, "0");
                moveValid = false;
            } else {
                if (goalPiece === "c" || goalPiece === "C") {
                    row1 = updateStringAtIndex(row1, headI * 5 + headJ, "0");
                    row1 = updateStringAtIndex(row1, tailI * 5 + tailJ, targetPiece);
                    moveValid = false;
                } else {
                    row1 = updateStringAtIndex(row1, headI * 5 + headJ, "0");
                    moveValid = false;
                }
            }
        }
    
        // 处理棋子 "b" 或 "B"
        if (targetPiece === "b" || targetPiece === "B") {
            row1 = updateStringAtIndex(row1, headI * 5 + headJ, "0");
            row1 = updateStringAtIndex(row1, tailI * 5 + tailJ, "0");
            moveValid = false;
        }
    
        let targetCharCode = targetPiece.charCodeAt(0);
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
    
        // 比较目标棋子的大小
        if (targetLower > goalLower) {
            row1 = updateStringAtIndex(row1, headI * 5 + headJ, "0");
            row1 = updateStringAtIndex(row1, tailI * 5 + tailJ, targetPiece);
            moveValid = false;
        } else {
            if (targetLower < goalLower) {
                row1 = updateStringAtIndex(row1, headI * 5 + headJ, "0");
                moveValid = false;
            } else {
                row1 = updateStringAtIndex(row1, headI * 5 + headJ, "0");
                row1 = updateStringAtIndex(row1, tailI * 5 + tailJ, "0");
                moveValid = false;
            }
        }
    
        // 更新 row4 和 row3
        row4 += 1;
        if (!moveValid) {
            row3 = 1;
        }
    
        // 切换当前玩家
        row2 = (row2 === "r") ? "b" : "r";
    
        const updatedState = `${row1} ${row2} ${String(row3)} ${String(row4)}`;
        this.jzn = updatedState;
    
        console.log(this.jzn);
        return updatedState;
    }

    isTerminal() {
        const red_string = getMaskedJzn("r");
        const blue_string = getMaskedJzn("b");
    
        length = this.rows * this.cols;
    
        if ((red_string[1] != "a" && red_string[3] != "a") 
            || (blue_string[56] != "A" && blue_string[58] != "A")) {
            return true;
        }
    
        let red_count = 0;
        let blue_count = 0;
    
        for (let i = 0; i < length; i++) {
            if (red_string[i] != "0" 
                && red_string[i] != "#" 
                && red_string[i] != "c"
                && i != 1 && i != 3
                && i != 56 && i != 58) {
                red_count++;
            }
            if (blue_string[i] != "0" 
                && blue_string[i] != "#" 
                && blue_string[i] != "C"
                && i != 1 && i != 3
                && i != 56 && i != 58) {
                blue_count++;
            }
        }
    
        if (red_count === 0 || blue_count === 0) { 
            return true; 
        }
    
        const red_result = splitBySpace(red_string);
        const blue_result = splitBySpace(blue_string);
    
        if (Number(red_result[2]) === 31 || Number(blue_result[2]) === 31) {
            return true;
        }
        if (this.skipped_actions["r"] < 0 || this.skipped_actions["b"] < 0) {
            return true;
        }
    }
    
    getWinner() {
        const red_string = getMaskedJzn("r");
        const blue_string = getMaskedJzn("b");
    
        length = this.rows * this.cols;
    
        if (red_string[1] != "a" && red_string[3] != "a") {
            return "b";
        }
        if (blue_string[56] != "A" && blue_string[58] != "A") {
            return "r";
        }
    
        let red_count = 0;
        let blue_count = 0;
    
        for (let i = 0; i < length; i++) {
            if (red_string[i] != "0" 
                && red_string[i] != "#" 
                && red_string[i] != "c"
                && i != 1 && i != 3
                && i != 56 && i != 58) {
                red_count++;
            }
            if (blue_string[i] != "0" 
                && blue_string[i] != "#" 
                && blue_string[i] != "C"
                && i != 1 && i != 3
                && i != 56 && i != 58) {
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
    
        const red_result = splitBySpace(red_string);
        const blue_result = splitBySpace(blue_string);
    
        if (Number(red_result[2]) === 31) {
            return "b";
        }
        if (Number(blue_result[2]) === 31) {
            return "r";
        }
    }
    
    isLegalLayout(layout) {

        function Checkout(busket) {
            const chess1 = ["l", "L", "k", "K", "a", "A"];
            const chess2 = ["j", "J", "i", "I", "h", "H", "g", "G", "b", "B"];
            const chess3 = ["f", "F", "e", "E", "d", "D", "c", "C"];
    
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
    
        let busket = new Map();
        board_number = layout.length;
        if (board_number > 30) {
            return false;
        }
    
        for (let i = 0; i < board_number; i++) {
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
        let player, strat;
        if (ascii_number < 97) {
            player = "b";
            strat = 30;
        } else {
            player = "r";
            strat = 0;
        }
    
        for (let i = strat; i < strat + 30; i++) {
            this.jzn = JunqiGame.StringChange(this.jzn, i, layout[i - strat]);
        }
        this.layout = this.layout.set(player, layout);
    }
    
    getMaskedJzn(player) {
        let ASCLL_min, ASCLL_max, commander, flag;
        if (player === "b") {
            ASCLL_min = "a".charCodeAt(0);
            ASCLL_max = "z".charCodeAt(0);
            commander = "c";
            flag = "a";
        } else {
            ASCLL_min = "A".charCodeAt(0);
            ASCLL_max = "Z".charCodeAt(0);
            commander = "C";
            flag = "A";
        }
    
        length = this.row * this.cols;
        let masked_jzn = this.jzn;
    
        for (let i = 0; i < length; i++) {
            if (masked_jzn[i] === flag) {
                const position = i;
            }
            if (masked_jzn[i].charCodeAt(0) >= ASCLL_min && masked_jzn[i].charCodeAt(0) <= ASCLL_max) {
                masked_jzn = JunqiGame.StringChange(masked_jzn, i, "#");
            }
        }
    
        let commander_state = false;
        for (let i = 0; i < length; i++) {
            if (masked_jzn[i] === commander) {
                commander_state = true;
                break;
            }
        }
    
        if (!commander_state) {
            if (player === "r") {
                masked_jzn = JunqiGame.StringChange(masked_jzn, position, "a");
            } else {
                masked_jzn = JunqiGame.StringChange(masked_jzn, position, "A");
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
}