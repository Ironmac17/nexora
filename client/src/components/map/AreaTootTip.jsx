// src/components/map/AreaTooltip.jsx
import React from "react";
import { motion } from "framer-motion";
import { Users, Calendar, MapPin } from "lucide-react";

export default function AreaTooltip({
  x,
  y,
  name,
  description,
  status,
  visible,
}) {
  if (!visible) return null;

  const users = status?.usersOnline ?? 0;
  const events = status?.events ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      className="pointer-events-none absolute z-50"
      style={{ left: x + 12, top: y + 12 }}
    >
      <div className="glass rounded-xl p-4 shadow-2xl border border-white/20 min-w-[220px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-purple-400" />
          <h3 className="font-semibold text-white text-sm">{name}</h3>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-300 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={12} className="text-blue-400" />
              <span className="text-xs text-gray-300">Users Online</span>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                users > 10
                  ? "bg-red-500/20 text-red-300"
                  : users > 0
                  ? "bg-green-500/20 text-green-300"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {users}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-orange-400" />
              <span className="text-xs text-gray-300">Live Events</span>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                events > 0
                  ? "bg-orange-500/20 text-orange-300"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {events}
            </span>
          </div>
        </div>

        {/* Activity indicator */}
        {(users > 0 || events > 0) && (
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">
              Active Now
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
