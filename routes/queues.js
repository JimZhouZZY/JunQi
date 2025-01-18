/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

// queues.js
// Deprecated

const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

router.post('/join', queueController.joinQueue);

module.exports = router;