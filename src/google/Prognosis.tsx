import React, {useMemo} from 'react';
import {colors, fonts} from '../styles';

// Linha de previsão de mortalidade. Abre e fecha o vídeo.
// `draw` (0–1) revela a linha; `riseAt` (0–1) é onde a previsão começa a subir;
// `alarmAt` (0–1) é onde o alarme humano dispara (depois da subida).

const N = 240;

// Ruído determinístico (sem Math.random → renders reprodutíveis).
const noise = (i: number) => Math.sin(i * 12.9898) * 0.5 + Math.sin(i * 4.1414) * 0.5;

export type PrognosisProps = {
  width?: number;
  height?: number;
  draw: number;
  riseAt?: number;
  alarmAt?: number;
  alarmOpacity?: number;
  peakRed?: boolean;
  label?: string;
};

export const Prognosis: React.FC<PrognosisProps> = ({
  width = 1500,
  height = 520,
  draw,
  riseAt = 0.45,
  alarmAt = 0.88,
  alarmOpacity = 0,
  peakRed = false,
  label,
}) => {
  const pts = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const rise = t > riseAt ? 1 / (1 + Math.exp(-14 * ((t - riseAt) / (1 - riseAt) - 0.45))) : 0;
      const y = 0.78 - rise * 0.62 + noise(i) * (0.012 + 0.02 * (1 - rise));
      out.push([t * width, y * height]);
    }
    return out;
  }, [width, height, riseAt]);

  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const idx = Math.max(0, Math.min(N - 1, Math.round(draw * (N - 1))));
  const [hx, hy] = pts[idx];
  const done = draw >= 0.999;
  const accent = peakRed && done ? colors.alert : colors.platinum;

  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      {/* eixo de base */}
      <line x1={0} y1={height * 0.95} x2={width} y2={height * 0.95} stroke={colors.grayLight} strokeWidth={1.5} opacity={0.5} />
      {/* alarme humano (chega depois da previsão) */}
      <g opacity={alarmOpacity}>
        <line x1={alarmAt * width} y1={0} x2={alarmAt * width} y2={height * 0.95} stroke={colors.grayLight} strokeWidth={2} strokeDasharray="10 10" />
        <text x={alarmAt * width - 14} y={height * 0.95 - 14} textAnchor="end" fill={colors.grayLight} fontFamily={fonts.mono} fontSize={26} letterSpacing={3}>
          HUMAN ALARM
        </text>
      </g>
      {/* a linha */}
      <path d={d} pathLength={1} fill="none" stroke={colors.platinum} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - draw} />
      {/* cabeça da linha / pico */}
      {draw > 0 && <circle cx={hx} cy={hy} r={done ? 14 : 8} fill={accent} />}
      {done && peakRed && <circle cx={hx} cy={hy} r={30} fill="none" stroke={colors.alert} strokeWidth={3} opacity={0.6} />}
      {label && (
        <text x={hx - 30} y={hy - 34} textAnchor="end" fill={accent} fontFamily={fonts.mono} fontSize={30} letterSpacing={4}>
          {label}
        </text>
      )}
    </svg>
  );
};
