import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth(); // You’ll get logged-in user from AuthContext
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8000", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO:", newSocket.id);
      // optional: join user to default “campus” room
      newSocket.emit("join-room", { userId: user._id, room: "campus" });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("❌ Disconnected from Socket.IO");
    };
  }, [user?._id]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
