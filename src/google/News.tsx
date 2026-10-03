import React from 'react';
import {Easing, interpolate, OffthreadVideo, staticFile, useVideoConfig as useRealConfig, useCurrentFrame as useRealFrame} from 'remotion';
import {useCurrentFrame} from '../timeline';
import {Tag} from './Vox';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Excerto de notícia real (KGUN 9, Tucson) usado como gancho antes da locução.
export const PREROLL_SEC = 12.6;
export const NewsPreroll: React.FC = () => {
  const f = useRealFrame();
  const {fps, durationInFrames} = useRealConfig();
  const t = f / fps;
  const push = interpolate(f, [0, durationInFrames], [1, 1.16], clamp);
  const vol = interpolate(f, [0, 0.3 * fps, durationInFrames - 1.1 * fps, durationInFrames - 0.4 * fps], [0, 1, 1, 0], clamp);
  // nos últimos 2 s a notícia "transforma-se" no estilo do filme: p&b, trama de halftone e tinta vermelha
  const k = interpolate(f, [durationInFrames - 2.2 * fps, durationInFrames - 0.3 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <div style={{position: 'absolute', inset: 0, background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`}}>
        <OffthreadVideo src={staticFile('google/news/kgun.mp4')} volume={vol} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `grayscale(${k * 0.9}) contrast(${1 + k * 0.15}) brightness(${1 - k * 0.12})`}} />
        <div style={{position: 'absolute', inset: 0, opacity: k, backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.55) 1.4px, transparent 1.9px)', backgroundSize: '8px 8px', mixBlendMode: 'multiply'}} />
        <div style={{position: 'absolute', inset: 0, background: '#E5232B', opacity: k * 0.4, mixBlendMode: 'multiply'}} />
      </div>
      <PrerollTag at={1.0 * fps} />
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 220px rgba(0,0,0,0.55)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: '#E5232B', width: `${(t / PREROLL_SEC) * 100}%`}} />
    </div>
  );
};
const PrerollTag: React.FC<{at: number}> = ({at}) => {
  const f = useRealFrame();
  const {fps} = useRealConfig();
  // a Tag usa a escala de 30 fps → converter
  return <PrerollTagInner at={(f * 30) / fps >= 0 ? (at * 30) / fps : 0} />;
};
const PrerollTagInner: React.FC<{at: number}> = ({at}) => <Tag text="Real broadcast · local TV news" appearAt={at} x={80} y={70} size={34} />;

type Rect = {x: number; y: number; w: number; h: number};
// Captura de ecrã real com zoom numa região e marcador de destaque (coordenadas em px da imagem recortada 1888×913).
export const RealShot: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  crop: Rect;
  at: number;
  hl?: {rect: Rect; at: number; color?: string}[];
  tilt?: number;
}> = ({src, x, y, w, crop, at, hl = [], tilt = 0}) => {
  const f = useCurrentFrame();
  const k = w / crop.w;
  const h = crop.h * k;
  const p = interpolate(f - at, [0, 16], [0, 1], {...clamp, easing: Easing.out(Easing.exp)});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${tilt}deg)`, boxShadow: '0 26px 60px rgba(0,0,0,0.38)', borderRadius: 10, overflow: 'hidden', background: '#fff'}}>
      <img src={staticFile(src)} style={{position: 'absolute', left: -crop.x * k, top: -crop.y * k, width: 1888 * k, height: 913 * k}} />
      {hl.map((o, i) => {
        const q = interpolate(f - o.at, [0, 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
        return (
          <div key={i} style={{position: 'absolute', left: (o.rect.x - crop.x) * k - 4, top: (o.rect.y - crop.y) * k, width: (o.rect.w * k + 8) * q, height: o.rect.h * k, background: o.color ?? '#FFE45C', mixBlendMode: 'multiply', opacity: 0.9}} />
        );
      })}
    </div>
  );
};
