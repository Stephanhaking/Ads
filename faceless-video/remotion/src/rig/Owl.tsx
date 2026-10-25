import React from 'react';

const INK = '#111';

// Small white owl with a brown scarf. (0,0) is its feet.
export const Owl: React.FC<{x: number; y: number; frame: number; scale?: number; tilt?: number; dark?: boolean}> = ({x, y, frame, scale = 1, tilt = 0, dark}) => {
  const blink = frame % 100 < 4;
  const flap = Math.sin(frame / 7) * 6;
  const body = dark ? '#6d5a5a' : '#fff';
  return (
    <g transform={`translate(${x} ${y + Math.sin(frame / 12) * 4}) scale(${scale}) rotate(${tilt + Math.sin(frame / 31) * 5} 0 -80)`}>
      <ellipse cx={0} cy={-80} rx={78} ry={92} fill={body} stroke={INK} strokeWidth={12} />
      <ellipse cx={-70} cy={-70} rx={22} ry={52} fill={body} stroke={INK} strokeWidth={10} transform={`rotate(${15 + flap} -70 -100)`} />
      <ellipse cx={70} cy={-70} rx={22} ry={52} fill={body} stroke={INK} strokeWidth={10} transform={`rotate(${-15 - flap} 70 -100)`} />
      <polygon points="-60,-160 -34,-150 -62,-125" fill={body} stroke={INK} strokeWidth={8} />
      <polygon points="60,-160 34,-150 62,-125" fill={body} stroke={INK} strokeWidth={8} />
      {[-30, 30].map((ex) => (
        <g key={ex}>
          <circle cx={ex} cy={-105} r={30} fill="#fff" stroke={INK} strokeWidth={8} />
          {blink ? <line x1={ex - 14} y1={-105} x2={ex + 14} y2={-105} stroke={INK} strokeWidth={6} /> : <circle cx={ex} cy={-105} r={11} fill={INK} />}
        </g>
      ))}
      <polygon points="-10,-88 10,-88 0,-68" fill="#e8a02f" stroke={INK} strokeWidth={5} />
      <path d="M -62 -52 Q 0 -20 62 -52 L 56 -30 Q 0 0 -56 -30 Z" fill="#8a5a33" stroke={INK} strokeWidth={6} />
      <line x1={-20} y1={0} x2={-20} y2={14} stroke="#e8a02f" strokeWidth={8} /><line x1={20} y1={0} x2={20} y2={14} stroke="#e8a02f" strokeWidth={8} />
    </g>
  );
};
