import { motion } from "framer-motion";
import { LogOut, Home, MessageCircle, StickyNote, Users, Calendar } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path === "/clubs" && location.pathname.startsWith("/clubs"));

  // detect if inside area dashboard
  const inArea = location.pathname.startsWith("/area/");

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-b border-surface/50 
                 text-textMain flex justify-between items-center px-6 sm:px-10 py-3 z-50 shadow-lg"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <Link
        to="/home"
        className="text-accent text-2xl font-bold tracking-wide hover:opacity-90 transition"
      >
        Nexora
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center text-sm font-medium">
        {inArea ? (
          // Simplified navbar when inside an area
          <>
            <NavItem
              to="/my-events"
              icon={<Calendar size={18} />}
              label="My Events"
              active={isActive("/my-events")}
            />
          </>
        ) : (
          // Full navbar for normal pages
          <>
            <NavItem
              to="/home"
              icon={<Home size={18} />}
              label="Home"
              active={isActive("/home")}
            />
            <NavItem
              to="/notes"
              icon={<StickyNote size={18} />}
              label="Notes"
              active={isActive("/notes")}
            />
            <NavItem
              to="/chat"
              icon={<MessageCircle size={18} />}
              label="Chat"
              active={isActive("/chat")}
            />
            <NavItem
              to="/clubs"
              icon={<Users size={18} />}
              label="Clubs"
              active={isActive("/clubs")}
            />
          </>
        )}
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-textSub hidden sm:block truncate max-w-[120px]">
            {user.fullName}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 flex items-center gap-1 text-sm transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </motion.nav>
  );
}

// Reusable NavItem Component
function NavItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200
        ${
          active
            ? "text-accent bg-surface/70 shadow-inner"
            : "hover:text-accent hover:bg-surface/40"
        }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
