/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * services/authServices.js
 * 
 * This module provides functions related to user authentication and security.
 * It includes utilities for password hashing, password verification, and JWT token generation.
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../configs/config");

/**
 * verifyPassword
 * 
 * Compares the input password with the stored hashed password to verify if they match.
 * @param {string} inputPassword - The password provided by the user during login.
 * @param {string} storedPasswordHash - The hashed password stored in the database.
 * @returns {Promise<boolean>} - Resolves to true if the passwords match, false otherwise.
 */
async function verifyPassword(inputPassword, storedPasswordHash) {
  return bcrypt.compare(inputPassword, storedPasswordHash);
}

/**
 * hashPassword
 * 
 * Hashes the given password using bcrypt with a salt rounds of 10.
 * This function is typically used during user registration to securely store passwords.
 * @param {string} password - The plain-text password to be hashed.
 * @returns {Promise<string>} - Resolves to the hashed password.
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 10); // 10 is salt rounds
}

/**
 * generateToken
 * 
 * Generates a JSON Web Token (JWT) for the user, using the user's ID and a secret key.
 * The token expires in 1 hour.
 * @param {string} userId - The unique identifier of the user.
 * @returns {string} - The generated JWT.
 */
function generateToken(userId) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
}

module.exports = { verifyPassword, hashPassword, generateToken };
