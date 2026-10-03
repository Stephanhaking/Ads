import React from 'react';
import {Audio, Sequence, interpolate, staticFile} from 'remotion';

// Cama musical: A (Ticking Shadows, 2:45) → B (distinguish, 1:24, em loop) → A outra vez.
// Tempos em segundos desde o início do filme (a seguir ao gancho). Fades cruzados para a emenda não se notar.
const FPS = 60;
type Seg = {src: string; at: number; len: number; startFrom: number; fadeIn: number; fadeOut: number; vol: number};
const A = 'audio/music/ticking-shadows.mp3';
const B = 'audio/music/distinguish.mp3';
const FILM_END = 472.2;
const SEGS: Seg[] = [
  {src: A, at: 0, len: 165, startFrom: 0, fadeIn: 3, fadeOut: 8, vol: 0.18}, // cold open → Ato III
  {src: B, at: 168, len: 84, startFrom: 0, fadeIn: 5, fadeOut: 4, vol: 0.2}, // Atos IV–V (tensão)
  {src: B, at: 248, len: 84, startFrom: 0, fadeIn: 4, fadeOut: 6, vol: 0.2}, // segunda passagem do B
  {src: A, at: 328, len: FILM_END - 328, startFrom: 20, fadeIn: 5, fadeOut: 6, vol: 0.15}, // Atos VI–VIII e fecho (mais baixo)
];

export const MusicBed: React.FC = () => (
  <>
    {SEGS.map((g, i) => {
      const n = Math.round(g.len * FPS);
      return (
        <Sequence key={i} from={Math.round(g.at * FPS)} durationInFrames={n} layout="none">
          <Audio
            src={staticFile(g.src)}
            startFrom={Math.round(g.startFrom * FPS)}
            volume={(f) => g.vol * interpolate(f, [0, g.fadeIn * FPS, n - g.fadeOut * FPS, n], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
          />
        </Sequence>
      );
    })}
  </>
);
