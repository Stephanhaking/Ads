// Flat 2D art for "What If You Became Pain in Real Life? 6 Bodies" (our own designs; nothing traced from the manga/anime).
// One day and one night above a valley: a concrete dam over a small town, a field of crates and sheep, the town street
// (bakery, school, the lowest house), the dam wall with its hairline crack, the spillway, the stone room at the top of the
// valley, a red moon and violet concentric rings in the sky. Builds on sk2d (sky, clouds, birds, buildings).
import { sky, moon, clouds, birds, bldg, lampPost, bike, rnd, RED, RED2 } from './sk2d.js';
export { sky, moon, clouds, birds, bldg, lampPost, bike, rnd, RED, RED2 };
const f = (n) => n.toFixed(1);
export const VIO = '#b48cff', VIO2 = '#7a4ae0', ORANGE = '#ff7a1a', GOLD = '#ffd23f', GREEN = '#5ae08a', WATER = '#3a7ab8', CON = '#a8a49a';

// ---------- props ----------
// the violet rings: concentric circles, slowly turning dashes; k = how drawn
export function rings(x, y, R, lt = 0, k = 1, o = {}) { if (k <= 0) return ''; let g = `<g transform="translate(${f(x)} ${f(y)})" opacity="${f((o.op ?? 0.8) * Math.min(1, k))}">`;
  g += `<circle r="${f(R * 1.15)}" fill="${VIO}" opacity="0.10"/>`;
  [1, 0.78, 0.56, 0.34].forEach((m, i) => { g += `<circle r="${f(R * m * Math.min(1, k * 1.4 - i * 0.1))}" fill="none" stroke="${i % 2 ? VIO2 : VIO}" stroke-width="${f(R * 0.03)}" stroke-dasharray="${f(R * 0.4)} ${f(R * 0.06)}" transform="rotate(${f(lt * (i % 2 ? -8 : 8) + i * 20)})"/>`; });
  return g + `<circle r="${f(R * 0.12)}" fill="${VIO}"/></g>`; }
// a sheep: a cloud of wool, a dark face, four sticks
export function sheep(x, y, s = 1, lt = 0, o = {}) { const fl = o.flip ? -1 : 1, bob = Math.abs(Math.sin(lt * (o.walk ? 6 : 0))) * 4, look = o.up ? -18 : 0;
  return `<g transform="translate(${f(x)} ${f(y - bob)}) scale(${f(s * fl)} ${f(s)})">${[-34, -12, 12, 30].map((d) => `<rect x="${d}" y="-30" width="8" height="30" fill="#2a2a32"/>`).join('')}${[[-30, -60, 30], [0, -70, 34], [28, -58, 30], [-10, -44, 30], [16, -42, 28]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f2efe6"/>`).join('')}<g transform="translate(52 ${-66 + look}) rotate(${look})"><ellipse rx="20" ry="26" fill="#2a2a32"/><ellipse cx="-16" cy="-14" rx="10" ry="6" fill="#2a2a32"/><circle cx="6" cy="-6" r="4" fill="#fff"/></g></g>`; }
// a stack of wooden crates (n high); gone = flying away (pushed)
export function crates(x, y, n = 4, s = 1, o = {}) { let g = ''; const push = o.push || 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) { const id = i * 2 + j, a = (rnd(id + 3) - 0.5) * 2, dx = push * (500 + rnd(id) * 700) * (j ? 1 : -1) * (0.6 + a * 0.3), dy = -push * (300 + rnd(id * 5) * 300) * (1 - push) * 2 + push * (i * 90), rot = push * (rnd(id * 7) - 0.5) * 720;
    g += `<g transform="translate(${f(x + (j - 0.5) * 92 * s + dx)} ${f(y - (i + 0.5) * 90 * s + dy)}) rotate(${f(rot)})"><rect x="${f(-44 * s)}" y="${f(-44 * s)}" width="${f(88 * s)}" height="${f(88 * s)}" fill="#b8844a" stroke="#6a4a22" stroke-width="${f(5 * s)}"/><path d="M ${f(-44 * s)} ${f(-44 * s)} L ${f(44 * s)} ${f(44 * s)} M ${f(44 * s)} ${f(-44 * s)} L ${f(-44 * s)} ${f(44 * s)}" stroke="#8a5a2a" stroke-width="${f(5 * s)}"/></g>`; }
  return g; }
// the push: an expanding ring of air from a point; k 0..1
export function pushWave(x, y, k, o = {}) { if (k <= 0 || k >= 1) return ''; const R = (o.R || 900) * k;
  return `<g opacity="${f(1 - k)}"><circle cx="${f(x)}" cy="${f(y)}" r="${f(R)}" fill="${VIO}" opacity="0.08"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(R)}" fill="none" stroke="#fff" stroke-width="${f(18 * (1 - k) + 3)}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(R * 0.8)}" fill="none" stroke="${VIO}" stroke-width="8"/>${[...Array(14)].map((_, i) => { const a = i / 14 * Math.PI * 2; return `<line x1="${f(x + Math.cos(a) * R * 0.6)}" y1="${f(y + Math.sin(a) * R * 0.6)}" x2="${f(x + Math.cos(a) * R * 1.05)}" y2="${f(y + Math.sin(a) * R * 1.05)}" stroke="#fff" stroke-width="5" opacity="0.6"/>`; }).join('')}</g>`; }
// the pull: lines converging in; k 0..1
export function pullWave(x, y, k) { if (k <= 0 || k >= 1) return ''; return [...Array(12)].map((_, i) => { const a = i / 12 * Math.PI * 2, r0 = 700 * (1 - k), r1 = r0 + 160; return `<line x1="${f(x + Math.cos(a) * r1)}" y1="${f(y + Math.sin(a) * r1)}" x2="${f(x + Math.cos(a) * r0)}" y2="${f(y + Math.sin(a) * r0)}" stroke="${VIO}" stroke-width="7" opacity="${f(0.8 * (1 - k))}" stroke-linecap="round"/>`; }).join(''); }
// a sandbag
export const sandbag = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><path d="M -60 0 Q -70 -40 -40 -46 L 40 -46 Q 70 -40 60 0 Z" fill="#c8b48a" stroke="#8a7650" stroke-width="5"/><path d="M -30 -46 q 30 10 60 0" stroke="#8a7650" stroke-width="4" fill="none"/></g>`;
// the summoned bird: huge, dark, a long beak, ringed eye; wings flap
export function bigBird(x, y, s = 1, lt = 0, o = {}) { const w = Math.sin(lt * (o.fly ? 5 : 1.2)) * (o.fly ? 40 : 6), fl = o.flip ? -1 : 1;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s * fl)} ${f(s)})"><path d="M -40 -120 Q -260 ${f(-260 - w * 3)} -420 ${f(-180 - w * 4)} Q -260 -120 -80 -60 Z" fill="#2a2440"/><ellipse cx="0" cy="-100" rx="150" ry="90" fill="#3a3456"/><path d="M 40 -120 Q 260 ${f(-280 - w * 3)} 400 ${f(-200 - w * 4)} Q 240 -110 80 -60 Z" fill="#2a2440"/><circle cx="130" cy="-190" r="64" fill="#3a3456"/><path d="M 180 -200 L 330 -170 L 180 -165 Z" fill="${GOLD}"/><circle cx="148" cy="-200" r="16" fill="#c8b4f0"/><circle cx="148" cy="-200" r="9" fill="none" stroke="#3a1a6a" stroke-width="2.5"/><path d="M -30 -20 L -40 40 M 30 -20 L 40 40" stroke="${GOLD}" stroke-width="10"/>${o.bag ? sandbag(0, 70, 1.1) : ''}</g>`; }
// a steel plate with bolts (Asura's patch)
export const plate = (x, y, w, h, o = {}) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(o.rot || 0)})"><rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${f(w)}" height="${f(h)}" rx="8" fill="#7a8090" stroke="#4a4f5c" stroke-width="6"/>${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => `<circle cx="${f(a * (w / 2 - 18))}" cy="${f(b * (h / 2 - 18))}" r="9" fill="${o.loose && a > 0 ? '#3a3d4c' : '#c8ccd6'}"/>`).join('')}${o.spark ? [...Array(6)].map((_, i) => `<line x1="${f(w / 2)}" y1="${f(-h / 2 + 20)}" x2="${f(w / 2 + 30 + rnd(i) * 60)}" y2="${f(-h / 2 - 30 + rnd(i * 3) * 60)}" stroke="${GOLD}" stroke-width="4" opacity="${f(o.spark)}"/>`).join('') : ''}</g>`;
// the black receiver rods (piercings) glowing faintly: a cluster of thin rods at a point
export const rods = (x, y, s = 1, lt = 0, glow = 0.5) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${[-14, 0, 14].map((d, i) => `<rect x="${d - 3}" y="-40" width="6" height="40" rx="3" fill="#15151c"/><circle cx="${d}" cy="-40" r="6" fill="#15151c"/><circle cx="${d}" cy="-40" r="12" fill="${VIO}" opacity="${f(glow * (0.5 + 0.5 * Math.sin(lt * 3 + i)))}"/>`).join('')}</g>`;
// a cable from a to b, sagging, with a faint violet pulse running along
export const cable = (x1, y1, x2, y2, lt = 0, sag = 80) => `<path d="M ${f(x1)} ${f(y1)} Q ${f((x1 + x2) / 2)} ${f(Math.max(y1, y2) + sag)} ${f(x2)} ${f(y2)}" stroke="#15151c" stroke-width="10" fill="none"/><path d="M ${f(x1)} ${f(y1)} Q ${f((x1 + x2) / 2)} ${f(Math.max(y1, y2) + sag)} ${f(x2)} ${f(y2)}" stroke="${VIO}" stroke-width="4" fill="none" stroke-dasharray="30 400" stroke-dashoffset="${f(-lt * 300)}" opacity="0.8"/>`;
// the stone chair with the thin, pale real body is drawn by film.js with a person; this is the chair
export const chair = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-120" y="-360" width="240" height="40" rx="10" fill="#5a5660"/><rect x="-110" y="-330" width="220" height="200" fill="#4a4650"/><rect x="-140" y="-150" width="280" height="50" rx="8" fill="#5a5660"/><rect x="-130" y="-100" width="40" height="100" fill="#3a3640"/><rect x="90" y="-100" width="40" height="100" fill="#3a3640"/></g>`;
// a thermos
export const thermos = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-14" y="-60" width="28" height="60" rx="6" fill="#c8202e"/><rect x="-16" y="-70" width="32" height="14" rx="4" fill="#3a3d4c"/></g>`;

// ---------- the sky by time of day ----------
const SKY = { dawn: ['#3a2a5a', '#f0a070'], day: ['#6aa8e0', '#d8ecf4'], noon: ['#5a9ad8', '#cfe6f2'], dusk: ['#2a1a40', '#e0704a'], night: ['#0a0818', '#2a1a40'], storm: ['#2a3040', '#6a7080'] };
function skyOf(o, lt, FLOOR) { const time = o.time || 'day', [a, b] = SKY[time] || SKY.day, night = time === 'night' || time === 'dusk' || time === 'dawn';
  let g = sky(a, b, -300, FLOOR);
  if (o.moon ?? (time === 'night' || time === 'dawn')) g += moon(o.moonX ?? 1560, o.moonY ?? 170, 70, lt, { col: RED });
  else if (time !== 'storm') g += `<circle cx="${o.sunX ?? 300}" cy="${o.sunY ?? 180}" r="60" fill="#fff4c8" opacity="0.9"/>`;
  if (o.rings) g += rings(o.ringX ?? 960, o.ringY ?? 240, o.ringR ?? 260, lt, o.rings, { op: night ? 0.8 : 0.45 });
  g += clouds(time === 'storm' ? 8 : 4, 0, 320, lt, night ? '#3a2a4a' : time === 'storm' ? '#4a5060' : '#fff', time === 'storm' ? 0.8 : 0.45, 5);
  if (time === 'night') g += [...Array(40)].map((_, i) => `<circle cx="${f(rnd(i) * 2400 - 200)}" cy="${f(rnd(i * 3) * 400)}" r="${f(1 + rnd(i * 7) * 2)}" fill="#fff" opacity="${f(0.4 + 0.4 * Math.sin(lt + i))}"/>`).join('');
  if (time === 'storm') g += [...Array(60)].map((_, i) => { const x = (rnd(i) * 2800 - 400 + lt * 300) % 2800 - 400, y = (rnd(i * 3) * 1200 + lt * 900) % 1200 - 200; return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 10)}" y2="${f(y + 40)}" stroke="#c8d4e8" stroke-width="2" opacity="0.4"/>`; }).join('');
  return { g, night }; }
const hills = (FLOOR, night, tt, o = {}) => { const c1 = night ? '#1a1a2e' : '#5a7a5a', c2 = night ? '#22223a' : '#7a9a6a', c3 = night ? '#2a2a40' : '#8ab07a';
  return `<g transform="translate(${f(-tt * 3)} 0)"><path d="M -900 ${FLOOR - 380} L -500 ${FLOOR - 640} L -200 ${FLOOR - 460} L 200 ${FLOOR - 700} L 600 ${FLOOR - 480} L 900 ${FLOOR - 620} L 1300 ${FLOOR - 420} L 1700 ${FLOOR - 680} L 2100 ${FLOOR - 460} L 2800 ${FLOOR - 600} L 2800 ${FLOOR} L -900 ${FLOOR} Z" fill="${c1}"/></g>`
    + `<g transform="translate(${f(-tt * 6)} 0)"><path d="M -900 ${FLOOR - 220} Q -400 ${FLOOR - 420} 100 ${FLOOR - 260} T 1100 ${FLOOR - 300} T 2100 ${FLOOR - 240} T 2900 ${FLOOR - 300} L 2900 ${FLOOR} L -900 ${FLOOR} Z" fill="${c2}"/></g>`
    + (o.near === false ? '' : `<path d="M -900 ${FLOOR - 60} Q 0 ${FLOOR - 140} 900 ${FLOOR - 70} T 2900 ${FLOOR - 90} L 2900 ${FLOOR} L -900 ${FLOOR} Z" fill="${c3}"/>`); };
const grass = (FLOOR, night, col) => `<rect x="-900" y="${FLOOR}" width="3800" height="700" fill="${col || (night ? '#1e2a24' : '#6a9a5a')}"/><rect x="-900" y="${FLOOR}" width="3800" height="16" fill="${night ? '#2a3a30' : '#8ac07a'}"/>${[...Array(60)].map((_, i) => `<path d="M ${f(-800 + i * 62 + rnd(i) * 30)} ${FLOOR + 30 + rnd(i * 3) * 300} l 6 -18 l 6 18" stroke="${night ? '#2a3a30' : '#4a7a3a'}" stroke-width="4" fill="none"/>`).join('')}`;
// a little town: rows of houses with lit windows (night), the bakery, the school (with a bell), the radio mast
function townRow(x, base, s, night, lt, o = {}) { let g = `<g transform="translate(${f(x)} ${f(base)}) scale(${f(s)})">`;
  const cols = ['#d8b48a', '#c88a6a', '#e0d0b0', '#a8b4c8', '#d8a0a0', '#b8c8a0'];
  for (let i = 0; i < (o.n || 14); i++) { const hx = i * 150 + (rnd(i + 9) * 30), hh = 110 + rnd(i * 3) * 60, w = 120; const on = night && rnd(i * 7 + 2) < 0.8;
    g += `<rect x="${f(hx)}" y="${f(-hh)}" width="${w}" height="${f(hh)}" fill="${cols[i % 6]}"/><path d="M ${f(hx - 12)} ${f(-hh)} L ${f(hx + w / 2)} ${f(-hh - 60)} L ${f(hx + w + 12)} ${f(-hh)} Z" fill="${i % 2 ? '#8a3a2a' : '#5a3a3a'}"/><rect x="${f(hx + 20)}" y="${f(-hh + 30)}" width="30" height="30" fill="${on ? '#ffe8a8' : night ? '#2a2a3a' : '#9fd0f0'}"/><rect x="${f(hx + 70)}" y="${f(-hh + 30)}" width="30" height="30" fill="${on && rnd(i) < 0.6 ? '#ffe8a8' : night ? '#2a2a3a' : '#9fd0f0'}"/>`; }
  return g + '</g>'; }
// ---------- sets ----------
// the valley, wide: hills, the dam across the gap with the reservoir behind it, the town below, the river
// o: time, rings, moon, crack(0..1), plate, water(0..1 reservoir level), breach(0..1 a chunk out), flood(0..1), lights, figures(n on crest)
export function valley(tt, o = {}) { const FLOOR = 900, lt = o.t || 0; const S = skyOf(o, lt, FLOOR), night = S.night;
  let back = S.g + hills(FLOOR - 120, night, tt, { near: false });
  // reservoir and dam (center)
  const dx = 560, dw = 800, top = FLOOR - 520, wl = top + 40 - (o.water ?? 0.6) * 30;
  back += `<path d="M 300 ${f(wl)} L 1620 ${f(wl)} L 1500 ${top - 60} L 420 ${top - 60} Z" fill="${night ? '#1a2a4a' : WATER}" opacity="0.9"/>`;
  back += `<path d="M ${dx} ${top} L ${dx + dw} ${top} L ${dx + dw + 120} ${FLOOR - 120} L ${dx - 120} ${FLOOR - 120} Z" fill="${night ? '#5a5a62' : CON}"/><rect x="${dx - 10}" y="${top - 16}" width="${dw + 20}" height="20" fill="${night ? '#6a6a72' : '#c8c4ba'}"/>${[1, 2, 3, 4, 5].map((i) => `<line x1="${dx - i * 24 + dw * 0}" y1="${top + i * 80}" x2="${dx + dw + i * 24}" y2="${top + i * 80}" stroke="#000" stroke-width="3" opacity="0.12"/>`).join('')}`;
  if (o.crack) back += `<path d="M ${dx + dw * 0.55} ${top + 40} l -14 40 l 18 30 l -20 50 l 14 40 l -10 ${f(60 * o.crack)}" stroke="#15151c" stroke-width="${f(3 + 5 * o.crack)}" fill="none"/>`;
  if (o.plate) back += plate(dx + dw * 0.55, top + 120, 120, 90, { loose: o.plate < 1 });
  if (o.breach) back += `<path d="M ${dx + dw * 0.48} ${top - 4} l 40 ${f(80 * o.breach)} l 60 0 l 30 ${f(-80 * o.breach)} Z" fill="${night ? '#1a2a4a' : WATER}"/>` + `<path d="M ${dx + dw * 0.5} ${top + 70} q 20 200 -40 ${f(350 * o.breach)}" stroke="#8ab8e0" stroke-width="${f(30 * o.breach)}" fill="none" opacity="0.8"/>`;
  // spillway on the right
  back += `<rect x="${dx + dw - 60}" y="${top + 10}" width="70" height="${FLOOR - 130 - top}" fill="${night ? '#3a4a6a' : '#7ab0d8'}" opacity="0.7"/>`;
  if (o.figures) for (let i = 0; i < o.figures; i++) { const fx2 = dx + 80 + i * (dw - 160) / Math.max(1, o.figures - 1); back += `<circle cx="${f(fx2)}" cy="${top - 34}" r="9" fill="#15151c"/><path d="M ${f(fx2 - 9)} ${top - 40} l 9 -12 l 9 12 z" fill="${ORANGE}"/><rect x="${f(fx2 - 8)}" y="${top - 26}" width="16" height="22" rx="4" fill="#15151c"/>`; }
  // valley floor + river + town
  back += hills(FLOOR, night, tt * 0.5).split('</g>').slice(2).join('</g>');
  let mid = `<path d="M ${dx + dw / 2 - 40} ${FLOOR - 120} Q ${dx + dw / 2 - 200} ${FLOOR - 40} ${dx + dw / 2 - 120} ${FLOOR} L ${dx + dw / 2 + 60} ${FLOOR} Q ${dx + dw / 2 - 20} ${FLOOR - 50} ${dx + dw / 2 + 40} ${FLOOR - 120} Z" fill="${night ? '#2a3a5a' : '#6aa0d0'}"/>`;
  mid += townRow(-200, FLOOR - 10, 0.55, night || o.lights, lt, { n: 8 }) + townRow(1300, FLOOR - 10, 0.55, night || o.lights, lt, { n: 8 });
  if (o.flood) mid += `<rect x="-900" y="${f(FLOOR - 100 * o.flood)}" width="3800" height="${f(100 * o.flood + 20)}" fill="#6a8ab0" opacity="0.7"/>`;
  const floor = grass(FLOOR, night);
  return { bg: SKY[o.time || 'day'][0], back, mid, floor, FLOOR, blur: 1.2, reflOp: 0.04, tex: 0.16, vig: 0.55, DAM: [dx, top, dw] };
}
// the hillside / the dawn circle: grass, the dam far behind, the moon and rings big; a good place for the seven figures
export function hillside(tt, o = {}) { const FLOOR = 880, lt = o.t || 0; const S = skyOf({ moon: true, rings: 1, ringY: 260, ringR: 300, ...o, time: o.time || 'dawn' }, lt, FLOOR), night = S.night;
  let back = S.g + hills(FLOOR - 60, night, tt);
  back += `<g transform="translate(${f(1180 - tt * 4)} ${FLOOR - 380}) scale(0.45)"><path d="M 0 0 L 800 0 L 900 420 L -100 420 Z" fill="${night ? '#5a5a62' : CON}"/><path d="M 30 0 L 770 0 L 760 -40 L 40 -40 Z" fill="${night ? '#1a2a4a' : WATER}"/></g>`;
  back += `<g opacity="0.6">${[...Array(6)].map((_, i) => `<rect x="${-300 + i * 420}" y="${FLOOR - 200 - rnd(i) * 80}" width="${f(40 + rnd(i * 3) * 40)}" height="${f(200 + rnd(i * 3) * 80)}" fill="${night ? '#22223a' : '#6a7a6a'}" transform="rotate(${f((rnd(i * 5) - 0.5) * 20)} ${-280 + i * 420} ${FLOOR})"/>`).join('')}</g>`;
  return { bg: SKY[o.time || 'dawn'][0], back, mid: '', floor: grass(FLOOR, night), FLOOR, blur: 1.6, reflOp: 0.04, tex: 0.16, vig: 0.6 };
}
// the field: grass, a fence, the tower of crates (push = how far the Shinra Tensei has sent them), sheep
export function field(tt, o = {}) { const FLOOR = 880, lt = o.t || 0; const S = skyOf({ time: 'day', ...o }, lt, FLOOR), night = S.night;
  let back = S.g + hills(FLOOR - 40, night, tt);
  back += `<g transform="translate(${f(-tt * 8)} 0)">${[...Array(16)].map((_, i) => `<rect x="${-600 + i * 220}" y="${FLOOR - 140}" width="12" height="100" fill="#8a6a4a"/>`).join('')}<rect x="-600" y="${FLOOR - 120}" width="3600" height="10" fill="#8a6a4a"/><rect x="-600" y="${FLOOR - 80}" width="3600" height="10" fill="#8a6a4a"/></g>`;
  let mid = '';
  if (o.crates !== false) { const k = o.push || 0; if (k < 1) mid += crates(o.cx ?? 1300, FLOOR, 5, 1, { push: k }); else mid += [...Array(10)].map((_, i) => { const a = i / 10 * Math.PI * 2; return `<g transform="translate(${f((o.cx ?? 1300) + Math.cos(a) * 900)} ${f(FLOOR + 120 + Math.sin(a) * 120)}) scale(0.5)">${crates(0, 0, 1, 1)}</g>`; }).join(''); }
  (o.sheep ?? [[400, 0], [2000, 1], [-200, 0]]).forEach(([x, fl], i) => { mid += sheep(x + (o.walk ? lt * 40 : 0), FLOOR + 10 + i * 20, 0.9, lt, { flip: !!fl, walk: o.walk, up: o.up }); });
  return { bg: SKY[o.time || 'day'][0], back, mid, floor: grass(FLOOR, night), FLOOR, blur: 1.3, reflOp: 0.04, tex: 0.16, vig: 0.5 };
}
// the town street: the bakery, the school with its bell, the loud radio on a sill, the lowest house at the end
export function town(tt, o = {}) { const FLOOR = 880, lt = o.t || 0; const S = skyOf({ time: 'day', ...o }, lt, FLOOR), night = S.night;
  let back = S.g + `<g transform="translate(${f(-tt * 2)} 0)"><path d="M -900 ${FLOOR - 300} L 300 ${FLOOR - 760} L 900 ${FLOOR - 760} L 2900 ${FLOOR - 300} L 2900 ${FLOOR} L -900 ${FLOOR} Z" fill="${night ? '#1a1a2e' : '#7a8a7a'}"/><path d="M 380 ${FLOOR - 760} L 820 ${FLOOR - 760} L 860 ${FLOOR - 560} L 340 ${FLOOR - 560} Z" fill="${night ? '#5a5a62' : CON}"/></g>`;
  back += townRow(-400, FLOOR - 220, 0.6, night, lt, { n: 18 });
  const sh = (x, w, h, col, sign, extra = '') => `<rect x="${x}" y="${FLOOR - h}" width="${w}" height="${h}" fill="${col}"/><path d="M ${x - 20} ${FLOOR - h} L ${x + w / 2} ${FLOOR - h - 90} L ${x + w + 20} ${FLOOR - h} Z" fill="#6a3a2a"/><rect x="${x + 30}" y="${FLOOR - h + 40}" width="${w - 60}" height="56" rx="6" fill="#15181e"/><text x="${x + w / 2}" y="${FLOOR - h + 80}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#fff">${sign}</text><rect x="${x + 40}" y="${FLOOR - 180}" width="120" height="180" fill="#5a3a2a"/><rect x="${x + 200}" y="${FLOOR - 200}" width="${w - 240}" height="110" fill="${night ? '#ffe8a8' : '#9fd0f0'}"/>${extra}`;
  let mid = `<g transform="translate(${f(-tt * 4)} 0)">` + sh(-300, 420, 360, '#e0c89a', 'BAKERY', `<g transform="translate(-60 ${FLOOR - 140})">${[0, 1, 2].map((i) => `<ellipse cx="${i * 34}" cy="0" rx="18" ry="12" fill="#c88a4a"/>`).join('')}</g>`)
    + sh(260, 560, 420, '#c8d0e0', 'SCHOOL', `<g transform="translate(540 ${FLOOR - 500})"><rect x="-30" y="-60" width="60" height="60" fill="#6a3a2a"/><path d="M -16 -16 q 16 -40 32 0 z" fill="${GOLD}" transform="rotate(${f(Math.sin(lt * 4) * 12)} 0 -30)"/></g>`)
    + sh(960, 380, 330, '#d8a0a0', 'RADIO', `<g transform="translate(1180 ${FLOOR - 200})"><rect x="-50" y="-50" width="100" height="56" rx="10" fill="#3a3d4c"/><circle cx="-18" cy="-22" r="16" fill="#8a8f9c"/><rect x="10" y="-34" width="30" height="8" fill="${GOLD}"/>${[0, 1, 2].map((i) => `<path d="M ${70 + i * 22} -40 q 14 18 0 36" stroke="#fff" stroke-width="4" fill="none" opacity="${f(0.4 + 0.5 * Math.sin(lt * 8 - i))}"/>`).join('')}</g>`)
    + sh(1480, 360, 260, '#b8c8a0', 'NO. 1', o.lowest ? `<rect x="1470" y="${FLOOR - 280}" width="380" height="290" fill="none" stroke="${GOLD}" stroke-width="8" opacity="${f(0.6 + 0.4 * Math.sin(lt * 4))}"/>` : '') + '</g>';
  mid += lampPost(140, FLOOR, 460, 0, night ? 1 : 0) + lampPost(1420, FLOOR, 460, 0, night ? 1 : 0);
  const floor = `<rect x="-900" y="${FLOOR}" width="3800" height="700" fill="${night ? '#2a2a32' : '#8a8a8a'}"/><rect x="-900" y="${FLOOR}" width="3800" height="24" fill="${night ? '#3a3a44' : '#b0b0b0'}"/>${[...Array(14)].map((_, i) => `<rect x="${-800 + i * 300}" y="${FLOOR + 130}" width="150" height="10" fill="#fff" opacity="0.5"/>`).join('')}`;
  return { bg: SKY[o.time || 'day'][0], back, mid, floor, FLOOR, blur: 1.4, reflOp: 0.05, tex: 0.16, vig: 0.5 };
}
// the dam wall, close: the face of the wall, the walkway on top, Ruth's inspection hut, the hairline crack; o.crack, o.plate,
// o.bags (n sandbags), o.water (spray over the top 0..1), o.chunk (a piece falling 0..1)
export function damWall(tt, o = {}) { const FLOOR = 880, lt = o.t || 0; const S = skyOf({ time: 'day', ...o }, lt, FLOOR), night = S.night;
  const WY = 140; let back = S.g;
  back += `<rect x="-900" y="${WY}" width="3800" height="${FLOOR - WY}" fill="${night ? '#55555e' : CON}"/>${[...Array(9)].map((_, i) => `<line x1="-900" y1="${WY + 80 + i * 80}" x2="2900" y2="${WY + 80 + i * 80}" stroke="#000" stroke-width="3" opacity="0.10"/>`).join('')}${[...Array(10)].map((_, i) => `<line x1="${-600 + i * 380}" y1="${WY}" x2="${-600 + i * 380}" y2="${FLOOR}" stroke="#000" stroke-width="3" opacity="0.08"/>`).join('')}`;
  back += [...Array(18)].map((_, i) => `<ellipse cx="${f(-700 + rnd(i) * 3400)}" cy="${f(WY + 60 + rnd(i * 3) * (FLOOR - WY - 100))}" rx="${f(20 + rnd(i * 5) * 50)}" ry="${f(8 + rnd(i * 7) * 14)}" fill="#000" opacity="0.06"/>`).join('');
  back += `<rect x="-900" y="${WY - 40}" width="3800" height="44" fill="${night ? '#6a6a72' : '#c8c4ba'}"/>${[...Array(40)].map((_, i) => `<rect x="${-880 + i * 96}" y="${WY - 90}" width="8" height="50" fill="#6a6a72"/>`).join('')}<rect x="-900" y="${WY - 94}" width="3800" height="8" fill="#6a6a72"/>`;
  const cx = o.crackX ?? 1100, cr = o.crack ?? 0.4; let mid = '';
  if (cr) mid += `<path d="M ${cx} ${WY + 10} l -20 60 l 26 50 l -30 80 l 20 70 l -16 ${f(120 * cr)} l 20 ${f(90 * cr)}" stroke="#15151c" stroke-width="${f(3 + 9 * cr)}" fill="none" stroke-linejoin="round"/>` + (cr > 0.6 ? `<path d="M ${cx - 14} ${WY + 230} q -20 40 -10 ${f(120 * (cr - 0.5))}" stroke="#8ab8e0" stroke-width="${f(10 * cr)}" fill="none" opacity="${f(0.6 + 0.3 * Math.sin(lt * 9))}"/>` : '');
  if (o.plate) mid += plate(cx - 4, WY + 220, 200, 260, { loose: o.plate === 'loose', spark: o.spark });
  for (let i = 0; i < (o.bags || 0); i++) mid += sandbag(cx - 520 + (i % 6) * 120, FLOOR - Math.floor(i / 6) * 44, 1);
  if (o.water) mid += [...Array(10)].map((_, i) => `<path d="M ${-600 + i * 380 + Math.sin(lt * 3 + i) * 20} ${WY - 40} q 40 ${f(-40 * o.water)} 90 ${f(30 * o.water)}" stroke="#a8d0f0" stroke-width="${f(16 * o.water)}" fill="none" opacity="0.8"/>`).join('');
  if (o.chunk) { const q = o.chunk; mid += `<g transform="translate(${cx + 120} ${f(WY + 120 + q * q * 700)}) rotate(${f(q * 80)})"><path d="M -80 -60 L 90 -50 L 70 70 L -60 80 Z" fill="${night ? '#55555e' : CON}" stroke="#3a3a42" stroke-width="6"/></g><path d="M ${cx + 40} ${WY + 60} L ${cx + 210} ${WY + 70} L ${cx + 190} ${WY + 190} L ${cx + 60} ${WY + 200} Z" fill="#1a2a4a"/><path d="M ${cx + 120} ${WY + 130} q 60 ${f(200 * q)} 20 ${f(700 * q)}" stroke="#8ab8e0" stroke-width="${f(60 * q)}" fill="none" opacity="0.8"/>`; }
  if (o.hut) mid += `<g transform="translate(${o.hut} ${FLOOR})"><rect x="-140" y="-240" width="280" height="240" fill="#e0c060"/><path d="M -160 -240 L 0 -320 L 160 -240 Z" fill="#8a3a2a"/><rect x="-100" y="-190" width="90" height="70" fill="${night ? '#ffe8a8' : '#9fd0f0'}"/><rect x="30" y="-170" width="70" height="170" fill="#6a4a2a"/><text x="0" y="-262" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="24" fill="#fff">INSPECTION</text></g>`;
  const floor = `<rect x="-900" y="${FLOOR}" width="3800" height="700" fill="${night ? '#2a2a30' : '#7a766c'}"/><rect x="-900" y="${FLOOR}" width="3800" height="18" fill="${night ? '#3a3a40' : '#9a968c'}"/>`;
  return { bg: SKY[o.time || 'day'][0], back, mid, floor, FLOOR, blur: 0.8, reflOp: 0.05, tex: 0.2, vig: 0.55, CX: cx, WY };
}
// the spillway / the river below the dam: the channel, water rushing, debris (logs) to push away; o.rage 0..1, o.mud
export function river(tt, o = {}) { const FLOOR = 880, lt = o.t || 0; const S = skyOf({ time: 'day', ...o }, lt, FLOOR), night = S.night;
  let back = S.g + hills(FLOOR - 200, night, tt, { near: false });
  back += `<path d="M 200 ${FLOOR - 640} L 1720 ${FLOOR - 640} L 1820 ${FLOOR - 200} L 100 ${FLOOR - 200} Z" fill="${night ? '#55555e' : CON}"/><rect x="760" y="${FLOOR - 640}" width="400" height="440" fill="${night ? '#3a4a6a' : '#7ab0d8'}"/>${[...Array(8)].map((_, i) => `<path d="M ${780 + i * 50} ${FLOOR - 640} q 10 ${200} -6 440" stroke="#e8f4ff" stroke-width="6" fill="none" opacity="${f(0.4 + 0.3 * Math.sin(lt * 6 + i))}" stroke-dasharray="40 30" stroke-dashoffset="${f(-lt * 400)}"/>`).join('')}`;
  const rg = o.rage ?? 0.4, wc = night ? '#2a4060' : '#4a8ac0';
  let mid = `<path d="M -900 ${FLOOR - 200} L 2900 ${FLOOR - 200} L 2900 ${FLOOR + 40} L -900 ${FLOOR + 40} Z" fill="${wc}"/>` + [...Array(24)].map((_, i) => { const x = ((rnd(i) * 3800 + lt * (200 + rg * 500)) % 3800) - 900, y = FLOOR - 180 + rnd(i * 3) * 200; return `<path d="M ${f(x)} ${f(y)} q 30 ${f(-14 - rg * 20)} 60 0" stroke="#e8f4ff" stroke-width="5" fill="none" opacity="0.7"/>`; }).join('');
  (o.logs || []).forEach(([x, y, a], i) => { mid += `<g transform="translate(${f(x)} ${f(y + Math.sin(lt * 3 + i) * 8)}) rotate(${f(a)})"><rect x="-120" y="-18" width="240" height="36" rx="18" fill="#7a5a3a"/><circle cx="120" cy="0" r="18" fill="#c8a878"/></g>`; });
  if (o.mud) mid += `<path d="M 1300 ${FLOOR - 400} Q 1500 ${FLOOR - 200} 1400 ${FLOOR + 40} L 2200 ${FLOOR + 40} Q 1900 ${FLOOR - 300} 1700 ${FLOOR - 500} Z" fill="#6a4a2a" opacity="${f(o.mud)}"/>`;
  const floor = `<rect x="-900" y="${FLOOR + 40}" width="3800" height="700" fill="${night ? '#2a2a30' : '#6a6a5a'}"/>`;
  return { bg: SKY[o.time || 'day'][0], back, mid, floor, FLOOR: FLOOR + 40, blur: 1.2, reflOp: 0.06, tex: 0.18, vig: 0.55 };
}
// the stone room at the top of the valley: rough stone walls, one tall window onto the valley, the chair, cables on the floor
export function stoneRoom(tt, o = {}) { const FLOOR = 880, lt = o.t || 0; const time = o.time || 'day', night = time === 'night' || time === 'dusk';
  let back = `<rect x="-900" y="-300" width="3800" height="${FLOOR + 300}" fill="${night ? '#2a2630' : '#5a5660'}"/>`;
  for (let r = 0; r < 14; r++) for (let c = 0; c < 22; c++) { const x = -900 + c * 180 + (r % 2) * 90, y = -300 + r * 90; back += `<rect x="${x + 4}" y="${y + 4}" width="172" height="82" rx="10" fill="${night ? '#332f3a' : '#6a6670'}" opacity="${f(0.5 + rnd(r * 31 + c) * 0.5)}"/>`; }
  const wx = 1250, wy = 120, ww = 360, wh = 560, sk = SKY[time] || SKY.day;
  back += `<rect x="${wx - 20}" y="${wy - 20}" width="${ww + 40}" height="${wh + 40}" fill="#3a3640"/><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${sk[1]}"/><rect x="${wx}" y="${wy}" width="${ww}" height="${wh * 0.5}" fill="${sk[0]}" opacity="0.7"/>`;
  back += `<path d="M ${wx} ${wy + wh * 0.62} L ${wx + 80} ${wy + wh * 0.5} L ${wx + 180} ${wy + wh * 0.58} L ${wx + ww} ${wy + wh * 0.46} L ${wx + ww} ${wy + wh} L ${wx} ${wy + wh} Z" fill="${night ? '#1a1a2e' : '#5a7a5a'}"/><path d="M ${wx + 100} ${wy + wh * 0.7} L ${wx + 260} ${wy + wh * 0.7} L ${wx + 280} ${wy + wh * 0.84} L ${wx + 80} ${wy + wh * 0.84} Z" fill="${night ? '#5a5a62' : CON}"/>${night ? [...Array(10)].map((_, i) => `<circle cx="${wx + 40 + rnd(i) * 280}" cy="${wy + wh * 0.9 + rnd(i * 3) * 40}" r="4" fill="#ffe8a8"/>`).join('') : ''}${o.moon ? moon(wx + 260, wy + 90, 34, lt, { col: RED }) : ''}<rect x="${wx + ww / 2 - 6}" y="${wy}" width="12" height="${wh}" fill="#3a3640"/>`;
  back += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${night ? '#000' : '#fff'}" opacity="0.08"/>`;
  let mid = chair(o.chairX ?? 760, FLOOR, 1.1);
  if (o.cables !== false) mid += cable(860, FLOOR - 280, 2400, FLOOR + 40, lt, 120) + cable(660, FLOOR - 300, -800, FLOOR + 30, lt + 1, 140) + cable(760, FLOOR - 360, 1250, FLOOR - 40, lt + 2, 160);
  mid += `<g transform="translate(300 ${FLOOR})"><rect x="-30" y="-200" width="60" height="200" fill="#3a3640"/><path d="M -10 -200 q 10 -40 20 0" fill="${GOLD}" opacity="${f(0.7 + 0.3 * Math.sin(lt * 9))}"/></g>`;
  const floor = `<rect x="-900" y="${FLOOR}" width="3800" height="700" fill="${night ? '#24202a' : '#4a4650'}"/><rect x="-900" y="${FLOOR}" width="3800" height="16" fill="#5a5660"/>`;
  return { bg: '#2a2630', back, mid, floor, FLOOR, blur: 0.8, reflOp: 0.06, tex: 0.22, vig: 0.7, WIN: [wx, wy, ww, wh] };
}
