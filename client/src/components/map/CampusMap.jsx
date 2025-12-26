import React, { useEffect, useMemo, useRef, useState } from "react";
import AreaTooltip from "./AreaTootTip";
import AvatarMarker from "./AvatarMarker";
import { getAreaStatus } from "../../services/areaService";
import { motion } from "framer-motion";

/* ---------- helpers ---------- */
const throttle = (fn, wait = 16) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
};

/* subtle audio (no external files) */
const hoverSound = new Audio(
  "data:audio/wav;base64,UklGRlYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUYAAAAA////AAAAAAAAAAAA"
);

export default function CampusMap({
  onAreaClick,
  userAreaId = "main-entrance",
}) {
  const wrapRef = useRef(null);

  const [hover, setHover] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [trails, setTrails] = useState([]);
  const [weather, setWeather] = useState("clear");

  /* ---------- enhanced campus areas with more details ---------- */
  const areas = useMemo(
    () => [
      {
        id: "hostels-zone",
        name: "Hostels Zone",
        rect: { x: 40, y: 260, w: 260, h: 120 },
        center: [170, 320],
        type: "residential",
        icon: "🏢",
        description: "Student residences & dormitories",
      },
      {
        id: "sports-complex",
        name: "Sports Complex",
        rect: { x: 380, y: 200, w: 130, h: 140 },
        center: [445, 270],
        type: "sports",
        icon: "⚽",
        description: "Gym, courts & fitness facilities",
      },
      {
        id: "cricket-field",
        name: "Cricket Field",
        rect: { x: 330, y: 80, w: 230, h: 100 },
        center: [445, 130],
        type: "sports",
        icon: "🏏",
        description: "Main cricket ground & stadium",
      },
      {
        id: "cs-block",
        name: "CS Block",
        rect: { x: 720, y: 220, w: 110, h: 80 },
        center: [775, 260],
        type: "academic",
        icon: "💻",
        description: "Computer Science department",
      },
      {
        id: "mechanical-workshop",
        name: "Mechanical Workshop",
        rect: { x: 865, y: 230, w: 140, h: 90 },
        center: [935, 275],
        type: "academic",
        icon: "🔧",
        description: "Engineering workshops & labs",
      },
      {
        id: "library",
        name: "Library",
        rect: { x: 700, y: 300, w: 120, h: 60 },
        center: [760, 330],
        type: "academic",
        icon: "📚",
        description: "Central library & study areas",
      },
      {
        id: "food-court",
        name: "Food Court",
        rect: { x: 540, y: 360, w: 120, h: 70 },
        center: [600, 395],
        type: "dining",
        icon: "🍽️",
        description: "Cafeteria & food services",
      },
      {
        id: "main-entrance",
        name: "Main Entrance",
        rect: { x: 980, y: 420, w: 120, h: 70 },
        center: [1040, 455],
        type: "entrance",
        icon: "🚪",
        description: "Campus main gate & reception",
      },
    ],
    []
  );

  /* ---------- preload live status ---------- */
  useEffect(() => {
    areas.forEach(async (a) => {
      const s = await getAreaStatus(a.id);
      setStatusMap((prev) => ({ ...prev, [a.id]: s }));
    });
  }, [areas]);

  /* ---------- real time day / night ---------- */
  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 18 || hour < 6 ? "night" : "day");
  }, []);

  /* ---------- avatar trail effect ---------- */
  useEffect(() => {
    const trailId = `${Date.now()}-${Math.random()}`;
    setTrails((prev) =>
      [
        ...prev,
        { id: trailId, x: Math.random() * 1200, y: Math.random() * 520 },
      ].slice(-20)
    );
  }, [userAreaId]);

  const handleEnter = (area, evt) => {
    hoverSound.volume = 0.2;
    hoverSound.play().catch(() => {});
    const rect = wrapRef.current.getBoundingClientRect();
    setHover({
      ...area,
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    });
  };

  const handleMove = throttle((evt) => {
    if (!hover || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setHover((h) => ({
      ...h,
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    }));
  });

  const handleLeave = () => setHover(null);

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      className={`relative w-full overflow-hidden rounded-3xl shadow-2xl
        ${
          timeOfDay === "night"
            ? "bg-gradient-to-br from-slate-900 to-slate-800"
            : "bg-gradient-to-br from-slate-50 to-blue-50"
        }`}
    >
      {/* ---------- Enhanced CSS Animations ---------- */}
      <style>{`
        @keyframes pulseSoft {
          0% { filter: drop-shadow(0 0 0 0 rgba(59,130,246,0.4)); }
          70% { filter: drop-shadow(0 0 0 14px rgba(59,130,246,0)); }
          100% { filter: drop-shadow(0 0 0 0 rgba(59,130,246,0)); }
        }
        @keyframes pulseHot {
          0% { filter: drop-shadow(0 0 0 0 rgba(239,68,68,0.6)); }
          70% { filter: drop-shadow(0 0 0 20px rgba(239,68,68,0)); }
          100% { filter: drop-shadow(0 0 0 0 rgba(239,68,68,0)); }
        }
        @keyframes wobble {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-0.5deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes trailFade {
          from { opacity: 0.8; transform: scale(1); }
          to { opacity: 0; transform: scale(0.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.3)); }
          50% { filter: drop-shadow(0 0 16px rgba(139, 92, 246, 0.6)); }
        }
      `}</style>

      <svg viewBox="0 0 1200 520" className="h-[70vh] w-full">
        {/* Background gradient */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <radialGradient id="areaGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.05)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sky background */}
        <rect width="1200" height="520" fill="url(#skyGradient)" />

        {/* Campus ground */}
        <rect
          x="0"
          y="400"
          width="1200"
          height="120"
          fill="#0f172a"
          opacity="0.8"
        />

        {/* avatar motion trails */}
        {trails.map((t) => (
          <circle
            key={t.id}
            cx={t.x}
            cy={t.y}
            r="8"
            fill="url(#areaGradient)"
            style={{ animation: "trailFade 1.5s ease-out" }}
          />
        ))}

        {/* areas with enhanced visuals */}
        {areas.map((a) => {
          const users = statusMap[a.id]?.usersOnline || 0;
          const events = statusMap[a.id]?.events || 0;

          const getAreaColor = (type) => {
            switch (type) {
              case "academic":
                return { fill: "#1e40af", stroke: "#3b82f6", glow: "#3b82f6" };
              case "sports":
                return { fill: "#166534", stroke: "#22c55e", glow: "#22c55e" };
              case "residential":
                return { fill: "#7c2d12", stroke: "#ea580c", glow: "#ea580c" };
              case "dining":
                return { fill: "#7c3aed", stroke: "#a855f7", glow: "#a855f7" };
              case "entrance":
                return { fill: "#0f172a", stroke: "#f59e0b", glow: "#f59e0b" };
              default:
                return { fill: "#374151", stroke: "#6b7280", glow: "#6b7280" };
            }
          };

          const colors = getAreaColor(a.type);
          const pulse =
            users > 12
              ? "pulseHot 1.6s infinite"
              : users > 0
              ? "pulseSoft 2.4s infinite"
              : "none";
          const isActive = a.id === userAreaId;

          return (
            <g key={a.id}>
              {/* Area shadow/glow */}
              <rect
                x={a.rect.x - 2}
                y={a.rect.y - 2}
                width={a.rect.w + 4}
                height={a.rect.h + 4}
                rx="18"
                fill="none"
                stroke={isActive ? colors.glow : "transparent"}
                strokeWidth="2"
                opacity="0.6"
                style={{
                  animation: isActive ? "glow 2s ease-in-out infinite" : "none",
                }}
              />

              {/* Main area rectangle */}
              <rect
                x={a.rect.x}
                y={a.rect.y}
                width={a.rect.w}
                height={a.rect.h}
                rx="16"
                fill={colors.fill}
                stroke={events ? "#f59e0b" : colors.stroke}
                strokeWidth={events ? 3 : 2}
                strokeDasharray={events ? "8 4" : "none"}
                style={{
                  animation: `${pulse}${events ? ", wobble 3s infinite" : ""}`,
                  cursor: "pointer",
                  filter: isActive ? "brightness(1.2)" : "none",
                }}
                onMouseEnter={(e) => handleEnter(a, e)}
                onMouseLeave={handleLeave}
                onClick={() => onAreaClick?.(a.id)}
              />

              {/* Area type indicator */}
              <circle
                cx={a.rect.x + 20}
                cy={a.rect.y + 20}
                r="8"
                fill={colors.stroke}
                opacity="0.8"
              />
              <text
                x={a.rect.x + 20}
                y={a.rect.y + 25}
                textAnchor="middle"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  fill: "white",
                }}
              >
                {a.icon}
              </text>

              {/* Enhanced crowd visualization */}
              {Array.from({ length: Math.min(users, 8) }).map((_, i) => (
                <g key={i}>
                  <circle
                    cx={a.center[0] + (i % 4) * 12 - 18}
                    cy={a.center[1] + Math.floor(i / 4) * 12 - 12}
                    r="4"
                    fill="#22c55e"
                    style={{ animation: "float 3s ease-in-out infinite" }}
                  />
                  <circle
                    cx={a.center[0] + (i % 4) * 12 - 18}
                    cy={a.center[1] + Math.floor(i / 4) * 12 - 12}
                    r="2"
                    fill="#ffffff"
                    opacity="0.8"
                  />
                </g>
              ))}

              {/* Area name with better typography */}
              <text
                x={a.center[0]}
                y={a.center[1] + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  fill: "#ffffff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                {a.name}
              </text>

              {/* Activity indicator */}
              {(users > 0 || events > 0) && (
                <circle
                  cx={a.rect.x + a.rect.w - 15}
                  cy={a.rect.y + 15}
                  r="6"
                  fill={events > 0 ? "#f59e0b" : "#22c55e"}
                  style={{ animation: "pulseSoft 2s infinite" }}
                />
              )}
            </g>
          );
        })}

        {/* Enhanced user avatar marker */}
        <AvatarMarker
          x={areas.find((a) => a.id === userAreaId)?.center[0]}
          y={areas.find((a) => a.id === userAreaId)?.center[1]}
        />

        {/* Campus paths/roads */}
        <path
          d="M600 520 L600 400 L1040 400 L1040 455"
          stroke="#374151"
          strokeWidth="8"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M600 400 L760 400 L760 330"
          stroke="#374151"
          strokeWidth="6"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M170 320 L600 320"
          stroke="#374151"
          strokeWidth="6"
          fill="none"
          opacity="0.6"
        />
      </svg>

      <AreaTooltip
        visible={Boolean(hover)}
        x={hover?.x}
        y={hover?.y}
        name={hover?.name}
        description={hover?.description}
        status={hover ? statusMap[hover.id] : null}
      />
    </div>
  );
}
