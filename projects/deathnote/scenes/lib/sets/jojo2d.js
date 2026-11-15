// Flat 2D sets for the JoJo "The World" video (our own designs, same look as the approved pilot).
import { glow } from '../flat2d.js';
import { city, building, mix } from '../city2d.js';
const f = (n) => n.toFixed(1);

// balcony 12 floors up, early morning: railing in front, city far below and around
export function balcony(tt, o = {}) {
  const FLOOR = 860;
  let back = `<defs><linearGradient id="bs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a8ad8"/><stop offset="0.6" stop-color="#f4b8a0"/><stop offset="1" stop-color="#ffe2b8"/></linearGradient>${glow('sun', '#fff1c8', 0.9)}</defs><rect x="-900" y="-500" width="3720" height="2000" fill="url(#bs)"/><ellipse cx="300" cy="420" rx="420" ry="320" fill="url(#sun)"/><circle cx="300" cy="440" r="56" fill="#fff4d6"/>`;
  back += city({ vp: [960, 1100], ground: 1300, fog: '#f0c0b0', lit: '#ffe08a', litP: 0.06, pal: ['#c0707e', '#d9946e', '#5f86b8', '#b5608a', '#6fa08e'], layers: [
    { n: 9, x0: -800, x1: 2700, hmin: 700, hmax: 1100, wmin: 160, wmax: 240, haze: 0.55, seed: 101, depth: 0.08, style: 'tower', base: 1300 },
    { n: 6, x0: -700, x1: 2600, hmin: 500, hmax: 800, wmin: 260, wmax: 360, haze: 0.25, seed: 103, depth: 0.12, style: 'office', base: 1300 }] });
  // chimney smoke and a pigeon (frozen when o.frozen)
  const ph = o.frozen ? 0.4 : (tt * 0.3) % 1;
  for (let i = 0; i < 6; i++) { const k = (ph + i / 6) % 1; back += `<circle cx="${f(1500 + Math.sin(i * 1.7) * 30 + k * 80)}" cy="${f(380 - k * 260)}" r="${f(20 + k * 40)}" fill="#c9c2d4" opacity="${f(0.7 * (1 - k))}"/>`; }
  back += `<rect x="1480" y="380" width="40" height="80" fill="#6a4a5a"/>`;
  let mid = '';
  const px = o.frozen ? 1100 : 700 + ((tt * 140) % 900), py = 300 + Math.sin(px / 60) * 10, w = o.frozen ? 0.4 : Math.sin(tt * 18);
  mid += `<g transform="translate(${f(px)} ${f(py)})"><ellipse rx="22" ry="12" fill="#6a6f80"/><circle cx="18" cy="-6" r="8" fill="#6a6f80"/><path d="M -6 -4 Q 0 ${f(-30 * w - 10)} 14 -4" fill="#8a90a0"/><path d="M -6 2 Q 0 ${f(30 * w + 6)} 14 2" fill="#5a5f70"/></g>`;
  // balcony floor + railing
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="600" fill="#d8ccc0"/><rect x="-900" y="${FLOOR}" width="3720" height="10" fill="#b8aca0"/>`;
  floor += `<rect x="-900" y="${FLOOR - 220}" width="3720" height="14" rx="7" fill="#3a3d48"/>`; for (let x = -880; x < 2800; x += 70) floor += `<rect x="${x}" y="${FLOOR - 210}" width="8" height="210" fill="#3a3d48"/>`;
  floor += `<rect x="1300" y="${FLOOR - 120}" width="90" height="120" rx="10" fill="#c86a4a"/><circle cx="1345" cy="${FLOOR - 150}" r="50" fill="#4f9a5a"/>`;
  return { back, mid, floor, FLOOR, bg: '#5a8ad8', blur: 1.4, reflOp: 0.06, tex: 0.2 };
}
// kitchen in the morning: table, window, fridge
export function kitchen(tt, o = {}) {
  const FLOOR = 840;
  let back = `<defs>${glow('kw', '#fff1c8', 0.8)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#f2d58a"/>`;
  for (let y = 360; y < 620; y += 40) for (let x = 900; x < 1900; x += 40) back += `<rect x="${x + ((y / 40) % 2) * 20}" y="${y}" width="36" height="36" fill="#ffffff" opacity="0.35"/>`;
  back += `<rect x="900" y="620" width="1000" height="${FLOOR - 620}" fill="#3a8a8a"/><rect x="900" y="610" width="1000" height="20" fill="#e8e2d4"/>`;
  back += `<rect x="200" y="160" width="460" height="380" rx="8" fill="#e8eef4"/><rect x="220" y="180" width="420" height="340" fill="#9fd8ff"/><ellipse cx="430" cy="350" rx="420" ry="300" fill="url(#kw)" opacity="0.5"/><rect x="424" y="180" width="12" height="340" fill="#e8eef4"/>`;
  back += `<rect x="1980" y="200" width="260" height="${FLOOR - 200}" rx="12" fill="#e8eef4"/><rect x="2000" y="460" width="10" height="80" fill="#9aa3ad"/>`;
  let mid = `<rect x="500" y="${FLOOR - 230}" width="760" height="24" rx="10" fill="#c86a4a"/><rect x="540" y="${FLOOR - 206}" width="20" height="206" fill="#8a4a34"/><rect x="1200" y="${FLOOR - 206}" width="20" height="206" fill="#8a4a34"/>`;
  mid += `<ellipse cx="760" cy="${FLOOR - 236}" rx="70" ry="12" fill="#f4f1ea"/><circle cx="740" cy="${FLOOR - 244}" r="16" fill="#ffd23f"/>`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#b07a5a"/>`; for (let x = -600; x < 2520; x += 120) floor += `<line x1="${x}" y1="${FLOOR}" x2="${x - 100}" y2="1400" stroke="#000" stroke-width="3" opacity="0.08"/>`;
  return { back, mid, floor, FLOOR, bg: '#f2d58a', blur: 1.2, reflOp: 0.06, tex: 0.18 };
}
// a busy street at noon: shops, a street musician, cars
export function street(tt, o = {}) {
  const FLOOR = 800;
  let back = `<defs><linearGradient id="ss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a8ae0"/><stop offset="1" stop-color="#bfe4f6"/></linearGradient></defs><rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#ss)"/>`;
  back += city({ vp: [960, 640], ground: 680, fog: '#bfe4f6', litP: 0.04, pal: ['#d9684e', '#ecc48e', '#5f86b8', '#b5608a', '#6fa08e'], layers: [{ n: 9, x0: -800, x1: 2700, hmin: 360, hmax: 620, wmin: 160, wmax: 240, haze: 0.45, seed: 111, depth: 0.08, style: 'tower' }, { n: 6, x0: -700, x1: 2600, hmin: 220, hmax: 380, wmin: 260, wmax: 360, haze: 0.12, seed: 113, depth: 0.14, style: 'apartment' }] });
  const aw = ['#e8452e', '#2a9a8e', '#ffb21a', '#9a5cc0'];
  for (let i = 0; i < 12; i++) { const x = -700 + i * 290; back += `<rect x="${x}" y="600" width="250" height="80" fill="#ffe7a0" opacity="0.85"/><path d="M ${x - 10} 600 L ${x + 260} 600 L ${x + 250} 570 L ${x} 570 Z" fill="${aw[i % 4]}"/>`; }
  let floor = `<rect x="-900" y="680" width="3720" height="${FLOOR - 680}" fill="#c8bca8"/><rect x="-900" y="${FLOOR}" width="3720" height="600" fill="#3a3a48"/>`;
  for (let x = -900; x < 2800; x += 200) floor += `<rect x="${x}" y="${FLOOR + 120}" width="110" height="10" fill="#ffd23f" opacity="0.8"/>`;
  return { back, mid: '', floor, FLOOR, bg: '#4a8ae0', blur: 1.4, reflOp: 0.06, tex: 0.18 };
}
// a running track at dawn with lane lines and distance marks
export function track(tt, o = {}) {
  const FLOOR = 760;
  let back = `<defs><linearGradient id="ts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5ab8"/><stop offset="0.6" stop-color="#ff9a8a"/><stop offset="1" stop-color="#ffd8a0"/></linearGradient></defs><rect x="-1200" y="-500" width="5000" height="${FLOOR + 500}" fill="url(#ts)"/>`;
  back += `<path d="M -1200 560 Q 960 480 3800 560 L 3800 640 L -1200 640 Z" fill="#7a5a8a"/>`; for (let i = 0; i < 40; i++) back += `<rect x="${-1100 + i * 120}" y="${520 + (i % 3) * 10}" width="60" height="${80 - (i % 3) * 10}" fill="${['#9a6a9a', '#8a5a8a', '#aa7aaa'][i % 3]}"/>`;
  back += `<rect x="-1200" y="640" width="5000" height="${FLOOR - 640}" fill="#5aa85a"/>`;
  let floor = `<rect x="-1200" y="${FLOOR}" width="5000" height="600" fill="#d8583a"/>`;
  for (let i = 0; i < 6; i++) floor += `<rect x="-1200" y="${FLOOR + 30 + i * 60}" width="5000" height="5" fill="#ffffff" opacity="0.8"/>`;
  for (let m = 0; m <= 60; m += 10) { const x = 300 + m * 50; floor += `<rect x="${x - 3}" y="${FLOOR}" width="6" height="380" fill="#ffffff"/><text x="${x}" y="${FLOOR + 26}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="22" fill="#ffffff">${m} m</text>`; }
  return { back, mid: '', floor, FLOOR, bg: '#ff9a8a', blur: 1.4, reflOp: 0, tex: 0.18, reflect: false };
}
// a burning apartment block at night; o.frozen freezes the flames
export function fire(tt, o = {}) {
  const FLOOR = 820, fr = o.frozen ? 0 : 1;
  let back = `<defs><linearGradient id="fs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0a2a"/><stop offset="1" stop-color="#3a1a3a"/></linearGradient>${glow('fg', '#ff8a2a', 0.8)}</defs><rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#fs)"/>`;
  back += city({ vp: [960, 600], ground: 700, fog: '#2a1a3a', lit: '#ffd27a', litP: 0.3, pal: ['#1c1a40', '#2a1f4e', '#241c48'], layers: [{ n: 10, x0: -800, x1: 2700, hmin: 300, hmax: 560, wmin: 150, wmax: 230, haze: 0.4, seed: 121, depth: 0.08, style: 'tower', litP: 0.25 }] });
  back += `<rect x="-900" y="700" width="3720" height="${FLOOR - 700}" fill="#2a2240"/>`;
  let mid = building(700, FLOOR, 640, 620, { vp: [960, 600], depth: 0.12, col: '#7a5a6a', side: '#5a3a4a', win: '#3a2a3a', lit: '#ffb04a', litP: 0.2, style: 'apartment', seed: 7, rowH: 120, colW: 130 });
  mid += `<ellipse cx="1020" cy="420" rx="520" ry="380" fill="url(#fg)"/>`;
  // flames from three windows; the balcony with the family on the 4th floor (y ~ 380)
  let flames = '';
  for (const [x, y] of [[820, 470], [1120, 590], [960, 340]]) for (let i = 0; i < 5; i++) { const k = fr ? (tt * 1.6 + i / 5) % 1 : (i / 5); flames += `<path d="M ${f(x - 30 + i * 14)} ${y} Q ${f(x - 20 + i * 14 + Math.sin(tt * 6 * fr + i) * 10)} ${f(y - 90 - 60 * (1 - k))} ${f(x + i * 14)} ${y} Z" fill="${i % 2 ? '#ff8a2a' : '#ffd23f'}" opacity="${o.frozen ? 0.75 : f(0.9 - 0.3 * k)}"/>`; }
  if (!o.frozen) mid += flames;
  for (let i = 0; i < 10; i++) { const k = fr ? (tt * 0.4 + i / 10) % 1 : i / 10; mid += `<circle cx="${f(900 + Math.sin(i * 1.7) * 160 + k * 60)}" cy="${f(320 - k * 500)}" r="${f(40 + k * 90)}" fill="#4a4050" opacity="${f(0.55 * (1 - k))}"/>`; }
  mid += `<rect x="1180" y="380" width="160" height="12" fill="#3a3040"/><rect x="1180" y="330" width="160" height="6" fill="#3a3040"/>`;
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="600" fill="#2a2240"/><ellipse cx="1020" cy="${FLOOR + 60}" rx="700" ry="80" fill="url(#fg)" opacity="0.5"/>`;
  return { back, mid, floor, flames, FLOOR, bg: '#0c0a2a', blur: 1.6, reflOp: 0.12, tex: 0.2 };
}
// a cafe: big window, round table, warm light
export function cafe(tt, o = {}) {
  const FLOOR = 830;
  let back = `<defs>${glow('cw', '#ffd8a0', 0.8)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#6a3a3a"/>`;
  back += `<rect x="200" y="140" width="1500" height="520" fill="#9fd8ff"/><g><clipPath id="cc"><rect x="200" y="140" width="1500" height="520"/></clipPath><g clip-path="url(#cc)">${city({ vp: [960, 600], ground: 660, fog: '#bfe4f6', litP: 0.04, pal: ['#d9684e', '#ecc48e', '#5f86b8', '#b5608a'], layers: [{ n: 8, x0: 150, x1: 1750, hmin: 260, hmax: 480, wmin: 140, wmax: 220, haze: 0.35, seed: 131, depth: 0.08, style: 'apartment' }] })}</g></g>`;
  for (let x = 200; x <= 1700; x += 300) back += `<rect x="${x - 8}" y="140" width="16" height="520" fill="#3a2020"/>`;
  for (const x of [300, 960, 1620]) back += `<ellipse cx="${x}" cy="60" rx="200" ry="140" fill="url(#cw)" opacity="0.7"/><path d="M ${x - 40} 40 L ${x + 40} 40 L ${x + 26} 80 L ${x - 26} 80 Z" fill="#ffd27a"/>`;
  let mid = `<ellipse cx="960" cy="${FLOOR - 170}" rx="260" ry="30" fill="#e8dcc8"/><rect x="950" y="${FLOOR - 170}" width="20" height="170" fill="#3a2020"/>`;
  mid += `<rect x="860" y="${FLOOR - 210}" width="40" height="40" rx="6" fill="#f4f1ea"/><rect x="1020" y="${FLOOR - 210}" width="40" height="40" rx="6" fill="#f4f1ea"/>`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#8a5a46"/>`;
  return { back, mid, floor, FLOOR, bg: '#6a3a3a', blur: 1.4, reflOp: 0.1, tex: 0.2 };
}
// time-stop pulse: a ring that sweeps out from (x, y) at the moment time stops / restarts (k = 0..1)
export function pulse(x, y, k, col = '#cfe0ff') { if (k <= 0 || k >= 1) return ''; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(40 + k * 1800)}" fill="none" stroke="${col}" stroke-width="${f(40 * (1 - k))}" opacity="${f(0.8 * (1 - k))}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(20 + k * 1500)}" fill="${col}" opacity="${f(0.12 * (1 - k))}"/>`; }
