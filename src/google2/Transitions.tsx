import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Easing} from 'remotion';
import {INK, RED, FPS} from '../feudal/Common';

// Transições de impacto no estilo do canal (papel rasgado, tinta, vermelho). Cada uma dura 2·H frames e está centrada na fronteira:
// os primeiros H frames cobrem o ecrã, os últimos H descobrem o novo plano. A troca de conteúdo acontece no frame H.
export type TrKind = 'redtear' | 'ink' | 'iris' | 'strips' | 'punch';
export const TR_H = 7;
const io = Easing.inOut(Easing.cubic);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const p2 = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...cl, easing: io});

const RedTear: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, TR_H, 2 * TR_H], [-2700, 0, 2700], {...cl, easing: io});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: -80, bottom: -80, width: 2900, left: -490, background: INK, filter: 'url(#torn)', transform: `translateX(${x - 120}px)`}} />
      <div style={{position: 'absolute', top: -80, bottom: -80, width: 2900, left: -490, background: RED, filter: 'url(#torn)', transform: `translateX(${x}px)`}} />
    </AbsoluteFill>
  );
};
const Ink: React.FC = () => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, TR_H, 2 * TR_H], [1300, 0, -1300], {...cl, easing: io});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -80, right: -80, top: -120, height: 1320, background: RED, filter: 'url(#torn)', transform: `translateY(${y + 90}px)`}} />
      <div style={{position: 'absolute', left: -80, right: -80, top: -120, height: 1320, background: INK, filter: 'url(#torn)', transform: `translateY(${y}px)`}} />
    </AbsoluteFill>
  );
};
const Iris: React.FC<{cx?: number; cy?: number}> = ({cx = 1300, cy = 480}) => {
  const f = useCurrentFrame();
  const hole = f < TR_H ? 1900 * (1 - p2(f, 0, TR_H)) : 1900 * p2(f, TR_H, 2 * TR_H);
  const ring = hole > 1 && hole < 1890;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, background: RED, WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${hole}px, #000 ${hole + 1}px)`, maskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${hole}px, #000 ${hole + 1}px)`}} />
      {ring && <div style={{position: 'absolute', left: cx - hole - 14, top: cy - hole - 14, width: 2 * hole + 28, height: 2 * hole + 28, borderRadius: '50%', border: `14px solid ${INK}`}} />}
    </AbsoluteFill>
  );
};
const Strips: React.FC = () => {
  const f = useCurrentFrame();
  const N = 8, W = 1920 / N;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {Array.from({length: N}).map((_, i) => {
        const d = (i % 2 ? N - i : i) * 0.45;           // entrada alternada
        const y = interpolate(f, [d, d + TR_H - 1.5, 2 * TR_H - 3 + d * 0.3, 2 * TR_H + d * 0.3], [-1200 * (i % 2 ? -1 : 1), 0, 0, 1200 * (i % 2 ? -1 : 1)], {...cl, easing: io});
        return <div key={i} style={{position: 'absolute', left: i * W - 1, width: W + 2, top: 0, bottom: 0, transform: `translateY(${y}px)`, background: i % 3 === 1 ? RED : '#F2EADB', borderRight: `10px solid ${i % 3 === 1 ? INK : RED}`, filter: 'url(#torn)'}} />;
      })}
    </AbsoluteFill>
  );
};
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [TR_H - 1, TR_H, TR_H + 5], [0, 0.55, 0], cl)}} />;
};

export const TransitionAt: React.FC<{at: number; kind: TrKind; cx?: number; cy?: number}> = ({at, kind, cx, cy}) => {
  const from = Math.round(at * FPS) - TR_H;
  return (
    <Sequence from={from} durationInFrames={2 * TR_H} layout="none">
      <Audio src={staticFile(kind === 'ink' || kind === 'redtear' ? 'audio/sfx/whoosh-a.wav' : kind === 'iris' ? 'audio/sfx/pop2.wav' : 'audio/sfx/swoosh.wav')} volume={0.35} />
      {kind === 'redtear' && <RedTear />}
      {kind === 'ink' && <Ink />}
      {kind === 'iris' && <Iris cx={cx} cy={cy} />}
      {kind === 'strips' && <Strips />}
      {kind === 'punch' && <Flash />}
    </Sequence>
  );
};

// efeito "punch" no conteúdo: aproxima-se até à fronteira e depois assenta (zoom + desfoque + deslocação)
export const punchStyle = (frame: number, boundaries: number[]): React.CSSProperties => {
  for (const b of boundaries) {
    const d = frame - Math.round(b * FPS);
    if (d >= -TR_H && d < TR_H) {
      const s = d < 0 ? 1 + 0.22 * Math.pow((d + TR_H) / TR_H, 2) : 0.9 + 0.1 * Easing.out(Easing.cubic)(d / TR_H);
      const bl = d < 0 ? 5 * Math.pow((d + TR_H) / TR_H, 2) : 5 * (1 - d / TR_H);
      return {transform: `scale(${s})`, filter: `blur(${bl}px)`, transformOrigin: '50% 50%'};
    }
  }
  return {};
};
