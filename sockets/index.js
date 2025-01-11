const moveHandler = require('./move'); // 引入移动相关逻辑

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('new connection:', socket.id);

        // 绑定事件逻辑
        moveHandler(io, socket); // 处理 move 事件

        // 其他事件逻辑可以在这里添加
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};