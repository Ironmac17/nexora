import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 glass text-white flex justify-end items-center px-6 py-3 z-50"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* User Avatar - Only Element */}
      {user && (
        <Link to="/profile" className="relative group">
          <div
            className="w-10 h-10 rounded-full border-2 border-purple-400/50 flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110 group-hover:border-purple-300 shadow-lg"
            style={{ backgroundColor: user.avatar?.color || "#00AEEF" }}
          >
            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Accessory overlay */}
          {user.avatar?.accessory && user.avatar.accessory !== "none" && (
            <div className="absolute -top-1 -right-1 text-sm group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
              {user.avatar.accessory === "cap" && "🧢"}
              {user.avatar.accessory === "glasses" && "👓"}
              {user.avatar.accessory === "headphones" && "🎧"}
              {user.avatar.accessory === "hat" && "🎩"}
              {user.avatar.accessory === "sunglasses" && "🕶️"}
              {user.avatar.accessory === "beanie" && "🧢"}
            </div>
          )}
        </Link>
      )}
    </motion.nav>
  );
}
