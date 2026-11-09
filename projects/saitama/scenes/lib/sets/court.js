// FLAT 2D — the outdoor court at dawn (Day 3: slingshot punch, the bag flies off, the catch, self-hits). Our own design:
// warm dawn sky, hazy apartment blocks, chain-link fence, teal court with white lines, a punching bag on a steel frame.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_HIPS, P_THINK } from '../people.js';
import { hud, label, caption, punch, speedLines, COL } from '../hud.js';
import { frame, pan, glow } from '../flat2d.js';
import * as L from '../luffy.js';
import { city } from '../city2d.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie };
const ST = { off: { text: 'RUBBER · IDLE', on: false }, rubber: { text: 'RUBBER · ON', on: true, color: COL.red } };
const D3 = { day: 3, time: '6:10 AM', status: ST.off };
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const lab = (U, t, items) => items.forEach(([txt, t0, x, y, c], i) => label(U, 'L' + i, txt, t0, t, x, y, c ? { color: c } : {}));
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;

const FLOOR = 790, BAG = { x: 1180, top: 430, h: 220, w: 96 };
function bagSvg(k = 0, sw = 0) {   // k: 0 hanging .. 1 flown off
  let g = `<rect x="1060" y="300" width="18" height="${FLOOR - 300}" fill="#3a4250"/><rect x="1300" y="300" width="18" height="${FLOOR - 300}" fill="#3a4250"/><rect x="1050" y="290" width="278" height="20" rx="6" fill="#4a5262"/>`;
  if (k <= 0) return g + `<g transform="rotate(${f(sw)} ${BAG.x} 310)"><line x1="${BAG.x}" y1="310" x2="${BAG.x}" y2="${BAG.top}" stroke="#9aa3ad" stroke-width="5"/><rect x="${BAG.x - BAG.w / 2}" y="${BAG.top}" width="${BAG.w}" height="${BAG.h}" rx="40" fill="#e0412e"/><rect x="${BAG.x - BAG.w / 2}" y="${BAG.top}" width="${BAG.w * 0.32}" height="${BAG.h}" rx="30" fill="#ff6a4a" opacity="0.6"/><rect x="${BAG.x - BAG.w / 2}" y="${BAG.top + 40}" width="${BAG.w}" height="14" fill="#a82a1c"/><rect x="${BAG.x - BAG.w / 2}" y="${BAG.top + BAG.h - 54}" width="${BAG.w}" height="14" fill="#a82a1c"/></g>`;
  if (k >= 1) return g + `<line x1="${BAG.x}" y1="310" x2="${BAG.x + 6}" y2="350" stroke="#9aa3ad" stroke-width="5"/>`;
  const x = BAG.x + k * 900, y = BAG.top + BAG.h / 2 - Math.sin(k * Math.PI * 0.9) * 420 - k * 60;
  return g + `<line x1="${BAG.x}" y1="310" x2="${BAG.x + 6}" y2="350" stroke="#9aa3ad" stroke-width="5"/><g transform="rotate(${f(k * 420)} ${f(x)} ${f(y)})"><rect x="${f(x - BAG.w / 2)}" y="${f(y - BAG.h / 2)}" width="${BAG.w}" height="${BAG.h}" rx="40" fill="#e0412e"/><rect x="${f(x - BAG.w / 2)}" y="${f(y - BAG.h / 2 + 40)}" width="${BAG.w}" height="14" fill="#a82a1c"/></g>` + (k < 0.6 ? Array.from({ length: 6 }, (_, i) => `<line x1="${f(x - 90 - i * 40)}" y1="${f(y + (i - 3) * 22)}" x2="${f(x - 220 - i * 50)}" y2="${f(y + (i - 3) * 22 + 60 * k)}" stroke="#fff" stroke-width="5" opacity="0.6" stroke-linecap="round"/>`).join('') : '');
}
function court(tt, bagK = 0, sw = 0) {
  let back = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f68d6"/><stop offset="0.45" stop-color="#9aa6e6"/><stop offset="0.75" stop-color="#ffb08a"/><stop offset="1" stop-color="#ffe2b0"/></linearGradient>${glow('sun', '#fff1b8', 0.95)}</defs>`;
  back += `<rect x="-800" y="-400" width="3520" height="${FLOOR + 400}" fill="url(#sky)"/><ellipse cx="420" cy="480" rx="520" ry="380" fill="url(#sun)"/><circle cx="420" cy="500" r="70" fill="#fff4cc"/>`;
  const ST = 690;   // the street behind the court: buildings stand on it
  back += city({ vp: [960, ST - 30], ground: ST, fog: '#f4c9b4', lit: '#ffe08a', litP: 0.1, pal: ['#d9684e', '#ecc48e', '#5f86b8', '#b5608a', '#6fa08e'], layers: [
    { n: 9, x0: -800, x1: 2700, hmin: 420, hmax: 660, wmin: 150, wmax: 230, haze: 0.62, seed: 3, depth: 0.07, style: 'tower', litP: 0.04, fogAfter: 0.1 },
    { n: 7, x0: -700, x1: 2600, hmin: 280, hmax: 460, wmin: 220, wmax: 320, haze: 0.34, seed: 8, depth: 0.12, style: 'office', fogAfter: 0.08 },
    { n: 5, x0: -650, x1: 2550, hmin: 200, hmax: 330, wmin: 300, wmax: 440, haze: 0.08, seed: 12, depth: 0.18, style: 'apartment', fogAfter: 0.04 }] });
  // street: sidewalk, road, lamp posts and trees, so the blocks stand on real ground
  back += `<rect x="-900" y="${ST}" width="3720" height="16" fill="#f0c8a8"/><rect x="-900" y="${ST + 16}" width="3720" height="${FLOOR - ST}" fill="#5a5878"/>`;
  for (let x = -800; x < 2700; x += 140) back += `<rect x="${x}" y="${ST + 52}" width="70" height="6" fill="#f2d6b0" opacity="0.6"/>`;
  for (let i = 0; i < 9; i++) { const x = -700 + i * 400; back += `<rect x="${x}" y="${ST - 150}" width="8" height="150" fill="#4a3a52"/><rect x="${x - 22}" y="${ST - 156}" width="40" height="8" rx="4" fill="#4a3a52"/><circle cx="${x - 16}" cy="${ST - 146}" r="7" fill="#ffe7a0"/>`;
    const tx = x + 200; back += `<rect x="${tx - 6}" y="${ST - 70}" width="12" height="70" fill="#5a3a40"/><circle cx="${tx}" cy="${ST - 110}" r="58" fill="#ee7a3e"/><circle cx="${tx - 34}" cy="${ST - 84}" r="40" fill="#d85a34"/><circle cx="${tx + 30}" cy="${ST - 90}" r="44" fill="#ff9a4a"/>`; }
  // chain-link fence
  let mid = ''; for (let x = -800; x < 2720; x += 260) mid += `<rect x="${x}" y="300" width="10" height="${FLOOR - 300}" fill="#5a6270"/>`; mid += `<rect x="-800" y="296" width="3520" height="8" fill="#5a6270"/>`;
  let mesh = ''; for (let x = -800; x < 2720; x += 34) mesh += `<line x1="${x}" y1="300" x2="${x + 120}" y2="${FLOOR}" stroke="#4a5262" stroke-width="1.6" opacity="0.12"/><line x1="${x + 120}" y1="300" x2="${x}" y2="${FLOOR}" stroke="#4a5262" stroke-width="2" opacity="0.35"/>`; mid += mesh;
  // hoop on the right
  mid += `<rect x="1880" y="260" width="22" height="${FLOOR - 260}" fill="#3a4250"/><rect x="1760" y="220" width="160" height="110" rx="6" fill="#f4f6f8"/><rect x="1800" y="250" width="70" height="50" fill="none" stroke="#e0412e" stroke-width="5"/><rect x="1740" y="320" width="80" height="8" rx="4" fill="#ff6a3b"/><path d="M 1744 328 L 1754 380 L 1806 380 L 1816 328" fill="none" stroke="#fff" stroke-width="3"/>`;
  mid += bagSvg(bagK, sw);
  let floor = `<defs><linearGradient id="ct" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14a88e"/><stop offset="1" stop-color="#1f86c0"/></linearGradient></defs><rect x="-800" y="${FLOOR}" width="3520" height="700" fill="url(#ct)"/><rect x="-800" y="${FLOOR}" width="3520" height="10" fill="#17705f"/>`;
  floor += `<rect x="-800" y="${FLOOR + 70}" width="3520" height="8" fill="#f4f6f0" opacity="0.9"/><path d="M 960 ${FLOOR + 74} L 760 1400" stroke="#f4f6f0" stroke-width="8" opacity="0.9"/><ellipse cx="960" cy="${FLOOR + 230}" rx="260" ry="70" fill="none" stroke="#f4f6f0" stroke-width="8" opacity="0.9"/><ellipse cx="420" cy="${FLOOR + 140}" rx="700" ry="60" fill="#ffe6a8" opacity="0.18"/>`;
  return { back, mid, floor, FLOOR, bg: '#ff9a6a', blur: 1.6, reflOp: 0.06, tex: 0.18 };
}
const HX = 640;
const H = (pose, face, o = {}) => ({ x: o.x ?? HX, y: FLOOR + 40, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: 0.5, extra: o.extra });
const CT = { z: 1.0, cx: 960, cy: 520 }, CLOSE = { z: 1.45, cx: 820, cy: 540 }, WIDE = { z: 0.78, cx: 1100, cy: 520 };
export { court, FLOOR };
