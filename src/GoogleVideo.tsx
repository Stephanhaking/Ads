import {Audio, AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  SceneBuilding,
  SceneClimax,
  SceneEngine,
  SceneHospital,
  SceneNotes,
  ScenePaper,
  SceneQuestion,
  SceneReadAll,
  SceneRecords,
  SceneYear,
} from './google/scenes';
import {colors} from './styles';
import {MUSIC_FILE, PARAGRAPHS, mapTime, paragraphStart} from './google/timing';
import {EASE_OUT, TRANSITION_FRAMES as T, TRANSITION_SLIDE_PX} from './google/motion';

// Timecodes em segundos na timeline estimada; `s()` converte-os para o tempo real da locução
// (src/google/timing.json, atualizado por `npm run measure`).
// Cada cena começa onde a anterior acaba.
export const FPS = 30;
export const s = (sec: number) => Math.round(mapTime(sec) * FPS);

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

export const GG_TOTAL = s(GG_BEATS[GG_BEATS.length - 1].to); // fim da última cena, já re-mapeado para a locução

// Entrada: fade + deslize lateral (exceto a 1.ª cena). Saída: só desliza, opaca, enquanto a seguinte entra por cima (crossfade sem mergulho).
const Transition: React.FC<{first: boolean; last: boolean; duration: number; children: React.ReactNode}> = ({first, last, duration, children}) => {
  const frame = useCurrentFrame();
  const opts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT} as const;
  const enter = first ? 1 : interpolate(frame, [0, T], [0, 1], opts);
  const dx =
    (first ? 0 : interpolate(frame, [0, T], [TRANSITION_SLIDE_PX, 0], opts)) +
    (last ? 0 : interpolate(frame, [duration - T, duration], [0, -TRANSITION_SLIDE_PX], opts));
  return <AbsoluteFill style={{opacity: enter, transform: `translateX(${dx}px)`}}>{children}</AbsoluteFill>;
};

// Música de fundo: volume baixo, com fade de entrada e saída.
const Music: React.FC = () => {
  const {durationInFrames, fps} = useVideoConfig();
  if (!MUSIC_FILE) return null;
  const vol = (f: number) =>
    0.12 * interpolate(f, [0, 2 * fps, durationInFrames - 3 * fps, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Audio src={staticFile(MUSIC_FILE)} volume={vol} />;
};

// Uma faixa de locução por parágrafo, colocada no início medido de cada um.
const Voice: React.FC = () => (
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

export const GoogleVideo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: colors.black}}>
    <Voice />
    <Music />
    {GG_BEATS.map(({id, from, to, Component}, i) => {
      const first = i === 0;
      const last = i === GG_BEATS.length - 1;
      // Começa exatamente no timecode; prolonga-se T frames por baixo da cena seguinte (que entra por cima).
      const duration = s(to) - s(from) + (last ? 0 : T);
      return (
        <Sequence key={id} name={id} from={s(from)} durationInFrames={duration}>
          <Transition first={first} last={last} duration={duration}>
            <Component />
          </Transition>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
