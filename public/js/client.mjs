/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import JunqiGame from "./junqiLogic.mjs";

var game;
const init_unknown_layout = "###########0#0###0###0#0######" // for red

function reverseString(str) {
    return str.split('').reverse().join('');
}

const initGame = function () {
    game = new JunqiGame();
    game.applyLayout('LKJJII0H0HGG0FFF0E0EEDDDBBCCAC');
    game.applyLayout('caccbbdddee0e0fff0ggh0h0iijjkl');
    console.log(game);
};

window.addEventListener('load', () => {
    initGame();
    console.log("Initializing client.mjs");
    window.game_phase = "DEPLOYING";
    window.oppo_color = 'red';
    window.jzn = '###########0#0###0###0#0######LKJJII0H0HGG0FFF0E0EEDDDBBCCAC'

    window.moveHandler = (move) => {
        const canMove = game.isLegalAction(move);
        console.log(`Move ${move} - ${canMove}`);
        // TODO: 服务端也需要判断
        if (!canMove) {
            // return 'snapback';
        } else {
            socket.emit('move', move, ROOM_NAME);
        };
    }

    window.swapHandler = (swap) => {
        // TODO: Condition!
        const canMove = true;
        // TODO: 服务端也需要判断
        if (!canMove) {
            // return 'snapback';
        } else {
            // 验证输入格式是否正确，例如 "a1b3"
            if (!/^([a-e][1-5]){2}$/.test(swap)) {
                throw new Error("Input must be in the format 'a1b3'.");
            }
            // 定义一个辅助函数，将行列转换为索引
            function getIndex(position) {
                const row = position[0].charCodeAt(0) - 'a'.charCodeAt(0); // 行从 'a' 开始
                const col = parseInt(position[1], 10) - 1; // 列从 1 开始
                return row * 5 + col; // 计算索引
            }

            // 提取位置
            const pos1 = swap.slice(0, 2); 
            const pos2 = swap.slice(2);

            // 获取索引
            const index1 = getIndex(pos1);
            const index2 = getIndex(pos2);

            // 检查索引是否在范围内
            if (index1 >= game.jzn.length || index2 >= game.jzn.length) {
                throw new Error("Index out of range for window.jzn.");
            }

            // 交换字符
            const jznArray = game.jzn.split(""); // 转换为数组以便修改
            [jznArray[index1], jznArray[index2]] = [jznArray[index2], jznArray[index1]]; // 交换

            game.jzn = jznArray.join("");
        };
    }
});

// Handle move from the other side
socket.on('move', function (move, new_jzn) {
    console.log(`Client recieved move: ${move}`)
    game.applyAction(move);
    // TODO: encrypt local jzn
    game.jzn = new_jzn;
    window.jzn = game.getMaskedJzn(game.color);
    window.updateBoardFromFEN(window.jzn);
    console.log(`New JZN: ${window.jzn}`);
});

socket.on('request-layout', function (color) {
    console.log(`Recieved color: ${color}`);
    socket.emit('submit-layout', game.layout.get(color), ROOM_NAME);
    window.oppo_color = color === 'b' ? 'red' : 'blue';
    newGame(game.layout.get(color), color);
});

function newGame(layout, color) {
    var new_jzn;
    if (color === 'r') {
        new_jzn = layout + reverseString(init_unknown_layout) + " r 0 0";
    }
    else {
        new_jzn = init_unknown_layout + layout  + " r 0 0";
    }
    game = new JunqiGame(new_jzn, color);
    game.applyLayout(layout);
    console.log(`Updating board with new JZN: ${new_jzn}`)
    window.updateBoardFromFEN(new_jzn);
    window.game_phase = 'MOVING';
}