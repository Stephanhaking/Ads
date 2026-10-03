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
import {Flash, RedWipe} from './google/Fx';
import {PhotoScene} from './google/photos';
import {FrameOffset} from './timeline';
import {NewsPreroll, PREROLL_SEC} from './google/News';
import {BeatProvider} from './google/beat';
import {wordTime} from './google/words';
import {SFX_ENABLED, SFX_VOLUME} from './google/motion';

// Timecodes em segundos na timeline estimada; `s()` converte-os para o tempo real da locução
// (src/google/timing.json, atualizado por `npm run measure`).
// Cada cena começa onde a anterior acaba.
export const FPS = 60; // fps real do render (as animações correm numa escala de 30 fps — ver src/timeline.ts)
export const s = (sec: number) => Math.round(mapTime(sec) * FPS);

type PhotoCut = {name: string; at: 'start' | 'end'; dur: number}; // dur em segundos (escala estimada = voz)
type Beat = {id: string; from: number; to: number; Component: React.FC; photos?: PhotoCut[]; par?: string; a?: number};
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
// a/b: segundos no parágrafo, ou uma frase (âncora em palavra: começa 0,15 s antes de ser dita).
const at = (par: string, v: number | string) => (typeof v === 'number' ? v : wordTime(par, v) - 0.15);
const mk = (id: string, par: string, a: number | string, b: number | string | 'end', Component: React.FC, photos?: PhotoCut[]): Beat => ({
  id,
  par,
  a: at(par, a),
  from: est(par, at(par, a)),
  to: b === 'end' ? nextStart(par) : est(par, at(par, b)),
  Component,
  photos,
});
const P = (name: string, at: 'start' | 'end', dur: number): PhotoCut => ({name, at, dur});
const BEATS_2: Beat[] = [
  mk('a3-years', 'a3', 0, 'a system that turns', A.A3Years, [P('a3-office', 'start', 5.0)]), mk('a3-measure', 'a3', 'a system that turns', 'on their own', A.A3Measure, [P('a3-phone-scroll', 'start', 6.1)]), mk('a3-bet', 'a3', 'on their own', 'last year alphabet', A.A3Bet, [P('a3-billboard', 'start', 3.8)]), mk('a3-money', 'a3', 'last year alphabet', 'the death algorithm', A.A3Money, [P('a3-banknotes', 'start', 4.4)]), mk('a3-flow', 'a3', 'the death algorithm', 'end', A.A3Flow),
  mk('a4-pred', 'a4', 0, 'if you know', A.A4Prediction, [P('a4-dial', 'start', 4.6)]), mk('a4-certain', 'a4', 'if you know', 'a default set here', A.A4Certain, [P('a4-chess', 'start', 4.6)]), mk('a4-nudges', 'a4', 'a default set here', 'accuracy is worth pennies', A.A4Nudges), mk('a4-fortune', 'a4', 'accuracy is worth pennies', 'so the machine drifts', A.A4Fortune, [P('a4-corridor', 'end', 2.8)]), mk('a4-loop', 'a4', 'so the machine drifts', 'end', A.A4Loop, [P('a4-bed-phone', 'start', 5.6)]),
  mk('a5-open', 'a5a', 0, 'not what does', A.A5Open, [P('a5-teen-phone', 'start', 7.2)]), mk('a5-question', 'a5a', 'not what does', 'by the company\'s', A.A5Question), mk('a5-seventy', 'a5a', 'by the company\'s', 'a billion hours', A.A5Seventy), mk('a5-hours', 'a5a', 'a billion hours', 'the surest way', A.A5Hours, [P('a5-clock', 'start', 2.0), P('a5-many-screens', 'end', 2.5)]), mk('a5-autoplay', 'a5a', 'the surest way', 'end', A.A5Autoplay, [P('a5-crowd-top', 'end', 2.8)]),
  mk('a5-ledger0', 'a5b', 0, 'in twenty sixteen', A.A5Ledger0), mk('a5-ledger1', 'a5b', 'in twenty sixteen', 'and it imagined', A.A5Ledger1, [P('a5-projector', 'start', 4.0)]), mk('a5-pop', 'a5b', 'and it imagined', 'when the film leaked', A.A5Populations), mk('a5-leaked', 'a5b', 'when the film leaked', 'but you don\'t sit', A.A5Leaked), mk('a5-machine', 'a5b', 'but you don\'t sit', 'end', A.A5Machine),
  mk('a6-apparatus', 'a6', 0, 'you downloaded all of it', A.A6Apparatus, [P('a6-laptop', 'start', 5.7), P('a6-hand-map', 'end', 2.0)]), mk('a6-signin', 'a6', 'you downloaded all of it', 'where google doesn\'t own', A.A6SignIn, [P('a6-handshake', 'end', 3.1)]), mk('a6-default', 'a6', 'where google doesn\'t own', 'in twenty twenty four', A.A6Default, [P('a6-vault', 'end', 2.2)]), mk('a6-court', 'a6', 'in twenty twenty four', 'end', A.A6Court, [P('a6-courthouse', 'start', 3.0), P('a6-gavel', 'end', 1.6)]),
  mk('a7-mouth', 'a7', 0, 'the largest record', A.A7Mouth), mk('a7-record', 'a7', 'the largest record', 'and exactly what you need', A.A7Record), mk('a7-question', 'a7', 'and exactly what you need', 'when a machine built', A.A7Question, [P('a7-night-typing', 'end', 1.9)]), mk('a7-glass', 'a7', 'when a machine built', 'it has stopped watching', A.A7Glass), mk('a7-stopped', 'a7', 'it has stopped watching', 'end', A.A7Glass, [P('a7-window', 'start', 3.1), P('a7-hand-glass', 'end', 3.55)]),
  mk('a8-free', 'a8', 0, 'it listens from', A.A8Free), mk('a8-sells', 'a8', 'it listens from', 'and it\'s grown so good', A.A8Sells), mk('a8-alert', 'a8', 'and it\'s grown so good', 'none of this needed', A.A8Alert, [P('a8-hospital-hall', 'start', 3.0)]), mk('a8-incentive', 'a8', 'none of this needed', 'you handed it over', A.A8Incentive, [P('a8-walk-away', 'start', 2.1)]), mk('a8-meter', 'a8', 'you handed it over', 'the most valuable thing', A.A8Meter, [P('a8-meter', 'end', 1.9)]), mk('a8-next', 'a8', 'the most valuable thing', 'end', A.A8Next, [P('a8-eye', 'start', 3.0)]),
  mk('last', 'last', 0, 'end', A.EndLast), mk('sign', 'sign', 0, 1.62, A.EndSign),
];

export const GG_BEATS: Beat[] = [...BEATS_1, ...BEATS_2];

// Segmentos reais: cada beat com fotos parte-se em [foto início] + [interface] + [foto fim].
type Segment = {par?: string; a?: number; skip?: number; id: string; from: number; to: number; kind: 'scene' | 'photo'; Component?: React.FC; photo?: string; offset?: number; wipe: boolean};
export const SEGMENTS: Segment[] = GG_BEATS.flatMap((b): Segment[] => {
  const startCut = b.photos?.find((p) => p.at === 'start');
  const endCut = b.photos?.find((p) => p.at === 'end');
  const f = b.from + (startCut?.dur ?? 0);
  const t = b.to - (endCut?.dur ?? 0);
  const out: Segment[] = [];
  if (t <= f) {
    // beat só com fotos (sem cena de interface)
    if (startCut) out.push({id: `${b.id}-photo-start`, from: b.from, to: f, kind: 'photo', photo: startCut.name, wipe: true});
    if (endCut) out.push({id: `${b.id}-photo-end`, from: f, to: b.to, kind: 'photo', photo: endCut.name, wipe: false});
    return out;
  }
  if (startCut) out.push({id: `${b.id}-photo-start`, from: b.from, to: f, kind: 'photo', photo: startCut.name, wipe: true});
  out.push({par: b.par, a: b.a, skip: startCut?.dur, id: b.id, from: f, to: t, kind: 'scene', Component: b.Component, offset: (startCut?.dur ?? 0) * 30, wipe: !startCut});
  if (endCut) out.push({id: `${b.id}-photo-end`, from: t, to: b.to, kind: 'photo', photo: endCut.name, wipe: false});
  return out;
});

const PRE = Math.round(PREROLL_SEC * FPS); // gancho: notícia real antes da locução
export const GG_TOTAL = PRE + s(GG_BEATS[GG_BEATS.length - 1].to); // fim da última cena, já re-mapeado para a locução

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
    <Sequence name="news-preroll" from={0} durationInFrames={PRE}>
      <NewsPreroll />
    </Sequence>
    <Sequence name="film" from={PRE}>
    <Voice />
    <Music />
    {SEGMENTS.map((g) => {
      const C = g.Component;
      return (
        <Sequence key={g.id} name={g.id} from={s(g.from)} durationInFrames={s(g.to) - s(g.from)}>
          {g.kind === 'photo' ? (
            <PhotoScene name={g.photo as string} />
          ) : (
            <BeatProvider par={g.par ?? 'a3'} a={g.a ?? 0} skip={g.skip}>
              <FrameOffset frames={g.offset ?? 0}>{C ? <C /> : null}</FrameOffset>
            </BeatProvider>
          )}
        </Sequence>
      );
    })}
    {/* wipe vermelho a cobrir os cortes entre ideias; flash curto nos cortes foto ↔ interface */}
    {SEGMENTS.slice(1).map((g) =>
      g.wipe ? (
        <Sequence key={`wipe-${g.id}`} name={`wipe-${g.id}`} from={s(g.from) - FPS * 0.3} durationInFrames={FPS * 0.6}>
          <RedWipe />
        </Sequence>
      ) : (
        <Sequence key={`flash-${g.id}`} name={`flash-${g.id}`} from={s(g.from)} durationInFrames={14}>
          <Flash at={0} />
        </Sequence>
      ),
    )}
    </Sequence>
    <Sequence name="wipe-into-film" from={PRE - FPS * 0.3} durationInFrames={FPS * 0.6}>
      <RedWipe />
    </Sequence>
  </AbsoluteFill>
);
