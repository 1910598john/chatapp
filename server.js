const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



io.on('connection', (socket) => {
  socket.broadcast.emit("connected");

  socket.on('message', (msg) => {
    let data;
    if (socket.username) {
      data = {
        "message": msg,
        "name" : socket.username,
      }
    } else {
      data = {
        "message": msg,
        "name" : "User",
      }
    }
   
    socket.broadcast.emit('other', data);
  })
  
  socket.on("gameStarted", (data) => {
      socket.broadcast.emit("gameStarted", data);

  })

  socket.on("answer", (answer) => {
    let data = {
      "message" : answer,
      "name" : socket.username,
    }
    socket.emit("answered", data);
  })

  socket.on("registerName", (name) => {
    socket.username = name;
    console.log(socket.username);
    socket.broadcast.emit("broadcast", name);
  })

  socket.on("disconnect", () => {
    let name;
    if (socket.username == null) {
      name = "User";
    } else {
      name = socket.username;
    }
    socket.broadcast.emit("disconnected", name);
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});