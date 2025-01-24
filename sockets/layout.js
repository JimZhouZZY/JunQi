/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const {boards, rooms} = require('../services/matchService')

function findRoom(id) {
    let keys = [];
    console.log(rooms);
    console.log(id);
    // Iterate over the Map
    rooms.forEach((value, key) => {
      // Check if the value is an array and contains 'Jim'
      if (Array.isArray(value) && value.includes(id)) {
        keys.push(key);
      }
    });
  
    return keys;
  }

// move.js
module.exports = (io, socket) => {
    socket.on('submit-layout', function (layout, roomname) {
        const roomName = findRoom(io.sockets.sockets.get(socket.id).id)[0];
        console.log(`[${roomName}]: Layout received: ${JSON.stringify(layout)}`);
        // TODO; increase the robustness of server on malfoarmatted socket input
        if (boards.get(roomName).isLegalLayout(layout)){
            boards.get(roomName).applyLayout(layout);
        } else {
            console.log('Error: Not a legal layout');
        }
    });
};