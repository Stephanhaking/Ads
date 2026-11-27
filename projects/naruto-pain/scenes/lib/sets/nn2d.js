// Flat 2D art for "What If You Became Nanami? Clock Out at 5 or Die" (our own designs; nothing traced from the manga/anime).
// One working day, 8:52 a.m. to 5:11 p.m. (no day count: a clock in the corner). Builds on sk2d (detailed buildings in
// parallax). New here: the lobby with the elevator and the coffee machine, the open office (cubicles, monitors, lamps,
// coworkers), the fire stairwell on the ninth floor, the file room whose wall folds, the office tower at night with lit
// windows and silhouettes and a big clock on the facade, the time clock, wall clocks, the gold 7:3 line, the blunt blade,
// and the curse made of desks, cables and a hundred little clocks.
import { sky, moon, clouds, birds, bldg, skyline, lampPost, rnd, RED, RED2, BLUE } from './sk2d.js';
export { sky, moon, clouds, birds, bldg, skyline, lampPost, rnd, RED, RED2, BLUE };
const f = (n) => n.toFixed(1);
export const GOLD = '#ffd23f', GOLD2 = '#e0a020', GREEN = '#5ae08a', TAN = '#b89a6a';
let UID = 0; const uid = (p) => p + (++UID % 100000) + Math.floor(rnd(UID) * 1e5);

// ---------- props ----------
// an analog wall clock; h, m = the time it shows
export function wallClock(x, y, r, h, m, o = {}) { const ha = ((h % 12) + m / 60) * 30, ma = m * 6, col = o.col || '#f4efe4';
  return `<g transform="translate(${f(x)} ${f(y)})"><circle r="${f(r + 10)}" fill="${o.rim || '#2a2d3a'}"/><circle r="${f(r)}" fill="${col}"/>${[...Array(12)].map((_, i) => `<rect x="-3" y="${f(-r + 6)}" width="6" height="${i % 3 ? 10 : 20}" fill="#2a2d3a" transform="rotate(${i * 30})"/>`).join('')}
<line x1="0" y1="0" x2="0" y2="${f(-r * 0.5)}" stroke="#15181e" stroke-width="${f(r * 0.09)}" stroke-linecap="round" transform="rotate(${f(ha)})"/><line x1="0" y1="0" x2="0" y2="${f(-r * 0.8)}" stroke="#15181e" stroke-width="${f(r * 0.05)}" stroke-linecap="round" transform="rotate(${f(ma)})"/>${o.sec !== false ? `<line x1="0" y1="${f(r * 0.15)}" x2="0" y2="${f(-r * 0.85)}" stroke="${RED}" stroke-width="${f(r * 0.025)}" transform="rotate(${f(((o.lt || 0) * 36) % 360)})"/>` : ''}<circle r="${f(r * 0.07)}" fill="${RED}"/>${o.glow ? `<circle r="${f(r + 30)}" fill="none" stroke="${o.glow}" stroke-width="8" opacity="${f(0.5 + 0.4 * Math.sin((o.lt || 0) * 6))}"/>` : ''}</g>`; }
// the time clock by the entrance: a grey box, a slot, a little green screen; o.txt is what the screen says
export function punchClock(x, y, s = 1, lt = 0, o = {}) { const card = o.card ?? 0, scr = o.txt || '8:52 AM', col = o.red ? RED : GREEN;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${card > 0 ? `<g transform="translate(0 ${f(-560 + 220 * card)})"><rect x="-50" y="-150" width="100" height="160" rx="6" fill="#f4efe4"/><rect x="-40" y="-130" width="80" height="10" fill="#c8c0b0"/><rect x="-40" y="-110" width="60" height="8" fill="#c8c0b0"/><rect x="-40" y="-60" width="80" height="20" fill="${GOLD}"/></g>` : ''}<rect x="-150" y="-420" width="300" height="420" rx="20" fill="#8a8f9c"/><rect x="-150" y="-420" width="300" height="60" rx="20" fill="#6a6f7c"/><rect x="-120" y="-340" width="240" height="110" rx="10" fill="#0a1a10"/><text x="0" y="-300" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="30" fill="${col}" opacity="${f(0.85 + 0.15 * Math.sin(lt * 5))}">${scr}</text><text x="0" y="-252" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="22" fill="${col}" opacity="0.8">${o.sub || 'TIME CLOCK'}</text>
<rect x="-70" y="-416" width="140" height="10" rx="4" fill="#2a2d3a"/><circle cx="100" cy="-90" r="14" fill="${col}" opacity="${f(0.6 + 0.4 * Math.sin(lt * 4))}"/>
<rect x="-20" y="0" width="40" height="240" fill="#4a4f5c"/><rect x="-110" y="236" width="220" height="20" rx="8" fill="#3a3f4c"/></g>`; }
// the gold 7:3 line across something: a thin bright line with ticks and a "7 : 3" tag; k = how drawn it is
export function goldLine(x1, y1, x2, y2, k = 1, lt = 0, o = {}) { if (k <= 0) return ''; const x = x1 + (x2 - x1) * Math.min(1, k), y = y1 + (y2 - y1) * Math.min(1, k), op = 0.85 + 0.15 * Math.sin(lt * 7);
  const tag = o.tag !== false && k > 0.8 ? `<g transform="translate(${f(x2 + 18)} ${f(y2 - 8)})"><rect x="0" y="-26" width="${o.lbl ? 30 + o.lbl.length * 17 : 100}" height="40" rx="8" fill="#15181e" stroke="${GOLD}" stroke-width="3"/><text x="${o.lbl ? 15 + o.lbl.length * 8.5 : 50}" y="2" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="24" fill="${GOLD}">${o.lbl || '7 : 3'}</text></g>` : '';
  return `<g opacity="${f(op)}"><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y)}" stroke="${GOLD}" stroke-width="22" opacity="0.25" stroke-linecap="round"/><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y)}" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>${tag}`; }
// the 7:3 split on a rectangle: ten faint bands and the gold line three tenths from the top
export function ratio(x, y, w, h, k = 1, lt = 0, o = {}) { let g = ''; for (let i = 1; i < 10; i++) g += `<line x1="${f(x)}" y1="${f(y + h * i / 10)}" x2="${f(x + w)}" y2="${f(y + h * i / 10)}" stroke="${GOLD}" stroke-width="2" opacity="${f(0.25 * k)}" stroke-dasharray="10 10"/>`;
  return g + goldLine(x - 20, y + h * 0.3, x + w + 20, y + h * 0.3, k, lt, o); }
// the blunt blade: long, heavy, dull; o.wrap = wrapped in newspaper; glow = gold
export function blade(x, y, a, s = 1, o = {}) { const wrap = o.wrap ? 1 : 0;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(s)})">${o.glow ? `<rect x="-40" y="-380" width="80" height="380" rx="30" fill="${GOLD}" opacity="${f(0.3 * o.glow)}"/>` : ''}<path d="M -26 -360 L 26 -360 L 26 -30 L -26 -30 Z" fill="#9aa0ac" stroke="#5a5e6a" stroke-width="4"/><rect x="-26" y="-360" width="16" height="330" fill="#c8ccd6"/>${wrap ? `<rect x="-36" y="-368" width="72" height="346" rx="6" fill="#e8e2d0"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="-26" y="${-350 + i * 40}" width="${30 + (i % 3) * 10}" height="6" fill="#8a8476"/>`).join('')}<rect x="-30" y="-250" width="60" height="10" fill="#c8a040" transform="rotate(-6)"/>` : ''}
<rect x="-40" y="-34" width="80" height="14" rx="5" fill="#2a2d3a"/><rect x="-11" y="-20" width="22" height="110" rx="6" fill="#3a2a22"/>${[0, 1, 2, 3].map((i) => `<path d="M -11 ${-12 + i * 26} l 22 14" stroke="${GOLD2}" stroke-width="4"/>`).join('')}${o.cloth ? `<path d="M 11 70 q 40 20 30 70 q -10 -30 -30 -40 Z" fill="${GOLD}"/>` : ''}</g>`; }
// the curse: a heap of desks, chairs, cables and little clocks that all say 5:00; o.gone dissolves it, o.crack splits it
export function deskCurse(x, y, s, lt, o = {}) { const gone = o.gone || 0; if (gone >= 1) return ''; const br = 1 + 0.03 * Math.sin(lt * 1.6), look = (o.look ?? 1) * 20, op = 1 - gone;
  let g = `<g transform="translate(${f(x)} ${f(y + gone * 200)}) scale(${f(s * br)} ${f(s * (1 - gone * 0.5))})" opacity="${f(op)}"><ellipse cx="0" cy="40" rx="420" ry="520" fill="${RED}" opacity="0.10"/>`;
  // body: stacked desks at angles
  [[-150, 220, -8, 360], [130, 200, 10, 320], [-20, 40, -4, 420], [-180, -120, 14, 300], [160, -140, -12, 300], [0, -300, 4, 360]].forEach(([dx, dy, a, w], i) => { g += `<g transform="translate(${dx} ${f(dy + Math.sin(lt * 2 + i) * 6)}) rotate(${a})"><rect x="${-w / 2}" y="-40" width="${w}" height="40" rx="6" fill="${i % 2 ? '#5a4a3e' : '#6a5646'}"/><rect x="${-w / 2 + 14}" y="0" width="18" height="110" fill="#3a3038"/><rect x="${w / 2 - 32}" y="0" width="18" height="110" fill="#3a3038"/><rect x="${-w / 2 + 40}" y="0" width="${w * 0.35}" height="80" fill="#4a3e36"/></g>`; });
  // cables
  for (let i = 0; i < 7; i++) { const a = -1 + i * 0.33, sw = Math.sin(lt * 1.8 + i) * 40; g += `<path d="M ${f(-60 + i * 20)} 200 Q ${f(Math.cos(a) * 300 + sw)} ${f(320 + Math.sin(a) * 100)} ${f(-380 + i * 130)} 560" stroke="#15181e" stroke-width="12" fill="none" stroke-linecap="round"/>`; }
  // monitor head with two burning eyes
  g += `<g transform="translate(${f(look)} -470)"><rect x="-150" y="-110" width="300" height="200" rx="16" fill="#1c1e28" stroke="#3a3d4c" stroke-width="8"/><rect x="-130" y="-92" width="260" height="164" rx="8" fill="#2a0a10"/><ellipse cx="-56" cy="-14" rx="${f(26 + Math.sin(lt * 5) * 2)}" ry="30" fill="${RED}"/><ellipse cx="56" cy="-14" rx="26" ry="30" fill="${RED}"/><circle cx="-56" cy="-14" r="10" fill="#fff"/><circle cx="56" cy="-14" r="10" fill="#fff"/><path d="M -80 48 ${[...Array(8)].map((_, i) => `L ${-80 + i * 23} ${48 + (i % 2 ? 16 : 0)}`).join(' ')}" stroke="#fff" stroke-width="5" fill="none"/><rect x="-20" y="90" width="40" height="40" fill="#2a2d3a"/></g>`;
  // arms: filing-cabinet fists on cable arms
  const sw = Math.sin(lt * 1.3) * 20; g += `<path d="M -200 -160 Q -360 ${f(-60 + sw)} -420 ${f(60 + sw)}" stroke="#15181e" stroke-width="30" fill="none" stroke-linecap="round"/><rect x="-480" y="${f(40 + sw)}" width="120" height="120" rx="10" fill="#7a7f8c"/><rect x="-466" y="${f(60 + sw)}" width="92" height="30" fill="#5a5f6c"/><rect x="-466" y="${f(110 + sw)}" width="92" height="30" fill="#5a5f6c"/>`;
  g += `<path d="M 200 -160 Q 360 ${f(-60 - sw)} 420 ${f(60 - sw)}" stroke="#15181e" stroke-width="30" fill="none" stroke-linecap="round"/><rect x="360" y="${f(40 - sw)}" width="120" height="120" rx="10" fill="#7a7f8c"/><rect x="374" y="${f(60 - sw)}" width="92" height="30" fill="#5a5f6c"/><rect x="374" y="${f(110 - sw)}" width="92" height="30" fill="#5a5f6c"/>`;
  // a hundred little clocks stuck all over, all at 5:00
  for (let i = 0; i < 22; i++) { const cx = (rnd(i * 3 + 1) * 2 - 1) * 260, cy = -360 + rnd(i * 7 + 2) * 600, r = 16 + rnd(i * 5) * 14; g += wallClock(cx, cy, r, 5, 0, { sec: false, rim: '#3a2a22', col: i % 3 ? '#f4efe4' : '#ffe8a8' }); }
  if (o.line) g += goldLine(-300, -80, 300, -80, o.line, lt, { tag: false });
  return g + '</g>'; }
// a heart with a beat; o.stop = 0..1 (1 = stopped, grey)
export function heart(x, y, s = 1, lt = 0, o = {}) { const stop = o.stop || 0, ph = (lt * (o.bpm || 72) / 60) % 1, beat = stop > 0.5 ? 0 : Math.max(0, 1 - ph * 5) * 0.12, col = stop > 0.5 ? '#6a6f7c' : RED;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s * (1 + beat))})"><path d="M 0 60 C -120 -20 -90 -120 0 -60 C 90 -120 120 -20 0 60 Z" fill="${col}"/><path d="M -40 -40 q 20 -14 30 0" stroke="#fff" stroke-width="6" fill="none" opacity="0.5"/></g>`; }
// a heart-monitor line across the screen
export function pulseLine(x, y, w, lt, o = {}) { const gap = o.gap || 0, col = o.col || GREEN; let d = `M ${x} ${y}`; const n = 60;
  for (let i = 0; i <= n; i++) { const q = i / n, xx = x + q * w, ph = ((q * 3 - lt * 0.8) % 1 + 1) % 1, beat = gap && (q > 0.45 && q < 0.85) ? 0 : (ph > 0.4 && ph < 0.5 ? -Math.sin((ph - 0.4) * 31.4) * 90 : ph > 0.5 && ph < 0.55 ? 40 : 0); d += ` L ${f(xx)} ${f(y + beat)}`; }
  return `<path d="${d}" stroke="${col}" stroke-width="6" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="20" fill="none" opacity="0.2"/>`; }
// the espresso machine in the lobby; cups = 0, 1, 2
export function espresso(x, y, s = 1, lt = 0, cups = 0) { return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-130" y="-300" width="260" height="300" rx="18" fill="#c8ccd6"/><rect x="-130" y="-300" width="260" height="70" rx="18" fill="#3a3d4c"/><circle cx="-70" cy="-266" r="14" fill="${GREEN}" opacity="${f(0.6 + 0.4 * Math.sin(lt * 4))}"/><rect x="-20" y="-276" width="100" height="20" rx="6" fill="#15181e"/><rect x="-40" y="-220" width="80" height="40" rx="6" fill="#2a2d3a"/><rect x="-16" y="-180" width="32" height="20" fill="#2a2d3a"/>
<rect x="-110" y="-60" width="220" height="16" fill="#8a8f9c"/>${cups > 0 ? `<rect x="-60" y="-110" width="48" height="50" rx="6" fill="#fff"/><path d="M -12 -100 q 16 0 16 14 q 0 14 -16 14" stroke="#fff" stroke-width="5" fill="none"/><ellipse cx="-36" cy="-110" rx="22" ry="6" fill="#5a3a22"/>` : ''}${cups > 1 ? `<rect x="14" y="-110" width="48" height="50" rx="6" fill="#fff"/><ellipse cx="38" cy="-110" rx="22" ry="6" fill="#5a3a22"/>` : ''}${cups ? [0, 1, 2].map((i) => `<path d="M ${-40 + i * 14} ${f(-130 - ((lt * 30 + i * 12) % 50))} q 8 -10 0 -20" stroke="#fff" stroke-width="4" fill="none" opacity="0.5"/>`).join('') : ''}</g>`; }
// the fire alarm box; on = flashing
export function fireAlarm(x, y, s = 1, lt = 0, on = 0) { const fl = on && Math.sin(lt * 14) > 0; return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-50" y="-70" width="100" height="140" rx="10" fill="${RED}"/><rect x="-36" y="-30" width="72" height="50" rx="6" fill="#fff"/><text x="0" y="4" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="${RED}">PULL</text><rect x="-30" y="-90" width="60" height="26" rx="6" fill="${fl ? '#fff4b0' : '#c8202e'}"/>${fl ? `<circle cx="0" cy="-78" r="80" fill="#fff4b0" opacity="0.25"/>` : ''}</g>`; }
// a coworker at a desk, as a flat silhouette (no face); o.sleep = head down; o.eyes = eyes open in the dark
export function coworker(x, y, s = 1, lt = 0, o = {}) { const col = o.col || '#3a3f52', bob = Math.sin(lt * 1.2 + x) * 3, hd = o.sleep ? 26 : 0;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-46" y="-150" width="92" height="120" rx="34" fill="${col}"/><circle cx="${f(hd * 0.4)}" cy="${f(-190 + hd + bob)}" r="38" fill="#15181e"/>${o.eyes ? `<ellipse cx="${f(-12 + hd * 0.4)}" cy="${f(-192 + hd + bob)}" rx="6" ry="8" fill="#fff" opacity="0.85"/><ellipse cx="${f(14 + hd * 0.4)}" cy="${f(-192 + hd + bob)}" rx="6" ry="8" fill="#fff" opacity="0.85"/>` : ''}</g>`; }
// a desk with a monitor, keyboard, lamp, mug, and maybe a plant; o.scr = screen colour; o.lamp = lamp on
export function desk(x, y, s = 1, lt = 0, o = {}) { const scr = o.scr || '#9fd0f0', i = o.seed || 0;
  let g = `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-180" y="-250" width="360" height="20" rx="4" fill="#8a6a4a"/><rect x="-170" y="-230" width="16" height="230" fill="#5a4a3a"/><rect x="154" y="-230" width="16" height="230" fill="#5a4a3a"/><rect x="60" y="-230" width="100" height="150" fill="#6a5a4a"/>`;
  g += `<rect x="-90" y="-400" width="180" height="120" rx="8" fill="#2a2d3a"/><rect x="-80" y="-390" width="160" height="100" rx="4" fill="${scr}" opacity="${f(0.85 + 0.1 * Math.sin(lt * 2 + i))}"/>${[0, 1, 2, 3].map((k) => `<rect x="-68" y="${-378 + k * 22}" width="${f(60 + rnd(i * 7 + k) * 70)}" height="8" fill="#fff" opacity="0.5"/>`).join('')}<rect x="-10" y="-280" width="20" height="30" fill="#2a2d3a"/><rect x="-70" y="-262" width="140" height="12" rx="4" fill="#3a3d4c"/>`;
  if (o.lamp !== false) g += `<path d="M -150 -250 L -150 -330 L -110 -360" stroke="#3a3d4c" stroke-width="8" fill="none"/><path d="M -130 -370 L -80 -350 L -100 -330 Z" fill="${GOLD2}"/>${o.lamp ? `<path d="M -100 -345 L -170 -250 L -20 -250 Z" fill="#fff4c8" opacity="0.25"/>` : ''}`;
  if (i % 3 === 0) g += `<rect x="110" y="-290" width="34" height="40" rx="5" fill="#c8624a"/><path d="M 127 -290 q -30 -40 -10 -60 M 127 -290 q 10 -50 30 -50 M 127 -290 q 30 -20 40 -40" stroke="${o.dead ? '#8a6a3a' : '#4fa06a'}" stroke-width="8" fill="none"/>`;
  else g += `<rect x="110" y="-284" width="30" height="34" rx="4" fill="#fff"/><path d="M 140 -276 q 12 0 12 10 q 0 10 -12 10" stroke="#fff" stroke-width="4" fill="none"/>`;
  return g + '</g>'; }
// floor windows onto the city; time: 'morning' | 'noon' | 'evening' | 'night'
const SKY = { morning: ['#7ab4e8', '#ffe0b0'], noon: ['#5aa4e8', '#cfe8ff'], evening: ['#3a2a5a', '#ff8a4a'], night: ['#1a0410', '#7a1020'] };
function cityWindow(x, y, w, h, lt, time = 'morning', seed = 11) { const id = uid('cw'), night = time === 'night' || time === 'evening', [a, b] = SKY[time];
  return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${sky(a, b, y, y + h)}${night ? moon(x + w * 0.78, y + h * 0.24, 50, lt) : `<circle cx="${f(x + w * 0.8)}" cy="${f(y + h * 0.25)}" r="46" fill="#fff4c8" opacity="0.9"/>`}${clouds(3, y + 20, y + h * 0.4, lt, night ? '#5a2a3a' : '#fff', 0.5, seed)}<g transform="translate(${x - 300} 0) scale(0.7) translate(0 ${f((y + h) / 0.7 - (y + h))})">${skyline(y + h + 60, lt, { night, seed })}</g></g>`; }
const winFrame = (x, y, w, h, n = 3) => `<rect x="${x - 12}" y="${y - 12}" width="${w + 24}" height="${h + 24}" fill="none" stroke="#3a3d4c" stroke-width="24"/>${[...Array(n - 1)].map((_, i) => `<rect x="${f(x + (w / n) * (i + 1) - 6)}" y="${y}" width="12" height="${h}" fill="#3a3d4c"/>`).join('')}`;
// ---------- sets ----------
// the lobby: marble floor, elevator doors (o.open), the floor indicator, coffee machine (o.cups), coat closet, glass front
export function lobby(tt, o = {}) { const FLOOR = 860, lt = o.t || 0, open = o.open || 0;
  let back = `<rect x="-800" y="-300" width="3520" height="${FLOOR + 300}" fill="#d8d0c0"/><rect x="-800" y="${FLOOR - 120}" width="3520" height="120" fill="#c0b6a2"/>`;
  for (let x = -800; x < 2720; x += 240) back += `<rect x="${x}" y="-300" width="8" height="${FLOOR + 300}" fill="#b8ae9a"/>`;
  back += cityWindow(-700, 120, 760, 560, lt, o.time || 'morning', 21) + winFrame(-700, 120, 760, 560, 3);
  // elevator
  const ex = 700, ey = 200, ew = 360, eh = FLOOR - 200;
  back += `<rect x="${ex - 40}" y="${ey - 40}" width="${ew + 80}" height="${eh + 40}" fill="#8a8f9c"/><rect x="${ex}" y="${ey}" width="${ew}" height="${eh}" fill="#1c1e28"/><rect x="${ex}" y="${ey}" width="${f(ew / 2 * (1 - open))}" height="${eh}" fill="#b8bec8"/><rect x="${f(ex + ew / 2 + ew / 2 * open)}" y="${ey}" width="${f(ew / 2 * (1 - open))}" height="${eh}" fill="#c8ced8"/><rect x="${ex + ew / 2 - 2}" y="${ey}" width="4" height="${eh}" fill="#8a8f9c" opacity="${f(1 - open)}"/>`;
  back += `<rect x="${ex + ew / 2 - 70}" y="${ey - 110}" width="140" height="56" rx="8" fill="#15181e"/><text x="${ex + ew / 2}" y="${ey - 68}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="36" fill="${GOLD}">${o.floorNo || 'L'} ▲</text><rect x="${ex + ew + 60}" y="${ey + 260}" width="40" height="90" rx="8" fill="#8a8f9c"/><circle cx="${ex + ew + 80}" cy="${ey + 290}" r="10" fill="${GOLD}"/>`;
  if (o.line) back += ratio(ex, ey, ew, eh, o.line, lt, { lbl: '7 : 3' });
  if (o.pop) back += `<circle cx="${ex + ew / 2}" cy="${f(ey + eh * 0.3)}" r="${f(20 + o.pop * 120)}" fill="none" stroke="${GOLD}" stroke-width="8" opacity="${f(1 - o.pop)}"/>`;
  back += wallClock(1300, 220, 70, o.h ?? 8, o.m ?? 52, { lt }) + `<rect x="1460" y="${FLOOR - 640}" width="300" height="640" fill="#7a6a56"/><rect x="1470" y="${FLOOR - 630}" width="135" height="620" fill="#8a7a64"/><rect x="1615" y="${FLOOR - 630}" width="135" height="620" fill="#8a7a64"/><circle cx="1595" cy="${FLOOR - 320}" r="8" fill="${GOLD2}"/><circle cx="1625" cy="${FLOOR - 320}" r="8" fill="${GOLD2}"/><text x="1610" y="${FLOOR - 660}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="26" fill="#5a4e40">COATS</text>`;
  let mid = espresso(240, FLOOR, 0.9, lt, o.cups || 0) + `<rect x="80" y="${FLOOR}" width="320" height="0" fill="none"/>`;
  mid += `<g transform="translate(-260 ${FLOOR})"><rect x="-90" y="-60" width="180" height="60" rx="10" fill="#4a3a2e"/><rect x="-30" y="-130" width="60" height="70" rx="8" fill="#4fa06a"/><path d="M 0 -130 q -40 -60 -10 -110 M 0 -130 q 40 -70 30 -120" stroke="#3f8a5a" stroke-width="14" fill="none"/></g>`;
  let floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#e8e0d0"/>`; for (let x = -800; x < 2720; x += 200) floor += `<rect x="${x}" y="${FLOOR}" width="100" height="600" fill="#d0c6b2" opacity="0.6"/>`;
  return { bg: '#d8d0c0', back, mid, floor, FLOOR, ELEV: [ex, ey, ew, eh], blur: 1.0, reflOp: 0.12, tex: 0.16, vig: 0.45 };
}
// the open office: windows on the city (o.time), a wall clock (o.h/o.m), a big timer screen (o.timer), cubicles with desks
// and monitors, coworkers (o.crowd: 0..1), some asleep with their eyes open (o.sleepy); o.empty = lamps on, chairs empty;
// o.seal = red light; o.tilt = the floor folding (0..1); o.dust
export function office(tt, o = {}) { const FLOOR = 860, lt = o.t || 0, time = o.time || 'morning', night = time === 'night' || time === 'evening', tilt = o.tilt || 0;
  let back = `<rect x="-800" y="-300" width="3520" height="${FLOOR + 300}" fill="${night ? '#3a3440' : '#dcd6cc'}"/>`;
  back += cityWindow(-500, 80, 1180, 470, lt, time, o.seed || 31) + winFrame(-500, 80, 1180, 470, 4);
  back += cityWindow(1120, 80, 1180, 470, lt, time, (o.seed || 31) + 6) + winFrame(1120, 80, 1180, 470, 4);
  back += wallClock(895, 230, 86, o.h ?? 10, o.m ?? 0, { lt, glow: o.clockGlow });
  if (o.timer) back += `<g transform="translate(895 430)"><rect x="-170" y="-60" width="340" height="110" rx="12" fill="#15181e"/><text x="0" y="22" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="58" fill="${RED}" opacity="${f(0.8 + 0.2 * (Math.floor(lt * 2) % 2))}">${o.timer}</text></g>`;
  back += `<rect x="-800" y="580" width="3520" height="18" fill="${night ? '#2a2630' : '#bab2a4'}"/>`;
  // ceiling lights
  for (let x = -600; x < 2600; x += 400) back += `<rect x="${x}" y="-10" width="220" height="20" rx="6" fill="#f4f0e4" opacity="${night ? 0.6 : 0.9}"/>`;
  let mid = '', far = '';
  // far row of cubicles (small), near row (big)
  const crowd = o.empty ? 0 : (o.crowd ?? 1);
  for (let i = 0; i < 9; i++) { const x = -500 + i * 300; far += `<rect x="${x - 140}" y="${FLOOR - 330}" width="280" height="150" fill="${night ? '#4a4452' : '#9aa0ac'}"/>` + desk(x, FLOOR - 180, 0.6, lt, { seed: i + 3, lamp: o.empty || night, scr: o.seal ? '#ff8a8a' : undefined }); if (rnd(i + 2) < crowd) far += coworker(x + 10, FLOOR - 250, 0.6, lt, { sleep: o.sleepy && i % 2, eyes: o.sleepy, col: ['#3a3f52', '#4a3a52', '#2a4a5a', '#5a4a3a'][i % 4] }); }
  for (let i = 0; i < 6; i++) { const x = -420 + i * 520; mid += `<rect x="${x - 220}" y="${FLOOR - 300}" width="12" height="300" fill="#5a5f6c"/>` + desk(x, FLOOR, 1.0, lt, { seed: i, lamp: o.empty || night, dead: o.deadPlant && i === 3 }); if (o.chairs !== false) mid += `<g transform="translate(${x + 40} ${FLOOR})"><rect x="-50" y="-140" width="100" height="16" rx="6" fill="#2a2d3a"/><rect x="-46" y="-260" width="92" height="120" rx="20" fill="#3a3d4c"/><rect x="-6" y="-124" width="12" height="90" fill="#2a2d3a"/><path d="M -50 0 L 0 -34 L 50 0" stroke="#2a2d3a" stroke-width="8" fill="none"/></g>`; }
  if (o.dust) for (let i = 0; i < 26; i++) mid += `<circle cx="${f(rnd(i) * 1920 + Math.sin(lt + i) * 20)}" cy="${f((rnd(i * 3) * 900 + lt * 30) % 900)}" r="${f(2 + rnd(i * 5) * 4)}" fill="#e8dcc8" opacity="0.5"/>`;
  if (o.seal) mid += `<rect x="-800" y="-300" width="3520" height="1500" fill="${RED}" opacity="${f(0.10 + 0.05 * Math.sin(lt * 3))}"/>`;
  let floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="${night ? '#2a2630' : '#8a8478'}"/>`; for (let x = -800; x < 2720; x += 160) floor += `<rect x="${x}" y="${FLOOR}" width="80" height="600" fill="#000" opacity="0.05"/>`;
  if (tilt) { mid = `<g transform="rotate(${f(-tilt * 9)} 960 ${FLOOR}) translate(${f(tilt * 80)} ${f(tilt * 60)})">${mid}</g>`; far = `<g transform="rotate(${f(-tilt * 5)} 960 ${FLOOR})">${far}</g>`; floor += `<path d="M -800 ${FLOOR} L 2720 ${f(FLOOR - tilt * 180)} L 2720 1500 L -800 1500 Z" fill="#15181e" opacity="${f(0.3 * tilt)}"/>`; }
  return { bg: night ? '#3a3440' : '#dcd6cc', back: back + far, mid, floor, FLOOR, blur: 1.0, reflOp: 0.06, tex: 0.16, vig: night ? 0.7 : 0.45 };
}
// the fire stairwell on the ninth floor: concrete, rails, a fire door with 9F, a green EXIT sign; o.pulse = red pulse
// behind the door; o.glass = the glass wall (0 = whole, 0..1 = the arch opening), o.chalk = the chalk 7:3 mark
export function stairwell(tt, o = {}) { const FLOOR = 870, lt = o.t || 0, pulse = o.pulse || 0, pv = pulse * (0.5 + 0.5 * Math.max(0, Math.sin(lt * 2.4)));
  let back = `<rect x="-800" y="-300" width="3520" height="${FLOOR + 300}" fill="#8a8a88"/>`; for (let i = 0; i < 40; i++) back += `<rect x="${f(-800 + rnd(i) * 3500)}" y="${f(-300 + rnd(i * 3) * 1100)}" width="${f(40 + rnd(i * 5) * 120)}" height="6" fill="#7a7a78" opacity="0.6"/>`;
  back += `<path d="M -300 ${FLOOR} L 500 ${FLOOR - 420} L 500 ${FLOOR - 400} L -300 ${FLOOR + 20} Z" fill="#6a6a68"/>${[...Array(8)].map((_, i) => `<rect x="${-300 + i * 100}" y="${FLOOR - 52 * (i + 1)}" width="100" height="14" fill="#5a5a58"/>`).join('')}<path d="M -300 ${FLOOR - 120} L 500 ${FLOOR - 540}" stroke="${GOLD2}" stroke-width="10"/>${[...Array(5)].map((_, i) => `<line x1="${-300 + i * 200}" y1="${FLOOR - 120 - i * 105}" x2="${-300 + i * 200}" y2="${FLOOR - 20 - i * 105}" stroke="${GOLD2}" stroke-width="6"/>`).join('')}`;
  // fire door
  const dx = 900, dw = 320; back += `<rect x="${dx - 20}" y="${FLOOR - 560}" width="${dw + 40}" height="560" fill="#5a5f6c"/><rect x="${dx}" y="${FLOOR - 540}" width="${dw}" height="540" fill="${RED2}"/><rect x="${dx + 40}" y="${FLOOR - 480}" width="80" height="120" fill="#c8dce8" opacity="0.6"/><rect x="${dx + 20}" y="${FLOOR - 280}" width="${dw - 40}" height="24" rx="8" fill="#c8ccd6"/><text x="${dx + dw / 2 + 60}" y="${FLOOR - 400}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="#fff">9F</text>`;
  if (pulse) back += `<rect x="${dx}" y="${FLOOR - 540}" width="${dw}" height="540" fill="${RED}" opacity="${f(0.4 * pv)}"/><ellipse cx="${dx + dw / 2}" cy="${FLOOR - 270}" rx="${f(300 + pv * 120)}" ry="${f(380 + pv * 120)}" fill="${RED}" opacity="${f(0.18 * pv)}"/>${[0, 1, 2].map((i) => `<path d="M ${dx - 40 - i * 60} ${FLOOR - 500} q -30 250 0 500" stroke="${RED}" stroke-width="6" fill="none" opacity="${f(pv * (0.6 - i * 0.18))}"/><path d="M ${dx + dw + 40 + i * 60} ${FLOOR - 500} q 30 250 0 500" stroke="${RED}" stroke-width="6" fill="none" opacity="${f(pv * (0.6 - i * 0.18))}"/>`).join('')}`;
  back += `<rect x="${dx + 60}" y="${FLOOR - 680}" width="200" height="70" rx="8" fill="#15181e"/><text x="${dx + 160}" y="${FLOOR - 630}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="${GREEN}">EXIT</text>`;
  // glass wall on the right
  const gx = 1420, gw = 620, open = o.glass || 0;
  back += `<rect x="${gx}" y="${FLOOR - 620}" width="${gw}" height="620" fill="#9fd0f0" opacity="0.35"/>${[0, 1, 2].map((i) => `<rect x="${gx + i * gw / 3}" y="${FLOOR - 620}" width="10" height="620" fill="#5a6a7a"/>`).join('')}<rect x="${gx}" y="${FLOOR - 630}" width="${gw}" height="14" fill="#5a6a7a"/>`;
  if (open > 0) back += `<path d="M ${gx + 120} ${FLOOR} L ${gx + 120} ${f(FLOOR - 300 * open)} Q ${gx + gw / 2} ${f(FLOOR - 560 * open)} ${gx + gw - 120} ${f(FLOOR - 300 * open)} L ${gx + gw - 120} ${FLOOR} Z" fill="#1a1e2a"/>${[...Array(8)].map((_, i) => `<path d="M ${f(gx + 120 + rnd(i) * 380)} ${f(FLOOR - rnd(i * 3) * 400)} l ${f(20 + rnd(i) * 30)} ${f(30 * open)}" stroke="#bfe4ff" stroke-width="4" opacity="${f(1 - open)}"/>`).join('')}`;
  if (o.chalk) back += `<line x1="${gx + 60}" y1="${FLOOR - 434}" x2="${gx + gw - 60}" y2="${FLOOR - 434}" stroke="#fff" stroke-width="8" stroke-dasharray="30 10" opacity="${f(o.chalk)}"/><text x="${gx + gw / 2}" y="${FLOOR - 450}" text-anchor="middle" font-family="Caveat, Inter" font-weight="900" font-size="44" fill="#fff" opacity="${f(o.chalk)}">7 : 3</text>`;
  let mid = `<rect x="-200" y="20" width="90" height="16" fill="#5a5f72"/><ellipse cx="-155" cy="44" rx="40" ry="8" fill="#fff4c8" opacity="${f(0.7 + 0.3 * (Math.sin(lt * 13) > -0.7 ? 1 : 0.2))}"/>`;
  if (o.alarm) mid += fireAlarm(700, FLOOR - 400, 1, lt, 1) + `<rect x="-800" y="-300" width="3520" height="1500" fill="${RED}" opacity="${f(Math.sin(lt * 14) > 0 ? 0.08 : 0)}"/>`;
  const floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#6a6a68"/><rect x="-800" y="${FLOOR}" width="3520" height="14" fill="${GOLD2}" opacity="0.6"/>`;
  return { bg: '#8a8a88', back, mid, floor, FLOOR, DOOR: [dx, FLOOR - 540, dw, 540], GLASS: [gx, FLOOR - 620, gw, 620], blur: 1.1, reflOp: 0.05, tex: 0.2, vig: 0.6 };
}
// the file room: shelves of boxes, one plain wall in the middle (o.fold: 0..1 it folds like wet paper), the ceiling
// (o.ceil: inches it has dropped, 0..1), dust
export function fileRoom(tt, o = {}) { const FLOOR = 870, lt = o.t || 0, fold = o.fold || 0, ceil = o.ceil || 0;
  let back = `<rect x="-800" y="-300" width="3520" height="${FLOOR + 300}" fill="#5a5448"/>`;
  for (let s = 0; s < 2; s++) { const sx = s ? 1380 : -700; for (let r = 0; r < 5; r++) { back += `<rect x="${sx}" y="${FLOOR - 160 - r * 150}" width="900" height="14" fill="#3a3630"/>`; for (let b = 0; b < 9; b++) back += `<rect x="${sx + 10 + b * 98}" y="${FLOOR - 270 - r * 150}" width="88" height="110" fill="${['#c8b48a', '#b8a47a', '#d8c49a'][(b + r) % 3]}"/><rect x="${sx + 30 + b * 98}" y="${FLOOR - 240 - r * 150}" width="48" height="16" fill="#fff" opacity="0.7"/>`; } back += `<rect x="${sx}" y="${FLOOR - 920}" width="14" height="920" fill="#3a3630"/><rect x="${sx + 886}" y="${FLOOR - 920}" width="14" height="920" fill="#3a3630"/>`; }
  // the wall in the middle
  const wx = 380, ww = 860, wy = 0;
  if (fold < 1) { const k = fold; back += `<g transform="translate(${wx + ww / 2} ${FLOOR}) scale(${f(1 - 0.2 * k)} ${f(1 - 0.85 * k)}) skewX(${f(k * 18)})"><rect x="${-ww / 2}" y="${-FLOOR + wy}" width="${ww}" height="${FLOOR - wy}" fill="#c8c0ae"/>${[...Array(6)].map((_, i) => `<rect x="${-ww / 2}" y="${-FLOOR + wy + i * 150}" width="${ww}" height="4" fill="#a8a08e"/>`).join('')}${k > 0 ? [...Array(5)].map((_, i) => `<path d="M ${-ww / 2 + 40 + i * 190} ${-FLOOR + 120 + (i % 2) * 140} l 30 ${f(90 * k)} l -24 ${f(70 * k)} l 36 ${f(110 * k)} l -18 ${f(80 * k)}" stroke="#3a3630" stroke-width="6" fill="none"/>`).join('') : ''}</g>`; }
  if (fold >= 1) back += `<rect x="${wx}" y="0" width="${ww}" height="${FLOOR}" fill="#1a1810"/><path d="M ${wx} ${FLOOR} q ${ww / 2} -140 ${ww} 0 Z" fill="#a8a08e"/>`;
  if (o.line) back += goldLine(wx - 20, wy + (FLOOR - wy) * 0.3, wx + ww + 20, wy + (FLOOR - wy) * 0.3, o.line, lt);
  // ceiling
  back += `<rect x="-800" y="${f(-300 + ceil * 120)}" width="3520" height="320" fill="#4a4438"/>${[...Array(8)].map((_, i) => `<rect x="${-600 + i * 400}" y="${f(ceil * 120)}" width="200" height="16" fill="#f4f0e4" opacity="0.7"/>`).join('')}`;
  let mid = '';
  const dust = o.dust ?? fold; for (let i = 0; i < 40; i++) mid += `<circle cx="${f(300 + rnd(i) * 1300 + Math.sin(lt * 0.8 + i) * 30)}" cy="${f(FLOOR - ((rnd(i * 3) * 800 + lt * (20 + i)) % 800))}" r="${f(3 + rnd(i * 5) * 7)}" fill="#e8dcc8" opacity="${f(0.5 * dust)}"/>`;
  if (fold > 0.5) mid += `<ellipse cx="${wx + ww / 2}" cy="${FLOOR}" rx="${f(600 * fold)}" ry="120" fill="#d8ccb4" opacity="${f(0.4 * fold)}"/>`;
  const floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#4a4438"/>`;
  return { bg: '#5a5448', back, mid, floor, FLOOR, WALL: [wx, wy, ww, FLOOR - wy], blur: 1.1, reflOp: 0.04, tex: 0.22, vig: 0.65 };
}
// the office tower from the street: red/gold sky, lit windows with silhouettes, a big clock on the facade (o.h/o.m),
// detailed neighbours in parallax, lamp posts; o.seal = red glow on the doors; o.time 'morning' | 'evening' | 'night'
export function tower(tt, o = {}) { const FLOOR = 900, lt = o.t || 0, time = o.time || 'night', night = time !== 'morning';
  const [a, b] = time === 'morning' ? ['#7ab4e8', '#ffe0b0'] : time === 'evening' ? ['#3a0a1a', '#e05a2a'] : ['#12040a', '#7a1020'];
  let back = sky(a, b, -300, FLOOR) + (night ? moon(1600, 160, 70, lt, { col: time === 'evening' ? '#ffb040' : RED }) : `<circle cx="1600" cy="160" r="60" fill="#fff4c8"/>`) + clouds(4, 40, 300, lt, night ? '#5a1a2a' : '#fff', 0.5, 9);
  back += `<g transform="translate(${f(-tt * 6)} 0)">${skyline(FLOOR - 60, lt, { night, seed: 41 })}</g>`;
  // the tower
  const tx = 560, tw = 800, th = 1100;
  back += `<rect x="${tx - 30}" y="${FLOOR - th - 30}" width="${tw + 60}" height="40" fill="#1a1c26"/><rect x="${tx}" y="${FLOOR - th}" width="${tw}" height="${th}" fill="${night ? '#22242e' : '#6a7080'}"/>`;
  const cols = 8, rows = 12;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = tx + 30 + c * 96, y = FLOOR - th + 220 + r * 66, on = night ? rnd(r * 13 + c * 7 + 3) < (o.lit ?? 0.82) : false;
    back += `<rect x="${x}" y="${y}" width="70" height="46" fill="${on ? (o.seal ? '#ff8a6a' : '#ffe8a8') : night ? '#2e3240' : '#9fd0f0'}" opacity="${on ? f(0.85 + 0.15 * Math.sin(lt * 0.7 + r + c)) : 0.8}"/>`;
    if (on && rnd(r * 5 + c * 11) < (o.people ?? 0.45)) { const px = x + 20 + Math.sin(lt * 0.5 + r * c) * 10; back += `<circle cx="${f(px)}" cy="${y + 20}" r="9" fill="#15181e"/><rect x="${f(px - 11)}" y="${y + 28}" width="22" height="18" rx="6" fill="#15181e"/>`; } }
  // big clock
  back += wallClock(tx + tw / 2, FLOOR - th + 110, 80, o.h ?? 5, o.m ?? 0, { lt, rim: '#c8a040', glow: o.clockGlow });
  // entrance
  back += `<rect x="${tx + tw / 2 - 160}" y="${FLOOR - 190}" width="320" height="190" fill="${o.seal ? RED2 : '#ffe8a8'}" opacity="0.9"/><rect x="${tx + tw / 2 - 4}" y="${FLOOR - 190}" width="8" height="190" fill="#15181e"/><rect x="${tx + tw / 2 - 200}" y="${FLOOR - 220}" width="400" height="30" fill="#15181e"/>`;
  if (o.seal) back += `<rect x="${tx}" y="${FLOOR - th}" width="${tw}" height="${th}" fill="${RED}" opacity="${f(0.12 + 0.08 * Math.sin(lt * 3))}"/><rect x="${tx - 10}" y="${FLOOR - th - 10}" width="${tw + 20}" height="${th + 10}" fill="none" stroke="${RED}" stroke-width="${f(8 + 4 * Math.sin(lt * 4))}" opacity="0.7"/>`;
  back += `<g transform="translate(${tx - 520} 0)">${bldg(0, FLOOR, 380, 640, { night, seed: 5, lt })}</g><g transform="translate(${tx + tw + 140} 0)">${bldg(0, FLOOR, 400, 720, { night, seed: 8, lt, col: '#a88a6a' })}</g>`;
  let mid = lampPost(200, FLOOR, 480, 0, night ? 1 : 0) + lampPost(1700, FLOOR, 480, 0, night ? 1 : 0);
  const floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#2a2a32"/><rect x="-800" y="${FLOOR}" width="3520" height="20" fill="#4a4a52"/>${[...Array(12)].map((_, i) => `<rect x="${-700 + i * 300}" y="${FLOOR + 110}" width="140" height="10" fill="#e8d870" opacity="0.6"/>`).join('')}`;
  return { bg: a, back, mid, floor, FLOOR, blur: 1.0, reflOp: 0.08, tex: 0.16, vig: 0.6 };
}
// the boss's meeting room: a long table, a whiteboard with a chart, a glass wall onto the office, a wall clock
export function meeting(tt, o = {}) { const FLOOR = 860, lt = o.t || 0;
  let back = `<rect x="-800" y="-300" width="3520" height="${FLOOR + 300}" fill="#cfc8ba"/>` + cityWindow(1200, 80, 900, 500, lt, o.time || 'noon', 51) + winFrame(1200, 80, 900, 500, 3);
  back += `<rect x="-200" y="140" width="760" height="420" rx="10" fill="#f4f4f0" stroke="#8a8f9c" stroke-width="10"/><path d="M -150 500 L -20 420 L 120 460 L 260 300 L 400 340 L 500 200" stroke="${RED}" stroke-width="10" fill="none"/><text x="180" y="200" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#2a2d3a">Q4 · HENDERSON</text>`;
  back += wallClock(820, 220, 70, o.h ?? 10, o.m ?? 0, { lt });
  let mid = `<g transform="translate(760 ${FLOOR})"><rect x="-560" y="-260" width="1120" height="40" rx="14" fill="#6a4a36"/><rect x="-500" y="-220" width="30" height="220" fill="#4a3a2a"/><rect x="470" y="-220" width="30" height="220" fill="#4a3a2a"/>${[-380, -120, 140, 400].map((x) => `<rect x="${x - 60}" y="-252" width="120" height="8" fill="#f4efe4"/>`).join('')}<rect x="-40" y="-300" width="60" height="40" rx="6" fill="${GOLD}"/></g>`;
  const floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#7a7468"/>`;
  return { bg: '#cfc8ba', back, mid, floor, FLOOR, blur: 1.0, reflOp: 0.05, tex: 0.16, vig: 0.45 };
}
