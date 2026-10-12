import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg} from '../feudal/Common';

const INK = '#1a1410', RED = '#E5232B';
const Line: React.FC<{t: string; hot?: boolean; size: number; color?: string}> = ({t, hot, size, color}) => (
  <div style={{fontFamily: fonts.heading, fontSize: size, lineHeight: 1.02, textTransform: 'uppercase', marginBottom: 8}}>
    <span style={{background: hot ? RED : 'transparent', color: hot ? '#fff' : color ?? INK, padding: hot ? '0 26px' : 0}}>{t}</span>
  </div>
);

// A: estilo do canal (papel, gravura, um vermelho). B: usa a imagem do olho enviada pelo utilizador.
export const GThumb: React.FC<{variant: 'A' | 'B'; text?: boolean}> = ({variant, text = true}) => (
  <AbsoluteFill style={{background: '#EADFC8'}}>
    {variant === 'A' ? (
      <>
        <Bg theme="paper" />
        <Img src={staticFile('google2/cut/window-peering-eye.png')} style={text ? {position: 'absolute', right: 70, top: 30, height: 1020, filter: 'drop-shadow(18px 22px 0 rgba(26,20,16,0.18))'} : {position: 'absolute', left: 560, top: 20, height: 1040, filter: 'drop-shadow(18px 22px 0 rgba(26,20,16,0.18))'}} />
        {text && <div style={{position: 'absolute', left: 80, top: 120}}>
          <Line t="Who" size={250} /><Line t="dies" size={250} /><Line t="next?" hot size={250} />
        </div>}
      </>
    ) : (
      <>
        <Img src={staticFile('google2/thumb/eye-ref.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        {text && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 100%)'}} />}
        {text && <div style={{position: 'absolute', left: 70, top: 210}}>
          <Line t="Who" size={200} color="#fff" /><Line t="dies" size={200} color="#fff" /><Line t="next?" hot size={200} />
        </div>}
      </>
    )}
  </AbsoluteFill>
);
