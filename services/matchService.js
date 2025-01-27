/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * services/mathService.js
 * 
 * This module handles the logic for starting a match.
 * It creates rooms for matches, assigns players to specific colors, 
 * and manages the game board. It also sets up communication between players 
 * using socket.io for real-time updates during the game.
 */

let io;

// TODO: this is too ugly, refactor it!
const socketsQueue = require("../sockets/queue");  // Handles socket connections
const JunqiGame = require("../src/logic/junqiLogic");  // Game logic and board setup

// Maps for storing game boards and room data
const boards = new Map();
const rooms = new Map();

/**
 * setIo
 * 
 * Initializes the socket.io instance used for communication between server and clients.
 * This is necessary to emit events to specific clients (players) during the game.
 * @param {Object} newIo - The socket.io instance to be set.
 */
function setIo(newIo) {
  io = newIo;
}

/**
 * startMatch
 * 
 * Starts a new match between two or more players. It sets up a new game room, 
 * assigns players to the room, shuffles and assigns colors to players, and 
 * initializes the game board. The players are then notified and connected 
 * to the room through socket.io.
 * 
 * @param {Array<string>} usernames - The usernames of the players who are joining the game.
 */
function startMatch(usernames) {
  // Creates a unique room name using the usernames of the players
  const roomName = `gameRoom-${usernames.join("-")}`;
  console.log(`Created room ${roomName}`);
  
  // Initialize the game board for this room
  boards.set(
    roomName,
    new JunqiGame(
      "0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0 r 0 0",
    ),
  );
  
  const colors = ["r", "b"];  // Color options for players
  
  // Shuffle the colors for random assignment to players
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }
  
  // Map usernames to their respective colors
  const usernameToColor = new Map();
  usernames.forEach((username, index) => {
    usernameToColor.set(username, colors[index]);
  });
  
  const playerSocketIds = [];
  rooms.set(roomName, playerSocketIds);
  
  // Add players to the room and send initial game data
  usernames.forEach((username) => {
    const socketId = socketsQueue.usernameSocketMap[username];  // Get socket ID from username
    rooms.get(roomName).push(socketId);
    
    // TODO: this is too ugly, refactor it!
    io.sockets.sockets.get(socketId).join(roomName);  // Add player to the room
    io.to(socketId).emit("room-name", roomName);  // Send room name to player
    io.to(socketId).emit("request-layout", usernameToColor.get(username));  // Send assigned color
  });
}

module.exports = { setIo, startMatch, boards, rooms };
