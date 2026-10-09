import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import {fonts} from '../styles';
import {Bg, FPS, INK, Lines, RED, clamp, ease} from '../feudal/Common';
import {CLOCKS, ObjArt} from '../feudal/Collage';
import {TornDefs} from '../feudal/StyleV2';
import words from './words.json';
import {GBEATS, G_END} from './beats';
import type {GBeat} from './beats';
import {TransitionAt, punchStyle, rollStyle} from './Transitions';

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

// passada: o pé/tornozelo anda à velocidade do chão durante o apoio; o pé fica plano (calcanhar toca, dedos saem) e a anca sobe/desce
import footDepth from './foot_depth.json';
const A_DEG = 26;
const HIPX = 300, HIPY = 790, GROUND = 1100;
const LEGS = {
  F: {A0: [440, 1052], th0: 29, drawnToeUp: 14},     // perna da frente: desenhada com a ponta do pé para cima
  B: {A0: [85, 1005], th0: -45, drawnToeUp: -19.5},  // perna de trás: desenhada na descolagem (calcanhar no ar)
} as const;
const lenOf = (k: 'F' | 'B') => Math.hypot(LEGS[k].A0[0] - HIPX, LEGS[k].A0[1] - HIPY);
const ease01 = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
const depthAt = (k: 'F' | 'B', css: number) => {
  const t = footDepth[k] as Record<string, number>;
  const c = Math.max(-45, Math.min(45, css)), lo = Math.floor(c), hi = Math.ceil(c);
  return t[String(lo)] + (t[String(hi)] - t[String(lo)]) * (c - lo);
};
const footToeUp = (p: number) => {                      // ângulo da ponta do pé (° para cima) ao longo do ciclo
  if (p < 0.5) { if (p < 0.1) return 14 * (1 - p / 0.1); if (p < 0.38) return 0; return -22 * ((p - 0.38) / 0.12); }
  return -22 + 36 * ease01((p - 0.5) / 0.5);
};
const rotPt = (dx: number, dy: number, deg: number) => { const r = (deg * Math.PI) / 180; return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r)]; };

const Nurse: React.FC<{tr: number; k: number}> = ({tr, k}) => {
  const FOOT_A = lenOf('F') * Math.sin((A_DEG * Math.PI) / 180);        // meio passo (px da imagem)
  const STRIDE = 4 * FOOT_A * k;                                           // px do ecrã por ciclo (dois passos)
  const u = frac(tr / STRIDE);
  const calc = (key: 'F' | 'B', p: number) => {
    const L = lenOf(key), cfg = LEGS[key];
    // posição horizontal do tornozelo relativa à anca: apoio linear (pé parado no chão), balanço suave
    const x = p < 0.5 ? FOOT_A * (1 - 4 * p) : -FOOT_A + 2 * FOOT_A * ease01((p - 0.5) * 2);
    const th = Math.asin(Math.max(-1, Math.min(1, x / L)));
    const legCss = cfg.th0 - (th * 180) / Math.PI;                         // rotação CSS (horário) da perna em torno da anca
    const footCss = cfg.drawnToeUp - footToeUp(p);                          // rotação CSS do pé em torno do tornozelo
    return {key, p, L, th, legCss, footCss, stance: p < 0.5};
  };
  const lf = calc('F', u), lb = calc('B', frac(u + 0.5));
  // a anca ajusta-se para o pé de apoio tocar no chão com a sola plana
  const st = lf.stance ? lf : lb;
  const stAnkleY = GROUND - depthAt(st.key, st.footCss);
  const drop = stAnkleY - HIPY - st.L * Math.cos(st.th);
  const build = (l: typeof lf) => {
    const cfg = LEGS[l.key];
    const [rx, ry] = rotPt(cfg.A0[0] - HIPX, cfg.A0[1] - HIPY, l.legCss);   // tornozelo depois de rodar a perna
    let lift = 0;
    if (!l.stance) {
      const ankleY = HIPY + drop + ry;                                       // sem elevação
      const need = Math.max(0, ankleY - (GROUND - depthAt(l.key, l.footCss)));
      lift = need + 20 * Math.sin(Math.PI * (l.p - 0.5) * 2);
    }
    const ax = HIPX + rx, ay = HIPY + ry - lift;
    const name = l.key === 'F' ? 'F' : 'B';
    return (
      <>
        {layerS(`nurse-leg${name}`, {transformOrigin: `${HIPX}px ${HIPY}px`, transform: `translateY(${-lift}px) rotate(${l.legCss}deg)`})}
        {layerS(`nurse-foot${name}`, {transformOrigin: `${cfg.A0[0]}px ${cfg.A0[1]}px`, transform: `translate(${ax - cfg.A0[0]}px, ${ay - cfg.A0[1]}px) rotate(${l.footCss}deg)`})}
      </>
    );
  };
  const arm = Math.sin(u * Math.PI * 2) * 4;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 651, height: 1111, transform: `translateY(${drop}px)`}}>
      {build(lb)}
      {build(lf)}
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
  const sway = Math.sin(t * 0.8) * 1.4, zoom = 1.06 + Math.sin(t * 0.5) * 0.015;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `rotate(${sway}deg) scale(${zoom})`, transformOrigin: '50% 60%'}}>
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
    </div>
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
  const f = staticFile(`google2/rig/${name}.png`);
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <Img src={f} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
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
  return <div style={{position: 'absolute', right: 120, top: 250, transform: `scale(${0.85 + 0.15 * o})`}}><ClockFixed name="clock-face" size={240} t0={4.8} /></div>;
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

const Doors: React.FC<{open?: number}> = ({open = 1.2}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const o = interpolate(t, [open, open + 1.3], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ang = o * 82;
  const sp = spring({frame: f, fps: FPS, config: {damping: 14, stiffness: 190, mass: 0.8}});
  const W0 = 1032, H0 = 1232, S = 0.62;
  const L = (n: string, st?: React.CSSProperties) => <Img src={staticFile(`google2/rig/${n}.png`)} style={{position: 'absolute', left: 0, top: 0, width: W0, height: H0, ...st}} />;
  return (
    <div style={{position: 'absolute', left: 1000 + (1 - sp) * 240, top: 150, width: W0 * S, height: H0 * S, perspective: 1500}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W0, height: H0, transformOrigin: '0 0', transform: `scale(${S})`}}>
        <div style={{position: 'absolute', left: 52, top: 48, width: 923, height: 1128, overflow: 'hidden', background: INK}}>
          <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 55%, #ffffff 0%, #ffe3dc ${20 + 10 * o}%, ${RED} 70%, #3a0a0d 100%)`, opacity: 0.25 + 0.75 * o}} />
          <svg width="923" height="1128" style={{position: 'absolute', inset: 0, opacity: o}}>
            {[0.1, 0.25, 0.4, 0.6, 0.75, 0.9].map((x, i) => <line key={i} x1={x * 923} y1={x < 0.5 ? 0 : 1128} x2={461} y2={564} stroke={INK} strokeWidth="5" opacity="0.5" />)}
            <rect x={361} y={414} width={200} height={300} fill="none" stroke={INK} strokeWidth="6" opacity="0.6" />
          </svg>
        </div>
        {L('doors-frame')}
        <div style={{position: 'absolute', left: 0, top: 0, width: W0, height: H0, transformOrigin: '52px 0', transform: `rotateY(${-ang}deg)`, transformStyle: 'preserve-3d'}}>{L('doors-leafL')}</div>
        <div style={{position: 'absolute', left: 0, top: 0, width: W0, height: H0, transformOrigin: '975px 0', transform: `rotateY(${ang}deg)`}}>{L('doors-leafR')}</div>
      </div>
    </div>
  );
};

const Beat: React.FC<{b: GBeat}> = ({b}) => (
  <>
    {b.k === 'chase' && <><Chase n={b.n!} /><Cap L={b.L!} hot={b.hot} w={1500} size={b.L!.length > 2 ? 84 : 104} y={60} /></>}
    {b.k === 'img' && <><CutImg n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'obj' && <><ObjView n={b.n!} /><Cap L={b.L!} hot={b.hot} /></>}
    {b.k === 'doors' && <><Doors open={b.v} /><Cap L={b.L!} hot={b.hot} /></>}
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
  const rolls = GBEATS.filter((b) => b.tr === 'roll').map((b) => b.s);
  return (
    <AbsoluteFill>
      <Bg theme="paper" />
      <TornDefs />
      <AbsoluteFill style={{...punchStyle(frame, punches), ...rollStyle(frame, rolls)}}>
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
