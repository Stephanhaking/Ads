import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useCurrentFrame} from '../../timeline';
import {fonts} from '../../styles';
import {GOOGLE} from '../brand/Brand';

// Biblioteca de interfaces realistas para os Atos III–VIII. Tempos em frames da escala de 30 fps.
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.exp);
const easeIO = Easing.inOut(Easing.cubic);
const sans = 'Arial, "Helvetica Neue", sans-serif';
export const RED = '#E5232B';
export const G = GOOGLE;

export const useIn = (at = 0, len = 14) => {
  const f = useCurrentFrame();
  return interpolate(f - at, [0, len], [0, 1], {...clampOpts, easing: easeOut});
};

// cartão base com entrada
export const Card: React.FC<{x: number; y: number; w: number; h?: number; at?: number; tilt?: number; bg?: string; radius?: number; pad?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, at = 0, tilt = 0, bg = '#fff', radius = 20, pad = 0, children, style}) => {
  const e = useIn(at);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: radius, background: bg, padding: pad, boxShadow: '0 24px 56px rgba(0,0,0,0.30), 0 3px 8px rgba(0,0,0,0.18)', opacity: e, transform: `translateY(${(1 - e) * 34}px) rotate(${tilt}deg) scale(${0.97 + 0.03 * e})`, fontFamily: sans, overflow: 'hidden', ...style}}>
      {children}
    </div>
  );
};

export const Chip: React.FC<{text: string; color?: string; bg?: string; at?: number; size?: number}> = ({text, color = '#fff', bg = RED, at = 0, size = 16}) => {
  const e = useIn(at, 10);
  return <span style={{display: 'inline-block', padding: `${size * 0.3}px ${size * 0.75}px`, borderRadius: size, background: bg, color, fontSize: size, fontWeight: 700, letterSpacing: size * 0.12, opacity: e, transform: `scale(${0.8 + 0.2 * e})`}}>{text}</span>;
};

// ── anel (donut) com percentagem ──
export const Ring: React.FC<{cx: number; cy: number; r: number; pct: number; at: number; color?: string; track?: string; label?: string; sub?: string; width?: number; dark?: boolean}> = ({cx, cy, r, pct, at, color = G.blue, track = '#E8EAED', label, sub, width = 26, dark = false}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, 40], [0, 1], {...clampOpts, easing: easeIO});
  const C = 2 * Math.PI * r;
  const shown = Math.round(pct * p);
  const vis = interpolate(f - at, [-2, 6], [0, 1], clampOpts); // só aparece quando a voz chega a esse número
  return (
    <div style={{position: 'absolute', left: cx - r - width, top: cy - r - width, width: (r + width) * 2, height: (r + width) * 2, opacity: vis, transform: `scale(${0.92 + 0.08 * vis})`}}>
      <svg width={(r + width) * 2} height={(r + width) * 2} style={{overflow: 'visible'}}>
        <circle cx={r + width} cy={r + width} r={r} fill="none" stroke={track} strokeWidth={width} />
        <circle cx={r + width} cy={r + width} r={r} fill="none" stroke={color} strokeWidth={width} strokeLinecap="butt" strokeDasharray={C} strokeDashoffset={C * (1 - (pct / 100) * p)} transform={`rotate(-90 ${r + width} ${r + width})`} />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.heading, color: dark ? '#fff' : '#202124'}}>
        <div style={{fontSize: r * 0.78, lineHeight: 1}}>{shown}%</div>
        {label ? <div style={{fontFamily: fonts.mono, fontSize: r * 0.17, letterSpacing: 3, marginTop: 6, color: dark ? '#cfd3d8' : '#5F6368'}}>{label}</div> : null}
        {sub ? <div style={{fontFamily: sans, fontSize: r * 0.15, marginTop: 4, color: dark ? '#aeb4bb' : '#80868B'}}>{sub}</div> : null}
      </div>
    </div>
  );
};

// ── ícones de apps (desenhados em código) ──
export const AppIcon: React.FC<{kind: string; size: number}> = ({kind, size}) => {
  const s = size;
  const wrap = (bg: string, inner: React.ReactNode) => (
    <div style={{width: s, height: s, borderRadius: s * 0.24, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.18)'}}>{inner}</div>
  );
  const u = s * 0.56;
  switch (kind) {
    case 'search':
      return wrap('#fff', <div style={{fontFamily: 'Arial', fontWeight: 700, fontSize: u * 1.25, color: G.blue}}>G</div>);
    case 'maps':
      return wrap('#fff', <svg width={u} height={u} viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" fill={G.red} /><circle cx="12" cy="9" r="3" fill="#fff" /></svg>);
    case 'mail':
      return wrap('#fff', <svg width={u} height={u} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" fill="#fff" stroke={G.red} strokeWidth="2" /><path d="M2.5 6 L12 13 L21.5 6" stroke={G.red} strokeWidth="2" fill="none" /></svg>);
    case 'chrome':
      return wrap('#fff', <svg width={u * 1.15} height={u * 1.15} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={G.red} /><path d="M12 12 L23 12 A11 11 0 0 1 6.5 21.5 Z" fill={G.green} /><path d="M12 12 L6.5 21.5 A11 11 0 0 1 1 12 A11 11 0 0 1 6.5 2.5 Z" fill={G.yellow} /><circle cx="12" cy="12" r="4.4" fill="#fff" /><circle cx="12" cy="12" r="3.4" fill={G.blue} /></svg>);
    case 'youtube':
      return wrap('#fff', <svg width={u * 1.2} height={u} viewBox="0 0 24 18"><rect width="24" height="18" rx="5" fill="#FF0000" /><path d="M9.5 5 L16 9 L9.5 13 Z" fill="#fff" /></svg>);
    case 'android':
      return wrap('#fff', <svg width={u} height={u} viewBox="0 0 24 24"><path d="M5 17V10a7 7 0 0 1 14 0v7z" fill={G.green} /><circle cx="9.5" cy="10" r="1" fill="#fff" /><circle cx="14.5" cy="10" r="1" fill="#fff" /><path d="M7 4 L9 7 M17 4 L15 7" stroke={G.green} strokeWidth="1.5" /></svg>);
    case 'photos':
      return wrap('#fff', <svg width={u} height={u} viewBox="0 0 24 24"><path d="M12 12 V2 a6 6 0 0 1 6 6z" fill={G.red} /><path d="M12 12 H22 a6 6 0 0 1 -6 6z" fill={G.yellow} /><path d="M12 12 V22 a6 6 0 0 1 -6 -6z" fill={G.green} /><path d="M12 12 H2 a6 6 0 0 1 6 -6z" fill={G.blue} /></svg>);
    case 'drive':
      return wrap('#fff', <svg width={u} height={u} viewBox="0 0 24 24"><path d="M8 3h8l7 12h-8z" fill={G.yellow} /><path d="M8 3L1 15l4 6 7-12z" fill={G.green} /><path d="M5 21h14l4-6H9z" fill={G.blue} /></svg>);
    default:
      return wrap('#fff', <div style={{fontFamily: 'Arial', fontWeight: 700, fontSize: u, color: G.blue}}>31</div>);
  }
};

// ── Registo de atividade ("o que a Google guarda") ──
export const ActivityLog: React.FC<{x: number; y: number; w?: number; at?: number; rows?: {icon: string; text: string; sub: string; time: string}[]}> = ({x, y, w = 820, at = 0, rows}) => {
  const f = useCurrentFrame();
  const R = rows ?? [
    {icon: 'search', text: 'Searched for “knee pain after running”', sub: 'Search', time: '08:12'},
    {icon: 'maps', text: 'Directions to Riverside Pharmacy', sub: 'Maps', time: '08:47'},
    {icon: 'youtube', text: 'Watched “10-minute morning stretch”', sub: 'YouTube', time: '09:30'},
    {icon: 'youtube', text: 'Paused at 3:42', sub: 'YouTube', time: '09:34'},
    {icon: 'chrome', text: 'Visited a page about sleep apnea', sub: 'Chrome', time: '13:05'},
    {icon: 'search', text: 'Searched for “chest tightness at night”', sub: 'Search', time: '23:41'},
  ];
  return (
    <Card x={x} y={y} w={w} at={at} tilt={-1}>
      <div style={{padding: '22px 30px 14px', borderBottom: '1px solid #E8EAED', display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{display: 'flex', gap: 5}}>{[G.blue, G.red, G.yellow, G.green].map((c) => <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />)}</div>
        <div style={{fontSize: 28, fontWeight: 700, color: '#202124'}}>My Activity</div>
        <div style={{marginLeft: 'auto', fontSize: 17, color: '#5F6368'}}>Today</div>
      </div>
      {R.map((r, i) => {
        const t = interpolate(f - at - 12 - i * 9, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
        const m = interpolate(f - at - 24 - i * 9, [0, 10], [0, 1], clampOpts);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 30px', borderBottom: '1px solid #F1F3F4', opacity: t, transform: `translateX(${(1 - t) * 40}px)`}}>
            <AppIcon kind={r.icon} size={46} />
            <div style={{flex: 1}}>
              <div style={{fontSize: 23, color: '#202124'}}>{r.text}</div>
              <div style={{fontSize: 16, color: '#80868B', marginTop: 3}}>{r.sub} · {r.time}</div>
            </div>
            <div style={{opacity: m, transform: `scale(${0.8 + 0.2 * m})`}}><Chip text="MEASURED" bg="#E8F0FE" color="#1A5FD0" size={14} /></div>
          </div>
        );
      })}
    </Card>
  );
};

// ── Leilão de anúncios em tempo real ──
export const Auction: React.FC<{x: number; y: number; w?: number; at?: number}> = ({x, y, w = 760, at = 0}) => {
  const f = useCurrentFrame();
  const bidders = [
    {n: 'Advertiser A', base: 2.1, hue: G.blue},
    {n: 'Advertiser B', base: 2.9, hue: G.red},
    {n: 'Advertiser C', base: 3.4, hue: G.yellow},
    {n: 'Advertiser D', base: 4.2, hue: G.green},
  ];
  const t = f - at;
  const sold = t > 58;
  const win = 3;
  const ms = Math.min(48, Math.max(0, Math.round(t * 0.9)));
  return (
    <Card x={x} y={y} w={w} at={at} tilt={1.2}>
      <div style={{background: '#202124', color: '#fff', padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 12, height: 12, borderRadius: 6, background: '#34A853', opacity: Math.floor(f / 8) % 2 ? 1 : 0.35}} />
        <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 2}}>LIVE AUCTION</div>
        <div style={{marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 22, color: sold ? '#81C995' : '#FDD663'}}>{sold ? 'SOLD' : `${String(ms).padStart(2, '0')} ms`}</div>
      </div>
      <div style={{padding: '18px 28px', background: '#F8F9FA', borderBottom: '1px solid #E8EAED', fontSize: 19, color: '#3C4043'}}>
        <b>Impression:</b> user, 34, searching “running shoes” · <span style={{color: '#5F6368'}}>predicted to buy: 71%</span>
      </div>
      {bidders.map((b, i) => {
        const bid = b.base + Math.max(0, Math.min(1, (t - 8 - i * 4) / 30)) * (i + 1) * 0.35 + Math.sin(t / 5 + i) * 0.04;
        const isWin = sold && i === win;
        const e = interpolate(t - 6 - i * 4, [0, 10], [0, 1], {...clampOpts, easing: easeOut});
        return (
          <div key={b.n} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 28px', borderBottom: '1px solid #F1F3F4', background: isWin ? '#E6F4EA' : '#fff', opacity: e}}>
            <div style={{width: 18, height: 18, borderRadius: 9, background: b.hue}} />
            <div style={{flex: 1, fontSize: 24, color: '#202124'}}>{b.n}</div>
            <div style={{fontFamily: fonts.mono, fontSize: 28, color: isWin ? '#137333' : '#202124', fontWeight: isWin ? 700 : 400}}>${bid.toFixed(2)}</div>
            {isWin ? <Chip text="WON" bg="#137333" size={14} /> : null}
          </div>
        );
      })}
    </Card>
  );
};

// ── Receitas Alphabet FY2025 (estilo relatório): publicidade ~73% ──
export const RevenueCard: React.FC<{x: number; y: number; w?: number; at?: number}> = ({x, y, w = 900, at = 0}) => {
  const f = useCurrentFrame();
  const total = interpolate(f - at, [8, 60], [0, 402.8], {...clampOpts, easing: easeOut});
  const adPct = interpolate(f - at, [34, 90], [0, 73.2], {...clampOpts, easing: easeIO});
  return (
    <Card x={x} y={y} w={w} at={at} tilt={-1.2}>
      <div style={{padding: '24px 34px 10px', borderBottom: '1px solid #E8EAED'}}>
        <div style={{fontFamily: fonts.mono, fontSize: 15, letterSpacing: 3, color: '#80868B'}}>ALPHABET INC. · FORM 10-K · FISCAL YEAR 2025</div>
        <div style={{fontSize: 24, fontWeight: 700, color: '#202124', marginTop: 8}}>Consolidated revenues</div>
      </div>
      <div style={{padding: '22px 34px'}}>
        <div style={{fontFamily: fonts.heading, fontSize: 120, lineHeight: 1, color: '#202124'}}>${total.toFixed(1)}<span style={{fontSize: 56}}> B</span></div>
        <div style={{height: 54, borderRadius: 10, background: '#E8EAED', marginTop: 28, overflow: 'hidden', display: 'flex'}}>
          <div style={{width: `${adPct}%`, background: G.blue, display: 'flex', alignItems: 'center', paddingLeft: 18, color: '#fff', fontSize: 22, fontWeight: 700}}>Advertising</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 20, color: '#3C4043'}}>
          <span><b style={{color: G.blue}}>{adPct.toFixed(0)}%</b> · $294.7B</span><span style={{color: '#5F6368'}}>Everything else · 27%</span>
        </div>
      </div>
    </Card>
  );
};

// ── Pipeline DATA → MODEL → PREDICTION → MONEY ──
export const Pipeline: React.FC<{x: number; y: number; at?: number}> = ({x, y, at = 0}) => {
  const f = useCurrentFrame();
  const steps = [['DATA', G.blue], ['MODEL', G.red], ['PREDICTION', G.yellow], ['MONEY', G.green]] as const;
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 0}}>
      {steps.map(([label, c], i) => {
        const t = interpolate(f - at - i * 11, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
        const a = interpolate(f - at - i * 11 - 8, [0, 10], [0, 1], clampOpts);
        return (
          <React.Fragment key={label}>
            <div style={{width: 230, height: 150, borderRadius: 22, background: '#fff', boxShadow: '0 18px 40px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: t, transform: `translateY(${(1 - t) * 30}px)`, borderTop: `10px solid ${c}`}}>
              <div style={{fontFamily: fonts.heading, fontSize: 30, color: '#202124'}}>{label}</div>
              <div style={{fontFamily: fonts.mono, fontSize: 15, color: '#80868B', letterSpacing: 3}}>{['SEARCHES · ROUTES', 'LEARNS', 'WHAT YOU DO', '$402.8B'][i]}</div>
            </div>
            {i < 3 && <div style={{width: 70, height: 6, background: '#202124', opacity: a, transform: `scaleX(${a})`, transformOrigin: 'left', position: 'relative'}}><div style={{position: 'absolute', right: -4, top: -9, width: 0, height: 0, borderLeft: '16px solid #202124', borderTop: '12px solid transparent', borderBottom: '12px solid transparent'}} /></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── Medidor de confiança: "probably" → "certainly" ──
export const Meter: React.FC<{x: number; y: number; w?: number; from: number; to: number; at: number; dur?: number; label?: string}> = ({x, y, w = 980, from, to, at, dur = 90, label = 'WILL CLICK “BUY”'}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, dur], [0, 1], {...clampOpts, easing: easeIO});
  const v = from + (to - from) * p;
  const word = v > 92 ? 'certainly' : v > 70 ? 'very likely' : 'probably';
  const col = v > 92 ? RED : '#202124';
  const e = useIn(at - 10);
  return (
    <Card x={x} y={y} w={w} at={at - 10} tilt={0.8} pad={0}>
      <div style={{padding: '24px 34px', opacity: e}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 4, color: '#80868B'}}>PREDICTION · {label}</div>
          <div style={{fontFamily: fonts.heading, fontSize: 64, color: col}}>{v.toFixed(0)}%</div>
        </div>
        <div style={{height: 30, borderRadius: 15, background: '#E8EAED', marginTop: 14, overflow: 'hidden'}}>
          <div style={{width: `${v}%`, height: '100%', background: `linear-gradient(90deg, ${G.blue}, ${v > 92 ? RED : G.green})`, borderRadius: 15}} />
        </div>
        <div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 52, color: col, marginTop: 18}}>{word}</div>
      </div>
    </Card>
  );
};

// ── 3 vinhetas de "empurrão": default, feed e notificação ──
export const Toggle: React.FC<{on: boolean; size?: number}> = ({on, size = 1}) => (
  <div style={{width: 74 * size, height: 42 * size, borderRadius: 21 * size, background: on ? G.blue : '#BDC1C6', position: 'relative'}}>
    <div style={{position: 'absolute', top: 5 * size, left: on ? 37 * size : 5 * size, width: 32 * size, height: 32 * size, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.3)'}} />
  </div>
);
export const NudgeTrio: React.FC<{x: number; y: number; at: number[]}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const sw = interpolate(f - at[0] - 20, [0, 6], [0, 1], clampOpts);
  const swap = interpolate(f - at[1] - 18, [0, 18], [0, 1], {...clampOpts, easing: easeIO});
  return (
    <>
      <Card x={x} y={y} w={760} at={at[0]} tilt={-1.5}>
        <div style={{padding: '24px 30px'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 15, letterSpacing: 3, color: '#80868B'}}>SETTINGS · PRIVACY</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 14}}>
            <div style={{flex: 1}}><div style={{fontSize: 26, fontWeight: 700, color: '#202124'}}>Personalised ads</div><div style={{fontSize: 18, color: '#5F6368', marginTop: 4}}>Recommended setting</div></div>
            <Toggle on={sw < 0.5} />
          </div>
        </div>
        <div style={{padding: '0 30px 20px'}}><Chip text="DEFAULT: ON" bg="#E8F0FE" color="#1A5FD0" size={15} /></div>
      </Card>
      <Card x={x + 80} y={y + 240} w={760} at={at[1]} tilt={1.2}>
        <div style={{padding: '22px 30px'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 15, letterSpacing: 3, color: '#80868B', marginBottom: 12}}>YOUR FEED</div>
          {[0, 1, 2].map((i) => {
            const order = i === 0 ? 1 : i === 1 ? 0 : 2;
            const yy = (i + (order - i) * swap) * 78;
            const labels = ['Something you’ve never seen', 'Exactly what you’d click', 'Because you watched…'];
            return <div key={i} style={{position: 'absolute', left: 30, right: 30, top: 70 + yy, height: 66, borderRadius: 12, background: i === 1 ? '#FEF7E0' : '#F8F9FA', border: '1px solid #E8EAED', display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', fontSize: 22, color: '#202124'}}><div style={{width: 52, height: 40, borderRadius: 8, background: [G.blue, G.red, G.green][i]}} />{labels[i]}</div>;
          })}
          <div style={{height: 230}} />
        </div>
      </Card>
      <Card x={x + 20} y={y + 520} w={700} at={at[2]} tilt={-0.8} radius={26}>
        <div style={{padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 20}}>
          <AppIcon kind="maps" size={64} />
          <div style={{flex: 1}}><div style={{fontSize: 23, fontWeight: 700, color: '#202124'}}>Leaving soon?</div><div style={{fontSize: 20, color: '#5F6368', marginTop: 2}}>There’s a shop on your way. 10% off today.</div></div>
        </div>
      </Card>
    </>
  );
};

// ── Etiquetas de preço: precisão vs. certeza ──
export const PriceTags: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const a = useIn(at, 14);
  const b = useIn(at + 12, 14);
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, opacity: a, transform: `rotate(-4deg) translateY(${(1 - a) * 30}px)`}}>
        <div style={{width: 380, padding: '26px 30px', borderRadius: 18, background: '#fff', boxShadow: '0 18px 40px rgba(0,0,0,0.28)'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 4, color: '#80868B'}}>ACCURACY</div>
          <div style={{fontFamily: fonts.heading, fontSize: 92, color: '#202124'}}>$0.01</div>
          <div style={{fontSize: 20, color: '#5F6368'}}>worth pennies</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: x + 470, top: y - 30, opacity: b, transform: `rotate(3deg) translateY(${(1 - b) * 30}px) scale(${0.9 + 0.1 * b})`}}>
        <div style={{width: 470, padding: '28px 34px', borderRadius: 18, background: RED, boxShadow: '0 18px 40px rgba(0,0,0,0.34)', color: '#fff'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 4, opacity: 0.85}}>CERTAINTY</div>
          <div style={{fontFamily: fonts.heading, fontSize: 108}}>$$$$$</div>
          <div style={{fontSize: 21, opacity: 0.9}}>worth a fortune</div>
        </div>
      </div>
    </>
  );
};

// ── Ciclo Predict → Nudge → Confirm (a confiança sobe a cada volta) ──
export const LoopDiagram: React.FC<{cx: number; cy: number; r?: number; at: number}> = ({cx, cy, r = 250, at}) => {
  const f = useCurrentFrame();
  const t = f - at;
  const ang = (t / 150) * Math.PI * 2 * 2.2;
  const laps = Math.min(3, t / 150 * 2.2);
  const conf = Math.min(99, 62 + laps * 12.5);
  const nodes = [['PREDICT', -90], ['NUDGE', 30], ['CONFIRM', 150]] as const;
  const e = useIn(at, 14);
  return (
    <div style={{position: 'absolute', left: cx - r - 120, top: cy - r - 90, width: (r + 120) * 2, height: (r + 90) * 2, opacity: e}}>
      <svg width={(r + 120) * 2} height={(r + 90) * 2} style={{overflow: 'visible'}}>
        <circle cx={r + 120} cy={r + 90} r={r} fill="none" stroke="#202124" strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" />
        <circle cx={r + 120 + Math.cos(ang - Math.PI / 2) * r} cy={r + 90 + Math.sin(ang - Math.PI / 2) * r} r={20} fill={RED} />
        {nodes.map(([n, a]) => {
          const px = r + 120 + Math.cos((a * Math.PI) / 180) * r, py = r + 90 + Math.sin((a * Math.PI) / 180) * r;
          return (
            <g key={n}>
              <rect x={px - 100} y={py - 34} width={200} height={68} rx={34} fill="#fff" stroke="#202124" strokeWidth={4} />
              <text x={px} y={py + 11} textAnchor="middle" fontFamily="Archivo Black" fontSize={28} fill="#202124">{n}</text>
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: r + 90 - 52, textAlign: 'center'}}>
        <div style={{fontFamily: fonts.heading, fontSize: 104, color: conf > 90 ? RED : '#202124'}}>{conf.toFixed(0)}%</div>
        <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 5, color: '#80868B'}}>CONFIDENCE</div>
      </div>
    </div>
  );
};

// ── Player de vídeo estilo YouTube com a lista "Up next" ──
export const YtPage: React.FC<{x: number; y: number; w?: number; h?: number; at?: number; upNextAt?: number; countdownAt?: number}> = ({x, y, w = 1240, h = 760, at = 0, upNextAt = 30, countdownAt = 9999}) => {
  const f = useCurrentFrame();
  const prog = interpolate(f - at, [10, 400], [0.08, 0.96], clampOpts);
  const cd = interpolate(f - countdownAt, [0, 150], [5, 0], clampOpts);
  const showCd = f >= countdownAt;
  const recs = ['Why you can’t stop watching', 'Next one starts in a moment', 'People also watched this', 'Recommended for you', 'You might also like', 'Because you watched earlier'];
  const hue = [G.blue, G.red, G.yellow, G.green, '#AB47BC', '#00ACC1'];
  return (
    <Card x={x} y={y} w={w} h={h} at={at} tilt={-1} bg="#0F0F0F" radius={18}>
      <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', background: '#0F0F0F', borderBottom: '1px solid #272727'}}>
        <AppIcon kind="youtube" size={34} />
        <div style={{flex: 1, maxWidth: 480, height: 36, borderRadius: 18, border: '1px solid #3F3F3F', background: '#121212'}} />
        <div style={{marginLeft: 'auto', width: 34, height: 34, borderRadius: 17, background: '#3F3F3F'}} />
      </div>
      <div style={{display: 'flex', gap: 22, padding: 22}}>
        <div style={{flex: 1}}>
          <div style={{position: 'relative', height: 420, borderRadius: 14, background: 'linear-gradient(135deg,#2b3a55,#0f1623 60%,#3a2230)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, borderLeft: '56px solid rgba(255,255,255,0.9)', borderTop: '34px solid transparent', borderBottom: '34px solid transparent', transform: 'translate(-30%,-50%)', opacity: showCd ? 0 : 1}} />
            <div style={{position: 'absolute', left: 18, right: 18, bottom: 18, height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 3}}><div style={{width: `${prog * 100}%`, height: '100%', background: '#FF0000', borderRadius: 3}} /></div>
            {showCd && (
              <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.78)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, color: '#fff'}}>
                <div style={{fontFamily: fonts.mono, fontSize: 20, letterSpacing: 5, color: '#cfcfcf'}}>UP NEXT</div>
                <div style={{position: 'relative', width: 120, height: 120}}>
                  <svg width={120} height={120}><circle cx={60} cy={60} r={52} fill="none" stroke="#555" strokeWidth={8} /><circle cx={60} cy={60} r={52} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray={327} strokeDashoffset={327 * (1 - cd / 5)} transform="rotate(-90 60 60)" /></svg>
                  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.heading, fontSize: 52}}>{Math.max(1, Math.ceil(cd))}</div>
                </div>
                <div style={{display: 'flex', gap: 14}}><span style={{padding: '10px 26px', borderRadius: 22, background: '#fff', color: '#0f0f0f', fontWeight: 700, fontSize: 20}}>Play now</span><span style={{padding: '10px 26px', borderRadius: 22, border: '1px solid #777', fontSize: 20}}>Cancel</span></div>
              </div>
            )}
          </div>
          <div style={{marginTop: 16, height: 22, width: '78%', borderRadius: 6, background: '#272727'}} /><div style={{marginTop: 10, height: 16, width: '42%', borderRadius: 6, background: '#1f1f1f'}} />
        </div>
        <div style={{width: 380}}>
          {recs.map((r, i) => {
            const t = interpolate(f - at - upNextAt - i * 8, [0, 12], [0, 1], {...clampOpts, easing: easeOut});
            return (
              <div key={i} style={{display: 'flex', gap: 12, marginBottom: 14, opacity: t, transform: `translateX(${(1 - t) * 30}px)`}}>
                <div style={{width: 168, height: 94, borderRadius: 10, background: `linear-gradient(135deg, ${hue[i]}, #1b1b1b)`, flexShrink: 0}} />
                <div><div style={{fontSize: 18, color: '#f1f1f1', fontWeight: 700, lineHeight: 1.25}}>{r}</div><div style={{fontSize: 15, color: '#aaa', marginTop: 6}}>Channel · {(1.2 + i * 0.7).toFixed(1)}M views</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

// ── Estatísticas grandes em mosaico ──
export const StatTile: React.FC<{x: number; y: number; w?: number; big: string; label: string; at: number; color?: string; tilt?: number}> = ({x, y, w = 420, big, label, at, color = '#202124', tilt = 0}) => (
  <Card x={x} y={y} w={w} at={at} tilt={tilt} pad={0}>
    <div style={{padding: '26px 30px'}}>
      <div style={{fontFamily: fonts.heading, fontSize: 88, lineHeight: 1, color}}>{big}</div>
      <div style={{fontFamily: fonts.mono, fontSize: 18, letterSpacing: 3, color: '#5F6368', marginTop: 10}}>{label}</div>
    </div>
  </Card>
);

// ── Documento "interno": ledger de dados / citação ──
export const LedgerDoc: React.FC<{x: number; y: number; w?: number; h?: number; at?: number; grow?: boolean}> = ({x, y, w = 760, h = 760, at = 0, grow = true}) => {
  const f = useCurrentFrame();
  const rows = ['Location history', 'Search queries', 'Purchases', 'Messages sent', 'Sleep patterns', 'Heart rate', 'Contacts', 'Photos taken', 'Routes walked', 'Videos watched'];
  return (
    <Card x={x} y={y} w={w} h={h} at={at} tilt={-1.5} bg="#FBFBF8" radius={10}>
      <div style={{padding: '30px 40px', fontFamily: 'Georgia, serif'}}>
        <div style={{fontFamily: fonts.mono, fontSize: 16, letterSpacing: 4, color: '#B3261E'}}>INTERNAL · 2016 · LEAKED 2018</div>
        <div style={{fontSize: 52, fontWeight: 700, color: '#202124', marginTop: 10}}>The Ledger</div>
        <div style={{height: 3, background: '#202124', margin: '16px 0 10px'}} />
        {rows.map((r, i) => {
          const t = grow ? interpolate(f - at - 14 - i * 8, [0, 10], [0, 1], {...clampOpts, easing: easeOut}) : 1;
          return (
            <div key={r} style={{display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #E4E4DC', fontSize: 25, color: '#3C4043', opacity: t, transform: `translateX(${(1 - t) * 30}px)`}}>
              <span>{r}</span><span style={{fontFamily: fonts.mono, fontSize: 20, color: '#80868B'}}>+{(i * 37 + 112).toLocaleString('en-US')}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// ── Campo de pessoas (pontos) a ser empurrado na mesma direção ──
export const PushField: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
  const f = useCurrentFrame();
  const cols = 22, rows = 12;
  const p = interpolate(f - at, [10, 80], [0, 1], {...clampOpts, easing: easeIO});
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const base = [(c + 0.5) * (w / cols), (r + 0.5) * (h / rows)];
      const jit = [Math.sin(i * 12.9898) * 14, Math.cos(i * 4.1414) * 14];
      const dir = [(c / cols) * 90 + 40, -20 + (i % 3) * 6];
      const px = base[0] + jit[0] * (1 - p) + dir[0] * p;
      const py = base[1] + jit[1] * (1 - p) + dir[1] * p * 0.4;
      const pushed = p > 0.5;
      dots.push(<circle key={i} cx={px} cy={py} r={10} fill={pushed ? '#0A0A0A' : '#fff'} opacity={0.95} />);
    }
  }
  return <svg style={{position: 'absolute', left: x, top: y}} width={w + 120} height={h + 40}>{dots}</svg>;
};

// ── Janelas "instaladas": quatro serviços com o que cada um sabe ──
export const InstalledWindows: React.FC<{x: number; y: number; at: number[]}> = ({x, y, at}) => {
  const items = [['search', 'Search', 'hears what you want'], ['chrome', 'Chrome', 'sees where you go'], ['android', 'Android', 'knows where you are'], ['maps', 'Maps', 'keeps the history']] as const;
  return (
    <>
      {items.map(([k, n, d], i) => {
        const e = useIn(at[i]);
        return (
          <Card key={k} x={x + (i % 2) * 520} y={y + Math.floor(i / 2) * 290} w={480} at={at[i]} tilt={i % 2 ? 1 : -1}>
            <div style={{padding: '24px 28px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18}}><AppIcon kind={k} size={68} /><div style={{fontSize: 32, fontWeight: 700, color: '#202124'}}>{n}</div></div>
              <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: '#3C4043', opacity: e}}>
                <span style={{width: 14, height: 14, borderRadius: 7, background: RED}} /> {d}
              </div>
              <div style={{marginTop: 10, fontFamily: fonts.mono, fontSize: 15, letterSpacing: 3, color: '#80868B'}}>INSTALLED · SIGNED IN</div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

// ── Diálogos: iniciar sessão + permissões ──
export const SignInDialog: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const click = interpolate(f - at - 40, [0, 6], [0, 1], clampOpts);
  return (
    <>
      <Card x={x} y={y} w={560} at={at} tilt={-1.2} radius={24}>
        <div style={{padding: '34px 38px', textAlign: 'center'}}>
          <div style={{fontFamily: 'Arial', fontWeight: 500, fontSize: 40, color: '#202124'}}><span style={{color: G.blue}}>G</span><span style={{color: G.red}}>o</span><span style={{color: G.yellow}}>o</span><span style={{color: G.blue}}>g</span><span style={{color: G.green}}>l</span><span style={{color: G.red}}>e</span></div>
          <div style={{fontSize: 30, marginTop: 14, color: '#202124'}}>Sign in</div>
          <div style={{margin: '24px 0 10px', height: 58, borderRadius: 8, border: '1px solid #DADCE0', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 20, color: '#5F6368'}}>you@gmail.com</div>
          <div style={{textAlign: 'right', color: G.blue, fontSize: 18, marginBottom: 26}}>Forgot email?</div>
          <div style={{display: 'inline-block', padding: '14px 40px', borderRadius: 24, background: click > 0.5 ? '#1557B0' : G.blue, color: '#fff', fontSize: 22, fontWeight: 700}}>Next</div>
        </div>
      </Card>
      <Card x={x + 300} y={y + 360} w={560} at={at + 36} tilt={1.4} radius={24}>
        <div style={{padding: '28px 34px'}}>
          <div style={{fontSize: 26, fontWeight: 700, color: '#202124'}}>Allow location access?</div>
          <div style={{fontSize: 19, color: '#5F6368', marginTop: 8}}>To give you better results and a better map.</div>
          <div style={{display: 'flex', gap: 14, marginTop: 22, justifyContent: 'flex-end'}}><span style={{padding: '12px 24px', color: '#5F6368', fontSize: 20}}>Not now</span><span style={{padding: '12px 30px', borderRadius: 22, background: G.blue, color: '#fff', fontSize: 20, fontWeight: 700}}>Allow</span></div>
        </div>
      </Card>
    </>
  );
};

// ── Definições: motor de pesquisa por defeito (e o pagamento) ──
export const DefaultSettings: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const money = interpolate(f - at - 26, [0, 50], [0, 20], {...clampOpts, easing: easeOut});
  const arrow = interpolate(f - at - 20, [0, 24], [0, 1], {...clampOpts, easing: easeIO});
  return (
    <>
      <Card x={x} y={y} w={780} at={at} tilt={-1}>
        <div style={{padding: '24px 32px', borderBottom: '1px solid #E8EAED', fontSize: 28, fontWeight: 700, color: '#202124'}}>Settings · Search</div>
        <div style={{padding: '26px 32px'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 16, letterSpacing: 4, color: '#80868B'}}>SEARCH ENGINE</div>
          {[['Google', true], ['Other engine', false], ['Another engine', false]].map(([n, on]) => (
            <div key={n as string} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 18px', marginTop: 12, borderRadius: 12, border: on ? `3px solid ${G.blue}` : '1px solid #DADCE0', background: on ? '#E8F0FE' : '#fff', fontSize: 26, color: '#202124'}}>
              <div style={{width: 26, height: 26, borderRadius: 13, border: `4px solid ${on ? G.blue : '#BDC1C6'}`, background: on ? G.blue : '#fff', boxShadow: on ? 'inset 0 0 0 4px #fff' : 'none'}} />
              {n as string}{on ? <span style={{marginLeft: 'auto', fontSize: 17, color: '#1A5FD0', fontWeight: 700}}>DEFAULT</span> : null}
            </div>
          ))}
        </div>
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
        <path d={`M${x + 800} ${y + 230} C ${x + 980} ${y + 190}, ${x + 1000} ${y + 90}, ${x + 1130} ${y + 80}`} stroke="#0A0A0A" strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - arrow} />
      </svg>
      <Card x={x + 1090} y={y + 20} w={480} at={at + 22} tilt={2} bg="#0A0A0A" radius={20}>
        <div style={{padding: '24px 30px', color: '#fff'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 16, letterSpacing: 4, color: '#9aa0a6'}}>PAID TO APPLE · PER YEAR</div>
          <div style={{fontFamily: fonts.heading, fontSize: 96, color: '#fff', lineHeight: 1.05}}>~${money.toFixed(0)}B</div>
          <div style={{fontSize: 19, color: '#bdc1c6'}}>to stay the default on a phone it never made</div>
        </div>
      </Card>
    </>
  );
};

// ── Documento de tribunal ──
export const CourtDoc: React.FC<{x: number; y: number; w?: number; h?: number; at: number; stampAt: number}> = ({x, y, w = 860, h = 860, at, stampAt}) => {
  const f = useCurrentFrame();
  const st = interpolate(f - stampAt, [0, 10], [0, 1], {...clampOpts, easing: Easing.out(Easing.back(2))});
  const lines = [100, 96, 98, 92, 100, 88, 96, 70];
  return (
    <Card x={x} y={y} w={w} h={h} at={at} tilt={-1.4} bg="#FFFFFF" radius={6}>
      <div style={{padding: '36px 50px', fontFamily: 'Georgia, "Times New Roman", serif', color: '#1a1a1a', position: 'relative', height: '100%'}}>
        <div style={{textAlign: 'center', fontSize: 20, letterSpacing: 3}}>UNITED STATES DISTRICT COURT<br />FOR THE DISTRICT OF COLUMBIA</div>
        <div style={{height: 2, background: '#1a1a1a', margin: '18px 0'}} />
        <div style={{fontSize: 30, textAlign: 'center', margin: '14px 0'}}>UNITED STATES OF AMERICA, <i>et al.</i><br />v.<br />GOOGLE LLC</div>
        <div style={{fontSize: 18, textAlign: 'center', letterSpacing: 4, color: '#555', margin: '10px 0 24px'}}>MEMORANDUM OPINION · AUGUST 2024</div>
        {lines.map((l, i) => <div key={i} style={{height: 14, width: `${l}%`, background: '#D9D9D9', borderRadius: 3, marginBottom: 16}} />)}
        <div style={{position: 'absolute', left: 120, bottom: 120, transform: `rotate(-12deg) scale(${0.4 + 0.6 * st})`, opacity: Math.min(1, st * 2), border: `10px solid ${RED}`, color: RED, padding: '6px 26px', fontFamily: fonts.heading, fontSize: 78, letterSpacing: 4, background: 'rgba(255,255,255,0.88)'}}>MONOPOLIST</div>
      </div>
    </Card>
  );
};

// ── Chat com assistente de IA ──
export const ChatWindow: React.FC<{x: number; y: number; w?: number; h?: number; at: number; q: string; qAt: number; a: string; aAt: number; glass?: boolean}> = ({x, y, w = 1000, h = 700, at, q, qAt, a, aAt, glass = false}) => {
  const f = useCurrentFrame();
  const qc = Math.max(0, Math.min(q.length, Math.floor((f - qAt) * 0.9)));
  const ac = Math.max(0, Math.min(a.length, Math.floor((f - aAt) * 1.5)));
  const dots = f >= qAt + q.length / 0.9 && f < aAt;
  const bg = glass ? 'rgba(255,255,255,0.72)' : '#fff';
  return (
    <Card x={x} y={y} w={w} h={h} at={at} tilt={0} bg={bg} radius={28} style={glass ? {backdropFilter: 'blur(18px)', border: '2px solid rgba(255,255,255,0.7)'} : undefined}>
      <div style={{padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid rgba(0,0,0,0.08)'}}>
        <div style={{width: 34, height: 34, borderRadius: 17, background: `conic-gradient(${G.blue}, ${G.red}, ${G.yellow}, ${G.green}, ${G.blue})`}} />
        <div style={{fontSize: 26, fontWeight: 700, color: '#202124'}}>Assistant</div>
      </div>
      <div style={{padding: '24px 30px'}}>
        {qc > 0 && <div style={{marginLeft: 'auto', maxWidth: '78%', width: 'fit-content', padding: '16px 24px', borderRadius: '24px 24px 6px 24px', background: '#E8F0FE', fontSize: 27, color: '#202124'}}>{q.slice(0, qc)}</div>}
        {dots && <div style={{marginTop: 20, display: 'flex', gap: 8}}>{[0, 1, 2].map((i) => <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: '#9AA0A6', opacity: 0.4 + 0.6 * Math.abs(Math.sin(f / 5 + i))}} />)}</div>}
        {ac > 0 && <div style={{marginTop: 22, maxWidth: '86%', padding: '18px 24px', borderRadius: '24px 24px 24px 6px', background: '#F1F3F4', fontSize: 27, color: '#202124', lineHeight: 1.45}}>{a.slice(0, ac)}</div>}
      </div>
      <div style={{position: 'absolute', left: 28, right: 28, bottom: 26, height: 66, borderRadius: 33, background: '#fff', border: '1px solid #DADCE0', display: 'flex', alignItems: 'center', padding: '0 26px', fontSize: 23, color: '#80868B'}}>Ask anything</div>
    </Card>
  );
};

// ── Alerta hospitalar: o sistema sabe antes do médico ──
export const AlertCard: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const t = (f - at) / 30;
  return (
    <>
      <Card x={x} y={y} w={760} at={at} tilt={-1.2} radius={14}>
        <div style={{background: RED, color: '#fff', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 16, height: 16, borderRadius: 8, background: '#fff', opacity: Math.floor(f / 7) % 2 ? 1 : 0.4}} />
          <div style={{fontSize: 24, fontWeight: 700, letterSpacing: 3}}>RISK ALERT</div>
          <div style={{marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 20}}>BED 12</div>
        </div>
        <div style={{padding: '26px 30px'}}>
          <div style={{fontFamily: fonts.mono, fontSize: 17, letterSpacing: 4, color: '#80868B'}}>PREDICTED MORTALITY · INPATIENT</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 8}}><div style={{fontFamily: fonts.heading, fontSize: 130, color: RED, lineHeight: 1}}>95%</div><div style={{fontSize: 28, color: '#202124'}}>within 24 hours</div></div>
        </div>
      </Card>
      <Card x={x + 90} y={y + 330} w={680} at={at + 34} tilt={1} radius={14}>
        <div style={{padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 62, height: 62, borderRadius: 31, background: '#DADCE0'}} />
          <div><div style={{fontSize: 24, fontWeight: 700, color: '#202124'}}>Attending physician</div><div style={{fontSize: 20, color: '#5F6368', marginTop: 4}}>Last review 6 h ago · <b style={{color: '#202124'}}>not yet aware</b></div></div>
        </div>
      </Card>
    </>
  );
};

// ── Medidor analógico do "contador que nunca viste" ──
export const Meter2: React.FC<{cx: number; cy: number; r?: number; at: number; hiddenUntil?: number}> = ({cx, cy, r = 220, at, hiddenUntil = 0}) => {
  const f = useCurrentFrame();
  const e = useIn(at, 16);
  const ang = -120 + interpolate(f - at, [0, 160], [0, 230], {...clampOpts, easing: Easing.inOut(Easing.quad)});
  const reveal = interpolate(f - hiddenUntil, [0, 14], [0, 1], clampOpts);
  return (
    <div style={{position: 'absolute', left: cx - r - 20, top: cy - r - 20, width: (r + 20) * 2, height: (r + 20) * 2, opacity: e}}>
      <svg width={(r + 20) * 2} height={(r + 20) * 2}>
        <circle cx={r + 20} cy={r + 20} r={r} fill="#fff" stroke="#202124" strokeWidth={10} />
        {Array.from({length: 21}, (_, i) => {
          const a = ((-120 + i * 11.5) * Math.PI) / 180 - Math.PI / 2;
          return <line key={i} x1={r + 20 + Math.cos(a) * (r - 18)} y1={r + 20 + Math.sin(a) * (r - 18)} x2={r + 20 + Math.cos(a) * (r - (i % 5 === 0 ? 46 : 32))} y2={r + 20 + Math.sin(a) * (r - (i % 5 === 0 ? 46 : 32))} stroke="#202124" strokeWidth={i % 5 === 0 ? 6 : 3} />;
        })}
        <g transform={`rotate(${ang} ${r + 20} ${r + 20})`}><line x1={r + 20} y1={r + 20} x2={r + 20} y2={r + 20 - r * 0.78} stroke={RED} strokeWidth={9} strokeLinecap="round" /></g>
        <circle cx={r + 20} cy={r + 20} r={16} fill="#202124" />
        <text x={r + 20} y={r + 20 + r * 0.55} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={r * 0.12} letterSpacing={4} fill="#5F6368">kWh · YOUR DATA</text>
      </svg>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', opacity: 1 - reveal, display: 'flex', alignItems: 'center', justifyContent: 'center'}} />
    </div>
  );
};
