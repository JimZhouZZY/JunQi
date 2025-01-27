/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const { boards } = require("../services/matchService");

// move.js
module.exports = (io, socket) => {
  socket.on("move", function (move, roomName) {
    console.log(`[${roomName}]: Move received: ${JSON.stringify(move)}`);
    if (boards.get(roomName).isLegalAction(move)) {
      boards.get(roomName).applyAction(move);
      io.to(roomName).emit("move", move, boards.get(roomName).jzn); // TODO: 服务端更严格的检查，直接传送JZN
      if (boards.get(roomName).isTerminal()) {
        io.to(roomName).emit("terminal");
        // TODO: a more effective way
      }
    }
  });
};
