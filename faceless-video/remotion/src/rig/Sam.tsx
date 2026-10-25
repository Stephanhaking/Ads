import React from 'react';

// Vector stickman rig. Units are px in a 1080x1920 frame; (0,0) is the hip. Angles are degrees from "straight down", positive toward +x.
export type Pose = {
  armL: [number, number]; armR: [number, number];   // [upper, lower] angle
  legL: [number, number]; legR: [number, number];
  tilt: number;       // head tilt
  lean: number;       // torso lean
  mouth: number;      // 0 closed .. 1 open
  mood: 'sad' | 'happy' | 'calm';
  blink?: boolean;
};

const INK = '#111';
const W = 16;
const rad = (d: number) => (d * Math.PI) / 180;
const step = (x: number, y: number, a: number, len: number): [number, number] => [x + Math.sin(rad(a)) * len, y + Math.cos(rad(a)) * len];

const Limb: React.FC<{from: [number, number]; a: [number, number]; l1: number; l2: number; hand?: boolean}> = ({from, a, l1, l2, hand}) => {
  const j = step(from[0], from[1], a[0], l1);
  const e = step(j[0], j[1], a[1], l2);
  return (
    <>
      <polyline points={`${from[0]},${from[1]} ${j[0]},${j[1]} ${e[0]},${e[1]}`} fill="none" stroke={INK} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round" />
      {hand && <circle cx={e[0]} cy={e[1]} r={26} fill="#fff" stroke={INK} strokeWidth={W - 4} />}
    </>
  );
};

export const Sam: React.FC<{x: number; y: number; pose: Pose; scale?: number; hat?: string; hat2?: string; pack?: boolean; armOverHead?: boolean; whistle?: boolean}> = ({x, y, pose, scale = 1, hat = '#e8812f', hat2 = '#ee8c3a', pack = true, armOverHead, whistle}) => {
  const neck: [number, number] = [Math.sin(rad(pose.lean)) * -300, -300];
  const shoulder: [number, number] = [Math.sin(rad(pose.lean)) * -270, -270];
  const headC: [number, number] = [neck[0], neck[1] - 125];
  const eyeY = headC[1] + 5;
  const sad = pose.mood === 'sad';
  const mouthPath = sad ? `M -34 52 Q 0 24 34 52` : pose.mood === 'happy' ? `M -38 36 Q 0 78 38 36` : `M -30 44 Q 0 58 30 44`;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* back leg/arm first */}
      <Limb from={[0, 0]} a={pose.legR} l1={210} l2={210} />
      {!armOverHead && <Limb from={shoulder} a={pose.armR} l1={150} l2={150} hand />}
      {/* torso */}
      <line x1={0} y1={0} x2={neck[0]} y2={neck[1]} stroke={INK} strokeWidth={W} strokeLinecap="round" />
      {/* backpack */}
      {pack && <g transform={`rotate(${pose.lean * 0.6} 0 -150)`}>
        <rect x={-30} y={-290} width={150} height={220} rx={40} fill="#58963f" stroke={INK} strokeWidth={W - 4} />
        <rect x={20} y={-150} width={80} height={70} rx={16} fill="#58963f" stroke={INK} strokeWidth={W - 6} />
        <path d="M -10 -290 Q -50 -200 -6 -90" fill="none" stroke={INK} strokeWidth={W - 6} />
      </g>}
      <Limb from={[0, 0]} a={pose.legL} l1={210} l2={210} />
      <Limb from={shoulder} a={pose.armL} l1={150} l2={150} hand />
      {/* head */}
      <g transform={`rotate(${pose.tilt} ${neck[0]} ${neck[1]})`}>
        <circle cx={headC[0]} cy={headC[1]} r={125} fill="#fff" stroke={INK} strokeWidth={W} />
        <g transform={`translate(${headC[0]} ${headC[1]})`}>
          {pose.blink ? (
            <>
              <line x1={-62} y1={5} x2={-28} y2={5} stroke={INK} strokeWidth={8} strokeLinecap="round" />
              <line x1={28} y1={5} x2={62} y2={5} stroke={INK} strokeWidth={8} strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx={-45} cy={5} rx={9} ry={14} fill={INK} />
              <ellipse cx={45} cy={5} rx={9} ry={14} fill={INK} />
            </>
          )}
          <line x1={-70} y1={sad ? -26 : -34} x2={-24} y2={sad ? -40 : -34} stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <line x1={24} y1={sad ? -40 : -34} x2={70} y2={sad ? -26 : -34} stroke={INK} strokeWidth={8} strokeLinecap="round" />
          {pose.mouth > 0.15 ? (
            <ellipse cx={0} cy={48} rx={26} ry={6 + pose.mouth * 22} fill="#5a1a1a" stroke={INK} strokeWidth={6} />
          ) : (
            <path d={mouthPath} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          )}
          {/* beanie */}
          <path d="M -128 -40 Q -140 -150 0 -160 Q 140 -150 128 -40 Q 0 -70 -128 -40 Z" fill={hat} stroke={INK} strokeWidth={W - 4} strokeLinejoin="round" />
          <rect x={-136} y={-62} width={272} height={44} rx={22} fill={hat2} stroke={INK} strokeWidth={W - 4} />
          <circle cx={0} cy={-172} r={26} fill={hat} stroke={INK} strokeWidth={W - 6} />
          {whistle && <rect x={-18} y={34} width={70} height={30} rx={10} fill="#c9ccd1" stroke={INK} strokeWidth={6} />}
        </g>
      </g>
      {armOverHead && <Limb from={shoulder} a={pose.armR} l1={150} l2={150} hand />}
    </g>
  );
};
