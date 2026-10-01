import React, {createContext, useContext} from 'react';

// Temas de fundo. `dark` é o original; `paper` (creme) e `red` (vermelho plano) são variantes Vox.
export type ThemeName = 'dark' | 'paper' | 'red';

export type Theme = {
  bg: string;
  grid: string;
  text: string; // texto grande
  textShadow: string;
  mono: string; // texto secundário
  disc: string; // círculo atrás do recorte
  tagBg: string;
  tagText: string;
  tagShadow: string;
  hotBg: string; // destaque
  hotText: string;
  hotShadow: string;
  barGray: string;
  grain: number; // opacidade do grão
  grainBlend: 'overlay' | 'multiply';
  vignette: number; // 0–1, força do vinhetado nos cantos
};

export const THEMES: Record<ThemeName, Theme> = {
  dark: {
    bg: '#0A0A0A', grid: '#2A2A2A', text: '#FFFFFF', textShadow: '#E5232B', mono: '#8A8A8A', disc: '#E5232B',
    tagBg: '#FFFFFF', tagText: '#0A0A0A', tagShadow: '#E5232B', hotBg: '#E5232B', hotText: '#FFFFFF', hotShadow: '#FFFFFF',
    barGray: '#8A8A8A', grain: 0.22, grainBlend: 'overlay', vignette: 0.75,
  },
  paper: {
    bg: '#E9E2D2', grid: 'rgba(10,10,10,0.08)', text: '#0A0A0A', textShadow: '#E5232B', mono: '#5B574D', disc: '#E5232B',
    tagBg: '#0A0A0A', tagText: '#FFFFFF', tagShadow: '#E5232B', hotBg: '#E5232B', hotText: '#FFFFFF', hotShadow: '#0A0A0A',
    barGray: '#0A0A0A', grain: 0.4, grainBlend: 'multiply', vignette: 0.22,
  },
  red: {
    bg: '#E5232B', grid: 'rgba(0,0,0,0.14)', text: '#FFFFFF', textShadow: '#0A0A0A', mono: 'rgba(255,255,255,0.8)', disc: '#0A0A0A',
    tagBg: '#FFFFFF', tagText: '#0A0A0A', tagShadow: '#0A0A0A', hotBg: '#0A0A0A', hotText: '#FFFFFF', hotShadow: '#FFFFFF',
    barGray: '#FFFFFF', grain: 0.3, grainBlend: 'multiply', vignette: 0.4,
  },
};

const Ctx = createContext<Theme>(THEMES.dark);
export const ThemeProvider: React.FC<{name: ThemeName; children: React.ReactNode}> = ({name, children}) => (
  <Ctx.Provider value={THEMES[name]}>{children}</Ctx.Provider>
);
export const useTheme = () => useContext(Ctx);
