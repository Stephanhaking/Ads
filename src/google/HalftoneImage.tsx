import React from 'react';
import {Img, staticFile} from 'remotion';
import {colors} from '../styles';

// Foto halftone (gerada por tools/make_halftone.py) com traço vermelho deslocado atrás.
// Três camadas: silhueta vermelha (deslocada) → silhueta preta → pontos brancos.

export type PicName = 'hospital' | 'records' | 'doctor' | 'paper' | 'screen' | 'exterior' | 'person' | 'notes';

const SIZE: Record<PicName, [number, number]> = {
  hospital: [1400, 933],
  records: [1400, 933],
  doctor: [900, 1350],
  paper: [1400, 933],
  screen: [1400, 933],
  exterior: [1400, 933],
  person: [900, 1350],
  notes: [1400, 933],
};

type Props = {
  name: PicName;
  x: number;
  y: number;
  width: number;
  reveal?: number; // 0–1, de cima para baixo
  opacity?: number;
  outlineOffset?: [number, number];
};

export const HalftoneImage: React.FC<Props> = ({name, x, y, width, reveal = 1, opacity = 1, outlineOffset = [-18, 16]}) => {
  const [iw, ih] = SIZE[name];
  const height = (ih / iw) * width;
  const dots = staticFile(`google/ht/${name}.png`);
  const mask = staticFile(`google/ht/${name}-mask.png`);
  const masked = (bg: string, dx = 0, dy = 0): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    transform: `translate(${dx}px, ${dy}px)`,
    background: bg,
    WebkitMaskImage: `url(${mask})`,
    maskImage: `url(${mask})`,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity,
        clipPath: `inset(-40px -40px ${(1 - reveal) * 100}% -40px)`,
      }}
    >
      <div style={masked(colors.red, outlineOffset[0], outlineOffset[1])} />
      <div style={masked(colors.black)} />
      <Img src={mask} style={{position: 'absolute', width: 1, height: 1, opacity: 0}} />
      <Img src={dots} style={{position: 'absolute', inset: 0, width, height}} />
    </div>
  );
};
