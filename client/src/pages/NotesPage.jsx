import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  createNote,
  getNotesByRoom,
  deleteNote,
} from "../services/noteService";

export default function NotesPage() {
  const { user, token } = useAuth();
  const { areaId } = useParams();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  /* ---------- FETCH NOTES ---------- */
  useEffect(() => {
    const fetchNotes = async () => {
      if (!token || !areaId) return;

      try {
        setLoading(true);
        const data = await getNotesByRoom(token, areaId);
        setNotes(data || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token, areaId]);

  /* ---------- CREATE NOTE ---------- */
  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      const noteWithRoom = { ...newNote, room: areaId };
      const response = await createNote(token, noteWithRoom);
      setNotes((prev) => [response.note, ...prev]);
      setNewNote({ title: "", content: "" });
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  /* ---------- DELETE NOTE ---------- */
  const handleDeleteNote = (id) => {
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(token, noteToDelete);
      setNotes((prev) => prev.filter((n) => n._id !== noteToDelete));
    } catch (err) {
      console.error("Error deleting note:", err);
    } finally {
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white pt-24 px-6 pb-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            📝 Area Notes
          </h1>
          <p className="text-gray-400">
            Capture your thoughts and ideas for this area
          </p>
        </motion.div>

        {/* CREATE NOTE */}
        <div className="glass p-6 rounded-2xl mb-8">
          <h2 className="text-xl mb-4">Create New Note</h2>

          <input
            className="input-field mb-3 w-full"
            placeholder="Note title"
            value={newNote.title}
            onChange={(e) =>
              setNewNote({ ...newNote, title: e.target.value })
            }
          />

          <textarea
            className="input-field w-full h-32 mb-4"
            placeholder="Write something..."
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
          />

          <button
            onClick={handleCreateNote}
            className="btn-primary w-full"
            disabled={!newNote.title.trim() || !newNote.content.trim()}
          >
            ✨ Add Note
          </button>
        </div>

        {/* NOTES LIST */}
        {loading ? (
          <div className="flex justify-center mt-20">
            <Loader2 className="animate-spin w-8 h-8 text-purple-400" />
          </div>
        ) : notes.length === 0 ? (
          <div className="glass p-8 rounded-2xl text-center">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400">
              No notes yet. Create your first note above!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="glass p-5 rounded-2xl relative group"
              >
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>

                <h3 className="text-lg font-semibold mb-2">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">
                  {note.content}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

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
              <h3 className="text-red-300 mb-4">Delete Note?</h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteNote}
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
