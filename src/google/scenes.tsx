import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../styles';
import {LayeredScene} from './Layers';
import {HalftoneImage} from './HalftoneImage';
import {Bar, Tag} from './Vox';
import {EASE_OUT, EASE_IN_OUT, SPEED_MULTIPLIER} from './motion';

// Cenas dos primeiros 2 minutos (ver docs/storyboard_google_0-2min.md). Estilo Vox.
// Tempos dentro de cada cena em segundos (multiplicados por fps).

const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {frame, fps, sec: frame / fps};
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT} as const;
const reveal = (frame: number, fps: number, secs = 1.2) =>
  interpolate(frame, [0, (secs * fps) / SPEED_MULTIPLIER], [0, 1], {...clamp, easing: EASE_IN_OUT});

const source: React.CSSProperties = {
  position: 'absolute',
  left: 140,
  bottom: 60,
  fontFamily: fonts.mono,
  fontSize: 24,
  letterSpacing: 3,
  color: colors.grayLight,
  textTransform: 'uppercase',
};

const Big: React.FC<{children: React.ReactNode; x: number; y: number; size?: number; opacity?: number}> = ({children, x, y, size = 200, opacity = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: fonts.heading, fontWeight: 900, fontSize: size, color: colors.white, lineHeight: 1, opacity, textShadow: `10px 10px 0 ${colors.red}`}}>
    {children}
  </div>
);

// 1 (0:00–0:16) — o momento em que o doente começa a morrer.
export const SceneHospital: React.FC = () => {
  const {frame, fps} = useT();
  return (
    <LayeredScene
      mid={<HalftoneImage name="hospital" x={600} y={220} width={1250} reveal={reveal(frame, fps, 1.6)} />}
      fore={
        <>
          <Tag text="The moment a patient begins to die" appearAt={1.5 * fps} x={110} y={90} size={38} />
          <Tag text="03:12 AM" appearAt={4 * fps} x={130} y={330} />
          <Tag text="100 small readings" appearAt={8 * fps} x={130} y={510} />
          <Tag text="Easy to miss" appearAt={11.5 * fps} x={130} y={690} fill />
        </>
      }
    />
  );
};

// 2 (0:16–0:20) — 2018.
export const SceneYear: React.FC = () => {
  const {fps} = useT();
  return (
    <LayeredScene
      mid={<HalftoneImage name="hospital" x={600} y={220} width={1250} opacity={0.22} />}
      fore={
        <>
          <Big x={330} y={250} size={440}>
            2018
          </Big>
          <Tag text="A machine learned to catch it first" appearAt={1.2 * fps} x={330} y={760} fill size={50} />
        </>
      }
    />
  );
};

// 3 (0:20–0:35) — 114 mil registos entram no modelo; "quem vai morrer?".
export const SceneRecords: React.FC = () => {
  const {frame, fps} = useT();
  const count = Math.round(interpolate(frame, [2 * fps, 7 * fps], [0, 114000], clamp));
  return (
    <LayeredScene
      mid={<HalftoneImage name="records" x={110} y={250} width={1000} reveal={reveal(frame, fps)} />}
      fore={
        <>
          <Tag text="Medical records" appearAt={0.8 * fps} x={130} y={110} />
          <Big x={1230} y={250} size={150}>
            {count.toLocaleString('en-US')}
          </Big>
          <div style={{position: 'absolute', left: 1230, top: 420, fontFamily: fonts.mono, fontSize: 38, letterSpacing: 8, color: colors.platinum}}>PATIENTS</div>
          <Tag text="Artificial intelligence" appearAt={7.5 * fps} x={1230} y={560} size={40} />
          <Tag text="Who, in this building," appearAt={10 * fps} x={1230} y={700} fill size={44} />
          <Tag text="is going to die?" appearAt={10.6 * fps} x={1230} y={800} fill size={44} />
        </>
      }
    />
  );
};

// 4 (0:35–0:46) — 95% vs. score clínico tradicional.
export const SceneClimax: React.FC = () => {
  const {frame, fps} = useT();
  return (
    <LayeredScene
      mid={<HalftoneImage name="doctor" x={150} y={240} width={470} reveal={reveal(frame, fps)} />}
      fore={
        <>
          <Tag text="Who will die?" appearAt={0.8 * fps} x={150} y={110} fill />
          <Bar label="Early Warning Score" value={85} appearAt={2.5 * fps} x={930} color={colors.grayLight} />
          <Bar label="Google AI" value={95} appearAt={4 * fps} x={1330} color={colors.red} />
          <Tag text="Earlier than the nurses" appearAt={7 * fps} x={930} y={110} size={38} />
          <div style={source}>Source: Nature · 2018</div>
        </>
      }
    />
  );
};

// 5 (0:46–0:54) — publicado numa revista médica.
export const ScenePaper: React.FC = () => {
  const {frame, fps} = useT();
  return (
    <LayeredScene
      mid={<HalftoneImage name="paper" x={120} y={260} width={1100} reveal={reveal(frame, fps)} />}
      fore={
        <>
          <Tag text="Published in a medical journal" appearAt={0.8 * fps} x={120} y={110} size={40} />
          <Tag text="Nature" appearAt={2.5 * fps} x={1330} y={400} size={56} />
          <Tag text="May 2018" appearAt={4 * fps} x={1330} y={540} fill size={56} />
        </>
      }
    />
  );
};

// 6 (0:54–1:00) — "porque é que uma empresa de anúncios sabe quando vais morrer?"
export const SceneQuestion: React.FC = () => {
  const {frame, fps} = useT();
  return (
    <LayeredScene
      mid={<HalftoneImage name="screen" x={800} y={250} width={1100} reveal={reveal(frame, fps, 1)} />}
      fore={
        <>
          <Tag text="An advertising company" appearAt={0.5 * fps} x={110} y={300} size={48} />
          <Tag text="Knowing when you will die?" appearAt={3 * fps} x={110} y={480} fill size={48} />
        </>
      }
    />
  );
};

// 7 (1:00–1:10) — o hospital é secundário.
export const SceneBuilding: React.FC = () => {
  const {frame, fps} = useT();
  const fade = interpolate(frame, [6 * fps, 8 * fps], [1, 0.22], clamp);
  return (
    <LayeredScene
      mid={<HalftoneImage name="exterior" x={330} y={220} width={1250} reveal={reveal(frame, fps)} opacity={fade} />}
      fore={
        <>
          <Tag text="Looks like a healthcare story" appearAt={1 * fps} x={130} y={100} size={42} />
          <Tag text="Beside the point" appearAt={7 * fps} x={560} y={800} fill size={64} />
        </>
      }
    />
  );
};

// 8–10 (1:10–1:43) — o mesmo motor: tudo o que se sabe de uma pessoa → o que acontece a seguir.
export const SceneEngine: React.FC = () => {
  const {frame, fps} = useT();
  const years = Math.round(interpolate(frame, [18 * fps, 24 * fps], [0, 20], clamp));
  return (
    <LayeredScene
      mid={<HalftoneImage name="person" x={680} y={190} width={560} reveal={reveal(frame, fps, 1.5)} />}
      fore={
        <>
          <Tag text="Everything known about a person" appearAt={1.5 * fps} x={110} y={90} size={36} />
          <Tag text="Next click" appearAt={8 * fps} x={150} y={300} />
          <Tag text="Next route" appearAt={10 * fps} x={1330} y={260} />
          <Tag text="Next word" appearAt={12 * fps} x={130} y={520} />
          <Tag text="Next buy" appearAt={14 * fps} x={1380} y={480} />
          <div style={{position: 'absolute', right: 140, top: 90, fontFamily: fonts.heading, fontWeight: 900, fontSize: 72, color: colors.white, opacity: years > 0 ? 1 : 0}}>
            {years} <span style={{fontSize: 34, color: colors.grayLight, fontFamily: fonts.mono}}>YEARS</span>
          </div>
          <Tag text="Last breath" appearAt={26 * fps} x={1290} y={770} fill size={64} />
        </>
      }
    />
  );
};

// 11 (1:43–1:51) — "reading all of it".
export const SceneReadAll: React.FC = () => {
  const {frame, fps} = useT();
  return (
    <LayeredScene
      mid={<HalftoneImage name="records" x={100} y={300} width={900} reveal={reveal(frame, fps)} />}
      fore={
        <>
          <Tag text="What it took to see" appearAt={0.4 * fps} x={110} y={110} size={38} />
          <Tag text="Forecasting a death" appearAt={1.2 * fps} x={1080} y={360} size={48} />
          <Tag text="By reading all of it" appearAt={4.5 * fps} x={1080} y={540} fill size={56} />
        </>
      }
    />
  );
};

// 12 (1:51–2:01) — números, scans e notas livres às 3 da manhã.
export const SceneNotes: React.FC = () => {
  const {frame, fps} = useT();
  return (
    <LayeredScene
      mid={<HalftoneImage name="notes" x={640} y={230} width={1200} reveal={reveal(frame, fps)} />}
      fore={
        <>
          <Tag text="The numbers" appearAt={0.6 * fps} x={110} y={230} />
          <Tag text="The scans" appearAt={2.8 * fps} x={110} y={410} />
          <Tag text="Free-text notes" appearAt={5 * fps} x={110} y={590} fill />
          <Tag text="03:12 AM" appearAt={7.5 * fps} x={110} y={780} size={40} />
        </>
      }
    />
  );
};
