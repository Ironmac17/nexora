import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function EventPage() {
  const { id } = useParams();

  return (
    <motion.div
      className="min-h-screen bg-background text-textMain p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold text-accent mb-4">Event Room</h1>
      <p className="text-textSub">Event ID: {id}</p>

      <div className="mt-8 p-6 bg-surface rounded-lg border border-surface/50">
        <p>This is your live event space. You’ll integrate Socket.io for real-time Q&A soon.</p>
      </div>
    </motion.div>
  );
}
