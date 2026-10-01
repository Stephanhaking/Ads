import React from 'react';
import {Easing, interpolate, spring} from 'remotion';
import {useCurrentFrame, useVideoConfig} from '../timeline';
import {colors, fonts} from '../styles';
import {BAR, motionFrame, POP, EASE_OUT} from './motion';
import {SfxAt} from './Sfx';
import {useTheme} from './theme';

// Elementos de foreground estilo Vox: caixas de texto flutuantes e barras de dados.

export const Tag: React.FC<{
  text: string;
  appearAt: number;
  x: number;
  y: number;
  fill?: boolean; // caixa de destaque (cor do tema)
  size?: number;
}> = ({text, appearAt, x, y, fill, size = 44}) => {
  const frame = useCurrentFrame();
  const th = useTheme();
  // revelação lateral (a caixa "abre" da esquerda para a direita) com ease-out exponencial — sem baloiço
  const t = interpolate(motionFrame(frame, appearAt), [0, 11], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.exp)});
  const bg = fill ? th.hotBg : th.tagBg;
  const accent = fill ? th.hotShadow : th.disc;
  return (
    <>
      <SfxAt name="pop" at={appearAt} />
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          opacity: t > 0 ? 1 : 0,
          clipPath: `inset(-12px ${(1 - t) * 100}% -12px -12px)`,
          transform: `translateX(${(1 - t) * -26}px)`,
          display: 'flex',
          alignItems: 'stretch',
          background: bg,
          color: fill ? th.hotText : th.tagText,
          fontFamily: fonts.heading,
          fontWeight: 400,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: size * 0.03,
          textTransform: 'uppercase',
          boxShadow: `${Math.round(size * 0.12)}px ${Math.round(size * 0.12)}px 0 ${fill ? th.hotShadow : th.tagShadow}`,
          whiteSpace: 'nowrap',
        }}
      >
        {/* faixa de acento à esquerda */}
        <div style={{width: Math.max(8, size * 0.2), background: accent, flexShrink: 0}} />
        <div style={{padding: `${size * 0.3}px ${size * 0.55}px ${size * 0.26}px ${size * 0.42}px`}}>{text}</div>
      </div>
    </>
  );
};

export const Bar: React.FC<{
  label: string;
  value: number; // 0–100
  appearAt: number;
  x: number;
  color: string;
  maxHeight?: number;
}> = ({label, value, appearAt, x, color, maxHeight = 560}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: motionFrame(frame, appearAt), fps, config: BAR});
  const h = (value / 100) * maxHeight * p;
  const shown = Math.round(value * interpolate(p, [0, 1], [0, 1], {extrapolateRight: 'clamp', easing: EASE_OUT}));
  return (
    <div style={{position: 'absolute', left: x, bottom: 140, width: 230}}>
      <div style={{fontFamily: fonts.heading, fontWeight: 400, fontSize: 92, color: colors.white, marginBottom: 10, opacity: Math.min(1, p * 2)}}>
        {shown}%
      </div>
      <div style={{height: h, background: color, boxShadow: `10px 10px 0 ${color === colors.red ? colors.white : colors.red}`}} />
      <div style={{position: 'absolute', top: '100%', marginTop: 22, left: 0, width: 300, fontFamily: fonts.mono, fontSize: 26, color: colors.grayLight, letterSpacing: 3, textTransform: 'uppercase'}}>
        {label}
      </div>
    </div>
  );
};
