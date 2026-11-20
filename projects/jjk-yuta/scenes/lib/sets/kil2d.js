// Flat 2D sets and props for the Killua video (our own designs; nothing from the manga/anime): a lift stuck in a blackout,
// an aquarium tunnel with an electric eel, a funfair Ferris wheel in a storm, a park, plus electric arcs, sparks, a glass
// with a leaf, a pram, a football and a reaction-test screen.
import { glow } from '../flat2d.js';
import { city } from '../city2d.js';
const f = (n) => n.toFixed(1);
export const OL = '#b9dcff', BLUE = '#7fe3ff';
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// jagged electric arc from (x1,y1) to (x2,y2); seed + time make it flicker
export function bolt(x1, y1, x2, y2, seed = 1, tt = 0, o = {}) {
  const n = o.n || 9, j = o.j ?? 26, fr = Math.floor(tt * 24); let d = `M ${f(x1)} ${f(y1)}`;
  for (let i = 1; i < n; i++) { const k = i / n, nx = -(y2 - y1), ny = x2 - x1, L = Math.hypot(nx, ny) || 1, r = (rnd(seed * 31 + i * 7 + fr) - 0.5) * 2 * j;
    d += ` L ${f(x1 + (x2 - x1) * k + nx / L * r)} ${f(y1 + (y2 - y1) * k + ny / L * r)}`; }
  d += ` L ${f(x2)} ${f(y2)}`; const w = o.w || 6;
  return `<path d="${d}" stroke="${BLUE}" stroke-width="${w * 3}" fill="none" opacity="0.25" stroke-linejoin="round"/><path d="${d}" stroke="#ffffff" stroke-width="${w}" fill="none" stroke-linejoin="round"/>`;
}
// crackling glow around a point (a hand): k = 0..1 strength
export function spark(x, y, k = 1, tt = 0, seed = 1) {
  if (k <= 0) return ''; let g = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(60 * k)}" fill="${BLUE}" opacity="${f(0.35 * k)}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(22 * k)}" fill="#ffffff" opacity="${f(0.8 * k)}"/>`;
  for (let i = 0; i < 4; i++) { const a = rnd(seed + i * 3 + Math.floor(tt * 18)) * Math.PI * 2, r = (60 + 50 * rnd(seed + i)) * k; g += bolt(x, y, x + Math.cos(a) * r, y + Math.sin(a) * r, seed + i, tt, { n: 4, j: 10 * k, w: 3 }); }
  return g;
}
// hair-on-end lines above a head point
export const static_ = (x, y, tt) => [...Array(7)].map((_, i) => { const a = -Math.PI / 2 + (i - 3) * 0.32, w = Math.sin(tt * 30 + i) * 4; return `<line x1="${f(x + Math.cos(a) * 60)}" y1="${f(y + Math.sin(a) * 60)}" x2="${f(x + Math.cos(a) * 92 + w)}" y2="${f(y + Math.sin(a) * 92)}" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8"/>`; }).join('');

// a lift car in a blackout: steel walls, a button panel (right), an emergency light; o.lights 0..1 = power back
export function lift(tt, o = {}) {
  const FLOOR = 860, L = o.lights ?? 0, flick = L > 0.5 ? 1 : 0.55 + 0.45 * (Math.sin(tt * 23) > 0.2 ? 1 : 0.3);
  let back = `<defs>${glow('el', L > 0.5 ? '#fff6dc' : '#ff5a4a', 0.8)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="${L > 0.5 ? '#8a98a8' : '#3a2a34'}"/>`;
  for (let x = -600; x < 2520; x += 240) back += `<rect x="${x}" y="80" width="230" height="${FLOOR - 120}" rx="6" fill="#ffffff" opacity="0.06"/><rect x="${x + 6}" y="86" width="6" height="${FLOOR - 130}" fill="#ffffff" opacity="0.12"/>`;
  back += `<rect x="-600" y="${FLOOR - 300}" width="3120" height="14" fill="#c8ccd4" opacity="0.5"/>`;
  back += `<ellipse cx="960" cy="40" rx="${L > 0.5 ? 700 : 300}" ry="${L > 0.5 ? 300 : 160}" fill="url(#el)" opacity="${f(0.8 * flick)}"/><rect x="900" y="30" width="120" height="20" rx="8" fill="${L > 0.5 ? '#fffbe8' : '#ff5a4a'}" opacity="${f(flick)}"/>`;
  // floor indicator
  back += `<rect x="860" y="110" width="200" height="70" rx="8" fill="#15181e"/><text x="960" y="160" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="${L > 0.5 ? '#ffd23f' : '#5a2a2a'}">${L > 0.5 ? (o.floor || '8 ▲') : '7 · 8'}</text>`;
  let mid = `<rect x="1380" y="300" width="170" height="380" rx="10" fill="#b8c0cc" stroke="#6a7280" stroke-width="4"/>`;
  for (let i = 0; i < 10; i++) { const x = 1420 + (i % 2) * 90, y = 340 + Math.floor(i / 2) * 64; mid += `<circle cx="${x}" cy="${y}" r="22" fill="${L > 0.5 && i === 7 ? '#ffd23f' : '#e8ecf2'}" stroke="#6a7280" stroke-width="3"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="20" fill="#3a3a48">${i + 1}</text>`; }
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="${L > 0.5 ? '#5a5a66' : '#2a2028'}"/>`;
  const front = L > 0.5 ? '' : `<rect x="-3000" y="-2000" width="8000" height="5000" fill="#1a0610" opacity="0.35"/>`;
  return { back, mid, floor, front, FLOOR, bg: '#3a2a34', blur: 1.2, reflOp: 0.08, tex: 0.18 };
}
// a public aquarium: a long dark tank with an electric eel; o.zap = 0..1 discharge
export function aquarium(tt, o = {}) {
  const FLOOR = 860, z = o.zap || 0;
  let back = `<defs><linearGradient id="aq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e3a5a"/><stop offset="1" stop-color="#06182a"/></linearGradient>${glow('ag', '#5fd0ff', 0.5)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#0a1424"/>`;
  back += `<rect x="-200" y="160" width="2320" height="600" rx="20" fill="url(#aq)" stroke="#2a4a6a" stroke-width="16"/>`;
  for (let i = 0; i < 14; i++) back += `<circle cx="${f(-100 + i * 170 + Math.sin(tt + i) * 10)}" cy="${f(740 - ((tt * 40 + i * 53) % 560))}" r="${4 + (i % 3) * 3}" fill="#bfe8ff" opacity="0.35"/>`;
  for (let i = 0; i < 9; i++) back += `<path d="M ${-100 + i * 260} 760 q 20 -${120 + (i % 3) * 50} ${-10 + (i % 2) * 30} -${200 + (i % 4) * 40}" stroke="#2a7a5a" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  back += `<ellipse cx="960" cy="200" rx="900" ry="200" fill="url(#ag)" opacity="0.35"/>`;
  // the eel: a long dark body that slowly undulates
  const ex = 500 + ((tt * 60) % 900); let d = '';
  for (let i = 0; i <= 20; i++) { const x = ex + i * 30, y = 470 + Math.sin(tt * 2 + i * 0.5) * 22; d += (i ? ' L ' : 'M ') + f(x) + ' ' + f(y); }
  let mid = `<path d="${d}" stroke="#3a3428" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="#5a4e3a" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.7"/><circle cx="${f(ex + 600)}" cy="${f(470 + Math.sin(tt * 2 + 10) * 22)}" r="5" fill="#ffd23f"/>`;
  if (z > 0) for (let i = 0; i < 5; i++) mid += bolt(ex + 100 + i * 100, 470, ex + 100 + i * 100 + (rnd(i) - 0.5) * 200, 300 + rnd(i + 9) * 340, 40 + i, tt, { w: 4, j: 20 });
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#0c1220"/><rect x="-600" y="${FLOOR}" width="3120" height="8" fill="#2a4a6a" opacity="0.6"/>`;
  return { back, mid, floor, FLOOR, bg: '#0a1424', blur: 1.2, reflOp: 0.12, tex: 0.15 };
}
// a funfair at night in a storm: a big Ferris wheel (rot = turn, lit = 0..1), a control box, rain
export function funfair(tt, o = {}) {
  const FLOOR = 860, lit = o.lit ?? 0, rot = o.rot || 0, CX = 1240, CY = 420, R = 330;
  let back = `<defs><linearGradient id="fn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0a24"/><stop offset="1" stop-color="#2a1f5e"/></linearGradient>${glow('fl', '#ffd27a', 0.7)}</defs><rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#fn)"/>`;
  back += city({ vp: [960, 700], ground: 740, fog: '#2a1f5e', lit: '#ffd27a', litP: 0.03, pal: ['#1c2460', '#2a1f5e', '#18306a'], layers: [{ n: 9, x0: -800, x1: 2700, hmin: 120, hmax: 260, wmin: 140, wmax: 220, haze: 0.5, seed: 7 }] });
  const fl = (Math.sin(tt * 1.7) > 0.96) ? 0.5 : 0; if (fl) back += `<rect x="-900" y="-500" width="3720" height="1600" fill="#ffffff" opacity="${fl}"/>`;
  let mid = `<path d="M ${CX - 220} ${FLOOR} L ${CX} ${CY} L ${CX + 220} ${FLOOR}" stroke="#6a6a88" stroke-width="22" fill="none"/>`;
  mid += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#8a8aa8" stroke-width="12"/><circle cx="${CX}" cy="${CY}" r="${R - 40}" fill="none" stroke="#6a6a88" stroke-width="5"/>`;
  for (let i = 0; i < 12; i++) { const a = rot + i * Math.PI / 6, x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R;
    mid += `<line x1="${CX}" y1="${CY}" x2="${f(x)}" y2="${f(y)}" stroke="#6a6a88" stroke-width="5"/><circle cx="${f(x)}" cy="${f(y)}" r="8" fill="${lit ? '#ffd27a' : '#3a3a58'}"/>`;
    const sw = Math.sin(tt * 2.2 + i) * (lit ? 2 : 7); mid += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(sw)})"><line x1="0" y1="0" x2="0" y2="22" stroke="#9a9ab8" stroke-width="4"/><rect x="-40" y="22" width="80" height="58" rx="12" fill="${['#e8452e', '#2a9a8e', '#ffb21a', '#9a5cc0'][i % 4]}" stroke="${OL}" stroke-width="3"/><rect x="-30" y="30" width="60" height="22" rx="5" fill="${lit ? '#fff1c8' : '#1a1430'}"/></g>`; }
  mid += `<circle cx="${CX}" cy="${CY}" r="26" fill="#9a9ab8"/>`;
  if (lit) mid += `<ellipse cx="${CX}" cy="${CY}" rx="${R + 120}" ry="${R + 120}" fill="url(#fl)" opacity="${f(0.35 * lit)}"/>`;
  // control box + platform
  mid += `<rect x="${CX - 300}" y="${FLOOR - 40}" width="600" height="40" fill="#4a4a62"/><rect x="560" y="${FLOOR - 230}" width="150" height="230" rx="8" fill="#5a6a7a" stroke="${OL}" stroke-width="4"/><rect x="580" y="${FLOOR - 210}" width="110" height="60" rx="4" fill="${lit ? '#4fd06a' : '#1a2a2a'}"/><circle cx="610" cy="${FLOOR - 110}" r="14" fill="#e8452e"/><circle cx="660" cy="${FLOOR - 110}" r="14" fill="#ffd23f"/>`;
  let front = ''; for (let i = 0; i < 70; i++) { const x = -200 + (i * 151) % 2400, y = ((i * 89 + tt * 1300) % 1300) - 150; front += `<line x1="${x}" y1="${f(y)}" x2="${x - 14}" y2="${f(y + 44)}" stroke="#9fd8ff" stroke-width="2.5" opacity="0.45"/>`; }
  const floor = `<rect x="-900" y="${FLOOR}" width="3720" height="600" fill="#1a1630"/>`;
  return { back, mid, floor, front, FLOOR, bg: '#0c0a24', blur: 1.4, reflOp: 0.16, tex: 0.15 };
}
// a glass of water with a leaf; k = how much the water ripples
export const glassLeaf = (x, y, s = 1, k = 0, tt = 0) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><path d="M -60 -120 L 60 -120 L 50 40 L -50 40 Z" fill="#cfefff" opacity="0.45" stroke="#ffffff" stroke-width="5"/><path d="M -56 -70 Q ${f(-20 + Math.sin(tt * 14) * 12 * k)} ${f(-80 - 10 * k)} 0 -70 T 56 -70 L 50 40 L -50 40 Z" fill="#7fc8ff" opacity="0.6"/><path d="M ${f(-24 + Math.sin(tt * 9) * 10 * k)} -78 q 24 -22 48 0 q -24 16 -48 0 Z" fill="#4fa04a" stroke="#2a6a2a" stroke-width="3"/>${k > 0.3 ? [0, 1, 2].map((i) => `<ellipse cx="0" cy="-70" rx="${f(10 + ((tt * 60 + i * 18) % 54))}" ry="${f(3 + ((tt * 20 + i * 6) % 14))}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6"/>`).join('') : ''}</g>`;
export const pram = (x, y) => `<g transform="translate(${x} ${y})"><path d="M -90 -150 Q -90 -60 0 -60 L 90 -60 L 90 -110 Q 40 -170 -90 -150 Z" fill="#9a5cc0" stroke="${OL}" stroke-width="4"/><rect x="-100" y="-62" width="200" height="24" rx="10" fill="#7a4aa0"/><line x1="100" y1="-60" x2="150" y2="-140" stroke="#3a3a48" stroke-width="8"/><circle cx="-60" cy="-14" r="24" fill="#2a2d3a" stroke="${OL}" stroke-width="3"/><circle cx="60" cy="-14" r="24" fill="#2a2d3a" stroke="${OL}" stroke-width="3"/></g>`;
export const ball = (x, y, r = 30, rot = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><circle r="${r}" fill="#ffffff" stroke="#15181e" stroke-width="4"/><path d="M 0 ${-r * 0.45} l ${r * 0.42} ${r * 0.3} l ${-r * 0.16} ${r * 0.5} l ${-r * 0.52} 0 l ${-r * 0.16} ${-r * 0.5} Z" fill="#15181e"/></g>`;
// a reaction-test screen: a light that turns from red to green (g = 0..1), with a small timer readout
export const reactScreen = (x, y, g, ms) => `<g transform="translate(${x} ${y})"><rect x="-200" y="-150" width="400" height="300" rx="16" fill="#15181e" stroke="${OL}" stroke-width="5"/><circle cx="0" cy="-20" r="80" fill="${g > 0.5 ? '#4fd06a' : '#e8452e'}"/><text x="0" y="110" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="#ffffff">${ms}</text></g>`;
// a small goal frame for five-a-side
export const goal = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-200" y="-200" width="400" height="200" fill="none" stroke="#ffffff" stroke-width="12"/>${[...Array(9)].map((_, i) => `<line x1="${-200 + i * 50}" y1="-200" x2="${-200 + i * 50}" y2="0" stroke="#ffffff" stroke-width="2" opacity="0.4"/>`).join('')}${[...Array(4)].map((_, i) => `<line x1="-200" y1="${-200 + i * 50}" x2="200" y2="${-200 + i * 50}" stroke="#ffffff" stroke-width="2" opacity="0.4"/>`).join('')}</g>`;
