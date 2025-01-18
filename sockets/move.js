/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const {boards} = require('../services/matchService')

// move.js
module.exports = (io, socket) => {
    socket.on('move', function (move, roomName) {
        console.log(`Move received: ${JSON.stringify(move)}`);
        console.log(roomName);
        console.log(io.sockets.adapter.rooms);
        if (boards[roomName].isLegalAction(move)){
            boards[roomName].applyAction(move);
            io.to(roomName).emit('move', move); // TODO: 服务端更严格的检查，直接传送JZN
        }
    });
};