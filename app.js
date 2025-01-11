// app.js
const express = require('express');
const userRoutes = require('./routes/users.js')

var app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

var http = require('http').Server(app);
var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('listening on port: ' + port);
});

var io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log('new connection');

    // Handle the move event
    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
    });
});
