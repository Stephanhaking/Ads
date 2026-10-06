import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {wt} from './words';
import imgs from './imgs.json';
import prompts from './prompts.json';

export const INK = '#1a1410';
export const PAPER = '#F2EADB';
export const RED = '#E5232B';
export const FPS = 30;
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.out(Easing.cubic);

// ── contexto da cena: início absoluto (s), para ancorar tags e linhas às palavras ──
export const SceneCtx = createContext({start: 0});
export const useT = () => useCurrentFrame() / FPS;
export const useAt = () => {
  const {start} = useContext(SceneCtx);
  return (phrase: string, occ = 1, lead = 0.08) => Math.max(0, wt(phrase, occ) - start - lead);
};
export const rev = (t: number, at: number, dur = 0.4) => interpolate(t - at, [0, dur], [0, 1], {...clamp, easing: ease});

export const Defs: React.FC = () => (
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

export type Theme = 'paper' | 'red' | 'dark';
export const Bg: React.FC<{theme?: Theme}> = ({theme = 'paper'}) => {
  if (theme === 'dark') return <DarkBg />;
  return <PaperBg theme={theme} />;
};
const DarkBg: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      <AbsoluteFill style={{background: '#0b0b0b'}} />
      <div style={{position: 'absolute', width: 1000, height: 800, left: 400 + Math.sin(t * 0.4) * 500, top: 100 + Math.cos(t * 0.33) * 200, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(229,35,43,0.16), transparent)'}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1.4px, transparent 1.9px)', backgroundSize: '9px 9px', backgroundPosition: `${(t * 12) % 9}px ${(t * 7) % 9}px`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, transparent ${((t * 9) % 140) - 20}%, rgba(255,255,255,0.045) ${((t * 9) % 140) - 10}%, transparent ${((t * 9) % 140)}%)`}} />
    </>
  );
};
// Fundo vivo: manchas de papel a derivar, grelha de caderno a deslizar, poeira a flutuar, varrimento de luz e grão que muda de quadro a quadro.
const DUST = Array.from({length: 26}, (_, i) => ({x: (i * 379) % 1920, y: (i * 613) % 1080, r: 2 + (i % 4), v: 14 + (i % 5) * 9, ph: i * 1.7}));
const PaperBg: React.FC<{theme: Theme}> = ({theme}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const red = theme === 'red';
  const blob = red ? 'rgba(120,0,10,0.20)' : 'rgba(176,140,86,0.22)';
  const grid = red ? 'rgba(0,0,0,0.10)' : 'rgba(26,20,16,0.07)';
  const sweep = ((t * 0.16) % 1.6) - 0.3;
  return (
    <>
      <AbsoluteFill style={{background: red ? RED : PAPER}} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', width: 900 + i * 260, height: 700 + i * 160, left: 300 + i * 520 + Math.sin(t * 0.35 + i * 2) * 200 - 450, top: 160 + i * 230 + Math.cos(t * 0.3 + i) * 140 - 350, borderRadius: '50%', background: `radial-gradient(closest-side, ${blob}, transparent)`}} />
      ))}
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${grid} 2px, transparent 2px), linear-gradient(90deg, ${grid} 2px, transparent 2px)`, backgroundSize: '96px 96px', backgroundPosition: `${(t * 26) % 96}px ${(t * 14) % 96}px`}} />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.22, mixBlendMode: 'multiply'}}>
        <filter id="grainA" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={1 + (Math.floor(f / 3) % 7)} />
          <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.55 0" />
        </filter>
        <rect width="1920" height="1080" filter="url(#grainA)" />
      </svg>
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        {DUST.map((d, i) => (
          <circle key={i} cx={(d.x + t * d.v + Math.sin(t + d.ph) * 30) % 1960} cy={(d.y - t * d.v * 0.6 + 1080 * 4) % 1080} r={d.r} fill={red ? 'rgba(255,255,255,0.35)' : 'rgba(26,20,16,0.22)'} />
        ))}
      </svg>
      <AbsoluteFill style={{background: `linear-gradient(105deg, transparent ${sweep * 100 - 14}%, rgba(255,255,255,${red ? 0.10 : 0.22}) ${sweep * 100}%, transparent ${sweep * 100 + 14}%)`}} />
      <AbsoluteFill style={{background: red ? 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(80,0,0,0.35) 100%)' : 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(60,40,20,0.28) 100%)'}} />
    </>
  );
};
export const fg = (theme?: Theme) => (theme === 'paper' || !theme ? INK : '#fff');

// linhas de texto que sobem de uma máscara, cada uma no seu instante (s locais)
export const Lines: React.FC<{lines: string[]; times: number[]; x: number; y: number; size: number; theme?: Theme; hot?: number[]; width?: number}> = ({lines, times, x, y, size, theme, hot = [], width}) => {
  const t = useT();
  return (
    <div style={{position: 'absolute', left: x, top: y, width, fontFamily: fonts.heading, fontSize: size, lineHeight: 1.04, textTransform: 'uppercase', color: fg(theme)}}>
      {lines.map((l, i) => {
        const p = rev(t, times[i] ?? times[times.length - 1] ?? 0, 0.4);
        const isHot = hot.includes(i);
        return (
          <div key={i} style={{overflow: 'hidden', paddingBottom: size * 0.12}}>
            <div style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, background: isHot ? (theme === 'red' ? '#111' : RED) : 'transparent', color: isHot ? '#fff' : fg(theme), padding: isHot ? `0 ${size * 0.16}px` : 0}}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Tag: React.FC<{text: string; at: number; x: number; y: number; fill?: boolean; size?: number; theme?: Theme}> = ({text, at, x, y, fill, size = 40, theme}) => {
  const t = useT();
  const p = rev(t, at, 0.3);
  const dark = theme === 'dark';
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{display: 'inline-block', fontFamily: fonts.heading, fontSize: size, textTransform: 'uppercase', letterSpacing: 1, padding: `${size * 0.14}px ${size * 0.4}px`, background: fill ? RED : dark ? '#fff' : INK, color: fill ? '#fff' : dark ? INK : '#fff', boxShadow: `${size * 0.1}px ${size * 0.1}px 0 ${fill ? INK : RED}`}}>{text}</div>
    </div>
  );
};

export const Panel: React.FC<{x: number; y: number; w: number; h?: number; at: number; tilt?: number; children: React.ReactNode; bg?: string; pad?: number}> = ({x, y, w, h, at, tilt = 0, children, bg = '#fff', pad = 34}) => {
  const t = useT();
  const p = rev(t, at, 0.45);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: p, transform: `translateY(${(1 - p) * 50}px) rotate(${tilt}deg)`, background: bg, borderRadius: 18, boxShadow: '0 24px 60px rgba(0,0,0,0.32)', padding: pad, boxSizing: 'border-box', color: INK}}>{children}</div>
  );
};
export const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 22, color = '#80868B'}) => (
  <div style={{fontFamily: fonts.mono, fontSize: size, letterSpacing: 4, color, textTransform: 'uppercase'}}>{children}</div>
);

// ── imagem gerada (multiply sobre o papel) ou marcador com o prompt em falta ──
const HAVE = imgs as string[];
export const imgFile = (name: string) => HAVE.find((f) => f.startsWith(name + '.'));
export const hasImage = (name: string) => HAVE.some((f) => f.startsWith(name + '.'));
export const ArtSlot: React.FC<{name: string; x: number; y: number; w: number; h: number; at?: number; tilt?: number; dark?: boolean}> = ({name, x, y, w, h, at = 0, tilt = 0, dark}) => {
  const t = useT();
  const p = rev(t, at, 0.6);
  const file = HAVE.find((f) => f.startsWith(name + '.'));
  const zoom = 1 + t * 0.012;
  const drift = t * 4;
  const DrawnArt = DRAWN[name];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: p, transform: `translateX(${(1 - p) * 60}px) rotate(${tilt}deg)`, overflow: 'hidden'}}>
      {file ? (
        <Img src={staticFile(`feudal/img/${file}`)} style={{width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: dark ? 'screen' : 'multiply', filter: 'contrast(1.12) grayscale(1)', transform: `scale(${zoom}) translateX(${-drift}px)`}} />
      ) : DrawnArt ? (
        <svg width={w} height={h} viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" filter="url(#rough)"><Defs /><g transform={`translate(${-drift} 0)`}><DrawnArt /></g></svg>
      ) : (
        <div style={{width: '100%', height: '100%', border: `5px dashed ${dark ? '#888' : INK}`, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,20,16,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 40, boxSizing: 'border-box', textAlign: 'center'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 24, letterSpacing: 4, color: RED}}>IMAGEM A GERAR</div>
          <div style={{fontFamily: fonts.heading, fontSize: 52, color: dark ? '#fff' : INK, margin: '14px 0', textTransform: 'uppercase'}}>{name}</div>
          <div style={{fontFamily: 'Georgia, serif', fontSize: 25, lineHeight: 1.3, color: dark ? '#bbb' : '#555'}}>{(prompts as Record<string, string>)[name] ?? ''}</div>
        </div>
      )}
    </div>
  );
};

// ── desenhos de código (substituídos pelas imagens quando existirem) ──
const Tower: React.FC = () => (
  <g>
    <rect x="-100" y="0" width="1300" height="400" fill="url(#hSky)" />
    <circle cx="800" cy="170" r="90" fill={PAPER} stroke={INK} strokeWidth="5" />
    <path d="M-100 560 Q250 430 600 520 T1200 540 V800 H-100 Z" fill="url(#hDiagL)" stroke={INK} strokeWidth="4" />
    <path d="M250 800 Q450 520 700 640 L800 800 Z" fill="url(#hDiag)" stroke={INK} strokeWidth="5" />
    <rect x="380" y="220" width="190" height="320" fill={PAPER} stroke={INK} strokeWidth="6" />
    {[0, 1, 2, 3, 4, 5].map((r) => <path key={r} d={`M380 ${250 + r * 50} H570`} stroke={INK} strokeWidth="2.5" />)}
    <path d="M380 220 h30 v-34 h30 v34 h30 v-34 h30 v34 h40" fill="none" stroke={INK} strokeWidth="6" />
    <rect x="455" y="380" width="40" height="90" rx="20" fill={INK} />
    <path d="M475 186 V110" stroke={INK} strokeWidth="5" /><path d="M475 110 l70 20 l-70 20 Z" fill={RED} stroke={INK} strokeWidth="3" />
  </g>
);
const Windmill: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x="-100" y="0" width="1300" height="380" fill="url(#hSky)" />
      <path d="M-100 640 Q300 540 700 620 T1200 600 V800 H-100 Z" fill="url(#hDiagL)" stroke={INK} strokeWidth="5" />
      <g transform="translate(520 230)">
        <path d="M-110 560 L-70 0 H70 L110 560 Z" fill={PAPER} stroke={INK} strokeWidth="6" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${-100 + i * 6} ${80 + i * 70} H${100 - i * 6}`} stroke={INK} strokeWidth="3" />)}
        <rect x="-22" y="400" width="44" height="160" fill={INK} />
        <path d="M-80 0 L0 -90 L80 0 Z" fill="url(#hCross)" stroke={INK} strokeWidth="6" />
        <g transform={`translate(0 -10) rotate(${f * 3})`}>
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
    </g>
  );
};
const Hand: React.FC = () => (
  <g transform="translate(300 220) scale(1.6)">
    <path d="M-30 320 q10 -160 70 -170 l40 -10 q40 -170 70 -50 l10 -160 q30 -50 50 50 l10 130 q40 -130 60 -30 q10 100 -30 230 l-20 300 h-220 Z" fill={PAPER} stroke={INK} strokeWidth="5" />
    <path d="M60 200 q50 40 120 0 M80 260 q40 30 100 -4" stroke={INK} strokeWidth="3" fill="none" />
  </g>
);
export const DRAWN: Record<string, React.FC> = {'f-stone-tower': Tower, 'f-windmill': Windmill, 'f-open-hand': Hand};
