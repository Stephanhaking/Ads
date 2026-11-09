// FLAT 2D — the rooftop in a thunderstorm (Day 6: the lightning test). Our own design: indigo storm sky with cloud bands,
// a glowing city skyline, the taller next-door building with a lightning rod, a wet roof with puddles, AC units, a tank.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_HIPS, P_PHONE } from '../people.js';
import { hud, label, caption, punch, COL } from '../hud.js';
import { frame, pan, glow } from '../flat2d.js';
import * as L from '../luffy.js';
import { city, building } from '../city2d.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie };
const ST = { off: { text: 'RUBBER · IDLE', on: false } }, NIKA = { text: 'NIKA RUBBER · ON', on: true, color: '#ffffff' };
const D6 = { day: 6, time: '11:40 PM', status: ST.off };
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const lab = (U, t, items) => items.forEach(([txt, t0, x, y, c], i) => label(U, 'L' + i, txt, t0, t, x, y, c ? { color: c } : {}));
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };

const FLOOR = 800, ROD = [1700, 150];
function roof(tt, flash = 0) {
  let back = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140f2e"/><stop offset="0.6" stop-color="#2c2266"/><stop offset="1" stop-color="#4a3a8a"/></linearGradient>${glow('cg', '#ff7ad0', 0.35)}</defs>`;
  back += `<rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#sky)"/>`;
  for (let i = 0; i < 6; i++) back += `<ellipse cx="${-300 + i * 480 + Math.sin(tt * 0.1 + i) * 40}" cy="${20 + (i % 3) * 60}" rx="420" ry="80" fill="#3a2f7a" opacity="0.55"/>`;
  if (flash > 0) back += `<rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="#c9d8ff" opacity="${f(0.55 * flash)}"/>`;
  // skyline with lit windows and a pink city glow
  back += `<ellipse cx="900" cy="${FLOOR}" rx="1400" ry="260" fill="url(#cg)"/>`;
  back += city({ vp: [900, 420], ground: FLOOR, fog: '#3a2f7a', lit: '#ffd27a', litP: 0.32, pal: ['#2a2458', '#1f2a5e', '#33275e', '#24204a'], layers: [{ n: 10, x0: -800, x1: 2700, hmin: 420, hmax: 760, wmin: 150, wmax: 240, haze: 0.55, seed: 3, depth: 0.08, style: 'tower', litP: 0.12 }, { n: 7, x0: -700, x1: 2600, hmin: 280, hmax: 520, wmin: 200, wmax: 320, haze: 0.3, seed: 5, depth: 0.14, style: 'office' }, { n: 5, x0: -600, x1: 2500, hmin: 180, hmax: 340, wmin: 260, wmax: 400, haze: 0.1, seed: 9, depth: 0.2, style: 'apartment' }] });
  // next-door building with the lightning rod (sharp, mid layer)
  let mid = building(1520, FLOOR, 900, FLOOR - 230, { vp: [900, 420], depth: 0.12, col: '#2b2558', side: '#1d1840', win: '#211c48', lit: '#ffd27a', litP: 0.35, style: 'office', seed: 42, roof: false, rowH: 80, colW: 110 });
  mid += `<rect x="${ROD[0] - 4}" y="${ROD[1]}" width="8" height="${230 - ROD[1]}" fill="#c9ced3"/><circle cx="${ROD[0]}" cy="${ROD[1]}" r="7" fill="#e8ecf0"/>`;
  // water tank + AC units + parapet
  mid += `<rect x="40" y="380" width="240" height="190" rx="16" fill="#8a5a46"/><rect x="40" y="380" width="70" height="190" rx="16" fill="#a8705a" opacity="0.6"/>${[60, 130, 200, 250].map((x) => `<rect x="${x}" y="570" width="10" height="${FLOOR - 570}" fill="#2a2440"/>`).join('')}<path d="M 30 380 L 160 330 L 290 380 Z" fill="#6a4434"/>`;
  for (let i = 0; i < 3; i++) { const x = 380 + i * 170; mid += `<rect x="${x}" y="${FLOOR - 110}" width="150" height="110" rx="8" fill="#5a5f86"/><circle cx="${x + 75}" cy="${FLOOR - 55}" r="36" fill="#3d4166"/><path d="M ${x + 75} ${FLOOR - 88} L ${x + 75} ${FLOOR - 22} M ${x + 42} ${FLOOR - 55} L ${x + 108} ${FLOOR - 55}" stroke="#7a80aa" stroke-width="5"/>`; }
  mid += `<rect x="-900" y="${FLOOR - 50}" width="2420" height="50" fill="#3a3466"/><rect x="-900" y="${FLOOR - 50}" width="2420" height="8" fill="#4d4688"/>`;
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="700" fill="#2a2650"/>`;
  [[300, 70, 260], [1000, 140, 380], [1500, 60, 220]].forEach(([x, dy, rx]) => { floor += `<ellipse cx="${x}" cy="${FLOOR + dy}" rx="${rx}" ry="${f(rx * 0.12)}" fill="#6a5cc0" opacity="${f(0.45 + 0.4 * flash)}"/>`; });
  for (let i = 0; i < 40; i++) floor += `<circle cx="${(i * 233) % 2600 - 400}" cy="${FLOOR + 20 + ((i * 71) % 260)}" r="3" fill="#4a4488"/>`;
  return { back, mid, floor, FLOOR, bg: '#2c2266', blur: 2, reflOp: 0.14, tex: 0.26 };
}
const rain = (U, tt) => { let g = ''; for (let i = 0; i < 130; i++) { const x = (i * 157) % 1960, y = ((i * 97) + tt * 1500) % 1100; g += `<line x1="${x}" y1="${f(y)}" x2="${x - 12}" y2="${f(y + 38)}" stroke="#b9c8ff" stroke-width="2.5" opacity="0.5"/>`; } U.svg('rain', g, { z: 45 }); };
const flashK = (t, t0) => (t > t0 ? clamp(1 - (t - t0) / 0.3) : 0);
const HX = 860, H = (pose, face, o = {}) => ({ x: o.x ?? HX, y: FLOOR + 40, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: 0.5, extra: o.extra, pre: o.pre });
const RF = { z: 1, cx: 1000, cy: 500 }, MED = { z: 1.5, cx: HX + 60, cy: 560 }, CU = { z: 2.1, cx: HX + 20, cy: 560 };
export { roof, FLOOR };
