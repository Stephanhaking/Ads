import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring} from 'remotion';
import {useCurrentFrame, useVideoConfig} from '../timeline';
import {colors, fonts} from '../styles';
import {POP} from './motion';
import {SfxAt} from './Sfx';
import {useTheme} from './theme';

// Grão de película por cima de tudo (muda a cada 2 frames).
export const Grain: React.FC<{strength?: number}> = ({strength = 1}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  const th = useTheme();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: th.grainBlend, opacity: th.grain * strength}}>
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

// Tipografia cinética editorial: cada palavra sobe de uma máscara de linha (ease-out), uma a uma.
// A palavra de destaque ("hot") ganha uma caixa de cor que abre em largura antes do texto subir.
export const KineticText: React.FC<{
  lines: string[][];
  x: number;
  y: number;
  size?: number;
  startAt?: number;
  stagger?: number;
  hot?: string[];
}> = ({lines, x, y, size = 130, startAt = 0, stagger = 6, hot = []}) => {
  const frame = useCurrentFrame();
  const th = useTheme();
  const ease = Easing.out(Easing.exp);
  const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  let n = 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: fonts.heading, fontWeight: 400, fontSize: size, lineHeight: 1.0, textTransform: 'uppercase', letterSpacing: size * -0.005}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: size * 0.22, overflow: 'hidden', paddingBottom: size * 0.14, marginBottom: -size * 0.08, paddingRight: size * 0.12}}>
          {line.map((w) => {
            const at = startAt + n++ * stagger;
            const rise = interpolate(frame - at, [0, 14], [0, 1], {...clampOpts, easing: ease});
            const isHot = hot.includes(w);
            const box = interpolate(frame - at, [-4, 8], [0, 1], {...clampOpts, easing: ease});
            return (
              <React.Fragment key={w + li}>
                <SfxAt name="tick" at={at} />
                <span style={{position: 'relative', display: 'inline-block', padding: isHot ? `0 ${size * 0.14}px` : 0}}>
                  {isHot ? <span style={{position: 'absolute', inset: 0, background: th.hotBg, transform: `scaleX(${box})`, transformOrigin: 'left'}} /> : null}
                  <span
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      transform: `translateY(${(1 - rise) * 105}%)`,
                      color: isHot ? th.hotText : th.text,
                      textShadow: isHot ? 'none' : `${size * 0.05}px ${size * 0.05}px 0 ${th.textShadow}`,
                    }}
                  >
                    {w}
                  </span>
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
