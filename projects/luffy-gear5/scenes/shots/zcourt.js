// FLAT 2D — the outdoor court at dawn (Day 3: slingshot punch, the bag flies off, the catch, self-hits). Our own design:
// warm dawn sky, hazy apartment blocks, chain-link fence, teal court with white lines, a punching bag on a steel frame.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_HIPS, P_THINK } from '../lib/people.js';
import { hud, label, caption, punch, speedLines, COL } from '../lib/hud.js';
import { frame, pan, glow } from '../lib/flat2d.js';
import * as L from '../lib/luffy.js';
import { city } from '../lib/city2d.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie };
const ST = { off: { text: 'RUBBER · IDLE', on: false }, rubber: { text: 'RUBBER · ON', on: true, color: COL.red } };
const D3 = { day: 3, time: '6:10 AM', status: ST.off };
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const lab = (U, t, items) => items.forEach(([txt, t0, x, y, c], i) => label(U, 'L' + i, txt, t0, t, x, y, c ? { color: c } : {}));
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;

const FLOOR = 790, BAG = { x: 1180, top: 430, h: 220, w: 96 };
function bagSvg(k = 0, sw = 0) {   // k: 0 hanging .. 1 flown off
  let g = `<rect x="1060" y="300" width="18" height="${FLOOR - 300}" fill="#3a4250"/><rect x="1300" y="300" width="18" height="${FLOOR - 300}" fill="#3a4250"/><rect x="1050" y="290" width="278" height="20" rx="6" fill="#4a5262"/>`;
  if (k <= 0) return g + `<g transform="rotate(${f(sw)} ${BAG.x} 310)"><line x1="${BAG.x}" y1="310" x2="${BAG.x}" y2="${BAG.top}" stroke="#9aa3ad" stroke-width="5"/><rect x="${BAG.x - BAG.w / 2}" y="${BAG.top}" width="${BAG.w}" height="${BAG.h}" rx="40" fill="#e0412e"/><rect x="${BAG.x - BAG.w / 2}" y="${BAG.top}" width="${BAG.w * 0.32}" height="${BAG.h}" rx="30" fill="#ff6a4a" opacity="0.6"/><rect x="${BAG.x - BAG.w / 2}" y="${BAG.top + 40}" width="${BAG.w}" height="14" fill="#a82a1c"/><rect x="${BAG.x - BAG.w / 2}" y="${BAG.top + BAG.h - 54}" width="${BAG.w}" height="14" fill="#a82a1c"/></g>`;
  if (k >= 1) return g + `<line x1="${BAG.x}" y1="310" x2="${BAG.x + 6}" y2="350" stroke="#9aa3ad" stroke-width="5"/>`;
  const x = BAG.x + k * 900, y = BAG.top + BAG.h / 2 - Math.sin(k * Math.PI * 0.9) * 420 - k * 60;
  return g + `<line x1="${BAG.x}" y1="310" x2="${BAG.x + 6}" y2="350" stroke="#9aa3ad" stroke-width="5"/><g transform="rotate(${f(k * 420)} ${f(x)} ${f(y)})"><rect x="${f(x - BAG.w / 2)}" y="${f(y - BAG.h / 2)}" width="${BAG.w}" height="${BAG.h}" rx="40" fill="#e0412e"/><rect x="${f(x - BAG.w / 2)}" y="${f(y - BAG.h / 2 + 40)}" width="${BAG.w}" height="14" fill="#a82a1c"/></g>` + (k < 0.6 ? Array.from({ length: 6 }, (_, i) => `<line x1="${f(x - 90 - i * 40)}" y1="${f(y + (i - 3) * 22)}" x2="${f(x - 220 - i * 50)}" y2="${f(y + (i - 3) * 22 + 60 * k)}" stroke="#fff" stroke-width="5" opacity="0.6" stroke-linecap="round"/>`).join('') : '');
}
function court(tt, bagK = 0, sw = 0) {
  let back = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b5fb8"/><stop offset="0.5" stop-color="#ff9a6a"/><stop offset="1" stop-color="#ffd38a"/></linearGradient>${glow('sun', '#fff1b8', 0.95)}</defs>`;
  back += `<rect x="-800" y="-400" width="3520" height="${FLOOR + 400}" fill="url(#sky)"/><ellipse cx="420" cy="480" rx="520" ry="380" fill="url(#sun)"/><circle cx="420" cy="500" r="70" fill="#fff4cc"/>`;
  back += city({ vp: [760, 560], ground: FLOOR, fog: '#ffc7a0', lit: '#ffe08a', litP: 0.12, pal: ['#c0707e', '#d08a6e', '#9a6a8e', '#c27a6a', '#a8607a'] });
  back += `<rect x="-800" y="0" width="3520" height="${FLOOR}" fill="#ffc89a" opacity="0.25"/>`;
  // chain-link fence
  let mid = ''; for (let x = -800; x < 2720; x += 260) mid += `<rect x="${x}" y="300" width="10" height="${FLOOR - 300}" fill="#5a6270"/>`; mid += `<rect x="-800" y="296" width="3520" height="8" fill="#5a6270"/>`;
  let mesh = ''; for (let x = -800; x < 2720; x += 34) mesh += `<line x1="${x}" y1="300" x2="${x + 120}" y2="${FLOOR}" stroke="#4a5262" stroke-width="2" opacity="0.2"/><line x1="${x + 120}" y1="300" x2="${x}" y2="${FLOOR}" stroke="#4a5262" stroke-width="2" opacity="0.35"/>`; mid += mesh;
  // hoop on the right
  mid += `<rect x="1880" y="260" width="22" height="${FLOOR - 260}" fill="#3a4250"/><rect x="1760" y="220" width="160" height="110" rx="6" fill="#f4f6f8"/><rect x="1800" y="250" width="70" height="50" fill="none" stroke="#e0412e" stroke-width="5"/><rect x="1740" y="320" width="80" height="8" rx="4" fill="#ff6a3b"/><path d="M 1744 328 L 1754 380 L 1806 380 L 1816 328" fill="none" stroke="#fff" stroke-width="3"/>`;
  mid += bagSvg(bagK, sw);
  let floor = `<defs><linearGradient id="ct" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1f9a86"/><stop offset="1" stop-color="#2a7fa6"/></linearGradient></defs><rect x="-800" y="${FLOOR}" width="3520" height="700" fill="url(#ct)"/><rect x="-800" y="${FLOOR}" width="3520" height="10" fill="#17705f"/>`;
  floor += `<rect x="-800" y="${FLOOR + 70}" width="3520" height="8" fill="#f4f6f0" opacity="0.9"/><path d="M 960 ${FLOOR + 74} L 760 1400" stroke="#f4f6f0" stroke-width="8" opacity="0.9"/><ellipse cx="960" cy="${FLOOR + 230}" rx="260" ry="70" fill="none" stroke="#f4f6f0" stroke-width="8" opacity="0.9"/><ellipse cx="420" cy="${FLOOR + 140}" rx="700" ry="60" fill="#ffe6a8" opacity="0.18"/>`;
  return { back, mid, floor, FLOOR, bg: '#ff9a6a', blur: 1.6, reflOp: 0.06, tex: 0.26 };
}
const HX = 640;
const H = (pose, face, o = {}) => ({ x: o.x ?? HX, y: FLOOR + 40, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: 0.5, extra: o.extra });
const CT = { z: 1.0, cx: 960, cy: 520 }, CLOSE = { z: 1.45, cx: 820, cy: 540 }, WIDE = { z: 0.78, cx: 1100, cy: 520 };
const shot = (id, body) => registerShot(id, { bg: '#ff9a6a', theme: 'dark', ui(U, t, info) { U.svg('speed', '', {}); U.html('bonk', '', {}); body(U, t, info, info.start + t); } });
const arm = (c, H, o = {}) => L.stretchArm(c.shR, H, c.R * 0.42, c.R * 2.4, { sleeve: HERO.top, rim: '#b9dcff', ...o });
const armB = (c, H, o = {}) => L.stretchArm(c.shL, H, c.R * 0.42, c.R * 2.4, { sleeve: HERO.top, rim: '#b9dcff', ...o });

shot('s037', (U, t, info, tt) => { frame(U, court(tt), pan(CT, { ...CT, z: 1.12, cx: 900 }, ease.inOut(clamp(t / info.dur))), [H(P_HIPS, 'smile')]); lab(U, t, [['MOVE · SLINGSHOT PUNCH', 0.4, 1180, 260]]); chrome(U, t, info, D3); });
shot('s038', (U, t, info, tt) => { const k = ease.out(clamp(t / 1.4)); frame(U, court(tt), CLOSE, [H({ ...P_STAND, lean: -8, lL: [-14, 6], lR: [26, 4] }, 'neutral', { outfit: { noArm: 'L' } })], (cs) => armB(cs[0], [cs[0].shL[0] - 40 - 560 * k, cs[0].shL[1] + 30], { lines: true, wob: 6 * (1 - k), ph: tt }), { fxIn: true }); chrome(U, t, info, D3); });
shot('s039', (U, t, info, tt) => { const k = ease.in(clamp(t / 0.6)); frame(U, court(tt, 0, t > 0.6 ? -28 * Math.exp(-2.2 * (t - 0.6)) * Math.cos((t - 0.6) * 7) : 0), CT, [H({ ...P_STAND, lean: 12, lL: [-14, 6], lR: [26, 4] }, 'smile', { outfit: t < 1.6 ? { noArm: 'R' } : {} })], (cs) => { const c = cs[0]; if (t >= 1.6) return ''; const tx = BAG.x - 40, ty = BAG.top + 90, S = c.shR; return arm(c, [S[0] + (tx - S[0]) * k - 500 * (1 - k), S[1] + (ty - S[1]) * k], { lines: true, smear: 1 - k }); }, { fxIn: true });
  if (t > 0.5 && t < 1.6) speedLines(U, 1150, 520, tt, { op: 0.4 }); else U.svg('speed', '', {}); punch(U, t - 0.55); chrome(U, t, info, D3); });
shot('s040', (U, t, info, tt) => { const k = t < 2.4 ? ease.out(clamp(t / 2)) : 1 - ease.in(clamp((t - 2.4) / 0.3)); frame(U, court(tt), WIDE, [H({ ...P_STAND, lean: 14, lL: [-14, 6], lR: [26, 4] }, 'smile', { outfit: { noArm: 'L' } })], (cs) => armB(cs[0], [cs[0].shL[0] - 40 - 1500 * k, cs[0].shL[1] + 50 * k], { wob: 10 * k, ph: tt }), { fxIn: true });
  lab(U, t, [['ELASTIC ENERGY · ↑↑↑', 0.8, 1180, 300]]); chrome(U, t, info, { ...D3, status: { text: 'PULL · 10 M', on: true, color: COL.yellow } }); });
shot('s041', (U, t, info, tt) => { const k = ease.out(clamp(t / 2.4)), sh = t < 0.4 ? Math.sin(t * 80) * 14 : 0; frame(U, court(tt, Math.min(0.99, Math.max(0.001, k))), { ...WIDE, cx: WIDE.cx + sh }, [H(P_HIPS, 'open')]); punch(U, t); lab(U, t, [['CHAIN · SNAPPED', 0.3, 1180, 260, COL.red]]); chrome(U, t, info, { ...D3, status: ST.rubber }); });
shot('s045', (U, t, info, tt) => { frame(U, court(tt, 1), CT, [H(P_THINK, 'neutral')]); lab(U, t, [['CATCH · NOT IN THE MANGA', 0.4, 1120, 260, COL.red]]); chrome(U, t, info, D3); });
shot('s046', (U, t, info, tt) => { const k = ease.inOut(clamp(t / 2.2)); frame(U, court(tt, 1), CLOSE, [H({ ...P_STAND, lean: 10 }, 'neutral', { outfit: { noArm: 'R' } })], (cs) => { const S = cs[0].shR; return arm(cs[0], [S[0] + 900 * (1 - k) + 50, S[1] - 10 + Math.sin(k * 9) * 20 * (1 - k)], { lines: true, wob: 14 * (1 - k), ph: tt }); }, { fxIn: true }); chrome(U, t, info, D3); });
shot('s047', (U, t, info, tt) => { frame(U, court(tt, 1), { z: 1.9, cx: HX + 40, cy: 520 }, [H({ ...P_STAND, lean: -14 }, 'open')]); if (t > 0.5) speedLines(U, 960, 420, tt, { op: 0.4 }); else U.svg('speed', '', {}); chrome(U, t, info, D3); });
shot('s048', (U, t, info, tt) => { const hitT = [0.5, info.w('Twice', 2.8)], hit = hitT.some((h) => t > h && t < h + 0.3), sh = hit ? Math.sin(t * 90) * 12 : 0;
  const cs = frame(U, court(tt, 1), { z: 1.9, cx: HX + 40 + sh, cy: 520 }, [H({ ...P_STAND, lean: hit ? -24 : 0, head: hit ? -20 : 0 }, hit ? 'worried' : 'neutral')]); const c = cs[0];
  if (c && hit) { const z = 1.9, sx = 960 + (c.head[0] - HX - 40 - sh) * z, sy = 540 + (c.head[1] - 520) * z; U.html('bonk', `<div style="${TXT(90, COL.yellow)};transform:rotate(-8deg);text-shadow:0 6px 0 #000">BONK!</div>`, { left: f(sx + c.R * 2.4) + 'px', top: f(sy - c.R * 3.4) + 'px' }); } else U.html('bonk', '', {});
  chrome(U, t, info, { ...D3, status: { text: 'SELF-HITS · 2', on: true, color: COL.red } }); });
