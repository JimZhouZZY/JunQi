/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * sockets/queue.js
 *
 * This module manages the socket events related to the matchmaking queue system.
 * It allows players to join or leave specific queues, and it interacts with the
 * `queueService` to update the queue and attempt to start a match when the queue is ready.
 * The module also handles disconnections by removing players from the queue if they disconnect.
 */

const queueService = require("../services/queueService"); // Import the queueService module to manage queues
const { usernameSocketMap } = require("./variables");

module.exports = (io, socket) => {
  // Event handler for players joining a queue
  socket.on("queues-join", async (username, queuename) => {
    usernameSocketMap[username] = socket.id; // Map the username to the socket ID
    console.log(usernameSocketMap);
    console.log(`${username} joined with socket id: ${socket.id}`); // Log the join action

    // Add the player to the specific queue
    await queueService.joinSpecificQueue(username, queuename);

    // Attempt to start a match if the queue is ready
    await queueService.tryStartMatch(queuename);
  });

  // Event handler for players leaving a queue
  socket.on("queues-leave", async (username, queuename) => {
    console.log(`${username} removed from the queue`); // Log the leave action

    // Remove the player from the specific queue
    await queueService.leaveSpecificQueue(username, queuename);
  });

  // Event handler for when a player disconnects
  socket.on("disconnect", () => {
    // Find and remove the username associated with the socket ID from the usernameSocketMap
    for (const username in usernameSocketMap) {
      if (usernameSocketMap[username] === socket.id) {
        delete usernameSocketMap[username]; // Remove the user from the map
        console.log(`${username} disconnected and removed from the queue`); // Log the disconnection
        break; // Exit loop once the user is found and removed
      }
    }
  });
};
