// src/pages/AreaDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSocketContext } from "../context/SocketContext";
import { getAreaStatus } from "../services/areaService";
import axios from "axios";
import { Plus, Users, Calendar, MapPin } from "lucide-react";

export default function AreaDashboard() {
  const { id } = useParams(); // area slug (like "cs-block")
  const navigate = useNavigate();
  const { socket, joinArea, leaveArea, avatars, moveAvatar } =
    useSocketContext();
  const [status, setStatus] = useState({ events: 0, usersOnline: 0 });
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });

  // Fetch area details including events
  const fetchArea = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/area/${id}`
      );
      setEvents(res.data.events || []);
      setStatus({
        usersOnline: res.data.usersOnline,
        events: res.data.events?.length || 0,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    joinArea(id);
    fetchArea();

    const handleUpdate = ({ areaId }) => {
      if (areaId === id) fetchArea();
    };

    socket?.on("areaStatusUpdate", handleUpdate);
    return () => {
      leaveArea(id);
      socket?.off("areaStatusUpdate", handleUpdate);
    };
  }, [id, socket]);

  // Move avatar inside area
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    moveAvatar(x, y, id);
  };

  // Add event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("nexora_token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/club/${id}/event`,
        newEvent,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send JWT
          },
        }
      );

      setShowAddModal(false);
      setNewEvent({ title: "", description: "" });
      fetchArea();
    } catch (err) {
      console.error(
        "Event creation failed:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6 pt-24">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold capitalize">
            {id.replace("-", " ")}
          </h1>
          <p className="text-sm text-white-600">
            Users online: {status.usersOnline} • Events: {status.events}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm hover:bg-blue-900"
        >
          ← Back to Campus
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Area Info */}
        <motion.div
          layout
          className="rounded-xl border bg-white/80 p-5 shadow-md backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Calendar size={18} /> Current Events
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
            >
              <Plus size={14} /> Add Event
            </button>
          </div>

          {events.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No ongoing events here right now.
            </p>
          ) : (
            <ul className="space-y-3">
              {events.map((ev, i) => (
                <li
                  key={i}
                  className="rounded-lg border p-3 shadow-sm hover:shadow transition bg-white/70"
                >
                  <h3 className="font-medium">{ev.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {ev.description}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2">
              <Users size={18} /> Users Online
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(avatars)
                .filter(([_, a]) => a.areaSlug === id)
                .map(([uid, a]) => (
                  <div
                    key={uid}
                    className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-sm"
                    style={{ backgroundColor: a.color + "20" }}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                    {a.name}
                  </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Right side - Map / Live Avatars */}
        <motion.div
          layout
          className="relative h-[420px] w-full overflow-hidden rounded-xl border bg-slate-100 shadow-md"
          onClick={handleMapClick}
        >
          <img
            src="/campusMap.png"
            alt="Area Map"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          {Object.entries(avatars)
            .filter(([_, a]) => a.areaSlug === id)
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
        </motion.div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin size={18} /> Add Event in {id.replace("-", " ")}
              </h2>
              <form onSubmit={handleAddEvent} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
