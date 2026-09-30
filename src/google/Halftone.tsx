import React, {useMemo} from 'react';
import {colors} from '../styles';

// Recorte halftone P&B com traço vermelho deslocado atrás (estilo Vox).
// O tamanho de cada ponto depende da luminosidade → halftone real, gerado por código (sem assets).

type Inside = (x: number, y: number) => boolean; // coords normalizadas 0–1
type Light = (x: number, y: number) => number; // 0–1

const inBust: Inside = (x, y) => {
  const head = (x - 0.5) ** 2 / 0.17 ** 2 + (y - 0.3) ** 2 / 0.22 ** 2 <= 1;
  const shoulders = (x - 0.5) ** 2 / 0.46 ** 2 + (y - 1.02) ** 2 / 0.52 ** 2 <= 1;
  const neck = Math.abs(x - 0.5) < 0.07 && y > 0.4 && y < 0.6;
  return head || shoulders || neck;
};

// Luz vinda da esquerda/cima, com sombra sob o queixo.
const bustLight: Light = (x, y) => {
  const side = 1 - Math.max(0, x - 0.25) * 1.15;
  const top = 1 - Math.max(0, y - 0.15) * 0.45;
  const chin = y > 0.48 && y < 0.62 ? 0.35 : 1;
  return Math.max(0.12, Math.min(1, side * top * chin));
};

type Props = {
  width?: number;
  height?: number;
  cell?: number;
  outlineOffset?: [number, number];
  outlineColor?: string;
  reveal?: number; // 0–1, revela de cima para baixo
};

export const HalftoneBust: React.FC<Props> = ({
  width = 620,
  height = 760,
  cell = 11,
  outlineOffset = [-22, 18],
  outlineColor = colors.red,
  reveal = 1,
}) => {
  const dots = useMemo(() => {
    const out: {x: number; y: number; r: number}[] = [];
    for (let py = cell / 2; py < height; py += cell) {
      for (let px = cell / 2; px < width; px += cell) {
        const nx = px / width;
        const ny = py / height;
        if (!inBust(nx, ny)) continue;
        out.push({x: px, y: py, r: (cell / 2) * 1.05 * Math.sqrt(bustLight(nx, ny))});
      }
    }
    return out;
  }, [width, height, cell]);

  const clipY = height * reveal;
  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      <defs>
        <clipPath id="reveal">
          <rect x={-60} y={-60} width={width + 120} height={clipY + 60} />
        </clipPath>
        <mask id="bustMask">
          <rect width={width} height={height} fill="#000" />
          <ellipse cx={width * 0.5} cy={height * 0.3} rx={width * 0.17} ry={height * 0.22} fill="#fff" />
          <ellipse cx={width * 0.5} cy={height * 1.02} rx={width * 0.46} ry={height * 0.52} fill="#fff" />
          <rect x={width * 0.43} y={height * 0.4} width={width * 0.14} height={height * 0.2} fill="#fff" />
        </mask>
      </defs>
      <g clipPath="url(#reveal)">
        {/* traço vermelho deslocado, atrás do recorte */}
        <g transform={`translate(${outlineOffset[0]} ${outlineOffset[1]})`} mask="url(#bustMask)">
          <rect width={width} height={height} fill={outlineColor} />
        </g>
        {/* base preta para o halftone ler por cima do vermelho */}
        <g mask="url(#bustMask)">
          <rect width={width} height={height} fill={colors.black} />
        </g>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={colors.white} />
        ))}
      </g>
    </svg>
  );
};
