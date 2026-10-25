import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sam, Pose} from './Sam';
import {Forest} from './Forest';
import {Captions} from '../Video';
import type {Timeline} from '../Video';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const scenePose = (kind: string, frame: number, speaking: number): {pose: Pose; x: number; y: number} => {
  const sway = Math.sin(frame / 20);
  const base: Pose = {armL: [8, 4], armR: [-8, -4], legL: [9, 2], legR: [-9, -2], tilt: sway * 2, lean: 0, mouth: speaking, mood: 'calm', blink: frame % 90 < 4};
  if (kind === 'worried') {
    return {x: 540, y: 1150 + Math.sin(frame / 14) * 5, pose: {...base, mood: 'sad', armL: [6 + sway * 5, 2], armR: [-6 - sway * 5, -2], tilt: 4 + sway * 2}};
  }
  // sitting on a log, waving a stop hand
  const wave = Math.sin(frame / 6) * 12;
  return {x: 420, y: 1280 + Math.sin(frame / 14) * 4, pose: {...base, mood: 'happy', legL: [82, 4], legR: [74, 0], armR: [-105 + wave * 0.2, -172 + wave * 1.2], armL: [18, 8], tilt: sway * 3}};
};

const RigScene: React.FC<{scene: Timeline['scenes'][number]; kind: string}> = ({scene, kind}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const inWord = scene.words.some((w) => t >= w.s && t <= w.e);
  const speaking = inWord ? 0.5 + 0.5 * Math.sin(frame * 1.9) : 0;
  const {pose, x, y} = scenePose(kind, frame, speaking);
  const fade = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <Forest frame={frame} />
      {kind === 'log' && (
        <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
          <rect x={60} y={1285} width={960} height={150} rx={60} fill="#7a4a24" stroke="#111" strokeWidth={14} />
          <line x1={120} y1={1345} x2={400} y2={1345} stroke="#111" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
        </svg>
      )}
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <Sam x={x} y={y} pose={pose} scale={1.5} />
      </svg>
      <Audio src={staticFile(`build/${scene.audio}`)} />
      <Captions words={scene.words} />
    </AbsoluteFill>
  );
};

export const RigDemo: React.FC<{timeline: Timeline | null}> = ({timeline}) => {
  if (!timeline) return null;
  const kinds = ['worried', 'log'];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {timeline.scenes.slice(0, 2).map((s, i) => (
        <Sequence key={s.index} from={Math.round(s.start * timeline.fps)} durationInFrames={Math.round(s.duration * timeline.fps)}>
          <RigScene scene={s} kind={kinds[i]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
