const db = require('../config/database');

exports.selectUserById = async (userId) => {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    return user[0][0]
};

exports.selectUserByName = async (username) => {
    const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return user[0][0]
};

exports.insertUser = async (username, password_hash) => {
    await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, password_hash]);
};