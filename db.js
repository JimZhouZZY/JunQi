// db.js

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Zzycsd_189@163.com',
    database: 'junqi_server',
});

module.exports = pool;
