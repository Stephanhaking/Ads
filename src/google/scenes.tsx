import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../styles';
import {LayeredScene} from './Layers';
import {Prognosis} from './Prognosis';
import {PredictEngine} from './PredictEngine';

const label: React.CSSProperties = {
  position: 'absolute',
  fontFamily: fonts.mono,
  color: colors.platinum,
  letterSpacing: 6,
};

// Cena 4 (0:35–0:46) — clímax do Prognosis: previsão sobe antes do alarme humano.
export const SceneClimax: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(frame, [0, 6 * fps], [0, 1], {extrapolateRight: 'clamp'});
  const alarmOpacity = interpolate(frame, [7 * fps, 8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pop = spring({frame: frame - 5.5 * fps, fps, config: {damping: 12}});

  return (
    <LayeredScene
      mid={<Prognosis draw={draw} alarmOpacity={alarmOpacity} peakRed label={draw >= 1 ? 'MORTALITY · 95%' : undefined} />}
      fore={
        <div style={{...label, left: 140, top: 110, fontSize: 30}}>
          PREDICTION
          <div style={{color: colors.white, fontSize: 150, fontFamily: fonts.heading, fontWeight: 800, letterSpacing: 0, opacity: pop, transform: `scale(${0.8 + 0.2 * pop})`, transformOrigin: 'left'}}>
            95%
          </div>
        </div>
      }
    />
  );
};

// Cenas 8–10 (1:10–1:43) — PredictEngine, saídas em stagger, LAST BREATH no fim.
export const SceneEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18}});

  return (
    <LayeredScene
      mid={
        <div style={{opacity: enter, transform: `scale(${0.96 + 0.04 * enter})`}}>
          <PredictEngine
            outputs={[
              {label: 'NEXT CLICK', appearAt: 8 * fps},
              {label: 'NEXT ROUTE', appearAt: 10 * fps},
              {label: 'NEXT WORD', appearAt: 12 * fps},
              {label: 'NEXT BUY', appearAt: 14 * fps},
              {label: 'LAST BREATH', appearAt: 26 * fps, final: true},
            ]}
          />
        </div>
      }
      fore={
        <div style={{...label, left: 140, top: 110, fontSize: 28, opacity: interpolate(frame, [12 * fps, 14 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          SAME ENGINE · 20 YEARS
        </div>
      }
    />
  );
};
