/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

//import socket from './socket.js';

var board;
var game;

var initGame = function() {
    var cfg = {
        draggable: true,
        position: 'start',
        onDrop: handleMove,
    };
    board = new ChessBoard('gameBoard', cfg);
    game = new Chess();
};

window.onload = function() {
    initGame();
};

// Handle move of player's own side
var handleMove = function(source, target) {
    var move = game.move({from: source, to: target});
    // TODO: 服务端也需要判断
    if (move === null) {
        return 'snapback';
    } else {
        socket.emit('move', move, ROOM_NAME);
    };
};

// Handle move from the other side
socket.on('move', function(moveData) {
    game.move(moveData);
    board.position(game.fen());
});


