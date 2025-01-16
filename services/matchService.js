let io;

// TODO: this is too ugly, refactor it!
const socketsQueue = require('../sockets/queue');
const JunqiGame = require('../src/logic/junqiLogic');
const junqiGame = require('../src/logic/junqiLogic')

const boards = new Map;

function setIo(newIo) {
    io = newIo; // 注入 io 实例
}

async function startMatch(usernames) {
    const roomName = `gameRoom-${usernames.join('-')}`;
    console.log(`Created room ${roomName}`);
    usernames.forEach(username => {
        const socketId = socketsQueue.usernameSocketMap[username];
        // TODO: this is too ugly, refactor it!
        io.sockets.sockets.get(socketId).join(roomName); // 加入房间
        io.to(socketId).emit('room-name', roomName);
    });
    boards[roomName] = new JunqiGame('0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0 r 30 149');
}


module.exports = { setIo, startMatch, boards };