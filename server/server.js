const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const io = new Server({
  cors: true,
});
const app = express();

app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log(`User with email: ${emailId} joined room: ${roomId}`);
    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", {
      emailId,
    });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
  });
});

app.listen(8000, () => console.log("Server is running at PORT: 8000"));

io.listen(8001);
