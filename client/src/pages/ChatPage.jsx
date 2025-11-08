import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRecentChats } from "../services/chatService";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import { UserCircle2 } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recent conversations
  useEffect(() => {
    (async () => {
      try {
        const data = await getRecentChats();
        setConversations(data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handle user connection
  useEffect(() => {
    if (socket && user) {
      socket.emit("joinUser", user._id);
    }
  }, [socket, user]);

  return (
    <motion.div
      className="flex h-[calc(100vh-4rem)] bg-background text-textMain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Sidebar */}
      <aside className="w-1/4 border-r border-surface/40 bg-surface/10 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold text-accent mb-4">Chats</h2>

        {loading ? (
          <p className="text-textSub text-sm">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="text-textSub text-sm">No recent chats</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((chat) => {
              const partner =
                chat.user1._id === user._id ? chat.user2 : chat.user1;
              const isOnline = onlineUsers.includes(partner._id);
              return (
                <div
                  key={chat._id}
                  onClick={() => setActiveChat(partner)}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-surface/20 ${
                    activeChat?._id === partner._id ? "bg-surface/30" : ""
                  }`}
                >
                  <UserCircle2 size={32} className="text-accent" />
                  <div>
                    <p className="font-medium">{partner.fullName}</p>
                    <p className="text-xs text-textSub">
                      {isOnline ? "🟢 Online" : "⚫ Offline"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-surface/40 bg-surface/20">
              <h2 className="text-accent font-semibold">{activeChat.fullName}</h2>
              <p className="text-xs text-textSub">
                {onlineUsers.includes(activeChat._id) ? "Online" : "Offline"}
              </p>
            </div>

            <MessageList />
            <MessageInput receiverId={activeChat._id} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-textSub">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </motion.div>
  );
}
