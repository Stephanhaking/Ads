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
const img: React.CSSProperties = {position: 'absolute', inset: 0, width: 1920, height: 1280, mixBlendMode: 'multiply', filter: 'contrast(1.1) grayscale(1)'};

// Pena a escrever: a mão desloca-se e a ponta deixa uma linha de tinta cursiva que cresce; no fim, um rubrica vermelha.
const NIB = [652, 946];
const pt = (s: number) => [NIB[0] + 420 * s, NIB[1] + 36 * s - 26 * Math.abs(Math.sin(s * Math.PI * 9)) * (1 - 0.3 * s)];
export const QuillWrite: React.FC<{w: number; h: number}> = ({w, h}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const s = Math.min(1, Math.max(0, (t - 0.35) / 3.0));
  const [x, y] = pt(s);
  const pts = Array.from({length: Math.floor(s * 140) + 1}, (_, i) => pt((i / 140))).map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
  const bob = s < 1 ? Math.sin(t * 22) * 3 : 0;
  const under = Math.min(1, Math.max(0, (t - 3.5) / 0.6));
  return (
    <Box w={w} h={h}>
      <svg width="1920" height="1280" style={{position: 'absolute', inset: 0}}>
        <polyline points={pts} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${NIB[0] - 10} ${NIB[1] + 74} L${NIB[0] - 10 + 470 * under} ${NIB[1] + 74 + 20 * under}`} stroke={RED} strokeWidth="12" strokeLinecap="round" />
      </svg>
      <Img src={staticFile('feudal/img/f-quill-hand.jpg')} style={{...img, transform: `translate(${x - NIB[0]}px, ${y - NIB[1] + bob}px) rotate(${Math.sin(t * 3) * 0.6}deg)`, transformOrigin: `${NIB[0]}px ${NIB[1]}px`}} />
    </Box>
  );
};

// Boi e lavrador a andar: duas metades da mesma imagem (boi | homem+arado) com passada própria, chão a deslizar e poeira.
export const PloughWalk: React.FC<{w: number; h: number}> = ({w, h}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ph = t * 5.2;
  const bob = -Math.abs(Math.sin(ph)) * 9;
  const oxRot = Math.sin(ph) * 1.1;
  const manRot = Math.sin(ph + 1.2) * 1.5;
  const drift = -t * 30;
  const SPLIT = 1190;
  return (
    <Box w={w} h={h}>
      <svg width="1920" height="1280" style={{position: 'absolute', inset: 0}}>
        <line x1="0" x2="1920" y1="1086" y2="1086" stroke={INK} strokeWidth="5" opacity="0.8" />
        {Array.from({length: 18}).map((_, i) => {
          const x = ((i * 130 + t * 240) % 2340) - 200;
          return <line key={i} x1={1920 - x} x2={1920 - x + 40 + (i % 3) * 18} y1={1112 + (i % 3) * 22} y2={1112 + (i % 3) * 22} stroke={i % 5 === 0 ? RED : INK} strokeWidth="5" strokeLinecap="round" opacity="0.7" />;
        })}
      </svg>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${drift}px, ${bob}px)`}}>
        <Img src={staticFile('feudal/img/f-peasant-plough.jpg')} style={{...img, clipPath: `inset(0 ${1920 - SPLIT}px 0 0)`, transform: `rotate(${oxRot}deg)`, transformOrigin: '600px 1040px'}} />
        <Img src={staticFile('feudal/img/f-peasant-plough.jpg')} style={{...img, clipPath: `inset(0 0 0 ${SPLIT}px)`, transform: `rotate(${manRot}deg)`, transformOrigin: '1600px 1040px'}} />
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
