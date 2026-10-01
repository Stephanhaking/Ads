// Design system centralizado: cores, fontes e medidas globais.
export const colors = {
  black: '#0A0A0A',
  white: '#FFFFFF',
  red: '#E5232B',
  alert: '#FF3333', // único acento do vídeo Google (pico de mortalidade)
  platinum: '#C9CDD2',
  gray: '#2A2A2A',
  grayLight: '#8A8A8A',
} as const;

export const fonts = {
  heading: '"Archivo Black", "Helvetica Neue", Arial, sans-serif',
  body: '"Inter", "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
} as const;

export const video = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;
