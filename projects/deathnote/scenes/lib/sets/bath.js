// FLAT 2D — the bathroom (Day 1: mirror test, cheek pull, warm/cold arm, sweating). Our own design: aqua tiles, a wide
// mirror over the sink that shows the back of the hero, a bright window with light shafts, a towel rail, glossy floor.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_THINK, P_TIRED } from '../people.js';
import { hud, label, caption, COL } from '../hud.js';
import { frame, pan, glow } from '../flat2d.js';
import { person } from '../char2d.js';
import * as L from '../luffy.js';

const f = (n) => n.toFixed(1);
const HERO = { top: '#2f8f9a', bottom: '#1f2a44', hood: true, bald: true, broad: true };
const ST = { off: { text: 'RUBBER · IDLE', on: false } };
const D1 = { day: 1, time: '8:02 AM', status: ST.off };
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const lab = (U, t, items) => items.forEach(([txt, t0, x, y, c], i) => label(U, 'L' + i, txt, t0, t, x, y, c ? { color: c } : {}));

const FLOOR = 820, MIR = { x: 1010, y: 190, w: 680, h: 400 };
// the hero's reflection: the back of the figure, smaller, inside the mirror
function reflection(x, pose) {
  const c = person(x - 190, FLOOR - 10, 360, pose, { ...HERO, face: 'back', flip: true, rim: '#d8f4ff' });
  return `<defs><clipPath id="mc"><rect x="${MIR.x + 14}" y="${MIR.y + 14}" width="${MIR.w - 28}" height="${MIR.h - 28}" rx="10"/></clipPath></defs><g clip-path="url(#mc)" opacity="0.85">${c.svg}<rect x="${MIR.x}" y="${MIR.y}" width="${MIR.w}" height="${MIR.h}" fill="#bff3ff" opacity="0.18"/></g>`;
}
function bathroom(tt, heroX = 1350, pose = P_STAND) {
  let back = `<defs><linearGradient id="bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8fb4"/><stop offset="0.7" stop-color="#5cc3df"/><stop offset="1" stop-color="#8fdcea"/></linearGradient>${glow('sun', '#fff6d0', 0.8)}</defs>`;
  back += `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#bw)"/>`;
  for (let x = -600; x < 2520; x += 70) back += `<line x1="${x}" y1="0" x2="${x}" y2="${FLOOR}" stroke="#ffffff" stroke-width="3" opacity="0.18"/>`;
  for (let y = 20; y < FLOOR; y += 70) back += `<line x1="-600" y1="${y}" x2="2520" y2="${y}" stroke="#ffffff" stroke-width="3" opacity="0.18"/>`;
  // window (left) with sky, frame, plant, and light shafts across the room
  back += `<ellipse cx="260" cy="360" rx="520" ry="420" fill="url(#sun)"/><rect x="60" y="150" width="400" height="430" rx="10" fill="#f4f8fb"/><rect x="82" y="172" width="356" height="386" fill="#9fe0ff"/><circle cx="350" cy="260" r="46" fill="#fff4c2"/><path d="M 82 470 Q 180 420 270 460 T 438 450 L 438 558 L 82 558 Z" fill="#6fd0a0"/><rect x="254" y="172" width="12" height="386" fill="#f4f8fb"/><rect x="82" y="356" width="356" height="12" fill="#f4f8fb"/><rect x="40" y="574" width="440" height="22" rx="6" fill="#e9eef2"/>`;
  back += `<rect x="330" y="520" width="56" height="56" rx="8" fill="#e2553f"/><path d="M 358 520 q -30 -50 -6 -86 q 10 40 6 86 M 358 520 q 30 -46 10 -80 q -8 36 -10 80" fill="#2f9a5e"/>`;
  // towel rail + towel
  back += `<rect x="560" y="400" width="300" height="12" rx="6" fill="#d9e2e8"/><path d="M 600 404 L 820 404 L 812 640 Q 760 656 708 640 Q 656 656 610 640 Z" fill="#ff7aa0"/><rect x="600" y="590" width="220" height="14" fill="#ffffff" opacity="0.5"/>`;
  let mid = `<path d="M 60 150 L 1200 ${FLOOR} L 640 ${FLOOR} L 0 260 Z" fill="#fff8dc" opacity="0.07"/><path d="M 260 150 L 1500 ${FLOOR} L 1100 ${FLOOR} L 200 200 Z" fill="#fff8dc" opacity="0.05"/>`;
  // mirror with frame, shine and the hero's reflection
  mid += `<rect x="${MIR.x - 12}" y="${MIR.y - 12}" width="${MIR.w + 24}" height="${MIR.h + 24}" rx="18" fill="#f2f6f8"/><rect x="${MIR.x}" y="${MIR.y}" width="${MIR.w}" height="${MIR.h}" rx="12" fill="#a8e6f4"/><rect x="${MIR.x}" y="${MIR.y}" width="${MIR.w}" height="${MIR.h}" rx="12" fill="#2f8fb4" opacity="0.35"/>`;
  mid += reflection(heroX, pose);
  mid += `<path d="M ${MIR.x + 60} ${MIR.y + MIR.h - 20} L ${MIR.x + 220} ${MIR.y + 20} L ${MIR.x + 270} ${MIR.y + 20} L ${MIR.x + 110} ${MIR.y + MIR.h - 20} Z" fill="#ffffff" opacity="0.28"/><path d="M ${MIR.x + 300} ${MIR.y + MIR.h - 20} L ${MIR.x + 420} ${MIR.y + 20} L ${MIR.x + 440} ${MIR.y + 20} L ${MIR.x + 320} ${MIR.y + MIR.h - 20} Z" fill="#ffffff" opacity="0.22"/>`;
  // shelf + cup, sink cabinet
  mid += `<rect x="${MIR.x + 40}" y="${MIR.y + MIR.h + 22}" width="${MIR.w - 80}" height="14" rx="6" fill="#e6edf1"/><rect x="${MIR.x + 90}" y="${MIR.y + MIR.h - 18}" width="40" height="40" rx="8" fill="#ffd23f"/><rect x="${MIR.x + 100}" y="${MIR.y + MIR.h - 56}" width="6" height="44" fill="#4fa8ff"/><rect x="${MIR.x + 112}" y="${MIR.y + MIR.h - 50}" width="6" height="38" fill="#ff6a5a"/>`;
  const cy = 660; mid += `<rect x="${MIR.x + 10}" y="${cy}" width="${MIR.w - 20}" height="${FLOOR - cy}" rx="8" fill="#2a5f86"/><rect x="${MIR.x + 10}" y="${cy}" width="${MIR.w - 20}" height="22" fill="#f4f8fb"/><line x1="${MIR.x + MIR.w / 2}" y1="${cy + 30}" x2="${MIR.x + MIR.w / 2}" y2="${FLOOR - 10}" stroke="#1d4a6a" stroke-width="5"/><circle cx="${MIR.x + MIR.w / 2 - 24}" cy="${cy + 80}" r="7" fill="#f2c230"/><circle cx="${MIR.x + MIR.w / 2 + 24}" cy="${cy + 80}" r="7" fill="#f2c230"/><path d="M ${MIR.x + MIR.w / 2 - 10} ${cy} L ${MIR.x + MIR.w / 2 - 10} ${cy - 50} Q ${MIR.x + MIR.w / 2 + 40} ${cy - 56} ${MIR.x + MIR.w / 2 + 40} ${cy - 24}" fill="none" stroke="#c9d3da" stroke-width="12" stroke-linecap="round"/>`;
  // glossy floor
  let floor = `<defs><linearGradient id="bf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bfe9f4"/><stop offset="1" stop-color="#9fd6e8"/></linearGradient></defs><rect x="-600" y="${FLOOR}" width="3120" height="600" fill="url(#bf)"/><rect x="-600" y="${FLOOR}" width="3120" height="8" fill="#7fbcd0"/>`;
  for (let x = -600; x < 2520; x += 160) floor += `<line x1="${x}" y1="${FLOOR + 8}" x2="${x - 140}" y2="1400" stroke="#ffffff" stroke-width="3" opacity="0.35"/>`;
  floor += `<ellipse cx="900" cy="${FLOOR + 110}" rx="520" ry="46" fill="#fff8dc" opacity="0.22"/><rect x="${MIR.x + 10}" y="${FLOOR + 6}" width="${MIR.w - 20}" height="60" fill="#2a5f86" opacity="0.12"/>`;
  return { back, mid, floor, FLOOR, bg: '#2f8fb4', blur: 3, reflOp: 0.1 };
}
const H = (x, pose, face, o = {}) => ({ x, y: FLOOR + 40, h: o.h || 400, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: 0, extra: o.extra, pre: o.pre });
// cheek pull: a rubbery lobe of skin stretched out of the right side of the face, pinched by the hero's own hand.
// k = 0..1 stretch; the lobe narrows to a neck under the fingers, with crease lines; the arm reaches the pinch point.
const cheek = (c, k, wob = 0, behind = false) => { if (!c) return ''; const [hx, hy] = c.head, R = c.R, OL = '#b9dcff', INK = '#00000d';
  const bx = hx + R * 0.72, by = hy + R * 0.42, len = R * (0.25 + 2.8 * k), tx = bx + len, ty = by + R * 0.12 + wob * R * 0.3;
  const wB = R * 0.36, wN = R * Math.max(0.12, 0.3 - 0.12 * k), mx = bx + len * 0.55;
  const lobe = `M ${f(bx - R * 0.1)} ${f(by - wB)} C ${f(mx - len * 0.15)} ${f(by - wB * 0.9)} ${f(mx)} ${f(ty - wN * 1.6)} ${f(tx - R * 0.12)} ${f(ty - wN)} Q ${f(tx + R * 0.16)} ${f(ty)} ${f(tx - R * 0.12)} ${f(ty + wN)} C ${f(mx)} ${f(ty + wN * 1.8)} ${f(mx - len * 0.15)} ${f(by + wB * 0.9)} ${f(bx - R * 0.1)} ${f(by + wB)} Z`;
  if (behind) return `<path d="${lobe}" fill="${INK}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`;
  let g = `<path d="${lobe}" fill="${INK}"/>`;
  if (k > 0.1) g += `<path d="M ${f(bx + R * 0.1)} ${f(by - wB * 0.55)} C ${f(mx - len * 0.1)} ${f(by - wB * 0.5)} ${f(mx)} ${f(ty - wN * 1.1)} ${f(tx - R * 0.25)} ${f(ty - wN * 0.55)}" fill="none" stroke="#7a8aa8" stroke-width="${f(R * 0.07)}" stroke-linecap="round" opacity="0.55"/>`;
  for (let i = 1; i <= 3; i++) { const u = 0.25 + i * 0.17, x = bx + len * u, hw = (wB + (wN - wB) * u) * 0.7; if (k > 0.15) g += `<path d="M ${f(x)} ${f(by + (ty - by) * u - hw)} q ${f(R * 0.08)} ${f(hw)} 0 ${f(hw * 2)}" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.35"/>`; }
  // the arm: shoulder -> elbow (down and out) -> pinch, sleeve colour with outline; mitten hand + thumb
  const S = c.shR, E = [S[0] + (tx - S[0]) * 0.55 + R * 0.25, Math.max(S[1], ty) + R * 1.1], w = R * 0.28, sl = HERO.top, d = `M ${f(S[0])} ${f(S[1])} L ${f(E[0])} ${f(E[1])} L ${f(tx + R * 0.05)} ${f(ty + R * 0.12)}`;
  g += `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${f(w + 6)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${sl}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += `<circle cx="${f(tx + R * 0.05)}" cy="${f(ty + R * 0.14)}" r="${f(R * 0.19)}" fill="${INK}" stroke="${OL}" stroke-width="3"/><circle cx="${f(tx + R * 0.02)}" cy="${f(ty - R * 0.14)}" r="${f(R * 0.1)}" fill="${INK}" stroke="${OL}" stroke-width="2.5"/>`;
  return g; };
const heat = (c, col, k) => c ? `<circle cx="${f(c.head[0])}" cy="${f(c.head[1] + c.R * 2.4)}" r="${f(c.R * 3)}" fill="${col}" opacity="${f(0.28 * k)}"/>` : '';
const WIDE = { z: 1, cx: 960, cy: 520 }, MED = { z: 1.35, cx: 1250, cy: 560 }, CU = { z: 2.3, cx: 1350, cy: 470 };
export { bathroom, FLOOR };
