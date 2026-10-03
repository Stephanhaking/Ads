import React from 'react';
import {Easing, interpolate, OffthreadVideo, staticFile} from 'remotion';
import {useCurrentFrame, useVideoConfig} from '../timeline';
import {colors} from '../styles';
import {KineticText} from './Fx';
import {LayeredScene} from './Layers';
import {Shell} from './scenes';
import {useA} from './beat';
import {ThemeName} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const RED = '#E5232B';

export type ClipSpec = {
  name: string;
  from: string | number; // frase-âncora (início do clip) ou segundos no parágrafo
  to: string; // frase-âncora do fim, ou 'end' (fim do beat)
  layout?: 'wide' | 'portrait';
  theme?: ThemeName;
  lines: string[][];
  words: string[]; // frase da locução que faz entrar cada palavra
  hot?: string[];
};

// Vídeo de stock com tratamento Vox: p&b suave, trama de halftone, contorno branco e sombra deslocada.
const Treated: React.FC<{name: string; x: number; y: number; w: number; h: number; tilt: number; shadow: string; at?: number}> = ({name, x, y, w, h, tilt, shadow, at = 0}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.exp)});
  const push = 1 + 0.0007 * Math.max(0, f - at);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: p, transform: `translateX(${(1 - p) * 120}px) rotate(${tilt}deg)`}}>
      <div style={{position: 'absolute', inset: 0, background: shadow, transform: 'translate(22px, 22px)'}} />
      <div style={{position: 'absolute', inset: 0, border: '10px solid #fff', background: '#000', overflow: 'hidden'}}>
        <OffthreadVideo
          src={staticFile(`google/stock/${name}.mp4`)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.85) contrast(1.12) brightness(0.96)', transform: `scale(${push})`}}
        />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.5) 1.3px, transparent 1.8px)', backgroundSize: '8px 8px', mixBlendMode: 'multiply'}} />
        <div style={{position: 'absolute', inset: 0, background: RED, opacity: 0.16, mixBlendMode: 'multiply'}} />
      </div>
    </div>
  );
};

export const StockScene: React.FC<ClipSpec> = ({name, layout = 'wide', theme = 'paper', lines, words, hot = []}) => {
  const {w, T} = useA();
  const portrait = layout === 'portrait';
  const longest = Math.max(...lines.map((l) => l.join(' ').length));
  const avail = portrait ? 1000 : 700;
  const size = Math.min(140, Math.floor(avail / (longest * 0.68)));
  const shadow = theme === 'red' ? '#111' : RED;
  return (
    <Shell theme={theme} grain={0.3}>
      <LayeredScene
        mid={
          portrait ? (
            <Treated name={name} x={1230} y={140} w={470} h={836} tilt={1.2} shadow={shadow} at={w(words[0], 0.3)} />
          ) : (
            <Treated name={name} x={900} y={260} w={920} h={518} tilt={-1.2} shadow={shadow} at={0} />
          )
        }
        fore={<KineticText lines={lines} x={110} y={portrait ? 260 : 300} size={size} times={T(...words)} hot={hot} />}
      />
    </Shell>
  );
};

// Fundo de vídeo em ecrã inteiro (final do filme), escurecido para a tipografia respirar.
export const StockBg: React.FC<{name: string}> = ({name}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const push = interpolate(f, [0, durationInFrames], [1, 1.1], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, background: colors.black, overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(`google/stock/${name}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.7) contrast(1.15) brightness(0.65)', transform: `scale(${push})`}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.45) 1.3px, transparent 1.8px)', backgroundSize: '8px 8px', mixBlendMode: 'multiply'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.1) 70%)'}} />
    </div>
  );
};
