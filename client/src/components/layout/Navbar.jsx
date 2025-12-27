import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, FileText, Users, Home } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  // Check if we're on an area dashboard page
  const isAreaPage =
    location.pathname.startsWith("/area/") &&
    !location.pathname.includes("/notes") &&
    !location.pathname.includes("/chat") &&
    !location.pathname.includes("/clubs") &&
    !location.pathname.includes("/events/");
  const areaId = isAreaPage
    ? location.pathname.split("/area/")[1]?.split("/")[0]
    : null;

  const navItems = [
    {
      to: `/area/${areaId}/notes`,
      icon: <FileText size={18} />,
      label: "Notes",
    },
    {
      to: `/area/${areaId}/chat`,
      icon: <MessageSquare size={18} />,
      label: "Chat",
    },
    { to: `/area/${areaId}/clubs`, icon: <Users size={18} />, label: "Clubs" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 glass text-white flex justify-between items-center px-6 py-3 z-[60]"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Area Navigation Items - Only show on area dashboard */}
      {isAreaPage && (
        <div className="flex items-center gap-2">
          <Link
            to="/home"
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white hover:scale-105"
          >
            <Home size={18} />
            <span className="hidden sm:inline">Campus</span>
          </Link>

          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white hover:scale-105"
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Spacer for non-area pages */}
      {!isAreaPage && <div></div>}

      {/* User Avatar */}
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
