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
    <motion.div
      className="flex flex-col h-screen bg-background text-textMain px-4 pb-20 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-3 text-accent text-center">
        Campus Chat 💬
      </h1>

      <div className="flex-1 overflow-y-auto bg-surface/30 rounded-xl border border-surface/60 p-4 space-y-3 scrollbar-thin scrollbar-thumb-accent/40 scrollbar-track-transparent">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-accent" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-textSub mt-10">No messages yet...</p>
        ) : (
          messages.map((msg, i) => {
            const isMine =
              msg.sender?._id === user?.id || msg.sender?.id === user?.id;
            return (
              <div
                key={i}
                className={`flex w-full ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex flex-col max-w-[70%] p-3 rounded-2xl shadow-md ${
                    isMine
                      ? "bg-accent text-background rounded-br-none"
                      : "bg-surface text-textMain rounded-bl-none"
                  }`}
                >
                  {!isMine && (
                    <p className="text-xs text-textSub mb-1 font-medium">
                      {msg.sender?.fullName || "Student"}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span
                    className={`text-[10px] mt-1 text-right ${
                      isMine ? "text-background/70" : "text-textSub"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 mt-3 bg-surface/40 border border-surface/70 p-3 rounded-xl shadow-md"
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-transparent focus:outline-none text-textMain placeholder-textSub text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-accent text-background px-4 py-2 rounded-lg flex items-center gap-1 font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <SendHorizonal className="h-4 w-4" />
          Send
        </button>
      </form>
    </motion.div>
  );
}
