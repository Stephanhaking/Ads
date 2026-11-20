// "What If You Had Megumi's Ten Shadows in Real Life?" — flat 2D (same look as the JoJo / Killua videos). Shots come from
// PLAN (story sections); each section draws by keywords in the narration line. The shikigami are our own designs (two
// shadow dogs, one white and one black; a toad; a white serpent with black bands; an elephant). The strongest one is
// never shown: only an eight-bladed wheel turning inside the shadow.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_STAND, P_THINK, P_TIRED, P_PHONE, P_SIT, P_RUN, P_SHRUG } from '../lib/people.js';
import { hud, label, caption, COL } from '../lib/hud.js';
import { frame as frame0 } from '../lib/flat2d.js';
import { personRef } from '../lib/body2.js';
import * as SET from '../lib/sets/saitama2d.js';
import * as J from '../lib/sets/jojo2d.js';
import * as N from '../lib/sets/dn2d.js';
import * as K from '../lib/sets/kil2d.js';
import * as M from '../lib/sets/mg2d.js';
import { PLAN } from './plan.js';

const f = (n) => n.toFixed(1);
const OL = '#b9dcff', BLUE = '#6fd8ff', GOLD = '#e0b44a';
const HERO = { top: '#23284a', bottom: '#1a1d2e', hair: 'short', broad: true };
const MUM = { top: '#e05a8a', bottom: '#22263a', hair: 'ponytail' };
const BOSS = { top: '#e2553f', bottom: '#22263a', hair: 'curly', broad: true };
const NEIGH = { top: '#4fd06a', bottom: '#2a2d3a', hair: 'ponytail' };
const BOY = { top: '#ffd23f', bottom: '#22263a', hair: 'short' };
const SUIT = { top: '#7a808e', bottom: '#5a6070', hair: 'short', broad: true };
const KIDC = { top: '#e05a8a', bottom: '#3f6db3', hair: 'ponytail' };
const SEARCH = [{ top: '#ff8a3a', bottom: '#22263a', hair: 'short' }, { top: '#3fb8e0', bottom: '#22263a', hair: 'ponytail' }, { top: '#ffd23f', bottom: '#22263a', hair: 'curly' }];
const TITLE = 'WHAT IF YOU HAD THE TEN SHADOWS?';
const ST = (on = true, txt = 'SHADOW · AWAKE') => ({ text: txt, on, color: BLUE });
const chrome = (U, t, info, d) => { hud(U, { title: TITLE, ...d }); caption(U, info, t); };
const LX = (txt) => Math.min(1180, 1840 - txt.length * 24 - 70);
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 260, c ? { color: c } : {});
const L2 = (U, t, txt, t0 = 1.0, c) => label(U, 'L2', txt, t0, t, LX(txt), 350, c ? { color: c } : {});
const CL1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 170, c ? { color: c } : {});
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const since = (sec, ...w) => { let best = 1e9; for (const p of Object.values(PLAN)) if (p.sec === sec && has(p.line, ...w)) best = Math.min(best, p.k); return best; };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const run = (tt) => { const s = Math.sin(tt * 14); return { ...P_RUN, aL: [50 + s * 40, 80], aR: [40 - s * 40, 110], lL: [30 + s * 30, 40], lR: [-10 - s * 30, 10] }; };
const ARM_UP = { ...P_STAND, aR: [165, 8] };
const HAND_DOWN = { ...P_STAND, lean: 10, aR: [70, 10], head: 12 };
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre, shadow: o.shadow });
const Q = (x, y, pose, outfit, face = 'neutral', o = {}) => ({ x, y, h: o.h || 340, pose, outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const D = (day, time, status) => ({ day, time, status });
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
let FULLED = false;
const full = (U, svg) => { FULLED = true; return U.svg('card', svg, {}, { z: 3 }); };
// the hero's own shadow, cast on the wall behind (it does NOT copy the hero when `pose` differs)
const wallShadow = (x, y, h, pose) => () => `<g opacity="0.8" transform="translate(${f(x * 0.18 + 120)} ${f(-30)})">${personRef(x, y, h * 1.05, pose, { top: '#06060c', bottom: '#06060c', hair: 'short', broad: true, rim: '#06060c', face: 'neutral', look: 0.5 }).svg.replace(/fill="#(?!06060c)[0-9a-fA-F]{6}"/g, 'fill="#06060c"')}</g>`;
const dogs = (x, y, s, tt, pose = 'stand', o = {}) => M.dog(x, y, s, 'white', tt, { pose, flip: o.flip, seed: 0 }) + M.dog(x + (o.gap ?? 300) * s, y + 6, s, 'black', tt, { pose, flip: o.flip, seed: 2 });
let CUT = 'wide';
const frame = (U, B, cam, ppl, fx, o) => { if (CUT === 'close' && ppl && ppl[0]) { const h = ppl[0]; cam = { z: Math.max(cam.z * 1.9, 2.3), cx: h.x + (h.flip ? -30 : 30), cy: h.y - (h.h || 360) * 0.72 }; } return frame0(U, B, cam, ppl, fx, o); };
const KCOL = { open: ['#0a0c24', BLUE], dogs: ['#141a40', '#ffffff'], bfast: ['#f2d58a', '#15181e'], toad: ['#4f8a6e', '#ffd23f'], eleph: ['#3a3f50', '#ffd23f'], serp: ['#f4f4f8', '#c8352e'], fuse: ['#2a2650', BLUE], d10: ['#ff8a6a', '#ffffff'], garden: ['#07070f', BLUE], suit: ['#6a3a3a', '#ffd23f'], wheel: ['#07070f', GOLD], child: ['#0e1a24', '#ffe08a'], d30: ['#8a9ac8', '#15181e'], d40: ['#101632', '#ffd23f'], d41: ['#c8d4e4', '#15181e'] };
const kin = (U, t, line, sec) => { const [bg, ac] = KCOL[sec] || ['#15181e', '#ffd23f']; const words = line.replace(/["“”]/g, '').split(/\s+/).filter(Boolean);
  let key = 0, len = 0; words.forEach((w, i) => { const n = w.replace(/[^\w]/g, '').length; if (n > len) { len = n; key = i; } });
  const k = clamp(t / 0.25), dark = ['#f2d58a', '#f4f4f8', '#8a9ac8', '#c8d4e4'].includes(bg);
  U.svg('card', `<rect width="1920" height="1080" fill="${bg}"/>${[...Array(9)].map((_, i) => `<rect x="${-200 + i * 260 + (t * 40) % 260}" y="0" width="120" height="1080" fill="${dark ? '#000' : '#fff'}" opacity="0.035" transform="skewX(-12)"/>`).join('')}`, {}, { z: 3 });
  U.html('big', `<div style="width:1500px;transform:scale(${f(0.92 + 0.08 * ease.out(k))});transform-origin:left center;opacity:${f(k)};${TXT(118, dark ? '#15181e' : '#ffffff')};text-transform:uppercase">${words.map((w, i) => i === key ? `<span style="color:${ac === '#15181e' ? '#c8352e' : ac}">${w}</span>` : w).join(' ')}</div>`, { left: '200px', top: '330px' }, { z: 50 });
  U.html('L1', '', {}); U.html('L2', '', {}); U.html('cap', '', {}); };
// "IN THE STORY" lore card: a title and up to three short lines; art = optional svg drawn on the right
const lore = (U, t, title, lines, art = '', col = BLUE) => { const k = clamp(t / 0.4);
  full(U, `<rect width="1920" height="1080" fill="#0b0d1c"/><rect x="0" y="0" width="1920" height="1080" fill="url(#none)"/>${art}`);
  big(U, `<div style="opacity:${f(k)};max-width:1080px"><div style="font:800 34px 'IBM Plex Mono';color:${col};letter-spacing:.08em">IN THE STORY · JUJUTSU KAISEN</div><div style="${TXT(104)};margin:18px 0 26px">${title}</div>${lines.map((l, i) => `<div style="font:700 42px Inter;color:#dfe6f2;margin:10px 0;opacity:${f(clamp((t - 0.4 - i * 0.5) / 0.3))}">· ${l}</div>`).join('')}</div>`, 160, 250); };
// stat card: horizontal bars [{v, t, lab, c}] with a title
const bars = (title, rows, k = 1, max) => { const mx = max || Math.max(...rows.map((r) => r.v)), W = 1100;
  return `<rect width="1920" height="1080" fill="#0e1424"/><text x="960" y="290" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#fff">${title}</text>` + rows.map((r, i) => { const y = 400 + i * 150, w = Math.max(8, W * r.v / mx * k);
    return `<text x="400" y="${y + 50}" text-anchor="end" font-family="IBM Plex Mono" font-weight="800" font-size="30" fill="#cfd8e0">${r.lab}</text><rect x="430" y="${y}" width="${f(w)}" height="76" rx="10" fill="${r.c || '#3fb8e0'}"/><text x="${f(450 + w)}" y="${y + 54}" font-family="Inter" font-weight="900" font-size="48" fill="#fff" opacity="${f(k)}">${r.t}</text>`; }).join(''); };
const bigNum = (U, t, num, unit, sub, src, col = '#ffd23f') => { const k = clamp(t / 0.5);
  full(U, `<rect width="1920" height="1080" fill="#0e1424"/>`);
  big(U, `<div style="text-align:center;width:1600px;opacity:${f(k)}"><div style="${TXT(230, col)}">${num}<span style="font-size:110px;color:#fff"> ${unit}</span></div><div style="font:800 48px Inter;color:#fff;margin-top:24px">${sub}</div><div style="font:700 28px 'IBM Plex Mono';color:#8a93a8;margin-top:20px">${src}</div></div>`, 160, 300); };
const lesson = (U, t, n, txt) => L1(U, t, `LESSON ${n} · ${txt}`, 0.2, COL.yellow);
const clock315 = (U, t, info, day = 1) => { const kk = clamp(t / 0.4); full(U, `<rect width="1920" height="1080" fill="#05060f"/>${M.moon(1500, 260, 70)}<rect x="560" y="300" width="800" height="440" rx="40" fill="#0e1024" stroke="#23284a" stroke-width="10"/><text x="960" y="610" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="260" fill="${BLUE}" opacity="${f(kk)}">3:15</text><text x="1300" y="400" text-anchor="end" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="${BLUE}" opacity="0.7">AM</text>`); chrome(U, t, info, D(day, '3:15 AM', ST(false, 'SHADOW · ?'))); };

const S = {};
// cold open: the promise, with flash-forwards (dogs, serpent, the car park, the wheel), then 3:15 a.m.
S.open = (U, t, info, tt, k, n, line) => {
  if (has(line, 'hungry') && t > info.dur * 0.45) { const B = M.hallway(tt); frame(U, B, { z: 1.05, cx: 960, cy: 560 }, [P(380, B.FLOOR, P_STAND, 'worried', { look: 0.9 })], M.serpent([[2200, 800], [1800, 760], [1500, 820], [1200, 740], [900, 800], [700, 720]], 90, tt, { tongue: true }), { fxIn: true }); L1(U, t, 'LATER · DAY 3', 0.2, COL.yellow); chrome(U, t, info, D(3, '9:00 PM', ST())); return; }
  if (has(line, 'car park')) { const B = M.collapse(tt, { lift: 0.6 }); frame(U, B, { z: 1.0, cx: 1200, cy: 560 }, [P(700, B.FLOOR, HAND_DOWN, 'worried', { look: 0.9 })], M.elephant(1720, B.FLOOR, 0.62, tt, 1) + dogs(1100, B.FLOOR, 0.6, tt, 'sniff'), { fxIn: true }); L1(U, t, 'LATER · DAY 40', 0.2, COL.yellow); chrome(U, t, info, D(40, '11:40 PM', ST())); return; }
  if (has(line, 'Sukuna', 'tamed', 'tempted')) { const B = M.nightBalcony(tt); frame(U, B, { z: 1.25, cx: 960, cy: 600 }, [P(560, B.FLOOR, P_STAND, 'worried', { look: 0.9 })], M.pool(1200, B.FLOOR + 6, 600, tt) + M.wheel(1200, B.FLOOR - 140, 160, tt * 14, 0.9), { fxIn: true }); L1(U, t, 'IN THE STORY · ONLY SUKUNA EVER TAMED IT', 0.2, GOLD); chrome(U, t, info, D(20, '2:00 AM', ST(true, 'SHADOW · STIRRING'))); return; }
  if (has(line, 'three fifteen') && t < 1.8) { clock315(U, t, info); return; }
  const B = SET.bedroom(tt, { time: 'night' }); const FL = 820; B.back += M.moon(1560, 250, 46);
  const intro = has(line, 'Megumi', 'real life', 'alive');
  const hero = P(720, FL, has(line, 'copying') ? ARM_UP : P_STAND, intro ? 'neutral' : 'worried', { look: 0.9, pre: wallShadow(720, FL, 360, P_STAND) });
  let fx = M.pool(760, FL + 4, 360, tt, { eyes: has(line, 'alive', 'copying') ? 1 : 0.6 });
  if (intro && !has(line, 'alive')) fx += dogs(1040, FL, 0.85, tt, 'sit');
  let cam = { z: 1.05 + 0.08 * clamp(t / info.dur), cx: 960, cy: 520 };
  if (has(line, 'Megumi')) L1(U, t, "MEGUMI'S TEN SHADOWS · JUJUTSU KAISEN", 0.1, BLUE);
  if (has(line, 'real life')) { cam = { z: 1.4, cx: 900, cy: 560 }; L1(U, t, 'IN REAL LIFE', 0.1, '#4fd06a'); }
  if (has(line, 'alive')) { cam = { z: 2.4, cx: 760, cy: 760 }; L1(U, t, 'YOUR SHADOW · ALIVE', 0.2, BLUE); }
  if (has(line, 'moon', 'copying')) { cam = { z: 1.3, cx: 860, cy: 520 }; L1(U, t, 'SHADOW · NOT COPYING YOU', 0.3, BLUE); }
  frame(U, B, cam, [hero], fx, { fxIn: true });
  chrome(U, t, info, D(1, '3:15 AM', ST(true)));
};
// 3:15 a.m.: the dogs step out, the cat leaves, the run across the city, the cat on the roof
S.dogs = (U, t, info, tt, k, n, line) => {
  const RUN = since('dogs', 'drag you out', 'catch a scent'), ROOF = since('dogs', 'rooftop');
  if (has(line, 'Divine Dogs', 'first shikigami', 'hunt curses')) { lore(U, t, 'THE DIVINE DOGS', ['ONE WHITE, ONE BLACK', 'THE FIRST SHIKIGAMI EVERY TEN SHADOWS USER GETS', 'THEY HUNT CURSES'], dogs(1250, 900, 1.2, tt, 'sit')); chrome(U, t, info, D(1, '3:16 AM', ST())); return; }
  if (has(line, 'receptors', 'six million', 'three hundred')) { full(U, bars('SCENT RECEPTORS (UPPER LIMIT)', [{ v: 300, t: '~300 MILLION', lab: 'DOG (BEST)', c: '#eef2f8' }, { v: 6, t: '~6 MILLION', lab: 'HUMAN', c: '#3fb8e0' }], clamp(t / 1.0))); CL1(U, t, 'REAL NOSES · BEST CASE', 0.2, BLUE); chrome(U, t, info, D(1, '3:20 AM', ST())); return; }
  if (k < RUN) {
    const B = SET.bedroom(tt, { time: 'night' }); const FL = 820; B.back += M.moon(1560, 250, 46);
    const out = k >= since('dogs', 'two dogs step'), sit = k >= since('dogs', 'sit in front') || has(line, 'sit in front');
    const hero = P(640, FL, has(line, 'lift your arm', 'shadow on the floor') ? ARM_UP : P_STAND, out ? 'open' : 'worried', { look: 0.9, pre: wallShadow(640, FL, 360, P_STAND) });
    let fx = M.pool(700, FL + 4, 420, tt, { eyes: out ? 0 : 1 });
    if (out) { const r = has(line, 'two dogs step') ? clamp(t / 1.2) : 1; fx += `<g opacity="${f(r)}" transform="translate(0 ${f((1 - r) * 80)})">${dogs(960, FL, 0.85, tt, sit ? 'sit' : 'stand')}</g>`; }
    if (has(line, 'cat')) fx += `<g transform="translate(${f(1700 - clamp(t / info.dur) * 500)} ${FL})"><ellipse cx="0" cy="-30" rx="40" ry="26" fill="#d88a4a"/><circle cx="-40" cy="-60" r="22" fill="#d88a4a"/><path d="M -54 -76 l 4 -22 l 10 16 Z M -30 -78 l 4 -20 l 8 18 Z" fill="#d88a4a"/><path d="M 36 -40 q 40 -10 40 -50" stroke="#d88a4a" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
    let cam = { z: 1.15, cx: 900, cy: 560 };
    if (has(line, 'lift your arm')) { cam = { z: 1.5, cx: 720, cy: 520 }; L1(U, t, 'YOUR ARM · UP   SHADOW · DOWN', 0.3, BLUE); }
    if (has(line, 'two dogs step')) { cam = { z: 1.35, cx: 1000, cy: 640 }; L1(U, t, 'ONE WHITE · ONE BLACK', 0.3, '#fff'); }
    if (has(line, 'cat')) { cam = { z: 1.2, cx: 1300, cy: 640 }; L1(U, t, 'THE CAT · NOT IMPRESSED', 0.3); }
    frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(1, '3:16 AM', ST())); return; }
  if (k < ROOF) { const B = M.nightRun(tt, { scroll: tt * 520 }); const hero = P(560, B.FLOOR, run(tt), 'worried', { look: 0.9 });
    frame(U, B, { z: 1.1, cx: 960, cy: 560 }, [hero], dogs(900, B.FLOOR, 0.85, tt, 'run'), { fxIn: true });
    L1(U, t, has(line, 'best case', 'slowing') ? 'NOT · SLOWING · DOWN' : 'FOLLOWING · A SCENT', 0.3, BLUE); chrome(U, t, info, D(1, '3:24 AM', ST())); return; }
  const B = M.rooftopCat(tt); const hero = P(600, B.FLOOR, has(line, 'Lesson', 'perfect nose') ? P_SHRUG : P_STAND, 'neutral', { look: 0.9 });
  frame(U, B, { z: 1.0, cx: 960, cy: 540 }, [hero], dogs(900, B.FLOOR, 0.8, tt, 'sit'), { fxIn: true });
  if (has(line, 'Lesson', 'perfect nose')) lesson(U, t, 1, 'PERFECT NOSE. NO IDEA WHAT\'S YOURS'); else L1(U, t, "THE NEIGHBOUR'S LOST CAT", 0.3);
  chrome(U, t, info, D(1, '3:31 AM', ST()));
};
// breakfast: the dogs under the table, guarding you
S.bfast = (U, t, info, tt, k, n, line) => { const B = J.kitchen(tt); const FL = B.FLOOR || 840; let cam = { z: 1.15, cx: 900, cy: 560 };
  const up = has(line, 'feet pulled up', 'cereal');
  const hero = P(1220, FL, up ? { ...P_SIT, lL: [70, 120], lR: [70, 120] } : P_SIT, has(line, 'guarding') ? 'open' : 'worried', { flip: true, look: -0.9 });
  const mum = Q(560, FL, has(line, 'mum asks') ? { ...P_STAND, aR: [60, 100] } : P_STAND, MUM, 'neutral', { look: 0.8 });
  const dx = has(line, 'every time she moves', 'moves') ? Math.sin(tt * 2) * 60 : 0;
  let fx = `<g opacity="0.92">${dogs(760 + dx, FL + 10, 0.55, tt, 'sit', { gap: 340 })}</g>` + M.pool(1220, FL + 4, 300, tt);
  if (has(line, 'under it', 'breathing')) { cam = { z: 1.9, cx: 900, cy: 760 }; L1(U, t, 'UNDER · THE TABLE', 0.3, BLUE); }
  if (has(line, 'guarding')) L1(U, t, 'NOT FOLLOWING HER · GUARDING YOU', 0.3, BLUE);
  if (has(line, 'Lesson', 'normal')) lesson(U, t, 2, 'THEY OBEY. THEY DON\'T GET "NORMAL"');
  frame(U, B, cam, [hero, mum], fx, { fxIn: true }); chrome(U, t, info, D(1, '7:30 AM', ST())); };
// lunch: the toad in the office
S.toad = (U, t, info, tt, k, n, line) => {
  if (has(line, 'In the story this is Toad', 'fuse', 'Toad, another')) { lore(U, t, 'TOAD', ['A TOAD THE SIZE OF A PERSON', 'ANOTHER SHIKIGAMI OF THE TEN SHADOWS', 'IN THE STORY, TWO OF THEM CAN FUSE INTO SOMETHING NEW'], M.toad(1660, 900, 0.9, tt)); chrome(U, t, info, D(1, '12:30 PM', ST())); return; }
  const B = M.office(tt); const FL = B.FLOOR; const OUT = since('toad', 'slaps out', 'toad the size'); let cam = { z: 1.1, cx: 960, cy: 540 };
  const hero = P(560, FL, k >= OUT ? P_SHRUG : P_STAND, k >= OUT ? 'worried' : 'neutral', { look: 0.9 });
  const ppl = [hero]; let fx = M.pool(600, FL + 4, 300, tt);
  if (k >= OUT) { const s = has(line, 'slaps out', 'toad the size') ? 0.4 + 0.8 * ease.out(clamp(t / 0.6)) : 1.2; const tx = has(line, 'fridge') ? 1640 : 1000;
    fx += M.toad(tx, FL, s, tt, { tongue: has(line, 'printer', 'mess') ? clamp(t / 0.8) * 0.85 : 0 }); }
  if (has(line, 'boss')) ppl.push(Q(1520, FL, { ...P_STAND, aR: [60, 100] }, BOSS, 'open', { flip: true }));
  if (has(line, 'slaps out', 'toad the size')) { cam = { z: 1.3, cx: 1000, cy: 640 }; L1(U, t, 'SHIKIGAMI #2 · A TOAD', 0.3, '#4fd06a'); }
  if (has(line, 'fridge')) { cam = { z: 1.4, cx: 1500, cy: 600 }; L1(U, t, 'HIDING PLACE · THE FRIDGE', 0.3); }
  if (has(line, 'Lesson', 'manual')) lesson(U, t, 3, 'NO MANUAL. NO PERMISSION');
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(1, '12:30 PM', ST())); };
// 6 p.m.: the elephant in the underground car park
S.eleph = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Max Elephant')) { lore(U, t, 'MAX ELEPHANT', ['ONE OF THE TEN SHADOWS', 'IT TAKES A HUGE AMOUNT OF CURSED ENERGY TO SUMMON'], M.elephant(1500, 900, 0.7, tt, 1)); chrome(U, t, info, D(1, '6:00 PM', ST())); return; }
  if (has(line, 'six tonnes', 'African elephant')) { bigNum(U, t, '~6', 'TONNES', 'AN ADULT AFRICAN ELEPHANT (AVERAGE MALE)', 'REAL WORLD · WIKIPEDIA / SANPARKS'); chrome(U, t, info, D(1, '6:00 PM', ST())); return; }
  if (has(line, 'own maths', 'joules', 'three metres')) { const kk = clamp(t / 1.2); full(U, `<rect width="1920" height="1080" fill="#0e1424"/>`);
    big(U, `<div style="width:1600px"><div style="font:800 34px 'IBM Plex Mono';color:#ffd23f;letter-spacing:.08em">OUR OWN MATHS</div><div style="${TXT(84)};margin-top:20px">6 000 kg × 9.8 × 3 m</div><div style="${TXT(150, '#ffd23f')};margin-top:30px;opacity:${f(kk)}">≈ 176 000 J</div><div style="font:700 36px Inter;color:#cfd8e0;margin-top:20px;opacity:${f(kk)}">≈ 176 kJ · dropped from three metres</div></div>`, 200, 300); chrome(U, t, info, D(1, '6:00 PM', ST())); return; }
  const B = M.garage(tt, { dim: has(line, 'keys') }); const FL = B.FLOOR; const SUM = since('eleph', 'You summon it'), LEGS = since('eleph', 'legs go', 'shaking');
  const tired = k >= LEGS; let cam = { z: 1.05, cx: 960, cy: 540 };
  const hero = P(520, FL, tired ? P_SIT : k >= SUM ? HAND_DOWN : walk(tt), tired ? 'worried' : 'neutral', { look: 0.9 });
  let fx = M.pool(560, FL + 4, 300, tt);
  if (k >= SUM && !has(line, 'keys')) fx += M.elephant(1300, FL, 1.15, tt, has(line, 'You summon it') ? clamp(t / info.dur) * 0.6 : has(line, 'stand up') ? 0.6 + 0.4 * clamp(t / 1.2) : 1);
  if (has(line, 'You summon it', 'stand up')) { cam = { z: 1.0, cx: 1100, cy: 480 }; L1(U, t, 'SHIKIGAMI #3 · MAX ELEPHANT', 0.3, GOLD); }
  if (tired && !has(line, 'Lesson')) { L1(U, t, 'CURSED ENERGY · EMPTY', 0.3, COL.red); }
  if (has(line, 'keys')) { cam = { z: 1.6, cx: 700, cy: 640 }; L1(U, t, 'ONE HOUR · LOOKING FOR KEYS', 0.3); }
  if (has(line, 'Lesson', 'bigger the shadow')) lesson(U, t, 4, 'BIGGER SHADOW, BIGGER BILL');
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(1, '6:00 PM', ST(true, tired ? 'ENERGY · LOW' : 'SHADOW · AWAKE'))); };
// day 3: the white serpent in the hallway; the neighbour; the lift
S.serp = (U, t, info, tt, k, n, line) => {
  if (has(line, 'longest wild snake', 'Guinness', 'reticulated', 'twenty twenty-six')) { bigNum(U, t, '7.22', 'm', 'LONGEST WILD SNAKE EVER MEASURED (RETICULATED PYTHON)', 'REAL WORLD · GUINNESS WORLD RECORDS, FEB 2026', '#f4f4f8'); chrome(U, t, info, D(3, '9:00 PM', ST())); return; }
  if (has(line, 'never mentions', 'lift')) { const B = K.lift(tt, { lights: 1 }); const FL = B.FLOOR || 860; frame(U, B, { z: 1.2, cx: 960, cy: 560 }, [P(800, FL, P_STAND, 'neutral', { look: 0.9 }), Q(1100, FL, P_STAND, NEIGH, 'neutral', { flip: true, look: 0.3 })], '', { fxIn: true }); L1(U, t, 'THE LIFT · SILENCE', 0.3); chrome(U, t, info, D(4, '8:10 AM', ST())); return; }
  const B = M.hallway(tt); const FL = B.FLOOR; let cam = { z: 1.05, cx: 960, cy: 560 };
  const hero = P(300, FL, has(line, 'Lesson', 'put it back') ? HAND_DOWN : P_STAND, 'worried', { look: 0.9 });
  const len = has(line, 'Great Serpent') ? clamp(t / info.dur) : has(line, 'Lesson', 'put it back') ? 1 - 0.7 * clamp(t / info.dur) : 1;
  const pts = []; for (let i = 0; i <= 10; i++) { const x = 360 + i * 200 * len; pts.push([x, FL - 40 - (i % 2) * 90 - (i > 7 ? (i - 7) * 60 : 0)]); }
  let fx = M.pool(360, FL + 4, 340, tt) + M.serpent(pts, 92, tt, { tongue: true });
  const ppl = [hero];
  if (has(line, 'neighbour opens', 'goes back', 'white coil')) { ppl.push(Q(940, FL, P_STAND, NEIGH, has(line, 'goes back') ? 'neutral' : 'open', { flip: true })); cam = { z: 1.3, cx: 900, cy: 560 }; L1(U, t, 'DOOR 4C · CLOSED AGAIN', 0.6); }
  if (has(line, 'Great Serpent')) L1(U, t, 'SHIKIGAMI #4 · THE GREAT SERPENT', 0.3, '#f4f4f8');
  if (has(line, 'fills the hallway', "can't tell")) { cam = { z: 0.92, cx: 1100, cy: 520 }; L1(U, t, 'WHERE DOES IT END?', 0.3); }
  if (has(line, 'Lesson', 'put it back')) lesson(U, t, 5, 'LEARN TO PUT IT BACK');
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(3, '9:00 PM', ST())); };
// day 6: the fusion that tangles, in the stairwell
S.fuse = (U, t, info, tt, k, n, line) => { const B = M.stairwell(tt); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 560 };
  const TW = since('fuse', 'call two', 'two at once'), TANG = since('fuse', 'tangle', 'too many legs'), BACK = since('fuse', 'send them back', 'next day');
  const hero = P(380, FL, k >= BACK ? P_TIRED : k >= TW ? HAND_DOWN : P_THINK, k >= TANG ? 'worried' : 'neutral', { look: 0.9 });
  let fx = M.pool(420, FL + 4, 320, tt);
  if (k >= TW && k < BACK) { const j = k >= TANG ? Math.sin(tt * 30) * 10 : 0;
    fx += `<g transform="translate(${f(j)} 0)">${M.toad(1100, FL, 0.9, tt)}${M.dog(1000, FL - 60, 0.8, 'black', tt, { pose: 'stand' })}</g>`;
    if (k >= TANG) fx += [...Array(6)].map((_, i) => `<path d="M ${1000 + i * 40} ${FL - 120} l ${f(Math.sin(tt * 12 + i) * 40)} 120" stroke="#14141f" stroke-width="18" stroke-linecap="round"/>`).join(''); }
  if (has(line, 'two shikigami can fuse')) L1(U, t, 'IN THE STORY · TWO CAN FUSE', 0.3, BLUE);
  if (has(line, 'tangle', 'too many legs', 'opinions')) { cam = { z: 1.5, cx: 1050, cy: 640 }; L1(U, t, 'FUSION · FAILED', 0.3, COL.red); }
  if (has(line, 'next day in bed', 'send them back')) L1(U, t, 'COST · ONE DAY IN BED', 0.3);
  if (has(line, 'Lesson', 'more is')) lesson(U, t, 6, 'MORE IS NOT STRONGER');
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(6, '8:00 PM', ST())); };
// day 10: the boy films your shadow at sunset; the video spreads
const commentsCard = (U, t) => { const k = clamp(t / 0.5); const cm = [['"Obviously CGI"', '#cfd8e0'], ['"that\'s a ghost dog 😳"', '#ffd23f'], ['"why does it WAG"', '#cfd8e0'], ['"shikigami lol"', '#6fd8ff']];
  full(U, `<rect width="1920" height="1080" fill="#ff8a6a"/><rect x="560" y="80" width="800" height="960" rx="60" fill="#15181e"/><rect x="600" y="140" width="720" height="420" rx="16" fill="#ffc88a"/><rect x="600" y="440" width="720" height="120" fill="#8aa04a"/><path d="M 820 470 q 120 -40 220 10 l 30 -40 l 10 50 q 40 30 0 40 q -120 20 -260 -10 Z" fill="#07070f"/><circle cx="760" cy="360" r="28" fill="#2a2d3a"/><rect x="745" y="388" width="30" height="80" fill="#23284a"/><text x="620" y="600" font-family="Inter" font-weight="900" font-size="30" fill="#fff">my shadow has EARS?? 🐕</text><text x="620" y="640" font-family="IBM Plex Mono" font-weight="700" font-size="24" fill="#8a93a8">3.1M views</text>` + cm.map(([c, col], i) => `<text x="620" y="${710 + i * 70}" font-family="Inter" font-weight="800" font-size="34" fill="${col}" opacity="${f(clamp((t - 0.3 - i * 0.4) / 0.3))}">${c}</text>`).join('')); };
S.d10 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'CGI', 'ghost dog')) { commentsCard(U, t); CL1(U, t, 'THE VIDEO · EVERYWHERE', 0.2); chrome(U, t, info, D(10, '9:00 PM', ST())); return; }
  const B = M.sunsetPark(tt); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 560 };
  const hero = P(1100, FL, P_STAND, 'neutral', { look: -0.4 }); const boy = Q(420, FL, P_PHONE, BOY, 'open', { h: 240 });
  const w = Math.sin(tt * 9) * 14; // the shadow with ears, wagging, stretched to the left
  const fx = `<g transform="translate(1100 ${FL + 30}) scale(-1.6 0.42)"><path d="M 0 0 L 300 -40 Q 360 -120 420 -60 L 440 -150 L 470 -70 L 500 -150 L 520 -60 Q 560 0 420 30 L 0 40 Z" fill="#07070f" opacity="0.75"/><path d="M 300 -30 q -60 ${f(-80 + w)} -120 ${f(-60 + w)}" stroke="#07070f" stroke-width="30" opacity="0.75" fill="none"/></g>`;
  if (has(line, 'wrong shape', 'ears', 'wagging')) { cam = { z: 1.4, cx: 760, cy: 760 }; L1(U, t, 'YOUR SHADOW · HAS EARS', 0.3); }
  if (has(line, 'shikigami', 'joke')) L1(U, t, 'NOBODY SAYS "SHIKIGAMI"', 0.3, BLUE);
  if (has(line, 'Lesson', "would never", 'believe')) lesson(U, t, 7, 'THOSE WHO\'D UNDERSTAND WON\'T BELIEVE IT');
  frame(U, B, cam, [hero, boy], fx, { fxIn: true }); chrome(U, t, info, D(10, '6:40 PM', ST())); };
// day 12: the garden on the football pitch at night
S.garden = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Chimera Shadow Garden', 'Domain Expansion', 'no closed barrier', 'incomplete', 'spreads his shadow')) { lore(U, t, 'CHIMERA SHADOW GARDEN', ["MEGUMI'S VERSION OF A DOMAIN EXPANSION", 'NO WALLS · SPREADS HIS SHADOW OVER WHAT IS THERE', 'INCOMPLETE'], M.pool(1450, 860, 700, tt, { eyes: 1 })); chrome(U, t, info, D(12, '10:00 PM', ST())); return; }
  const PUSH = since('garden', 'push your shadow'); const dk = k < PUSH ? 0.05 : has(line, 'push your shadow') ? 0.1 + 0.7 * clamp(t / info.dur) : 0.8;
  const B = M.pitch(tt, { dark: dk, cx: 960 }); const FL = B.FLOOR; let cam = { z: 1.0, cx: 960, cy: 560 };
  const tired = has(line, 'wet sand', 'hold it', 'Lesson');
  const hero = P(960, FL + 120, tired ? P_TIRED : k >= PUSH ? HAND_DOWN : P_STAND, tired ? 'worried' : 'neutral', { look: 0.9 });
  let fx = '';
  if (k >= since('garden', 'dogs run through')) { const p = (tt * 0.6) % 1; fx += M.dog(-200 + p * 2400, FL + 220, 0.75, 'white', tt * 1.6, { pose: 'run' }) + M.dog(-500 + p * 2400, FL + 260, 0.75, 'black', tt * 1.6, { pose: 'run', seed: 2 }); }
  if (has(line, 'dogs run through')) L1(U, t, 'FASTER · THE GROUND HELPS THEM', 0.3, BLUE);
  if (has(line, 'nothing hits', 'nothing wins', 'easier')) L1(U, t, 'NO SURE HIT · JUST EASIER', 0.3);
  if (has(line, 'push your shadow')) { cam = { z: 0.92, cx: 960, cy: 600 }; L1(U, t, 'THE WHOLE PITCH · DARK', 0.6, BLUE); }
  if (tired && !has(line, 'Lesson')) L1(U, t, 'ONE MINUTE · HEAD FULL OF WET SAND', 0.3, COL.red);
  if (has(line, 'Lesson', "doesn't fight")) lesson(U, t, 8, 'THE GARDEN MAKES THE FIGHT YOURS');
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(12, '10:00 PM', ST(true, 'GARDEN · OPEN'))); };
// day 15: the man in the grey suit at the café
S.suit = (U, t, info, tt, k, n, line) => { const B = J.cafe(tt); const FL = B.FLOOR || 830; let cam = { z: 1.15, cx: 960, cy: 560 };
  const left = has(line, 'leaves without');
  const hero = P(700, FL, P_SIT, has(line, "don't know") ? 'worried' : 'neutral', { look: 0.9 });
  const ppl = [hero]; if (!left) ppl.push(Q(1200, FL, has(line, 'slides a card') ? { ...P_SIT, aL: [70, 10] } : P_SIT, SUIT, 'neutral', { flip: true }));
  else ppl.push(Q(1200 + clamp(t / info.dur) * 600, FL, walk(tt), SUIT, 'neutral', { look: 0.5 }));
  let fx = `<rect x="820" y="${FL - 150}" width="300" height="16" rx="6" fill="#8a5a3a"/><rect x="960" y="${FL - 134}" width="14" height="134" fill="#5a3a2a"/><rect x="1090" y="${FL - 172}" width="26" height="22" rx="4" fill="#f4f1ea"/>`;
  if (has(line, 'slides a card', 'card')) fx += `<rect x="${f(1050 - clamp(t / 1) * 150)}" y="${FL - 162}" width="90" height="12" rx="2" fill="#f4f1ea"/>`;
  if (has(line, 'slides a card', 'refuse')) { cam = { z: 1.8, cx: 960, cy: 640 }; L1(U, t, 'WHAT WOULD YOU REFUSE?', 0.3, COL.yellow); }
  if (has(line, 'Lesson', 'how far')) lesson(U, t, 9, 'HOW FAR WOULD YOU GO?');
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(15, '11:00 AM', ST())); };
// day 20: the wheel stirs in the shadow (the strongest one is never shown)
S.wheel = (U, t, info, tt, k, n, line) => {
  const wheelArt = M.wheel(1600, 640, 190, tt * 18, 0.95);
  if (has(line, 'Mahoraga', 'adapts', 'strongest shikigami', 'wheel on its back')) { lore(U, t, 'THE STRONGEST ONE', ['MAHORAGA: THE STRONGEST SHIKIGAMI OF THE TECHNIQUE', 'IT ADAPTS TO WHATEVER HITS IT', 'THE WHEEL ON ITS BACK TURNS AS IT LEARNS'], wheelArt, GOLD); chrome(U, t, info, D(20, '2:00 AM', ST(true, 'SHADOW · STIRRING'))); return; }
  if (has(line, 'ritual', 'dead', 'tamed it', 'the only one')) { lore(U, t, 'THE RITUAL', ['IT ENDS ONLY WHEN THE TARGET IS DEAD', 'OR WHEN IT IS TAMED', 'THE ONLY ONE WHO EVER TAMED IT: SUKUNA'], wheelArt, GOLD); chrome(U, t, info, D(20, '2:00 AM', ST(true, 'SHADOW · STIRRING'))); return; }
  const B = M.nightBalcony(tt); const FL = B.FLOOR; let cam = { z: 1.2, cx: 960, cy: 600 };
  const stop = has(line, 'close your eyes', 'stops turning', "don't tell", 'Lesson');
  const hero = P(520, FL, stop ? P_STAND : HAND_DOWN, stop ? 'neutral' : 'worried', { look: 0.9 });
  const rot = stop ? 40 + 30 * (1 - clamp(t / info.dur)) : tt * 18;
  let fx = M.pool(1200, FL + 6, 600, tt) + M.wheel(1200, FL - 130, 150, rot, stop ? 0.5 * (1 - clamp(t / info.dur)) + 0.2 : 0.85);
  if (has(line, 'something stirs')) { cam = { z: 1.6, cx: 1200, cy: 700 }; L1(U, t, 'NOT A DOG · NOT A TOAD', 0.3, GOLD); }
  if (has(line, 'stops turning', 'close your eyes')) L1(U, t, 'THE WHEEL · STOPS', 0.3, GOLD);
  if (has(line, 'Lesson', 'one door')) lesson(U, t, 10, 'ONE DOOR YOU CAN\'T WALK BACK THROUGH');
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(20, '2:00 AM', ST(true, 'SHADOW · STIRRING'))); };
// day 25: the lost child in the forest
S.child = (U, t, info, tt, k, n, line) => { const FOUND = since('child', 'find her', 'forty minutes'); const B = M.forest(tt, { torches: k < FOUND, trunk: k >= FOUND }); const FL = B.FLOOR; let cam = { z: 1.05, cx: 960, cy: 560 };
  const ppl = []; let fx = '';
  if (k < FOUND) { ppl.push(P(1500, FL, has(line, 'hand over your shadow', 'treeline') ? HAND_DOWN : P_STAND, 'neutral', { flip: true, look: -0.9 }));
    if (has(line, 'search party', 'goes missing')) for (let i = 0; i < 3; i++) ppl.push(Q(200 + i * 300, FL, walk(tt + i), SEARCH[i], 'worried', { h: 320 }));
    fx += M.pool(1500, FL + 4, 320, tt);
    if (has(line, 'scent', 'they go', 'silent', 'low through')) { const p = has(line, 'they go', 'silent', 'low through') ? clamp(t / info.dur) : 0; fx += dogs(1200 - p * 900, FL, 0.7, tt, p > 0 ? 'run' : 'sniff', { flip: true, gap: -300 }); }
    if (has(line, 'scent')) { cam = { z: 1.5, cx: 1300, cy: 660 }; L1(U, t, "THE SCENT · HER COAT", 0.3, BLUE); }
    if (has(line, 'white and black', 'low through')) L1(U, t, 'WHITE AND BLACK · SILENT', 0.3, '#fff');
  } else {
    const kid = Q(1500, FL - 30, P_SIT, KIDC, has(line, 'hugging') ? 'smile' : 'neutral', { h: 200, look: -0.5 });
    ppl.push(kid); if (has(line, 'hugging', 'Nobody asks')) { ppl.push(Q(1300, FL, { ...P_STAND, aL: [70, 60], aR: [70, 60] }, SEARCH[1], 'smile', { h: 320 })); ppl.push(P(700, FL, P_STAND, 'smile', { look: 0.9 })); }
    fx += dogs(1050, FL, 0.6, tt, 'sit');
    if (has(line, 'forty minutes', 'asleep')) { cam = { z: 1.5, cx: 1450, cy: 680 }; L1(U, t, 'FOUND · 40 MINUTES', 0.3, '#4fd06a'); }
    if (has(line, 'Lesson', 'what you do')) lesson(U, t, 11, "IT'S WHAT YOU DO WITH IT");
  }
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(25, '11:20 PM', ST())); };
// day 30: the cost, sitting on the floor at home
S.d30 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'dogs are cheap', 'toad is cheap', 'leaves you in bed')) { full(U, bars('WHAT EACH ONE COSTS YOU (HOW IT FEELS)', [{ v: 1, t: 'CHEAP', lab: 'DOGS', c: '#eef2f8' }, { v: 1.3, t: 'CHEAP', lab: 'TOAD', c: '#4f8a6e' }, { v: 9, t: 'A DAY IN BED', lab: 'ELEPHANT', c: '#e2553f' }], clamp(t / 1.0))); CL1(U, t, 'YOUR OWN SCALE · NOT A MEASUREMENT', 0.2); chrome(U, t, info, D(30, '8:00 PM', ST())); return; }
  const B = N.flat(tt); const FL = B.FLOOR || 840; const hero = P(900, FL, { ...P_SIT, lL: [70, 120], lR: [70, 120] }, 'worried', { look: 0.9 });
  const fx = M.pool(900, FL + 6, 700, tt, { eyes: 0.5 }) + `<g opacity="0.85">${dogs(1250, FL, 0.5, tt, 'sit')}</g>`;
  if (has(line, 'bank account', 'balance')) L1(U, t, 'BALANCE: ???', 0.3, COL.red);
  if (has(line, 'Lesson', 'out of you')) lesson(U, t, 12, "YOU'RE ONLY EVER OUT OF YOU");
  if (has(line, 'exactly how much')) L1(U, t, 'EVERY SHADOW HAS A PRICE', 0.3);
  frame(U, B, { z: 1.2, cx: 960, cy: 600 }, [hero], fx, { fxIn: true }); chrome(U, t, info, D(30, '8:00 PM', ST(true, 'ENERGY · LOW'))); };
// day 40: the car park collapse; you don't open the strongest one; everything else together
S.d40 = (U, t, info, tt, k, n, line) => {
  const RUNK = since('d40', 'You run'), TURN = since('d40', 'feel it turning', 'lift the slab'), TAKE = since('d40', 'take it away'), SPREAD = since('d40', 'spread your shadow', 'other thing'),
    DOGS = since('d40', 'dogs find'), TOAD = since('d40', 'toad pulls'), SERP = since('d40', 'serpent slides'), ELE = since('d40', 'elephant stands'), OUTK = since('d40', 'Eleven people come out');
  const lift = k >= ELE ? (k > ELE ? 1 : clamp(t / info.dur)) : 0;
  const B = M.collapse(tt, { lift }); const FL = B.FLOOR; let cam = { z: 1.0, cx: 1100, cy: 540 };
  const hx = k < RUNK ? 400 : k === RUNK ? 400 + clamp(t / info.dur) * 300 : 700;
  const hero = P(hx, FL, k === RUNK ? run(tt) : k >= SPREAD ? HAND_DOWN : k >= TURN && k < SPREAD ? HAND_DOWN : P_STAND, k >= OUTK ? 'neutral' : 'worried', { look: 0.9 });
  const ppl = [hero];
  let fx = M.pool(hx + 40, FL + 4, k >= SPREAD ? 900 + (k === SPREAD ? clamp(t / info.dur) * 700 : 700) : 320, tt);
  if (k >= TURN && k < SPREAD) fx += M.pool(hx + 300, FL + 4, 300, tt) + M.wheel(hx + 300, FL - 110, 110, k >= TAKE ? 30 : tt * 22, k >= TAKE ? 0.6 * (1 - clamp(t / info.dur)) : 0.8);
  if (k >= DOGS && k < OUTK) fx += dogs(1250, FL, 0.6, tt, 'sniff');
  if (k >= TOAD && k < OUTK) fx += M.toad(1050, FL, 0.75, tt, { tongue: k === TOAD ? clamp(t / 0.8) * 0.9 : 0.5 });
  if (k >= SERP && k < OUTK) fx += M.serpent([[900, FL - 10], [1150, FL - 60], [1400, FL - 20], [1650, FL - 70]], 60, tt);
  if (k >= ELE) fx += M.elephant(1750, FL, 0.6, tt, 1);
  if (k >= OUTK) for (let i = 0; i < 11; i++) ppl.push(Q(900 + i * 95, FL, i % 3 ? P_STAND : P_TIRED, SEARCH[i % 3], i % 2 ? 'smile' : 'neutral', { h: 260 + (i % 3) * 20, flip: true }));
  if (has(line, 'collapses', 'eleven people underneath')) { L1(U, t, '11 PEOPLE · UNDER THE SLAB', 0.3, COL.red); cam = { z: 1.15, cx: 1300, cy: 600 }; }
  if (has(line, 'feel it turning', 'lift the slab')) { cam = { z: 1.5, cx: hx + 160, cy: FL - 200 }; L1(U, t, 'IT COULD LIFT IT · ONE HAND', 0.3, GOLD); }
  if (has(line, 'take it away')) L1(U, t, 'NOT · THIS · ONE', 0.3, GOLD);
  if (has(line, 'spread your shadow', 'big enough')) L1(U, t, 'THE GARDEN · OVER THE RUBBLE', 0.3, BLUE);
  if (has(line, 'dogs find')) L1(U, t, 'DOGS · BY SMELL', 0.3, '#fff');
  if (has(line, 'toad pulls')) L1(U, t, 'TOAD · ONE BY ONE', 0.3, '#4fd06a');
  if (has(line, 'serpent slides')) L1(U, t, 'SERPENT · UNDER THE BEAMS', 0.3, '#f4f4f8');
  if (has(line, 'elephant stands')) { cam = { z: 1.1, cx: 1500, cy: 560 }; L1(U, t, 'ELEPHANT · HOLDING THE SLAB', 0.3, GOLD); }
  if (k >= OUTK) L1(U, t, '11 OF 11 · OUT', 0.3, '#4fd06a');
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(40, '11:40 PM', ST(true, k >= SPREAD && k < OUTK ? 'GARDEN · OPEN' : 'SHADOW · AWAKE'))); };
// day 41: the cost, again
S.d41 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Not a gift', 'door in the floor')) { const kk = clamp(t / 0.6); full(U, `<rect width="1920" height="1080" fill="#05060f"/>${M.pool(960, 820, 900 * (0.6 + 0.4 * kk), tt, { eyes: 1 })}`); big(U, `<div style="${TXT(96)};opacity:${f(kk)}">NOT A GIFT.<br><span style="color:${BLUE}">A DOOR IN THE FLOOR.</span></div>`, 200, 260); chrome(U, t, info, D(41, '9:00 AM', ST(false, 'SHADOW · QUIET'))); return; }
  const B = SET.bedroom(tt); const FL = 820; const hero = P(500, FL, P_TIRED, 'worried', { look: 0.9 });
  const fx = M.pool(540, FL + 4, 300, tt);
  if (has(line, 'Lesson', 'strongest thing')) lesson(U, t, 13, "THE STRONGEST ONE IS THE ONE YOU DIDN'T OPEN"); else L1(U, t, "CAN'T · GET · UP", 0.3);
  frame(U, B, { z: 1.3, cx: 700, cy: 560 }, [hero], fx, { fxIn: true }); chrome(U, t, info, D(41, '9:00 AM', ST(false, 'SHADOW · QUIET'))); };
// ending: 3:15 again; the white dog sits; the questions
S.ending = (U, t, info, tt, k, n, line) => { if (k === 0 && t < info.dur * 0.6) { clock315(U, t, info, 42); return; } const B = SET.bedroom(tt, { time: 'night' }); const FL = 820; B.back += M.moon(1560, 250, 46);
  const Qs = k >= since('ending', 'woke up tomorrow');
  const hero = P(640, FL, has(line, 'lift your arm') ? ARM_UP : P_STAND, Qs ? 'smile' : 'neutral', { look: 0.9, pre: wallShadow(640, FL, 360, P_STAND) });
  let fx = M.pool(700, FL + 4, 400, tt, { eyes: k < since('ending', 'white dog') ? 1 : 0 });
  if (k >= since('ending', 'white dog') || has(line, 'stirs', 'sits')) fx += M.dog(1000, FL, 0.9, 'white', tt, { pose: has(line, 'stirs') ? 'stand' : 'sit' });
  frame(U, B, { z: has(line, 'white dog') ? 1.5 : 1.15, cx: has(line, 'white dog') ? 900 : 900, cy: 560 }, [hero], fx, { fxIn: true });
  if (Qs) { U.svg('card', `<rect width="1920" height="1080" fill="#000" opacity="0.45"/>`, {}, { z: 3 }); const q = has(line, 'comments', 'killing') ? 'Would you ever open the last one?' : 'Which one would you call first?';
    big(U, `<div style="${TXT(84)};text-shadow:0 8px 0 #000;max-width:1100px">${q}</div>`, 160, 320); }
  else if (has(line, 'three fifteen', 'next night')) L1(U, t, 'THE NEXT NIGHT · 3:15', 0.2, BLUE);
  else if (has(line, 'white dog')) L1(U, t, 'THE WHITE DOG', 0.2, '#fff');
  chrome(U, t, info, Qs ? { day: null, time: null, status: { text: 'YOUR TURN', on: true, color: COL.yellow } } : D(42, '3:15 AM', ST()));
};

const BG = { open: '#0a0c24', dogs: '#141a40', bfast: '#f2d58a', toad: '#dfe6ee', eleph: '#454a58', serp: '#c8b89a', fuse: '#7a8494', d10: '#ffc88a', garden: '#0c1430', suit: '#6a3a3a', wheel: '#0a0e24', child: '#0e1a24', d30: '#8a9ac8', d40: '#101632', d41: '#7aa6c8', ending: '#2a2650' };
// shots that must show the action (never a text card or a close-up)
const WIDE = new Set(Object.entries(PLAN).filter(([, p]) => has(p.line, 'two dogs step', 'slaps out', 'You summon it', 'stand up', 'Great Serpent', 'fills the hallway', 'tangle', 'push your shadow', 'dogs run through', 'they go', 'forty minutes', 'collapses', 'dogs find', 'toad pulls', 'serpent slides', 'elephant stands', 'Eleven people come out', 'white dog', 'car park full', 'hungry', 'Sukuna', 'Megumi')).map(([id]) => id));
const CUTS = {}; { const by = {}; for (const [id, p] of Object.entries(PLAN)) (by[p.sec] = by[p.sec] || []).push(id);
  for (const ids of Object.values(by)) ids.forEach((id, k) => { CUTS[id] = WIDE.has(id) || k === 0 ? 'wide' : ['close', 'wide', 'kin', 'wide', 'close', 'wide'][(k - 1) % 6]; }); }
const SHOT = (id, bg, body, sec, line) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { U.svg('fx', '', {}); U.svg('card', '', {}); U.html('big', '', {}); U.svg('punch', '', {}); FULLED = false; CUT = CUTS[id] === 'close' ? 'close' : 'wide'; body(U, t, info, info.start + t); CUT = 'wide'; if (CUTS[id] === 'kin' && !FULLED && sec !== 'ending' && !has(line, 'Lesson')) kin(U, t, line, sec); } });
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line), p.sec, p.line);
