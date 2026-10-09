import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg, FPS, INK, Lines, RED, clamp, ease} from '../feudal/Common';
import {ObjArt} from '../feudal/Collage';
import {TornDefs} from '../feudal/StyleV2';
import words from './words.json';
import {GBEATS, G_END} from './beats';
import type {GBeat} from './beats';

export const G2_TOTAL = (words as {total: number}).total;
export const G2_FRAMES = Math.ceil(G2_TOTAL * FPS) + 30;
const cut = (n: string) => staticFile(`google2/cut/${n}.png`);
const useT = () => useCurrentFrame() / FPS;
const fit = (L: string[], max = 108, w = 860) => Math.min(max, Math.floor(w / (Math.max(...L.flatMap((l) => l.split(' ').map((x) => x.length)), 1) * 0.78)));

// legenda grande à esquerda; linhas entram uma a uma
const Cap: React.FC<{L: string[]; hot?: number[]; w?: number; size?: number; y?: number}> = ({L, hot, w = 880, size, y = 230}) => (
  <Lines lines={L} times={L.map((_, i) => 0.12 + i * 0.28)} x={110} y={y} size={size ?? fit(L, 108, w)} theme="paper" hot={hot ?? []} width={w} />
);

// imagem recortada (alpha) à direita: entra com mola, flutua, sombra
const CutImg: React.FC<{n: string; x?: number; y?: number; w?: number; h?: number}> = ({n, x = 1000, y = 120, w = 860, h = 800}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const sp = spring({frame: f, fps: FPS, config: {damping: 14, stiffness: 190, mass: 0.8}});
  return (
    <div style={{position: 'absolute', left: x + (1 - sp) * 260, top: y + Math.sin(t * 1.3) * 8, width: w, height: h, transform: `rotate(${(1 - sp) * 7 + Math.sin(t * 0.9) * 0.6}deg) scale(${(0.92 + sp * 0.08) * (1 + t * 0.012)})`, opacity: Math.min(1, f / 5)}}>
      <div style={{position: 'absolute', left: '14%', right: '14%', bottom: 4, height: 26, borderRadius: '50%', background: 'rgba(26,20,16,0.18)', filter: 'blur(14px)'}} />
      <Img src={cut(n)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain'}} />
    </div>
  );
};

// cena "câmara fixa, o mundo passa" (corredor a deslizar, chão rasgado, sujeito fixo)
const Chase: React.FC<{n: string}> = ({n}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const ramp = interpolate(t, [0, 1.2], [0, 1], {...clamp, easing: ease});
  const travelled = (t < 1.2 ? 300 * (t * t / 2.4) : 300 * (0.6 + (t - 1.2)));
  const ROAD = 800;
  const bob = Math.sin(t * 8.5) * (n.startsWith('nurse') ? 7 : 3) * ramp;
  const tile = 1145;
  const sub = n.startsWith('nurse') ? {h: 560, x: 780} : n.startsWith('hospital-bed') ? {h: 400, x: 620} : {h: 430, x: 640};
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Img key={i} src={cut('hospital-corridor-wall')} style={{position: 'absolute', left: ((i * tile - travelled * 0.55) % (3 * tile) + 3 * tile) % (3 * tile) - tile, top: ROAD - 560, height: 560, opacity: 0.55}} />
      ))}
      <div style={{position: 'absolute', left: -60, right: -60, top: ROAD, height: 170, background: INK, filter: 'url(#torn)'}} />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 14}).map((_, i) => <rect key={i} x={((i * 190 - travelled) % 2660 + 2660) % 2660 - 200} y={ROAD + 62} width="110" height="9" rx="3" fill="#F2EADB" />)}
      </svg>
      <div style={{position: 'absolute', left: sub.x + (1 - ramp) * -700, top: ROAD - sub.h + 6 + bob}}>
        <div style={{position: 'absolute', left: '10%', right: '10%', bottom: -4, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.3)', filter: 'blur(12px)'}} />
        <Img src={cut(n)} style={{height: sub.h, display: 'block', transform: `rotate(${Math.sin(t * 8.5) * 0.8 * ramp}deg)`}} />
      </div>
    </>
  );
};

const Count: React.FC<{v: number; suf?: string; lab?: string}> = ({v, suf, lab}) => {
  const t = useT();
  const p = interpolate(t, [0, 1.3], [0, 1], {...clamp, easing: ease});
  const val = Math.round(v * p);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: fonts.heading, textTransform: 'uppercase'}}>
      <div style={{fontSize: 300, lineHeight: 1, color: RED, transform: `scale(${0.9 + 0.1 * p})`}}>{val.toLocaleString('en-US')}{suf}</div>
      <div style={{fontSize: 72, color: INK, opacity: interpolate(t, [0.5, 1.0], [0, 1], clamp)}}>{lab}</div>
    </div>
  );
};

const Big: React.FC<{L: string[]; hot?: number[]}> = ({L, hot}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 260}}>
    <Lines lines={L} times={L.map((_, i) => 0.15 + i * 0.35)} x={150} y={0} size={fit(L, 128, 1620)} theme="paper" hot={hot ?? []} width={1620} />
  </div>
);

const Strike: React.FC<{n: string; L: string[]}> = ({n, L}) => {
  const t = useT();
  const s = interpolate(t, [1.4, 2.0], [0, 1], {...clamp, easing: ease});
  return (
    <>
      <div style={{position: 'absolute', left: 110, top: 360, fontFamily: fonts.heading, fontSize: 130, color: INK, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
        {L[0]}
        <div style={{position: 'absolute', left: -10, top: '52%', height: 16, width: `${s * 106}%`, background: RED}} />
      </div>
      <CutImg n={n} x={1040} y={500} w={800} h={330} />
    </>
  );
};

const Stock: React.FC<{n: string}> = ({n}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 980, top: 150, width: 880, height: 600, overflow: 'hidden', opacity: o, boxShadow: '14px 14px 0 #E5232B'}}>
      <OffthreadVideo src={staticFile(`google/stock/s-${n}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.15)'}} />
    </div>
  );
};

const ObjView: React.FC<{n: string}> = ({n}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const p = interpolate(t, [0, 0.45], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: 1030, top: 150, width: 800, height: 740, overflow: 'hidden', opacity: p, mixBlendMode: 'multiply', transform: `translateX(${(1 - p) * 200}px) rotate(${(1 - p) * 7}deg)`}}>
      <div style={{position: 'absolute', left: 80, top: 20, transform: `translateY(${Math.sin(t * 1.4) * 8}px)`}}><ObjArt name={n} size={640} /></div>
    </div>
  );
};

const Beat: React.FC<{b: GBeat}> = ({b}) => (
  <>
    {b.k === 'chase' && <><Chase n={b.n!} /><Cap L={b.L!} hot={b.hot} w={1500} size={b.L!.length > 2 ? 84 : 104} y={60} /></>}
    {b.k === 'img' && <><CutImg n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'obj' && <><ObjView n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'stock' && <><Stock n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'big' && <Big L={b.L!} hot={b.hot} />}
    {b.k === 'count' && <Count v={b.v!} suf={b.suf} lab={b.lab} />}
    {b.k === 'strike' && <Strike n={b.n!} L={b.L!} />}
  </>
);

// contador de leituras: o fio condutor do vídeo (0:00–0:57)
const Counter: React.FC = () => {
  const t = useT();
  const o = interpolate(t, [0.4, 1.0, 55.5, 57.5], [0, 1, 1, 0], clamp);
  const n = Math.floor(Math.pow(t, 1.75) * 3.2);
  return (
    <div style={{position: 'absolute', right: 60, top: 40, opacity: o, textAlign: 'right', fontFamily: fonts.mono, color: INK}}>
      <div style={{fontSize: 22, letterSpacing: 6}}><span style={{display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: RED, marginRight: 10, opacity: 0.4 + 0.6 * (Math.floor(t * 2) % 2)}} />READINGS</div>
      <div style={{fontSize: 64, letterSpacing: 4, marginTop: 4}}>{String(n).padStart(5, '0')}</div>
    </div>
  );
};

export const GoogleV2: React.FC = () => (
  <AbsoluteFill>
    <Bg theme="paper" />
    <TornDefs />
    {GBEATS.map((b, i) => {
      const e = i + 1 < GBEATS.length ? GBEATS[i + 1].s : G_END;
      return (
        <Sequence key={i} from={Math.round(b.s * FPS)} durationInFrames={Math.max(1, Math.round((e - b.s) * FPS))} layout="none">
          <Beat b={b} />
          {(b.k === 'img' || b.k === 'obj') && <Audio src={staticFile('audio/sfx/whoosh-b.wav')} volume={0.18} />}
        </Sequence>
      );
    })}
    <Counter />
    <Audio src={staticFile('audio/google2/voice.wav')} />
    <Audio src={staticFile('audio/music/distinguish.mp3')} volume={(f) => 0.15 * interpolate(f, [0, 90], [0, 1], clamp)} />
  </AbsoluteFill>
);
