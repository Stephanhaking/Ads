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
import {RealShot} from './News';
import {useA} from './beat';
import {ThemeName, ThemeProvider, useTheme} from './theme';
import {DotField, SearchBar, Wordmark} from './brand/Brand';
import {ArticlePage, BrowserWindow, Cursor, DocFlow, HandCircle, ReadingsGrid, ScribbleUnderline} from './doc/Doc';
import {ConsentWindow, EhrWindow, PdfViewer, TrainingDashboard} from './doc/Screens';
import {MapsApp, MiniRoute} from './brand/Maps';
import {SfxAt} from './Sfx';
import {Tag} from './Vox';

// Cenas dos primeiros 2 minutos (ver docs/storyboard_google_0-2min.md) no estilo Vox v2:
// fundo creme (papel) com vermelho plano nos momentos de impacto. Tempos locais em segundos.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// `fps` aqui é o fps "de tempo": segundos × fps = frame. Multiplicado pelo fator do parágrafo,
// para que as tags (escritas em segundos estimados) sigam a duração real da locução.
export const useT = (paragraph: string) => {
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

// `grain` (0–1) escala o grão de película: as cenas com interfaces realistas (pesquisa, mapa) pedem-no mais fraco.
export const Shell: React.FC<{theme: ThemeName; grain?: number; children: React.ReactNode}> = ({theme, grain = 1, children}) => (
  <ThemeProvider name={theme}>
    {children}
    <Hud />
    <Grain strength={grain} />
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
  const {w, T} = useA();
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
            <KineticText lines={[['The', 'moment', 'a'], ['patient'], ['quietly', 'begins'], ['to', 'die']]} x={110} y={100} size={88} times={T('the moment', 'moment#2', 'a patient', 'patient', 'starts', 'starts', 'to die', 'die').map((v, i) => v + (i === 5 ? 6 : 0))} hot={['die']} />
            <div style={{position: 'absolute', right: 140, top: 80, fontFamily: fonts.mono, fontSize: 60, color: th.text, letterSpacing: 6}}>
              03{colon}12 <span style={{color: th.hotBg}}>AM</span>
            </div>
            <HandCircle cx={1385} cy={628} rx={165} ry={125} at={w('a hundred small')} />
            <Tag text="100 small readings" appearAt={w('a hundred small')} x={110} y={520} size={32} />
            <ReadingsGrid x={110} y={600} cell={26} at={w('a hundred small')} oddAt={w('easy to miss')} />
            <HandCircle cx={302} cy={757} rx={34} ry={34} at={w('easy to miss')} width={6} />
            <Tag text="Easy to miss" appearAt={w('easy to miss') + 8} x={410} y={735} fill size={38} />
          </>
        }
      />
    </Shell>
  );
};

// 2 (0:16–0:20) — 2018.
export const SceneYear: React.FC = () => {
  const {fps} = useT('cold');
  const {w, T} = useA();
  return (
    <Shell theme="paper">
      <LayeredScene
        back={<RedDisc x={470} y={470} r={330} appearAt={2} shape="ring" />}
        mid={<TrainingDashboard x={1010} y={250} w={860} h={560} at={0} />}
        fore={
          <>
            <SfxAt name="hit" at={3} />
            <KineticText lines={[['2018']]} x={110} y={250} size={250} startAt={w('twenty eighteen', 0)} hot={[]} />
            <Tag text="A machine learned to catch it first" appearAt={w('a machine learned')} x={110} y={640} fill size={30} />
          </>
        }
      />
    </Shell>
  );
};

// 3 (0:20–0:35) — 114 mil registos; "quem, neste edifício, vai morrer?"
export const SceneRecords: React.FC = () => {
  const {frame, fps} = useT('cold');
  const {w, T} = useA();
  const count = Math.round(interpolate(frame, [w('a hundred and fourteen'), w('thousand people')], [0, 114000], {...clamp, easing: EASE_OUT}));
  const th = useTheme();
  const nodeIn = interpolate(frame, [w('an artificial'), w('an artificial') + 24], [0, 1], {...clamp, easing: EASE_OUT});
  const pulse = 1 + 0.05 * Math.sin(frame / 5);
  return (
    <Shell theme="paper">
      <LayeredScene
        back={<RedDisc x={470} y={580} r={330} appearAt={2} />}
        mid={<HalftoneImage name="records" x={50} y={310} width={840} reveal={reveal(frame)} />}
        fore={
          <>
            <Tag text="Medical records" appearAt={w('the medical records')} x={110} y={90} />
            <Big x={980} y={110} size={108}>{count.toLocaleString('en-US')}</Big>
            <ScribbleUnderline x={980} y={228} w={560} at={w('thousand people')} />
            <Mono x={980} y={250}>PATIENTS</Mono>
            <DocFlow from={[800, 580]} to={[1040, 500]} at={w('and fed them')} n={9} />
            <div style={{position: 'absolute', left: 1030, top: 390, width: 230, height: 230, borderRadius: 38, background: th.tagBg, color: th.tagText, boxShadow: `10px 10px 0 ${th.disc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.heading, fontSize: 112, opacity: nodeIn, transform: `scale(${(0.7 + 0.3 * nodeIn) * pulse})`}}>AI</div>
            <Tag text="Artificial intelligence" appearAt={w('artificial intelligence')} x={1300} y={470} size={34} />
            <Tag text="Who, in this building," appearAt={w('who in this')} x={980} y={720} fill size={40} />
            <Tag text="is going to die?" appearAt={w('is going to die')} x={980} y={820} fill size={40} />
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

// 5 (0:46–0:54) — publicado numa revista médica: notícias reais (capturas de ecrã) com destaque.
export const ScenePaper: React.FC = () => {
  const {fps} = useT('cold');
  const {w, T} = useA();
  const f = useCurrentFrame();
  const jr = w('journal');
  const qs = w('strange question');
  const swap = interpolate(f, [jr, jr + 10], [0, 1], clamp);
  const swap2 = interpolate(f, [qs, qs + 10], [0, 1], clamp);
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        back={<RedDisc x={1300} y={600} r={330} appearAt={2} shape="block" />}
        mid={
          <>
            <div style={{opacity: 1 - swap}}>
              <RealShot src="google/news/fierce-head.png" x={780} y={170} w={1080} crop={{x: 236, y: 150, w: 1100, h: 430}} at={0.4 * fps} tilt={-1}
                hl={[{rect: {x: 1025, y: 280, w: 140, h: 62}, at: 1.6 * fps}, {rect: {x: 262, y: 360, w: 280, h: 62}, at: 1.9 * fps}]} />
            </div>
            <div style={{opacity: swap * (1 - swap2)}}>
              <RealShot src="google/news/fierce-body.png" x={780} y={170} w={1080} crop={{x: 236, y: 215, w: 1100, h: 460}} at={jr} tilt={0.8}
                hl={[{rect: {x: 262, y: 441, w: 1070, h: 40}, at: jr + 8}, {rect: {x: 262, y: 521, w: 1070, h: 80}, at: jr + 24, color: '#FFB3B3'}]} />
            </div>
            <div style={{opacity: swap2}}>
              <RealShot src="google/news/dive.png" x={780} y={170} w={1080} crop={{x: 300, y: 130, w: 820, h: 420}} at={qs} tilt={-0.6}
                hl={[{rect: {x: 330, y: 235, w: 740, h: 150}, at: qs + 10}]} />
            </div>
          </>
        }
        fore={
          <>
            <KineticText lines={[['Published'], ['in a medical'], ['journal']]} x={110} y={120} size={68} times={T('the result', 'in a medical', 'journal')} hot={[]} />
            <Tag text="npj Digital Medicine" appearAt={jr} x={110} y={640} size={44} />
            <Tag text="95% vs 85%" appearAt={w('and it leaves')} x={110} y={760} fill size={48} />
            <Tag text="Fierce Biotech · Healthcare Dive" appearAt={0.5 * fps} x={110} y={900} size={26} />
          </>
        }
      />
    </Shell>
  );
};

// 6 (0:54–1:00) — PICO (vermelho): a pergunta.
export const SceneQuestion: React.FC = () => {
  const {fps} = useT('cold');
  const {w, T} = useA();
  return (
    <Shell theme="red" grain={0.3}>
      <LayeredScene
        mid={
          <>
            {/* cartão branco = página inicial da Google; o wordmark vermelho não desaparece no fundo vermelho */}
            <div style={{position: 'absolute', left: 190, top: 150, width: 1540, height: 700, borderRadius: 44, background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.35)'}} />
            <Wordmark x={706} y={226} size={176} startAt={0} />
            <SearchBar x={260} y={500} width={1400} text="why is an advertising company so good at knowing when you'll die" startAt={w('why is an advertising')} cps={14} ads={[{title: 'Compare prices on everything', url: 'shop.example.com'}, {title: 'Your next purchase, delivered fast', url: 'store.example.com'}]} adsAt={w('knowing when')} />
          </>
        }
        fore={<Tag text="An advertising company" appearAt={w('an advertising company')} x={110} y={52} size={36} />}
      />
    </Shell>
  );
};

// 7 (1:00–1:10) — o hospital é secundário.
export const SceneBuilding: React.FC = () => {
  const {frame, fps} = useT('act1');
  const {w, T} = useA();
  const fade = interpolate(frame, [w('but the hospital'), w('beside the point')], [1, 0.18], clamp);
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={<HalftoneImage name="exterior" x={560} y={310} width={1250} reveal={reveal(frame)} opacity={fade} />}
        fore={
          <>
            <KineticText lines={[['Looks', 'like', 'a'], ['healthcare', 'story']]} x={110} y={100} size={92} times={[w('this looks'), w('looks like'), w('like a'), w('healthcare'), w('healthcare') + 9]} hot={[]} />
            <Tag text="Beside the point" appearAt={w('beside the point')} x={200} y={800} fill size={70} />
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
  const {w, T} = useA();
  const slamAt = w('final variable');
  const sh = useShake(slamAt);
  const theme: ThemeName = frame >= slamAt ? 'red' : 'paper';
  const years = Math.round(interpolate(frame, [w('it\'s spent'), w('perfecting')], [0, 20], {...clamp, easing: EASE_OUT}));
  const head: [number, number] = [960, 430];
  const items: {t: string; x: number; y: number; at: number; end: [number, number]}[] = [
    {t: 'Next click', x: 170, y: 250, at: w('what happens next'), end: [570, 290]},
    {t: 'Next word', x: 130, y: 405, at: w('google has'), end: [560, 560]},
    {t: 'Next route', x: 1380, y: 235, at: w('oldest skill'), end: [1370, 400]},
    {t: 'Next buy', x: 1440, y: 585, at: w('twenty years'), end: [1430, 625]},
  ];
  return (
    <Shell theme={theme}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        <LayeredScene
          back={<RedDisc x={960} y={520} r={360} appearAt={2} />}
          mid={<HalftoneImage name="person" x={690} y={210} width={540} reveal={reveal(frame)} />}
          fore={
            <>
              <Tag text="Everything known about a person" appearAt={w('take everything')} x={110} y={80} size={38} />
              {items.map((it) => (
                <React.Fragment key={it.t}>
                  <Connector from={head} to={it.end} appearAt={it.at - 6} />
                  {it.t === 'Next word' || it.t === 'Next route' ? <Tag text={it.t} appearAt={it.at} x={it.x} y={it.y} size={30} /> : <Tag text={it.t} appearAt={it.at} x={it.x} y={it.y} />}
                </React.Fragment>
              ))}
              <SearchBar x={130} y={465} width={760} scale={0.7} text="weather" startAt={w('google has') + 6} cps={9} suggestions={['weather tomorrow', 'weather this week', 'weather radar']} suggestAt={w('google has') + 40} />
              <MiniRoute x={1380} y={285} w={370} h={215} at={w('oldest skill') + 12} />
              <Years n={years} />
              <SfxAt name="hit" at={slamAt} />
              <Connector from={[960, 700]} to={[1180, 830]} appearAt={slamAt - 4} width={8} />
              <Tag text="Last breath" appearAt={slamAt} x={1180} y={790} fill size={78} />
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
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        mid={
          <>
            <EhrWindow x={80} y={140} w={1020} h={820} tabAt={[0, w('it reads') - 20, w('it reads') + 20]} hlAt={w('reads all')} />
            <HandCircle cx={258} cy={510} rx={182} ry={30} at={w('reads all') + 12} />
          </>
        }
        fore={
          <>
            <Tag text="What it took to see" appearAt={w('so how')} x={110} y={70} size={36} />
            <KineticText lines={[['By', 'reading'], ['all', 'of', 'it']]} x={1150} y={250} size={78} startAt={w('it reads')} stagger={7} hot={['it']} />
            <Tag text="Forecasting a death" appearAt={w('forecast a death')} x={1150} y={700} size={40} />
          </>
        }
      />
    </Shell>
  );
};

// 12 (1:51–2:01) — números, scans e notas livres às 3 da manhã.
export const SceneNotes: React.FC = () => {
  const {frame, fps} = useT('act2');
  const {w, T} = useA();
  return (
    <Shell theme="paper">
      <LayeredScene
        back={<RedDisc x={1300} y={600} r={330} appearAt={2} shape="block" />}
        mid={<HalftoneImage name="notes" x={640} y={230} width={1200} reveal={reveal(frame)} />}
        fore={
          <>
            <Tag text="The numbers" appearAt={w('the numbers')} x={110} y={230} />
            <Tag text="The scans" appearAt={w('the scans')} x={110} y={410} />
            <Tag text="Free-text notes" appearAt={w('free text')} x={110} y={590} fill />
            <Tag text="03:12 AM" appearAt={w('three in the morning')} x={110} y={780} size={40} />
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
  const {w, T} = useA();
  const n = Math.round(interpolate(frame, [w('forty six'), w('data points')], [0, 46], {...clamp, easing: EASE_OUT}));
  const progress = interpolate(frame, [w('forty six'), w('feeding')], [0, 1], {...clamp, easing: EASE_OUT});
  return (
    <Shell theme="paper">
      <LayeredScene
        mid={<DotField x={90} y={170} w={1000} h={730} progress={progress} />}
        fore={
          <>
            <Big x={1170} y={190} size={280}>{n}</Big>
            <KineticText lines={[['Billion']]} x={1170} y={500} size={104} startAt={w('billion')} hot={['Billion']} />
            <Mono x={1170} y={700}>DATA POINTS</Mono>
            <Tag text="The raw material arrived" appearAt={w('raw material')} x={1130} y={810} size={34} />
          </>
        }
      />
    </Shell>
  );
};

// 14 — "A hospital handed Google the records of every patient… and called them anonymous. The dates were still attached. The notes too."
export const SceneAnon: React.FC = () => {
  const {frame, fps} = useT('act2');
  const {w, T} = useA();
  const th = useTheme();
  const stamp = spring({frame: frame - w('called them anonymous'), fps: 30, config: {damping: 9, stiffness: 200}});
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        back={<RedDisc x={520} y={560} r={320} appearAt={2} shape="block" />}
        mid={
          <>
            <PdfViewer x={90} y={130} w={900} h={840} redactAt={w('anonymous')} hlAt={w('the dates')} />
            <HandCircle cx={455} cy={502} rx={345} ry={38} at={w('attached')} />
          </>
        }
        fore={
          <>
            <Tag text="A hospital handed over the records" appearAt={w('a hospital')} x={1030} y={230} size={32} />
            <Tag text="Every patient · 2009–2016" appearAt={w('every patient')} x={1030} y={350} fill size={38} />
            <SfxAt name="stamp" at={w('called them anonymous')} />
            <div style={{position: 'absolute', left: 120, top: 700, transform: `rotate(-9deg) scale(${0.5 + 0.5 * stamp})`, opacity: Math.min(1, stamp * 2), border: `10px solid ${th.hotBg}`, color: th.hotBg, padding: '8px 28px', fontFamily: fonts.heading, fontWeight: 400, fontSize: 78, letterSpacing: 6, background: 'rgba(255,255,255,0.88)'}}>
              DE-IDENTIFIED
            </div>
            <Tag text="The dates · still attached" appearAt={w('the dates')} x={1030} y={600} size={34} />
            <Tag text="The doctors' notes · still attached" appearAt={w('so were the')} x={1030} y={730} size={28} />
          </>
        }
      />
    </Shell>
  );
};

// 15 — "…a dated, annotated medical file does not stay anonymous for long."
export const SceneFile: React.FC = () => {
  const {fps} = useT('act2');
  const {w, T} = useA();
  return (
    <Shell theme="paper" grain={0.3}>
      <LayeredScene
        back={<RedDisc x={1500} y={880} r={300} appearAt={2} shape="ring" />}
        mid={<MapsApp x={740} y={150} w={1140} h={780} startAt={w('knows where')} />}
        fore={
          <>
            <Tag text="Already knows where you were" appearAt={w('knows where you were')} x={110} y={90} size={38} />
            <KineticText lines={[['A', 'dated,'], ['annotated'], ['file']]} x={110} y={230} size={74} times={[w('a dated'), w('dated'), w('annotated'), w('file')]} hot={[]} />
            <Tag text="Not anonymous for long" appearAt={w('stay anonymous')} x={110} y={780} fill size={28} />
          </>
        }
      />
    </Shell>
  );
};

// 16 — PICO (vermelho): "The patients were never asked."
export const SceneNever: React.FC = () => {
  useT('act2');
  const {w, T} = useA();
  const t0 = w('the patients');
  return (
  <Shell theme="red" grain={0.3}>
    <LayeredScene
      mid={
        <>
          <ConsentWindow x={1060} y={130} w={760} h={800} />
          <Cursor path={[[1640, 260, t0], [1190, 500, t0 + 30], [1215, 520, t0 + 42], [1500, 640, t0 + 70], [1640, 430, t0 + 96]]} />
        </>
      }
      fore={
        <>
          <KineticText lines={[['The', 'patients'], ['were', 'never'], ['asked.']]} x={110} y={170} size={98} times={T('the patients', 'patients', 'were never', 'never', 'asked')} hot={['asked.']} />
          
        </>
      }
    />
  </Shell>
  );
};
