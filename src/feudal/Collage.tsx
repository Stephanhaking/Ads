import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {fonts} from '../styles';
import {Defs, FPS, INK, PAPER, RED, clamp, ease} from './Common';
import type {Theme} from './Common';

// Fundo e objetos de "colagem em movimento" para as cenas que só tinham texto:
// papel com manchas, quadrícula rasgada, tira de jornal, chão em papel rasgado a deslizar, raios e X vermelhos,
// uma palavra gigante por trás e um objeto de gravura desenhado em código que entra e flutua.
const useT = () => useCurrentFrame() / FPS;
const TornDefs2: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <filter id="tornc" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.025 0.05" numOctaves="3" seed="5" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="30" />
    </filter>
    <filter id="blurc"><feGaussianBlur stdDeviation="40" /></filter>
  </svg>
);

const Bolt: React.FC<{x: number; y: number; s?: number; r?: number}> = ({x, y, s = 1, r = 0}) => (
  <svg width="120" height="120" viewBox="0 0 120 120" style={{position: 'absolute', left: x, top: y, transform: `scale(${s}) rotate(${r}deg)`}}>
    <path d="M70 5 L30 60 H58 L40 115 L95 45 H66 Z" fill={INK} stroke={INK} strokeWidth="3" />
    <path d="M70 5 L30 60 H58" fill="none" stroke={RED} strokeWidth="5" />
  </svg>
);

export const CollageBG: React.FC<{theme: Theme; word: string}> = ({theme, word}) => {
  const t = useT();
  const dark = theme === 'dark';
  const slide = interpolate(t, [0, 20], [0, -140], clamp);
  const ink = dark ? '255,255,255' : '26,20,16';
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <TornDefs2 />
      {/* manchas */}
      <div style={{position: 'absolute', left: 900 + slide * 0.4, top: 80, width: 700, height: 300, borderRadius: '50%', background: `rgba(${ink},${dark ? 0.06 : 0.1})`, filter: 'blur(40px)'}} />
      <div style={{position: 'absolute', left: 200 - slide * 0.3, top: 700, width: 800, height: 260, borderRadius: '50%', background: `rgba(${ink},${dark ? 0.05 : 0.08})`, filter: 'blur(40px)'}} />
      {/* palavra gigante */}
      <div style={{position: 'absolute', left: 60 + slide * 0.6, top: 330, whiteSpace: 'nowrap', fontFamily: fonts.heading, fontSize: 470, letterSpacing: -14, textTransform: 'uppercase', transform: 'rotate(-5deg)', color: `rgba(${ink},${dark ? 0.07 : 0.055})`}}>{word}</div>
      {/* quadrícula rasgada */}
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0 H0 V36" fill="none" stroke={`rgba(${ink},0.25)`} strokeWidth="1.5" /></pattern>
        </defs>
        <g filter="url(#tornc)" transform={`translate(${slide * 0.5} 0)`}>
          <path d="M1500 -40 L2000 -40 L2000 520 L1700 560 L1620 380 L1540 200 Z" fill={dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.65)'} />
          <path d="M1500 -40 L2000 -40 L2000 520 L1700 560 L1620 380 L1540 200 Z" fill="url(#grid)" />
        </g>
        <g filter="url(#tornc)" transform={`translate(${slide * 0.8} 0)`}>
          <rect x="-60" y="860" width="900" height="120" fill={dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.8)'} transform="rotate(-2 400 900)" />
          {Array.from({length: 9}).map((_, i) => <rect key={i} x={-30 + i * 98} y={885} width={i % 3 === 2 ? 40 : 82} height="9" fill={`rgba(${ink},0.3)`} transform="rotate(-2 400 900)" />)}
          {Array.from({length: 9}).map((_, i) => <rect key={'b' + i} x={-30 + i * 98} y={915} width={70} height="9" fill={`rgba(${ink},0.2)`} transform="rotate(-2 400 900)" />)}
        </g>
        {/* chão em papel rasgado com traço tracejado a deslizar */}
        {!dark && (
          <g filter="url(#tornc)">
            <rect x="-60" y="1010" width="2040" height="110" fill={INK} />
            <path d="M0 1040 H2000" stroke="#fff" strokeWidth="6" strokeDasharray="60 50" strokeDashoffset={-slide * 2} />
          </g>
        )}
      </svg>
      <Bolt x={1250} y={90} s={0.9} r={-10} />
      <div style={{position: 'absolute', left: 1180 + slide * 0.2, top: 640, fontFamily: fonts.heading, fontSize: 90, color: RED, transform: 'rotate(8deg)', opacity: 0.9}}>×</div>
    </AbsoluteFill>
  );
};

const H = (id: string) => `url(#${id})`;
const OBJS: Record<string, React.FC> = {
  coin: () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i % 2 ? 40 : 0} ${420 - i * 70})`}>
          <ellipse cx="280" cy="90" rx="190" ry="55" fill={INK} /><ellipse cx="280" cy="70" rx="190" ry="55" fill={i === 3 ? RED : PAPER} stroke={INK} strokeWidth="7" />
          <ellipse cx="280" cy="70" rx="130" ry="34" fill="none" stroke={INK} strokeWidth="4" />
        </g>
      ))}
      <ellipse cx="460" cy="560" rx="70" ry="22" fill="rgba(0,0,0,.25)" />
    </g>
  ),
  phone: () => (
    <g transform="rotate(-8 300 300)">
      <rect x="140" y="30" width="320" height="540" rx="46" fill={INK} /><rect x="160" y="70" width="280" height="450" rx="20" fill={PAPER} />
      {[0, 1, 2].map((i) => <rect key={i} x="185" y={110 + i * 55} width={220 - i * 50} height="20" fill={H('hDiag')} stroke={INK} strokeWidth="2" />)}
      <rect x="190" y="400" width="220" height="70" rx="35" fill={RED} /><circle cx="300" cy="545" r="14" fill="#444" />
    </g>
  ),
  lock: () => (
    <g>
      <path d="M170 280 V190 A130 130 0 0 1 430 190 V280" fill="none" stroke={INK} strokeWidth="34" />
      <rect x="110" y="270" width="380" height="290" rx="26" fill={H('hDiag')} stroke={INK} strokeWidth="10" /><rect x="110" y="270" width="380" height="290" rx="26" fill={PAPER} opacity="0.55" />
      <circle cx="300" cy="400" r="40" fill={RED} /><rect x="288" y="420" width="24" height="80" fill={RED} />
    </g>
  ),
  eye: () => (
    <g>
      <path d="M20 300 Q300 90 580 300 Q300 510 20 300 Z" fill={PAPER} stroke={INK} strokeWidth="10" />
      {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${60 + i * 78} ${160 + Math.abs(3 - i) * 22} l${(i - 3) * 6} -46`} stroke={INK} strokeWidth="6" />)}
      <circle cx="300" cy="300" r="105" fill={H('hCross')} stroke={INK} strokeWidth="8" /><circle cx="300" cy="300" r="62" fill={INK} /><circle cx="300" cy="300" r="26" fill={RED} /><circle cx="270" cy="268" r="14" fill="#fff" />
    </g>
  ),
  scale: () => (
    <g>
      <path d="M300 90 V520 M200 520 H400" stroke={INK} strokeWidth="18" />
      <g transform="rotate(-9 300 110)"><path d="M70 110 H530" stroke={INK} strokeWidth="16" />
        <path d="M90 110 L40 280 H140 Z M510 110 L460 280 H560 Z" fill="none" stroke={INK} strokeWidth="6" />
        <path d="M20 280 Q90 340 160 280 Z" fill={RED} stroke={INK} strokeWidth="6" /><path d="M440 280 Q510 340 580 280 Z" fill={H('hDiag')} stroke={INK} strokeWidth="6" /></g>
      <circle cx="300" cy="100" r="26" fill={PAPER} stroke={INK} strokeWidth="8" />
    </g>
  ),
  cloud: () => (
    <g>
      <path d="M130 420 Q40 420 50 330 Q60 250 150 260 Q170 150 290 160 Q390 90 460 190 Q570 190 560 300 Q590 410 480 420 Z" fill={PAPER} stroke={INK} strokeWidth="10" />
      <path d="M130 420 Q40 420 50 330 Q60 250 150 260 Q170 150 290 160" fill="none" stroke={RED} strokeWidth="6" strokeDasharray="14 12" />
      {[150, 250, 350, 450].map((x, i) => <g key={x}><path d={`M${x} 440 V${520 + (i % 2) * 40}`} stroke={INK} strokeWidth="5" strokeDasharray="10 8" /><rect x={x - 22} y={520 + (i % 2) * 40} width="44" height="44" fill={i === 1 ? RED : INK} /></g>)}
    </g>
  ),
  bricks: () => (
    <g>
      {Array.from({length: 7}).map((_, r) => Array.from({length: 4}).map((__, c) => (
        <rect key={r + '-' + c} x={60 + c * 120 + (r % 2 ? -60 : 0)} y={100 + r * 70} width="112" height="62" fill={(r + c) % 5 === 0 ? RED : H('hDiagL')} stroke={INK} strokeWidth="6" />
      )))}
      <path d="M40 90 h60 v-40 h60 v40 h60 v-40 h60 v40 h60 v-40 h60 v40 h60" fill="none" stroke={INK} strokeWidth="8" />
    </g>
  ),
  doc: () => (
    <g transform="rotate(5 300 300)">
      <rect x="110" y="40" width="380" height="520" fill="#FBF7EE" stroke={INK} strokeWidth="9" />
      {Array.from({length: 9}).map((_, i) => <path key={i} d={`M150 ${120 + i * 40} H${i % 3 === 2 ? 340 : 450}`} stroke={INK} strokeWidth="5" />)}
      <circle cx="400" cy="470" r="62" fill="none" stroke={RED} strokeWidth="9" /><path d="M365 470 l26 26 l48 -56" stroke={RED} strokeWidth="11" fill="none" />
    </g>
  ),
  door: () => (
    <g>
      <path d="M110 560 V220 A190 190 0 0 1 490 220 V560 Z" fill={H('hDiagL')} stroke={INK} strokeWidth="12" />
      <path d="M160 540 V230 A140 140 0 0 1 440 230 V540 Z" fill={INK} /><path d="M300 90 V540" stroke={PAPER} strokeWidth="5" />
      <circle cx="355" cy="390" r="18" fill={RED} /><path d="M250 330 H220" stroke={PAPER} strokeWidth="5" />
    </g>
  ),
};
export const OBJ_NAMES = Object.keys(OBJS);

export const Obj: React.FC<{name: string; x?: number; y?: number; s?: number}> = ({name, x = 1030, y = 170, s = 1.35}) => {
  const t = useT();
  const p = interpolate(t, [0.1, 0.7], [0, 1], {...clamp, easing: ease});
  const Art = OBJS[name] ?? OBJS.coin;
  const bob = Math.sin(t * 1.4) * 10;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 600 * s, height: 600 * s, opacity: p, transform: `translateX(${(1 - p) * 220}px) translateY(${bob}px) rotate(${(1 - p) * 8}deg)`}}>
      <svg width={600 * s} height={600 * s} viewBox="0 0 600 600" filter="url(#rough)"><Defs /><Art /></svg>
      <Bolt x={-30} y={-20} s={0.8} r={-15} />
    </div>
  );
};
