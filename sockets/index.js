const roomHandler = require('./room');
const moveHandler = require('./move');
const queueHandler = require('./queue');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('new connection:', socket.id);

        // Event logics
        roomHandler(io, socket);
        moveHandler(io, socket);
        queueHandler(io, socket);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};