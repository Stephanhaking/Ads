import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {fonts} from '../styles';
import {Bg, FPS, INK, RED, clamp, ease} from '../feudal/Common';
import {TornDefs} from '../feudal/StyleV2';

// Cena "câmara fixa, o mundo passa": o veículo fica no sítio (só baloiça e as rodas rodam), a estrada rasgada desliza,
// cenários recortados atravessam em paralaxe (planos longe/perto), fumo, linhas de velocidade e um título que escreve.
const c = (n: string) => staticFile(`feudal/chase/${n}.png`);
const K = 0.5;                // escala do motor (imagem recortada 1330×990)
const ROAD_Y = 790;
const SPEED = 520;             // px/s do plano de estrada
type Item = {n: string; at: number; layer: 0 | 1; h: number};
const ITEMS: Item[] = [
  {n: 'windmill', at: 0.3, layer: 0, h: 330}, {n: 'tower', at: 1.5, layer: 1, h: 470}, {n: 'barn', at: 2.8, layer: 0, h: 300},
  {n: 'stall', at: 4.0, layer: 1, h: 340}, {n: 'toll', at: 5.4, layer: 0, h: 230}, {n: 'rope', at: 6.6, layer: 1, h: 420},
  {n: 'windmill', at: 8.0, layer: 0, h: 330}, {n: 'tower', at: 9.0, layer: 1, h: 470},
];

export const CHASE_FRAMES = 12 * FPS;
export const ChaseDemo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ramp = interpolate(t, [0, 1.6], [0, 1], {...clamp, easing: ease});   // arranque
  const v = SPEED * ramp;
  const dist = (SPEED * (t - 1.6 + 1.6 * 0.5)) * 1;                           // distância (integral simples do arranque)
  const travelled = t < 1.6 ? SPEED * (t * t / (2 * 1.6)) : SPEED * (0.8 + (t - 1.6));
  const bob = Math.sin(t * 9) * 3 * ramp + Math.sin(t * 17) * 1.2 * ramp;
  const rot = travelled * 0.36;       // graus das rodas ∝ distância
  const ex = 420, ey = ROAD_Y - 990 * K + 6;
  const title = interpolate(t, [3.2, 4.2], [0, 1], {...clamp, easing: ease});
  const wipe = (p: number) => `inset(-10% ${(1 - p) * 100}% -10% 0)`;
  return (
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      {/* linhas de velocidade */}
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.55 * ramp}}>
        {Array.from({length: 9}).map((_, i) => {
          const y = 190 + i * 62 + (i % 3) * 13;
          const x = 1920 - (((travelled * (1.6 + (i % 4) * 0.5)) + i * 340) % 2400) + 200;
          return <line key={i} x1={x} x2={x + 140 + (i % 3) * 70} y1={y} y2={y} stroke={INK} strokeWidth="3" strokeLinecap="round" opacity={0.25 + (i % 3) * 0.1} />;
        })}
      </svg>
      {/* cenários em paralaxe */}
      {ITEMS.map((it, i) => {
        const sp = it.layer ? 1 : 0.55;
        const x = 1960 - (travelled - (it.at < 1.6 ? 0 : SPEED * (it.at - 0.8) )) * sp + 0 - (it.at < 1.6 ? 0 : 0);
        // posição: entra pela direita no instante `at` e atravessa com a velocidade do plano
        const born = it.at < 1.6 ? SPEED * (it.at * it.at / 3.2) : SPEED * (0.8 + (it.at - 1.6));
        const px = 1980 - (travelled - born) * sp;
        if (px < -900 || px > 2100) return null;
        const base = ROAD_Y - (it.layer ? 0 : 36);
        return <Img key={i} src={c('cut-' + it.n)} style={{position: 'absolute', left: px, top: base - it.h, height: it.h, opacity: it.layer ? 1 : 0.8, filter: it.layer ? undefined : 'blur(0.6px)'}} />;
      })}
      {/* estrada de papel rasgado */}
      <div style={{position: 'absolute', left: -60, right: -60, top: ROAD_Y, height: 190, background: '#1a1410', filter: 'url(#torn)', transform: `translateX(${-60 + ((travelled * 0.0) % 1)}px)`}} />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 14}).map((_, i) => {
          const x = ((i * 190 - travelled) % 2660 + 2660) % 2660 - 200;
          return <rect key={i} x={x} y={ROAD_Y + 62} width="110" height="9" rx="3" fill="#F2EADB" />;
        })}
      </svg>
      {/* veículo fixo */}
      <div style={{position: 'absolute', left: ex, top: ey + bob, width: 1330 * K, height: 990 * K, transform: `translateX(${(1 - ramp) * -900}px)`}}>
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 4, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', filter: 'blur(14px)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 1330, height: 990, transformOrigin: '0 0', transform: `scale(${K})`}}>
          <Img src={c('engine-sil')} style={{position: 'absolute', inset: 0}} />
          <Img src={c('engine-smallwheel')} style={{position: 'absolute', inset: 0, transformOrigin: '188px 810px', transform: `rotate(${rot * 1.38}deg)`}} />
          <Img src={c('engine-base')} style={{position: 'absolute', inset: 0}} />
          <Img src={c('engine-bigwheel')} style={{position: 'absolute', inset: 0, transformOrigin: '1035px 768px', transform: `rotate(${rot}deg)`}} />
          <Img src={c('engine-rod')} style={{position: 'absolute', inset: 0, transform: `translate(${Math.sin(rot * Math.PI / 180) * 14}px, ${Math.cos(rot * Math.PI / 180) * 6}px)`}} />
        </div>
        {/* fumo da chaminé (1180,390 → recorte 1030,40) */}
        <svg width="1330" height="990" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transformOrigin: '0 0', transform: `scale(${K})`}}>
          {Array.from({length: 9}).map((_, i) => {
            const p = ((t * 0.7 + i / 9) % 1);
            return <circle key={i} cx={1030 - p * 380 + Math.sin(p * 6 + i) * 22} cy={40 - p * 420} r={34 + p * 90} fill="#1a1410" opacity={0.26 * (1 - p) * ramp} />;
          })}
        </svg>
      </div>
      {/* título */}
      <div style={{position: 'absolute', left: 190, top: 70, fontFamily: fonts.heading, textTransform: 'uppercase', color: INK}}>
        <div style={{fontSize: 124, lineHeight: 1, clipPath: wipe(title), letterSpacing: -3}}>Same engine.</div>
        <div style={{height: 14, background: RED, width: 530 * interpolate(t, [4.2, 5.0], [0, 1], {...clamp, easing: ease}), marginTop: 6}} />
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 46, textTransform: 'none', marginTop: 18, opacity: interpolate(t, [5.0, 5.6], [0, 1], clamp)}}>pointed at the final variable</div>
      </div>
    </AbsoluteFill>
  );
};
