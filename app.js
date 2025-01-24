/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

// app.js
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('public')); // 静态文件托管
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由配置
const userRoutes = require('./routes/users.js');
const queueRoutes = require('./routes/queues.js');
app.use('/users', userRoutes);
app.use('/queues', queueRoutes);

// 将所有未匹配的请求重定向到 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动 HTTP 服务器
const http = require('http').Server(app);
const port = process.env.PORT || 8424;
http.listen(port, function () {
    console.log('listening on port: ' + port);
});

// 配置 Socket.IO
const socketHandler = require('./sockets');
const socketIO = require('socket.io')(http);
socketHandler(socketIO);

// 延迟设置全局 io 实例
const { setIo } = require('./services/matchService');
setIo(socketIO);