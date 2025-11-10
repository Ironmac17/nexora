// src/components/map/CampusMap.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AreaTooltip from './AreaTootTip';
import AvatarMarker from './AvatarMarker';
import { getAreaStatus } from '../../services/areaService';

// Utility: simple throttle so we don't spam setState on mouse move
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

export default function CampusMap({ onAreaClick, userAreaId = 'main-entrance' }) {
  const wrapRef = useRef(null);
  const [hover, setHover] = useState({ id: null, name: '', x: 0, y: 0 });
  const [status, setStatus] = useState(null);

  // Define areas. You can add more easily.
  const areas = useMemo(
    () => [
      { id: 'hostels-zone', name: 'Hostels Zone', rect: { x: 40, y: 260, w: 260, h: 120 }, center: [170, 320] },
      { id: 'sports-complex', name: 'Sports Complex', rect: { x: 380, y: 200, w: 130, h: 140 }, center: [445, 270] },
      { id: 'cricket-field', name: 'Cricket Field', rect: { x: 330, y: 80, w: 230, h: 100 }, center: [445, 130] },
      { id: 'cs-block', name: 'CS Block', rect: { x: 720, y: 220, w: 110, h: 80 }, center: [775, 260] },
      { id: 'mechanical-workshop', name: 'Mechanical Workshop', rect: { x: 865, y: 230, w: 140, h: 90 }, center: [935, 275] },
      { id: 'library', name: 'Library', rect: { x: 700, y: 300, w: 120, h: 60 }, center: [760, 330] },
      { id: 'food-court', name: 'Food Court', rect: { x: 540, y: 360, w: 120, h: 70 }, center: [600, 395] },
      { id: 'main-entrance', name: 'Main Entrance', rect: { x: 980, y: 420, w: 120, h: 70 }, center: [1040, 455] },
      { id: 'polytechnic-gate', name: 'Polytechnic Gate', rect: { x: 500, y: 20, w: 150, h: 50 }, center: [575, 45] },
      { id: 'tsls-gate', name: 'TSLS Gate', rect: { x: 1080, y: 200, w: 90, h: 60 }, center: [1125, 230] },
    ],
    []
  );

  const userCenter = useMemo(() => {
    const a = areas.find(a => a.id === userAreaId) || areas[0];
    return a.center;
  }, [areas, userAreaId]);

  useEffect(() => {
    // prefetch a few popular statuses
    ['food-court', 'library', 'cs-block'].forEach(getAreaStatus);
  }, []);

  const handleEnter = async (area, evt) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    setHover({ id: area.id, name: area.name, x, y });
    setStatus(await getAreaStatus(area.id));
  };

  const handleMove = throttle((evt) => {
    if (!wrapRef.current || !hover.id) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setHover(h => ({ ...h, x: evt.clientX - rect.left, y: evt.clientY - rect.top }));
  }, 16);

  const handleLeave = () => {
    setHover({ id: null, name: '', x: 0, y: 0 });
    setStatus(null);
  };

  const handleClick = (area) => {
    // send to parent (HomePage) so it can navigate to Area Dashboard
    onAreaClick?.(area);
  };

  return (
    <div ref={wrapRef} onMouseMove={handleMove} className="relative w-full overflow-hidden rounded-2xl border bg-slate-50">
      {/* SVG Canvas */}
      <svg
        viewBox="0 0 1200 520"
        className="h-[70vh] w-full"
        role="img"
        aria-label="Nexora Campus Map"
      >
        {/* background */}
        <rect x="0" y="0" width="1200" height="520" fill="#e8f2ff" />

        {/* greenery strips just for feel */}
        <rect x="300" y="60" width="20" height="420" fill="#cfead6" />
        <rect x="620" y="60" width="20" height="420" fill="#cfead6" />

        {/* Draw each area */}
        {areas.map(a => (
          <g key={a.id}>
            <rect
              x={a.rect.x}
              y={a.rect.y}
              width={a.rect.w}
              height={a.rect.h}
              rx="10"
              ry="10"
              fill="#ffffff"
              stroke="#0f172a"
              className="cursor-pointer transition-all hover:fill-[#eef7ff]"
              onMouseEnter={(e) => handleEnter(a, e)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(a)}
            />
            <text
              x={a.rect.x + a.rect.w / 2}
              y={a.rect.y + a.rect.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="select-none"
              style={{ fontSize: 12, fill: '#0f172a' }}
            >
              {a.name}
            </text>
          </g>
        ))}

        {/* User avatar marker */}
        <AvatarMarker x={userCenter[0]} y={userCenter[1]} />
      </svg>

      {/* Hover tooltip */}
      <AreaTooltip
        x={hover.x}
        y={hover.y}
        name={hover.name}
        status={status}
        visible={Boolean(hover.id)}
      />
    </div>
  );
}
