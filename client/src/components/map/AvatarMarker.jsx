// src/components/map/AvatarMarker.jsx
import React from 'react';

export default function AvatarMarker({ x, y, size = 18 }) {
  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`} className="drop-shadow">
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill="white" stroke="black" />
      {/* simple person icon */}
      <path
        d={`M ${size/2} ${size*0.35} 
           m -4,0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0
           M ${size/2} ${size*0.45}
           v 3
           m -7 6
           a 1 1 0 0 1 1 -1
           h 12
           a 1 1 0 0 1 1 1`}
        stroke="black"
        fill="none"
        strokeWidth="1"
      />
    </g>
  );
}
