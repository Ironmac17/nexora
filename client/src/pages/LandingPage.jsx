import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // optional

export default function LandingPage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
      <div className="absolute -z-10 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute -z-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] top-1/4 left-1/4" />
      <div className="absolute -z-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] bottom-1/4 right-1/4" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        className="text-center max-w-2xl relative z-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-1"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
              N
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl font-extrabold mb-6 text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Welcome to Nexora
        </motion.h1>

        <motion.p
          className="text-gray-300 text-xl mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Your Virtual Campus — where students explore, chat, and collaborate in
          real-time. Experience the future of digital education.
        </motion.p>

        <motion.div
          className="flex justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              Enter Campus
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="px-8 py-4 glass border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Sign Up
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center space-x-8 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Real-time Chat</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Interactive Maps</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Virtual Collaboration</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
