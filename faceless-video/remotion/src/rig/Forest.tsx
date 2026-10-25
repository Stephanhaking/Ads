import React from 'react';

export type Sky = 'dusk' | 'night' | 'dawn';

const Pine: React.FC<{x: number; y: number; s: number; fill: string}> = ({x, y, s, fill}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <polygon points="0,-420 110,-220 50,-220 140,-60 -140,-60 -50,-220 -110,-220" fill={fill} />
    <rect x={-18} y={-60} width={36} height={80} fill={fill} />
  </g>
);

const PAL = {
  dusk: {top: '#3d3a52', mid: '#7a5a55', low: '#d9884a', far: '#2b2a3c', near: '#1b3a2f', ground: '#16302a', sun: '#f4a14a'},
  night: {top: '#0b1030', mid: '#141a45', low: '#1d2757', far: '#10153a', near: '#0d2430', ground: '#0c1f26', sun: ''},
  dawn: {top: '#9fc3dd', mid: '#d9e6ee', low: '#f6dca0', far: '#9ab6c9', near: '#6f9a8f', ground: '#7fa88a', sun: '#ffe08a'},
};

export const Forest: React.FC<{frame: number; sky?: Sky}> = ({frame, sky = 'dusk'}) => {
  const c = PAL[sky];
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id={`sky-${sky}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.top} /><stop offset="0.55" stopColor={c.mid} /><stop offset="0.8" stopColor={c.low} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={`url(#sky-${sky})`} />
      {sky === 'night' && Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={(i * 197) % 1080} cy={(i * 331) % 1100} r={3 + (i % 3)} fill="#fff" opacity={0.5 + 0.5 * Math.sin(frame / 12 + i)} />
      ))}
      {c.sun && <circle cx={540} cy={1500 + Math.sin(frame / 50) * 4} r={170} fill={c.sun} />}
      {[80, 300, 780, 1000].map((x, i) => <Pine key={i} x={x} y={1300} s={1.3 + (i % 2) * 0.3} fill={c.far} />)}
      {[-20, 190, 880, 1090].map((x, i) => <Pine key={i} x={x} y={1560} s={1.6} fill={c.near} />)}
      <rect y={1500} width={1080} height={420} fill={c.ground} />
    </svg>
  );
};
