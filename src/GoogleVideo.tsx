import {AbsoluteFill, Sequence} from 'remotion';
import {
  SceneBuilding,
  SceneClimax,
  SceneEngine,
  SceneHospital,
  ScenePaper,
  SceneQuestion,
  SceneReadAll,
  SceneRecords,
  SceneNotes,
  SceneYear,
} from './google/scenes';

// Timecodes em segundos — provisórios até medir os WAVs (ver docs/storyboard_google_0-2min.md).
// As cenas são contíguas: cada uma começa onde a anterior acaba.
export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

export const GG_BEATS = [
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
