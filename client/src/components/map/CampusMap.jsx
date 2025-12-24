import React, { useEffect, useMemo, useRef, useState } from "react";
import AreaTooltip from "./AreaTootTip";
import AvatarMarker from "./AvatarMarker";
import { getAreaStatus } from "../../services/areaService";

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

export default function CampusMap({ onAreaClick, userAreaId = "main-entrance" }) {
  const wrapRef = useRef(null);

  const [hover, setHover] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [trails, setTrails] = useState([]);

  /* ---------- campus areas ---------- */
  const areas = useMemo(
    () => [
      { id: "hostels-zone", name: "Hostels Zone", rect: { x: 40, y: 260, w: 260, h: 120 }, center: [170, 320] },
      { id: "sports-complex", name: "Sports Complex", rect: { x: 380, y: 200, w: 130, h: 140 }, center: [445, 270] },
      { id: "cricket-field", name: "Cricket Field", rect: { x: 330, y: 80, w: 230, h: 100 }, center: [445, 130] },
      { id: "cs-block", name: "CS Block", rect: { x: 720, y: 220, w: 110, h: 80 }, center: [775, 260] },
      { id: "mechanical-workshop", name: "Mechanical Workshop", rect: { x: 865, y: 230, w: 140, h: 90 }, center: [935, 275] },
      { id: "library", name: "Library", rect: { x: 700, y: 300, w: 120, h: 60 }, center: [760, 330] },
      { id: "food-court", name: "Food Court", rect: { x: 540, y: 360, w: 120, h: 70 }, center: [600, 395] },
      { id: "main-entrance", name: "Main Entrance", rect: { x: 980, y: 420, w: 120, h: 70 }, center: [1040, 455] },
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
    setTrails((prev) =>
      [...prev, { id: Date.now(), x: Math.random() * 1200, y: Math.random() * 520 }]
        .slice(-20)
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
        ${timeOfDay === "night"
          ? "bg-gradient-to-br from-slate-900 to-slate-800"
          : "bg-gradient-to-br from-slate-50 to-blue-50"}`}
    >
      {/* ---------- INLINE CSS ---------- */}
      <style>{`
        @keyframes pulseSoft {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          70% { box-shadow: 0 0 0 14px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        @keyframes pulseHot {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          70% { box-shadow: 0 0 0 20px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @keyframes wobble {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-0.5deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes trailFade {
          from { opacity: 0.8; }
          to { opacity: 0; }
        }
      `}</style>

      <svg viewBox="0 0 1200 520" className="h-[70vh] w-full">
        {/* avatar motion trails */}
        {trails.map((t) => (
          <circle
            key={t.id}
            cx={t.x}
            cy={t.y}
            r="6"
            fill="#22c55e"
            style={{ animation: "trailFade 1.2s linear" }}
          />
        ))}

        {/* areas */}
        {areas.map((a) => {
          const users = statusMap[a.id]?.usersOnline || 0;
          const events = statusMap[a.id]?.events || 0;

          const pulse =
            users > 12
              ? "pulseHot 1.6s infinite"
              : users > 0
              ? "pulseSoft 2.4s infinite"
              : "none";

          return (
            <g key={a.id}>
              <rect
                x={a.rect.x}
                y={a.rect.y}
                width={a.rect.w}
                height={a.rect.h}
                rx="16"
                fill={timeOfDay === "night" ? "#0f172a" : "#ffffff"}
                stroke={events ? "#f59e0b" : "#2563eb"}
                strokeWidth={events ? 2.6 : 1.4}
                strokeDasharray={events ? "6 4" : "none"}
                style={{
                  animation: `${pulse}${events ? ", wobble 3s infinite" : ""}`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => handleEnter(a, e)}
                onMouseLeave={handleLeave}
                onClick={() => onAreaClick?.(a.id)}
              />

              {/* crowd dots */}
              {Array.from({ length: Math.min(users, 6) }).map((_, i) => (
                <circle
                  key={i}
                  cx={a.center[0] + (i % 3) * 8 - 8}
                  cy={a.center[1] + Math.floor(i / 3) * 8 - 8}
                  r="3"
                  fill="#22c55e"
                />
              ))}

              <text
                x={a.center[0]}
                y={a.center[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  fill: timeOfDay === "night" ? "#e5e7eb" : "#0f172a",
                }}
              >
                {a.name}
              </text>
            </g>
          );
        })}

        <AvatarMarker
          x={areas.find(a => a.id === userAreaId)?.center[0]}
          y={areas.find(a => a.id === userAreaId)?.center[1]}
        />
      </svg>

      <AreaTooltip
        visible={Boolean(hover)}
        x={hover?.x}
        y={hover?.y}
        name={hover?.name}
        status={hover ? statusMap[hover.id] : null}
      />
    </div>
  );
}
