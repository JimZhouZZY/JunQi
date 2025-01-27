/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const JunqiGame = require("../logic/junqiLogic.js");

const args = process.argv.slice(2);
const state = args[0];
const move = args[1];

junqi_game = new JunqiGame(state);

console.log(junqi_game.isLegalAction(move));
