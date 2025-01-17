// queue.js
const queueService = require('../services/queueService');
const usernameSocketMap = {};

module.exports = (io, socket) => {
    socket.on('queues-join', async (username, queuename) => {
        usernameSocketMap[username] = socket.id;
        console.log(`${username} joined with socket id: ${socket.id}`);
        await queueService.joinSpecificQueue(username, queuename);
        await queueService.tryStartMatch(queuename);
    });

    socket.on('queues-leave', async (username, queuename) => {
        console.log(`${username} removed from the queue`);
        await queueService.leaveSpecificQueue(username, queuename);
    });

    socket.on('disconnect', () => {
        // 查找并删除该 socket.id 对应的用户名映射
        for (const username in usernameSocketMap) {
            if (usernameSocketMap[username] === socket.id) {
                delete usernameSocketMap[username];
                console.log(`${username} disconnected and removed from the queue`);
                break;
            }
        }
    });
};

module.exports.usernameSocketMap = usernameSocketMap;