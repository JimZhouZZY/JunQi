/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

/**
 * app.js
 *
 * Server-side node app for Web-JunQi.
 */

const express = require("express");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure routers
const userRoutes = require("./routes/user.js");
app.use("/users", userRoutes);

// Reindex undefined routes to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start http server
const http = require("http").Server(app);
const port = process.env.PORT || 8424;
http.listen(port, function () {
  console.log("listening on port: " + port);
});

// Configure Socket.IO
const socketHandler = require("./sockets");
const socketIO = require("socket.io")(http);
socketHandler(socketIO);
const { setIo } = require("./services/matchService");
setIo(socketIO);
