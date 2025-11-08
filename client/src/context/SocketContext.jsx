import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!token || !user?._id) return; // wait until user is ready

    const newSocket = io(import.meta.env.VITE_BACKEND_URL?.replace("/api/nex", "") || "http://localhost:8000", {
      transports: ["websocket"],
      query: { userId: user._id },
      withCredentials: true,
    });

    newSocket.on("connect", () => console.log("🟢 Connected to socket:", newSocket.id));
    newSocket.on("disconnect", () => console.log("🔴 Socket disconnected"));
    newSocket.on("onlineUsers", (users) => setOnlineUsers(users));
    newSocket.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, user?._id]); // re-run when user changes

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, messages, setMessages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
