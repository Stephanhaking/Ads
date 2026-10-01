import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {useCurrentFrame} from '../timeline';
import {useTheme} from './theme';
import {PUSH_IN_FRAMES, PUSH_IN_MAX} from './motion';

// Estrutura de profundidade: Background (estático) → Midground (elemento central) → Foreground (texto/dados).

export const Background: React.FC = () => {
  const t = useTheme();
  return (
  <AbsoluteFill style={{backgroundColor: t.bg}}>
    <svg width="100%" height="100%" style={{position: 'absolute'}}>
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke={t.grid} strokeWidth={1} />
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={t.vignette} />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" opacity={0.6} />
      {/* campo de pontos halftone a esvanecer a partir do canto inferior direito */}
      <defs>
        <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="2.6" fill={t.text} />
        </pattern>
        <radialGradient id="dotfade" cx="100%" cy="100%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity={1} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <mask id="dotmask"><rect width="100%" height="100%" fill="url(#dotfade)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" mask="url(#dotmask)" opacity={0.16} />
      <rect width="100%" height="100%" fill="url(#vignette)" />
    </svg>
  </AbsoluteFill>
  );
};

// Push-in lento: dá profundidade ao midground sem mexer no foreground.
export const Midground: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const scale = 1 + interpolate(frame, [0, PUSH_IN_FRAMES], [0, PUSH_IN_MAX], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${scale})`}}>{children}</AbsoluteFill>
  );
};

export const Foreground: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>{children}</AbsoluteFill>
);

export const LayeredScene: React.FC<{
  back?: React.ReactNode; // blocos de cor / formas atrás do recorte
  mid: React.ReactNode;
  fore?: React.ReactNode;
}> = ({back, mid, fore}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      {back ? <AbsoluteFill style={{transform: `translateX(${frame * 0.05}px)`}}>{back}</AbsoluteFill> : null}
      <Midground>{mid}</Midground>
      {/* parallax: o foreground desliza mais depressa que o midground */}
      {fore ? <Foreground><AbsoluteFill style={{transform: `translateX(${-frame * 0.12}px)`}}>{fore}</AbsoluteFill></Foreground> : null}
    </AbsoluteFill>
  );
};
