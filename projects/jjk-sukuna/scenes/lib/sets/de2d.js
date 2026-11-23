// Flat 2D art for the Domain Expansion video (our own designs; nothing traced from the manga/anime):
// a red barrier dome that closes from the ground up with a slow swirl at the top, thin red threads that tie things to
// the hero (OUR RULE: the invented technique), a small cross neighbour's cat, and new sets: a city rooftop at night,
// a corner shop, a train station platform, a playground at night, a primary school in a storm, a night street with a car.
import { glow } from '../flat2d.js';
const f = (n) => n.toFixed(1);
export const RED = '#ff2e3a', RED2 = '#b8121e', CYAN = '#2fd8ee', OL = '#b9dcff';
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const stars = (n, x0, x1, y0, y1, seed = 1) => [...Array(n)].map((_, i) => `<circle cx="${f(x0 + rnd(i + seed) * (x1 - x0))}" cy="${f(y0 + rnd(i * 3 + seed) * (y1 - y0))}" r="${f(1.5 + rnd(i * 7) * 2)}" fill="#fff" opacity="${f(0.4 + rnd(i * 5) * 0.5)}"/>`).join('');
let UID = 0;

// the barrier: a red hemisphere centred at (cx, gy) with radius R. k = 0..1 how far the walls have risen (closing from
// the ground up); at k = 1 it is shut and the swirl at the top turns. o.op = fill strength, o.flicker = failing dome,
// o.ry = vertical squash (perspective), o.swirl = false hides the swirl.
export function dome(cx, gy, R, k, tt, o = {}) {
  if (k <= 0) return ''; const id = 'dm' + (UID++ % 9999), ry = o.ry ?? 1, H = R * ry;
  let op = o.op ?? 1; if (o.flicker) op *= 0.35 + 0.65 * (Math.sin(tt * 23) > -0.2 ? 1 : 0.15) * (0.6 + 0.4 * Math.sin(tt * 7.3) ** 2);
  const top = gy - H * Math.min(1, k * 1.02), shell = `M ${f(cx - R)} ${f(gy)} A ${f(R)} ${f(H)} 0 0 1 ${f(cx + R)} ${f(gy)} Z`;
  let g = `<defs><radialGradient id="${id}g" cx="0.5" cy="0.9" r="0.75"><stop offset="0" stop-color="${RED}" stop-opacity="${f(0.06 * op)}"/><stop offset="0.75" stop-color="${RED}" stop-opacity="${f(0.22 * op)}"/><stop offset="1" stop-color="#ff6a5a" stop-opacity="${f(0.55 * op)}"/></radialGradient><clipPath id="${id}c"><rect x="${f(cx - R - 40)}" y="${f(top)}" width="${f(2 * R + 80)}" height="${f(gy - top + 40)}"/></clipPath>${glow(id + 'w', RED, 0.9)}</defs>`;
  g += `<g clip-path="url(#${id}c)"><path d="${shell}" fill="url(#${id}g)"/>`;
  for (let i = 1; i < 7; i++) { const a = (i / 7) * Math.PI, rx = Math.abs(Math.cos(a)) * R; g += `<ellipse cx="${f(cx)}" cy="${f(gy)}" rx="${f(rx)}" ry="${f(H)}" fill="none" stroke="${RED}" stroke-width="${f(Math.max(1.5, R / 260))}" opacity="${f(0.22 * op)}" clip-path="none"/>`; }
  for (let j = 1; j < 4; j++) { const y = gy - H * (j / 4), w = R * Math.sqrt(1 - (j / 4) ** 2); g += `<path d="M ${f(cx - w)} ${f(y)} Q ${f(cx)} ${f(y + H * 0.06)} ${f(cx + w)} ${f(y)}" fill="none" stroke="${RED}" stroke-width="${f(Math.max(1.5, R / 300))}" opacity="${f(0.25 * op)}"/>`; }
  g += `<path d="M ${f(cx - R)} ${f(gy)} A ${f(R)} ${f(H)} 0 0 1 ${f(cx + R)} ${f(gy)}" fill="none" stroke="#ff6a5a" stroke-width="${f(Math.max(3, R / 90))}" opacity="${f(0.9 * op)}" ${o.flicker ? `stroke-dasharray="${f(R / 6)} ${f(R / 14)}"` : ''}/></g>`;
  if (k < 1) { const w = R * Math.sqrt(Math.max(0, 1 - ((gy - top) / H) ** 2)); g += `<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${f(w)}" ry="${f(Math.max(4, w * 0.08))}" fill="none" stroke="#ffd0c8" stroke-width="${f(Math.max(3, R / 120))}" opacity="${f(0.9 * op)}" filter="url(#${id}w)"/>`; }
  if (k >= 0.92 && o.swirl !== false) { const s = R / 520, a = tt * 40, sk = Math.min(1, (k - 0.92) / 0.08);
    g += `<g transform="translate(${f(cx)} ${f(gy - H + 6 * s)}) scale(${f(s)}, ${f(s * 0.45)}) rotate(${f(a)})" opacity="${f(sk * op)}">` + [0, 1, 2, 3].map((i) => `<path d="M 0 0 C ${60} -${20 + i * 8} ${120 + i * 30} ${30 + i * 10} ${70 + i * 40} ${110 + i * 20}" transform="rotate(${i * 90})" stroke="${i % 2 ? '#ff8a7a' : RED}" stroke-width="${16 - i * 2}" fill="none" stroke-linecap="round"/>`).join('') + `<circle r="22" fill="${RED2}"/></g>`; }
  return g;
}
// open domain (no walls): a red wash that spreads over the ground from x0 to x1 with threads up to windows
export function spread(x0, x1, gy, k, tt) { const w = (x1 - x0) * k, cx = (x0 + x1) / 2;
  return `<ellipse cx="${f(cx)}" cy="${f(gy)}" rx="${f(w / 2)}" ry="${f(80 + 220 * k)}" fill="${RED}" opacity="${f(0.22 + 0.06 * Math.sin(tt * 3))}"/><ellipse cx="${f(cx)}" cy="${f(gy)}" rx="${f(w / 2)}" ry="${f(80 + 220 * k)}" fill="none" stroke="#ff6a5a" stroke-width="4" opacity="0.7"/>`; }
// thin red threads from src to each target point; k grows them; slack = droop; taut lines shiver slightly
export function threads(src, pts, tt, o = {}) { const k = o.k ?? 1, sl = o.slack ?? 0, w = o.w ?? 2.6, op = o.op ?? 0.9;
  return pts.map((p, i) => { const [x1, y1] = src, x2 = x1 + (p[0] - x1) * k, y2 = y1 + (p[1] - y1) * k, mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sl * 160 + Math.sin(tt * 6 + i) * (sl ? 4 : 2);
    return `<path d="M ${f(x1)} ${f(y1)} Q ${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}" stroke="${RED}" stroke-width="${w}" fill="none" opacity="${f(op)}" stroke-linecap="round"/><circle cx="${f(x2)}" cy="${f(y2)}" r="${f(w * 1.6)}" fill="#ff6a5a" opacity="${f(op * (k >= 1 ? 1 : 0))}"/>`; }).join(''); }
// the neighbour's cat: orange, cross; o.flip, o.angry (ears back, tail puffed)
export function cat(x, y, s = 1, tt = 0, o = {}) { const b = Math.sin(tt * 2) * 3, an = o.angry ?? true, fl = o.flip ? -1 : 1;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s * fl)} ${f(s)})"><ellipse cx="0" cy="-40" rx="52" ry="38" fill="#e08a3a"/><path d="M -40 -40 q -10 30 -6 40 M 30 -40 q 10 30 6 40" stroke="#e08a3a" stroke-width="14" stroke-linecap="round"/><circle cx="52" cy="${f(-82 - b)}" r="30" fill="#e08a3a"/>
<path d="M 30 ${f(-104 - b)} l ${an ? -14 : 4} -22 l 18 14 Z M 72 ${f(-104 - b)} l ${an ? 18 : -4} -22 l -18 14 Z" fill="#e08a3a"/><path d="M 40 ${f(-88 - b)} l 10 4 M 74 ${f(-88 - b)} l -10 4" stroke="#15181e" stroke-width="5" stroke-linecap="round"/><circle cx="46" cy="${f(-80 - b)}" r="4" fill="#15181e"/><circle cx="66" cy="${f(-80 - b)}" r="4" fill="#15181e"/><path d="M 50 ${f(-68 - b)} q 6 -5 12 0" stroke="#15181e" stroke-width="3" fill="none"/>
<path d="M -50 -50 q -60 ${f(-20 + 10 * Math.sin(tt * 5))} -50 -80" stroke="#e08a3a" stroke-width="${an ? 22 : 12}" fill="none" stroke-linecap="round"/></g>`; }

// ---------- sets ----------
// the skyline (shared): rows of towers with lit windows; red tints it when o.red > 0
function skyline(base, o = {}) { let s = ''; const red = o.red || 0;
  for (let L = 0; L < 2; L++) for (let i = 0; i < 16; i++) { const w = 120 + rnd(i * 3 + L * 50) * 140, h = (L ? 200 : 340) + rnd(i * 7 + L * 9) * (L ? 220 : 380), x = -600 + i * 210 + L * 90 + rnd(i + L) * 60;
    const col = L ? '#1a1f3a' : '#232a4e'; s += `<rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h)}" fill="${col}"/>`;
    for (let r = 0; r < Math.floor(h / 46); r++) for (let c = 0; c < Math.floor(w / 40); c++) if (rnd(i * 31 + r * 7 + c * 3 + L) > 0.62) s += `<rect x="${f(x + 12 + c * 40)}" y="${f(base - h + 20 + r * 46)}" width="18" height="22" fill="${rnd(r + c + i) > 0.5 ? '#ffd27a' : '#bfe4ff'}" opacity="0.85"/>`; }
  if (red) s += `<rect x="-600" y="-300" width="3120" height="${base + 300}" fill="${RED}" opacity="${f(0.16 * red)}"/>`; return s; }
// a flat rooftop at night above the city (11:20 p.m.); o.high = a taller roof, the city further below; o.red = red sky
export function cityRoof(tt, o = {}) { const FLOOR = 860, base = o.high ? 900 : 760;
  let back = `<defs><linearGradient id="crs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a1c"/><stop offset="1" stop-color="#1c2246"/></linearGradient></defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#crs)"/>${stars(50, -400, 2300, -250, 350, 21)}`;
  back += skyline(base, o);
  if (o.high) back += `<path d="M -600 ${base - 30} Q 400 ${base - 80} 960 ${base - 40} T 2520 ${base - 60} L 2520 ${base} L -600 ${base} Z" fill="#203a5a" opacity="0.7"/>`;
  let mid = `<rect x="-600" y="${FLOOR - 60}" width="3120" height="60" fill="#3a3f5a"/><rect x="-600" y="${FLOOR - 70}" width="3120" height="14" fill="#5a6080"/>`;
  mid += `<g transform="translate(220 ${FLOOR - 60})"><rect x="-80" y="-300" width="160" height="190" rx="14" fill="#4a5070"/><rect x="-60" y="-110" width="12" height="110" fill="#2a2f4a"/><rect x="48" y="-110" width="12" height="110" fill="#2a2f4a"/></g><rect x="1680" y="${FLOOR - 240}" width="8" height="180" fill="#8a90a8"/><circle cx="1684" cy="${FLOOR - 246}" r="8" fill="#ff5a5a"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#2a2e44"/><rect x="-600" y="${FLOOR}" width="3120" height="8" fill="#1e2236"/>`;
  return { bg: '#070a1c', back, mid, floor, FLOOR, base, blur: 1.5, vig: 0.6, reflect: false };
}
// a corner shop on a street at dusk: awning, "OPEN 24" sign, fruit crates
export function cornerShop(tt, o = {}) { const FLOOR = 860;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#3a3f6a"/><rect x="-600" y="-300" width="3120" height="500" fill="#5a4a7a"/>`;
  back += `<rect x="420" y="120" width="1080" height="${FLOOR - 120}" fill="#c87a4a"/><rect x="420" y="100" width="1080" height="30" fill="#8a4a2a"/>` + [...Array(3)].map((_, i) => `<rect x="${480 + i * 340}" y="180" width="220" height="150" fill="#ffd27a" opacity="0.8"/>`).join('');
  back += `<rect x="460" y="430" width="1000" height="${FLOOR - 430}" fill="#1c2a3a"/><rect x="480" y="450" width="560" height="${FLOOR - 470}" fill="#ffe8a8" opacity="0.85"/><rect x="1100" y="450" width="200" height="${FLOOR - 450}" fill="#2a3a4a"/>`;
  back += `<path d="M 440 380 L 1480 380 L 1520 460 L 400 460 Z" fill="#2fae5a"/>` + [...Array(9)].map((_, i) => `<path d="M ${400 + i * 124} 460 l 62 0 l -10 -80 l -42 0 Z" fill="#fff" opacity="0.85"/>`).join('');
  back += `<rect x="1330" y="470" width="110" height="60" rx="8" fill="#15181e"/><text x="1385" y="512" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="26" fill="${RED}">OPEN 24</text>`;
  let mid = [520, 700, 880].map((x, i) => `<rect x="${x}" y="${FLOOR - 90}" width="150" height="90" fill="#8a5a3a"/>` + [...Array(4)].map((_, j) => `<circle cx="${x + 25 + j * 34}" cy="${FLOOR - 98}" r="18" fill="${['#e8452e', '#ffd23f', '#4fd06a'][i]}"/>`).join('')).join('');
  mid += `<rect x="1680" y="${FLOOR - 460}" width="14" height="460" fill="#5a6070"/><rect x="1640" y="${FLOOR - 480}" width="94" height="30" rx="8" fill="#5a6070"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#6a6e7a"/><rect x="-600" y="${FLOOR + 120}" width="3120" height="14" fill="#8a8e9a"/>`;
  return { bg: '#3a3f6a', back, mid, floor, FLOOR, blur: 2, vig: 0.4 };
}
// a train station platform: pillars, a yellow line, a departure board, a train on the far track; o.crowd adds commuters (drawn by film)
export function station(tt, o = {}) { const FLOOR = 870;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#c8d0d8"/><path d="M -600 -300 L 2520 -300 L 2520 80 L -600 80 Z" fill="#8a96a4"/>` + [...Array(14)].map((_, i) => `<path d="M ${-600 + i * 240} 80 L ${-480 + i * 240} -300" stroke="#6a7684" stroke-width="10"/>`).join('');
  back += `<rect x="-600" y="360" width="3120" height="${FLOOR - 460}" fill="#2f86e0"/><rect x="-600" y="340" width="3120" height="30" fill="#e8ecf2"/>` + [...Array(16)].map((_, i) => `<rect x="${-560 + i * 200}" y="400" width="140" height="120" rx="12" fill="#bfe4ff"/>`).join('') + `<rect x="-600" y="${FLOOR - 120}" width="3120" height="20" fill="#1c2a5a"/>`;
  back += `<g transform="translate(960 150)"><rect x="-300" y="-60" width="600" height="140" rx="10" fill="#15181e"/><text x="-270" y="-8" font-family="IBM Plex Mono" font-weight="800" font-size="34" fill="#ffd23f">18:42  CENTRAL     2</text><text x="-270" y="44" font-family="IBM Plex Mono" font-weight="800" font-size="34" fill="#ffd23f">18:47  AIRPORT     4</text></g>`;
  const mid = [-200, 360, 1560, 2120].map((x) => `<rect x="${x}" y="-300" width="70" height="${FLOOR + 300}" fill="#a8b0bc"/><rect x="${x - 10}" y="${FLOOR - 40}" width="90" height="40" fill="#8a929e"/>`).join('');
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#9aa2ae"/><rect x="-600" y="${FLOOR + 60}" width="3120" height="18" fill="#ffd23f"/>`;
  return { bg: '#c8d0d8', back, mid, floor, FLOOR, blur: 2, reflOp: 0.1 };
}
// an empty playground at night: a slide, swings, a lamp post, a fence
export function playground(tt, o = {}) { const FLOOR = 860;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#0c1230"/>${stars(70, -400, 2300, -250, 450, 31)}<circle cx="1620" cy="170" r="44" fill="#f4f1dc"/>`;
  for (let i = 0; i < 14; i++) back += `<rect x="${-500 + i * 220}" y="${560 + rnd(i) * 80}" width="190" height="400" fill="#141a3a"/>`;
  back += `<rect x="-600" y="${FLOOR - 120}" width="3120" height="6" fill="#4a5270"/>` + [...Array(40)].map((_, i) => `<rect x="${-600 + i * 80}" y="${FLOOR - 140}" width="6" height="140" fill="#4a5270"/>`).join('');
  let mid = `<g transform="translate(560 ${FLOOR})"><rect x="-100" y="-300" width="14" height="300" fill="#e8452e"/><rect x="60" y="-300" width="14" height="300" fill="#e8452e"/><rect x="-100" y="-310" width="174" height="20" fill="#ffd23f"/><path d="M 74 -300 L 340 -20 L 340 0 L 300 0 L 60 -260 Z" fill="#3fb8e0"/>${[...Array(5)].map((_, i) => `<rect x="-100" y="${-260 + i * 52}" width="174" height="8" fill="#e8452e"/>`).join('')}</g>`;
  mid += `<g transform="translate(1320 ${FLOOR})"><path d="M -160 0 L -100 -360 L 100 -360 L 160 0" stroke="#8a93a8" stroke-width="12" fill="none"/>${[-50, 50].map((x, i) => { const sw = Math.sin(tt * 1.4 + i) * 6; return `<g transform="rotate(${f(sw)} ${x} -356)"><line x1="${x - 24}" y1="-356" x2="${x - 24}" y2="-110" stroke="#8a93a8" stroke-width="3"/><line x1="${x + 24}" y1="-356" x2="${x + 24}" y2="-110" stroke="#8a93a8" stroke-width="3"/><rect x="${x - 34}" y="-112" width="68" height="12" fill="#2a2d3a"/></g>`; }).join('')}</g>`;
  mid += `<rect x="1720" y="${FLOOR - 460}" width="12" height="460" fill="#5a6070"/><ellipse cx="1726" cy="${FLOOR - 470}" rx="30" ry="12" fill="#ffe8a8"/><path d="M 1726 ${FLOOR - 460} L 1560 ${FLOOR} L 1890 ${FLOOR} Z" fill="#ffe8a8" opacity="0.1"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#2a3048"/><ellipse cx="960" cy="${FLOOR + 80}" rx="700" ry="70" fill="#3a4060"/>`;
  return { bg: '#0c1230', back, mid, floor, FLOOR, blur: 2, vig: 0.6, reflect: false };
}
// a primary school and its yard in a storm: dark clouds, rain, wind streaks, a gate on the left, a car park on the right; o.calm = after
export function school(tt, o = {}) { const FLOOR = 880, calm = o.calm, wind = calm ? 0 : 1;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="${calm ? '#8a96a8' : '#2a2f40'}"/>`;
  for (let i = 0; i < 10; i++) back += `<ellipse cx="${f(-500 + ((i * 330 + tt * 160 * wind) % 3300))}" cy="${f(-60 + rnd(i) * 220)}" rx="${f(260 + rnd(i * 3) * 160)}" ry="${f(90 + rnd(i * 5) * 50)}" fill="${calm ? '#a8b2c2' : '#1a1e2c'}"/>`;
  if (!calm && Math.sin(tt * 2.7) > 0.985) back += `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#fff" opacity="0.35"/><path d="M 1500 -100 l -60 180 l 40 0 l -70 200" stroke="#fff" stroke-width="8" fill="none"/>`;
  back += `<rect x="260" y="260" width="1400" height="${FLOOR - 260}" fill="#c8a07a"/><path d="M 220 270 L 960 120 L 1700 270 Z" fill="#8a3a2a"/>` + [...Array(2)].map((_, r) => [...Array(7)].map((_, c) => `<rect x="${330 + c * 190}" y="${330 + r * 170}" width="120" height="110" fill="${calm ? '#bfe4ff' : '#ffd27a'}" opacity="0.9"/>`).join('')).join('');
  back += `<rect x="860" y="${FLOOR - 200}" width="200" height="200" fill="#5a3a2a"/><rect x="800" y="180" width="320" height="56" rx="8" fill="#f4f1ea"/><text x="960" y="220" text-anchor="middle" font-family="Inter" font-weight="900" font-size="32" fill="#2a3a7a">PRIMARY SCHOOL</text>`;
  back += `<rect x="1760" y="${FLOOR - 70}" width="220" height="70" rx="20" fill="#3a6ab3"/><rect x="2000" y="${FLOOR - 70}" width="220" height="70" rx="20" fill="#b33a3a"/>`;
  let mid = `<rect x="-600" y="${FLOOR - 180}" width="640" height="8" fill="#5a6070"/>` + [...Array(9)].map((_, i) => `<rect x="${-600 + i * 80}" y="${FLOOR - 180}" width="6" height="180" fill="#5a6070"/>`).join('') + `<rect x="40" y="${FLOOR - 240}" width="20" height="240" fill="#3a3f4a"/>`;
  const front = calm ? '' : [...Array(70)].map((_, i) => { const x = (rnd(i) * 3000 + tt * 900) % 2600 - 400, y = (rnd(i * 7) * 1300 + tt * 1500) % 1300 - 200; return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 46)}" y2="${f(y + 60)}" stroke="#bfd4f0" stroke-width="3" opacity="0.5"/>`; }).join('') + [...Array(8)].map((_, i) => { const y = 200 + rnd(i * 9) * 600, x = (rnd(i * 4) * 2600 + tt * 1800) % 2600 - 400; return `<path d="M ${f(x)} ${f(y)} q 120 -20 240 0" stroke="#fff" stroke-width="3" fill="none" opacity="0.35"/>`; }).join('');
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="${calm ? '#7a8090' : '#3a3f4e'}"/>` + [...Array(6)].map((_, i) => `<ellipse cx="${-200 + i * 480}" cy="${FLOOR + 90}" rx="120" ry="14" fill="#8aa8d0" opacity="${calm ? 0.25 : 0.4}"/>`).join('');
  return { bg: '#2a2f40', back, mid, floor, front, FLOOR, blur: 2, vig: calm ? 0.35 : 0.6, reflect: false };
}
// a residential street at night with a parked car and streetlights; o.red tints the lights red
export function nightStreet(tt, o = {}) { const FLOOR = 860, red = o.red || 0;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#0e1430"/>${stars(30, -400, 2300, -250, 200, 41)}`;
  for (let i = 0; i < 7; i++) { const x = -500 + i * 420; back += `<rect x="${x}" y="300" width="360" height="${FLOOR - 300}" fill="${['#2a2f50', '#30284a', '#26304e'][i % 3]}"/><path d="M ${x - 20} 310 L ${x + 180} 200 L ${x + 380} 310 Z" fill="#1c2040"/>` + [0, 1].map((c) => `<rect x="${x + 50 + c * 170}" y="400" width="90" height="100" fill="${rnd(i + c) > 0.4 ? '#ffd27a' : '#141a36'}" opacity="0.85"/>`).join(''); }
  const lc = red ? RED : '#ffe8a8';
  let mid = [300, 1500].map((x) => `<rect x="${x}" y="${FLOOR - 520}" width="12" height="520" fill="#5a6070"/><ellipse cx="${x + 6}" cy="${FLOOR - 528}" rx="34" ry="12" fill="${lc}"/><path d="M ${x + 6} ${FLOOR - 520} L ${x - 160} ${FLOOR} L ${x + 170} ${FLOOR} Z" fill="${lc}" opacity="${f(0.12 + 0.06 * red)}"/>`).join('');
  mid += `<g transform="translate(980 ${FLOOR})"><path d="M -260 -40 L -240 -110 Q -200 -190 -80 -196 L 90 -196 Q 180 -190 220 -110 L 270 -100 Q 300 -90 300 -40 Z" fill="#3a8ad8"/><path d="M -180 -116 Q -150 -176 -80 -178 L -10 -178 L -10 -116 Z M 10 -116 L 10 -178 L 80 -178 Q 150 -176 176 -116 Z" fill="${o.broken ? '#6a7a8a' : '#bfe4ff'}"/><circle cx="-150" cy="-30" r="44" fill="#15181e"/><circle cx="170" cy="-30" r="44" fill="#15181e"/><circle cx="-150" cy="-30" r="18" fill="#8a93a8"/><circle cx="170" cy="-30" r="18" fill="#8a93a8"/></g>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#2a2e3e"/><rect x="-600" y="${FLOOR}" width="3120" height="40" fill="#4a4e5e"/>` + [...Array(10)].map((_, i) => `<rect x="${-500 + i * 300}" y="${FLOOR + 160}" width="140" height="10" fill="#e8e0a0" opacity="0.5"/>`).join('');
  if (red) mid += `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="${RED}" opacity="${f(0.1 * red)}"/>`;
  return { bg: '#0e1430', back, mid, floor, FLOOR, blur: 2, vig: 0.6, reflect: false };
}
// a yoga studio: pale wood, tall windows, mats (the teacher's mat at the front)
export function yoga(tt, o = {}) { const FLOOR = 860;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#efe6d8"/>` + [...Array(4)].map((_, i) => `<rect x="${120 + i * 460}" y="110" width="320" height="520" rx="160" fill="#cfe8e0" stroke="#d8c8b0" stroke-width="10"/><rect x="${270 + i * 460}" y="110" width="10" height="520" fill="#d8c8b0"/>`).join('');
  back += [260, 1640].map((x) => `<rect x="${x - 30}" y="${FLOOR - 120}" width="60" height="120" rx="10" fill="#c8a07a"/><path d="M ${x} ${FLOOR - 120} q -50 -80 -10 -150 M ${x} ${FLOOR - 120} q 40 -90 20 -170 M ${x} ${FLOOR - 120} q 70 -50 80 -120" stroke="#4fa06a" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('');
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#d8b88a"/>` + [...Array(16)].map((_, i) => `<rect x="${-600 + i * 200}" y="${FLOOR}" width="4" height="600" fill="#c09a6a"/>`).join('') + [...Array(6)].map((_, i) => `<rect x="${140 + i * 290}" y="${FLOOR + 30}" width="230" height="40" rx="8" fill="${['#9a5cc0', '#3fb8e0', '#4fd06a', '#e05a8a', '#ffd23f', '#ff8a3a'][i]}" opacity="0.85"/>`).join('');
  return { bg: '#efe6d8', back, mid: '', floor, FLOOR, blur: 2, reflOp: 0.1 };
}
// a small bathroom: white tiles, a bathtub on the right, a sink and mirror on the left, a bath mat
export function bath(tt, o = {}) { const FLOOR = 850;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#dfeef2"/>`;
  for (let x = -600; x < 2520; x += 80) back += `<line x1="${x}" y1="-300" x2="${x}" y2="${FLOOR}" stroke="#bcd4da" stroke-width="3"/>`;
  for (let y = -280; y < FLOOR; y += 80) back += `<line x1="-600" y1="${y}" x2="2520" y2="${y}" stroke="#bcd4da" stroke-width="3"/>`;
  back += `<rect x="260" y="180" width="360" height="300" rx="20" fill="#bfe4f6" stroke="#f4f8fb" stroke-width="16"/><rect x="250" y="${FLOOR - 330}" width="380" height="60" rx="14" fill="#f4f8fb"/><rect x="410" y="${FLOOR - 270}" width="60" height="270" fill="#e4eef2"/><rect x="430" y="${FLOOR - 360}" width="20" height="40" fill="#a8b0bc"/>`;
  let mid = `<g transform="translate(1340 ${FLOOR})"><rect x="-380" y="-250" width="760" height="250" rx="60" fill="#f4f8fb" stroke="#bcd4da" stroke-width="6"/><rect x="-350" y="-236" width="700" height="40" rx="20" fill="#cfe8f4"/><rect x="300" y="-420" width="18" height="180" fill="#a8b0bc"/><path d="M 318 -420 q 40 0 40 40" stroke="#a8b0bc" stroke-width="18" fill="none"/></g>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#9ab8c8"/><rect x="700" y="${FLOOR + 30}" width="300" height="60" rx="16" fill="#e05a8a" opacity="0.8"/>`;
  return { bg: '#dfeef2', back, mid, floor, FLOOR, blur: 2, reflOp: 0.12 };
}
// the hero seen from behind in the cyan hoodie, hood up; open = 0..1 arms spread (0 = down, 1 = wide open)
export function backHero(x, y, h, open = 1, tt = 0) { const s = h / 360, a = (0.15 + 0.85 * open) * 1.25, b = Math.sin(tt * 2) * 2;
  const arm = (side) => { const sx = x + side * 38 * s, sy = y - 250 * s, ex = sx + side * Math.sin(a) * 150 * s, ey = sy + Math.cos(a) * 150 * s; return `<line x1="${f(sx)}" y1="${f(sy)}" x2="${f(ex)}" y2="${f(ey)}" stroke="${CYAN}" stroke-width="${f(30 * s)}" stroke-linecap="round"/><circle cx="${f(ex)}" cy="${f(ey)}" r="${f(15 * s)}" fill="#15181e"/>`; };
  return `<g><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(70 * s)}" ry="${f(12 * s)}" fill="#000" opacity="0.35"/><rect x="${f(x - 34 * s)}" y="${f(y - 140 * s)}" width="${f(28 * s)}" height="${f(140 * s)}" rx="${f(10 * s)}" fill="#1c2a3a"/><rect x="${f(x + 6 * s)}" y="${f(y - 140 * s)}" width="${f(28 * s)}" height="${f(140 * s)}" rx="${f(10 * s)}" fill="#1c2a3a"/>${arm(-1)}${arm(1)}
<rect x="${f(x - 52 * s)}" y="${f(y - 275 * s)}" width="${f(104 * s)}" height="${f(150 * s)}" rx="${f(30 * s)}" fill="${CYAN}"/><rect x="${f(x - 52 * s)}" y="${f(y - 150 * s)}" width="${f(104 * s)}" height="${f(22 * s)}" rx="${f(8 * s)}" fill="#1fb0c8"/>
<ellipse cx="${f(x)}" cy="${f(y - 318 * s + b)}" rx="${f(44 * s)}" ry="${f(48 * s)}" fill="#1fb0c8"/><ellipse cx="${f(x)}" cy="${f(y - 322 * s + b)}" rx="${f(36 * s)}" ry="${f(40 * s)}" fill="${CYAN}"/><path d="M ${f(x - 30 * s)} ${f(y - 278 * s)} Q ${f(x)} ${f(y - 262 * s)} ${f(x + 30 * s)} ${f(y - 278 * s)}" stroke="#1fb0c8" stroke-width="${f(8 * s)}" fill="none"/></g>`; }
// a small child (for the school yard): head + body, colour c
export const kid = (x, y, s = 1, c = '#ff8a3a', look = 0) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-16" y="-70" width="32" height="46" rx="12" fill="${c}"/><rect x="-12" y="-26" width="10" height="26" fill="#22263a"/><rect x="2" y="-26" width="10" height="26" fill="#22263a"/><circle cx="0" cy="-90" r="20" fill="#15181e"/><circle cx="${f(-6 + look * 6)}" cy="-92" r="3.5" fill="#fff"/><circle cx="${f(6 + look * 6)}" cy="-92" r="3.5" fill="#fff"/></g>`;
// a trampoline (flies across the road in the storm) and a branch
export const trampoline = (x, y, rot = 0, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})"><ellipse cx="0" cy="0" rx="150" ry="40" fill="#2a2d3a" stroke="#3fb8e0" stroke-width="12"/>${[-110, -40, 40, 110].map((d) => `<line x1="${d}" y1="10" x2="${d * 1.1}" y2="90" stroke="#8a93a8" stroke-width="8"/>`).join('')}</g>`;
export const branch = (x, y, rot = 0, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})"><path d="M -90 0 L 90 0 M -20 0 L 20 -40 M 30 0 L 60 30" stroke="#5a3a2a" stroke-width="12" stroke-linecap="round"/><circle cx="20" cy="-46" r="18" fill="#4fa06a"/><circle cx="64" cy="34" r="16" fill="#4fa06a"/></g>`;
export const bread = (x, y, s = 1, bite = 0) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><path d="M -90 0 L -90 -50 Q -90 -90 -50 -90 L 50 -90 Q 90 -90 90 -50 L 90 0 Z" fill="#d8944a"/><path d="M -70 -60 l 20 -16 M -20 -60 l 20 -16 M 30 -60 l 20 -16" stroke="#a86a2a" stroke-width="6"/>${bite ? `<circle cx="90" cy="-40" r="${f(40 * bite)}" fill="#dfeef2"/>` : ''}</g>`;
