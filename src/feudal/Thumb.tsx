import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {ArtSlot, Bg, Defs, INK, PAPER, RED, SceneCtx} from './Common';

// Miniatura 1280×720 (desenhada a 1920×1080 e reduzida). Variantes de texto: A "NEW LORDS?" · B "DIGITAL SERFDOM".
// Para fotos de CEOs: pôr recortes PNG (fundo transparente) em public/feudal/thumb/ceo-1..3.png e `npm run feudal:ingest` mete-os aqui.
import thumb from './thumb.json';
const PH = thumb as string[];

const Phone: React.FC = () => (
  <svg width="520" height="860" viewBox="0 0 520 860">
    <rect x="10" y="10" width="500" height="840" rx="70" fill="#0b0b0b" stroke="#fff" strokeWidth="8" />
    <rect x="42" y="60" width="436" height="740" rx="40" fill="#111" />
    <rect x="86" y="560" width="348" height="110" rx="55" fill={RED} />
    <text x="260" y="634" textAnchor="middle" fontFamily={fonts.heading} fontSize="64" fill="#fff">ACCEPT</text>
    {[0, 1, 2].map((i) => <rect key={i} x="86" y={150 + i * 80} width={300 - i * 60} height="22" fill="#444" />)}
  </svg>
);

export const Thumb: React.FC<{variant?: 'A' | 'B'}> = ({variant = 'A'}) => {
  const A = variant === 'A';
  return (
    <SceneCtx.Provider value={{start: 0}}>
      <AbsoluteFill>
        <Bg theme="paper" />
        <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}><Defs /></svg>
        <ArtSlot name="f-stone-tower" x={820} y={80} w={1100} h={900} at={-9} />
        <div style={{position: 'absolute', right: 40, top: 150, transform: 'rotate(7deg)'}}><Phone /></div>
        {PH.map((f, i) => <img key={f} src={staticFile(`feudal/thumb/${f}`)} style={{position: 'absolute', left: 560 + i * 170, bottom: 0, height: 560}} />)}
        <div style={{position: 'absolute', left: 70, top: 90, fontFamily: fonts.heading, textTransform: 'uppercase', lineHeight: 0.92, color: INK}}>
          <div style={{fontSize: A ? 330 : 250, WebkitTextStroke: `2px ${INK}`}}>{A ? 'NEW' : 'DIGITAL'}</div>
          <div style={{fontSize: A ? 330 : 250, background: RED, color: '#fff', display: 'inline-block', padding: '0 34px', boxShadow: `14px 14px 0 ${INK}`}}>{A ? 'LORDS?' : 'SERFDOM'}</div>
        </div>
        <div style={{position: 'absolute', left: 80, bottom: 70, fontFamily: fonts.mono, fontSize: 40, letterSpacing: 6, color: INK, background: PAPER, padding: '8px 18px', border: `4px solid ${INK}`}}>YOU PAY RENT. YOU NEVER SEE THE BILL.</div>
      </AbsoluteFill>
    </SceneCtx.Provider>
  );
};
