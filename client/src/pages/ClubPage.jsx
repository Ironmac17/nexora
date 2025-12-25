import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import { getClubById, createClubPost } from "../services/clubService";
import { Loader2, SendHorizonal } from "lucide-react";

export default function ClubPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { socket } = useSocketContext();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [eventMessages, setEventMessages] = useState({});
  const [chatText, setChatText] = useState("");
  const messagesEndRef = useRef(null);

  const liveEvents = club?.events?.filter((e) => e.isLive) || [];

  const fetchClub = async () => {
    try {
      setLoading(true);
      const data = await getClubById(id);
      setClub(data);
    } catch (err) {
      console.error("Error fetching club:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    try {
      await createClubPost(token, id, postTitle, postContent);
      setPostTitle("");
      setPostContent("");
      fetchClub();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  useEffect(() => {
    if (!socket || !club) return;

    liveEvents.forEach((event) => {
      const eventRoom = event._id; // assuming event has _id
      socket.emit("joinClubEvent", { eventRoom });

      socket.on("receiveClubMessage", (msg) => {
        if (msg.eventRoom === eventRoom) {
          setEventMessages((prev) => ({
            ...prev,
            [eventRoom]: [...(prev[eventRoom] || []), msg],
          }));
        }
      });
    });

    return () => {
      liveEvents.forEach((event) => {
        socket.emit("leaveClubEvent", { eventRoom: event._id });
      });
      socket.off("receiveClubMessage");
    };
  }, [socket, club]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [eventMessages]);

  const handleSendChat = (eventRoom) => (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    const localMessage = {
      sender: user,
      text: chatText,
      eventRoom,
      createdAt: new Date().toISOString(),
    };

    setEventMessages((prev) => ({
      ...prev,
      [eventRoom]: [...(prev[eventRoom] || []), localMessage],
    }));
    setChatText("");

    socket.emit("sendClubMessage", {
      eventRoom,
      text: chatText,
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
      </div>
    );

  if (!club)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white flex items-center justify-center">
        <div className="glass p-8 rounded-2xl border border-white/10 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-400">Club not found</p>
        </div>
      </div>
    );

  const isMember = club.members.some((m) => m._id === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white px-6 py-24">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
          {club.name}
        </h1>
        <p className="text-gray-300 text-lg">{club.description}</p>
        <div className="flex items-center mt-2 text-sm text-gray-400">
          <Users className="h-4 w-4 mr-1" />
          {club.members.length} members
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Posts */}
        <motion.div
          className="glass border border-white/10 p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            📝 Posts
          </h2>

          {isMember && (
            <form onSubmit={handlePost} className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Post title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="input-field w-full"
              />
              <textarea
                placeholder="Share an update..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="input-field w-full h-24 resize-none"
              />
              <motion.button
                type="submit"
                className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!postTitle.trim() || !postContent.trim()}
              >
                <SendHorizonal className="h-4 w-4 mr-2" /> Post
              </motion.button>
            </form>
          )}

          {club.posts?.length ? (
            <div className="space-y-4">
              {club.posts
                .slice()
                .reverse()
                .map((post, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="glass border border-white/5 p-4 rounded-xl"
                  >
                    <h3 className="font-semibold text-white text-sm mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {post.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-gray-400 text-sm">No posts yet</p>
            </div>
          )}
        </motion.div>

        {/* Middle Column: Live Event Chat */}
        {liveEvents.length > 0 && (
          <motion.div
            className="glass border border-white/10 p-6 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
              💬 Live Event Chat
            </h2>
            {liveEvents.map((event) => (
              <div key={event._id} className="mb-6">
                <h3 className="text-sm font-semibold text-purple-300 mb-3">
                  {event.title}
                </h3>
                <div className="h-48 overflow-y-auto glass border border-white/5 rounded-xl p-3 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                  {(eventMessages[event._id] || []).map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender?._id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-xl text-sm shadow-lg ${
                          msg.sender?._id === user?.id
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md"
                            : "glass border border-white/10 text-white rounded-bl-md"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-xs opacity-70 block mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form
                  onSubmit={handleSendChat(event._id)}
                  className="flex gap-3 mt-3"
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    className="input-field flex-1"
                  />
                  <motion.button
                    type="submit"
                    className="btn-primary px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!chatText.trim()}
                  >
                    <SendHorizonal className="h-4 w-4" />
                  </motion.button>
                </form>
              </div>
            ))}
          </motion.div>
        )}

        {/* Right Column: Members & Events */}
        <motion.div
          className="glass border border-white/10 p-6 rounded-2xl shadow-xl space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              👥 Members ({club.members.length})
            </h2>
            <ul className="space-y-2">
              {club.members.map((m) => (
                <li key={m._id} className="text-gray-300 text-sm flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  {m.fullName}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              📅 Events
            </h2>
            {club.events?.length ? (
              <ul className="space-y-3">
                {club.events.map((e, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="glass border border-white/5 p-4 rounded-xl"
                  >
                    <p className="font-medium text-white text-sm mb-1">{e.title}</p>
                    <p className="text-gray-400 text-xs mb-2">{e.description}</p>
                    {e.isLive && (
                      <span className="inline-flex items-center text-green-400 text-xs font-semibold">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                        Live Now
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-gray-400 text-sm">No events yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
              >
                <SendHorizonal className="h-4 w-4" /> Post
              </button>
            </form>
          )}

          {club.posts?.length ? (
            club.posts
              .slice()
              .reverse()
              .map((post, i) => (
                <div
                  key={i}
                  className="bg-surface p-3 rounded-lg mb-3 border border-surface/40"
                >
                  <h3 className="font-semibold text-accent text-sm">
                    {post.title}
                  </h3>
                  <p className="text-sm mt-1 text-textMain leading-relaxed">
                    {post.content}
                  </p>
                  <p className="text-xs text-textSub mt-1">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-sm text-textSub">No posts yet</p>
          )}
        </div>

        {/* Middle Column: Live Event Chat */}
        {liveEvents.length > 0 && (
          <div className="bg-surface/40 border border-surface/60 p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-accent">
              💬 Live Event Chat
            </h2>
            {liveEvents.map((event) => (
              <div key={event._id} className="mb-4">
                <h3 className="text-sm font-semibold text-accent">
                  {event.title}
                </h3>
                <div className="h-48 overflow-y-auto bg-background/50 rounded-lg p-2 space-y-2">
                  {(eventMessages[event._id] || []).map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender?._id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-2 rounded-lg text-sm ${
                          msg.sender?._id === user?.id
                            ? "bg-accent text-background"
                            : "bg-surface text-textMain"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-xs opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form
                  onSubmit={handleSendChat(event._id)}
                  className="flex gap-2 mt-2"
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    className="flex-1 p-2 rounded-lg bg-background border border-surface/60 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-accent text-background px-3 py-2 rounded-lg"
                  >
                    <SendHorizonal className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* Right Column: Members & Events */}
        <div className="bg-surface/40 border border-surface/60 p-5 rounded-xl shadow-md space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-accent mb-2">Members</h2>
            <ul className="space-y-1 text-sm">
              {club.members.map((m) => (
                <li key={m._id} className="text-textSub">
                  {m.fullName}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-accent mb-2">Events</h2>
            {club.events?.length ? (
              <ul className="space-y-2 text-sm">
                {club.events.map((e, i) => (
                  <li
                    key={i}
                    className="p-2 bg-surface rounded-md border border-surface/40"
                  >
                    <p className="font-medium text-textMain">{e.title}</p>
                    <p className="text-xs text-textSub">{e.description}</p>
                    {e.isLive && (
                      <span className="text-green-400 text-xs font-semibold">
                        🔴 Live Now
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-textSub">No events yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
