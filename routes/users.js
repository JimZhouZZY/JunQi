/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

// users.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authToken.js");
const { getUserByUsername, createUser } = require("../models/userModel.js");

router.post("/login-register", userController.loginOrRegister);

router.get(
  "/protected-route",
  authenticateToken,
  userController.protectedRoute,
);

router.post("/get-username-by-userid", userController.getUsernameById);

router.post("/get-userid-by-username", userController.getIdByUsername);

module.exports = router;
