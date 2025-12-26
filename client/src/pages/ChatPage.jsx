import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import {
  getMessagesByRoom,
  sendRoomMessage,
  deleteMessage,
} from "../services/chatService";
import { Loader2, SendHorizonal, Trash2 } from "lucide-react";

export default function ChatPage() {
  const { user, token } = useAuth();
  const { areaId } = useParams();
  const { socket } = useSocketContext();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const room = `area-${areaId}`;
  const messagesEndRef = useRef(null);

  /* ---------- FETCH OLD MESSAGES ---------- */
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
  }, [token, room]);

  /* ---------- SOCKET ---------- */
  useEffect(() => {
    if (!socket || !user?.id) return;

    socket.emit("join-room", { room });

    const onReceive = (msg) => {
      if (msg.sender?._id === user.id) return;
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-room-message", onReceive);

    return () => {
      socket.off("receive-room-message", onReceive);
    };
  }, [socket, user?.id, room]);

  /* ---------- SCROLL ---------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- SEND ---------- */
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
      socket.emit("send-room-message", { room, text });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;

    try {
      await deleteMessage(token, messageToDelete);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== messageToDelete)
      );
    } catch (err) {
      console.error("Error deleting message:", err);
    } finally {
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white px-4 pb-20 pt-24">

      {/* HEADER */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          💬 Area Chat
        </h1>
        <p className="text-gray-400">Connect with students in this area</p>
      </motion.div>

      {/* CHAT BOX */}
      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin w-8 h-8 text-purple-400" />
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine =
              msg.sender?._id === user?.id || msg.sender?.id === user?.id;

            return (
              <div
                key={msg._id || i}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-xl relative ${
                    isMine
                      ? "bg-purple-600 text-white"
                      : "glass border border-white/10"
                  }`}
                >
                  {isMine && msg._id && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="absolute top-1 right-1 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {!isMine && (
                    <p className="text-xs text-purple-300 mb-1">
                      {msg.sender?.fullName || "Student"}
                    </p>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSend}
        className="flex gap-3 mt-4 glass p-4 rounded-xl"
      >
        <input
          className="flex-1 bg-transparent outline-none text-white"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn-primary px-4" disabled={!text.trim()}>
          <SendHorizonal size={16} />
        </button>
      </form>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="glass p-6 rounded-xl max-w-sm w-full">
              <h3 className="text-red-300 mb-4">Delete message?</h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteMessage}
                  className="bg-red-600 px-4 py-2 rounded-md text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
