import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sam, Pose} from './Sam';
import {Owl} from './Owl';
import {Forest, Sky} from './Forest';
import {Captions} from '../Video';
import type {Timeline} from '../Video';

const INK = '#111';
type SceneKind = 'worried' | 'log' | 'owl' | 'shelter' | 'whistle' | 'fire' | 'rescue';
export const KINDS: SceneKind[] = ['worried', 'log', 'owl', 'shelter', 'whistle', 'fire', 'rescue'];
const SKY: Record<SceneKind, Sky> = {worried: 'dusk', log: 'dusk', owl: 'dusk', shelter: 'dusk', whistle: 'dusk', fire: 'night', rescue: 'dawn'};

const Log: React.FC<{x?: number}> = ({x = 60}) => (
  <g>
    <rect x={x} y={1285} width={960} height={150} rx={60} fill="#7a4a24" stroke={INK} strokeWidth={14} />
    <line x1={x + 60} y1={1345} x2={x + 340} y2={1345} stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={0.5} />
  </g>
);

const Fire: React.FC<{x: number; y: number; frame: number}> = ({x, y, frame}) => {
  const f = 1 + Math.sin(frame / 3) * 0.08;
  const g = 1 + Math.sin(frame / 2 + 1) * 0.1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`scale(${f} ${g})`}>
        <path d="M 0 0 C -90 -40 -70 -150 -10 -230 C 0 -160 60 -140 70 -60 C 80 -20 40 0 0 0 Z" fill="#f0861a" stroke={INK} strokeWidth={10} />
        <path d="M 0 0 C -40 -20 -30 -80 0 -120 C 20 -80 50 -60 30 -20 Z" fill="#ffd23f" />
      </g>
      <line x1={-110} y1={10} x2={100} y2={-14} stroke="#6b4423" strokeWidth={26} strokeLinecap="round" />
      <line x1={-100} y1={-14} x2={110} y2={10} stroke="#7a4a24" strokeWidth={26} strokeLinecap="round" />
    </g>
  );
};

const base = (frame: number, speaking: number): Pose => ({
  armL: [9, 3], armR: [-9, -3], legL: [9, 2], legR: [-9, -2], tilt: Math.sin(frame / 20) * 2, lean: 0, mouth: speaking, mood: 'calm', blink: frame % 90 < 4,
});
const sit = (p: Pose): Pose => ({...p, legL: [82, 4], legR: [74, 0], armL: [18, 8]});

const RigScene: React.FC<{scene: Timeline['scenes'][number]; kind: SceneKind}> = ({scene, kind}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const speaking = scene.words.some((w) => t >= w.s && t <= w.e) ? 0.5 + 0.5 * Math.sin(frame * 1.9) : 0;
  const sway = Math.sin(frame / 20);
  const b = base(frame, speaking);
  const bob = Math.sin(frame / 14) * 5;
  const fade = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const wave = Math.sin(frame / 6) * 12;
  const sam = (x: number, y: number, pose: Pose, props: object = {}) => <Sam x={x} y={y + bob} pose={pose} scale={1.5} {...props} />;

  let content: React.ReactNode = null;
  if (kind === 'worried') content = sam(540, 1150, {...b, mood: 'sad', armL: [6 + sway * 5, 2], armR: [-6 - sway * 5, -2], tilt: 4 + sway * 2});
  if (kind === 'log') content = (<><Log />{sam(420, 1280, {...sit(b), mood: 'happy', armR: [-105 + wave * 0.2, -172 + wave * 1.2]})}</>);
  if (kind === 'owl') content = (
    <>
      <path d="M 380 420 Q 640 380 1080 420" stroke="#3b2a1d" strokeWidth={26} fill="none" strokeLinecap="round" />
      <Owl x={720} y={410} frame={frame} scale={1.1} tilt={sway * 3} />
      <Log />{sam(420, 1280, {...sit(b), mood: 'calm', tilt: -7 + sway * 2, armL: [18, 8]})}
    </>
  );
  if (kind === 'shelter') {
    const place = Math.sin(frame / 10);
    content = (
      <>
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={820 + i * 28} y1={1500} x2={690 + i * 22} y2={1070 + i * 12} stroke="#6b4423" strokeWidth={22} strokeLinecap="round" />)}
        <rect x={560} y={1440} width={470} height={90} rx={40} fill="#7a4a24" stroke={INK} strokeWidth={12} />
        {sam(330, 1250, {...b, lean: 6, armR: [75 + place * 8, 55 + place * 14], armL: [14, 6], mood: 'happy'})}
      </>
    );
  }
  if (kind === 'whistle') content = (
    <>
      <Owl x={900} y={620} frame={frame} scale={0.9} dark />
      {sam(480, 1150, {...b, armR: [95, -137], armL: [10, 4], mood: 'calm', mouth: 0}, {armOverHead: true, whistle: true})}
      {[0, 1, 2].map((i) => {
        const k = ((frame / 18 + i / 3) % 1);
        return <path key={i} d={`M ${300 - k * 90} ${470 - k * 40} q -30 60 0 120`} stroke={INK} strokeWidth={10} fill="none" opacity={1 - k} strokeLinecap="round" />;
      })}
    </>
  );
  if (kind === 'fire') content = (
    <>
      <Log x={0} />
      {sam(330, 1280, {...sit(b), mood: 'happy', tilt: sway * 2})}
      <Owl x={760} y={1290} frame={frame} scale={0.9} />
      <Fire x={640} y={1560} frame={frame} />
    </>
  );
  if (kind === 'rescue') content = (
    <>
      {[{x: 200, hat: '#f2c42b', hat2: '#f7d34c'}, {x: 430, hat: '#d94a3a', hat2: '#e45b4b'}].map((r, i) => (
        <g key={i}>
          <polygon points={`${r.x + 100},${1200} ${r.x + 420},${1130 + i * 60} ${r.x + 420},${1330 + i * 60}`} fill="#ffe97a" opacity={0.35 + 0.15 * Math.sin(frame / 5)} />
          <Sam x={r.x} y={1300 + Math.sin(frame / 9 + i) * 5} scale={1.2} pack={false} hat={r.hat} hat2={r.hat2}
            pose={{...b, armR: [60, 80], armL: [8, 4], mood: 'happy', legL: [8 + Math.sin(frame / 9 + i) * 6, 0], legR: [-8 - Math.sin(frame / 9 + i) * 6, 0], mouth: 0}} />
        </g>
      ))}
      {sam(830, 1150, {...b, mood: 'happy', armR: [-110 + wave * 0.2, -172 + wave * 1.2]})}
    </>
  );

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <Forest frame={frame} sky={SKY[kind]} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>{content}</svg>
      <Audio src={staticFile(`build/${scene.audio}`)} />
      <Captions words={scene.words} />
    </AbsoluteFill>
  );
};

export const RigVideo: React.FC<{timeline: Timeline | null}> = ({timeline}) => {
  if (!timeline) return null;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {timeline.scenes.map((s, i) => (
        <Sequence key={s.index} from={Math.round(s.start * timeline.fps)} durationInFrames={Math.round(s.duration * timeline.fps)}>
          <RigScene scene={s} kind={KINDS[i] ?? 'worried'} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
