import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, INK, RED} from './Common';

// Animações com mecânica própria para as gravuras dos primeiros minutos (coordenadas = imagem original 1920×1280).
const Box: React.FC<{w: number; h: number; children: React.ReactNode}> = ({w, h, children}) => {
  const k = Math.min(w / 1920, h / 1280);
  return (
    <div style={{position: 'absolute', left: (w - 1920 * k) / 2, top: (h - 1280 * k) / 2, width: 1920, height: 1280, transform: `scale(${k})`, transformOrigin: '0 0'}}>{children}</div>
  );
};

// Pena a escrever: o papel fica fixo (camada própria); só a mão+pena (outra camada) se desloca, e a ponta deixa a tinta.
const NIB = [652, 946];
const W0 = [712, 990];
const pt = (s: number) => [W0[0] + 300 * s - 14 * Math.cos(s * Math.PI * 20) + 14, W0[1] + 22 * s - 20 * Math.sin(s * Math.PI * 20) * (1 - 0.2 * s)];
const layer = (n: string, extra?: React.CSSProperties) => <Img src={staticFile(`feudal/img/${n}.png`)} style={{position: 'absolute', inset: 0, width: 1920, height: 1280, ...extra}} />;
export const QuillWrite: React.FC<{w: number; h: number; bare?: boolean}> = ({w, h}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const s = Math.min(1, Math.max(0, (t - 0.4) / 3.0));
  const [x, y] = pt(s);
  const [x0, y0] = pt(0);
  const pts = Array.from({length: Math.floor(s * 180) + 1}, (_, i) => pt(i / 180)).map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
  const enter = Math.min(1, t / 0.4);
  const under = Math.min(1, Math.max(0, (t - 3.5) / 0.6));
  const dx = x - NIB[0] + (1 - enter) * 40, dy = y - NIB[1] - (1 - enter) * 70 + (s < 1 ? Math.sin(t * 24) * 1.5 : 0);
  return (
    <Box w={w} h={h}>
      {layer('quill-paper-layer')}
      <svg width="1920" height="1280" style={{position: 'absolute', inset: 0}}>
        <polyline points={pts} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${x0 - 6} ${y0 + 64} L${x0 - 6 + 330 * under} ${y0 + 64 + 22 * under}`} stroke={RED} strokeWidth="11" strokeLinecap="round" />
      </svg>
      {layer('quill-hand-layer', {transform: `translate(${dx}px, ${dy}px) rotate(${Math.sin(t * 2.4) * 0.5}deg)`, transformOrigin: `${NIB[0]}px ${NIB[1]}px`})}
    </Box>
  );
};

// Boi e lavrador a andar de verdade: pernas em camadas próprias. Homem: uma perna à frente, outra atrás. Boi: duas patas à frente, duas atrás (pares diagonais).
const LEGS: {n: string; px: number; py: number; ph: number; A: number}[] = [
  {n: 'ml', px: 1560, py: 775, ph: 0, A: 13}, {n: 'mr', px: 1650, py: 775, ph: Math.PI, A: 13},
  {n: 'f1', px: 455, py: 800, ph: 0, A: 9}, {n: 'f2', px: 575, py: 800, ph: Math.PI, A: 9},
  {n: 'b1', px: 880, py: 895, ph: Math.PI, A: 8}, {n: 'b2', px: 1075, py: 895, ph: 0, A: 8},
];
export const PloughWalk: React.FC<{w: number; h: number; bare?: boolean}> = ({w, h}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ph = t * 4.6;
  const bob = -Math.abs(Math.sin(ph)) * 6;
  const drift = -t * 30;
  return (
    <Box w={w} h={h}>
      <svg width="1920" height="1280" style={{position: 'absolute', inset: 0}}>
        <line x1="0" x2="1920" y1="1086" y2="1086" stroke={INK} strokeWidth="5" opacity="0.8" />
        {Array.from({length: 18}).map((_, i) => {
          const x = ((i * 130 + t * 200) % 2340) - 200;
          return <line key={i} x1={1920 - x} x2={1920 - x + 40 + (i % 3) * 18} y1={1112 + (i % 3) * 22} y2={1112 + (i % 3) * 22} stroke={i % 5 === 0 ? RED : INK} strokeWidth="5" strokeLinecap="round" opacity="0.7" />;
        })}
      </svg>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${drift}px, ${bob}px)`}}>
        {layer('plough-base')}
        {LEGS.map((l) => {
          const a = l.A * Math.sin(ph + l.ph);
          const lift = 14 * Math.max(0, Math.cos(ph + l.ph));
          return <React.Fragment key={l.n}>{layer('plough-' + l.n, {transform: `translateY(${-lift}px) rotate(${a}deg)`, transformOrigin: `${l.px}px ${l.py}px`})}</React.Fragment>;
        })}
      </div>
      <svg width="1920" height="1280" style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2, 3].map((i) => {
          const c = (t * 1.6 + i * 0.25) % 1;
          return <circle key={i} cx={1760 + c * 190 + i * 14} cy={1050 - c * 70} r={14 + c * 34} fill={INK} opacity={0.22 * (1 - c)} />;
        })}
      </svg>
    </Box>
  );
};
