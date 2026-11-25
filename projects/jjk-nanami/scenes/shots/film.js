// "What If You Became Nanami? Clock Out at 5 or Die" — flat 2D, our own designs. One working day, 8:52 a.m. to 5:11 p.m.
// (no day count: a clock in the corner, and a status chip: CLOCKED IN → OVERTIME with the heart countdown → CLOCKED OUT).
// Shots come from PLAN (story sections); each section draws by keywords in the narration line. Look (matches the
// thumbnail): red / gold, the office tower at night with lit windows and silhouettes, a big wall clock at 5:00, the hero as
// a stickman with a round black head and bright white eyes in a tan suit with a yellow tie and a wristwatch, the gold 7:3
// line across things, the curse made of desks and clocks. Detailed sets in parallax, a camera that always drifts.
// Seals CANON / OUR RULE / OUR GUESS show top-left while that sentence is spoken.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_THINK, P_TIRED, P_PHONE, P_SIT, P_RUN, P_SHRUG, P_PRESENT, P_SHIVER } from '../lib/people.js';
import { P_STAND, P_POINT, P_HIPS } from '../lib/char2d.js';
import { hud, label, caption, COL } from '../lib/hud.js';
import { frame as frame0 } from '../lib/flat2d.js';
import * as K from '../lib/sets/sk2d.js';
import * as E from '../lib/sets/nn2d.js';
import { PLAN, TAGS } from './plan.js';

const f = (n) => n.toFixed(1);
const RED = E.RED, GOLD = E.GOLD, GREEN = E.GREEN, VIO = '#b48cff', GREY = '#c8ccd8', TAN = '#b89a6a';
const HERO = { top: TAN, bottom: '#2a2d3a', hair: 'short', broad: true };
const PRIYA = { top: '#3fb8a0', bottom: '#2a2d4a', hair: 'ponytail' };
const HALE = { top: '#5a5f72', bottom: '#2a2d3a', hair: 'short', broad: true };
const CROWD = [{ top: '#e05a5a', bottom: '#2a2d3a' }, { top: '#4a7ae0', bottom: '#3a3d4c' }, { top: '#e0b44a', bottom: '#2a2d3a', hair: 'ponytail' }, { top: '#8a5ae0', bottom: '#2a2d4a' }, { top: '#4fa06a', bottom: '#2a2d3a' }];
const TITLE = 'WHAT IF YOU BECAME NANAMI?';
// the clock (top-right) per section; some lines name their own time
const CLOCK = { open: '8:52 AM', line: '8:55 AM', schedule: '10:00 AM', stairs: '12:30 PM', collapse: '3:15 PM', out: '4:40 PM', overtime: '5:00 PM', fight: '5:06 PM', clock: '5:11 PM' };
const SEC0 = {}; { const S0 = Object.values(PLAN); } // filled below from TAGS-free section starts
let SECNOW = 'open', G = 0, LINE = '';
// story minutes after 5:00 during overtime: 5:00 → 5:06 over the overtime section, 5:06 → 5:11 over the fight
let T_OVER = 0, T_FIGHT = 0, T_CLOCK = 0;
const overMin = (g) => g < T_FIGHT ? 6 * clamp((g - T_OVER) / Math.max(1, T_FIGHT - T_OVER)) : 6 + 5 * clamp((g - T_FIGHT) / Math.max(1, T_CLOCK - T_FIGHT));
const mmss = (m) => { const s = Math.max(0, Math.round(m * 60)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const timeNow = () => { const l = LINE;
  if (has(l, 'eight fifty-nine')) return '8:59 AM'; if (has(l, 'three forty-one', 'covered in dust')) return '3:41 PM'; if (has(l, 'four fifty-eight', 'green font', 'turn around')) return '4:58 PM';
  if (has(l, 'fifty-nine and fifty')) return '4:59 PM'; if (SECNOW === 'out' && since('out', 'turn around') <= KNOW) return '4:59 PM'; if (SECNOW === 'out' && since('out', 'time clock') <= KNOW) return '4:58 PM'; if (SECNOW === 'out' && since('out', 'walk to the glass') <= KNOW) return '4:50 PM'; if (has(l, 'counting the minutes')) return '12:47 PM'; if (has(l, 'Five eleven')) return '5:11 PM';
  if (SECNOW === 'overtime' || SECNOW === 'fight') { const m = overMin(G); return `5:${String(Math.min(11, Math.floor(m))).padStart(2, '0')} PM`; }
  if (SECNOW === 'clock' && since('clock', 'next morning') <= KNOW) return has(l, 'leave at five', 'five oh one', 'Would you', 'hundred more', 'comments', 'who you want') ? '5:00 PM' : '8:59 AM';
  return CLOCK[SECNOW]; };
let KNOW = 0;
const chip = () => { if (SECNOW === 'overtime' || SECNOW === 'fight') { const left = 11 - overMin(G); return { text: `OVERTIME · HEART ${mmss(left)}`, on: true, color: RED }; }
  if (SECNOW === 'clock' && since('clock', 'Five eleven') <= KNOW) return { text: 'CLOCKED OUT', on: true, color: GREEN };
  if (SECNOW === 'clock') return { text: 'OVERTIME · CLOCK OUT!', on: true, color: RED };
  if (SECNOW === 'out' && since('out', 'green font') <= KNOW) return { text: 'CLOCKED OUT · 4:58', on: true, color: GREEN };
  return { text: 'CLOCKED IN · DOORS SEAL AT 5:00', on: true, color: GOLD }; };
const chrome = (U, t, info, o = {}) => { hud(U, { title: TITLE, day: null, status: o.status || chip() });
  const tm = o.time || timeNow(), late = SECNOW === 'overtime' || SECNOW === 'fight';
  U.html('clock', `<div style="display:flex;align-items:center;gap:14px;background:rgba(10,8,14,.78);border:2px solid ${late ? RED : GOLD};border-radius:12px;padding:6px 18px"><svg width="30" height="30" viewBox="-15 -15 30 30"><circle r="12" fill="none" stroke="${late ? RED : GOLD}" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="0" x2="${f(6 * Math.sin(t * 0.8))}" y2="${f(-6 * Math.cos(t * 0.8))}" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg><div style="font:800 34px 'IBM Plex Mono';color:#fff;letter-spacing:.06em">${tm}</div></div>`, { right: '46px', top: '96px' }, { z: 61 });
  caption(U, info, t); };
const LX = (txt) => Math.min(1180, 1840 - txt.length * 24 - 70);
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 260, c ? { color: c } : {});
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const since = (sec, ...w) => { let best = 1e9; for (const p of Object.values(PLAN)) if (p.sec === sec && has(p.line, ...w)) best = Math.min(best, p.k); return best; };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
// limbs: walk / run cycles and the "alive" layer (as in the Sukuna and Toji films)
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp), c = Math.cos(tt * sp), a = (v) => 16 + v;
  return { ...P_STAND, cyc: true, bob: Math.abs(c) * 7, lean: 4 + Math.abs(s) * 2, head: 2 + Math.sin(tt * sp * 2) * 2,
    aL: [a(-s * 26), a(-s * 26) + 16 + 12 * Math.max(0, -s)], aR: [a(s * 26), a(s * 26) + 16 + 12 * Math.max(0, s)],
    lL: [6 + s * 26, 10 + 55 * Math.max(0, c)], lR: [6 - s * 26, 10 + 55 * Math.max(0, -c)] }; };
const run = (tt) => { const s = Math.sin(tt * 10), c = Math.cos(tt * 10);
  return { ...P_RUN, cyc: true, bob: Math.abs(c) * 12, lean: 10 + Math.abs(s) * 3, head: 4,
    aL: [36 - s * 32, 96 - s * 24], aR: [36 + s * 32, 96 + s * 24], lL: [8 + s * 32, 20 + 70 * Math.max(0, c)], lR: [8 - s * 32, 20 + 70 * Math.max(0, -c)] }; };
const crawl = (tt) => { const s = Math.sin(tt * 4); return { lean: 62, aL: [100 + s * 20, 20], aR: [100 - s * 20, 20], lL: [40 + s * 14, 60], lR: [40 - s * 14, 60], head: -20, cyc: true }; };
const lerp = (a, b, k) => a + (b - a) * k;
const RELAX = { lean: 0, aL: [10, 8], aR: [10, 8], lL: [4, 0], lR: [4, 0], head: 0 };
const mixPose = (A, B, k) => { const o = { ...B }; for (const key of ['aL', 'aR', 'lL', 'lR']) o[key] = [lerp(A[key][0], B[key][0], k), lerp(A[key][1], B[key][1], k)]; o.lean = lerp(A.lean || 0, B.lean || 0, k); o.head = lerp(A.head || 0, B.head || 0, k); return o; };
let LT = 0, DUR = 3, MOVE = 0, CUT = 'wide';
const live = (pose, seed) => { if (!pose || pose.sit) return pose; const w = LT * 1.7 + seed;
  let p = pose; if (!pose.cyc) { const k = 0.3 + 0.7 * ease.out(clamp(LT / 0.45)); p = mixPose(RELAX, pose, k); }
  const a = 4 * Math.sin(w), b = 5 * Math.sin(w * 1.3 + 1), sh = Math.sin(w * 0.45);
  return { ...p, aL: [p.aL[0] + a, p.aL[1] + b], aR: [p.aR[0] - a * 0.8, p.aR[1] - b * 0.9],
    lL: pose.cyc ? p.lL : [p.lL[0] + 2.5 * sh, p.lL[1] + 4 * Math.max(0, -sh)], lR: pose.cyc ? p.lR : [p.lR[0] - 2.5 * sh, p.lR[1] + 4 * Math.max(0, sh)],
    lean: (p.lean || 0) + (pose.cyc ? 0 : 1.2 * sh), head: (p.head || 0) + 2.5 * Math.sin(w * 0.7) }; };
const HOLD = { ...P_STAND, aR: [60, 80] };
const WATCH = { ...P_STAND, aL: [60, 150], head: 18 };                   // checking the watch
const TAP = { ...P_STAND, lean: 6, aR: [86, 30], head: 6 };              // a knuckle tap
const SWING = { ...P_STAND, lean: 12, aR: [140, 10], aL: [60, 40], lL: [16, 20], lR: [-4, 0] };
const LOW = { ...P_STAND, lean: 40, aR: [120, 10], aL: [60, 40], lL: [30, 50], lR: [-6, 10], head: 20 };   // tapping the floor
const HURT = { ...P_TIRED, aR: [40, 110], lean: 26 };
const DOWN = { sit: true, lean: 20, aL: [30, 40], aR: [10, 20], lL: [0, 0], lR: [0, 0], head: 24 };
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y: y - (pose && pose.bob || 0), h: o.h || 360, pose: live(pose, 0.3), outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, hero: true });
const Q = (x, y, pose, outfit = PRIYA, face = 'neutral', o = {}) => ({ x, y: y - (pose && pose.bob || 0), h: o.h || 330, pose: live(pose, 2.1 + x * 0.001), outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5 });
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
const full = (U, svg) => U.svg('card', svg, {}, { z: 3 });
// the hero's suit details: yellow tie and gold wristwatch (drawn on top of the figure)
const suit = (i = 0) => (out) => { const c = out[i]; if (!c || !c.shL || !c.shR) return ''; const R = c.R || 40, mx = (c.shL[0] + c.shR[0]) / 2, my = (c.shL[1] + c.shR[1]) / 2;
  let g = `<path d="M ${f(mx - R * 0.22)} ${f(my - R * 0.1)} L ${f(mx + R * 0.22)} ${f(my - R * 0.1)} L ${f(mx + R * 0.14)} ${f(my + R * 0.25)} L ${f(mx + R * 0.3)} ${f(my + R * 1.9)} L ${f(mx)} ${f(my + R * 2.3)} L ${f(mx - R * 0.3)} ${f(my + R * 1.9)} L ${f(mx - R * 0.14)} ${f(my + R * 0.25)} Z" fill="${GOLD}" stroke="#a87a10" stroke-width="${f(R * 0.06)}"/>`;
  if (c.hands) { const w = c.hands[0]; g += `<circle cx="${f(w[0])}" cy="${f(w[1] - R * 0.25)}" r="${f(R * 0.2)}" fill="${GOLD}" stroke="#15181e" stroke-width="${f(R * 0.06)}"/>`; }
  return g; };
const tieOf = (out) => out.map((c, i) => (c && c.hero ? '' : '')).join('');
// camera: every shot drifts; close cuts follow the first person's head
const frame = (U, B, cam, ppl, fx, o) => { if (CUT === 'close' && ppl && ppl[0]) { const h = ppl[0]; cam = { z: Math.max(cam.z * 1.8, 2.1), cx: h.x + (h.flip ? -30 : 30), cy: h.y - (h.h || 360) * 0.7 }; }
  const p = clamp(LT / Math.max(1, DUR)) - 0.5, d = [[90, 0, 0], [-90, 0, 0], [0, -50, 0.02], [0, 0, -0.07]][MOVE];
  cam = { z: cam.z * (1 + d[2] * p), cx: cam.cx + d[0] * p / cam.z, cy: cam.cy + d[1] * p / cam.z };
  const heroI = ppl ? ppl.findIndex((q) => q && q.hero) : -1; const fx2 = (out) => (typeof fx === 'function' ? fx(out) : fx || '') + (heroI >= 0 ? suit(heroI)(out) : '');
  return frame0(U, B, cam, ppl, fx2, o); };
const all = (...fs) => (out) => fs.map((g) => typeof g === 'function' ? g(out) : g || '').join('');
const inHand = (i, draw) => (out) => { const c = out[i]; return c && c.hands ? draw(c.hands[1], c) : ''; };
const bladeIn = (i, a = 30, o = {}) => inHand(i, (h) => E.blade(h[0], h[1] + 60, a, 0.55, o));
// lines the technique shows: thin gold lines over everything, some cracked red
const lineView = (n = 14, seed = 3, cracked = 0.3) => { let g = ''; for (let i = 0; i < n; i++) { const x = E.rnd(i + seed) * 1800 + 60, y = E.rnd(i * 3 + seed) * 700 + 120, w = 120 + E.rnd(i * 5 + seed) * 260, bad = E.rnd(i * 7 + seed) < cracked;
  g += bad ? `<path d="M ${f(x)} ${f(y)} l ${f(w * 0.3)} 10 l ${f(w * 0.2)} -14 l ${f(w * 0.5)} 8" stroke="${RED}" stroke-width="8" fill="none" opacity="${f(0.8 + 0.2 * Math.sin(LT * 5 + i))}"/>` : `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + w)}" y2="${f(y)}" stroke="${GOLD}" stroke-width="7" opacity="${f(0.75 + 0.25 * Math.sin(LT * 3 + i))}"/><line x1="${f(x)}" y1="${f(y)}" x2="${f(x + w)}" y2="${f(y)}" stroke="${GOLD}" stroke-width="20" opacity="0.2"/>`; } return g; };

// ---------- cards ----------
const towerBg = (t, dim = 0.55) => { const B = E.tower(t, { t: t + 2, time: 'night' }); return `<g transform="translate(${f(-t * 12)} 0)">${B.back}${B.mid}${B.floor}</g><rect width="1920" height="1080" fill="#0a0206" opacity="${dim}"/>`; };
const lore = (U, t, info, title, lines, art = '', col = GOLD) => { const k = clamp(t / 0.4), alt = MOVE % 2 === 1;
  full(U, `<g transform="translate(${alt ? -40 : 0} 0)">${towerBg(t)}</g>` + (alt ? `<g transform="translate(-1180 0)">${art}</g>` : art));
  big(U, `<div style="opacity:${f(k)};max-width:1000px;transform:translateX(${f(-30 * (1 - ease.out(k)))}px)"><div style="font:800 34px 'IBM Plex Mono';color:${col};letter-spacing:.08em">IN THE STORY · JUJUTSU KAISEN</div><div style="${TXT(88)};margin:18px 0 26px">${title}</div>${lines.map((l, i) => `<div style="font:700 40px Inter;color:#f2e6e6;margin:10px 0;opacity:${f(clamp((t - 0.4 - i * 0.5) / 0.3))}">· ${l}</div>`).join('')}</div>`, alt ? 820 : 160, 250); chrome(U, t, info); };
// the hero's head and shoulders in his suit, tie and all: art for OUR RULE / OUR GUESS cards
const bust = (x, y, s, t, col = RED) => { const b = Math.sin(t * 1.6) * 10, sc = s * (1 + 0.04 * t); return `<g transform="translate(${x} ${f(y + b)}) scale(${f(sc)})"><circle r="260" fill="${col}" opacity="0.10"/><rect x="-170" y="120" width="340" height="260" rx="120" fill="${TAN}"/><path d="M -60 130 L 0 220 L 60 130 Z" fill="#f4efe4"/><path d="M -20 140 L 20 140 L 32 330 L 0 370 L -32 330 Z" fill="${GOLD}"/><circle cx="0" cy="0" r="150" fill="#15181e" stroke="#b9dcff" stroke-width="6"/><ellipse cx="-52" cy="-6" rx="22" ry="26" fill="#fff"/><ellipse cx="52" cy="-6" rx="22" ry="26" fill="#fff"/><circle cx="-52" cy="-6" r="40" fill="#fff" opacity="0.12"/><circle cx="52" cy="-6" r="40" fill="#fff" opacity="0.12"/></g>`; };
const rule = (U, t, info, head1, sub = '', col = RED, kind = 'IN YOUR VERSION', art = '') => { const k = clamp(t / 0.3);
  full(U, `<rect width="1920" height="1080" fill="#140a0c"/>${[...Array(7)].map((_, i) => `<rect x="${-300 + i * 340 + (t * 50) % 340}" y="0" width="150" height="1080" fill="${col}" opacity="0.05" transform="skewX(-14)"/>`).join('')}<rect x="120" y="300" width="12" height="${f(420 * ease.out(k))}" fill="${col}"/>${art || bust(1560, 480, 1, t, col)}`);
  big(U, `<div style="opacity:${f(k)};max-width:1080px"><div style="font:800 34px 'IBM Plex Mono';color:${col};letter-spacing:.08em">${kind}</div><div style="${TXT(84)};margin:20px 0 22px;transform:scale(${f(0.94 + 0.06 * ease.out(k))});transform-origin:left">${head1}</div><div style="font:800 46px Inter;color:#e8dcd0">${sub}</div></div>`, 180, 320); chrome(U, t, info); };
const guess = (U, t, info, head1, sub = '', art = '') => rule(U, t, info, head1, sub, VIO, 'OUR GUESS', art);
// a line of dialogue: speaker, quote, with the office at night behind
const WHO = { PRIYA: PRIYA.top, YOU: GOLD, 'MR. HALE': '#9aa0b0' };
const say = (U, t, info, who, q, art = '') => { const k = clamp(t / 0.3), B = E.office(t, { t, time: SECNOW === 'clock' ? 'morning' : SECNOW === 'out' ? 'evening' : 'noon', crowd: 0.6, seed: 40 + MOVE });
  full(U, `<g transform="translate(${f(-t * 14 - 200)} -60) scale(1.1)">${B.back}${B.mid}${B.floor}</g><rect width="1920" height="1080" fill="#120c10" opacity="0.72"/>${art}`);
  big(U, `<div style="opacity:${f(k)};max-width:1400px"><div style="font:800 32px 'IBM Plex Mono';color:${WHO[who] || GOLD};letter-spacing:.12em;margin-bottom:22px">${who}</div><div style="font:italic 800 80px Georgia,serif;color:#fff;line-height:1.15">“${q}”</div></div>`, 200, 340); chrome(U, t, info); };
// two lines in one shot: first half one speaker, second half the other
const say2 = (U, t, info, a, qa, b, qb) => (t < info.dur * 0.5 ? say(U, t, info, a, qa) : say(U, t - info.dur * 0.5, info, b, qb));
const clockCard = (U, t, info, txt, sub, col = GOLD) => { const kk = clamp(t / 0.4); full(U, `<rect width="1920" height="1080" fill="#0f0806"/>${towerBg(t, 0.8)}<rect x="460" y="300" width="1000" height="440" rx="40" fill="#160c08" stroke="${col}" stroke-width="10" opacity="0.95"/><text x="960" y="610" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="210" fill="${col}" opacity="${f(kk * (0.85 + 0.15 * (Math.floor(t * 2) % 2)))}">${txt}</text><text x="960" y="820" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="46" fill="#fff" opacity="0.85">${sub}</text>`); chrome(U, t, info); };
// the thumbnail card: big wall clock at 5:00, CLOCK OUT AT 5 OR DIE, the tower behind, red and gold
const fiveCard = (U, t, info, l1 = 'CLOCK OUT AT 5', l2 = 'OR DIE.') => { const k = clamp(t / 0.3);
  full(U, `${towerBg(t, 0.35)}<rect width="1920" height="1080" fill="${RED}" opacity="0.18"/>${E.wallClock(1580, 560, 230 + 10 * t, 5, 0, { lt: t, rim: '#c8a040', glow: GOLD })}`);
  big(U, `<div style="${TXT(112)};text-shadow:0 10px 0 #000;opacity:${f(k)}"><span style="color:${GOLD}">5:00 PM</span><br>${l1}<br><span style="color:${RED}">${l2}</span></div>`, 140, 240); chrome(U, t, info); };
// the ratio card: a target (a plank, a door) split into ten bands, the gold line at 7:3, the strike
const ratioCard = (U, t, info, o = {}) => { const k = clamp(t / 0.8), x = 760, y = 180, w = 400, h = 720, n = Math.min(10, Math.floor(clamp(t / 1.2) * 10) + 1);
  let g = `<rect width="1920" height="1080" fill="#100a08"/>${towerBg(t, 0.85)}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${o.col || '#8a6a4a'}"/>`;
  for (let i = 1; i < n; i++) g += `<line x1="${x}" y1="${y + h * i / 10}" x2="${x + w}" y2="${y + h * i / 10}" stroke="#fff" stroke-width="3" opacity="0.5" stroke-dasharray="14 10"/><text x="${x - 30}" y="${y + h * i / 10 + 10}" text-anchor="end" font-family="IBM Plex Mono" font-weight="800" font-size="26" fill="#fff" opacity="0.6">${i}</text>`;
  g += E.goldLine(x - 60, y + h * 0.3, x + w + 60, y + h * 0.3, clamp((t - 0.9) / 0.5), t, { lbl: '7 : 3' });
  if (o.hit && t > 1.6) { const q = clamp((t - 1.6) / 0.4); g += `<circle cx="${x + w / 2}" cy="${y + h * 0.3}" r="${f(30 + q * 260)}" fill="none" stroke="${GOLD}" stroke-width="10" opacity="${f(1 - q)}"/><text x="${x + w / 2}" y="${y + h * 0.3 - 60}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="60" fill="${GOLD}" opacity="${f(q)}">CRITICAL</text>`; }
  full(U, g); big(U, `<div style="opacity:${f(k)}"><div style="font:800 32px 'IBM Plex Mono';color:${GOLD};letter-spacing:.1em">${o.head || 'RATIO TECHNIQUE'}</div><div style="${TXT(70)};margin-top:14px;max-width:560px">${o.txt || 'TEN PARTS.<br>STRIKE AT 7:3.'}</div></div>`, 140, 380); chrome(U, t, info); };
// the time clock, big: the green (or red) screen and the card going in
const punchCard = (U, t, info, txt, sub, red = false) => { full(U, `<rect width="1920" height="1080" fill="#141210"/>${towerBg(t, 0.85)}${E.punchClock(960, 860, 1.6, t, { txt, sub, red, card: clamp(t / 0.8) })}`); L1(U, t, `${txt} · ${sub}`, 0.3, red ? RED : GREEN); chrome(U, t, info); };
// the heart: a big heart, a monitor line, the countdown
const heartCard = (U, t, info, o = {}) => { const left = o.left ?? (11 - overMin(G)), stop = o.stop || 0;
  full(U, `<rect width="1920" height="1080" fill="#0c0606"/>${E.pulseLine(100, 820, 1720, t, { gap: o.gap, col: stop ? '#6a6f7c' : GREEN })}${E.heart(960, 420, 2.4, t, { stop, bpm: o.bpm || 80 })}<text x="960" y="720" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="90" fill="${stop ? '#8a8f9c' : RED}">${o.txt || mmss(left)}</text><text x="960" y="1000" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="38" fill="#fff" opacity="0.8">${o.sub || 'ON YOUR HEART'}</text>`); chrome(U, t, info); };
// big text over a set
const bigOver = (U, t, info, B, cam, html) => { frame(U, B, cam, [], '', { fxIn: true }); U.svg('card', `<rect width="1920" height="1080" fill="#000" opacity="0.45"/>`, {}, { z: 3 }); big(U, `<div style="${TXT(96)};text-shadow:0 8px 0 #000;max-width:1500px;opacity:${f(clamp(t / 0.3))}">${html}</div>`, 160, 320); chrome(U, t, info); };
const S = {};
const off = (o = {}) => E.office(0, { t: LT + G * 0.1, ...o });
// ---------- cold open ----------
S.open = (U, t, info, tt, k, n, line) => {
  if (has(line, 'woken up as Kento')) { const B = E.tower(tt, { t: tt, time: 'night' }); const FL = B.FLOOR; frame(U, B, { z: 0.9 + 0.08 * clamp(t / info.dur), cx: 960, cy: 470 }, [P(560 + t * 50, FL, walk(tt), 'neutral', { h: 300 })], '', { fxIn: true }); L1(U, t, 'KENTO NANAMI · JUJUTSU KAISEN', 0.1, GOLD); chrome(U, t, info); return; }
  if (has(line, 'In real life')) { const B = E.lobby(tt, { t: tt }); const FL = B.FLOOR; frame(U, B, { z: 1.0, cx: 900, cy: 500 }, [P(300 + t * 120, FL, walk(tt), 'neutral', { look: 0.8 })], '', { fxIn: true }); L1(U, t, 'IN REAL LIFE · ONE RULE', 0.1, GOLD); chrome(U, t, info); return; }
  if (has(line, 'Clock out at five')) { fiveCard(U, t, info); return; }
  if (has(line, 'weak point in almost')) { lore(U, t, info, 'KENTO NANAMI', ['FINDS THE WEAK POINT', 'IN ALMOST ANYTHING'], `<g transform="translate(1420 160)"><rect width="300" height="560" rx="10" fill="#8a6a4a"/>${E.ratio(0, 0, 300, 560, clamp(t / 1), t, { tag: false })}</g>`); return; }
  if (has(line, 'seven-to-three')) { ratioCard(U, t, info, { head: 'THE 7:3 LINE', txt: 'WHERE IT<br>BREAKS.', hit: true }); return; }
  if (has(line, 'moved into your office')) { rule(U, t, info, 'A CURSE MOVED INTO<br><span style="color:#ff2e3a">YOUR OFFICE BUILDING.</span>', '', RED, 'IN YOUR VERSION', `<g transform="translate(1560 600)">${E.deskCurse(0, 0, 0.55, t, { look: -1 })}</g>`); return; }
  if (has(line, 'doors seal')) { const B = E.tower(tt, { t: tt, seal: clamp((t - 0.6) / 0.4), h: 5, m: 0, clockGlow: GOLD }); frame(U, B, { z: 1.5, cx: 960, cy: 620 }, [], '', { fxIn: true }); L1(U, t, '5:00 PM · THE DOORS SEAL', 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'still inside')) { const B = off({ time: 'night', seal: 1, h: 5, m: 0, crowd: 0.7 }); frame(U, B, { z: 1.05, cx: 900, cy: 480 }, [], '', { fxIn: true }); L1(U, t, "ANYONE INSIDE DOESN'T LEAVE", 0.2, RED); chrome(U, t, info, { time: '5:00 PM' }); return; }
  if (has(line, 'eight fifty-two')) { const B = E.lobby(tt, { t: tt }); const FL = B.FLOOR; frame(U, B, { z: 1.9, cx: 980, cy: 520 }, [P(1000, FL, t < 1.5 ? { ...P_STAND, aL: [40, 160], aR: [40, 160], head: 10 } : WATCH, 'neutral', { look: 0.2 })], '', { fxIn: true }); L1(U, t, '8:52 AM · TIE ON', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'eight hours')) { clockCard(U, t, info, '8 HRS', '8:52 AM → 5:00 PM'); return; }
};
// ---------- 8:52 a.m.: the line ----------
S.line = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Ratio Technique splits')) { ratioCard(U, t, info, { head: 'RATIO TECHNIQUE', txt: 'SPLIT THE<br>TARGET.' }); return; }
  if (has(line, 'ten parts')) { ratioCard(U, t, info, { head: 'RATIO TECHNIQUE', txt: 'TEN<br>PARTS.', col: '#6a7a8a' }); return; }
  if (has(line, 'seven-three point')) { lore(U, t, info, 'THE RATIO TECHNIQUE', ['TEN PARTS', 'STRIKE AT 7:3', 'A WEAK SPOT APPEARS'], `<g transform="translate(1420 160)"><rect width="300" height="560" rx="10" fill="#6a5a7a"/>${E.ratio(0, 0, 300, 560, clamp(t / 0.8), t, { tag: false })}</g>`); return; }
  if (has(line, 'critical one')) { ratioCard(U, t, info, { head: 'THE HIT', txt: 'A CRITICAL<br>HIT.', hit: true, col: '#5a6a5a' }); return; }
  if (has(line, 'coat closet', 'newspaper')) { const B = E.lobby(tt, { t: tt }); const FL = B.FLOOR; B.mid += E.blade(1610, FL - 40, 4, 0.9, { wrap: 1 }); frame(U, B, has(line, 'newspaper') ? { z: 1.9, cx: 1610, cy: FL - 260 } : { z: 1.2, cx: 1400, cy: 520 }, [P(1250, FL, has(line, 'newspaper') ? HOLD : walk(tt), 'neutral', { look: 0.9 })], '', { fxIn: true }); L1(U, t, has(line, 'newspaper') ? 'WRAPPED IN NEWSPAPER · A DULL BLADE' : 'THE COAT CLOSET', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'weaker things')) { ratioCard(U, t, info, { head: 'A BLUNT SWORD', txt: 'STILL CUTS<br>WEAKER THINGS.', hit: true, col: '#c8a878' }); return; }
  if (has(line, 'blunt sword', 'weaker things')) { lore(U, t, info, 'HIS WEAPON', has(line, 'weaker') ? ['A BLUNT SWORD', 'STILL CUTS WEAKER THINGS', 'BECAUSE OF THE TECHNIQUE'] : ['A BLUNT SWORD'], `<g transform="translate(1520 ${f(800 + Math.sin(t * 1.4) * 14)}) rotate(${f(-12 + t * 4)})">${E.blade(0, 0, 0, 1.6, { glow: 0.6, cloth: 1 })}</g>`); return; }
  if (has(line, 'own face and your own name tag')) { rule(U, t, info, 'YOUR FACE.<br><span style="color:#ffd23f">YOUR NAME TAG.</span>', 'ONLY THE HABITS ARE HIS', GOLD, 'IN YOUR VERSION', bust(1560, 480, 1, t, GOLD) + `<g transform="translate(1600 760) rotate(-6)"><rect x="-90" y="-36" width="180" height="72" rx="8" fill="#fff"/><text x="0" y="12" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#15181e">HELLO · YOU</text></g>`); return; }
  if (has(line, 'coffee machine', 'tap the line', 'perfect espresso', 'second one')) { const B = E.lobby(tt, { t: tt, cups: has(line, 'second') ? (t > 1.6 ? 2 : 1) : has(line, 'perfect') ? 1 : 0 }); const FL = B.FLOOR; if (has(line, 'tap the line', 'coffee')) B.mid += E.goldLine(130, FL - 210, 350, FL - 210, clamp(t / 0.8), tt, { tag: false });
    frame(U, B, has(line, 'coffee machine') ? { z: 1.1, cx: 500, cy: 520 } : { z: 2.2, cx: 260, cy: FL - 160 }, [P(470, FL, has(line, 'tap the line') ? TAP : P_STAND, has(line, 'second') ? 'smile' : 'neutral', { flip: true, look: -0.8 })], '', { fxIn: true });
    L1(U, t, has(line, 'second') ? 'A SECOND ONE · FOR FREE' : has(line, 'perfect') ? 'A PERFECT ESPRESSO' : has(line, 'tap') ? 'TAP · AT THE LINE' : 'THE COFFEE MACHINE · ONE MORE TEST', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'elevator doors', 'gold line appears', 'three tenths', 'door sighs', 'lock pops')) { const B = E.lobby(tt, { t: tt, line: has(line, 'gold line') ? clamp((t - 0.6) / 1) : has(line, 'three tenths', 'sighs', 'pops') ? 1 : 0, open: has(line, 'pops') ? clamp((t - 0.5) / 1.4) : has(line, 'sighs') ? 0.04 : 0, pop: has(line, 'pops') ? clamp(t / 0.6) : 0 }); const FL = B.FLOOR, [ex, ey, ew, eh] = B.ELEV;
    const tap = has(line, 'three tenths') && t > info.dur * 0.5; frame(U, B, has(line, 'elevator doors') ? { z: 1.0, cx: 880, cy: 500 } : has(line, 'three tenths') ? { z: 1.7, cx: ex + ew / 2, cy: ey + eh * 0.35 } : { z: 1.3, cx: ex + ew / 2, cy: 480 }, [P(ex - 120, FL, tap ? TAP : P_STAND, 'neutral', { look: 0.9 })], '', { fxIn: true });
    L1(U, t, has(line, 'elevator') ? 'THE ELEVATOR' : has(line, 'gold line') ? 'A THIN GOLD LINE' : has(line, 'three tenths') ? 'THREE TENTHS FROM THE TOP · TAP' : has(line, 'sighs') ? 'THE WHOLE DOOR SIGHS' : 'THE LOCK POPS OPEN', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'weigh it', 'serious ruler')) { const B = E.lobby(tt, { t: tt }); const FL = B.FLOOR; frame(U, B, { z: 1.8, cx: 1240, cy: FL - 280 }, [P(1200, FL, has(line, 'ruler') ? { ...P_STAND, aR: [80, 60], head: 10 } : HOLD, 'neutral', { look: 0.9 })], bladeIn(0, has(line, 'ruler') ? 80 : 20), { fxIn: true }); L1(U, t, has(line, 'ruler') ? 'A VERY SERIOUS RULER' : 'HEAVY · DULL · ONE HAND', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'habits are his', 'check the time')) { const B = E.lobby(tt, { t: tt }); const FL = B.FLOOR; frame(U, B, { z: 1.7, cx: 1000, cy: FL - 300 }, [P(980, FL, has(line, 'check the time') ? WATCH : P_STAND, 'neutral', { look: 0.4 })], '', { fxIn: true }); L1(U, t, has(line, 'time') ? 'THE TIME · BEFORE ANYTHING ELSE' : 'THE CALM · THE COAT', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'way to your floor')) { const B = E.lobby(tt, { t: tt, open: 1 }); const FL = B.FLOOR; frame(U, B, { z: 1.0, cx: 900, cy: 500 }, [P(500 + t * 200, FL, walk(tt), 'neutral', { look: 0.8 })], '', { fxIn: true }); L1(U, t, 'ON THE WAY UP', 0.2); chrome(U, t, info); return; }
  if (has(line, 'Nobody ever sees', 'other thing about being', 'man in a suit', 'a man', 'no one looks')) { const B = off({ time: 'morning', crowd: 0.9, h: 8, m: 57 }); const FL = B.FLOOR; frame(U, B, has(line, 'Nobody ever') ? { z: 1.3, cx: 900, cy: 520 } : { z: 1.0, cx: 900, cy: 480 }, [P(200 + t * 180, FL, walk(tt), 'neutral', { look: 0.8 }), Q(1300, FL, P_PHONE, CROWD[1], 'neutral', { flip: true }), Q(1600, FL, P_PHONE, CROWD[2], 'neutral')], '', { fxIn: true }); L1(U, t, has(line, 'suit', 'no one looks') ? 'A MAN IN A SUIT · NOBODY LOOKS TWICE' : 'NOBODY SEES', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'eight fifty-nine', 'spreadsheet')) { const B = off({ time: 'morning', crowd: 0.9, h: 8, m: 59 }); const FL = B.FLOOR; B.mid += E.blade(900, FL - 20, 90, 0.5, { wrap: 1 }); frame(U, B, has(line, 'spreadsheet') ? { z: 2.0, cx: 720, cy: FL - 320 } : { z: 1.2, cx: 760, cy: 520 }, [P(620, FL, P_SIT, 'neutral', { look: 0.9, h: 340 })], has(line, 'spreadsheet') ? `<rect x="640" y="${FL - 400}" width="160" height="100" fill="#5ae08a" opacity="0.25"/>` : '', { fxIn: true }); L1(U, t, has(line, 'spreadsheet') ? 'A SPREADSHEET · A BLADE UNDER THE DESK' : '8:59 · AT YOUR DESK', 0.2, GOLD); chrome(U, t, info); return; }
  const B = E.lobby(tt, { t: tt }); frame(U, B, { z: 1.0, cx: 900, cy: 500 }, [P(800, B.FLOOR, P_STAND)], '', { fxIn: true }); L1(U, t, 'THE LOBBY', 0.2); chrome(U, t, info); };
// ---------- 10:00 a.m.: the schedule ----------
const bars = (t) => `<g transform="translate(1340 300)"><rect x="0" y="${f(400 - 120)}" width="140" height="120" fill="#8a8f9c"/><text x="70" y="450" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="26" fill="#fff">9–5</text><rect x="220" y="${f(400 - 380 * clamp(t / 1.2))}" width="140" height="${f(380 * clamp(t / 1.2))}" fill="${RED}"/><text x="290" y="450" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="26" fill="#fff">AFTER 5</text></g>`;
S.schedule = (U, t, info, tt, k, n, line) => {
  if (has(line, 'working hours, it')) { const B = off({ time: 'morning', crowd: 0.9, h: 10, m: 1 }); const FL = B.FLOOR; frame(U, B, { z: 1.3, cx: 760, cy: FL - 260 }, [P(700, FL, P_STAND, 'neutral', { look: 0.9 })], (out) => out[0] && out[0].head ? `<g transform="translate(${f(out[0].head[0] + 120)} ${f(out[0].head[1] - 40)})"><rect width="40" height="200" rx="8" fill="#15181e" stroke="#8a8f9c" stroke-width="4"/><rect x="6" y="${f(194 - 50)}" width="28" height="50" rx="4" fill="#8a8f9c"/><text x="20" y="232" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="22" fill="#fff">CE</text></g>` : '', { fxIn: true }); L1(U, t, 'WORKING HOURS · LIMITED', 0.2, GREY); chrome(U, t, info); return; }
  if (has(line, 'After hours')) { const B = E.tower(tt, { t: tt, time: 'evening', h: 5, m: 30 }); B.mid += `<g transform="translate(1600 300)"><rect width="80" height="500" rx="14" fill="#15181e" stroke="${RED}" stroke-width="6"/><rect x="10" y="${f(490 - 480 * clamp(t / 1.6))}" width="60" height="${f(480 * clamp(t / 1.6))}" rx="8" fill="${RED}"/></g>`; frame(U, B, { z: 1.0, cx: 960, cy: 460 }, [], '', { fxIn: true }); L1(U, t, 'AFTER HOURS · IT CLIMBS', 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'Enough to see lines')) { const B = off({ time: 'morning', crowd: 0.8, h: 10, m: 2 }); frame(U, B, { z: 1.0, cx: 900, cy: 480 }, [P(800, B.FLOOR, P_THINK, 'neutral', { look: 0.9 })], lineView(14, 13, 0), { fxIn: true }); L1(U, t, 'ENOUGH TO SEE LINES', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'came back later')) { const B = E.tower(tt, { t: tt, time: 'night' }); frame(U, B, { z: 1.1, cx: 960, cy: 520 }, [P(500 + t * 140, B.FLOOR, walk(tt), 'neutral', { h: 300 })], '', { fxIn: true }); L1(U, t, 'AND CAME BACK LATER', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'bound by a vow', 'working hours, it', 'After hours')) { lore(U, t, info, 'OVERTIME · A BINDING VOW', has(line, 'After hours') ? ['WORKING HOURS: LIMITED', 'AFTER HOURS: IT CLIMBS'] : has(line, 'working hours') ? ['WORKING HOURS: LIMITED'] : ['HIS POWER IS BOUND BY A VOW'], bars(t)); return; }
  if (has(line, 'until five p.m.', 'working-hours version', 'win a fight')) { rule(U, t, info, has(line, 'win a fight') ? 'NOT ENOUGH<br><span style="color:#ff2e3a">TO WIN A FIGHT.</span>' : 'UNTIL 5:00 PM:<br><span style="color:#ffd23f">LINES ONLY.</span>', 'THE WORKING-HOURS VERSION', RED, 'IN YOUR VERSION', bust(1560, 480, 1, t, GOLD) + E.wallClock(1780, 200, 70, 10, 0, { lt: t })); return; }
  if (has(line, 'report by six')) { say2(U, t, info, 'MR. HALE', 'We’ll need this report by six.', 'YOU', 'I leave at five.'); return; }
  if (has(line, 'Nobody leaves at five here')) { say(U, t, info, 'MR. HALE', 'Nobody leaves at five here.'); return; }
  if (has(line, 'four interns')) { say(U, t, info, 'YOU', 'That’s how you lost four interns.'); return; }
  if (has(line, 'Everyone leaves at five')) { say2(U, t, info, 'YOU', 'Everyone leaves at five.', 'YOU', 'I just mean it.'); return; }
  if (has(line, 'Henderson')) { const B = E.meeting(tt, { t: tt, h: 10, m: 5 }); const FL = B.FLOOR; frame(U, B, { z: 1.2, cx: 500, cy: 460 }, [Q(1000, FL, P_POINT, HALE, 'smile', { flip: true, h: 360 })], '', { fxIn: true }); L1(U, t, '"THAT\'S HOW WE GOT THE HENDERSON ACCOUNT."', 0.2, GREY); chrome(U, t, info); return; }
  if (has(line, 'left sorcery', 'came back later') || line.trim() === 'In the story,') { lore(U, t, info, 'HE LEFT · AND CAME BACK', has(line, 'came back') ? ['LEFT SORCERY', 'AN ORDINARY OFFICE JOB', 'CAME BACK LATER'] : ['LEFT SORCERY', 'AN ORDINARY OFFICE JOB'], `<g transform="translate(1560 560)">${E.desk(0, 300, 1.3, t, { seed: 1, lamp: 1 })}</g>`); return; }
  const B = off({ time: 'morning', crowd: 1, h: 10, m: has(line, 'stapler') ? 4 : 2, sleepy: has(line, 'curse too') }); const FL = B.FLOOR;
  const hero = P(700, FL, has(line, 'out loud') ? { ...P_STAND, aR: [40, 150], head: 12 } : has(line, 'understand why') ? P_THINK : P_SIT, has(line, 'out loud') ? 'worried' : 'neutral', { look: 0.9, h: has(line, 'out loud', 'understand') ? 360 : 340 });
  const hale = Q(1000, FL, has(line, 'plaque') ? P_POINT : has(line, 'leans') ? { ...P_STAND, lean: 18, aR: [60, 70] } : P_HIPS, HALE, 'smile', { flip: true, h: 370 });
  let ppl = [hero], fx = '', cam = { z: 1.1, cx: 820, cy: 500 }, lbl = 'THE OPEN OFFICE · 10:00 AM';
  if (has(line, 'Hale, leans', 'plaque')) { ppl.push(hale); fx = inHand(1, (h) => `<rect x="${f(h[0] - 50)}" y="${f(h[1] - 30)}" width="100" height="70" rx="6" fill="${GOLD}"/>`); cam = { z: 1.5, cx: 860, cy: FL - 280 }; lbl = has(line, 'plaque') ? '"NOBODY LEAVES AT FIVE" · LIKE A PLAQUE' : 'MR. HALE · A FOLDER AND A SMILE';
    if (has(line, 'plaque')) B.back += `<g transform="translate(1300 330)"><rect x="-200" y="-50" width="400" height="100" rx="10" fill="#c8a040"/><text x="0" y="14" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="32" fill="#3a2a10">NOBODY LEAVES AT 5</text></g>`; }
  if (has(line, 'goes quiet')) { ppl = [hero, Q(1100, FL, P_STAND, CROWD[0], 'worried', { flip: true }), Q(1450, FL, P_STAND, CROWD[3], 'worried', { flip: true }), Q(300, FL, P_STAND, CROWD[2], 'worried')]; cam = { z: 0.95, cx: 880, cy: 480 }; lbl = 'THE WHOLE OFFICE GOES QUIET'; }
  if (has(line, 'stapler')) { const q = clamp(t / 0.7); ppl = [Q(1000, FL, { ...P_STAND, aR: [40, 60] }, CROWD[4], 'worried')]; fx = `<g transform="translate(1080 ${f(FL - 420 + q * 400)}) rotate(${f(q * 200)})"><rect x="-40" y="-14" width="80" height="28" rx="8" fill="${RED}"/><rect x="-36" y="-22" width="70" height="10" rx="4" fill="#8a8f9c"/></g>${q >= 1 ? `<text x="1080" y="${FL - 40}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="48" fill="#fff">CLACK.</text>` : ''}`; cam = { z: 1.8, cx: 1040, cy: FL - 260 }; lbl = 'SOMEBODY DROPS A STAPLER'; }
  if (has(line, 'out loud')) { ppl.push(Q(1050, FL, P_SHIVER, CROWD[0], 'worried', { flip: true })); cam = { z: 1.5, cx: 820, cy: FL - 260 }; lbl = 'YOU SAY IT OUT LOUD'; }
  if (has(line, 'understand why')) { cam = { z: 1.7, cx: 700, cy: FL - 280 }; lbl = 'NOW YOU UNDERSTAND · A LITTLE'; }
  if (has(line, 'curse too')) { cam = { z: 1.0, cx: 900, cy: 470 }; lbl = 'OFFICES ARE A KIND OF CURSE TOO'; }
  if (has(line, "isn't metaphorical")) { const S2 = E.stairwell(tt, { t: tt, pulse: 1 }); frame(U, S2, { z: 1.2, cx: 1060, cy: 520 }, [], '', { fxIn: true }); L1(U, t, 'THE STAIRWELL · NOT A METAPHOR', 0.2, RED); chrome(U, t, info); return; }
  frame(U, B, cam, ppl, fx, { fxIn: true }); L1(U, t, lbl, 0.2, has(line, 'curse') ? RED : null); chrome(U, t, info); };
// ---------- 12:30 p.m.: the stairwell ----------
const priyaDesk = (B, x = 1200) => { const FL = B.FLOOR; B.mid += [-130, 0, 130].map((d) => `<rect x="${x + d - 60}" y="${FL - 400}" width="120" height="90" rx="6" fill="#2a2d3a"/><rect x="${x + d - 52}" y="${FL - 392}" width="104" height="74" fill="#9fd0f0" opacity="0.9"/>`).join('') + `<rect x="${x - 240}" y="${FL - 300}" width="480" height="20" fill="#8a6a4a"/><rect x="${x + 180}" y="${FL - 340}" width="34" height="40" rx="5" fill="#c8624a"/><path d="M ${x + 197} ${FL - 340} q -20 -20 -30 -10 M ${x + 197} ${FL - 340} q 20 -16 26 -4" stroke="#8a6a3a" stroke-width="6" fill="none"/>`; };
S.stairs = (U, t, info, tt, k, n, line) => {
  if (has(line, 'feeds on exhaustion')) { rule(U, t, info, 'A CURSE THAT FEEDS<br><span style="color:#ff2e3a">ON EXHAUSTION.</span>', 'THE LONGER THEY STAY, THE HEAVIER IT GETS', RED, 'IN YOUR VERSION', `<g transform="translate(1560 560)">${E.deskCurse(0, 0, 0.5, t, { look: -1 })}</g>`); return; }
  if (has(line, 'seen a ghost')) { say2(U, t, info, 'PRIYA', 'You look like you’ve seen a ghost.', 'YOU', 'I’ve seen a deadline.'); return; }
  if (has(line, "Well, it's mine")) { say(U, t, info, 'PRIYA', 'Well, it’s mine. I’m staying until it’s done.'); return; }
  if (has(line, 'measuring them')) { say(U, t, info, 'PRIYA', 'You’ve been looking at the walls all morning like you’re measuring them.'); return; }
  if (has(line, 'Seven to three')) { say2(U, t, info, 'YOU', 'Seven to three.', 'YOU', 'Nothing. It’s a ratio.'); return; }
  if (has(line, 'counting the minutes')) { clockCard(U, t, info, '12:47', 'PM · COUNTING THE MINUTES'); return; }
  if (has(line, 'sealed itself')) { const B = E.tower(tt, { t: tt, time: 'night', seal: 1, h: 12, m: 36 }); frame(U, B, { z: 1.0, cx: 960, cy: 460 }, [], '', { fxIn: true }); L1(U, t, 'SEALED IN · SINCE LAST NIGHT', 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'wakes up every')) { const B = off({ time: 'evening', crowd: 0.8, h: 5, m: 0, clockGlow: RED }); frame(U, B, { z: 1.4, cx: 895, cy: 300 }, [], '', { fxIn: true }); L1(U, t, 'IT WAKES UP EVERY EVENING AT FIVE', 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'feel it at lunch', 'wet pulse', 'knotted', 'sealed itself', 'wakes up every')) { const B = E.stairwell(tt, { t: tt, pulse: 1 }); const FL = B.FLOOR, [dx, dy, dw, dh] = B.DOOR;
    if (has(line, 'knotted')) B.mid += [0, 1, 2, 3].map((i) => `<path d="M ${dx - 40} ${f(dy + 120 + i * 90)} q ${f(dw * 0.3)} ${f(-60 + 40 * Math.sin(tt * 2 + i))} ${f(dw * 0.6)} 0 t ${f(dw * 0.6)} 0" stroke="${RED}" stroke-width="10" fill="none" opacity="0.85"/>`).join('') + `<circle cx="${dx + dw / 2}" cy="${dy + 270}" r="${f(50 + 10 * Math.sin(tt * 3))}" fill="${RED}" opacity="0.6"/>`;
    const ppl = has(line, 'sealed itself', 'wakes up') ? [] : [P(560, FL, has(line, 'knotted') ? P_THINK : sneak2(tt), 'worried', { look: 0.9 })];
    frame(U, B, has(line, 'knotted') ? { z: 1.8, cx: dx + dw / 2, cy: dy + 270 } : has(line, 'wet pulse') ? { z: 1.4, cx: dx + dw / 2 - 200, cy: dy + 300 } : { z: 1.0, cx: 900, cy: 480 }, ppl, '', { fxIn: true });
    L1(U, t, has(line, 'knotted') ? 'KNOTTED · LIKE A THROAT' : has(line, 'wet pulse') ? 'A SLOW, WET PULSE · 9F' : has(line, 'sealed') ? 'SEALED IN · SINCE LAST NIGHT' : has(line, 'wakes') ? 'IT WAKES UP EVERY EVENING AT FIVE' : 'YOU FEEL IT AT LUNCH', 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'way a doctor', 'Lines everywhere')) { const B = off({ time: 'noon', crowd: 0.9, h: 12, m: 33 }); frame(U, B, { z: 1.0, cx: 900, cy: 480 }, [P(1500, B.FLOOR, P_THINK, 'neutral', { flip: true, look: -0.8 })], lineView(has(line, 'cracked') ? 18 : 12, 5, has(line, 'cracked') ? 0.4 : 0), { fxIn: true }); L1(U, t, has(line, 'cracked') ? 'SOME CLEAN · SOME CRACKED' : 'LIKE A DOCTOR SEES IT', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'longer people stay')) { const B = E.tower(tt, { t: tt, time: 'evening', lit: 0.9, people: 0.7, h: 12, m: 35 }); frame(U, B, { z: 1.0, cx: 960, cy: 420 }, [], '', { fxIn: true }); L1(U, t, 'THE LONGER THEY STAY · THE HEAVIER IT GETS', 0.2, RED); chrome(U, t, info); return; }
  const B = off({ time: 'noon', crowd: 1, sleepy: has(line, 'asleep', 'Forty'), h: 12, m: 40, deadPlant: true }); const FL = B.FLOOR; priyaDesk(B, 1250);
  const pr = Q(1250, FL + 10, has(line, 'catches you', 'long second', 'she asks') ? P_SIT : P_SIT, PRIYA, has(line, 'long second', 'she asks') ? 'worried' : 'neutral', { flip: true, h: 320, look: has(line, 'back to her three') ? 0.2 : -0.8 });
  const hero = P(560, FL, has(line, 'work thing') ? P_SHRUG : has(line, 'mind your own') ? P_HIPS : P_STAND, has(line, 'work thing') ? 'smile' : 'neutral', { look: 0.9 });
  let cam = { z: 1.1, cx: 900, cy: 500 }, ppl = [hero, pr], lbl = 'PRIYA · ACCOUNTING';
  if (has(line, 'look at the office', 'Forty people', 'asleep')) { ppl = []; cam = { z: has(line, 'asleep') ? 1.4 : 0.95, cx: 900, cy: has(line, 'asleep') ? 560 : 480 }; lbl = has(line, 'asleep') ? 'ASLEEP · EYES OPEN' : 'FORTY PEOPLE'; }
  if (has(line, 'three monitors and a dead plant')) { ppl = [pr]; cam = { z: 1.8, cx: 1250, cy: FL - 320 }; lbl = 'THREE MONITORS · A DEAD PLANT'; }
  if (has(line, 'catches you')) { cam = { z: 1.3, cx: 900, cy: 520 }; lbl = 'PRIYA · FROM ACCOUNTING'; }
  if (has(line, 'mind your own')) lbl = 'YOU BOTH MEAN IT';
  if (has(line, 'she asks')) { ppl = [pr]; cam = { z: 2.0, cx: 1250, cy: FL - 300 }; lbl = '"ARE YOU OKAY?"'; }
  if (has(line, 'work thing')) lbl = '"IT\'S A WORK THING."';
  if (has(line, 'long second')) { ppl = [pr, hero]; cam = { z: 1.9, cx: 1240, cy: FL - 300 }; lbl = 'A LONG SECOND'; }
  if (has(line, 'back to her three')) { cam = { z: 1.4, cx: 1150, cy: FL - 260 }; lbl = 'BACK TO HER THREE MONITORS'; }
  frame(U, B, cam, ppl, '', { fxIn: true }); L1(U, t, lbl, 0.2, has(line, 'asleep') ? RED : null); chrome(U, t, info); };
const sneak2 = (tt) => { const p = walk(tt, 3.2); return { ...p, bob: p.bob * 0.4, lean: 10, head: 6 }; };
// ---------- 3:15 p.m.: Collapse ----------
S.collapse = (U, t, info, tt, k, n, line) => {
  if (has(line, 'called Collapse')) { lore(U, t, info, 'COLLAPSE', ['THE SECOND PART OF HIS TECHNIQUE'], `<g transform="translate(1400 200)"><rect width="360" height="560" fill="#c8c0ae"/>${[1, 2, 3, 4, 5].map((i) => `<rect y="${i * 93}" width="360" height="4" fill="#a8a08e"/>`).join('')}${E.goldLine(-30, 168, 390, 168, clamp(t / 0.8), t, { tag: false })}</g>`); return; }
  if (has(line, 'environment itself')) { const B = E.fileRoom(tt, { t: tt, line: clamp(t / 1) }); frame(U, B, { z: 1.0, cx: 820, cy: 480 }, [], '', { fxIn: true }); L1(U, t, 'THE 7:3 LINE · ON THE PLACE ITSELF', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'a wall, a floor')) { const B = off({ time: 'evening', crowd: 0.4, h: 3, m: 16 }); const FL = B.FLOOR; B.mid += E.goldLine(-200, 360, 700, 360, clamp(t / 0.5), tt, { lbl: 'WALL' }) + E.goldLine(900, FL + 30, 1900, FL + 30, clamp((t - 0.5) / 0.5), tt, { lbl: 'FLOOR' }); frame(U, B, { z: 0.95, cx: 900, cy: 480 }, [], '', { fxIn: true }); L1(U, t, 'A WALL · A FLOOR', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'wrong line')) { rule(U, t, info, 'A WRONG LINE<br><span style="color:#ff2e3a">OPENS THE FLOOR.</span>', 'NOT A DOOR', RED, 'IN YOUR VERSION', `<g transform="translate(1560 520)">${E.goldLine(-260, 0, 260, 0, 1, t, { tag: false })}<path d="M -300 60 L -100 40 L 0 120 L 100 50 L 300 70" stroke="${RED}" stroke-width="10" fill="none"/><rect x="-300" y="80" width="600" height="200" fill="#15181e" opacity="0.6"/></g>`); return; }
  if (has(line, "isn't a trick")) { bigOver(U, t, info, off({ time: 'evening', crowd: 0.5, h: 3, m: 30 }), { z: 1.0, cx: 900, cy: 480 }, `A WEAK POINT<br>ISN'T A TRICK.<br><span style="color:${GOLD}">IT'S A RESPONSIBILITY.</span>`); return; }
  if (has(line, 'crumbles', 'old file room', 'folds like wet', 'ceiling above')) { const fold = has(line, 'folds like wet') ? clamp((t - 0.2) / 1.4) : has(line, 'ceiling') ? 1 : has(line, 'crumbles') ? clamp((t - 1.2) / 1.2) : has(line, 'single tap') ? clamp((t - 3.2) / 0.8) : 0, ceil = has(line, 'ceiling') ? (t < 2.2 ? 0.25 * clamp(t / 0.4) : 0.25 + 0.15 * clamp((t - 3.2) / 0.6)) : 0;
    const B = E.fileRoom(tt, { t: tt, fold, ceil, line: fold < 0.1 ? 1 : 0, dust: fold }); const FL = B.FLOOR, [wx, wy, ww, wh] = B.WALL; const tap = has(line, 'single tap', 'crumbles') && fold < 0.2 && t > 0.6;
    frame(U, B, has(line, 'ceiling') ? { z: 1.0, cx: 900, cy: 400 } : has(line, 'folds') ? { z: 1.05, cx: 820, cy: 480 } : { z: 1.2, cx: 700, cy: 520 }, has(line, 'crumbles') ? [] : [P(wx - 80, FL, tap ? TAP : has(line, 'ceiling') ? { ...P_STAND, head: -20 } : P_STAND, has(line, 'ceiling') ? 'worried' : 'neutral', { look: 0.9 })], '', { fxIn: true });
    if (t < 0.25 && fold > 0 && has(line, 'folds')) U.svg('punch', `<rect width="1920" height="1080" fill="#fff" opacity="${f(0.4 * (1 - t / 0.25))}"/>`, {}, { z: 4 });
    L1(U, t, has(line, 'ceiling') ? 'THREE INCHES · THEN A LITTLE MORE' : has(line, 'folds') ? 'IT FOLDS LIKE WET PAPER' : has(line, 'crumbles') ? 'ONE STRIKE · THE PLACE CRUMBLES' : 'THE OLD FILE ROOM · A WALL NOBODY WILL MISS', 0.2, has(line, 'ceiling') ? RED : GOLD); chrome(U, t, info); return; }
  if (has(line, 'glass wall with chalk', 'go back to your desk')) { const B = E.stairwell(tt, { t: tt, pulse: 0.4, chalk: has(line, 'glass wall') ? clamp((t - 0.6) / 1) : 1 }); const FL = B.FLOOR, [gx] = B.GLASS; frame(U, B, { z: 1.3, cx: gx + 200, cy: 520 }, [P(gx - 60, FL, has(line, 'glass wall') ? { ...P_STAND, aR: [100, 60] } : walk(tt), 'neutral', { look: 0.9 })], '', { fxIn: true }); L1(U, t, 'CHALK · 7:3 · ON THE GLASS', 0.2, GOLD); chrome(U, t, info); return; }
  const B = off({ time: 'evening', crowd: 0.8, h: 3, m: has(line, 'three forty-one', 'dust') ? 41 : 15, dust: has(line, 'dust') }); const FL = B.FLOOR;
  const hero = P(700, FL, has(line, "don't know", "won't guess") ? P_THINK : P_STAND, 'neutral', { look: 0.9 }), hale = Q(1060, FL, P_HIPS, HALE, 'worried', { flip: true, h: 370 });
  const dust = has(line, 'dust', 'forty-one') ? (out) => (out[0] && out[0].head ? [...Array(16)].map((_, i) => `<circle cx="${f(out[0].head[0] + (E.rnd(i) - 0.5) * 140)}" cy="${f(out[0].head[1] + E.rnd(i * 3) * 300)}" r="${f(5 + E.rnd(i * 5) * 8)}" fill="#e8dcc8" opacity="0.8"/>`).join('') : '') : '';
  const ppl = has(line, 'dust', 'forty-one') ? [hero, hale] : [hero];
  const fx = has(line, "don't know", "won't guess") ? lineView(10, 9, 0.6) : dust;
  frame(U, B, has(line, 'way out') ? { z: 1.0, cx: 900, cy: 480 } : { z: 1.4, cx: 860, cy: FL - 260 }, ppl, fx, { fxIn: true });
  L1(U, t, has(line, 'way out') ? 'A WAY OUT · FOR EVERYONE · FAST' : has(line, "don't know") ? 'WHERE IS THE LINE?' : has(line, "won't guess") ? "THE TECHNIQUE WON'T GUESS" : has(line, 'forty-one') ? '3:41 PM' : 'WHY ARE YOU COVERED IN DUST?', 0.2, GOLD); chrome(U, t, info); };
// ---------- 4:40 p.m.: everybody out ----------
S.out = (U, t, info, tt, k, n, line) => {
  if (has(line, 'almost done')) { say(U, t, info, 'PRIYA', 'I’m almost done.'); return; }
  if (has(line, "building's going to close")) { say2(U, t, info, 'YOU', 'The building’s going to close.', 'PRIYA', 'It’s a building. It doesn’t close.'); return; }
  if (has(line, 'asks for more')) { say(U, t, info, 'PRIYA', 'It just... asks for more.'); return; }
  if (has(line, 'fifty-nine and fifty')) { clockCard(U, t, info, `4:59:${50 + Math.min(9, Math.floor(t * 3))}`, 'PM · TEN SECONDS', RED); return; }
  if (has(line, 'green font') || /^four fifty-eight p\.m/i.test(line.trim())) { punchCard(U, t, info, '4:58 PM', 'CLOCKED OUT'); return; }
  if (has(line, 'pull the fire alarm')) { const B = E.stairwell(tt, { t: tt, alarm: t > 1.2 }); const FL = B.FLOOR; B.mid += E.fireAlarm(700, FL - 400, 1, tt, t > 1.2); frame(U, B, { z: 1.6, cx: 680, cy: FL - 380 }, [P(560, FL, { ...P_STAND, aR: [80, t > 1.2 ? 40 : 70] }, 'neutral', { look: 0.9 })], '', { fxIn: true }); L1(U, t, '4:40 · THE FIRE ALARM', 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'file out', 'complaining')) { const B = E.tower(tt, { t: tt, time: 'evening', h: 4, m: 43 }); const FL = B.FLOOR; const ppl = [0, 1, 2, 3, 4, 5, 6].map((i) => Q(860 - i * 190 + t * 90 + (i % 2) * 40, FL, i % 3 === 1 ? { ...walk(tt + i), aR: [30, 150] } : walk(tt + i * 0.7), CROWD[i % 5], i % 2 ? 'worried' : 'neutral', { flip: true, h: 270 + (i % 3) * 20 })); frame(U, B, { z: 1.0, cx: 900, cy: 500 }, ppl, '', { fxIn: true }); L1(U, t, has(line, 'complaining') ? 'COATS · PHONES · COMPLAINTS' : 'THIRTY-EIGHT PEOPLE FILE OUT', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'least cursed-energy', 'works better', 'drill', 'cake')) { const B = off({ time: 'evening', crowd: 0, h: 4, m: 41 }); const FL = B.FLOOR; B.mid += `<rect x="-800" y="-300" width="3520" height="1500" fill="${RED}" opacity="${f(Math.sin(tt * 14) > 0 ? 0.1 : 0)}"/>`; const ppl = [0, 1, 2, 3].map((i) => Q(1500 - i * 300 - t * 110, FL, walk(tt + i), CROWD[(i + 2) % 5], i === 0 ? 'worried' : 'neutral', { flip: true, h: 320 }));
    frame(U, B, has(line, 'drill', 'cake') ? { z: 1.5, cx: 1300 - t * 100, cy: FL - 280 } : { z: 1.0, cx: 900, cy: 480 }, ppl, has(line, 'cake') ? inHand(0, (h) => `<rect x="${f(h[0] - 40)}" y="${f(h[1] - 50)}" width="80" height="50" rx="6" fill="#f4efe4"/><rect x="${f(h[0] - 40)}" y="${f(h[1] - 56)}" width="80" height="12" rx="4" fill="#e05a8a"/>`) : '', { fxIn: true });
    L1(U, t, has(line, 'drill') ? '"IS IT A DRILL?"' : has(line, 'cake') ? '"IS THE CAKE STILL HAPPENING?"' : has(line, 'works better') ? 'IT WORKS BETTER THAN ANYTHING' : 'THE LEAST CURSED-ENERGY THING', 0.2, has(line, 'drill', 'cake') ? GREY : RED); chrome(U, t, info); return; }
  if (has(line, 'Hale is still talking')) { const B = off({ time: 'evening', crowd: 0, h: 4, m: 45 }); const FL = B.FLOOR; frame(U, B, { z: 1.6, cx: 900, cy: FL - 280 }, [Q(1000, FL, P_PHONE, HALE, 'neutral', { flip: true, h: 370 }), P(720, FL, walk(tt), 'neutral')], (out) => out[0] && out[0].head ? E.wallClock(out[0].head[0] - 80, out[0].head[1] - 130, 0, 0, 0, { sec: false }).slice(0, 0) + `<text x="${f(out[0].head[0] - 60)}" y="${f(out[0].head[1] - 80)}" font-family="Inter" font-weight="900" font-size="36" fill="#fff">...REPORT...</text>` : '', { fxIn: true }); L1(U, t, 'STILL TALKING ABOUT THE REPORT', 0.2, GREY); chrome(U, t, info); return; }
  if (has(line, 'walk to the glass wall', 'chalk line', 'clean arch', 'four people')) { const op = has(line, 'clean arch') ? clamp((t - 0.3) / 0.8) : has(line, 'four people') ? 1 : 0; const B = E.stairwell(tt, { t: tt, chalk: op < 1 ? 1 : 0.5, glass: op, alarm: true }); const FL = B.FLOOR, [gx, gy, gw] = B.GLASS;
    const ppl = has(line, 'four people') ? [0, 1, 2, 3].map((i) => Q(gx + gw / 2 - 240 + i * 110 + t * 200, FL, walk(tt + i), CROWD[i], 'neutral', { h: 280 })) : [P(has(line, 'walk to the') ? gx - 400 + t * 160 : gx + 60, FL, has(line, 'chalk line') && t > 0.8 ? TAP : walk(tt), 'neutral', { look: 0.9 })];
    frame(U, B, has(line, 'walk to the') ? { z: 1.0, cx: gx - 100, cy: 480 } : { z: 1.3, cx: gx + gw / 2, cy: 520 }, ppl, '', { fxIn: true }); if (has(line, 'clean arch') && t < 0.55 && t > 0.3) U.svg('punch', `<rect width="1920" height="1080" fill="#fff" opacity="${f(0.35 * (1 - (t - 0.3) / 0.25))}"/>`, {}, { z: 4 });
    L1(U, t, has(line, 'four people') ? 'FOUR PEOPLE AT A TIME' : has(line, 'arch') ? 'A CLEAN ARCH' : has(line, 'chalk line') ? 'ONE TAP · AT THE CHALK LINE' : 'THE GLASS WALL', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'time clock', 'tap your card')) { const B = E.lobby(tt, { t: tt, time: 'evening', h: 4, m: 58 }); const FL = B.FLOOR; B.mid += E.punchClock(1200, FL - 260, 0.9, tt, { txt: t > info.dur * 0.6 ? '4:58 PM' : '4:57 PM', card: t > info.dur * 0.6 ? clamp((t - info.dur * 0.6) / 0.5) : 0 }); frame(U, B, { z: 1.5, cx: 1100, cy: FL - 330 }, [P(1000, FL, t > info.dur * 0.6 ? TAP : P_STAND, 'neutral', { look: 0.9 })], '', { fxIn: true }); L1(U, t, '4:58 · THE TIME CLOCK', 0.2, GREEN); chrome(U, t, info); return; }
  const B = off({ time: 'evening', empty: true, crowd: 0, h: 4, m: 59, chairs: true }); const FL = B.FLOOR; priyaDesk(B, 1250);
  const pr = Q(1250, FL + 10, P_SIT, PRIYA, 'neutral', { flip: true, h: 320, look: 0.2 }), hero = P(has(line, 'walk back') ? 300 + t * 220 : 760, FL, has(line, 'walk back') ? walk(tt) : P_STAND, has(line, 'truest', 'laugh') ? 'smile' : 'neutral', { look: 0.9 });
  let cam = { z: 1.1, cx: 900, cy: 500 }, ppl = [hero, pr], lbl = "PRIYA'S STILL AT HER DESK";
  if (has(line, 'turn around')) { cam = { z: 1.0, cx: 900, cy: 480 }; lbl = 'YOU TURN AROUND'; }
  if (has(line, 'still at her desk')) { ppl = [pr]; cam = { z: 1.8, cx: 1250, cy: FL - 320 }; }
  if (has(line, 'walk back')) { cam = { z: 1.0, cx: 800, cy: 480 }; lbl = 'THE EMPTY FLOOR'; }
  if (has(line, 'desk lamp')) { ppl = []; cam = { z: 1.5, cx: 600, cy: FL - 260 }; lbl = 'EVERY LAMP · STILL ON'; }
  if (has(line, 'chair is still warm')) { ppl = []; cam = { z: 1.6, cx: 1060, cy: FL - 200 }; lbl = 'EVERY CHAIR · STILL WARM'; B.mid += [0, 1, 2].map((i) => `<path d="M ${-420 + 3 * 520 + 40 + i * 30 - 30} ${FL - 280} q 10 -20 0 -40 q -10 -20 0 -40" stroke="#ffb080" stroke-width="5" fill="none" opacity="${f(0.4 + 0.3 * Math.sin(tt * 3 + i))}"/>`).join(''); }
  if (has(line, 'It just')) { ppl = [pr]; cam = { z: 2.1, cx: 1250, cy: FL - 300 }; lbl = '"IT JUST..."'; }
  if (has(line, 'truest')) { ppl = [hero, pr]; cam = { z: 1.7, cx: 860, cy: FL - 300 }; lbl = 'THE TRUEST THING ALL DAY'; }
  frame(U, B, cam, ppl, '', { fxIn: true }); L1(U, t, lbl, 0.2, GOLD); chrome(U, t, info); };
// ---------- 5:00 p.m.: overtime ----------
const curseOffice = (tt, o = {}) => { const B = off({ time: 'night', seal: 1, crowd: 0, empty: true, h: 5, m: Math.floor(overMin(G)), clockGlow: RED, ...o }); return B; };
S.overtime = (U, t, info, tt, k, n, line) => {
  if (has(line, 'say five')) { full(U, `<rect width="1920" height="1080" fill="#100606"/>${[...Array(14)].map((_, i) => `<g transform="translate(${160 + (i % 7) * 270} ${300 + Math.floor(i / 7) * 420}) scale(${f(1 + 0.03 * Math.sin(tt * 2 + i))})">${E.wallClock(0, 0, 90, 5, 0, { lt: tt, sec: false, col: i % 2 ? '#ffe8a8' : '#f4efe4' })}</g>`).join('')}`); L1(U, t, "ALL OF THEM · FIVE O'CLOCK", 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'sound like')) { const B = E.tower(tt, { t: tt, seal: clamp((t - 0.4) / 0.6), h: 5, m: 0, clockGlow: RED }); frame(U, B, { z: 1.2, cx: 960, cy: 560 }, [], '', { fxIn: true }); if (t > 0.4 && t < 0.7) U.svg('punch', `<rect width="1920" height="1080" fill="${RED}" opacity="${f(0.4 * (1 - (t - 0.4) / 0.3))}"/>`, {}, { z: 4 }); L1(U, t, '5:00 PM · THE DOORS SEAL', 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'large mouth', 'clock back in')) { if (has(line, 'clock back in') && t > info.dur * 0.45) { punchCard(U, t - info.dur * 0.45, info, '5:00 PM', 'CLOCKED IN · OVERTIME', true); return; } const B = E.tower(tt, { t: tt, seal: 1, h: 5, m: 0 }); frame(U, B, { z: 2.0, cx: 960, cy: 760 }, [], '', { fxIn: true }); L1(U, t, 'LIKE A VERY LARGE MOUTH CLOSING', 0.2, RED); chrome(U, t, info); return; }
  if (line.trim() === 'In the story,') { clockCard(U, t, info, '5:00', 'PM · OVERTIME', RED); return; }
  if (has(line, 'once overtime starts') || line.trim() === 'In the story,') { lore(U, t, info, 'OVERTIME', has(line, 'A lot') ? ['ONCE OVERTIME STARTS', 'HIS POWER JUMPS', 'A LOT'] : ['ONCE OVERTIME STARTS'], bars(t + 1)); return; }
  if (has(line, "it's a loan")) { rule(U, t, info, "IT'S A LOAN.", 'THE POWER NOW', RED, 'IN YOUR VERSION', `<g transform="translate(1560 500)">${E.heart(0, 0, 2, t)}</g>`); return; }
  if (has(line, 'clock starts on your heart')) { heartCard(U, t, info, { sub: 'A CLOCK ON YOUR HEART' }); return; }
  if (has(line, 'Eleven minutes')) { clockCard(U, t, info, '11:00', 'MINUTES · ON YOUR HEART', RED); return; }
  if (has(line, 'it stops')) { heartCard(U, t, info, { stop: t > info.dur * 0.6 ? 1 : 0, gap: t > info.dur * 0.6, txt: t > info.dur * 0.6 ? 'STOP' : undefined, sub: "NOT CLOCKED OUT BY THEN · IT STOPS" }); return; }
  const B = curseOffice(tt); const FL = B.FLOOR, rise = since('overtime', 'rises out') <= k ? (since('overtime', 'rises out') === k ? clamp(t / info.dur) : 1) : 0, seen = has(line, 'lines on the curse', 'desks and cables', 'tiny clocks', 'say five');
  if (seen || rise > 0) B.mid += E.deskCurse(1300, FL - 520 + (1 - Math.max(rise, seen ? 1 : 0)) * 700, 0.75, tt, { look: -1, line: has(line, 'lines on the curse') ? clamp(t / 1) : 0 });
  if (seen || rise > 0 || has(line, 'Priya says', 'not a word', 'push her')) B.mid += `<rect x="1060" y="${FL - 40}" width="500" height="40" fill="#15181e"/>`;
  const hero = P(has(line, 'push her') ? 820 : 640, FL, has(line, 'push her') ? { ...P_STAND, aL: [90, 10], lean: 8 } : has(line, 'quieter', 'sharper') ? P_STAND : P_STAND, 'neutral', { look: 0.9 });
  const pr = Q(has(line, 'push her') ? 520 - t * 40 : 380, FL, P_SHIVER, PRIYA, 'worried', { h: 310 });
  let ppl = [hero, pr], cam = { z: 1.0, cx: 900, cy: 480 }, lbl = 'OVERTIME', fx = '';
  if (has(line, 'choice anymore')) { cam = { z: 1.6, cx: 640, cy: FL - 300 }; lbl = 'NO CHOICE ANYMORE'; }
  if (has(line, 'quieter', 'sharper')) { ppl = [hero]; cam = { z: 1.9, cx: 660, cy: FL - 300 }; lbl = 'QUIETER · SHARPER'; fx = (out) => out[0] && out[0].head ? `<circle cx="${f(out[0].head[0])}" cy="${f(out[0].head[1] + 120)}" r="${f(200 + 10 * Math.sin(tt * 4))}" fill="${GOLD}" opacity="0.12"/>` + lineView(10, 21, 0) : ''; }
  if (has(line, 'lines on the curse')) { cam = { z: 1.3, cx: 1200, cy: FL - 400 }; lbl = 'YOU SEE ITS LINES · BEFORE IT SHOWS'; }
  if (has(line, 'desks and cables')) { ppl = []; cam = { z: 1.3, cx: 1300, cy: FL - 360 }; lbl = 'DESKS · CABLES'; }
  if (has(line, 'tiny clocks', 'say five')) { ppl = []; cam = { z: 2.4, cx: 1300, cy: FL - 640 }; lbl = has(line, 'say five') ? "ALL SAY FIVE O'CLOCK" : 'A THOUSAND TINY CLOCKS'; }
  if (has(line, 'rises out')) { cam = { z: 0.9, cx: 1000, cy: 440 }; lbl = 'AS TALL AS THE CEILING'; }
  if (has(line, 'Priya says', 'not a word')) { ppl = [pr]; cam = { z: 2.0, cx: 380, cy: FL - 280 }; lbl = has(line, 'not a word') ? 'NOT A WORD YOU CAN REPEAT' : 'PRIYA SAYS ONE WORD'; B.mid += `<rect x="40" y="${FL - 380}" width="200" height="380" fill="#7a7f8c"/>`; }
  if (has(line, 'push her')) { B.mid += `<rect x="260" y="${FL - 300}" width="200" height="300" fill="#7a7f8c"/><rect x="274" y="${FL - 280}" width="172" height="80" fill="#5a5f6c"/><rect x="274" y="${FL - 180}" width="172" height="80" fill="#5a5f6c"/>`; cam = { z: 1.0, cx: 900, cy: 480 }; lbl = 'BEHIND THE CABINETS · STEP FORWARD'; }
  frame(U, B, cam, ppl, fx, { fxIn: true }); L1(U, t, lbl, 0.2, RED); chrome(U, t, info); };
// ---------- 5:06 p.m.: the line again ----------
S.fight = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Five minutes left')) { heartCard(U, t, info, { sub: 'FIVE MINUTES LEFT', bpm: 120 }); return; }
  if (has(line, 'Our guess', 'clock is louder')) { guess(U, t, info, has(line, 'louder') ? 'WHEN THE CLOCK IS<br><span style="color:#b48cff">LOUDER THAN THE MONSTER.</span>' : 'NOT ABOUT<br><span style="color:#b48cff">STRENGTH.</span>', has(line, 'louder') ? "DON'T PANIC" : '', `<g transform="translate(1540 520)">${E.wallClock(0, 0, 180, 5, 6, { lt: t, glow: VIO })}</g>`); return; }
  if (has(line, "don't hear them", 'own pulse')) { heartCard(U, t, info, { sub: has(line, 'own pulse') ? 'ONLY YOUR PULSE · COUNTING DOWN' : "YOU DON'T HEAR THEM", bpm: 130 }); return; }
  if (has(line, 'clocks go off', 'little alarms')) { full(U, `<rect width="1920" height="1080" fill="#100606"/>${[...Array(14)].map((_, i) => { const x = 160 + (i % 7) * 270, y = 300 + Math.floor(i / 7) * 420, sh = Math.sin(tt * 40 + i) * 6 * (clamp(t * 2 - i * 0.12)); return `<g transform="translate(${f(x + sh)} ${y})">${E.wallClock(0, 0, 90, 5, 0, { lt: tt, sec: false, col: i % 2 ? '#ffe8a8' : '#f4efe4' })}${clamp(t * 2 - i * 0.12) > 0 ? `<path d="M -110 -60 q -30 -20 -20 -50 M 110 -60 q 30 -20 20 -50" stroke="${GOLD}" stroke-width="8" fill="none"/>` : ''}</g>`; }).join('')}`); L1(U, t, has(line, 'little alarms') ? 'A HUNDRED ALARMS · EACH RINGING FIVE' : 'ONE AFTER ANOTHER', 0.2, GOLD); chrome(U, t, info); return; }
  const B = curseOffice(tt); const FL = B.FLOOR, FOLD = since('fight', 'ninth floor folds'), fold = k > FOLD ? 1 : k === FOLD ? clamp((t - 0.3) / 2.2) : 0;
  const chestLine = has(line, 'lines steady', 'Three tenths', 'Always three', 'swing the dull', 'bad bell') ? 1 : 0, floorLine = has(line, 'aren\'t aiming', 'hides its weakness', 'old stairwell', 'One tap', 'floor beneath') ? 1 : 0;
  B.mid += E.deskCurse(1300 + fold * 120, FL - 520, 0.75, tt, { look: -1, gone: fold, line: chestLine });
  if (floorLine) B.mid += E.goldLine(1040, FL + 6, 1560, FL + 6, has(line, 'old stairwell') ? clamp(t / 1) : 1, tt, { lbl: 'COLLAPSE' });
  if (fold > 0) B.mid = `<g transform="rotate(${f(-fold * 7)} 960 ${FL}) translate(${f(fold * 60)} ${f(fold * 80)})">${B.mid}</g>`;
  const hit = has(line, 'hits first', 'through a wall'), rib = has(line, 'feel a rib', 'near a rib'), swing = has(line, 'swing the dull'), bell = has(line, 'bad bell'), wrist = has(line, 'wrist goes white'), tap = has(line, 'One tap', 'floor beneath');
  let pose = P_STAND, hx = 700, face = 'neutral';
  if (hit) { pose = { ...P_TIRED, lean: -30 }; hx = 700 - clamp(t / 0.6) * 400; face = 'worried'; }
  if (rib) { pose = HURT; hx = 420; face = 'worried'; }
  if (swing || bell) { pose = SWING; hx = 980; }
  if (wrist) { pose = { ...P_TIRED, aR: [30, 120] }; hx = 900; face = 'worried'; }
  if (tap) { pose = LOW; hx = 980; }
  if (has(line, 'lines steady', 'Three tenths', 'Always three', 'laughs')) { pose = { ...P_STAND, aR: [50, 40] }; hx = 760; }
  if (fold > 0) { pose = P_TIRED; hx = 760; }
  const hero = P(hx, FL, pose, face, { look: 0.9 }); const ppl = [hero];
  const fx = all(swing || bell ? bladeIn(0, 40 + 110 * clamp((t % 1.4) / 0.35)) : tap ? bladeIn(0, 160) : bladeIn(0, 20),
    hit && t < 0.5 ? `<path d="M 1100 ${FL - 380} Q 900 ${FL - 520} ${f(hx + 40)} ${FL - 260}" stroke="#7a7f8c" stroke-width="60" fill="none" stroke-linecap="round"/>` : '',
    bell ? E.wallClock(0, 0, 0, 0, 0, { sec: false }).slice(0, 0) + [0, 1, 2].map((i) => { const q = ((t * 1.2 + i / 3) % 1); return `<circle cx="1300" cy="${FL - 600}" r="${f(40 + q * 300)}" fill="none" stroke="${GOLD}" stroke-width="6" opacity="${f(0.8 * (1 - q))}"/>`; }).join('') : '',
    has(line, 'laughs') ? [0, 1, 2, 3].map((i) => `<text x="${1080 + i * 120}" y="${f(FL - 820 - Math.abs(Math.sin(tt * 6 + i)) * 40)}" font-family="IBM Plex Mono" font-weight="900" font-size="46" fill="${RED}" opacity="0.85">HA</text>`).join('') : '',
    hit && has(line, 'through a wall') ? [...Array(10)].map((_, i) => `<rect x="${f(260 + E.rnd(i) * 120 - t * 60)}" y="${f(FL - 500 + E.rnd(i * 3) * 400)}" width="${f(20 + E.rnd(i * 5) * 30)}" height="${f(16 + E.rnd(i * 7) * 24)}" fill="#c8c0ae" transform="rotate(${f(E.rnd(i) * 90 + t * 200)} 300 ${FL - 300})"/>`).join('') : '');
  let cam = { z: 1.0, cx: 960, cy: 470 };
  if (hit) cam = { z: 1.1, cx: 700, cy: 480 }; if (rib || wrist) cam = { z: 2.0, cx: hx, cy: FL - 300 }; if (swing || bell) cam = { z: 1.3, cx: 1160, cy: FL - 400 }; if (has(line, 'lines steady', 'Three tenths', 'Always three')) cam = { z: 1.8 + 0.2 * (since('fight', 'Always three') === k ? 1 : 0), cx: 1300, cy: FL - 640 };
  if (has(line, 'laughs')) cam = { z: 1.2, cx: 1200, cy: FL - 480 }; if (floorLine) cam = { z: 1.2, cx: 1200, cy: FL - 280 }; if (fold > 0) cam = { z: 0.95, cx: 1000, cy: 460 };
  frame(U, B, cam, ppl, fx, { fxIn: true }); if ((hit || bell) && t < 0.25) U.svg('punch', `<rect width="1920" height="1080" fill="#fff" opacity="${f(0.5 * (1 - t / 0.25))}"/>`, {}, { z: 4 });
  L1(U, t, hit ? 'IT HITS FIRST · THROUGH A WALL' : rib ? 'A RIB SAYS NO' : has(line, 'Always three') ? 'ALWAYS THREE TENTHS' : has(line, 'Three tenths', 'lines steady') ? 'THE LINES STAY STEADY · 7:3' : swing ? 'THE DULL BLADE · AT THE LINE' : bell ? 'LIKE A BAD BELL' : wrist ? 'WHITE TO THE ELBOW · NOTHING' : has(line, 'laughs') ? 'A HUNDRED CLOCK VOICES' : has(line, "aren't aiming") ? 'NOT THE CHEST' : has(line, 'hides its weakness', 'old stairwell') ? 'WHERE IT CAME FROM · THE OLD STAIRWELL' : tap ? 'COLLAPSE · ONE TAP · THE FLOOR' : has(line, 'ninth floor folds') ? 'THE NINTH FLOOR FOLDS' : has(line, 'desks slide') ? 'THE DESKS SLIDE' : 'THE FIGHT', 0.2, hit || rib || wrist ? RED : GOLD); chrome(U, t, info); };
// ---------- 5:11 p.m.: clock out ----------
S.clock = (U, t, info, tt, k, n, line) => {
  if (has(line, 'metronome', 'Thump', 'long, long gap')) { heartCard(U, t, info, { gap: has(line, 'gap'), bpm: has(line, 'gap') ? 30 : 60, sub: has(line, 'gap') ? 'THEN A LONG, LONG GAP' : has(line, 'Thump') ? 'THUMP. THUMP.' : 'A METRONOME · SOMETHING WRONG', left: 11 - overMin(G) }); return; }
  if (has(line, 'Five eleven')) { punchCard(U, t, info, '5:11 PM', 'CLOCKED OUT'); return; }
  if (has(line, 'heart starts again')) { heartCard(U, t, info, { txt: 'CLOCKED OUT', sub: 'RUDE AND LOUD', bpm: 110, left: 0 }); return; }
  if (has(line, 'You knew')) { say(U, t, info, 'PRIYA', 'You knew. From the start. Didn’t you?'); return; }
  if (has(line, 'only knew one thing', 'worth being late')) { say(U, t, info, 'YOU', has(line, 'worth') ? 'Nothing in that building was worth being late for.' : 'I only knew one thing.'); return; }
  if (has(line, 'Would you clock out', 'hundred more hours', 'comments', 'who you want')) { const B = E.tower(tt, { t: tt, time: 'evening', h: 5, m: 0 }); bigOver(U, t, info, B, { z: 0.95, cx: 960, cy: 460 }, has(line, 'who you want') ? 'Who do you want<br>to become next?' : has(line, 'comments') ? 'Tell me<br><span style="color:#ffd23f">in the comments.</span>' : has(line, 'hundred') ? 'Or a hundred<br><span style="color:#ff2e3a">more hours?</span>' : 'Would you<br><span style="color:#ffd23f">clock out on time?</span>'); chrome(U, t, info, { status: { text: 'YOUR TURN', on: true, color: COL.yellow } }); return; }
  if (has(line, 'unseal')) { const B = E.tower(tt, { t: tt, seal: 1 - clamp((t - 0.6) / 1), h: 5, m: 11 }); frame(U, B, { z: 1.3, cx: 960, cy: 640 }, [], '', { fxIn: true }); L1(U, t, 'A SOFT CLICK · THE DOORS UNSEAL', 0.2, GREEN); chrome(U, t, info); return; }
  if (has(line, 'crawl to the time clock', "Priya's behind you", 'like a leash', 'tap the card')) { const B = E.lobby(tt, { t: tt, time: 'night', h: 5, m: 10 }); const FL = B.FLOOR; B.mid += E.punchClock(1300, FL - 260, 0.9, tt, { txt: '5:10 PM', red: true, sub: 'OVERTIME', card: has(line, 'tap the card') && t > info.dur * 0.6 ? clamp((t - info.dur * 0.6) / 0.5) : 0 });
    const hx = has(line, 'crawl') ? 700 + t * 120 : 1060; const hero = P(hx, FL, has(line, 'tap the card') && t > info.dur * 0.5 ? { ...TAP, lean: 30 } : crawl(tt), 'worried', { look: 0.9, h: 340 }); const pr = Q(hx - 300, FL, has(line, 'leash') ? HOLD : walk(tt), PRIYA, 'worried', { h: 320 });
    frame(U, B, has(line, 'crawl') ? { z: 1.0, cx: 960, cy: 500 } : { z: 1.4, cx: hx - 60, cy: FL - 280 }, has(line, 'crawl') ? [hero] : [hero, pr], has(line, 'leash') ? (out) => out[0] && out[1] && out[1].hands ? `<path d="M ${f(out[1].hands[1][0])} ${f(out[1].hands[1][1])} Q ${f((out[0].shL[0] + out[1].hands[1][0]) / 2)} ${f(out[0].shL[1] + 80)} ${f((out[0].shL[0] + out[0].shR[0]) / 2)} ${f(out[0].shL[1] + 20)}" stroke="${GOLD}" stroke-width="12" fill="none"/>` : '' : '', { fxIn: true });
    L1(U, t, has(line, 'crawl') ? 'YOU CRAWL TO THE TIME CLOCK' : has(line, 'leash') ? 'YOUR TIE · LIKE A LEASH' : has(line, 'tap the card') ? 'TAP THE CARD' : "PRIYA'S BEHIND YOU", 0.2, RED); chrome(U, t, info); return; }
  if (has(line, 'next morning', 'notice by the door', 'left on time')) { const B = E.lobby(tt, { t: tt, time: 'morning', h: 8, m: 59 }); const FL = B.FLOOR; B.mid += `<g transform="translate(1180 ${FL - 520})"><rect x="-150" y="-110" width="300" height="300" rx="8" fill="#f4efe4" stroke="#8a6a4a" stroke-width="10"/><text x="0" y="-50" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#2a2d3a">LEFT ON TIME:</text>${[0, 1, 2, 3, 4].map((i) => `<rect x="-110" y="${-20 + i * 36}" width="${f(120 + E.rnd(i) * 100)}" height="14" fill="#8a8f9c"/><path d="M 100 ${-12 + i * 36} l 10 10 l 20 -20" stroke="${GREEN}" stroke-width="6" fill="none"/>`).join('')}</g>`;
    if (has(line, 'Priya brings')) { const pr = Q(1500 - clamp(t / 2) * 300, FL, walk(tt), PRIYA, 'smile', { flip: true }); frame(U, B, { z: 1.1, cx: 1100, cy: 500 }, [P(900, FL, P_STAND, 'smile', { look: 0.8 }), pr], inHand(1, (h) => `<rect x="${f(h[0] - 18)}" y="${f(h[1] - 40)}" width="36" height="44" rx="5" fill="#fff"/>`), { fxIn: true }); L1(U, t, 'A COFFEE', 0.2, GOLD); chrome(U, t, info); return; }
    frame(U, B, has(line, 'left on time') ? { z: 1.8, cx: 1180, cy: FL - 520 } : { z: 1.0, cx: 960, cy: 500 }, [], '', { fxIn: true }); L1(U, t, has(line, 'left on time') ? 'A LINE FOR WHO LEFT ON TIME' : 'THE NEXT MORNING · A NEW NOTICE', 0.2, GREEN); chrome(U, t, info); return; }
  if (has(line, 'sticky note', 'presses it', 'GO HOME')) { const B = off({ time: 'morning', crowd: 0.8, h: 9, m: 2 }); const FL = B.FLOOR; const note = has(line, 'presses', 'GO HOME') ? 1 : 0, nx = -420 + 520 + 0, ny = FL - 340; B.mid += note ? `<g transform="translate(${nx + 30} ${ny}) rotate(-4)"><rect x="-60" y="-50" width="120" height="100" fill="#ffe86a"/><text x="0" y="10" text-anchor="middle" font-family="Caveat, Inter" font-weight="900" font-size="34" fill="#2a2d3a">GO HOME</text></g>` : '';
    frame(U, B, has(line, 'GO HOME') ? { z: 3.2, cx: nx + 30, cy: ny } : { z: 1.5, cx: 200, cy: FL - 300 }, has(line, 'GO HOME') ? [] : [P(-40, FL, P_SIT, 'neutral', { h: 340, look: 0.9 }), Q(260, FL, has(line, 'presses') ? { ...P_STAND, aR: [80, 40] } : P_THINK, PRIYA, 'smile', { flip: true })], '', { fxIn: true }); L1(U, t, has(line, 'GO HOME') ? 'GO HOME.' : 'A STICKY NOTE', 0.2, GOLD); chrome(U, t, info); return; }
  if (has(line, 'leave at five', 'five oh one')) { const B = E.tower(tt, { t: tt, time: 'evening', h: 5, m: 0, clockGlow: GOLD }); const FL = B.FLOOR; frame(U, B, { z: has(line, 'five oh one') ? 1.25 : 1.0, cx: 960, cy: has(line, 'five oh one') ? 560 : 480 }, [P(900 + t * 160, FL, walk(tt), 'smile', { h: 300 })], '', { fxIn: true }); L1(U, t, has(line, 'five oh one') ? 'NOT 5:01 · FIVE' : 'YOU LEAVE AT FIVE', 0.2, GOLD); chrome(U, t, info, { time: '5:00 PM', status: { text: 'CLOCKED OUT · 5:00', on: true, color: GREEN } }); return; }
  if (has(line, "It's bad. It's perfect")) { const B = off({ time: 'morning', crowd: 0.8, h: 9, m: 1 }); const FL = B.FLOOR; frame(U, B, { z: 1.8, cx: 760, cy: FL - 320 }, [P(700, FL, HOLD, 'smile', { look: 0.9 }), Q(1000, FL, P_STAND, PRIYA, 'smile', { flip: true })], inHand(0, (h) => `<rect x="${f(h[0] - 18)}" y="${f(h[1] - 40)}" width="36" height="44" rx="5" fill="#fff"/><path d="M ${f(h[0] - 8)} ${f(h[1] - 50)} q 8 -14 0 -26" stroke="#fff" stroke-width="4" fill="none" opacity="0.6"/>`), { fxIn: true }); L1(U, t, "IT'S BAD · IT'S PERFECT", 0.2, GOLD); chrome(U, t, info); return; }
  const B = E.lobby(tt, { t: tt, time: 'night' }); frame(U, B, { z: 1.0, cx: 900, cy: 500 }, [P(800, B.FLOOR, P_STAND)], '', { fxIn: true }); L1(U, t, '5:11 PM', 0.2, GREEN); chrome(U, t, info); };

// CANON / OUR RULE / OUR GUESS seal in the top-left corner while the narration says that sentence (times from the voice)
const TAGCOL = { 'CANON': GOLD, 'OUR RULE': RED, 'OUR GUESS': VIO };
const tagSeal = (U, g) => { const a = TAGS.find((x) => g >= x.t0 && g <= x.t1);
  if (!a) { U.html('tag', '', {}); return; } const k = clamp((g - a.t0) / 0.2), c = TAGCOL[a.tag];
  U.html('tag', `<div style="opacity:${f(k)};transform:scale(${f(0.85 + 0.15 * ease.out(k))});transform-origin:left top;display:inline-flex;align-items:center;gap:10px;background:rgba(10,8,14,.82);border:3px solid ${c};border-radius:10px;padding:8px 16px"><div style="width:14px;height:14px;border-radius:3px;background:${c}"></div><div style="font:900 28px 'IBM Plex Mono';letter-spacing:.08em;color:${c}">${a.tag}</div></div>`, { left: '46px', top: '104px' }, { z: 60 }); };
const BG = { open: '#12040a', line: '#d8d0c0', schedule: '#dcd6cc', stairs: '#8a8a88', collapse: '#5a5448', out: '#3a3440', overtime: '#3a3440', fight: '#3a3440', clock: '#12040a' };
// section start times (for the overtime clock): the first shot of each section
{ const st = {}; for (const [id, p] of Object.entries(PLAN)) if (p.k === 0) st[p.sec] = id; globalThis.__NN_FIRST = st; }
// shots that must show the action (never a close-up)
const WIDE = new Set(Object.entries(PLAN).filter(([, p]) => has(p.line, 'woken up as Kento', 'In real life', 'three tenths', 'perfect espresso', 'a second one', 'knotted', 'chalk line', 'lines steady', 'Always three', 'elevator doors', 'lock pops', 'goes quiet', 'drops a stapler', 'Forty people', 'old file room', 'folds like wet', 'ceiling above', 'fire alarm', 'file out', 'clean arch', 'four people', 'walk back', 'sound like', 'rises out', 'push her', 'hits first', 'swing the dull', 'ninth floor folds', 'desks slide', 'unseal', 'crawl to', 'next morning', 'leave at five', 'GO HOME', 'Henderson')).map(([id]) => id));
const CUTS = {}; { const by = {}; for (const [id, p] of Object.entries(PLAN)) (by[p.sec] = by[p.sec] || []).push(id);
  for (const ids of Object.values(by)) ids.forEach((id, k) => { CUTS[id] = WIDE.has(id) || k === 0 ? 'wide' : ['close', 'wide', 'wide', 'close', 'wide'][(k - 1) % 5]; }); }
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const SHOT = (id, bg, body, p) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { SECNOW = p.sec; KNOW = p.k; LINE = p.line; G = info.start + t;
  if (!T_OVER) { const ids = Object.keys(PLAN); } U.svg('fx', '', {}); U.svg('card', '', {}); U.html('big', '', {}); U.html('L1', '', {}); U.svg('punch', '', {}); LT = t; DUR = info.dur; MOVE = hash(id) % 4; CUT = CUTS[id] === 'close' ? 'close' : 'wide'; body(U, t, info, info.start + t); CUT = 'wide'; tagSeal(U, info.start + t); } });
export const setSections = (secs) => { for (const [n, t0] of secs) { if (n === 'overtime') T_OVER = t0; if (n === 'fight') T_FIGHT = t0; if (n === 'clock') T_CLOCK = t0; } };
import { SECS } from './plan.js';
setSections(SECS);
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line), p);
