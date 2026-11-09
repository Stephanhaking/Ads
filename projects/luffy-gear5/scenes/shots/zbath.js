// FLAT 2D — the bathroom (Day 1: mirror test, cheek pull, warm/cold arm, sweating). Our own design: aqua tiles, a wide
// mirror over the sink that shows the back of the hero, a bright window with light shafts, a towel rail, glossy floor.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_THINK, P_TIRED } from '../lib/people.js';
import { hud, label, caption, COL } from '../lib/hud.js';
import { frame, pan, glow } from '../lib/flat2d.js';
import { person } from '../lib/char2d.js';
import * as L from '../lib/luffy.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie };
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
const cheek = (c, k) => { if (!c) return ''; const [hx, hy] = c.head, R = c.R, x2 = hx + R * (0.9 + 2.6 * k); return `<path d="M ${f(hx + R * 0.6)} ${f(hy - R * 0.2)} Q ${f((hx + x2) / 2)} ${f(hy - R * (0.3 + 0.2 * k))} ${f(x2)} ${f(hy + R * 0.1)} Q ${f((hx + x2) / 2)} ${f(hy + R * (0.5 + 0.2 * k))} ${f(hx + R * 0.6)} ${f(hy + R * 0.4)} Z" fill="#050507" stroke="#b9dcff" stroke-width="3"/><circle cx="${f(x2 + R * 0.1)}" cy="${f(hy + R * 0.1)}" r="${f(R * 0.2)}" fill="#050507" stroke="#b9dcff" stroke-width="3"/>`; };
const heat = (c, col, k) => c ? `<circle cx="${f(c.head[0])}" cy="${f(c.head[1] + c.R * 2.4)}" r="${f(c.R * 3)}" fill="${col}" opacity="${f(0.28 * k)}"/>` : '';
const WIDE = { z: 1, cx: 960, cy: 520 }, MED = { z: 1.35, cx: 1250, cy: 560 }, CU = { z: 2.3, cx: 1350, cy: 470 };
const shot = (id, body) => registerShot(id, { bg: '#2f8fb4', theme: 'dark', ui(U, t, info) { body(U, t, info, info.start + t); } });

shot('s018', (U, t, info, tt) => { frame(U, bathroom(tt), pan(WIDE, MED, ease.inOut(clamp(t / info.dur))), [H(1350, P_STAND, 'neutral')]); lab(U, t, [['TEST 1 · MIRROR', 0.3, 1240, 260]]); chrome(U, t, info, D1); });
shot('s019', (U, t, info, tt) => { const k = ease.inOut(clamp((t - 0.8) / 1.2)) * 0.5, pose = { ...P_STAND, aR: [-70, -150] }; frame(U, bathroom(tt, 1350, pose), CU, [H(1350, pose, 'worried', { extra: (c) => cheek(c, k) })]); chrome(U, t, info, D1); });
shot('s020', (U, t, info, tt) => { const k = t < 1.6 ? 0.5 + ease.out(clamp(t / 0.6)) * 0.5 : Math.max(0, 1 - (t - 1.6) / 0.15), sh = t > 1.6 && t < 1.9 ? Math.sin(t * 90) * 8 : 0, pose = { ...P_STAND, aR: [-70, -150] };
  frame(U, bathroom(tt, 1350, pose), { ...CU, cx: CU.cx + sh }, [H(1350, pose, k > 0.1 ? 'worried' : 'open', { extra: (c) => cheek(c, k) })]); lab(U, t, [['CHEEK · 30 CM', 0.5, 1240, 260], ['SNAP-BACK · 0.1 S', 1.8, 1240, 350, COL.red]]); chrome(U, t, info, D1); });
shot('s026', (U, t, info, tt) => { frame(U, bathroom(tt, 1350, P_THINK), pan(MED, { ...MED, z: 1.45 }, clamp(t / info.dur)), [H(1350, P_THINK, 'worried')]); chrome(U, t, info, D1); });
const ARM = { ...P_STAND, aR: [-70, -150] };
shot('s027', (U, t, info, tt) => { const k = ease.out(clamp(t / 1.2)); frame(U, bathroom(tt, 1350, P_STAND), { z: 1.7, cx: 1150, cy: 520 }, [H(1350, P_STAND, 'open', { outfit: { noArm: 'L' }, pre: (c) => heat(c, '#ff6a3b', 1) })], (cs) => { const c = cs[0]; if (!c) return ''; const S = c.shL; return L.stretchArm(S, [S[0] - c.R * (1.5 + 6 * k), S[1] + c.R * 0.3], c.R * 0.42, c.R * 2.4, { sleeve: HERO.top, wob: 8 * (1 - k), ph: tt, rim: '#b9dcff' }); }, { fxIn: true });
  chrome(U, t, info, { ...D1, status: { text: 'ARM TEMP · ↑', on: true, color: '#ff8a3b' } }); });
shot('s028', (U, t, info, tt) => { frame(U, bathroom(tt, 1350, P_STAND), { z: 1.7, cx: 1250, cy: 520 }, [H(1350, P_STAND, 'open', { pre: (c) => heat(c, '#4fa8ff', clamp(1 - t / 3)) })]); lab(U, t, [["THAT ONE'S REAL", info.w("That one's real", 2.4), 1220, 260, '#4fd06a']]); chrome(U, t, info, { ...D1, status: { text: 'ARM TEMP · ↓', on: true, color: '#4fa8ff' } }); });
shot('s036', (U, t, info, tt) => { frame(U, bathroom(tt, 1350, P_TIRED), pan(MED, { ...MED, z: 1.6, cy: 500 }, clamp(t / info.dur)), [H(1350, P_TIRED, 'worried', { extra: (c) => { let g = ''; for (let k = 0; k < 5; k++) { const ph = (t * 0.9 + k / 5) % 1; g += `<path d="M ${f(c.head[0] - c.R * 1.3 + k * c.R * 0.65)} ${f(c.head[1] - c.R * 1.2 + ph * c.R * 3)} q 7 16 0 26 q -7 -10 0 -26" fill="#9fe6ff" stroke="#ffffff" stroke-width="2" opacity="${f(1 - ph)}"/>`; } return g; } })]);
  chrome(U, t, info, { ...D1, status: { text: 'STRETCHES · 100', on: true, color: '#ff8a3b' } }); });
