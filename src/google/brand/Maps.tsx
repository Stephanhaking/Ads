import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useCurrentFrame} from '../../timeline';
import {GOOGLE} from './Brand';

// Janela estilo Google Maps com o Timeline (histórico de locais do dia). Cartografia procedural e
// genérica (ruas e locais fictícios); a rota segue as ruas e os locais vão aparecendo na linha do tempo.

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.exp);

// grelha de ruas (coordenadas do "mundo" 1000×900)
const VX = [70, 180, 300, 420, 540, 660, 780, 900];
const HY = [90, 190, 300, 410, 520, 640, 760, 850];

// paragens (cruzamentos) e segmentos da rota, a seguir as ruas
const STOPS = [
  {x: 180, y: 640, name: 'Lunch', time: '12:40', color: '#F29900', icon: 'fork'},
  {x: 420, y: 520, name: 'Office', time: '14:05', color: GOOGLE.blue, icon: 'bag'},
  {x: 660, y: 410, name: 'Park', time: '15:30', color: GOOGLE.green, icon: 'tree'},
  {x: 780, y: 190, name: 'Pharmacy', time: '16:50', color: GOOGLE.red, icon: 'cross', left: true},
] as readonly {x: number; y: number; name: string; time: string; color: string; icon: string; left?: boolean}[];
const SEGS = [
  'M180 640 L180 520 L420 520',
  'M420 520 L420 410 L660 410',
  'M660 410 L660 300 L780 300 L780 190',
];

const rnd = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const Glyph: React.FC<{icon: string; cx: number; cy: number; r: number}> = ({icon, cx, cy, r}) => {
  const s = r * 0.55;
  if (icon === 'cross') {
    return (
      <g fill="#fff">
        <rect x={cx - s * 0.28} y={cy - s} width={s * 0.56} height={s * 2} rx={s * 0.12} />
        <rect x={cx - s} y={cy - s * 0.28} width={s * 2} height={s * 0.56} rx={s * 0.12} />
      </g>
    );
  }
  if (icon === 'tree') return <circle cx={cx} cy={cy - s * 0.15} r={s * 0.85} fill="#fff" />;
  if (icon === 'bag') return <rect x={cx - s} y={cy - s * 0.7} width={s * 2} height={s * 1.5} rx={s * 0.2} fill="#fff" />;
  return (
    <g fill="#fff">
      <rect x={cx - s * 0.95} y={cy - s * 0.55} width={s * 1.5} height={s * 1.25} rx={s * 0.22} />
      <path d={`M${cx + s * 0.55} ${cy - s * 0.25} h${s * 0.3} a${s * 0.3} ${s * 0.3} 0 0 1 0 ${s * 0.6} h${-s * 0.3}`} stroke="#fff" strokeWidth={s * 0.22} fill="none" />
    </g>
  );
};

export const MapsApp: React.FC<{x: number; y: number; w?: number; h?: number; startAt?: number}> = ({x, y, w = 1180, h = 760, startAt = 0}) => {
  const frame = useCurrentFrame();
  const t0 = frame - startAt;
  const enter = interpolate(t0, [-14, 0], [0, 1], {...clampOpts, easing: easeOut});
  const PANEL = 340;
  const mapW = w - PANEL;

  // câmara: pan e zoom lentos
  const pan = interpolate(t0, [0, 240], [0, 1], clampOpts);
  const camScale = 1.02 + pan * 0.07;
  const camX = -pan * 34;
  const camY = -pan * 18;

  // rota: cada segmento desenha-se à vez; a paragem aparece quando o segmento chega lá
  const SEG_LEN = 44;
  const segP = SEGS.map((_, i) => interpolate(t0, [18 + i * SEG_LEN, 18 + (i + 1) * SEG_LEN], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)}));
  const stopT = STOPS.map((_, i) => interpolate(t0, [i === 0 ? 4 : 18 + i * SEG_LEN - 6, i === 0 ? 18 : 18 + i * SEG_LEN + 8], [0, 1], {...clampOpts, easing: Easing.out(Easing.back(2))}));
  const lastIdx = Math.max(0, stopT.findIndex((v, i) => v > 0.5 && (i === STOPS.length - 1 || stopT[i + 1] <= 0.5)));
  const halo = (frame % 60) / 60;

  // edifícios (por quarteirão) — determinístico
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < VX.length - 1; i++) {
    for (let j = 0; j < HY.length - 1; j++) {
      const bx = VX[i] + 14, by = HY[j] + 14, bw = VX[i + 1] - VX[i] - 28, bh = HY[j + 1] - HY[j] - 28;
      const seed = i * 17 + j * 31;
      if (rnd(seed) < 0.22) continue; // quarteirão vazio (praça)
      const n = 1 + Math.floor(rnd(seed + 1) * 3);
      for (let k = 0; k < n; k++) {
        const ww = bw * (0.28 + rnd(seed + k * 3) * 0.32);
        const hh = bh * (0.28 + rnd(seed + k * 5) * 0.32);
        const ox = rnd(seed + k * 7) * (bw - ww);
        const oy = rnd(seed + k * 11) * (bh - hh);
        blocks.push(<rect key={`${i}-${j}-${k}`} x={bx + ox} y={by + oy} width={ww} height={hh} rx={3} fill="#E8EAE6" />);
      }
    }
  }

  const road = (d: string, key: string, major = false) => (
    <g key={key}>
      <path d={d} stroke={major ? '#E8B64A' : '#D5D8DC'} strokeWidth={major ? 30 : 19} fill="none" strokeLinecap="round" />
      <path d={d} stroke={major ? '#FCE08C' : '#FFFFFF'} strokeWidth={major ? 24 : 14} fill="none" strokeLinecap="round" />
    </g>
  );

  const lab: React.CSSProperties = {fontFamily: 'Arial, sans-serif', fill: '#5F6368'};

  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: '0 26px 60px rgba(0,0,0,0.32), 0 3px 8px rgba(0,0,0,0.2)', opacity: enter, transform: `translateY(${(1 - enter) * 36}px) scale(${0.97 + 0.03 * enter})`}}>
      {/* painel Timeline */}
      <div style={{position: 'absolute', left: 0, top: 0, width: PANEL, height: h, background: '#fff', zIndex: 3, boxShadow: '2px 0 8px rgba(0,0,0,0.12)', fontFamily: 'Arial, Helvetica, sans-serif'}}>
        <div style={{padding: '26px 26px 14px', fontSize: 30, fontWeight: 700, color: '#202124'}}>Timeline</div>
        <div style={{margin: '0 26px 18px', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 18, border: '1px solid #DADCE0', fontSize: 19, color: '#3C4043'}}>
          Tuesday, 14 March <span style={{fontSize: 14}}>▾</span>
        </div>
        <div style={{position: 'relative', padding: '0 26px'}}>
          <div style={{position: 'absolute', left: 52, top: 22, width: 4, height: 4 * 124 - 80, background: '#DADCE0'}} />
          {STOPS.map((s, i) => {
            const t = interpolate(t0, [i === 0 ? 6 : 18 + i * SEG_LEN - 4, i === 0 ? 20 : 18 + i * SEG_LEN + 10], [0, 1], {...clampOpts, easing: easeOut});
            return (
              <div key={s.name} style={{display: 'flex', gap: 22, height: 124, opacity: t, transform: `translateX(${(1 - t) * -20}px)`}}>
                <div style={{position: 'relative', zIndex: 1, width: 56, height: 56, borderRadius: 28, background: s.color, flexShrink: 0}}>
                  <svg width={56} height={56}><Glyph icon={s.icon} cx={28} cy={28} r={26} /></svg>
                </div>
                <div style={{paddingTop: 2}}>
                  <div style={{fontSize: 24, fontWeight: 700, color: '#202124'}}>{s.name}</div>
                  <div style={{fontSize: 18, color: '#5F6368', marginTop: 4}}>{s.time} · {i === 0 ? '—' : `${(0.8 + i * 0.7).toFixed(1)} km`}</div>
                  <div style={{fontSize: 16, color: '#80868B', marginTop: 2}}>{i === 0 ? 'Started from home' : 'By car'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* mapa */}
      <div style={{position: 'absolute', left: PANEL, top: 0, width: mapW, height: h, overflow: 'hidden', background: '#F2F1EC'}}>
        <svg width={mapW} height={h} viewBox="0 0 1000 900" preserveAspectRatio="xMidYMid slice" style={{transform: `translate(${camX}px, ${camY}px) scale(${camScale})`, transformOrigin: '50% 50%'}}>
          {/* água e parques */}
          <path d="M560 960 C 720 760, 900 840, 1100 700" stroke="#A8D4F5" strokeWidth={130} fill="none" strokeLinecap="round" />
          <rect x="440" y="104" width="190" height="72" rx="20" fill="#CFE8C8" />
          <rect x="94" y="204" width="68" height="84" rx="14" fill="#CFE8C8" />
          <rect x="800" y="430" width="100" height="90" rx="16" fill="#CFE8C8" />
          {blocks}
          {/* ruas */}
          {VX.map((vx, i) => road(`M${vx} -20 L${vx} 940`, `v${i}`))}
          {HY.map((hy, i) => road(`M-20 ${hy} L1020 ${hy}`, `h${i}`))}
          {road('M-20 700 L 720 -20', 'diag', true)}
          {road('M-20 300 L 1020 300', 'h-major', true)}
          {/* rótulos */}
          <text x="130" y="300" transform="rotate(-90 130 300)" fontSize="17" {...{style: lab}}>Maple St</text>
          <text x="590" y="414" fontSize="17" style={lab}>5th Avenue</text>
          <text x="470" y="296" fontSize="17" style={lab}>Riverside Dr</text>
          <text x="352" y="330" transform="rotate(-90 352 330)" fontSize="17" style={lab}>Oak Ave</text>
          <text x="806" y="482" fontSize="16" style={{...lab, fill: '#3C7A3E'}}>City Park</text>
          <text x="800" y="820" fontSize="18" style={{...lab, fill: '#3B78C3'}} transform="rotate(-18 800 820)">River</text>
          <text x="610" y="720" fontSize="26" letterSpacing="9" style={{...lab, fill: '#9AA0A6'}}>DOWNTOWN</text>
          {/* rota (desenha-se aos segmentos) */}
          {SEGS.map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#fff" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - segP[i]} />
              <path d={d} stroke={GOOGLE.blue} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - segP[i]} />
            </g>
          ))}
          <circle cx={STOPS[lastIdx].x} cy={STOPS[lastIdx].y} r={30 + halo * 50} fill={GOOGLE.blue} opacity={(1 - halo) * 0.28} />
          {/* paragens */}
          {STOPS.map((s, i) => (
            <g key={s.name} transform={`translate(${s.x} ${s.y}) scale(${stopT[i]}) translate(${-s.x} ${-s.y})`}>
              <circle cx={s.x} cy={s.y} r={27} fill="#fff" />
              <circle cx={s.x} cy={s.y} r={22} fill={s.color} />
              <Glyph icon={s.icon} cx={s.x} cy={s.y} r={22} />
              <g transform={`translate(${s.left ? s.x - 34 - (s.name.length * 12.5 + 70) : s.x + 34} ${s.y - 18})`}>
                <rect width={s.name.length * 12.5 + 70} height={34} rx={17} fill="#fff" opacity={0.96} />
                <text x={16} y={23} fontSize="18" fontWeight="700" style={{fontFamily: 'Arial, sans-serif', fill: '#202124'}}>{s.name}</text>
                <text x={s.name.length * 12.5 + 24} y={23} fontSize="16" style={{fontFamily: 'Arial, sans-serif', fill: '#5F6368'}}>{s.time}</text>
              </g>
            </g>
          ))}
        </svg>

        {/* caixa de pesquisa flutuante */}
        <div style={{position: 'absolute', left: 22, top: 22, width: 470, height: 62, borderRadius: 31, background: '#fff', boxShadow: '0 2px 6px rgba(60,64,67,0.3), 0 4px 12px rgba(60,64,67,0.15)', display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', fontFamily: 'Arial, sans-serif', fontSize: 21, color: '#5F6368'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>{[0, 1, 2].map((i) => <div key={i} style={{width: 22, height: 3, borderRadius: 2, background: '#5F6368'}} />)}</div>
          <span style={{flex: 1}}>Search Google Maps</span>
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth={2.4} strokeLinecap="round"><circle cx="10" cy="10" r="6.5" /><line x1="15" y1="15" x2="21" y2="21" /></svg>
          <svg width={30} height={30} viewBox="0 0 24 24"><path d="M12 2 L22 12 L12 22 L2 12 Z" fill={GOOGLE.blue} /><path d="M7.5 12.5 H14 M11.5 9 L15 12.5 L11.5 16" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        {/* controlos */}
        <div style={{position: 'absolute', right: 22, bottom: 90, width: 56, borderRadius: 10, background: '#fff', boxShadow: '0 2px 6px rgba(60,64,67,0.3)', fontFamily: 'Arial, sans-serif', fontSize: 34, color: '#5F6368', textAlign: 'center'}}>
          <div style={{height: 56, lineHeight: '54px', borderBottom: '1px solid #E8EAED'}}>+</div>
          <div style={{height: 56, lineHeight: '52px'}}>−</div>
        </div>
        <div style={{position: 'absolute', right: 22, bottom: 22, width: 56, height: 56, borderRadius: 28, background: '#fff', boxShadow: '0 2px 6px rgba(60,64,67,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={GOOGLE.blue} strokeWidth={2.2}><circle cx="12" cy="12" r="4" fill={GOOGLE.blue} /><circle cx="12" cy="12" r="8" /><line x1="12" y1="1" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="23" /><line x1="1" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="23" y2="12" /></svg>
        </div>
        {/* escala e rodapé */}
        <div style={{position: 'absolute', left: 22, bottom: 18, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Arial, sans-serif', fontSize: 15, color: '#5F6368'}}>
          <div style={{width: 70, height: 8, borderLeft: '2px solid #5F6368', borderRight: '2px solid #5F6368', borderBottom: '2px solid #5F6368'}} />
          200 m
        </div>
        <div style={{position: 'absolute', right: 96, bottom: 20, fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#80868B'}}>Map data ©2018 · Terms</div>
      </div>
    </div>
  );
};

// ── mini-cartão de mapa com uma rota a desenhar-se (usado como "next route") ──
export const MiniRoute: React.FC<{x: number; y: number; w?: number; h?: number; at: number}> = ({x, y, w = 400, h = 240, at}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame - at, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
  const draw = interpolate(frame - at, [8, 50], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
  const pin = interpolate(frame - at, [46, 60], [0, 1], {...clampOpts, easing: Easing.out(Easing.back(2))});
  const d = 'M40 190 L40 120 L170 120 L170 60 L330 60';
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#F2F1EC', boxShadow: '0 16px 36px rgba(0,0,0,0.28)', opacity: enter, transform: `translateY(${(1 - enter) * 24}px)`}}>
      <svg width={w} height={h} viewBox="0 0 400 240">
        <rect x="230" y="130" width="120" height="70" rx="10" fill="#CFE8C8" />
        {[40, 120, 170, 250, 330].map((vx) => <path key={vx} d={`M${vx} -10 V250`} stroke="#fff" strokeWidth={10} />)}
        {[60, 120, 190].map((hy) => <path key={hy} d={`M-10 ${hy} H410`} stroke="#fff" strokeWidth={10} />)}
        <path d={d} stroke="#fff" strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={d} stroke={GOOGLE.blue} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <circle cx="40" cy="190" r="9" fill="#fff" /><circle cx="40" cy="190" r="5.5" fill={GOOGLE.blue} />
        <g transform={`translate(330 60) scale(${pin}) translate(-330 -60)`}>
          <path d="M330 22 C 314 22, 305 35, 305 48 C 305 64, 330 90, 330 90 C 330 90, 355 64, 355 48 C 355 35, 346 22, 330 22 Z" fill={GOOGLE.red} />
          <circle cx="330" cy="48" r="8" fill="#fff" />
        </g>
      </svg>
    </div>
  );
};
