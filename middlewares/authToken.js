/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of the Web-JunQi project.
 * Licensed under the terms of the GPLv3 License.
 */

/**
 * middlewares/authToken.js
 * 
 * This module contains middleware functions to authenticate user requests.
 * It includes functionality to verify JWT tokens and check user passwords.
 */

const { SECRET_KEY } = require("../configs/config.js");
const jwt = require("jsonwebtoken");

/**
 * Middleware function to authenticate JWT token.
 * 
 * This function checks the 'Authorization' header of incoming requests for a valid JWT token.
 * If the token is not provided or is invalid/expired, it responds with an error.
 * If the token is valid, it decodes the token and attaches the user information to the request object.
 * 
 * @param {Object} req - The request object containing the headers with the token.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function to call after token authentication.
 */
function authenticateToken(req, res, next) {
  // Retrieve token from 'Authorization' header
  const token = req.headers["authorization"];

  if (!token) {
    // Respond with 401 if no token is provided
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify token using the SECRET_KEY
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      // Respond with 403 if token is invalid or expired
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    // Attach decoded user information to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
}

/**
 * Middleware function to authenticate the user's password (not yet implemented).
 * 
 * This function is intended to compare a password with the stored hashed password.
 * It should be called to verify user credentials during login or password-related operations.
 * 
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function to call after password verification.
 */
async function authenticatePassword(req, res, next) {
  await bcrypt.compare(password, user.password_hash);
}

module.exports = authenticateToken; // Export the authenticateToken middleware for use in other parts of the app
