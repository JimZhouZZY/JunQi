const Node = require('./classical/node.js');

class UserNode extends Node {
    constructor(username) {
        super(username);
    }
}

module.exports = UserNode;