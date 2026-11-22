// "What If You Woke Up With a Domain Expansion in Real Life?" — flat 2D (same look as the Megumi / Yuta videos). Shots come
// from PLAN (story sections); each section draws by keywords in the narration line. The barrier is our own design: a red
// dome that closes from the ground up with a swirl at the top; the hero's invented technique (OUR RULE) is thin red threads
// that tie everything inside to them. Red (barrier, threads) against cyan (the hoodie). Small seals in the top-left corner
// say CANON / OUR RULE / OUR GUESS while the narration says the matching sentence (TAGS, timed from the voice).
// Every block has its own place; the bedroom only appears on day 41 and the rooftop returns at the end.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_STAND, P_THINK, P_TIRED, P_PHONE, P_SIT, P_RUN, P_SHRUG, P_PRESENT } from '../lib/people.js';
import { hud, label, caption, COL } from '../lib/hud.js';
import { frame as frame0 } from '../lib/flat2d.js';
import * as SET from '../lib/sets/saitama2d.js';
import * as J from '../lib/sets/jojo2d.js';
import * as K from '../lib/sets/kil2d.js';
import * as SP from '../lib/sets/sp2d.js';
import * as Y from '../lib/sets/yt2d.js';
import * as E from '../lib/sets/de2d.js';
import { PLAN, TAGS } from './plan.js';

const f = (n) => n.toFixed(1);
const RED = E.RED, CYAN = E.CYAN, GOLD = '#ffd23f', VIO = '#b48cff';
const HERO = { top: CYAN, bottom: '#1c2a3a', hair: 'short', hood: true, broad: true };
const BOSS = { top: '#3a4a6a', bottom: '#22263a', hair: 'short', broad: true };
const INTERN = { top: '#ffd23f', bottom: '#22263a', hair: 'ponytail' };
const SUIT = { top: '#2a2d3a', bottom: '#2a2d3a', hair: 'short', broad: true };
const STAFF = { top: '#4fd06a', bottom: '#22263a', hair: 'curly' };
const BOY = { top: '#ff8a3a', bottom: '#22263a', hair: 'short' };
const TEACH = { top: '#e8e0f0', bottom: '#9a5cc0', hair: 'ponytail' };
const THIEF = { top: '#3a3f4a', bottom: '#22263a', hood: true, broad: true };
const CROWD = [{ top: '#ff8a3a', bottom: '#22263a', hair: 'short' }, { top: '#3fb8e0', bottom: '#22263a', hair: 'ponytail' }, { top: '#9a5cc0', bottom: '#22263a', hair: 'curly' }, { top: '#4fd06a', bottom: '#22263a', hair: 'short' }, { top: '#e05a8a', bottom: '#22263a', hair: 'ponytail' }, { top: '#e0b44a', bottom: '#22263a', hair: 'short' }];
const KIDC = ['#ff8a3a', '#3fb8e0', '#9a5cc0', '#4fd06a', '#e05a8a', '#ffd23f', '#e8452e', '#2f86e0'];
const TITLE = 'WHAT IF YOU HAD A DOMAIN EXPANSION?';
const ST = (on = false, txt) => ({ text: txt || (on ? 'DOMAIN · OPEN' : 'DOMAIN · CLOSED'), on, color: RED });
const chrome = (U, t, info, d) => { hud(U, { title: TITLE, ...d }); caption(U, info, t); };
const LX = (txt) => Math.min(1180, 1840 - txt.length * 24 - 70);
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 260, c ? { color: c } : {});
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const since = (sec, ...w) => { let best = 1e9; for (const p of Object.values(PLAN)) if (p.sec === sec && has(p.line, ...w)) best = Math.min(best, p.k); return best; };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const run = (tt) => { const s = Math.sin(tt * 9); return { ...P_RUN, aL: [50 + s * 40, 80], aR: [40 - s * 40, 110], lL: [30 + s * 30, 40], lR: [-10 - s * 30, 10] }; };
const ARMS = { ...P_STAND, aL: [100, 10], aR: [100, 10] };
const HOLD = { ...P_STAND, lean: 4, aL: [120, 30], aR: [120, 30], lL: [14, 4], lR: [14, 4] };
const HEAD = { ...P_STAND, aL: [150, 150], aR: [150, 150], head: 14 };
const EAT = { ...P_STAND, aR: [40, 150], head: 4 };
const LEAN = { ...P_STAND, lean: -8, aL: [30, 20], aR: [30, 20] };
const LOTUS = { ...P_SIT, aL: [30, 60], aR: [30, 60] };
const THROW = { ...P_STAND, lean: 6, aR: [140, 30] };
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5 });
const Q = (x, y, pose, outfit, face = 'neutral', o = {}) => ({ x, y, h: o.h || 340, pose, outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5 });
const D = (day, time, status) => ({ day, time, status });
const head = (p) => [p.x, p.y - (p.h || 340) * 0.86];
const chest = (p) => [p.x, p.y - (p.h || 340) * 0.6];
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
let FULLED = false;
const full = (U, svg) => { FULLED = true; return U.svg('card', svg, {}, { z: 3 }); };
let CUT = 'wide';
const frame = (U, B, cam, ppl, fx, o) => { if (CUT === 'close' && ppl && ppl[0]) { const h = ppl[0]; cam = { z: Math.max(cam.z * 1.9, 2.3), cx: h.x + (h.flip ? -30 : 30), cy: h.y - (h.h || 360) * 0.72 }; } return frame0(U, B, cam, ppl, fx, o); };
const KCOL = { open: ['#120408', RED], kitchen: ['#f2d58a', RED], size: ['#2a3048', CYAN], meeting: ['#e4e0d8', RED], incomplete: ['#bcd4da', RED], market: ['#3fb8e0', '#ffffff'], notice: ['#3a3f6a', GOLD], yoga: ['#efe6d8', VIO], station: ['#15181e', RED], openup: ['#120408', GOLD], apology: ['#6a3a3a', GOLD], car: ['#0e1430', RED], rehearsal: ['#0c1230', CYAN], storm: ['#2a2f40', RED], cost: ['#c8d4e4', '#15181e'] };
const kin = (U, t, line, sec) => { const [bg, ac] = KCOL[sec] || ['#15181e', GOLD]; const words = line.replace(/["“”]/g, '').split(/\s+/).filter(Boolean);
  let key = 0, len = 0; words.forEach((w, i) => { const n = w.replace(/[^\w]/g, '').length; if (n > len) { len = n; key = i; } });
  const k = clamp(t / 0.25), dark = ['#f2d58a', '#e4e0d8', '#bcd4da', '#efe6d8', '#c8d4e4'].includes(bg);
  U.svg('card', `<rect width="1920" height="1080" fill="${bg}"/>${[...Array(9)].map((_, i) => `<rect x="${-200 + i * 260 + (t * 40) % 260}" y="0" width="120" height="1080" fill="${dark ? '#000' : '#fff'}" opacity="0.035" transform="skewX(-12)"/>`).join('')}`, {}, { z: 3 });
  U.html('big', `<div style="width:1500px;transform:scale(${f(0.92 + 0.08 * ease.out(k))});transform-origin:left center;opacity:${f(k)};${TXT(words.length > 9 ? 96 : 118, dark ? '#15181e' : '#ffffff')};text-transform:uppercase">${words.map((w, i) => i === key ? `<span style="color:${ac === '#15181e' ? RED : ac}">${w}</span>` : w).join(' ')}</div>`, { left: '200px', top: '330px' }, { z: 50 });
  U.html('L1', '', {}); U.html('cap', '', {}); };
// lore card (CANON facts only): title + up to three short lines; art = optional svg on the right
const lore = (U, t, title, lines, art = '', col = GOLD) => { const k = clamp(t / 0.4);
  full(U, `<rect width="1920" height="1080" fill="#14060a"/>${art}`);
  big(U, `<div style="opacity:${f(k)};max-width:1000px"><div style="font:800 34px 'IBM Plex Mono';color:${col};letter-spacing:.08em">IN THE STORY · JUJUTSU KAISEN</div><div style="${TXT(92)};margin:18px 0 26px">${title}</div>${lines.map((l, i) => `<div style="font:700 40px Inter;color:#f2e6e6;margin:10px 0;opacity:${f(clamp((t - 0.4 - i * 0.5) / 0.3))}">· ${l}</div>`).join('')}</div>`, 160, 250); };
const bigNum = (U, t, num, unit, sub, src, col = GOLD) => { const k = clamp(t / 0.5);
  full(U, `<rect width="1920" height="1080" fill="#14060a"/>`);
  big(U, `<div style="text-align:center;width:1600px;opacity:${f(k)}"><div style="${TXT(230, col)}">${num}<span style="font-size:110px;color:#fff"> ${unit}</span></div><div style="font:800 48px Inter;color:#fff;margin-top:24px">${sub}</div><div style="font:700 28px 'IBM Plex Mono';color:#a89aa0;margin-top:20px">${src}</div></div>`, 160, 300); };
const lesson = (U, t, n, txt) => L1(U, t, `LESSON ${n} · ${txt}`, 0.2, COL.yellow);
const clock = (U, t, info, day = 1) => { const kk = clamp(t / 0.4); full(U, `<rect width="1920" height="1080" fill="#06050f"/><rect x="560" y="300" width="800" height="440" rx="40" fill="#160a10" stroke="#481820" stroke-width="10"/><text x="960" y="610" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="250" fill="${RED}" opacity="${f(kk)}">11:20</text><text x="1310" y="400" text-anchor="end" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="${RED}" opacity="0.7">PM</text>`); chrome(U, t, info, D(day, '11:20 PM', ST(true))); };
const card2 = (U, t, info, d, head1, sub, col = RED) => { const k = clamp(t / 0.3); full(U, `<rect width="1920" height="1080" fill="#0c0306"/>${E.dome(960, 1080, 900, 1, t + 3, { op: 0.55 })}`);
  big(U, `<div style="text-align:center;width:1600px;opacity:${f(k)};transform:scale(${f(0.9 + 0.1 * ease.out(k))})"><div style="${TXT(200, col)};text-shadow:0 10px 0 #000">${head1}</div><div style="font:900 56px Inter;color:#fff;margin-top:26px;letter-spacing:.02em">${sub}</div></div>`, 160, 330); chrome(U, t, info, d); };
const phoneCard = (U, t, info, d) => { let g = `<rect width="1920" height="1080" fill="#3a3f6a"/><rect x="560" y="60" width="800" height="960" rx="60" fill="#1c1e26"/><rect x="590" y="110" width="740" height="860" rx="20" fill="#f4f6f8"/>`;
  g += `<rect x="620" y="140" width="680" height="300" rx="14" fill="#2a2f50"/>${E.dome(960, 420, 200, 1, t + 2, { op: 0.9 })}<rect x="860" y="330" width="200" height="90" fill="#c87a4a"/><text x="640" y="180" font-family="IBM Plex Mono" font-weight="800" font-size="26" fill="#fff">0:09</text>`;
  [["it's an effect", 0], ['glitch in the sky??', 1], ['effect. obviously', 2], ['the sky was RED', 3]].forEach(([c, i]) => { const on = clamp((t - i * 0.35) / 0.3); g += `<g opacity="${f(on)}"><circle cx="660" cy="${520 + i * 115}" r="30" fill="${CROWD[i].top}"/><rect x="705" y="${484 + i * 115}" width="590" height="76" rx="20" fill="#e4e8ee"/><text x="730" y="${533 + i * 115}" font-family="Inter" font-weight="800" font-size="34" fill="#2a2d3a">${c}</text></g>`; });
  full(U, g); chrome(U, t, info, d); };
// a thought bubble over (x, y) with an icon svg inside
const bubble = (x, y, inner, k = 1, s = 1) => k <= 0 ? '' : `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s * ease.out(clamp(k)))})"><circle cx="-40" cy="70" r="10" fill="#fff"/><circle cx="-20" cy="44" r="16" fill="#fff"/><ellipse cx="0" cy="-40" rx="110" ry="70" fill="#fff" stroke="#15181e" stroke-width="4"/>${inner}</g>`;
const ICON = { chart: `<rect x="-60" y="-20" width="24" height="40" fill="#3fb8e0"/><rect x="-24" y="-50" width="24" height="70" fill="#e0b44a"/><rect x="12" y="-36" width="24" height="56" fill="#4fd06a"/>`, panic: `<text x="0" y="-10" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="${RED}">!!</text>`, sandwich: `<path d="M -60 -10 L 60 -10 L 0 -70 Z" fill="#e0b44a"/><rect x="-60" y="-12" width="120" height="12" fill="#4fd06a"/><rect x="-60" y="0" width="120" height="14" fill="#e0b44a"/>`, cake: `<rect x="-50" y="-40" width="100" height="56" rx="8" fill="#e05a8a"/><rect x="-50" y="-40" width="100" height="14" fill="#fff"/><rect x="-4" y="-72" width="8" height="30" fill="#ffd23f"/><ellipse cx="0" cy="-78" rx="6" ry="10" fill="#ff8a3a"/>` };

const S = {};
// cold open: the rooftop at 11:20 p.m., the red dome closing over the city, the hero from behind with arms open
const roofShot = (U, t, info, tt, line, k0, k1, o = {}) => { const B = E.cityRoof(tt, { red: o.red ?? 0.5 }); const FL = B.FLOOR, kd = k0 + (k1 - k0) * ease.inOut(clamp(t / Math.max(1.2, info.dur * 0.85)));
  B.back += E.dome(1000, B.base + 20, o.R || 980, kd, tt, { ry: 0.62, op: 1 });
  const fx = E.backHero(960, FL + 40, 520, o.arms ?? clamp(t / 0.8), tt);
  frame(U, B, o.cam || { z: 1.0, cx: 960, cy: 520 }, [], fx, { fxIn: true }); };
S.open = (U, t, info, tt, k, n, line) => {
  if (has(line, 'from Jujutsu Kaisen')) { roofShot(U, t, info, tt, line, 0.05, 0.45); L1(U, t, 'DOMAIN EXPANSION · JUJUTSU KAISEN', 0.1, RED); chrome(U, t, info, D(1, '11:20 PM', ST(true))); return; }
  if (has(line, 'barrier that closes', 'impossible to miss')) { roofShot(U, t, info, tt, line, 0.45, 1); L1(U, t, 'A BARRIER · NOTHING INSIDE CAN BE MISSED', 0.4, RED); chrome(U, t, info, D(1, '11:20 PM', ST(true))); return; }
  if (has(line, 'whole block', 'can leave')) { roofShot(U, t, info, tt, line, 1, 1, { cam: { z: 0.9, cx: 960, cy: 460 }, R: 1150, red: 0.8 }); L1(U, t, 'NOBODY INSIDE CAN LEAVE', 0.3, RED); chrome(U, t, info, D(1, '11:21 PM', ST(true))); return; }
  if (has(line, 'only rule', 'No escape', 'Including you')) { card2(U, t, info, D(1, '11:21 PM', ST(true)), 'NO ESCAPE.', has(line, 'Including') ? 'FOR ANYONE. <span style="color:#2fd8ee">INCLUDING YOU.</span>' : 'FOR ANYONE.'); return; }
  if (has(line, 'storm', 'two hundred children')) { const B = E.school(tt); B.back += E.dome(960, B.FLOOR + 20, 1100, 1, tt, { ry: 0.6 }); let fx = ''; for (let i = 0; i < 30; i++) fx += E.kid(260 + (i % 15) * 100, B.FLOOR + 40 + Math.floor(i / 15) * 90, 0.9, KIDC[i % 8], 0); fx += E.trampoline(-300 + ((tt * 600) % 2600), 260, tt * 120, 0.8);
    frame(U, B, { z: 1.0, cx: 960, cy: 520 }, [], fx, { fxIn: true }); L1(U, t, 'DAY 40 · 200 CHILDREN · A STORM', 0.2, COL.yellow); chrome(U, t, info, D(40, '2:10 PM', ST(true))); return; }
  if (has(line, 'eleven twenty') && t < 1.4) { clock(U, t, info); return; }
  roofShot(U, t, info, tt, line, 0.3, 0.9, { cam: { z: 1.15, cx: 960, cy: 480 } }); L1(U, t, 'THE RED DOME · ALREADY CLOSING', 0.3, RED); chrome(U, t, info, D(1, '11:20 PM', ST(true)));
};
// 11:20 p.m., the kitchen: what a domain is (CANON), your technique = red threads (OUR RULE), the neighbour's cat
S.kitchen = (U, t, info, tt, k, n, line) => {
  if (has(line, "isn't a spell", 'innate domain')) { lore(U, t, 'DOMAIN EXPANSION', ["THE USER'S INNATE DOMAIN, BUILT INSIDE A BARRIER", 'FILLED WITH THEIR INNATE TECHNIQUE'], E.dome(1540, 900, 330, 1, tt)); chrome(U, t, info, D(1, '11:22 PM', ST(true))); return; }
  const B = J.kitchen(tt); const FL = B.FLOOR || 840; let cam = { z: 1.05, cx: 960, cy: 520 };
  const CAT = since('kitchen', "neighbour's cat", 'cat is in'), hero = P(820, FL, has(line, 'furious', 'ankle') ? P_SHRUG : ARMS, k >= CAT ? 'worried' : 'neutral', { look: 0.7 });
  B.back += E.dome(960, FL + 10, 1050, 1, tt, { ry: 0.75, op: 0.7 });
  const objs = [[1300, FL - 300], [1500, FL - 420], [420, FL - 360], [200, FL - 200], [1650, FL - 180]];
  let fx = E.threads(chest(hero), objs, tt, { k: has(line, "don't have a technique") ? clamp(t / 1.2) : 1 });
  if (k >= CAT) { const cx = 1060 + Math.sin(tt * 7) * (has(line, 'furious') ? 30 : 8); fx += E.cat(cx, FL, 0.9, tt, { flip: true }) + E.threads([830, FL - 20], [[cx + 20, FL - 50]], tt, { w: 3 }); }
  if (has(line, "don't have a technique", 'decides for you')) L1(U, t, 'YOUR TECHNIQUE · RED THREADS', 0.3, RED);
  if (has(line, "can't walk out")) { cam = { z: 1.2, cx: 1100, cy: 480 }; L1(U, t, "INSIDE THE DOME · CAN'T WALK OUT", 0.2, RED); }
  if (has(line, "neighbour's cat", 'never liked')) { cam = { z: 1.5, cx: 980, cy: 680 }; L1(U, t, 'THE NEIGHBOUR\'S CAT · NOT A FAN', 0.3); }
  if (has(line, 'ankle', 'furious')) { cam = { z: 1.8, cx: 960, cy: 720 }; L1(U, t, 'TIED · TO YOUR ANKLE', 0.3, RED); }
  if (has(line, "attack can't miss", 'neither can the thread')) { cam = { z: 1.0, cx: 960, cy: 500 }; L1(U, t, 'SURE-HIT · EVERY THREAD LANDS', 0.3, RED); }
  if (has(line, 'Lesson')) lesson(U, t, 1, 'THE BARRIER CLOSES AROUND EVERYONE');
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(1, '11:24 PM', ST(true)));
};
// 7:10 a.m.: the size (flat → stairwell → building), the lift stuck between floors with the man in the suit
const building = (U, t, info, tt, kd, label1) => { let g = `<rect width="1920" height="1080" fill="#8ab4d8"/><rect x="0" y="900" width="1920" height="180" fill="#6a7a8a"/><rect x="640" y="200" width="640" height="700" fill="#c8a07a"/>`;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) g += `<rect x="${680 + c * 150}" y="${240 + r * 110}" width="100" height="70" fill="#bfe4ff"/>`;
  g += `<rect x="900" y="800" width="120" height="100" fill="#5a3a2a"/>`; const R = [0, 150, 280, 520][kd], cy = [0, 560, 650, 900][kd];
  if (kd) g += E.dome(960, cy + (kd === 3 ? 0 : 60), R, 1, tt, { ry: kd === 3 ? 1.35 : 1, op: 0.9 }); full(U, g); L1(U, t, label1, 0.2, RED); chrome(U, t, info, D(2, '7:10 AM', ST(true))); };
S.size = (U, t, info, tt, k, n, line) => {
  if (has(line, 'stairwell')) { building(U, t, info, tt, 2, 'SIZE · THE STAIRWELL'); return; }
  if (has(line, 'whole building')) { building(U, t, info, tt, 3, 'SIZE · THE WHOLE BUILDING · 10 SECONDS'); return; }
  if (has(line, 'size of your flat')) { building(U, t, info, tt, t < info.dur * 0.35 ? 1 : t < info.dur * 0.65 ? 2 : 3, t < info.dur * 0.35 ? 'SIZE · YOUR FLAT' : t < info.dur * 0.65 ? 'SIZE · THE STAIRWELL' : 'SIZE · THE WHOLE BUILDING'); return; }
  if (has(line, 'range grows', 'want it to')) { building(U, t, info, tt, 1 + Math.min(2, Math.floor(t / 0.9)), 'RANGE = HOW MUCH YOU WANT IT?'); return; }
  if (has(line, 'try it again')) { building(U, t, info, tt, 1, 'TRYING · ON PURPOSE'); return; }
  const B = K.lift(tt); const FL = B.FLOOR || 860; let cam = { z: 1.15, cx: 960, cy: 520 };
  const hero = P(760, FL, P_STAND, 'worried', { look: 0.8 }), man = Q(1180, FL, has(line, 'leans', 'says nothing') ? LEAN : P_STAND, SUIT, 'worried', { flip: true, look: has(line, 'shoes') ? 0.2 : -0.6 });
  B.back += E.dome(960, FL + 10, 760, 1, tt, { ry: 0.9, op: 0.6 });
  const fx = E.threads(chest(hero), [chest(man), [1500, FL - 500], [400, FL - 520]], tt);
  if (has(line, 'stops between')) L1(U, t, 'THE LIFT · STUCK BETWEEN FLOORS', 0.3);
  if (has(line, 'stares at the red')) { cam = { z: 1.6, cx: 1150, cy: 470 }; L1(U, t, 'HE SEES THE THREADS', 0.3, RED); }
  if (has(line, 'leans on the wall', 'says nothing')) { cam = { z: 1.4, cx: 1150, cy: 520 }; L1(U, t, 'VERY · CAREFULLY', 0.3); }
  if (has(line, 'Lesson')) lesson(U, t, 2, 'BIGGER ISN\'T BETTER. JUST A BIGGER APOLOGY');
  frame(U, B, cam, [hero, man], fx, { fxIn: true }); chrome(U, t, info, D(2, '7:40 AM', ST(true)));
};
// 12:30 p.m.: the budget meeting, eight threads, Simple Domain (CANON) that nobody has (OUR RULE), feeling everyone
S.meeting = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Simple Domain can neutralise')) { lore(U, t, 'SIMPLE DOMAIN', ["IT CAN NEUTRALISE A DOMAIN'S GUARANTEED HIT"], `<circle cx="1540" cy="560" r="200" fill="none" stroke="#bfe4ff" stroke-width="10" stroke-dasharray="30 18"/>`); chrome(U, t, info, D(1, '12:31 PM', ST(true))); return; }
  const B = Y.meeting(tt, { k: 0.4 }); const FL = B.FLOOR; let cam = { z: 1.05, cx: 960, cy: 520 };
  const xs = [240, 470, 700, 1220, 1450, 1680, 1880], ppl = [P(960, FL, has(line, 'nervous') ? P_TIRED : P_STAND, 'worried', { look: 0.3 })];
  xs.forEach((x, i) => ppl.push(Q(x, FL, i === 3 ? P_PRESENT : P_STAND, i === 3 ? BOSS : i === 1 ? INTERN : CROWD[i % 6], i === 1 && has(line, 'feel all', 'panic') ? 'worried' : 'neutral', { flip: x > 960, h: 320 })));
  let mid = `<rect x="160" y="${FL - 170}" width="1800" height="30" rx="10" fill="#8a5a3a"/>`; B.mid = mid + (B.mid || '');
  const open = !has(line, 'starts a meeting');
  if (open) B.back += E.dome(1000, FL + 10, 1050, has(line, 'thin dome') ? clamp(t / 1.2) : 1, tt, { ry: 0.6, op: 0.8 });
  let fx = open ? E.threads(chest(ppl[0]), ppl.slice(1).map(head), tt, { k: has(line, 'Eight red') ? clamp(t / 1) : 1 }) : '';
  if (has(line, 'feel all', 'budget numbers', 'sandwich')) { fx += bubble(1220, FL - 450, ICON[has(line, 'sandwich') ? 'sandwich' : 'chart'], clamp(t / 0.4), 0.8) + bubble(470, FL - 450, ICON.panic, clamp((t - 0.4) / 0.4), 0.8); cam = { z: 1.1, cx: 900, cy: 440 }; }
  if (has(line, 'starts a meeting')) L1(U, t, 'THE BUDGET MEETING', 0.3);
  if (has(line, 'Eight people')) L1(U, t, '8 PEOPLE · 8 RED THREADS', 0.3, RED);
  if (has(line, 'nobody has a Simple')) L1(U, t, 'IN REAL LIFE · NO SIMPLE DOMAIN', 0.3, RED);
  if (has(line, 'every thread lands')) L1(U, t, 'EVERY THREAD LANDS', 0.3, RED);
  if (has(line, 'sandwich')) L1(U, t, 'THE BOSS · THINKING ABOUT A SANDWICH', 0.4);
  if (has(line, 'Lesson')) lesson(U, t, 3, 'BEING CAREFUL IS THEIR ONLY DEFENCE');
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(1, '12:30 PM', ST(open)));
};
// day 3, the bathroom: incomplete domains fail (CANON), bathtub-size works, shed-size flickers, a whole loaf of bread
S.incomplete = (U, t, info, tt, k, n, line) => {
  if (has(line, 'incomplete domain loses') || line.trim() === 'In the story,') { lore(U, t, 'AN INCOMPLETE DOMAIN', ['IT LOSES THE GUARANTEED HIT'], E.dome(1540, 900, 330, 1, tt, { flicker: true })); chrome(U, t, info, D(3, '9:00 AM', ST())); return; }
  if (has(line, 'immense amount')) { lore(U, t, 'THE COST', ['A DOMAIN TAKES AN IMMENSE AMOUNT OF CURSED ENERGY'], E.bread(1540, 700, 2.2)); chrome(U, t, info, D(3, '9:20 AM', ST())); return; }
  const B = E.bath(tt); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 520 };
  const bread = has(line, 'loaf', 'Starving'), hero = P(bread ? 760 : 700, FL, bread ? EAT : ARMS, bread ? 'open' : 'neutral', { look: 0.8 });
  let fx = '';
  if (has(line, 'bathtub works', 'size of a bathtub')) { B.mid += E.dome(1340, FL + 4, 420, clamp(t / 0.8), tt, { ry: 0.8 }); L1(U, t, 'BATHTUB SIZE · COMPLETE', 0.3, '#4fd06a'); }
  if (has(line, 'shed')) { B.back += E.dome(960, FL + 10, 980, 1, tt, { ry: 0.7, flicker: true }); fx += E.threads(chest(hero), [[1340, FL - 260], [400, FL - 420]], tt, { slack: 1, op: 0.6 }); cam = { z: 1.0, cx: 960, cy: 480 }; L1(U, t, 'SHED SIZE · FLICKERS · FAILS', 0.3, RED); }
  if (has(line, 'stop trying', 'practise')) { B.mid += E.dome(1340, FL + 4, 420, 1, tt, { ry: 0.8, op: 0.6 }); L1(U, t, 'PRACTICE · SMALL ONES', 0.3); }
  if (bread) { fx += E.bread(1000, FL - 300, 0.7, clamp(t / info.dur)) + E.bread(1020, FL - 10, 0.6, 1); cam = { z: 1.5, cx: 900, cy: 520 }; L1(U, t, has(line, 'Starving') ? 'NOT HUNGRY · STARVING' : 'A WHOLE LOAF', 0.3, GOLD); }
  if (has(line, 'Lesson')) lesson(U, t, 4, 'SMALL AND COMPLETE BEATS BIG AND BROKEN');
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(3, '9:10 AM', ST(!bread)));
};
// day 6, the supermarket: a full one for forty seconds, sitting by the frozen peas, a thread still tied to a trolley
S.market = (U, t, info, tt, k, n, line) => {
  const B = SP.aisle(tt); const FL = B.FLOOR || 830; let cam = { z: 1.05, cx: 960, cy: 520 };
  const SITK = since('market', 'legs go', 'frozen peas'), down = k >= SITK;
  const hero = P(900, FL, down ? P_SIT : ARMS, down ? 'worried' : 'neutral', { look: 0.6 }), ppl = [hero];
  if (has(line, 'employee', 'doctor')) ppl.push(Q(1260, FL, P_PRESENT, STAFF, 'worried', { flip: true }));
  const on = !down || has(line, 'passed out');
  if (on) B.back += E.dome(960, FL + 10, 1100, has(line, 'open a full one') ? clamp(t / 1.2) : 1, tt, { ry: 0.6, flicker: has(line, 'passed out') });
  let fx = SP.trolley(1450, FL, 0.9);
  if (on || has(line, 'trolley')) fx += E.threads(chest(hero), [[1500, FL - 140], [300, FL - 400], [1700, FL - 500]], tt, { slack: has(line, 'passed out') ? 0.6 : 0 });
  if (has(line, 'forty seconds')) { const s = Math.min(40, Math.floor(t / info.dur * 40) + 1); L1(U, t, `HOLDING · ${s}s / 40s`, 0.1, RED); }
  if (has(line, 'frozen peas', 'legs go')) { cam = { z: 1.3, cx: 900, cy: 600 }; L1(U, t, 'IN FRONT OF THE FROZEN PEAS', 0.3); }
  if (has(line, 'doctor')) L1(U, t, '"DO YOU NEED A DOCTOR?"', 0.3);
  if (has(line, 'passed out')) { cam = { z: 1.4, cx: 1300, cy: 560 }; L1(U, t, 'STILL TIED · TO A TROLLEY', 0.3, RED); }
  if (has(line, 'Lesson')) lesson(U, t, 5, 'THE BILL COMES AFTER THE SHOW');
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(6, '6:10 PM', ST(on)));
};
// day 10: a boy films a red dome over a corner shop; the comments
S.notice = (U, t, info, tt, k, n, line) => {
  if (has(line, 'video spreads', 'comments')) { phoneCard(U, t, info, D(10, '9:00 PM', ST())); return; }
  const B = E.cornerShop(tt); const FL = B.FLOOR; let cam = { z: 1.0, cx: 960, cy: 520 };
  const dk = has(line, 'nine seconds') ? (t < info.dur * 0.7 ? 1 : 0) : 1;
  if (dk) B.back += E.dome(960, FL + 10, 700, 1, tt, { ry: 1.05 });
  const boy = Q(1640, FL, P_PHONE, BOY, 'open', { flip: true, look: -0.8 }), ppl = [boy];
  if (has(line, 'Nobody says', 'joke')) ppl.unshift(P(420, FL, P_STAND, 'neutral', { look: 0.6 }));
  if (has(line, 'films a red dome')) L1(U, t, 'A RED DOME · OVER A CORNER SHOP', 0.3, RED);
  if (has(line, 'nine seconds')) L1(U, t, dk ? 'LASTED · 9 SECONDS' : 'GONE', 0.2, RED);
  if (has(line, 'Nobody says')) L1(U, t, 'NOBODY SAYS "DOMAIN"', 0.3);
  if (has(line, 'Lesson')) lesson(U, t, 6, "THE ONES WHO'D UNDERSTAND WOULD NEVER BELIEVE IT");
  frame(U, B, cam, ppl, '', { fxIn: true }); chrome(U, t, info, D(10, '5:30 PM', ST()));
};
// day 12, the yoga studio: eleven threads tie on, the teacher's slides off; she opens one eye and smiles
S.yoga = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Simple Domain can cancel')) { lore(U, t, 'SIMPLE DOMAIN', ["IT CAN CANCEL A DOMAIN'S GUARANTEED HIT"], `<circle cx="1540" cy="560" r="200" fill="none" stroke="#bfe4ff" stroke-width="10" stroke-dasharray="30 18"/>`); chrome(U, t, info, D(12, '7:05 PM', ST(true))); return; }
  const B = E.yoga(tt); const FL = B.FLOOR; let cam = { z: 1.05, cx: 960, cy: 520 };
  const teacher = Q(960, FL + 20, LOTUS, TEACH, has(line, 'opens one eye', 'smiles') ? 'smile' : 'neutral', { h: 330, look: 0 }), hero = P(1700, FL + 40, LOTUS, 'worried', { flip: true, look: -0.6, h: 340 });
  const st = [260, 480, 1300, 1480].map((x, i) => Q(x, FL + 40, LOTUS, CROWD[i], 'neutral', { h: 300, flip: x > 960 }));
  const open = !has(line, 'go to a yoga');
  if (open) B.back += E.dome(1000, FL + 10, 1050, has(line, 'close a small dome') ? clamp(t / 1) : 1, tt, { ry: 0.65, op: 0.7 });
  let fx = '';
  if (open && !has(line, 'close a small dome', 'sits cross-legged')) { fx += E.threads(chest(hero), st.map(head), tt); const SL = has(line, 'twelfth', 'slides off') ? clamp(t / 1.2) : has(line, 'Eleven') ? 0 : 1; if (SL < 1) fx += E.threads(chest(hero), [head(teacher)], tt, { k: 1 - SL, op: 0.9 * (1 - SL) }); }
  if (has(line, 'go to a yoga')) L1(U, t, 'A YOGA CLASS · FOR THE STRESS', 0.3);
  if (has(line, 'Eleven threads')) L1(U, t, '11 THREADS TIE ON', 0.3, RED);
  if (has(line, 'twelfth', 'slides off')) { cam = { z: 1.5, cx: 1000, cy: 560 }; L1(U, t, 'THE 12TH · SLIDES OFF', 0.3, VIO); }
  if (has(line, 'completely calm')) { cam = { z: 1.6, cx: 960, cy: 600 }; L1(U, t, 'COMPLETELY CALM', 0.3, VIO); }
  if (has(line, 'opens one eye', 'thousand')) { cam = { z: 2.1, cx: 960, cy: 600 }; L1(U, t, 'SHE HAS SEEN A THOUSAND OF THESE', 0.4); }
  if (has(line, 'Lesson')) lesson(U, t, 7, "NOT CARING WHO'S WATCHING");
  frame(U, B, cam, [hero, teacher, ...st], fx, { fxIn: true }); chrome(U, t, info, D(12, '7:00 PM', ST(open)));
};
// day 15, the train station: two hundred threads; Unlimited Void (CANON); Miller 1956 (4 to 9 things)
S.station = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Unlimited Void')) { lore(U, t, 'UNLIMITED VOID', ["GOJO'S DOMAIN", 'IT FLOODS THE TARGET WITH INFORMATION UNTIL THEY CAN\'T MOVE'], [...Array(30)].map((_, i) => `<circle cx="${1540 + Math.cos(i * 2.4) * (40 + i * 9)}" cy="${560 + Math.sin(i * 2.4) * (40 + i * 9)}" r="${4 + (i % 4)}" fill="#bfe4ff" opacity="0.7"/>`).join('')); chrome(U, t, info, D(15, '6:44 PM', ST(true))); return; }
  if (has(line, 'George Miller', 'four to nine')) { bigNum(U, t, '4–9', 'THINGS', 'HOW MANY THINGS PEOPLE HOLD IN MIND AT ONCE', 'GEORGE MILLER · PSYCHOLOGICAL REVIEW · 1956'); chrome(U, t, info, D(15, '6:44 PM', ST(true))); return; }
  if (has(line, 'tracking two hundred')) { bigNum(U, t, '200', 'THREADS', 'YOU, AT ONCE', 'OUR RULE · FICTION', RED); chrome(U, t, info, D(15, '6:45 PM', ST(true))); return; }
  const B = E.station(tt); const FL = B.FLOOR; let cam = { z: 1.0, cx: 960, cy: 520 };
  const sitting = has(line, 'sit on the platform', "don't speak"), hero = P(960, FL, sitting ? P_SIT : has(line, 'Yours does it', 'two hundred') ? HEAD : ARMS, 'worried', { look: 0.2 });
  const crowd = [...Array(10)].map((_, i) => Q(120 + i * 190 + (i > 4 ? 120 : 0), FL + (i % 2) * 30, walk(tt + i, 3 + (i % 3)), CROWD[i % 6], 'neutral', { h: 300, flip: i % 2 === 0 }));
  const open = !sitting;
  if (open) B.back += E.dome(960, FL + 10, 1200, has(line, 'open one in a train') ? clamp(t / 1) : 1, tt, { ry: 0.6 });
  let fx = open && !has(line, 'open one in a train') ? E.threads(chest(hero), [...crowd.map(head), ...[...Array(40)].map((_, i) => [-300 + i * 70, 120 + (i * 37) % 360])], tt, { w: 1.8, op: 0.75 }) : '';
  if (has(line, 'open one in a train')) L1(U, t, 'A TRAIN STATION', 0.3);
  if (has(line, "aren't eight", 'two hundred.')) { cam = { z: 0.95, cx: 960, cy: 460 }; L1(U, t, 'NOT 8 · 200 THREADS', 0.3, RED); }
  if (has(line, 'Yours does it')) { cam = { z: 1.7, cx: 960, cy: 560 }; L1(U, t, 'IT FLOODS · YOU', 0.3, RED); }
  if (sitting) { cam = { z: 1.3, cx: 960, cy: 640 }; L1(U, t, '20 MINUTES · NO WORDS', 0.4); }
  if (has(line, 'Lesson')) lesson(U, t, 8, "SURE-HIT IS EASY TO WANT. HARD TO CARRY");
  frame(U, B, cam, [hero, ...crowd], fx, { fxIn: true }); chrome(U, t, info, D(15, '6:44 PM', ST(open)));
};
// day 20, a high roof over the city: the open domain (Malevolent Shrine, CANON), every window tied, the hand closes
S.openup = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Malevolent Shrine', 'huge reach') || line.trim() === 'In the story,') { lore(U, t, 'MALEVOLENT SHRINE', ["SUKUNA'S DOMAIN HAS NO CLOSED BARRIER", "IT'S AN OPEN SPACE WITH A HUGE REACH"], E.spread(1260, 1820, 820, 1, tt)); chrome(U, t, info, D(20, '10:58 PM', ST())); return; }
  const B = E.cityRoof(tt, { high: true, red: has(line, 'snaps shut', 'just a sky') ? 0 : 0.5 }); const FL = B.FLOOR; let cam = { z: 1.0, cx: 960, cy: 500 };
  const shut = since('openup', 'close your hand', 'snaps shut'), closed = k >= shut;
  const kk = has(line, "doesn't close", 'It spreads') ? clamp(t / info.dur) : closed ? 1 - clamp(t / 0.6) : has(line, 'domain without walls') ? 0.4 : 1;
  B.back += E.spread(-600, 2520, B.base - 40, kk, tt);
  const hero = P(960, FL, closed ? { ...P_STAND, aR: [70, 120] } : ARMS, 'neutral', { look: 0.1 });
  const wins = [...Array(22)].map((_, i) => [-200 + i * 110, 420 + (i * 53) % 300]);
  let fx = !closed && kk > 0.5 ? E.threads(chest(hero), wins, tt, { w: 1.8, op: 0.7, k: clamp((kk - 0.5) * 2) }) : '';
  if (has(line, 'try it from the roof')) L1(U, t, 'THE RED DOESN\'T CLOSE · IT SPREADS', 0.4, RED);
  if (has(line, 'Every window')) L1(U, t, 'EVERY WINDOW · TIED TO YOU', 0.3, RED);
  if (has(line, "city's weight", 'late shift', 'baby')) { cam = { z: 1.15, cx: 960, cy: 520 }; fx += bubble(700, 360, `<text x="0" y="-26" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#15181e">LATE SHIFT</text>`, clamp(t / 0.4), 0.8) + bubble(1240, 340, `<text x="0" y="-26" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#15181e">BABY AWAKE</text>`, clamp((t - 0.6) / 0.4), 0.8) + bubble(960, 220, `<text x="0" y="-26" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#15181e">WOOF WOOF</text>`, clamp((t - 1.2) / 0.4), 0.7); }
  if (closed && has(line, 'snaps shut', 'just a sky')) { cam = { z: 1.3, cx: 960, cy: 560 }; L1(U, t, 'SNAP · JUST A SKY AGAIN', 0.3); }
  if (has(line, 'Lesson')) lesson(U, t, 9, "NO WALL, NO ONE ELSE TO BLAME");
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(20, '11:00 PM', ST(!closed)));
};
// day 25, the café: coffee for the people you tied; the intern's long Monday; the boss's daughter's birthday
S.apology = (U, t, info, tt, k, n, line) => {
  const B = J.cafe(tt); const FL = B.FLOOR || 830; let cam = { z: 1.05, cx: 960, cy: 520 };
  const hero = P(560, FL, has(line, 'sorry', 'buy coffee') ? P_PRESENT : P_STAND, 'worried', { look: 0.8 });
  const boss = Q(1000, FL, P_STAND, BOSS, has(line, 'daughter') ? 'worried' : 'neutral', { flip: true, look: -0.6 }), intern = Q(1260, FL, P_STAND, INTERN, has(line, 'long Monday') ? 'smile' : 'neutral', { flip: true, look: -0.7 }), man = Q(1520, FL, P_STAND, SUIT, 'neutral', { flip: true, look: -0.7 });
  let fx = [760, 1120, 1380].map((x) => `<rect x="${x}" y="${FL - 260}" width="40" height="50" rx="6" fill="#f4f1ea"/><path d="M ${x + 40} ${FL - 248} q 18 8 0 26" stroke="#f4f1ea" stroke-width="6" fill="none"/>`).join('');
  if (has(line, 'daughter', 'birthday')) { fx += bubble(1000, FL - 460, ICON.cake, clamp(t / 0.5), 0.9); cam = { z: 1.4, cx: 1000, cy: 480 }; L1(U, t, 'NOT A SANDWICH · HIS DAUGHTER\'S BIRTHDAY', 0.4, GOLD); }
  if (has(line, 'felt that thread')) { fx += E.threads(chest(hero), [head(boss)], tt, { op: 0.5 + 0.4 * Math.sin(tt * 4) ** 2 }); L1(U, t, 'YOU FELT THAT THREAD', 0.3, RED); }
  if (has(line, 'go back to the people')) L1(U, t, 'THE PEOPLE YOU TIED', 0.3);
  if (has(line, 'buy coffee', 'sorry')) L1(U, t, 'COFFEE · AND "I\'M SORRY"', 0.3);
  if (has(line, 'long Monday')) { cam = { z: 1.6, cx: 1260, cy: 520 }; L1(U, t, '"A VERY LONG MONDAY"', 0.3); }
  if (has(line, 'Lesson')) lesson(U, t, 10, "YOU CAN'T UN-FEEL WHAT YOU'VE TIED TO");
  frame(U, B, cam, [hero, boss, intern, man], fx, { fxIn: true }); chrome(U, t, info, D(25, '10:30 AM', ST()));
};
// day 30, the night street: the thief can't leave; "no escape" is a sentence; you open it; sitting on the kerb
S.car = (U, t, info, tt, k, n, line) => {
  const OPEN = since('car', 'You open it', 'runs without'), KERB = since('car', 'shaking so hard', 'kerb'), freed = k >= OPEN;
  const B = E.nightStreet(tt, { broken: true, red: freed ? (k >= KERB ? 1 - clamp(t / info.dur) : 0.6) : 1 }); const FL = B.FLOOR; let cam = { z: 1.05, cx: 960, cy: 520 };
  if (!freed) B.back += E.dome(900, FL + 10, 900, 1, tt, { ry: 0.75 });
  const runs = has(line, 'He runs', 'hits the edge', 'runs without'), tx = has(line, 'runs without') ? 1300 + t * 400 : has(line, 'He runs') ? 1000 + t * 260 : 1650;
  const hero = P(500, FL, k >= KERB ? P_SIT : freed ? P_STAND : HOLD, k >= KERB ? 'worried' : 'neutral', { look: 0.8 });
  const thief = Q(Math.min(tx, has(line, 'runs without') ? 3000 : 1720), FL, runs ? run(tt) : has(line, 'terrified') ? P_SHRUG : P_STAND, THIEF, 'worried', { flip: has(line, 'hits the edge') ? true : !runs });
  if (has(line, 'hits the edge')) { cam = { z: 1.5, cx: 1600, cy: 540 }; L1(U, t, "HE CAN'T LEAVE", 0.2, RED); }
  if (has(line, 'breaks into your car')) L1(U, t, 'SOMEONE · IN YOUR CAR', 0.3);
  if (has(line, 'only door is you')) { cam = { z: 1.3, cx: 600, cy: 520 }; L1(U, t, 'THE ONLY DOOR · YOU', 0.3, RED); }
  if (has(line, "doesn't get hurt", 'holding the walls')) L1(U, t, 'NOBODY GETS HURT · YOU HOLD THE WALLS', 0.3);
  if (has(line, 'is a sentence', 'not a power')) { card2(U, t, info, D(30, '9:12 PM', ST(true)), '"NO ESCAPE"', 'IS A <span style="color:#ff2e3a">SENTENCE</span>, NOT A POWER.'); return; }
  if (has(line, 'You open it')) L1(U, t, 'YOU OPEN IT', 0.3, CYAN);
  if (k >= KERB) { cam = { z: 1.3, cx: 600, cy: 620 }; L1(U, t, 'THE STREETLIGHTS · BACK TO NORMAL', 0.5); }
  if (has(line, 'Lesson')) lesson(U, t, 11, 'THE STRONGEST RULE IS ONE YOU CAN END');
  frame(U, B, cam, [hero, thief], '', { fxIn: true }); chrome(U, t, info, D(30, '9:10 PM', ST(!freed)));
};
// day 35, the playground at night: keep things OUT; the gravel hangs at the wall; pebbles orbit; you laugh
S.rehearsal = (U, t, info, tt, k, n, line) => {
  const B = E.playground(tt); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 520 };
  const THR = since('rehearsal', 'throw a handful'), PLAN_ = since('rehearsal', 'tiny planet', 'you laugh');
  const laugh = k >= PLAN_, hero = P(960, FL, k === THR && t < 0.8 ? THROW : laugh ? ARMS : P_STAND, laugh ? 'smile' : 'neutral', { look: 0.2 });
  const on = k >= since('rehearsal', 'size of the slide', 'close a dome');
  if (on) B.mid += E.dome(960, FL + 6, 420, has(line, 'size of the slide') ? clamp(t / 0.8) : 1, tt, { ry: 1.0 });
  let fx = '';
  if (k >= THR && !laugh) for (let i = 0; i < 14; i++) { const a = -1.2 + (i / 13) * 2.4, x = 960 + Math.sin(a) * 430, y = FL - 50 - Math.cos(a) * 380, kk = k === THR ? clamp((t - 0.4 - i * 0.03) / 0.5) : 1; fx += `<circle cx="${f(1500 + (x - 1500) * kk)}" cy="${f(FL - 200 + (y - FL + 200) * kk + (kk >= 1 ? Math.sin(tt * 2 + i) * 3 : 0))}" r="${5 + (i % 3) * 2}" fill="#a8a0a0"/>`; }
  if (laugh) for (let i = 0; i < 16; i++) { const a = tt * 0.8 + i * 0.39, r = 150 + (i % 3) * 40; fx += `<circle cx="${f(960 + Math.cos(a) * r)}" cy="${f(FL - 200 + Math.sin(a) * r * 0.45)}" r="${5 + (i % 3) * 2}" fill="#c8c0c0"/>`; }
  if (has(line, 'empty playground')) L1(U, t, 'AN EMPTY PLAYGROUND', 0.3);
  if (has(line, 'keep something out')) L1(U, t, 'NOT IN · OUT', 0.3, CYAN);
  if (has(line, 'gravel stops', 'hangs there')) { cam = { z: 1.5, cx: 1200, cy: 600 }; L1(U, t, 'THE GRAVEL · HANGS AT THE WALL', 0.3, CYAN); }
  if (laugh) { cam = { z: 1.5, cx: 960, cy: 600 }; L1(U, t, 'FOR THE FIRST TIME · YOU LAUGH', 0.4, CYAN); }
  if (has(line, 'Lesson')) lesson(U, t, 12, 'THE WALL THAT TRAPS CAN ALSO PROTECT');
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(35, '10:40 PM', ST(on)));
};
// day 40, the school in the storm: the siren, 200 children, the run to the gate, the dome over yard, roof and car park;
// wind, rain, branches and a trampoline bounce off the red; four minutes; the sky clears from red to grey
S.storm = (U, t, info, tt, k, n, line) => {
  const UP = since('storm', 'spread your arms', 'red closes over'), CLEAR = since('storm', 'sky clears', 'Two hundred faces', 'Nobody asks'), up = k >= UP && k < CLEAR, after = k >= CLEAR;
  const B = E.school(tt, { calm: after }); const FL = B.FLOOR; let cam = { z: 1.0, cx: 960, cy: 520 };
  const dk = k === UP ? clamp(t / 1.4) : up ? 1 : after ? 1 - clamp(t / 2.5) : 0;
  if (dk > 0) B.back += E.dome(960, FL + 30, 1350, dk, tt, { ry: 0.58, op: after ? 0.6 : 1 });
  let fx = ''; for (let i = 0; i < 48; i++) { const row = Math.floor(i / 16), x = 140 + (i % 16) * 108 + row * 40, y = FL - 50 + row * 38, sh = up || after ? 0 : Math.sin(tt * 9 + i) * 3; fx += E.kid(x + sh, y, 0.85 + row * 0.08, KIDC[i % 8], after ? -0.2 : 0); }
  if (!after) { const tx = ((tt * 700) % 3200) - 600, ty = 200 + Math.sin(tt * 2) * 60; const hit = up && tx > 300 && tx < 1700;
    fx += E.trampoline(hit ? tx : tx, hit ? Math.min(ty, 180) : ty, tt * 140, 0.9); for (let j = 0; j < 4; j++) { const bx = ((tt * 900 + j * 700) % 3000) - 500, by = 300 + j * 90 + Math.sin(tt * 3 + j) * 40; fx += E.branch(bx, up ? Math.min(by, 220 + j * 30) : by, tt * 200 + j * 50, 0.8); } }
  const RUN = since('storm', 'You run'), heroX = k < RUN ? -200 : k === RUN ? -200 + clamp(t / info.dur) * 400 : 200;
  const hero = P(heroX, FL, k === RUN ? run(tt) : up ? ARMS : P_STAND, up ? 'worried' : 'neutral', { look: 0.8 });
  if (has(line, 'siren', 'tears across')) { cam = { z: 1.0, cx: 960, cy: 460 }; L1(U, t, 'SIREN · PRIMARY SCHOOL', 0.2, RED); }
  if (has(line, 'Two hundred children are')) L1(U, t, '200 CHILDREN · SHELTER 2 MIN AWAY', 0.3, COL.yellow);
  if (has(line, 'keep things in', 'keep things out')) L1(U, t, 'IN · AND OUT', 0.3, RED);
  if (k === RUN) { cam = { z: 1.2, cx: 300, cy: 560 }; L1(U, t, 'YOU RUN', 0.2, CYAN); }
  if (has(line, 'spread your arms', 'red closes over')) { cam = { z: 0.92, cx: 960, cy: 480 }; L1(U, t, 'THE YARD · THE ROOF · THE CAR PARK', 0.5, RED); }
  if (has(line, 'Wind, rain', 'trampoline', 'Nothing reaches')) { cam = { z: 0.95, cx: 960, cy: 440 }; L1(U, t, has(line, 'Nothing reaches') ? 'NOTHING REACHES THE CHILDREN' : 'WIND · RAIN · BRANCHES', 0.3, RED); }
  if (has(line, 'legs shake', 'four minutes')) { cam = { z: 1.5, cx: 400, cy: 580 }; const s = Math.min(240, Math.round(t / info.dur * 240)); L1(U, t, `HOLDING · ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} / 4:00`, 0.1, RED); }
  if (has(line, 'sky clears', 'Two hundred faces')) L1(U, t, 'RED → GREY', 0.4);
  if (has(line, 'Nobody asks')) { cam = { z: 1.25, cx: 760, cy: 640 }; }
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(40, '2:10 PM', ST(up || (after && dk > 0))));
};
// day 41, the bedroom: can't lift your arms; one red thread on your little finger: the cat's
S.cost = (U, t, info, tt, k, n, line) => {
  const B = SET.bedroom(tt, { time: 'day' }); const FL = 820; let cam = { z: 1.1, cx: 960, cy: 520 };
  const hero = P(820, FL, P_SIT, 'worried', { look: 0.7 });
  let fx = E.cat(1460, FL - 300, 0.8, tt, { angry: !has(line, "hasn't left"), flip: true }) + `<rect x="1340" y="${FL - 300}" width="260" height="14" fill="#c8b8a0"/>` + E.threads([880, FL - 170], [[1470, FL - 330]], tt, { w: 3 });
  if (has(line, "can't lift")) L1(U, t, "CAN'T LIFT YOUR ARMS", 0.3);
  if (has(line, 'one red thread', "cat's")) { cam = { z: 1.5, cx: 1150, cy: 560 }; L1(U, t, "ONE THREAD LEFT · THE CAT'S", 0.3, RED); }
  if (has(line, 'never know your name')) { fx += bubble(820, FL - 520, `<rect x="-60" y="-80" width="120" height="70" fill="#c8a07a"/><path d="M -70 -80 L 0 -110 L 70 -80 Z" fill="#8a3a2a"/>`, clamp(t / 0.4), 0.9); L1(U, t, "THEY'LL NEVER KNOW YOUR NAME", 0.4); }
  if (has(line, 'Lesson')) lesson(U, t, 13, 'THE ONLY PERSON TRAPPED IS YOU');
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(41, '9:00 AM', ST(false, 'DOMAIN · RESTING')));
};
// ending: the next night, 11:20, the rooftop; the dome closing again; the two questions
S.ending = (U, t, info, tt, k, n, line) => { if (k === 0 && t < Math.min(1.4, info.dur * 0.5)) { clock(U, t, info, 42); return; }
  const Qs = has(line, 'what would your technique', 'open it all the way', 'whole city', 'comments');
  roofShot(U, t, info, tt, line, k === 0 ? 0.2 : 0.7, k === 0 ? 0.7 : 1, { cam: { z: 1.0, cx: 960, cy: 500 } });
  if (Qs) { U.svg('card', `<rect width="1920" height="1080" fill="#000" opacity="0.45"/>`, {}, { z: 3 }); const q = has(line, 'open it all the way', 'whole city', 'comments') ? 'Would you open it over the whole city?' : 'What would your technique be?';
    big(U, `<div style="${TXT(84)};text-shadow:0 8px 0 #000;max-width:1100px">${q}</div>`, 160, 320); }
  else L1(U, t, 'THE NEXT NIGHT · 11:20', 0.2, RED);
  chrome(U, t, info, Qs ? { day: null, time: null, status: { text: 'YOUR TURN', on: true, color: COL.yellow } } : D(42, '11:20 PM', ST(true)));
};

// CANON / OUR RULE / OUR GUESS seal in the top-left corner while the narration says that sentence (times from the voice)
const TAGCOL = { 'CANON': GOLD, 'OUR RULE': RED, 'OUR GUESS': VIO };
const tagSeal = (U, g) => { const a = TAGS.find((x) => g >= x.t0 && g <= x.t1);
  if (!a) { U.html('tag', '', {}); return; } const k = clamp((g - a.t0) / 0.2), c = TAGCOL[a.tag];
  U.html('tag', `<div style="opacity:${f(k)};transform:scale(${f(0.85 + 0.15 * ease.out(k))});transform-origin:left top;display:inline-flex;align-items:center;gap:10px;background:rgba(10,8,14,.82);border:3px solid ${c};border-radius:10px;padding:8px 16px"><div style="width:14px;height:14px;border-radius:3px;background:${c}"></div><div style="font:900 28px 'IBM Plex Mono';letter-spacing:.08em;color:${c}">${a.tag}</div></div>`, { left: '46px', top: '104px' }, { z: 60 }); };

const BG = { open: '#070a1c', kitchen: '#f2d58a', size: '#8ab4d8', meeting: '#e4e0d8', incomplete: '#dfeef2', market: '#3fb8e0', notice: '#3a3f6a', yoga: '#efe6d8', station: '#c8d0d8', openup: '#070a1c', apology: '#6a3a3a', car: '#0e1430', rehearsal: '#0c1230', storm: '#2a2f40', cost: '#c8d4e4', ending: '#070a1c' };
// shots that must show the action (never a text card or a close-up)
const WIDE = new Set(Object.entries(PLAN).filter(([, p]) => p.sec === 'storm' && !has(p.line, 'Lesson', 'nearest shelter', 'turning back') || has(p.line, 'from Jujutsu Kaisen', 'barrier that closes', 'whole block', 'storm will', 'already closing', "don't have a technique", 'ankle', 'size of your flat', 'stops between', 'Eight people', 'feel all', 'size of a bathtub', 'shed', 'open a full one', 'legs go', 'films a red dome', 'Eleven threads', 'twelfth', "aren't eight", 'try it from the roof', 'Every window', 'snaps shut', 'buy coffee', 'hits the edge', 'holding the walls', 'You open it', 'throw a handful', 'gravel stops', 'tiny planet', 'siren', 'Two hundred children are', 'You run', 'spread your arms', 'Wind, rain', 'trampoline', 'four minutes', 'Two hundred faces', 'one red thread', 'next night')).map(([id]) => id));
const CUTS = {}; { const by = {}; for (const [id, p] of Object.entries(PLAN)) (by[p.sec] = by[p.sec] || []).push(id);
  for (const ids of Object.values(by)) ids.forEach((id, k) => { CUTS[id] = WIDE.has(id) || k === 0 ? 'wide' : ['close', 'wide', 'kin', 'wide', 'close', 'wide'][(k - 1) % 6]; }); }
const SHOT = (id, bg, body, sec, line) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { U.svg('fx', '', {}); U.svg('card', '', {}); U.html('big', '', {}); U.svg('punch', '', {}); FULLED = false; CUT = CUTS[id] === 'close' ? 'close' : 'wide'; body(U, t, info, info.start + t); CUT = 'wide'; if (CUTS[id] === 'kin' && !FULLED && sec !== 'ending' && !has(line, 'Lesson')) kin(U, t, line, sec); tagSeal(U, info.start + t); } });
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line), p.sec, p.line);
