/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

// queueController.js
// Deprecated
const queueService = require("../services/queueService");

exports.joinQueue = async (req, res) => {
  const { username, queuename } = req.body;
  await queueService.joinSpecificQueue(username, queuename);
  // TODO: error code
  return res
    .status(200)
    .json({ message: `Succefully joine queue **${queuename}**` });
};
