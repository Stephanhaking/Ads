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
function station(tt) {
  let back = `<rect x="-400" y="-200" width="2720" height="1400" fill="#2b2a33"/>`;
  back += `<rect x="-400" y="110" width="2720" height="${FLOOR - 110}" fill="#efe4cf"/>`;
  for (let x = -400; x < 2320; x += 60) back += `<line x1="${x}" y1="110" x2="${x}" y2="${FLOOR}" stroke="#e2d4ba" stroke-width="3"/>`;
  for (let y = 140; y < FLOOR; y += 40) back += `<line x1="-400" y1="${y}" x2="2320" y2="${y}" stroke="#e2d4ba" stroke-width="3"/>`;
  back += `<rect x="-400" y="430" width="2720" height="34" fill="#d2453a"/><rect x="-400" y="466" width="2720" height="8" fill="#a8322a"/>`;
  [[620, '#3f6db3', 'LINE 2'], [1320, '#e0a03a', 'EXIT →']].forEach(([x, c, t]) => { back += `<rect x="${x}" y="230" width="260" height="150" rx="10" fill="${c}"/><text x="${x + 130}" y="320" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#fff">${t}</text>`; });
  back += `<rect x="-400" y="40" width="2720" height="70" fill="#3a3944"/>`;
  for (let x = -300; x < 2320; x += 360) back += `<rect x="${x}" y="72" width="220" height="14" rx="7" fill="#fff6dc"/><rect x="${x - 40}" y="86" width="300" height="80" fill="#fff6dc" opacity="0.08"/>`;
  let mid = '';
  for (const x of [880, 1560]) mid += `<rect x="${x}" y="110" width="70" height="${FLOOR - 110}" fill="#d9ccb2"/><rect x="${x + 50}" y="110" width="20" height="${FLOOR - 110}" fill="#c7b89c"/>`;
  // stairs coming down from the upper left
  for (let s = 0; s < 9; s++) { const x = -120 + s * 66, y = 330 + s * 48; mid += `<rect x="${x}" y="${y}" width="66" height="${FLOOR - y + 300}" fill="${s % 2 ? '#b9ab90' : '#c4b69a'}"/><rect x="${x}" y="${y}" width="66" height="8" fill="#e8dcc2"/>`; }
  mid += `<line x1="-120" y1="250" x2="520" y2="${FLOOR - 140}" stroke="#8a8f96" stroke-width="10" stroke-linecap="round"/>`;
  // railing along the platform
  mid += `<line x1="1040" y1="600" x2="1900" y2="600" stroke="#8a8f96" stroke-width="12" stroke-linecap="round"/>`; for (let x = 1060; x <= 1880; x += 164) mid += `<line x1="${x}" y1="600" x2="${x}" y2="${FLOOR + 40}" stroke="#7a7f86" stroke-width="9"/>`;
  let floor = `<rect x="-400" y="${FLOOR}" width="2720" height="600" fill="#cdbd9e"/><rect x="-400" y="${FLOOR}" width="2720" height="10" fill="#b4a484"/>`;
  for (let x = -400; x < 2320; x += 140) floor += `<line x1="${x}" y1="${FLOOR + 10}" x2="${x - 120}" y2="1300" stroke="#c2b190" stroke-width="3"/>`;
  floor += `<rect x="-400" y="1010" width="2720" height="22" fill="#f2c230"/>`;
  return { back, mid, floor };
}
// one flat frame: v = { z: zoom, cx, cy } camera; people: [[x, y(feet), h, pose, outfit, face, flip, extra]]
function frame(U, t, tt, v, people, fx = '') {
  const S = station(tt), z = v.z || 1, tx = 960 - v.cx * z, ty = 540 - v.cy * z;
  let ppl = ''; const out = [];
  for (const [x, y, h, pose, outfit, face, flip, extra] of people) { const c = person(x, y, h, pose, { ...outfit, face, flip, look: flip ? -0.5 : 0.5, rim: '#fff4dc' }); out.push(c); ppl += `<ellipse cx="${f(x)}" cy="${f(y + 4)}" rx="${f(h * 0.16)}" ry="${f(h * 0.03)}" fill="#000" opacity="0.18"/>` + c.svg + (extra ? extra(c) : ''); }
  U.svg('flat', `<defs><filter id="bl"><feGaussianBlur stdDeviation="${f(3 / z)}"/></filter><linearGradient id="warm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity="0.16"/><stop offset="1" stop-color="#6a4aa0" stop-opacity="0.12"/></linearGradient></defs><g transform="translate(${f(tx)} ${f(ty)}) scale(${f(z)})"><g filter="url(#bl)">${S.back}</g>${S.mid}${S.floor}${ppl}${typeof fx === 'function' ? fx(out) : fx}</g><rect width="1920" height="1080" fill="url(#warm)"/><defs><linearGradient id="hudbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14121c" stop-opacity="0.75"/><stop offset="1" stop-color="#14121c" stop-opacity="0"/></linearGradient></defs><rect width="1920" height="200" fill="url(#hudbg)"/>`, { z: 2 });
  return out;
}
const tops = ['#5a6e8a', '#7a5ea8', '#4f8a5b', '#c86a8a', '#e0b44a', '#3a3d42', '#8a5a3a'];
const crowd = (tt, n = 7) => Array.from({ length: n }, (_, i) => [1000 + i * 125 + (i % 2) * 30, FLOOR + 20 + (i % 3) * 18, 250 + (i % 3) * 14, { ...P_PHONE, head: 18 }, { top: tops[i % 7], bottom: i % 2 ? '#2a2d3a' : '#3a3f4a', sleeves: i % 2 ? 'long' : 'short', shoes: '#22242a', hair: i % 3 === 0 ? 'ponytail' : i % 3 === 1 ? 'short' : undefined }, 'neutral', i % 2 === 0, (c) => `<rect x="${f(c.head[0] - c.R * 0.3)}" y="${f(c.head[1] + c.R * 1.25)}" width="${f(c.R * 0.6)}" height="${f(c.R * 0.9)}" rx="3" fill="#9fd0ff"/>`]);
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const RAIL = [1300, 600];
const stairPos = (k) => [-60 + k * 560, 330 + k * (FLOOR - 330)];

registerShot('s001', { bg: '#2b2a33', theme: 'dark', ui(U, t, info) { const tt = info.start + t, k = clamp(t / 2.8), p = stairPos(0.35 + k * 0.55); frame(U, t, tt, { z: 1.0 + t * 0.02, cx: 900, cy: 520 }, [...crowd(tt, 6), [p[0], p[1], 290, walk(tt), HERO, 'neutral', false]]); chrome(U, t, info, H0); } });
registerShot('s002', { bg: '#2b2a33', theme: 'dark', ui(U, t, info) { const tt = info.start + t, k = ease.in(clamp(t / 2.2)), p = stairPos(0.92); frame(U, t, tt, { z: 1.7, cx: p[0] + 80, cy: p[1] - 160 }, [...crowd(tt, 4), [p[0] + k * 60, p[1] + k * 30, 290, { ...P_STAND, lean: -18 - k * 40, aL: [140, 150], aR: [120, 160], lL: [30, 30], head: -20 }, HERO, 'open', false]]); chrome(U, t, info, H0); } });
const armFx = (k, lines, o = {}) => (cs) => { const c = cs[cs.length - 1]; if (!c) return ''; const S = L.shoulder(c, 1), H = [S[0] + (RAIL[0] - S[0]) * k, S[1] + (RAIL[1] - S[1]) * k]; return L.stretchArm(S, H, c.R * 0.5, c.R * 3.6, { sleeve: HERO.top, lines, ...o }); };
registerShot('s003', { bg: '#2b2a33', theme: 'dark', ui(U, t, info) { const tt = info.start + t, p = stairPos(0.95); punch(U, t); const cs = frame(U, t, tt, { z: 1.15, cx: 860, cy: 560 }, [...crowd(tt), [p[0] + 60, p[1] + 30, 290, { ...P_STAND, lean: -50, aL: [140, 150], aR: [8, 0], head: -20 }, HERO, 'open', false]], armFx(ease.out(clamp(t / 1.6)) * 0.55, true, { wob: 26, ph: tt, smear: 1 - clamp(t / 1.6) })); const c = cs[cs.length - 1]; speedLines(U, 520, 520, tt, { op: 0.3, z: 25 }); chrome(U, t, info, { ...H0, status: ST.rubber }); } });
registerShot('s004', { bg: '#2b2a33', theme: 'dark', ui(U, t, info) { const tt = info.start + t, p = stairPos(0.95); frame(U, t, tt, { z: 1.0, cx: 900, cy: 540 }, [...crowd(tt), [p[0] + 60, p[1] + 30, 290, { ...P_STAND, lean: -50, aL: [140, 150], aR: [8, 0], head: -20 }, HERO, 'open', false]], armFx(0.55 + 0.45 * L.springOut(clamp(t / 1.4)), t < 1.2, { wob: 30 * Math.exp(-2.5 * t), ph: tt, grab: t > 0.9, smear: Math.max(0, 1 - t) })); label(U, 'l1', 'STRETCH · 4 M', 0.9, t, 1240, 260); label(U, 'l2', 'ARM THICKNESS · ↓', 1.5, t, 1240, 350, { color: COL.red }); chrome(U, t, info, { ...H0, status: ST.rubber }); } });
registerShot('s005', { bg: '#2b2a33', theme: 'dark', ui(U, t, info) { const tt = info.start + t, pull = ease.inOut(clamp((t - 1.4) / 1.6)), p0 = stairPos(0.95); const x = p0[0] + 60 + (RAIL[0] - 120 - p0[0] - 60) * pull, y = p0[1] + 30 + (FLOOR + 30 - p0[1] - 30) * pull - Math.sin(pull * Math.PI) * 160;
  frame(U, t, tt, { z: 1.0, cx: 900, cy: 540 }, [...crowd(tt), [x, y, 290, pull < 1 ? { ...P_FLOAT, lean: 30 } : P_STAND, HERO, pull < 1 ? 'open' : 'neutral', false]], (cs) => { const c = cs[cs.length - 1]; if (!c || pull >= 1) return ''; const S = L.shoulder(c, 1); return L.stretchArm(S, RAIL, c.R * 0.5, c.R * 3.6, { sleeve: HERO.top, grab: true, wob: 18 * Math.sin(Math.PI * pull), ph: tt, smear: Math.sin(Math.PI * pull) }); });
  label(U, 'l1', 'BUNGEE MODE', 0.6, t, 1240, 260); chrome(U, t, info, { ...H0, status: ST.rubber }); } });
registerShot('s006', { bg: '#2b2a33', theme: 'dark', ui(U, t, info) { const tt = info.start + t; frame(U, t, tt, { z: 1.25, cx: 1380, cy: 600 }, crowd(tt)); label(U, 'l1', 'WITNESSES · 0', 0.3, t, 1300, 260); chrome(U, t, info, { ...H0, status: ST.off }); } });
registerShot('s007', { bg: '#2b2a33', theme: 'dark', ui(U, t, info) { const tt = info.start + t, lh = info.w('You look at your hand', 2.4); frame(U, t, tt, { z: 1.7, cx: 1060, cy: 560 }, [...crowd(tt, 5), [860, FLOOR + 60, 290, t > lh ? { ...P_STAND, aR: [60, 150], head: 20 } : P_STAND, HERO, 'neutral', true]]); label(U, 'l1', 'EYES ON PHONES · 100%', 0.3, t, 1180, 260); chrome(U, t, info, { ...H0, status: ST.off }); } });
