const { Server } = require("socket.io");

let onlineUsers = {}; // { userId: socketId }
let activeClubEvents = {}; // { clubEventRoom: [userIds...] }

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

    // ========= Campus Room Logic =========
    socket.on("join-room", ({ userId, room }) => {
      socket.join(room);
      onlineUsers[userId] = socket.id;
      console.log(`👤 User ${userId} joined ${room}`);
      socket.to(room).emit("user-joined", { userId, room });
    });

    socket.on("move-avatar", ({ userId, x, y, room }) => {
      socket.to(room).emit("avatar-moved", { userId, x, y });
    });

    socket.on("send-room-message", ({ room, sender, text }) => {
      io.to(room).emit("receive-room-message", {
        sender,
        text,
        room,
        createdAt: new Date(),
      });
    });

    // ========= Private Chat Logic =========
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

    // ========= Club Event Logic =========
    socket.on("join-club-event", ({ userId, eventRoom }) => {
      socket.join(eventRoom);

      if (!activeClubEvents[eventRoom]) {
        activeClubEvents[eventRoom] = [];
      }

      if (!activeClubEvents[eventRoom].includes(userId)) {
        activeClubEvents[eventRoom].push(userId);
      }

      console.log(`🎪 User ${userId} joined club event: ${eventRoom}`);

      io.to(eventRoom).emit("club-event-joined", {
        userId,
        eventRoom,
        participants: activeClubEvents[eventRoom],
      });
    });

    socket.on("send-club-message", ({ eventRoom, sender, text }) => {
      io.to(eventRoom).emit("receive-club-message", {
        sender,
        text,
        eventRoom,
        createdAt: new Date(),
      });
    });

    socket.on("leave-club-event", ({ userId, eventRoom }) => {
      socket.leave(eventRoom);

      if (activeClubEvents[eventRoom]) {
        activeClubEvents[eventRoom] = activeClubEvents[eventRoom].filter(
          (id) => id !== userId
        );
      }

      console.log(`🚪 User ${userId} left event: ${eventRoom}`);

      io.to(eventRoom).emit("club-event-left", {
        userId,
        eventRoom,
        participants: activeClubEvents[eventRoom],
      });
    });

    // ========= Handle Disconnect =========
    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);

      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }

      for (const eventRoom in activeClubEvents) {
        activeClubEvents[eventRoom] = activeClubEvents[eventRoom].filter(
          (id) => onlineUsers[id]
        );
      }

      io.emit("user-left", { socketId: socket.id });
    });
  });
}

module.exports = initSocket;
