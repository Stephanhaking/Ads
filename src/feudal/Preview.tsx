import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';

// Pré-visualização do estilo "xilogravura viva" (passado) → fio vermelho → halftone (presente).
// Tudo desenhado em SVG (hachuras, ruído de papel); as imagens geradas por IA substituirão estas formas.
const INK = '#1a1410';
const PAPER = '#F2EADB';
const RED = '#E5232B';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.out(Easing.cubic);

const Defs: React.FC = () => (
  <defs>
    <pattern id="hSky" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 7 H14" stroke={INK} strokeWidth="1.4" opacity="0.5" /></pattern>
    <pattern id="hDiag" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><path d="M0 6 H12" stroke={INK} strokeWidth="2" /></pattern>
    <pattern id="hDiagL" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><path d="M0 8 H16" stroke={INK} strokeWidth="1.6" opacity="0.8" /></pattern>
    <pattern id="hCross" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 H10 M5 0 V10" stroke={INK} strokeWidth="1.6" /></pattern>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" />
      <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.55 0" />
    </filter>
  </defs>
);

const Paper: React.FC = () => (
  <>
    <AbsoluteFill style={{background: PAPER}} />
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.22, mixBlendMode: 'multiply'}}>
      <Defs />
      <rect width="1920" height="1080" filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(60,40,20,0.28) 100%)'}} />
  </>
);

const Caption: React.FC<{lines: string[]; at: number; x?: number; y?: number; size?: number; hot?: string}> = ({lines, at, x = 110, y = 90, size = 92, hot}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: fonts.heading, fontSize: size, lineHeight: 1.02, textTransform: 'uppercase', color: INK}}>
      {lines.map((l, i) => {
        const p = interpolate(f - at - i * 8, [0, 14], [0, 1], {...clamp, easing: ease});
        const isHot = hot === l;
        return (
          <div key={i} style={{overflow: 'hidden', paddingBottom: 10}}>
            <div style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, background: isHot ? RED : 'transparent', color: isHot ? '#fff' : INK, padding: isHot ? '0 16px' : 0}}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};

// ── Cena A: a torre e as invasões ──
const SceneA: React.FC = () => {
  const f = useCurrentFrame();
  const z = 1 + f * 0.0005;
  const t = (k: number) => f * k;
  return (
    <AbsoluteFill>
      <Paper />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, transform: `scale(${z})`}} filter="url(#rough)">
        <Defs />
        {/* céu: linhas finas + sol */}
        <g transform={`translate(${-t(0.15)} 0)`}>
          <rect x="-100" y="0" width="2200" height="520" fill="url(#hSky)" />
          <circle cx="1450" cy="230" r="120" fill={PAPER} stroke={INK} strokeWidth="5" />
          {Array.from({length: 18}).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <path key={i} d={`M${1450 + Math.cos(a) * 140} ${230 + Math.sin(a) * 140} L${1450 + Math.cos(a) * 190} ${230 + Math.sin(a) * 190}`} stroke={INK} strokeWidth="4" />;
          })}
        </g>
        {/* colinas distantes */}
        <g transform={`translate(${-t(0.4)} 0)`}>
          <path d="M-100 560 Q250 430 600 540 T1300 520 T2100 560 V700 H-100 Z" fill="url(#hDiagL)" stroke={INK} strokeWidth="4" />
        </g>
        {/* torre de pedra no monte */}
        <g transform={`translate(${-t(0.7)} 0)`}>
          <path d="M900 760 Q1150 560 1400 700 L1500 1080 H800 Z" fill="url(#hDiag)" stroke={INK} strokeWidth="5" />
          <rect x="1030" y="360" width="190" height="320" fill={PAPER} stroke={INK} strokeWidth="6" />
          {Array.from({length: 6}).map((_, r) => (
            <path key={r} d={`M1030 ${390 + r * 50} H1220`} stroke={INK} strokeWidth="2.5" />
          ))}
          <path d="M1030 360 h30 v-34 h30 v34 h30 v-34 h30 v34 h40" fill="none" stroke={INK} strokeWidth="6" />
          <rect x="1105" y="520" width="40" height="90" rx="20" fill={INK} />
          <path d="M1125 326 V250" stroke={INK} strokeWidth="5" />
          <path d="M1125 250 l70 20 l-70 20 Z" fill={RED} stroke={INK} strokeWidth="3" />
        </g>
        {/* campo em primeiro plano: sulcos */}
        <g transform={`translate(${-t(1.2)} 0)`}>
          <path d="M-200 1080 L-200 800 Q900 720 2300 820 V1080 Z" fill={PAPER} stroke={INK} strokeWidth="5" />
          {Array.from({length: 11}).map((_, i) => (
            <path key={i} d={`M${-100 + i * 220} 1080 Q${300 + i * 90} 940 ${760 + i * 40} 830`} stroke={INK} strokeWidth="3.5" fill="none" />
          ))}
        </g>
        {/* corvos */}
        {[0, 1, 2, 3].map((i) => {
          const x = ((f * (3 + i) + i * 400) % 2300) - 150;
          const y = 180 + i * 70 + Math.sin(f / 9 + i) * 14;
          const flap = Math.sin(f / 3 + i) * 10;
          return <path key={i} d={`M${x} ${y} q18 ${-16 + flap} 36 0 q18 ${-16 + flap} 36 0`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />;
        })}
      </svg>
      <Caption lines={['Século IX.', 'Ninguém ia', 'defendê-lo.']} at={6} hot="defendê-lo." />
    </AbsoluteFill>
  );
};

// ── Cena B: o contrato (o que se entrega) ──
const SceneB: React.FC = () => {
  const f = useCurrentFrame();
  const unroll = interpolate(f, [0, 30], [0, 1], {...clamp, easing: ease});
  const items = ['Trabalho', 'Colheita', 'Liberdade'];
  return (
    <AbsoluteFill>
      <Paper />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}} filter="url(#rough)">
        <Defs />
        <g transform={`translate(0 ${(1 - unroll) * 60})`} opacity={unroll}>
          <rect x="1020" y="150" width="760" height="780" fill="#EADFC6" stroke={INK} strokeWidth="6" />
          <rect x="1000" y="120" width="800" height="48" rx="24" fill="url(#hDiag)" stroke={INK} strokeWidth="5" />
          <rect x="1000" y="910" width="800" height="48" rx="24" fill="url(#hDiag)" stroke={INK} strokeWidth="5" />
          {Array.from({length: 9}).map((_, i) => (
            <path key={i} d={`M1080 ${250 + i * 38} q${160 + (i % 3) * 30} -10 ${300 + (i % 2) * 90} 0`} stroke={INK} strokeWidth="3" fill="none" opacity="0.7" />
          ))}
          <circle cx="1650" cy="850" r="46" fill={RED} stroke={INK} strokeWidth="5" />
          <path d="M1630 850 h40 M1650 830 v40" stroke={PAPER} strokeWidth="5" />
        </g>
      </svg>
      <Caption lines={['O contrato.']} at={4} y={90} size={96} />
      {items.map((it, i) => {
        const at = 26 + i * 34;
        const p = interpolate(f - at, [0, 12], [0, 1], {...clamp, easing: ease});
        const strike = interpolate(f - at - 18, [0, 10], [0, 1], {...clamp, easing: ease});
        return (
          <div key={it} style={{position: 'absolute', left: 120, top: 320 + i * 170, opacity: p, transform: `translateX(${(1 - p) * -80}px)`}}>
            <div style={{position: 'relative', display: 'inline-block', fontFamily: fonts.heading, fontSize: 96, textTransform: 'uppercase', color: INK, padding: '0 14px', background: '#EADFC6', border: `5px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`}}>
              {it}
              <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 12, background: RED, transform: `scaleX(${strike}) rotate(-2deg)`, transformOrigin: 'left'}} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Cena C: o moinho, a renda e a passagem para o presente ──
const SceneC: React.FC = () => {
  const f = useCurrentFrame();
  const spin = f * 3.2;
  const coin = interpolate(f % 40, [0, 40], [0, 1]);
  const thread = interpolate(f, [60, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cut = interpolate(f, [110, 130], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Paper />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 1 - cut}} filter="url(#rough)">
        <Defs />
        <rect x="-100" y="0" width="2200" height="520" fill="url(#hSky)" />
        <path d="M-100 760 Q600 620 1200 740 T2100 700 V1080 H-100 Z" fill="url(#hDiagL)" stroke={INK} strokeWidth="5" />
        <g transform="translate(1250 300)">
          <path d="M-110 560 L-70 0 H70 L110 560 Z" fill={PAPER} stroke={INK} strokeWidth="6" />
          {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${-100 + i * 6} ${80 + i * 70} H${100 - i * 6}`} stroke={INK} strokeWidth="3" />)}
          <rect x="-22" y="400" width="44" height="160" fill={INK} />
          <path d="M-80 0 L0 -90 L80 0 Z" fill="url(#hCross)" stroke={INK} strokeWidth="6" />
          <g transform={`translate(0 -10) rotate(${spin})`}>
            {[0, 90, 180, 270].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path d="M0 0 L0 -330" stroke={INK} strokeWidth="9" />
                <path d="M14 -90 H70 V-320 H14 Z" fill={PAPER} stroke={INK} strokeWidth="5" />
                {[-120, -160, -200, -240, -280].map((y) => <path key={y} d={`M14 ${y} H70`} stroke={INK} strokeWidth="2.5" />)}
              </g>
            ))}
            <circle r="20" fill={INK} />
          </g>
        </g>
        {/* mão estendida e moeda a cair */}
        <g transform="translate(560 800)">
          <path d="M-30 120 q10 -60 70 -70 l40 -10 q40 -70 70 -20 l10 -60 q30 -20 50 20 l10 50 q40 -50 60 -10 q10 40 -30 90 l-20 120 h-220 Z" fill={PAPER} stroke={INK} strokeWidth="6" />
          <path d="M60 70 q50 20 120 0 M80 100 q40 15 100 -2" stroke={INK} strokeWidth="3" fill="none" />
          <circle cx={130} cy={-380 + coin * 400} r="30" fill={RED} stroke={INK} strokeWidth="5" />
          <path d={`M${130 - 10} ${-380 + coin * 400} h20`} stroke={PAPER} strokeWidth="4" />
        </g>
      </svg>
      <Caption lines={['O moinho', 'era dele.']} at={6} hot="era dele." />
      {/* fio vermelho que atravessa o ecrã */}
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <path d="M0 980 C 500 980 700 700 1100 760 S 1500 560 1920 560" stroke={RED} strokeWidth="16" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - thread} />
      </svg>
      {/* presente: foto halftone + botão genérico */}
      <AbsoluteFill style={{opacity: cut, background: '#0b0b0b'}}>
        <Img src={staticFile('google/ht/a3-phone-scroll.png')} style={{position: 'absolute', right: 20, top: 150, height: 760}} />
        <div style={{position: 'absolute', left: 110, top: 260, fontFamily: fonts.heading, fontSize: 96, color: '#fff', textTransform: 'uppercase', lineHeight: 1}}>
          Hoje
          <br />
          <span style={{background: RED, padding: '0 16px'}}>aceitas</span>
          <br />
          com um toque.
        </div>
        <div style={{position: 'absolute', left: 110, top: 700, fontFamily: fonts.heading, fontSize: 60, color: '#fff', background: RED, padding: '14px 50px', borderRadius: 60}}>ACEITAR</div>
        <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
          <path d="M0 980 C 500 980 700 700 1100 760 S 1500 560 1920 560" stroke={RED} strokeWidth="16" fill="none" strokeLinecap="round" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FeudalPreview: React.FC = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <Sequence from={0} durationInFrames={165}><SceneA /></Sequence>
    <Sequence from={165} durationInFrames={165}><SceneB /></Sequence>
    <Sequence from={330} durationInFrames={190}><SceneC /></Sequence>
  </AbsoluteFill>
);
export const FEUDAL_PREVIEW_FRAMES = 520;
