const { Server } = require("socket.io");

let onlineUsers = {}; // { userId: socketId }
let avatars = {};     // { userId: { x, y, color, name } }
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
    const userId = socket.handshake.query.userId;
    if (!userId) return;

    console.log("🟢 New client connected:", socket.id);
    onlineUsers[userId] = socket.id;

    // ========== 🧍 AVATAR LOGIC ==========
    if (!avatars[userId]) {
      avatars[userId] = {
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 200,
        color: "#00AEEF",
        name: `User-${userId.slice(-4)}`,
      };
    }

    io.emit("avatarsUpdate", avatars);

    socket.on("moveAvatar", ({ userId, dx, dy }) => {
      if (!avatars[userId]) return;
      avatars[userId].x += dx;
      avatars[userId].y += dy;
      io.emit("avatarsUpdate", avatars);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
      delete onlineUsers[userId];
      delete avatars[userId];
      io.emit("avatarsUpdate", avatars);
    });

    // ========== 🧩 ROOM & CHAT LOGIC ==========
    socket.on("join-room", ({ userId, room }) => {
      socket.join(room);
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

    // ========== 💬 PRIVATE MESSAGES ==========
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

    // ========== 🎪 CLUB EVENTS ==========
    socket.on("join-club-event", ({ userId, eventRoom }) => {
      socket.join(eventRoom);
      if (!activeClubEvents[eventRoom]) activeClubEvents[eventRoom] = [];
      if (!activeClubEvents[eventRoom].includes(userId))
        activeClubEvents[eventRoom].push(userId);

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
  });
}

module.exports = initSocket;
