// "What If You Had the Death Note in Real Life?" — flat 2D (approved pilot look). Shots come from PLAN (story sections);
// each section draws by keywords in the narration line. The hero never writes a name; deaths are only ever reported
// (TV, charts, numbers), never shown. The notebook is our own plain design; the shinigami is a faceless silhouette.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_STAND, P_THINK, P_TIRED, P_HIPS, P_SHRUG, P_PHONE, P_SIT } from '../lib/people.js';
import { hud, label, caption, COL, MONO } from '../lib/hud.js';
import { frame } from '../lib/flat2d.js';
import * as SET from '../lib/sets/saitama2d.js';
import * as J from '../lib/sets/jojo2d.js';
import * as N from '../lib/sets/dn2d.js';
import { square } from '../lib/sets/square.js';
import { PLAN } from './plan.js';

const f = (n) => n.toFixed(1);
const OL = '#b9dcff';
const HERO = { top: '#3f6db3', bottom: '#2a2d3a', hood: true, hair: 'short', broad: true };
const FRIEND = { top: '#e0723a', bottom: '#2a2d3a', hair: 'curly' };
const DET = { top: '#6a6a72', bottom: '#2a2d3a', hair: 'short' };
const TITLE = 'WHAT IF YOU HAD THE DEATH NOTE?';
const ST = { closed: { text: 'NOTEBOOK · CLOSED', on: false }, open: { text: 'NOTEBOOK · OPEN', on: true, color: COL.red }, names: (n) => ({ text: `NAMES WRITTEN · ${n}`, on: true, color: '#4fd06a' }) };
const chrome = (U, t, info, d) => { hud(U, { title: TITLE, ...d }); caption(U, info, t); };
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, 1180, 260, c ? { color: c } : {});
const L2 = (U, t, txt, t0 = 1.0, c) => label(U, 'L2', txt, t0, t, 1180, 350, c ? { color: c } : {});
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre, shadow: o.shadow });
const Q = (x, y, pose, outfit, face = 'neutral', o = {}) => ({ x, y, h: o.h || 340, pose, outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const D = (day, time, status = ST.closed) => ({ day, time, status });
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
const full = (U, svg) => U.svg('card', svg, {}, { z: 3 });
const SHOT = (id, bg, body) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { U.svg('fx', '', {}); U.svg('card', '', {}); U.html('big', '', {}); body(U, t, info, info.start + t); } });
const holdBook = (c, open = false) => N.notebook(c.hands[1][0] + 10, c.hands[1][1] - 10, open ? 0.5 : 0.36, { open, rot: open ? 0 : -8 });
const crowd = (n, x0, y, faces = 'neutral') => Array.from({ length: n }, (_, i) => Q(x0 + i * 170 + (i % 2) * 20, y + (i % 3) * 12, i % 3 === 1 ? { ...P_PHONE, aR: [62, 92] } : P_STAND, { top: ['#e0723a', '#9a5cc0', '#2f9a8e', '#4a6fb5', '#c9a03a', '#e05a8a'][i % 6], bottom: '#22263a', hair: ['ponytail', 'curly', undefined, 'short'][i % 4], cap: i % 4 === 2 ? '#3f6db3' : undefined }, faces, { flip: i % 2 === 0, h: 320 }));
const CL1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, 1180, 170, c ? { color: c } : {});
const CL2 = (U, t, txt, t0 = 1.0, c) => label(U, 'L2', txt, t0, t, 1180, 230, c ? { color: c } : {});
const rule = (U, t, n, txt) => L1(U, t, `RULE ${n} · ${txt}`, 0.2, COL.yellow);

const S = {};
S.open = (U, t, info, tt, k, n, line) => { const B = N.laundromat(tt, { book: k < 2 });
  let ppl, cam = { z: 1.1, cx: 900, cy: 560 }, fx = '';
  if (has(line, 'eleven', 'last person')) { ppl = [P(500, 880, { ...P_STAND, aR: [40, 40] }, 'neutral', { extra: (c) => `<rect x="${f(c.hands[1][0] - 40)}" y="${f(c.hands[1][1])}" width="80" height="60" rx="10" fill="#e8eef4" stroke="${OL}" stroke-width="3"/>` })]; L1(U, t, '11:00 PM · LAUNDROMAT', 0.3); }
  else if (has(line, 'lost-and-found', 'black notebook', 'two words', 'Death Note')) { ppl = [P(1000, 880, P_STAND, 'open', { look: 0.8 })]; cam = { z: 1.9, cx: 1240, cy: 480 }; if (!has(line, 'lost-and-found')) fx = N.notebook(1280, 470, 0.9, { rot: -4 }); }
  else if (has(line, 'Inside', 'first page', 'first one', 'shall die')) { ppl = [P(900, 880, P_STAND, 'neutral', { extra: (c) => holdBook(c, true) })]; cam = { z: 1.7, cx: 960, cy: 600 }; if (has(line, 'shall die')) L1(U, t, 'RULE PAGE · 1', 0.2, COL.red); }
  else if (has(line, 'laugh', 'rest', 'stop laughing')) { const stop = has(line, 'stop laughing'); ppl = [P(900, 880, { ...P_STAND, head: stop ? 8 : Math.sin(tt * 10) * 5 }, stop ? 'worried' : 'smile', { extra: (c) => holdBook(c, true) })]; cam = { z: stop ? 2.1 : 1.5, cx: 920, cy: 560 }; }
  else if (has(line, 'shinigami', 'gods of death')) { full(U, `<rect width="1920" height="1080" fill="#0a0a14"/>` + N.shinigami(960, 1000, 700, tt)); L1(U, t, 'IN THE STORY · SHINIGAMI', 0.3, COL.red); ppl = []; }
  else if (has(line, 'Light', 'high-school')) { ppl = [Q(960, 880, P_STAND, { top: '#e8e2d0', bottom: '#2a2d3a', hair: 'short' }, 'neutral')]; L1(U, t, 'LIGHT · FICTION', 0.3, COL.yellow); cam = { z: 1.5, cx: 960, cy: 600 }; }
  else { ppl = [P(900, 880, has(line, 'choice') ? P_THINK : P_STAND, 'neutral', { extra: (c) => holdBook(c) })]; cam = { z: 1.4, cx: 900, cy: 580 }; if (has(line, "not Light")) L1(U, t, 'YOU · NOT LIGHT', 0.3); if (has(line, 'choice')) L1(U, t, 'EVERY DAY · A CHOICE', 0.3, COL.yellow); }
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(0, '11:04 PM'));
};
S.day1 = (U, t, info, tt, k, n, line) => { const B = N.night(J.kitchen(tt), 900, 500, 0.5); let cam = { z: 1.5, cx: 900, cy: 600 }, fx = N.notebook(1000, 700, 0.6, { open: true }) , ppl = [P(640, 860, P_THINK, 'neutral')];
  if (has(line, 'heart attack', 'forty seconds')) { L1(U, t, 'NAME ONLY · 40 s', 0.2, COL.red); L2(U, t, 'LORE · SECONDARY SOURCES', 1.2); }
  else if (has(line, 'cause', 'six minutes')) { L1(U, t, 'CAUSE WRITTEN · 6 MIN 40 s', 0.2, COL.red); }
  else if (has(line, 'face', 'picture')) { L1(U, t, 'NEEDS · NAME + FACE', 0.2, COL.yellow); cam = { z: 1.9, cx: 900, cy: 560 }; }
  else if (has(line, 'close the notebook', "don't write")) { fx = N.notebook(1000, 700, 0.6); ppl = [P(640, 860, P_HIPS, 'neutral')]; L1(U, t, 'NAMES WRITTEN · 0', 0.2, '#4fd06a'); }
  else if (has(line, 'Rule one')) { fx = N.notebook(1000, 700, 0.6); rule(U, t, 1, 'NAME + FACE'); }
  else L1(U, t, '2:00 AM · READING', 0.3);
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(1, '2:00 AM', ST.names(0)));
};
S.day2 = (U, t, info, tt, k, n, line) => { const B = J.cafe(tt); let cam = { z: 1.3, cx: 960, cy: 600 }, fx = '';
  const bag = `<g transform="translate(560 800)"><rect x="-60" y="-50" width="120" height="90" rx="14" fill="#5a4a3a" stroke="${OL}" stroke-width="3"/><path d="M -40 -50 q 40 -50 80 0" stroke="#5a4a3a" stroke-width="10" fill="none"/></g>`;
  const waiter = Q(1300, 860, { ...P_STAND, aR: [70, 60] }, { top: '#f4f1ea', bottom: '#2a2d3a', hair: 'ponytail' }, has(line, 'rude') ? 'worried' : 'smile', { flip: true });
  const rude = Q(1560, 860, { ...P_STAND, aL: [70, 120] }, { top: '#9a5cc0', bottom: '#22263a', hair: 'short' }, 'angry', { flip: true });
  let ppl = [P(760, 860, P_STAND, 'neutral', { look: 0.8 }), waiter];
  if (has(line, 'how do you know', 'same question')) { big(U, `<div style="${TXT(90)};text-shadow:0 8px 0 #000;max-width:1000px">How do you know it's real?</div>`, 160, 300); }
  else if (has(line, 'manga', 'tests it')) { L1(U, t, 'LIGHT · TESTS IT', 0.2, COL.red); L2(U, t, 'YOU · DON\'T', 1.0, '#4fd06a'); }
  else if (has(line, 'rude', 'weight')) { ppl.push(rude); fx = bag + N.notebook(560, 770, 0.25); cam = { z: 1.2, cx: 1100, cy: 600 }; L1(U, t, 'IN YOUR BAG · THE NOTEBOOK', 0.4); }
  else if (has(line, "isn't in any rule", 'change you', 'changes how')) { ppl = [P(760, 860, P_THINK, 'worried')]; cam = { z: 1.8, cx: 780, cy: 560 }; }
  else if (has(line, 'Rule two')) { rule(U, t, 2, 'THE IDEA OF IT'); }
  fx = fx || bag;
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(2, '1:15 PM', ST.names(0)));
};
S.day5 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'news', 'strange', 'Three men', 'coincidence', 'trial')) { full(U, N.newsTV(tt, has(line, 'coincidence') ? '"A COINCIDENCE"' : 'THREE DEATHS, ONE AFTERNOON', 'All three were on trial · police say no link yet', { scene: `<g opacity="0.9">${[0, 1, 2].map((i) => `<rect x="${430 + i * 380}" y="260" width="300" height="330" rx="16" fill="#2a3450"/><circle cx="${580 + i * 380}" cy="380" r="70" fill="#4a5a7a"/><rect x="${490 + i * 380}" y="470" width="180" height="90" rx="40" fill="#4a5a7a"/>`).join('')}</g>` }));
    chrome(U, t, info, D(5, '7:00 PM', ST.names(0))); return; }
  const B = N.night(SET.bedroom(tt, { time: 'night' }), 1200, 560, 0.45); let ppl = [P(800, 860, P_STAND, has(line, 'another') ? 'worried' : 'neutral', { look: 0.9 })], fx = N.notebook(1180, 760, 0.4), cam = { z: 1.5, cx: 900, cy: 600 };
  if (has(line, 'closed', "didn't write")) L1(U, t, 'NAMES WRITTEN · 0', 0.2, '#4fd06a');
  if (has(line, 'another one')) { cam = { z: 2.1, cx: 820, cy: 520 }; L1(U, t, 'NOTEBOOKS · 2', 0.3, COL.red); }
  if (has(line, 'Rule three')) rule(U, t, 3, 'NOT THE ONLY ONE');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(5, '7:05 PM', ST.names(0)));
};
S.day9 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'twenty-one', 'Shipman', '215', '250', 'alarm', 'unusually', 'statisticians', 'death rates', 'confession', 'other doctors')) {
    const title = has(line, 'twenty-one') ? 'HEART ATTACKS · PEOPLE ON THE NEWS' : has(line, 'statisticians', 'watching') ? 'WATCHING THE DEATH RATE' : 'ONE DOCTOR\'S PATIENTS · DEATHS';
    full(U, N.chartCard(clamp(t / Math.max(1, info.dur * 0.8)), title, { normal: has(line, 'twenty-one') ? 'USUAL' : 'EXPECTED' }));
    if (has(line, 'twenty-one')) CL1(U, t, 'DAY 9 · 21 DEATHS', 0.2, COL.red);
    if (has(line, 'Shipman')) CL1(U, t, 'REAL CASE · HAROLD SHIPMAN (UK)', 0.2, COL.yellow);
    if (has(line, '215')) { CL1(U, t, 'INQUIRY · 215 VICTIMS', 0.2, COL.red); }
    if (has(line, '250')) CL2(U, t, 'LATER ESTIMATE · ~250', 0.6, COL.red);
    if (has(line, 'other doctors', 'unusually')) CL1(U, t, 'ALARM · OTHER DOCTORS NOTICED', 0.2, '#4fd06a');
    if (has(line, 'statisticians', 'years earlier')) CL1(U, t, 'MONITORING · YEARS EARLIER', 0.2, '#4fd06a');
    chrome(U, t, info, D(9, '10:20 AM', ST.names(0))); return; }
  const B = SET.lobby(tt, { sign: 'CITY HOSPITAL' }); let ppl = [P(760, 840, has(line, 'Rule four') ? P_HIPS : P_THINK, 'neutral')], cam = { z: 1.3, cx: 960, cy: 560 };
  if (has(line, 'Someone', 'about to start')) { ppl.push(Q(1300, 840, P_PHONE, DET, 'neutral', { flip: true })); L1(U, t, 'SOMEONE · IS WATCHING', 0.3, COL.red); }
  if (has(line, 'Rule four')) rule(U, t, 4, 'A PATTERN IS EVIDENCE');
  frame(U, B, cam, ppl, '', { fxIn: true });
  chrome(U, t, info, D(9, '10:40 AM', ST.names(0)));
};
S.day14 = (U, t, info, tt, k, n, line) => {
  if (has(line, '95', '52', 'Japan', 'United States', 'counted')) { const jp = has(line, 'Japan', '95'), us = has(line, '52', 'United States');
    const bar = (x, v, c, lab, on) => `<rect x="${x}" y="${820 - v * 4.4}" width="260" height="${v * 4.4}" fill="${c}" opacity="${on ? 1 : 0.25}"/><text x="${x + 130}" y="${800 - v * 4.4}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#fff" opacity="${on ? 1 : 0.3}">~${v}%</text><text x="${x + 130}" y="870" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="30" fill="#cfd8e0">${lab}</text>`;
    full(U, `<rect width="1920" height="1080" fill="#0e1424"/><text x="960" y="250" text-anchor="middle" font-family="Inter" font-weight="900" font-size="56" fill="#fff">MURDERS SOLVED</text>` + bar(620, 95, '#4fa06a', 'JAPAN · STUDY', jp || has(line, 'counted')) + bar(1040, 52, '#c8352e', 'USA · 2023', us || has(line, 'counted')));
    if (has(line, 'counted', 'ignore')) CL1(U, t, 'NOT COUNTED THE SAME WAY', 0.3, COL.yellow);
    chrome(U, t, info, D(14, '6:00 PM', ST.names(0))); return; }
  let B, ppl, cam = { z: 1.0, cx: 960, cy: 560 }, fx = '';
  if (has(line, 'press conference', 'detective explains', 'series', 'who died', 'faces')) { B = SET.lobby(tt, { sign: 'POLICE', wall: true }); ppl = [Q(960, 840, { ...P_STAND, aR: [60, 70] }, DET, 'neutral', { h: 380 }), ...crowd(4, 260, 900).map((p, i) => ({ ...p, x: [260, 520, 1400, 1660][i] }))]; cam = { z: 1.2, cx: 960, cy: 580 };
    fx = `<path d="M 850 640 L 1070 640 L 1050 840 L 870 840 Z" fill="#2a3a6a" stroke="${OL}" stroke-width="4"/><circle cx="960" cy="720" r="40" fill="#f4f6f8" opacity="0.85"/><path d="M 960 690 l 26 46 l -52 0 Z" fill="#2a3a6a"/><rect x="954" y="590" width="12" height="50" fill="#15181e"/><circle cx="960" cy="586" r="12" fill="#15181e"/>`;
    L1(U, t, has(line, 'faces') ? 'POLICE · WHO KNEW THEIR FACES?' : 'POLICE · "A SERIES"', 0.3, COL.red); }
  else { B = square(tt); ppl = crowd(8, -100, 880, has(line, 'scared') ? 'worried' : has(line, 'cheering') ? 'smile' : 'neutral');
    if (has(line, 'cheering', 'scares you')) { ppl = [...ppl, P(1700, 900, P_STAND, 'worried', { flip: true })]; L1(U, t, 'SOME PEOPLE · CHEERING', 0.3, COL.red); }
    if (has(line, 'talking', 'whole city')) L1(U, t, '#HEARTATTACKS · TRENDING', 0.3, COL.yellow);
    if (has(line, 'Rule five')) rule(U, t, 5, 'THE MORE IT\'S USED, THE LOUDER'); }
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(14, '6:00 PM', ST.names(0)));
};
S.day17 = (U, t, info, tt, k, n, line) => { const B = N.flat(tt); let cam = { z: 1.3, cx: 900, cy: 600 }, fx = B.table(760);
  const cups = (c) => `<rect x="${f(c.hands[0][0] - 14)}" y="${f(c.hands[0][1] - 20)}" width="28" height="36" rx="4" fill="#f4f1ea"/><rect x="${f(c.hands[1][0] - 14)}" y="${f(c.hands[1][1] - 20)}" width="28" height="36" rx="4" fill="#f4f1ea"/>`;
  const friendHolds = has(line, 'holding', 'laughing', 'joke', 'flick', 'spooky');
  const fr = Q(420, 830, friendHolds ? { ...P_SIT, aR: [70, 60] } : P_SIT, FRIEND, has(line, 'stop laughing', 'seriously') ? 'worried' : friendHolds ? 'smile' : 'neutral', { extra: friendHolds ? (c) => N.notebook(c.hands[1][0] + 20, c.hands[1][1] - 10, 0.36, { open: has(line, 'flick'), rot: -6 }) : undefined });
  let hero = P(1300, 860, has(line, 'two coffees', 'walk back') ? walk(tt) : has(line, 'take it back') ? { ...P_STAND, aR: [80, 60] } : P_STAND, has(line, 'lie', 'cost') ? 'worried' : 'neutral', { flip: true, extra: has(line, 'two coffees', 'walk back') ? cups : has(line, 'take it back') ? (c) => holdBook(c) : undefined });
  let ppl = [fr, hero];
  if (!friendHolds && !has(line, 'take it back')) fx += N.notebook(760, 735, 0.3, { rot: 80 });
  if (has(line, 'Is this a joke')) L1(U, t, '"IS THIS A JOKE?"', 0.2);
  if (has(line, 'prop')) L1(U, t, '"A PROP FROM A PARTY"', 0.2, COL.yellow);
  if (has(line, 'lie to your best friend')) { L1(U, t, 'FIRST LIE · TO YOUR BEST FRIEND', 0.2, COL.red); cam = { z: 1.9, cx: 1260, cy: 540 }; }
  if (has(line, 'cost you something')) { ppl = [P(900, 860, P_TIRED, 'worried')]; B.back += ''; L1(U, t, 'COST SO FAR · A FRIENDSHIP CRACK', 0.2, COL.red); }
  frame(U, has(line, 'That night', 'cost you') ? N.night(B, 900, 500, 0.5) : B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(17, has(line, 'night') ? '11:40 PM' : '4:30 PM', ST.names(0)));
};
S.day20 = (U, t, info, tt, k, n, line) => { const B = N.night(SET.bedroom(tt, { time: 'night' }), 600, 500, 0.62); let cam = { z: 1.2, cx: 960, cy: 560 }, fx = N.shinigami(1500, 860, 640, tt);
  let ppl = [P(700, 860, has(line, 'all night') ? P_THINK : P_STAND, has(line, 'say no') ? 'neutral' : 'worried', { look: 0.9 })];
  if (has(line, 'Tall', 'Thin', 'eyes glow', 'corner')) cam = { z: 1.6, cx: 1400, cy: 520 };
  if (has(line, 'shinigami eyes', 'offer')) L1(U, t, 'OFFER · SHINIGAMI EYES', 0.2, COL.red);
  if (has(line, 'name just by looking', 'who the other owner')) { L1(U, t, 'SEE ANY NAME · BY THEIR FACE', 0.2, COL.yellow); }
  if (has(line, 'price', 'half of the life')) { L1(U, t, 'PRICE · HALF YOUR REMAINING LIFE', 0.2, COL.red); cam = { z: 2.0, cx: 1500, cy: 360 }; }
  if (has(line, 'again', 'halves')) { L1(U, t, '½ → ¼ → ⅛', 0.2, COL.red); L2(U, t, 'IN THE STORY', 1.0); }
  if (has(line, 'say no')) L1(U, t, 'OFFER · REFUSED', 0.2, '#4fd06a');
  if (has(line, 'Rule six')) rule(U, t, 6, 'SHORTCUTS COST MORE');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(20, '3:13 AM', ST.names(0)));
};
S.day23 = (U, t, info, tt, k, n, line) => { const B = N.night(J.kitchen(tt), 900, 500, 0.5); let cam = { z: 2.0, cx: 960, cy: 620 }, ppl = [P(640, 860, { ...P_STAND, aR: [70, 60] }, has(line, 'heart stops') ? 'worried' : 'neutral')];
  const fake = has(line, 'thirteen', 'heart stops', 'Then you remember', 'fake', 'Light wrote', 'same thing', 'scare');
  let fx = N.notebook(1000, 700, 0.9, { open: true, text: fake ? '13 DAYS|WITHOUT A NAME|= THE OWNER|DIES' : '' });
  if (has(line, 'thirteen')) L1(U, t, 'NEW RULE? · 13 DAYS', 0.2, COL.red);
  if (has(line, 'fake', 'Light wrote', 'remember')) { L1(U, t, 'IN THE STORY · A FAKE RULE', 0.2, '#4fd06a'); }
  if (has(line, 'persuasive', 'almost fell')) { L1(U, t, 'DEADLY · AND PERSUASIVE', 0.2, COL.red); cam = { z: 1.4, cx: 860, cy: 560 }; }
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(23, '1:30 AM', ST.names(0)));
};
S.day26 = (U, t, info, tt, k, n, line) => { const B = N.interview(tt); let cam = { z: 1.3, cx: 960, cy: 600 }, fx = '';
  const det = Q(1340, 860, has(line, 'slide a card') ? { ...P_STAND, aL: [80, 60] } : has(line, 'smile') ? P_STAND : { ...P_STAND, aR: [40, 90] }, DET, has(line, 'smile', 'call me first') ? 'smile' : 'neutral', { flip: true, look: -0.7 });
  let ppl = [P(620, 860, has(line, 'heart pounding') ? walk(tt) : P_STAND, has(line, 'pounding', 'might include you') ? 'worried' : 'neutral'), det];
  if (has(line, 'folder', 'printouts')) { fx = [0, 1, 2, 3].map((i) => `<rect x="${900 + i * 50}" y="${612 - i * 3}" width="90" height="110" fill="#f4f1ea" stroke="#9aa3ad" stroke-width="2" transform="rotate(${i * 4 - 6} ${940 + i * 50} 660)"/>`).join(''); L1(U, t, 'EVERY DEATH · EVERY DATE', 0.3); }
  if (has(line, 'How did you know')) { L1(U, t, '"HOW DID YOU KNOW SO MUCH?"', 0.2, COL.red); cam = { z: 1.8, cx: 760, cy: 540 }; }
  if (has(line, 'slide a card', 'call me first')) fx += `<rect x="960" y="630" width="90" height="50" rx="4" fill="#ffffff" stroke="${OL}" stroke-width="2"/>`;
  if (has(line, 'watching the pattern', 'might include you')) { L1(U, t, 'THE PATTERN · COULD INCLUDE YOU', 0.2, COL.red); cam = { z: 1.9, cx: 1300, cy: 520 }; }
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(26, '2:00 PM', ST.names(0)));
};
S.day30 = (U, t, info, tt, k, n, line) => { const lights = has(line, 'lights come on') ? clamp(t / info.dur) : has(line, 'close the notebook', 'downstairs', 'call', 'except') ? 1 : 0.15;
  const B = N.rooftop(tt, { lights }); let cam = { z: 1.3, cx: 900, cy: 620 }, open = has(line, 'pen', 'forty seconds', 'lights', 'moment you write');
  const phone = (c) => `<rect x="${f(c.hands[1][0] - 22)}" y="${f(c.hands[1][1] - 40)}" width="44" height="80" rx="8" fill="#15181e" stroke="${OL}" stroke-width="3"/><rect x="${f(c.hands[1][0] - 16)}" y="${f(c.hands[1][1] - 32)}" width="32" height="62" rx="4" fill="#8fd0ff"/><circle cx="${f(c.hands[1][0])}" cy="${f(c.hands[1][1] - 6)}" r="10" fill="#4a5a7a"/>`;
  const crate = () => `<rect x="760" y="790" width="290" height="110" rx="6" fill="#b07a44" stroke="#3a2410" stroke-width="4"/><path d="M 760 845 L 1050 845 M 820 790 L 820 900 M 990 790 L 990 900" stroke="#7a4e24" stroke-width="5"/>`;
  let ppl = [P(900, 900, has(line, 'phone', 'photo', 'face') ? P_PHONE : open ? { ...P_SIT, aR: [40, 60] } : P_STAND, has(line, 'exactly the thing') ? 'worried' : 'neutral', { extra: has(line, 'phone', 'photo', 'face') ? phone : open ? (c) => holdBook(c, true) : undefined })];
  if (has(line, 'someone you know')) L1(U, t, 'THE OTHER OWNER · SOMEONE YOU KNOW', 0.2, COL.red);
  if (has(line, 'name', 'face')) L2(U, t, 'NAME ✓  FACE ✓', 1.0, COL.red);
  if (has(line, 'forty seconds')) { L1(U, t, '40 SECONDS', 0.2, COL.red); cam = { z: 1.6, cx: 900, cy: 660 }; }
  if (has(line, 'exactly the thing')) L1(U, t, 'YOU · WOULD BECOME THEM', 0.2, COL.red);
  if (has(line, 'close the notebook')) L1(U, t, 'NAMES WRITTEN · 0', 0.2, '#4fd06a');
  if (has(line, 'call the number', 'detective everything')) { ppl = [P(900, 900, P_PHONE, 'neutral')]; L1(U, t, 'CALL · THE DETECTIVE', 0.2, '#4fd06a'); }
  if (has(line, 'except one thing', 'notebook too')) L1(U, t, 'KEPT SECRET · YOUR NOTEBOOK', 0.2, COL.yellow);
  if (has(line, 'lights come on')) cam = { z: 0.9, cx: 960, cy: 560 };
  if (open && !has(line, 'phone', 'photo', 'face')) B.mid += crate();
  frame(U, B, cam, ppl, '', { fxIn: true });
  chrome(U, t, info, D(30, '6:50 PM', open ? ST.open : ST.names(0)));
};
S.day31 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'drawer', 'Unopened')) { const B = N.night(SET.bedroom(tt, { time: 'night' }), 900, 600, 0.5); const shut = has(line, 'Unopened') ? clamp(t / 1.2) : 0;
    const fx = `<rect x="700" y="640" width="520" height="200" fill="#8a6a4a" stroke="${OL}" stroke-width="4"/><rect x="${f(720)}" y="${f(660 + shut * 0)}" width="480" height="${f(120 - shut * 100)}" fill="#3a2a20"/>` + (shut < 0.8 ? N.notebook(960, 720, 0.3, { rot: 90 }) : '') + `<rect x="${f(720 - (1 - shut) * 0)}" y="${f(660 + 120 - (1 - shut) * 0)}" width="480" height="40" rx="6" fill="#a8885a"/>`;
    frame(U, B, { z: 1.6, cx: 960, cy: 680 }, [], fx, { fxIn: true }); L1(U, t, 'IN A DRAWER · UNOPENED', 0.3, '#4fd06a'); chrome(U, t, info, D(31, '1:10 AM', ST.names(0))); return; }
  const B = N.laundromat(tt, { book: false }); let cam = { z: 1.5, cx: 1140, cy: 540 };
  let ppl = [P(1050, 880, has(line, 'hold it over', "can't let go", 'next might') ? { ...P_STAND, aR: [100, 40] } : P_STAND, has(line, "can't let go", 'next might') ? 'worried' : 'neutral', { extra: (c) => holdBook(c) })];
  if (has(line, 'real cost', 'Not half', 'every single day', 'decides not')) { cam = { z: 1.9, cx: 1000, cy: 520 }; if (has(line, 'Not half')) { L1(U, t, 'HALF YOUR LIFE · ✕', 0.2); L2(U, t, '40 SECONDS · ✕', 0.8); } if (has(line, 'decides not', 'every single day')) L1(U, t, 'THE COST · DECIDING, EVERY DAY', 0.2, COL.red); }
  if (has(line, 'next might not close')) L1(U, t, 'NEXT OWNER · ?', 0.2, COL.red);
  frame(U, B, cam, ppl, '', { fxIn: true });
  chrome(U, t, info, D(31, '11:00 PM', ST.names(0)));
};
S.ending = (U, t, info, tt, k, n, line) => { const B = N.laundromat(tt, { book: false }); const off = has(line, 'comments', 'scares') ? 0.4 : 0;
  frame(U, B, { z: 1.0, cx: 960, cy: 560 }, [], N.notebook(1280, 470, 0.9), { fxIn: true });
  if (off) U.svg('card', `<rect width="1920" height="1080" fill="#000" opacity="${f(off)}"/>`, {}, { z: 3 });
  big(U, `<div style="${TXT(84)};text-shadow:0 8px 0 #000;max-width:1100px">${has(line, 'comments', 'scares') ? 'Which rule scares you most?' : 'Write a name, or keep it closed forever?'}</div>`, 160, 300);
  chrome(U, t, info, { day: 31, time: 'NOW', status: { text: 'YOUR TURN', on: true, color: COL.yellow } });
};

const BG = { open: '#3f8a9a', day1: '#f2d58a', day2: '#6a3a3a', day5: '#2a2650', day9: '#e8eef4', day14: '#1a0f3a', day17: '#8a9ac8', day20: '#2a2650', day23: '#f2d58a', day26: '#5a6a72', day30: '#2a1f5e', day31: '#3f8a9a', ending: '#3f8a9a' };
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line));
