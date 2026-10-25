import React from 'react';
import {AbsoluteFill} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg, INK, RED} from '../feudal/Common';
import {TornDefs} from '../feudal/StyleV2';
import {Hero} from './WhatIfTest';

// Avatar (800×800): cara da personagem em surpresa, fundo vermelho (o recorte do YouTube é circular).
export const IfAvatar: React.FC = () => (
  <AbsoluteFill style={{background: RED}}>
    <svg width={800} height={800} viewBox="828 252 264 264" style={{position: 'absolute', inset: 0}}>
      <Hero t={1.32} />
    </svg>
  </AbsoluteFill>
);

// Banner (2560×1440): zona segura central 1546×423 (x 507–2053, y 508–931). Tudo o que importa fica lá dentro.
export const IfBanner: React.FC = () => {
  const WX = 1600, WY = 520, WW = 450, WH = 410;      // parede
  const bricks: JSX.Element[] = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 6; c++) {
    const off = r % 2 ? 44 : 0;
    bricks.push(<rect key={`${r}-${c}`} x={WX + c * 88 - off + 2} y={WY + r * 55 + 2} width={84} height={51} fill="#d8cdb8" stroke={INK} strokeWidth={3} />);
  }
  return (
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      <svg width={2560} height={1440} viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0}}>
        <defs>
          <clipPath id="wallC"><rect x={WX} y={WY} width={WW} height={WH} /></clipPath>
          <clipPath id="beforeWall"><rect x={0} y={0} width={WX} height={1440} /></clipPath>
          <clipPath id="afterWall"><rect x={WX} y={0} width={WW} height={1440} /></clipPath>
        </defs>
        <g clipPath="url(#wallC)">{bricks}</g>
        <rect x={WX} y={WY} width={WW} height={WH} fill="none" stroke={INK} strokeWidth={8} />
        {/* personagem a atravessar a parede: a parte da frente a cheio, a que está "dentro" translúcida */}
        <g clipPath="url(#beforeWall)"><g transform={`translate(${WX + 24} 930) scale(0.8) translate(-960 -870)`}><Hero t={0.5} /></g></g>
        <g clipPath="url(#afterWall)" opacity={0.3}><g transform={`translate(${WX + 24} 930) scale(0.8) translate(-960 -870)`}><Hero t={0.5} /></g></g>
      </svg>
      <div style={{position: 'absolute', left: 560, top: 600, fontFamily: fonts.heading, fontSize: 92, lineHeight: 1, color: INK, textTransform: 'uppercase'}}>
        If<span style={{background: RED, color: '#fff', padding: '0 14px', marginLeft: 6}}>superpower</span>
      </div>
      <div style={{position: 'absolute', left: 560, top: 730, fontFamily: fonts.heading, fontSize: 42, color: INK, textTransform: 'uppercase', letterSpacing: 2}}>
        Every power has a catch.
      </div>
    </AbsoluteFill>
  );
};
