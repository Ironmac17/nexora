// src/components/chat/MessageList.jsx
import { motion } from "framer-motion";
import useSocket from "../../hooks/useSocket";
import { useAuth } from "../../context/AuthContext";

export default function MessageList() {
  const { messages } = useSocket();
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-surface/50">
      {messages.length === 0 ? (
        <p className="text-center text-textSub">No messages yet.</p>
      ) : (
        messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                msg.senderId === user?._id
                  ? "bg-accent text-background"
                  : "bg-surface text-textMain"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-[10px] opacity-60 block mt-1">
                {msg.senderName || "Unknown"}
              </span>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
