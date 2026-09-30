import {AbsoluteFill, Sequence} from 'remotion';
import {SceneClimax, SceneEngine} from './google/scenes';

// Timecodes em segundos — provisórios até medir os WAVs (ver docs/storyboard_google_0-2min.md).
export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

export const GG_BEATS = [
  {id: 'climax', from: 34.6, to: 45.7, Component: SceneClimax},
  {id: 'engine', from: 69.8, to: 102.6, Component: SceneEngine},
] as const;

export const GG_TOTAL = s(GG_BEATS[GG_BEATS.length - 1].to);

export const GoogleVideo: React.FC = () => (
  <AbsoluteFill>
    {GG_BEATS.map(({id, from, to, Component}) => (
      <Sequence key={id} name={id} from={s(from)} durationInFrames={s(to) - s(from)}>
        <Component />
      </Sequence>
    ))}
  </AbsoluteFill>
);
