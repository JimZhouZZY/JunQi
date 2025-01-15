// move.js
module.exports = (io, socket) => {
    socket.on('move', function (move, roomName) {
        console.log(`Move received: ${JSON.stringify(move)}`);
        console.log(roomName);
        console.log(io.sockets.adapter.rooms);
        io.to(roomName).emit('move', move);
    });
};