import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg, FPS, INK, RED, clamp} from '../feudal/Common';
import {TornDefs} from '../feudal/StyleV2';
import {VBeat} from '../google2/Shorts';
import type {GBeat} from '../google2/beats';
import awords from './shortsWords.json';
import abeats from './shortsBeats.json';

// Shorts ORIGINAIS do Google-Apple (A1–A4): guião, voz e batidas próprios (tools/gapple_shorts_build.py); não são cortes do vídeo longo
export const AS_IDS = ['A1', 'A2', 'A3', 'A4'] as const;
const AB = abeats as unknown as Record<string, GBeat[]>;
const AW = awords as unknown as Record<string, {tag: string; total: number}>;
export const ashortFrames = (k: string) => Math.ceil((AW[k].total + 1.2) * FPS);

export const AShort: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame();
  const dur = ashortFrames(id);
  const total = AW[id].total + 1.2;
  const bs = AB[id];
  const cta = interpolate(f, [dur - 66, dur - 50], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      {bs.map((b, i) => {
        const e = i + 1 < bs.length ? bs[i + 1].s : total;
        return (
          <Sequence key={i} from={Math.round(b.s * FPS)} durationInFrames={Math.max(1, Math.round((e - b.s) * FPS))} layout="none">
            <VBeat b={b} />
          </Sequence>
        );
      })}
      <Audio src={staticFile(`audio/gapple/shorts/${id}.wav`)} />
      <Audio src={staticFile('audio/music/distinguish.mp3')} volume={(g) => 0.12 * interpolate(g, [0, 30, dur - 30, dur], [0, 1, 1, 0], clamp)} />
      <div style={{position: 'absolute', left: 60, top: 54, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 8, color: INK}}>
        <span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: RED, marginRight: 14, opacity: 0.4 + 0.6 * (Math.floor(f / 15) % 2)}} />DISTINGUISH · {AW[id].tag}
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(f / dur) * 100}%`, background: RED}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', opacity: cta, fontFamily: fonts.heading, fontSize: 52, color: '#fff'}}>
        <span style={{background: RED, padding: '14px 34px'}}>FULL STORY ON THE CHANNEL</span>
      </div>
    </AbsoluteFill>
  );
};
