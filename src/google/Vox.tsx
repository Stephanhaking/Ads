import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../styles';
import {BAR, motionFrame, POP, EASE_OUT} from './motion';
import {useTheme} from './theme';

// Elementos de foreground estilo Vox: caixas de texto flutuantes e barras de dados.

export const Tag: React.FC<{
  text: string;
  appearAt: number;
  x: number;
  y: number;
  fill?: boolean; // caixa vermelha cheia (destaque)
  size?: number;
}> = ({text, appearAt, x, y, fill, size = 44}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const th = useTheme();
  const p = spring({frame: motionFrame(frame, appearAt), fps, config: POP});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: Math.min(1, p * 2),
        transform: `scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -4}deg)`,
        transformOrigin: 'left center',
        padding: '10px 22px',
        background: fill ? th.hotBg : th.tagBg,
        color: fill ? th.hotText : th.tagText,
        fontFamily: fonts.heading,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 2,
        textTransform: 'uppercase',
        boxShadow: `8px 8px 0 ${fill ? th.hotShadow : th.tagShadow}`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
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
      <div style={{fontFamily: fonts.heading, fontWeight: 900, fontSize: 92, color: colors.white, marginBottom: 10, opacity: Math.min(1, p * 2)}}>
        {shown}%
      </div>
      <div style={{height: h, background: color, boxShadow: `10px 10px 0 ${color === colors.red ? colors.white : colors.red}`}} />
      <div style={{position: 'absolute', top: '100%', marginTop: 22, left: 0, width: 300, fontFamily: fonts.mono, fontSize: 26, color: colors.grayLight, letterSpacing: 3, textTransform: 'uppercase'}}>
        {label}
      </div>
    </div>
  );
};
