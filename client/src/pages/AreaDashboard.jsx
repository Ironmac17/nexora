import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSocketContext } from "../context/SocketContext";
import axios from "axios";
import { Plus, Users, Calendar, MapPin, Trash2 } from "lucide-react";

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
  const [notices, setNotices] = useState([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showDeleteNoticeModal, setShowDeleteNoticeModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  const fetchArea = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/area/${id}`
      );

      setEvents(res.data.events || []);
      setNotices(res.data.notices || []);
      setStatus({
        usersOnline: res.data.usersOnline || 0,
        events: res.data.events?.length || 0,
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingEvents(false);
    }
  }, [id]);

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
  }, [id, socket, joinArea, leaveArea, fetchArea]);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    moveAvatar(e.clientX - rect.left, e.clientY - rect.top, id);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("nexora_token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/area/${id}/event`,
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
      console.error(
        "Event creation failed:",
        err.response?.data || err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.content.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("nexora_token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/area/${id}/notice`,
        newNotice,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setShowNoticeModal(false);
      setNewNotice({ title: "", content: "" });
      fetchArea();
    } catch (err) {
      console.error(
        "Notice posting failed:",
        err.response?.data || err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      const token = localStorage.getItem("nexora_token");

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/area/${id}/event/${eventToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchArea();
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (err) {
      console.error(
        "Event deletion failed:",
        err.response?.data || err.message
      );
    }
  };

  const handleDeleteNotice = (noticeIndex) => {
    setNoticeToDelete(noticeIndex);
    setShowDeleteNoticeModal(true);
  };

  const confirmDeleteNotice = async () => {
    if (noticeToDelete === null) return;

    try {
      const token = localStorage.getItem("nexora_token");

      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/area/${id}/notice/${noticeToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchArea();
      setShowDeleteNoticeModal(false);
      setNoticeToDelete(null);
    } catch (err) {
      console.error(
        "Notice deletion failed:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="mx-auto max-w-7xl p-4 pt-24">
            <div className="mb-10 flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold capitalize text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
                  {areaName}
                </h1>
                <p className="text-gray-400 text-lg">
                  Welcome to the virtual campus area
                </p>
              </div>

              <div className="mt-3 flex gap-3">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300 border border-purple-500/30">
                  👥 {status.usersOnline} online
                </span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300 border border-blue-500/30">
                  📅 {status.events} events
                </span>
              </div>
            </div>

            <motion.button
              onClick={() => navigate("/home")}
              className="btn-primary hover:scale-105 transition-all duration-300 mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Campus Map
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                layout
                className="lg:col-span-2 relative h-[600px] overflow-hidden rounded-3xl glass border border-white/20 shadow-2xl"
                onClick={handleMapClick}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(37, 42, 65, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Map Background with Enhanced Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40"></div>
                <img
                  src="/campusMap.png"
                  alt="Campus Area Map"
                  className="absolute inset-0 h-full w-full object-cover opacity-70 filter contrast-110 brightness-90"
                />

                {/* Grid Overlay for Realism */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                  linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                `,
                    backgroundSize: "50px 50px",
                  }}
                ></div>

                {/* Area Boundary Glow */}
                <div className="absolute inset-4 rounded-2xl border-2 border-purple-400/30 shadow-lg shadow-purple-500/20"></div>

                {/* Enhanced Avatar Markers */}
                {Object.entries(avatars)
                  .filter(([, a]) => a.areaSlug === id)
                  .map(([uid, a]) => (
                    <motion.div
                      key={uid}
                      className="absolute flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-2xl border-2 border-white/20"
                      animate={{ left: a.x, top: a.y }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      style={{
                        background: `linear-gradient(135deg, ${a.color}, ${a.color}dd)`,
                        boxShadow: `0 0 20px ${a.color}60, 0 4px 12px rgba(0,0,0,0.3)`,
                      }}
                      whileHover={{
                        scale: 1.2,
                        boxShadow: `0 0 30px ${a.color}80, 0 6px 20px rgba(0,0,0,0.4)`,
                      }}
                    >
                      <span className="drop-shadow-lg">
                        {a.name.slice(-2).toUpperCase()}
                      </span>
                      {/* Online Indicator */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse"></div>
                    </motion.div>
                  ))}

                {/* Interactive Instructions */}
                {Object.keys(avatars).length <= 1 && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="glass p-6 rounded-2xl text-center max-w-sm mx-4">
                      <div className="text-2xl mb-2">🗺️</div>
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">
                        Navigate the Campus
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Click anywhere on the map to move your avatar • Invite
                        friends to join this area
                      </p>
                      <div className="mt-4 flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Map Legend */}
                <div className="absolute top-4 left-4 glass p-3 rounded-xl">
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">
                    Map Legend
                  </h4>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span>Active Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>

                {/* Area Info */}
                <div className="absolute top-4 right-4 glass p-3 rounded-xl">
                  <h4 className="text-sm font-semibold text-blue-300">
                    {areaName}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {status.usersOnline} active • {status.events} events
                  </p>
                </div>
              </motion.div>

              <div className="space-y-6">
                <div className="card">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-purple-300">
                      <Calendar size={18} /> Events
                    </h2>
                    <motion.button
                      onClick={() => setShowAddModal(true)}
                      className="btn-primary text-xs px-3 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={14} className="mr-1" /> Add
                    </motion.button>
                  </div>

                  {loadingEvents ? (
                    <p className="text-sm text-gray-400">Loading events…</p>
                  ) : events.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No events right now.</p>
                      <p className="text-sm text-gray-500 mt-2">Start one?</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {events.map((ev, i) => (
                        <motion.li
                          key={i}
                          className="card hover:scale-105 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-purple-300">
                                🔥 {ev.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-300">
                                {ev.description}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteEvent(ev._id)}
                              className="text-red-400 hover:text-red-300 p-1 transition-colors ml-2"
                              title="Delete Event"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="card">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-300">
                    <Users size={18} /> People here
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(avatars)
                      .filter(([, a]) => a.areaSlug === id)
                      .map(([uid, a]) => (
                        <div
                          key={uid}
                          className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-sm bg-white/5 border-white/10"
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

                <div className="card">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-green-300">
                      📢 Notices
                    </h2>
                    <motion.button
                      onClick={() => setShowNoticeModal(true)}
                      className="btn-primary text-xs px-3 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={14} className="mr-1" /> Post
                    </motion.button>
                  </div>

                  {notices.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No notices yet.</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Be the first to post a notice!
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {notices.map((notice, i) => (
                        <motion.li
                          key={i}
                          className="card hover:scale-105 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-green-300">
                                {notice.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-300">
                                {notice.content}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(notice.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteNotice(i)}
                              className="text-red-400 hover:text-red-300 transition-colors ml-2"
                              title="Delete notice"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
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
                  className="w-full max-w-md glass p-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-purple-300">
                    <MapPin size={18} /> Add Event in {areaName}
                  </h2>

                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <input
                      required
                      placeholder="Event title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      className="input-field w-full"
                    />
                    <textarea
                      rows={3}
                      placeholder="Description"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      className="input-field w-full resize-none"
                    />

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={submitting}
                        type="submit"
                        className="btn-primary"
                      >
                        {submitting ? "Adding…" : "Add Event"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {showNoticeModal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNoticeModal(false)}
              >
                <motion.div
                  className="glass p-6 rounded-xl max-w-md w-full mx-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-300">
                    📢 Post Notice in {areaName}
                  </h2>
                  <form onSubmit={handleAddNotice} className="space-y-4">
                    <input
                      required
                      placeholder="Notice title"
                      value={newNotice.title}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, title: e.target.value })
                      }
                      className="input-field w-full"
                    />
                    <textarea
                      rows={3}
                      placeholder="Notice content"
                      value={newNotice.content}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, content: e.target.value })
                      }
                      className="input-field w-full resize-none"
                    />

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNoticeModal(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={submitting}
                        type="submit"
                        className="btn-primary"
                      >
                        {submitting ? "Posting…" : "Post Notice"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {showDeleteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass p-6 rounded-xl max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="mb-4 text-lg font-semibold text-red-300">
                    Delete Event
                  </h3>
                  <p className="mb-6 text-gray-300">
                    Are you sure you want to delete this event? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteEvent}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {showDeleteNoticeModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={() => setShowDeleteNoticeModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass p-6 rounded-xl max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="mb-4 text-lg font-semibold text-red-300">
                    Delete Notice
                  </h3>
                  <p className="mb-6 text-gray-300">
                    Are you sure you want to delete this notice? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteNoticeModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteNotice}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
     </div>
  );
}
