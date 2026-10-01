import React from 'react';
import {interpolate, spring} from 'remotion';
import {useCurrentFrame, useVideoConfig} from '../timeline';
import {fonts} from '../styles';
import {HalftoneImage} from './HalftoneImage';
import {LayeredScene} from './Layers';
import {EASE_OUT} from './motion';
import {Connector, Flash, Grain, KineticText, RedDisc, useShake} from './Fx';
import {ClimaxChart} from './ClimaxChart';
import {scaleFor} from './timing';
import {ThemeName, ThemeProvider, useTheme} from './theme';
import {ConsentForm, DotField, FourDots, MapsRoute, RecordTable, RedactionDoc, SearchBar, Wordmark} from './brand/Brand';
import {SfxAt} from './Sfx';
import {Tag} from './Vox';

// Cenas dos primeiros 2 minutos (ver docs/storyboard_google_0-2min.md) no estilo Vox v2:
// fundo creme (papel) com vermelho plano nos momentos de impacto. Tempos locais em segundos.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// `fps` aqui é o fps "de tempo": segundos × fps = frame. Multiplicado pelo fator do parágrafo,
// para que as tags (escritas em segundos estimados) sigam a duração real da locução.
const useT = (paragraph: string) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {frame, fps: fps * scaleFor(paragraph)};
};
const reveal = (frame: number, at = 4, len = 34) => interpolate(frame, [at, at + len], [0, 1], {...clamp, easing: EASE_OUT});

// Cada cena escolhe o seu tema e leva o grão por cima.
const Hud: React.FC = () => {
  const th = useTheme();
  const style: React.CSSProperties = {position: 'absolute', bottom: 28, fontFamily: fonts.mono, fontSize: 17, letterSpacing: 5, color: th.mono, opacity: 0.75};
  return (
    <>
      <div style={{...style, right: 56}}>DISTINGUISH · GOOGLE</div>
      <div style={{position: 'absolute', right: 56, bottom: 58, width: 70, height: 4, background: th.disc}} />
    </>
  );
};

const Shell: React.FC<{theme: ThemeName; children: React.ReactNode}> = ({theme, children}) => (
  <ThemeProvider name={theme}>
    {children}
    <Hud />
    <Grain />
  </ThemeProvider>
);

const Mono: React.FC<{x: number; y: number; size?: number; children: React.ReactNode}> = ({x, y, size = 36, children}) => {
  const th = useTheme();
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: fonts.mono, fontSize: size, letterSpacing: 6, color: th.mono}}>{children}</div>;
};

const Big: React.FC<{x: number; y: number; size: number; children: React.ReactNode; opacity?: number}> = ({x, y, size, children, opacity = 1}) => {
  const th = useTheme();
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: fonts.heading, fontWeight: 400, fontSize: size, lineHeight: 1, color: th.text, opacity, textShadow: `${size * 0.05}px ${size * 0.05}px 0 ${th.textShadow}`}}>
      {children}
    </div>
  );
};

// 1 (0:00–0:16) — o momento em que o doente começa a morrer.
export const SceneHospital: React.FC = () => {
  const {frame, fps} = useT('cold');
  const th = useTheme();
  const slide = spring({frame: frame - 4, fps, config: {damping: 18, stiffness: 90}});
  const colon = Math.floor(frame / 15) % 2 === 0 ? ':' : ' ';
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - slide) * 500}px)`, opacity: slide}}>
            <HalftoneImage name="hospital" x={700} y={290} width={1150} reveal={reveal(frame, 4, 40)} />
          </div>
        }
        fore={
          <>
            <KineticText lines={[['The', 'moment', 'a'], ['patient'], ['quietly', 'begins'], ['to', 'die']]} x={110} y={100} size={88} startAt={8} stagger={8} hot={['die']} />
            <div style={{position: 'absolute', right: 140, top: 80, fontFamily: fonts.mono, fontSize: 60, color: th.text, letterSpacing: 6}}>
              03{colon}12 <span style={{color: th.hotBg}}>AM</span>
            </div>
            <Tag text="100 small readings" appearAt={8 * fps} x={110} y={700} size={36} />
            <Tag text="Easy to miss" appearAt={11.5 * fps} x={110} y={840} fill />
          </>
        }
      />
    </Shell>
  );
};

// 2 (0:16–0:20) — 2018.
export const SceneYear: React.FC = () => {
  const {fps} = useT('cold');
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={<FourDots cx={1560} cy={720} size={48} />}
        fore={
          <>
            <SfxAt name="hit" at={3} />
            <KineticText lines={[['2018']]} x={150} y={230} size={400} startAt={3} hot={[]} />
            <Tag text="A machine learned to catch it first" appearAt={1.4 * fps} x={150} y={720} fill size={46} />
          </>
        }
      />
    </Shell>
  );
};

// 3 (0:20–0:35) — 114 mil registos; "quem, neste edifício, vai morrer?"
export const SceneRecords: React.FC = () => {
  const {frame, fps} = useT('cold');
  const count = Math.round(interpolate(frame, [2 * fps, 7 * fps], [0, 114000], {...clamp, easing: EASE_OUT}));
  return (
    <Shell theme="paper">
      <LayeredScene
        back={<RedDisc x={560} y={540} r={360} appearAt={2} />}
        mid={<HalftoneImage name="records" x={110} y={230} width={1000} reveal={reveal(frame)} />}
        fore={
          <>
            <Tag text="Medical records" appearAt={0.8 * fps} x={130} y={90} />
            <Big x={1150} y={240} size={116}>{count.toLocaleString('en-US')}</Big>
            <Mono x={1150} y={400}>PATIENTS</Mono>
            <Tag text="Artificial intelligence" appearAt={7.5 * fps} x={1150} y={520} size={40} />
            <Tag text="Who, in this building," appearAt={10 * fps} x={1150} y={700} fill size={44} />
            <Tag text="is going to die?" appearAt={10.6 * fps} x={1150} y={800} fill size={44} />
          </>
        }
      />
    </Shell>
  );
};

// 4 (0:35–0:46) — PICO (vermelho): 95% contra o score clínico.
export const SceneClimax: React.FC = () => (
  <Shell theme="red">
    <ClimaxChart />
  </Shell>
);

// 5 (0:46–0:54) — publicado numa revista médica.
export const ScenePaper: React.FC = () => {
  const {frame, fps} = useT('cold');
  return (
    <Shell theme="paper">
      <LayeredScene
        back={<RedDisc x={1290} y={620} r={340} appearAt={2} shape="block" />}
        mid={<HalftoneImage name="paper" x={760} y={320} width={1100} reveal={reveal(frame)} />}
        fore={
          <>
            <KineticText lines={[['Published', 'in', 'a'], ['medical'], ['journal']]} x={110} y={110} size={94} startAt={6} stagger={8} hot={[]} />
            <Tag text="Nature" appearAt={3.4 * fps} x={110} y={640} size={56} />
            <Tag text="May 2018" appearAt={4.6 * fps} x={110} y={790} fill size={56} />
          </>
        }
      />
    </Shell>
  );
};

// 6 (0:54–1:00) — PICO (vermelho): a pergunta.
export const SceneQuestion: React.FC = () => {
  const {fps} = useT('cold');
  return (
    <Shell theme="red">
      <LayeredScene
        mid={
          <>
            {/* cartão branco = página inicial da Google; o wordmark vermelho não desaparece no fundo vermelho */}
            <div style={{position: 'absolute', left: 190, top: 150, width: 1540, height: 600, borderRadius: 44, background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.35)'}} />
            <Wordmark x={706} y={226} size={176} startAt={0.2 * fps} />
            <SearchBar x={260} y={500} width={1400} text="why is an advertising company so good at knowing when you'll die" startAt={0.9 * fps} cps={19} />
          </>
        }
        fore={<Tag text="An advertising company" appearAt={0.4 * fps} x={110} y={52} size={36} />}
      />
    </Shell>
  );
};

// 7 (1:00–1:10) — o hospital é secundário.
export const SceneBuilding: React.FC = () => {
  const {frame, fps} = useT('act1');
  const fade = interpolate(frame, [6 * fps, 8 * fps], [1, 0.18], clamp);
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={<HalftoneImage name="exterior" x={560} y={310} width={1250} reveal={reveal(frame)} opacity={fade} />}
        fore={
          <>
            <KineticText lines={[['Looks', 'like', 'a'], ['healthcare', 'story']]} x={110} y={100} size={92} startAt={6} stagger={9} hot={[]} />
            <Tag text="Beside the point" appearAt={7 * fps} x={200} y={800} fill size={70} />
          </>
        }
      />
    </Shell>
  );
};

const Years: React.FC<{n: number}> = ({n}) => {
  const th = useTheme();
  return (
    <div style={{position: 'absolute', right: 140, top: 130, fontFamily: fonts.heading, fontWeight: 400, fontSize: 72, color: th.hotBg, opacity: n > 0 ? 1 : 0}}>
      {n} <span style={{fontSize: 34, fontFamily: fonts.mono}}>YEARS</span>
    </div>
  );
};

// 8–10 (1:10–1:43) — o motor; no "LAST BREATH" o fundo vira vermelho (pico).
export const SceneEngine: React.FC = () => {
  const {frame, fps} = useT('act1');
  const slamAt = 26 * fps;
  const sh = useShake(slamAt);
  const theme: ThemeName = frame >= slamAt ? 'red' : 'paper';
  const years = Math.round(interpolate(frame, [18 * fps, 24 * fps], [0, 20], {...clamp, easing: EASE_OUT}));
  const head: [number, number] = [960, 430];
  const items: {t: string; x: number; y: number; at: number; end: [number, number]}[] = [
    {t: 'Next click', x: 170, y: 250, at: 8 * fps, end: [570, 290]},
    {t: 'Next word', x: 150, y: 520, at: 12 * fps, end: [560, 560]},
    {t: 'Next route', x: 1380, y: 230, at: 10 * fps, end: [1370, 270]},
    {t: 'Next buy', x: 1440, y: 500, at: 14 * fps, end: [1430, 540]},
  ];
  return (
    <Shell theme={theme}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        <LayeredScene
          back={<RedDisc x={960} y={520} r={360} appearAt={2} />}
          mid={<HalftoneImage name="person" x={690} y={210} width={540} reveal={reveal(frame)} />}
          fore={
            <>
              <Tag text="Everything known about a person" appearAt={1.5 * fps} x={110} y={80} size={38} />
              {items.map((it) => (
                <React.Fragment key={it.t}>
                  <Connector from={head} to={it.end} appearAt={it.at - 6} />
                  <Tag text={it.t} appearAt={it.at} x={it.x} y={it.y} />
                </React.Fragment>
              ))}
              <Years n={years} />
              <SfxAt name="hit" at={slamAt} />
              <Connector from={[960, 700]} to={[1290, 830]} appearAt={slamAt - 4} width={8} />
              <Tag text="Last breath" appearAt={slamAt} x={1290} y={790} fill size={78} />
            </>
          }
        />
        <Flash at={slamAt} />
      </div>
    </Shell>
  );
};

// 11 (1:43–1:51) — "reading all of it".
export const SceneReadAll: React.FC = () => {
  const {fps} = useT('act2');
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={<RecordTable x={110} y={190} w={900} h={780} />}
        fore={
          <>
            <Tag text="What it took to see" appearAt={0.4 * fps} x={110} y={80} size={38} />
            <KineticText lines={[['By', 'reading'], ['all', 'of', 'it']]} x={1090} y={240} size={92} startAt={1.2 * fps} stagger={9} hot={['it']} />
            <Tag text="Forecasting a death" appearAt={5 * fps} x={1090} y={700} size={44} />
          </>
        }
      />
    </Shell>
  );
};

// 12 (1:51–2:01) — números, scans e notas livres às 3 da manhã.
export const SceneNotes: React.FC = () => {
  const {frame, fps} = useT('act2');
  return (
    <Shell theme="paper">
      <LayeredScene
        back={<RedDisc x={1300} y={600} r={330} appearAt={2} shape="block" />}
        mid={<HalftoneImage name="notes" x={640} y={230} width={1200} reveal={reveal(frame)} />}
        fore={
          <>
            <Tag text="The numbers" appearAt={0.6 * fps} x={110} y={230} />
            <Tag text="The scans" appearAt={2.8 * fps} x={110} y={410} />
            <Tag text="Free-text notes" appearAt={5 * fps} x={110} y={590} fill />
            <Tag text="03:12 AM" appearAt={7.5 * fps} x={110} y={780} size={40} />
          </>
        }
      />
    </Shell>
  );
};

// ── Fim do Ato II (1:51 → fim da locução): dados, anonimização, "nunca perguntaram" ──

// 13 — "Forty-six billion data points… the raw material arrived the way it usually does."
export const SceneData: React.FC = () => {
  const {frame, fps} = useT('act2');
  const n = Math.round(interpolate(frame, [0.4 * fps, 4 * fps], [0, 46], {...clamp, easing: EASE_OUT}));
  const progress = interpolate(frame, [0.2 * fps, 5 * fps], [0, 1], {...clamp, easing: EASE_OUT});
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={<DotField x={90} y={170} w={1000} h={730} progress={progress} />}
        fore={
          <>
            <Big x={1170} y={190} size={280}>{n}</Big>
            <KineticText lines={[['Billion']]} x={1170} y={500} size={104} startAt={0.9 * fps} hot={['Billion']} />
            <Mono x={1170} y={700}>DATA POINTS</Mono>
            <Tag text="The raw material arrived" appearAt={5 * fps} x={1130} y={810} size={34} />
          </>
        }
      />
    </Shell>
  );
};

// 14 — "A hospital handed Google the records of every patient… and called them anonymous. The dates were still attached. The notes too."
export const SceneAnon: React.FC = () => {
  const {frame, fps} = useT('act2');
  const th = useTheme();
  const stamp = spring({frame: frame - 6 * fps, fps: 30, config: {damping: 9, stiffness: 200}});
  return (
    <Shell theme="paper">
      <LayeredScene
        back={<RedDisc x={520} y={560} r={320} appearAt={2} shape="block" />}
        mid={<RedactionDoc x={110} y={150} w={820} h={820} sweepAt={7 * fps} hotAt={10 * fps} />}
        fore={
          <>
            <Tag text="A hospital handed over the records" appearAt={1 * fps} x={1010} y={230} size={34} />
            <Tag text="Every patient · 2009–2016" appearAt={4 * fps} x={1010} y={350} fill size={40} />
            <SfxAt name="stamp" at={6 * fps} />
            <div style={{position: 'absolute', left: 150, top: 540, transform: `rotate(-9deg) scale(${0.5 + 0.5 * stamp})`, opacity: Math.min(1, stamp * 2), border: `10px solid ${th.hotBg}`, color: th.hotBg, padding: '8px 28px', fontFamily: fonts.heading, fontWeight: 400, fontSize: 84, letterSpacing: 6, background: 'rgba(233,226,210,0.9)'}}>
              DE-IDENTIFIED
            </div>
            <Tag text="The dates · still attached" appearAt={10 * fps} x={1010} y={600} size={36} />
            <Tag text="The doctors' notes · still attached" appearAt={12 * fps} x={1010} y={730} size={30} />
          </>
        }
      />
    </Shell>
  );
};

// 15 — "…a dated, annotated medical file does not stay anonymous for long."
export const SceneFile: React.FC = () => {
  const {fps} = useT('act2');
  return (
    <Shell theme="paper">
      <LayeredScene
        back={<RedDisc x={1340} y={560} r={330} appearAt={2} shape="ring" />}
        mid={<MapsRoute x={960} y={200} w={880} h={600} drawAt={2.4 * fps} />}
        fore={
          <>
            <Tag text="Already knows where you were" appearAt={0.8 * fps} x={110} y={90} size={38} />
            <KineticText lines={[['A', 'dated,'], ['annotated'], ['file']]} x={110} y={230} size={92} startAt={2.2 * fps} stagger={9} hot={[]} />
            <Tag text="Not anonymous for long" appearAt={7.5 * fps} x={110} y={780} fill size={38} />
          </>
        }
      />
    </Shell>
  );
};

// 16 — PICO (vermelho): "The patients were never asked."
export const SceneNever: React.FC = () => (
  <Shell theme="red">
    <LayeredScene
      mid={<ConsentForm x={1080} y={130} w={700} h={800} />}
      fore={
        <>
          <KineticText lines={[['The', 'patients'], ['were', 'never'], ['asked.']]} x={110} y={170} size={118} startAt={4} stagger={9} hot={['asked.']} />
          <SfxAt name="hit" at={4 + 4 * 9} />
        </>
      }
    />
  </Shell>
);
