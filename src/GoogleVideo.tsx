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
import {MASTER_FILE, MUSIC_FILE, PARAGRAPHS, mapTime, paragraphStart} from './google/timing';
import {RedWipe} from './google/proto/Fx';

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
  {id: 'data', from: 121.2, to: 130.4, Component: SceneData},
  {id: 'anon', from: 130.4, to: 144.8, Component: SceneAnon},
  {id: 'file', from: 144.8, to: 156.1, Component: SceneFile},
  {id: 'never', from: 156.1, to: 161.2, Component: SceneNever},
] as const;

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
      <Sequence key={`wipe-${id}`} name={`wipe-${id}`} from={s(from) - 9} durationInFrames={18}>
        <RedWipe />
      </Sequence>
    ))}
  </AbsoluteFill>
);
