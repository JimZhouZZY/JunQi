/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of the Web-JunQi project.
 * Licensed under the terms of the GPLv3 License.
 */

/**  
 * configs/database.js
 *
 * This module defines the database connection configuration.
 * Ensure that the keys are replaced with the actual values specific to your server environment.
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'junqi_user',
    password: 'user_password',
    database: 'junqi_server',
});

module.exports = pool;
