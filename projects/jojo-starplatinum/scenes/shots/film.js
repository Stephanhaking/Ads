// "What If You Had Star Platinum in Real Life?" — flat 2D (same look as Luffy / JoJo / Death Note / Killua). Shots come from
// PLAN (story sections); each section draws by keywords in the narration line. The Stand is our own glowing blue-purple
// figure (not traced from the anime). The bullet only ever appears as numbers on a whiteboard / stat card, never a weapon.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_STAND, P_THINK, P_TIRED, P_PHONE, P_SIT, P_RUN, P_SHRUG } from '../lib/people.js';
import { hud, label, caption, punch, COL } from '../lib/hud.js';
import { frame as frame0 } from '../lib/flat2d.js';
import * as SET from '../lib/sets/saitama2d.js';
import * as J from '../lib/sets/jojo2d.js';
import * as N from '../lib/sets/dn2d.js';
import * as K from '../lib/sets/kil2d.js';
import * as SP from '../lib/sets/sp2d.js';
import { PLAN } from './plan.js';

const f = (n) => n.toFixed(1);
const OL = '#b9dcff', PUR = '#a08cff', CY = '#7fe3ff';
const HERO = { top: '#2f9a8e', bottom: '#2a2d3a', hood: true, hair: 'short', broad: true };
const MUM = { top: '#e05a8a', bottom: '#22263a', hair: 'ponytail' };
const KID = { top: '#ffd23f', bottom: '#22263a', hair: 'short' };
const STAFF = { top: '#e2553f', bottom: '#22263a', hair: 'curly' };
const COACH = { top: '#4a4e5a', bottom: '#22263a', hair: 'short', broad: true };
const LADY = { top: '#ffd23f', bottom: '#2a2d3a', hair: 'ponytail' };
const TITLE = 'WHAT IF YOU HAD STAR PLATINUM?';
const ST = (on = true, txt = 'STAND · OUT') => ({ text: txt, on, color: PUR });
const chrome = (U, t, info, d) => { hud(U, { title: TITLE, ...d }); caption(U, info, t); };
const LX = (txt) => Math.min(1180, 1840 - txt.length * 24 - 70); // labels stay inside the safe area
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 260, c ? { color: c } : {});
const L2 = (U, t, txt, t0 = 1.0, c) => label(U, 'L2', txt, t0, t, LX(txt), 350, c ? { color: c } : {});
const CL1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 170, c ? { color: c } : {});
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const since = (sec, ...w) => { let best = 1e9; for (const p of Object.values(PLAN)) if (p.sec === sec && has(p.line, ...w)) best = Math.min(best, p.k); return best; };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const run = (tt) => { const s = Math.sin(tt * 14); return { ...P_RUN, aL: [50 + s * 40, 80], aR: [40 - s * 40, 110], lL: [30 + s * 30, 40], lR: [-10 - s * 30, 10] }; };
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre, shadow: o.shadow, live: o.live });
const Q = (x, y, pose, outfit, face = 'neutral', o = {}) => ({ x, y, h: o.h || 340, pose, outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const D = (day, time, status) => ({ day, time, status });
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
let FULLED = false;
const full = (U, svg) => { FULLED = true; return U.svg('card', svg, {}, { z: 3 }); };
// the Stand drawn just behind the hero (hero x, y, h); pose of the Stand; returns {svg, hands}
const STAND = (x, y, h, pose, tt, o = {}) => SP.stand(x + (o.dx ?? -70), y + (o.dy ?? -30), h * (o.s ?? 1.3), pose, tt, o);
const withStand = (st) => () => st.svg;
// visual pace: inside a section, shots alternate wide / close-up / kinetic-text card (rule: no location > 25 s,
// a strong change about every 5 s); key action shots are forced wide
let CUT = 'wide';
const frame = (U, B, cam, ppl, fx, o) => { if (CUT === 'close' && ppl && ppl[0]) { const h = ppl[0]; cam = { z: Math.max(cam.z * 1.9, 2.3), cx: h.x + (h.flip ? -30 : 30), cy: h.y - (h.h || 360) * 0.72 }; } return frame0(U, B, cam, ppl, fx, o); };
const KCOL = { open: ['#1a1030', '#a08cff'], am740: ['#f2d58a', '#15181e'], noon: ['#e2553f', '#ffffff'], gym: ['#2a2650', '#ffd23f'], day3: ['#5a1814', '#ffd23f'], day6: ['#0c1424', '#7fe3ff'], day10: ['#2f9a5a', '#ffffff'], day15: ['#f8faf8', '#1f3a8a'], day30: ['#6a3a3a', '#ffd23f'], day40: ['#0c0a24', '#a08cff'], day41: ['#8a9ac8', '#15181e'] };
const kin = (U, t, line, sec) => { const [bg, ac] = KCOL[sec] || ['#15181e', '#ffd23f']; const words = line.replace(/["“”]/g, '').split(/\s+/).filter(Boolean);
  let key = 0, len = 0; words.forEach((w, i) => { const n = w.replace(/[^\w]/g, '').length; if (n > len) { len = n; key = i; } });
  const k = clamp(t / 0.25), dark = ['#f2d58a', '#f8faf8', '#8a9ac8'].includes(bg);
  U.svg('card', `<rect width="1920" height="1080" fill="${bg}"/>${[...Array(9)].map((_, i) => `<rect x="${-200 + i * 260 + (t * 40) % 260}" y="0" width="120" height="1080" fill="${dark ? '#000' : '#fff'}" opacity="0.035" transform="skewX(-12)"/>`).join('')}`, {}, { z: 3 });
  U.html('big', `<div style="width:1500px;transform:scale(${f(0.92 + 0.08 * ease.out(k))});transform-origin:left center;opacity:${f(k)};${TXT(118, dark ? '#15181e' : '#ffffff')};text-transform:uppercase">${words.map((w, i) => i === key ? `<span style="color:${ac === '#15181e' ? '#c8352e' : ac}">${w}</span>` : w).join(' ')}</div>`, { left: '200px', top: '330px' }, { z: 50 });
  U.html('L1', '', {}); U.html('L2', '', {}); U.html('cap', '', {}); };
// shots that must show the action (never a text card or a close-up)
const WIDE = new Set(['s001', 's002', 's003', 's004', 's005', 's009', 's010', 's011', 's025', 's026', 's027', 's043', 's044', 's058', 's059', 's068', 's069', 's076', 's078', 's114', 's116', 's120', 's121', 's123', 's126', 's136', 's137', 's138']);
const CUTS = {}; { const by = {}; for (const [id, p] of Object.entries(PLAN)) (by[p.sec] = by[p.sec] || []).push(id);
  for (const ids of Object.values(by)) ids.forEach((id, k) => { CUTS[id] = WIDE.has(id) || k === 0 ? 'wide' : ['close', 'wide', 'kin', 'wide', 'close', 'wide'][(k - 1) % 6]; }); }
const SHOT = (id, bg, body, sec, line) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { U.svg('fx', '', {}); U.svg('card', '', {}); U.html('big', '', {}); U.svg('punch', '', {}); FULLED = false; CUT = CUTS[id] === 'close' ? 'close' : 'wide'; body(U, t, info, info.start + t); CUT = 'wide'; if (CUTS[id] === 'kin' && !FULLED && sec !== 'ending') kin(U, t, line, sec); } });
const lesson = (U, t, n, txt) => L1(U, t, `LESSON ${n} · ${txt}`, 0.2, COL.yellow);
// stat card: horizontal bars [{v, t, lab, c}] with a title
const bars = (title, rows, k = 1, max) => { const mx = max || Math.max(...rows.map((r) => r.v)), W = 1100;
  return `<rect width="1920" height="1080" fill="#0e1424"/><text x="960" y="290" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#fff">${title}</text>` + rows.map((r, i) => { const y = 400 + i * 150, w = Math.max(8, W * r.v / mx * k);
    return `<text x="400" y="${y + 50}" text-anchor="end" font-family="IBM Plex Mono" font-weight="800" font-size="30" fill="#cfd8e0">${r.lab}</text><rect x="430" y="${y}" width="${f(w)}" height="76" rx="10" fill="${r.c || '#3fb8e0'}"/><text x="${f(450 + w)}" y="${y + 54}" font-family="Inter" font-weight="900" font-size="48" fill="#fff" opacity="${f(k)}">${r.t}</text>`; }).join(''); };
const barbell = (x, y, plates, bend = 0, s = 1) => { let g = `<path d="M ${x - 330 * s} ${y} Q ${x} ${f(y + bend * 60)} ${x + 330 * s} ${y}" stroke="#cfd8e0" stroke-width="${12 * s}" fill="none"/>`;
  for (let i = 0; i < plates; i++) for (const sd of [-1, 1]) { const px = x + sd * (230 + i * 18) * s, py = y + (bend * 60) * (1 - Math.pow((230 + i * 18) / 330, 2)) * 0; g += `<rect x="${f(px - 8 * s)}" y="${f(py - (90 - (i % 3) * 10) * s - bend * 6)}" width="${f(16 * s)}" height="${f((180 - (i % 3) * 20) * s)}" rx="4" fill="${['#2a2d3a', '#e2553f', '#3f6db3'][i % 3]}"/>`; }
  return g; };

const S = {};
S.open = (U, t, info, tt, k, n, line) => {
  // 0-14 s: the promise. Name the power, then flash forward to two real scenes from later in this video.
  if (has(line, 'faster than anything')) { S.day3(U, t, info, tt, since('day3', 'bag lasts'), 14, 'The bag lasts four seconds. Then it splits,'); L1(U, t, 'LATER · DAY 3', 0.2, COL.yellow); return; }
  if (has(line, 'stop time for one breath')) { S.day40(U, t, info, tt, since('day40', 'birds stop'), 14, 'The birds stop mid-wing. You reach the van.'); L1(U, t, 'LATER · DAY 40 · TIME STOPPED', 0.2, PUR); return; }
  if (has(line, 'this morning')) { const kk = clamp(t / 0.4); full(U, `<rect width="1920" height="1080" fill="#0b0b14"/><rect x="560" y="300" width="800" height="440" rx="40" fill="#15181e" stroke="#2a2d3a" stroke-width="10"/><text x="960" y="610" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="260" fill="#ff5a4a" opacity="${f(kk)}">7:12</text><text x="1300" y="400" text-anchor="end" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="#ff5a4a" opacity="0.7">AM</text>`); chrome(U, t, info, D(1, '7:12 AM', ST(false, 'STAND · ?'))); return; }
  const B = SET.bedroom(tt, { time: 'dawn' }); const FL = 820, intro = k < since('open', 'this morning'), gone = intro || k >= since('open', 'puts the glass back'), arm = intro || k >= since('open', 'Something else does');
  const fallK = gone ? 0 : has(line, 'slides') ? clamp(t / info.dur) * 0.4 : k >= since('open', 'slides') ? 0.4 + 0.2 * clamp(t / info.dur) : 0;
  let cam = { z: 1.25, cx: 1000, cy: 560 };
  const hero = P(760, FL, has(line, 'before your own hand') ? { ...P_SIT, aR: [16 + clamp(t / info.dur) * 30, 40] } : P_SIT, intro ? 'open' : arm && !gone ? 'open' : 'neutral', { look: 0.9 });
  const sp = STAND(760, FL, 360, intro ? { ...P_STAND, aL: [60, 120], aR: [95, 15] } : gone ? { ...P_STAND, aR: [70, 30] } : arm ? { ...P_STAND, aR: [95, 15] } : P_STAND, tt, { op: intro ? 0.95 : arm ? (has(line, 'huge arm') ? clamp(t / 0.8) : 0.9) : 0, dx: 60, dy: -110, s: intro ? 1.3 : 1.15 });
  let fx = SP.nightstand(1180, FL, '7:12', gone ? (intro ? -1 : 0) : fallK);
  if (arm && !gone) fx += SP.streak(sp.hands[1][0] - 160, sp.hands[1][1] - 40, sp.hands[1][0], sp.hands[1][1], 4, PUR);
  hero.pre = withStand(sp);
  if (has(line, "You've woken up with Star Platinum")) { cam = { z: 1.05 + 0.1 * clamp(t / info.dur), cx: 880, cy: 500 }; L1(U, t, 'STAR PLATINUM', 0.1, PUR); }
  if (has(line, "Jotaro's Stand", 'Bizarre')) { cam = { z: 1.5, cx: 860, cy: 420 }; L1(U, t, "JOTARO'S STAND · JOJO'S BIZARRE ADVENTURE", 0.1, PUR); }
  if (has(line, 'In real life')) { cam = { z: 1.15, cx: 960, cy: 540 }; L1(U, t, 'IN REAL LIFE', 0.1, '#4fd06a'); }
  if (has(line, 'slides')) { cam = { z: 2.0, cx: 1120, cy: 680 }; L1(U, t, 'GLASS · FALLING… SLOWLY', 0.2); }
  if (has(line, 'huge arm', 'blue and purple')) { cam = { z: 1.6, cx: 960, cy: 480 }; L1(U, t, 'SOMETHING · ELSE', 0.3, PUR); }
  if (has(line, 'puts the glass back')) { cam = { z: 1.8, cx: 1000, cy: 600 }; L1(U, t, t < info.dur * 0.5 ? 'GLASS · SAVED' : 'YOUR HAND · STILL MOVING', 0.2, '#4fd06a'); }
  if (has(line, 'before tonight')) { cam = { z: 1.7, cx: 760, cy: 520 }; L1(U, t, 'BEFORE TONIGHT…', 0.2, COL.red); }
  if (has(line, "can't replace")) { full(U, `<rect width="1920" height="1080" fill="#1a0810"/>`); big(U, `<div style="${TXT(110)}">BEFORE TONIGHT,<br><span style="color:#ff5a4a">IT WILL COST YOU.</span></div>`, 200, 360); chrome(U, t, info, D(1, '7:13 AM', ST())); return; }
  frame(U, B, cam, [hero], fx, { fxIn: true });
  chrome(U, t, info, D(1, '7:12 AM', ST(arm)));
};
S.am740 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'base powers', 'strength, speed', 'far beyond')) { const kk = clamp(t / 1.0);
    full(U, bars('IN THE STORY · STAR PLATINUM (BASE POWERS)', [{ v: 1, t: 'FAR BEYOND HUMAN', lab: 'STRENGTH', c: PUR }, { v: 1, t: 'FAR BEYOND HUMAN', lab: 'SPEED', c: PUR }, { v: 1, t: 'FAR BEYOND HUMAN', lab: 'PRECISION', c: PUR }], kk, 1.6));
    CL1(U, t, 'IN THE STORY · A STAND', 0.2, PUR); chrome(U, t, info, D(1, '7:40 AM', ST())); return; }
  const B = J.kitchen(tt); let cam = { z: 1.2, cx: 960, cy: 560 };
  const left = has(line, 'think "left"', 'think left', 'already moved');
  const hero = P(700, 840, P_STAND, 'neutral', { look: 0.9 });
  const sp = STAND(700, 840, 360, P_STAND, tt, { dx: left ? -260 : 90, op: 0.85 }); hero.pre = withStand(sp);
  const wardrobe = `<rect x="1180" y="300" width="260" height="540" rx="10" fill="#a8704a"/><rect x="1300" y="300" width="6" height="540" fill="#6a4228"/><circle cx="1288" cy="580" r="8" fill="#ffd23f"/><circle cx="1318" cy="580" r="8" fill="#ffd23f"/>`;
  const ppl = [hero];
  if (has(line, 'mum', 'wardrobe')) { ppl.push(Q(1600, 840, { ...P_SHRUG }, MUM, 'neutral', { flip: true })); L1(U, t, 'MUM · SEES NOTHING', 0.3); }
  if (has(line, 'Nobody else')) L1(U, t, 'VISIBLE TO · NOBODY ELSE', 0.3, PUR);
  if (has(line, 'In the story this is called')) L1(U, t, 'IN THE STORY · A "STAND"', 0.2, PUR);
  if (left) { cam = { z: 1.4, cx: 640, cy: 560 }; L1(U, t, 'YOU THINK · IT MOVES', 0.2, CY); }
  if (has(line, 'Lesson one', 'strong one', 'next to you')) lesson(U, t, 1, 'THE STRONG ONE IS NEXT TO YOU');
  frame(U, B, cam, ppl, wardrobe, { fxIn: true });
  chrome(U, t, info, D(1, '7:40 AM', ST()));
};
S.noon = (U, t, info, tt, k, n, line) => { const FALL = since('noon', 'clips a tower'), CAUGHT = since('noon', 'catches all'), MGR = since('noon', 'manager watches');
  const fall = k < FALL ? 0 : k >= CAUGHT ? 0 : has(line, 'clips') ? clamp(t / info.dur) * 0.35 : 0.35 + 0.4 * clamp(t / info.dur);
  const B = SP.aisle(tt, { fall, fixed: k >= CAUGHT }); let cam = { z: 1.15, cx: 1000, cy: 560 };
  const catching = has(line, 'catches all', 'Forty tins, back', 'keeps going', 'straightens', 'fly back');
  const hero = P(560, 830, k < FALL ? walk(tt) : has(line, 'leave without') ? walk(tt) : P_STAND, has(line, 'flinch', 'clips') ? 'worried' : catching ? 'open' : 'neutral', { flip: has(line, 'leave without'), look: 0.9 });
  if (has(line, 'leave without')) hero.x = 560 - clamp(t / info.dur) * 300;
  const sp = STAND(hero.x, 830, 360, catching ? { ...P_STAND, aL: [100 + Math.sin(tt * 30) * 25, 20], aR: [110 + Math.cos(tt * 34) * 25, 20] } : P_STAND, tt, { dx: 110, op: k >= FALL ? 0.9 : 0.5 }); hero.pre = withStand(sp);
  let fx = ''; if (catching) fx += SP.streak(sp.hands[1][0], sp.hands[1][1], 1100, 600, 6, PUR) + SP.streak(sp.hands[0][0], sp.hands[0][1], 1000, 700, 5, CY);
  const ppl = [hero];
  if (k >= FALL - 1 && k <= CAUGHT) { fx += SP.trolley(820 + (has(line, 'clips') ? clamp(t / 0.8) * 60 : 60), 830, 0.9); ppl.push(Q(760, 830, { ...P_STAND, aR: [80, 20] }, KID, has(line, 'clips') ? 'worried' : 'neutral', { h: 230 })); }
  if (k >= MGR) ppl.push(Q(1560, 830, has(line, 'manager', 'fly back') ? { ...P_STAND, aL: [60, 120], aR: [60, 120] } : P_STAND, STAFF, 'open', { flip: true }));
  if (has(line, 'noon', 'bread')) L1(U, t, 'PLAN · ACT NORMAL', 0.3);
  if (has(line, 'clips', 'two metres')) { L1(U, t, 'TIN TOWER · 2 m · FALLING', 0.2, COL.red); cam = { z: 1.3, cx: 1050, cy: 520 }; }
  if (has(line, 'catches all')) { cam = { z: 1.5, cx: 950, cy: 560 }; L1(U, t, 'CAUGHT · ALL OF THEM', 0.2, PUR); }
  if (has(line, 'Forty tins, back')) { cam = { z: 1.9, cx: 1100, cy: 640 }; L1(U, t, '40 TINS · LABELS OUT', 0.2, '#4fd06a'); }
  if (has(line, 'straightens', 'pasta')) { cam = { z: 1.2, cx: 1500, cy: 520 }; L1(U, t, 'SHELF NEXT DOOR · ALSO TIDY', 0.2, COL.yellow); fx += SP.streak(sp.hands[1][0], sp.hands[1][1], 1900, 400, 6, PUR); }
  if (has(line, 'manager watches', 'fly back')) { cam = { z: 1.5, cx: 1450, cy: 560 }; L1(U, t, 'MANAGER · SPEECHLESS', 0.2); }
  if (has(line, 'without any bread')) L1(U, t, 'BREAD · 0', 0.3, COL.red);
  if (has(line, 'Lesson two', 'when to stop', 'tell it')) lesson(U, t, 2, 'IT DOESN\'T KNOW WHEN TO STOP');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(1, '12:05 PM', ST()));
};
S.gym = (U, t, info, tt, k, n, line) => { const LIFT = since('gym', 'picks it up'), BEND = since('gym', 'bends'), OWN = since('gym', 'owner walks'), HOME = since('gym', 'You get home');
  if (has(line, 'heaviest deadlifts', 'five hundred', 'and ten kilograms', 'Hafthor', 'twenty twenty-five', 'very edge')) { const kk = clamp(t / 1.0);
    full(U, `<rect width="1920" height="1080" fill="#0e1424"/><text x="960" y="290" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#fff">ONE OF THE HEAVIEST DEADLIFTS EVER RECORDED</text>${barbell(960, 640, 9, 0.15 * kk, 1.1)}<text x="960" y="${f(560 - 30 * kk)}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="150" fill="#ffd23f" opacity="${f(kk)}">~510 kg</text><text x="960" y="840" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="34" fill="#cfd8e0">HAFTHOR BJORNSSON · 2025</text>`);
    CL1(U, t, 'A HUMAN · AT THE VERY EDGE', 0.3, COL.yellow); chrome(U, t, info, D(1, '6:00 PM', ST())); return; }
  if (k >= HOME) { const B = N.flat(tt); const hero = P(900, 840, P_TIRED, 'worried'); const sp = STAND(900, 840, 360, P_STAND, tt, { op: 0.35 }); hero.pre = withStand(sp);
    frame(U, B, { z: 1.6, cx: 900, cy: 560 }, [hero], B.table(760) + `<g opacity="0.8">${[0, 1, 2].map((i) => `<line x1="${860 + i * 30}" y1="560" x2="${870 + i * 30}" y2="575" stroke="#fff" stroke-width="4"/>`).join('')}</g>`, { fxIn: true });
    L1(U, t, has(line, 'everything it does') ? 'WHAT IT DOES · YOU FEEL' : 'HANDS · SHAKING', 0.2, COL.red); chrome(U, t, info, D(1, '9:30 PM', ST(true, 'STAND · TIRED'))); return; }
  const B = SET.gym(tt); let cam = { z: 1.15, cx: 960, cy: 560 };
  const lifted = k >= LIFT, bent = k >= BEND;
  const hero = P(560, 800, has(line, 'cancels') ? P_SHRUG : P_STAND, has(line, 'owner', 'cancels') ? 'worried' : 'neutral', { look: 0.9 });
  const sp = STAND(560, 800, 360, lifted ? { ...P_STAND, aR: [165, 5] } : P_STAND, tt, { dx: 160, op: 0.9 }); hero.pre = withStand(sp);
  let fx = lifted ? barbell(sp.hands[1][0], sp.hands[1][1] - 10, 12, bent ? 1 : 0, 0.8) : barbell(1000, 740, has(line, 'load every plate') ? Math.round(4 + 8 * clamp(t / info.dur)) : 4, 0, 0.9);
  const ppl = [hero];
  if (k >= OWN) ppl.push(Q(1500, 800, has(line, 'cancels') ? { ...P_STAND, aR: [90, 10] } : P_STAND, COACH, has(line, 'owner') ? 'open' : 'neutral', { flip: true }));
  if (has(line, 'empty gym')) L1(U, t, 'GYM · EMPTY · 6 PM', 0.3);
  if (has(line, 'load every plate')) { L1(U, t, 'PLATES · ALL OF THEM', 0.2, COL.yellow); cam = { z: 1.5, cx: 1000, cy: 640 }; }
  if (has(line, 'picks it up')) { cam = { z: 1.3, cx: 800, cy: 420 }; L1(U, t, 'ONE HAND · LIKE A SHOPPING BAG', 0.2, PUR); }
  if (has(line, 'bends')) { cam = { z: 1.8, cx: sp.hands[1][0], cy: sp.hands[1][1] }; L1(U, t, 'THE BAR · BENT', 0.2, COL.red); }
  if (has(line, 'cancels')) { full(U, `<rect width="1920" height="1080" fill="#0e1424"/><rect x="560" y="300" width="800" height="440" rx="30" fill="#f4f1ea"/><text x="620" y="400" font-family="Inter" font-weight="900" font-size="48" fill="#15181e">GYM MEMBERSHIP</text><text x="620" y="470" font-family="IBM Plex Mono" font-weight="800" font-size="32" fill="#5a6070">MEMBER · YOU</text><g transform="rotate(-12 960 600)"><rect x="660" y="540" width="600" height="120" rx="12" fill="none" stroke="#c8352e" stroke-width="10" opacity="${f(clamp((t - 1.2) / 0.3))}"/><text x="960" y="625" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="#c8352e" opacity="${f(clamp((t - 1.2) / 0.3))}">CANCELLED</text></g>`); chrome(U, t, info, D(1, '6:20 PM', ST())); return; }
  if (has(line, 'Lesson three', 'strength is easy', 'down gently')) lesson(U, t, 3, 'PUTTING THINGS DOWN GENTLY');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(1, '6:00 PM', ST()));
};
S.day3 = (U, t, info, tt, k, n, line) => { const BURST = since('day3', 'bag lasts'), SAT = since('day3', 'sit down in it'), DIN = since('day3', 'three dinners');
  if (has(line, 'ORA ORA')) { const sh = Math.sin(tt * 50) * 6; full(U, `<rect width="1920" height="1080" fill="#5a1814"/>${[...Array(26)].map((_, i) => `<circle cx="${f(300 + ((i * 397) % 1320))}" cy="${f(200 + ((i * 251) % 700))}" r="${f(40 + (i % 4) * 14)}" fill="${PUR}" opacity="${f(0.2 + 0.4 * ((Math.floor(tt * 20) + i) % 3 === 0))}"/>`).join('')}`); big(U, `<div style="${TXT(220, '#ffd23f')};transform:translate(${f(sh)}px,0)">ORA ORA ORA</div>`, 160, 380); chrome(U, t, info, D(3, '7:00 PM', ST())); return; }
  if (has(line, "boxers' punches", 'six to eleven')) { const kk = clamp(t / 1.0); full(U, bars("REAL BOXERS' PUNCHES · SPEED", [{ v: 6, t: '~6 m/s', lab: 'SLOWER', c: '#7a7a8a' }, { v: 11, t: '~11 m/s', lab: 'FASTER', c: '#3fb8e0' }], kk, 14)); CL1(U, t, 'REAL STUDIES · GROUP AVERAGES', 0.3, COL.yellow); chrome(U, t, info, D(3, '7:00 PM', ST())); return; }
  if (has(line, 'just as an example', 'twenty punches')) { const kk = clamp(t / 1.4); full(U, `<rect width="1920" height="1080" fill="#0e1424"/><text x="960" y="290" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#fff">JUST AN EXAMPLE · 20 PUNCHES A SECOND</text>${[...Array(20)].map((_, i) => `<circle cx="${380 + (i % 10) * 128}" cy="${470 + Math.floor(i / 10) * 150}" r="48" fill="${i < kk * 20 ? PUR : '#2a3450'}"/>`).join('')}<text x="960" y="860" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="34" fill="#cfd8e0">EVERY SECOND · 20× THE WORK</text>`); CL1(U, t, 'EXAMPLE · NOT FROM THE ANIME', 0.3, COL.yellow); chrome(U, t, info, D(3, '7:00 PM', ST())); return; }
  if (k >= DIN && !has(line, 'Gary') && !has(line, 'Lesson four') && !has(line, 'punch has to be paid')) { const B = N.flat(tt); const hero = P(900, 840, P_SIT, 'open'); const plates = [0, 1, 2].map((i) => `<ellipse cx="${700 + i * 200}" cy="${700}" rx="80" ry="22" fill="#f4f1ea" stroke="${OL}" stroke-width="3"/><ellipse cx="${700 + i * 200}" cy="${694}" rx="44" ry="12" fill="${['#e8a04a', '#e2553f', '#4fd06a'][i]}"/>`).join('');
    frame(U, B, { z: 1.5, cx: 900, cy: 600 }, [hero], B.table(760) + plates, { fxIn: true }); L1(U, t, 'DINNERS TONIGHT · 3', 0.2, COL.yellow); chrome(U, t, info, D(3, '9:00 PM', ST(true, 'STAND · HUNGRY'))); return; }
  const burst = k >= BURST ? (has(line, 'bag lasts') ? clamp((t - 1.2) / 0.8) : 1) : 0;
  const B = SP.boxing(tt, { burst, hit: k < BURST + 1 }); let cam = { z: 1.15, cx: 1000, cy: 560 };
  const hitting = k < SAT && !burst || has(line, 'bag lasts');
  const hero = P(760, 840, k >= SAT ? P_SIT : P_STAND, k >= SAT ? 'worried' : 'neutral', { look: 0.9 });
  const sp = STAND(760, 840, 360, hitting ? { ...P_STAND, aL: [95 + Math.sin(tt * 40) * 12, 10], aR: [95 + Math.cos(tt * 44) * 12, 10] } : P_STAND, tt, { dx: 150, op: 0.9 }); hero.pre = withStand(sp);
  let fx = hitting ? [...Array(5)].map((_, i) => `<circle cx="${f(1110 + ((i * 37 + Math.floor(tt * 20) * 13) % 80) - 40)}" cy="${f(420 + ((i * 53 + Math.floor(tt * 20) * 7) % 220))}" r="34" fill="${PUR}" opacity="0.55"/>`).join('') + SP.streak(sp.hands[1][0], sp.hands[1][1], 1120, 480, 5, PUR) : '';
  if (has(line, 'heavy bag')) L1(U, t, 'TARGET · HEAVY BAG', 0.3);
  if (has(line, 'bag lasts')) L1(U, t, 'THE BAG LASTS · 4 s', 0.2, COL.red);
  if (has(line, 'sand pours', 'hourglass')) { cam = { z: 1.6, cx: 1200, cy: 700 }; L1(U, t, 'SAND · EVERYWHERE', 0.2, COL.yellow); }
  if (has(line, 'starving')) { cam = { z: 1.9, cx: 760, cy: 640 }; L1(U, t, 'HUNGER · STARVING', 0.2, COL.red); }
  if (has(line, 'Gary')) { L1(U, t, 'NEW NAME · "GARY"', 0.2, PUR); L2(U, t, 'REPLY · NONE', 1.4); }
  if (has(line, 'Lesson four', 'paid for')) lesson(U, t, 4, 'YOU PAY FOR EVERY PUNCH');
  frame(U, B, cam, [hero], fx, { fxIn: true });
  chrome(U, t, info, D(3, '7:00 PM', ST()));
};
S.day6 = (U, t, info, tt, k, n, line) => { const DOWN = since('day6', 'slide down'), UP = since('day6', 'come back up'), POL = since('day6', 'police station');
  if (k >= POL && !has(line, 'Lesson five', 'small ones')) { const B = N.interview(tt); const hero = P(760, 840, { ...P_STAND, aR: [80, 20] }, 'neutral', { look: 0.9, extra: (c) => SP.ring(c.hands[1][0] + 10, c.hands[1][1] - 6) });
    frame(U, B, { z: 1.3, cx: 960, cy: 560 }, [hero, Q(1250, 840, P_STAND, { top: '#2a3a6a', bottom: '#22263a', hair: 'short', cap: '#15181e' }, 'neutral', { flip: true })], '', { fxIn: true });
    L1(U, t, has(line, "don't explain") ? 'HOW YOU GOT IT · NO COMMENT' : 'POLICE STATION · LOST RING', 0.2); chrome(U, t, info, D(6, '11:30 PM', ST(false, 'STAND · IN'))); return; }
  const B = N.night(J.street(tt), 900, 420, 0.32); let cam = { z: 1.2, cx: 960, cy: 560 };
  const gx = 1150, gy = 830; const hero = P(860, 800, has(line, 'keys fall') ? { ...P_STAND, aR: [40, 20], head: 20 } : { ...P_STAND, head: 20 }, has(line, 'keys fall') ? 'worried' : 'neutral', { look: 0.9 });
  const reach = k >= DOWN; const sp = STAND(860, 800, 360, reach ? { ...P_STAND, aR: [60, 0], lean: 18 } : P_STAND, tt, { dx: 120, op: 0.85 }); hero.pre = withStand(sp);
  let fx = SP.grate(gx, gy, 1.2);
  if (has(line, 'keys fall')) { const kk = clamp(t / 1.2); fx += SP.keys(gx - 10, 700 + kk * 130, kk * 200); }
  if (reach) { const hx = sp.hands[1][0], hy = sp.hands[1][1], depth = has(line, 'slide down') ? clamp(t / info.dur) : k >= UP ? 1 - clamp(t / info.dur) * 0.9 : 1, ty = gy + 40 * depth;
    fx += `<path d="M ${f(hx)} ${f(hy)} Q ${f((hx + gx) / 2 + 40)} ${f(hy + 20)} ${gx - 12} ${f(ty)}" stroke="#7a6ad8" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M ${f(hx + 8)} ${f(hy + 6)} Q ${f((hx + gx) / 2 + 50)} ${f(hy + 30)} ${gx + 14} ${f(ty)}" stroke="#7a6ad8" stroke-width="14" fill="none" stroke-linecap="round"/>`;
    if (k >= UP) { fx += SP.keys(gx - 20, ty - 10, 30); if (has(line, 'two-euro', 'wedding ring') || k > UP) fx += SP.coin(gx + 30, ty - 20) + SP.ring(gx + 4, ty - 34); } }
  if (has(line, 'keys fall')) L1(U, t, 'KEYS · DOWN THE DRAIN', 0.3, COL.red);
  if (has(line, 'Star Finger', 'stretches two')) { L1(U, t, 'IN THE STORY · STAR FINGER', 0.2, PUR); L2(U, t, '2 FINGERS · STRETCH', 1.0); cam = { z: 1.5, cx: 1000, cy: 560 }; }
  if (has(line, 'chopsticks')) { cam = { z: 1.9, cx: gx, cy: gy - 80 }; L1(U, t, 'LIKE · CHOPSTICKS', 0.2, PUR); }
  if (has(line, 'two-euro', 'wedding ring')) { cam = { z: 2.2, cx: gx, cy: gy - 60 }; L1(U, t, 'FOUND · KEYS + COIN + RING', 0.2, '#4fd06a'); }
  if (has(line, 'Lesson five', 'small ones')) lesson(U, t, 5, 'SMALL TRICKS ARE THE USEFUL ONES');
  frame(U, B, cam, [hero], fx, { fxIn: true });
  chrome(U, t, info, D(6, '11:10 PM', ST()));
};
S.day10 = (U, t, info, tt, k, n, line) => { const VID = since('day10', 'In the video'), CMT = since('day10', 'edited');
  if (k >= VID && k < since('day10', 'Nobody says')) { const views = (0.4 + clamp(t / info.dur) * 2.1).toFixed(1);
    full(U, `<rect width="1920" height="1080" fill="#0e1424"/><rect x="660" y="140" width="600" height="880" rx="40" fill="#15181e" stroke="${OL}" stroke-width="6"/><rect x="690" y="180" width="540" height="360" rx="12" fill="#3a8a4a"/><circle cx="${f(960 + Math.sin(tt * 2) * 2)}" cy="330" r="30" fill="#f4f1ea" stroke="#15181e" stroke-width="4"/><rect x="780" y="380" width="70" height="120" rx="20" fill="${HERO.top}"/><circle cx="815" cy="350" r="34" fill="#0b0b10"/><rect x="1040" y="420" width="110" height="70" rx="20" fill="#3f6db3"/><text x="700" y="590" font-family="Inter" font-weight="900" font-size="34" fill="#fff">BALL STOPS IN MID-AIR?!</text><text x="700" y="640" font-family="IBM Plex Mono" font-weight="800" font-size="28" fill="#9aa3ad">${views}M views</text>${k >= CMT ? ['"it\'s edited"', '"it\'s a GHOST"', '"slow it down"'].map((c, i) => `<rect x="700" y="${680 + i * 76}" width="520" height="60" rx="12" fill="#22283a" opacity="${t > 0.3 + i * 0.4 ? 1 : 0}"/><text x="720" y="${720 + i * 76}" font-family="Inter" font-weight="800" font-size="28" fill="#fff" opacity="${t > 0.3 + i * 0.4 ? 1 : 0}">${c}</text>`).join('') : ''}`);
    CL1(U, t, has(line, 'ghost') ? 'THEORY 2 · A GHOST' : has(line, 'edited') ? 'THEORY 1 · EDITED' : 'THE VIDEO · YOU STAND STILL', 0.3, COL.yellow); chrome(U, t, info, D(10, '4:00 PM', ST())); return; }
  const B = SET.field(tt); let cam = { z: 1.15, cx: 960, cy: 560 };
  const stop = has(line, 'catching his football', 'stops in the air', 'metre from');
  const hero = P(760, 760, P_STAND, 'neutral', { look: 0.9 }); const sp = STAND(760, 760, 360, stop ? { ...P_STAND, aR: [95, 5] } : P_STAND, tt, { dx: 150, op: 0.9 }); hero.pre = withStand(sp);
  let fx = K.pram(1450, 760); const bx = stop ? sp.hands[1][0] + 30 : 300 + (tt * 400) % 900; fx += K.ball(bx, stop ? sp.hands[1][1] : 600, 30, stop ? 0 : tt * 600);
  const ppl = [hero, Q(260, 760, P_PHONE, KID, 'open', { h: 230 })];
  if (has(line, 'films you')) L1(U, t, 'A BOY · FILMING', 0.3);
  if (has(line, 'catching his football')) { L1(U, t, 'FOOTBALL · CAUGHT BEFORE THE PRAM', 0.2, '#4fd06a'); cam = { z: 1.4, cx: 1150, cy: 600 }; }
  if (has(line, 'Nobody says')) L1(U, t, 'NOBODY SAYS · "STAND"', 0.2, PUR);
  if (has(line, 'think it\'s a joke')) L1(U, t, 'THE FEW WHO KNOW · "A JOKE"', 0.2, COL.yellow);
  if (has(line, 'never believe')) lesson(U, t, 6, 'THE ONES WHO\'D UNDERSTAND WON\'T BELIEVE');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(10, '4:00 PM', ST()));
};
S.day15 = (U, t, info, tt, k, n, line) => { const MARK = since('day15', 'marker down');
  const card = (svg, lab) => { full(U, svg); CL1(U, t, lab, 0.3, COL.yellow); chrome(U, t, info, D(15, '11:50 PM', ST())); };
  if (has(line, 'reaction time is', 'quarter of a second', 'hundred and ninety')) { const kk = clamp(t / 1.0);
    return card(`<rect width="1920" height="1080" fill="#0e1424"/><text x="960" y="300" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#fff">HUMAN VISUAL REACTION TIME</text><rect x="360" y="520" width="1200" height="60" rx="30" fill="#2a3450"/><rect x="${f(360 + 1200 * 0.19)}" y="520" width="${f(1200 * 0.095 * kk)}" height="60" rx="30" fill="#ffd23f"/>${[0, 100, 200, 300, 400, 500].map((m) => `<text x="${360 + m * 2.4}" y="640" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="28" fill="#cfd8e0">${m} ms</text>`).join('')}<text x="${f(360 + 1200 * 0.237)}" y="490" text-anchor="middle" font-family="Inter" font-weight="900" font-size="52" fill="#fff" opacity="${f(kk)}">~190–285 ms</text>`, 'ABOUT · A QUARTER OF A SECOND'); }
  if (has(line, 'nine-millimetre', 'fifty to four hundred')) { const kk = clamp(t / 1.0);
    return card(bars('9 mm PISTOL BULLET · AT THE MUZZLE', [{ v: 350, t: '~350 m/s', lab: 'LOW', c: '#7a7a8a' }, { v: 410, t: '~410 m/s', lab: 'HIGH', c: '#e2553f' }], kk, 520), 'REAL NUMBERS · ON A WHITEBOARD'); }
  if (has(line, 'Our own maths', 'three hundred and sixty', 'twenty-eight', 'nine times shorter')) { const kk = clamp(t / 1.0);
    return card(bars('OUR OWN MATHS · 10 m AT 360 m/s', [{ v: 28, t: '≈ 28 ms · BULLET', lab: 'BULLET', c: '#e2553f' }, { v: 250, t: '≈ 250 ms · YOU', lab: 'YOU', c: '#ffd23f' }], kk, 330) + (has(line, 'nine times') ? `<text x="960" y="880" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#fff">≈ 9× SHORTER</text>` : ''), 'OUR CALCULATION'); }
  if (has(line, 'Usain Bolt', 'averaged about ten')) { const kk = clamp(t / 1.0);
    return card(bars('FASTEST HUMAN VS THE NUMBER ON THE BOARD', [{ v: 10, t: '~10 m/s · BOLT', lab: 'BOLT', c: '#4fd06a' }, { v: 360, t: '360 m/s', lab: 'BOARD', c: '#e2553f' }], kk, 470), 'USAIN BOLT · 100 m AVERAGE'); }
  if (has(line, 'Part three', 'stop time, about five')) { const kk = clamp(t / 0.8);
    return card(`<rect width="1920" height="1080" fill="#0c0a24"/><circle cx="960" cy="560" r="240" fill="none" stroke="${PUR}" stroke-width="16"/><path d="M 960 560 L 960 360" stroke="#fff" stroke-width="14" stroke-linecap="round"/><path d="M 960 560 L ${f(960 + 160 * Math.sin(kk * 0.5))} ${f(560 - 160 * Math.cos(kk * 0.5))}" stroke="#fff" stroke-width="10" stroke-linecap="round"/><text x="960" y="900" text-anchor="middle" font-family="Inter" font-weight="900" font-size="70" fill="${PUR}" opacity="${f(kk)}">TIME STOP · ~5 s AT FIRST</text>`, 'IN THE STORY · NEAR THE END OF PART 3'); }
  const B = N.night(N.flat(tt), 900, 420, 0.4); let cam = { z: 1.2, cx: 1000, cy: 540 };
  const lines = ['bullet ≈ 350–410 m/s', '10 m ÷ 360 m/s ≈ 28 ms', 'me ≈ 250 ms', '→ 9× too slow'];
  const wk = Math.min(1, (k - since('day15', 'whiteboard')) / 9 + clamp(t / info.dur) / 9);
  const hero = P(560, 840, k >= MARK ? P_THINK : { ...P_STAND, aR: [120, 40] }, has(line, "You don't have that") ? 'worried' : 'neutral', { look: 0.9 });
  const sp = STAND(560, 840, 360, P_STAND, tt, { dx: -140, op: 0.7 }); hero.pre = withStand(sp);
  const fx = SP.whiteboard(1250, 500, lines, k >= since('day15', 'whiteboard') ? Math.max(0.05, wk) : 0);
  if (has(line, 'catches bullets')) L1(U, t, 'FANS · LOVE THOSE SCENES', 0.3, PUR);
  if (has(line, 'fast enough')) L1(U, t, 'QUESTION · HOW FAST IS ENOUGH?', 0.3, COL.yellow);
  if (has(line, "don't test it", 'whiteboard')) { L1(U, t, 'TEST · NEVER. MATHS ONLY', 0.2, '#4fd06a'); cam = { z: 1.5, cx: 1250, cy: 480 }; }
  if (has(line, "doesn't depend on speed")) L1(U, t, 'ONE THING · NOT ABOUT SPEED', 0.2, PUR);
  if (has(line, "You don't have that")) { cam = { z: 1.9, cx: 560, cy: 560 }; L1(U, t, 'YOU · DON\'T HAVE THAT (YOU THINK)', 0.2); }
  if (has(line, 'Lesson seven', 'fast enough for everything')) lesson(U, t, 7, 'FAST ISN\'T FAST ENOUGH FOR EVERYTHING');
  frame(U, B, cam, [hero], fx, { fxIn: true });
  chrome(U, t, info, D(15, '11:50 PM', ST()));
};
S.day30 = (U, t, info, tt, k, n, line) => { const B = J.cafe(tt); let cam = { z: 1.2, cx: 960, cy: 560 };
  const tray = has(line, 'tray', 'Phones'), tod = has(line, 'toddler');
  const hero = P(760, 830, has(line, 'shoulders', 'edges') ? { ...P_STAND, aL: [30, 30], aR: [30, 30] } : P_STAND, has(line, 'tight', 'never relax', 'shake') ? 'worried' : 'neutral', { look: 0.9 });
  const sp = STAND(760, 830, 360, tray || tod || has(line, 'Cups') ? { ...P_STAND, aR: [100, 10], aL: [80, 20] } : P_STAND, tt, { dx: 150, op: 0.85 }); hero.pre = withStand(sp);
  let fx = ''; if (tray || has(line, 'Cups')) fx += `<g transform="translate(${f(sp.hands[1][0] + 40)} ${f(sp.hands[1][1])})"><rect x="-90" y="-8" width="180" height="14" rx="6" fill="#8a6a4a"/>${[-60, -20, 20, 60].map((x) => SP.glass(x, -8, 0, 0.5)).join('')}</g>`;
  const ppl = [hero];
  if (tod) { fx += `<rect x="1300" y="660" width="400" height="170" fill="#9aa3ad"/>`; ppl.push(Q(sp.hands[1][0] + 30, sp.hands[1][1] + 120, P_STAND, KID, 'open', { h: 180 })); }
  if (has(line, 'friends')) ppl.push(Q(1300, 830, P_SHRUG, MUM, 'neutral', { flip: true }), Q(1480, 830, P_STAND, STAFF, 'neutral', { flip: true }));
  if (has(line, "can't stop catching")) L1(U, t, 'CATCHES TODAY · 11', 0.3, PUR);
  if (tray) L1(U, t, 'TRAY OF GLASSES · CAUGHT', 0.2, '#4fd06a');
  if (tod) { cam = { z: 1.3, cx: 1250, cy: 560 }; L1(U, t, 'TODDLER · CAUGHT', 0.2, '#4fd06a'); }
  if (has(line, 'shoulders')) { cam = { z: 1.9, cx: 760, cy: 560 }; L1(U, t, 'SHOULDERS · ALWAYS TIGHT', 0.2, COL.red); }
  if (has(line, 'edges of every table')) { cam = { z: 1.6, cx: 1000, cy: 700 }; L1(U, t, 'WATCHING · TABLE EDGES', 0.2); }
  if (has(line, 'hands shake')) L1(U, t, 'EVERY EVENING · SHAKING', 0.2, COL.red);
  if (has(line, 'when you can catch', 'responsible')) lesson(U, t, 8, 'CATCH EVERYTHING = RESPONSIBLE FOR EVERYTHING');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(30, '2:00 PM', ST()));
};
S.day40 = (U, t, info, tt, k, n, line) => { const STOP = since('day40', 'world goes silent'), RE = since('day40', 'starts again'), TURN = since('day40', 'both hands'), RUN = since('day40', 'You run'), HIT = since('day40', 'hits the hedge');
  const B = SP.hill(tt); const stopped = k >= STOP && k < RE ? 1 : 0; let cam = { z: 1.0, cx: 960, cy: 520 };
  // van progress down the hill (frozen during the stop), then turned into the hedge
  let p = k < STOP ? Math.min(0.72, 0.15 + (k + clamp(t / info.dur)) * 0.09) : 0.72; let [vx, vy, vr] = SP.vanAt(p);
  if (k >= TURN) { const kk = k > TURN ? 1 : clamp(t / info.dur); vx += kk * 200; vy = vy + (860 - vy) * kk; vr = vr * (1 - kk) - 8 * kk; }
  if (k >= RE) { const kk = k >= HIT ? 1 : clamp(t / info.dur); vx = 1620 + 240 * kk; vy = 860; vr = 0; }
  let fx = SP.van(vx, vy, vr, 0.9) + SP.lollipop(1520, 860);
  for (let i = 0; i < 3; i++) fx += SP.bird(700 + i * 260 + (stopped ? 0 : (tt * 80) % 300), 160 + i * 30, tt, stopped);
  const lady = Q(1500, 860, { ...P_STAND, aR: [140, 10] }, LADY, has(line, 'blinks') ? 'open' : 'neutral', { flip: true });
  const kids = [Q(1700, 860, P_STAND, KID, 'neutral', { h: 200, flip: true }), Q(1790, 860, P_STAND, { ...KID, top: '#e05a8a' }, 'neutral', { h: 190, flip: true })];
  const hx = k < RUN ? 2300 : k < STOP ? 2300 - (k - RUN + clamp(t / info.dur)) * 140 : k >= RE ? 1350 : Math.max(1060, 1900 - (k - STOP + clamp(t / info.dur)) * 330);
  const hero = P(hx, 860, k >= RUN && k < RE ? run(tt * (stopped ? 1 : 1.4)) : has(line, 'step back', 'lungs') ? P_TIRED : P_STAND, stopped ? 'worried' : 'open', { flip: true, look: -0.9, live: true });
  const sp = STAND(hero.x, 860, 360, k >= TURN && k < RE ? { ...P_STAND, aL: [95, 5], aR: [95, 5], lean: 16 } : P_STAND, tt, { dx: -150, op: k >= RUN ? 0.9 : 0.4, flip: true }); hero.pre = withStand(sp);
  const ppl = [hero, lady, ...(k >= RE ? [] : kids)];
  if (has(line, 'delivery van')) { L1(U, t, 'VAN · NOBODY INSIDE', 0.3, COL.red); cam = { z: 1.3, cx: vx + 200, cy: vy - 120 }; }
  if (has(line, 'school crossing', 'lollipop')) { L1(U, t, 'SCHOOL CROSSING · KIDS ON IT', 0.2, COL.red); cam = { z: 1.3, cx: 1600, cy: 640 }; }
  if (has(line, 'not going to make it')) L1(U, t, 'DISTANCE · TOO FAR', 0.2, COL.red);
  if (has(line, 'hold your breath')) { cam = { z: 2.0, cx: hero.x - 40, cy: 560 }; L1(U, t, 'NEVER TRIED · HOLD YOUR BREATH', 0.2, PUR); }
  if (stopped) L2(U, t, 'TIME · STOPPED · ONE BREATH', 0.4, PUR);
  if (has(line, 'like a photograph')) cam = { z: 1.5, cx: vx + 100, cy: vy - 100 };
  if (has(line, 'both hands on the bonnet')) { cam = { z: 1.4, cx: vx + 150, cy: vy - 160 }; L1(U, t, 'TURN IT · TOWARD THE HEDGE', 0.2, PUR); }
  if (has(line, 'lungs burn')) { cam = { z: 1.9, cx: hero.x, cy: 560 }; L1(U, t, 'BREATH · ALMOST GONE', 0.2, COL.red); }
  if (has(line, 'hits the hedge', 'Nobody is hurt')) { L1(U, t, 'NOBODY · HURT', 0.2, '#4fd06a'); cam = { z: 1.2, cx: 1700, cy: 640 }; }
  if (has(line, 'blinks')) cam = { z: 1.8, cx: 1500, cy: 600 };
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: stopped });
  chrome(U, t, info, D(40, '3:10 PM', stopped ? ST(true, 'TIME · STOPPED') : ST()));
};
S.day41 = (U, t, info, tt, k, n, line) => { const B = N.flat(tt); let cam = { z: 1.3, cx: 900, cy: 600 };
  const hero = P(900, 840, P_SIT, has(line, 'tired', "can't lift") ? 'worried' : 'neutral'); const sp = STAND(900, 840, 360, P_STAND, tt, { op: 0.9, dx: -60, dy: -60 }); hero.pre = withStand(sp);
  let fx = B.table(760) + (has(line, "can't lift", 'shaking') ? `<g>${[0, 1, 2].map((i) => `<line x1="${860 + i * 30}" y1="620" x2="${872 + i * 30}" y2="636" stroke="#fff" stroke-width="4"/>`).join('')}</g>` : '');
  if (has(line, "can't lift")) L1(U, t, 'HANDS · WON\'T LIFT', 0.2, COL.red);
  if (has(line, 'until lunch')) L1(U, t, 'SHAKING · UNTIL 12:00', 0.2, COL.red);
  if (has(line, 'second body', 'never gets tired')) { L1(U, t, 'IT · NEVER TIRED', 0.2, PUR); L2(U, t, 'YOU · ALWAYS TIRED', 1.2, COL.red); cam = { z: 1.6, cx: 860, cy: 480 }; }
  if (has(line, 'Lesson nine', 'strongest thing', 'most tired')) lesson(U, t, 9, 'THE STRONGEST IS THE MOST TIRED');
  frame(U, B, cam, [hero], fx, { fxIn: true });
  chrome(U, t, info, D(41, '8:00 AM', ST(true, 'STAND · OUT')));
};
S.ending = (U, t, info, tt, k, n, line) => { const B = SET.bedroom(tt, { time: 'dawn' }); const FL = 820, CAUGHT = since('ending', 'catches it anyway'), MISS = since('ending', 'reach first');
  const fallK = k >= CAUGHT ? -0.0 : has(line, 'slides') ? clamp(t / info.dur) * 0.5 : k >= MISS ? 0.5 + 0.4 * clamp(t / info.dur) : 0;
  const hero = P(760, FL, k >= MISS && k < CAUGHT ? { ...P_SIT, aR: [70, 10], lean: 14 } : P_SIT, k >= CAUGHT ? 'smile' : k >= MISS ? 'open' : 'neutral', { look: 0.9 });
  const sp = STAND(760, FL, 360, k >= CAUGHT ? { ...P_STAND, aR: [80, 30] } : P_STAND, tt, { op: k >= CAUGHT ? 0.9 : 0.15, dx: 60, dy: -110, s: 1.15 }); hero.pre = withStand(sp);
  const fx = k >= CAUGHT ? SP.nightstand(1180, FL, '7:12', -1) + SP.glass(sp.hands[1][0] + 10, sp.hands[1][1] + 30) : SP.nightstand(1180, FL, '7:12', fallK);
  let cam = has(line, 'slides', 'reach first') ? { z: 1.7, cx: 1100, cy: 620 } : { z: 1.2, cx: 960, cy: 560 };
  frame(U, B, cam, [hero], fx, { fxIn: true });
  if (k >= since('ending', 'woke up tomorrow')) { U.svg('card', `<rect width="1920" height="1080" fill="#000" opacity="0.4"/>`, {}, { z: 3 });
    const q = has(line, 'comments') ? "What's the first thing you'd catch?" : has(line, 'keep it') ? 'Keep it, or give it back?' : 'Star Platinum. Tomorrow. Yours.';
    big(U, `<div style="${TXT(84)};text-shadow:0 8px 0 #000;max-width:1100px">${q}</div>`, 160, 320); }
  else if (has(line, 'seven twelve')) L1(U, t, 'NEXT MORNING · 7:12', 0.2);
  chrome(U, t, info, k >= since('ending', 'woke up tomorrow') ? { day: null, time: null, status: { text: 'YOUR TURN', on: true, color: COL.yellow } } : D(42, '7:12 AM', ST()));
};

const BG = { open: '#6a5a9a', am740: '#f2d58a', noon: '#e8eef2', gym: '#3a2a4a', day3: '#3a2430', day6: '#0c1424', day10: '#ff9a8a', day15: '#2a2650', day30: '#6a3a3a', day40: '#5a9ae8', day41: '#8a9ac8', ending: '#6a5a9a' };
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line), p.sec, p.line);
