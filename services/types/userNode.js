/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const Node = require('./classical/node.js');

class UserNode extends Node {
    constructor(username) {
        super(username);
    }
}

module.exports = UserNode;