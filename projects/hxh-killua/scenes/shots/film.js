// "What If You Had Killua's Powers in Real Life?" — flat 2D (same look as Luffy / JoJo / Death Note). Shots come from PLAN
// (story sections); each section draws by keywords in the narration line. Electricity is only ever shown as our own blue
// arcs on the hero's hands and on machines, never used on a person. Nothing graphic about the Zoldyck training.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_STAND, P_THINK, P_TIRED, P_HIPS, P_PHONE, P_SIT, P_RUN } from '../lib/people.js';
import { hud, label, caption, punch, COL } from '../lib/hud.js';
import { frame as frame0 } from '../lib/flat2d.js';
import * as SET from '../lib/sets/saitama2d.js';
import * as J from '../lib/sets/jojo2d.js';
import * as N from '../lib/sets/dn2d.js';
import * as K from '../lib/sets/kil2d.js';
import { PLAN } from './plan.js';

const f = (n) => n.toFixed(1);
const OL = '#b9dcff', BLUE = '#7fe3ff';
const HERO = { top: '#3f6db3', bottom: '#2a2d3a', hood: true, hair: 'short', broad: true };
const FRIEND = { top: '#e0723a', bottom: '#2a2d3a', hair: 'curly' };
const KID = { top: '#2f9a8e', bottom: '#22263a', hair: 'short' };
const SCI = { top: '#f4f6f8', bottom: '#2a2d3a', hair: 'ponytail' };
const TITLE = "WHAT IF YOU HAD KILLUA'S POWERS?";
const CH = (n, c = BLUE) => ({ text: `CHARGE · ${n}%`, on: n > 0, color: c });
const chrome = (U, t, info, d) => { hud(U, { title: TITLE, ...d }); caption(U, info, t); };
const LX = (txt) => Math.min(1180, 1840 - txt.length * 24 - 70); // keep every label inside the safe area (no text cut on the right)
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 260, c ? { color: c } : {});
const L2 = (U, t, txt, t0 = 1.0, c) => label(U, 'L2', txt, t0, t, LX(txt), 350, c ? { color: c } : {});
const CL1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 170, c ? { color: c } : {});
const CL2 = (U, t, txt, t0 = 1.0, c) => label(U, 'L2', txt, t0, t, LX(txt), 230, c ? { color: c } : {});
// sticky phases inside a section: the k of the first shot whose line matches (so a scene state never flips back)
const since = (sec, ...w) => { let best = 1e9; for (const p of Object.values(PLAN)) if (p.sec === sec && has(p.line, ...w)) best = Math.min(best, p.k); return best; };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const run = (tt) => { const s = Math.sin(tt * 14); return { ...P_RUN, aL: [50 + s * 40, 80], aR: [40 - s * 40, 110], lL: [30 + s * 30, 40], lR: [-10 - s * 30, 10] }; };
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre, shadow: o.shadow });
const Q = (x, y, pose, outfit, face = 'neutral', o = {}) => ({ x, y, h: o.h || 340, pose, outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const D = (day, time, status) => ({ day, time, status });
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
let FULLED = false;
const full = (U, svg) => { FULLED = true; return U.svg('card', svg, {}, { z: 3 }); };
// visual pace: inside a section, shots alternate wide / close-up / kinetic-text card so no single framing lasts long
// (rule from the Ads chat, 17 Nov: no location > 25-30 s, a strong change about every 5 s)
let CUT = 'wide';
const frame = (U, B, cam, ppl, fx, o) => { if (CUT === 'close' && ppl && ppl[0]) { const h = ppl[0]; cam = { z: Math.max(cam.z * 1.9, 2.4), cx: h.x + (h.flip ? -30 : 30), cy: h.y - (h.h || 360) * 0.7 }; } return frame0(U, B, cam, ppl, fx, o); };
const KCOL = { open: ['#1a1030', '#7fe3ff'], day1: ['#f2d58a', '#15181e'], day3: ['#2a2650', '#7fe3ff'], day6: ['#06304a', '#7fe3ff'], day10: ['#ffd23f', '#15181e'], day15: ['#d8583a', '#ffffff'], day22: ['#2f9a5a', '#ffffff'], day26: ['#3a2a4a', '#ffd23f'], day30: ['#15181e', '#ff5a4a'], day40: ['#0c0a24', '#ffd27a'], day41: ['#8a9ac8', '#15181e'], ending: ['#15181e', '#ffd23f'] };
const kin = (U, t, line, sec) => { const [bg, ac] = KCOL[sec] || ['#15181e', '#ffd23f']; const words = line.replace(/["“”]/g, '').split(/\s+/).filter(Boolean);
  let key = 0, len = 0; words.forEach((w, i) => { const n = w.replace(/[^\w]/g, '').length; if (n > len) { len = n; key = i; } });
  const k = clamp(t / 0.25), dark = ['#f2d58a', '#ffd23f', '#8a9ac8'].includes(bg);
  U.svg('card', `<rect width="1920" height="1080" fill="${bg}"/>${[...Array(9)].map((_, i) => `<rect x="${-200 + i * 260 + (t * 40) % 260}" y="0" width="120" height="1080" fill="${dark ? '#000' : '#fff'}" opacity="0.035" transform="skewX(-12)"/>`).join('')}`, {}, { z: 3 });
  U.html('big', `<div style="width:1500px;transform:scale(${f(0.92 + 0.08 * ease.out(k))});transform-origin:left center;opacity:${f(k)};${TXT(118, dark ? '#15181e' : '#ffffff')};text-transform:uppercase">${words.map((w, i) => i === key ? `<span style="color:${ac === '#15181e' ? '#c8352e' : ac}">${w}</span>` : w).join(' ')}</div>`, { left: '200px', top: '330px' }, { z: 50 });
  U.html('L1', '', {}); U.html('L2', '', {}); U.html('cap', '', {}); };
const CUTS = {}; { const by = {}; for (const [id, p] of Object.entries(PLAN)) (by[p.sec] = by[p.sec] || []).push(id);
  for (const ids of Object.values(by)) ids.forEach((id, k) => { CUTS[id] = k === 0 ? 'wide' : ['close', 'wide', 'kin', 'wide', 'close', 'wide'][(k - 1) % 6]; }); }
const SHOT = (id, bg, body, sec, line) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { U.svg('fx', '', {}); U.svg('card', '', {}); U.html('big', '', {}); U.svg('punch', '', {}); FULLED = false; CUT = CUTS[id] === 'close' ? 'close' : 'wide'; body(U, t, info, info.start + t); CUT = 'wide'; if (CUTS[id] === 'kin' && !FULLED && sec !== 'ending') kin(U, t, line, sec); } });
const rule = (U, t, n, txt) => L1(U, t, `RULE ${n} · ${txt}`, 0.2, COL.yellow);
// sparks on the hero's hands (c = person geometry); k = strength
const zapHands = (k, tt, which = [0, 1]) => (c) => which.map((i) => K.spark(c.hands[i][0], c.hands[i][1], k, tt, 3 + i)).join('');
const hair = (tt) => (c) => K.static_(c.head ? c.head[0] : c.hands[0][0], c.head ? c.head[1] : c.hands[0][1] - 200, tt);
// a stat card: two bars (a, b) with labels, title on top
const twoBars = (title, a, b, ka = 1, kb = 1, unit = '') => { const mx = Math.max(a.v, b.v), sc = 420 / mx;
  const bar = (x, d, k, c) => `<rect x="${x}" y="${f(820 - d.v * sc * k)}" width="260" height="${f(d.v * sc * k)}" fill="${c}"/><text x="${x + 130}" y="${f(800 - d.v * sc * k)}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="60" fill="#fff" opacity="${f(k)}">${d.t}</text><text x="${x + 130}" y="870" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="28" fill="#cfd8e0">${d.lab}</text>`;
  return `<rect width="1920" height="1080" fill="#0e1424"/><text x="960" y="300" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#fff">${title}</text>` + bar(620, a, ka, '#7a7a8a') + bar(1040, b, kb, '#3fb8e0'); };

const S = {};
S.open = (U, t, info, tt, k, n, line) => { const on = k >= since('open', 'lights come back');
  if (k === 0) { const B = N.night(J.street(tt), 960, 300, 0.62); let rain = ''; for (let i = 0; i < 80; i++) { const x = -200 + (i * 151) % 2400, y = ((i * 89 + tt * 1300) % 1300) - 150; rain += `<line x1="${x}" y1="${f(y)}" x2="${x - 14}" y2="${f(y + 44)}" stroke="#9fd8ff" stroke-width="2.5" opacity="0.5"/>`; } B.front += rain + (Math.sin(tt * 2.3) > 0.9 ? `<rect x="-3000" y="-2000" width="8000" height="5000" fill="#ffffff" opacity="0.35"/>` : ''); frame(U, B, { z: 1.0, cx: 960, cy: 520 }, [], '', { fxIn: true }); L1(U, t, 'STORM · 9:00 PM · POWER CUT', 0.3, COL.red); chrome(U, t, info, D(0, '9:00 PM', CH(0))); return; }
  const B = K.lift(tt, { lights: on ? 1 : 0 }); let cam = { z: 1.15, cx: 1000, cy: 560 }, fx = '';
  let ppl = [P(900, 880, P_STAND, 'worried', { look: 0.8 })];
  if (has(line, 'storm', 'alone in a lift', 'Killua from', 'powers of', 'Hunter')) { L1(U, t, 'POWER CUT · FLOOR 7 · 8', 0.3, COL.red); if (has(line, 'Killua', 'Hunter')) L2(U, t, 'POWERS · KILLUA (HUNTER x HUNTER)', 0.6, BLUE); }
  else if (has(line, 'emergency light', 'buttons are dead')) { cam = { z: 1.6, cx: 1300, cy: 480 }; L1(U, t, 'BUTTONS · DEAD', 0.3, COL.red); }
  else if (has(line, 'hand flat', 'cold, then bright')) { ppl = [P(1240, 880, { ...P_STAND, aR: [100, 30] }, 'worried', { flip: false, extra: zapHands(clamp(t / 1.5), tt, [1]) })]; cam = { z: 1.7, cx: 1300, cy: 520 }; }
  else if (has(line, 'crack', 'blue line', 'lights come back', 'starts moving')) { ppl = [P(1240, 880, { ...P_STAND, aR: [100, 30] }, 'open', { extra: (c) => K.spark(c.hands[1][0], c.hands[1][1], 1, tt, 4) + K.bolt(c.hands[1][0], c.hands[1][1], 1465, 470, 9, tt) })]; cam = { z: 1.4, cx: 1250, cy: 520 }; if (has(line, 'lights come back')) L1(U, t, 'POWER · BACK ON', 0.2, '#4fd06a'); }
  else if (has(line, 'Nobody saw', 'hair')) { ppl = [P(900, 880, P_STAND, 'open', { extra: hair(tt) })]; cam = { z: 1.9, cx: 900, cy: 500 }; L1(U, t, 'WITNESSES · 0', 0.3); }
  else if (has(line, 'In the story', 'turns his own', 'gadget', 'glove', 'body')) { ppl = [P(900, 880, { ...P_STAND, aL: [60, 60], aR: [60, 60] }, 'neutral', { extra: zapHands(0.8, tt) })]; L1(U, t, 'IN THE STORY · ENERGY → ELECTRICITY', 0.3, BLUE); cam = { z: 1.4, cx: 900, cy: 560 }; }
  else { ppl = [P(900, 880, P_THINK, 'neutral', { extra: zapHands(0.4, tt, [1]) })]; L1(U, t, 'NEXT · 40 DAYS', 0.3, COL.yellow); }
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(0, '9:02 PM', CH(on ? 100 : 0)));
};
S.day1 = (U, t, info, tt, k, n, line) => { const B = J.kitchen(tt); let cam = { z: 1.5, cx: 900, cy: 600 }, rip = has(line, 'water changes', 'Transmuter') ? 1 : 0.2;
  let fx = K.glassLeaf(900, 600, 1.1, rip, tt), ppl = [P(620, 860, { ...P_STAND, aR: [70, 50] }, has(line, "can't explain") ? 'open' : 'neutral')];
  if (has(line, 'Nen', 'six types')) { L1(U, t, 'IN THE STORY · NEN', 0.3, BLUE); L2(U, t, '6 TYPES', 1.0); }
  if (has(line, 'glass', 'leaf', 'which one')) { cam = { z: 2.1, cx: 880, cy: 560 }; L1(U, t, 'TEST · WATER + LEAF', 0.3); }
  if (has(line, 'Transmuter')) { L1(U, t, 'YOUR TYPE · TRANSMUTER', 0.2, BLUE); ppl = [P(620, 860, { ...P_STAND, aR: [70, 50] }, 'open', { extra: zapHands(0.5, tt, [1]) })]; }
  if (has(line, 'out of nothing', 'already have')) L2(U, t, 'ENERGY → ELECTRICITY', 0.8, BLUE);
  if (has(line, 'Rule one')) rule(U, t, 1, 'IT\'S WHAT YOUR ENERGY BECOMES');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(1, '8:30 AM', CH(100)));
};
S.day3 = (U, t, info, tt, k, n, line) => { const B = N.night(SET.bedroom(tt, { time: 'night' }), 900, 520, 0.3); let cam = { z: 1.6, cx: 900, cy: 560 }, fx = '';
  const hurt = has(line, 'hurts', 'sting');
  let ppl = [P(900, 880, { ...P_STAND, aL: [70, 70], aR: [70, 70] }, hurt ? 'worried' : 'neutral', { extra: zapHands(hurt ? 1 : 0.6, tt) })];
  const cat = `<g transform="translate(1400 ${f(840 - Math.abs(Math.sin(tt * 6)) * (has(line, 'cat') ? 60 : 0))})"><ellipse cx="0" cy="0" rx="70" ry="40" fill="#e8a04a"/><circle cx="70" cy="-30" r="32" fill="#e8a04a"/><path d="M 52 -56 l 8 -26 l 14 22 M 80 -58 l 12 -24 l 8 26" fill="#e8a04a"/><circle cx="80" cy="-34" r="5" fill="#15181e"/>${has(line, 'cat') ? K.static_(0, 40, tt) : ''}</g>`;
  if (hurt) { L1(U, t, 'SIDE EFFECT · IT STINGS', 0.2, COL.red); cam = { z: 2.1, cx: 900, cy: 520 }; }
  if (has(line, 'Zoldyck', 'assassins', 'tolerance')) { ppl = [P(900, 880, P_THINK, 'neutral')]; L1(U, t, 'IN THE STORY · ZOLDYCK FAMILY', 0.2, COL.yellow); L2(U, t, 'TOLERANCE · FROM TRAINING', 1.0); }
  if (has(line, 'confused cat', 'stinging hand')) { fx = cat; cam = { z: 1.2, cx: 1100, cy: 600 }; }
  if (has(line, 'Rule two')) rule(U, t, 2, 'IT HITS YOU FIRST');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(3, '11:20 PM', CH(hurt ? 60 : 80)));
};
S.day6 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'eight hundred', 'six hundred', 'Volta', '2019', 'twenty nineteen', 'new species')) { const kk = clamp(t / 1.2);
    full(U, twoBars('ELECTRIC EELS · DISCHARGE', { v: 650, t: '~650 V', lab: 'ELECTRIC EEL' }, { v: 860, t: '860 V', lab: "VOLTA'S EEL · 2019" }, kk, kk));
    CL1(U, t, 'REAL SCIENCE · NEW SPECIES (2019)', 0.2, BLUE); chrome(U, t, info, D(6, '2:00 PM', CH(90))); return; }
  const B = K.aquarium(tt, { zap: has(line, 'without training', 'without even trying') ? 1 : 0 }); let cam = { z: 1.2, cx: 960, cy: 560 };
  let ppl = [P(500, 900, P_STAND, has(line, 'jealous') ? 'smile' : 'neutral', { look: 0.9 })];
  if (has(line, 'for a living')) L1(U, t, 'AQUARIUM · ELECTRIC EEL', 0.3);
  if (has(line, "doesn't look like much")) cam = { z: 1.7, cx: 960, cy: 470 };
  if (has(line, 'without training', 'without even trying')) L1(U, t, 'TRAINING NEEDED · NONE', 0.3, '#4fd06a');
  if (has(line, 'jealous')) { cam = { z: 1.8, cx: 560, cy: 560 }; L1(U, t, 'JEALOUS · OF A FISH', 0.3, COL.yellow); }
  if (has(line, 'Rule three')) rule(U, t, 3, 'NATURE GOT THERE FIRST');
  frame(U, B, cam, ppl, '', { fxIn: true });
  chrome(U, t, info, D(6, '2:10 PM', CH(90)));
};
S.day10 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'quarter of a second', 'milliseconds', 'Studies', 'eyes, the brain')) { const kk = clamp(t / 1.0);
    full(U, `<rect width="1920" height="1080" fill="#0e1424"/><text x="960" y="300" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#fff">REACTION TIME · SEE → MOVE</text><rect x="360" y="520" width="1200" height="60" rx="30" fill="#2a3450"/><rect x="${f(360 + 1200 * 0.19)}" y="520" width="${f(1200 * 0.095 * kk)}" height="60" rx="30" fill="#ffd23f"/>${[0, 100, 200, 300, 400, 500].map((m) => `<text x="${360 + m * 2.4}" y="640" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="28" fill="#cfd8e0">${m} ms</text>`).join('')}<text x="${f(360 + 1200 * 0.237)}" y="490" text-anchor="middle" font-family="Inter" font-weight="900" font-size="52" fill="#fff" opacity="${f(kk)}">~190–285 ms</text>`);
    CL1(U, t, 'ABOUT · A QUARTER OF A SECOND', 0.2, COL.yellow); chrome(U, t, info, D(10, '4:15 PM', CH(90))); return; }
  const B = J.street(tt); let cam = { z: 1.2, cx: 960, cy: 560 }, fx = '';
  const fly = has(line, 'way too hard', 'straight at') ? clamp(t / info.dur) : 0, caught = has(line, 'catch', 'caught', 'Whirlwind', 'same thing', 'mum', 'shocked');
  let ppl = [P(900, 800, caught ? { ...P_STAND, aR: [140, 20] } : P_STAND, caught ? 'open' : 'neutral', { extra: caught ? (c) => K.ball(c.hands[1][0], c.hands[1][1] - 10, 30) + (has(line, 'Whirlwind', 'same thing') ? K.spark(c.hands[1][0], c.hands[1][1], 0.8, tt, 5) : '') : undefined }), Q(300, 800, { ...P_STAND, lL: [40, 30] }, KID, 'smile', { h: 230 })];
  fx = K.pram(1260, 800);
  if (fly) fx += K.ball(360 + fly * 800, 640 - Math.sin(fly * 3) * 60, 30, tt * 600);
  if (has(line, 'way too hard')) L1(U, t, 'INCOMING · A PRAM IN THE WAY', 0.2, COL.red);
  if (has(line, 'before you decided')) { cam = { z: 1.9, cx: 980, cy: 520 }; L1(U, t, 'CAUGHT · BEFORE YOU DECIDED', 0.2, BLUE); }
  if (has(line, 'Whirlwind', 'Godspeed')) { L1(U, t, 'IN THE STORY · GODSPEED: WHIRLWIND', 0.2, BLUE); L2(U, t, 'SIGNALS → STRAIGHT TO THE MUSCLES', 1.0); }
  if (has(line, 'mum', 'shocked')) { ppl.push(Q(1420, 800, { ...P_STAND, aL: [60, 80] }, { top: '#e05a8a', bottom: '#22263a', hair: 'ponytail' }, 'smile', { flip: true })); }
  if (has(line, 'Rule four')) rule(U, t, 4, 'SKIP THE DELAY');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(10, '4:15 PM', CH(85)));
};
S.day15 = (U, t, info, tt, k, n, line) => { const B = J.track(tt); let cam = { z: 1.1, cx: 960, cy: 560 }, fx = '';
  const fence = `<g>${[...Array(14)].map((_, i) => `<rect x="${1500 + i * 40}" y="560" width="10" height="200" fill="#cfd8e0"/>`).join('')}<rect x="1490" y="570" width="560" height="10" fill="#cfd8e0"/><rect x="1490" y="660" width="560" height="10" fill="#cfd8e0"/></g>`;
  const crash = has(line, 'disaster', "don't turn", 'fence'), lie = has(line, 'lie on the grass', 'easy part', 'Rule five');
  let x = crash ? 600 + clamp(t / info.dur) * 880 : 400 + (tt * 200 % 600);
  let ppl = [lie ? P(1100, 900, P_SIT, 'neutral', { look: 0.2 }) : P(x, 900, run(tt), crash ? 'worried' : 'open', { extra: (c) => K.spark(c.hands[0][0], c.hands[0][1], 0.5, tt, 7) })];
  fx = fence + (crash ? Array.from({ length: 6 }, (_, i) => `<line x1="${f(x - 120 - i * 50)}" y1="${780 + i * 18}" x2="${f(x - 300 - i * 50)}" y2="${780 + i * 18}" stroke="${BLUE}" stroke-width="5" opacity="0.6"/>`).join('') : '');
  if (has(line, 'Speed of Lightning')) L1(U, t, 'IN THE STORY · SPEED OF LIGHTNING', 0.2, BLUE);
  if (has(line, 'staying in control')) L2(U, t, 'SPEED + CONTROL', 1.0);
  if (has(line, 'start is incredible')) L1(U, t, 'START · INCREDIBLE', 0.2, '#4fd06a');
  if (crash) L1(U, t, 'FIRST BEND · NO STEERING', 0.2, COL.red);
  if (lie) cam = { z: 1.6, cx: 1100, cy: 760 };
  if (has(line, 'Rule five')) rule(U, t, 5, 'STEER OR CRASH');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(15, '6:10 AM', CH(70)));
};
S.day22 = (U, t, info, tt, k, n, line) => { const LAB = since('day22', 'science lab', 'email'), VIR = since('day22', 'goes everywhere');
  if (k >= LAB) { const B = SET.lab(tt); let cam = { z: 1.3, cx: 960, cy: 580 };
    const green = has(line, 'fourth', 'before the light') ? (t > 0.8 ? 1 : 0) : (Math.floor(tt) % 3 === 0 ? 1 : 0);
    const fx = K.reactScreen(1300, 520, green, has(line, 'fourth', 'before the light') ? '— ms ?!' : '0.27 s');
    let ppl = [P(760, 820, { ...P_STAND, aR: [90, 40] }, 'neutral', { extra: has(line, 'fourth') ? zapHands(0.6, tt, [1]) : undefined }), Q(1650, 820, has(line, 'writes') ? { ...P_STAND, aR: [40, 100] } : P_STAND, SCI, 'neutral', { flip: true })];
    if (has(line, 'email', 'reaction test')) L1(U, t, 'INVITE · SPORTS SCIENCE LAB', 0.3);
    if (has(line, 'slow on purpose')) L1(U, t, 'PLAN · BE SLOW ON PURPOSE', 0.2, COL.yellow);
    if (has(line, 'fourth', 'before the light')) { L1(U, t, 'TRY 4 · BEFORE THE LIGHT', 0.2, COL.red); cam = { z: 1.7, cx: 1200, cy: 520 }; }
    if (has(line, 'writes', 'researcher')) { L1(U, t, 'THE RESEARCHER · SAYS NOTHING', 0.2); cam = { z: 1.6, cx: 1550, cy: 560 }; }
    if (has(line, 'Rule six')) rule(U, t, 6, 'THEY COUNT HOW OFTEN');
    frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(24, '10:00 AM', CH(80))); return; }
  if (k >= VIR) { const views = Math.round(2.4 + clamp(t / info.dur) * 5.6);
    full(U, `<rect width="1920" height="1080" fill="#0e1424"/><rect x="660" y="160" width="600" height="860" rx="40" fill="#15181e" stroke="${OL}" stroke-width="6"/><rect x="690" y="200" width="540" height="340" rx="12" fill="#3a8a4a"/>${K.goal(960, 500).replace('translate(960 500)', 'translate(960 500) scale(0.9)')}<circle cx="960" cy="520" r="0" /><text x="700" y="590" font-family="Inter" font-weight="900" font-size="34" fill="#fff">THIS SAVE ISN'T REAL 😳</text><text x="700" y="640" font-family="IBM Plex Mono" font-weight="800" font-size="28" fill="#9aa3ad">${views}.${(Math.floor(tt * 7) % 9)}M views</text>${['"it\'s edited"', '"it\'s NOT edited"', '"slow it down"', '"how??"'].map((c, i) => `<rect x="700" y="${680 + i * 76}" width="520" height="60" rx="12" fill="#22283a" opacity="${t > 0.4 + i * 0.5 ? 1 : 0}"/><text x="720" y="${720 + i * 76}" font-family="Inter" font-weight="800" font-size="28" fill="#fff" opacity="${t > 0.4 + i * 0.5 ? 1 : 0}">${c}</text>`).join('')}`);
    CL1(U, t, 'VIRAL · EDITED OR NOT?', 0.3, COL.yellow); chrome(U, t, info, D(22, '9:00 PM', CH(80))); return; }
  const B = SET.field(tt); let cam = { z: 1.2, cx: 960, cy: 560 };
  const save = has(line, 'save it', 'slow motion', 'two metres', 'shoots'); const kick = has(line, 'slow motion') ? 0.2 : clamp(t / info.dur);
  let fx = K.goal(960, 760);
  let ppl = [P(960, 760, save ? { ...P_STAND, aR: [140, 10], aL: [60, 60] } : P_STAND, 'open', { extra: save ? (c) => K.ball(c.hands[1][0] + 10, c.hands[1][1], 28) + (has(line, 'slow motion') ? K.spark(c.hands[1][0], c.hands[1][1], 0.6, tt, 2) : '') : undefined }), Q(1450, 780, { ...P_STAND, lL: [60, 20] }, FRIEND, 'neutral', { flip: true })];
  if (has(line, 'films')) { ppl.push(Q(300, 780, P_PHONE, KID, 'smile')); L1(U, t, 'FIVE-A-SIDE · YOU IN GOAL', 0.3); }
  if (has(line, 'two metres')) L1(U, t, 'DISTANCE · 2 m', 0.2, COL.red);
  if (has(line, 'slow motion', "hasn't even left")) { full(U, `<rect width="1920" height="1080" fill="#000" opacity="0.15"/>`); L1(U, t, 'SLOW-MO · HAND MOVES FIRST', 0.2, BLUE); cam = { z: 1.8, cx: 1150, cy: 600 }; }
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(22, '7:30 PM', CH(80)));
};
S.day26 = (U, t, info, tt, k, n, line) => { const B = J.street(tt); let cam = { z: 1.2, cx: 960, cy: 560 }, fx = '';
  const gate = `<g><rect x="1250" y="440" width="20" height="360" fill="#3a3a48"/><rect x="1650" y="440" width="20" height="360" fill="#3a3a48"/><rect x="1250" y="440" width="420" height="60" rx="6" fill="#2a6a8a"/><text x="1460" y="482" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="30" fill="#fff">SCHOOL</text></g>`;
  const bullies = [0, 1, 2].map((i) => Q(1300 + i * 160, 800, P_STAND, { top: ['#5a5a6a', '#6a4a4a', '#4a5a4a'][i], bottom: '#22263a', hair: ['short', 'curly', undefined][i] }, 'smile', { flip: true, h: 320 }));
  let ppl = [P(500, 800, P_STAND, has(line, 'scares', 'weapon', 'like them') ? 'worried' : 'neutral'), Q(700, 800, P_STAND, FRIEND, has(line, 'quietly', 'little shock') ? 'neutral' : 'worried'), Q(860, 800, P_STAND, KID, 'worried', { h: 240 })];
  if (has(line, 'torn jacket', 'bruise', 'everyone knows')) { ppl = [...ppl, ...bullies]; L1(U, t, 'EVERYONE · KNOWS WHO', 0.3, COL.red); }
  if (has(line, 'little shock', 'Nobody would')) { L1(U, t, '"JUST A LITTLE SHOCK"', 0.2, COL.red); cam = { z: 1.7, cx: 640, cy: 520 }; }
  if (has(line, "That's what scares you")) { cam = { z: 2.0, cx: 520, cy: 500 }; }
  if (has(line, 'family of assassins', 'like them')) { L1(U, t, 'IN THE STORY · A FAMILY OF ASSASSINS', 0.2, COL.yellow); }
  if (has(line, 'You say no', 'walk him', 'Nobody touches')) { fx = gate; ppl = [P(900, 800, walk(tt), 'neutral'), Q(1060, 800, walk(tt + 0.3), KID, 'smile', { h: 240 })]; L1(U, t, has(line, 'Nobody touches') ? 'RESULT · NOBODY TOUCHES HIM' : 'ANSWER · NO', 0.2, '#4fd06a'); }
  if (has(line, 'Rule seven')) rule(U, t, 7, 'WHAT YOU REFUSE TO DO');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(26, '3:30 PM', CH(80)));
};
S.day30 = (U, t, info, tt, k, n, line) => { const empty = k >= since('day30', 'nothing left');
  const B = N.night(N.flat(tt), 900, 500, empty ? 0.38 : 0.12); let cam = { z: 1.4, cx: 900, cy: 600 }, fx = B.table(760);
  const phone = (c) => `<rect x="${f(c.hands[1][0] - 22)}" y="${f(c.hands[1][1] - 40)}" width="44" height="80" rx="8" fill="#15181e" stroke="${OL}" stroke-width="3"/><rect x="${f(c.hands[1][0] - 14)}" y="${f(c.hands[1][1] - 28)}" width="${f(4)}" height="10" fill="#e8452e"/>`;
  let ppl = [P(900, 860, empty ? P_TIRED : { ...P_STAND, aL: [70, 60], aR: [70, 60] }, empty ? 'worried' : 'smile', { extra: empty ? undefined : zapHands(0.9, tt) })];
  const lvl = empty ? 0 : Math.round(80 - clamp(t / info.dur) * 60);
  if (has(line, 'burns through', 'running out')) { L1(U, t, 'IN THE STORY · GODSPEED DRAINS FAST', 0.2, COL.red); }
  if (has(line, 'all day', 'because you can')) L1(U, t, 'USE · ALL DAY', 0.2, COL.yellow);
  if (has(line, 'nothing left', 'No spark')) { L1(U, t, 'CHARGE · EMPTY', 0.2, COL.red); }
  if (has(line, 'drop a cup')) { const k2 = clamp(t / 1.2); fx += `<g transform="translate(${1000} ${f(640 + k2 * 180)})"><rect x="-20" y="-24" width="40" height="48" rx="6" fill="#f4f1ea" stroke="${OL}" stroke-width="3" transform="rotate(${f(k2 * 90)})"/></g>`; cam = { z: 1.8, cx: 960, cy: 620 }; }
  if (has(line, 'ordinary')) { cam = { z: 2.0, cx: 900, cy: 520 }; L1(U, t, 'NEW FEAR · BEING ORDINARY', 0.2, COL.yellow); }
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(30, empty ? '9:40 PM' : '1:00 PM', CH(lvl, lvl < 25 ? COL.red : BLUE)));
};
S.day40 = (U, t, info, tt, k, n, line) => { const push = k >= since('day40', 'wheel moves'), hold = k >= since('day40', 'both hands');
  const lit = k >= since('day40', 'little boy') ? 1 : 0; const B = K.funfair(tt, { lit, rot: push ? tt * 0.12 : 0.1 }); let cam = { z: 1.0, cx: 1000, cy: 520 }, fx = '';
  const hands = hold;
  const fade = (k >= since('day40', 'last car') && !lit) ? (Math.sin(tt * 30) > 0 ? 0.5 : 0.15) : lit ? 0.25 : 1;
  let ppl = [P(500, 860, hands ? { ...P_STAND, aL: [80, 40], aR: [80, 40] } : P_STAND, has(line, 'shaking') ? 'worried' : 'neutral', { extra: hands ? (c) => K.spark(c.hands[1][0], c.hands[1][1], fade, tt, 2) + K.bolt(c.hands[1][0], c.hands[1][1], 600, 700, 3, tt, { w: 5 * fade }) : undefined })];
  if (has(line, 'storm again', 'funfair')) L1(U, t, 'STORM · FUNFAIR BY THE RIVER', 0.3, COL.red);
  if (has(line, 'power goes out', 'Ferris wheel stops', 'swinging')) { L1(U, t, 'FERRIS WHEEL · STOPPED · FULL', 0.2, COL.red); cam = { z: 1.5, cx: 1240, cy: 260 }; }
  if (has(line, 'generator', 'an hour')) L1(U, t, 'GENERATOR · 1 HOUR', 0.2);
  if (has(line, 'both hands', 'everything you')) { cam = { z: 1.8, cx: 600, cy: 640 }; L1(U, t, 'CHARGE · ALL OF IT', 0.2, BLUE); }
  if (has(line, 'One car', 'Then the next')) L1(U, t, 'CARS DOWN · ONE BY ONE', 0.2, '#4fd06a');
  if (has(line, 'little boy')) { ppl.push(Q(1150, 860, { ...P_STAND, aR: [150, 20] }, KID, 'smile', { h: 220 }), Q(1280, 860, P_STAND, { top: '#4a6fb5', bottom: '#22263a', hair: 'short' }, 'smile', { flip: true })); cam = { z: 1.5, cx: 1000, cy: 620 }; }
  if (has(line, 'let him think')) L1(U, t, 'WHO DID IT · "THE WHEEL"', 0.2, COL.yellow);
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(40, '9:15 PM', CH(push ? (k >= since('day40', 'last car') ? 3 : 30) : hold ? 60 : 100, push ? COL.red : BLUE)));
};
S.day41 = (U, t, info, tt, k, n, line) => { const B = N.flat(tt); let cam = { z: 1.3, cx: 900, cy: 600 }, fx = B.table(760);
  const jump = has(line, 'door slams', 'in the air');
  let ppl = [P(900, 860, jump ? { ...P_STAND, aR: [150, 10], aL: [60, 60] } : has(line, 'slow on purpose', 'every day') ? P_SIT : P_STAND, jump ? 'open' : 'neutral', { extra: jump ? zapHands(0.5, tt, [1]) : undefined })];
  if (jump) { punch(U, t); L1(U, t, 'REACTION · BEFORE YOU HEARD IT', 0.2, BLUE); }
  if (has(line, 'price nobody mentions', 'reacts before you decide')) { L1(U, t, 'THE PRICE · NO OFF SWITCH', 0.2, COL.red); cam = { z: 1.8, cx: 900, cy: 520 }; }
  if (has(line, 'scary film', 'surprised')) L1(U, t, 'SURPRISES · IMPOSSIBLE', 0.2, COL.red);
  if (has(line, 'slow on purpose')) L1(U, t, 'NEW SKILL · SLOW ON PURPOSE', 0.2, '#4fd06a');
  if (has(line, 'Rule eight')) rule(U, t, 8, 'CHOOSING TO WAIT');
  frame(U, B, cam, ppl, fx, { fxIn: true });
  chrome(U, t, info, D(41, '7:05 AM', CH(40)));
};
S.ending = (U, t, info, tt, k, n, line) => { const B = K.lift(tt, { lights: 1, floor: '1 ●' });
  frame(U, B, { z: 1.0, cx: 960, cy: 560 }, [P(1240, 880, { ...P_STAND, aR: [100, 30] }, 'neutral')], '', { fxIn: true });
  const q = has(line, 'never use') ? "What would you never use it for?" : has(line, 'comments') ? 'Tell us in the comments.' : 'The speed, or the spark?';
  U.svg('card', `<rect width="1920" height="1080" fill="#000" opacity="0.35"/>`, {}, { z: 3 });
  big(U, `<div style="${TXT(84)};text-shadow:0 8px 0 #000;max-width:1000px">${q}</div>`, 160, 320);
  chrome(U, t, info, { day: null, time: null, status: { text: 'YOUR TURN', on: true, color: COL.yellow } });
};

const BG = { open: '#3a2a34', day1: '#f2d58a', day3: '#2a2650', day6: '#0a1424', day10: '#4a8ae0', day15: '#ff9a8a', day22: '#ff9a8a', day26: '#4a8ae0', day30: '#8a9ac8', day40: '#0c0a24', day41: '#8a9ac8', ending: '#8a98a8' };
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line), p.sec, p.line);
