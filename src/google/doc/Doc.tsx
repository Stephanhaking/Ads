import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useCurrentFrame} from '../../timeline';
import {fonts} from '../../styles';
import {GOOGLE} from '../brand/Brand';

// Dispositivos realistas de documentário: janelas, marca-texto, círculo desenhado à mão, cursor, setas.
// Todos os tempos em frames da escala de 30 fps, relativos à cena.

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.exp);
const easeIO = Easing.inOut(Easing.cubic);

// ── marca-texto sobre texto corrido: envolve um <span>; o amarelo varre da esquerda para a direita ──
export const HL: React.FC<{at: number; dur?: number; color?: string; children: React.ReactNode}> = ({at, dur = 14, color = '#FFE45C', children}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], {...clampOpts, easing: easeIO});
  return (
    <span style={{backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: 'no-repeat', backgroundSize: `${p * 100}% 88%`, backgroundPosition: '0 70%', padding: '0 2px', margin: '0 -2px', mixBlendMode: 'multiply' as const}}>
      {children}
    </span>
  );
};

// ── círculo desenhado à mão (marcador vermelho), com sobreposição no fecho ──
export const HandCircle: React.FC<{cx: number; cy: number; rx: number; ry: number; at: number; dur?: number; color?: string; width?: number}> = ({cx, cy, rx, ry, at, dur = 18, color = '#E5232B', width = 7}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], {...clampOpts, easing: easeIO});
  const pts: string[] = [];
  const N = 70;
  for (let i = 0; i <= N; i++) {
    const a = -2.3 + (i / N) * (Math.PI * 2 * 1.08);
    const wob = 1 + 0.035 * Math.sin(a * 3 + 1) + (i / N) * 0.05; // espiral ligeira: o fim passa por fora
    pts.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * wob).toFixed(1)} ${(cy + Math.sin(a) * ry * wob).toFixed(1)}`);
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <path d={pts.join(' ')} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// ── seta curva com ponta (anotação) ──
export const CurvedArrow: React.FC<{from: [number, number]; to: [number, number]; bend?: number; at: number; color?: string; width?: number}> = ({from, to, bend = 80, at, color = '#0A0A0A', width = 5}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 16], [0, 1], {...clampOpts, easing: easeOut});
  const mx = (from[0] + to[0]) / 2 + bend;
  const my = (from[1] + to[1]) / 2 - bend * 0.6;
  const ang = Math.atan2(to[1] - my, to[0] - mx);
  const hx = (a: number) => to[0] - Math.cos(ang + a) * 26;
  const hy = (a: number) => to[1] - Math.sin(ang + a) * 26;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <path d={`M${from[0]} ${from[1]} Q ${mx} ${my} ${to[0]} ${to[1]}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <g opacity={p > 0.9 ? 1 : 0}>
        <line x1={to[0]} y1={to[1]} x2={hx(0.5)} y2={hy(0.5)} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <line x1={to[0]} y1={to[1]} x2={hx(-0.5)} y2={hy(-0.5)} stroke={color} strokeWidth={width} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// ── cursor do rato: segue waypoints e (opcional) clica no fim ──
export const Cursor: React.FC<{path: [number, number, number][]; click?: boolean; scale?: number}> = ({path, click = false, scale = 1.6}) => {
  const frame = useCurrentFrame();
  let x = path[0][0], y = path[0][1];
  for (let i = 1; i < path.length; i++) {
    const [px, py, pt] = path[i - 1];
    const [nx, ny, nt] = path[i];
    if (frame >= pt) {
      const k = interpolate(frame, [pt, nt], [0, 1], {...clampOpts, easing: easeIO});
      x = px + (nx - px) * k;
      y = py + (ny - py) * k;
    }
  }
  const last = path[path.length - 1];
  const ripple = click ? interpolate(frame - last[2], [0, 14], [0, 1], clampOpts) : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {click && ripple > 0 && ripple < 1 && <div style={{position: 'absolute', left: last[0] - 30 * ripple, top: last[1] - 30 * ripple, width: 60 * ripple, height: 60 * ripple, borderRadius: '50%', border: '3px solid rgba(66,133,244,0.8)', opacity: 1 - ripple}} />}
      <svg style={{position: 'absolute', left: x, top: y, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))'}} width={26 * scale} height={32 * scale} viewBox="0 0 26 32">
        <path d="M3 2 L3 25 L9 19.5 L13.5 29 L18 27 L13.6 17.8 L21.5 17.8 Z" fill="#fff" stroke="#111" strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ── janela de browser: separador, barra de endereço, conteúdo ──
export const BrowserWindow: React.FC<{x: number; y: number; w: number; h: number; url: string; tab: string; at?: number; tilt?: number; children?: React.ReactNode}> = ({x, y, w, h, url, tab, at = 0, tilt = 0, children}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame - at, [0, 14], [0, 1], {...clampOpts, easing: easeOut});
  const sans = 'Arial, "Helvetica Neue", sans-serif';
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 26px 60px rgba(0,0,0,0.34), 0 3px 8px rgba(0,0,0,0.22)', opacity: enter, transform: `translateY(${(1 - enter) * 40}px) rotate(${tilt}deg) scale(${0.97 + 0.03 * enter})`, fontFamily: sans}}>
      <div style={{height: 52, background: '#DEE1E6', display: 'flex', alignItems: 'flex-end', padding: '0 14px', gap: 14}}>
        <div style={{display: 'flex', gap: 8, alignSelf: 'center', marginRight: 10}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
        </div>
        <div style={{height: 40, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: '12px 12px 0 0', fontSize: 17, color: '#202124'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: GOOGLE.blue}} />
          <span style={{maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{tab}</span>
          <span style={{color: '#5F6368', marginLeft: 8}}>✕</span>
        </div>
      </div>
      <div style={{height: 56, background: '#fff', borderBottom: '1px solid #E8EAED', display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px'}}>
        <span style={{color: '#5F6368', fontSize: 24}}>←</span><span style={{color: '#BDC1C6', fontSize: 24}}>→</span><span style={{color: '#5F6368', fontSize: 24}}>⟳</span>
        <div style={{flex: 1, height: 38, borderRadius: 19, background: '#F1F3F4', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', fontSize: 18, color: '#3C4043'}}>
          <span style={{fontSize: 15}}>🔒</span>{url}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 108, right: 0, bottom: 0, overflow: 'hidden'}}>{children}</div>
    </div>
  );
};

// ── artigo científico (página web) com título real e marca-texto ──
export const ArticlePage: React.FC<{hlAt: number}> = ({hlAt}) => {
  const bar = (wid: number, i: number) => <div key={i} style={{height: 15, width: `${wid}%`, borderRadius: 7, background: '#E1E4E8', marginBottom: 15}} />;
  return (
    <div style={{padding: '34px 54px', fontFamily: 'Georgia, "Times New Roman", serif', color: '#1A1A1A'}}>
      <div style={{fontFamily: fonts.mono, fontSize: 17, letterSpacing: 4, color: '#80868B'}}>ARTICLE · OPEN ACCESS · MAY 2018</div>
      <div style={{fontSize: 46, lineHeight: 1.12, fontWeight: 700, marginTop: 16}}>
        <HL at={hlAt}>Scalable and accurate</HL> deep learning for electronic health records
      </div>
      <div style={{fontSize: 21, color: '#5F6368', marginTop: 18, fontFamily: 'Arial, sans-serif'}}>Rajkomar et al. · npj Digital Medicine</div>
      <div style={{height: 2, background: '#E8EAED', margin: '26px 0'}} />
      <div style={{fontFamily: fonts.mono, fontSize: 17, letterSpacing: 4, color: '#80868B', marginBottom: 18}}>ABSTRACT</div>
      {[100, 96, 99, 90, 97, 62].map(bar)}
    </div>
  );
};

// ── sublinhado desenhado à mão (traço ondulado que se desenha) ──
export const ScribbleUnderline: React.FC<{x: number; y: number; w: number; at: number; color?: string; width?: number}> = ({x, y, w, at, color = '#E5232B', width = 8}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 14], [0, 1], {...clampOpts, easing: easeIO});
  const pts: string[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    pts.push(`${i ? 'L' : 'M'}${(x + t * w).toFixed(1)} ${(y + Math.sin(t * 9) * 4 - t * 6).toFixed(1)}`);
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <path d={pts.join(' ')} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// ── 100 leituras pequenas: uma é ligeiramente diferente ("escondido, fácil de falhar") ──
export const ReadingsGrid: React.FC<{x: number; y: number; cell?: number; at: number; oddAt: number}> = ({x, y, cell = 26, at, oddAt}) => {
  const frame = useCurrentFrame();
  const odd = 6 * 10 + 7; // índice da leitura anómala
  const oddT = interpolate(frame - oddAt, [0, 16], [0, 1], {...clampOpts, easing: easeOut});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: cell * 10, height: cell * 10}}>
      {Array.from({length: 100}, (_, i) => {
        const t = interpolate(frame - at - i * 0.35, [0, 8], [0, 1], {...clampOpts, easing: easeOut});
        const isOdd = i === odd;
        const shade = 0.16 + ((i * 37) % 11) / 100;
        const bg = isOdd ? `rgba(229,35,43,${0.18 + oddT * 0.82})` : `rgba(10,10,10,${shade})`;
        return <div key={i} style={{position: 'absolute', left: (i % 10) * cell, top: Math.floor(i / 10) * cell, width: cell - 5, height: cell - 5, borderRadius: 5, background: bg, opacity: t, transform: `scale(${0.4 + 0.6 * t})`}} />;
      })}
    </div>
  );
};

// ── papéis a voar de A para B (registos a entrar no modelo) ──
export const DocFlow: React.FC<{from: [number, number]; to: [number, number]; at: number; n?: number}> = ({from, to, at, n = 9}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const k = ((frame - at - i * 7) % 70) / 70;
        if (frame - at - i * 7 < 0) return null;
        const t = Math.max(0, k);
        const ease = Easing.inOut(Easing.cubic)(t);
        const px = from[0] + (to[0] - from[0]) * ease;
        const py = from[1] + (to[1] - from[1]) * ease - Math.sin(t * Math.PI) * 90 + (i % 3 - 1) * 14;
        const sc = 1 - t * 0.55;
        return (
          <div key={i} style={{position: 'absolute', left: px, top: py, width: 46 * sc, height: 60 * sc, background: '#fff', borderRadius: 4, boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transform: `rotate(${(1 - t) * (i % 2 ? 14 : -12)}deg)`, opacity: t > 0.92 ? (1 - t) * 12 : 1}}>
            {[0, 1, 2, 3].map((r) => <div key={r} style={{position: 'absolute', left: 7 * sc, right: 7 * sc, top: (10 + r * 11) * sc, height: 4 * sc, borderRadius: 2, background: '#BDC1C6'}} />)}
          </div>
        );
      })}
    </>
  );
};
