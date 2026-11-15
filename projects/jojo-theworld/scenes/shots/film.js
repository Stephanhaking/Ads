// "What If You Had The World in Real Life?" — flat 2D (approved pilot look). Shots come from PLAN (story sections);
// each section draws by keywords in the narration line. Time stops = the world desaturates to cold blue-grey while
// the hero stays in colour; a pulse ring sweeps out when time stops or restarts; the HUD chip counts the seconds.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_STAND, P_THINK, P_TIRED, P_HIPS, P_SHRUG, P_PHONE, P_RUN, P_FLOAT } from '../lib/people.js';
import { hud, label, caption, punch, speedLines, COL, MONO } from '../lib/hud.js';
import { frame } from '../lib/flat2d.js';
import { GRAIN } from '../lib/textures.js';
import * as V from '../lib/vehicles2d.js';
import * as SET from '../lib/sets/saitama2d.js';
import * as J from '../lib/sets/jojo2d.js';
import { square } from '../lib/sets/square.js';
import { PLAN } from './plan.js';

const f = (n) => n.toFixed(1);
const OL = '#b9dcff', INK = '#00000d';
const HERO = { top: '#c9a03a', bottom: '#2a2d3a', hood: true, hair: 'short', broad: true };
const FRIEND = { top: '#e05a8a', bottom: '#2a2d3a', hair: 'ponytail' };
const TITLE = 'WHAT IF YOU HAD THE WORLD?';
const ST = { flow: { text: 'TIME · FLOWING', on: false }, stop: (s) => ({ text: `TIME · STOPPED ${s}`, on: true, color: '#7ab8ff' }) };
const chrome = (U, t, info, d) => { hud(U, { title: TITLE, ...d }); caption(U, info, t); };
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, 1180, 260, c ? { color: c } : {});
const L2 = (U, t, txt, t0 = 1.0, c) => label(U, 'L2', txt, t0, t, 1180, 350, c ? { color: c } : {});
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const run = (tt) => { const s = Math.sin(tt * 11); return { ...P_RUN, aL: [40 + s * 45, 80], aR: [40 - s * 45, 80], lL: [10 + s * 34, 34], lR: [10 - s * 34, 34] }; };
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre, live: true, shadow: o.shadow });
const Q = (x, y, pose, outfit, face = 'neutral', o = {}) => ({ x, y, h: o.h || 340, pose, outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const D = (day, time, status = ST.flow) => ({ day, time, status });
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
const SHOT = (id, bg, body) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { U.svg('fx', '', {}); U.svg('speed', '', {}); U.html('big', '', {}); U.html('cnt', '', {}); body(U, t, info, info.start + t); } });
// big countdown numerals during a stop (n = seconds shown)
const count = (U, n, col = '#cfe0ff') => U.html('cnt', `<div style="font:900 200px ${MONO};color:${col};text-shadow:0 0 40px rgba(120,170,255,.6);opacity:.9">${n}</div>`, { left: '1520px', top: '700px' }, { z: 49 });
const phoneSvg = (x, y, r = 1, rot = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot}) scale(${r})"><rect x="-22" y="-40" width="44" height="80" rx="8" fill="#15181e" stroke="${OL}" stroke-width="3"/><rect x="-16" y="-32" width="32" height="62" rx="4" fill="#8fd0ff"/></g>`;
const crowd = (n, x0, y, faces = 'neutral', frozenPose = true) => Array.from({ length: n }, (_, i) => Q(x0 + i * 170 + (i % 2) * 20, y + (i % 3) * 12, i % 3 === 0 ? walk(1.3 + i) : i % 3 === 1 ? { ...P_PHONE, aR: [62, 92] } : P_STAND, { top: ['#e0723a', '#9a5cc0', '#2f9a8e', '#4a6fb5', '#c9a03a', '#e05a8a'][i % 6], bottom: '#22263a', hair: ['ponytail', 'curly', undefined, 'short'][i % 4], cap: i % 4 === 2 ? '#3f6db3' : undefined }, faces, { flip: i % 2 === 0, h: 320 }));

const S = {};
S.open = (U, t, info, tt, k, n, line) => { const stopped = has(line, 'stops', 'Not in your hand', 'pigeon', 'smoke', 'cars below', 'no sound', 'reach down', 'One. Two'), restart = has(line, 'press', 'starts again', 'play');
  let fz = stopped ? 1 : 0; if (has(line, 'phone slips') ) fz = clamp((t - info.dur * 0.6) / 0.25);
  const B = J.balcony(tt, { frozen: fz > 0.5 });
  let ppl = [P(820, 880, has(line, 'reach down') ? { ...P_STAND, lean: 30, aR: [150, 30] } : has(line, 'One. Two') ? { ...P_STAND, aR: [60, 150] } : P_STAND, stopped ? 'open' : 'neutral', { look: 0.6 })], cam = { z: 1.2, cx: 960, cy: 600 }, fx = '';
  const ph = has(line, 'reach down', 'One. Two') ? null : [1060, has(line, 'phone slips') ? 640 + ease.in(clamp(t / info.dur * 1.6)) * 60 : 700];
  if (ph) fx += phoneSvg(ph[0], ph[1], 1, 20);
  if (has(line, 'pigeon', 'smoke')) cam = { z: 1.0, cx: 1200, cy: 420 }; if (has(line, 'cars below')) cam = { z: 0.9, cx: 960, cy: 700 };
  if (has(line, 'One. Two')) { const c = Math.min(5, 1 + Math.floor(t / (info.dur / 5))); count(U, c); }
  if (has(line, 'phone slips')) fx += J.pulse(1060, 640, clamp((t - info.dur * 0.6) / 0.9));
  if (restart) { fz = 1 - clamp(t / 0.6); fx += J.pulse(820, 560, clamp(t / 0.9), '#ffe0a0'); }
  if (has(line, 'Overnight', 'The World', 'Not Dio', 'Just this', 'five seconds', 'forty days')) { fz = 0; cam = { z: 1.5, cx: 860, cy: 560 }; ppl = [P(820, 880, has(line, 'Just this') ? P_HIPS : P_STAND, has(line, 'forty days') ? 'smile' : 'neutral')];
    if (has(line, 'The World')) L1(U, t, 'POWER · STOP TIME', 0.3, '#7ab8ff'); if (has(line, 'Not Dio')) { L1(U, t, 'MANSION · ✕', 0.2, COL.red); L2(U, t, 'KNIVES · ✕', 1.0, COL.red); } if (has(line, 'five seconds')) L1(U, t, 'CANON · ~5 s', 0.3, COL.yellow); if (has(line, 'forty')) L1(U, t, 'TEST PERIOD · 40 DAYS', 0.3); }
  if (has(line, 'no sound')) L1(U, t, 'SOUND · 0 dB', 0.3, '#7ab8ff');
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz });
  chrome(U, t, info, D(1, '6:58 AM', fz > 0.5 ? ST.stop('·') : ST.flow));
};
S.day1 = (U, t, info, tt, k, n, line) => { const B = J.kitchen(tt); let fz = 0, fx = '', ppl, cam = { z: 1.5, cx: 860, cy: 600 };
  const jx = 900, jy = 560;
  const ribbon = (k2) => `<path d="M ${jx} ${jy} q 30 ${f(40 + k2 * 40)} 10 ${f(110 + k2 * 60)}" stroke="#ff9a1a" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M ${jx} ${jy} q 30 ${f(40 + k2 * 40)} 10 ${f(110 + k2 * 60)}" stroke="#ffd23f" stroke-width="6" fill="none" opacity="0.6"/>`;
  const glass = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M -24 -36 L 24 -36 L 18 36 L -18 36 Z" fill="#e8f6ff" opacity="0.8" stroke="${OL}" stroke-width="3"/><path d="M -20 -10 L 20 -10 L 17 32 L -17 32 Z" fill="#ff9a1a"/></g>`;
  if (has(line, 'Breakfast', 'elbow', "don't even think")) { const fall = has(line, 'elbow') ? ease.in(clamp(t / info.dur)) : 0; ppl = [P(640, 860, { sit: false, ...P_STAND, aR: [70, 60] }, has(line, 'elbow') ? 'open' : 'neutral')]; fx = glass(860 + fall * 40, 580 + fall * 60, fall * 70); if (has(line, "don't even")) { fz = clamp(t / 0.3); fx += J.pulse(900, 600, clamp(t / 0.9)); } }
  else if (has(line, 'ribbon', 'half in the glass')) { fz = 1; ppl = [P(640, 860, P_STAND, 'open')]; fx = glass(900, 620, 70) + ribbon(0.5); cam = { z: 2.0, cx: 860, cy: 560 }; L1(U, t, 'JUICE · FROZEN MID-AIR', 0.3, '#7ab8ff'); }
  else if (has(line, 'walk around', 'poke', 'jelly')) { fz = 1; ppl = [P(1080, 860, has(line, 'poke') ? { ...P_STAND, aL: [80, 60] } : walk(tt), 'open', { flip: true })]; fx = glass(900, 620, 70) + ribbon(0.5); cam = { z: 1.8, cx: 960, cy: 560 }; if (has(line, 'jelly')) L1(U, t, 'FEELS LIKE · JELLY', 0.3); }
  else if (has(line, 'glass back', 'falls right back')) { fz = has(line, 'falls right back') ? 1 - clamp(t / 0.5) : 1; ppl = [P(640, 860, { ...P_STAND, aR: [70, 60] }, 'smile')]; fx = glass(900, 700, 0) + (fz > 0.5 ? ribbon(0.2) : '') + (has(line, 'falls') ? J.pulse(900, 600, clamp(t / 0.9), '#ffe0a0') : ''); }
  else { ppl = [P(640, 860, has(line, 'Rule one') ? P_HIPS : { ...P_STAND, aR: [60, 150] }, 'neutral')]; cam = { z: 1.6, cx: 760, cy: 520 }; if (has(line, 'count', 'five seconds')) count(U, 1 + Math.floor((t * 2) % 5)); if (has(line, 'Rule one')) L1(U, t, 'RULE 1 · 5 SECONDS', 0.2, COL.yellow); if (has(line, 'Not six')) L1(U, t, '6 s · ✕', 0.2, COL.red); }
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz, fxLive: true });
  chrome(U, t, info, D(1, '7:40 AM', fz > 0.5 ? ST.stop('2 s') : ST.flow));
};
S.day2 = (U, t, info, tt, k, n, line) => { const B = J.street(tt); const fz = has(line, 'Rule two', 'wait') ? 0.5 : 1; let fx = '', cam = { z: 1.0, cx: 960, cy: 560 };
  const musician = Q(1260, 820, { ...P_STAND, aL: [60, 100], aR: [40, 40] }, { top: '#2f9a8e', bottom: '#22263a', cap: '#e8452e' }, 'smile', { flip: true, extra: (c) => `<g transform="translate(${f(c.hands[0][0] + 10)} ${f(c.hands[0][1] + 10)}) rotate(-30)"><ellipse rx="40" ry="28" fill="#c86a2a" stroke="${OL}" stroke-width="3"/><rect x="30" y="-6" width="90" height="12" fill="#8a4a1a"/></g>` });
  const dog = `<g transform="translate(560 830)"><ellipse rx="50" ry="24" fill="#c9a06a"/><circle cx="50" cy="-20" r="22" fill="#c9a06a"/><path d="M 60 -40 l 10 -16 l 6 18" fill="#8a6a3a"/><rect x="-40" y="10" width="10" height="34" fill="#c9a06a"/><rect x="30" y="10" width="10" height="34" fill="#c9a06a"/><path d="M 66 -14 q 14 4 24 -6" stroke="#5a3a1a" stroke-width="4" fill="none"/></g>`;
  let ppl = [P(860, 840, has(line, 'clap') ? { ...P_STAND, aL: [70, 70], aR: [70, 70] } : has(line, 'shout') ? { ...P_STAND, head: -14, aR: [60, 150] } : P_STAND, has(line, 'shout', 'clap') ? 'open' : 'neutral'), musician, ...crowd(3, 100, 830)];
  if (has(line, 'Sound is just air', '343')) { L1(U, t, 'SOUND · 343 m/s', 0.2, COL.yellow); L2(U, t, 'NEEDS AIR TO TRAVEL', 1.2); fx = Array.from({ length: 6 }, (_, i) => `<path d="M ${1180 - i * 40} 600 q -20 30 0 60" stroke="#ffffff" stroke-width="4" fill="none" opacity="${f(0.6 - i * 0.08)}"/>`).join(''); cam = { z: 1.4, cx: 1100, cy: 600 }; }
  else if (has(line, 'molecules', '500')) { L1(U, t, 'AIR MOLECULES · ~500 m/s', 0.2, COL.yellow); L2(U, t, 'IN YOUR 5 s · 0 m/s', 1.2, '#7ab8ff'); fx = Array.from({ length: 40 }, (_, i) => `<circle cx="${1000 + (i * 97) % 600}" cy="${300 + (i * 61) % 400}" r="8" fill="#cfe0ff" stroke="#3a5a9a" stroke-width="2"/>`).join(''); cam = { z: 1.3, cx: 1200, cy: 520 }; }
  else if (has(line, 'nothing reaches', 'guitar', 'dog')) { fx = dog; L1(U, t, 'GUITAR · ✕   DOG · ✕', 0.3); }
  else if (has(line, 'clap', 'shout')) { cam = { z: 1.9, cx: 900, cy: 560 }; L1(U, t, has(line, 'clap') ? 'CLAP · SILENT' : 'SHOUT · SILENT', 0.3, '#7ab8ff'); }
  else if (has(line, 'quietest')) { cam = { z: 0.85, cx: 960, cy: 500 }; L1(U, t, 'THE QUIETEST PLACE · A CITY', 0.3); }
  else if (has(line, 'Rule two', 'wait')) { L1(U, t, 'RULE 2 · FROZEN TIME IS SILENT', 0.2, COL.yellow); }
  else { fx = dog; L1(U, t, 'DAY 2 · NOON', 0.3); }
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz });
  chrome(U, t, info, D(2, '12:04 PM', fz > 0.5 ? ST.stop('3 s') : ST.flow));
};
S.day4 = (U, t, info, tt, k, n, line) => { const B = SET.field(tt); let fz = 0, fx = '', cam = { z: 1.1, cx: 960, cy: 520 };
  const frisbee = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="44" ry="12" fill="#e8452e" stroke="${OL}" stroke-width="3"/>`;
  const dog = (x, y, jump) => `<g transform="translate(${x} ${y - jump})"><ellipse rx="50" ry="24" fill="#c9a06a"/><circle cx="50" cy="-20" r="22" fill="#c9a06a"/><rect x="-40" y="10" width="10" height="34" fill="#c9a06a"/><rect x="30" y="10" width="10" height="34" fill="#c9a06a"/></g>`;
  let ppl = [P(600, 800, P_STAND, 'neutral'), Q(1500, 800, { ...P_STAND, aR: [100, 20] }, FRIEND, 'smile', { flip: true })];
  if (has(line, 'strangest', 'frisbee two', 'let go', 'stop time in a park')) { fz = has(line, 'let go') ? 1 - clamp(t / 0.5) : has(line, 'strangest') ? 0 : 1; ppl[0] = P(900, 800, { ...P_STAND, aR: [100, 30] }, 'smile'); fx = frisbee(f(1000 + (has(line, 'let go') ? 200 : 100 * clamp(t / info.dur))), 560) + dog(1100, 790, 60); }
  else if (has(line, 'jumps for', 'confused')) { ppl[0] = P(900, 800, P_HIPS, 'smile'); fx = frisbee(1200, 560) + dog(1060, 790, has(line, 'confused') ? 0 : 120 * Math.sin(clamp(t / 0.8) * Math.PI)) + (has(line, 'confused') ? `<text x="1110" y="700" font-family="Inter" font-weight="900" font-size="60" fill="#fff">?</text>` : ''); cam = { z: 1.4, cx: 1080, cy: 600 }; }
  else if (has(line, 'nobody else', 'blink')) { ppl.push(...crowd(2, 200, 800)); L1(U, t, 'WITNESSES · 0', 0.3); }
  else if (has(line, 'quarter of a second', 'react')) { L1(U, t, 'HUMAN REACTION · ~0.25 s', 0.2, COL.yellow); cam = { z: 1.3, cx: 1200, cy: 520 }; }
  else if (has(line, 'twenty')) { L1(U, t, '5 s ≈ 20 REACTIONS', 0.2, COL.yellow); fx = Array.from({ length: 20 }, (_, i) => `<rect x="${1180 + (i % 10) * 54}" y="${380 + Math.floor(i / 10) * 60}" width="44" height="44" rx="8" fill="${i < Math.floor(t / info.dur * 22) ? '#ffd23f' : '#2a3460'}"/>`).join(''); }
  else { L1(U, t, has(line, 'Rule three') ? 'RULE 3 · NO GAP, THINGS JUMP' : 'DAY 4 · PARK', 0.2, has(line, 'Rule three') ? COL.yellow : undefined); }
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz });
  chrome(U, t, info, D(4, '4:30 PM', fz > 0.5 ? ST.stop('2 s') : ST.flow));
};
S.day7 = (U, t, info, tt, k, n, line) => { const B = J.track(tt); let fz = 0, fx = '', ppl, cam = { z: 0.9, cx: 1000, cy: 560 };
  const mx = (m) => 300 + m * 50;
  if (has(line, 'running track', 'how far')) { ppl = [P(mx(0), 840, P_STAND, 'neutral')]; L1(U, t, 'DAY 7 · DISTANCE TEST', 0.3); }
  else if (has(line, 'Usain', '9.58', 'ten metres')) { ppl = [Q(mx(0) + clamp(t / info.dur) * 520, 880, run(tt), { top: '#ffd23f', bottom: '#2f9a5a' }, 'neutral', { h: 380 })]; L1(U, t, 'FASTEST MAN · 100 m IN 9.58 s', 0.2, COL.yellow); L2(U, t, 'AVERAGE · ~10 m/s', 1.2); }
  else if (has(line, 'fifty metres', 'even he')) { ppl = [Q(mx(52) - 30, 880, P_HIPS, { top: '#ffd23f', bottom: '#2f9a5a' }, 'smile', { h: 380 })]; fx = `<rect x="${mx(0)}" y="760" width="${mx(52) - mx(0)}" height="12" fill="#ffd23f"/>`; cam = { z: 0.75, cx: 1500, cy: 560 }; L1(U, t, 'IN 5 s · ~52 m (THE BEST EVER)', 0.2, COL.yellow); }
  else if (has(line, 'not Usain', 'run as hard')) { fz = has(line, 'run as hard') ? 1 : 0; ppl = [P(mx(0) + (has(line, 'run as hard') ? clamp(t / info.dur) * 600 : 0), 840, run(tt), 'worried')]; }
  else if (has(line, 'out of breath', 'shoelace')) { ppl = [P(mx(28), 840, P_TIRED, 'worried')]; fx = `<rect x="${mx(0)}" y="760" width="${mx(28) - mx(0)}" height="12" fill="#cfe0ff"/><rect x="${mx(28)}" y="760" width="${mx(52) - mx(28)}" height="12" fill="#ffd23f" opacity="0.4"/>`; cam = { z: 0.85, cx: 1100, cy: 560 }; L1(U, t, 'YOU · MUCH LESS', 0.3, COL.red); }
  else { ppl = [P(mx(28), 840, P_THINK, 'neutral')]; L1(U, t, 'RULE 4 · YOU AREN\'T FASTER', 0.2, COL.yellow); L2(U, t, 'EVERYONE ELSE IS SLOWER', 1.0); cam = { z: 1.3, cx: mx(28) + 200, cy: 560 }; }
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz });
  chrome(U, t, info, D(7, '6:10 AM', fz > 0.5 ? ST.stop('5 s') : ST.flow));
};
S.day11 = (U, t, info, tt, k, n, line) => { const B = SET.bedroom(tt, { time: 'night' }); let fz = 0, fx = '', ppl, cam = { z: 1.2, cx: 960, cy: 560 };
  const tripod = `<path d="M 300 840 L 360 640 L 420 840 M 360 640 L 360 840" stroke="#2a2440" stroke-width="8"/>` + phoneSvg(360, 610, 1.2, 90);
  if (has(line, 'film yourself', 'tripod', 'walk across')) { fz = has(line, 'walk across') ? 1 : 0; ppl = [P(has(line, 'walk across') ? 700 + clamp(t / info.dur) * 600 : 700, 860, has(line, 'walk across') ? walk(tt) : P_STAND, 'neutral')]; fx = tripod; }
  else if (has(line, 'left', 'single frame', 'teleport', 'No blur')) { // the recorded clip, 2 frames side by side
    const g = `<rect width="1920" height="1080" fill="#140f2e"/><rect x="160" y="200" width="760" height="460" rx="16" fill="#2a2650" stroke="${OL}" stroke-width="4"/><rect x="1000" y="200" width="760" height="460" rx="16" fill="#2a2650" stroke="${OL}" stroke-width="4"/>` + [[300, 'FRAME 1'], [1580, 'FRAME 2']].map(([x, l], i) => `<circle cx="${x}" cy="420" r="44" fill="${INK}" stroke="${OL}" stroke-width="4"/><rect x="${x - 36}" y="462" width="72" height="140" rx="20" fill="${HERO.top}"/><text x="${i ? 1380 : 540}" y="700" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="30" fill="#cfe0ff">${l}</text>`).join('') + `<path d="M 940 430 l 40 0" stroke="#ffd23f" stroke-width="8"/><rect width="1920" height="1080" fill="url(#gx)" opacity="0.07"/><defs><pattern id="gx" width="256" height="256" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="256" height="256"/></pattern></defs>`;
    U.svg('flat', g, { z: 2 }); L1(U, t, 'BLUR · 0   IN-BETWEEN · 0', 0.3); chrome(U, t, info, D(11, '11:20 PM')); return; }
  else if (has(line, '2013', 'Darmstadt', 'light still', 'crystal')) { const g = `<rect width="1920" height="1080" fill="#0c1226"/><rect x="560" y="380" width="800" height="300" rx="20" fill="#3a5a9a" opacity="0.4" stroke="#9fd8ff" stroke-width="6"/><path d="M 0 530 L 560 530" stroke="#ff4a3d" stroke-width="12"/><rect x="600" y="500" width="${f(720 * clamp(t / 1.5))}" height="60" fill="#ff4a3d" opacity="0.6"/><text x="960" y="760" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="34" fill="#cfe0ff">LIGHT HELD STILL · UP TO 1 MINUTE</text><text x="960" y="810" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="26" fill="#8a96c0">TU DARMSTADT · 2013</text>`;
    U.svg('flat', g, { z: 2 }); L1(U, t, 'REAL LAB · LIGHT STOPPED', 0.3, COL.yellow); chrome(U, t, info, D(11, '11:25 PM')); return; }
  else { ppl = [P(900, 860, P_THINK, 'neutral')]; fx = tripod; L1(U, t, has(line, 'Rule five') ? 'RULE 5 · CAMERAS SEE ONLY THE JUMP' : 'NOT IMPOSSIBLE · JUST VERY HARD', 0.2, COL.yellow); }
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz });
  chrome(U, t, info, D(11, '11:15 PM', fz > 0.5 ? ST.stop('4 s') : ST.flow));
};
const phoneScreen = (U, t, title, views, comments) => { let g = `<rect width="1920" height="1080" fill="#140f2e"/><rect x="610" y="90" width="700" height="1000" rx="70" fill="#15181e" stroke="${OL}" stroke-width="6"/><rect x="640" y="130" width="640" height="920" rx="44" fill="#f4f6f8"/><rect x="640" y="130" width="640" height="380" rx="44" fill="#3a5ab8"/>`;
  const fr = Math.floor(t * 2) % 2; g += `<rect x="700" y="380" width="520" height="40" fill="#3a3a48"/><circle cx="${fr ? 1120 : 780}" cy="330" r="30" fill="${INK}" stroke="${OL}" stroke-width="3"/><rect x="${fr ? 1100 : 760}" y="358" width="40" height="40" fill="${HERO.top}"/><rect x="900" y="300" width="120" height="70" rx="10" fill="#e8452e"/>`;
  g += `<text x="680" y="560" font-family="Inter" font-weight="900" font-size="34" fill="#15181e">${title}</text><text x="680" y="602" font-family="IBM Plex Mono" font-weight="700" font-size="26" fill="#6a7280">${(views * Math.min(1, t / 1.5)).toFixed(1)}M views</text>`;
  comments.forEach(([who, txt, col], i) => { if (t < 0.4 + i * 0.5) return; const y = 660 + i * 110; g += `<circle cx="700" cy="${y}" r="26" fill="${col}"/><text x="740" y="${y - 6}" font-family="Inter" font-weight="800" font-size="24" fill="#15181e">${who}</text><text x="740" y="${y + 26}" font-family="Inter" font-weight="600" font-size="26" fill="#3a4250">${txt}</text>`; });
  U.svg('flat', g, { z: 2 }); };
S.day18 = (U, t, info, tt, k, n, line) => {
  if (has(line, 'filmed it', 'Glitch Man', 'pedestrian', 'next frame')) { phoneScreen(U, t, '"GLITCH MAN" ON CAMERA?!', 9, []); L1(U, t, 'VIEWS · 9M', 0.3, COL.yellow); chrome(U, t, info, D(18, '9:00 PM')); return; }
  if (has(line, 'comments', 'editing', 'time traveller', 'time stopper')) { phoneScreen(U, t, '"GLITCH MAN" ON CAMERA?!', 9, [['@vfx_guy', 'bad editing lol', '#e8452e'], ['@chrono', 'TIME TRAVELLER confirmed', '#3f6db3'], ['@m4ria', 'how is this real', '#9a5cc0']]); chrome(U, t, info, D(18, '9:05 PM')); return; }
  const B = square(tt); let fz = 0, fx = '', cam = { z: 1.2, cx: 900, cy: 560 }, ppl;
  const casino = `<rect x="1200" y="420" width="560" height="320" fill="#1c1a40"/><rect x="1200" y="400" width="560" height="40" fill="#ffd23f"/><text x="1480" y="430" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#1c1a40">★ CASINO ★</text>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${1260 + i * 110}" cy="390" r="10" fill="${Math.sin(tt * 8 + i) > 0 ? '#ff4a3d' : '#ffd23f'}"/>`).join('')}`;
  if (has(line, 'easy it would be', 'wallet', 'exam', 'card at a casino')) { fz = has(line, 'wallet') ? 1 : 0; ppl = [P(700, 790, P_THINK, 'neutral'), ...crowd(2, 1000, 790)]; fx = casino; if (has(line, 'wallet')) L1(U, t, 'WALLET · EXAM · CARDS', 0.3, COL.red); }
  else if (has(line, 'walk past')) { ppl = [P(500 + t * 120, 790, walk(tt), 'neutral')]; fx = casino; cam = { z: 1.0, cx: 1100, cy: 560 }; }
  else { ppl = [P(900, 790, P_HIPS, 'smile')]; fx = casino; L1(U, t, "RULE 6 · NOT YOURS = NOT YOURS", 0.2, COL.yellow); }
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz });
  chrome(U, t, info, D(18, '10:40 PM', fz > 0.5 ? ST.stop('·') : ST.flow));
};
const SUIT = { top: '#1c1e26', bottom: '#14161c', scarf: '#c8352e' };
S.day25 = (U, t, info, tt, k, n, line) => { let mid = '', fz = 0, fx = '', ppl, cam = { z: 1.2, cx: 1000, cy: 600 };
  const beam = `<line x1="900" y1="560" x2="1500" y2="560" stroke="#ff3b3b" stroke-width="6"/><line x1="900" y1="560" x2="1500" y2="560" stroke="#ff3b3b" stroke-width="22" opacity="0.25"/>`;
  const clocks = Array.from({ length: 8 }, (_, i) => `<circle cx="${1150 + (i % 4) * 140}" cy="${200 + Math.floor(i / 4) * 140}" r="52" fill="#f4f6f8" stroke="${OL}" stroke-width="4"/><line x1="${1150 + (i % 4) * 140}" y1="${200 + Math.floor(i / 4) * 140}" x2="${f(1150 + (i % 4) * 140 + Math.cos(tt * 3 + i) * 38)}" y2="${f(200 + Math.floor(i / 4) * 140 + Math.sin(tt * 3 + i) * 38)}" stroke="#e8452e" stroke-width="5"/>`).join('');
  mid = clocks; ppl = [P(780, 860, P_STAND, 'neutral'), Q(1600, 860, { ...P_STAND, aR: [60, 100] }, SUIT, 'smile', { flip: true, look: -0.6 })];
  if (has(line, 'grey suits', 'Very polite')) L1(U, t, 'VISITORS · GREY SUITS', 0.3);
  else if (has(line, 'laser', 'stopwatches')) { fx = beam; L1(U, t, 'TEST · CROSS THE BEAM', 0.3); }
  else if (has(line, 'step through', 'just appear')) { fz = has(line, 'step through') ? 1 : 0; ppl[0] = P(has(line, 'just appear') ? 1300 : 900 + clamp(t / info.dur) * 400, 860, walk(tt), 'neutral'); fx = beam; }
  else if (has(line, 'again and again', 'longer', 'Five seconds. Six')) { L1(U, t, 'DURATION · 5 → 6 → 7 s', 0.2, COL.yellow); if (has(line, 'Six')) count(U, 5 + Math.min(2, Math.floor(t / (info.dur / 3))), '#ffd23f'); }
  else if (has(line, 'Dio', 'nine seconds', 'Wikipedia')) { L1(U, t, 'CANON · DIO ~9 s (PER WIKIPEDIA)', 0.2, COL.yellow); }
  else if (has(line, 'thirty-nine', 'reach nine')) { count(U, 9, '#ffd23f'); L1(U, t, 'DAY 39 · 9 SECONDS', 0.2, COL.yellow); }
  else { ppl = [Q(1300, 860, { ...P_STAND, aR: [60, 100] }, { top: '#f4f1ea', bottom: '#2a2d3a', hair: 'ponytail' }, 'neutral', { flip: true, extra: (c) => `<rect x="${f(c.hands[1][0] - 50)}" y="${f(c.hands[1][1] - 70)}" width="90" height="120" rx="4" fill="#f4f1ea" stroke="${OL}" stroke-width="3"/>` }), P(780, 860, P_STAND, 'neutral')]; big(U, `<div style="background:#f4f1ea;border:6px solid #b9dcff;border-radius:16px;padding:24px 34px;transform:rotate(-3deg)"><div style="font:800 24px ${MONO};color:#e8452e;letter-spacing:.14em">TEST REPORT</div><div style="${TXT(58, '#15181e')}">Duration:<br/>increasing.</div></div>`, 200, 300); }
  frame(U, SET.lab(tt, { mid }), cam, ppl, fx, { fxIn: true, frozen: fz });
  chrome(U, t, info, D(has(line, 'thirty-nine', 'reach nine', 'Duration') ? 39 : 25, '3:00 PM', fz > 0.5 ? ST.stop('·') : ST.flow));
};
S.day40 = (U, t, info, tt, k, n, line) => { let fz = has(line, 'stop time', 'orange glass', 'grey cotton', 'beautiful', 'stairs', 'youngest', 'Two seconds', 'Nine seconds at a time', 'silent, and yours') ? 1 : 0;
  const B = J.fire(tt, { frozen: fz > 0.5 }); let ppl = [], fx = '', cam = { z: 0.95, cx: 1000, cy: 520 };
  const family = (n2, face = 'open') => Array.from({ length: n2 }, (_, i) => Q(1200 + i * 50, 380, { ...P_STAND, aL: [150, 160], aR: [150, 160] }, { top: ['#e8452e', '#3f6db3', '#2f9a8e'][i], bottom: '#22263a', hair: ['curly', undefined, 'ponytail'][i] }, face, { h: [150, 140, 90][i], flip: true }));
  if (has(line, 'walking home', 'catches fire')) { ppl = [P(400 + t * 80, 880, walk(tt), 'open'), ...family(3)]; L1(U, t, 'DAY 40 · FIRE', 0.3, COL.red); }
  else if (has(line, 'balcony', 'fire escape')) { ppl = family(3); cam = { z: 1.6, cx: 1260, cy: 380 }; L1(U, t, 'FIRE ESCAPE · GONE', 0.3, COL.red); }
  else if (has(line, 'You stop time')) { ppl = [P(500, 880, P_STAND, 'neutral'), ...family(3)]; fx = J.pulse(500, 700, clamp(t / 0.9)); fz = clamp(t / 0.3); }
  else if (has(line, 'orange glass', 'grey cotton', 'beautiful')) { ppl = [P(700, 880, { ...P_STAND, aR: [100, 40] }, 'open'), ...family(3)]; cam = { z: 1.3, cx: 900, cy: 400 }; L1(U, t, 'TIME LEFT · 9 s', 0.2, '#7ab8ff'); }
  else if (has(line, 'stairs', 'youngest', 'Two seconds', 'Three to the ground')) { const c = has(line, 'stairs') ? 4 : has(line, 'youngest') ? 5 : 9; count(U, c); ppl = [P(has(line, 'ground') ? 1000 : 1240, has(line, 'ground') ? 880 : 380, has(line, 'youngest') ? { ...P_STAND, aL: [100, 60], aR: [100, 60] } : walk(tt), 'neutral', { h: has(line, 'ground') ? 360 : 150 }), ...family(has(line, 'youngest', 'ground') ? 2 : 3)]; cam = has(line, 'ground') ? { z: 1.0, cx: 1000, cy: 560 } : { z: 1.6, cx: 1260, cy: 400 }; }
  else if (has(line, 'Time starts', 'screams', 'catch your breath', 'stop it again')) { fz = has(line, 'stop it again') ? clamp(t / 0.3) : 0; ppl = [P(1000, 880, P_TIRED, 'worried'), Q(1100, 880, P_STAND, { top: '#3f6db3', bottom: '#22263a' }, 'open', { h: 160 }), ...crowd(3, 200, 900, 'open')]; if (has(line, 'Time starts')) fx = J.pulse(1000, 700, clamp(t / 0.9), '#ffe0a0'); }
  else { ppl = [P(1000, 880, P_STAND, 'neutral'), Q(1100, 880, P_STAND, { top: '#3f6db3', bottom: '#22263a' }, 'smile', { h: 160 }), Q(1180, 880, P_STAND, { top: '#e8452e', bottom: '#22263a', hair: 'curly' }, 'smile', { h: 170 }), Q(1270, 880, P_STAND, { top: '#2f9a8e', bottom: '#22263a', hair: 'ponytail' }, 'smile', { h: 120 })]; if (has(line, 'whole family')) L1(U, t, 'FAMILY · SAFE', 0.3, '#4fd06a'); if (has(line, 'less than a minute')) L1(U, t, 'OUTSIDE · < 1 MIN', 0.3); if (has(line, 'much longer')) L1(U, t, 'FOR YOU · MUCH LONGER', 0.3, '#7ab8ff'); }
  if (fz > 0.5) fx = B.flames.replace(/opacity="0.75"/g, 'opacity="0.95"') + fx;
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz, fxLive: true });
  chrome(U, t, info, D(40, '11:10 PM', fz > 0.5 ? ST.stop('9 s') : ST.flow));
};
S.cost = (U, t, info, tt, k, n, line) => { let B, fz = 0, ppl, cam = { z: 1.3, cx: 960, cy: 560 }, fx = '';
  if (has(line, 'coffee', 'laugh', 'freeze this', 'walk around it', "You don't", 'Rule seven', 'share')) { B = J.cafe(tt); const laugh = { ...P_STAND, head: Math.sin(tt * 10) * 6 };
    ppl = [P(780, 860, has(line, 'Rule seven') ? P_STAND : { ...P_STAND, aR: [60, 40] }, has(line, 'Rule seven', 'share') ? 'smile' : 'neutral'), Q(1140, 860, has(line, 'laugh') ? laugh : P_STAND, FRIEND, has(line, 'laugh', "You don't", 'share') ? 'smile' : 'neutral', { flip: true, look: -0.6 })]; cam = { z: 1.5, cx: 960, cy: 600 };
    if (has(line, 'freeze this', 'walk around')) fz = 0.35;
    if (has(line, 'Rule seven')) L1(U, t, 'RULE 7 · SHARE THE MOMENT', 0.2, COL.yellow); if (has(line, "You don't")) L1(U, t, 'TIME · LEFT RUNNING', 0.2, '#4fd06a'); }
  else { B = SET.bedroom(tt, { time: 'dawn' }); ppl = [P(900, 860, P_THINK, 'neutral')];
    if (has(line, 'heart beats', 'older')) { L1(U, t, 'YOU · STILL AGEING', 0.2); fz = 0.6; }
    if (has(line, 'hours', 'forty days')) { L1(U, t, 'EXTRA TIME LIVED · HOURS', 0.2, '#7ab8ff'); L2(U, t, 'SHARED WITH · NOBODY', 1.2, COL.red); }
    if (has(line, 'alone', 'silent city')) { fz = 0.8; cam = { z: 0.9, cx: 960, cy: 520 }; } }
  frame(U, B, cam, ppl, fx, { fxIn: true, frozen: fz });
  chrome(U, t, info, D(41, '10:30 AM'));
};
S.ending = (U, t, info, tt, k, n, line) => { const B = J.balcony(tt); frame(U, B, { z: 0.95, cx: 960, cy: 560 }, [P(820, 880, P_STAND, 'smile')], phoneSvg(1000, 640, 1, 0), { fxIn: true });
  big(U, `<div style="${TXT(84)};text-shadow:0 8px 0 #000;max-width:1100px">${has(line, 'comments', 'never stop') ? 'Which moment would you never stop?' : 'What would you do with five seconds?'}</div>`, 160, 300);
  chrome(U, t, info, { day: 41, time: 'NOW', status: { text: 'YOUR TURN', on: true, color: COL.yellow } });
};

const BG = { open: '#5a8ad8', day1: '#f2d58a', day2: '#4a8ae0', day4: '#ff9a8a', day7: '#ff9a8a', day11: '#2a2650', day18: '#140f2e', day25: '#1c2438', day40: '#0c0a2a', cost: '#6a3a3a', ending: '#5a8ad8' };
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line));
