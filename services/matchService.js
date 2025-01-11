let io;
const { compareSync } = require('bcrypt');

// TODO: this is too ugly, refactor it!
const socketsQueue = require('../sockets/queue');

module.exports = {
    setIo(newIo) {
        io = newIo; // 注入 io 实例
    },
    async startMatch(usernames) {
        const roomName = `gameRoom-${usernames.join('-')}`;
        console.log(`Created room ${roomName}`);
        usernames.forEach(username => {
            const socketId = socketsQueue.usernameSocketMap[username]; 
            // TODO: this is too ugly, refactor it!
            io.sockets.sockets.get(socketId).join(roomName); // 加入房间
            io.to(socketId).emit('room-name', roomName); 
        });
    },
};