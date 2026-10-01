import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring} from 'remotion';
import {useCurrentFrame, useVideoConfig} from '../timeline';
import {colors, fonts} from '../styles';
import {POP} from './motion';
import {SfxAt} from './Sfx';
import {useTheme} from './theme';

// Grão de película por cima de tudo (muda a cada 2 frames).
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  const th = useTheme();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: th.grainBlend, opacity: th.grain}}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Forma de cor plana atrás do recorte (entra com spring). Variar a forma evita a repetição entre cenas.
export const RedDisc: React.FC<{x: number; y: number; r: number; appearAt?: number; shape?: 'disc' | 'ring' | 'block'}> = ({x, y, r, appearAt = 0, shape = 'disc'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const th = useTheme();
  const p = spring({frame: frame - appearAt, fps, config: {damping: 16, stiffness: 120}});
  const common: React.CSSProperties = {position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2};
  if (shape === 'ring') {
    return <div style={{...common, borderRadius: '50%', border: `${r * 0.16}px solid ${th.disc}`, transform: `scale(${p}) rotate(${(1 - p) * -40}deg)`}} />;
  }
  if (shape === 'block') {
    return <div style={{...common, top: y - r * 0.8, height: r * 1.6, background: th.disc, transform: `scale(${p}) rotate(${-7 + (1 - p) * 20}deg)`}} />;
  }
  return <div style={{...common, borderRadius: '50%', background: th.disc, transform: `scale(${p})`}} />;
};

// Tipografia cinética: cada palavra "bate" no ecrã (escala grande → 1, com pequeno abanão).
export const KineticText: React.FC<{
  lines: string[][];
  x: number;
  y: number;
  size?: number;
  startAt?: number;
  stagger?: number;
  hot?: string[]; // palavras a destacar em caixa vermelha
}> = ({lines, x, y, size = 130, startAt = 0, stagger = 6, hot = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const th = useTheme();
  let n = 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: fonts.heading, fontWeight: 400, fontSize: size, lineHeight: 1.02, textTransform: 'uppercase'}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: size * 0.22}}>
          {line.map((w) => {
            const at = startAt + n++ * stagger;
            const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 220}});
            const f = frame - at;
            const shake = f > 0 && f < 14 ? Math.sin(f * 2.6) * (14 - f) * 0.6 : 0;
            const isHot = hot.includes(w);
            return (
              <React.Fragment key={w + li}>
              <SfxAt name="tick" at={at} />
              <span
                style={{
                  display: 'inline-block',
                  opacity: Math.min(1, p * 3),
                  transform: `translate(${shake}px, ${(1 - p) * 40}px) scale(${1 + (1 - p) * 0.7})`,
                  transformOrigin: 'left bottom',
                  color: isHot ? th.hotText : th.text,
                  background: isHot ? th.hotBg : 'transparent',
                  padding: isHot ? '0 18px' : 0,
                  textShadow: isHot ? 'none' : `7px 7px 0 ${th.textShadow}`,
                }}
              >
                {w}
              </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Linha que se desenha de A a B, com ponto na ponta.
export const Connector: React.FC<{from: [number, number]; to: [number, number]; appearAt: number; color?: string; width?: number}> = ({from, to, appearAt, color, width = 4}) => {
  const frame = useCurrentFrame();
  const th = useTheme();
  color = color ?? th.text;
  const t = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const x = from[0] + (to[0] - from[0]) * t;
  const y = from[1] + (to[1] - from[1]) * t;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <line x1={from[0]} y1={from[1]} x2={x} y2={y} stroke={color} strokeWidth={width} strokeDasharray="10 8" />
      <circle cx={from[0]} cy={from[1]} r={8} fill={color} opacity={t > 0 ? 1 : 0} />
      <circle cx={x} cy={y} r={8} fill={color} opacity={t > 0 ? 1 : 0} />
    </svg>
  );
};

// Wipe em dois painéis (escuro à frente, vermelho atrás) a cobrir o corte (18 frames base; corte a meio).
export const RedWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const ease = Easing.inOut(Easing.cubic);
  const slab = (delay: number) =>
    interpolate(frame - delay, [0, 9, 18], [-2300, -200, 2300], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const panel = (left: number, bg: string): React.CSSProperties => ({position: 'absolute', top: -100, left, width: 2400, height: 1300, background: bg, transform: 'skewX(-10deg)'});
  return (
    <>
      <div style={panel(slab(0), colors.red)} />
      <div style={panel(slab(2.5), colors.black)} />
    </>
  );
};

// Flash branco curto (impacto).
export const Flash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + 7], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#fff', opacity: o}} />;
};

export const useShake = (at: number, amp = 14) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 20) return {x: 0, y: 0};
  const k = Math.exp(-f / 6) * amp;
  return {x: Math.sin(f * 2.3) * k, y: Math.cos(f * 2.9) * k * 0.6};
};

export const slamPop = POP;
