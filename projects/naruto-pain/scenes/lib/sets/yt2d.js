// Flat 2D art for the Yuta / Copy video (our own designs; nothing traced from the manga/anime):
// a huge pale protective figure (never violent), a ring, five coloured skill cards (red climber, blue swimmer,
// purple locksmith with a black-hole keyhole, gold driver, green strongman fist), a torii gate, a bus, an inflatable
// doll for the 1961 study card, a guitar, and new sets: a climbing gym, a meeting room, a dance studio (and its stage),
// a chess table in a park, a residential pavement, a flooded underpass in the rain.
import { glow } from '../flat2d.js';
const f = (n) => n.toFixed(1);
export const OL = '#b9dcff', PALE = '#ece8f4', PALE2 = '#d2cce2', HAIR = '#262036', AURA = '#d8ccff';
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const stars = (n, x0, x1, y0, y1, seed = 1) => [...Array(n)].map((_, i) => `<circle cx="${f(x0 + rnd(i + seed) * (x1 - x0))}" cy="${f(y0 + rnd(i * 3 + seed) * (y1 - y0))}" r="${f(1.5 + rnd(i * 7) * 2)}" fill="#fff" opacity="${f(0.4 + rnd(i * 5) * 0.5)}"/>`).join('');
export const moon = (x, y, r, col = '#f4f1dc') => `<defs>${glow('ymn', '#cfe4ff', 0.5)}</defs><circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#ymn)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.18}" fill="#000" opacity="0.06"/>`;

// ---------- the pale figure ----------
// x = centre, y = where she fades into the floor, h = height; mood 'calm' | 'look' | 'cover' | 'reach' | 'sit' | 'tall'
// op = opacity; she floats (no feet), a soft lilac glow around her; the big mouth of teeth is always closed
export function rika(x, y, h, tt, o = {}) {
  const s = h / 800, mood = o.mood || 'calm', op = o.op ?? 1, bob = Math.sin(tt * 1.1) * 8, flip = o.flip ? -1 : 1;
  const hy = -610 + (mood === 'sit' ? 120 : 0), id = 'rk' + Math.round(x) + Math.round(h);
  let g = `<defs>${glow(id + 'g', AURA, 0.45)}<linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="${PALE}" stop-opacity="1"/><stop offset="1" stop-color="${PALE}" stop-opacity="0"/></linearGradient></defs>`;
  g += `<ellipse cx="0" cy="${hy + 160}" rx="420" ry="520" fill="url(#${id}g)"/>`;
  // body: a long pale robe that fades out at the bottom
  const sh = hy + 150;
  g += `<path d="M -190 ${sh} Q -250 ${f(sh + 200)} -170 0 Q ${f(-60 + Math.sin(tt * 2) * 20)} 30 0 10 Q ${f(60 + Math.sin(tt * 2 + 1) * 20)} 30 170 0 Q 250 ${f(sh + 200)} 190 ${sh} Q 0 ${sh - 60} -190 ${sh} Z" fill="url(#${id}f)" stroke="${PALE2}" stroke-width="4"/>`;
  // arms
  const arm = (side, ex, ey, cx, cy) => `<path d="M ${side * 170} ${sh + 20} Q ${cx} ${cy} ${ex} ${ey}" stroke="${PALE}" stroke-width="46" fill="none" stroke-linecap="round"/><path d="M ${side * 170} ${sh + 20} Q ${cx} ${cy} ${ex} ${ey}" stroke="${PALE2}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/><circle cx="${ex}" cy="${ey}" r="34" fill="${PALE}" stroke="${PALE2}" stroke-width="4"/>`;
  if (mood === 'cover') g += arm(-1, -50, hy - 30, -260, sh + 160) + arm(1, 50, hy - 30, 260, sh + 160);
  else if (mood === 'reach') g += arm(-1, -230, sh + 330, -280, sh + 200) + arm(1, 470, sh + 120, 330, sh + 40);
  else if (mood === 'tall') g += arm(-1, -420, sh - 40, -330, sh + 40) + arm(1, 420, sh - 40, 330, sh + 40);
  else g += arm(-1, -210, sh + 360, -280, sh + 200) + arm(1, 210, sh + 360, 280, sh + 200);
  // hair behind the head
  g += `<path d="M -200 ${hy + 40} Q -230 ${hy - 200} 0 ${hy - 210} Q 230 ${hy - 200} 200 ${hy + 40} L 220 ${hy + 240} Q 180 ${hy + 170} 150 ${hy + 210} L -150 ${hy + 210} Q -180 ${hy + 170} -220 ${hy + 240} Z" fill="${HAIR}"/>`;
  // head
  g += `<ellipse cx="0" cy="${hy}" rx="160" ry="178" fill="${PALE}" stroke="${PALE2}" stroke-width="5"/>`;
  g += `<path d="M -150 ${hy - 40} Q -120 ${hy - 190} 0 ${hy - 180} Q 120 ${hy - 190} 150 ${hy - 40} Q 90 ${hy - 120} 0 ${hy - 110} Q -90 ${hy - 120} -150 ${hy - 40} Z" fill="${HAIR}"/>`;
  // eyes: small and sad (closed when covering)
  const lk = mood === 'look' ? 14 : 0;
  if (mood !== 'cover') g += `<ellipse cx="${-58 + lk}" cy="${hy - 30}" rx="15" ry="19" fill="#2a2438"/><ellipse cx="${58 + lk}" cy="${hy - 30}" rx="15" ry="19" fill="#2a2438"/><circle cx="${-53 + lk}" cy="${hy - 36}" r="5" fill="#fff"/><circle cx="${63 + lk}" cy="${hy - 36}" r="5" fill="#fff"/><path d="M -90 ${hy - 66} Q -60 ${hy - 56} -34 ${hy - 72}" stroke="${HAIR}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M 34 ${hy - 72} Q 60 ${hy - 56} 90 ${hy - 66}" stroke="${HAIR}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  // the wide mouth of big teeth, closed (a gentle line, not a snarl)
  const my = hy + 62, tw = 30;
  g += `<path d="M -120 ${my + 4} Q 0 ${my - 14} 120 ${my + 4} L 112 ${my + 46} Q 0 ${my + 58} -112 ${my + 46} Z" fill="#b8b0c8"/>`;
  for (let i = 0; i < 8; i++) { const tx = -116 + i * tw; g += `<rect x="${tx}" y="${f(my - 8 + Math.abs(i - 3.5) * 3)}" width="${tw - 3}" height="${f(30 - Math.abs(i - 3.5) * 2)}" rx="4" fill="#fbfaf6" stroke="#cfc9de" stroke-width="2"/><rect x="${tx + 2}" y="${f(my + 26)}" width="${tw - 6}" height="${f(20 - Math.abs(i - 3.5) * 1.5)}" rx="4" fill="#fbfaf6" stroke="#cfc9de" stroke-width="2"/>`; }
  g += `<path d="M -124 ${my + 4} Q 0 ${my - 14} 124 ${my + 4}" stroke="#a89ec0" stroke-width="5" fill="none"/>`;
  return `<g opacity="${f(op)}" transform="translate(${f(x)} ${f(y + bob * (mood === 'sit' ? 0.3 : 1))}) scale(${f(s * flip)} ${f(s)})">${g}</g>`;
}
// the ring (for close-ups or on the hero's hand); glow 0..1
export const ring = (x, y, s = 1, gl = 0) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">${gl > 0 ? `<defs>${glow('rng', '#ffe08a', 0.6)}</defs><circle r="${f(70 + 40 * gl)}" fill="url(#rng)" opacity="${f(gl)}"/>` : ''}<circle r="34" fill="none" stroke="#e0b44a" stroke-width="12"/><circle r="34" fill="none" stroke="#fff4c8" stroke-width="3" opacity="0.7"/><rect x="-12" y="-52" width="24" height="18" rx="4" fill="#cfe8ff" stroke="#e0b44a" stroke-width="4"/></g>`;

// ---------- the five skill cards ----------
export const CARDS = [
  { col: '#e8452e', name: 'CLIMBER', icon: 'grip' }, { col: '#2f86e0', name: 'SWIMMER', icon: 'wave' },
  { col: '#5a2fa8', name: 'LOCKSMITH', icon: 'hole' }, { col: '#e0b44a', name: 'DRIVER', icon: 'wheel' }, { col: '#2fae5a', name: 'STRONGMAN', icon: 'fist' }];
const ICON = {
  grip: `<path d="M -36 10 Q -40 -30 -16 -34 L -16 -6 M -16 -34 Q -4 -46 6 -30 L 6 -4 M 6 -30 Q 18 -40 26 -24 L 26 0 M 26 -24 Q 40 -26 38 0 Q 38 40 0 40 Q -36 40 -36 10 Z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><ellipse cx="0" cy="-52" rx="34" ry="12" fill="#ffd23f"/>`,
  wave: `<path d="M -50 -10 q 12 -16 25 0 t 25 0 t 25 0 t 25 0 M -50 14 q 12 -16 25 0 t 25 0 t 25 0 t 25 0" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="0" cy="-40" r="12" fill="#fff"/>`,
  hole: `<circle r="46" fill="#0b0716"/><circle r="46" fill="none" stroke="#b89cff" stroke-width="4" stroke-dasharray="12 10"/><circle cy="-8" r="12" fill="#e0d4ff"/><path d="M -7 -2 L 7 -2 L 11 26 L -11 26 Z" fill="#e0d4ff"/>`,
  wheel: `<circle r="40" fill="none" stroke="#fff" stroke-width="10"/><circle r="10" fill="#fff"/><path d="M -38 0 L -10 0 M 10 0 L 38 0 M 0 10 L 0 38" stroke="#fff" stroke-width="8"/>`,
  fist: `<rect x="-36" y="-30" width="72" height="54" rx="16" fill="#fff"/><path d="M -18 -30 L -18 -6 M 0 -30 L 0 -6 M 18 -30 L 18 -6" stroke="#2fae5a" stroke-width="5"/><rect x="-24" y="24" width="48" height="28" rx="6" fill="#fff"/><path d="M -36 -4 Q -50 -10 -46 10 L -36 16" fill="#fff"/>`,
};
// one card: i = 0..4, rot degrees, s scale, op opacity; o.label shows the name; o.burn 0..1 dissolves it (the sixth pushes one out)
export function card(x, y, i, rot = 0, s = 1, op = 1, o = {}) {
  const c = CARDS[i % 5], bn = o.burn || 0;
  return `<g opacity="${f(op * (1 - bn))}" transform="translate(${f(x)} ${f(y - bn * 60)}) rotate(${f(rot)}) scale(${f(s * (1 - bn * 0.3))})"><rect x="-74" y="-104" width="148" height="208" rx="16" fill="${c.col}" stroke="#fff" stroke-width="7"/><rect x="-60" y="-90" width="120" height="180" rx="10" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/><g transform="translate(0 -14)">${ICON[c.icon]}</g>${o.label !== false ? `<text x="0" y="78" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${c.name.length > 8 ? 17 : 20}" fill="#fff">${c.name}</text>` : ''}</g>`;
}
// five cards fanning out of a point (a hand); k 0..1 = how far they've spread
export function fan(x, y, s, k, tt, o = {}) {
  let g = ''; const R = 230 * s * k;
  for (let i = 0; i < 5; i++) { const a = (-70 + i * 35) * Math.PI / 180, bx = x + Math.sin(a) * R, by = y - Math.cos(a) * R * 0.9 + Math.sin(tt * 2 + i) * 6;
    g += card(bx, by, o.order ? o.order[i] : i, (-28 + i * 14) * k, s * (0.5 + 0.5 * k), Math.min(1, k * 2), { label: o.label }); }
  return g;
}
// a red torii gate silhouette (x = centre, y = ground)
export const torii = (x, y, s = 1, col = '#c8352e') => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><rect x="-150" y="-330" width="30" height="330" fill="${col}"/><rect x="120" y="-330" width="30" height="330" fill="${col}"/><path d="M -230 -350 Q 0 -380 230 -350 L 220 -320 Q 0 -345 -220 -320 Z" fill="${col}"/><rect x="-190" y="-290" width="380" height="22" fill="${col}"/><rect x="-14" y="-320" width="28" height="40" fill="${col}"/><rect x="-230" y="-358" width="460" height="10" fill="#1c1e26"/></g>`;
// the paper sheet with the list of five (stuck on the wardrobe)
export const sheet = (x, y, s = 1, k = 1, rot = -3) => { const L = ['LOCKSMITH', 'SWIMMER', 'CLIMBER', 'DRIVER', 'STRONGMAN'];
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot}) scale(${s})"><rect x="-150" y="-200" width="300" height="400" fill="#fbf8ee" stroke="#cfc6b0" stroke-width="3"/><rect x="-40" y="-214" width="80" height="26" fill="#e8d88a" opacity="0.8"/><text x="0" y="-140" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="26" fill="#2a2d3a">KEEP (5)</text>${L.map((l, i) => `<text x="-120" y="${-80 + i * 60}" font-family="IBM Plex Mono" font-weight="700" font-size="28" fill="#2a3a7a" opacity="${f(Math.min(1, Math.max(0, k * 5 - i)))}">${i + 1}. ${l}</text>`).join('')}</g>`; };
// a guitar (x,y = bottom), rot degrees
export const guitar = (x, y, s = 1, rot = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s})"><rect x="-10" y="-330" width="20" height="200" fill="#5a3a24"/><rect x="-16" y="-370" width="32" height="50" rx="6" fill="#3a2414"/><ellipse cx="0" cy="-90" rx="70" ry="60" fill="#c8803a" stroke="#6a3a1a" stroke-width="4"/><ellipse cx="0" cy="-30" rx="86" ry="66" fill="#c8803a" stroke="#6a3a1a" stroke-width="4"/><circle cx="0" cy="-80" r="20" fill="#2a1a10"/><rect x="-28" y="-30" width="56" height="10" fill="#3a2414"/>${[-6, -2, 2, 6].map((d) => `<line x1="${d}" y1="-360" x2="${d}" y2="-26" stroke="#e8e2d4" stroke-width="1.5"/>`).join('')}</g>`;
// an inflatable clown doll (generic, our own) for the 1961 study card; tilt degrees
export const doll = (x, y, s = 1, tilt = 0) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s}) rotate(${f(tilt)} 0 0)"><ellipse cx="0" cy="-110" rx="100" ry="120" fill="#e8452e" stroke="#fff" stroke-width="5"/><circle cx="0" cy="-270" r="70" fill="#f4f1ea" stroke="#fff" stroke-width="5"/><circle cx="-24" cy="-282" r="8" fill="#1c1e26"/><circle cx="24" cy="-282" r="8" fill="#1c1e26"/><circle cx="0" cy="-258" r="14" fill="#e8452e"/><path d="M -30 -236 Q 0 -216 30 -236" stroke="#1c1e26" stroke-width="5" fill="none"/><path d="M -60 -320 L 0 -390 L 60 -320 Z" fill="#2f86e0"/><circle cx="-40" cy="-100" r="16" fill="#ffd23f"/><circle cx="36" cy="-60" r="16" fill="#ffd23f"/></g>`;
// a city bus, side view (x = centre, y = road); sub 0..1 = how far it is under water (drawn separately by the tunnel)
export function bus(x, y, s = 1, o = {}) {
  let g = `<rect x="-420" y="-300" width="840" height="270" rx="30" fill="#f4c23a" stroke="#1c1e26" stroke-width="6"/><rect x="-420" y="-110" width="840" height="30" fill="#2a6ad0"/>`;
  for (let i = 0; i < 6; i++) g += `<rect x="${-380 + i * 128}" y="-270" width="108" height="110" rx="10" fill="#9fd8ff" stroke="#1c1e26" stroke-width="4"/>`;
  if (o.faces) for (let i = 0; i < 6; i++) g += `<circle cx="${-326 + i * 128}" cy="-200" r="22" fill="${['#f0c8a0', '#c89a70', '#8a5a3a', '#f0d0b0', '#a8784a', '#e0b090'][i]}"/><rect x="${-346 + i * 128}" y="-178" width="40" height="18" rx="6" fill="${['#e8452e', '#2f86e0', '#4fd06a', '#ffd23f', '#9a5cc0', '#ff8a3a'][i]}"/>`;
  g += `<rect x="370" y="-270" width="40" height="230" rx="6" fill="#d8a82a" stroke="#1c1e26" stroke-width="4"/><circle cx="-280" cy="-20" r="56" fill="#1c1e26"/><circle cx="280" cy="-20" r="56" fill="#1c1e26"/><circle cx="-280" cy="-20" r="22" fill="#9aa3ad"/><circle cx="280" cy="-20" r="22" fill="#9aa3ad"/>`;
  g += `<rect x="-300" y="-330" width="300" height="30" rx="8" fill="#e8b02a" stroke="#1c1e26" stroke-width="4"/>`;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">${g}</g>`;
}

// ---------- sets ----------
// an indoor climbing gym: an overhanging wall with coloured holds, crash mats, ropes
export function climbWall(tt, o = {}) {
  const FLOOR = 860; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#3a4a5e"/>`;
  back += `<path d="M 400 -300 L 1700 -300 L 1600 ${FLOOR} L 500 ${FLOOR} Z" fill="#d8dce4"/><path d="M 1700 -300 L 2200 -300 L 2100 ${FLOOR} L 1600 ${FLOOR} Z" fill="#b8bec8"/>`;
  const C = ['#e8452e', '#2f86e0', '#ffd23f', '#4fd06a', '#9a5cc0', '#ff8a3a'];
  for (let i = 0; i < 60; i++) { const hx = 460 + rnd(i) * 1650, hy = -260 + rnd(i * 3 + 1) * (FLOOR + 200); back += `<ellipse cx="${f(hx)}" cy="${f(hy)}" rx="${f(14 + rnd(i * 5) * 16)}" ry="${f(10 + rnd(i * 7) * 10)}" fill="${C[i % 6]}"/>`; }
  back += `<path d="M 980 -300 L 980 ${FLOOR}" stroke="#e8e2d4" stroke-width="5" opacity="0.7"/><path d="M 1400 -300 L 1400 ${FLOOR}" stroke="#e8452e" stroke-width="5" opacity="0.7"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#2a2d3a"/><rect x="300" y="${FLOOR - 10}" width="1900" height="70" rx="14" fill="#2f86e0"/>`;
  return { bg: '#3a4a5e', back, mid: '', floor, FLOOR, blur: 2, vig: 0.4 };
}
// a meeting room at work: a screen with a slide, a long table edge, rows of chairs
export function meeting(tt, o = {}) {
  const FLOOR = 850; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#e4e0d8"/><rect x="-600" y="${FLOOR - 60}" width="3120" height="60" fill="#c8c0b0"/>`;
  back += `<rect x="200" y="140" width="760" height="440" rx="8" fill="#1c1e26"/><rect x="220" y="160" width="720" height="400" fill="#f4f6f8"/><text x="260" y="240" font-family="Inter" font-weight="900" font-size="46" fill="#2a3a7a">Q3 PLAN</text><rect x="260" y="290" width="${f(400 + 200 * (o.k || 0))}" height="40" fill="#3fb8e0"/><rect x="260" y="350" width="300" height="40" fill="#e0b44a"/><rect x="260" y="410" width="500" height="40" fill="#4fd06a"/>`;
  back += `<rect x="1300" y="160" width="520" height="360" fill="#bfe4f6" stroke="#f4f1ea" stroke-width="14"/><rect x="1554" y="160" width="12" height="360" fill="#f4f1ea"/>`;
  return { bg: '#e4e0d8', back, mid: '', floor: `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#6a7a8a"/>`, FLOOR, blur: 2, chairs: (x) => `<rect x="${x - 50}" y="${FLOOR - 120}" width="100" height="16" rx="6" fill="#2a2d3a"/><rect x="${x + 36}" y="${FLOOR - 240}" width="14" height="130" fill="#2a2d3a"/><rect x="${x - 4}" y="${FLOOR - 104}" width="8" height="104" fill="#2a2d3a"/>` };
}
// a dance studio: wooden floor, a mirror wall with a barre; o.stage = the stage at night (curtains, spotlight)
export function studio(tt, o = {}) {
  const FLOOR = 860;
  if (o.stage) { let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#0b0b14"/>`;
    back += `<path d="M -600 -300 L 120 -300 Q 60 400 160 ${FLOOR} L -600 ${FLOOR} Z" fill="#7a1a2a"/><path d="M 2520 -300 L 1800 -300 Q 1860 400 1760 ${FLOOR} L 2520 ${FLOOR} Z" fill="#7a1a2a"/>` + [...Array(6)].map((_, i) => `<path d="M ${-500 + i * 110} -300 Q ${-520 + i * 110} 300 ${-480 + i * 110} ${FLOOR}" stroke="#5a1220" stroke-width="10" fill="none"/>`).join('');
    back += `<path d="M 960 -300 L ${f(560)} ${FLOOR} L ${f(1360)} ${FLOOR} Z" fill="#fff6d8" opacity="0.16"/>`;
    const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#3a2a20"/><ellipse cx="960" cy="${FLOOR + 40}" rx="420" ry="60" fill="#fff6d8" opacity="0.3"/>` + [...Array(10)].map((_, i) => `<circle cx="${-200 + i * 260}" cy="${FLOOR + 400}" r="60" fill="#14141f"/>`).join('');
    return { bg: '#0b0b14', back, mid: '', floor, FLOOR, blur: 2, vig: 0.75, reflect: false }; }
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#e8d8c8"/><rect x="100" y="120" width="1700" height="${FLOOR - 160}" fill="#cfe0ec" stroke="#b8a898" stroke-width="10"/>`;
  for (let i = 0; i < 5; i++) back += `<rect x="${140 + i * 340}" y="130" width="60" height="${FLOOR - 180}" fill="#fff" opacity="0.25" transform="skewX(-10)"/>`;
  back += `<rect x="100" y="${FLOOR - 330}" width="1700" height="14" rx="7" fill="#8a5a3a"/>` + [300, 900, 1500].map((x) => `<rect x="${x}" y="${FLOOR - 320}" width="10" height="80" fill="#8a5a3a"/>`).join('');
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#c8945a"/>` + [...Array(16)].map((_, i) => `<rect x="${-600 + i * 200}" y="${FLOOR}" width="4" height="600" fill="#a8743a"/>`).join('');
  return { bg: '#e8d8c8', back, mid: '', floor, FLOOR, blur: 2, reflOp: 0.14 };
}
// a park in the afternoon with a stone chess table in the middle (board at x 960)
export function chessPark(tt, o = {}) {
  const FLOOR = 820; let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#a8d4ea"/>`;
  for (let i = 0; i < 7; i++) { const x = -300 + i * 420; back += `<rect x="${x}" y="${FLOOR - 300}" width="34" height="300" fill="#6a4a3a"/><circle cx="${x + 17}" cy="${FLOOR - 360}" r="${130 + rnd(i) * 30}" fill="${['#4f9a5a', '#3f8a4a', '#5aa866'][i % 3]}"/>`; }
  back += `<rect x="-600" y="${FLOOR - 40}" width="3120" height="40" fill="#8ab866"/>`;
  let mid = `<rect x="900" y="${FLOOR - 170}" width="120" height="170" fill="#9aa3ad"/><rect x="760" y="${FLOOR - 200}" width="400" height="40" rx="8" fill="#b8c0c8"/>`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) mid += `<rect x="${800 + c * 40}" y="${FLOOR - 212 + r * 6}" width="40" height="6" fill="${(r + c) % 2 ? '#2a2d3a' : '#f4f1ea'}"/>`;
  for (let i = 0; i < 6; i++) mid += `<rect x="${806 + i * 52}" y="${FLOOR - 236 - (i % 2) * 8}" width="14" height="${24 + (i % 2) * 8}" rx="4" fill="${i < 3 ? '#f4f1ea' : '#1c1e26'}" stroke="#5a6070" stroke-width="2"/>`;
  mid += `<rect x="560" y="${FLOOR - 90}" width="140" height="90" rx="6" fill="#8a909e"/><rect x="1220" y="${FLOOR - 90}" width="140" height="90" rx="6" fill="#8a909e"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#d8c8a8"/>` + [...Array(14)].map((_, i) => `<rect x="${-600 + i * 230}" y="${FLOOR}" width="4" height="600" fill="#c0b090"/>`).join('');
  return { bg: '#a8d4ea', back, mid, floor, FLOOR, blur: 3, vig: 0.3, reflect: false };
}
// a residential pavement in the late afternoon: terraced houses, a lamp post, a kerb
export function pavement(tt, o = {}) {
  const FLOOR = 830; let back = `<defs><linearGradient id="pvs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ab8e0"/><stop offset="1" stop-color="#f0d8b8"/></linearGradient></defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#pvs)"/>`;
  for (let i = 0; i < 8; i++) { const x = -500 + i * 380, c = ['#b86a4a', '#c88a5a', '#a85a44', '#d8a070'][i % 4]; back += `<rect x="${x}" y="${FLOOR - 520}" width="360" height="520" fill="${c}"/><path d="M ${x - 10} ${FLOOR - 520} L ${x + 180} ${FLOOR - 640} L ${x + 370} ${FLOOR - 520} Z" fill="#5a4a4a"/><rect x="${x + 40}" y="${FLOOR - 440}" width="110" height="120" fill="#e8eef4"/><rect x="${x + 210}" y="${FLOOR - 440}" width="110" height="120" fill="#e8eef4"/><rect x="${x + 140}" y="${FLOOR - 200}" width="90" height="200" fill="${['#2a3a7a', '#2f7a4a', '#7a1a2a'][i % 3]}"/>`; }
  let mid = `<rect x="1560" y="${FLOOR - 460}" width="14" height="460" fill="#2a2d3a"/><rect x="1530" y="${FLOOR - 480}" width="74" height="24" rx="6" fill="#2a2d3a"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="160" fill="#b8b4ac"/>` + [...Array(12)].map((_, i) => `<rect x="${-600 + i * 280}" y="${FLOOR}" width="4" height="160" fill="#9a968e"/>`).join('') + `<rect x="-600" y="${FLOOR + 160}" width="3120" height="20" fill="#d8d4cc"/><rect x="-600" y="${FLOOR + 180}" width="3120" height="500" fill="#3a3a48"/>`;
  return { bg: '#8ab8e0', back, mid, floor, FLOOR, blur: 3, vig: 0.35, reflect: false };
}
// a flooded underpass in heavy rain at night: tiled walls, a stopped bus half under water; water = surface y
export function tunnel(tt, o = {}) {
  const FLOOR = 900, W = o.water ?? 720, calm = o.calm || 0;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#141a2a"/><path d="M -600 120 Q 960 -120 2520 120 L 2520 -300 L -600 -300 Z" fill="#0a0e18"/>`;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 26; c++) back += `<rect x="${-600 + c * 120 + (r % 2) * 60}" y="${160 + r * 90}" width="116" height="86" fill="#26324a" opacity="0.7"/>`;
  for (let i = 0; i < 6; i++) back += `<rect x="${-300 + i * 480}" y="140" width="200" height="16" rx="6" fill="#ffe8a8" opacity="0.8"/><defs>${glow('tl' + i, '#ffe8a8', 0.4)}</defs><ellipse cx="${-200 + i * 480}" cy="160" rx="200" ry="90" fill="url(#tl${i})"/>`;
  let mid = o.bus === false ? '' : bus(o.busX ?? 1150, FLOOR - 20, 1.0, { faces: o.faces });
  // the water: a dark band that covers the lower part of the bus; ripples stop when calm = 1
  let water = `<rect x="-600" y="${W}" width="3120" height="${FLOOR + 600 - W}" fill="#1a3a5a" opacity="0.86"/>`;
  for (let i = 0; i < 14; i++) water += `<path d="M ${-600 + i * 230} ${f(W + 2 + Math.sin(tt * 3 + i) * 6 * (1 - calm))} q 60 ${f(-10 * (1 - calm))} 120 0" stroke="#8ac8f0" stroke-width="4" fill="none" opacity="0.5"/>`;
  // rain streaks (lighter when calm)
  let rain = ''; for (let i = 0; i < 70; i++) { const x = rnd(i) * 2400 - 240, y = ((rnd(i * 3) * 1200 + tt * 1400) % 1300) - 200; rain += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 14)}" y2="${f(y + 60)}" stroke="#bfe4ff" stroke-width="3" opacity="${f(0.45 * (1 - calm * 0.7))}"/>`; }
  return { bg: '#141a2a', back, mid, floor: `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#2a2d3a"/>`, front: water + rain, FLOOR, blur: 2, vig: 0.65, reflect: false, W };
}
