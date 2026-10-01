import React from 'react';
import {Easing, interpolate, spring} from 'remotion';
import {colors, fonts} from '../styles';
import {HalftoneImage} from './HalftoneImage';
import {LayeredScene} from './Layers';
import {RedDisc} from './Fx';
import {useTheme} from './theme';
import {SfxAt} from './Sfx';
import {HandCircle} from './doc/Doc';
import {Tag} from './Vox';
import {useCurrentFrame, useVideoConfig} from '../timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 95% (IA) contra 85% (score clínico tradicional) — cena do pico.
export const ClimaxChart: React.FC = () => {
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
          <SfxAt name="hit" at={18} />
          <HandCircle cx={1130} cy={235} rx={450} ry={150} at={70} color={th.text} />
          <div style={{position: 'absolute', left: 820, top: 70, fontFamily: fonts.heading, fontWeight: 400, fontSize: 320, lineHeight: 1, color: th.text, transform: `scale(${0.6 + 0.4 * pop})`, transformOrigin: 'left center', opacity: Math.min(1, pop * 2), textShadow: `14px 14px 0 ${th.textShadow}`}}>
            {n}%
          </div>
          <div style={{position: 'absolute', left: 830, top: 520, fontFamily: fonts.mono, fontSize: 26, letterSpacing: 4, color: th.mono}}>GOOGLE AI</div>
          <div style={{position: 'absolute', left: 830, top: 560, height: 54, width: 900 * 0.95 * bar(50), background: th.hotBg, boxShadow: `8px 8px 0 ${th.text}`}} />
          <div style={{position: 'absolute', left: 830, top: 680, fontFamily: fonts.mono, fontSize: 26, letterSpacing: 4, color: th.mono}}>EARLY WARNING SCORE · 85%</div>
          <div style={{position: 'absolute', left: 830, top: 720, height: 54, width: 900 * 0.85 * bar(62), background: th.barGray, boxShadow: `8px 8px 0 ${th.hotBg}`}} />
          <AlertTimeline />
          <div style={{position: 'absolute', left: 830, bottom: 50, fontFamily: fonts.mono, fontSize: 22, letterSpacing: 3, color: th.mono}}>SOURCE: NATURE · 2018</div>
        </>
      }
    />
  );
};

// Linha do tempo: quem "vê" a deterioração primeiro. A IA aparece antes dos gráficos, das enfermeiras e do médico.
const AlertTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const th = useTheme();
  const ease = Easing.out(Easing.exp);
  const items = [
    {label: 'AI', at: 84, x: 0.06, big: true},
    {label: 'CHARTS', at: 112, x: 0.36},
    {label: 'NURSES', at: 138, x: 0.64},
    {label: 'DOCTOR', at: 164, x: 0.92},
  ];
  const X0 = 830, W = 880, Y = 905;
  const line = interpolate(frame, [80, 170], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <div style={{position: 'absolute', left: X0, top: Y - 70, fontFamily: fonts.mono, fontSize: 20, letterSpacing: 5, color: th.mono}}>WHO NOTICES FIRST →</div>
      <div style={{position: 'absolute', left: X0, top: Y, width: W * line, height: 6, background: th.text, borderRadius: 3}} />
      {items.map((it) => {
        const t = interpolate(frame - it.at, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
        const size = it.big ? 46 : 30;
        return (
          <div key={it.label} style={{position: 'absolute', left: X0 + W * it.x - size / 2, top: Y + 3 - size / 2, opacity: t, transform: `scale(${t})`}}>
            <div style={{width: size, height: size, borderRadius: '50%', background: it.big ? th.text : th.hotBg, border: `5px solid ${it.big ? th.hotBg : th.text}`}} />
            <div style={{position: 'absolute', top: size + 12, left: '50%', transform: 'translateX(-50%)', fontFamily: fonts.mono, fontSize: 22, letterSpacing: 4, color: th.text, whiteSpace: 'nowrap'}}>{it.label}</div>
          </div>
        );
      })}
    </>
  );
};
