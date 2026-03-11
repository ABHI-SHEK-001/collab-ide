import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});


// 🔐 Socket authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});


// 🔌 Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // join a collaboration room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    // notify others that a user joined
    socket.to(roomId).emit("userJoined", {
      userId: socket.userId
    });

    console.log(`User ${socket.userId} joined room ${roomId}`);
  });

  // code change event
  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("cursorMove", ({ roomId, position }) => {
    socket.to(roomId).emit("cursorUpdate", {
      userId: socket.userId,
      position
    });
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.userId} left room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);

    socket.broadcast.emit("userLeft", {
      userId: socket.userId
    });
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});