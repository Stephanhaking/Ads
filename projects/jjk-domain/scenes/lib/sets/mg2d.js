// Flat 2D sets and creatures for the Megumi / Ten Shadows video (our own designs; nothing traced from the manga/anime):
// a living shadow pool with eyes, two shadow dogs (one white, one black), a person-sized toad, a white serpent with black
// bands, an elephant rising out of a shadow, an eight-bladed wheel turning in the dark, a moon, and new sets: an office,
// an underground car park, a building hallway, a stairwell, a football pitch at night, a forest at night with torches,
// and a collapsed multi-storey car park at night.
import { glow } from '../flat2d.js';
const f = (n) => n.toFixed(1);
export const OL = '#b9dcff', INK = '#07070f', EYE = '#6fd8ff';
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- creatures ----------
// the living shadow on the floor: an ink pool (w wide) with soft tendrils; eyes > 0 shows two glowing eyes
export function pool(x, y, w, tt, o = {}) {
  const op = o.op ?? 0.92; let g = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w / 2)}" ry="${f(w * 0.11)}" fill="${INK}" opacity="${f(op)}"/>`;
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2 + tt * 0.4, r = w * (0.46 + 0.06 * Math.sin(tt * 2 + i)); g += `<ellipse cx="${f(x + Math.cos(a) * r)}" cy="${f(y + Math.sin(a) * r * 0.22)}" rx="${f(w * 0.09)}" ry="${f(w * 0.03)}" fill="${INK}" opacity="${f(op * 0.8)}"/>`; }
  if (o.eyes) { const e = o.eyes, b = Math.abs(Math.sin(tt * 0.9)) > 0.97 ? 0.15 : 1; for (const s of [-1, 1]) g += `<ellipse cx="${f(x + s * w * 0.08)}" cy="${f(y - 2)}" rx="${f(w * 0.03)}" ry="${f(w * 0.012 * b)}" fill="${EYE}" opacity="${f(e)}"/>`; }
  return g;
}
// a shadow dog, side view facing right (flip faces left); col 'white' | 'black'; pose 'sit' | 'run' | 'stand' | 'sniff'
export function dog(x, y, s, col, tt, o = {}) {
  const W = col === 'white', body = W ? '#eef2f8' : '#14141f', shade = W ? '#b8c2d4' : '#2a2a3c', rim = W ? '#ffffff' : '#6fd8ff';
  const pose = o.pose || 'stand', run = pose === 'run', ph = tt * 12 + (o.seed || 0), sit = pose === 'sit', sn = pose === 'sniff';
  const leg = (lx, a, len = 70) => `<path d="M ${lx} -${sit ? 40 : 60} l ${f(Math.sin(a) * 22)} ${len}" stroke="${body}" stroke-width="20" stroke-linecap="round"/>`;
  let g = `<ellipse cx="0" cy="4" rx="90" ry="12" fill="#000" opacity="0.25"/>`;
  g += `<path d="M -95 -${sit ? 70 : 92} q -40 ${run ? -10 + 10 * Math.sin(ph) : -30} -70 ${run ? -20 : -50}" stroke="${shade}" stroke-width="16" stroke-linecap="round" fill="none"/>`; // tail
  if (sit) g += leg(-60, 0.9, 50) + leg(-30, 0.9, 50) + leg(50, 0, 80) + leg(70, 0, 80);
  else g += leg(-70, run ? Math.sin(ph) * 1.2 : 0, 68) + leg(-40, run ? -Math.sin(ph) * 1.2 : 0, 68) + leg(45, run ? -Math.sin(ph + 1) * 1.2 : 0, 68) + leg(72, run ? Math.sin(ph + 1) * 1.2 : 0, 68);
  g += sit ? `<path d="M -100 -60 Q -90 -130 10 -140 Q 80 -150 95 -110 L 80 -40 Q 0 -30 -100 -60 Z" fill="${body}" stroke="${rim}" stroke-width="3"/>` : `<ellipse cx="0" cy="-${run ? 96 + 6 * Math.sin(ph * 2) : 92}" rx="105" ry="44" fill="${body}" stroke="${rim}" stroke-width="3"/>`;
  const hy = sit ? -175 : sn ? -90 : -140, hx = sn ? 120 : 105; // head
  g += `<path d="M ${hx - 40} ${hy + 40} Q ${hx - 50} ${hy - 20} ${hx - 6} ${hy - 30} Q ${hx + 30} ${hy - 36} ${hx + 70} ${hy + 6} Q ${hx + 74} ${hy + 22} ${hx + 50} ${hy + 30} Q ${hx + 10} ${hy + 46} ${hx - 40} ${hy + 40} Z" fill="${body}" stroke="${rim}" stroke-width="3"/>`;
  g += `<path d="M ${hx - 30} ${hy - 18} L ${hx - 24} ${hy - 70} L ${hx + 2} ${hy - 26} Z" fill="${body}" stroke="${rim}" stroke-width="3"/><path d="M ${hx - 2} ${hy - 26} L ${hx + 12} ${hy - 72} L ${hx + 26} ${hy - 22} Z" fill="${shade}" stroke="${rim}" stroke-width="3"/>`;
  g += `<ellipse cx="${hx + 22}" cy="${hy - 4}" rx="9" ry="5" fill="${EYE}"/><circle cx="${hx + 70}" cy="${hy + 8}" r="7" fill="#1c1e26"/>`;
  // ink wisps rising off the back (they are made of shadow)
  for (let i = 0; i < 4; i++) { const k = (tt * 0.8 + i / 4) % 1; g += `<circle cx="${f(-60 + i * 40 + Math.sin(tt * 3 + i) * 8)}" cy="${f(-130 - k * 70)}" r="${f(9 * (1 - k))}" fill="${W ? '#cfd8ea' : INK}" opacity="${f(0.6 * (1 - k))}"/>`; }
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(o.flip ? -s : s)} ${f(s)})">${g}</g>`;
}
// a person-sized toad (front-ish 3/4); tongue 0..1 = how far the tongue is out (towards +x)
export function toad(x, y, s, tt, o = {}) {
  const b = Math.sin(tt * 3) * 4, tg = o.tongue || 0;
  let g = `<ellipse cx="0" cy="6" rx="150" ry="18" fill="#000" opacity="0.25"/>`;
  g += `<path d="M -150 0 Q -170 -60 -120 -70 L -90 0 Z" fill="#3c6a5a"/><path d="M 150 0 Q 170 -60 120 -70 L 90 0 Z" fill="#3c6a5a"/>`;
  g += `<path d="M -140 -10 Q -160 -170 -40 -${f(200 + b)} Q 0 -${f(206 + b)} 40 -${f(200 + b)} Q 160 -170 140 -10 Q 0 20 -140 -10 Z" fill="#4f8a6e" stroke="${OL}" stroke-width="4"/>`;
  g += `<path d="M -90 -20 Q 0 -110 90 -20 Q 0 4 -90 -20 Z" fill="#d8e4b8"/>`;
  for (let i = 0; i < 6; i++) g += `<circle cx="${f(-100 + rnd(i) * 200)}" cy="${f(-120 - rnd(i + 9) * 60)}" r="${f(8 + rnd(i + 3) * 10)}" fill="#3c6a5a"/>`;
  for (const sd of [-1, 1]) g += `<circle cx="${sd * 62}" cy="-${f(206 + b)}" r="34" fill="#4f8a6e" stroke="${OL}" stroke-width="4"/><circle cx="${sd * 62}" cy="-${f(208 + b)}" r="20" fill="#ffd23f"/><rect x="${sd * 62 - 16}" y="-${f(212 + b)}" width="32" height="8" rx="4" fill="#15181e"/>`;
  g += `<path d="M -70 -${f(150 + b)} Q 0 -${f(128 + b)} 70 -${f(150 + b)}" stroke="#2a4a3c" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if (tg > 0) g += `<path d="M 40 -${f(144 + b)} Q ${f(200 * tg)} -${f(220 * tg + 60)} ${f(520 * tg)} -${f(120 + 30 * tg)}" stroke="#e86a7a" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="${f(520 * tg)}" cy="-${f(120 + 30 * tg)}" r="22" fill="#e86a7a"/>`;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(o.flip ? -s : s)} ${f(s)})">${g}</g>`;
}
// the white serpent with black bands along a path of points [[x,y]...]; head at the last point, facing the travel direction
export function serpent(pts, w, tt, o = {}) {
  const path = pts.reduce((s, p, i) => s + (i ? ` L ${f(p[0] + Math.sin(tt * 2 + i * 0.7) * 5)} ${f(p[1] + Math.cos(tt * 2 + i * 0.7) * 5)}` : `M ${f(p[0])} ${f(p[1])}`), '');
  const [hx, hy] = pts[pts.length - 1], [px, py] = pts[pts.length - 2], a = Math.atan2(hy - py, hx - px) * 180 / Math.PI;
  let g = `<path d="${path}" stroke="${OL}" stroke-width="${w + 8}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${path}" stroke="#f2f4f8" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += `<path d="${path}" stroke="#15181e" stroke-width="${f(w * 0.92)}" fill="none" stroke-dasharray="${f(w * 0.35)} ${f(w * 1.6)}" stroke-dashoffset="${f(-tt * 30)}"/>`;
  g += `<path d="${path}" stroke="#d8dee8" stroke-width="${f(w * 0.25)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" transform="translate(0 ${f(w * 0.2)})"/>`;
  g += `<g transform="translate(${f(hx)} ${f(hy)}) rotate(${f(a)})"><path d="M -${f(w * 0.4)} -${f(w * 0.62)} Q ${f(w * 1.3)} -${f(w * 0.7)} ${f(w * 1.4)} 0 Q ${f(w * 1.3)} ${f(w * 0.7)} -${f(w * 0.4)} ${f(w * 0.62)} Z" fill="#f2f4f8" stroke="${OL}" stroke-width="4"/>`;
  g += `<ellipse cx="${f(w * 0.7)}" cy="-${f(w * 0.3)}" rx="${f(w * 0.12)}" ry="${f(w * 0.07)}" fill="#c8352e"/><path d="M ${f(w * 0.1)} -${f(w * 0.4)} L ${f(w * 0.5)} -${f(w * 0.5)}" stroke="#15181e" stroke-width="6"/>`;
  if (o.tongue) g += `<path d="M ${f(w * 1.4)} 0 l ${f(w * 0.5)} 0 l 14 -12 M ${f(w * 1.9)} 0 l 14 12" stroke="#c8352e" stroke-width="5" fill="none"/>`;
  g += '</g>'; return g;
}
// an elephant (side view, facing right) rising out of a shadow pool: k = 0 (only the back shows) .. 1 (standing)
export function elephant(x, y, s, tt, k = 1, o = {}) {
  const r = 1 - Math.min(1, Math.max(0, k)), dy = r * 420, sw = Math.sin(tt * 1.4) * 8;
  let g = `<g transform="translate(0 ${f(dy)})">`;
  g += `<rect x="-200" y="-200" width="70" height="200" rx="26" fill="#4a5064"/><rect x="-110" y="-200" width="70" height="200" rx="26" fill="#565c72"/><rect x="90" y="-200" width="70" height="200" rx="26" fill="#4a5064"/><rect x="170" y="-200" width="70" height="200" rx="26" fill="#565c72"/>`;
  g += `<path d="M -250 -170 Q -270 -380 -40 -400 Q 200 -410 260 -260 Q 270 -180 230 -160 L -230 -150 Z" fill="#646a82" stroke="${OL}" stroke-width="5"/>`;
  g += `<path d="M -250 -260 q -40 30 -30 90" stroke="#4a5064" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M 200 -360 Q 330 -400 360 -300 Q 380 -230 340 -200 Q 330 -120 ${f(350 + sw)} -40 Q ${f(360 + sw)} -10 ${f(330 + sw)} -14" stroke="#646a82" stroke-width="58" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M 160 -380 Q 90 -380 80 -280 Q 90 -200 170 -210 Q 210 -250 200 -330 Z" fill="#565c72" stroke="${OL}" stroke-width="4"/>`;
  g += `<path d="M 300 -230 Q 360 -200 410 -230" stroke="#f4f1ea" stroke-width="18" fill="none" stroke-linecap="round"/><circle cx="305" cy="-305" r="10" fill="${EYE}"/>`;
  g += `</g>`;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><clipPath id="elc${Math.round(x)}"><rect x="-600" y="-900" width="1400" height="${f(910)}"/></clipPath><g clip-path="url(#elc${Math.round(x)})">${g}</g></g>` + pool(x, y + 4, 760 * s * (0.6 + 0.4 * r + 0.2), tt, { op: 0.9 });
}
// the eight-bladed wheel turning slowly inside a shadow; op = visibility, rot in degrees
export function wheel(x, y, R, rot, op = 1) {
  let g = `<circle r="${f(R * 0.32)}" fill="none" stroke="#e0b44a" stroke-width="${f(R * 0.07)}"/><circle r="${f(R * 0.1)}" fill="#e0b44a"/>`;
  for (let i = 0; i < 8; i++) { const a = i * 45; g += `<g transform="rotate(${a})"><rect x="${f(-R * 0.025)}" y="${f(-R)}" width="${f(R * 0.05)}" height="${f(R * 0.68)}" fill="#e0b44a"/><path d="M 0 ${f(-R * 1.08)} l ${f(R * 0.08)} ${f(R * 0.14)} l ${f(-R * 0.16)} 0 Z" fill="#f4d27a"/><circle cy="${f(-R * 0.66)}" r="${f(R * 0.05)}" fill="#b8892a"/></g>`; }
  return `<defs>${glow('whg', '#e0b44a', 0.45)}</defs><g opacity="${f(op)}"><circle cx="${f(x)}" cy="${f(y)}" r="${f(R * 1.5)}" fill="url(#whg)"/><g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">${g}</g></g>`;
}
export const moon = (x, y, r, col = '#f4f1dc') => `<defs>${glow('mng', '#cfe4ff', 0.5)}</defs><circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#mng)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.18}" fill="#000" opacity="0.06"/><circle cx="${x + r * 0.35}" cy="${y + r * 0.25}" r="${r * 0.12}" fill="#000" opacity="0.06"/>`;
const stars = (n, x0, x1, y0, y1, seed = 1) => [...Array(n)].map((_, i) => `<circle cx="${f(x0 + rnd(i + seed) * (x1 - x0))}" cy="${f(y0 + rnd(i * 3 + seed) * (y1 - y0))}" r="${f(1.5 + rnd(i * 7) * 2)}" fill="#fff" opacity="${f(0.4 + rnd(i * 5) * 0.5)}"/>`).join('');

// ---------- sets ----------
// office at lunch: desks with screens, a printer, a small kitchen corner with a fridge
export function office(tt, o = {}) {
  const FLOOR = 840; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#dfe6ee"/>`;
  for (let i = 0; i < 4; i++) back += `<rect x="${120 + i * 460}" y="140" width="360" height="300" rx="6" fill="#bfe4f6"/><rect x="${120 + i * 460}" y="290" width="360" height="8" fill="#e8eef4"/>`;
  back += `<rect x="-600" y="560" width="3120" height="12" fill="#c8d0da"/>`;
  let mid = '';
  for (let i = 0; i < 3; i++) { const x = 160 + i * 420; mid += `<rect x="${x}" y="${FLOOR - 200}" width="320" height="18" rx="6" fill="#f4f1ea"/><rect x="${x + 20}" y="${FLOOR - 182}" width="14" height="182" fill="#9aa3ad"/><rect x="${x + 286}" y="${FLOOR - 182}" width="14" height="182" fill="#9aa3ad"/><rect x="${x + 90}" y="${FLOOR - 330}" width="150" height="110" rx="8" fill="#2a2d3a"/><rect x="${x + 100}" y="${FLOOR - 320}" width="130" height="86" fill="${['#3f8fbf', '#4fd06a', '#e0b44a'][i]}"/><rect x="${x + 155}" y="${FLOOR - 220}" width="20" height="22" fill="#2a2d3a"/>`; }
  mid += `<rect x="1430" y="${FLOOR - 230}" width="190" height="230" rx="10" fill="#e8eef4" stroke="#9aa3ad" stroke-width="4"/><rect x="1450" y="${FLOOR - 250}" width="150" height="30" rx="6" fill="#c8d0da"/><rect x="1460" y="${FLOOR - 120}" width="130" height="10" fill="#9aa3ad"/><text x="1525" y="${FLOOR - 160}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="22" fill="#5a6070">PRINTER</text>`;
  mid += `<rect x="1700" y="${FLOOR - 380}" width="200" height="380" rx="12" fill="#f4f6f8" stroke="#9aa3ad" stroke-width="4"/><rect x="1700" y="${FLOOR - 250}" width="200" height="6" fill="#9aa3ad"/><rect x="1715" y="${FLOOR - 340}" width="10" height="60" rx="4" fill="#9aa3ad"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#8a96a8"/>`;
  return { bg: '#dfe6ee', back, mid, floor, FLOOR, blur: 3 };
}
// underground car park: low ceiling, concrete pillars, strip lights, painted bay lines
export function garage(tt, o = {}) {
  const FLOOR = 850; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#5a6070"/><rect x="-600" y="-300" width="3120" height="420" fill="#454a58"/>`;
  for (let i = 0; i < 6; i++) { const x = -200 + i * 420; back += `<rect x="${x}" y="120" width="120" height="${FLOOR - 120}" fill="#6a7080"/><rect x="${x}" y="560" width="120" height="40" fill="#e0b44a"/><rect x="${x}" y="600" width="120" height="40" fill="#15181e"/>`; }
  for (let i = 0; i < 5; i++) back += `<rect x="${i * 440}" y="100" width="220" height="14" rx="6" fill="#f4f6e8" opacity="${o.dim ? 0.5 : 0.95}"/>`;
  back += `<text x="1580" y="300" font-family="Inter" font-weight="900" font-size="72" fill="#e0b44a" opacity="0.8">-2</text>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#7a808e"/>` + [...Array(8)].map((_, i) => `<path d="M ${-300 + i * 340} ${FLOOR + 230} L ${-150 + i * 340} ${FLOOR}" stroke="#f4f1ea" stroke-width="8" opacity="0.6"/>`).join('');
  return { bg: '#454a58', back, mid: '', floor, FLOOR, blur: 4, vig: 0.65 };
}
// a building hallway: doors with numbers, a stair landing on the right, a flickering ceiling light
export function hallway(tt, o = {}) {
  const FLOOR = 840, fl = Math.sin(tt * 23) > 0.92 ? 0.55 : 1; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#c8b89a"/><rect x="-600" y="600" width="3120" height="${FLOOR - 600}" fill="#8a6a4a"/>`;
  for (let i = 0; i < 4; i++) { const x = 60 + i * 420; back += `<rect x="${x}" y="${FLOOR - 400}" width="200" height="400" rx="6" fill="${i === 2 ? '#3f6db3' : '#6a4a34'}"/><circle cx="${x + 170}" cy="${FLOOR - 200}" r="10" fill="#e0b44a"/><text x="${x + 100}" y="${FLOOR - 340}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="30" fill="#f4f1ea">${['4A', '4B', '4C', '4D'][i]}</text>`; }
  back += `<rect x="1760" y="200" width="400" height="${FLOOR - 200}" fill="#9a8a6a"/>` + [...Array(6)].map((_, i) => `<rect x="${1760 + i * 60}" y="${FLOOR - 60 - i * 70}" width="400" height="14" fill="#6a5a44"/>`).join('');
  back += `<rect x="600" y="80" width="300" height="20" rx="8" fill="#fff6d8" opacity="${f(fl)}"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#6a5040"/>` + [...Array(14)].map((_, i) => `<rect x="${-600 + i * 260}" y="${FLOOR}" width="4" height="600" fill="#5a4234"/>`).join('');
  return { bg: '#c8b89a', back, mid: '', floor, FLOOR, blur: 3, vig: 0.55 + (1 - fl) * 0.2 };
}
// a stairwell seen from the side: zig-zag flights, a railing, a window slit at night
export function stairwell(tt, o = {}) {
  const FLOOR = 860; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#7a8494"/>`;
  back += `<rect x="1500" y="120" width="120" height="360" rx="6" fill="#141a40"/>${moon(1560, 220, 26)}`;
  let mid = '';
  for (let i = 0; i < 9; i++) mid += `<rect x="${200 + i * 110}" y="${FLOOR - i * 50}" width="110" height="${i * 50 + 10}" fill="#9aa3ad"/><rect x="${200 + i * 110}" y="${FLOOR - i * 50}" width="110" height="8" fill="#c8d0da"/>`;
  mid += `<path d="M 200 ${FLOOR - 140} L ${200 + 9 * 110} ${FLOOR - 140 - 9 * 50}" stroke="#e0b44a" stroke-width="10"/>`;
  for (let i = 0; i < 9; i++) mid += `<rect x="${236 + i * 110}" y="${FLOOR - 140 - i * 50 - 20}" width="6" height="${140 - 0}" fill="#e0b44a" opacity="0.8"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#5a6070"/>`;
  return { bg: '#7a8494', back, mid, floor, FLOOR, blur: 3, vig: 0.6 };
}
// a football pitch at night under floodlights (half lit); dark: 0..1 how much of the grass the shadow covers (from cx)
export function pitch(tt, o = {}) {
  const FLOOR = 760, dk = o.dark || 0, cx = o.cx ?? 960;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#0c1430"/>${stars(40, -400, 2300, -200, 400, 7)}${moon(1500, 160, 40)}`;
  back += `<rect x="-600" y="${FLOOR - 140}" width="3120" height="140" fill="#14204a"/>`;
  for (const lx of [100, 1800]) back += `<rect x="${lx}" y="60" width="16" height="${FLOOR - 60}" fill="#2a2d3a"/><rect x="${lx - 50}" y="40" width="116" height="50" rx="6" fill="#f4f6e8"/><defs>${glow('fl' + lx, '#f4f6e8', 0.5)}</defs><ellipse cx="${lx + 8}" cy="65" rx="160" ry="120" fill="url(#fl${lx})"/>`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="700" fill="#2f7a4a"/>` + [...Array(10)].map((_, i) => `<rect x="${-600 + i * 320}" y="${FLOOR}" width="160" height="700" fill="#2a6a40"/>`).join('');
  floor += `<path d="M -600 ${FLOOR + 40} L 2520 ${FLOOR + 40}" stroke="#e8f4e8" stroke-width="8" opacity="0.7"/><ellipse cx="960" cy="${FLOOR + 160}" rx="420" ry="80" fill="none" stroke="#e8f4e8" stroke-width="8" opacity="0.7"/><path d="M 960 ${FLOOR + 40} L 960 ${FLOOR + 700}" stroke="#e8f4e8" stroke-width="8" opacity="0.7"/>`;
  floor += `<rect x="1950" y="${FLOOR - 200}" width="360" height="200" fill="none" stroke="#f4f6f8" stroke-width="12"/>`;
  if (dk > 0) floor += `<ellipse cx="${cx}" cy="${FLOOR + 120}" rx="${f(dk * 1700)}" ry="${f(dk * 300)}" fill="${INK}" opacity="0.88"/>` + [...Array(10)].map((_, i) => `<ellipse cx="${f(cx + Math.cos(i + tt) * dk * 1500)}" cy="${f(FLOOR + 120 + Math.sin(i * 2 + tt) * dk * 220)}" rx="${f(dk * 200)}" ry="${f(dk * 40)}" fill="${INK}" opacity="0.7"/>`).join('');
  return { bg: '#0c1430', back, mid: '', floor, FLOOR, blur: 4, vig: 0.6, reflect: false };
}
// a forest edge at night: dark trunks, a search line of torches, a fallen trunk on the right
export function forest(tt, o = {}) {
  const FLOOR = 820; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#0e1a24"/>${stars(30, -400, 2300, -200, 300, 3)}${moon(400, 140, 34)}`;
  for (let i = 0; i < 16; i++) { const x = -400 + i * 190 + rnd(i) * 80, w = 40 + rnd(i + 4) * 50; back += `<rect x="${f(x)}" y="-200" width="${f(w)}" height="${FLOOR + 200}" fill="${['#18262e', '#1e2e38', '#142028'][i % 3]}"/><ellipse cx="${f(x + w / 2)}" cy="${f(60 + rnd(i) * 120)}" rx="${f(160 + rnd(i) * 80)}" ry="120" fill="#16302a" opacity="0.9"/>`; }
  if (o.torches) for (let i = 0; i < 5; i++) { const x = 80 + i * 260, y = FLOOR - 200 + Math.sin(tt * 2 + i) * 6; back += `<defs>${glow('tc' + i, '#ffe08a', 0.6)}</defs><ellipse cx="${x}" cy="${f(y)}" rx="120" ry="90" fill="url(#tc${i})"/><circle cx="${x}" cy="${f(y)}" r="8" fill="#fff4c8"/>`; }
  let mid = o.trunk ? `<path d="M 1300 ${FLOOR - 10} L 1900 ${FLOOR - 90} L 1910 ${FLOOR - 20} L 1310 ${FLOOR + 30} Z" fill="#4a3424" stroke="${OL}" stroke-width="3"/>` : '';
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#1a2a20"/>` + [...Array(30)].map((_, i) => `<ellipse cx="${f(-500 + rnd(i * 2) * 3000)}" cy="${f(FLOOR + 20 + rnd(i * 5) * 200)}" rx="30" ry="6" fill="#26402e"/>`).join('');
  return { bg: '#0e1a24', back, mid, floor, FLOOR, blur: 4, vig: 0.65, reflect: false };
}
// a multi-storey car park at night after a floor collapsed: a slab tilted down onto the level below, dust, the moon
export function collapse(tt, o = {}) {
  const FLOOR = 860, lift = o.lift || 0; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#101632"/>${stars(30, -400, 2300, -200, 200, 11)}${moon(1640, 120, 38)}`;
  back += `<rect x="-200" y="140" width="2300" height="40" fill="#5a6070"/><rect x="-200" y="420" width="900" height="40" fill="#5a6070"/>`;
  for (let i = 0; i < 6; i++) back += `<rect x="${-150 + i * 420}" y="180" width="60" height="${FLOOR - 180}" fill="#6a7080"/>`;
  back += `<rect x="-200" y="420" width="2300" height="${FLOOR - 420}" fill="#1a2040" opacity="0.6"/>`;
  // the fallen slab: from x 700 (still attached at 420) down to the floor at x 1900; lift raises the low end
  const ly = FLOOR - 70 - lift * 240;
  let mid = `<path d="M 700 420 L 1950 ${f(ly)} L 1950 ${f(ly + 44)} L 700 464 Z" fill="#7a808e" stroke="${OL}" stroke-width="4"/>`;
  for (let i = 0; i < 9; i++) mid += `<rect x="${f(1100 + rnd(i) * 900)}" y="${f(FLOOR - 30 - rnd(i + 2) * 40)}" width="${f(30 + rnd(i + 5) * 60)}" height="${f(20 + rnd(i + 8) * 30)}" fill="#8a909e" transform="rotate(${f(rnd(i) * 40 - 20)} ${f(1100 + rnd(i) * 900)} ${FLOOR - 30})"/>`;
  for (let i = 0; i < 8; i++) { const k = (tt * 0.15 + i / 8) % 1; mid += `<circle cx="${f(1000 + i * 120 + Math.sin(tt + i) * 30)}" cy="${f(FLOOR - 40 - k * 400)}" r="${f(60 + k * 80)}" fill="#c8c0b0" opacity="${f(0.16 * (1 - k))}"/>`; }
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#4a5060"/>`;
  return { bg: '#101632', back, mid, floor, FLOOR, blur: 4, vig: 0.6, reflect: false, slabY: ly };
}
// a city street at night seen from low, with a rooftop line (for the dogs' run)
export function nightRun(tt, o = {}) {
  const FLOOR = 840, px = (o.scroll || 0) % 600; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#0e1430"/>${stars(30, -400, 2300, -200, 250, 5)}${moon(300, 150, 36)}`;
  for (let i = 0; i < 12; i++) { const x = -600 + i * 300 - px, h = 300 + rnd(i) * 300; back += `<rect x="${f(x)}" y="${f(FLOOR - h)}" width="260" height="${f(h)}" fill="${['#1e2650', '#24305e', '#1a2246'][i % 3]}"/>` + [...Array(6)].map((_, j) => rnd(i * 9 + j) > 0.6 ? `<rect x="${f(x + 30 + (j % 3) * 70)}" y="${f(FLOOR - h + 40 + Math.floor(j / 3) * 90)}" width="40" height="50" fill="#ffd27a" opacity="0.8"/>` : '').join(''); }
  for (let i = 0; i < 5; i++) { const x = -300 + i * 600 - px; back += `<rect x="${f(x)}" y="${FLOOR - 320}" width="10" height="320" fill="#2a2d3a"/><defs>${glow('sl' + i, '#ffe8a8', 0.55)}</defs><ellipse cx="${f(x + 5)}" cy="${FLOOR - 320}" rx="130" ry="100" fill="url(#sl${i})"/>`; }
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#2a2d3a"/>` + [...Array(8)].map((_, i) => `<rect x="${f(-600 + i * 400 - px)}" y="${FLOOR + 120}" width="200" height="14" fill="#e0b44a" opacity="0.7"/>`).join('');
  return { bg: '#0e1430', back, mid: '', floor, FLOOR, blur: 3, vig: 0.6 };
}
// a rooftop edge at night with a cat sitting on it (seen from the street)
export function rooftopCat(tt, o = {}) {
  const FLOOR = 900; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#121a3a"/>${stars(40, -400, 2300, -200, 300, 9)}${moon(1500, 160, 50)}`;
  back += `<rect x="300" y="300" width="1300" height="${FLOOR - 300}" fill="#2a3060"/><rect x="280" y="280" width="1340" height="30" fill="#3a4070"/>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) back += `<rect x="${360 + c * 210}" y="${380 + r * 120}" width="90" height="70" fill="${rnd(r * 7 + c) > 0.7 ? '#ffd27a' : '#1a2046'}"/>`;
  const cx = 1180, cy = 280, b = Math.sin(tt * 1.5) * 3;
  let mid = `<g transform="translate(${cx} ${cy})"><ellipse cx="0" cy="-40" rx="34" ry="44" fill="#d88a4a"/><circle cx="0" cy="-${f(96 + b)}" r="28" fill="#d88a4a"/><path d="M -22 -${f(118 + b)} l 6 -26 l 12 20 Z M 22 -${f(118 + b)} l -6 -26 l -12 20 Z" fill="#d88a4a"/><circle cx="-10" cy="-${f(100 + b)}" r="5" fill="#15181e"/><circle cx="10" cy="-${f(100 + b)}" r="5" fill="#15181e"/><path d="M 30 -10 q 50 10 40 -40" stroke="#d88a4a" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#22263a"/>`;
  return { bg: '#121a3a', back, mid, floor, FLOOR, blur: 3, vig: 0.6, reflect: false };
}
// a balcony at night (day 20): railing, city lights far away, the moon
export function nightBalcony(tt, o = {}) {
  const FLOOR = 840; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#0a0e24"/>${stars(60, -400, 2300, -200, 450, 13)}${moon(500, 180, 44)}`;
  for (let i = 0; i < 30; i++) back += `<rect x="${f(-400 + i * 100)}" y="${f(560 + rnd(i) * 60)}" width="80" height="${f(300)}" fill="#141a3a"/><rect x="${f(-380 + i * 100)}" y="${f(590 + rnd(i) * 60)}" width="10" height="10" fill="#ffd27a" opacity="${f(rnd(i * 3))}"/>`;
  let mid = `<rect x="-600" y="${FLOOR - 200}" width="3120" height="12" fill="#9aa3ad"/>` + [...Array(40)].map((_, i) => `<rect x="${-600 + i * 80}" y="${FLOOR - 200}" width="8" height="200" fill="#9aa3ad"/>`).join('');
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#2a2d3a"/>`;
  return { bg: '#0a0e24', back, mid, floor, FLOOR, blur: 3, vig: 0.65, reflect: false };
}
// a park at sunset (day 10): warm sky, a path, benches, trees; long shadows to the left
export function sunsetPark(tt, o = {}) {
  const FLOOR = 800; let back = `<defs><linearGradient id="ssk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a6a"/><stop offset="0.6" stop-color="#ffc88a"/><stop offset="1" stop-color="#ffe0a8"/></linearGradient></defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#ssk)"/><circle cx="1600" cy="${FLOOR - 120}" r="90" fill="#fff0c8" opacity="0.9"/>`;
  for (let i = 0; i < 6; i++) { const x = -200 + i * 450; back += `<rect x="${x}" y="${FLOOR - 260}" width="30" height="260" fill="#6a4a3a"/><circle cx="${x + 15}" cy="${FLOOR - 300}" r="110" fill="${['#8a6a3a', '#a07a3a', '#7a5a34'][i % 3]}"/>`; }
  let mid = `<rect x="200" y="${FLOOR - 90}" width="260" height="16" rx="6" fill="#8a5a3a"/><rect x="220" y="${FLOOR - 74}" width="12" height="74" fill="#5a3a2a"/><rect x="430" y="${FLOOR - 74}" width="12" height="74" fill="#5a3a2a"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="700" fill="#8aa04a"/><path d="M -600 ${FLOOR + 160} Q 960 ${FLOOR + 60} 2520 ${FLOOR + 200} L 2520 ${FLOOR + 320} Q 960 ${FLOOR + 180} -600 ${FLOOR + 280} Z" fill="#d8c08a"/>`;
  return { bg: '#ffc88a', back, mid, floor, FLOOR, blur: 4, vig: 0.4, reflect: false };
}
