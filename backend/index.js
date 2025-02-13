const fs = require("fs");
const https = require("https");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("offer", ({ offer, room }) => {
    socket.to(room).emit("offer", { offer });
  });

  socket.on("answer", ({ answer, room }) => {
    socket.to(room).emit("answer", { answer });
  });

  socket.on("candidate", ({ candidate, room }) => {
    socket.to(room).emit("candidate", { candidate });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, "0.0.0.0", () => {
  console.log("Secure WebRTC server running on https://172.31.7.161:5000/");
});
