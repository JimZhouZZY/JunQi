// app.js
const express = require('express');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/users.js')
app.use('/users', userRoutes);

const http = require('http').Server(app);
const port = process.env.PORT || 3000;
http.listen(port, function () {
    console.log('listening on port: ' + port);
});

const socketHandler = require('./sockets');
const socketIO = require('socket.io')(http);
socketHandler(socketIO);

