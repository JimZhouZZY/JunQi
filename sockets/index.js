/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const roomHandler = require('./room');
const moveHandler = require('./move');
const queueHandler = require('./queue');
const layoutHandler = require('./layout');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('new connection:', socket.id);

        // Event logics
        roomHandler(io, socket);
        moveHandler(io, socket);
        queueHandler(io, socket);
        layoutHandler(io, socket);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });

        setInterval(() => {
            // io.emit('test', 'This is a broadcast message every second');
          }, 1000); // Broadcast every 1000 milliseconds (1 second)
          
    });
};