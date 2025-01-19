/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

let io;

// TODO: this is too ugly, refactor it!
const socketsQueue = require('../sockets/queue');
const JunqiGame = require('../src/logic/junqiLogic');

const boards = new Map;

function setIo(newIo) {
    io = newIo; // 注入 io 实例
}

async function startMatch(usernames) {
    const roomName = `gameRoom-${usernames.join('-')}`;
    console.log(`Created room ${roomName}`);
    const colors = ['r', 'b']; // Colors to assign
    // Shuffle the colors
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    // Create the map
    const usernameToColor = new Map();
    usernames.forEach((username, index) => {
      usernameToColor.set(username, colors[index]);
    });
    usernames.forEach(username => {
        const socketId = socketsQueue.usernameSocketMap[username];
        // TODO: this is too ugly, refactor it!
        io.sockets.sockets.get(socketId).join(roomName); // 加入房间
        io.to(socketId).emit('room-name', roomName);
        io.to(socketId).emit('request-layout', usernameToColor.get(username));
    });
    boards[roomName] = new JunqiGame('0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0 r 0 0');
}


module.exports = { setIo, startMatch, boards };