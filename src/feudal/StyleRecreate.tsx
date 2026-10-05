import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {ease, clamp, FPS} from './Common';

// Réplica da sequência de referência (7 s): 8 cortes rápidos de imagens de arquivo → cartão da personagem
// (círculo amarelo, etiqueta, setas desenhadas) → título com círculo-marcador e quadrado vermelho.
// Imagens: public/feudal/ref/s1..s8.jpg (arquivo, 16:9) e portrait.png (recorte da personagem; fundo branco é ignorado por multiply).
export const STYLE_FRAMES = 7 * FPS;
const YEL = '#F7D308', DRED = '#9E0F14', INK = '#1b1b1b', PAPER = '#F6F6F4';
const T = (f: number, a: number, b: number) => interpolate(f / FPS, [a, b], [0, 1], {...clamp, easing: ease});
const K = 1920 / 736; // escala da referência (736 px) para 1920

// cortes: [início, fim]
const CUTS: [number, number][] = [[0.35, 0.65], [0.65, 1.0], [1.0, 1.25], [1.25, 1.5], [1.5, 1.75], [1.75, 2.1], [2.1, 2.35], [2.35, 2.6]];
const PORTRAIT: [number, number] = [2.6, 4.65];
const TITLE: [number, number] = [4.65, 7];

const Paper: React.FC = () => (
  <>
    <AbsoluteFill style={{background: PAPER}} />
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.1, mixBlendMode: 'multiply'}}>
      <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" /><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0.7 0" /></filter>
      <rect width="1920" height="1080" filter="url(#g)" />
    </svg>
  </>
);

const Cut: React.FC<{n: number}> = ({n}) => {
  const f = useCurrentFrame();
  const z = 1 + (f / FPS) * 0.12;
  return <AbsoluteFill style={{overflow: 'hidden', background: PAPER}}><Img src={staticFile(`feudal/ref/s${n}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} /></AbsoluteFill>;
};

const Arrow: React.FC<{d: string; head: string; at: number; len: number; dur?: number}> = ({d, head, at, len, dur = 0.6}) => {
  const f = useCurrentFrame();
  const p = T(f, at, at + dur);
  return (
    <g fill="none" stroke={YEL} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <path d={head} opacity={p > 0.9 ? 1 : 0} />
    </g>
  );
};

const Portrait: React.FC<{name: string}> = ({name}) => {
  const f = useCurrentFrame();
  const pop = T(f, 0.0, 0.35);
  const lab = T(f, 0.1, 0.5);
  const cw = 355 * K, ch = 320 * K;
  return (
    <AbsoluteFill>
      <Paper />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <Arrow d="M1740 -10 C1650 120 1560 140 1650 190 C1720 230 1710 130 1640 150 C1560 180 1600 380 1560 470" head="M1560 470 l54 -20 M1560 470 l-22 -58" at={0.55} len={1400} dur={0.8} />
        <Arrow d="M20 1000 C120 850 250 780 330 770" head="M330 770 l-56 -20 M330 770 l-24 56" at={1.0} len={700} dur={0.6} />
      </svg>
      <div style={{position: 'absolute', left: (1920 - cw) / 2, top: 130, width: cw, height: ch, transform: `scale(${0.78 + pop * 0.22})`, mixBlendMode: 'multiply'}}>
        <Img src={staticFile('feudal/ref/portrait.png')} style={{width: '100%', height: '100%', filter: `brightness(${1 + (1 - pop) * 0.6})`, opacity: 0.2 + pop * 0.8}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 960, textAlign: 'center', opacity: lab, transform: `translateY(${(1 - lab) * 20}px)`}}>
        <span style={{display: 'inline-block', width: 34, height: 34, background: DRED, marginRight: 20, verticalAlign: 'middle'}} />
        <span style={{fontFamily: fonts.heading, fontSize: 64, color: INK, verticalAlign: 'middle', letterSpacing: -2}}>{name}</span>
      </div>
    </AbsoluteFill>
  );
};

const Title: React.FC<{a: string; b: string; c: string}> = ({a, b, c}) => {
  const f = useCurrentFrame();
  const pa = T(f, 0.05, 0.35), pb = T(f, 0.2, 1.0), pc = T(f, 1.0, 1.4), sq = T(f, 1.35, 1.5), ci = T(f, 0.0, 0.3);
  const wipe = (p: number) => `inset(-10% ${(1 - p) * 100}% -10% 0)`;
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: 313, top: 400, display: 'flex', alignItems: 'flex-end', gap: 26, color: INK, whiteSpace: 'nowrap'}}>
        <div style={{position: 'relative', fontFamily: fonts.heading, lineHeight: 1}}>
          <div style={{position: 'absolute', left: -8, top: 52, width: 250 * ci, height: 250 * ci, borderRadius: '50%', background: YEL, transform: `translate(${(1 - ci) * 125}px, ${(1 - ci) * 125}px)`}} />
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 14, clipPath: wipe(pa)}}>
            <div style={{width: 34, height: 34, background: '#bbb'}} />
            <div style={{fontSize: 70, letterSpacing: -3}}>{a}</div>
          </div>
          <div style={{position: 'relative', fontSize: 215, marginTop: -6, letterSpacing: -8, clipPath: wipe(pb)}}>{b}</div>
        </div>
        <div style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: 64, letterSpacing: -2, clipPath: wipe(pc), marginBottom: 14}}>{c}</div>
        <div style={{width: 34, height: 34, background: DRED, opacity: sq, marginBottom: 22}} />
      </div>
    </AbsoluteFill>
  );
};

export const StyleRecreate: React.FC<{name?: string; a?: string; b?: string; c?: string}> = ({name = 'Joseph Nicephore', a = 'The First', b = 'CAMERA', c = 'Ever Made'}) => {
  const S = (t: number) => Math.round(t * FPS);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {CUTS.map(([a0, b0], i) => (
        <Sequence key={i} from={S(a0)} durationInFrames={S(b0) - S(a0)}><Cut n={i + 1} /></Sequence>
      ))}
      <Sequence from={S(PORTRAIT[0])} durationInFrames={S(PORTRAIT[1]) - S(PORTRAIT[0])}><Portrait name={name} /></Sequence>
      <Sequence from={S(TITLE[0])} durationInFrames={S(TITLE[1]) - S(TITLE[0])}><Title a={a} b={b} c={c} /></Sequence>
      {CUTS.map(([t0], i) => (
        <Sequence key={'s' + i} from={S(t0)} durationInFrames={FPS} layout="none"><Audio src={staticFile('audio/sfx/click.wav')} volume={0.5} /></Sequence>
      ))}
      <Sequence from={S(2.6)} layout="none"><Audio src={staticFile('audio/sfx/whoosh-a.wav')} startFrom={Math.round(0.3 * FPS)} volume={0.5} /></Sequence>
      <Sequence from={S(3.2)} layout="none"><Audio src={staticFile('audio/sfx/pop2.wav')} volume={0.5} /></Sequence>
      <Sequence from={S(4.6)} layout="none"><Audio src={staticFile('audio/sfx/paper-flip.wav')} volume={0.6} /></Sequence>
      <Sequence from={S(6.2)} layout="none"><Audio src={staticFile('audio/sfx/stamp-real.wav')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
