// src/components/map/AreaTooltip.jsx
import React from 'react';

export default function AreaTooltip({ x, y, name, status, visible }) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-50 rounded-xl border bg-white/90 p-3 text-sm shadow-xl backdrop-blur"
      style={{ left: x + 12, top: y + 12, minWidth: 180 }}
    >
      <div className="font-medium">{name}</div>
      <div className="mt-1 text-xs text-gray-600">
        <div>Events live: <span className="font-semibold">{status?.events ?? '—'}</span></div>
        <div>Users online: <span className="font-semibold">{status?.usersOnline ?? '—'}</span></div>
      </div>
    </div>
  );
}

