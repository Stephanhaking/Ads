import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors} from '../styles';

// Estrutura de profundidade: Background (estático) → Midground (elemento central) → Foreground (texto/dados).

export const Background: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: colors.black}}>
    <svg width="100%" height="100%" style={{position: 'absolute'}}>
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke={colors.gray} strokeWidth={1} />
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.75} />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" opacity={0.6} />
      <rect width="100%" height="100%" fill="url(#vignette)" />
    </svg>
  </AbsoluteFill>
);

export const Midground: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>{children}</AbsoluteFill>
);

export const Foreground: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>{children}</AbsoluteFill>
);

export const LayeredScene: React.FC<{
  mid: React.ReactNode;
  fore?: React.ReactNode;
}> = ({mid, fore}) => (
  <AbsoluteFill>
    <Background />
    <Midground>{mid}</Midground>
    {fore ? <Foreground>{fore}</Foreground> : null}
  </AbsoluteFill>
);
