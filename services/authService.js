const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/constants');
const userModel = require('../models/userModel');

// 验证密码
async function verifyPassword(inputPassword, storedPasswordHash) {
    return bcrypt.compare(inputPassword, storedPasswordHash);
}

// 加密密码
async function hashPassword(password) {
    return bcrypt.hash(password, 10); // 10 是 salt rounds
}

// 生成 JWT
function generateToken(userId) {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = { verifyPassword, hashPassword, generateToken };