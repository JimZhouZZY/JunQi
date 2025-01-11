// move.js
module.exports = (io, socket) => {
    socket.on('move', function (msg) {
        // console.log(`Move received: ${JSON.stringify(msg)}`);
        socket.broadcast.emit('move', msg);
    });
};