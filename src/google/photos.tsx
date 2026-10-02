import React from 'react';
import {interpolate} from 'remotion';
import {useCurrentFrame} from '../timeline';
import {HalftoneImage} from './HalftoneImage';
import {LayeredScene} from './Layers';
import {KineticText, RedDisc} from './Fx';
import {Shell} from './scenes';
import {Tag} from './Vox';
import sizes from './picSizes.json';
import bottomTouch from './picBottom.json';

// Cenas de foto (halftone com contorno sticker): uma foto por ideia, usada uma só vez no vídeo.
export type PhotoSpec = {
  side: 'left' | 'right'; // lado onde fica a foto
  theme: 'paper' | 'red';
  disc?: 'disc' | 'ring' | 'block' | false;
  kinetic: string[][];
  hot?: string[];
  tag?: string;
  size?: number; // tamanho do título
};

export const PHOTOS: Record<string, PhotoSpec> = {
  // Ato III
  'a3-office': {side: 'right', theme: 'paper', disc: 'block', kinetic: [['Earn'], ['its keep']], hot: ['keep'], tag: 'A very expensive engine'},
  'a3-phone-scroll': {side: 'left', theme: 'paper', disc: 'disc', kinetic: [['Behaviour,'], ['measured']], hot: ['measured'], tag: 'Measure · store · sell'},
  'a3-billboard': {side: 'right', theme: 'paper', disc: 'ring', kinetic: [['A'], ['market']], hot: ['market'], tag: 'Each reading becomes a bet'},
  'a3-banknotes': {side: 'left', theme: 'red', disc: 'disc', kinetic: [['$403'], ['billion']], hot: ['billion'], tag: 'Alphabet · last year'},
  // Ato IV
  'a4-dial': {side: 'right', theme: 'paper', disc: 'disc', kinetic: [['A dangerous'], ['property']], hot: ['property']},
  'a4-chess': {side: 'left', theme: 'paper', disc: 'block', kinetic: [['Adjusting'], ['the world']], hot: ['world'], tag: 'around them'},
  'a4-corridor': {side: 'right', theme: 'paper', disc: false, kinetic: [['Shape the'], ['behaviour']], hot: ['behaviour'], tag: 'You already sold'},
  'a4-bed-phone': {side: 'left', theme: 'paper', disc: 'ring', kinetic: [['From watching'], ['to steering']], hot: ['steering']},
  // Ato V
  'a5-teen-phone': {side: 'right', theme: 'paper', disc: 'disc', kinetic: [['A product'], ['you use'], ['every day']], hot: ['day']},
  'a5-clock': {side: 'left', theme: 'paper', disc: false, kinetic: [['A billion'], ['hours'], ['a day']], hot: ['day']},
  'a5-many-screens': {side: 'right', theme: 'paper', disc: false, kinetic: [['Chosen'], ['for you']], hot: ['you'], tag: 'What the machine plays next'},
  'a5-crowd-top': {side: 'left', theme: 'red', disc: false, kinetic: [['A thousand'], ['times a day']], hot: ['day']},
  'a5-projector': {side: 'right', theme: 'paper', disc: 'disc', kinetic: [['An internal'], ['film']], hot: ['film'], tag: '2016'},
  // Ato VI
  'a6-laptop': {side: 'left', theme: 'paper', disc: false, kinetic: [['Hands on'], ['the wheel']], hot: ['wheel'], tag: 'You fitted them yourself'},
  'a6-hand-map': {side: 'right', theme: 'paper', disc: 'disc', kinetic: [['The map'], ['keeps the'], ['history']], hot: ['history']},
  'a6-handshake': {side: 'left', theme: 'paper', disc: 'block', kinetic: [['It rents'], ['it']], hot: ['it'], tag: 'Where it doesn’t own the window'},
  'a6-vault': {side: 'right', theme: 'red', disc: false, kinetic: [['~$20B'], ['a year']], hot: ['year'], tag: 'To stay the default'},
  'a6-courthouse': {side: 'left', theme: 'paper', disc: false, kinetic: [['2024.'], ['A court']], hot: ['court']},
  'a6-gavel': {side: 'right', theme: 'red', disc: false, kinetic: [['Defending'], ['the win']], hot: ['win']},
  // Ato VII
  'a7-window': {side: 'right', theme: 'paper', disc: false, kinetic: [['Watching'], ['from outside']], hot: ['outside']},
  'a7-night-typing': {side: 'left', theme: 'paper', disc: 'ring', kinetic: [['The one you'], ['turn to']], hot: ['turn']},
  'a7-hand-glass': {side: 'right', theme: 'paper', disc: false, kinetic: [['The glass'], ['you look'], ['through']], hot: ['through']},
  // Ato VIII
  'a8-hospital-hall': {side: 'left', theme: 'red', disc: false, kinetic: [['A day'], ['left to live']], hot: ['live'], size: 78},
  'a8-walk-away': {side: 'right', theme: 'paper', disc: false, kinetic: [['No'], ['villain']], hot: ['villain'], tag: 'Just an incentive'},
  'a8-meter': {side: 'left', theme: 'paper', disc: 'disc', kinetic: [['The'], ['meter']], hot: ['meter'], tag: 'You never saw it'},
  'a8-eye': {side: 'right', theme: 'red', disc: false, kinetic: [['Never what'], ['you’d buy']], hot: ['buy']},
};

const SZ = sizes as unknown as Record<string, [number, number]>;

const BOTTOM = new Set(bottomTouch as string[]);
const RECT = (n: string) => ['a4-corridor', 'a5-crowd-top', 'a6-laptop', 'a7-window', 'a8-walk-away', 'a8-hospital-hall', 'a8-eye'].includes(n);

// largura estimada de uma linha de texto em Archivo Black (maiúsculas)
const lineW = (chars: number, size: number) => chars * size * 0.68;

export const PhotoScene: React.FC<{name: string}> = ({name}) => {
  const spec = PHOTOS[name];
  const frame = useCurrentFrame();
  const [iw, ih] = SZ[name] ?? [1400, 933];
  const portrait = ih > iw;
  const touchesBottom = BOTTOM.has(name) && !RECT(name);

  // caixa da foto
  const maxW = portrait ? 620 : 900;
  const maxH = touchesBottom ? 940 : 800;
  const w = Math.min(maxW, (iw / ih) * maxH);
  const h = (ih / iw) * w;
  const photoLeft = spec.side === 'left';
  const x = photoLeft ? 110 : 1920 - 110 - w;
  const y = touchesBottom ? 1080 - h : Math.round(540 - h / 2); // fotos cortadas na base ancoram ao fundo do ecrã
  const cy = y + h / 2;

  // forma atrás: raio limitado, e o texto desvia-se dela
  const r = spec.disc ? Math.min(Math.max(w, h) * 0.5, 420) : 0;
  const shapeL = spec.disc ? Math.min(x, x + w / 2 - r) : x;
  const shapeR = spec.disc ? Math.max(x + w, x + w / 2 + r) : x + w;
  const textX = photoLeft ? shapeR + 70 : 110;
  const availW = photoLeft ? 1920 - 110 - textX : shapeL - 70 - 110;

  // título e legenda ajustam-se ao espaço livre
  const longest = Math.max(...spec.kinetic.map((l) => l.join(' ').length));
  const size = Math.min(spec.size ?? 96, availW / (longest * 0.68));
  const tagN = spec.tag ? spec.tag.length : 0;
  const tagSize = Math.min(32, availW / (0.78 * tagN + 1.2));
  const blockH = spec.kinetic.length * size * 1.08 + (spec.tag ? 60 + tagSize * 1.7 : 0);
  const ty = Math.max(120, Math.min(1080 - blockH - 120, 540 - blockH / 2));
  const reveal = interpolate(frame, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  void lineW;

  return (
    <Shell theme={spec.theme} grain={0.6}>
      <LayeredScene
        back={spec.disc ? <RedDisc x={x + w / 2} y={cy} r={r} appearAt={1} shape={spec.disc} /> : undefined}
        mid={<HalftoneImage name={name} x={x} y={y} width={w} reveal={reveal} />}
        fore={
          <>
            <KineticText lines={spec.kinetic} x={textX} y={ty} size={size} startAt={4} stagger={7} hot={spec.hot ?? []} />
            {spec.tag ? <Tag text={spec.tag} appearAt={22} x={textX} y={ty + spec.kinetic.length * size * 1.08 + 50} size={tagSize} fill /> : null}
          </>
        }
      />
    </Shell>
  );
};
