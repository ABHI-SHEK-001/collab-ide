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

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
  });

  // Code editing sync
  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  // Cursor sync
  socket.on("cursorMove", ({ roomId, position }) => {
    socket.to(roomId).emit("cursorUpdate", {
      userId: socket.userId,
      position
    });
  });

  // File created
  socket.on("fileCreated", ({ roomId, file }) => {
    socket.to(roomId).emit("fileCreated", file);
  });

  // File deleted
  socket.on("fileDeleted", ({ roomId, fileId }) => {
    socket.to(roomId).emit("fileDeleted", fileId);
  });

  // File renamed
  socket.on("fileRenamed", ({ roomId, file }) => {
    socket.to(roomId).emit("fileRenamed", file);
  });

  // File content updated
  socket.on("fileUpdated", ({ roomId, fileId, content }) => {
    socket.to(roomId).emit("fileUpdated", {
      fileId,
      content
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});