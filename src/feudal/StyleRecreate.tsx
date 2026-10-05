import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg, Defs, INK, PAPER, RED, SceneCtx, clamp, ease, FPS} from './Common';

// Recriação, no nosso estilo (papel creme + tinta + vermelho), da sequência de referência de 7 s:
// foto de arquivo → gravura/diagrama → recorte da personagem em círculo + etiqueta + setas desenhadas → título com marcador.
// Todas as "fotos" aceitam um ficheiro real (public/feudal/ref/*.jpg|png); sem ficheiro, usa o desenho de código.
export const STYLE_FRAMES = 7 * FPS;
const T = (f: number, a: number, b: number) => interpolate(f / FPS, [a, b], [0, 1], {...clamp, easing: ease});

const Photo: React.FC<{src?: string; children: React.ReactNode; push?: number}> = ({src, children, push = 0.04}) => {
  const f = useCurrentFrame();
  const z = 1 + (f / FPS) * push;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        {src ? <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.15)', mixBlendMode: 'multiply'}} /> : children}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(60,40,20,0.3) 100%)'}} />
    </AbsoluteFill>
  );
};

const Person: React.FC<{x: number; y: number; s?: number; hat?: boolean}> = ({x, y, s = 1, hat}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="-150" rx="26" ry="30" fill={PAPER} stroke={INK} strokeWidth="5" />
    {hat && <path d="M-34 -166 h68 M-22 -166 v-26 h44 v26" fill={INK} stroke={INK} strokeWidth="5" />}
    <path d="M-50 0 Q-60 -110 -22 -122 H22 Q60 -110 50 0 Z" fill="url(#hDiag)" stroke={INK} strokeWidth="5" />
  </g>
);

// Cena 1 — a câmara gigante empurrada por homens (foto de arquivo)
const Giant: React.FC = () => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" filter="url(#rough)">
    <Defs />
    <rect y="760" width="1920" height="320" fill="url(#hDiagL)" />
    <path d="M0 760 H1920" stroke={INK} strokeWidth="5" />
    <rect x="360" y="190" width="1060" height="470" fill="url(#hSky)" stroke={INK} strokeWidth="8" />
    {Array.from({length: 14}).map((_, i) => <path key={i} d={`M${380 + i * 74} 200 V650`} stroke={INK} strokeWidth="6" />)}
    <rect x="1420" y="330" width="170" height="200" fill={INK} /><rect x="1590" y="360" width="90" height="140" fill="url(#hCross)" stroke={INK} strokeWidth="6" />
    <path d="M300 690 H1500 M440 690 L360 920 M1400 690 L1480 920" stroke={INK} strokeWidth="14" />
    {[470, 600, 740, 880, 1010, 1150, 1290].map((x, i) => <Person key={x} x={x} y={900 + (i % 2) * 20} s={1.15} hat={i % 2 === 0} />)}
  </svg>
);

// Cena 2 — gravura da câmara escura com homem curvado
const Obscura: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" filter="url(#rough)">
      <Defs />
      <rect x="360" y="800" width="1300" height="40" fill={INK} /><path d="M440 840 V1040 M1580 840 V1040" stroke={INK} strokeWidth="18" />
      <path d="M520 360 L1220 360 L1220 800 L520 800 Z" fill="url(#hDiagL)" stroke={INK} strokeWidth="9" />
      <path d="M520 360 L720 250 H1320 L1220 360" fill={PAPER} stroke={INK} strokeWidth="8" />
      <path d="M760 640 L1180 520 L1180 800 L860 800 Z" fill={PAPER} stroke={INK} strokeWidth="6" />
      <circle cx="500" cy="580" r="40" fill={PAPER} stroke={INK} strokeWidth="9" />
      <path d="M0 560 H460 M0 620 H460" stroke={INK} strokeWidth="4" strokeDasharray="14 12" strokeDashoffset={-f * 2} />
      <g transform="translate(1380 470)"><ellipse cx="0" cy="-60" rx="62" ry="72" fill={PAPER} stroke={INK} strokeWidth="7" /><path d="M-130 330 Q-150 40 -50 10 H70 Q170 40 150 330 Z" fill="url(#hDiag)" stroke={INK} strokeWidth="8" /></g>
    </svg>
  );
};

// Setas desenhadas à mão (traço a ser "escrito")
const Arrow: React.FC<{d: string; head: string; at: number; len?: number}> = ({d, head, at, len = 900}) => {
  const f = useCurrentFrame();
  const p = T(f, at, at + 0.7);
  return (
    <g fill="none" stroke={RED} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <path d={head} opacity={p > 0.92 ? 1 : 0} />
    </g>
  );
};

// Cena 3 — recorte da personagem em círculo, etiqueta e setas
const Portrait: React.FC<{name: string; photo?: string}> = ({name, photo}) => {
  const f = useCurrentFrame();
  const pop = T(f, 0.05, 0.55);
  const lab = T(f, 0.7, 1.1);
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <Defs />
        <Arrow d="M1720 -20 C1660 90 1560 110 1590 190 C1620 250 1700 200 1650 140 C1600 80 1480 330 1330 420" head="M1330 420 l62 -8 M1330 420 l24 -58" at={0.5} len={1500} />
        <Arrow d="M40 940 C150 830 270 790 420 690" head="M420 690 l-58 14 M420 690 l8 -60" at={0.9} len={700} />
      </svg>
      <div style={{position: 'absolute', left: 960 - 380, top: 540 - 400 - 20, width: 760, height: 760, transform: `scale(${0.7 + pop * 0.3})`, opacity: pop}}>
        <div style={{position: 'absolute', left: 60, top: 40, width: 640, height: 640, borderRadius: '50%', background: RED}} />
        <svg width="760" height="760" viewBox="0 0 760 760" style={{position: 'absolute', inset: 0}} filter="url(#rough)">
          <Defs />
          <clipPath id="cut"><path d="M0 0 H760 V560 A320 320 0 0 1 60 560 V680 H0 Z M0 0" /></clipPath>
          <g transform="translate(110 310) rotate(-6)"><rect width="190" height="170" fill={PAPER} stroke={INK} strokeWidth="6" /><circle cx="95" cy="90" r="30" fill={INK} /></g>
          <g transform="translate(470 270) rotate(7)"><rect width="190" height="190" fill="url(#hDiagL)" stroke={INK} strokeWidth="6" /><circle cx="160" cy="100" r="34" fill={PAPER} stroke={INK} strokeWidth="6" /></g>
          {photo ? <image href={staticFile(photo)} x="180" y="40" width="400" height="640" preserveAspectRatio="xMidYMax slice" /> : (
            <g transform="translate(380 380)">
              <path d="M-190 300 Q-210 80 -60 50 H60 Q210 80 190 300 Z" fill={INK} />
              <path d="M-40 60 L0 190 L40 60 Z" fill={PAPER} />
              <ellipse cx="0" cy="-70" rx="78" ry="96" fill={PAPER} stroke={INK} strokeWidth="8" />
              <path d="M-100 -120 H100 M-76 -120 V-210 H76 V-120" fill={INK} stroke={INK} strokeWidth="8" />
              <path d="M-38 -80 h24 M14 -80 h24 M-20 -20 q20 14 40 0" stroke={INK} strokeWidth="6" fill="none" />
            </g>
          )}
        </svg>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', opacity: lab, transform: `translateY(${(1 - lab) * 24}px)`}}>
        <span style={{display: 'inline-block', width: 30, height: 30, background: RED, marginRight: 22, verticalAlign: 'middle'}} />
        <span style={{fontFamily: fonts.heading, fontSize: 62, color: INK, verticalAlign: 'middle', letterSpacing: -1}}>{name}</span>
      </div>
    </AbsoluteFill>
  );
};

// Cena 4 — título com círculo-marcador e quadrado vermelho
const Title: React.FC<{a: string; b: string; c: string}> = ({a, b, c}) => {
  const f = useCurrentFrame();
  const w1 = T(f, 0.1, 0.5), w2 = T(f, 0.3, 0.9), w3 = T(f, 0.9, 1.4), sq = T(f, 1.3, 1.5);
  const clip = (p: number) => `inset(-10% ${(1 - p) * 100}% -10% 0)`;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 180, top: 330, display: 'flex', alignItems: 'flex-end', gap: 28, fontFamily: fonts.heading, color: INK, lineHeight: 1}}>
        <div style={{position: 'relative'}}>
          <div style={{position: 'absolute', left: -50, top: 60, width: 300 * w1, height: 300, borderRadius: '50%', background: RED, opacity: 0.95}} />
          <div style={{position: 'relative', fontSize: 80, clipPath: clip(w1), marginBottom: 6, letterSpacing: -2}}>{a}</div>
          <div style={{position: 'relative', fontSize: 270, letterSpacing: -6, clipPath: clip(w2)}}>{b}</div>
        </div>
        <div style={{fontSize: 70, fontFamily: fonts.heading, clipPath: clip(w3), marginBottom: 10, letterSpacing: -1, whiteSpace: 'nowrap'}}>{c}</div>
        <div style={{width: 34, height: 34, background: RED, opacity: sq, marginBottom: 14}} />
      </div>
    </AbsoluteFill>
  );
};

export const StyleRecreate: React.FC<{name?: string; a?: string; b?: string; c?: string}> = ({name = 'Joseph Nicéphore Niépce', a = 'The First', b = 'CAMERA', c = 'Ever Made.'}) => (
  <SceneCtx.Provider value={{start: 0}}>
    <AbsoluteFill>
      <Bg theme="paper" />
      <Sequence from={0} durationInFrames={Math.round(1.5 * FPS)}><Photo><Giant /></Photo></Sequence>
      <Sequence from={Math.round(1.5 * FPS)} durationInFrames={Math.round(1.6 * FPS)}><Photo push={0.06}><Obscura /></Photo></Sequence>
      <Sequence from={Math.round(3.1 * FPS)} durationInFrames={Math.round(2.1 * FPS)}><Portrait name={name} /></Sequence>
      <Sequence from={Math.round(5.2 * FPS)} durationInFrames={Math.round(1.8 * FPS)}><Title a={a} b={b} c={c} /></Sequence>
      {[0, 1.5, 3.1, 5.2].map((t, i) => (
        <Sequence key={i} from={Math.round(t * FPS)} durationInFrames={FPS * 2} layout="none">
          <Audio src={staticFile('audio/sfx/paper-flip.wav')} startFrom={0} volume={i === 0 ? 0 : 0.6} />
        </Sequence>
      ))}
      <Sequence from={Math.round(3.8 * FPS)} layout="none"><Audio src={staticFile('audio/sfx/pop2.wav')} volume={0.5} /></Sequence>
      <Sequence from={Math.round(6.4 * FPS)} layout="none"><Audio src={staticFile('audio/sfx/stamp-real.wav')} volume={0.6} /></Sequence>
    </AbsoluteFill>
  </SceneCtx.Provider>
);
