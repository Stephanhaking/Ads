import React from 'react';
import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../../styles';
import {HalftoneImage} from '../HalftoneImage';
import {LayeredScene} from '../Layers';
import {Tag} from '../Vox';
import {ThemeName, ThemeProvider, useTheme} from '../theme';
import {Connector, Flash, Grain, KineticText, RedDisc, RedWipe, useShake} from './Fx';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// P1 — gancho: "When does a patient begin to die?"
const P1: React.FC = () => {
  const th = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slide = spring({frame: frame - 4, fps, config: {damping: 18, stiffness: 90}});
  const colon = Math.floor(frame / 15) % 2 === 0 ? ':' : ' ';
  return (
    <LayeredScene
      mid={
        <div style={{position: "absolute", inset: 0, transform: `translateX(${(1 - slide) * 500}px)`, opacity: slide}}>
          <HalftoneImage name="hospital" x={700} y={290} width={1150} reveal={interpolate(frame, [4, 40], [0, 1], clamp)} />
        </div>
      }
      fore={
        <>
          <KineticText lines={[['When', 'does', 'a'], ['patient'], ['begin', 'to'], ['die?']]} x={110} y={120} size={128} startAt={8} stagger={7} hot={['die?']} />
          <div style={{position: 'absolute', right: 140, top: 90, fontFamily: fonts.mono, fontSize: 60, color: th.text, letterSpacing: 6}}>
            03{colon}12 <span style={{color: th.hotBg}}>AM</span>
          </div>
        </>
      }
    />
  );
};

// P2 — 95% (IA) contra 85% (score clínico tradicional).
export const P2: React.FC = () => {
  const th = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.round(interpolate(frame, [20, 60], [0, 95], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)}));
  const bar = (at: number) => spring({frame: frame - at, fps, config: {damping: 16, stiffness: 80}});
  const pop = spring({frame: frame - 18, fps, config: {damping: 9, stiffness: 200}});
  return (
    <LayeredScene
      back={<RedDisc x={430} y={470} r={330} appearAt={2} />}
      mid={<HalftoneImage name="doctor" x={130} y={250} width={560} reveal={interpolate(frame, [4, 34], [0, 1], clamp)} />}
      fore={
        <>
          <div style={{position: 'absolute', left: 820, top: 70, fontFamily: fonts.heading, fontWeight: 400, fontSize: 380, lineHeight: 1, color: th.text, transform: `scale(${0.6 + 0.4 * pop})`, transformOrigin: 'left center', opacity: Math.min(1, pop * 2), textShadow: `14px 14px 0 ${th.textShadow}`}}>
            {n}%
          </div>
          <div style={{position: 'absolute', left: 830, top: 520, fontFamily: fonts.mono, fontSize: 26, letterSpacing: 4, color: th.mono}}>GOOGLE AI</div>
          <div style={{position: 'absolute', left: 830, top: 560, height: 54, width: 900 * 0.95 * bar(50), background: th.hotBg, boxShadow: `8px 8px 0 ${th.text}`}} />
          <div style={{position: 'absolute', left: 830, top: 680, fontFamily: fonts.mono, fontSize: 26, letterSpacing: 4, color: th.mono}}>EARLY WARNING SCORE · 85%</div>
          <div style={{position: 'absolute', left: 830, top: 720, height: 54, width: 900 * 0.85 * bar(62), background: th.barGray, boxShadow: `8px 8px 0 ${th.hotBg}`}} />
          <Tag text="Earlier than the nurses" appearAt={86} x={830} y={860} size={46} fill />
          <div style={{position: 'absolute', left: 830, bottom: 50, fontFamily: fonts.mono, fontSize: 22, letterSpacing: 3, color: th.mono}}>SOURCE: NATURE · 2018</div>
        </>
      }
    />
  );
};

// P3 — o mesmo motor: tudo o que se sabe → o que acontece a seguir → LAST BREATH.
const P3: React.FC = () => {
  const frame = useCurrentFrame();
  const slamAt = 160;
  const sh = useShake(slamAt);
  const head: [number, number] = [960, 430];
  const items: {t: string; x: number; y: number; at: number; end: [number, number]}[] = [
    {t: 'Next click', x: 170, y: 250, at: 40, end: [570, 290]},
    {t: 'Next word', x: 150, y: 520, at: 62, end: [560, 560]},
    {t: 'Next route', x: 1380, y: 230, at: 84, end: [1370, 270]},
    {t: 'Next buy', x: 1440, y: 500, at: 106, end: [1430, 540]},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <LayeredScene
        back={<RedDisc x={960} y={520} r={360} appearAt={2} />}
        mid={<HalftoneImage name="person" x={690} y={210} width={540} reveal={interpolate(frame, [4, 34], [0, 1], clamp)} />}
        fore={
          <>
            <Tag text="Everything known about a person" appearAt={14} x={110} y={80} size={38} />
            {items.map((it) => (
              <React.Fragment key={it.t}>
                <Connector from={head} to={it.end} appearAt={it.at - 6} />
                <Tag text={it.t} appearAt={it.at} x={it.x} y={it.y} />
              </React.Fragment>
            ))}
            <Connector from={[960, 700]} to={[1290, 830]} appearAt={slamAt - 4} color={colors.red} width={8} />
            <Tag text="Last breath" appearAt={slamAt} x={1290} y={790} fill size={78} />
          </>
        }
      />
      <Flash at={slamAt} />
    </div>
  );
};

const SCENE = 210;

export const GoogleProto: React.FC<{theme?: ThemeName}> = ({theme = 'dark'}) => (
  <ThemeProvider name={theme}>
  <AbsoluteFill>
    <Sequence name="p1-hook" from={0} durationInFrames={SCENE}><P1 /></Sequence>
    <Sequence name="p2-95" from={SCENE} durationInFrames={SCENE}><P2 /></Sequence>
    <Sequence name="p3-engine" from={SCENE * 2} durationInFrames={SCENE}><P3 /></Sequence>
    <Sequence name="wipe-1" from={SCENE - 9} durationInFrames={18}><RedWipe /></Sequence>
    <Sequence name="wipe-2" from={SCENE * 2 - 9} durationInFrames={18}><RedWipe /></Sequence>
    <Grain />
  </AbsoluteFill>
  </ThemeProvider>
);

export const PROTO_TOTAL = SCENE * 3;
