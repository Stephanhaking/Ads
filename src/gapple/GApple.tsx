import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {Bg, FPS, clamp} from '../feudal/Common';
import {TornDefs} from '../feudal/StyleV2';
import {Beat} from '../google2/GoogleV2';
import {TransitionAt, punchStyle, rollStyle} from '../google2/Transitions';
import words from './words.json';
import {GABEATS, GA_END} from './beats';

export const GA_FRAMES = Math.ceil((words as {total: number}).total * FPS) + 30;

export const GApple: React.FC = () => {
  const frame = useCurrentFrame();
  const punches = GABEATS.filter((b) => b.tr === 'punch').map((b) => b.s);
  const rolls = GABEATS.filter((b) => b.tr === 'roll').map((b) => b.s);
  return (
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      <AbsoluteFill style={{...punchStyle(frame, punches), ...rollStyle(frame, rolls)}}>
        {GABEATS.map((b, i) => {
          const e = i + 1 < GABEATS.length ? GABEATS[i + 1].s : GA_END;
          return (
            <Sequence key={i} from={Math.round(b.s * FPS)} durationInFrames={Math.max(1, Math.round((e - b.s) * FPS))} layout="none">
              <Beat b={b} />
              {(b.k === 'img' || b.k === 'obj') && !b.tr && <Audio src={staticFile('audio/sfx/whoosh-b.wav')} volume={0.18} />}
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {GABEATS.filter((b) => b.tr).map((b, i) => <TransitionAt key={i} at={b.s} kind={b.tr!} />)}
      <Audio src={staticFile('audio/gapple/voice.wav')} />
      <Audio src={staticFile('audio/music/distinguish.mp3')} volume={(f) => 0.15 * interpolate(f, [0, 90], [0, 1], clamp)} />
    </AbsoluteFill>
  );
};
