// FLAT 2D — the empty supermarket car park at night (Day 27 Gear 4 + the 10-minute weakness; Day 28 the drone, the net,
// the van). Our own design: deep blue night, a 2.5D skyline, a closed supermarket with a lit sign strip and glowing doors,
// tall sodium lamps with warm pools, faded bays on dark asphalt, parked cars, round dark trees.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_HIPS, P_TIRED, P_THINK } from '../people.js';
import { hud, label, caption, punch, COL } from '../hud.js';
import { frame, pan, glow } from '../flat2d.js';
import { city } from '../city2d.js';
import * as V from '../vehicles2d.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie };
const ST = { off: { text: 'RUBBER · IDLE', on: false } }, G4 = { text: 'GEAR 4 · ON', on: true, color: '#c86aff' };
const HAKI = (mm) => ({ text: `HAKI · OFF ${mm}`, on: true, color: COL.red });
const D27 = { day: 27, time: '11:30 PM', status: G4 }, D28 = { day: 28, time: '11:50 PM', status: ST.off };
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const lab = (U, t, items) => items.forEach(([txt, t0, x, y, c], i) => label(U, 'L' + i, txt, t0, t, x, y, c ? { color: c } : {}));
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };

const FLOOR = 780;
function park(tt) {
  let back = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1240"/><stop offset="1" stop-color="#2a3a8a"/></linearGradient>${glow('sod', '#ffb04a', 0.55)}${glow('sg', '#5affc8', 0.45)}</defs><rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#sky)"/>`;
  for (let i = 0; i < 50; i++) back += `<circle cx="${(i * 389) % 3400 - 700}" cy="${-300 + ((i * 131) % 420)}" r="${1 + (i % 3)}" fill="#ffffff" opacity="0.6"/>`;
  back += `<circle cx="1600" cy="-120" r="60" fill="#f4f1ff"/><circle cx="1620" cy="-136" r="56" fill="#1a2260"/>`;
  back += city({ vp: [960, 520], ground: 540, fog: '#26307a', lit: '#ffd27a', litP: 0.28, pal: ['#1c2460', '#2a1f5e', '#18306a', '#241c4e'], layers: [{ n: 10, x0: -800, x1: 2700, hmin: 300, hmax: 560, wmin: 150, wmax: 230, haze: 0.5, seed: 21, depth: 0.08, style: 'tower', litP: 0.15 }] });
  // supermarket: long facade, sign strip, glowing doors, trolleys
  back += `<rect x="-200" y="330" width="2300" height="${560 - 330}" fill="#3a4a8a"/><rect x="-200" y="330" width="2300" height="20" fill="#5a6ab0"/><rect x="-200" y="372" width="2300" height="70" fill="#141a40"/><ellipse cx="960" cy="408" rx="700" ry="90" fill="url(#sg)"/><text x="960" y="426" text-anchor="middle" font-family="Inter" font-weight="900" font-size="58" letter-spacing="10" fill="#5affc8">FRESH MARKET</text>`;
  for (let i = 0; i < 9; i++) back += `<rect x="${-120 + i * 250}" y="460" width="${i === 4 ? 0 : 200}" height="100" fill="#22305e"/>`; back += `<rect x="830" y="455" width="260" height="105" fill="#ffe7a0" opacity="0.85"/><rect x="958" y="455" width="4" height="105" fill="#c9a050"/>`;
  back += `<rect x="-900" y="540" width="3720" height="${FLOOR - 540}" fill="#1e2440"/>`;
  // trees + parked cars at the back of the lot
  let mid = ''; for (let i = 0; i < 7; i++) { const x = -500 + i * 460; mid += `<rect x="${x - 8}" y="500" width="16" height="70" fill="#0e1430"/><circle cx="${x}" cy="480" r="62" fill="#14204a"/><circle cx="${x - 40}" cy="508" r="40" fill="#18285a"/>`; }
  [[-300, '#c84a3a'], [300, '#3a6ad0'], [1300, '#e0b030'], [1900, '#6a7a8a']].forEach(([x, c]) => { mid += V.car(x, 640, 300, { col: c }); });
  // sodium lamps with warm light pools
  for (const x of [-200, 560, 1320, 2080]) mid += `<rect x="${x - 6}" y="150" width="12" height="${FLOOR - 150}" fill="#2a3050"/><path d="M ${x} 160 Q ${x + 30} 140 ${x + 80} 150" stroke="#2a3050" stroke-width="10" fill="none"/><rect x="${x + 60}" y="146" width="56" height="16" rx="8" fill="#ffd27a"/><path d="M ${x + 64} 162 L ${x - 120} ${FLOOR + 160} L ${x + 300} ${FLOOR + 160} L ${x + 112} 162 Z" fill="#ffb04a" opacity="0.07"/>`;
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="700" fill="#242a48"/><rect x="-900" y="${FLOOR}" width="3720" height="8" fill="#1a1f38"/>`;
  for (const x of [-200, 560, 1320, 2080]) floor += `<ellipse cx="${x + 90}" cy="${FLOOR + 120}" rx="360" ry="70" fill="url(#sod)"/>`;
  for (let x = -900; x < 2800; x += 230) floor += `<path d="M ${x} ${FLOOR + 20} L ${x - 90} ${FLOOR + 300}" stroke="#e8ecf0" stroke-width="6" opacity="0.28"/>`;
  floor += `<rect x="-900" y="${FLOOR + 20}" width="3720" height="6" fill="#e8ecf0" opacity="0.25"/>`;
  return { back, mid, floor, FLOOR, bg: '#1a2260', blur: 2, reflOp: 0.12, tex: 0.22 };
}
// Gear 4: the whole body is redrawn on top of the normal one: a huge inflated chest in the hoodie colour, thick
// hardened ink arms and legs ending in giant fists/feet, purple steam; then the head again on top (smile).
const gear4 = (c, tt, feetY) => { const [hx, hy] = c.head, R = c.R, OL = '#b9dcff', P = '#c86aff', INK = '#00000d', top = HERO.top;
  let g = `<ellipse cx="${f(hx)}" cy="${f(hy + R * 2.6)}" rx="${f(R * 3.6)}" ry="${f(R * 3.4)}" fill="${P}" opacity="${f(0.12 + 0.05 * Math.sin(tt * 6))}"/>`;
  const leg = (s) => `M ${f(hx + s * R * 0.6)} ${f(hy + R * 3.6)} Q ${f(hx + s * R * 1.5)} ${f(hy + R * 4.6)} ${f(hx + s * R * 1.25)} ${f(feetY - R * 0.2)}`;
  for (const s of [-1, 1]) g += `<path d="${leg(s)}" stroke="${OL}" stroke-width="${f(R * 0.78)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${leg(s)}" stroke="${INK}" stroke-width="${f(R * 0.68)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="${f(hx + s * R * 1.4)}" cy="${f(feetY - R * 0.05)}" rx="${f(R * 0.6)}" ry="${f(R * 0.28)}" fill="${INK}" stroke="${OL}" stroke-width="3"/>`;
  const chest = `M ${f(hx - R * 1.7)} ${f(hy + R * 1.0)} C ${f(hx - R * 0.6)} ${f(hy + R * 0.6)} ${f(hx + R * 0.6)} ${f(hy + R * 0.6)} ${f(hx + R * 1.7)} ${f(hy + R * 1.0)} C ${f(hx + R * 2.6)} ${f(hy + R * 1.6)} ${f(hx + R * 2.2)} ${f(hy + R * 3.4)} ${f(hx + R * 1.0)} ${f(hy + R * 3.8)} L ${f(hx - R * 1.0)} ${f(hy + R * 3.8)} C ${f(hx - R * 2.2)} ${f(hy + R * 3.4)} ${f(hx - R * 2.6)} ${f(hy + R * 1.6)} ${f(hx - R * 1.7)} ${f(hy + R * 1.0)} Z`;
  g += `<path d="${chest}" fill="${top}" stroke="${OL}" stroke-width="5"/><path d="M ${f(hx - R * 1.4)} ${f(hy + R * 1.6)} Q ${f(hx - R * 0.7)} ${f(hy + R * 2.25)} ${f(hx)} ${f(hy + R * 1.75)} Q ${f(hx + R * 0.7)} ${f(hy + R * 2.25)} ${f(hx + R * 1.4)} ${f(hy + R * 1.6)}" stroke="${shade2(top)}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M ${f(hx)} ${f(hy + R * 2.3)} L ${f(hx)} ${f(hy + R * 3.5)} M ${f(hx - R * 0.55)} ${f(hy + R * 2.7)} L ${f(hx + R * 0.55)} ${f(hy + R * 2.7)} M ${f(hx - R * 0.5)} ${f(hy + R * 3.1)} L ${f(hx + R * 0.5)} ${f(hy + R * 3.1)}" stroke="${shade2(top)}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/><path d="${chest}" fill="none" stroke="${P}" stroke-width="${f(R * 0.08)}" opacity="${f(0.5 + 0.3 * Math.sin(tt * 6))}"/>`;
  for (const s of [-1, 1]) { const sh = [hx + s * R * 1.95, hy + R * 1.3], el = [hx + s * R * 2.9, hy + R * 2.7], fi = [hx + s * R * 1.25, hy + R * 2.2], arm = `M ${f(sh[0])} ${f(sh[1])} Q ${f(el[0] + s * R * 0.2)} ${f(el[1] - R * 0.6)} ${f(el[0])} ${f(el[1])} Q ${f(el[0] - s * R * 0.4)} ${f(el[1] + R * 0.3)} ${f(fi[0])} ${f(fi[1])}`;
    g += `<path d="${arm}" stroke="${OL}" stroke-width="${f(R * 0.98)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${arm}" stroke="${INK}" stroke-width="${f(R * 0.86)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<circle cx="${f(sh[0])}" cy="${f(sh[1])}" r="${f(R * 0.82)}" fill="${INK}" stroke="${OL}" stroke-width="4"/><ellipse cx="${f(sh[0] - s * R * 0.2)}" cy="${f(sh[1] - R * 0.3)}" rx="${f(R * 0.3)}" ry="${f(R * 0.14)}" fill="#ffffff" opacity="0.18"/>`;
    g += `<circle cx="${f(fi[0])}" cy="${f(fi[1])}" r="${f(R * 0.78)}" fill="${INK}" stroke="${OL}" stroke-width="4"/><circle cx="${f(fi[0])}" cy="${f(fi[1])}" r="${f(R * 0.78)}" fill="none" stroke="${P}" stroke-width="4" opacity="0.7"/>${[-0.35, 0, 0.35].map((k2) => `<path d="M ${f(fi[0] - s * R * 0.45)} ${f(fi[1] + k2 * R * 0.9)} l ${f(s * R * 0.35)} 0" stroke="#3a3a50" stroke-width="4" stroke-linecap="round"/>`).join('')}`; }
  for (let i = 0; i < 8; i++) { const ph = (tt * 0.8 + i / 8) % 1; g += `<circle cx="${f(hx + Math.sin(i * 2.1) * R * 2.6)}" cy="${f(hy + R * 1.4 - ph * R * 3)}" r="${f(R * (0.2 + ph * 0.45))}" fill="${P}" opacity="${f(0.45 * (1 - ph))}"/>`; }
  // head on top again
  g += `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(R + 3)}" fill="${OL}"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(R)}" fill="${INK}"/>`;
  { let d = ''; const n = 7; for (let i = 0; i <= n; i++) { const a = Math.PI * (1.08 + 0.84 * i / n), r = R * (i % 2 ? 1.2 : 0.96); d += `${i ? 'L' : 'M'} ${f(hx + Math.cos(a) * r + (i % 2 ? R * 0.12 : 0))} ${f(hy + Math.sin(a) * r)} `; } g += `<path d="${d} Z" fill="${INK}" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`; }
  const k = R / 46; for (const dx of [-15, 15]) g += `<path d="M ${f(hx + dx * k - 8 * k)} ${f(hy)} q ${f(8 * k)} ${f(-9 * k)} ${f(16 * k)} 0" stroke="#fff" stroke-width="${f(3.6 * k)}" fill="none" stroke-linecap="round"/><path d="M ${f(hx + dx * k - 9 * k)} ${f(hy - 13 * k + (dx < 0 ? -3 : 3) * k)} L ${f(hx + dx * k + 9 * k)} ${f(hy - 13 * k + (dx < 0 ? 3 : -3) * k)}" stroke="#fff" stroke-width="${f(3 * k)}" stroke-linecap="round"/>`;
  g += `<path d="M ${f(hx - 12 * k)} ${f(hy + 14 * k)} q ${f(12 * k)} ${f(10 * k)} ${f(24 * k)} 0" stroke="#fff" stroke-width="${f(3.6 * k)}" fill="none" stroke-linecap="round"/>`;
  return g; };
const shade2 = (h) => { const n = parseInt(h.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * 0.72)); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); };
const HX = 860, H = (pose, face, o = {}) => ({ x: o.x ?? HX, y: o.y ?? FLOOR + 50, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const PK = { z: 1.0, cx: 960, cy: 500 }, MED = { z: 1.5, cx: HX + 40, cy: 560 };
export { park, FLOOR };
