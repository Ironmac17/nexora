// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import CampusMap from "../components/map/CampusMap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Zap, Star } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ areas: 0, users: 0, events: 0 });

  const handleAreaClick = (areaId) => {
    if (!areaId) return;

    localStorage.setItem("nexora:lastArea", areaId);
    navigate(`/area/${areaId}`);
  };

  const lastArea = localStorage.getItem("nexora:lastArea") || "main-entrance";

  // Mock stats - in real app, fetch from API
  useEffect(() => {
    setStats({ areas: 8, users: 156, events: 23 });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="mx-auto max-w-7xl p-4 pt-24">
        {/* Enhanced Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text mb-2">
              Virtual Campus
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Navigate your digital learning space • Connect with peers •
              Discover events
            </p>
          </div>
          <motion.div
            className="text-right glass p-4 rounded-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-xl text-white font-semibold">
              {user?.fullName
                ? `Welcome back, ${user.fullName.split(" ")[0]}!`
                : "Welcome"}
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
              <Star size={14} className="text-yellow-400" />
              Ready to explore
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="glass p-4 rounded-2xl text-center"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <MapPin className="mx-auto mb-2 text-purple-400" size={24} />
            <div className="text-2xl font-bold text-purple-300">
              {stats.areas}
            </div>
            <div className="text-sm text-gray-400">Campus Areas</div>
          </motion.div>
          <motion.div
            className="glass p-4 rounded-2xl text-center"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Users className="mx-auto mb-2 text-blue-400" size={24} />
            <div className="text-2xl font-bold text-blue-300">
              {stats.users}
            </div>
            <div className="text-sm text-gray-400">Active Users</div>
          </motion.div>
          <motion.div
            className="glass p-4 rounded-2xl text-center"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Calendar className="mx-auto mb-2 text-green-400" size={24} />
            <div className="text-2xl font-bold text-green-300">
              {stats.events}
            </div>
            <div className="text-sm text-gray-400">Live Events</div>
          </motion.div>
        </motion.div>

        {/* Enhanced Map Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="glass rounded-3xl p-6 shadow-2xl border border-white/10">
            {/* Map Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Zap className="text-purple-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Campus Navigation
                  </h2>
                  <p className="text-sm text-gray-400">
                    Click on any area to enter
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Campus
              </div>
            </div>

            {/* Map Component */}
            <div className="relative rounded-2xl overflow-hidden border border-white/5">
              <CampusMap onAreaClick={handleAreaClick} userAreaId={lastArea} />
            </div>

            {/* Map Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Your Location
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Active Areas
                </span>
              </div>
              <div className="text-xs">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
