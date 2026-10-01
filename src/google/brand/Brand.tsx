import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useCurrentFrame} from '../../timeline';
import {fonts} from '../../styles';

// Identidade visual da Google, redesenhada em código (uso editorial): as 4 cores, a barra de pesquisa,
// os 4 pontos do loader, o pin do Maps. Não são os ficheiros oficiais; são recriações estilizadas.
export const GOOGLE = {blue: '#4285F4', red: '#EA4335', yellow: '#FBBC05', green: '#34A853'} as const;
const G4 = [GOOGLE.blue, GOOGLE.red, GOOGLE.yellow, GOOGLE.green];

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.exp);

// ── Wordmark "Google" nas 4 cores (as letras entram uma a uma) ──
export const Wordmark: React.FC<{x: number; y: number; size?: number; startAt?: number}> = ({x, y, size = 150, startAt = 0}) => {
  const frame = useCurrentFrame();
  const letters = ['G', 'o', 'o', 'g', 'l', 'e'];
  const colors = [GOOGLE.blue, GOOGLE.red, GOOGLE.yellow, GOOGLE.blue, GOOGLE.green, GOOGLE.red];
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', fontFamily: '"Helvetica Neue", Arial, sans-serif', fontWeight: 500, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.03}}>
      {letters.map((l, i) => {
        const t = interpolate(frame - startAt - i * 3, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
        return (
          <span key={i} style={{color: colors[i], display: 'inline-block', opacity: t, transform: `translateY(${(1 - t) * 40}px)`}}>
            {l}
          </span>
        );
      })}
    </div>
  );
};

// ── Ícones ──
const Magnifier: React.FC<{size: number; color?: string}> = ({size, color = '#9AA0A6'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
    <circle cx="10" cy="10" r="6.5" />
    <line x1="15" y1="15" x2="21" y2="21" />
  </svg>
);

const Mic: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeWidth={2}>
    <rect x="9" y="2.5" width="6" height="11" rx="3" fill={GOOGLE.blue} stroke="none" />
    <path d="M5 11.5a7 7 0 0 0 14 0" stroke={GOOGLE.green} />
    <line x1="12" y1="18.5" x2="12" y2="21.5" stroke={GOOGLE.yellow} />
    <line x1="8.5" y1="21.5" x2="15.5" y2="21.5" stroke={GOOGLE.red} />
  </svg>
);

// ── Barra de pesquisa: escreve o texto, cursor a piscar, sugestões a cair por baixo ──
export const SearchBar: React.FC<{
  x: number;
  y: number;
  width?: number;
  text: string;
  startAt?: number;
  cps?: number; // caracteres por segundo
  suggestions?: string[];
  suggestAt?: number;
}> = ({x, y, width = 1100, text, startAt = 0, cps = 22, suggestions = [], suggestAt = 0}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame - (startAt - 10), [0, 12], [0, 1], {...clampOpts, easing: easeOut});
  const chars = Math.max(0, Math.min(text.length, Math.floor(((frame - startAt) / 30) * cps)));
  const caret = Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width, opacity: enter, transform: `translateY(${(1 - enter) * 30}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, height: 96, padding: '0 34px', borderRadius: 48, background: '#fff', boxShadow: '0 2px 6px rgba(32,33,36,0.28), 0 14px 34px rgba(0,0,0,0.20)'}}>
        <Magnifier size={38} />
        <div style={{flex: 1, fontFamily: 'Arial, "Helvetica Neue", sans-serif', fontSize: 36, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {text.slice(0, chars)}
          <span style={{display: 'inline-block', width: 3, height: 40, marginLeft: 2, verticalAlign: 'middle', background: caret ? '#202124' : 'transparent'}} />
        </div>
        <Mic size={38} />
      </div>
      {suggestions.length > 0 && (
        <div style={{marginTop: 14, padding: '10px 0', borderRadius: 28, background: '#fff', boxShadow: '0 2px 6px rgba(32,33,36,0.2), 0 12px 30px rgba(0,0,0,0.15)'}}>
          {suggestions.map((sg, i) => {
            const t = interpolate(frame - suggestAt - i * 7, [0, 10], [0, 1], {...clampOpts, easing: easeOut});
            return (
              <div key={sg} style={{display: 'flex', alignItems: 'center', gap: 22, height: 64, padding: '0 34px', opacity: t, transform: `translateY(${(1 - t) * -10}px)`, fontFamily: 'Arial, sans-serif', fontSize: 30, color: '#202124'}}>
                <Magnifier size={28} />
                <span>{sg}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Os 4 pontos do loader, a saltar em sequência ──
export const FourDots: React.FC<{cx: number; cy: number; size?: number}> = ({cx, cy, size = 40}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: cx - size * 3, top: cy - size * 2, width: size * 6, height: size * 4}}>
      {G4.map((c, i) => {
        const bounce = Math.max(0, Math.sin((frame / 30) * 5 - i * 0.9));
        return <div key={i} style={{position: 'absolute', left: i * size * 1.6, top: size * 2 - bounce * size * 1.4, width: size, height: size, borderRadius: '50%', background: c}} />;
      })}
    </div>
  );
};

// ── Campo de pontos nas 4 cores (enche com `progress` 0–1) ──
export const DotField: React.FC<{x: number; y: number; w: number; h: number; progress: number; cell?: number}> = ({x, y, w, h, progress, cell = 26}) => {
  const frame = useCurrentFrame();
  const cols = Math.floor(w / cell);
  const rows = Math.floor(h / cell);
  const total = cols * rows;
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < total; i++) {
    // ordem de aparição pseudo-aleatória, determinística
    const order = ((i * 2654435761) >>> 0) % total / total;
    const t = interpolate(progress, [order * 0.92, order * 0.92 + 0.08], [0, 1], clampOpts);
    if (t <= 0) continue;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const color = G4[(col * 7 + row * 3 + (i % 5)) % 4];
    const wob = 1 + 0.08 * Math.sin(frame / 12 + i);
    dots.push(<circle key={i} cx={col * cell + cell / 2} cy={row * cell + cell / 2} r={(cell * 0.34) * t * wob} fill={color} />);
  }
  return (
    <svg style={{position: 'absolute', left: x, top: y}} width={cols * cell} height={rows * cell}>
      {dots}
    </svg>
  );
};
