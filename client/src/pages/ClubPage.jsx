import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getClubById, createClubPost } from "../services/clubService";
import { Loader2, SendHorizonal } from "lucide-react";

export default function ClubPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");

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
    <motion.div
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
        <div className="lg:col-span-2 bg-surface/40 border border-surface/60 p-5 rounded-xl shadow-md">
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
    </motion.div>
  );
}
