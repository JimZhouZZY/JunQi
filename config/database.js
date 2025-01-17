// database.js

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'junqi_user',
    password: 'user_password',
    database: 'junqi_server',
});

module.exports = pool;
