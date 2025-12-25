import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import { getMessagesByRoom, sendRoomMessage } from "../services/chatService";
import { Loader2, SendHorizonal } from "lucide-react";

export default function ChatPage() {
  const { user, token } = useAuth();
  const { socket } = useSocketContext();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const room = "campus";
  const messagesEndRef = useRef(null);

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessagesByRoom(token, room);
        setMessages(data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    socket.emit("join-room", { userId: user?.id, room });

    socket.on("receive-room-message", (msg) => {
      // avoid duplicate if user already sent this locally
      if (msg.sender?._id === user?.id) return;
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-room-message");
    };
  }, [socket, user?.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const localMessage = {
      sender: user,
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, localMessage]);
    setText("");

    try {
      await sendRoomMessage(token, room, text);
      socket.emit("send-room-message", {
        room,
        sender: user,
        text,
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white px-4 pb-20 pt-24">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
          💬 Campus Chat
        </h1>
        <p className="text-gray-400">Connect with fellow students</p>
      </motion.div>

      <motion.div
        className="flex-1 glass rounded-2xl border border-white/10 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent h-full">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin w-8 h-8 text-purple-400" />
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              className="text-center mt-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-6xl mb-4">💭</div>
              <p className="text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </motion.div>
          ) : (
            messages.map((msg, i) => {
              const isMine =
                msg.sender?._id === user?.id || msg.sender?.id === user?.id;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isMine ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={`flex w-full ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex flex-col max-w-[75%] p-4 rounded-2xl shadow-lg ${
                      isMine
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md"
                        : "glass border border-white/10 text-white rounded-bl-md"
                    }`}
                  >
                    {!isMine && (
                      <p className="text-xs text-purple-300 mb-2 font-medium">
                        {msg.sender?.fullName || "Student"}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[10px] mt-2 text-right ${
                        isMine ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSend}
        className="flex items-center gap-3 mt-4 glass border border-white/10 p-4 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-transparent focus:outline-none text-white placeholder-gray-400 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <motion.button
          type="submit"
          className="btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!text.trim()}
        >
          <SendHorizonal className="h-4 w-4" />
          Send
        </motion.button>
      </motion.form>
    </div>
  );
}
