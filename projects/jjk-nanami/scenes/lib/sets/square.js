// FLAT 2D — the city square at night (Day 40: gas-main explosion, Gear 5, the rubber road, the crowd, then the cost).
// Our own design: purple night, a 2.5D square of shopfronts with lit windows, a fountain, a plaza, a road across the
// front with lane lines, street lamps; the crater, the bus, cars, the rubber road and the crowd are drawn per shot.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_HIPS, P_TIRED, P_PHONE } from '../people.js';
import { hud, label, caption, punch, COL } from '../hud.js';
import { frame, pan, glow } from '../flat2d.js';
import { city } from '../city2d.js';
import * as V from '../vehicles2d.js';
import * as L from '../luffy.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie }, WHITE = { top: '#f4f1ff', bottom: '#e6e2f4' };
const D40 = { day: 40, time: '8:47 PM', status: { text: 'RUBBER · IDLE', on: false } }, G5 = { text: 'GEAR 5 · ON', on: true, color: '#ffffff' };
const DC = { day: 40, time: '8:49 PM', status: { text: 'STAMINA · 0%', on: true, color: COL.red } };
const g5s = (s) => ({ ...D40, status: { text: `GEAR 5 · ${s}`, on: true, color: '#ffffff' } });
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const lab = (U, t, items) => items.forEach(([txt, t0, x, y, c], i) => label(U, 'L' + i, txt, t0, t, x, y, c ? { color: c } : {}));

const wv = (x, tt, w) => Math.sin(x * 0.005 - tt * 4) * 70 * w;
const FLOOR = 740, ROAD = [FLOOR + 110, FLOOR + 300], LAMPS = [220, 760, 1300];
function square(tt, o = {}) {
  let back = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0f3a"/><stop offset="1" stop-color="#5a2f8a"/></linearGradient>${glow('lp', '#ffd38a', 0.6)}${glow('fire', '#ff8a2a', 0.7)}</defs><rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#sky)"/>`;
  back += city({ vp: [960, 600], ground: 620, fog: '#4a2f7a', lit: '#ffcf7a', litP: 0.38, pal: ['#3a2a6a', '#5a2f5e', '#2a3a72', '#4a2650', '#38306a'], layers: [
    { n: 10, x0: -800, x1: 2700, hmin: 420, hmax: 700, wmin: 150, wmax: 230, haze: 0.5, seed: 31, depth: 0.08, style: 'tower', litP: 0.2 },
    { n: 6, x0: -700, x1: 2600, hmin: 240, hmax: 400, wmin: 260, wmax: 360, haze: 0.2, seed: 37, depth: 0.14, style: 'apartment', litP: 0.45 }] });
  // shop awnings along the plaza edge
  const aw = ['#e8452e', '#2a9a8e', '#ffb21a', '#9a5cc0'];
  for (let i = 0; i < 12; i++) { const x = -700 + i * 290; back += `<rect x="${x}" y="560" width="250" height="60" fill="#ffe7a0" opacity="0.85"/><path d="M ${x - 10} 560 L ${x + 260} 560 L ${x + 250} 530 L ${x} 530 Z" fill="${aw[i % 4]}"/>${[0, 1, 2, 3, 4].map((j) => `<path d="M ${x - 10 + j * 54} 560 q 27 18 54 0" fill="${aw[i % 4]}"/>`).join('')}`; }
  back += `<rect x="-900" y="620" width="3720" height="${FLOOR - 620}" fill="#4a3a70"/>`;
  // fountain (mid layer, sharp)
  let mid = `<ellipse cx="1420" cy="${FLOOR - 8}" rx="230" ry="34" fill="#2a2a5a"/><rect x="1190" y="${FLOOR - 60}" width="460" height="52" fill="#8a86b0"/><rect x="1190" y="${FLOOR - 60}" width="460" height="10" fill="#b0acd4"/><rect x="1400" y="${FLOOR - 170}" width="40" height="110" fill="#8a86b0"/><ellipse cx="1420" cy="${FLOOR - 170}" rx="90" ry="16" fill="#b0acd4"/>`;
  for (let i = 0; i < 7; i++) { const ph = (tt * 1.4 + i / 7) % 1, a = -1.2 + i * 0.4; mid += `<circle cx="${f(1420 + Math.sin(a) * ph * 120)}" cy="${f(FLOOR - 180 - Math.sin(ph * Math.PI) * 80 + ph * 40)}" r="5" fill="#bfe8ff" opacity="${f(1 - ph)}"/>`; }
  // street lamps along the road (or bent into loops when o.loop > 0)
  for (const x of LAMPS) { const k = o.loop || 0; if (k <= 0) mid += `<rect x="${x - 6}" y="${FLOOR - 300}" width="12" height="${ROAD[0] - FLOOR + 300}" fill="#2a2240"/><path d="M ${x} ${FLOOR - 296} q 30 -20 70 -6" stroke="#2a2240" stroke-width="9" fill="none"/><ellipse cx="${x + 70}" cy="${FLOOR - 290}" rx="200" ry="200" fill="url(#lp)" opacity="0.5"/><circle cx="${x + 70}" cy="${FLOOR - 296}" r="14" fill="#fff0c8"/>`;
    else { const b = [x, ROAD[0]], r = 150; mid += `<path d="M ${b[0]} ${b[1]} C ${f(b[0])} ${f(b[1] - 300 * (1 - k) - r)} ${f(b[0] + r * 2 * k)} ${f(b[1] - r * 1.6)} ${f(b[0] + r * 2.6 * k)} ${f(b[1] - 300 * (1 - k) * 0.6)}" stroke="#b9dcff" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M ${b[0]} ${b[1]} C ${f(b[0])} ${f(b[1] - 300 * (1 - k) - r)} ${f(b[0] + r * 2 * k)} ${f(b[1] - r * 1.6)} ${f(b[0] + r * 2.6 * k)} ${f(b[1] - 300 * (1 - k) * 0.6)}" stroke="#3a2f5a" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="${f(b[0] + r * 2.6 * k)}" cy="${f(b[1] - 300 * (1 - k) * 0.6)}" r="60" fill="url(#lp)"/><circle cx="${f(b[0] + r * 2.6 * k)}" cy="${f(b[1] - 300 * (1 - k) * 0.6)}" r="14" fill="#fff0c8"/>`; } }
  // plaza paving, kerb, road with lane lines
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="${ROAD[0] - FLOOR}" fill="#6a5a94"/>`;
  for (let x = -900; x < 2800; x += 120) floor += `<line x1="${x}" y1="${FLOOR}" x2="${x - 40}" y2="${ROAD[0]}" stroke="#7d6ea8" stroke-width="3"/>`;
  floor += `<rect x="-900" y="${ROAD[0] - 14}" width="3720" height="14" fill="#b0a6d0"/>`;
  if (!o.wave) { floor += `<rect x="-900" y="${ROAD[0]}" width="3720" height="700" fill="#2c2846"/>`; for (let x = -900; x < 2800; x += 200) floor += `<rect x="${x}" y="${(ROAD[0] + ROAD[1]) / 2}" width="110" height="10" fill="#ffd23f" opacity="0.8"/>`; }
  else { // the asphalt turns to rubber: its top edge follows h(x); the rubber part (white) spreads over [a0, a1]
    const S = o.surf || { h: (x) => wv(x, tt, o.wave), a: [-900, 2800] }, top = (x) => ROAD[0] + 30 + S.h(x), mid = (x) => (ROAD[0] + ROAD[1]) / 2 + S.h(x) * 0.8;
    floor += `<rect x="-900" y="${ROAD[0]}" width="3720" height="700" fill="#140f24"/>`;
    let d = 'M -900 1500'; for (let x = -900; x <= 2800; x += 20) d += ` L ${x} ${f(top(x))}`; d += ' L 2800 1500 Z';
    floor += `<path d="${d}" fill="#2c2846"/>`;
    const [a0, a1] = S.a; if (a1 > a0) { let w = `M ${f(a0)} 1500`; for (let x = a0; x <= a1; x += 20) w += ` L ${f(x)} ${f(top(x))}`; w += ` L ${f(a1)} 1500 Z`; floor += `<path d="${w}" fill="#d9d2ff"/><path d="${w}" fill="none" stroke="#ffffff" stroke-width="10" opacity="0.6"/>`;
      for (const xe of [a0, a1]) floor += `<ellipse cx="${f(xe)}" cy="${f(top(xe) + 60)}" rx="40" ry="90" fill="#ffffff" opacity="0.35"/>`; }
    let c = ''; for (let x = -900; x <= 2800; x += 20) c += `${x === -900 ? 'M' : 'L'} ${x} ${f(top(x))} `; floor += `<path d="${c}" stroke="#f4f1ff" stroke-width="5" fill="none"/>`;
    for (let x = -900; x < 2800; x += 200) { const an = Math.atan2(mid(x + 110) - mid(x), 110) * 180 / Math.PI, inR = x + 55 > a0 && x + 55 < a1; floor += `<rect x="${x}" y="${f(mid(x))}" width="110" height="12" fill="${inR ? '#c9c2f0' : '#ffd23f'}" transform="rotate(${f(an)} ${x} ${f(mid(x))})"/>`; } }
  for (const x of LAMPS) floor += `<ellipse cx="${x + 70}" cy="${FLOOR + 60}" rx="260" ry="46" fill="url(#lp)" opacity="0.6"/>`;
  return { back, mid, floor, FLOOR, bg: '#3a2366', blur: 2, reflOp: 0.12, tex: 0.22 };
}
// the gas-main crater on the road (x 960), with fire and smoke; k = 0..1 opening
function crater(tt, k = 1, r0 = 300, x = 960) { const y = (ROAD[0] + ROAD[1]) / 2 + 20, r = r0 * k; if (r < 2) return '';
  let g = `<ellipse cx="${x}" cy="${y}" rx="${f(r * 1.6)}" ry="${f(r * 0.6)}" fill="url(#fire)"/><path d="M ${f(x - r)} ${y} Q ${f(x - r * 0.6)} ${f(y - r * 0.32)} ${x} ${f(y - r * 0.28)} Q ${f(x + r * 0.7)} ${f(y - r * 0.34)} ${f(x + r)} ${y} Q ${f(x + r * 0.5)} ${f(y + r * 0.34)} ${x} ${f(y + r * 0.3)} Q ${f(x - r * 0.6)} ${f(y + r * 0.3)} ${f(x - r)} ${y} Z" fill="#0c0a14" stroke="#ff8a2a" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) { const ph = (tt * 1.1 + i / 9) % 1, fx = x + Math.sin(i * 2.3) * r * 0.5; g += `<path d="M ${f(fx - 30 * (1 - ph))} ${f(y)} Q ${f(fx)} ${f(y - 180 * ph - 60)} ${f(fx + 30 * (1 - ph))} ${f(y)} Z" fill="${i % 2 ? '#ff8a2a' : '#ffd23f'}" opacity="${f(0.85 * (1 - ph))}"/>`; }
  for (let i = 0; i < 10; i++) { const ph = (tt * 0.5 + i / 10) % 1; g += `<circle cx="${f(x + Math.sin(i * 1.7 + tt) * r * 0.7)}" cy="${f(y - 100 - ph * 600)}" r="${f(40 + ph * 110)}" fill="#3a3050" opacity="${f(0.55 * (1 - ph))}"/>`; }
  return g; }
const HX = 520, H = (pose, face, o = {}) => ({ x: o.x ?? HX, y: o.y ?? FLOOR + 50, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const G5H = (pose, face, tt, o = {}) => H(pose, face, { ...o, outfit: { ...WHITE, ...(o.outfit || {}) }, extra: (c) => L.gear5(c, tt) + (o.extra ? o.extra(c) : '') });
const crowd = (faces) => [0, 1, 2, 3, 4, 5, 6].map((k) => ({ x: 1180 + k * 150 + (k % 2) * 20, y: FLOOR + 30 + (k % 3) * 14, h: 320 + (k % 3) * 14, pose: k === 2 ? P_HIPS : k === 5 ? { ...P_PHONE, aR: [62, 92] } : { ...P_STAND, aL: [30, 40], aR: [30, 40] }, outfit: { top: ['#e0723a', '#9a5cc0', '#2f9a8e', '#a8a6ad', '#4a6fb5', '#c9a03a', '#e05a8a'][k], bottom: '#22263a', hair: ['ponytail', 'curly', undefined, 'short'][k % 4], cap: k === 4 ? '#3f6db3' : undefined }, face: faces(k), flip: true, look: -0.6,
  extra: k === 5 ? (c) => { const hd = c.hands[1], r = c.R; return `<rect x="${f(hd[0] - r * 0.22)}" y="${f(hd[1] - r * 0.7)}" width="${f(r * 0.44)}" height="${f(r * 0.74)}" rx="6" fill="#15181e" stroke="#b9dcff" stroke-width="3"/><circle cx="${f(hd[0])}" cy="${f(hd[1] - r * 0.6)}" r="5" fill="#ff3b3b"/>`; } : null }));
const wrinkles = (c) => [0, 1, 2].map((k) => `<path d="M ${f(c.head[0] - c.R * 0.6)} ${f(c.head[1] - c.R * (0.62 - k * 0.16))} q ${f(c.R * 0.6)} ${f(-c.R * 0.14)} ${f(c.R * 1.2)} 0" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.7"/>`).join('') + `<path d="M ${f(c.head[0] - c.R * 0.95)} ${f(c.head[1] - c.R * 0.45)} Q ${f(c.head[0])} ${f(c.head[1] - c.R * 1.6)} ${f(c.head[0] + c.R * 0.95)} ${f(c.head[1] - c.R * 0.45)} Q ${f(c.head[0])} ${f(c.head[1] - c.R * 1.1)} ${f(c.head[0] - c.R * 0.95)} ${f(c.head[1] - c.R * 0.45)} Z" fill="#e8e6f0"/>`;
const ripples = (c, tt) => { if (!c) return ''; let g = ''; const x = c.hands[1][0], y = ROAD[0] + 10; g += `<path d="M ${f(c.hands[1][0])} ${f(c.hands[1][1])} Q ${f(x + 60)} ${f((c.hands[1][1] + y) / 2)} ${f(x + 120)} ${y}" stroke="#ffffff" stroke-width="5" stroke-dasharray="10 12" fill="none" opacity="0.7"/>`; for (let i = 0; i < 3; i++) { const ph = (tt * 0.9 + i / 3) % 1; g += `<ellipse cx="${f(x + 120)}" cy="${y + 30}" rx="${f(40 + ph * 400)}" ry="${f(10 + ph * 60)}" fill="none" stroke="#ffffff" stroke-width="${f(6 * (1 - ph))}" opacity="${f(0.8 * (1 - ph))}"/>`; } return g; };
const SIT = (head) => ({ sit: true, lean: 16, aL: [20, 40], aR: [20, 40], lL: [0, 0], lR: [0, 0], head });
const bench = () => `<rect x="${HX - 140}" y="${FLOOR - 10}" width="280" height="16" rx="6" fill="#5a4a7a"/><rect x="${HX - 130}" y="${FLOOR + 6}" width="12" height="44" fill="#3a2a5a"/><rect x="${HX + 118}" y="${FLOOR + 6}" width="12" height="44" fill="#3a2a5a"/>`;
const SQW = { z: 0.78, cx: 960, cy: 520 }, CU = { z: 2.0, cx: HX + 30, cy: 540 }, MED = { z: 1.4, cx: HX + 120, cy: 560 };
export { square, crater, wv, FLOOR };
