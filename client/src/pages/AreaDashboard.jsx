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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="text-left">
              <h1 className="text-5xl font-bold capitalize text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text mb-3">
                {areaName}
              </h1>
              <p className="text-gray-400 text-xl">
                Welcome to the virtual campus area
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
              <motion.span
                className="flex items-center gap-2 px-5 py-3 rounded-2xl glass border border-purple-400/30 text-purple-300 font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                👥 {status.usersOnline} online
              </motion.span>
              <motion.span
                className="flex items-center gap-2 px-5 py-3 rounded-2xl glass border border-blue-400/30 text-blue-300 font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                📅 {status.events} events
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Interactive Map Section */}
          <motion.div
            layout
            className="xl:col-span-2 relative h-[700px] overflow-hidden rounded-3xl glass border border-white/20 shadow-2xl"
            onClick={handleMapClick}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(26, 31, 46, 0.9) 0%, rgba(37, 42, 65, 0.9) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Enhanced Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50"></div>
            <img
              src="/campusMap.png"
              alt="Campus Area Map"
              className="absolute inset-0 h-full w-full object-cover opacity-80 filter contrast-110 brightness-90"
            />

            {/* Animated Grid Overlay */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
                animation: "gridMove 20s linear infinite",
              }}
            ></div>

            {/* Glowing Area Boundary */}
            <div className="absolute inset-6 rounded-3xl border-2 border-gradient-to-r from-purple-400/40 to-blue-400/40 shadow-2xl shadow-purple-500/30"></div>

            {/* Enhanced Avatar Markers */}
            {Object.entries(avatars)
              .filter(([, a]) => a.areaSlug === id)
              .map(([uid, a]) => (
                <motion.div
                  key={uid}
                  className="absolute flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white shadow-2xl border-3 border-white/30 cursor-pointer group"
                  animate={{ left: a.x, top: a.y }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${a.color}, ${a.color}dd)`,
                    boxShadow: `0 0 25px ${a.color}70, 0 8px 20px rgba(0,0,0,0.4)`,
                  }}
                  whileHover={{
                    scale: 1.3,
                    boxShadow: `0 0 40px ${a.color}90, 0 12px 30px rgba(0,0,0,0.5)`,
                  }}
                >
                  <span className="drop-shadow-lg text-base">
                    {a.name.slice(-2).toUpperCase()}
                  </span>
                  {/* Enhanced Online Indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {a.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                  </div>
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
                <div className="glass p-8 rounded-3xl text-center max-w-md mx-4 shadow-2xl border border-white/20">
                  <motion.div
                    className="text-4xl mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🗺️
                  </motion.div>
                  <h3 className="text-xl font-bold text-purple-300 mb-3">
                    Navigate the Campus
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Click anywhere on the map to move your avatar and explore the area!
                  </p>
                  <div className="flex justify-center space-x-3">
                    <motion.div
                      className="w-3 h-3 bg-purple-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    ></motion.div>
                    <motion.div
                      className="w-3 h-3 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    ></motion.div>
                    <motion.div
                      className="w-3 h-3 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Map Legend */}
            <motion.div
              className="absolute top-6 left-6 glass p-4 rounded-2xl shadow-xl border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Map Legend
              </h4>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full border-2 border-white/30"></div>
                  <span>Active Users</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online Now</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>Away</span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Area Info */}
            <motion.div
              className="absolute top-6 right-6 glass p-4 rounded-2xl shadow-xl border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-1">
                {areaName}
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  {status.usersOnline} active
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {status.events} events
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar Content */}
          <div className="space-y-8">
            {/* Events Section */}
            <motion.div
              className="glass p-6 rounded-3xl shadow-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Calendar size={20} className="text-purple-400" />
                  </div>
                  Events
                </h2>
                <motion.button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} className="mr-2" /> Add Event
                </motion.button>
              </div>

              {loadingEvents ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  <span className="ml-3 text-gray-400">Loading events...</span>
                </div>
              ) : events.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-gray-400 text-lg mb-2">No events scheduled</p>
                  <p className="text-sm text-gray-500">Be the first to create one!</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {events.map((ev, i) => (
                    <motion.div
                      key={i}
                      className="glass p-5 rounded-2xl border border-white/5 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-purple-300 mb-2 group-hover:text-purple-200 transition-colors">
                            🔥 {ev.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed">
                            {ev.description}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleDeleteEvent(ev._id)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 ml-3 opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Event"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* People Section */}
            <motion.div
              className="glass p-6 rounded-3xl shadow-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="flex items-center gap-3 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-6">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Users size={20} className="text-blue-400" />
                </div>
                People Here
              </h2>

              <div className="flex flex-wrap gap-3">
                {Object.entries(avatars)
                  .filter(([, a]) => a.areaSlug === id)
                  .map(([uid, a]) => (
                    <motion.div
                      key={uid}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl glass border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
                      whileHover={{ scale: 1.05 }}
                      style={{ backgroundColor: a.color + "15" }}
                    >
                      <div
                        className="w-4 h-4 rounded-full shadow-lg border-2 border-white/30"
                        style={{ backgroundColor: a.color }}
                      />
                      <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                        {a.name}
                      </span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1"></div>
                    </motion.div>
                  ))}
              </div>

              {Object.keys(avatars).filter(([, a]) => a.areaSlug === id).length === 0 && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-3xl mb-3">👥</div>
                  <p className="text-gray-400">No one else is here right now</p>
                  <p className="text-sm text-gray-500 mt-1">Be the first!</p>
                </motion.div>
              )}
            </motion.div>

            {/* Notices Section */}
            <motion.div
              className="glass p-6 rounded-3xl shadow-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                  <div className="p-2 bg-green-500/20 rounded-xl">
                    📢
                  </div>
                  Notices
                </h2>
                <motion.button
                  onClick={() => setShowNoticeModal(true)}
                  className="btn-primary px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} className="mr-2" /> Post Notice
                </motion.button>
              </div>

              {notices.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-4xl mb-4">📢</div>
                  <p className="text-gray-400 text-lg mb-2">No notices posted yet</p>
                  <p className="text-sm text-gray-500">Share important updates with everyone!</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {notices.map((notice, i) => (
                    <motion.div
                      key={i}
                      className="glass p-5 rounded-2xl border border-white/5 hover:border-green-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-green-300 mb-2 group-hover:text-green-200 transition-colors">
                            {notice.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed mb-3">
                            {notice.content}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            {new Date(notice.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleDeleteNotice(i)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 ml-3 opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete notice"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
      </div>
    </div>

      <AnimatePresence>
            {showAddModal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  className="w-full max-w-lg glass p-8 rounded-3xl shadow-2xl border border-white/20"
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <MapPin size={24} className="text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                        Add Event
                      </h2>
                      <p className="text-gray-400 text-sm">Create a new event in {areaName}</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddEvent} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Event Title
                      </label>
                      <input
                        required
                        placeholder="Enter event title..."
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, title: e.target.value })
                        }
                        className="input-field w-full text-lg py-4 px-5 rounded-2xl border-2 border-transparent focus:border-purple-400/50 shadow-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe your event..."
                        value={newEvent.description}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            description: e.target.value,
                          })
                        }
                        className="input-field w-full resize-none text-lg py-4 px-5 rounded-2xl border-2 border-transparent focus:border-purple-400/50 shadow-lg"
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-6 py-3 rounded-2xl glass border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {submitting ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Creating...
                          </div>
                        ) : (
                          "Create Event"
                        )}
                      </motion.button>
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
