var socket = io();

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

    if (move === null) {
        return 'snapback';
    } else {
        socket.emit('move', move);
    };
};

// Handle move from the other side
socket.on('move', function(msg) {
    game.move(msg);
    board.position(game.fen());
});


