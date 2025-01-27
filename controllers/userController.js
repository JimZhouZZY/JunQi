/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const userModel = require("../models/userModel");
const authService = require("../services/authService");

exports.loginOrRegister = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // If the username is taken, try to login
    const user = await userModel.selectUserByName(username);

    if (user) {
      // Verify password
      const isPasswordValid = await authService.verifyPassword(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password." });
      }
      // Generate JWT token
      const token = authService.generateToken(user.id);
      return res.status(200).json({ message: "Login successful!", token });
    }
    // If the username is not taken, create a new user with that password
    const hashedPassword = await authService.hashPassword(password);
    const userId = await userModel.insertUser(username, hashedPassword);

    res.status(201).json({ message: "User registered successfully!", userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.protectedRoute = (req, res) => {
  res.status(200).json({
    message: "Valid token",
    user: req.user, // Return user info from the token
  });
};

exports.getUsernameById = async (req, res) => {
  const { userid } = req.body;
  user = await userModel.selectUserById(userid);
  if (user != null) {
    res.json({ username: user.username });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
};

exports.getIdByUsername = async (req, res) => {
  const { username } = req.body;
  user = await userModel.selectUserByName(username);
  if (user != null) {
    res.json({ userid: user.id });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
};
