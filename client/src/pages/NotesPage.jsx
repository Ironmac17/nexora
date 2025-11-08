import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/note/all");
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <motion.div
      className="p-8 bg-background min-h-screen text-textMain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-accent">Your Notes</h1>

      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-textSub">No notes found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <motion.div
              key={note._id}
              className="p-4 bg-surface rounded-lg border border-surface/50"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="font-semibold text-accent">{note.title}</h2>
              <p className="text-textSub text-sm mt-2">{note.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
