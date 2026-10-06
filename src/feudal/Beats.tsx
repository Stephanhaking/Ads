import React from 'react';
import {Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fonts} from '../styles';
import {LIFE, ObjArt, SHIPS, Waves} from './Collage';
import {FPS, INK, RED, clamp, ease} from './Common';
import type {Theme} from './Common';
import {Plate} from './StyleV2';
import type {Zoom} from './StyleV2';
import beatsData from './beats.json';

// Beats: cada cena é dividida em janelas de ≤5 s; cada janela tem UM visual ligado à frase (legenda curta + imagem/objeto).
export type Beat = {t0: number; t1: number; text: string; cap: string; view: {name: string; variant: number}};
export const BEATS = beatsData as unknown as Beat[][];
const ZOOMS: Zoom[] = [{s: 1, fx: 0.5, fy: 0.5}, {s: 1.9, fx: 0.3, fy: 0.38}, {s: 1.9, fx: 0.7, fy: 0.42}, {s: 2.3, fx: 0.5, fy: 0.62}];

const BeatView: React.FC<{b: Beat; fig: string; theme: Theme; k: number; noCap?: boolean}> = ({b, fig, theme, k, noCap}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const [kind, name] = b.view.name.split(':');
  const zoom = b.view.variant ? ZOOMS[b.view.variant % 4] : undefined;
  const tilt = (k % 2 ? 1 : -1) * 2.2;
  const life = LIFE[name]?.(t);
  if (kind === 'img') return <Plate name={name} fig={fig} cap={noCap ? '' : b.cap} tilt={tilt} x={1010} y={150} w={830} h={720} at={0} zoom={zoom} bare={theme === 'paper'} />;
  // objeto
  const p = interpolate(t, [0, 0.45], [0, 1], {...clamp, easing: ease});
  const plate = theme === 'dark' || theme === 'red';
  const size = 640;
  return (
    <div style={{position: 'absolute', left: 1030, top: 150, width: 800, height: 740, overflow: 'hidden', opacity: p, mixBlendMode: plate ? 'normal' : 'multiply', transform: `translateX(${(1 - p) * 200}px) rotate(${(1 - p) * 7}deg)`}}>
      {name === 'saracen-dhow' && <Waves />}
      <div style={{position: 'absolute', left: 80, top: 20, transform: `translateY(${Math.sin(t * 1.4) * 8}px) ${life?.transform ?? ''}`, transformOrigin: life?.origin}}>
        <ObjArt name={name} size={size} plate={plate} zoom={zoom} />
      </div>
      {zoom && <div style={{position: 'absolute', left: 80 + size * zoom.fx - 120, top: 20 + size * zoom.fy - 120, width: 240, height: 240, borderRadius: '50%', border: `10px solid ${RED}`, opacity: interpolate(t, [0.3, 0.6], [0, 1], clamp)}} />}
      {!noCap && <div style={{position: 'absolute', right: 10, bottom: 10, background: RED, color: '#fff', fontFamily: fonts.heading, fontSize: 36, textTransform: 'uppercase', padding: '8px 22px', boxShadow: `6px 6px 0 ${INK}`}}>{b.cap}</div>}
    </div>
  );
};

export const BeatStage: React.FC<{sceneIdx: number; start: number; theme: Theme; after?: number; noCap?: boolean}> = ({sceneIdx, start, theme, after = 0, noCap}) => {
  const beats = BEATS[sceneIdx] ?? [];
  return (
    <>
      {beats.map((b, k) => {
        if (b.t1 - start <= after + 0.3) return null;
        const t0 = Math.max(b.t0, start + after);
        const from = Math.max(0, Math.round((t0 - start) * FPS));
        const dur = Math.max(1, Math.round((b.t1 - t0) * FPS));
        return (
          <Sequence key={k} from={from} durationInFrames={dur} layout="none">
            <BeatView b={b} fig={`FIG. ${sceneIdx + 1}.${k + 1}`} theme={theme} k={sceneIdx + k} noCap={noCap} />
          </Sequence>
        );
      })}
    </>
  );
};

// esconde os filhos depois de `end` segundos (tempo local da cena)
export const Until: React.FC<{end: number; children: React.ReactNode}> = ({end, children}) => {
  const f = useCurrentFrame();
  return f / FPS < end ? <>{children}</> : null;
};

// legenda grande à esquerda para as janelas depois da primeira nas cenas com cartão (stat/quote/compare/books)
export const BeatCaption: React.FC<{sceneIdx: number; start: number; after: number; theme: Theme}> = ({sceneIdx, start, after, theme}) => {
  const beats = BEATS[sceneIdx] ?? [];
  return (
    <>
      {beats.map((b, k) => {
        if (b.t1 - start <= after + 0.3) return null;
        const t0 = Math.max(b.t0, start + after);
        const from = Math.max(0, Math.round((t0 - start) * FPS));
        const dur = Math.max(1, Math.round((b.t1 - t0) * FPS));
        return (
          <Sequence key={k} from={from} durationInFrames={dur} layout="none">
            <Cap text={b.cap} theme={theme} />
          </Sequence>
        );
      })}
    </>
  );
};
const Cap: React.FC<{text: string; theme: Theme}> = ({text, theme}) => {
  const f = useCurrentFrame();
  const p = interpolate(f / FPS, [0, 0.35], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: 110, top: 250, width: 860, fontFamily: fonts.heading, fontSize: 104, lineHeight: 1.04, textTransform: 'uppercase', color: theme === 'paper' ? INK : '#fff', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>{text}</div>
  );
};
