import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // optional

export default function LandingPage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-textMain px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background glow effect */}
      <div className="absolute -z-10 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]" />

      {/* Hero Content */}
      <motion.div
        className="text-center max-w-2xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <img src={logo} alt="Nexora Logo" className="w-20 h-20 mx-auto mb-6 opacity-90" />
        <h1 className="text-5xl font-extrabold mb-4 text-accent">
          Welcome to Nexora
        </h1>
        <p className="text-textSub text-lg mb-8">
          Your Virtual Campus — where students explore, chat, and collaborate in real-time.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:opacity-90 transition"
          >
            Enter Campus
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-accent rounded-lg hover:bg-accent/10 transition"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
