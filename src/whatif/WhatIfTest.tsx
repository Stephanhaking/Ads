import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg, FPS, INK, RED, clamp} from '../feudal/Common';
import {TornDefs} from '../feudal/StyleV2';

// Teste de 5 s: personagem desenhada em código (SVG, original) numa cena "a física quebra durante 10 segundos".
const SKIN = '#FBF6EC';
const ei = Easing.inOut(Easing.cubic);
const L = (x1: number, y1: number, x2: number, y2: number, w = 14) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={w} strokeLinecap="round" />
);

export const Hero: React.FC<{t: number}> = ({t}) => {
  const p = interpolate(t, [1.0, 1.5], [0, 1], {...clamp, easing: ei});        // pânico
  const fl = Math.max(0, t - 1.05);                                             // tempo desde a quebra
  const rise = 185 * (1 - Math.exp(-fl * 0.9)) + Math.sin(fl * 2.2) * 10 * Math.min(1, fl); // sobe e flutua
  const rot = Math.sin(fl * 2.6) * 14 * Math.min(1, fl);
  const blink = t < 1.0 && (Math.floor(t * 6) % 9 === 4);
  const armA = (side: number) => (1 - p) * (side * 12) + p * (side * (150 + Math.sin(t * 17 + side) * 22));
  const legA = (side: number) => (1 - p) * (side * 9) + p * (side * (28 + Math.sin(t * 15 + side * 2) * 16));
  const mouth = p;                                                              // 0 = linha, 1 = boca aberta
  const eye = 9 + p * 8;
  const brow = -p * 16;
  const arm = (side: number) => {
    const a = (armA(side) * Math.PI) / 180;
    return L(side * 46, -300, side * 46 + Math.sin(a) * 120, -300 + Math.cos(a) * 120);
  };
  const leg = (side: number) => {
    const a = (legA(side) * Math.PI) / 180;
    return L(side * 22, -170, side * 22 + Math.sin(a) * 175, -170 + Math.cos(a) * 175);
  };
  return (
    <g transform={`translate(960 ${870 - rise}) rotate(${rot})`}>
      {leg(-1)}{leg(1)}
      <rect x={-48} y={-335} width={96} height={170} rx={30} fill="#fff" stroke={INK} strokeWidth={7} />
      <rect x={-48} y={-345} width={96} height={34} rx={14} fill={RED} stroke={INK} strokeWidth={7} />
      {arm(-1)}{arm(1)}
      {/* cabelo */}
      {[-24, 0, 24].map((x, i) => <line key={i} x1={x} y1={-492} x2={x + (i - 1) * 10 + p * (i - 1) * 16} y2={-530 - p * 30} stroke={INK} strokeWidth={7} strokeLinecap="round" />)}
      <circle cx={0} cy={-420} r={80} fill={SKIN} stroke={INK} strokeWidth={7} />
      {/* sobrancelhas */}
      <line x1={-46} y1={-468 + brow} x2={-12} y2={-478 + brow + p * 8} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <line x1={46} y1={-468 + brow} x2={12} y2={-478 + brow + p * 8} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      {/* olhos */}
      {[-28, 28].map((x) => (blink
        ? <line key={x} x1={x - 11} y1={-428} x2={x + 11} y2={-428} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        : <g key={x}><circle cx={x} cy={-428} r={eye + 6} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={x} cy={-428} r={eye * 0.55} fill={INK} /></g>))}
      {/* boca */}
      {mouth < 0.15
        ? <path d="M -22 -380 Q 0 -370 22 -380" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        : <ellipse cx={0} cy={-372} rx={14 + mouth * 14} ry={6 + mouth * 22} fill={INK} />}
    </g>
  );
};

const Mug: React.FC<{x: number; t: number; delay: number; spd: number; r: number}> = ({x, t, delay, spd, r}) => {
  const fl = Math.max(0, t - delay);
  const y = 800 - spd * 2.4 * (1 - Math.exp(-fl * 0.55));
  return (
    <g transform={`translate(${x + Math.sin(fl * 3) * 20 * Math.min(1, fl)} ${y}) rotate(${r * fl * 40})`}>
      <rect x={-34} y={-70} width={68} height={70} rx={8} fill="#fff" stroke={INK} strokeWidth={6} />
      <path d="M 34 -52 q 28 4 22 30 q -4 14 -22 14" fill="none" stroke={INK} strokeWidth={6} />
      <rect x={-34} y={-70} width={68} height={16} rx={6} fill={RED} stroke={INK} strokeWidth={6} />
    </g>
  );
};

export const WhatIfTest: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const shake = t > 1.05 ? Math.sin(f * 2.3) * 3.5 * Math.min(1, (t - 1.05) * 3) : 0;
  const a = interpolate(t, [0.05, 0.35], [0, 1], clamp);
  const b = interpolate(t, [1.0, 1.25], [0, 1], clamp);
  const count = Math.max(0, 10 - Math.max(0, t - 1.05) * 1.0);
  return (
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          {/* chão: parte-se em pedaços que sobem */}
          {t < 1.05
            ? <line x1={0} y1={872} x2={1920} y2={872} stroke={INK} strokeWidth={8} />
            : Array.from({length: 12}).map((_, i) => {
                const fl = t - 1.05;
                const w = 160;
                return <rect key={i} x={i * w + Math.sin(fl * 3 + i) * 10} y={868 - (1 - Math.exp(-fl * 0.6)) * (110 + (i % 5) * 70) - (i % 3) * fl * 6} width={w - 8} height={14} fill={INK} transform={`rotate(${Math.sin(i * 2) * fl * 12} ${i * w + 80} 870)`} />;
              })}
          <Mug x={1500} t={t} delay={1.15} spd={160} r={1} />
          <Mug x={420} t={t} delay={1.35} spd={120} r={-1.3} />
          <Hero t={t} />
        </svg>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 60, fontFamily: fonts.heading, fontSize: 108, lineHeight: 1.05, color: INK, opacity: a * (1 - b), textTransform: 'uppercase'}}>
        What if physics<br /><span style={{background: RED, color: '#fff', padding: '0 18px'}}>broke for 10 s?</span>
      </div>
      <div style={{position: 'absolute', left: 110, top: 60, fontFamily: fonts.heading, fontSize: 130, lineHeight: 1.05, color: INK, opacity: b, textTransform: 'uppercase'}}>
        <span style={{background: RED, color: '#fff', padding: '0 18px'}}>Gravity: off.</span>
      </div>
      <div style={{position: 'absolute', right: 70, top: 60, textAlign: 'right', fontFamily: fonts.mono, color: INK, opacity: b}}>
        <div style={{fontSize: 24, letterSpacing: 6}}><span style={{display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: RED, marginRight: 10, opacity: 0.4 + 0.6 * (Math.floor(t * 3) % 2)}} />SECONDS LEFT</div>
        <div style={{fontSize: 96, letterSpacing: 4}}>{count.toFixed(1)}</div>
      </div>
      <Audio src={staticFile('audio/sfx/whoosh-b.wav')} startFrom={0} volume={(g) => (g > 28 && g < 80 ? 0.35 : 0)} />
    </AbsoluteFill>
  );
};
