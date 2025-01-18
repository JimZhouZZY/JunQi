/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import JunqiGame from "./junqiLogic.mjs";

var game;

var initGame = function() {
    game = new JunqiGame();
};

window.addEventListener('load', () => {
    initGame();
    console.log("Initializing client.mjs");
    window.game_phase = "DEPLOYING";
    window.oppo_color = 'red';
    window.jzn = '##############################LKJJII0H0HGG0FFF0E0EEDDDBBCCAC'
    // window.updateBoardFromFEN(window.jzn);
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
});

// Handle move from the other side
socket.on('move', function(move) {
    console.log(`Client recieved move: ${move}`)
    window.jzn = game.applyAction(move);
    window.updateBoardFromFEN(window.jzn);
    console.log(`New JZN: ${window.jzn}`);
});
