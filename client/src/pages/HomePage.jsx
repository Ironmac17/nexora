import { motion } from "framer-motion";
import { useSocketContext } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import AvatarCanvas from "../components/avatar/AvatarCanvas";

export default function HomePage() {
  const { user } = useAuth();
  const { socket } = useSocketContext();

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-textMain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-accent">
          Welcome, {user?.fullName || "Student"}
        </h1>
        <p className="text-textSub mt-2">
          {socket ? (
            <span className="text-green-400">🟢 Connected to Campus</span>
          ) : (
            <span className="text-red-400">🔴 Offline</span>
          )}
        </p>
      </div>

      <motion.div
        className="bg-surface rounded-2xl shadow-lg border border-surface/70 p-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AvatarCanvas />
      </motion.div>
    </motion.div>
  );
}
