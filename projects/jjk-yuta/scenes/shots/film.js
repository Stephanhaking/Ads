// "What If You Had Yuta Okkotsu's Copy Powers in Real Life?" — flat 2D (same look as the Megumi / JoJo videos). Shots come
// from PLAN (story sections); each section draws by keywords in the narration line. The pale figure is our own design: huge,
// pale, a wide closed mouth of big teeth, small sad eyes; protective and sad, never violent. The five skills are five
// coloured cards (red climber, blue swimmer, purple locksmith, gold driver, green strongman). Every block has its own place;
// the bedroom only comes back at the end to mirror the opening.
import { registerShot, clamp, ease } from '/engine/api.js';
import { P_STAND, P_THINK, P_TIRED, P_PHONE, P_SIT, P_RUN, P_SHRUG, P_PRESENT, P_SWIM } from '../lib/people.js';
import { hud, label, caption, COL } from '../lib/hud.js';
import { frame as frame0 } from '../lib/flat2d.js';
import { personRef } from '../lib/body2.js';
import * as SET from '../lib/sets/saitama2d.js';
import * as J from '../lib/sets/jojo2d.js';
import * as N from '../lib/sets/dn2d.js';
import * as M from '../lib/sets/mg2d.js';
import * as Y from '../lib/sets/yt2d.js';
import { PLAN } from './plan.js';

const f = (n) => n.toFixed(1);
const LILAC = '#cdb8ff', GOLD = '#e0b44a', RED = '#e8452e';
const HERO = { top: '#f2f2f6', bottom: '#d8dae2', hair: 'short', broad: true };
const MUM = { top: '#e05a8a', bottom: '#22263a', hair: 'ponytail' };
const DAD = { top: '#3f6db3', bottom: '#2a2d3a', hair: 'curly', broad: true };
const BUSK = { top: '#8a5a3a', bottom: '#2a2d3a', hair: 'curly', broad: true };
const CLIMB = { top: '#ff8a3a', bottom: '#22263a', hair: 'short' };
const COLL = [{ top: '#4fd06a', bottom: '#2a2d3a', hair: 'ponytail' }, { top: '#9a5cc0', bottom: '#2a2d3a', hair: 'short' }, { top: '#3fb8e0', bottom: '#2a2d3a', hair: 'curly' }];
const FRIEND = { top: '#ffd23f', bottom: '#22263a', hair: 'ponytail' };
const BOY = { top: '#e8452e', bottom: '#22263a', hair: 'short' };
const DANCER = { top: '#e05a8a', bottom: '#1c1e26', hair: 'ponytail' };
const TEACH = { top: '#2a2d3a', bottom: '#2a2d3a', hair: 'short' };
const OLD = { top: '#7a6a5a', bottom: '#4a4a52', hair: 'short', broad: true };
const MEDIC = { top: '#2f9a5a', bottom: '#1f5a3a', hair: 'short', broad: true };
const MAN = { top: '#5a6070', bottom: '#2a2d3a', hair: 'short', broad: true };
const CROWD = [{ top: '#ff8a3a', bottom: '#22263a', hair: 'short' }, { top: '#3fb8e0', bottom: '#22263a', hair: 'ponytail' }, { top: '#9a5cc0', bottom: '#22263a', hair: 'curly' }, { top: '#4fd06a', bottom: '#22263a', hair: 'short' }];
const TITLE = "WHAT IF YOU HAD YUTA'S COPY?";
const ST = (on = true, txt = 'RIKA · WATCHING') => ({ text: txt, on, color: LILAC });
const chrome = (U, t, info, d) => { hud(U, { title: TITLE, ...d }); caption(U, info, t); };
const LX = (txt) => Math.min(1180, 1840 - txt.length * 24 - 70);
const L1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 260, c ? { color: c } : {});
const CL1 = (U, t, txt, t0 = 0.3, c) => label(U, 'L1', txt, t0, t, LX(txt), 170, c ? { color: c } : {});
const has = (line, ...w) => w.some((x) => line.toLowerCase().includes(x.toLowerCase()));
const since = (sec, ...w) => { let best = 1e9; for (const p of Object.values(PLAN)) if (p.sec === sec && has(p.line, ...w)) best = Math.min(best, p.k); return best; };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const ARM_UP = { ...P_STAND, aR: [165, 8] };
const REACH = { ...P_STAND, lean: 6, aL: [150, 20], aR: [170, 10], lL: [20, 30], lR: [4, 0] };
const FALL = { ...P_STAND, lean: -10, aL: [120, 60], aR: [140, 40], lL: [30, 50], lR: [-20, 20], head: -10 };
const HAND_DOWN = { ...P_STAND, lean: 10, aR: [70, 10], head: 12 };
const KNEEL = { ...P_SIT, lean: 34, aL: [70, 10], aR: [70, 10], head: 20 };
const PAN = { ...P_STAND, aR: [80, 70] };
const PLAY = { ...P_STAND, aL: [60, 120], aR: [40, 70], head: 10 };
const DANCE = (tt, i = 0) => [{ ...P_STAND, aL: [150, 20], aR: [60, 120], lL: [30, 10], lR: [4, 0] }, { ...P_STAND, aL: [100, 60], aR: [160, 10], lL: [4, 0], lR: [40, 60] }, { ...P_STAND, aL: [170, 0], aR: [170, 0], lL: [10, 0], lR: [10, 0], head: -10 }][Math.floor(tt * 1.6 + i) % 3];
const P = (x, y, pose, face = 'neutral', o = {}) => ({ x, y, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre, shadow: o.shadow });
const Q = (x, y, pose, outfit, face = 'neutral', o = {}) => ({ x, y, h: o.h || 340, pose, outfit, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const D = (day, time, status) => ({ day, time, status });
const big = (U, html, x = 160, y = 360) => U.html('big', html, { left: x + 'px', top: y + 'px' }, { z: 50 });
let FULLED = false;
const full = (U, svg) => { FULLED = true; return U.svg('card', svg, {}, { z: 3 }); };
let CUT = 'wide';
const frame = (U, B, cam, ppl, fx, o) => { if (CUT === 'close' && ppl && ppl[0]) { const h = ppl[0]; cam = { z: Math.max(cam.z * 1.9, 2.3), cx: h.x + (h.flip ? -30 : 30), cy: h.y - (h.h || 360) * 0.72 }; } return frame0(U, B, cam, ppl, fx, o); };
const KCOL = { open: ['#0a0a1c', LILAC], ring: ['#1a1430', GOLD], omelette: ['#f2d58a', RED], busker: ['#4a8ae0', '#ffd23f'], climb: ['#3a4a5e', '#ff8a3a'], voice: ['#e4e0d8', RED], habit: ['#6a3a3a', '#ffd23f'], park: ['#ff8a6a', '#ffffff'], dance: ['#0b0b14', '#e05a8a'], chess: ['#a8d4ea', RED], limit: ['#8a9ac8', '#15181e'], ringoff: ['#07070f', GOLD], cpr: ['#2f9a5a', '#ffffff'], cost: ['#5a4a6a', '#ffd23f'], tunnel: ['#141a2a', '#8ac8f0'], quiet: ['#c8d4e4', '#15181e'] };
const kin = (U, t, line, sec) => { const [bg, ac] = KCOL[sec] || ['#15181e', '#ffd23f']; const words = line.replace(/["“”]/g, '').split(/\s+/).filter(Boolean);
  let key = 0, len = 0; words.forEach((w, i) => { const n = w.replace(/[^\w]/g, '').length; if (n > len) { len = n; key = i; } });
  const k = clamp(t / 0.25), dark = ['#f2d58a', '#e4e0d8', '#a8d4ea', '#8a9ac8', '#c8d4e4'].includes(bg);
  U.svg('card', `<rect width="1920" height="1080" fill="${bg}"/>${[...Array(9)].map((_, i) => `<rect x="${-200 + i * 260 + (t * 40) % 260}" y="0" width="120" height="1080" fill="${dark ? '#000' : '#fff'}" opacity="0.035" transform="skewX(-12)"/>`).join('')}`, {}, { z: 3 });
  U.html('big', `<div style="width:1500px;transform:scale(${f(0.92 + 0.08 * ease.out(k))});transform-origin:left center;opacity:${f(k)};${TXT(words.length > 9 ? 96 : 118, dark ? '#15181e' : '#ffffff')};text-transform:uppercase">${words.map((w, i) => i === key ? `<span style="color:${ac === '#15181e' ? RED : ac}">${w}</span>` : w).join(' ')}</div>`, { left: '200px', top: '330px' }, { z: 50 });
  U.html('L1', '', {}); U.html('cap', '', {}); };
// "IN THE STORY" lore card: a title and up to three short lines; art = optional svg on the right
const lore = (U, t, title, lines, art = '', col = LILAC) => { const k = clamp(t / 0.4);
  full(U, `<rect width="1920" height="1080" fill="#100c1e"/>${art}`);
  big(U, `<div style="opacity:${f(k)};max-width:1000px"><div style="font:800 34px 'IBM Plex Mono';color:${col};letter-spacing:.08em">IN THE STORY · JUJUTSU KAISEN</div><div style="${TXT(96)};margin:18px 0 26px">${title}</div>${lines.map((l, i) => `<div style="font:700 40px Inter;color:#dfe6f2;margin:10px 0;opacity:${f(clamp((t - 0.4 - i * 0.5) / 0.3))}">· ${l}</div>`).join('')}</div>`, 160, 250); };
const bigNum = (U, t, num, unit, sub, src, col = '#ffd23f') => { const k = clamp(t / 0.5);
  full(U, `<rect width="1920" height="1080" fill="#100c1e"/>`);
  big(U, `<div style="text-align:center;width:1600px;opacity:${f(k)}"><div style="${TXT(230, col)}">${num}<span style="font-size:110px;color:#fff"> ${unit}</span></div><div style="font:800 48px Inter;color:#fff;margin-top:24px">${sub}</div><div style="font:700 28px 'IBM Plex Mono';color:#8a93a8;margin-top:20px">${src}</div></div>`, 160, 300); };
const lesson = (U, t, n, txt) => L1(U, t, `LESSON ${n} · ${txt}`, 0.2, COL.yellow);
const clock1147 = (U, t, info, day = 1) => { const kk = clamp(t / 0.4); full(U, `<rect width="1920" height="1080" fill="#06050f"/>${Y.moon(1500, 260, 70)}<rect x="560" y="300" width="800" height="440" rx="40" fill="#120e24" stroke="#2a2448" stroke-width="10"/><text x="960" y="610" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="250" fill="${LILAC}" opacity="${f(kk)}">11:47</text><text x="1310" y="400" text-anchor="end" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="${LILAC}" opacity="0.7">PM</text>`); chrome(U, t, info, D(day, '11:47 PM', ST(true))); };
// a close-up of the ring on a hand (on = on the finger; off = held between two fingers)
const ringClose = (U, t, info, d, o = {}) => { const kk = clamp(t / 0.5), gl = o.glow ?? 0.5;
  const hand = `<path d="M 600 1100 Q 640 760 760 700 L 1240 640 Q 1300 640 1300 690 Q 1300 730 1240 740 L 1000 760 L 1300 760 Q 1360 762 1360 812 Q 1360 860 1300 862 L 1020 870 L 1280 880 Q 1330 884 1330 930 Q 1328 970 1270 972 L 1000 980 L 1200 990 Q 1250 994 1246 1040 L 1240 1100 Z" fill="#f2d0b0" stroke="#c89a7a" stroke-width="5"/>`;
  full(U, `<rect width="1920" height="1080" fill="${o.bg || '#0c0a1a'}"/><g transform="translate(1180 700) scale(1.45) translate(-1000 -820)">${hand}${o.off ? '' : Y.ring(1100, 700, 1.25, gl * (0.6 + 0.4 * Math.sin(t * 3) ** 2))}</g>${o.off ? Y.ring(1650, 380 - 60 * kk, 2.4, gl) : ''}`);
  if (o.text) big(U, `<div style="${TXT(80, o.col || '#fff')};opacity:${f(kk)};max-width:900px">${o.text}</div>`, 140, 180);
  chrome(U, t, info, d); };

const S = {};
// cold open: the promise with flash-forwards (the cards, the tunnel, the figure under the moon), then 11:47 p.m.
S.open = (U, t, info, tt, k, n, line) => {
  if (has(line, 'from Jujutsu Kaisen')) { const B = M.nightBalcony(tt); B.back += Y.torii(1620, 660, 1.2); B.mid = Y.rika(1060, B.FLOOR + 40, 940, tt, { mood: 'calm', op: 0.95 }) + B.mid; frame(U, B, { z: 1.0, cx: 960, cy: 520 }, [P(760, B.FLOOR, { ...P_STAND, aR: [70, 60] }, 'neutral', { look: 0.9 })], Y.fan(330, B.FLOOR - 330, 0.6, clamp(t / 0.8), tt), { fxIn: true }); L1(U, t, "YUTA OKKOTSU'S COPY · JUJUTSU KAISEN", 0.1, LILAC); chrome(U, t, info, D(1, '11:47 PM', ST())); return; }
  if (has(line, 'In forty days', 'fourteen people', 'five of the things')) { const B = Y.tunnel(tt, { water: 700, faces: true }); frame(U, B, { z: 1.0, cx: 960, cy: 540 }, [], has(line, 'five of the things') ? Y.fan(500, 760, 0.9, clamp(t / 0.6), tt) : '', { fxIn: true }); L1(U, t, has(line, 'fourteen') ? '14 PEOPLE · A FLOODED TUNNEL' : 'LATER · DAY 40', 0.2, COL.yellow); chrome(U, t, info, D(40, '6:40 PM', ST(true, 'COPIES · 5/5'))); return; }
  if (has(line, 'eleven forty-seven') && t < 1.6) { clock1147(U, t, info); return; }
  if (has(line, 'ring on your finger')) { ringClose(U, t, info, D(1, '11:47 PM', ST()), { text: 'A RING YOU\'VE <span style="color:#e0b44a">NEVER SEEN</span>' }); return; }
  const B = SET.bedroom(tt, { time: 'night' }); const FL = 820; B.back += M.moon(1560, 250, 46);
  const behind = has(line, 'behind you', 'breathing', 'costs');
  B.mid = Y.rika(1120, FL + 40, 940, tt, { mood: has(line, 'costs') ? 'look' : 'calm', op: has(line, 'Yuta Okkotsu', 'real life') ? 0.35 : has(line, 'breathing') ? 0.5 + 0.4 * clamp(t / info.dur) : 0.9 }) + B.mid;
  const hero = P(760, FL, has(line, 'copy anything') ? { ...P_STAND, aR: [70, 60] } : P_STAND, behind ? 'worried' : 'neutral', { look: behind ? -0.4 : 0.9 });
  let fx = has(line, 'copy anything') ? Y.fan(860, FL - 220, 0.75, clamp(t / 0.7), tt) : '';
  let cam = { z: 1.05 + 0.08 * clamp(t / info.dur), cx: 960, cy: 500 };
  if (has(line, 'Yuta Okkotsu')) L1(U, t, "YUTA OKKOTSU'S COPY · JUJUTSU KAISEN", 0.1, LILAC);
  if (has(line, 'real life')) { cam = { z: 1.4, cx: 860, cy: 560 }; L1(U, t, 'IN REAL LIFE', 0.1, '#4fd06a'); }
  if (has(line, 'copy anything')) L1(U, t, 'WATCH IT · COPY IT', 0.3, LILAC);
  if (has(line, 'costs')) { cam = { z: 1.3, cx: 1100, cy: 360 }; L1(U, t, 'SHE DECIDES THE COST', 0.3, LILAC); }
  if (has(line, 'breathing')) { cam = { z: 1.2, cx: 980, cy: 440 }; L1(U, t, 'SOMETHING · BEHIND · YOU', 0.3, LILAC); }
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(1, '11:47 PM', ST(true)));
};
// 11:47 p.m.: the ring and the promise, the figure, mum says goodnight to the wardrobe
S.ring = (U, t, info, tt, k, n, line) => {
  if (has(line, 'ring was a promise')) { ringClose(U, t, info, D(1, '11:48 PM', ST()), { text: 'THE RING · <span style="color:#e0b44a">A PROMISE</span>', glow: 0.8 }); return; }
  if (has(line, 'Rika Orimoto', "mother's ring", 'let go')) { lore(U, t, 'RIKA ORIMOTO', ["YUTA'S CHILDHOOD FRIEND", "SHE GAVE HIM HER MOTHER'S RING · A PROMISE TO MARRY HIM", 'SHE DIED YOUNG'], Y.ring(1560, 560, 3.2, 0.7)); chrome(U, t, info, D(1, '11:48 PM', ST())); return; }
  if (has(line, 'soul stayed', 'Queen of Curses')) { lore(U, t, 'THE QUEEN OF CURSES', ['HER SOUL STAYED, TIED TO HIS CURSED ENERGY', 'SHE BECAME A SPECIAL-GRADE CURSE'], Y.rika(1560, 1120, 900, tt, { mood: 'calm', op: 0.9 })); chrome(U, t, info, D(1, '11:48 PM', ST())); return; }
  const B = SET.bedroom(tt, { time: 'night' }); const FL = 820; B.back += M.moon(1560, 250, 46);
  const MUMK = since('ring', 'mum walks');
  B.mid = Y.rika(1150, FL + 40, 960, tt, { mood: has(line, 'looks at the ring') || k > MUMK ? 'look' : 'calm' }) + B.mid;
  const hero = P(760, FL, has(line, 'looks at the ring') ? { ...P_STAND, aR: [70, 60] } : P_STAND, 'worried', { look: -0.5 });
  const ppl = [hero]; let cam = { z: 1.1, cx: 960, cy: 520 };
  if (has(line, 'mum walks')) { ppl.push(Q(-80 + clamp(t / info.dur) * 520, FL, walk(tt), MUM, 'smile', { look: 0.9 })); cam = { z: 1.0, cx: 900, cy: 520 }; L1(U, t, '"GOODNIGHT" · TO THE WARDROBE', 0.6); }
  if (has(line, 'Pale', 'all teeth', 'very close')) { cam = { z: 1.7, cx: 1150, cy: 300 }; L1(U, t, 'PALE · HUGE · ALL TEETH', 0.3, LILAC); }
  if (has(line, 'looks at the ring')) { cam = { z: 1.5, cx: 980, cy: 420 }; L1(U, t, "IT DOESN'T ATTACK · IT LOOKS AT THE RING", 0.3, LILAC); }
  if (has(line, 'weapon', 'big shadow')) lesson(U, t, 1, "NOT A WEAPON. A PROMISE");
  frame(U, B, cam, ppl, has(line, 'looks at the ring') ? Y.ring(870, FL - 300, 0.35, 0.8) : '', { fxIn: true }); chrome(U, t, info, D(1, '11:48 PM', ST()));
};
// 7:10 a.m.: dad's omelette, copied perfectly; the second one alone is a disaster
const pan = (x, y, k, mess = 0) => `<g transform="translate(${f(x)} ${f(y)})"><rect x="0" y="-8" width="150" height="16" rx="6" fill="#2a2d3a"/><ellipse cx="-90" cy="0" rx="100" ry="22" fill="#3a3d48"/><ellipse cx="-90" cy="${f(-6 - Math.sin(k * Math.PI) * 120)}" rx="70" ry="14" fill="#ffd23f" transform="rotate(${f(k * 360)} -90 ${f(-6 - Math.sin(k * Math.PI) * 120)})"/></g>${mess ? `<path d="M ${x - 260} ${y + 240} q 40 -30 80 0 q 30 20 70 -10 q 30 30 -20 40 q -60 20 -130 -30 Z" fill="#ffd23f"/>` : ''}`;
S.omelette = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Copy lets', 'exact conditions')) { lore(U, t, 'COPY', ["YUTA'S TECHNIQUE: HE REPRODUCES OTHER PEOPLE'S TECHNIQUES", 'NOBODY IS COMPLETELY SURE OF THE EXACT CONDITIONS'], Y.fan(1520, 760, 1.2, 1, tt)); chrome(U, t, info, D(1, '7:10 AM', ST())); return; }
  const B = J.kitchen(tt); const FL = B.FLOOR || 840; let cam = { z: 1.1, cx: 900, cy: 560 };
  const YOU = since('omelette', 'Your hands do it', 'never flipped'), MESS = since('omelette', 'disaster', 'second one');
  const dadFlip = k < YOU, mine = k >= YOU;
  const dad = Q(620, FL, dadFlip ? PAN : P_STAND, DAD, 'smile', { look: 0.9 });
  const hero = P(1220, FL, mine ? PAN : P_THINK, k >= MESS ? 'worried' : mine ? 'open' : 'neutral', { flip: true, look: -0.9 });
  let fx = dadFlip ? pan(720, FL - 250, (tt * 0.6) % 1) : pan(1120, FL - 250, k >= MESS ? clamp(t / 0.8) * 0.4 : (tt * 0.6) % 1, k >= MESS && t > 0.6);
  if (has(line, 'strand of hair')) fx += `<path d="M 1200 ${FL - 380} q 20 -30 50 -10" stroke="#1c1e26" stroke-width="6" fill="none"/><circle cx="1260" cy="${FL - 360}" r="${f(8 + 6 * Math.sin(tt * 8))}" fill="#bfe4ff" opacity="0.6"/>`;
  if (has(line, 'watch your dad')) { cam = { z: 1.4, cx: 700, cy: 520 }; L1(U, t, 'WATCHING · DAD', 0.3); }
  if (has(line, 'Your hands do it', 'Perfectly')) { cam = { z: 1.4, cx: 1150, cy: 520 }; L1(U, t, 'COPIED · 100%', 0.2, '#4fd06a'); }
  if (has(line, 'tilt of the wrist')) L1(U, t, 'WRIST TILT · FOLD · COPIED', 0.2, '#4fd06a');
  if (has(line, 'strand of hair')) { cam = { z: 2.0, cx: 1200, cy: 460 }; L1(U, t, 'EVEN · THE · HAIR · BLOW', 0.2, '#4fd06a'); }
  if (has(line, 'disaster')) { cam = { z: 1.3, cx: 1100, cy: 640 }; L1(U, t, 'ON YOUR OWN · 0%', 0.4, RED); }
  if (has(line, 'Lesson')) lesson(U, t, 2, 'YOU COPY WHAT YOU SEE, NOT WHAT YOU UNDERSTAND');
  frame(U, B, cam, [hero, dad], fx, { fxIn: true }); chrome(U, t, info, D(1, '7:10 AM', ST(true, 'COPIES · 1/5')));
};
// 12:30 p.m.: the busker's song, note for note; the shaking fingers
S.busker = (U, t, info, tt, k, n, line) => {
  const B = J.street(tt); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 540 };
  const BOR = since('busker', 'borrow the guitar'), CROWDK = since('busker', 'small crowd'), SHAKE = since('busker', 'fingers start');
  const play = k >= BOR, sh = k >= SHAKE ? Math.sin(tt * 40) * 4 : 0;
  const busk = Q(1300, FL, play ? { ...P_STAND, aL: [30, 140] } : PLAY, BUSK, k >= since('busker', 'stares') ? 'worried' : 'smile', { flip: true, look: -0.8 });
  const hero = P(play ? 760 : 620, FL, play ? PLAY : P_THINK, play ? (k >= SHAKE ? 'worried' : 'open') : 'neutral', { look: 0.9 });
  const ppl = [hero, busk];
  if (k >= CROWDK) CROWD.slice(0, 3).forEach((c, i) => ppl.push(Q(1600 + i * 150, FL + 10, i === 1 ? P_PHONE : P_STAND, c, 'open', { flip: true, h: 320 })));
  let fx = Y.guitar(play ? 800 + sh : 1260, FL - 110, 0.62, play ? -60 : 60) + (play ? [...Array(4)].map((_, i) => { const q = (tt * 0.8 + i / 4) % 1; return `<text x="${f(880 + q * 220)}" y="${f(FL - 380 - q * 200)}" font-family="Inter" font-size="54" fill="#1c1e26" opacity="${f(1 - q)}">♪</text>`; }).join('') : '');
  if (has(line, 'busker with a guitar')) L1(U, t, 'A BUSKER · ONE SONG', 0.3);
  if (has(line, 'watch his hands')) { cam = { z: 1.8, cx: 1260, cy: 600 }; L1(U, t, 'WATCHING · HIS HANDS', 0.3); }
  if (has(line, 'note for note')) { cam = { z: 1.5, cx: 860, cy: 560 }; L1(U, t, 'NOTE FOR NOTE · COPIED', 0.2, '#4fd06a'); }
  if (has(line, 'stolen', 'entirely wrong')) { cam = { z: 1.6, cx: 1250, cy: 520 }; L1(U, t, 'HIS SONG · YOUR HANDS', 0.3, RED); }
  if (has(line, 'fingers start', 'body notices')) { cam = { z: 2.0, cx: 800, cy: 600 }; L1(U, t, 'FINGERS · SHAKING', 0.3, RED); }
  if (has(line, 'Lesson', 'built for it')) lesson(U, t, 3, "COPYING ISN'T BEING BUILT FOR IT");
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(1, '12:30 PM', ST(true, 'COPIES · 2/5')));
};
// 6 p.m.: the climbing wall; the slip; she catches you by the hood
S.climb = (U, t, info, tt, k, n, line) => {
  const B = Y.climbWall(tt); const FL = B.FLOOR; let cam = { z: 1.0, cx: 960, cy: 480 };
  const COPY = since('climb', 'copy every move'), SLIP = since('climb', 'not his arms', 'You slip'), GRAB = since('climb', 'grabs you'), DOWN = since('climb', 'sets you down', 'It looks at you');
  const climber = Q(1400, 420 + Math.sin(tt) * 10, ARM_UP, CLIMB, 'neutral', { look: -0.5, h: 320 });
  let hx = 900, hy = FL, pose = P_STAND, face = 'neutral';
  if (k >= COPY && k < SLIP) { hx = 980; hy = FL - 60 - clamp((k - COPY + t / info.dur) / 2) * 340; pose = ARM_UP; }
  if (k >= SLIP && k < GRAB) { hx = 980; hy = 480 + (has(line, 'You slip') ? clamp((t - info.dur * 0.5) / 0.6) * 160 : 0); pose = has(line, 'You slip') && t > info.dur * 0.5 ? FALL : REACH; face = 'worried'; }
  if (k >= GRAB && k < DOWN) { hx = 1120; hy = 520 + clamp(t / info.dur) * (has(line, 'sets you down') ? FL - 520 : 0); pose = FALL; face = 'worried'; }
  if (k >= DOWN) { hx = 900; hy = FL; pose = P_STAND; face = 'worried'; }
  const ppl = [P(hx, hy, pose, face, { look: k >= DOWN ? 0.9 : 0.6, shadow: hy >= FL - 5 })];
  if (k < GRAB) ppl.push(climber);
  if (k >= GRAB) B.mid = Y.rika(1240, FL + 40, 980, tt, { mood: k >= DOWN ? 'look' : 'reach', op: has(line, 'grabs you') ? clamp(t / 0.4) : 1, flip: true }) + B.mid;
  if (has(line, 'watch a climber')) { cam = { z: 1.3, cx: 1300, cy: 460 }; L1(U, t, 'WATCHING · A CLIMBER', 0.3); }
  if (has(line, 'copy every move')) L1(U, t, 'EVERY MOVE · COPIED', 0.3, '#4fd06a');
  if (has(line, 'his reach')) { cam = { z: 1.6, cx: 980, cy: 380 }; L1(U, t, 'HIS REACH · NOT HIS ARMS', 0.3, RED); }
  if (has(line, 'grabs you')) { cam = { z: 1.0, cx: 1100, cy: 420 }; L1(U, t, 'CAUGHT · BY THE HOOD', 0.2, LILAC); }
  if (has(line, 'It looks at you', "doesn't")) { cam = { z: 1.5, cx: 1150, cy: 360 }; L1(U, t, 'SHE · DOES NOT · LOOK PLEASED', 0.3, LILAC); }
  if (has(line, 'Lesson', 'catches you anyway')) lesson(U, t, 4, "NOT YOUR SERVANT. SHE CATCHES YOU ANYWAY");
  frame(U, B, cam, ppl, '', { fxIn: true }); chrome(U, t, info, D(1, '6:00 PM', ST(true, 'COPIES · 3/5')));
};
// day 3: the presentation; Cursed Speech (lore); the teacher's voice stops the room
S.voice = (U, t, info, tt, k, n, line) => {
  if (has(line, 'Cursed Speech', "Inumaki's family", 'passed down')) { lore(U, t, 'CURSED SPEECH', ['IN THE FILM, YUTA USES IT', "IT BELONGS TO TOGE INUMAKI'S FAMILY", 'NORMALLY PASSED DOWN ONLY INSIDE THAT CLAN'], `<g transform="translate(1560 560)">${[0, 1, 2, 3].map((i) => `<path d="M ${i * 70} -${120 + i * 40} Q ${60 + i * 80} 0 ${i * 70} ${120 + i * 40}" stroke="${LILAC}" stroke-width="14" fill="none" opacity="${f(0.9 - i * 0.18)}"/>`).join('')}</g>`); chrome(U, t, info, D(3, '10:00 AM', ST())); return; }
  if (has(line, "old teacher's voice", 'that made')) { const kk = clamp(t / 0.6); full(U, `<rect width="1920" height="1080" fill="#2a3a2a"/><rect x="300" y="200" width="1320" height="560" fill="#1f4a32" stroke="#8a5a3a" stroke-width="24"/><text x="380" y="330" font-family="IBM Plex Mono" font-weight="800" font-size="46" fill="#e8f0e0" opacity="0.8">SILENCE, PLEASE.</text>${[...Array(6)].map((_, i) => `<rect x="${400 + i * 200}" y="900" width="140" height="60" rx="10" fill="#8a5a3a"/>`).join('')}`); big(U, `<div style="${TXT(76)};opacity:${f(kk)}">COPIED: <span style="color:#ffd23f">YOUR OLD TEACHER'S VOICE</span></div>`, 200, 60); chrome(U, t, info, D(3, '10:00 AM', ST(true, 'COPIES · 4/5'))); return; }
  const B = Y.meeting(tt, { k: clamp(t / info.dur) }); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 540 };
  const STOP = since('voice', 'room stops', 'a whole classroom');
  B.mid += [1080, 1320, 1560, 1800].map((x) => B.chairs(x)).join('');
  const hero = P(760, FL, P_PRESENT, k >= STOP ? 'open' : 'worried', { look: 0.9 });
  const ppl = [hero]; [1080, 1320, 1560, 1800].forEach((x, i) => ppl.push(Q(x, FL, P_SIT, COLL[i % 3], k >= STOP ? 'worried' : 'neutral', { flip: true, look: -0.8, h: 320 })));
  let fx = k >= STOP ? [0, 1, 2].map((i) => { const q = (tt * 0.9 + i / 3) % 1; return `<path d="M ${f(860 + q * 300)} ${f(FL - 330 - q * 80)} Q ${f(900 + q * 340)} ${FL - 300} ${f(860 + q * 300)} ${f(FL - 270 + q * 80)}" stroke="${LILAC}" stroke-width="10" fill="none" opacity="${f(1 - q)}"/>`; }).join('') : '';
  if (has(line, 'presentation')) L1(U, t, 'DAY 3 · A PRESENTATION', 0.3);
  if (k >= STOP && !has(line, 'Lesson', 'colleague')) L1(U, t, 'THE ROOM · STOPS', 0.3, LILAC);
  if (has(line, 'colleague')) { cam = { z: 1.6, cx: 1100, cy: 560 }; L1(U, t, '"PLEASE DON\'T DO THAT AGAIN"', 0.3, RED); }
  if (has(line, 'Lesson', 'other people')) lesson(U, t, 5, 'YOU COPY WHAT A VOICE DOES TO PEOPLE');
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(3, '10:00 AM', ST(true, 'COPIES · 4/5')));
};
// day 6: the café; the habit you didn't choose; the 1961 doll study (our own drawing)
S.habit = (U, t, info, tt, k, n, line) => {
  if (has(line, 'nineteen sixty-one', 'Bandura', 'inflatable', 'without being told')) { const kk = clamp(t / 0.6);
    full(U, `<rect width="1920" height="1080" fill="#14182a"/>${Y.doll(1500, 900, 1.0, has(line, 'inflatable', 'without') ? Math.sin(tt * 3) * 14 : 0)}${has(line, 'without being told', 'doll later') ? personRef(1200, 900, 250, { ...P_STAND, aR: [90, 40] }, { top: '#ffd23f', bottom: '#22263a', hair: 'short', face: 'open', look: 0.9 }).svg : personRef(1180, 900, 360, { ...P_STAND, aR: [90, 40] }, { top: '#5a6070', bottom: '#2a2d3a', hair: 'short', face: 'neutral', look: 0.9 }).svg}`);
    big(U, `<div style="opacity:${f(kk)};max-width:900px"><div style="font:800 34px 'IBM Plex Mono';color:#ffd23f;letter-spacing:.08em">REAL WORLD · 1961</div><div style="${TXT(84)};margin:16px 0">ALBERT BANDURA</div><div style="font:700 40px Inter;color:#dfe6f2">Children who watched an adult hit an inflatable doll later did the same, <span style="color:#ffd23f">without being told to.</span></div><div style="font:700 26px 'IBM Plex Mono';color:#8a93a8;margin-top:22px">THE BOBO DOLL EXPERIMENT · STANFORD</div></div>`, 160, 240);
    chrome(U, t, info, D(6, '4:00 PM', ST())); return; }
  if (has(line, 'how many strangers', 'stop at twenty')) { const kk = clamp(t / info.dur), cnt = has(line, 'twenty') ? Math.min(20, Math.round(8 + 12 * clamp(t / 1.0))) : Math.round(kk * 8);
    full(U, `<rect width="1920" height="1080" fill="#100c1e"/>${[...Array(cnt)].map((_, i) => `<g transform="translate(${360 + (i % 10) * 125} ${560 + Math.floor(i / 10) * 200})"><circle cy="-60" r="34" fill="${CROWD[i % 4].top}"/><rect x="-36" y="-24" width="72" height="90" rx="20" fill="${CROWD[i % 4].top}"/></g>`).join('')}`);
    big(U, `<div style="${TXT(80)}">STRANGERS COPIED THIS WEEK: <span style="color:#ffd23f">${cnt}</span></div>`, 200, 220); chrome(U, t, info, D(6, '4:10 PM', ST())); return; }
  const B = J.cafe(tt); const FL = B.FLOOR; let cam = { z: 1.15, cx: 960, cy: 560 };
  const hero = P(680, FL, has(line, 'decide', 'stuck') ? P_THINK : P_SIT, has(line, 'odd', 'bus') ? 'worried' : 'neutral', { look: 0.9 });
  const fr = Q(1240, FL, P_SIT, FRIEND, has(line, 'odd') ? 'open' : 'neutral', { flip: true, look: -0.9 });
  let fx = '';
  if (has(line, 'shouted at you on the bus')) fx += `<g transform="translate(980 ${FL - 520})"><rect x="-200" y="-90" width="400" height="140" rx="30" fill="#fff"/><path d="M -40 50 L -80 110 L 10 50 Z" fill="#fff"/><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="${RED}">"OI! MOVE!"</text></g>`;
  if (has(line, 'odd')) L1(U, t, '"YOU TALK LIKE SOMEONE ELSE"', 0.3);
  if (has(line, 'bus')) { cam = { z: 1.5, cx: 860, cy: 480 }; L1(U, t, 'COPIED · WITHOUT DECIDING', 0.3, RED); }
  if (has(line, 'Lesson', "don't choose")) lesson(U, t, 6, "YOU DON'T CHOOSE EVERYTHING YOU COPY");
  frame(U, B, cam, [hero, fr], fx, { fxIn: true }); chrome(U, t, info, D(6, '4:00 PM', ST()));
};
// day 10: the park video; juggling, handstand, cartwheel; "it's editing"
const phoneCard = (U, t, info, d, kind) => { const kk = clamp(t / 0.4);
  let g = `<rect width="1920" height="1080" fill="#ffc88a"/><rect x="560" y="60" width="800" height="960" rx="60" fill="#1c1e26"/><rect x="590" y="110" width="740" height="860" rx="20" fill="#f4f6f8"/>`;
  if (kind === 'clips') { const L = ['JUGGLING', 'HANDSTAND', 'CARTWHEEL']; L.forEach((l, i) => { const on = clamp((t - i * 0.4) / 0.3); g += `<g opacity="${f(on)}"><rect x="620" y="${150 + i * 270}" width="680" height="240" rx="14" fill="${['#8aa04a', '#d8c08a', '#a8d4ea'][i]}"/><text x="650" y="${380 - 30 + i * 270}" font-family="Inter" font-weight="900" font-size="40" fill="#1c1e26">${l}</text><circle cx="1180" cy="${270 + i * 270}" r="44" fill="#1c1e26" opacity="0.7"/><path d="M 1166 ${248 + i * 270} L 1200 ${270 + i * 270} L 1166 ${292 + i * 270} Z" fill="#fff"/></g>`; }); }
  else { const C = [["it's editing lol", '#2a2d3a'], ['he is hiding something', '#2a2d3a'], ['fake. 100% fake', '#2a2d3a'], ['how??', '#2a2d3a']]; C.forEach(([c, col], i) => { const on = clamp((t - i * 0.35) / 0.3); g += `<g opacity="${f(on)}"><circle cx="660" cy="${200 + i * 170}" r="34" fill="${CROWD[i].top}"/><rect x="710" y="${160 + i * 170}" width="580" height="90" rx="20" fill="#e4e8ee"/><text x="740" y="${218 + i * 170}" font-family="Inter" font-weight="800" font-size="38" fill="${col}">${c}</text></g>`; }); }
  full(U, g); chrome(U, t, info, d); };
S.park = (U, t, info, tt, k, n, line) => {
  if (has(line, 'first juggling', 'perfect cartwheel')) { phoneCard(U, t, info, D(10, '5:30 PM', ST()), 'clips'); CL1(U, t, 'POSTED · 3 SKILLS · 1 DAY', 0.3); return; }
  if (has(line, 'editing', 'hiding something')) { phoneCard(U, t, info, D(10, '9:00 PM', ST()), 'comments'); return; }
  const B = M.sunsetPark(tt); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 520 };
  const hero = P(1100, FL, has(line, 'films you') ? { ...P_STAND, aL: [150, 30], aR: [150, 30] } : P_STAND, 'neutral', { look: -0.6 });
  const boy = Q(600, FL, P_PHONE, BOY, 'open', { look: 0.9, h: 280 });
  let fx = has(line, 'films you') ? [0, 1, 2].map((i) => { const a = tt * 4 + i * 2.1; return `<circle cx="${f(1100 + Math.cos(a) * 70)}" cy="${f(FL - 470 - Math.abs(Math.sin(a)) * 120)}" r="18" fill="${['#e8452e', '#2f86e0', '#ffd23f'][i]}"/>`; }).join('') : '';
  const rk = has(line, 'Rika', 'who that is', 'joke', 'understand', 'believe');
  if (rk) B.mid = Y.rika(1450, FL + 40, 900, tt, { mood: 'calm', op: 0.55 }) + (B.mid || '');
  if (has(line, 'films you')) L1(U, t, 'BEING FILMED', 0.3, RED);
  if (has(line, 'Rika')) { cam = { z: 1.2, cx: 1250, cy: 440 }; L1(U, t, 'NOBODY · SAYS · "RIKA"', 0.3, LILAC); }
  if (has(line, 'joke')) L1(U, t, 'THOSE WHO KNOW · THINK IT\'S A JOKE', 0.3, LILAC);
  if (has(line, 'Lesson', 'understand', 'believe')) lesson(U, t, 7, "THE ONES WHO'D UNDERSTAND WOULD NEVER BELIEVE IT");
  frame(U, B, cam, [hero, boy], fx, { fxIn: true }); chrome(U, t, info, D(10, '5:30 PM', ST()));
};
// day 12: the dance studio, then the stage on Friday; she covers her face in the wings
S.dance = (U, t, info, tt, k, n, line) => {
  const STAGE = since('dance', 'lights come on'), IN = since('dance', 'walk in');
  if (k >= STAGE) { const B = Y.studio(tt, { stage: true }); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 520 };
    const wings = k >= since('dance', 'in the wings', 'covering her face');
    if (wings) B.mid = Y.rika(1680, FL + 40, 900, tt, { mood: 'cover', op: 0.95, flip: true }) + B.mid;
    const hero = P(960, FL, P_STAND, 'worried', { look: 0.5 });
    if (has(line, 'freeze')) L1(U, t, 'FRIDAY · LIGHTS ON · FROZEN', 0.3, RED);
    if (has(line, 'feet know')) { cam = { z: 1.9, cx: 960, cy: 800 }; L1(U, t, 'FEET · KNOW EVERY STEP', 0.3, '#4fd06a'); }
    if (has(line, 'stomach')) { cam = { z: 2.1, cx: 960, cy: 620 }; L1(U, t, "STOMACH · DOESN'T", 0.3, RED); }
    if (wings && !has(line, 'Lesson', 'nerves')) { cam = { z: 1.1, cx: 1350, cy: 460 }; L1(U, t, 'IN THE WINGS · COVERING HER FACE', 0.3, LILAC); }
    if (has(line, 'Lesson', 'nerves')) lesson(U, t, 8, 'YOU CAN COPY THE STEPS, NOT THE NERVES');
    frame(U, B, cam, [hero], '', { fxIn: true }); chrome(U, t, info, D(16, '8:00 PM', ST(true, 'COPIES · 5/5'))); return; }
  const B = Y.studio(tt); const FL = B.FLOOR; let cam = { z: 1.05, cx: 960, cy: 540 };
  const ppl = [];
  if (k < IN) { ppl.push(Q(1100, FL, DANCE(tt), DANCER, 'smile', { flip: Math.floor(tt) % 2 === 0, look: 0.5 })); ppl.push(P(300, FL, P_THINK, 'neutral', { look: 0.9 })); }
  else { ppl.push(P(900, FL, DANCE(tt, 1), 'open', { flip: Math.floor(tt * 0.8) % 2 === 0 })); ppl.push(Q(1400, FL, has(line, 'claps', 'Friday') ? { ...P_STAND, aL: [80, 120], aR: [80, 120] } : P_STAND, TEACH, 'smile', { flip: true, look: -0.8 })); ppl.push(Q(1640, FL, P_STAND, DANCER, 'open', { flip: true, look: -0.8 })); }
  if (has(line, 'through the window')) { cam = { z: 1.3, cx: 600, cy: 520 }; L1(U, t, 'THROUGH THE WINDOW · 20 MIN', 0.3); }
  if (has(line, 'whole routine', 'every turn')) L1(U, t, 'THE WHOLE ROUTINE · COPIED', 0.3, '#4fd06a');
  if (has(line, 'practised')) L1(U, t, 'LOOKS LIKE · YEARS OF PRACTICE', 0.3, '#4fd06a');
  if (has(line, 'Friday') && !has(line, 'lights')) L1(U, t, 'THE SHOW · FRIDAY', 0.3, COL.yellow);
  frame(U, B, cam, ppl, '', { fxIn: true }); chrome(U, t, info, D(12, '5:00 PM', ST(true, 'COPIES · 5/5')));
};
// day 15: the old chess player in the park; "you have my hands, you don't have my reasons"
S.chess = (U, t, info, tt, k, n, line) => {
  if (has(line, 'my hands', 'my reasons')) { const kk = clamp(t / 0.5); full(U, `<rect width="1920" height="1080" fill="#14182a"/>${[...Array(8)].map((_, i) => [...Array(8)].map((__, j) => `<rect x="${1320 + i * 60}" y="${300 + j * 60}" width="60" height="60" fill="${(i + j) % 2 ? '#2a2d3a' : '#f4f1ea'}" opacity="0.5"/>`).join('')).join('')}`);
    big(U, `<div style="${TXT(92)};opacity:${f(kk)};max-width:1000px">"You have <span style="color:#4fd06a">my hands</span>.${has(line, 'reasons') ? `<br>You don't have <span style="color:${RED}">my reasons</span>."` : ''}</div>`, 160, 330); chrome(U, t, info, D(15, '3:00 PM', ST())); return; }
  const B = Y.chessPark(tt); const FL = B.FLOOR; let cam = { z: 1.2, cx: 960, cy: 560 };
  const lost = has(line, 'eleven turns', 'never seen');
  const hero = P(640, FL, P_SIT, lost ? 'worried' : 'neutral', { look: 0.9 });
  const old = Q(1280, FL, P_SIT, OLD, has(line, 'smiles') ? 'smile' : 'neutral', { flip: true, look: -0.9 });
  if (has(line, 'opening', 'move for move')) L1(U, t, 'HIS OPENING · COPIED', 0.3, '#4fd06a');
  if (has(line, 'never seen')) { cam = { z: 1.8, cx: 960, cy: 600 }; L1(U, t, 'A MOVE · YOU\'VE NEVER SEEN', 0.3, RED); }
  if (has(line, 'eleven turns')) L1(U, t, 'LOST · IN 11 TURNS', 0.3, RED);
  if (has(line, 'Lesson', 'the why')) lesson(U, t, 9, 'COPY SHOWS THE MOVE, NEVER THE WHY');
  frame(U, B, cam, [hero, old], '', { fxIn: true }); chrome(U, t, info, D(15, '3:00 PM', ST(true, 'COPIES · 5/5')));
};
// day 17: five at a time; the sixth pushes the oldest out; the list of five on the wardrobe; "just in case"
S.limit = (U, t, info, tt, k, n, line) => {
  if (has(line, 'sheet of paper', 'stick it on the wardrobe', 'shopping list')) { const kk = clamp(t / 0.6);
    full(U, `<rect width="1920" height="1080" fill="#c9a06a"/><rect x="0" y="0" width="1920" height="1080" fill="#000" opacity="0.08"/><circle cx="1700" cy="560" r="20" fill="#ffd23f"/>${Y.sheet(960, 560, 1.9, has(line, 'sheet of paper') ? clamp(t / 1.6) : 1, -3)}`);
    CL1(U, t, has(line, 'shopping') ? 'A VERY STRANGE SHOPPING LIST' : 'THE LIST OF FIVE · ON THE WARDROBE', 0.3); chrome(U, t, info, D(17, '9:00 PM', ST(true, 'COPIES · 5/5'))); return; }
  const B = N.flat(tt); const FL = B.FLOOR; let cam = { z: 1.15, cx: 900, cy: 520 };
  const hero = P(760, FL, has(line, 'five of them', 'sixth') ? { ...P_STAND, aR: [70, 60] } : P_THINK, has(line, 'sixth') ? 'worried' : 'neutral', { look: 0.9 });
  const ppl = [hero]; let fx = '';
  if (has(line, 'stays in your hands', 'not all at once', 'five of them', 'sixth', 'notice')) fx += Y.fan(860, FL - 230, 0.8, has(line, 'five of them') ? clamp(t / 0.7) : 1, tt);
  if (has(line, 'sixth')) { const q = clamp(t / info.dur); fx = Y.fan(860, FL - 230, 0.8, 1, tt).replace(/<g opacity="1.0" transform="translate\(([-\d.]+) ([-\d.]+)\) rotate\(-28.0\)/, (m) => m.replace('opacity="1.0"', `opacity="${f(1 - q)}"`)) + `<g transform="translate(${f(1300 - q * 300)} ${f(FL - 420)}) rotate(${f(10 - q * 10)})"><rect x="-74" y="-104" width="148" height="208" rx="16" fill="#8a93a8" stroke="#fff" stroke-width="7"/><text x="0" y="10" text-anchor="middle" font-family="Inter" font-weight="900" font-size="56" fill="#fff">6</text></g>`; L1(U, t, 'THE SIXTH · PUSHES THE OLDEST OUT', 0.3, RED); }
  if (has(line, 'five of them')) L1(U, t, 'MAX · 5 AT A TIME', 0.3, COL.yellow);
  if (has(line, 'mum asks', 'driver, strongman', 'Just in case')) { ppl.push(Q(1300, FL, has(line, 'mum asks') ? { ...P_STAND, aR: [60, 100] } : P_STAND, MUM, 'open', { flip: true, look: -0.8 })); fx += Y.sheet(1660, FL - 470, 0.55, 1, -3); cam = { z: 1.15, cx: 1150, cy: 520 }; }
  if (has(line, 'Just in case')) L1(U, t, '"JUST IN CASE."', 0.2, LILAC);
  if (has(line, 'Lesson', 'choose carefully')) lesson(U, t, 10, "CHOOSE WHAT YOU KEEP. YOU CAN'T KEEP EVERYTHING");
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(17, '9:00 PM', ST(true, 'COPIES · 5/5')));
};
// day 20: the ring comes off in the corridor at night; the lights die; she unfolds; the ring goes back on
S.ringoff = (U, t, info, tt, k, n, line) => {
  if (has(line, 'take the ring off')) { ringClose(U, t, info, D(20, '11:30 PM', ST(true, 'RING · OFF')), { off: true, glow: 0.4, text: 'RING · <span style="color:#e8452e">OFF</span>' }); return; }
  if (has(line, 'calls Rika out', 'vast', 'In the story')) { lore(U, t, 'THE RING', ['YUTA CALLS RIKA OUT USING THAT RING', 'HER CURSED ENERGY IS VAST'], Y.ring(1560, 560, 3.2, 0.9), GOLD); chrome(U, t, info, D(20, '11:30 PM', ST(true, 'RING · OFF'))); return; }
  if (has(line, 'ring back on')) { ringClose(U, t, info, D(20, '11:31 PM', ST(true, 'RING · ON')), { glow: 0.9, text: 'RING · <span style="color:#4fd06a">BACK ON</span>' }); return; }
  const B = M.hallway(tt); const FL = B.FLOOR; let cam = { z: 1.05, cx: 960, cy: 520 };
  const OUT = since('ringoff', 'lights go out'), UNF = since('ringoff', 'unfolds'), FOLD = since('ringoff', 'folds away');
  const dark = k >= OUT && k < FOLD ? 0.7 : k >= FOLD ? 0.7 * (1 - clamp((k - FOLD + t / info.dur) / 2)) : 0;
  if (k >= UNF) { const fold = k >= FOLD ? 1 - 0.75 * clamp((k - FOLD + t / info.dur) / 2) : 1; B.mid = Y.rika(1200, FL + 60, (has(line, 'unfolds') ? 700 + 700 * clamp(t / info.dur) : 1400) * fold, tt, { mood: 'tall', op: 0.95 * Math.max(0.3, fold) }) + B.mid; }
  const hero = P(600, FL, has(line, 'cold') ? { ...P_STAND, aL: [30, 150], aR: [30, 150] } : P_STAND, 'worried', { look: k >= UNF ? 0.9 : 0.5 });
  let fx = dark > 0 ? `<rect x="-2000" y="-2000" width="6000" height="6000" fill="#05040c" opacity="${f(dark * 0.75)}"/>` : '';
  if (has(line, 'cold')) fx += [...Array(14)].map((_, i) => `<circle cx="${f(200 + rnd(i) * 1500)}" cy="${f(((rnd(i * 3) * 900 + tt * 60) % 900))}" r="4" fill="#dfefff" opacity="0.7"/>`).join('');
  if (has(line, 'lights go out')) L1(U, t, 'LIGHTS · OUT', 0.3, RED);
  if (has(line, 'cold')) L1(U, t, 'VERY · COLD', 0.3, '#bfe4ff');
  if (has(line, 'unfolds', 'ceiling', 'hum')) { cam = { z: 0.9, cx: 1000, cy: 380 }; L1(U, t, 'TALLER THAN THE CEILING', 0.3, LILAC); }
  if (has(line, 'never moved')) L1(U, t, 'SHE NEVER MOVED', 0.3, LILAC);
  if (has(line, 'Lesson', 'leash', 'door', 'close it')) lesson(U, t, 11, "NOT A LEASH. A DOOR ONLY YOU CAN CLOSE");
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(20, '11:30 PM', ST(true, k >= FOLD ? 'RING · ON' : 'RING · OFF')));
};
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
// day 25: a man collapses on the pavement; the compressions you watched once; the paramedics
S.cpr = (U, t, info, tt, k, n, line) => {
  if (has(line, 'training video', 'paramedic do chest')) { const kk = clamp(t / 0.4), b = Math.abs(Math.sin(tt * 6)) * 14;
    full(U, `<rect width="1920" height="1080" fill="#14182a"/><rect x="460" y="160" width="1000" height="620" rx="24" fill="#1c1e26"/><rect x="490" y="190" width="940" height="560" fill="#e4ecf2"/><rect x="560" y="${640}" width="500" height="50" rx="24" fill="#f0c8a0"/>${personRef(1080, 700, 300, { ...KNEEL, aL: [80, 0], aR: [80, 0] }, { top: '#2f9a5a', bottom: '#1f5a3a', hair: 'short', face: 'neutral', look: -0.9, flip: true }).svg.replace('<g', `<g transform="translate(0 ${f(b)})"`)}<rect x="490" y="190" width="940" height="60" fill="#2f9a5a"/><text x="520" y="232" font-family="IBM Plex Mono" font-weight="800" font-size="30" fill="#fff">TRAINING VIDEO · CHEST COMPRESSIONS</text>`);
    big(U, `<div style="${TXT(64)};opacity:${f(kk)}">WATCHED ONCE. <span style="color:#ffd23f">NEVER DONE.</span></div>`, 460, 830); chrome(U, t, info, D(25, '5:40 PM', ST())); return; }
  const B = Y.pavement(tt); const FL = B.FLOOR; let cam = { z: 1.1, cx: 960, cy: 540 };
  const DOWN = since('cpr', 'collapses'), KN = since('cpr', 'kneel down'), MED = since('cpr', 'real paramedics', 'take over');
  const lying = (x) => `<ellipse cx="${x}" cy="${FL + 50}" rx="190" ry="14" fill="#000" opacity="0.2"/><rect x="${x - 160}" y="${FL + 6}" width="190" height="44" rx="20" fill="#5a6070"/><rect x="${x + 20}" y="${FL + 14}" width="150" height="28" rx="12" fill="#2a2d3a"/><circle cx="${x - 200}" cy="${FL + 24}" r="38" fill="#15181e"/>`;
  const ppl = []; let fx = '';
  if (k < DOWN || (has(line, 'collapses') && t < info.dur * 0.4)) ppl.push(Q(1100, FL, walk(tt), MAN, 'neutral', { look: -0.6, flip: true }));
  else fx += lying(1100);
  const comp = k >= KN && k < MED, b = comp ? Math.abs(Math.sin(tt * 6)) * 18 : 0;
  ppl.unshift(P(comp || k >= MED ? 930 : 520, FL + b, comp ? KNEEL : k >= MED ? P_TIRED : P_STAND, 'worried', { look: 0.9 }));
  if (k >= DOWN && k < MED) CROWD.slice(0, 3).forEach((c, i) => ppl.push(Q(1500 + i * 150 + (has(line, 'step back') ? clamp(t / 1) * 80 : 80), FL, i === 1 && k >= since('cpr', 'shouting') ? P_PHONE : P_STAND, c, 'worried', { flip: true, h: 320 })));
  if (k >= MED) { ppl.push(Q(1300, FL, KNEEL, MEDIC, 'neutral', { flip: true, look: -0.8 })); ppl.push(Q(1550, FL, has(line, 'ask where') ? { ...P_STAND, aR: [60, 100] } : P_STAND, MEDIC, 'open', { flip: true, look: -0.8 })); }
  if (has(line, 'collapses')) L1(U, t, 'A MAN · COLLAPSES', 0.3, RED);
  if (has(line, 'step back')) L1(U, t, 'EVERYONE · STEPS BACK', 0.3);
  if (has(line, 'ambulance')) L1(U, t, '"CALL AN AMBULANCE!"', 0.2, RED);
  if (has(line, 'kneel down')) { cam = { z: 1.5, cx: 1000, cy: 640 }; L1(U, t, 'YOU · KNEEL', 0.3); }
  if (has(line, 'Your hands do it', 'in rhythm')) { cam = { z: 1.6, cx: 1000, cy: 660 }; L1(U, t, 'STEADY · STRONG · IN RHYTHM', 0.2, '#4fd06a'); }
  if (has(line, "don't know why")) L1(U, t, "NO IDEA WHY · IT WORKS", 0.3);
  if (has(line, 'real paramedics')) L1(U, t, 'UNTIL · THE PARAMEDICS ARRIVE', 0.3, '#4fd06a');
  if (has(line, 'ask where')) L1(U, t, '"WHERE DID YOU TRAIN?"', 0.3, '#4fd06a');
  if (has(line, 'Lesson', 'understand the move', 'buy someone time')) lesson(U, t, 12, 'SOMETIMES YOU ONLY NEED TO BUY SOMEONE TIME');
  frame(U, B, cam, ppl, fx, { fxIn: true }); chrome(U, t, info, D(25, '5:40 PM', ST()));
};
// day 30: a hundred skills, none you can explain; the old guitar
S.cost = (U, t, info, tt, k, n, line) => {
  if (has(line, 'hundred skills')) { bigNum(U, t, '100', 'SKILLS', 'COPIED · AND NOT ONE YOU CAN EXPLAIN', 'DAY 30', LILAC); chrome(U, t, info, D(30, '7:00 PM', ST(true, 'COPIES · 5/5'))); return; }
  const B = J.balcony(tt); const FL = B.FLOOR; let cam = { z: 1.15, cx: 900, cy: 560 };
  const GT = since('cost', 'old guitar');
  const hero = P(760, FL, k >= GT ? { ...P_SIT, aL: [60, 120], aR: [40, 70], head: 14 } : P_SIT, 'worried', { look: 0.9 });
  let fx = k >= GT ? Y.guitar(830, FL - 60, 0.6, -64) : [...Array(12)].map((_, i) => Y.card(400 + (i % 6) * 220 + Math.sin(tt + i) * 20, 280 + Math.floor(i / 6) * 260 + Math.cos(tt * 0.8 + i) * 20, i % 5, (i * 37) % 60 - 30, 0.55, 0.5, { label: false })).join('');
  if (has(line, 'tired')) L1(U, t, 'TIRED · SLEEP DOESN\'T FIX IT', 0.3);
  if (has(line, 'used to love')) L1(U, t, 'FORGOTTEN · WHAT YOU LOVED', 0.3, RED);
  if (has(line, 'old guitar')) { cam = { z: 1.5, cx: 820, cy: 640 }; L1(U, t, 'YOUR OLD GUITAR', 0.3); }
  if (has(line, "can't play")) { cam = { z: 1.8, cx: 820, cy: 660 }; L1(U, t, "YOUR SONGS · GONE", 0.3, RED); }
  if (has(line, "busker's song")) L1(U, t, "ONLY · THE BUSKER'S SONG", 0.3, COL.yellow);
  if (has(line, 'Lesson', 'borrow')) lesson(U, t, 13, "YOU CAN'T BORROW A SELF");
  frame(U, B, cam, [hero], fx, { fxIn: true }); chrome(U, t, info, D(30, '7:00 PM', ST(true, 'COPIES · 5/5')));
};
// day 40: the flooded underpass; swap the cards; five skills; the ring; she rises and the water goes still; fourteen out
const SK = [['swimmer', 1], ['climber', 0], ['driver', 3], ['locksmith', 2], ['strongman', 4]];
S.tunnel = (U, t, info, tt, k, n, line) => {
  if (has(line, 'swap them', 'old chess player goes', 'dancer goes')) { const q = clamp(t / info.dur);
    const grey = (x, y, txt, r, o) => `<g opacity="${f(o)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(r)})"><rect x="-74" y="-104" width="148" height="208" rx="16" fill="#5a6070" stroke="#fff" stroke-width="7"/><text x="0" y="10" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="#fff">${txt}</text></g>`;
    full(U, `<rect width="1920" height="1080" fill="#100c1e"/>${['CHESS', 'DANCER', 'BUSKER'].map((s, i) => grey(1300 + i * 180, 420 + q * 500 * (i + 1) * 0.5, s, 10 + i * 20 + q * 60, 1 - q * 0.8)).join('')}${Y.fan(700, 760, 1.2, 1, tt)}`);
    CL1(U, t, 'SWAP · KEEP THE FIVE THAT FIT', 0.2, COL.yellow); chrome(U, t, info, D(40, '6:40 PM', ST(true, 'COPIES · 5/5'))); return; }
  if (has(line, 'put the ring on', 'time to say')) { ringClose(U, t, info, D(40, '6:44 PM', ST(true, 'RING · ON')), { glow: 1, text: has(line, 'time') ? 'NO TIME · TO SAY ANYTHING' : 'RING · ON', bg: '#0a1020' }); return; }
  const B = Y.tunnel(tt, { water: has(line, 'pavement', 'shaking', 'Nobody asks') ? 960 : 700, faces: k < since('tunnel', 'one by one'), calm: k >= since('tunnel', 'water goes very still') ? 1 : 0, busX: 1250 });
  const FL = B.FLOOR, W = B.W, ROOF = FL - 350; let cam = { z: 1.0, cx: 960, cy: 540 };
  const RISE = since('tunnel', 'rises behind you');
  let hero = P(300, W + 10, P_STAND, 'worried', { look: 0.9 }), fx = '', ppl = [];
  const sk = SK.find(([s]) => has(line, s + "'s"));
  if (sk) { const [s, i] = sk;
    if (s === 'swimmer') hero = P(500 + clamp(t / info.dur) * 300, W - 20, P_SWIM, 'worried', { look: 0.9 });
    if (s === 'climber') hero = P(880, ROOF + 200 - clamp(t / info.dur) * 200, ARM_UP, 'worried', { look: 0.9 });
    if (s === 'driver') hero = P(1580, ROOF, HAND_DOWN, 'neutral', { look: -0.6, flip: true });
    if (s === 'locksmith') { hero = P(1050, ROOF, { ...KNEEL }, 'neutral', { look: 0.6 }); cam = { z: 1.5, cx: 1050, cy: 440 }; }
    if (s === 'strongman') hero = P(1150, ROOF, { ...P_STAND, aL: [170, 0], aR: [170, 0] }, 'worried', { look: 0.6 });
    U.svg('cardo', Y.card(220, 420, i, -8, 1.3, clamp(t / 0.3)), {}, { z: 45 }); L1(U, t, `${Y.CARDS[i].name} · ${['TO GET ACROSS', 'TO REACH THE ROOF', 'TO OPEN THE DOOR', 'THE JAMMED WINDOW', 'TO HOLD IT'][SK.findIndex((x) => x[0] === s)]}`, 0.2, Y.CARDS[i].col); }
  if (k >= RISE && !has(line, 'pavement', 'shaking', 'Nobody asks')) B.mid = Y.rika(820, FL + 60, has(line, 'rises') ? 600 + 600 * clamp(t / info.dur) : 1200, tt, { mood: has(line, 'looks at the bus') ? 'look' : 'tall', op: 0.9 }) + B.mid;
  if (has(line, 'one by one')) { ppl = [...Array(5)].map((_, i) => Q(1000 + i * 110, ROOF, P_STAND, CROWD[i % 4], 'worried', { h: 260, flip: i % 2 === 0 })); hero = P(700, W + 10, ARM_UP, 'worried', { look: 0.9 }); }
  if (has(line, 'pavement', 'shaking', 'Nobody asks')) { B.mid = ''; ppl = [...Array(14)].map((_, i) => Q(200 + i * 115, FL - (i % 2) * 14, P_SHIVER(), [...CROWD, MAN, OLD, BOY, FRIEND][i % 8], 'worried', { h: 250 + (i % 3) * 30, flip: i % 3 === 0 })); hero = P(1820, FL, P_TIRED, 'neutral', { look: -0.8, flip: true }); cam = { z: 1.0, cx: 1000, cy: 560 }; }
  if (has(line, 'rain is', 'underpass')) L1(U, t, 'DAY 40 · RAIN', 0.3, '#8ac8f0');
  if (has(line, 'stopped bus')) L1(U, t, 'A BUS · STOPPED IN THE WATER', 0.3, RED);
  if (has(line, 'fourteen people inside')) { cam = { z: 1.5, cx: 1250, cy: 640 }; L1(U, t, '14 PEOPLE · INSIDE', 0.3, RED); }
  if (has(line, 'only one')) L1(U, t, 'ONLY YOU', 0.3, COL.yellow);
  if (has(line, 'hundred skills', 'only five')) { fx += Y.fan(360, W - 260, 0.8, 1, tt); L1(U, t, has(line, 'only five') ? 'ONLY FIVE FIT' : '100 SKILLS', 0.3, COL.yellow); }
  if (has(line, 'rises')) { cam = { z: 0.95, cx: 900, cy: 420 }; L1(U, t, 'SOMETHING HUGE · RISES', 0.3, LILAC); }
  if (has(line, 'very still')) L1(U, t, 'THE WATER · GOES STILL', 0.3, '#8ac8f0');
  if (has(line, 'looks at the bus')) L1(U, t, 'NOT AT THE RING · AT THE BUS', 0.3, LILAC);
  if (has(line, 'one by one')) L1(U, t, 'ONE · BY · ONE', 0.3, '#4fd06a');
  if (has(line, 'Fourteen people on')) L1(U, t, '14 / 14 · OUT', 0.3, '#4fd06a');
  if (has(line, 'Nobody asks')) L1(U, t, 'NOBODY ASKS WHAT YOU ARE', 0.3, LILAC);
  frame(U, B, cam, [hero, ...ppl], fx, { fxIn: true }); chrome(U, t, info, D(40, '6:40 PM', ST(true, 'COPIES · 5/5')));
};
const P_SHIVER = () => ({ lean: 6, aL: [30, 150], aR: [30, 150], lL: [3, 4], lR: [3, 4], head: 10 });
// day 41: she sits at the foot of the bed; thank you; the ring feels warm
S.quiet = (U, t, info, tt, k, n, line) => {
  if (has(line, 'after the film', 'moves on, and Yuta')) { lore(U, t, 'AFTER THE FILM', ["RIKA'S SOUL MOVES ON", 'YUTA KEEPS USING HER POWER'], Y.ring(1560, 560, 3.2, 0.5)); chrome(U, t, info, D(41, '9:00 AM', ST(true, 'RIKA · STAYING'))); return; }
  if (has(line, 'ring feels warm')) { ringClose(U, t, info, D(41, '9:10 AM', ST(true, 'RIKA · STAYING')), { glow: 1, text: 'THE RING · <span style="color:#e0b44a">WARM</span>', bg: '#2a2030' }); return; }
  if (has(line, 'strongest thing', 'promise to keep going')) { const kk = clamp(t / 0.6); full(U, `<rect width="1920" height="1080" fill="#100c1e"/>${Y.rika(1500, 1140, 900, tt, { mood: 'sit', op: 0.8 })}`); big(U, `<div style="${TXT(88)};opacity:${f(kk)};max-width:1000px">NOT A SKILL.<br><span style="color:${GOLD}">A PROMISE TO KEEP GOING.</span></div>`, 160, 320); chrome(U, t, info, D(41, '9:15 AM', ST(true, 'RIKA · STAYING'))); return; }
  const B = SET.bedroom(tt); const FL = 820; let cam = { z: 1.1, cx: 760, cy: 500 };
  B.mid += Y.rika(380, FL + 40, 640, tt, { mood: 'sit', op: 0.92 });
  const hero = P(1000, FL, has(line, 'thank you') ? P_STAND : P_TIRED, has(line, 'thank you', 'stays') ? 'smile' : 'worried', { flip: true, look: -0.8 });
  if (has(line, "can't lift")) L1(U, t, "ARMS · WON'T LIFT", 0.3);
  if (has(line, 'foot of your bed')) L1(U, t, 'AT THE FOOT OF THE BED', 0.3, LILAC);
  if (has(line, 'She stays')) L1(U, t, 'SHE · STAYS', 0.3, LILAC);
  if (has(line, 'thank you')) L1(U, t, '"THANK YOU."', 0.3, LILAC);
  if (has(line, 'Lesson')) lesson(U, t, 14, 'THE STRONGEST THING YOU COPIED');
  frame(U, B, cam, [hero], '', { fxIn: true }); chrome(U, t, info, D(41, '9:00 AM', ST(true, 'RIKA · STAYING')));
};
// ending: 11:47 again, the ring, the questions
S.ending = (U, t, info, tt, k, n, line) => { if (k === 0 && t < info.dur * 0.55) { clock1147(U, t, info, 42); return; }
  const B = SET.bedroom(tt, { time: 'night' }); const FL = 820; B.back += M.moon(1560, 250, 46);
  B.mid = Y.rika(1150, FL + 40, 940, tt, { mood: 'calm', op: 0.55 }) + B.mid;
  const Qs = k >= since('ending', 'woke');
  const hero = P(760, FL, { ...P_STAND, aR: [70, 60] }, Qs ? 'smile' : 'neutral', { look: 0.9 });
  frame(U, B, { z: has(line, 'ring on your finger') ? 1.6 : 1.1, cx: 900, cy: 480 }, [hero], has(line, 'ring on your finger') ? Y.ring(870, FL - 300, 0.35, 0.9) : '', { fxIn: true });
  if (Qs) { U.svg('card', `<rect width="1920" height="1080" fill="#000" opacity="0.45"/>`, {}, { z: 3 }); const q = has(line, 'take off the ring', 'behind it', 'comments') ? 'Would you take off the ring?' : "What's the first thing you'd copy?";
    big(U, `<div style="${TXT(84)};text-shadow:0 8px 0 #000;max-width:1100px">${q}</div>`, 160, 320); }
  else if (has(line, 'next night')) L1(U, t, 'THE NEXT NIGHT · 11:47', 0.2, LILAC);
  else if (has(line, 'ring on your finger')) L1(U, t, 'THE RING', 0.2, GOLD);
  chrome(U, t, info, Qs ? { day: null, time: null, status: { text: 'YOUR TURN', on: true, color: COL.yellow } } : D(42, '11:47 PM', ST()));
};

const BG = { open: '#0a0a1c', ring: '#2a2650', omelette: '#f2d58a', busker: '#4a8ae0', climb: '#3a4a5e', voice: '#e4e0d8', habit: '#6a3a3a', park: '#ffc88a', dance: '#e8d8c8', chess: '#a8d4ea', limit: '#8a9ac8', ringoff: '#c8b89a', cpr: '#8ab8e0', cost: '#5a8ad8', tunnel: '#141a2a', quiet: '#7aa6c8', ending: '#2a2650' };
// shots that must show the action (never a text card or a close-up)
const WIDE = new Set(Object.entries(PLAN).filter(([, p]) => has(p.line, 'Yuta Okkotsu', 'from Jujutsu Kaisen', 'behind you', 'Pale', 'very close', 'mum walks', 'looks at the ring', 'Your hands do it', 'borrow the guitar', 'grabs you', 'sets you down', 'You slip', 'room stops', 'films you', 'whole routine', 'in the wings', 'lights come on', 'sit down across', 'sixth', 'unfolds', 'collapses', 'kneel down', 'floods', 'rises', 'one by one', 'Fourteen people on', "swimmer's", "climber's", "driver's", "locksmith's", "strongman's", 'foot of your bed', 'next night', 'looks at the bus')).map(([id]) => id));
const CUTS = {}; { const by = {}; for (const [id, p] of Object.entries(PLAN)) (by[p.sec] = by[p.sec] || []).push(id);
  for (const ids of Object.values(by)) ids.forEach((id, k) => { CUTS[id] = WIDE.has(id) || k === 0 ? 'wide' : ['close', 'wide', 'kin', 'wide', 'close', 'wide'][(k - 1) % 6]; }); }
const SHOT = (id, bg, body, sec, line) => registerShot(id, { bg, theme: 'dark', ui(U, t, info) { U.svg('fx', '', {}); U.svg('card', '', {}); U.html('big', '', {}); U.svg('punch', '', {}); U.svg('cardo', '', {}); FULLED = false; CUT = CUTS[id] === 'close' ? 'close' : 'wide'; body(U, t, info, info.start + t); CUT = 'wide'; if (CUTS[id] === 'kin' && !FULLED && sec !== 'ending' && !has(line, 'Lesson')) kin(U, t, line, sec); } });
for (const [id, p] of Object.entries(PLAN)) SHOT(id, BG[p.sec] || '#222', (U, t, info, tt) => S[p.sec](U, t, info, tt, p.k, p.n, p.line), p.sec, p.line);
