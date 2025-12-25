import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  createNote,
  getNotesByUser,
  deleteNote,
} from "../services/noteService";

export default function NotesPage() {
  const { user, token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  // Fetch notes on load
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id && !user?._id) return;
      try {
        setLoading(true);
        const userId = user._id || user.id;
        const data = await getNotesByUser(token, userId);
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchNotes();
  }, [token, user]);

  // Add new note
  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    try {
      const response = await createNote(token, newNote);
      setNotes((prev) => [response.note, ...prev]);
      setNewNote({ title: "", content: "" });
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  // Delete note
  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(token, id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white pt-24 px-6 md:px-12 pb-10">
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
            📝 My Notes
          </h1>
          <p className="text-gray-400">Capture your thoughts and ideas</p>
        </motion.div>

        {/* Create Note */}
        <motion.div
          className="glass p-6 rounded-2xl border border-white/10 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Create New Note
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
              className="input-field w-full"
            />
            <textarea
              placeholder="Write something interesting..."
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              className="input-field w-full h-32 resize-none"
            />
            <motion.button
              onClick={handleCreateNote}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!newNote.title.trim() || !newNote.content.trim()}
            >
              <span className="mr-2">✨</span> Add Note
            </motion.button>
          </div>
        </motion.div>

        {/* Notes List */}
        {loading ? (
          <motion.div
            className="flex justify-center items-center mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="animate-spin w-8 h-8 text-purple-400" />
          </motion.div>
        ) : notes.length === 0 ? (
          <motion.div
            className="text-center mt-20 glass p-8 rounded-2xl border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg">
              No notes yet. Create your first note above!
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {notes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass p-5 rounded-2xl border border-white/10 shadow-lg relative group hover:shadow-purple-500/10 transition-all duration-300"
              >
                <motion.button
                  onClick={() => handleDeleteNote(note._id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={18} />
                </motion.button>
                <h3 className="text-lg font-semibold text-white mb-2 pr-8">
                  {note.title}
                </h3>
                <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed mb-4">
                  {note.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <span>
                    {new Date(note.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
