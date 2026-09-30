import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../styles';

// Caixa de previsão: pontos (tudo o que se sabe) → MODEL → saídas (NEXT CLICK … LAST BREATH).

export type EngineOutput = {label: string; appearAt: number; final?: boolean};

type Props = {
  inputLabel?: string;
  outputs: EngineOutput[];
  dotsOpacity?: number;
};

const DOTS = 28;
const W = 1600;
const H = 640;
const BOX = {x: 640, y: 170, w: 320, h: 300};

export const PredictEngine: React.FC<Props> = ({inputLabel = 'EVERYTHING KNOWN ABOUT A PERSON', outputs, dotsOpacity = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <svg width={W} height={H} style={{overflow: 'visible'}}>
      {/* pontos a convergir para a caixa */}
      <g opacity={dotsOpacity}>
        {Array.from({length: DOTS}, (_, i) => {
          const startY = 60 + ((i * 97) % 520);
          const startX = 20 + ((i * 53) % 160);
          const t = ((frame * 0.012 + i / DOTS) % 1);
          const x = interpolate(t, [0, 1], [startX, BOX.x], {});
          const y = interpolate(t, [0, 1], [startY, BOX.y + BOX.h / 2]);
          return <circle key={i} cx={x} cy={y} r={4} fill={colors.platinum} opacity={interpolate(t, [0, 0.15, 0.9, 1], [0, 0.8, 0.8, 0])} />;
        })}
      </g>
      <text x={20} y={H - 10} fill={colors.grayLight} fontFamily={fonts.mono} fontSize={22} letterSpacing={3}>
        {inputLabel}
      </text>

      {/* a caixa */}
      <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} fill={colors.black} stroke={colors.platinum} strokeWidth={3} />
      <text x={BOX.x + BOX.w / 2} y={BOX.y + BOX.h / 2 + 14} textAnchor="middle" fill={colors.white} fontFamily={fonts.heading} fontWeight={800} fontSize={48} letterSpacing={6}>
        MODEL
      </text>

      {/* saídas */}
      {outputs.map((o, i) => {
        const p = spring({frame: frame - o.appearAt, fps, config: {damping: 14, stiffness: 140}});
        const y = 50 + i * 100;
        const glow = o.final ? colors.white : colors.platinum;
        return (
          <g key={o.label} opacity={p} transform={`translate(${interpolate(p, [0, 1], [-40, 0])} 0)`}>
            <line x1={BOX.x + BOX.w} y1={BOX.y + BOX.h / 2} x2={1040} y2={y + 28} stroke={colors.grayLight} strokeWidth={2} opacity={0.6} />
            <rect x={1040} y={y} width={540} height={60} fill="none" stroke={glow} strokeWidth={o.final ? 4 : 2} />
            <text x={1070} y={y + 42} fill={glow} fontFamily={fonts.mono} fontSize={32} letterSpacing={5} fontWeight={o.final ? 700 : 400}>
              {o.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
