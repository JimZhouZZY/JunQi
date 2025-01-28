/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * services/queueServices.js
 *
 * This module handles operations related to user queues for matchmaking.
 * It allows users to join or leave specific queues and attempts to start a match when a queue is ready.
 * The matchmaking process is locked to prevent race conditions when trying to start a match.
 */

const UserQueue = require("./types/userQueue"); // Defines a user queue structure
const matchService = require("./matchService"); // Handles the logic for starting a match

// Stores queues for different match types (e.g., "main" queue for the primary game)
const queues = {};
queues["main"] = new UserQueue(2); // Default queue with a group size of 2 (for 2-player games)

// Locks to prevent overlapping execution of matchmaking logic
const locks = {};

/**
 * tryStartMatch
 *
 * Attempts to start a match if the specified queue has enough players.
 * The match can only be started if the queue is "ready" (i.e., has the required number of players).
 * Prevents multiple attempts to start a match at the same time by using locks.
 *
 * @param {string} queuename - The name of the queue to check and attempt to start a match for.
 * @returns {boolean} - Returns true if a match is successfully started, false otherwise.
 */
exports.tryStartMatch = async function (queuename) {
  // Prevent multiple executions by locking the queue
  if (locks[queuename]) return; // Avoid overlapped execution
  locks[queuename] = true;

  try {
    // Check if the queue is ready (has enough players)
    if (queues[queuename].isReady()) {
      // Dequeue players and start the match
      usernames = await exports.dequeueSpecificQueue(queuename);

      // TODO: handle multiple match types in the future
      // Check if we have exactly two different players (to prevent self-matches)
      if (usernames[0] !== usernames[1]) {
        matchService.startMatch(usernames); // Start the match with the dequeued players
        return true;
      }
    }
  } finally {
    // Release the lock after execution
    locks[queuename] = false;
    return false;
  }
};

/**
 * joinSpecificQueue
 *
 * Adds a user to a specific queue, making them wait for a match.
 *
 * @param {string} username - The username of the player joining the queue.
 * @param {string} queuename - The name of the queue the player is joining.
 */
exports.joinSpecificQueue = async function (username, queuename) {
  queues[queuename].enqueueUser(username); // Add the user to the queue
};

/**
 * leaveSpecificQueue
 *
 * Removes a user from a specific queue, allowing them to stop waiting for a match.
 *
 * @param {string} username - The username of the player leaving the queue.
 * @param {string} queuename - The name of the queue the player is leaving.
 */
exports.leaveSpecificQueue = async function (username, queuename) {
  queues[queuename].dequeueUser(username); // Remove the user from the queue
};

/**
 * dequeueSpecificQueue
 *
 * Removes and returns a group of players from the specified queue.
 * This function is used to dequeue the required number of players to start a match.
 *
 * @param {string} queuename - The name of the queue to dequeue players from.
 * @returns {Array<string>} - An array of usernames dequeued from the queue.
 */
exports.dequeueSpecificQueue = async function (queuename) {
  let queue = queues[queuename];
  let usernames = [];
  // Dequeue the required number of players for a match (group_size)
  for (let i = 0; i < queue.group_size; i++) {
    usernames.push(queue.peek()); // Get the front player in the queue
    queue.dequeue(); // Remove the player from the queue
  }
  return usernames;
};
