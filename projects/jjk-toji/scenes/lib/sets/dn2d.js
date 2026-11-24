// Flat 2D sets and props for the Death Note video (our own designs; nothing from the manga/anime).
import { glow } from '../flat2d.js';
import { city, building, mix } from '../city2d.js';
const f = (n) => n.toFixed(1);
export const OL = '#b9dcff', INK = '#00000d';

// the notebook: plain black hardcover with two words in a simple serif; o.open shows ruled pages
export function notebook(x, y, s = 1, o = {}) {
  if (o.open) return `<g transform="translate(${f(x)} ${f(y)}) scale(${s}) rotate(${o.rot || 0})"><rect x="-150" y="-100" width="300" height="200" rx="8" fill="#15151c" stroke="${OL}" stroke-width="4"/><rect x="-142" y="-92" width="138" height="184" fill="#f2ecdc"/><rect x="4" y="-92" width="138" height="184" fill="#f2ecdc"/>${[...Array(9)].map((_, i) => `<line x1="-134" y1="${-70 + i * 18}" x2="-12" y2="${-70 + i * 18}" stroke="#c9c0aa" stroke-width="2"/><line x1="12" y1="${-70 + i * 18}" x2="134" y2="${-70 + i * 18}" stroke="#c9c0aa" stroke-width="2"/>`).join('')}${o.text ? o.text.split('|').map((l, i) => `<text x="73" y="${-60 + i * 20}" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="15" fill="#8a1a1a">${l}</text>`).join('') : ''}</g>`;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${s}) rotate(${o.rot || 0})"><rect x="-70" y="-95" width="140" height="190" rx="8" fill="#15151c" stroke="${OL}" stroke-width="4"/><rect x="-70" y="-95" width="14" height="190" fill="#22222c"/><text x="6" y="-20" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="#f2ecdc" letter-spacing="2">DEATH</text><text x="6" y="14" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="#f2ecdc" letter-spacing="2">NOTE</text></g>`;
}
// darken a set for night scenes, with a warm lamp pool at (lx, ly)
export function night(S, lx = 900, ly = 500, k = 0.55) {
  S.mid = (S.mid || '') + `<defs>${glow('nl', '#ffd8a0', 0.7)}</defs>`;
  S.front = (S.front || '') + `<rect x="-3000" y="-2000" width="8000" height="5000" fill="#0a0c24" opacity="${k}"/><ellipse cx="${lx}" cy="${ly}" rx="520" ry="420" fill="url(#nl)" opacity="0.55"/>`;
  return S;
}
// laundromat at 11 pm: a row of washing machines, a lost-and-found box on a dryer, rain on the window
export function laundromat(tt, o = {}) {
  const FLOOR = 840;
  let back = `<defs>${glow('lw', '#e8f6ff', 0.7)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#3f8a9a"/>`;
  for (let y = 0; y < FLOOR; y += 60) back += `<rect x="-600" y="${y}" width="3120" height="2" fill="#ffffff" opacity="0.06"/>`;
  back += `<rect x="1300" y="120" width="600" height="380" fill="#0c1430"/><g><clipPath id="lc"><rect x="1300" y="120" width="600" height="380"/></clipPath><g clip-path="url(#lc)">${city({ vp: [1600, 480], ground: 520, fog: '#1a2450', lit: '#ffd27a', litP: 0.3, pal: ['#1c2460', '#2a1f5e', '#18306a'], layers: [{ n: 6, x0: 1250, x1: 1950, hmin: 160, hmax: 340, wmin: 70, wmax: 120, haze: 0.4, seed: 151, depth: 0.08, style: 'tower', litP: 0.3 }] })}</g></g>`;
  for (let i = 0; i < 30; i++) { const x = 1300 + (i * 97) % 600, y = 120 + ((i * 53 + tt * 500) % 380); back += `<line x1="${x}" y1="${f(y)}" x2="${x - 6}" y2="${f(y + 26)}" stroke="#9fd8ff" stroke-width="2" opacity="0.6"/>`; }
  back += `<rect x="1290" y="110" width="620" height="400" fill="none" stroke="#e8eef4" stroke-width="14"/>`;
  for (const x of [200, 900, 1600]) back += `<ellipse cx="${x}" cy="30" rx="260" ry="140" fill="url(#lw)" opacity="0.6"/><rect x="${x - 110}" y="20" width="220" height="12" rx="6" fill="#f4fbff"/>`;
  let mid = '';
  for (let i = 0; i < 6; i++) { const x = -100 + i * 220; mid += `<rect x="${x}" y="${FLOOR - 260}" width="200" height="260" rx="14" fill="#e8eef4" stroke="#b8c4cc" stroke-width="4"/><circle cx="${x + 100}" cy="${FLOOR - 120}" r="70" fill="#2a3a5a" stroke="#9aa3ad" stroke-width="10"/><circle cx="${x + 100}" cy="${FLOOR - 120}" r="50" fill="#5a8ab8" opacity="${i === 2 ? 0.9 : 0.5}"/><rect x="${x + 20}" y="${FLOOR - 244}" width="70" height="20" rx="4" fill="#1c2438"/>`; }
  // lost-and-found box on the last dryer
  mid += `<rect x="1180" y="${FLOOR - 340}" width="200" height="80" rx="6" fill="#c9a06a" stroke="${OL}" stroke-width="3"/><text x="1280" y="${FLOOR - 290}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="18" fill="#3a2a10">LOST + FOUND</text>`;
  if (o.book !== false) mid += notebook(1280, FLOOR - 370, 0.42, { rot: -6 });
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#d8d0c4"/>`; for (let x = -600; x < 2520; x += 120) for (let y = FLOOR; y < 1400; y += 120) floor += `<rect x="${x + ((y / 120) % 2) * 60}" y="${y}" width="60" height="60" fill="#c0b8ac" opacity="0.5"/>`;
  return { back, mid, floor, FLOOR, bg: '#3f8a9a', blur: 1.4, reflOp: 0.12, tex: 0.2 };
}
// a small police interview room: one table, two chairs, a mirror window, a ceiling lamp
export function interview(tt, o = {}) {
  const FLOOR = 840;
  let back = `<defs>${glow('il', '#fff1c8', 0.8)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#5a6a72"/><rect x="-600" y="${FLOOR - 200}" width="3120" height="200" fill="#4a5860"/>`;
  back += `<rect x="1200" y="180" width="560" height="300" fill="#1c2430" stroke="#8a96a0" stroke-width="10"/><rect x="1220" y="200" width="160" height="260" fill="#ffffff" opacity="0.06"/>`;
  back += `<ellipse cx="960" cy="300" rx="560" ry="420" fill="url(#il)" opacity="0.6"/><path d="M 900 0 L 900 140 M 860 140 L 1020 140 L 980 180 L 900 180 Z" stroke="#2a3040" stroke-width="6" fill="#2a3040"/>`;
  let mid = `<rect x="640" y="${FLOOR - 200}" width="680" height="24" rx="8" fill="#8a7a6a"/><rect x="680" y="${FLOOR - 176}" width="18" height="176" fill="#5a4a3a"/><rect x="1260" y="${FLOOR - 176}" width="18" height="176" fill="#5a4a3a"/>`;
  mid += `<rect x="900" y="${FLOOR - 236}" width="200" height="30" rx="4" fill="#f4f1ea" stroke="${OL}" stroke-width="2"/><rect x="1140" y="${FLOOR - 250}" width="34" height="44" rx="4" fill="#f4f6f8"/>`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#3a4448"/>`;
  return { back, mid, floor, FLOOR, bg: '#5a6a72', blur: 1.2, reflOp: 0.08, tex: 0.2 };
}
// full-frame TV news card (headline + ticker); returns svg
export function newsTV(tt, head, sub, o = {}) {
  let g = `<rect x="200" y="120" width="1520" height="800" rx="24" fill="#15181e" stroke="${OL}" stroke-width="6"/><rect x="230" y="150" width="1460" height="740" fill="#2a3a6a"/>`;
  g += `<rect x="230" y="150" width="1460" height="520" fill="${o.bg || '#3a4a7a'}"/>` + (o.scene || '');
  g += `<rect x="230" y="670" width="1460" height="110" fill="#c8352e"/><text x="270" y="742" font-family="Inter" font-weight="900" font-size="54" fill="#ffffff">${head}</text><rect x="230" y="780" width="1460" height="110" fill="#f4f6f8"/><text x="270" y="848" font-family="Inter" font-weight="700" font-size="38" fill="#15181e">${sub}</text>`;
  g += `<rect x="1530" y="180" width="130" height="50" rx="6" fill="#c8352e"/><text x="1595" y="215" text-anchor="middle" font-family="Inter" font-weight="900" font-size="28" fill="#ffffff">LIVE</text>`;
  return `<rect width="1920" height="1080" fill="#0c0e18"/><g transform="translate(144 150) scale(0.85)">${g}</g>`;
}
// the shinigami: a tall, thin, faceless silhouette with two red eyes (our own design)
export function shinigami(x, y, h, tt) { const s = h / 600, sway = Math.sin(tt * 1.2) * 6;
  return `<g transform="translate(${f(x + sway)} ${f(y)}) scale(${f(s)})"><path d="M -60 0 C -80 -200 -40 -420 -10 -540 C 0 -580 40 -580 50 -540 C 80 -420 100 -200 70 0 Z" fill="#06060c" stroke="#3a3a5a" stroke-width="4"/><path d="M -40 -380 C -140 -300 -150 -160 -120 -60 M 50 -380 C 150 -300 160 -160 130 -60" stroke="#06060c" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="2" cy="-500" r="10" fill="#ff2a2a"/><circle cx="34" cy="-500" r="10" fill="#ff2a2a"/><circle cx="2" cy="-500" r="40" fill="#ff2a2a" opacity="0.15"/><circle cx="34" cy="-500" r="40" fill="#ff2a2a" opacity="0.15"/></g>`; }
// rooftop at dusk: low parapet, water tank, the city below with lights coming on (k = 0..1)
export function rooftop(tt, o = {}) {
  const FLOOR = 860, k = o.lights ?? 0.5;
  let back = `<defs><linearGradient id="rs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1f5e"/><stop offset="0.55" stop-color="#c0607a"/><stop offset="1" stop-color="#ffb07a"/></linearGradient>${glow('rsun', '#ffd08a', 0.8)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#rs)"/><ellipse cx="1500" cy="640" rx="420" ry="220" fill="url(#rsun)" opacity="0.7"/>`;
  back += city({ vp: [960, 700], ground: 760, fog: '#c07a8a', lit: '#ffd27a', litP: 0.05 + k * 0.5, pal: ['#3a2a6a', '#5a2f5e', '#2a3a72', '#4a2650'], layers: [
    { n: 12, x0: -700, x1: 2600, hmin: 220, hmax: 520, wmin: 120, wmax: 200, haze: 0.5, seed: 77, depth: 0.06, style: 'tower', litP: 0.05 + k * 0.4 },
    { n: 8, x0: -700, x1: 2600, hmin: 120, hmax: 260, wmin: 200, wmax: 320, haze: 0.2, seed: 79, depth: 0.1, style: 'apartment', litP: 0.05 + k * 0.6 }] });
  let mid = `<rect x="-600" y="${FLOOR - 70}" width="3120" height="70" fill="#5a4a6a"/><rect x="-600" y="${FLOOR - 78}" width="3120" height="12" fill="#7a6a8a"/>`;
  mid += `<g transform="translate(1580 ${FLOOR - 70})"><rect x="-90" y="-260" width="180" height="200" rx="20" fill="#6a5a7a" stroke="${OL}" stroke-width="3"/><rect x="-70" y="-60" width="12" height="60" fill="#4a3a5a"/><rect x="58" y="-60" width="12" height="60" fill="#4a3a5a"/></g>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#4a3f5a"/><rect x="-600" y="${FLOOR}" width="3120" height="8" fill="#3a3048"/>`;
  return { back, mid, floor, FLOOR, bg: '#2a1f5e', blur: 1.2, reflOp: 0.06, tex: 0.2 };
}
// your flat: sofa, coffee table, a door on the right, a floor lamp
export function flat(tt, o = {}) {
  const FLOOR = 840;
  let back = `<defs>${glow('fw', '#ffe0a8', 0.8)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#8a9ac8"/><rect x="-600" y="${FLOOR - 40}" width="3120" height="40" fill="#6a7aa8"/>`;
  back += `<rect x="300" y="160" width="420" height="300" fill="#2a3a7a" stroke="#f4f1ea" stroke-width="12"/><rect x="510" y="160" width="6" height="300" fill="#f4f1ea"/><circle cx="420" cy="250" r="30" fill="#f4f1ea" opacity="0.8"/>`;
  back += `<rect x="1560" y="300" width="200" height="${FLOOR - 300}" fill="#c9a06a" stroke="${OL}" stroke-width="4"/><circle cx="1590" cy="${FLOOR - 260}" r="8" fill="#ffd23f"/>`;
  back += `<ellipse cx="1300" cy="300" rx="300" ry="260" fill="url(#fw)" opacity="0.6"/><rect x="1296" y="300" width="8" height="${FLOOR - 300}" fill="#2a2d3a"/><path d="M 1250 300 L 1350 300 L 1330 240 L 1270 240 Z" fill="#ffd8a0"/>`;
  let mid = `<rect x="150" y="${FLOOR - 220}" width="700" height="120" rx="30" fill="#c8452e"/><rect x="150" y="${FLOOR - 300}" width="700" height="110" rx="30" fill="#d85a3e"/><rect x="120" y="${FLOOR - 240}" width="80" height="160" rx="30" fill="#b83a26"/><rect x="800" y="${FLOOR - 240}" width="80" height="160" rx="30" fill="#b83a26"/><rect x="190" y="${FLOOR - 100}" width="20" height="100" fill="#3a2a20"/><rect x="790" y="${FLOOR - 100}" width="20" height="100" fill="#3a2a20"/>`;
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#c9a87a"/>` + [...Array(20)].map((_, i) => `<rect x="${-600 + i * 160}" y="${FLOOR}" width="4" height="600" fill="#a8885a"/>`).join('') + `<ellipse cx="760" cy="${FLOOR + 60}" rx="520" ry="70" fill="#5a6ab8" opacity="0.6"/>`;
  const table = (x) => `<rect x="${x - 170}" y="${FLOOR - 90}" width="340" height="20" rx="6" fill="#8a6a4a"/><rect x="${x - 150}" y="${FLOOR - 70}" width="12" height="70" fill="#5a4a3a"/><rect x="${x + 138}" y="${FLOOR - 70}" width="12" height="70" fill="#5a4a3a"/>`;
  return { back, mid, floor, FLOOR, bg: '#8a9ac8', blur: 1.2, reflOp: 0.08, tex: 0.2, table };
}
// full-frame chart card: a death-rate line that rises (k = 0..1 draw progress); returns svg
export function chartCard(k, title, o = {}) {
  const pts = [...Array(13)].map((_, i) => [380 + i * 100, 880 - (i < 6 ? 60 + Math.sin(i * 1.7) * 20 : 60 + (i - 5) * 55)]);
  const n = Math.max(2, Math.round(2 + k * 11)), d = pts.slice(0, n).map((p, i) => (i ? 'L' : 'M') + ` ${p[0]} ${p[1]}`).join(' ');
  let g = `<rect width="1920" height="1080" fill="#0e1424"/><rect x="300" y="300" width="1340" height="640" rx="24" fill="#f4f6f8"/><text x="360" y="380" font-family="Inter" font-weight="900" font-size="48" fill="#15181e">${title}</text>`;
  for (let i = 0; i < 5; i++) g += `<line x1="380" y1="${880 - i * 100}" x2="1580" y2="${880 - i * 100}" stroke="#d0d6de" stroke-width="2"/>`;
  g += `<line x1="380" y1="${880 - 150}" x2="1580" y2="${880 - 150}" stroke="#4fa06a" stroke-width="4" stroke-dasharray="16 12"/><text x="1590" y="${880 - 140}" font-family="IBM Plex Mono" font-weight="800" font-size="22" fill="#4fa06a">${o.normal || 'EXPECTED'}</text>`;
  g += `<path d="${d}" stroke="#c8352e" stroke-width="10" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  const e = pts[n - 1]; g += `<circle cx="${e[0]}" cy="${e[1]}" r="14" fill="#c8352e"/>`;
  return g;
}
