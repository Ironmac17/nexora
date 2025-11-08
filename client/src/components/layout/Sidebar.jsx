import { NavLink } from "react-router-dom";
import { MessageCircle, StickyNote, Home, Users } from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/home", icon: <Home size={18} />, label: "Home" },
    { to: "/chat", icon: <MessageCircle size={18} />, label: "Chat" },
    { to: "/notes", icon: <StickyNote size={18} />, label: "Notes" },
    { to: "/clubs", icon: <Users size={18} />, label: "Clubs" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-surface/10 border-r border-surface/40 p-4 flex flex-col justify-between">
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive
                  ? "bg-accent text-background"
                  : "text-textMain hover:bg-surface/20"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="text-center text-xs text-textSub">© Nexora 2025</div>
    </aside>
  );
}
