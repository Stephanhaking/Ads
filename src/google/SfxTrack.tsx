import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import cues from './sfxCues.json';

// Faixa de efeitos sonoros reais, dirigida pelo mapa (docs/SFX_MAP.md, gerado por tools/sfx_map.ts).
// Cada ficheiro tem o seu "pico" (s): o som é colocado para o pico cair no instante do corte/palavra.
export const SFX_TRACK_ENABLED = true;
const FPS = 60;
type Sample = {file: string; peak: number; vol: number};
const SAMPLES: Record<string, Sample> = {
  whooshA: {file: 'whoosh-a', peak: 0.52, vol: 0.6},
  whooshB: {file: 'whoosh-b', peak: 0.54, vol: 0.6},
  swoosh: {file: 'swoosh', peak: 0.27, vol: 0.4},
  click: {file: 'click', peak: 0.07, vol: 0.4},
  riser: {file: 'riser', peak: 3.03, vol: 0.5},
  building: {file: 'building', peak: 2.11, vol: 0.5},
  click2: {file: 'click2', peak: 0.04, vol: 0.4},
  paperFlip: {file: 'paper-flip', peak: 0.3, vol: 0.7},
  paperSlide: {file: 'paper-slide', peak: 0.33, vol: 1},
  writing: {file: 'writing', peak: 0.1, vol: 0.5},
  pop: {file: 'pop2', peak: 0.03, vol: 0.3},
  heart: {file: 'heart', peak: 0.4, vol: 0.5},
  riserHit: {file: 'riserhit', peak: 1.81, vol: 0.55},
  impact: {file: 'impact', peak: 0.07, vol: 0.55},
  stamp: {file: 'stamp-real', peak: 0.2, vol: 0.7},
  tick: {file: 'tick-real', peak: 0.08, vol: 0.5},
  monitor: {file: 'monitor', peak: 0.1, vol: 0.45},
};
type Cue = {t: number; sound: string; level: string; where: string};
type Play = {at: number; s: Sample; vol: number};

const plan = (): Play[] => {
  const out: Play[] = [];
  let lastWhoosh = -9;
  let alt = 0;
  for (const c of cues as Cue[]) {
    const snd = c.sound.split('+')[0];
    if (c.sound === 'RISER+IMPACT') {
      out.push({at: c.t - SAMPLES.riserHit.peak, s: SAMPLES.riserHit, vol: 1});
      continue;
    }
    if (snd === 'WHOOSH') {
      const peak = c.t + 0.15; // o mapa marca o início do wipe; o pico cai no corte
      if (peak - lastWhoosh < 1.2) continue; // máx. 1 whoosh por 1,2 s
      lastWhoosh = peak;
      const s = c.level === 'suave' ? SAMPLES.swoosh : alt++ % 2 ? SAMPLES.whooshB : SAMPLES.whooshA;
      out.push({at: peak - s.peak, s, vol: c.level === 'forte' ? 1.15 : 1});
    } else if (snd === 'RISER') {
      const peak = c.where.startsWith('Gancho KGUN') ? c.t + 2.0 : c.t; // o do gancho acaba no wipe para o filme
      const s = c.where.startsWith('Gancho KGUN') ? SAMPLES.riser : SAMPLES.building;
      out.push({at: peak - s.peak, s, vol: 1});
    } else if (snd === 'HIT_SOFT') out.push({at: c.t - SAMPLES.click.peak, s: SAMPLES.click, vol: 0.8});
    else if (snd === 'CLICK') out.push({at: c.t - SAMPLES.click2.peak, s: SAMPLES.click2, vol: 1});
    else if (snd === 'PAPER_FLIP') out.push({at: c.t - SAMPLES.paperFlip.peak, s: SAMPLES.paperFlip, vol: 1});
    else if (snd === 'PAPER_SLIDE' || snd === 'PAPER') out.push({at: c.t - SAMPLES.paperSlide.peak, s: SAMPLES.paperSlide, vol: 1});
    else if (snd === 'WRITING') out.push({at: c.t - SAMPLES.writing.peak, s: SAMPLES.writing, vol: 1});
    else if (snd === 'POP') out.push({at: c.t - SAMPLES.pop.peak, s: SAMPLES.pop, vol: 1});
    else if (snd === 'IMPACT' || snd === 'SILENCIO_DEPOIS_IMPACT') out.push({at: c.t - SAMPLES.impact.peak, s: SAMPLES.impact, vol: c.level === 'forte' ? 1.1 : 0.7});
    else if (snd === 'STAMP') out.push({at: c.t - SAMPLES.stamp.peak, s: SAMPLES.stamp, vol: 1});
    else if (snd === 'AMBIENTE_MONITOR') out.push({at: c.t - SAMPLES.heart.peak, s: SAMPLES.heart, vol: 0.45});
    else if (snd === 'BEEP_MONITOR') out.push({at: c.t - SAMPLES.monitor.peak, s: SAMPLES.monitor, vol: 1});
    else if (snd === 'TICK_RAPIDO') for (let k = 0; k < 9; k++) out.push({at: c.t + k * 0.11 - SAMPLES.tick.peak, s: SAMPLES.tick, vol: 0.45 + k * 0.04});
    else if (snd === 'TICK') for (const off of [0, 0.83, 1.75]) out.push({at: c.t + off - SAMPLES.tick.peak, s: SAMPLES.tick, vol: 1}); // predict · nudge · confirm
    // DRONE: à espera de ficheiro real
  }
  return out;
};
const PLAN = plan();

export const SfxTrack: React.FC = () => {
  if (!SFX_TRACK_ENABLED) return null;
  return (
    <>
      {PLAN.map((p, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(p.at * FPS))} layout="none">
          <Audio src={staticFile(`audio/sfx/${p.s.file}.wav`)} volume={p.s.vol * p.vol} />
        </Sequence>
      ))}
    </>
  );
};
export const SFX_PLAN_COUNT = PLAN.length;
