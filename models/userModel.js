/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of the Web-JunQi project.
 * Licensed under the terms of the GPLv3 License.
 */

/**
 * models/userModel.js
 * 
 * This module provides functions to interact with the 'users' table in the database.
 * It contains methods to select a user by ID or username, and to insert a new user into the database.
 */

const db = require("../configs/database");

/**
 * Retrieves a user from the database by their unique ID.
 * 
 * This function executes a SQL query to select the user whose ID matches the given userId.
 * It returns the user object if found, or null if no user with the given ID exists.
 * 
 * @param {number} userId - The unique identifier of the user to retrieve.
 * @returns {Object|null} The user object or null if no user is found.
 */
exports.selectUserById = async (userId) => {
  // Execute the SQL query to select a user by ID
  const user = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  return user[0][0]; // Return the first result from the query (the user data)
};

/**
 * Retrieves a user from the database by their username.
 * 
 * This function executes a SQL query to select the user whose username matches the given username.
 * It returns the user object if found, or null if no user with the given username exists.
 * 
 * @param {string} username - The username of the user to retrieve.
 * @returns {Object|null} The user object or null if no user is found.
 */
exports.selectUserByName = async (username) => {
  // Execute the SQL query to select a user by username
  const user = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  return user[0][0]; // Return the first result from the query (the user data)
};

/**
 * Inserts a new user into the database with the specified username and hashed password.
 * 
 * This function executes an SQL query to insert a new user into the 'users' table. It takes
 * the username and password hash as parameters and stores them in the database.
 * 
 * @param {string} username - The username of the new user.
 * @param {string} password_hash - The hashed password of the new user.
 * @returns {Promise} Resolves when the user is successfully inserted into the database.
 */
exports.insertUser = async (username, password_hash) => {
  // Execute the SQL query to insert a new user
  await db.query("INSERT INTO users (username, password_hash) VALUES (?, ?)", [
    username,
    password_hash,
  ]);
};
