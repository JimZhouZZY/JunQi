/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of the Web-JunQi project.
 * Licensed under the terms of the GPLv3 License.
 */

/**
 * controllers/userController.js
 * 
 * This module handles user authentication and user-related operations.
 * It provides endpoints for login, registration, and protected routes,
 * as well as functionality to retrieve a user's information by either 
 * username or user ID.
 */

const userModel = require("../models/userModel");
const authService = require("../services/authService");

/**
 * Handles both user login and registration.
 * 
 * If the user exists, it attempts to log the user in by verifying 
 * the password and generating a JWT token.
 * If the user does not exist, it creates a new user with the provided 
 * username and password, and then returns the user ID.
 * 
 * @param {Object} req - The request object containing the user credentials.
 * @param {Object} res - The response object to send the result.
 */
exports.loginOrRegister = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // Attempt to find the user by username
    const user = await userModel.selectUserByName(username);

    if (user) {
      // If user exists, validate the password
      const isPasswordValid = await authService.verifyPassword(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password." });
      }
      // Generate a JWT token upon successful login
      const token = authService.generateToken(user.id);
      return res.status(200).json({ message: "Login successful!", token });
    }
    // If user does not exist, register a new user
    const hashedPassword = await authService.hashPassword(password);
    const userId = await userModel.insertUser(username, hashedPassword);

    res.status(201).json({ message: "User registered successfully!", userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * A protected route that returns a message along with the user information
 * extracted from the valid JWT token.
 * 
 * @param {Object} req - The request object containing the authenticated user.
 * @param {Object} res - The response object to send the result.
 */
exports.protectedRoute = (req, res) => {
  res.status(200).json({
    message: "Valid token",
    user: req.user, // Return user info extracted from the token
  });
};

/**
 * Retrieves the username associated with a given user ID.
 * 
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object to send the result.
 */
exports.getUsernameById = async (req, res) => {
  const { userid } = req.body;
  const user = await userModel.selectUserById(userid);
  if (user != null) {
    res.json({ username: user.username });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
};

/**
 * Retrieves the user ID associated with a given username.
 * 
 * @param {Object} req - The request object containing the username.
 * @param {Object} res - The response object to send the result.
 */
exports.getIdByUsername = async (req, res) => {
  const { username } = req.body;
  const user = await userModel.selectUserByName(username);
  if (user != null) {
    res.json({ userid: user.id });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
};
