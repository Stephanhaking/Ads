import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg, FPS, INK, Lines, RED, clamp, ease} from '../feudal/Common';
import {CLOCKS, ObjArt} from '../feudal/Collage';
import {TornDefs} from '../feudal/StyleV2';
import words from './words.json';
import {GBEATS, G_END} from './beats';
import type {GBeat} from './beats';
import {TransitionAt, punchStyle} from './Transitions';

export const G2_TOTAL = (words as {total: number}).total;
export const G2_FRAMES = Math.ceil(G2_TOTAL * FPS) + 30;
const cut = (n: string) => staticFile(`google2/cut/${n}.png`);
const useT = () => useCurrentFrame() / FPS;
const fit = (L: string[], max = 108, w = 860) => Math.min(max, Math.floor(w / (Math.max(...L.flatMap((l) => l.split(' ').map((x) => x.length)), 1) * 0.78)));

// legenda grande à esquerda; linhas entram uma a uma
const Cap: React.FC<{L: string[]; hot?: number[]; w?: number; size?: number; y?: number}> = ({L, hot, w = 880, size, y = 230}) => (
  <Lines lines={L} times={L.map((_, i) => 0.12 + i * 0.28)} x={110} y={y} size={size ?? fit(L, 108, w)} theme="paper" hot={hot ?? []} width={w} />
);

// imagem recortada (alpha) à direita: entra com mola, flutua, sombra
const CutImg: React.FC<{n: string; x?: number; y?: number; w?: number; h?: number}> = ({n, x = 1000, y = 120, w = 860, h = 800}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const sp = spring({frame: f, fps: FPS, config: {damping: 14, stiffness: 190, mass: 0.8}});
  return (
    <div style={{position: 'absolute', left: x + (1 - sp) * 260, top: y + Math.sin(t * 1.3) * 8, width: w, height: h, transform: `rotate(${(1 - sp) * 7 + Math.sin(t * 0.9) * 0.6}deg) scale(${(0.92 + sp * 0.08) * (1 + t * 0.012)})`, opacity: Math.min(1, f / 5)}}>
      <div style={{position: 'absolute', left: '14%', right: '14%', bottom: 4, height: 26, borderRadius: '50%', background: 'rgba(26,20,16,0.18)', filter: 'blur(14px)'}} />
      <Img src={cut(n)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain'}} />
    </div>
  );
};

// ── "câmara fixa, o mundo passa" com mecânica exata ──────────────────────────────
// A distância percorrida pelo chão (`travelled`, px) comanda tudo: rodas (ângulo = distância / raio), passada (pé de apoio
// anda à velocidade do chão, sem deslizar), e o corredor em paralaxe.
const rig = (n: string) => staticFile(`google2/rig/${n}.png`);
const layerS = (n: string, extra?: React.CSSProperties) => <Img src={rig(n)} style={{position: 'absolute', left: 0, top: 0, ...extra}} />;
const travel = (t: number) => (t < 1.2 ? 300 * ((t * t) / 2.4) : 300 * (0.6 + (t - 1.2)));
const frac = (x: number) => x - Math.floor(x);

// passada: x do pé relativo à anca (px da imagem) e elevação, para a fase p ∈ [0,1)
const A_DEG = 26, LEG = 310, FOOT_A = LEG * Math.sin((A_DEG * Math.PI) / 180);
const footPhase = (p: number) => {
  if (p < 0.5) return {x: FOOT_A * (1 - 4 * p), lift: 0};            // apoio: o pé anda para trás a velocidade constante
  const s = (p - 0.5) * 2;
  return {x: -FOOT_A + 2 * FOOT_A * (0.5 - 0.5 * Math.cos(Math.PI * s)), lift: 26 * Math.sin(Math.PI * s)};
};
const Nurse: React.FC<{tr: number; k: number}> = ({tr, k}) => {
  const STRIDE = (4 * FOOT_A) * k;                                    // px do ecrã por ciclo completo (dois passos)
  const u = frac(tr / STRIDE);
  const HIP = '300px 790px';
  const leg = (p: number, theta0: number, name: string) => {
    const {x, lift} = footPhase(p);
    const th = Math.asin(Math.max(-1, Math.min(1, x / LEG)));
    return {el: layerS(name, {transformOrigin: HIP, transform: `translateY(${-lift}px) rotate(${(-(th * 180) / Math.PI + theta0)}deg)`}), th, st: p < 0.5};
  };
  const F = leg(u, 29, 'nurse-legF'), B = leg(frac(u + 0.5), -40, 'nurse-legB');
  const stance = F.st ? F.th : B.th;
  const drop = LEG * (1 - Math.cos(stance));                          // a anca desce quando a perna de apoio está inclinada
  const arm = Math.sin(u * Math.PI * 2) * 4;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 651, height: 1111, transform: `translateY(${drop}px)`}}>
      {B.el}
      {F.el}
      {layerS('nurse-body', {transformOrigin: '260px 330px', transform: `rotate(${arm * 0.25}deg)`})}
    </div>
  );
};
const Wheeled: React.FC<{body: string; wheels: {n: string; cx: number; cy: number; r: number}[]; tr: number; k: number; bounce?: number}> = ({body, wheels, tr, k, bounce = 0}) => (
  <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${bounce}px)`}}>
    {layerS(body)}
    {wheels.map((w) => layerS(w.n, {transformOrigin: `${w.cx}px ${w.cy}px`, transform: `rotate(${(tr / (w.r * k)) * (180 / Math.PI)}deg)`}))}
  </div>
);
const AMB = {body: 'amb-body', wheels: [{n: 'amb-wheel0', cx: 313.5, cy: 636.5, r: 138}, {n: 'amb-wheel1', cx: 1298.5, cy: 636.5, r: 138}]};
const BED = {body: 'bed-body', wheels: [0, 1, 2].map((i) => ({n: `bed-wheel${i}`, cx: [220, 700, 1240][i], cy: 700, r: 52}))};

const Chase: React.FC<{n: string}> = ({n}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const ramp = interpolate(t, [0, 1.2], [0, 1], {...clamp, easing: ease});
  const tr = travel(t);
  const ROAD = 800;
  const tile = 1143;
  const isN = n.startsWith('nurse'), isB = n.startsWith('hospital-bed');
  const dims = isN ? {w: 651, h: 1111, h2: 560, x: 760} : isB ? {w: 1500, h: 747, h2: 400, x: 600} : {w: 1500, h: 781, h2: 430, x: 640};
  const k = dims.h2 / dims.h;
  const bounce = isN ? 0 : Math.sin(t * 9) * 1.2 * ramp;
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Img key={i} src={cut('hospital-corridor-wall')} style={{position: 'absolute', left: ((i * tile - tr * 0.55) % (3 * tile) + 3 * tile) % (3 * tile) - tile, top: ROAD - 560, height: 560, opacity: 0.55}} />
      ))}
      <ClockWall />
      <div style={{position: 'absolute', left: -60, right: -60, top: ROAD, height: 170, background: INK, filter: 'url(#torn)'}} />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 14}).map((_, i) => <rect key={i} x={((i * 190 - tr) % 2660 + 2660) % 2660 - 200} y={ROAD + 62} width="110" height="9" rx="3" fill="#F2EADB" />)}
      </svg>
      <div style={{position: 'absolute', left: dims.x + (1 - ramp) * -800, top: ROAD - dims.h2 - 4, width: dims.w, height: dims.h, transformOrigin: '0 0', transform: `translateY(${(dims.h2 - dims.h * k) * 0}px) scale(${k})`}}>
        <div style={{position: 'absolute', left: '8%', right: '8%', bottom: -10, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.3)', filter: 'blur(14px)'}} />
        {isN ? <Nurse tr={tr} k={k} /> : isB ? <Wheeled {...BED} tr={tr} k={k} bounce={bounce} /> : <Wheeled {...AMB} tr={tr} k={k} bounce={bounce} />}
      </div>
    </>
  );
};

// relógio de parede às 3:12:xx, com ponteiros exatos: horas 96°, minutos 72° + o que passa, segundos a varrer
const ClockFixed: React.FC<{name: string; size: number; t0?: number}> = ({name, size, t0 = 0}) => {
  const t = useT();
  const c = CLOCKS[name];
  const secs = 12 * 60 + t0 + t;                                      // segundos desde as 3:00
  const min = (secs / 60) * 6;                                        // 6° por minuto
  const hour = 90 + (secs / 3600) * 30;                               // 30° por hora, começa nas 3
  const sec = (secs % 60) * 6;
  const hand = (deg: number, len: number, wd: number, tail = 0.12) => (
    <g transform={`rotate(${deg} ${c.cx} ${c.cy})`}>
      <path d={`M ${c.cx - wd} ${c.cy + len * tail} L ${c.cx - wd * 0.45} ${c.cy - len} L ${c.cx + wd * 0.45} ${c.cy - len} L ${c.cx + wd} ${c.cy + len * tail} Z`} fill={INK} stroke="#fff" strokeWidth={3} />
    </g>
  );
  const f = staticFile(`feudal/obj/${name}.png`);
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <Img src={f} style={{width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply'}} />
      <svg viewBox="0 0 1600 1600" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <g style={{filter: 'drop-shadow(5px 7px 6px rgba(0,0,0,0.35))'}}>
          {hand(hour, c.h, 20 * c.w)}{hand(min, c.m, 14 * c.w)}
          <g transform={`rotate(${sec} ${c.cx} ${c.cy})`}>
            <rect x={c.cx - 4 * c.w} y={c.cy - c.sec} width={8 * c.w} height={c.sec + 70} fill={RED} />
            <circle cx={c.cx} cy={c.cy + 70} r={14 * c.w} fill={RED} />
          </g>
          <circle cx={c.cx} cy={c.cy} r={26 * c.w} fill={RED} stroke={INK} strokeWidth={6} />
          <circle cx={c.cx} cy={c.cy} r={8 * c.w} fill={INK} />
        </g>
      </svg>
    </div>
  );
};
const ClockWall: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12], [0, 1], clamp);
  return <div style={{position: 'absolute', right: 120, top: 250, mixBlendMode: 'multiply', transform: `scale(${0.85 + 0.15 * o})`}}><ClockFixed name="clock-face" size={240} t0={4.8} /></div>;
};

const Count: React.FC<{v: number; suf?: string; lab?: string}> = ({v, suf, lab}) => {
  const t = useT();
  const p = interpolate(t, [0, 1.3], [0, 1], {...clamp, easing: ease});
  const val = Math.round(v * p);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: fonts.heading, textTransform: 'uppercase'}}>
      <div style={{fontSize: 300, lineHeight: 1, color: RED, transform: `scale(${0.9 + 0.1 * p})`}}>{val.toLocaleString('en-US')}{suf}</div>
      <div style={{fontSize: 72, color: INK, opacity: interpolate(t, [0.5, 1.0], [0, 1], clamp)}}>{lab}</div>
    </div>
  );
};

const Big: React.FC<{L: string[]; hot?: number[]}> = ({L, hot}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 260}}>
    <Lines lines={L} times={L.map((_, i) => 0.15 + i * 0.35)} x={150} y={0} size={fit(L, 128, 1620)} theme="paper" hot={hot ?? []} width={1620} />
  </div>
);

const Strike: React.FC<{n: string; L: string[]}> = ({n, L}) => {
  const t = useT();
  const s = interpolate(t, [1.4, 2.0], [0, 1], {...clamp, easing: ease});
  return (
    <>
      <div style={{position: 'absolute', left: 110, top: 360, fontFamily: fonts.heading, fontSize: 130, color: INK, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
        {L[0]}
        <div style={{position: 'absolute', left: -10, top: '52%', height: 16, width: `${s * 106}%`, background: RED}} />
      </div>
      <CutImg n={n} x={1040} y={500} w={800} h={330} />
    </>
  );
};

const Stock: React.FC<{n: string}> = ({n}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 980, top: 150, width: 880, height: 600, overflow: 'hidden', opacity: o, boxShadow: '14px 14px 0 #E5232B'}}>
      <OffthreadVideo src={staticFile(`google/stock/s-${n}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.15)'}} />
    </div>
  );
};

const ObjView: React.FC<{n: string}> = ({n}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const p = interpolate(t, [0, 0.45], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: 1030, top: 150, width: 800, height: 740, overflow: 'hidden', opacity: p, mixBlendMode: 'multiply', transform: `translateX(${(1 - p) * 200}px) rotate(${(1 - p) * 7}deg)`}}>
      <div style={{position: 'absolute', left: 80, top: 20, transform: `translateY(${Math.sin(t * 1.4) * 8}px)`}}><ObjArt name={n} size={640} /></div>
    </div>
  );
};

const ClockBeat: React.FC<{n: string}> = ({n}) => {
  const f = useCurrentFrame(); const p = interpolate(f / FPS, [0, 0.45], [0, 1], {...clamp, easing: ease});
  const t = f / FPS;
  return <div style={{position: 'absolute', left: 1030, top: 150, opacity: p, transform: `translateY(${Math.sin(t * 1.4) * 8}px)`}}><ClockFixed name={n} size={700} t0={0} /></div>;
};

const Beat: React.FC<{b: GBeat}> = ({b}) => (
  <>
    {b.k === 'chase' && <><Chase n={b.n!} /><Cap L={b.L!} hot={b.hot} w={1500} size={b.L!.length > 2 ? 84 : 104} y={60} /></>}
    {b.k === 'img' && <><CutImg n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'obj' && <><ObjView n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'clock' && <><ClockBeat n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'stock' && <><Stock n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'big' && <Big L={b.L!} hot={b.hot} />}
    {b.k === 'count' && <Count v={b.v!} suf={b.suf} lab={b.lab} />}
    {b.k === 'strike' && <Strike n={b.n!} L={b.L!} />}
  </>
);

// contador de leituras: o fio condutor do vídeo (0:00–0:57)
const Counter: React.FC = () => {
  const t = useT();
  const o = interpolate(t, [0.4, 1.0, 55.5, 57.5], [0, 1, 1, 0], clamp);
  const n = Math.floor(Math.pow(t, 1.75) * 3.2);
  return (
    <div style={{position: 'absolute', right: 60, top: 40, opacity: o, textAlign: 'right', fontFamily: fonts.mono, color: INK}}>
      <div style={{fontSize: 22, letterSpacing: 6}}><span style={{display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: RED, marginRight: 10, opacity: 0.4 + 0.6 * (Math.floor(t * 2) % 2)}} />READINGS</div>
      <div style={{fontSize: 64, letterSpacing: 4, marginTop: 4}}>{String(n).padStart(5, '0')}</div>
    </div>
  );
};

export const GoogleV2: React.FC = () => {
  const frame = useCurrentFrame();
  const punches = GBEATS.filter((b) => b.tr === 'punch').map((b) => b.s);
  return (
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      <AbsoluteFill style={punchStyle(frame, punches)}>
        {GBEATS.map((b, i) => {
          const e = i + 1 < GBEATS.length ? GBEATS[i + 1].s : G_END;
          return (
            <Sequence key={i} from={Math.round(b.s * FPS)} durationInFrames={Math.max(1, Math.round((e - b.s) * FPS))} layout="none">
              <Beat b={b} />
              {(b.k === 'img' || b.k === 'obj') && !b.tr && <Audio src={staticFile('audio/sfx/whoosh-b.wav')} volume={0.18} />}
            </Sequence>
          );
        })}
        <Counter />
      </AbsoluteFill>
      {GBEATS.filter((b) => b.tr).map((b, i) => <TransitionAt key={i} at={b.s} kind={b.tr!} />)}
      <Audio src={staticFile('audio/google2/voice.wav')} />
      <Audio src={staticFile('audio/music/distinguish.mp3')} volume={(f) => 0.15 * interpolate(f, [0, 90], [0, 1], clamp)} />
    </AbsoluteFill>
  );
};
