const { Server } = require("socket.io");

let onlineUsers = {}; // { userId: socketId }

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // Join room (e.g. library, canteen, etc.)
    socket.on("join-room", ({ userId, room }) => {
      socket.join(room);
      onlineUsers[userId] = socket.id;
      console.log(`👤 User ${userId} joined room ${room}`);
      socket.to(room).emit("user-joined", { userId, room });
    });

    // Move avatar (position update)
    socket.on("move-avatar", ({ userId, x, y, room }) => {
      socket.to(room).emit("avatar-moved", { userId, x, y });
    });

    // Room message
    socket.on("send-room-message", ({ room, sender, text }) => {
      io.to(room).emit("receive-room-message", {
        sender,
        text,
        room,
        createdAt: new Date(),
      });
    });

    // Private message
    socket.on("send-private-message", ({ senderId, receiverId, text }) => {
      const receiverSocket = onlineUsers[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-private-message", {
          senderId,
          text,
          createdAt: new Date(),
        });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);

      // Remove from online users
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          io.emit("user-left", { userId });
          break;
        }
      }
    });
  });
}

module.exports = initSocket;
