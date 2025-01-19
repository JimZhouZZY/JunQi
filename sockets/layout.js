/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const {boards} = require('../services/matchService')

// move.js
module.exports = (io, socket) => {
    socket.on('submit-layout', function (layout, roomName) {
        console.log(`[${roomName}]: Layout received: ${JSON.stringify(layout)}`);
        if (boards[roomName].isLegalLayout(layout)){
            boards[roomName].applyLayout(layout);
        } else {
            console.log('Error: Not a legal layout')
        }
    });
};