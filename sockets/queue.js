// queue.js
const usernameSocketMap = {};

module.exports.usernameSocketMap = usernameSocketMap;

module.exports = (io, socket) => {
    socket.on('join-queue', (username) => {
        usernameSocketMap[username] = socket.id;
        console.log(`${username} joined with socket id: ${socket.id}`);
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