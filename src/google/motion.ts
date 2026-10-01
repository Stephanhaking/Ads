import {Easing} from 'remotion';

// Presets de animação centralizados. Ajusta a velocidade de tudo mudando só SPEED_MULTIPLIER.
// 1 = normal · 1.25 = 25% mais rápido · 0.8 = mais lento.
export const SPEED_MULTIPLIER = 1;

// Configs de `spring` (damping alto = menos elástico).
export const POP = {damping: 10, stiffness: 170}; // caixas de texto: pop elástico rápido
export const BAR = {damping: 14, stiffness: 90}; // barras de dados: sobe com leve overshoot
export const SOFT = {damping: 18}; // entradas suaves

// Easing para interpolate (contadores, reveals, transições).
export const EASE_OUT = Easing.out(Easing.cubic);
export const EASE_IN_OUT = Easing.inOut(Easing.cubic);

// Transição entre cenas (fade cruzado + deslize lateral).
export const TRANSITION_FRAMES = 12;
export const TRANSITION_SLIDE_PX = 60;

// Zoom lento no midground (push-in).
export const PUSH_IN_MAX = 0.06;
export const PUSH_IN_FRAMES = 600;

// Frame "efetivo" de uma animação que começa em `appearAt`, com a velocidade aplicada.
export const motionFrame = (frame: number, appearAt = 0) => (frame - appearAt) * SPEED_MULTIPLIER;

// Efeitos sonoros (sintetizados por tools/gen_sfx.py). Desligar tudo: SFX_ENABLED = false.
// Desligados até haver SFX reais: os sintetizados não combinavam com o vídeo.
export const SFX_ENABLED = false;
export const SFX_VOLUME = {whoosh: 0.35, pop: 0.22, tick: 0.18, hit: 0.55, stamp: 0.5} as const;
