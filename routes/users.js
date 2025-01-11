// users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authToken.js');
const { getUserByUsername, createUser } = require('../models/userModel.js');

router.post('/login-register', userController.loginOrRegister);

router.get('/protected-route', authenticateToken, userController.protectedRoute);

router.post('/get-username-by-userid', userController.getUsernameById);

router.post('/get-userid-by-username', userController.getIdByUsername);

module.exports = router;
