import React from 'react';
import {interpolate, spring} from 'remotion';
import {colors, fonts} from '../styles';
import {HalftoneImage} from './HalftoneImage';
import {LayeredScene} from './Layers';
import {RedDisc} from './Fx';
import {useTheme} from './theme';
import {SfxAt} from './Sfx';
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
