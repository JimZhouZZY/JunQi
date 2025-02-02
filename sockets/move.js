/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const { boards } = require("../services/matchService");
const { socketColorMap } = require("./variables");
const { emitMessage } = require('./chat')

/**
 * sockets/move.js
 *
 * This module handles the "move" event for player actions in the Web-JunQi game.
 * When a player makes a move, it verifies whether the move is legal, applies the move to the game board,
 * and broadcasts the updated game state to all players in the same room. If the game reaches a terminal state (end of game),
 * it notifies the players that the game has ended.
 */

module.exports = (io, socket) => {
  // Event handler for 'move' emitted by player
  socket.on("move", function (move, roomName) {
    console.log(`[${roomName}]: Move received: ${JSON.stringify(move)}`); // Log the received move
    const board = boards.get(roomName);

    // Handle surrender and skip actions first
    if (move === "skip") {
      if (socketColorMap[socket.id] !== board.getCurrentPlayer()) {
        return;
      }
      board.applySkip();
      io.to(roomName).emit("move", move, board.jzn);
      // Check if the game has reached a terminal state (end of game)
      if (board.is_terminal) {
        console.log(`[${roomName}]: Game is terminal`);
        // Notify all players in the room that the game has ended
        emitMessage({sender: "Server", text: "Game ended!"}, roomName)
        io.to(roomName).emit("terminal");
      }
      return;
    }
    else if (move === 'surrender') {
      board.is_terminal = true;
      // TODO: set winner
      console.log(`[${roomName}]: Game is terminal`);
      // Notify all players in the room that the game has ended
      emitMessage({sender: "Server", text: "Game ended!"}, roomName)
      io.to(roomName).emit("terminal"); 
      return;
    }
    // Check if the move is legal according to the game rules
    else if (board.isLegalAction(move)) {
      // Apply the move to the game board if it's legal
      board.applyAction(move);

      // Broadcast the move to all players in the room, including the updated game state (JZN)
      io.to(roomName).emit("move", move, board.jzn); // TODO: More strict server-side validation, directly send JZN

      // Check if the game has reached a terminal state (end of game)
      if (board.isTerminal()) {
        console.log(`[${roomName}]: Game is terminal`)
        // Notify all players in the room that the game has ended
        emitMessage({sender: "Server", text: "Game ended!"}, roomName)
        io.to(roomName).emit("terminal");
        // TODO: Implement a more efficient way to handle the end of the game (cleanup, etc.)
      }
    }
  });
};
