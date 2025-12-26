// src/context/SocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
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
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    // Only create socket once
    if (!socketRef.current) {
      const backendURL =
        import.meta.env.VITE_BACKEND_URL?.replace("/api/nex", "") ||
        "http://localhost:8000";

      const newSocket = io(backendURL, {
        query: { userId: user._id },
        transports: ["websocket"],
        withCredentials: true,
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => console.log("🟢 Connected:", newSocket.id));
      newSocket.on("disconnect", () => console.log("🔴 Socket disconnected"));
      newSocket.on("connect_error", (error) =>
        console.log("❌ Connection error:", error)
      );
      newSocket.on("reconnect_attempt", (attempt) =>
        console.log(`🔄 Reconnect attempt ${attempt}`)
      );

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
        console.log(
          `🎪 Event ${eventRoom} now has`,
          participants.length,
          "participants"
        );
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }
  }, [token, user?._id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

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
