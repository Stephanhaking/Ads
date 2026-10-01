import {useCurrentFrame as useRealFrame, useVideoConfig as useRealConfig} from 'remotion';

// O vídeo renderiza a 60 fps, mas todas as animações foram escritas numa linha de tempo de 30 fps.
// Estes hooks devolvem o frame (fracionário) e o fps NA ESCALA DE 30 FPS, por isso cada animação
// passa a ser calculada em meios-frames (movimento muito mais suave) sem reescrever nenhum valor.
export const BASE_FPS = 30;

export const useCurrentFrame = () => {
  const real = useRealFrame();
  const {fps} = useRealConfig();
  return (real * BASE_FPS) / fps;
};

export const useVideoConfig = () => {
  const cfg = useRealConfig();
  return {...cfg, fps: BASE_FPS, durationInFrames: (cfg.durationInFrames * BASE_FPS) / cfg.fps};
};
