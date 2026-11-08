// FLAT 2D TEST — the subway cold open (s001–s007) redrawn as flat vector illustration (no 3D), for a side-by-side
// comparison with the 3D version. Our own design and colours: warm cream tiles, a red stripe, soft blurred background,
// a small simple character, plus the same HUD / labels / captions. Overrides the 3D shots of the same id.
import { registerShot, clamp, ease } from '/engine/api.js';
import { person } from '../lib/char2d.js';
import { CAST, P_STAND, P_FLOAT, P_PHONE } from '../lib/people.js';
import { hud, label, caption, punch, speedLines, COL } from '../lib/hud.js';
import * as L from '../lib/luffy.js';

const f = (n) => n.toFixed(1);
const ST = { none: { text: 'POWER · ???', on: false }, rubber: { text: 'RUBBER · ON', on: true, color: COL.red }, off: { text: 'RUBBER · IDLE', on: false } };
const H0 = { day: 1, time: '7:58 AM', status: ST.none };
const HERO = { ...CAST.heroHoodie };
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };

// ---- the station, drawn flat (stage px at zoom 1). Layers: back (blurred) -> mid -> floor.
const FLOOR = 760;
// palette: cool, desaturated, hazy; colour comes from the lights and signs (soft glows), not from the walls
const PAL = { ceil: '#262c35', wall: '#8495a0', tile: '#788994', stripe: '#b5524a', stripe2: '#8e3d37', pillar: '#66757f', pillarS: '#56636c', stair: ['#6f7d86', '#7a8891'], floor: '#5d6a72', floorL: '#71808a', rail: '#454f57' };
function station(tt) {
  let back = `<defs><radialGradient id="zglw"><stop offset="0" stop-color="#fff3d6" stop-opacity="0.9"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0"/></radialGradient><radialGradient id="zgB"><stop offset="0" stop-color="#6fa0ff" stop-opacity="0.55"/><stop offset="1" stop-color="#6fa0ff" stop-opacity="0"/></radialGradient><radialGradient id="zgA"><stop offset="0" stop-color="#ffb347" stop-opacity="0.55"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient><linearGradient id="zhaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe8ec" stop-opacity="0"/><stop offset="0.55" stop-color="#c9d6de" stop-opacity="0.28"/><stop offset="1" stop-color="#dfe8ec" stop-opacity="0.1"/></linearGradient></defs>`;
  back += `<rect x="-400" y="-200" width="2720" height="1400" fill="${PAL.ceil}"/><defs><linearGradient id="zwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f7480"/><stop offset="0.6" stop-color="${PAL.wall}"/><stop offset="1" stop-color="#a99fa6"/></linearGradient></defs><rect x="-400" y="110" width="2720" height="${FLOOR - 110}" fill="url(#zwall)"/>`;
  for (let x = -400; x < 2320; x += 80) back += `<line x1="${x}" y1="110" x2="${x}" y2="${FLOOR}" stroke="${PAL.tile}" stroke-width="2"/>`;
  for (let y = 150; y < FLOOR; y += 40) back += `<line x1="-400" y1="${y}" x2="2320" y2="${y}" stroke="${PAL.tile}" stroke-width="2"/>`;
  back += `<rect x="-400" y="430" width="2720" height="30" fill="${PAL.stripe}"/><rect x="-400" y="460" width="2720" height="6" fill="${PAL.stripe2}"/>`;
  [[620, '#3e64a8', 'LINE 2', 'gB'], [1320, '#d08a2c', 'EXIT →', 'gA']].forEach(([x, c, t, gl]) => { back += `<ellipse cx="${x + 130}" cy="305" rx="300" ry="190" fill="url(#z${gl})"/><rect x="${x}" y="230" width="260" height="150" rx="12" fill="${c}"/><text x="${x + 130}" y="320" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#f4f6f8">${t}</text>`; });
  for (let x = -300; x < 2320; x += 360) back += `<path d="M ${x + 20} 86 L ${x + 200} 86 L ${x + 330} ${FLOOR} L ${x - 110} ${FLOOR} Z" fill="#fff6e2" opacity="0.06"/>`;
  // posters (abstract, our own): framed, muted
  [[180, '#d27b5a', '#f1d7a8'], [1050, '#4f8a8b', '#e8e2c9'], [1700, '#8a6bb0', '#f0d0dc']].forEach(([x, c1, c2], i) => { back += `<rect x="${x - 6}" y="214" width="152" height="202" rx="6" fill="#3c4650"/><rect x="${x}" y="220" width="140" height="190" fill="${c2}"/><circle cx="${x + 70}" cy="${290 + (i % 2) * 20}" r="${40 + i * 6}" fill="${c1}"/><rect x="${x + 16}" y="368" width="108" height="10" rx="5" fill="${c1}" opacity="0.7"/><rect x="${x + 16}" y="386" width="70" height="8" rx="4" fill="#3c4650" opacity="0.4"/>`; });
  // red 'train approaching' signal at the tunnel mouth, with a soft glow
  back += `<defs><radialGradient id="zgR"><stop offset="0" stop-color="#ff4a3d" stop-opacity="0.7"/><stop offset="1" stop-color="#ff4a3d" stop-opacity="0"/></radialGradient></defs><ellipse cx="2060" cy="300" rx="260" ry="240" fill="url(#zgR)"/><rect x="2030" y="230" width="60" height="150" rx="14" fill="#1f252c"/><circle cx="2060" cy="270" r="20" fill="#ff4a3d"/><circle cx="2060" cy="335" r="20" fill="#3a2a2a"/>`;
  // far haze layer: soft depth
  back += `<rect x="-400" y="110" width="2720" height="${FLOOR - 110}" fill="url(#zhaze)"/>`;
  back += `<rect x="-400" y="40" width="2720" height="70" fill="#1d222a"/>`;
  for (let x = -300; x < 2320; x += 360) back += `<ellipse cx="${x + 110}" cy="110" rx="260" ry="110" fill="url(#zglw)" opacity="0.55"/><rect x="${x}" y="74" width="220" height="12" rx="6" fill="#fff6e2"/>`;
  let mid = '';
  for (const x of [880, 1560]) mid += `<rect x="${x}" y="110" width="70" height="${FLOOR - 110}" fill="${PAL.pillar}"/><rect x="${x + 46}" y="110" width="24" height="${FLOOR - 110}" fill="${PAL.pillarS}"/><rect x="${x + 6}" y="110" width="6" height="${FLOOR - 110}" fill="#a3b0b6" opacity="0.6"/>`;
  for (let s = 0; s < 9; s++) { const x = -120 + s * 66, y = 330 + s * 48; mid += `<rect x="${x}" y="${y}" width="66" height="${FLOOR - y + 300}" fill="${PAL.stair[s % 2]}"/><rect x="${x}" y="${y}" width="66" height="6" fill="#b8c3c8"/>`; }
  mid += `<rect x="640" y="${FLOOR - 70}" width="190" height="16" rx="6" fill="#4a555e"/><rect x="652" y="${FLOOR - 56}" width="10" height="56" fill="#3a434b"/><rect x="808" y="${FLOOR - 56}" width="10" height="56" fill="#3a434b"/><rect x="640" y="${FLOOR - 126}" width="190" height="14" rx="6" fill="#4a555e"/>`;
  mid += `<rect x="970" y="${FLOOR - 92}" width="58" height="92" rx="6" fill="#4c5760"/><rect x="964" y="${FLOOR - 98}" width="70" height="14" rx="5" fill="#3d464e"/>${[0, 1, 2, 3].map((i) => `<line x1="${980 + i * 12}" y1="${FLOOR - 78}" x2="${980 + i * 12}" y2="${FLOOR - 10}" stroke="#3d464e" stroke-width="3"/>`).join('')}`;
  mid += `<line x1="-120" y1="250" x2="520" y2="${FLOOR - 140}" stroke="${PAL.rail}" stroke-width="9" stroke-linecap="round"/>`;
  mid += `<line x1="1040" y1="600" x2="1900" y2="600" stroke="${PAL.rail}" stroke-width="11" stroke-linecap="round"/>`; for (let x = 1060; x <= 1880; x += 164) mid += `<line x1="${x}" y1="600" x2="${x}" y2="${FLOOR + 40}" stroke="${PAL.rail}" stroke-width="8"/>`;
  // polished floor: sheen + soft reflections of the lights and signs
  let floor = `<defs><linearGradient id="zfloor" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d7a84"/><stop offset="0.5" stop-color="#8a8590"/><stop offset="1" stop-color="#9a7f86"/></linearGradient></defs><rect x="-400" y="${FLOOR}" width="2720" height="600" fill="url(#zfloor)"/><rect x="-400" y="${FLOOR}" width="2720" height="90" fill="${PAL.floorL}" opacity="0.6"/><rect x="-400" y="${FLOOR}" width="2720" height="6" fill="#6c777d"/>`;
  floor += `<ellipse cx="750" cy="${FLOOR + 70}" rx="200" ry="40" fill="url(#zgB)" opacity="0.6"/><ellipse cx="1450" cy="${FLOOR + 70}" rx="200" ry="40" fill="url(#zgA)" opacity="0.6"/>`;
  [[300, 880, 260], [1180, 900, 340], [1800, 860, 200]].forEach(([cx, cy, rx]) => { floor += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * 0.12)}" fill="#a9bcc8" opacity="0.22"/>`; });
  for (let x = 1060; x <= 1880; x += 164) floor += `<rect x="${x - 4}" y="${FLOOR + 40}" width="8" height="60" fill="${PAL.rail}" opacity="0.18"/>`;
  floor += `<rect x="-400" y="1010" width="2720" height="16" fill="#d9b23a"/><rect x="-400" y="1026" width="2720" height="200" fill="#6e797f"/>`;
  // drifting dust in the light
  for (let i = 0; i < 26; i++) { const px = ((i * 271 + tt * 14) % 2400) - 300, py = 140 + ((i * 137 + tt * 6 * (1 + i % 3)) % 560); mid += `<circle cx="${f(px)}" cy="${f(py)}" r="${1.5 + (i % 3)}" fill="#fff8e6" opacity="${0.15 + (i % 4) * 0.06}"/>`; }
  return { back, mid, floor };
}
let FRAMEID = 0;
// one flat frame: v = { z: zoom, cx, cy } camera; people: [[x, y(feet), h, pose, outfit, face, flip, extra]]
function frame(U, t, tt, v, people, fx = '') {
  const S = station(tt), z = v.z || 1, tx = 960 - v.cx * z, ty = 540 - v.cy * z;
  let ppl = '', refl = ''; const out = [];
  for (const [x, y, h, pose, outfit, face, flip, extra] of people) { const c = person(x, y, h, pose, { ...outfit, face, flip, look: flip ? -0.5 : 0.5, rim: '#b9dcff' }); out.push(c); if (y >= FLOOR) refl += `<g transform="translate(0 ${f(2 * y + 6)}) scale(1 -1)" opacity="0.09">${c.svg.replace(/<defs>.*?<\/defs>/, '').replace(/ filter="url\(#ol[^)]*\)"/, '')}</g>`; ppl += `<ellipse cx="${f(x)}" cy="${f(y + 4)}" rx="${f(h * 0.16)}" ry="${f(h * 0.03)}" fill="#000" opacity="0.18"/>` + c.svg + (extra ? extra(c) : ''); }
  const UID = (++FRAMEID).toString(36), uniq = (x) => x.replace(/id="([A-Za-z][\w-]*)"/g, `id="$1_${UID}"`).replace(/url\(#([A-Za-z][\w-]*)\)/g, `url(#$1_${UID})`);
  U.svg('flat', uniq(`<defs><filter id="bl"><feGaussianBlur stdDeviation="${f(5 / z)}"/></filter><linearGradient id="warm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0d8" stop-opacity="0.10"/><stop offset="1" stop-color="#20304a" stop-opacity="0.22"/></linearGradient></defs><g transform="translate(${f(tx)} ${f(ty)}) scale(${f(z)})"><g filter="url(#bl)">${S.back}</g>${S.mid}${S.floor}<g filter="url(#bl)">${refl}</g>${ppl}${typeof fx === 'function' ? fx(out) : fx}</g><rect width="1920" height="1080" fill="url(#warm)"/><defs><radialGradient id="zvig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#0d1118" stop-opacity="0"/><stop offset="1" stop-color="#0d1118" stop-opacity="0.55"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#zvig)"/><defs><linearGradient id="hudbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14121c" stop-opacity="0.75"/><stop offset="1" stop-color="#14121c" stop-opacity="0"/></linearGradient></defs><rect width="1920" height="200" fill="url(#hudbg)"/>`), { z: 2 });
  return out;
}
const tops = ['#e0723a', '#9a5cc0', '#2f9a8e', '#a8a6ad', '#4a6fb5', '#c9a03a', '#6c6f78'];
const PHONE = (c) => { const hd = c.hands[1], r = c.R, dir = Math.sign(hd[0] - c.head[0]) || 1, w = r * 0.42, h = r * 0.74, cx = hd[0] + dir * r * 0.04, cy = hd[1] - h * 0.32, rot = -dir * 22;
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(rot)})"><rect x="${f(-w / 2 - 3)}" y="${f(-h / 2 - 3)}" width="${f(w + 6)}" height="${f(h + 6)}" rx="${f(r * 0.12)}" fill="#b9dcff" opacity="0.9"/><rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(r * 0.1)}" fill="#15181e"/><rect x="${f(-w / 2 + r * 0.05)}" y="${f(-h / 2 + r * 0.07)}" width="${f(w - r * 0.1)}" height="${f(h - r * 0.14)}" rx="${f(r * 0.05)}" fill="#8fd0ff"/><rect x="${f(-w / 2 + r * 0.1)}" y="${f(-h / 2 + r * 0.14)}" width="${f(w * 0.5)}" height="${f(r * 0.05)}" rx="2" fill="#ffffff" opacity="0.8"/><rect x="${f(-w / 2 + r * 0.1)}" y="${f(-h / 2 + r * 0.24)}" width="${f(w * 0.35)}" height="${f(r * 0.05)}" rx="2" fill="#ffffff" opacity="0.6"/></g>`
    + `<ellipse cx="${f(hd[0] + dir * r * 0.02)}" cy="${f(hd[1] - r * 0.02)}" rx="${f(r * 0.2)}" ry="${f(r * 0.17)}" fill="#0c0c12" stroke="#b9dcff" stroke-width="2.5"/><circle cx="${f(hd[0] - dir * r * 0.14)}" cy="${f(hd[1] - r * 0.2)}" r="${f(r * 0.08)}" fill="#0c0c12" stroke="#b9dcff" stroke-width="2"/>`
    + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.1)}" fill="#8fd0ff" opacity="0.07"/>`; };
const crowd = (tt, n = 7) => Array.from({ length: n }, (_, i) => [990 + i * 128 + (i % 2) * 26, FLOOR + 18 + (i % 3) * 16, 300 + (i % 3) * 16, { ...P_PHONE, aR: [28 + (i % 3) * 6, 128 + Math.sin(tt * 0.7 + i) * 3], head: 16 }, { top: tops[i % 7], bottom: ['#22263a', '#2f333d', '#1d2433'][i % 3], sleeves: i % 3 === 1 ? 'short' : 'long', hair: ['ponytail', 'curly', undefined, 'short'][i % 4], cap: i % 4 === 2 ? ['#3f6db3', '#c9483c'][(i >> 2) % 2] : undefined, scarf: i % 5 === 3 ? '#c8352e' : undefined }, 'neutral', i % 2 === 0, PHONE]);
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const RAIL = [1300, 600];
const stairPos = (k) => [-60 + k * 560, 330 + k * (FLOOR - 330)];

registerShot('s001', { bg: '#262c35', theme: 'dark', ui(U, t, info) { const tt = info.start + t, k = clamp(t / 2.8), p = stairPos(0.35 + k * 0.55); frame(U, t, tt, { z: 1.0 + t * 0.02, cx: 900, cy: 520 }, [...crowd(tt, 6), [p[0], p[1], 320, walk(tt), HERO, 'neutral', false]]); chrome(U, t, info, H0); } });
registerShot('s002', { bg: '#262c35', theme: 'dark', ui(U, t, info) { const tt = info.start + t, k = ease.in(clamp(t / 2.2)), p = stairPos(0.92); frame(U, t, tt, { z: 1.7, cx: p[0] + 80, cy: p[1] - 160 }, [...crowd(tt, 4), [p[0] + k * 60, p[1] + k * 30, 320, { ...P_STAND, lean: -18 - k * 40, aL: [140, 150], aR: [120, 160], lL: [30, 30], head: -20 }, HERO, 'open', false]]); chrome(U, t, info, H0); } });
const armFx = (k, lines, o = {}) => (cs) => { const c = cs[cs.length - 1]; if (!c) return ''; const S = L.shoulder(c, 1), H = [S[0] + (RAIL[0] - S[0]) * k, S[1] + (RAIL[1] - S[1]) * k]; return L.stretchArm(S, H, c.R * 0.42, c.R * 3.6, { sleeve: HERO.top, lines, ...o }); };
registerShot('s003', { bg: '#262c35', theme: 'dark', ui(U, t, info) { const tt = info.start + t, p = stairPos(0.95); punch(U, t); const cs = frame(U, t, tt, { z: 1.15, cx: 860, cy: 560 }, [...crowd(tt), [p[0] + 60, p[1] + 30, 320, { ...P_STAND, lean: -50, aL: [140, 150], aR: [8, 0], head: -20 }, HERO, 'open', false]], armFx(ease.out(clamp(t / 1.6)) * 0.55, true, { wob: 26, ph: tt, smear: 1 - clamp(t / 1.6) })); const c = cs[cs.length - 1]; speedLines(U, 520, 520, tt, { op: 0.3, z: 25 }); chrome(U, t, info, { ...H0, status: ST.rubber }); } });
registerShot('s004', { bg: '#262c35', theme: 'dark', ui(U, t, info) { const tt = info.start + t, p = stairPos(0.95); frame(U, t, tt, { z: 1.0, cx: 900, cy: 540 }, [...crowd(tt), [p[0] + 60, p[1] + 30, 320, { ...P_STAND, lean: -50, aL: [140, 150], aR: [8, 0], head: -20 }, HERO, 'open', false]], armFx(0.55 + 0.45 * L.springOut(clamp(t / 1.4)), t < 1.2, { wob: 30 * Math.exp(-2.5 * t), ph: tt, grab: t > 0.9, smear: Math.max(0, 1 - t) })); label(U, 'l1', 'STRETCH · 4 M', 0.9, t, 1240, 260); label(U, 'l2', 'ARM THICKNESS · ↓', 1.5, t, 1240, 350, { color: COL.red }); chrome(U, t, info, { ...H0, status: ST.rubber }); } });
registerShot('s005', { bg: '#262c35', theme: 'dark', ui(U, t, info) { const tt = info.start + t, pull = ease.inOut(clamp((t - 1.4) / 1.6)), p0 = stairPos(0.95); const x = p0[0] + 60 + (RAIL[0] - 120 - p0[0] - 60) * pull, y = p0[1] + 30 + (FLOOR + 30 - p0[1] - 30) * pull - Math.sin(pull * Math.PI) * 160;
  frame(U, t, tt, { z: 1.0, cx: 900, cy: 540 }, [...crowd(tt), [x, y, 320, pull < 1 ? { ...P_FLOAT, lean: 30 } : P_STAND, HERO, pull < 1 ? 'open' : 'neutral', false]], (cs) => { const c = cs[cs.length - 1]; if (!c || pull >= 1) return ''; const S = L.shoulder(c, 1); return L.stretchArm(S, RAIL, c.R * 0.42, c.R * 3.6, { sleeve: HERO.top, grab: true, wob: 18 * Math.sin(Math.PI * pull), ph: tt, smear: Math.sin(Math.PI * pull) }); });
  label(U, 'l1', 'BUNGEE MODE', 0.6, t, 1240, 260); chrome(U, t, info, { ...H0, status: ST.rubber }); } });
registerShot('s006', { bg: '#262c35', theme: 'dark', ui(U, t, info) { const tt = info.start + t; frame(U, t, tt, { z: 1.25, cx: 1380, cy: 600 }, crowd(tt)); label(U, 'l1', 'WITNESSES · 0', 0.3, t, 1300, 260); chrome(U, t, info, { ...H0, status: ST.off }); } });
registerShot('s007', { bg: '#262c35', theme: 'dark', ui(U, t, info) { const tt = info.start + t, lh = info.w('You look at your hand', 2.4); frame(U, t, tt, { z: 1.7, cx: 1060, cy: 560 }, [...crowd(tt, 5), [860, FLOOR + 60, 320, t > lh ? { ...P_STAND, aR: [60, 150], head: 20 } : P_STAND, HERO, 'neutral', true]]); label(U, 'l1', 'EYES ON PHONES · 100%', 0.3, t, 1180, 260); chrome(U, t, info, { ...H0, status: ST.off }); } });
