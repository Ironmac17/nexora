// server/socket.js
const { Server } = require("socket.io");
const Area = require("./models/Area");
const User = require("./models/User");

let onlineUsers = {}; // { userId: socketId }
let avatars = {};     // { userId: { x, y, color, name, areaSlug } }
let activeClubEvents = {}; // { clubEventRoom: [userIds...] }

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) {
      socket.disconnect();
      return;
    }
    onlineUsers[userId] = socket.id;

    // ========== 🧍 Load Avatar & Position ==========
    let userDoc = await User.findById(userId).lean();
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

    if (!avatars[userId]) {
      avatars[userId] = {
        x: userDoc?.position?.x || 200 + Math.random() * 100,
        y: userDoc?.position?.y || 200 + Math.random() * 100,
        color,
        name: userDoc?.fullName || `User-${userId.slice(-4)}`,
        areaSlug: userDoc?.position?.areaSlug || "main-entrance",
      };
    }

    io.emit("avatarsUpdate", avatars);
    io.emit("onlineUsersUpdate", Object.keys(onlineUsers));

    // ========== 🏫 AREA LOGIC ==========
    socket.on("joinArea", async (areaSlug) => {
      try {
        socket.join(areaSlug);
        const area = await Area.findOneAndUpdate(
          { slug: areaSlug },
          { $inc: { usersOnline: 1 } }
        );
        if (area) io.to(areaSlug).emit("areaStatusUpdate", { areaId: areaSlug });

        // update user area in DB
        await User.findByIdAndUpdate(userId, {
          "position.areaSlug": areaSlug,
          "position.lastUpdated": new Date(),
        });
        if (avatars[userId]) avatars[userId].areaSlug = areaSlug;
      } catch (err) {
        console.error("joinArea error:", err.message);
      }
    });

    socket.on("leaveArea", async (areaSlug) => {
      try {
        socket.leave(areaSlug);
        const area = await Area.findOneAndUpdate(
          { slug: areaSlug },
          { $inc: { usersOnline: -1 } }
        );
        if (area) io.to(areaSlug).emit("areaStatusUpdate", { areaId: areaSlug });
      } catch (err) {
        console.error("leaveArea error:", err.message);
      }
    });

    // ========== 🎮 AVATAR MOVEMENT ==========
    socket.on("moveAvatar", async ({ x, y, area }) => {
      if (!avatars[userId]) return;
      avatars[userId].x = x;
      avatars[userId].y = y;
      avatars[userId].areaSlug = area;
      io.emit("avatarsUpdate", avatars);

      // update position in DB (non-blocking)
      User.findByIdAndUpdate(userId, {
        position: {
          areaSlug: area,
          x,
          y,
          lastUpdated: new Date(),
        },
      }).catch(() => {});
    });

    // ========== 💬 PRIVATE MESSAGING ==========
    socket.on("sendPrivateMessage", ({ receiverId, text }) => {
      const receiverSocket = onlineUsers[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receivePrivateMessage", {
          senderId: userId,
          text,
          createdAt: new Date(),
        });
      }
    });

    // ========== 🧩 ROOM CHAT ==========
    socket.on("joinRoom", (room) => {
      socket.join(room);
    });

    socket.on("sendRoomMessage", ({ room, text }) => {
      io.to(room).emit("receiveRoomMessage", {
        sender: userId,
        text,
        room,
        createdAt: new Date(),
      });
    });

    // ========== 🎪 CLUB EVENTS ==========
    socket.on("joinClubEvent", ({ eventRoom }) => {
      socket.join(eventRoom);
      if (!activeClubEvents[eventRoom]) activeClubEvents[eventRoom] = [];
      if (!activeClubEvents[eventRoom].includes(userId))
        activeClubEvents[eventRoom].push(userId);
      io.to(eventRoom).emit("clubEventUpdate", {
        eventRoom,
        participants: activeClubEvents[eventRoom],
      });
    });

    socket.on("leaveClubEvent", ({ eventRoom }) => {
      socket.leave(eventRoom);
      if (activeClubEvents[eventRoom]) {
        activeClubEvents[eventRoom] = activeClubEvents[eventRoom].filter(
          (id) => id !== userId
        );
      }
      io.to(eventRoom).emit("clubEventUpdate", {
        eventRoom,
        participants: activeClubEvents[eventRoom],
      });
    });

    socket.on("sendClubMessage", ({ eventRoom, text }) => {
      io.to(eventRoom).emit("receiveClubMessage", {
        sender: userId,
        text,
        eventRoom,
        createdAt: new Date(),
      });
    });

    // ========== 🔴 DISCONNECT ==========
    socket.on("disconnect", async () => {
      // Save last known position in DB
      const av = avatars[userId];
      if (av) {
        await User.findByIdAndUpdate(userId, {
          position: {
            areaSlug: av.areaSlug,
            x: av.x,
            y: av.y,
            lastUpdated: new Date(),
          },
        }).catch(() => {});
      }

      // Remove user from memory
      delete onlineUsers[userId];
      delete avatars[userId];

      io.emit("avatarsUpdate", avatars);
      io.emit("onlineUsersUpdate", Object.keys(onlineUsers));

      // Clean up club event rooms
      for (const [room, members] of Object.entries(activeClubEvents)) {
        activeClubEvents[room] = members.filter((id) => id !== userId);
        io.to(room).emit("clubEventUpdate", {
          eventRoom: room,
          participants: activeClubEvents[room],
        });
      }
    });
  });

  return io;
}

module.exports = initSocket;
