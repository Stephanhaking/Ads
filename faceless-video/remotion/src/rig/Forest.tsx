import React from 'react';

const Pine: React.FC<{x: number; y: number; s: number; fill: string}> = ({x, y, s, fill}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <polygon points="0,-420 110,-220 50,-220 140,-60 -140,-60 -50,-220 -110,-220" fill={fill} />
    <rect x={-18} y={-60} width={36} height={80} fill={fill} />
  </g>
);

export const Forest: React.FC<{frame: number}> = ({frame}) => (
  <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3d3a52" />
        <stop offset="0.55" stopColor="#7a5a55" />
        <stop offset="0.8" stopColor="#d9884a" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#sky)" />
    <circle cx={540} cy={1500 + Math.sin(frame / 50) * 4} r={170} fill="#f4a14a" />
    {[80, 300, 780, 1000].map((x, i) => <Pine key={i} x={x} y={1300} s={1.3 + (i % 2) * 0.3} fill="#2b2a3c" />)}
    {[-20, 190, 880, 1090].map((x, i) => <Pine key={i} x={x} y={1560} s={1.6} fill="#1b3a2f" />)}
    <rect y={1500} width={1080} height={420} fill="#16302a" />
  </svg>
);
