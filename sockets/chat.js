/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * sockets/chat.js
 * 
 * This module manages the socket events related to the in-game chat.
 * It broad cast users chat message to the entire room.
 */

let ioInstance; // Cache io instance

const emitMessage = (msg, roomName) => {
    if (!ioInstance) {
        console.error("emitMessage called before ioInstance was set!");
        return;
    }
    ioInstance.to(roomName).emit("chat-message", { sender: msg.sender, text: msg.text, comment: msg.comment ?? null});
};

module.exports = (io, socket) => {
    ioInstance = io; // 存储 io 实例
    socket.on("chat-message", async (msg, roomName) => {
        console.log(`message received ${JSON.stringify(msg)} in room ${roomName}`);
        emitMessage({sender: msg.sender, text: msg.text}, roomName);
    });
};

module.exports.emitMessage = emitMessage;