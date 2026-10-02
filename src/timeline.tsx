import React, {createContext, useContext} from 'react';
import {useCurrentFrame as useRealFrame, useVideoConfig as useRealConfig} from 'remotion';

// O vídeo renderiza a 60 fps, mas todas as animações foram escritas numa linha de tempo de 30 fps.
// Estes hooks devolvem o frame (fracionário) e o fps NA ESCALA DE 30 FPS, por isso cada animação
// passa a ser calculada em meios-frames (movimento muito mais suave) sem reescrever nenhum valor.
export const BASE_FPS = 30;

// Deslocamento de tempo: quando uma foto ocupa o início de uma cena, a cena de interface começa mais
// tarde mas mantém os tempos escritos (relativos ao início original), para as legendas seguirem a voz.
const OffsetCtx = createContext(0);
export const FrameOffset: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) =>
  React.createElement(OffsetCtx.Provider, {value: frames}, children);

export const useCurrentFrame = () => {
  const real = useRealFrame();
  const {fps} = useRealConfig();
  const offset = useContext(OffsetCtx);
  return (real * BASE_FPS) / fps + offset;
};

export const useVideoConfig = () => {
  const cfg = useRealConfig();
  return {...cfg, fps: BASE_FPS, durationInFrames: (cfg.durationInFrames * BASE_FPS) / cfg.fps};
};
