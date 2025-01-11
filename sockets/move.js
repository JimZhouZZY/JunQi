// move.js
module.exports = (io, socket) => {
    socket.on('move', function (moveData, roomName) {
        console.log(`Move received: ${JSON.stringify(moveData)}`);
        socket.to(roomName).emit('move', moveData);
    });
};