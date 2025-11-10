// src/pages/AreaDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSocketContext } from "@/context/SocketContext";
import { getAreaStatus } from "@/services/areaService";

export default function AreaDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, joinArea, leaveArea, avatars, moveAvatar } = useSocketContext();
  const [status, setStatus] = useState({ events: 0, usersOnline: 0 });

  useEffect(() => {
    joinArea(id);
    getAreaStatus(id).then(setStatus);
    const handle = ({ areaId }) => areaId === id && getAreaStatus(id).then(setStatus);
    socket?.on("areaStatusUpdate", handle);
    return () => {
      leaveArea(id);
      socket?.off("areaStatusUpdate", handle);
    };
  }, [id, socket]);

  // Move avatar on click
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    moveAvatar(x, y, id);
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <button onClick={() => navigate("/")} className="mb-3 rounded-md bg-gray-200 px-3 py-1 text-sm">
        ← Back
      </button>

      <h1 className="text-2xl font-semibold capitalize mb-1">{id.replace("-", " ")}</h1>
      <p className="text-sm text-gray-600 mb-4">
        Users online: {status.usersOnline} • Events: {status.events}
      </p>

      {/* Interactive map area */}
      <div
        className="relative h-[400px] w-full overflow-hidden rounded-xl border bg-slate-100"
        onClick={handleMapClick}
      >
        {Object.entries(avatars)
          .filter(([_, a]) => a.area === id)
          .map(([uid, a]) => (
            <motion.div
              key={uid}
              className="absolute flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-medium text-white shadow"
              animate={{ left: a.x, top: a.y }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ backgroundColor: a.color }}
            >
              {a.name.slice(-2)}
            </motion.div>
          ))}
      </div>
    </div>
  );
}
