import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig as useRealConfig} from 'remotion';
import {BASE_FPS} from '../timeline';
import {SFX_ENABLED, SFX_VOLUME} from './motion';

export type SfxName = 'whoosh' | 'pop' | 'tick' | 'hit' | 'stamp';

// Toca um SFX no frame `at` (escala de 30 fps, relativo à cena onde está).
export const SfxAt: React.FC<{name: SfxName; at: number; volume?: number}> = ({name, at, volume = 1}) => {
  const {fps} = useRealConfig();
  if (!SFX_ENABLED) return null;
  return (
    <Sequence from={Math.max(0, Math.round((at * fps) / BASE_FPS))} layout="none">
      <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={SFX_VOLUME[name] * volume} />
    </Sequence>
  );
};
