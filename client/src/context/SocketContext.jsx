// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [privateMessages, setPrivateMessages] = useState([]);
  const [roomMessages, setRoomMessages] = useState([]);
  const [clubMessages, setClubMessages] = useState([]);

  useEffect(() => {
    if (!token || !user?._id) return;

    const backendURL =
      import.meta.env.VITE_BACKEND_URL?.replace("/api/nex", "") ||
      "http://localhost:8000";

    const newSocket = io(backendURL, {
      query: { userId: user._id },
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => console.log("🟢 Connected:", newSocket.id));
    newSocket.on("disconnect", () => console.log("🔴 Socket disconnected"));

    // Online users + avatars
    newSocket.on("onlineUsersUpdate", (users) => setOnlineUsers(users));
    newSocket.on("avatarsUpdate", (data) => setAvatars(data));

    // Private messages
    newSocket.on("receivePrivateMessage", (msg) => {
      setPrivateMessages((prev) => [...prev, msg]);
    });

    // Room chat
    newSocket.on("receiveRoomMessage", (msg) => {
      setRoomMessages((prev) => [...prev, msg]);
    });

    // Club events
    newSocket.on("receiveClubMessage", (msg) => {
      setClubMessages((prev) => [...prev, msg]);
    });

    newSocket.on("clubEventUpdate", ({ eventRoom, participants }) => {
      console.log(`🎪 Event ${eventRoom} now has`, participants.length, "participants");
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [token, user?._id]);

  // === Socket helper methods ===

  const sendPrivateMessage = (receiverId, text) =>
    socket?.emit("sendPrivateMessage", { receiverId, text });

  const joinArea = (areaId) => socket?.emit("joinArea", areaId);

  const leaveArea = (areaId) => socket?.emit("leaveArea", areaId);

  const moveAvatar = (x, y) => socket?.emit("moveAvatar", { x, y });

  const joinRoom = (room) => socket?.emit("joinRoom", room);

  const sendRoomMessage = (room, text) =>
    socket?.emit("sendRoomMessage", { room, text });

  const joinClubEvent = (eventRoom) =>
    socket?.emit("joinClubEvent", { eventRoom });

  const leaveClubEvent = (eventRoom) =>
    socket?.emit("leaveClubEvent", { eventRoom });

  const sendClubMessage = (eventRoom, text) =>
    socket?.emit("sendClubMessage", { eventRoom, text });

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        avatars,
        privateMessages,
        roomMessages,
        clubMessages,
        sendPrivateMessage,
        joinArea,
        leaveArea,
        moveAvatar,
        joinRoom,
        sendRoomMessage,
        joinClubEvent,
        leaveClubEvent,
        sendClubMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
