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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-accent" />
      </div>
    );

  if (!club)
    return <p className="text-center text-textSub mt-10">Club not found</p>;

  const isMember = club.members.some((m) => m._id === user?.id);

  return (
    <div
      className="min-h-screen bg-background text-textMain px-6 py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-accent">{club.name}</h1>
        <p className="text-textSub mt-1">{club.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Posts */}
        <div className="bg-surface/40 border border-surface/60 p-5 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-accent">Posts</h2>

          {isMember && (
            <form onSubmit={handlePost} className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Post title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full p-2 rounded-lg bg-background border border-surface/60 text-textMain text-sm"
              />
              <textarea
                placeholder="Share an update..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full p-2 rounded-lg bg-background border border-surface/60 text-sm text-textMain h-24"
              />
              <button
                type="submit"
                className="flex items-center gap-1 bg-accent text-background px-4 py-2 rounded-lg hover:opacity-90 transition"
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
