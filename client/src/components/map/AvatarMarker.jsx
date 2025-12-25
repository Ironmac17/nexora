// src/components/map/AvatarMarker.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AvatarMarker({ x, y, size = 24 }) {
  if (!x || !y) return null;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      transform={`translate(${x - size / 2}, ${y - size / 2})`}
      style={{ filter: "drop-shadow(0 2px 8px rgba(139, 92, 246, 0.4))" }}
    >
      {/* Outer glow ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 + 4}
        fill="none"
        stroke="url(#userGlow)"
        strokeWidth="2"
        opacity="0.6"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main avatar circle with gradient */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2}
        fill="url(#userGradient)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />

      {/* User icon */}
      <g
        transform={`translate(${size * 0.25}, ${size * 0.25}) scale(${
          size / 32
        })`}
      >
        {/* Head */}
        <circle cx="8" cy="6" r="4" fill="#ffffff" />

        {/* Body */}
        <path
          d="M8 10 L8 16 M4 12 L12 12 M4 16 L12 16"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Arms */}
        <path
          d="M4 12 L2 14 M12 12 L14 14"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Active indicator */}
      <motion.circle
        cx={size - 4}
        cy={4}
        r="3"
        fill="#22c55e"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulse effect */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2}
        fill="none"
        stroke="rgba(139, 92, 246, 0.4)"
        strokeWidth="1"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Gradient definitions */}
      <defs>
        <radialGradient id="userGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </radialGradient>
        <radialGradient id="userGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.6)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.2)" />
        </radialGradient>
      </defs>
    </motion.g>
  );
}
