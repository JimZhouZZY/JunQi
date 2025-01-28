/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * routes/user.js
 *
 * This file defines the routes related to user authentication and profile management.
 * It includes endpoints for user login/registration, retrieving user details by ID or username,
 * and accessing a protected route that requires a valid authentication token.
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const authenticateToken = require("../middlewares/authToken.js");

/**
 * POST /login-register
 * Handles both user login and registration depending on the provided data.
 */
router.post("/login-register", userController.loginOrRegister);

/**
 * POST /get-username-by-userid
 * Retrieves the username associated with the given user ID.
 */
router.post("/get-username-by-userid", userController.getUsernameById);

/**
 * POST /get-userid-by-username
 * Retrieves the user ID associated with the given username.
 */
router.post("/get-id-by-username", userController.getIdByUsername);

/**
 * GET /protected-route
 * A sample protected route that requires authentication.
 * Only accessible with a valid token passed in the request headers.
 */
router.get(
  "/protected-route",
  authenticateToken,
  userController.protectedRoute,
);

module.exports = router;
