import React from 'react';
import {Img, staticFile} from 'remotion';
import {colors} from '../styles';
import {useCurrentFrame} from '../timeline';

// Foto halftone (gerada por tools/make_halftone.py) com traço vermelho deslocado atrás.
// Quatro camadas: sombra vermelha deslocada → contorno branco → base preta → pontos brancos.

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
  const frame = useCurrentFrame();
  const [iw, ih] = SIZE[name];
  // flutuação lenta (profundidade) — o recorte "respira" ao de leve
  const floatY = Math.sin(frame / 55) * 6;
  const tilt = Math.sin(frame / 90) * 0.35;
  const height = (ih / iw) * width;
  const dots = staticFile(`google/ht/${name}.png`);
  const mask = staticFile(`google/ht/${name}-mask.png`);
  const outline = staticFile(`google/ht/${name}-outline.png`);
  const masked = (bg: string, dx = 0, dy = 0, m = mask): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    transform: `translate(${dx}px, ${dy}px)`,
    background: bg,
    WebkitMaskImage: `url(${m})`,
    maskImage: `url(${m})`,
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
        transform: `translateY(${floatY}px) rotate(${tilt}deg)`,
        filter: 'drop-shadow(0px 20px 24px rgba(0,0,0,0.30))',
        clipPath: `inset(-40px -40px ${(1 - reveal) * 100}% -40px)`,
      }}
    >
      {/* sombra vermelha deslocada → contorno branco (sticker) → base preta → pontos */}
      {/* as camadas deslocadas ficam recortadas aos limites da imagem: sem barras soltas nas bordas */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <div style={masked(colors.red, outlineOffset[0], outlineOffset[1], outline)} />
      </div>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <div style={masked(colors.white, 0, 0, outline)} />
      </div>
      <div style={masked(colors.black)} />
      <Img src={mask} style={{position: 'absolute', width: 1, height: 1, opacity: 0}} />
      <Img src={outline} style={{position: 'absolute', width: 1, height: 1, opacity: 0}} />
      <Img src={dots} style={{position: 'absolute', inset: 0, width, height}} />
    </div>
  );
};
