// Flat 2D sets for the Saitama video (our own designs, same look as the approved pilot): each painter returns
// { back, mid, floor, FLOOR, bg, blur, reflOp, tex } for flat2d.frame().
import { glow } from '../flat2d.js';
import { city, building, mix } from '../city2d.js';
const f = (n) => n.toFixed(1);

// ---- bedroom (small city flat): o.time = 'dawn' | 'night' | 'day'
export function bedroom(tt, o = {}) {
  const FLOOR = 820, night = o.time === 'night', dawn = o.time === 'dawn';
  const wall = night ? ['#2a2650', '#3a3070'] : dawn ? ['#6a5a9a', '#c08aa0'] : ['#7aa6c8', '#b8d4e4'];
  let back = `<defs><linearGradient id="bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wall[0]}"/><stop offset="1" stop-color="${wall[1]}"/></linearGradient>${glow('wg', night ? '#7ad8ff' : '#ffd8a0', 0.7)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#bw)"/>`;
  // window with the city outside
  back += `<rect x="1180" y="150" width="520" height="440" rx="8" fill="#e8eef4"/><rect x="1200" y="170" width="480" height="400" fill="${night ? '#141a40' : dawn ? '#ffb58a' : '#9fd8ff'}"/>`;
  back += `<g><clipPath id="wc"><rect x="1200" y="170" width="480" height="400"/></clipPath><g clip-path="url(#wc)">${city({ vp: [1440, 520], ground: 570, fog: night ? '#26306a' : dawn ? '#f0a888' : '#bfe4f6', lit: '#ffd27a', litP: night ? 0.4 : 0.05, pal: ['#4a5a9a', '#7a6aa0', '#5a7aa8'], layers: [{ n: 6, x0: 1150, x1: 1720, hmin: 120, hmax: 300, wmin: 60, wmax: 110, haze: 0.35, seed: 61, depth: 0.08, style: 'tower', litP: night ? 0.4 : 0.05 }] })}</g></g><rect x="1436" y="170" width="10" height="400" fill="#e8eef4"/><rect x="1200" y="364" width="480" height="10" fill="#e8eef4"/>`;
  back += `<ellipse cx="1440" cy="400" rx="520" ry="380" fill="url(#wg)" opacity="0.45"/>`;
  // poster + shelf
  back += `<rect x="300" y="200" width="200" height="270" fill="#ffd23f"/><circle cx="400" cy="310" r="60" fill="#e8452e"/><rect x="330" y="400" width="140" height="14" fill="#1c1e26"/><rect x="620" y="300" width="300" height="14" rx="5" fill="#8a5a46"/><rect x="650" y="240" width="40" height="60" fill="#3f6db3"/><rect x="700" y="250" width="30" height="50" fill="#e8452e"/><circle cx="820" cy="276" r="22" fill="#2f9a8e"/>`;
  let mid = '';
  // bed (left) with duvet and pillow; nightstand (right of bed) unless broken
  mid += `<rect x="-200" y="${FLOOR - 230}" width="40" height="230" fill="#8a5a46"/><rect x="-200" y="${FLOOR - 140}" width="760" height="110" rx="12" fill="#f4f1ea"/><path d="M -180 ${FLOOR - 150} L 540 ${FLOOR - 150} L 560 ${FLOOR - 40} L -180 ${FLOOR - 40} Z" fill="${night ? '#3a6ad0' : '#4a7ae0'}"/><rect x="-170" y="${FLOOR - 190}" width="200" height="60" rx="26" fill="#ffffff"/><rect x="-200" y="${FLOOR - 40}" width="760" height="40" fill="#6a4434"/>`;
  if (!o.noStand) mid += `<rect x="600" y="${FLOOR - 140}" width="160" height="140" fill="#a8704a"/><rect x="600" y="${FLOOR - 140}" width="160" height="14" fill="#c8906a"/><rect x="616" y="${FLOOR - 100}" width="128" height="40" rx="4" fill="#94603e"/>`;
  else mid += `<path d="M 600 ${FLOOR} L 600 ${FLOOR - 120} L 650 ${FLOOR - 140} L 690 ${FLOOR - 60} L 720 ${FLOOR - 140} L 760 ${FLOOR - 120} L 760 ${FLOOR} Z" fill="#a8704a"/><ellipse cx="680" cy="${FLOOR + 6}" rx="70" ry="14" fill="#1a1414"/>`;
  if (o.lamp !== false) mid += `<ellipse cx="680" cy="${FLOOR - 190}" rx="160" ry="130" fill="url(#wg)" opacity="${night ? 0.6 : 0.2}"/><rect x="664" y="${FLOOR - 190}" width="10" height="50" fill="#3a3040"/><path d="M 640 ${FLOOR - 190} L 700 ${FLOOR - 190} L 690 ${FLOOR - 230} L 650 ${FLOOR - 230} Z" fill="#ffd27a"/>`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="${night ? '#3a2e48' : '#b07a5a'}"/>`;
  for (let x = -600; x < 2520; x += 140) floor += `<line x1="${x}" y1="${FLOOR}" x2="${x - 120}" y2="1400" stroke="#000" stroke-width="3" opacity="0.08"/>`;
  floor += `<ellipse cx="1000" cy="${FLOOR + 120}" rx="420" ry="70" fill="${night ? '#5a3a7a' : '#d0605a'}"/>`;
  return { back, mid, floor, FLOOR, bg: wall[0], blur: 1.4, reflOp: 0.05, tex: 0.22 };
}
// ---- a small boxing gym: punch bag, ropes, mirrors, posters
export function gym(tt, o = {}) {
  const FLOOR = 800;
  let back = `<defs><linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a4a"/><stop offset="1" stop-color="#6a3a4a"/></linearGradient>${glow('gl', '#ffe0a0', 0.6)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#gw)"/>`;
  for (let x = -600; x < 2520; x += 120) back += `<rect x="${x}" y="0" width="118" height="${FLOOR}" fill="#ffffff" opacity="${x % 240 ? 0.02 : 0.05}"/>`;
  for (const x of [200, 900, 1600]) back += `<ellipse cx="${x}" cy="60" rx="300" ry="160" fill="url(#gl)" opacity="0.6"/><rect x="${x - 90}" y="40" width="180" height="14" rx="7" fill="#fff4d0"/>`;
  back += `<rect x="1300" y="220" width="200" height="280" fill="#e8452e"/><text x="1400" y="330" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#fff">FIGHT</text><text x="1400" y="380" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#ffd23f">NIGHT</text>`;
  // ring ropes (back)
  back += `<rect x="-600" y="${FLOOR - 260}" width="1100" height="8" fill="#e8452e"/><rect x="-600" y="${FLOOR - 190}" width="1100" height="8" fill="#ffffff"/><rect x="-600" y="${FLOOR - 120}" width="1100" height="8" fill="#3f6db3"/><rect x="480" y="${FLOOR - 300}" width="30" height="300" fill="#1c1e26"/>`;
  // a hole in the wall when the bag has gone through (o.hole 0..1)
  if (o.hole) back += `<path d="M 1760 400 l 60 -40 l 50 30 l 40 -20 l 30 60 l -20 60 l 40 50 l -60 40 l -50 -20 l -60 30 l -30 -60 l -40 -30 Z" fill="#0c0a14" transform="scale(${f(o.hole)}) translate(${f(1820 * (1 / o.hole - 1))} ${f(450 * (1 / o.hole - 1))})"/>`;
  let mid = `<rect x="1170" y="0" width="12" height="230" fill="#9aa3ad"/>`;
  if (!o.noBag) mid += `<g transform="rotate(${f(o.swing || 0)} 1176 230)"><rect x="1120" y="230" width="112" height="330" rx="44" fill="#e0412e"/><rect x="1120" y="230" width="36" height="330" rx="30" fill="#ff6a4a" opacity="0.6"/><rect x="1120" y="290" width="112" height="16" fill="#a82a1c"/><rect x="1120" y="490" width="112" height="16" fill="#a82a1c"/></g>`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#2a3a5a"/><rect x="-600" y="${FLOOR}" width="3120" height="8" fill="#1a2440"/>`;
  for (let x = -600; x < 2520; x += 200) floor += `<rect x="${x}" y="${FLOOR + 8}" width="196" height="600" fill="#ffffff" opacity="${(x / 200) % 2 ? 0.03 : 0}"/>`;
  return { back, mid, floor, FLOOR, bg: '#3a2a4a', blur: 1.6, reflOp: 0.08, tex: 0.22 };
}
// ---- an empty field at dawn with a street of houses behind (car alarms)
export function field(tt, o = {}) {
  const FLOOR = 760;
  let back = `<defs><linearGradient id="fs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5ab8"/><stop offset="0.55" stop-color="#ff9a8a"/><stop offset="1" stop-color="#ffd8a0"/></linearGradient>${glow('sn', '#fff1b8', 0.9)}</defs><rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#fs)"/><ellipse cx="1500" cy="560" rx="460" ry="300" fill="url(#sn)"/><circle cx="1500" cy="600" r="60" fill="#fff4cc"/>`;
  back += city({ vp: [960, 600], ground: 620, fog: '#f4b8a0', lit: '#ffe08a', litP: 0.06, pal: ['#c0707e', '#d9946e', '#9a6a8e', '#6fa08e'], layers: [{ n: 9, x0: -800, x1: 2700, hmin: 160, hmax: 320, wmin: 160, wmax: 260, haze: 0.5, seed: 71, depth: 0.08, style: 'apartment' }] });
  back += `<path d="M -900 640 Q 400 600 1200 640 T 2800 630 L 2800 ${FLOOR} L -900 ${FLOOR} Z" fill="#7ab86a"/>`;
  let mid = ''; for (let i = 0; i < 7; i++) { const x = -500 + i * 480; mid += `<rect x="${x - 6}" y="560" width="12" height="90" fill="#5a3a30"/><circle cx="${x}" cy="540" r="54" fill="#4f9a5a"/><circle cx="${x + 30}" cy="560" r="36" fill="#5aaa62"/>`; }
  if (o.cars) for (let i = 0; i < 5; i++) { const x = -300 + i * 560, on = Math.sin(tt * 10 + i) > 0; mid += `<rect x="${x}" y="615" width="150" height="40" rx="10" fill="${['#3a6ad0', '#e8452e', '#ffc21a', '#6a7a8a', '#2f9a8e'][i]}"/><circle cx="${x + 10}" cy="625" r="8" fill="${on ? '#ff8a2a' : '#5a3a20'}"/><circle cx="${x + 140}" cy="625" r="8" fill="${on ? '#ff8a2a' : '#5a3a20'}"/>`; }
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="700" fill="#5aa85a"/><rect x="-900" y="${FLOOR}" width="3720" height="10" fill="#4a904a"/>`;
  for (let i = 0; i < 60; i++) floor += `<path d="M ${(i * 233) % 3000 - 600} ${FLOOR + 30 + ((i * 71) % 280)} l 6 -18 l 6 18" stroke="#3f8a48" stroke-width="3" fill="none"/>`;
  return { back, mid, floor, FLOOR, bg: '#ff9a8a', blur: 1.6, reflOp: 0, tex: 0.2, reflect: false };
}
// ---- office lobby: glass wall to the city, reception desk, coffee machine, plants
export function lobby(tt, o = {}) {
  const FLOOR = 800;
  let back = `<defs><linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8eef4"/><stop offset="1" stop-color="#cfd8e0"/></linearGradient></defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#lw)"/>`;
  back += `<rect x="900" y="100" width="1100" height="${FLOOR - 100}" fill="#9fd8ff"/><g><clipPath id="lc"><rect x="900" y="100" width="1100" height="${FLOOR - 100}"/></clipPath><g clip-path="url(#lc)">${city({ vp: [1400, 640], ground: FLOOR, fog: '#bfe4f6', litP: 0.03, pal: ['#5a8ab8', '#8aa8c8', '#d0a078', '#a8b8c8'], layers: [{ n: 8, x0: 850, x1: 2050, hmin: 300, hmax: 640, wmin: 120, wmax: 200, haze: 0.4, seed: 81, depth: 0.08, style: 'tower' }] })}</g></g>`;
  for (let x = 900; x <= 2000; x += 220) back += `<rect x="${x - 6}" y="100" width="12" height="${FLOOR - 100}" fill="#5a6270"/>`;
  back += `<rect x="100" y="180" width="420" height="80" rx="10" fill="#1c1e26"/><text x="310" y="232" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" letter-spacing="6" fill="#ffffff">NOVA CORP</text>`;
  let mid = `<rect x="80" y="${FLOOR - 160}" width="560" height="160" rx="12" fill="#3a4a6a"/><rect x="80" y="${FLOOR - 160}" width="560" height="18" rx="8" fill="#f4f6f8"/>`;
  // coffee machine (o.wall = it's now in the wall)
  if (!o.wall) mid += `<rect x="720" y="${FLOOR - 210}" width="120" height="210" rx="10" fill="#2a2d33"/><rect x="736" y="${FLOOR - 190}" width="88" height="60" rx="6" fill="#4fd06a" opacity="0.8"/><rect x="756" y="${FLOOR - 90}" width="48" height="40" fill="#1a1c20"/>`;
  else mid += `<path d="M 700 ${FLOOR - 340} l 30 -20 l 40 10 l 30 -20 l 40 30 l 20 40 l -30 30 l 10 40 l -50 20 l -40 -10 l -40 20 l -20 -50 l -30 -30 Z" fill="#9aa3ad"/><rect x="730" y="${FLOOR - 330}" width="100" height="150" rx="10" fill="#2a2d33" transform="rotate(-12 780 ${FLOOR - 255})"/>`;
  for (const x of [40, 1880]) mid += `<rect x="${x - 30}" y="${FLOOR - 70}" width="60" height="70" fill="#e8dcc8"/><circle cx="${x}" cy="${FLOOR - 120}" r="50" fill="#3f9a5a"/><circle cx="${x - 30}" cy="${FLOOR - 90}" r="34" fill="#4faa62"/>`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#d8dee6"/><rect x="-600" y="${FLOOR}" width="3120" height="6" fill="#b0b8c4"/>`;
  return { back, mid, floor, FLOOR, bg: '#e8eef4', blur: 1.4, reflOp: 0.14, tex: 0.18 };
}
// ---- the testing hall: a big grey lab, measuring machines, a steel block, people in suits behind glass
export function lab(tt, o = {}) {
  const FLOOR = 820;
  let back = `<defs><linearGradient id="hw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2438"/><stop offset="1" stop-color="#3a4a6a"/></linearGradient>${glow('hl', '#9fe0ff', 0.6)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#hw)"/>`;
  for (let x = -600; x < 2520; x += 160) back += `<rect x="${x}" y="0" width="6" height="${FLOOR}" fill="#ffffff" opacity="0.05"/>`;
  for (const x of [300, 960, 1620]) back += `<ellipse cx="${x}" cy="40" rx="280" ry="160" fill="url(#hl)" opacity="0.5"/><rect x="${x - 120}" y="30" width="240" height="12" rx="6" fill="#e8f6ff"/>`;
  back += `<rect x="1300" y="200" width="620" height="260" rx="10" fill="#9fd8ff" opacity="0.35"/><rect x="1300" y="200" width="620" height="260" rx="10" fill="none" stroke="#c9d3dc" stroke-width="6"/>`;
  back += `<path d="M 0 ${FLOOR - 4} L 2400 ${FLOOR - 4}" stroke="#ffd23f" stroke-width="10" stroke-dasharray="40 30"/>`;
  return { back, mid: o.mid || '', floor: `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#4a5a7a"/><rect x="-600" y="${FLOOR}" width="3120" height="8" fill="#2a3450"/>`, FLOOR, bg: '#1c2438', blur: 1.4, reflOp: 0.12, tex: 0.2 };
}
// ---- a beach at night; o.up = 0..1 how high the camera has gone (to space)
export function beach(tt, o = {}) {
  const FLOOR = 800, up = o.up || 0;
  let back = `<defs><linearGradient id="ns" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix('#0c1240', '#000005', up)}"/><stop offset="1" stop-color="${mix('#3a4aa0', '#0c1240', up)}"/></linearGradient>${glow('mn', '#f4f1ff', 0.6)}</defs><rect x="-900" y="-600" width="3720" height="${FLOOR + 600}" fill="url(#ns)"/>`;
  for (let i = 0; i < 90; i++) back += `<circle cx="${(i * 389) % 3400 - 700}" cy="${-400 + ((i * 131) % 900)}" r="${1 + (i % 3)}" fill="#ffffff" opacity="${0.4 + 0.5 * up}"/>`;
  back += `<ellipse cx="1500" cy="120" rx="200" ry="200" fill="url(#mn)"/><circle cx="1500" cy="120" r="60" fill="#f4f1ff"/>`;
  back += `<rect x="-900" y="560" width="3720" height="${FLOOR - 560}" fill="#1e3a7a"/>`;
  for (let i = 0; i < 12; i++) back += `<path d="M ${-800 + i * 300} ${600 + (i % 3) * 40} q 40 -10 80 0" stroke="#7ab8ff" stroke-width="3" fill="none" opacity="0.6"/>`;
  back += `<path d="M 1460 560 L 1440 ${FLOOR} L 1560 ${FLOOR} L 1540 560 Z" fill="#f4f1ff" opacity="0.15"/>`;
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="600" fill="#c8b48a"/><rect x="-900" y="${FLOOR}" width="3720" height="14" fill="#7ab8ff" opacity="0.5"/>`;
  if (o.crack) floor += `<path d="M 960 ${FLOOR + 40} l -120 30 l -80 -10 M 960 ${FLOOR + 40} l 140 20 l 60 40 M 960 ${FLOOR + 40} l 20 80" stroke="#5a4a2a" stroke-width="6" fill="none" opacity="${f(o.crack)}"/><ellipse cx="960" cy="${FLOOR + 40}" rx="${f(160 * o.crack)}" ry="${f(30 * o.crack)}" fill="#a8946a"/>`;
  return { back, mid: '', floor, FLOOR, bg: '#0c1240', blur: 1.6, reflOp: 0.1, tex: 0.2 };
}
// the curve of the Earth from high above (full-frame svg), k = 0..1 how high
export function earthCurve(tt, k = 1) {
  let g = `<defs><radialGradient id="atm" cx="0.5" cy="1.6" r="1.3"><stop offset="0.72" stop-color="#3a7ad8"/><stop offset="0.76" stop-color="#9fd8ff"/><stop offset="0.8" stop-color="#0c1240" stop-opacity="0.6"/><stop offset="1" stop-color="#000005" stop-opacity="0"/></radialGradient></defs><rect width="1920" height="1080" fill="#02020a"/>`;
  for (let i = 0; i < 160; i++) g += `<circle cx="${(i * 397) % 1920}" cy="${(i * 211) % 1080}" r="${1 + (i % 2)}" fill="#ffffff" opacity="${0.3 + (i % 5) * 0.12}"/>`;
  const cy = 2200 - 700 * k; g += `<circle cx="960" cy="${f(cy)}" r="1500" fill="url(#atm)"/><circle cx="960" cy="${f(cy)}" r="1440" fill="#2a6ad0"/>`;
  for (let i = 0; i < 9; i++) g += `<ellipse cx="${300 + i * 200}" cy="${f(cy - 1440 + 80 + (i % 3) * 30)}" rx="${120 + (i % 3) * 40}" ry="22" fill="#ffffff" opacity="0.7"/>`;
  g += `<path d="M 200 ${f(cy - 1300)} q 300 -60 560 0 q 200 50 420 -20" fill="#4f9a5a" opacity="0.8"/>`;
  return g;
}
// ---- the supermarket: shelves, a big SALE sign, eggs
export function market(tt, o = {}) {
  const FLOOR = 820;
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#f4f1ea"/>`;
  for (let x = -600; x < 2520; x += 300) back += `<rect x="${x}" y="40" width="240" height="14" rx="7" fill="#ffffff"/>`;
  const cols = ['#e8452e', '#ffc21a', '#3f9a5a', '#3f6db3', '#c86aff', '#ff8a3b'];
  for (let s = 0; s < 4; s++) { const x0 = -500 + s * 640; back += `<rect x="${x0}" y="200" width="560" height="${FLOOR - 200}" fill="#d9d2c4"/>`; for (let r = 0; r < 4; r++) { back += `<rect x="${x0}" y="${300 + r * 130}" width="560" height="12" fill="#8a8a8a"/>`; for (let i = 0; i < 9; i++) back += `<rect x="${x0 + 14 + i * 60}" y="${300 + r * 130 - 70 - (i % 3) * 10}" width="48" height="${70 + (i % 3) * 10}" rx="4" fill="${cols[(i + r + s) % 6]}"/>`; } }
  back += `<g transform="rotate(-4 960 150)"><rect x="760" y="90" width="400" height="120" rx="12" fill="#e8452e"/><text x="960" y="170" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#ffffff">SALE −50%</text></g>`;
  let mid = `<rect x="1300" y="${FLOOR - 200}" width="420" height="200" fill="#5a8ab8"/><rect x="1300" y="${FLOOR - 200}" width="420" height="16" fill="#8ab0d8"/>`;
  for (let i = 0; i < 6; i++) mid += `<rect x="${1320 + i * 66}" y="${FLOOR - 250}" width="58" height="50" rx="6" fill="#f2e2c4" stroke="#b9dcff" stroke-width="2"/>${[0, 1, 2].map((j) => `<ellipse cx="${1332 + i * 66 + j * 16}" cy="${FLOOR - 236}" rx="7" ry="9" fill="#fff8ea"/>`).join('')}`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#e2ddd2"/>`; for (let x = -600; x < 2520; x += 120) floor += `<line x1="${x}" y1="${FLOOR}" x2="${x - 100}" y2="1400" stroke="#c8c2b6" stroke-width="3"/>`;
  return { back, mid, floor, FLOOR, bg: '#f4f1ea', blur: 1.2, reflOp: 0.12, tex: 0.16 };
}
// ---- a red-sky city with a burning meteor (k = 0..1 how close)
export function meteorCity(tt, k = 0.3, o = {}) {
  const FLOOR = 780;
  let back = `<defs><linearGradient id="rs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a0a1a"/><stop offset="0.6" stop-color="#c8352e"/><stop offset="1" stop-color="#ff8a3b"/></linearGradient>${glow('mg', '#ffb04a', 0.85)}</defs><rect x="-900" y="-600" width="3720" height="${FLOOR + 600}" fill="url(#rs)"/>`;
  if (!o.noRock) { const r = 60 + 340 * k, x = 1500 - 400 * k, y = -100 + 300 * k; back += `<path d="M ${f(x + r * 0.7)} ${f(y - r * 0.7)} L ${f(x + r * 4)} ${f(y - r * 3.4)} L ${f(x + r * 3)} ${f(y - r * 4)} Z" fill="#ffd23f" opacity="0.5"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.8)}" ry="${f(r * 1.8)}" fill="url(#mg)"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#4a2a20"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.2)}" r="${f(r * 0.25)}" fill="#2a1a14"/><circle cx="${f(x + r * 0.35)}" cy="${f(y + r * 0.3)}" r="${f(r * 0.18)}" fill="#2a1a14"/><path d="M ${f(x - r)} ${f(y)} A ${f(r)} ${f(r)} 0 0 0 ${f(x + r * 0.2)} ${f(y + r)}" stroke="#ff8a3b" stroke-width="${f(r * 0.12)}" fill="none"/>`; }
  back += city({ vp: [960, 600], ground: 640, fog: '#e0605a', lit: '#ffd27a', litP: 0.3, pal: ['#3a1a2a', '#4a2030', '#2a1a2a', '#5a2a30'], layers: [{ n: 10, x0: -800, x1: 2700, hmin: 380, hmax: 680, wmin: 150, wmax: 230, haze: 0.4, seed: 91, depth: 0.08, style: 'tower', litP: 0.2 }, { n: 6, x0: -700, x1: 2600, hmin: 200, hmax: 380, wmin: 260, wmax: 360, haze: 0.15, seed: 93, depth: 0.14, style: 'apartment', litP: 0.4 }] });
  back += `<rect x="-900" y="640" width="3720" height="${FLOOR - 640}" fill="#2a1420"/>`;
  return { back, mid: '', floor: `<rect x="-900" y="${FLOOR}" width="3720" height="600" fill="#3a1a24"/><rect x="-900" y="${FLOOR}" width="3720" height="8" fill="#5a2a30"/>`, FLOOR, bg: '#c8352e', blur: 1.6, reflOp: 0.1, tex: 0.22 };
}
