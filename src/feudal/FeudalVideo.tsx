import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {SCENES} from './script';
import {SceneView} from './Scenes';
import {FPS} from './Common';
import {ESTIMATED, TOTAL, wt} from './words';

export const OUTRO = 3;
export const FEUDAL_FRAMES = Math.ceil((TOTAL + OUTRO) * FPS);
export const starts = SCENES.map((sc, i) => (i === 0 ? 0 : wt(sc.p, sc.o ?? 1)));

// Efeitos: whoosh em cada corte (alternando), + os "fx" de cada cena ancorados às palavras.
const SAMPLES = {
  whooshA: {file: 'whoosh-a', peak: 0.52, vol: 0.45},
  whooshB: {file: 'whoosh-b', peak: 0.54, vol: 0.45},
  stamp: {file: 'stamp-real', peak: 0.2, vol: 0.7},
  impact: {file: 'impact', peak: 0.07, vol: 0.6},
  riser: {file: 'riserhit', peak: 1.81, vol: 0.5},
  pop: {file: 'pop2', peak: 0.03, vol: 0.35},
  tick: {file: 'tick-real', peak: 0.08, vol: 0.5},
  paper: {file: 'paper-flip', peak: 0.3, vol: 0.6},
  heart: {file: 'heart', peak: 0.4, vol: 0.5},
  click: {file: 'click', peak: 0.07, vol: 0.5},
} as const;
type Play = {at: number; k: keyof typeof SAMPLES};
export const plan = (): Play[] => {
  const out: Play[] = [];
  SCENES.forEach((sc, i) => {
    if (i > 0) out.push({at: starts[i] - 0.1, k: i % 2 ? 'whooshA' : 'whooshB'});
    (sc.fx ?? []).forEach((f) => out.push({at: wt(f.p, f.o ?? 1), k: f.s === 'paper' ? 'paper' : f.s}));
  });
  return out;
};

const SFX: React.FC = () => (
  <>
    {plan().map((c, i) => {
      const s = SAMPLES[c.k];
      const t0 = c.at - s.peak;
      const from = Math.max(0, Math.round(t0 * FPS));
      const skip = Math.max(0, Math.round((from / FPS - t0) * FPS));
      return (
        <Sequence key={i} from={from} durationInFrames={Math.round(3.5 * FPS)} layout="none">
          <Audio src={staticFile(`audio/sfx/${s.file}.wav`)} startFrom={skip} volume={s.vol} />
        </Sequence>
      );
    })}
  </>
);

// Música: A (Ticking Shadows, 165 s) → B (distinguish, 84 s, 2×) → A; proporcional à duração total.
const Music: React.FC = () => {
  const A = 'audio/music/ticking-shadows.mp3';
  const B = 'audio/music/distinguish.mp3';
  const segs = [
    {src: A, at: 0, len: Math.min(165, TOTAL * 0.34), from: 0, vol: 0.17},
    {src: B, at: TOTAL * 0.34 - 3, len: 84, from: 0, vol: 0.19},
    {src: B, at: TOTAL * 0.34 + 78, len: 84, from: 0, vol: 0.19},
    {src: A, at: TOTAL * 0.34 + 156, len: TOTAL + OUTRO - (TOTAL * 0.34 + 156), from: 20, vol: 0.14},
  ];
  return (
    <>
      {segs.map((g, i) => {
        const n = Math.round(g.len * FPS);
        const fi = 4 * FPS;
        return (
          <Sequence key={i} from={Math.round(g.at * FPS)} durationInFrames={n} layout="none">
            <Audio src={staticFile(g.src)} startFrom={Math.round(g.from * FPS)} volume={(f) => g.vol * interpolate(f, [0, fi, n - fi, n], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
          </Sequence>
        );
      })}
    </>
  );
};

export const FeudalVideo: React.FC = () => (
  <AbsoluteFill style={{background: '#F2EADB'}}>
    {SCENES.map((sc, i) => {
      const from = Math.round(starts[i] * FPS);
      const end = i + 1 < SCENES.length ? Math.round(starts[i + 1] * FPS) : FEUDAL_FRAMES;
      return (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, end - from)} name={`${i + 1} · ${sc.p.slice(0, 30)}`}>
          <SceneView sc={sc} start={starts[i]} figNo={i + 1} />
        </Sequence>
      );
    })}
    {!ESTIMATED && <Audio src={staticFile('audio/feudal/voice.wav')} />}
    <Music />
    <SFX />
  </AbsoluteFill>
);
