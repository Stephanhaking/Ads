// "What If You Became Sukuna? Nobody Survives 7 Days" — flat 2D, our own designs. Shots come from PLAN (story sections,
// one per day); each section draws by keywords in the narration line. Theme: red sky and red moon, a torii and temple for
// the King, the hero in Sukuna blue with face marks that deepen day by day. Detailed buildings (sk2d) in parallax, a
// camera that always drifts (pan, rise or pull, chosen per shot), and moving elements in every set. A countdown chip
// ("N DAYS LEFT") stays top-right. Seals CANON / OUR RULE / OUR GUESS show top-left while that sentence is spoken.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_STAND, P_THINK, P_TIRED, P_PHONE, P_SIT, P_RUN, P_SHRUG, P_PRESENT, P_SHIVER } from '../lib/people.js';
import { P_POINT } from '../lib/char2d.js';
import { hud, label, caption, COL } from '../lib/hud.js';
import { frame as frame0 } from '../lib/flat2d.js';
import * as E from '../lib/sets/sk2d.js';
import { PLAN, TAGS } from './plan.js';

const f = (n) => n.toFixed(1);
const RED = E.RED, BLUE = E.BLUE, GOLD = '#ffd23f', VIO = '#b48cff', WHITE = '#ffffff';
const HERO = { top: BLUE, bottom: '#1c2238', hair: 'short', broad: true };
const MARA = { top: '#ff8a3a', bottom: '#2a2d4a', hair: 'ponytail' };
const KIND = { top: '#4fa06a', bottom: '#2a2d3a', hair: 'short', broad: true };
const THIEF = { top: '#3a3f4a', bottom: '#22263a', hood: true, broad: true };
const TITLE = 'WHAT IF YOU BECAME SUKUNA?';
const LEFT = (d) => d <= 0 ? { text: 'MIDNIGHT', on: true, color: RED } : { text: `${d} DAY${d > 1 ? 'S' : ''} LEFT`, on: true, color: d <= 2 ? RED : GOLD };
const D = (day, time, left) => ({ day, time, status: LEFT(left) });
const chrome = (U, t, info, d) => { hud(U, { title: TITLE, ...d }); caption(U, info, t); };
const LX = (txt) => Math.min(1180, 1840 - txt.length * 24 - 70);
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 260, c ? { color: c } : {});
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const since = (sec, ...w) => { let best = 1e9; for (const p of Object.values(PLAN)) if (p.sec === sec && has(p.line, ...w)) best = Math.min(best, p.k); return best; };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const run = (tt) => { const s = Math.sin(tt * 9); return { ...P_RUN, aL: [50 + s * 40, 80], aR: [40 - s * 40, 110], lL: [30 + s * 30, 40], lR: [-10 - s * 30, 10] }; };
const ARMS = { ...P_STAND, aL: [100, 10], aR: [100, 10] };
const TWO = { ...P_POINT, aR: [86, 92] };
const CUP = { ...P_STAND, aR: [40, 140] };
const GRAB = { ...P_STAND, lean: 8, aR: [70, 70] };
const PULL = { ...P_STAND, lean: -10, aR: [20, 60], aL: [30, 20] };
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5 });
const Q = (x, y, pose, outfit, face = 'neutral', o = {}) => ({ x, y, h: o.h || 340, pose, outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5 });
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
let FULLED = false;
const full = (U, svg) => { FULLED = true; return U.svg('card', svg, {}, { z: 3 }); };
// camera: every shot drifts (pan left / right, rise, pull back), on top of the engine's slow push-in; close cuts follow the
// first person's head
let CUT = 'wide', MOVE = 0, LT = 0, DUR = 3;
const frame = (U, B, cam, ppl, fx, o) => { if (CUT === 'close' && ppl && ppl[0]) { const h = ppl[0]; cam = { z: Math.max(cam.z * 1.9, 2.2), cx: h.x + (h.flip ? -30 : 30), cy: h.y - (h.h || 360) * 0.72 }; }
  const p = clamp(LT / Math.max(1, DUR)) - 0.5, d = [[90, 0, 0], [-90, 0, 0], [0, -50, 0.02], [0, 0, -0.07]][MOVE];
  cam = { z: cam.z * (1 + d[2] * p), cx: cam.cx + d[0] * p / cam.z, cy: cam.cy + d[1] * p / cam.z }; return frame0(U, B, cam, ppl, fx, o); };
// marks level per section (0 = gone)
const MK = { open: 2, d1: 1, d2: 1, d3: 2, d4: 3, d5: 3, d6: 3, d7: 4, mon: 0 };
const withMarks = (sec, extra = '', o = {}) => (out) => { let g = typeof extra === 'function' ? extra(out) : extra; const lv = o.lvl ?? MK[sec]; if (out[0] && lv) g += E.marks(out[0], lv, LT); if (o.arms && out[0]) g += E.armMarks(out[0], LT); if (o.fing && out[0] && out[0].hands) g += E.fingers(out[0].hands[1], LT); return g; };

// ---------- cards ----------
const KCOL = { open: ['#14040a', RED], d1: ['#e8d4b0', RED], d2: ['#2a6a4a', GOLD], d3: ['#1c2236', VIO], d4: ['#1a2450', '#ffb03a'], d5: ['#0a0c22', RED], d6: ['#1a1020', RED], d7: ['#12040a', RED], mon: ['#e8d4b0', BLUE] };
const kin = (U, t, line, sec) => { const [bg, ac] = KCOL[sec] || ['#15181e', GOLD]; const words = line.replace(/["“”]/g, '').split(/\s+/).filter(Boolean);
  let key = 0, len = 0; words.forEach((w, i) => { const n = w.replace(/[^\w]/g, '').length; if (n > len) { len = n; key = i; } });
  const k = clamp(t / 0.25), dark = ['#e8d4b0'].includes(bg);
  U.svg('card', `<rect width="1920" height="1080" fill="${bg}"/>${[...Array(9)].map((_, i) => `<rect x="${-200 + i * 260 + (t * 60) % 260}" y="0" width="120" height="1080" fill="${dark ? '#000' : '#fff'}" opacity="0.035" transform="skewX(-12)"/>`).join('')}${E.slash(-100, 900 - t * 40, 2000, 700 - t * 40, clamp(t / 0.4), 0, 0.8)}`, {}, { z: 3 });
  U.html('big', `<div style="width:1500px;transform:scale(${f(0.92 + 0.08 * ease.out(k))});transform-origin:left center;opacity:${f(k)};${TXT(words.length > 9 ? 96 : 118, dark ? '#15181e' : '#ffffff')};text-transform:uppercase">${words.map((w, i) => i === key ? `<span style="color:${ac}">${w}</span>` : w).join(' ')}</div>`, { left: '200px', top: '330px' }, { z: 50 });
  U.html('L1', '', {}); U.html('cap', '', {}); };
// lore card (CANON): red realm backdrop drifting, title + up to three lines, optional art
const realmBg = (t, dim = 0.55) => { const B = E.realm(0, { t: t + 2 }); return `<g transform="translate(${f(-t * 14)} 0)">${B.back}${B.mid}${B.floor}</g><rect width="1920" height="1080" fill="#0a0206" opacity="${dim}"/>`; };
const lore = (U, t, title, lines, art = '', col = GOLD, head = 'IN THE STORY · JUJUTSU KAISEN') => { const k = clamp(t / 0.4), alt = MOVE % 2 === 1;
  full(U, `<g transform="translate(${alt ? -40 : 0} 0)">${realmBg(t)}</g>` + (alt ? `<g transform="translate(-1180 0)">${art}</g>` : art));
  big(U, `<div style="opacity:${f(k)};max-width:1000px;transform:translateX(${f(-30 * (1 - ease.out(k)))}px)"><div style="font:800 34px 'IBM Plex Mono';color:${col};letter-spacing:.08em">${head}</div><div style="${TXT(92)};margin:18px 0 26px">${title}</div>${lines.map((l, i) => `<div style="font:700 40px Inter;color:#f2e6e6;margin:10px 0;opacity:${f(clamp((t - 0.4 - i * 0.5) / 0.3))}">· ${l}</div>`).join('')}</div>`, alt ? 820 : 160, 250); };
// a bust of the hero (head + shoulders) with the marks, floating: art for the OUR RULE / OUR GUESS cards
const bust = (x, y, s, lvl, t, col = RED) => { const b = Math.sin(t * 1.6) * 10, sc = s * (1 + 0.04 * t); return `<g transform="translate(${x} ${f(y + b)}) scale(${f(sc)})"><circle r="260" fill="${col}" opacity="0.10"/><circle r="200" fill="${col}" opacity="0.08"/><rect x="-170" y="120" width="340" height="260" rx="120" fill="${BLUE}"/><rect x="-170" y="120" width="340" height="260" rx="120" fill="#000" opacity="0.15"/><circle cx="0" cy="0" r="150" fill="#15181e" stroke="#b9dcff" stroke-width="6"/><ellipse cx="-52" cy="-6" rx="20" ry="24" fill="#fff"/><ellipse cx="52" cy="-6" rx="20" ry="24" fill="#fff"/><circle cx="${f(-48 + Math.sin(t * 0.8) * 6)}" cy="-2" r="10" fill="#15181e"/><circle cx="${f(56 + Math.sin(t * 0.8) * 6)}" cy="-2" r="10" fill="#15181e"/>${E.marks({ head: [0, 0], R: 150 }, lvl, t)}</g>`; };
let SECNOW = 'open';
// our rule / our guess card: dark slate, coloured edge, big statement
const rule = (U, t, info, d, head1, sub = '', col = RED, kind = 'IN YOUR VERSION', art = '') => { const k = clamp(t / 0.3);
  full(U, `<rect width="1920" height="1080" fill="#0e0a14"/>${[...Array(7)].map((_, i) => `<rect x="${-300 + i * 340 + (t * 50) % 340}" y="0" width="150" height="1080" fill="${col}" opacity="0.04" transform="skewX(-14)"/>`).join('')}<rect x="120" y="300" width="12" height="${f(420 * ease.out(k))}" fill="${col}"/>${art || bust(1560, 500, 1, MK[SECNOW] || 0, t, col)}`);
  big(U, `<div style="opacity:${f(k)};max-width:1080px"><div style="font:800 34px 'IBM Plex Mono';color:${col};letter-spacing:.08em">${kind}</div><div style="${TXT(84)};margin:20px 0 22px;transform:scale(${f(0.94 + 0.06 * ease.out(k))});transform-origin:left">${head1}</div><div style="font:800 46px Inter;color:#d8d0e0">${sub}</div></div>`, 180, 320); chrome(U, t, info, d); };
// the voice: dark red card, the quote in a thin serif-like italic, slight tremble
const voice = (U, t, info, d, q) => { const k = clamp(t / 0.35), j = Math.sin(t * 37) * 1.5;
  full(U, `<rect width="1920" height="1080" fill="#0c0206"/>${E.moon(MOVE % 2 ? 420 : 1500, MOVE > 1 ? 780 : 300, 90 + t * 6, t)}<rect width="1920" height="1080" fill="#0c0206" opacity="0.4"/>${[...Array(5)].map((_, i) => `<path d="M ${-100 + i * 500 + t * 30} 1080 Q ${200 + i * 500} ${700 - i * 20} ${-50 + i * 500} 400" stroke="${RED}" stroke-width="2" fill="none" opacity="0.25"/>`).join('')}`);
  big(U, `<div style="opacity:${f(k)};transform:translate(${f(j)}px,0);max-width:1300px"><div style="font:800 30px 'IBM Plex Mono';color:${RED};letter-spacing:.14em;margin-bottom:24px">THE VOICE</div><div style="font:italic 800 84px Georgia,serif;color:#ffd8dc;line-height:1.15;text-shadow:0 0 30px rgba(255,46,58,.5)">“${q}”</div></div>`, 200, 330); chrome(U, t, info, d); };
// countdown: the big number of days left
const countdown = (U, t, info, n, day) => { const k = clamp(t / 0.45);
  full(U, realmBg(t, 0.35) + `<g transform="translate(960 560)">${[...Array(7)].map((_, i) => { const a = -90 + i * (360 / 7), on = i < n; return `<circle cx="${f(Math.cos(a * Math.PI / 180) * 340)}" cy="${f(Math.sin(a * Math.PI / 180) * 340)}" r="${on ? 26 : 18}" fill="${on ? RED : '#3a2a30'}" opacity="${f(on ? 0.6 + 0.4 * clamp((t - i * 0.08) / 0.2) : 0.8)}"/>`; }).join('')}</g>`);
  big(U, `<div style="text-align:center;width:1600px;opacity:${f(k)};transform:scale(${f(0.85 + 0.15 * ease.out(k))})"><div style="${TXT(300, n <= 2 ? RED : '#fff')};text-shadow:0 12px 0 #000">${n}</div><div style="font:900 64px Inter;color:#fff;letter-spacing:.1em">DAY${n > 1 ? 'S' : ''} LEFT</div></div>`, 160, 300); chrome(U, t, info, D(day, null, n)); };
const bigNum = (U, t, info, d, num, unit, sub, src, col = GOLD) => { const k = clamp(t / 0.5);
  full(U, realmBg(t, 0.6) + `<ellipse cx="960" cy="560" rx="${f(700 * ease.out(k))}" ry="${f(160 * ease.out(k))}" fill="none" stroke="${RED}" stroke-width="6" stroke-dasharray="30 14" opacity="0.7"/>`);
  big(U, `<div style="text-align:center;width:1600px;opacity:${f(k)}"><div style="${TXT(230, col)}">${num}<span style="font-size:110px;color:#fff"> ${unit}</span></div><div style="font:800 48px Inter;color:#fff;margin-top:24px">${sub}</div><div style="font:700 28px 'IBM Plex Mono';color:#c8a0a8;margin-top:20px">${src}</div></div>`, 160, 300); chrome(U, t, info, d); };
const clockCard = (U, t, info, d, txt, sub) => { const kk = clamp(t / 0.4); full(U, `<rect width="1920" height="1080" fill="#06050f"/><rect x="510" y="300" width="900" height="440" rx="40" fill="#160a10" stroke="#481820" stroke-width="10"/><text x="960" y="610" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="230" fill="${RED}" opacity="${f(kk * (0.85 + 0.15 * (Math.floor(t * 2) % 2)))}">${txt}</text><text x="960" y="820" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="46" fill="#fff" opacity="0.8">${sub}</text>`); chrome(U, t, info, d); };
// a big hand: a cut on the palm that closes (Reverse Cursed Technique)
const handCard = (U, t, info, d, heal) => { const k = heal ? clamp(t / 1.6) : 0; const L = 260 * (1 - k);
  full(U, `<rect width="1920" height="1080" fill="#e8d4b0"/><g transform="translate(960 600)"><ellipse cx="0" cy="40" rx="230" ry="260" fill="#15181e"/>${[-150, -60, 30, 120].map((x, i) => `<rect x="${x - 34}" y="${-420 + Math.abs(i - 1.5) * 40}" width="68" height="300" rx="34" fill="#15181e"/>`).join('')}<rect x="200" y="-60" width="64" height="240" rx="32" fill="#15181e" transform="rotate(40 230 60)"/>
${L > 2 ? `<line x1="${f(-L / 2)}" y1="${f(20 - L * 0.2)}" x2="${f(L / 2)}" y2="${f(20 + L * 0.2)}" stroke="${RED}" stroke-width="10" stroke-linecap="round"/>` : ''}${heal ? `<circle cx="0" cy="20" r="${f(60 + 200 * k)}" fill="none" stroke="#bfe4ff" stroke-width="6" opacity="${f(0.8 * (1 - k))}"/>` : E.slash(-300, -100, 300, 140, clamp(t / 0.3), clamp((t - 0.6) / 0.5), 1)}</g>`);
  L1(U, t, heal ? `HEALED · ${(3 * (1 - k)).toFixed(1)} S` : 'DISMANTLE · BY ACCIDENT', 0.2, heal ? '#bfe4ff' : RED); chrome(U, t, info, d); };
// the dial: one setting, needle pinned at LOUD
const dialCard = (U, t, info, d) => { const a = 82 + Math.sin(t * 40) * 3; full(U, `<rect width="1920" height="1080" fill="#0e0a14"/><g transform="translate(960 700)"><path d="M -420 0 A 420 420 0 0 1 420 0" fill="none" stroke="#2a2438" stroke-width="70"/><path d="M -420 0 A 420 420 0 0 1 420 0" fill="none" stroke="${RED}" stroke-width="70" stroke-dasharray="${f(1320 * clamp(t / 0.6))} 2000"/>${[...Array(11)].map((_, i) => { const r = (-180 + i * 18) * Math.PI / 180; return `<line x1="${f(Math.cos(r) * 470)}" y1="${f(Math.sin(r) * 470)}" x2="${f(Math.cos(r) * 510)}" y2="${f(Math.sin(r) * 510)}" stroke="#fff" stroke-width="6"/>`; }).join('')}
<g transform="rotate(${f(a)})"><rect x="-10" y="-400" width="20" height="400" rx="10" fill="#fff"/></g><circle r="40" fill="#fff"/><text x="-470" y="80" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="#8a8aa8">QUIET</text><text x="380" y="80" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="${RED}">LOUD</text></g>`); L1(U, t, 'ONE DIAL · STUCK ON LOUD', 0.3, RED); chrome(U, t, info, d); };
// top view: the radius of the Shrine, you in the middle, Mara at 150 m
const rangeCard = (U, t, info, d, R, o = {}) => { const k = clamp(t / 0.6), sc = 1.9; full(U, `<rect width="1920" height="1080" fill="#12040a"/>${[...Array(30)].map((_, i) => `<circle cx="${E.rnd(i) * 1920}" cy="${E.rnd(i * 3) * 1080}" r="${3 + E.rnd(i * 5) * 4}" fill="#3a1a22"/>`).join('')}
<g transform="translate(760 560)"><circle r="${f(R * sc * ease.out(k))}" fill="${RED}" opacity="0.18"/><circle r="${f(R * sc * ease.out(k))}" fill="none" stroke="#ff6a5a" stroke-width="6" stroke-dasharray="24 12"/>${o.ghost ? `<circle r="${f(o.ghost * sc)}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 10" opacity="0.4"/>` : ''}<circle r="18" fill="${BLUE}"/><line x1="0" y1="0" x2="${f(R * sc)}" y2="0" stroke="#fff" stroke-width="3" opacity="${f(k)}"/><text x="${f(R * sc / 2)}" y="-16" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="#fff" opacity="${f(k)}">${R} M</text>
${o.mara ? `<circle cx="${f(150 * sc)}" cy="60" r="16" fill="#ff8a3a"/><path d="M ${f(150 * sc)} 60 l -120 -40 l 0 80 Z" fill="#fff4b0" opacity="0.35"/><text x="${f(150 * sc + 30)}" y="70" font-family="IBM Plex Mono" font-weight="800" font-size="34" fill="#ff8a3a">MARA · 150 M</text>` : ''}</g>`); chrome(U, t, info, d); };
// the mirror: the face, big, with marks
const mirrorFace = (B, lvl, t) => { const [x, y, w, h] = B.MIRROR, hx = x + w / 2, hy = y + h / 2 + 30, R = 140; return `<g><circle cx="${hx}" cy="${hy}" r="${R + 6}" fill="#b9dcff" opacity="0.6"/><circle cx="${hx}" cy="${hy}" r="${R}" fill="#15181e"/><rect x="${hx - 150}" y="${hy + R - 20}" width="300" height="140" rx="60" fill="${BLUE}"/><ellipse cx="${hx - 48}" cy="${hy - 10}" rx="18" ry="22" fill="#fff"/><ellipse cx="${hx + 48}" cy="${hy - 10}" rx="18" ry="22" fill="#fff"/><circle cx="${hx - 44}" cy="${hy - 6}" r="9" fill="#15181e"/><circle cx="${hx + 52}" cy="${hy - 6}" r="9" fill="#15181e"/>${E.marks({ head: [hx, hy], R }, lvl, t)}</g>`; };

const NUMW = { Six: 6, Five: 5, Four: 4, Three: 3, Two: 2, One: 1 };
const cd = (U, t, info, line, day) => { const m = line.match(/(Six|Five|Four|Three|Two|One) days? left/); if (!m) return false; if (line.trim().startsWith(m[0]) || t > info.dur * 0.55) { countdown(U, t, info, NUMW[m[1]], day); return true; } return false; };
const S = {};
// ---------- cold open: the King, the promise, the power, then Monday morning ----------
const throne = (U, t, info, tt, o = {}) => { const B = E.realm(tt, { t }); const FL = B.FLOOR; if (o.city) B.back += `<g opacity="0.9">${E.skyline(FL - 60, t, { night: true, seed: 3, cols: ['#2a1420', '#341824', '#2a1a2a'] })}</g>`;
  const hero = P(960, FL + 20, o.pose || ARMS, o.face || 'neutral', { h: 420, look: 0 });
  frame(U, B, o.cam || { z: 1.0, cx: 960, cy: 520 }, [hero], withMarks('open', o.fx || ''), { fxIn: true }); };
const shrineShot = (U, t, info, tt, o = {}) => { const B = E.quarry(tt, { t, time: 'night', moonR: 150, cut: o.cut }); const FL = B.FLOOR, k = o.k ?? clamp(t / Math.max(1.5, info.dur * 0.8));
  B.mid += E.shrine(960, FL + 60, 900, k, t, { n: 90 }); const ppl = [P(960, FL + 50, ARMS, 'neutral', { h: 300, look: 0 })];
  if (o.mara) ppl.push(Q(1800, FL + 10, P_PHONE, MARA, 'worried', { h: 200, flip: true }));
  frame(U, B, o.cam || { z: 1.0, cx: 960, cy: 520 }, ppl, withMarks('d7', o.mara ? (out) => `<path d="M ${1770} ${FL - 130} L 1500 ${FL - 60} L 1500 ${FL + 20} Z" fill="#fff4b0" opacity="0.35"/>` : '', { arms: true }), { fxIn: true }); };
S.open = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Ryomen Sukuna', 'King of Curses')) { throne(U, t, info, tt, { cam: { z: 1.15 - 0.12 * clamp(t / info.dur), cx: 960, cy: 560 } }); L1(U, t, 'RYOMEN SUKUNA · THE KING OF CURSES', 0.1, RED); chrome(U, t, info, D(1, '7:12 AM', 7)); return; }
  if (has(line, 'In real life') && t > info.dur * 0.45) { countdown(U, t, info, 7, 1); return; }
  if (has(line, 'In real life')) { throne(U, t, info, tt, { city: true, cam: { z: 0.95, cx: 960, cy: 480 } }); L1(U, t, 'IN REAL LIFE', 0.1, RED); chrome(U, t, info, D(1, '7:12 AM', 7)); return; }
  if (has(line, 'seven days') && !has(line, 'end of')) { countdown(U, t, info, 7, 1); return; }
  if (has(line, 'nobody in range', 'end of the seventh')) { shrineShot(U, t, info, tt); L1(U, t, 'MIDNIGHT · DAY 7 · NOBODY IN RANGE SURVIVES', 0.2, RED); chrome(U, t, info, D(7, '12:00 AM', 0)); return; }
  if (has(line, 'human sorcerer', 'Heian', 'nobody could stop')) { lore(U, t, 'RYOMEN SUKUNA', ['A HUMAN SORCERER', 'SO FEARED IN THE HEIAN ERA', 'THAT NOBODY COULD STOP HIM'], E.torii(1560, 900, 1.1) + E.temple(1560, 900, 0.6)); chrome(U, t, info, D(1, '7:12 AM', 7)); return; }
  if (has(line, "didn't eat a finger", 'all of it', 'a clock')) { rule(U, t, info, D(1, '7:12 AM', 7), 'NO FINGER.<br><span style="color:#ff2e3a">ALL OF HIM.</span>', has(line, 'clock') ? 'AND A CLOCK · 7 DAYS' : '', RED, 'IN YOUR VERSION', `<g transform="translate(1520 560)"><circle r="200" fill="none" stroke="#3a2a30" stroke-width="20"/><circle r="200" fill="none" stroke="${RED}" stroke-width="20" stroke-dasharray="${f(1256 * clamp(t / info.dur))} 2000" transform="rotate(-90)"/><line x1="0" y1="0" x2="0" y2="-150" stroke="#fff" stroke-width="10" stroke-linecap="round" transform="rotate(${f(t * 90)})"/></g>`); return; }
  if (has(line, 'biggest thing', 'opens on its own', 'midnight on day seven')) { shrineShot(U, t, info, tt, { k: clamp(t / info.dur) * 0.6, cam: { z: 0.9, cx: 960, cy: 480 } }); L1(U, t, 'IT OPENS ON ITS OWN', 0.2, RED); chrome(U, t, info, D(7, '12:00 AM', 0)); return; }
  if (has(line, 'will not ask', 'standing nearby')) { shrineShot(U, t, info, tt, { k: 0.5 + 0.3 * clamp(t / info.dur), mara: true, cam: { z: 0.88, cx: 1100, cy: 500 } }); L1(U, t, "IT WON'T ASK WHO'S NEARBY", 0.2, RED); chrome(U, t, info, D(7, '12:00 AM', 0)); return; }
  if (has(line, "it's Monday") && t < 1.3) { clockCard(U, t, info, D(1, '7:12 AM', 7), '7:12', 'MONDAY · AM'); return; }
  const B = E.apartment(tt, { t, time: 'morning' }); const FL = B.FLOOR; B.mid += E.loaf(760, FL - 270, 1.2);
  const hero = P(1240, FL, has(line, 'hungry') ? P_THINK : P_STAND, 'neutral', { look: -0.6 });
  frame(U, B, has(line, 'loaf', 'bread') ? { z: 1.5, cx: 860, cy: 520 } : { z: 1.05, cx: 960, cy: 520 }, [hero], withMarks('d1', '', { lvl: 0 }), { fxIn: true }); L1(U, t, has(line, 'loaf', 'bread') ? 'A LOAF OF BREAD · THE COUNTER' : 'MONDAY · HUNGRY', 0.3); chrome(U, t, info, D(1, '7:12 AM', 7));
};
// ---------- day 1, Monday: the bread ----------
const breadShot = (U, t, info, tt, line, o = {}) => { const B = E.apartment(tt, { t, time: 'morning', cut: o.wall ? [1500, 500, 1760, 420] : null }); const FL = B.FLOOR;
  B.mid += E.loaf(760, FL - 270, 1.2, o.sliced ? 11 : 0); const hero = P(1240, FL, o.point ? TWO : o.pose || P_STAND, o.face || 'neutral', { look: -0.6, flip: false });
  const ppl = [hero]; if (o.mara) ppl.push(Q(o.maraX ?? 1640, FL, o.maraPose || CUP, MARA, o.maraFace || 'worried', { flip: true }));
  let fx = (out) => { let g = ''; if (o.point && out[0]) g += E.fingers(out[0].hands[1], t); if (o.slash) g += E.slash(560, FL - 330, 1780, FL - 470, clamp((t - 0.2) / 0.35), clamp((t - 1.2) / 0.6), 1); if (o.mara && out[1]) g += `<rect x="${f(out[1].hands[1][0] - 16)}" y="${f(out[1].hands[1][1] - 34)}" width="34" height="40" rx="6" fill="#fff"/>`; return g; };
  frame(U, B, o.cam || { z: 1.05, cx: 1060, cy: 520 }, ppl, withMarks('d1', fx, { lvl: o.lvl ?? 0 }), { fxIn: true }); };
S.d1 = (U, t, info, tt, k, n, line) => { const d = D(1, '7:15 AM', 7), MIR = since('d1', 'bathroom mirror'), lv = k >= MIR ? 1 : 0; if (cd(U, t, info, line, 1)) return;
  if (has(line, 'two parts', 'cuts from a distance', 'cuts what it touches')) { lore(U, t, 'TWO PARTS', ['DISMANTLE · CUTS FROM A DISTANCE', 'CLEAVE · CUTS WHAT IT TOUCHES'], E.slash(1300, 820, 1800, 380, clamp(t / 0.5), 0, 1.2) + `<circle cx="1550" cy="760" r="60" fill="none" stroke="#fff" stroke-width="6" opacity="${f(clamp((t - 1) / 0.3))}"/>`); chrome(U, t, info, d); return; }
  if (has(line, 'How hard', 'power you put in')) { lore(U, t, 'DISMANTLE', ['HOW HARD IT HITS', 'DEPENDS ON THE POWER YOU PUT IN'], [0, 1, 2].map((i) => E.slash(1260, 860 - i * 140, 1820, 760 - i * 160, clamp((t - i * 0.4) / 0.3), 0, 0.5 + i * 0.6)).join('')); chrome(U, t, info, d); return; }
  if (has(line, 'point two fingers', 'think: cut')) { breadShot(U, t, info, tt, line, { point: true, cam: { z: 1.3, cx: 1000, cy: 500 } }); L1(U, t, 'TWO FINGERS · THINK: CUT', 0.2, RED); chrome(U, t, info, d); return; }
  if (has(line, 'Eleven slices', 'Thin as paper')) { breadShot(U, t, info, tt, line, { sliced: true, slash: t < 1.5, cam: { z: 2.2, cx: 780, cy: 500 } }); L1(U, t, '11 SLICES · THIN AS PAPER', 0.3, RED); chrome(U, t, info, d); return; }
  if (has(line, 'clean line through', 'wall behind')) { breadShot(U, t, info, tt, line, { sliced: true, slash: true, wall: t > 0.6, point: true, cam: { z: 0.95, cx: 1100, cy: 480 } }); L1(U, t, 'THE BAG · THE COUNTER · THE WALL', 0.4, RED); chrome(U, t, info, d); return; }
  if (has(line, 'Mara', 'coffee', 'cut the wall', 'already like that')) { const enter = has(line, 'walks in'); breadShot(U, t, info, tt, line, { sliced: true, wall: true, mara: true, maraX: enter ? 2200 - clamp(t / 1.4) * 560 : 1640, maraPose: enter ? walk(tt) : has(line, 'was not') ? P_SHRUG : CUP, face: has(line, 'It was already') ? 'smile' : 'neutral', cam: has(line, 'It was already') ? { z: 1.6, cx: 1260, cy: 520 } : has(line, 'was not', 'cut the wall') ? { z: 1.5, cx: 1620, cy: 520 } : { z: 1.0, cx: 1200, cy: 520 } });
    L1(U, t, has(line, 'walks in') ? 'MARA · ROOMMATE · COFFEE' : has(line, 'cut the wall') ? '"DID YOU JUST CUT THE WALL?"' : has(line, 'was not') ? '"IT WAS NOT."' : '"IT WAS ALREADY LIKE THAT."', 0.2); chrome(U, t, info, d); return; }
  if (has(line, 'one dial', 'stuck on loud', "turn it down")) { dialCard(U, t, info, d); return; }
  if (has(line, 'bathroom mirror', 'dark marks', "weren't there", 'first sign', 'come back every', 'deeper')) { const B = E.bathroom(tt, { t }); const FL = B.FLOOR; const deep = has(line, 'deeper', 'come back every'); B.back += mirrorFace(B, deep ? 1 + Math.min(1, Math.floor(t / 1.2)) : clamp(t / 0.6) > 0.5 ? 1 : 0, t);
    const hero = { ...P(has(line, 'first sign', 'deeper') ? 1560 : 960, FL + 120, P_STAND, 'worried', { h: 420 }), face: 'back' };
    frame(U, B, has(line, 'first sign', 'deeper') ? { z: 1.6, cx: 960, cy: 420 } : { z: 1.1, cx: 960, cy: 480 }, [hero], '', { fxIn: true }); L1(U, t, has(line, 'first sign') ? 'THE MARKS · YOUR BODY IS CHANGING' : deep ? 'EVERY MORNING · A LITTLE DEEPER' : 'MARKS · NOT THERE LAST NIGHT', 0.3, RED); chrome(U, t, info, D(1, '7:20 AM', 7)); return; }
  if (has(line, 'a voice', 'not loud at all')) { const B = E.bathroom(tt, { t }); B.back += mirrorFace(B, 1, t) + `<rect x="620" y="160" width="680" height="460" fill="${RED}" opacity="${f(0.12 + 0.08 * Math.sin(t * 6))}"/>`; frame(U, B, { z: 1.4, cx: 960, cy: 400 }, [], '', { fxIn: true }); L1(U, t, 'A VOICE', 0.3, RED); chrome(U, t, info, D(1, '7:20 AM', 7)); return; }
  if (has(line, 'Good.', "neighbour's dog")) { voice(U, t, info, D(1, '7:20 AM', 7), "Good. Now the neighbour's dog."); return; }
  if (has(line, 'say no', 'talking to')) { breadShot(U, t, info, tt, line, { sliced: true, wall: true, mara: true, lvl: 1, pose: P_SHRUG, face: 'worried', maraPose: P_THINK, cam: has(line, 'talking to') ? { z: 1.5, cx: 1600, cy: 520 } : { z: 1.5, cx: 1260, cy: 520 } }); L1(U, t, has(line, 'talking to') ? '"WHO ARE YOU TALKING TO?"' : '"NO."', 0.2); chrome(U, t, info, D(1, '7:22 AM', 7)); return; }
  if (has(line, 'sadistic', 'selfish', 'hedonistic')) { lore(U, t, 'HIS PERSONALITY', ['SADISTIC', 'SELFISH', 'HEDONISTIC'], E.moon(1560, 560, 160, t)); chrome(U, t, info, d); return; }
  if (has(line, "doesn't take over", 'It suggests', 'Seven days of suggestions')) { rule(U, t, info, d, has(line, 'Seven days') ? 'SEVEN DAYS OF<br><span style="color:#ff2e3a">SUGGESTIONS.</span>' : 'IT DOESN\'T TAKE OVER.<br><span style="color:#ff2e3a">IT SUGGESTS.</span>'); return; }
  if (has(line, 'Six days left')) { countdown(U, t, info, 6, 1); return; }
  breadShot(U, t, info, tt, line, { sliced: true, wall: true, mara: k > since('d1', 'walks in'), lvl: lv }); chrome(U, t, info, d);
};
// ---------- day 2, Tuesday: the touch (the park, then the crossing) ----------
S.d2 = (U, t, info, tt, k, n, line) => { const d = D(2, '10:30 AM', 6), CROSS = since('d2', 'crosswalk'); if (cd(U, t, info, line, 2)) return;
  if (has(line, 'Cleave needs contact', 'adjusts itself', 'how tough', "doesn't ask how strong", 'just opens it')) { lore(U, t, 'CLEAVE', ['NEEDS CONTACT', 'ADJUSTS TO HOW TOUGH THE TARGET IS'], E.chain(1560, 640, 1.1, clamp((t - 1.2) / 0.5), t)); chrome(U, t, info, d); return; }
  if (has(line, 'touch is a choice', "counting on")) { rule(U, t, info, d, 'TOUCH IS<br><span style="color:#ff2e3a">A CHOICE.</span>', has(line, 'counting') ? 'THE RULE YOU\'VE BEEN COUNTING ON' : ''); return; }
  if (has(line, 'kindness is the most', 'Lesson two')) { kin(U, t, line, 'd2'); L1(U, t, 'LESSON TWO', 0.2, COL.yellow); chrome(U, t, info, d); return; }
  if (has(line, 'Five days left')) { countdown(U, t, info, 5, 2); return; }
  if (k >= CROSS) { const B = E.crossing(tt, { t, busX: has(line, 'bus') ? 2600 - clamp(t / info.dur) * 3400 : null, green: !has(line, 'bus') }); const FL = B.FLOOR;
    const grab = has(line, 'grabs your sleeve', 'kind man'), pull = has(line, 'hand moves', 'pull away'), after = has(line, 'clean line down', 'thinks it tore', 'thanks you');
    const hero = P(grab ? 900 + clamp(t / 1) * 60 : 900, FL, pull ? PULL : grab ? walk(tt) : P_STAND, pull ? 'worried' : 'neutral', { look: 0.8 });
    const man = Q(pull ? 1150 : 1120, FL, grab ? GRAB : after ? P_PRESENT : P_STAND, KIND, after ? 'smile' : 'worried', { flip: true });
    const fx = (out) => { if (!after || !out[1]) return ''; const [hx, hy] = out[1].head, R0 = out[1].R || 40; return `<line x1="${f(hx + R0 * 0.9)}" y1="${f(hy + R0 * 1.6)}" x2="${f(hx - R0 * 0.6)}" y2="${f(hy + R0 * 4.2)}" stroke="#15181e" stroke-width="7"/><line x1="${f(hx + R0 * 0.9)}" y1="${f(hy + R0 * 1.6)}" x2="${f(hx - R0 * 0.6)}" y2="${f(hy + R0 * 4.2)}" stroke="#fff" stroke-width="3" opacity="${f(0.7 + 0.3 * Math.sin(t * 6))}"/>`; };
    frame(U, B, after ? { z: 1.9, cx: 1100, cy: 560 } : pull ? { z: 1.5, cx: 1020, cy: 560 } : { z: 1.0, cx: 960, cy: 500 }, [hero, man], withMarks('d2', fx), { fxIn: true });
    L1(U, t, grab ? 'A STRANGER · STOPS YOU · THE BUS' : pull ? 'YOU PULL AWAY · FAST' : has(line, 'thanks') ? 'HE THANKS YOU ANYWAY' : after ? 'ELBOW TO WRIST · ONE CLEAN LINE' : 'THE CROSSWALK', 0.2, pull || after ? RED : null); chrome(U, t, info, d); return; }
  const B = E.park(tt, { t }); const FL = B.FLOOR, cutK = has(line, 'parts like', 'close your hand') ? clamp((t - 0.6) / 0.5) : since('d2', 'parts like') < k ? 1 : 0;
  B.mid += E.bike(1700, FL, 1.1); B.mid += E.chain(1560, FL - 120, 0.7, cutK, t); if (has(line, 'parts like')) B.mid += E.slash(1580, FL - 260, 1600, FL + 20, clamp((t - 0.45) / 0.2), clamp((t - 0.8) / 0.4), 0.8);
  const talk = has(line, 'ninety', 'bad lock', 'good lock', 'roommate');
  const hero = P(1300, FL, has(line, 'close your hand') ? GRAB : has(line, 'bad lock') ? P_SHRUG : P_STAND, has(line, 'bad lock') ? 'smile' : 'neutral', { look: 0.7 });
  const mara = Q(860, FL, has(line, 'proud') ? P_PRESENT : has(line, 'ninety', 'good lock') ? P_SHRUG : P_STAND, MARA, has(line, 'proud') ? 'smile' : talk ? 'worried' : 'neutral', { look: 0.8 });
  let cam = { z: 1.0, cx: 1200, cy: 500 }; if (has(line, 'close your hand', 'parts like')) cam = { z: 2.0, cx: 1520, cy: 700 }; if (has(line, 'ninety', 'good lock')) cam = { z: 1.6, cx: 900, cy: 520 }; if (has(line, 'bad lock') && !has(line, 'good')) cam = { z: 1.6, cx: 1300, cy: 520 };
  frame(U, B, cam, [hero, mara], withMarks('d2', ''), { fxIn: true });
  L1(U, t, has(line, 'steel', 'proud') ? 'MARA\'S BIKE LOCK · STEEL' : has(line, 'parts like', 'close your hand') ? 'CLEAVE · LIKE LICORICE' : has(line, 'ninety') ? '"A NINETY-DOLLAR LOCK."' : has(line, 'good lock') ? '"YOU\'RE A BAD ROOMMATE."' : has(line, 'bad lock') ? '"IT WAS A BAD LOCK."' : 'TUESDAY · THE PARK', 0.2, has(line, 'parts like') ? RED : null); chrome(U, t, info, d); };
// ---------- day 3, Wednesday: the heal, no sleep, the dog, the 3 a.m. door, the list ----------
S.d3 = (U, t, info, tt, k, n, line) => { const d = D(3, '9:00 PM', 5); if (cd(U, t, info, line, 3)) return;
  if (has(line, 'cut your own palm', 'by accident', 'close in under')) { handCard(U, t, info, D(3, '8:10 AM', 5), has(line, 'close in under')); return; }
  if (has(line, 'Reverse Cursed', 'Almost nobody')) { lore(U, t, 'REVERSE CURSED TECHNIQUE', ['SUKUNA CAN USE IT TO HEAL', 'ALMOST NOBODY IN THE STORY CAN'], `<circle cx="1560" cy="560" r="${f(140 + 30 * Math.sin(t * 3))}" fill="none" stroke="#bfe4ff" stroke-width="8"/><path d="M 1500 560 L 1620 560 M 1560 500 L 1560 620" stroke="#bfe4ff" stroke-width="16" stroke-linecap="round"/>`); chrome(U, t, info, d); return; }
  if (has(line, 'sleep you would', "isn't free", 'borrowed')) { rule(U, t, info, d, 'EVERY HEAL<br><span style="color:#ff2e3a">TAKES YOUR SLEEP.</span>', has(line, 'borrowed') ? "IT ISN'T FREE. IT'S BORROWED." : ''); return; }
  if (has(line, 'human brain', 'louder when', 'guess, not a fact')) { rule(U, t, info, d, has(line, 'louder') ? 'TIRED =<br><span style="color:#b48cff">A LOUDER VOICE?</span>' : 'NO REST.<br><span style="color:#b48cff">HOW LONG?</span>', has(line, 'not a fact') ? "A GUESS, NOT A FACT" : '', VIO, 'OUR GUESS'); return; }
  if (has(line, 'friend is afraid', 'form of respect')) { voice(U, t, info, d, 'Your friend is afraid. Fear is a form of respect.'); return; }
  if (has(line, 'Mara writes', 'Rule one', 'Rule two', 'Rule three', 'good list', "won't be enough")) { const B = E.apartment(tt, { t, time: 'morning', list: has(line, 'Rule three', 'good list', "won't") ? 3 : has(line, 'Rule two') ? 2 : has(line, 'Rule one') ? 1 : 0, listK: clamp(t / 1.2), cut: [1500, 500, 1760, 420] }); const FL = B.FLOOR;
    const mara = Q(1700, FL, P_PHONE, MARA, 'neutral', { flip: true });
    frame(U, B, has(line, "won't be enough") ? { z: 1.0, cx: 1300, cy: 520 } : { z: 2.0, cx: 1900, cy: 470 }, [mara, P(1250, FL, P_THINK, 'worried', { look: 0.8 })], '', { fxIn: true });
    L1(U, t, has(line, 'Rule one') ? 'RULE 1 · NO TOUCHING PEOPLE' : has(line, 'Rule two') ? 'RULE 2 · NO TOUCHING ANIMALS' : has(line, 'Rule three') ? 'RULE 3 · IF YOU SMILE, SAY IT' : has(line, "won't be enough") ? "IT WON'T BE ENOUGH" : 'THE RULES · ON THE FRIDGE', 0.2, has(line, "won't") ? RED : COL.yellow); chrome(U, t, info, D(4, '8:00 AM', 4)); return; }
  if (has(line, 'Four days left')) { countdown(U, t, info, 4, 3); return; }
  if (has(line, 'dog barks', 'hums along', 'three a.m.', 'in front of that door', 'two fingers raised', 'no memory')) { const B = E.hall(tt, { t }); const FL = B.FLOOR, door = has(line, 'three a.m.', 'in front of', 'fingers', 'memory');
    const hero = P(door ? 1460 : 360, FL, door ? TWO : P_STAND, door ? 'neutral' : 'worried', { look: 0.6 });
    const bark = `<g opacity="${f(0.5 + 0.5 * Math.max(0, Math.sin(t * 9)))}">${[0, 1, 2].map((i) => `<path d="M ${1650 + i * 40} ${FL - 420 - i * 20} q 30 40 0 80" stroke="#ffd23f" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')}<text x="1760" y="${FL - 470}" font-family="Inter" font-weight="900" font-size="54" fill="#ffd23f">WOOF</text></g>`;
    frame(U, B, door ? { z: 1.5, cx: 1460, cy: 560 } : { z: 1.0, cx: 960, cy: 520 }, [hero], withMarks('d3', door ? '' : bark, { fing: door }), { fxIn: true });
    if (door) U.svg('punch', `<rect width="1920" height="1080" fill="${RED}" opacity="${f(0.06 + 0.04 * Math.sin(t * 4))}"/>`, {}, { z: 4 });
    L1(U, t, has(line, 'three a.m.', 'in front of') ? '3:00 AM · THE NEIGHBOUR\'S DOOR' : has(line, 'memory', 'fingers') ? 'NO MEMORY OF CROSSING THE FLOOR' : has(line, 'hums') ? 'THE VOICE HUMS ALONG' : 'THE DOG · ALL NIGHT', 0.2, door ? RED : null); chrome(U, t, info, D(3, door ? '3:00 AM' : '11:50 PM', 5)); return; }
  // the flat: Mara stares, no sleep, lights off, back to bed
  const dark = has(line, 'light off', "don't need it", 'go back to bed', 'do not sleep', 'lie there', 'promise yourself', 'write down every rule', 'Wednesday night', "aren't tired");
  const B = E.apartment(tt, { t, time: dark ? 'dark' : 'morning', cut: [1500, 500, 1760, 420] }); const FL = B.FLOOR;
  const sitting = has(line, 'go back to bed', 'do not sleep', 'lie there', 'promise');
  const hero = P(1000, FL, sitting ? P_SIT : has(line, 'Not anymore') ? P_SHRUG : P_STAND, dark ? 'neutral' : 'neutral', { look: 0.6 });
  const ppl = [hero]; if (!dark) ppl.push(Q(1500, FL, has(line, 'Mara stares') ? P_SHIVER : P_THINK, MARA, 'worried', { flip: true }));
  const eyes = (out) => (dark && out[0] ? `<circle cx="${f(out[0].head[0] - 14)}" cy="${f(out[0].head[1] - 4)}" r="9" fill="${RED}" opacity="0.9"/><circle cx="${f(out[0].head[0] + 18)}" cy="${f(out[0].head[1] - 4)}" r="9" fill="${RED}" opacity="0.9"/>` : '');
  frame(U, B, has(line, 'Does it hurt', 'Not anymore') ? { z: 1.6, cx: has(line, 'Not anymore') ? 1020 : 1480, cy: 520 } : sitting ? { z: 1.4, cx: 1000, cy: 640 } : { z: 1.05, cx: 1100, cy: 520 }, ppl, withMarks('d3', (out) => (dark ? `<rect x="-800" y="-300" width="3520" height="2000" fill="#000" opacity="0.35"/>` : '') + eyes(out)), { fxIn: true });
  L1(U, t, has(line, 'Mara stares') ? 'MARA STARES' : has(line, 'Does it hurt') ? '"DOES IT HURT?"' : has(line, 'Not anymore') ? '"NOT ANYMORE."' : has(line, 'Wednesday night', 'two days') ? 'NO SLEEP · 2 DAYS · NOT TIRED' : has(line, 'light off', "don't need") ? 'LIGHTS OFF · YOU DON\'T NEED THEM' : has(line, 'promise', 'write down every') ? 'TOMORROW · WRITE DOWN EVERY RULE' : 'WEDNESDAY', 0.2); chrome(U, t, info, D(3, dark ? '11:30 PM' : '8:15 AM', 5)); };
// ---------- day 4, Thursday: Open (the car park at 5 a.m.) ----------
S.d4 = (U, t, info, tt, k, n, line) => { const d = D(4, '5:00 AM', 4); if (cd(U, t, info, line, 4)) return;
  if (has(line, 'Fuga', 'only works after', 'say "Open', 'say “Open', 'have to say')) { lore(U, t, 'FUGA · "OPEN"', ['A FIRE TECHNIQUE', 'ONLY AFTER DISMANTLE AND CLEAVE'], E.fuga(1500 + ((t * 300) % 500), 620, -8, 380, t, 0.9)); chrome(U, t, info, d); return; }
  if (has(line, 'Now you understand', 'never needed anyone')) { voice(U, t, info, d, 'Now you understand why I never needed anyone.'); return; }
  if (has(line, 'sake of the fight', "isn't a tool", "It's the point")) { lore(U, t, 'THE FIGHT ITSELF', ['SUKUNA FIGHTS FOR THE SAKE OF THE FIGHT', "POWER ISN'T A TOOL TO HIM", "IT'S THE POINT"], E.slashes(1560, 560, 260, 220, 14, clamp(t / 2), t, 3, { len: 200, w: 0.7 })); chrome(U, t, info, d); return; }
  if (has(line, "that's the temptation", 'Not the strength', 'relief of not needing')) { rule(U, t, info, d, has(line, 'relief') ? 'THE RELIEF OF<br><span style="color:#ff2e3a">NOT NEEDING ANYBODY.</span>' : 'THE TEMPTATION.<br>NOT THE STRENGTH.'); return; }
  if (has(line, 'marks cross', 'reach your jaw')) { const B = E.lot(tt, { t }); const FL = B.FLOOR; frame(U, B, { z: 2.6, cx: 960, cy: FL - 330 }, [P(960, FL, P_STAND, 'neutral', { look: 0 })], withMarks('d4', '', { lvl: 2 + (t > 0.8 ? 1 : 0) }), { fxIn: true }); L1(U, t, 'THURSDAY · THE MARKS REACH YOUR JAW', 0.3, RED); chrome(U, t, info, d); return; }
  if (has(line, 'Three days left')) { countdown(U, t, info, 3, 4); return; }
  const B = E.lot(tt, { t }); const FL = B.FLOOR, POST = since('d4', 'cut a concrete'), ARROW = since('d4', 'arrow of fire');
  const postCut = k > POST ? 1 : k === POST ? clamp((t - 0.4) / 0.6) : 0, burned = k > ARROW;
  B.mid += E.post(820, FL, postCut * (has(line, 'touch it') ? 1 : 1), k === POST && t < 0.6) + E.post(380, FL) + E.dumpster(2150, FL, 1, burned ? 1 : 0, t);
  const walkHome = has(line, 'walk home', 'half a step');
  const heroPose = has(line, 'say the word', 'arrow of fire') ? TWO : has(line, 'cut a concrete') ? TWO : walkHome ? walk(tt, 4) : P_STAND;
  const hx = walkHome ? 1300 - clamp(t / info.dur) * 600 : 1080, mx = walkHome ? hx + 300 : 1480;
  const hero = P(hx, FL, heroPose, has(line, 'You laughed', "hadn't noticed") ? 'smile' : 'neutral', { look: walkHome ? -0.7 : -0.6, flip: walkHome });
  const mara = Q(mx, FL, walkHome ? walk(tt, 4) : has(line, 'eyebrows') ? P_SHIVER : has(line, 'promise', 'test the next') ? P_PRESENT : P_STAND, MARA, has(line, 'eyebrows', 'quietly') ? 'worried' : 'neutral', { flip: true });
  let fx = (out) => { let g = ''; if (k === POST) g += E.slash(560, FL - 140, 1100, FL - 120, clamp(t / 0.3), clamp((t - 0.8) / 0.5), 1); if (k === ARROW) { const p = clamp(t / Math.max(1, info.dur * 0.7)); g += E.fuga(900 + p * 1300, FL - 180, 0, 340, t, 1); }
    if (brows && out[1]) g += [0, 1, 2].map((i) => `<circle cx="${f(out[1].head[0] + Math.sin(t * 2 + i) * 20)}" cy="${f(out[1].head[1] - 60 - ((t * 60 + i * 40) % 120))}" r="${f(16 + i * 4)}" fill="#8a8a98" opacity="0.4"/>`).join(''); return g; };
  let cam = { z: 1.0, cx: 1100, cy: 520 }; if (k === ARROW) cam = { z: 0.85, cx: 1300, cy: 480 }; const brows = has(line, 'eyebrows') && !(has(line, 'dumpster') && t < info.dur * 0.5); if (has(line, 'dumpster') && !brows) cam = { z: 0.9, cx: 1600, cy: 520 }; if (brows) cam = { z: 2.0, cx: 1480, cy: 560 }; if (has(line, 'You laughed', 'quietly')) cam = { z: 1.8, cx: 1450, cy: 540 }; if (has(line, "hadn't noticed")) cam = { z: 2.0, cx: 1080, cy: 540 }; if (k === POST) cam = { z: 1.3, cx: 900, cy: 600 };
  frame(U, B, cam, [hero, mara], withMarks('d4', fx, { fing: has(line, 'say the word', 'cut a concrete') }), { fxIn: true });
  L1(U, t, has(line, 'promise', 'test the next') ? 'MARA · "I\'M THERE."' : k === POST ? 'CUT · TOUCH · "OPEN."' : k === ARROW ? 'AN ARROW OF FIRE' : has(line, 'dumpster') && !brows ? '100 M · THE DUMPSTER' : brows ? 'EYEBROWS: FINE. MOSTLY.' : has(line, 'You laughed', 'quietly') ? '"YOU LAUGHED."' : has(line, "hadn't noticed") ? "YOU HADN'T NOTICED" : walkHome ? 'HALF A STEP BEHIND' : '5:00 AM · AN EMPTY CAR PARK', 0.2, k === ARROW ? '#ffb03a' : null); chrome(U, t, info, d); };
// ---------- day 5, Friday: the bus stop ----------
S.d5 = (U, t, info, tt, k, n, line) => { const d = D(5, '10:40 PM', 3); if (cd(U, t, info, line, 5)) return;
  if (has(line, 'Finish him', 'Almost kind')) { voice(U, t, info, d, 'Finish him.'); return; }
  if (has(line, 'real cost', 'What it makes easy')) { rule(U, t, info, d, 'THE REAL COST:<br><span style="color:#ff2e3a">WHAT IT MAKES EASY.</span>'); return; }
  if (has(line, 'Two days left')) { countdown(U, t, info, 2, 5); return; }
  const KITCH = since('d5', "doesn't go to her sister", 'kitchen floor');
  if (k >= KITCH) { const B = E.apartment(tt, { t, time: 'night', list: 3, cut: [1500, 500, 1760, 420] }); const FL = B.FLOOR, list = has(line, 'list on the fridge', 'Rule three is still');
    const hero = P(1150, FL, has(line, 'smiling right now') ? P_SHRUG : P_STAND, has(line, 'smiling right now', 'Yes,', 'anyway') ? 'smile' : 'neutral', { look: -0.6 }), mara = Q(760, FL, P_SIT, MARA, 'worried', { look: 0.7 });
    frame(U, B, list ? { z: 2.2, cx: 1900, cy: 460 } : has(line, 'smiling right now') ? { z: 1.7, cx: 1150, cy: 520 } : has(line, 'Yes,', 'anyway') ? { z: 1.6, cx: 800, cy: 620 } : { z: 1.05, cx: 1050, cy: 540 }, [hero, mara], withMarks('d5', ''), { fxIn: true });
    L1(U, t, list ? 'RULE 3 · STILL THERE' : has(line, 'smiling right now') ? '"I\'M SMILING, AREN\'T I?"' : has(line, 'Yes,', 'anyway') ? '"YES. TELL ME ANYWAY."' : has(line, 'Sunday') ? '"WHAT HAPPENS ON SUNDAY?"' : has(line, 'no reason') ? 'THE VOICE: NO REASON TO' : 'THE KITCHEN FLOOR', 0.2, list ? COL.yellow : null); chrome(U, t, info, D(5, '11:30 PM', 3)); return; }
  const LAMP = since('d5', 'throw yourself'), FALL = since('d5', 'The lamp falls');
  const ang = k < LAMP ? 0 : k === LAMP ? -70 * clamp((t - 0.5) / 0.8) : -70;
  const B = E.busStop(tt, { t, lampAng: ang }); const FL = B.FLOOR;
  const shove = has(line, 'shoves Mara', 'grabs her phone'), up = has(line, 'hand is up', 'Two fingers', 'clean line already'), fled = k >= FALL;
  const hero = P(k === LAMP ? 1000 + clamp(t / 0.8) * 380 : 1000, FL, k === LAMP ? run(tt) : up ? TWO : fled ? P_STAND : P_STAND, up ? 'neutral' : 'worried', { look: 0.7 });
  const thief = Q(fled ? 1500 + clamp(t / info.dur) * 900 : 1560, FL, fled ? run(tt) : shove ? GRAB : P_SHRUG, THIEF, shove ? 'smile' : 'worried', { flip: !fled });
  const mara = Q(700, FL, has(line, 'shaking', 'shoves') ? P_SHIVER : P_STAND, MARA, 'worried', { look: 0.7 });
  const fx = (out) => { let g = ''; if (up && out[0]) g += E.slash(out[0].hands[1][0] + 30, out[0].hands[1][1], out[0].hands[1][0] + 330, out[0].hands[1][1] - 40, 0.55 + 0.05 * Math.sin(t * 10), 0, 0.9); if (fled) g += `<rect x="1260" y="${FL - 18}" width="30" height="50" rx="6" fill="#15181e" transform="rotate(70 1275 ${FL})"/>`; return g; };
  let cam = { z: 1.0, cx: 1100, cy: 520 }; if (up) cam = { z: 1.7, cx: 1150, cy: 520 }; if (has(line, 'saw your face', 'looked happy')) cam = { z: 1.8, cx: 720, cy: 520 }; if (has(line, 'Mara is shaking')) cam = { z: 1.5, cx: 760, cy: 560 };
  frame(U, B, cam, [hero, mara, fled && has(line, 'keeps running', 'Everybody runs') ? thief : (fled ? null : thief)].filter(Boolean), withMarks('d5', fx, { fing: up }), { fxIn: true });
  L1(U, t, shove ? 'FRIDAY · THE BUS STOP' : up ? 'TWO FINGERS · THE LINE IS ALREADY THERE' : k === LAMP ? "YOU DON'T THROW IT" : has(line, 'lamp falls', 'Everybody runs') ? 'THE LAMP FALLS · EVERYBODY RUNS' : has(line, 'drops her phone') ? 'HE DROPS THE PHONE' : has(line, 'Nobody is hurt') ? 'NOBODY IS HURT' : has(line, 'happy') ? '"YOU LOOKED HAPPY."' : 'MARA IS SHAKING', 0.2, up ? RED : null); chrome(U, t, info, d); };
// ---------- day 6, Saturday: the map, the quarry, the chalk circles ----------
S.d6 = (U, t, info, tt, k, n, line) => { const d = D(6, '9:00 AM', 2); if (cd(U, t, info, line, 6)) return;
  if (has(line, 'close a wall')) { lore(U, t, 'NO WALL', ["IT DOESN'T CLOSE AROUND ANYONE"], `<g opacity="0.8"><path d="M 1260 820 A 300 260 0 0 1 1860 820" fill="none" stroke="#ff6a5a" stroke-width="10" stroke-dasharray="${f(940 * clamp(t / 0.6))} 2000"/><path d="M 1320 520 L 1800 860 M 1800 520 L 1320 860" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity="${f(clamp((t - 0.7) / 0.3))}"/></g>`); chrome(U, t, info, d); return; }
  if (has(line, 'cuts everything in range', 'anything with energy')) { const B = E.realm(tt, { t }); const FL = B.FLOOR; B.back += E.skyline(FL - 40, t, { night: true, seed: 61, cols: ['#2a1420', '#341824', '#2a1a2a'] }); B.mid += E.shrine(960, FL + 40, 1000, clamp(t / 1.4), t, { n: 120, seed: 9 });
    frame(U, B, { z: 0.95, cx: 960, cy: 480 }, [], '', { fxIn: true }); L1(U, t, has(line, 'energy') ? 'CLEAVE: ENERGY · DISMANTLE: EVERYTHING ELSE' : 'EVERYTHING IN RANGE', 0.2, RED); chrome(U, t, info, d); return; }
  if (has(line, 'no barrier', 'everything else')) { lore(U, t, 'MALEVOLENT SHRINE', ['NO BARRIER · NO WALL', 'CLEAVE: ANYTHING WITH ENERGY', 'DISMANTLE: EVERYTHING ELSE'], E.shrine(1560, 760, 300, clamp(t / 2), t, { n: 30 })); chrome(U, t, info, d); return; }
  if (has(line, 'wiki says', 'two hundred meters', 'Binding Vow')) { bigNum(U, t, info, d, '~200', 'M', 'ITS REACH · WITH A BINDING VOW', 'SOURCE: JUJUTSU KAISEN WIKI (FAN WIKI)'); return; }
  if (has(line, 'opens by itself', "can't stop it", 'choose where') || line.trim() === 'In your version,') { full(U, E.mapCard(t, { title: 'MIDNIGHT · SUNDAY', r: 200 + 40 * Math.sin(t * 2) })); L1(U, t, has(line, 'choose where') ? 'YOU CAN ONLY CHOOSE WHERE' : "IT OPENS BY ITSELF · YOU CAN'T STOP IT", 0.2, RED); chrome(U, t, info, d); return; }
  if (has(line, 'no houses', 'one gate')) { const B = E.quarry(tt, { t, time: 'day', gate: 1500 }); frame(U, B, { z: 0.85, cx: 960, cy: 460 }, [], '', { fxIn: true }); L1(U, t, 'NO HOUSES · NO ROAD · ONE GATE', 0.2, RED); chrome(U, t, info, d); return; }
  if (has(line, 'three hundred meters', 'quarry, four')) { full(U, E.mapCard(t, { title: 'QUARRY · 4 KM', r: 150, cx: 1100, cy: 360, pin: [1100, 360] })); L1(U, t, has(line, 'three hundred') ? '300 M OF NOTHING' : 'NO HOUSES · NO ROAD · ONE GATE', 0.2, RED); chrome(U, t, info, d); return; }
  if (has(line, 'learning where a power stops', 'Nobody teaches')) { rule(U, t, info, d, 'WHERE IT STOPS<br><span style="color:#b48cff">IS THE HARD PART.</span>', has(line, 'Nobody teaches') ? 'NOBODY TEACHES THAT PART' : '', VIO, 'OUR GUESS'); return; }
  if (has(line, 'One day left')) { countdown(U, t, info, 1, 6); return; }
  if (has(line, 'calling someone', 'police', 'priest', 'fictional king', 'empty field')) { const B = E.apartment(tt, { t, time: 'night', list: 3, cut: [1500, 500, 1760, 420] }); const FL = B.FLOOR; const hero = P(1000, FL, P_THINK, 'worried', { look: 0.4 });
    const icons = ['<rect x="-40" y="-60" width="80" height="50" rx="8" fill="#2f86e0"/><text x="0" y="-25" text-anchor="middle" font-family="Inter" font-weight="900" font-size="26" fill="#fff">911</text>', '<rect x="-14" y="-80" width="28" height="80" fill="#e8452e"/><rect x="-40" y="-54" width="80" height="28" fill="#e8452e"/>', '<rect x="-30" y="-80" width="60" height="70" rx="6" fill="#2a2d3a"/><rect x="-6" y="-72" width="12" height="40" fill="#fff"/><rect x="-18" y="-60" width="36" height="12" fill="#fff"/>'];
    const fx = (out) => has(line, 'police', 'priest') ? icons.map((ic, i) => `<g transform="translate(${760 + i * 240} ${FL - 640}) scale(${f(ease.out(clamp((t - i * 0.4) / 0.3)))})"><circle cx="0" cy="-40" r="80" fill="#fff"/>${ic}</g>`).join('') : '';
    frame(U, B, { z: 1.1, cx: 1000, cy: 480 }, [hero], withMarks('d6', fx), { fxIn: true }); if (has(line, 'fictional king', 'empty field')) big(U, `<div style="font:italic 800 56px Georgia,serif;color:#fff;max-width:1200px;text-shadow:0 4px 0 #000;opacity:${f(clamp(t / 0.3))}">“A fictional king lives in my body, and I need an empty field by midnight.”</div>`, 300, 640);
    L1(U, t, has(line, 'police', 'priest') ? 'THE POLICE · A DOCTOR · A PRIEST' : has(line, 'saying what') ? 'AND SAY WHAT?' : 'CALL SOMEONE?', 0.2); chrome(U, t, info, D(6, '9:20 AM', 2)); return; }
  const Q0 = since('d6', 'So you spend Saturday', 'drive out');
  if (k >= Q0) { const sunset = has(line, 'By sunset', 'two out of five', 'Twice out of five', 'Not three', "It's what you have"); const B = E.quarry(tt, { t, time: sunset ? 'sunset' : 'day', chalk: k > Q0 || has(line, 'chalk') }); const FL = B.FLOOR;
    const feel = has(line, 'stand at the center', 'feel the edge', 'step in the dark'), hits = sunset ? 2 : 0;
    const hero = P(960, FL + 90, feel ? ARMS : has(line, 'drive out') ? walk(tt) : P_STAND, 'neutral', { look: 0 });
    const fx = (out) => { let g = ''; if (feel || sunset) g += E.shrine(960, FL + 90, 420 + (sunset ? 30 * Math.sin(t * 2) : 120 * Math.sin(t * 1.5)), clamp(t / 1.2), t, { n: 30, ry: 0.157 }); if (sunset) g += [...Array(5)].map((_, i) => `<g transform="translate(${1500 + i * 70} 330)"><rect x="-24" y="-60" width="48" height="60" rx="8" fill="${i < hits ? '#4fd06a' : '#3a2a30'}" opacity="${f(clamp((t - i * 0.2) / 0.2))}"/><text x="0" y="-18" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#fff">${i < hits ? '✓' : '✗'}</text></g>`).join(''); return g; };
    frame(U, B, has(line, 'drive out') ? { z: 0.9, cx: 960, cy: 480 } : has(line, 'chalk', 'smaller one') ? { z: 1.0, cx: 960, cy: 640 } : feel ? { z: 1.3, cx: 960, cy: 620 } : { z: 1.0, cx: 960, cy: 540 }, [hero], withMarks('d6', fx), { fxIn: true });
    L1(U, t, has(line, 'drive out', 'Saturday') ? 'SATURDAY · PRACTICE' : has(line, 'chalk', 'smaller one') ? 'TWO CIRCLES · CHALK ON GRAVEL' : feel ? 'FEEL THE EDGE · IN THE DARK' : has(line, 'two out of five', 'Not three') ? 'THE SMALL CIRCLE · 2 OUT OF 5' : has(line, "isn't enough") ? "2 / 5 ISN'T ENOUGH" : "IT'S WHAT YOU HAVE", 0.2, sunset ? RED : null); chrome(U, t, info, D(6, sunset ? '7:40 PM' : '1:00 PM', 2)); return; }
  // the flat, morning: telling the truth, Mara reads the map
  const B = E.apartment(tt, { t, time: 'morning', list: 3, cut: [1500, 500, 1760, 420] }); const FL = B.FLOOR;
  const hero = P(1150, FL, has(line, "That's the plan") ? P_SHRUG : P_STAND, 'neutral', { look: -0.6 }), mara = Q(760, FL, has(line, 'reads the map') ? P_PHONE : has(line, 'terrible') ? P_SHRUG : P_STAND, MARA, 'worried', { look: 0.7 });
  frame(U, B, has(line, 'going alone', 'terrible') ? { z: 1.7, cx: 780, cy: 520 } : has(line, "That's the plan") ? { z: 1.7, cx: 1150, cy: 520 } : { z: 1.05, cx: 1000, cy: 520 }, [hero, mara], withMarks('d6', ''), { fxIn: true });
  L1(U, t, has(line, 'truth') ? 'SATURDAY · THE TRUTH' : has(line, 'going alone') ? '"YOU\'RE GOING ALONE."' : has(line, 'terrible') ? '"THAT\'S A TERRIBLE PLAN."' : has(line, "That's the plan") ? '"THAT\'S THE PLAN."' : 'MARA READS THE MAP', 0.2); chrome(U, t, info, d); };
// ---------- day 7, Sunday: the quarry at night ----------
S.d7 = (U, t, info, tt, k, n, line) => { const d = D(7, '11:40 PM', 1), MID = since('d7', 'Midnight.'), OPEN = since('d7', 'opens without a sound');
  if (has(line, 'Eleven forty') && t < 1.3) { clockCard(U, t, info, d, '11:40', 'SUNDAY · PM'); return; }
  if (has(line, 'Let her stay', 'Loss teaches')) { voice(U, t, info, d, 'Let her stay. Loss teaches better than anything.'); return; }
  if (has(line, 'Not far enough') && t > info.dur * 0.5) { rangeCard(U, t, info, d, 200, { mara: true }); L1(U, t, 'NOT FAR ENOUGH', 0.2, RED); return; }
  if (has(line, 'Shibuya', 'spare Megumi', 'one hundred and forty')) { bigNum(U, t, info, d, '~140', 'M', 'SHIBUYA · NARROWED TO SPARE MEGUMI', 'SOURCE: JUJUTSU KAISEN WIKI (FAN WIKI)'); return; }
  if (has(line, 'do the same', "vow isn't free", "give up the thing")) { rule(U, t, info, d, has(line, 'give up') ? 'YOU GIVE UP<br><span style="color:#ff2e3a">WHAT YOU NARROW FOR.</span>' : 'YOU CAN NARROW IT.<br><span style="color:#ff2e3a">A VOW ISN\'T FREE.</span>'); return; }
  if (has(line, 'Hundred and forty meters', 'Not a hundred and fifty')) { rangeCard(U, t, info, D(7, '12:00 AM', 0), 140, { mara: true, ghost: 200 }); L1(U, t, '140 M · NOT 150', 0.2, RED); return; }
  if (k === MID && has(line, 'Midnight') && line.trim().length < 14) { clockCard(U, t, info, D(7, '12:00 AM', 0), '00:00', 'MIDNIGHT'); return; }
  if (has(line, 'Interesting')) { voice(U, t, info, D(7, '12:00 AM', 0), 'Interesting.'); return; }
  const open = k >= OPEN, gone = has(line, "it's gone"), after = has(line, 'ten meters outside', 'flashlight is still') || gone;
  const B = E.quarry(tt, { t, time: 'night', gate: 1840, moonR: 130, cut: open, craneCut: open ? (k === OPEN ? clamp((t - 1) / 1.5) : 1) : 0 }); const FL = B.FLOOR;
  const turn = has(line, 'turn around', 'Mara followed', 'gate, with a flashlight', 'hundred and fifty meters behind');
  const say = has(line, 'say it out loud', 'the radius', 'paying with', 'All the marks');
  const hero = P(760, FL + 40, open || say ? ARMS : P_STAND, gone ? 'neutral' : 'neutral', { look: turn ? 0.9 : 0, h: 330 });
  const mara = Q(1950, FL + 10, P_PHONE, MARA, 'worried', { h: 190, flip: true });
  const beam = `<path d="M 1915 ${FL - 125} L 1560 ${FL - 40} L 1560 ${FL + 50} Z" fill="#fff4b0" opacity="${f(0.35 + 0.05 * Math.sin(t * 20))}"/>`;
  const ring = open && !gone ? E.shrine(760, FL + 60, 1060, k === OPEN ? clamp(t / 1.2) : 1, t + k, { n: 110, seed: 7 + k }) : '';
  const fx = (out) => { let g = beam + ring; if (say) g += ['140 M', 'THE PRICE: THE KING'].map((s, i) => `<text x="${760}" y="${FL - 470 - i * 70}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="46" fill="${RED}" opacity="${f(clamp((t - i * 0.8) / 0.3))}">${s}</text>`).join(''); return g; };
  let cam = { z: 1.0, cx: 1100, cy: 520 }; if (turn) cam = { z: 0.9, cx: 1300, cy: 520 }; if (has(line, 'arms are covered', 'stopped suggesting', 'always lived')) cam = { z: 1.8, cx: 760, cy: 640 }; if (say) cam = { z: 1.3, cx: 760, cy: 560 }; if (open) cam = { z: 0.85, cx: 1000, cy: 470 }; if (after) cam = { z: 1.3, cx: 1700, cy: 640 }; if (gone) cam = { z: 1.8, cx: 760, cy: 660 };
  frame(U, B, cam, [hero, mara], withMarks('d7', fx, { lvl: gone ? (t < 0.8 ? 4 : 0) : 4, arms: !gone }), { fxIn: true });
  if (k === OPEN && t < 0.4) U.svg('punch', `<rect width="1920" height="1080" fill="#fff" opacity="${f(0.6 * (1 - t / 0.4))}"/>`, {}, { z: 4 });
  L1(U, t, has(line, 'arms are covered') ? 'SUNDAY · 11:40 PM · MARKS ON YOUR ARMS' : has(line, 'stopped suggesting', 'always lived') ? 'THE VOICE JUST TALKS NOW' : turn ? 'MARA · 150 M · AT THE GATE' : say ? 'THE RADIUS · THE NUMBER · THE PRICE' : has(line, 'opens without') ? 'NOT A WALL · NOT A DOME' : has(line, 'everything in range') ? 'EVERYTHING IN RANGE · CUT' : has(line, 'quarry wall', 'crane', 'gravel') ? 'THE WALL · THE CRANE · THE SIGN · THE GRAVEL' : has(line, 'Thousands') ? 'THOUSANDS OF CLEAN LINES' : after && !gone ? 'MARA · 10 M OUTSIDE · FLASHLIGHT ON' : gone ? 'GONE' : 'THE QUARRY', 0.2, open || say ? RED : null); chrome(U, t, info, open ? D(7, '12:00 AM', 0) : d); };
// ---------- Monday again ----------
S.mon = (U, t, info, tt, k, n, line) => { const d = { day: 8, time: 'MONDAY', status: { text: 'THE KING · GONE', on: true, color: BLUE } }, HOME = since('mon', 'At home', 'marks are gone');
  if (has(line, "what the title meant", 'Not even the King', 'seven days as the King')) { rule(U, t, info, d, 'NOBODY SURVIVES 7 DAYS AS THE KING.<br><span style="color:#2f6fe0">NOT EVEN THE KING.</span>', '', BLUE); return; }
  if (has(line, 'narrowed it', 'Tell me in the comments', 'who you want to become')) { const B = E.realm(tt, { t }); frame(U, B, { z: 1.0, cx: 960, cy: 520 }, [], '', { fxIn: true }); U.svg('card', `<rect width="1920" height="1080" fill="#000" opacity="0.45"/>`, {}, { z: 3 });
    big(U, `<div style="${TXT(84)};text-shadow:0 8px 0 #000;max-width:1200px;opacity:${f(clamp(t / 0.3))}">${has(line, 'who you want') ? 'Who do you want<br>to become next?' : 'Would you have<br><span style="color:#ff2e3a">narrowed it?</span>'}</div>`, 160, 320); chrome(U, t, info, { day: null, time: null, status: { text: 'YOUR TURN', on: true, color: COL.yellow } }); return; }
  if (k >= HOME) { const B = E.apartment(tt, { t, time: 'morning', list: 3, cut: [1500, 500, 1760, 420] }); const FL = B.FLOOR; B.mid += E.loaf(760, FL - 270, 1.2, 6, true) + `<g opacity="0.5">${[0, 1, 2].map((i) => `<circle cx="${f(560 + Math.sin(t * 2 + i) * 20)}" cy="${f(FL - 330 - ((t * 50 + i * 40) % 140))}" r="${16 + i * 5}" fill="#6a6a78"/>`).join('')}</g><rect x="500" y="${FL - 330}" width="120" height="60" rx="10" fill="#c8ccd4"/><rect x="520" y="${FL - 340}" width="80" height="14" fill="#2a2d3a"/>`;
    const wall = has(line, 'clean line', 'landlord'); const hero = P(1200, FL, has(line, 'marks are gone') ? P_SHRUG : P_STAND, 'smile', { look: -0.6 }), mara = Q(860, FL, CUP, MARA, 'smile', { look: 0.7 });
    frame(U, B, wall ? { z: 2.0, cx: 1630, cy: 470 } : has(line, 'bread', 'burned') ? { z: 1.6, cx: 720, cy: 540 } : has(line, 'marks are gone') ? { z: 1.9, cx: 1200, cy: 520 } : { z: 1.05, cx: 1050, cy: 520 }, [hero, mara], '', { fxIn: true });
    L1(U, t, has(line, 'marks are gone') ? 'THE MARKS ARE GONE' : has(line, 'burned') ? 'A NORMAL LOAF · ONE BURNED SLICE' : has(line, 'landlord') ? "THE LANDLORD HASN'T NOTICED" : wall ? 'THE WALL · STILL CUT' : 'HOME', 0.2, BLUE); chrome(U, t, info, d); return; }
  const B = E.quarry(tt, { t, time: 'dawn', cut: true, craneCut: 1 }); const FL = B.FLOOR;
  const hero = P(900, FL + 60, P_SIT, has(line, 'You laugh', 'I know') ? 'smile' : 'neutral', { look: 0.7 }), mara = Q(1180, FL + 60, P_SIT, MARA, has(line, 'stop now') ? 'smile' : 'worried', { flip: true });
  const fx = has(line, 'flashlight', 'battery') ? `<rect x="1080" y="${FL - 10}" width="70" height="24" rx="8" fill="#3a3f4a"/>` : '';
  const empty = has(line, 'Nobody in range survived', 'no one in range', 'whole plan');
  frame(U, B, empty ? { z: 0.9, cx: 960, cy: 480 } : has(line, 'You laugh') ? { z: 2.0, cx: 920, cy: 620 } : has(line, 'smiled', 'stop now') ? { z: 1.8, cx: 1160, cy: 620 } : has(line, 'I know') ? { z: 1.8, cx: 920, cy: 620 } : { z: 1.2, cx: 1040, cy: 620 }, empty ? [] : [hero, mara], fx, { fxIn: true });
  L1(U, t, empty ? 'NOBODY IN RANGE · NOBODY THERE' : has(line, 'wake up as yourself') ? 'YOU WAKE UP · AS YOURSELF' : has(line, 'battery') ? 'THE FLASHLIGHT · OUT OF BATTERY' : has(line, 'smiled') ? '"YOU SMILED, AT THE END."' : has(line, 'stop now') ? '"YOU CAN STOP NOW."' : has(line, 'You laugh') ? 'YOUR LAUGH · AGAIN' : 'DAWN', 0.2, BLUE); chrome(U, t, info, d); };

// CANON / OUR RULE / OUR GUESS seal in the top-left corner while the narration says that sentence (times from the voice)
const TAGCOL = { 'CANON': GOLD, 'OUR RULE': RED, 'OUR GUESS': VIO };
const tagSeal = (U, g) => { const a = TAGS.find((x) => g >= x.t0 && g <= x.t1);
  if (!a) { U.html('tag', '', {}); return; } const k = clamp((g - a.t0) / 0.2), c = TAGCOL[a.tag];
  U.html('tag', `<div style="opacity:${f(k)};transform:scale(${f(0.85 + 0.15 * ease.out(k))});transform-origin:left top;display:inline-flex;align-items:center;gap:10px;background:rgba(10,8,14,.82);border:3px solid ${c};border-radius:10px;padding:8px 16px"><div style="width:14px;height:14px;border-radius:3px;background:${c}"></div><div style="font:900 28px 'IBM Plex Mono';letter-spacing:.08em;color:${c}">${a.tag}</div></div>`, { left: '46px', top: '104px' }, { z: 60 }); };

const BG = { open: '#2a0610', d1: '#e8d4b0', d2: '#7ac0f0', d3: '#1c2236', d4: '#1a2450', d5: '#0a0c22', d6: '#e8d4b0', d7: '#12040a', mon: '#e8d4b0' };
// shots that must show the action (never a typography card or a close-up)
const WIDE = new Set(Object.entries(PLAN).filter(([, p]) => has(p.line, 'Ryomen Sukuna', 'In real life', 'nobody in range', 'end of the seventh', 'opens on its own', 'standing nearby', 'point two fingers', 'Eleven slices', 'clean line through', 'walks in', 'bathroom mirror', 'parts like', 'close your hand', 'grabs your sleeve', 'hand moves', 'clean line down', 'three a.m.', 'in front of that door', 'cut a concrete', 'arrow of fire', 'shoves Mara', 'hand is up', 'throw yourself', 'lamp falls', 'Everybody runs', 'turn around', 'Mara followed', 'opens without a sound', 'everything in range', 'quarry wall', 'Thousands', 'ten meters outside', 'quarry floor', 'chalk', 'stand at the center', 'drive out', 'Rule one', 'Rule two', 'Rule three')).map(([id]) => id));
const CUTS = {}; { const by = {}; for (const [id, p] of Object.entries(PLAN)) (by[p.sec] = by[p.sec] || []).push(id);
  for (const ids of Object.values(by)) ids.forEach((id, k) => { CUTS[id] = WIDE.has(id) || k === 0 ? 'wide' : ['close', 'wide', 'wide', 'close', 'wide'][(k - 1) % 5]; }); }
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const SHOT = (id, bg, body, sec, line) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { SECNOW = sec; U.svg('fx', '', {}); U.svg('card', '', {}); U.html('big', '', {}); U.svg('punch', '', {}); FULLED = false; LT = t; DUR = info.dur; MOVE = hash(id) % 4; CUT = CUTS[id] === 'close' ? 'close' : 'wide'; body(U, t, info, info.start + t); CUT = 'wide'; if (CUTS[id] === 'kin' && !FULLED && sec !== 'mon' && !has(line, 'Lesson', 'days left', 'day left')) kin(U, t, line, sec); tagSeal(U, info.start + t); } });
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line), p.sec, p.line);
