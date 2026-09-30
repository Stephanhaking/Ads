import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../styles';
import {LayeredScene} from './Layers';
import {HalftoneBust} from './Halftone';
import {Bar, Tag} from './Vox';

const source: React.CSSProperties = {
  position: 'absolute',
  left: 140,
  bottom: 70,
  fontFamily: fonts.mono,
  fontSize: 24,
  letterSpacing: 3,
  color: colors.grayLight,
  textTransform: 'uppercase',
};

// Cena 4 (0:35–0:46) — "95% accuracy — earlier than the charts": IA vs. score clínico tradicional.
export const SceneClimax: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = interpolate(frame, [0, 1.2 * fps], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <LayeredScene
      mid={
        <div style={{position: 'absolute', left: 150, top: 200}}>
          <HalftoneBust reveal={reveal} width={560} height={690} />
        </div>
      }
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

// Cenas 8–10 (1:10–1:43) — o mesmo motor: tudo o que se sabe de uma pessoa → o que acontece a seguir.
export const SceneEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = interpolate(frame, [0, 1.5 * fps], [0, 1], {extrapolateRight: 'clamp'});
  const years = Math.round(interpolate(frame, [18 * fps, 24 * fps], [0, 20], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <LayeredScene
      mid={
        <div style={{position: 'absolute', left: 650, top: 170}}>
          <HalftoneBust reveal={reveal} />
        </div>
      }
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
