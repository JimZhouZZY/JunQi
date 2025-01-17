// queues.js
// Deprecated

const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

router.post('/join', queueController.joinQueue);

module.exports = router;