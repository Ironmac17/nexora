// src/components/chat/MessageInput.jsx
import { useState } from "react";
import useSocket from "../../hooks/useSocket";
import { sendMessage } from "../../services/chatService";
import { useAuth } from "../../context/AuthContext";
import { Send } from "lucide-react";

export default function MessageInput({ receiverId }) {
  const [message, setMessage] = useState("");
  const { sendMessage: emitMessage } = useSocket();
  const { user } = useAuth();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      senderId: user._id,
      receiverId,
      content: message.trim(),
      senderName: user.fullName,
    };

    emitMessage(messageData); // Real-time socket send
    await sendMessage(messageData); // Save to DB
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center p-3 border-t border-surface bg-background"
    >
      <input
        type="text"
        className="flex-1 bg-transparent outline-none px-3 text-textMain placeholder-textSub"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="p-2 bg-accent text-background rounded-lg hover:opacity-90 transition"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
