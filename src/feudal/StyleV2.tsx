import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {PloughWalk, QuillWrite} from './Anim';
import '../fonts';
import {fonts} from '../styles';
import {ArtSlot, Bg, Defs, imgFile, INK, PAPER, RED, SceneCtx, clamp, ease, FPS} from './Common';

// ESTILO V2 — "Colagem de arquivo": recortes de gravura em papel rasgado, com impressão vermelha desalinhada,
// legendas "FIG.", setas e fio vermelho desenhados à mão, cartão de personagem em círculo vermelho e título com marcador.
// Mantém: papel creme + tinta + vermelho #E5232B, gravura/hachuras, cortes rápidos de arquivo, tipografia do canal.
export const STYLEV2_FRAMES = 9 * FPS;
const T = (f: number, a: number, b: number) => interpolate(f / FPS, [a, b], [0, 1], {...clamp, easing: ease});
const S = (t: number) => Math.round(t * FPS);

export const TornDefs: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <filter id="torn" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="3" seed="11" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="26" />
    </filter>
    <filter id="inkkey" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.06  -0.383 -0.383 -0.383 0 1.03" /></filter>
    <filter id="redprint"><feColorMatrix type="matrix" values="0 0 0 0 0.898  0 0 0 0 0.137  0 0 0 0 0.169  0.9 0.9 0.9 0 -0.2" /></filter>
  </svg>
);

// recorte de gravura: folha rasgada + sombra de impressão vermelha desalinhada + legenda
export type Zoom = {s: number; fx: number; fy: number};
export const Plate: React.FC<{name: string; fig: string; cap: string; tilt?: number; x?: number; y?: number; w?: number; h?: number; at?: number; zoom?: Zoom; bare?: boolean; children?: React.ReactNode}> = ({name, fig, cap, tilt = -2, x = 360, y = 130, w = 1200, h = 760, at = 0, zoom, bare, children}) => {
  const f = useCurrentFrame();
  const p = T(f, at, at + 0.18);
  const sp = spring({frame: f - Math.round(at * FPS), fps: FPS, config: {damping: 11, stiffness: 110, mass: 0.9}});
  const t = f / FPS;
  const z = 1 + t * 0.05;
  const dir = tilt < 0 ? 1 : -1;
  const fl = Math.sin(t * 1.3 + tilt) * 7;
  const offp = 18 + Math.sin(t * 2.2) * 5;
  const alive = name === 'f-quill-hand' ? <QuillWrite w={w - 80} h={h - 80} bare={bare} /> : name === 'f-peasant-plough' ? <PloughWalk w={w - 80} h={h - 80} bare={bare} /> : null;
  return (
    <div style={{position: 'absolute', left: x + (1 - sp) * 380 * dir, top: y + fl, width: w, height: h, transform: `rotate(${tilt + (1 - sp) * 9 * dir + Math.sin(t * 0.9) * 0.5}deg) scale(${(0.9 + sp * 0.1) * z})`, opacity: p}}>
      {!bare && <div style={{position: 'absolute', inset: 0, background: RED, transform: `translate(${offp + 4}px,${offp}px)`, filter: 'url(#torn)'}} />}
      {!bare && <div style={{position: 'absolute', inset: 0, background: '#FBF7EE', filter: 'url(#torn)', boxShadow: '0 20px 50px rgba(0,0,0,.25)'}} />}
      {bare && <div style={{position: 'absolute', left: '12%', right: '12%', bottom: 10, height: 26, borderRadius: '50%', background: 'rgba(26,20,16,0.18)', filter: 'blur(14px)'}} />}
      <div style={{position: 'absolute', inset: bare ? 0 : 40, overflow: bare ? 'visible' : 'hidden'}}>
        {children ? children : alive ? alive : imgFile(name) ? (
          <Img src={staticFile(`feudal/img/${imgFile(name)}`)} style={{width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: bare ? 'normal' : 'multiply', filter: bare ? 'contrast(1.1) grayscale(1) url(#inkkey)' : 'contrast(1.1) grayscale(1)', transform: `translate(${Math.sin(t * 0.5) * 10}px, ${-t * 5}px) scale(${zoom ? zoom.s + t * 0.04 : 1.02 + t * 0.03})`, transformOrigin: zoom ? `${zoom.fx * 100}% ${zoom.fy * 100}%` : '50% 50%'}} />
        ) : (
          <ArtSlot name={name} x={0} y={0} w={w - 80} h={h - 80} at={-9} />
        )}
      </div>
      {zoom && (
        <div style={{position: 'absolute', left: 40 + (w - 80) * zoom.fx - 130, top: 40 + (h - 80) * zoom.fy - 130, width: 260, height: 260, borderRadius: '50%', border: `10px solid ${RED}`, opacity: T(f, 0.3, 0.6), transform: `scale(${1.4 - 0.4 * T(f, 0.3, 0.6)})`}} />
      )}
      {!bare && <div style={{position: 'absolute', left: -34, top: 6, width: 120, height: 38, background: 'rgba(214,196,150,0.82)', transform: 'rotate(-38deg)', boxShadow: '0 2px 4px rgba(0,0,0,.2)'}} />}
      {!bare && <div style={{position: 'absolute', right: -34, top: 6, width: 120, height: 38, background: 'rgba(214,196,150,0.82)', transform: 'rotate(38deg)', boxShadow: '0 2px 4px rgba(0,0,0,.2)'}} />}
      <div style={{position: 'absolute', left: 28, top: -30, background: INK, color: '#fff', fontFamily: fonts.mono, fontSize: 28, letterSpacing: 4, padding: '8px 18px'}}>{fig}</div>
      {cap && <div style={{position: 'absolute', right: 30, bottom: -26, background: RED, color: '#fff', fontFamily: fonts.heading, fontSize: 36, textTransform: 'uppercase', padding: '8px 22px'}}>{cap}</div>}
    </div>
  );
};

const Thread: React.FC<{d: string; at: number; len: number; dur?: number; w?: number}> = ({d, at, len, dur = 0.7, w = 9}) => {
  const f = useCurrentFrame();
  const p = T(f, at, at + dur);
  return <path d={d} fill="none" stroke={RED} strokeWidth={w} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />;
};

const Bust: React.FC = () => (
  <g transform="translate(380 400)">
    <path d="M-190 330 Q-210 80 -60 50 H60 Q210 80 190 330 Z" fill="url(#hDiag)" stroke={INK} strokeWidth="7" />
    <path d="M-40 60 L0 200 L40 60 Z" fill={PAPER} stroke={INK} strokeWidth="5" />
    <ellipse cx="0" cy="-70" rx="80" ry="98" fill={PAPER} stroke={INK} strokeWidth="8" />
    <path d="M-100 -125 H100 M-70 -125 V-215 H70 V-125" fill={INK} stroke={INK} strokeWidth="8" />
    <path d="M-38 -80 h24 M14 -80 h24 M-20 -20 q20 14 40 0" stroke={INK} strokeWidth="6" fill="none" />
  </g>
);

const Card: React.FC<{name: string; role: string}> = ({name, role}) => {
  const f = useCurrentFrame();
  const pop = T(f, 0, 0.35), lab = T(f, 0.3, 0.7);
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <Defs />
        <Thread d="M1760 -10 C1670 110 1540 130 1640 190 C1720 240 1700 130 1630 150 C1540 180 1590 380 1380 480" at={0.4} len={1500} dur={0.9} />
        <Thread d="M20 980 C140 860 250 790 450 700" at={0.8} len={800} />
        <path d="M1380 480 l60 -6 M1380 480 l30 -52" stroke={RED} strokeWidth="9" strokeLinecap="round" opacity={T(f, 1.2, 1.3)} />
      </svg>
      <Plate name="f-stone-tower" fig="FIG. 7" cap="the fort" tilt={-5} x={120} y={170} w={560} h={430} at={0.1} />
      <Plate name="f-windmill" fig="FIG. 8" cap="the mill" tilt={5} x={1250} y={560} w={560} h={430} at={0.25} />
      <div style={{position: 'absolute', left: 1920 / 2 - 330, top: 110, width: 660, height: 660, transform: `scale(${0.75 + pop * 0.25})`, opacity: pop}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: RED}} />
        <svg width="660" height="660" viewBox="0 0 760 760" style={{position: 'absolute', inset: 0}} filter="url(#rough)"><Defs /><Bust /></svg>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center', opacity: lab, transform: `translateY(${(1 - lab) * 20}px)`}}>
        <span style={{display: 'inline-block', width: 34, height: 34, background: RED, marginRight: 20, verticalAlign: 'middle'}} />
        <span style={{fontFamily: fonts.heading, fontSize: 66, color: INK, verticalAlign: 'middle', textTransform: 'uppercase'}}>{name}</span>
        <div style={{fontFamily: fonts.mono, fontSize: 28, letterSpacing: 6, color: '#777', marginTop: 12, textTransform: 'uppercase'}}>{role}</div>
      </div>
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const a = T(f, 0.05, 0.4), b = T(f, 0.2, 0.9), c = T(f, 0.9, 1.3), ci = T(f, 0, 0.3), sq = T(f, 1.2, 1.4);
  const wipe = (p: number) => `inset(-10% ${(1 - p) * 100}% -10% 0)`;
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <Thread d="M300 760 C700 790 1000 730 1620 770" at={1.0} len={1500} dur={0.8} w={12} />
      </svg>
      <div style={{position: 'absolute', left: 190, top: 320, display: 'flex', alignItems: 'flex-end', gap: 24, color: INK, whiteSpace: 'nowrap'}}>
        <div style={{position: 'relative', fontFamily: fonts.heading, lineHeight: 1}}>
          <div style={{position: 'absolute', left: -10, top: 80, width: 300 * ci, height: 300 * ci, borderRadius: '50%', background: RED, transform: `translate(${(1 - ci) * 150}px, ${(1 - ci) * 150}px)`}} />
          <div style={{position: 'relative', fontSize: 74, clipPath: wipe(a), letterSpacing: -3}}>The</div>
          <div style={{position: 'relative', fontSize: 188, letterSpacing: -6, clipPath: wipe(b)}}>NEW LORDS</div>
        </div>
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 56, clipPath: wipe(c), marginBottom: 12}}>of the mill</div>
        <div style={{width: 34, height: 34, background: RED, opacity: sq, marginBottom: 24}} />
      </div>
    </AbsoluteFill>
  );
};

const CUTS: {n: string; fig: string; cap: string; tilt: number}[] = [
  {n: 'f-stone-tower', fig: 'FIG. 1', cap: 'the fort', tilt: -2},
  {n: 'f-windmill', fig: 'FIG. 2', cap: 'the mill', tilt: 2.5},
  {n: 'f-open-hand', fig: 'FIG. 3', cap: 'the toll', tilt: -3},
  {n: 'f-windmill', fig: 'FIG. 4', cap: 'the rent', tilt: 1.5},
  {n: 'f-stone-tower', fig: 'FIG. 5', cap: 'the lord', tilt: 3},
];

export const StyleV2: React.FC = () => (
  <SceneCtx.Provider value={{start: 0}}>
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      {CUTS.map((c, i) => (
        <Sequence key={i} from={S(0.3 + i * 0.4)} durationInFrames={S(0.4)}>
          <Plate name={c.n} fig={c.fig} cap={c.cap} tilt={c.tilt} />
        </Sequence>
      ))}
      <Sequence from={S(2.4)} durationInFrames={S(2.8)}><Bg theme="paper" /><Card name="A lord, c. 900" role="Protector → collector" /></Sequence>
      <Sequence from={S(5.2)} durationInFrames={S(3.8)}><Bg theme="paper" /><Title /></Sequence>
      {CUTS.map((_, i) => <Sequence key={i} from={S(0.3 + i * 0.4)} durationInFrames={FPS} layout="none"><Audio src={staticFile('audio/sfx/paper-flip.wav')} volume={0.45} /></Sequence>)}
      <Sequence from={S(2.4)} layout="none"><Audio src={staticFile('audio/sfx/whoosh-a.wav')} startFrom={8} volume={0.5} /></Sequence>
      <Sequence from={S(3.2)} layout="none"><Audio src={staticFile('audio/sfx/pop2.wav')} volume={0.5} /></Sequence>
      <Sequence from={S(6.4)} layout="none"><Audio src={staticFile('audio/sfx/stamp-real.wav')} volume={0.6} /></Sequence>
    </AbsoluteFill>
  </SceneCtx.Provider>
);
