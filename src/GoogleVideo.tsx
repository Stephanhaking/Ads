import {Audio, AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  SceneAnon,
  SceneBuilding,
  SceneClimax,
  SceneData,
  SceneEngine,
  SceneFile,
  SceneHospital,
  SceneNever,
  SceneNotes,
  ScenePaper,
  SceneQuestion,
  SceneReadAll,
  SceneRecords,
  SceneYear,
} from './google/scenes';
import {colors} from './styles';
import {MASTER_FILE, MUSIC_FILE, PARAGRAPHS, est, mapTime, paragraphStart} from './google/timing';
import * as A from './google/scenes2';
import {RedWipe} from './google/Fx';
import {SFX_ENABLED, SFX_VOLUME} from './google/motion';

// Timecodes em segundos na timeline estimada; `s()` converte-os para o tempo real da locução
// (src/google/timing.json, atualizado por `npm run measure`).
// Cada cena começa onde a anterior acaba.
export const FPS = 60; // fps real do render (as animações correm numa escala de 30 fps — ver src/timeline.ts)
export const s = (sec: number) => Math.round(mapTime(sec) * FPS);

type Beat = {id: string; from: number; to: number; Component: React.FC};
const BEATS_1: Beat[] = [
  {id: 'hospital', from: 0, to: 16, Component: SceneHospital},
  {id: 'year', from: 16, to: 20.3, Component: SceneYear},
  {id: 'records', from: 20.3, to: 34.6, Component: SceneRecords},
  {id: 'climax', from: 34.6, to: 45.7, Component: SceneClimax},
  {id: 'paper', from: 45.7, to: 54, Component: ScenePaper},
  {id: 'question', from: 54, to: 60, Component: SceneQuestion},
  {id: 'building', from: 60, to: 69.8, Component: SceneBuilding},
  {id: 'engine', from: 69.8, to: 102.6, Component: SceneEngine},
  {id: 'readAll', from: 102.6, to: 111, Component: SceneReadAll},
  {id: 'notes', from: 111, to: 121.2, Component: SceneNotes},
  {id: 'data', from: 121.2, to: 130.4, Component: SceneData},
  {id: 'anon', from: 130.4, to: 144.8, Component: SceneAnon},
  {id: 'file', from: 144.8, to: 156.1, Component: SceneFile},
  {id: 'never', from: 156.1, to: 161.2, Component: SceneNever},
];


// Beats dos Atos III–VIII: [id, parágrafo, início (s), fim (s | 'end' = início do parágrafo seguinte), cena].
const para = (id: string) => PARAGRAPHS.findIndex((p) => p.id === id);
const nextStart = (id: string) => {
  const i = para(id);
  return i + 1 < PARAGRAPHS.length ? PARAGRAPHS[i + 1].estStart : PARAGRAPHS[i].estStart + PARAGRAPHS[i].estSec;
};
const mk = (id: string, par: string, a: number, b: number | 'end', Component: React.FC): Beat => ({id, from: est(par, a), to: b === 'end' ? nextStart(par) : est(par, b), Component});
const BEATS_2: Beat[] = [
  mk('a3-years', 'a3', 0, 8.5, A.A3Years), mk('a3-measure', 'a3', 8.5, 20.6, A.A3Measure), mk('a3-bet', 'a3', 20.6, 34.1, A.A3Bet), mk('a3-money', 'a3', 34.1, 42.2, A.A3Money), mk('a3-flow', 'a3', 42.2, 'end', A.A3Flow),
  mk('a4-pred', 'a4', 0, 6.9, A.A4Prediction), mk('a4-certain', 'a4', 6.9, 17.0, A.A4Certain), mk('a4-nudges', 'a4', 17.0, 25.2, A.A4Nudges), mk('a4-fortune', 'a4', 25.2, 33.6, A.A4Fortune), mk('a4-loop', 'a4', 33.6, 'end', A.A4Loop),
  mk('a5-open', 'a5a', 0, 13.0, A.A5Open), mk('a5-question', 'a5a', 13.0, 21.4, A.A5Question), mk('a5-seventy', 'a5a', 21.4, 32.5, A.A5Seventy), mk('a5-hours', 'a5a', 32.5, 41.9, A.A5Hours), mk('a5-autoplay', 'a5a', 41.9, 'end', A.A5Autoplay),
  mk('a5-ledger0', 'a5b', 0, 10.0, A.A5Ledger0), mk('a5-ledger1', 'a5b', 10.0, 22.9, A.A5Ledger1), mk('a5-pop', 'a5b', 22.9, 34.0, A.A5Populations), mk('a5-leaked', 'a5b', 34.0, 41.6, A.A5Leaked), mk('a5-machine', 'a5b', 41.6, 'end', A.A5Machine),
  mk('a6-apparatus', 'a6', 0, 19.3, A.A6Apparatus), mk('a6-signin', 'a6', 19.3, 26.0, A.A6SignIn), mk('a6-default', 'a6', 26.0, 31.6, A.A6Default), mk('a6-court', 'a6', 31.6, 'end', A.A6Court),
  mk('a7-mouth', 'a7', 0, 8.8, A.A7Mouth), mk('a7-record', 'a7', 8.8, 18.0, A.A7Record), mk('a7-question', 'a7', 18.0, 25.7, A.A7Question), mk('a7-glass', 'a7', 25.7, 'end', A.A7Glass),
  mk('a8-free', 'a8', 0, 7.6, A.A8Free), mk('a8-sells', 'a8', 7.6, 17.0, A.A8Sells), mk('a8-alert', 'a8', 17.0, 25.7, A.A8Alert), mk('a8-incentive', 'a8', 25.7, 35.4, A.A8Incentive), mk('a8-meter', 'a8', 35.4, 44.7, A.A8Meter), mk('a8-next', 'a8', 44.7, 'end', A.A8Next),
  mk('last', 'last', 0, 'end', A.EndLast), mk('sign', 'sign', 0, 1.62, A.EndSign),
];

export const GG_BEATS: Beat[] = [...BEATS_1, ...BEATS_2];

export const GG_TOTAL = s(GG_BEATS[GG_BEATS.length - 1].to); // fim da última cena, já re-mapeado para a locução

// Música de fundo: volume baixo, com fade de entrada e saída.
const Music: React.FC = () => {
  const {durationInFrames, fps} = useVideoConfig();
  if (!MUSIC_FILE) return null;
  const vol = (f: number) =>
    0.12 * interpolate(f, [0, 2 * fps, durationInFrames - 3 * fps, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Audio src={staticFile(MUSIC_FILE)} volume={vol} />;
};

// Uma faixa de locução por parágrafo, colocada no início medido de cada um.
const Voice: React.FC = () => {
  // Master único começa no frame 0; os tempos dos parágrafos vêm do timecodes_google.json.
  if (MASTER_FILE) return <Audio src={staticFile(MASTER_FILE)} />;
  return (
  <>
    {PARAGRAPHS.map((p, i) =>
      p.file ? (
        <Sequence key={p.id} name={`voice-${p.id}`} from={Math.round(paragraphStart(i) * FPS)}>
          <Audio src={staticFile(p.file)} />
        </Sequence>
      ) : null,
    )}
  </>
  );
};

export const GoogleVideo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: colors.black}}>
    <Voice />
    <Music />
    {GG_BEATS.map(({id, from, to, Component}) => (
      <Sequence key={id} name={id} from={s(from)} durationInFrames={s(to) - s(from)}>
        <Component />
      </Sequence>
    ))}
    {/* wipe vermelho a cobrir cada corte (dura 18 frames; o corte acontece a meio) */}
    {GG_BEATS.slice(1).map(({id, from}) => (
      <Sequence key={`wipe-${id}`} name={`wipe-${id}`} from={s(from) - FPS * 0.3} durationInFrames={FPS * 0.6}>
        <RedWipe />
        {SFX_ENABLED ? <Audio src={staticFile('audio/sfx/whoosh.wav')} volume={SFX_VOLUME.whoosh} /> : null}
      </Sequence>
    ))}
  </AbsoluteFill>
);
