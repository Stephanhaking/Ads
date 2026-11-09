// FLAT 2D — the construction site (Day 20: Gear 3 giant fist, the falling beam, then shrinking). Our own design: midday
// sky, a 2.5D city behind, a half-built concrete frame with scaffolding and green safety net, a yellow tower crane, stacked
// beams, orange barriers and cones, warm dirt ground. Evening variant for the walk home.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_HIPS, P_SHRUG } from '../lib/people.js';
import { hud, label, caption, COL } from '../lib/hud.js';
import { frame, pan, glow } from '../lib/flat2d.js';
import { city, mix } from '../lib/city2d.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie };
const D20 = { day: 20, time: '12:30 PM', status: { text: 'GEAR 3 · ON', on: true, color: '#ff8a3b' } };
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const lab = (U, t, items) => items.forEach(([txt, t0, x, y, c], i) => label(U, 'L' + i, txt, t0, t, x, y, c ? { color: c } : {}));
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };

const FLOOR = 800, HOOK = [1500, 120];
function beam(x, y, L, a = 0) { const h = L * 0.08; return `<g transform="rotate(${f(a)} ${f(x)} ${f(y)})"><rect x="${f(x - L / 2)}" y="${f(y - h / 2)}" width="${f(L)}" height="${f(h)}" fill="#d8482e" stroke="#b9dcff" stroke-width="3"/><rect x="${f(x - L / 2)}" y="${f(y - h * 0.14)}" width="${f(L)}" height="${f(h * 0.28)}" fill="#9a2e1e"/><rect x="${f(x - L / 2)}" y="${f(y - h / 2)}" width="${f(L)}" height="${f(h * 0.18)}" fill="#ff7a5a" opacity="0.6"/></g>`; }
function site(tt, eve = 0, beamY = null) {
  const sky = eve ? ['#3a3f8a', '#e0789a', '#ffc27a'] : ['#2f7fe0', '#7cc0f4', '#d9f0ff'];
  let back = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="0.6" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient></defs><rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#sky)"/>`;
  for (let i = 0; i < 5; i++) { const x = -300 + i * 560 + ((tt * 6) % 200), y = 60 + (i % 2) * 70; back += `<g fill="#ffffff" opacity="${eve ? 0.35 : 0.85}"><ellipse cx="${x}" cy="${y}" rx="120" ry="34"/><ellipse cx="${x + 70}" cy="${y - 18}" rx="80" ry="36"/><ellipse cx="${x - 60}" cy="${y + 4}" rx="70" ry="26"/></g>`; }
  const fog = eve ? '#e8a8a0' : '#cfe6f6';
  back += city({ vp: [960, 640], ground: 660, fog, lit: '#ffe08a', litP: eve ? 0.3 : 0.04, pal: ['#e0a070', '#8fb0d0', '#d07a6a', '#a8c08a', '#c8a0c0'], layers: [
    { n: 9, x0: -800, x1: 2700, hmin: 380, hmax: 600, wmin: 150, wmax: 230, haze: 0.6, seed: 4, depth: 0.07, style: 'tower', litP: 0.03 },
    { n: 6, x0: -700, x1: 2600, hmin: 220, hmax: 380, wmin: 240, wmax: 340, haze: 0.32, seed: 9, depth: 0.12, style: 'office' }] });
  back += `<rect x="-900" y="660" width="3720" height="${FLOOR - 660}" fill="${mix('#c99a6a', fog, 0.3)}"/>`;
  // site hoarding (blue panels) at the back of the yard
  for (let x = -900; x < 2720; x += 220) back += `<rect x="${x}" y="600" width="214" height="80" fill="${x % 440 === 0 ? '#2a6fe0' : '#3a7ff0'}"/><rect x="${x}" y="600" width="214" height="10" fill="#ffffff" opacity="0.4"/>`;
  // half-built concrete frame + scaffolding with green net (sharp mid layer)
  let mid = ''; const fx = -120, fw = 1000, base = FLOOR - 20;
  for (let fl = 0; fl < 4; fl++) { const y = base - fl * 160; mid += `<rect x="${fx}" y="${y - 22}" width="${fw}" height="22" fill="#c8c2b6"/><rect x="${fx}" y="${y - 22}" width="${fw}" height="6" fill="#e2ddd2"/>`; if (fl < 3) for (let i = 0; i <= 5; i++) mid += `<rect x="${fx + 10 + i * (fw - 50) / 5}" y="${y - 160}" width="30" height="138" fill="#b4aea2"/><rect x="${fx + 10 + i * (fw - 50) / 5}" y="${y - 160}" width="8" height="138" fill="#d6d1c6"/>`; }
  for (let i = 0; i < 6; i++) mid += `<rect x="${fx + 20 + i * 70}" y="${base - 520}" width="8" height="520" fill="#8a8f96" opacity="0.8"/>`;
  mid += `<rect x="${fx + 10}" y="${base - 520}" width="400" height="520" fill="#3fae5a" opacity="0.42"/>`; for (let y = base - 500; y < base; y += 80) mid += `<rect x="${fx + 10}" y="${y}" width="400" height="6" fill="#8a8f96"/>`;
  // tower crane: mast, jib, counter-jib, cab, cable + hook (+ beam if hanging)
  const mx = 1180; mid += `<rect x="${mx - 22}" y="60" width="44" height="${FLOOR - 60}" fill="#ffc21a"/>`; for (let y = 80; y < FLOOR; y += 60) mid += `<path d="M ${mx - 22} ${y} L ${mx + 22} ${y + 60} M ${mx + 22} ${y} L ${mx - 22} ${y + 60}" stroke="#e09a10" stroke-width="5"/>`;
  mid += `<rect x="${mx - 380}" y="56" width="1200" height="28" fill="#ffc21a"/><rect x="${mx - 380}" y="50" width="300" height="40" fill="#5a5f6a"/><rect x="${mx - 30}" y="84" width="74" height="60" rx="6" fill="#ffc21a"/><rect x="${mx - 22}" y="92" width="50" height="34" fill="#9fe0ff"/><path d="M ${mx} 56 L ${mx} 0 L ${mx + 600} 56" fill="none" stroke="#5a5f6a" stroke-width="4"/>`;
  const by = beamY ?? 300; mid += `<line x1="${HOOK[0]}" y1="84" x2="${HOOK[0]}" y2="${beamY == null ? by - 30 : 160}" stroke="#3a3d42" stroke-width="4"/><path d="M ${HOOK[0] - 12} ${(beamY == null ? by - 30 : 160)} q 12 26 24 0" fill="none" stroke="#3a3d42" stroke-width="6"/>`;
  if (beamY == null) mid += beam(HOOK[0], by, 420);
  // stacked beams, barriers, cones
  for (let i = 0; i < 4; i++) mid += beam(1700 + (i % 2) * 20, FLOOR - 16 - i * 30, 360);
  for (let i = 0; i < 4; i++) { const x = 1000 + i * 120; mid += `<rect x="${x}" y="${FLOOR - 70}" width="110" height="46" rx="6" fill="#ff7a1a"/><rect x="${x + 10}" y="${FLOOR - 62}" width="90" height="10" fill="#ffffff"/><rect x="${x + 10}" y="${FLOOR - 24}" width="10" height="24" fill="#3a3d42"/><rect x="${x + 90}" y="${FLOOR - 24}" width="10" height="24" fill="#3a3d42"/>`; }
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="700" fill="${eve ? '#b07a5a' : '#d8a066'}"/><rect x="-900" y="${FLOOR}" width="3720" height="8" fill="#b07a4a"/>`;
  for (let i = 0; i < 26; i++) floor += `<ellipse cx="${(i * 211) % 2800 - 400}" cy="${FLOOR + 30 + ((i * 67) % 300)}" rx="${18 + (i % 4) * 10}" ry="6" fill="#b8804e" opacity="0.6"/>`;
  floor += `<path d="M -900 ${FLOOR + 160} Q 400 ${FLOOR + 120} 2800 ${FLOOR + 190}" stroke="#c48a56" stroke-width="40" fill="none" opacity="0.5"/>`;
  if (eve) back += `<rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="#ff7a5a" opacity="0.08"/>`;
  return { back, mid, floor, FLOOR, bg: sky[1], blur: 1.6, reflOp: 0.04, tex: 0.2 };
}
// Gear-3 fist: an inflated ink arm from the shoulder to a huge round fist, pale outline, knuckle bumps, a highlight
function giant(S, P, r, sleeve) { const w = Math.max(r * 0.55, 18), OL = '#b9dcff', INK = '#00000d';
  let g = `<path d="M ${f(S[0])} ${f(S[1])} L ${f(P[0])} ${f(P[1])}" stroke="${OL}" stroke-width="${f(w + 8)}" stroke-linecap="round"/><path d="M ${f(S[0])} ${f(S[1])} L ${f(P[0])} ${f(P[1])}" stroke="${INK}" stroke-width="${f(w)}" stroke-linecap="round"/>`;
  { const dx = P[0] - S[0], dy = P[1] - S[1], L = Math.hypot(dx, dy) || 1, e = [S[0] + dx / L * Math.min(40, L * 0.25), S[1] + dy / L * Math.min(40, L * 0.25)]; g += `<path d="M ${f(S[0])} ${f(S[1])} L ${f(e[0])} ${f(e[1])}" stroke="${OL}" stroke-width="${f(w * 0.75 + 6)}" stroke-linecap="butt"/><circle cx="${f(S[0])}" cy="${f(S[1])}" r="${f(w * 0.375 + 3)}" fill="${OL}"/><path d="M ${f(S[0])} ${f(S[1])} L ${f(e[0])} ${f(e[1])}" stroke="${sleeve}" stroke-width="${f(w * 0.75)}" stroke-linecap="butt"/><circle cx="${f(S[0])}" cy="${f(S[1])}" r="${f(w * 0.375)}" fill="${sleeve}"/>`; }
  g += `<circle cx="${f(P[0])}" cy="${f(P[1])}" r="${f(r)}" fill="${INK}" stroke="${OL}" stroke-width="${f(Math.max(4, r * 0.035))}"/>`;
  for (let i = 0; i < 4; i++) { const a = -Math.PI * 0.75 + i * 0.32; g += `<path d="M ${f(P[0] + Math.cos(a) * r * 0.62)} ${f(P[1] + Math.sin(a) * r * 0.62)} q ${f(Math.cos(a + 1.2) * r * 0.12)} ${f(Math.sin(a + 1.2) * r * 0.12)} ${f(Math.cos(a + 0.3) * r * 0.3)} ${f(Math.sin(a + 0.3) * r * 0.3)}" stroke="#3a3a50" stroke-width="${f(r * 0.05)}" fill="none" stroke-linecap="round"/>`; }
  return g + `<ellipse cx="${f(P[0] - r * 0.35)}" cy="${f(P[1] - r * 0.4)}" rx="${f(r * 0.28)}" ry="${f(r * 0.13)}" fill="#ffffff" opacity="0.22" transform="rotate(-30 ${f(P[0] - r * 0.35)} ${f(P[1] - r * 0.4)})"/>`; }
const HX = 760, H = (pose, face, o = {}) => ({ x: o.x ?? HX, y: FLOOR + 40, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: 0.5, extra: o.extra, pre: o.pre });
const SC = { z: 0.8, cx: 1000, cy: 470 }, CU = { z: 1.9, cx: HX - 60, cy: 520 };
const shot = (id, body) => registerShot(id, { bg: '#7cc0f4', theme: 'dark', ui(U, t, info) { U.html('r5', '', {}); body(U, t, info, info.start + t); } });

shot('s100', (U, t, info, tt) => { const k = t > 1.4 ? ease.out(clamp((t - 1.4) / 1.6)) : 0; frame(U, site(tt), CU, [H({ ...P_STAND, aR: [140, 170], head: 6 }, 'neutral', { outfit: k > 0 ? { noArm: 'L' } : {}, extra: (c) => `<circle cx="${f(c.head[0] + c.R * 0.55)}" cy="${f(c.mouth[1])}" r="${f(c.R * 0.16)}" fill="#00000d"/>` + (k > 0 ? giant(c.shL, [c.shL[0] - c.R * (1.2 + 2.6 * k), c.shL[1] + c.R * (0.8 + 0.6 * k)], c.R * (0.4 + 2.2 * k), HERO.top) : '') })]);
  lab(U, t, [['BONES · INFLATING', 1.4, 1220, 260, '#ff8a3b']]); chrome(U, t, info, D20); });
shot('s101', (U, t, info, tt) => { frame(U, site(tt), pan(SC, { ...SC, z: 0.9 }, clamp(t / info.dur)), [H(P_HIPS, 'smile', { outfit: { noArm: 'L' }, extra: (c) => giant(c.shL, [c.shL[0] - c.R * 4.6, FLOOR + 40 - c.R * 3.4], c.R * 3.4, HERO.top) })]); lab(U, t, [['FIST · CAR-SIZED', 0.4, 1220, 260, '#ff8a3b']]); chrome(U, t, info, D20); });
const fall = (k) => 220 + k * 420;
shot('s102', (U, t, info, tt) => { const k = ease.in(clamp(t / 1.6)) * 0.6; const S = site(tt, 0, -1); S.front = beam(HOOK[0], fall(k), 420, -8 + k * 8) + `<path d="M ${HOOK[0] - 30} 140 L ${HOOK[0] - 6} 170 M ${HOOK[0] + 30} 140 L ${HOOK[0] + 6} 170" stroke="#3a3d42" stroke-width="4"/>`;
  frame(U, S, { z: 0.72, cx: 1150, cy: 440 }, []); lab(U, t, [['BEAM · FALLING', 0.2, 1240, 260, COL.red]]); chrome(U, t, info, D20); });
shot('s103', (U, t, info, tt) => { const k = ease.in(clamp(t / 0.6)), sh = t > 0.6 && t < 0.9 ? Math.sin(t * 90) * 14 : 0, bx = 1460, S = site(tt, 0, -1);
  frame(U, S, { ...SC, cx: SC.cx + sh }, [H({ ...P_STAND, aR: [150, 160] }, 'smile', { x: bx - 60, outfit: { noArm: 'R' }, extra: (c) => { const r = c.R * 3.0, P = [c.shR[0] + c.R * 0.5, c.head[1] - c.R * 4.4], rest = P[1] - r - 16; return giant(c.shR, P, r, HERO.top) + beam(bx, Math.min(fall(0.6 + k * 0.4), rest), 420, -8 * (1 - k)); } })]);
  lab(U, t, [['CAUGHT', 0.7, 1300, 260, '#4fd06a']]); chrome(U, t, info, D20); });
shot('s105', (U, t, info, tt) => { const k = ease.inOut(clamp(t / 2)); frame(U, site(tt), { z: 1.2, cx: HX + 60, cy: 560 }, [H(P_STAND, 'open', { h: 360 - k * 140 })]); chrome(U, t, info, { ...D20, status: { text: 'SIZE · SHRINKING', on: true, color: '#ff8a3b' } }); });
const BIG = (c) => `<rect x="${f(c.head[0] - c.R * 1.1)}" y="${f(c.head[1] + c.R * 0.8)}" width="${f(c.R * 2.2)}" height="${f(c.R * 3)}" rx="${f(c.R * 0.4)}" fill="${HERO.top}" stroke="#b9dcff" stroke-width="3"/><rect x="${f(c.head[0] - c.R * 1.6)}" y="${f(c.head[1] + c.R * 1)}" width="${f(c.R * 0.6)}" height="${f(c.R * 2.6)}" rx="${f(c.R * 0.3)}" fill="${HERO.top}" stroke="#b9dcff" stroke-width="3"/><rect x="${f(c.head[0] + c.R * 1)}" y="${f(c.head[1] + c.R * 1)}" width="${f(c.R * 0.6)}" height="${f(c.R * 2.6)}" rx="${f(c.R * 0.3)}" fill="${HERO.top}" stroke="#b9dcff" stroke-width="3"/>`;
const EVE = { ...D20, time: '5:40 PM', status: { text: 'SIZE · AGE 10', on: true, color: '#ff8a3b' } };
shot('s106', (U, t, info, tt) => { frame(U, site(tt, 1), { z: 1.0, cx: 900, cy: 520 }, [H(walk(tt, 6), 'worried', { x: 560 + t * 70, h: 220, extra: BIG })]); chrome(U, t, info, EVE); });
shot('s107', (U, t, info, tt) => { frame(U, site(tt, 1), { z: 1.6, cx: HX + 40, cy: 640 }, [H(P_SHRUG, 'worried', { h: 220, extra: BIG })]); if (t > info.w('Rule five', 3.2)) U.html('r5', `<div style="${TXT(110, COL.yellow)};text-shadow:0 6px 0 #000">RULE 5</div>`, { left: '160px', top: '380px' }); chrome(U, t, info, EVE); });
