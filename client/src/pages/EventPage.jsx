import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function EventPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
            🎪 Event Room
          </h1>
          <p className="text-gray-400">Live interactive event space</p>
        </div>

        <motion.div
          className="glass p-8 rounded-2xl border border-white/10 shadow-xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎪</div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Event ID: {id}
          </h2>
          <p className="text-gray-300 mb-6">
            This is your live event space. Real-time Q&A and interactive
            features coming soon!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Interactive</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
