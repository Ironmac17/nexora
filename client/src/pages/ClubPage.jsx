import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Loader2, SendHorizonal, Users } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import { getClubById, createClubPost } from "../services/clubService";

export default function ClubPage() {
  const { areaId, id } = useParams();
  const { token, user } = useAuth();
  const { socket } = useSocketContext();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const [eventMessages, setEventMessages] = useState({});
  const [chatInputs, setChatInputs] = useState({});

  const messagesEndRef = useRef(null);

  const liveEvents = club?.events?.filter((e) => e.isLive) || [];

  /* ---------- FETCH CLUB ---------- */
  const fetchClub = async () => {
    try {
      setLoading(true);
      const data = await getClubById(id);
      setClub(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  /* ---------- SOCKET ---------- */
  useEffect(() => {
    if (!socket || !liveEvents.length) return;

    liveEvents.forEach((e) =>
      socket.emit("joinClubEvent", { eventRoom: e._id })
    );

    const onMessage = (msg) => {
      setEventMessages((prev) => ({
        ...prev,
        [msg.eventRoom]: [...(prev[msg.eventRoom] || []), msg],
      }));
    };

    socket.on("receiveClubMessage", onMessage);

    return () => {
      liveEvents.forEach((e) =>
        socket.emit("leaveClubEvent", { eventRoom: e._id })
      );
      socket.off("receiveClubMessage", onMessage);
    };
  }, [socket, liveEvents]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [eventMessages]);

  /* ---------- HANDLERS ---------- */
  const handlePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    await createClubPost(token, id, postTitle, postContent);
    setPostTitle("");
    setPostContent("");
    fetchClub(); // refresh posts
  };

  const handleSendChat = (eventRoom) => (e) => {
    e.preventDefault();
    const text = chatInputs[eventRoom];
    if (!text?.trim()) return;

    socket.emit("sendClubMessage", { eventRoom, text });

    setEventMessages((prev) => ({
      ...prev,
      [eventRoom]: [
        ...(prev[eventRoom] || []),
        {
          sender: user,
          text,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setChatInputs((prev) => ({ ...prev, [eventRoom]: "" }));
  };

  /* ---------- STATES ---------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-purple-400 w-10 h-10" />
      </div>
    );
  }

  if (!club) {
    return <div className="text-center text-gray-400">Club not found</div>;
  }

  const isMember = club.members.some(
    (m) => m._id === user?.id || m._id === user?._id
  );

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen px-6 py-24 text-white">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold mb-4"
      >
        {club.name}
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* POSTS */}
        <div className="glass p-6 rounded-xl">
          <h2 className="mb-4">📝 Posts</h2>

          {isMember && (
            <form onSubmit={handlePost} className="space-y-3 mb-6">
              <input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Post title"
                className="input-field"
              />
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Post content"
                className="input-field"
              />
              <button className="btn-primary w-full">
                <SendHorizonal className="inline w-4 h-4 mr-2" />
                Post
              </button>
            </form>
          )}
        </div>

        {/* LIVE CHAT */}
        {liveEvents.length > 0 && (
          <div className="glass p-6 rounded-xl">
            <h2 className="mb-4">💬 Live Chat</h2>

            {liveEvents.map((event) => (
              <div key={event._id} className="mb-6">
                <div className="h-48 overflow-y-auto space-y-2">
                  {(eventMessages[event._id] || []).map((msg, i) => (
                    <div key={i} className="text-sm">
                      <strong>{msg.sender?.fullName}:</strong> {msg.text}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSendChat(event._id)}
                  className="flex gap-2 mt-2"
                >
                  <input
                    value={chatInputs[event._id] || ""}
                    onChange={(e) =>
                      setChatInputs((prev) => ({
                        ...prev,
                        [event._id]: e.target.value,
                      }))
                    }
                    className="input-field flex-1"
                    placeholder="Type a message"
                  />
                  <button className="btn-primary">
                    <SendHorizonal className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* MEMBERS */}
        <div className="glass p-6 rounded-xl">
          <h2 className="mb-4">
            <Users className="inline w-4 h-4 mr-1" />
            Members
          </h2>
          {club.members.map((m) => (
            <p key={m._id} className="text-sm text-gray-300">
              {m.fullName}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
