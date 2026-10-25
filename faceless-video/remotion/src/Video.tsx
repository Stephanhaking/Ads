import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Word = {w: string; s: number; e: number};
type Layers = {sam?: {neckY: number; headCx: number}; owl?: {cx: number; cy: number}};
type Scene = {index: number; start: number; duration: number; audio: string; image: string; text: string; words: Word[]; layers?: Layers; clip?: string};
export type Timeline = {title: string; fps: number; width: number; height: number; total: number; scenes: Scene[]};

const Captions: React.FC<{words: Word[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const t = frame / fps;
  // show a rolling group of 4 words, highlight the one being spoken
  const cur = Math.max(0, words.findIndex((x) => t >= x.s && t < x.e + 0.05));
  const idx = cur === -1 ? 0 : cur;
  const groupStart = Math.floor(idx / 4) * 4;
  const group = words.slice(groupStart, groupStart + 4);
  return (
    <div style={{position: 'absolute', bottom: height * 0.12, width: '100%', textAlign: 'center', padding: '0 60px', boxSizing: 'border-box'}}>
      {group.map((x, i) => (
        <span key={i} style={{fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 900, fontSize: height > 1500 ? 84 : 64, textTransform: 'uppercase', margin: '0 12px',
          color: groupStart + i === idx ? '#ffd400' : '#fff', WebkitTextStroke: '8px #000', paintOrder: 'stroke fill'}}>
          {x.w}
        </span>
      ))}
    </div>
  );
};

const fill: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'};

// Animated character layers drawn over the full scene image: body breathes, head sways and nods when speaking, owl bobs.
const Characters: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = scene.layers;
  if (!L) return null;
  const pad = String(scene.index).padStart(2, '0');
  const src = (n: string) => staticFile(`build/layers/scene_${pad}_${n}.png`);
  const t = frame / fps;
  const speaking = scene.words.some((w) => t >= w.s && t <= w.e);
  const talk = speaking ? Math.sin(frame * 1.7) : 0;
  const bob = Math.sin(frame / 14) * 5;
  const sway = Math.sin(frame / 23) * 1.6;
  return (
    <AbsoluteFill>
      {L.sam && (
        <>
          <Img src={src('body')} style={{...fill, transform: `translateY(${bob}px) scale(${1 + Math.sin(frame / 14) * 0.004})`, transformOrigin: '50% 100%'}} />
          <Img src={src('head')} style={{...fill, transform: `translateY(${bob + talk * 4}px) rotate(${sway + talk * 1.2}deg)`,
            transformOrigin: `${L.sam.headCx * 100}% ${L.sam.neckY * 100}%`}} />
        </>
      )}
      {L.owl && <Img src={src('owl')} style={{...fill, transform: `translateY(${Math.sin(frame / 9 + 1) * 6}px) rotate(${Math.sin(frame / 17) * 2.5}deg)`,
        transformOrigin: `${L.owl.cx * 100}% ${L.owl.cy * 100}%`}} />}
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = scene.duration * fps;
  const zoom = interpolate(frame, [0, n], [1.0, 1.12], {extrapolateRight: 'clamp'});
  const fade = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        {scene.clip ? (
          <OffthreadVideo src={staticFile(`build/${scene.clip}`)} muted style={fill} />
        ) : (
          <>
            <Img src={staticFile(`build/${scene.image}`)} style={{...fill, transform: `scale(${zoom})`}} />
            <AbsoluteFill style={{transform: `scale(${zoom})`}}><Characters scene={scene} /></AbsoluteFill>
          </>
        )}
      </AbsoluteFill>
      <Audio src={staticFile(`build/${scene.audio}`)} />
      <Captions words={scene.words} />
    </AbsoluteFill>
  );
};

export const Video: React.FC<{timeline: Timeline | null}> = ({timeline}) => {
  if (!timeline) return null;
  const {fps} = timeline;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {timeline.scenes.map((s) => (
        <Sequence key={s.index} from={Math.round(s.start * fps)} durationInFrames={Math.round(s.duration * fps)}>
          <SceneView scene={s} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
