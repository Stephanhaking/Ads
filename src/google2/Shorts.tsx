import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg, FPS, INK, Lines, RED, clamp} from '../feudal/Common';
import {TornDefs} from '../feudal/StyleV2';
import {Beat, VertCtx, fit} from './GoogleV2';
import {GBEATS} from './beats';
import type {GBeat} from './beats';
import {SCENES} from '../feudal/script';
import {SceneView} from '../feudal/Scenes';
import {starts as FSTARTS} from '../feudal/FeudalVideo';
import {TOTAL as FTOTAL} from '../feudal/words';

export type ShortDef = {t0: number; t1: number; tag: string};
export const SHORTS: Record<string, ShortDef> = {
  S1: {t0: 56.9, t1: 90.9, tag: 'WHO DIES NEXT?'},
  S2: {t0: 539.7, t1: 596.2, tag: 'THE FILM GOOGLE MADE'},
  S3: {t0: 389.0, t1: 409.2, tag: 'WHO PAYS?'},
};
export const shortFrames = (k: string) => Math.round((SHORTS[k].t1 - SHORTS[k].t0) * FPS);

const RIGHT = new Set(['img', 'obj', 'stock', 'clock', 'doors']);

// parte cada linha do beat em linhas curtas (≤ max letras) para o texto ficar grande no formato vertical
const wrapLines = (L: string[], hot: number[], max: number) => {
  const lines: string[] = [], h: number[] = [];
  L.forEach((l, i) => {
    let cur = '';
    l.split(' ').forEach((w) => {
      if (cur && (cur + ' ' + w).length > max) { lines.push(cur); if (hot.includes(i)) h.push(lines.length - 1); cur = w; } else cur = cur ? cur + ' ' + w : w;
    });
    if (cur) { lines.push(cur); if (hot.includes(i)) h.push(lines.length - 1); }
  });
  return {lines, hot: h};
};
const vsize = (lines: string[], max: number) => Math.min(max, Math.floor(960 / (Math.max(...lines.map((x) => x.length), 1) * 0.7)));

const VBeat: React.FC<{b: GBeat}> = ({b}) => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: FPS, config: {damping: 15, stiffness: 220, mass: 0.7}});
  const L = b.L ?? [];
  // zoom (em vez de transform) não cria contexto de empilhamento: os objetos continuam a "multiplicar" sobre o papel
  const win = (x0: number, sc: number) => {
    const z = sc * (0.95 + 0.05 * pop);
    return (
      <div style={{position: 'absolute', left: 0, top: 130, width: 1080, height: 1080, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -x0, top: 0, width: 1920, height: 1080, zoom: z} as React.CSSProperties}>
          <Beat b={b} />
        </div>
      </div>
    );
  };
  const cap = wrapLines(L, b.hot ?? [], 15);
  const big = wrapLines(L, b.hot ?? [], 12);
  return (
    <VertCtx.Provider value>
      {b.k === 'big' && (
        <div style={{position: 'absolute', left: 0, top: 480, width: 1080}}>
          <Lines lines={big.lines} times={big.lines.map((_, i) => 0.1 + i * 0.28)} x={60} y={0} size={vsize(big.lines, 150)} theme="paper" hot={big.hot} width={960} />
        </div>
      )}
      {b.k === 'count' && <div style={{position: 'absolute', left: 0, top: 560, width: 1920, height: 1080, zoom: 0.5625} as React.CSSProperties}><Beat b={b} /></div>}
      {b.k === 'chase' && win(420, 1.0)}
      {RIGHT.has(b.k) && win(990, 1.22)}
      {RIGHT.has(b.k) || b.k === 'chase' ? (
        <Lines lines={cap.lines} times={cap.lines.map((_, i) => 0.12 + i * 0.26)} x={60} y={1250} size={vsize(cap.lines, 124)} theme="paper" hot={cap.hot} width={960} />
      ) : null}
    </VertCtx.Provider>
  );
};

export const GShort: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame();
  const {t0, t1, tag} = SHORTS[id];
  const dur = shortFrames(id);
  const beats = GBEATS.map((b, i) => ({b, e: i + 1 < GBEATS.length ? GBEATS[i + 1].s : 831}));
  const cta = interpolate(f, [dur - 90, dur - 70], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      <Sequence from={-Math.round(t0 * FPS)} layout="none">
        {beats.filter(({b, e}) => e > t0 && b.s < t1).map(({b, e}, i) => (
          <Sequence key={i} from={Math.round(b.s * FPS)} durationInFrames={Math.max(1, Math.round((e - b.s) * FPS))} layout="none">
            <VBeat b={b} />
          </Sequence>
        ))}
        <Audio src={staticFile('audio/google2/voice.wav')} />
      </Sequence>
      <Audio src={staticFile('audio/music/distinguish.mp3')} volume={(g) => 0.12 * interpolate(g, [0, 30, dur - 30, dur], [0, 1, 1, 0], clamp)} />
      <div style={{position: 'absolute', left: 60, top: 54, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 8, color: INK}}>
        <span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: RED, marginRight: 14, opacity: 0.4 + 0.6 * (Math.floor(f / 15) % 2)}} />DISTINGUISH · {tag}
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(f / dur) * 100}%`, background: RED}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', opacity: cta, fontFamily: fonts.heading, fontSize: 52, color: '#fff'}}>
        <span style={{background: RED, padding: '14px 34px'}}>FULL VIDEO ON THE CHANNEL</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Shorts do Feudalismo: a cena horizontal original é mostrada em duas janelas (texto em cima, imagem em baixo) ──
export const FSHORTS: Record<string, ShortDef> = {
  F1: {t0: 0, t1: 50.9, tag: 'YOU PAY RENT'},
  F2: {t0: 374.9, t1: 413.4, tag: 'A DIGITAL SERF'},
  F3: {t0: 610.3, t1: 651.6, tag: 'THE CONTRACT CHANGES'},
};
export const fshortFrames = (k: string) => Math.round((FSHORTS[k].t1 - FSHORTS[k].t0) * FPS);

const FScene: React.FC<{i: number}> = ({i}) => {
  const sc = SCENES[i];
  const win = (style: React.CSSProperties, x0: number, y0: number, z: number) => (
    <div style={{position: 'absolute', left: 0, width: 1080, overflow: 'hidden', ...style}}>
      <div style={{position: 'absolute', left: -x0, top: -y0, width: 1920, height: 1080, zoom: z} as React.CSSProperties}>
        <SceneView sc={sc} start={FSTARTS[i]} figNo={i + 1} />
      </div>
    </div>
  );
  return (
    <>
      {win({top: 110, height: 860}, 0, 0, 1.1)}
      {win({top: 940, height: 940}, 880, 120, 1.03)}
    </>
  );
};

export const FShort: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame();
  const {t0, t1, tag} = FSHORTS[id];
  const dur = fshortFrames(id);
  const cta = interpolate(f, [dur - 90, dur - 70], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#F2EADB'}}>
      <Sequence from={-Math.round(t0 * FPS)} layout="none">
        {SCENES.map((sc, i) => {
          const from = Math.round(FSTARTS[i] * FPS);
          const end = i + 1 < SCENES.length ? Math.round(FSTARTS[i + 1] * FPS) : Math.round((FTOTAL + 3) * FPS);
          if (end <= t0 * FPS || from >= t1 * FPS) return null;
          return <Sequence key={i} from={from} durationInFrames={Math.max(1, end - from)} layout="none"><FScene i={i} /></Sequence>;
        })}
        <Audio src={staticFile('audio/feudal/voice.wav')} />
      </Sequence>
      <Audio src={staticFile('audio/music/distinguish.mp3')} volume={(g) => 0.12 * interpolate(g, [0, 30, dur - 30, dur], [0, 1, 1, 0], clamp)} />
      <div style={{position: 'absolute', left: 60, top: 44, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 8, color: INK}}>
        <span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: RED, marginRight: 14, opacity: 0.4 + 0.6 * (Math.floor(f / 15) % 2)}} />DISTINGUISH · {tag}
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(f / dur) * 100}%`, background: RED}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', opacity: cta, fontFamily: fonts.heading, fontSize: 52, color: '#fff'}}>
        <span style={{background: RED, padding: '14px 34px'}}>FULL VIDEO ON THE CHANNEL</span>
      </div>
    </AbsoluteFill>
  );
};
