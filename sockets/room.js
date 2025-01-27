/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * sockets/room.js
 * 
 * This module handles the socket events related to room management in the Web-JunQi game.
 * It allows players to join or leave rooms, send messages within rooms, and broadcasts notifications to 
 * other players in the room when these actions occur.
 * 
 * The room system enables players to interact with each other in the same virtual space, allowing 
 * real-time communication and gameplay interactions.
 */

module.exports = (io, socket) => {
  // Event handler for players joining a room
  socket.on("joinRoom", (roomName) => {
    // The player joins the specified room
    socket.join(roomName);  // Add the socket to the specified room
    console.log(`${socket.id} joined room: ${roomName}`);  // Log the action

    // Notify other players in the room that a new player has joined
    socket.to(roomName).emit("playerJoined", `${socket.id} joined the room.`);
  });

  // Event handler for players leaving a room
  socket.on("leaveRoom", (roomName) => {
    // The player leaves the specified room
    socket.leave(roomName);  // Remove the socket from the room
    console.log(`${socket.id} left room: ${roomName}`);  // Log the action

    // Notify other players in the room that a player has left
    socket.to(roomName).emit("playerLeft", `${socket.id} left the room.`);
  });

  // Event handler for broadcasting messages to all players in a room
  socket.on("messageToRoom", ({ roomName, message }) => {
    // Log the message being sent
    console.log(`Message to room ${roomName}: ${message}`);

    // Broadcast the message to all players in the room
    io.to(roomName).emit("roomMessage", {
      sender: socket.id,  // Sender’s socket ID
      message,  // The message sent to the room
    });
  });

  // Event handler for when a player disconnects
  socket.on("disconnect", () => {
    // TODO: Emit a message to other players indicating the user has disconnected
    // A placeholder for handling player disconnection
    // console.log(`User disconnected: ${socket.id}`);  // Log the disconnection
  });
};
