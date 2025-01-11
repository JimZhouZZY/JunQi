let io;
// TODO: this is too ugly, refactor it!
const socketsQueue = require('../sockets/queue');

module.exports = {
    setIo(newIo) {
        io = newIo; // 注入 io 实例
    },
    async startMatch(usernames) {
        const roomName = `gameRoom-${usernames.join('-')}`;
        usernames.forEach(username => {
            const socketId = socketsQueue.usernameSocketMap[username]; 
            io.to(socketId).emit('joinRoom', roomName);
        });
    },
};