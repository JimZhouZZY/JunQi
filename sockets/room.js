module.exports = (io, socket) => {
    // 玩家加入房间
    socket.on('joinRoom', (roomName) => {
        socket.join(roomName); // 加入房间
        console.log(`${socket.id} joined room: ${roomName}`);

        // 通知房间内其他玩家
        socket.to(roomName).emit('playerJoined', `${socket.id} joined the room.`);
    });

    // 玩家离开房间
    socket.on('leaveRoom', (roomName) => {
        socket.leave(roomName); // 离开房间
        console.log(`${socket.id} left room: ${roomName}`);

        // 通知房间内其他玩家
        socket.to(roomName).emit('playerLeft', `${socket.id} left the room.`);
    });

    // 房间内广播消息
    socket.on('messageToRoom', ({ roomName, message }) => {
        console.log(`Message to room ${roomName}: ${message}`);
        io.to(roomName).emit('roomMessage', {
            sender: socket.id,
            message,
        });
    });

    // 监听断开连接
    socket.on('disconnect', () => {
        // TODO: emit msg to other users
        // console.log(`User disconnected: ${socket.id}`);
    });
};