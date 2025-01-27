/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * sockets/index.js
 * 
 * This module manages the WebSocket connections for the Web-JunQi game.
 * It listens for incoming connections from clients and sets up event handlers 
 * for different game actions such as room management, player moves, queue management, 
 * and layout requests. The `io` object from socket.io is used to facilitate real-time communication.
 * 
 * When a player connects, different event handlers are attached to the socket for specific game logic.
 */

const roomHandler = require("./room");  // Handles room-related socket events (joining, creating, etc.)
const moveHandler = require("./move");  // Handles player move-related socket events
const queueHandler = require("./queue");  // Handles queue management (joining, leaving, matchmaking)
const layoutHandler = require("./layout");  // Handles player layout-related events

/**
 * Main function that handles socket connection and event binding
 * @param {Object} io - The socket.io instance used to manage real-time communication.
 */
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("new connection:", socket.id);  // Log new connections

    // Bind event handlers to the socket for various game functionalities
    roomHandler(io, socket);  // Handle events related to room creation and joining
    moveHandler(io, socket);  // Handle events related to player moves
    queueHandler(io, socket);  // Handle events related to matchmaking and queueing
    layoutHandler(io, socket);  // Handle events related to setting player layout (color, position, etc.)

    // Handle socket disconnections
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);  // Log when a player disconnects
    });
  });
};
