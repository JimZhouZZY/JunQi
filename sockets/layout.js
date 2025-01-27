/* 
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * sockets/layout.js
 * 
 * This module handles the socket events related to the layout of the game.
 * It listens for a "submit-layout" event, which is triggered when a player submits their game layout.
 * The layout data is then validated and applied to the game board if it's valid.
 * 
 * The layout refers to the arrangement of pieces or positions in the game, and this module ensures
 * that the layout is legal according to the game's rules before applying it.
 * 
 * The module interacts with the `matchService` to find the correct game room and board.
 */

const { boards, rooms } = require("../services/matchService");  // Import the game boards and rooms from matchService

/**
 * findRoom
 * 
 * Finds the room name that the player is currently in, based on their socket ID.
 * The function iterates over the `rooms` map to find which room contains the player’s socket ID.
 * 
 * @param {string} id - The socket ID of the player.
 * @returns {Array<string>} - An array of room names the player is currently in.
 */
function findRoom(id) {
  let keys = [];
  console.log(rooms);  // Logs the rooms map
  console.log(id);  // Logs the player’s socket ID

  // Iterate over the rooms map to find the room associated with the given socket ID
  rooms.forEach((value, key) => {
    if (Array.isArray(value) && value.includes(id)) {
      keys.push(key);  // Add the room name to the result array
    }
  });

  return keys;
}

// Event listener for the "submit-layout" event
module.exports = (io, socket) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  socket.on("submit-layout", function (layout, roomname) {
    // Find the room name based on the player's socket ID
    const roomName = findRoom(io.sockets.sockets.get(socket.id).id)[0];
    console.log(`[${roomName}]: Layout received: ${JSON.stringify(layout)}`);

    // TODO: Improve error handling for malformed socket input
    // Validate the layout using the isLegalLayout method
    if (boards.get(roomName).isLegalLayout(layout)) {
      // Apply the layout to the board if it's legal
      boards.get(roomName).applyLayout(layout);
    } else {
      // If the layout is not legal, log an error message
      console.log("Error: Not a legal layout");
    }
  });
};
