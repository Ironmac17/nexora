// src/hooks/useSocket.js
import { useSocketContext } from "../context/SocketContext";

export default function useSocket() {
  const { socket, messages, setMessages, onlineUsers } = useSocketContext();

  const sendMessage = (messageData) => {
    if (!socket) return;
    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]);
  };

  return { socket, messages, sendMessage, onlineUsers };
}
