import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createNote, getNotesByUser, deleteNote } from "../services/noteService";

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
    <motion.div
      className="min-h-screen flex flex-col bg-background text-textMain pt-24 px-6 md:px-12 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-accent mb-6">📝 My Notes</h1>

        {/* Create Note */}
        <div className="bg-surface/30 p-5 rounded-2xl border border-surface/50 shadow-sm mb-8 backdrop-blur-sm">
          <input
            type="text"
            placeholder="Note Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full p-3 mb-3 bg-background border border-surface/60 rounded-md text-textMain placeholder-textSub focus:ring-1 focus:ring-accent focus:outline-none"
          />
          <textarea
            placeholder="Write something interesting..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full p-3 h-28 bg-background border border-surface/60 rounded-md text-textMain placeholder-textSub resize-none focus:ring-1 focus:ring-accent focus:outline-none"
          />
          <button
            onClick={handleCreateNote}
            className="mt-3 px-6 py-2 bg-accent text-background font-semibold rounded-md hover:opacity-90 transition"
          >
            Add Note
          </button>
        </div>

        {/* Notes List */}
        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <Loader2 className="animate-spin w-6 h-6 text-accent" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-textSub text-center mt-10">No notes yet. Add one above.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <motion.div
                key={note._id}
                whileHover={{ scale: 1.02 }}
                className="bg-surface p-4 rounded-xl shadow-md border border-surface/40 relative transition hover:shadow-lg"
              >
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
                <h3 className="text-lg font-semibold text-accent mb-1">{note.title}</h3>
                <p className="text-textSub text-sm whitespace-pre-line">{note.content}</p>
                <p className="text-xs text-textSub/70 mt-3">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
