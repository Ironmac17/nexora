import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSocketContext } from "../context/SocketContext";
import axios from "axios";
import { Plus, Users, Calendar, MapPin } from "lucide-react";

export default function AreaDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const areaName = id ? id.replace(/-/g, " ") : "Area";

  const { socket, joinArea, leaveArea, avatars, moveAvatar } =
    useSocketContext();

  const [status, setStatus] = useState({ events: 0, usersOnline: 0 });
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchArea = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/area/${id}`
      );

      setEvents(res.data.events || []);
      setStatus({
        usersOnline: res.data.usersOnline || 0,
        events: res.data.events?.length || 0,
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (!id) return;

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

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    moveAvatar(
      e.clientX - rect.left,
      e.clientY - rect.top,
      id
    );
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("nexora_token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/club/${id}/event`,
        newEvent,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setShowAddModal(false);
      setNewEvent({ title: "", description: "" });
      fetchArea();
    } catch (err) {
      console.error("Event creation failed:", err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-24 pb-10">
      
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold capitalize text-white">
            {areaName}
          </h1>

          <div className="mt-3 flex gap-3">
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
              🟢 {status.usersOnline} online
            </span>
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
              📅 {status.events} events
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          ← Back to Campus
        </button>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          layout
          className="lg:col-span-2 relative h-[520px] overflow-hidden rounded-3xl bg-slate-100 shadow-xl"
          onClick={handleMapClick}
        >
          <img
            src="/campusMap.png"
            alt="Area Map"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          {Object.entries(avatars)
            .filter(([_, a]) => a.areaSlug === id)
            .map(([uid, a]) => (
              <motion.div
                key={uid}
                className="absolute flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-lg"
                animate={{ left: a.x, top: a.y }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                style={{ backgroundColor: a.color }}
              >
                {a.name.slice(-2)}
              </motion.div>
            ))}

          {Object.keys(avatars).length <= 1 && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
              Click anywhere to move • Invite others to join this area
            </div>
          )}
        </motion.div>

        <motion.div
          layout
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar size={18} /> Events
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {loadingEvents ? (
            <p className="text-sm text-gray-400">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-gray-500">
              No events right now. Start one?
            </p>
          ) : (
            <ul className="space-y-3">
              {events.map((ev, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-blue-200 bg-blue-50 p-3"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    🔥 {ev.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {ev.description}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
              <Users size={18} /> People here
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
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <MapPin size={18} /> Add Event in {areaName}
              </h2>

              <form onSubmit={handleAddEvent} className="space-y-3">
                <input
                  required
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
                <textarea
                  rows={3}
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-md border px-3 py-1 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {submitting ? "Adding…" : "Add Event"}
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
