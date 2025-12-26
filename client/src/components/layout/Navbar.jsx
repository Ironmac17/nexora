import { motion } from "framer-motion";
import {
  LogOut,
  Home,
  MessageCircle,
  StickyNote,
  Users,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import AvatarCustomizer from "../avatar/AvatarCustomizer";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // detect if inside area dashboard and extract areaId
  const inArea = location.pathname.startsWith("/area/");
  const areaId = inArea ? location.pathname.split("/")[2] : null;

  const isActive = (path) => {
    if (inArea) {
      // For area-specific routes, check if the current path ends with the feature
      return location.pathname.includes(path);
    }
    return location.pathname === path;
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 glass text-white flex justify-between items-center px-6 sm:px-10 py-3 z-50"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <Link
        to="/home"
        className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-2xl font-bold tracking-wide hover:scale-105 transition-all duration-300"
      >
        Nexora
      </Link>

      {/* Area Indicator */}
      {inArea && areaId && (
        <div className="flex items-center gap-2 text-sm text-gray-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          <MapPin size={14} className="text-purple-400" />
          <span className="capitalize">{areaId.replace(/-/g, " ")}</span>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex gap-6 items-center text-sm font-medium">
        {inArea && areaId ? (
          // Area-specific navbar when inside an area
          <>
            <NavItem
              to={`/area/${areaId}`}
              icon={<Home size={18} />}
              label="Area Home"
              active={location.pathname === `/area/${areaId}`}
            />
            <NavItem
              to={`/area/${areaId}/notes`}
              icon={<StickyNote size={18} />}
              label="Notes"
              active={isActive("/notes")}
            />
            <NavItem
              to={`/area/${areaId}/chat`}
              icon={<MessageCircle size={18} />}
              label="Chat"
              active={isActive("/chat")}
            />
            <NavItem
              to={`/area/${areaId}/clubs`}
              icon={<Users size={18} />}
              label="Clubs"
              active={isActive("/clubs")}
            />
          </>
        ) : (
          // Global navbar for home and other pages
          <>
            <NavItem
              to="/home"
              icon={<Home size={18} />}
              label="Home"
              active={isActive("/home")}
            />
          </>
        )}
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-gray-300 hidden sm:block truncate max-w-[120px]">
            {user.fullName}
          </div>
        )}
        <button
          onClick={() => setShowAvatarModal(true)}
          className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm transition-all hover:scale-110"
        >
          <User size={18} />
        </button>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm transition-all hover:scale-110"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {showAvatarModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAvatarModal(false)}
        >
          <motion.div
            className="glass p-6 rounded-xl max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AvatarCustomizer onClose={() => setShowAvatarModal(false)} />
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
}

// Reusable NavItem Component
function NavItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105
        ${
          active
            ? "text-purple-400 bg-white/10 shadow-lg glow-purple"
            : "text-gray-300 hover:text-purple-400 hover:bg-white/5"
        }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
