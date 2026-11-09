// FLAT 2D — the remaining shots in the series look: s008 (close-up of the hand, subway blurred behind), s009 (the
// heartbeat "BOOM" card) and the apartment hallway with the two people in suits (s112–s114).
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND } from '../lib/people.js';
import { hud, label, caption, COL } from '../lib/hud.js';
import { frame, glow } from '../lib/flat2d.js';
import { GRAIN } from '../lib/textures.js';
import * as L from '../lib/luffy.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie }, OL = '#b9dcff', INK = '#00000d';
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const H0 = { day: 1, time: '7:58 AM', status: { text: 'RUBBER · IDLE', on: false } };
const D27 = { day: 27, time: '9:10 PM', status: { text: 'RUBBER · IDLE', on: false } };
const grain = `<defs><pattern id="gx" width="256" height="256" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="256" height="256"/></pattern></defs><rect width="1920" height="1080" fill="url(#gx)" opacity="0.07" style="mix-blend-mode:overlay"/>`;

// ---- s008: the hand, big, in front of a blurred subway platform; one finger stretches a little and snaps back
function handScene(t, tt) {
  let bg = `<defs><filter id="hb"><feGaussianBlur stdDeviation="22"/></filter><linearGradient id="hw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a7c9c"/><stop offset="1" stop-color="#c993ac"/></linearGradient></defs><g filter="url(#hb)"><rect width="1920" height="1080" fill="url(#hw)"/><rect y="420" width="1920" height="40" fill="#e2453a"/><rect x="300" y="200" width="260" height="150" rx="10" fill="#2a6ff0"/><rect x="1300" y="200" width="260" height="150" rx="10" fill="#ff951a"/>${[200, 700, 1200, 1700].map((x) => `<rect x="${x}" y="60" width="220" height="16" fill="#fff6e2"/>`).join('')}<rect y="800" width="1920" height="280" fill="#55728a"/>${[1000, 1180, 1400, 1600].map((x, i) => `<circle cx="${x}" cy="${560 + (i % 2) * 20}" r="60" fill="#050507"/><rect x="${x - 50}" y="${620 + (i % 2) * 20}" width="100" height="200" fill="${['#e0723a', '#9a5cc0', '#2f9a8e', '#4a6fb5'][i]}"/>`).join('')}</g><rect width="1920" height="1080" fill="#0d1118" opacity="0.18"/>`;
  const k = t > 1.2 ? Math.max(0, Math.sin(clamp((t - 1.2) / 0.9) * Math.PI)) : 0, snap = t > 2.1 ? Math.exp(-(t - 2.1) * 7) * Math.sin((t - 2.1) * 40) : 0, br = Math.sin(tt * 1.6) * 6;
  let g = `<g transform="translate(900 ${f(700 + br)}) rotate(-6)">`;
  // sleeve + cuff
  g += `<path d="M -170 520 L -150 120 L 150 120 L 170 520 Z" fill="${HERO.top}" stroke="${OL}" stroke-width="8" stroke-linejoin="round"/><rect x="-158" y="104" width="316" height="54" rx="20" fill="${HERO.top}" stroke="${OL}" stroke-width="8"/><rect x="-158" y="104" width="316" height="16" rx="8" fill="#ffffff" opacity="0.18"/><path d="M -60 160 L -70 520 M 60 160 L 70 520" stroke="#ffffff" stroke-width="6" opacity="0.12"/>`;
  // palm + fingers (ink, outline drawn as an under-layer so the hand reads as one shape)
  const fingers = [[-105, 210, 0], [-38, 250, 1], [30, 240, 0], [92, 200, 0]];
  const fp = fingers.map(([x, h, s]) => { const len = h + (s ? k * 160 + snap * 30 : 0), w = 54 - (s ? k * 16 : 0); return [x, len, w]; });
  const shape = (pad) => `<ellipse cx="0" cy="10" rx="${150 + pad}" ry="${132 + pad}"/>` + fp.map(([x, len, w]) => `<rect x="${f(x - w / 2 - pad)}" y="${f(-len - pad)}" width="${f(w + pad * 2)}" height="${f(len + 40 + pad)}" rx="${f(w / 2 + pad)}"/>`).join('') + `<rect x="${118 - pad}" y="${-110 - pad}" width="${56 + pad * 2}" height="${170 + pad * 2}" rx="${28 + pad}" transform="rotate(34 146 -30)"/>`;
  g += `<g fill="${OL}">${shape(8)}</g><g fill="${INK}">${shape(0)}</g>`;
  g += fp.map(([x, len]) => `<path d="M ${x - 14} ${f(-len * 0.45)} q 14 8 28 0" stroke="#3a3a50" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('');
  g += `<ellipse cx="-70" cy="-30" rx="40" ry="16" fill="#ffffff" opacity="0.1"/>`;
  if (k > 0.05) for (let i = 0; i < 3; i++) g += `<path d="M ${-38 + 50 + i * 8} ${f(-250 - k * 160 + 40 + i * 30)} l 40 -14" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="${f(k * 0.8)}"/>`;
  g += `</g>`;
  return bg + g + `<rect width="1920" height="200" fill="url(#hudb)"/><defs><linearGradient id="hudb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14121c" stop-opacity="0.7"/><stop offset="1" stop-color="#14121c" stop-opacity="0"/></linearGradient></defs>` + grain;
}
registerShot('s008', { bg: '#4a7c9c', theme: 'dark', ui(U, t, info) { U.svg('hand', handScene(t, info.start + t), { z: 2 }); label(U, 'l1', 'HAND · NORMAL ?', 0.3, t, 1240, 280); chrome(U, t, info, H0); } });

// ---- s009: heartbeat card — a flat heart with outline and highlight, pulse rings, BOOM words punching in
registerShot('s009', { bg: '#0c0a18', theme: 'dark', ui(U, t, info) { const tt = info.start + t, beats = ['Boom', 'Boom.', 'Boom. Boom'].map((p, i) => info.w(p, 1.2 + i * 1.0));
  const last = beats.filter((b) => t > b).pop(), pk = last != null ? Math.exp(-(t - last) * 6) : 0, sc = 1.55 + 0.25 * pk;
  const heart = 'M 960 660 C 840 570 790 470 880 430 C 925 412 955 445 960 470 C 965 445 995 412 1040 430 C 1130 470 1080 570 960 660 Z';
  let g = `<defs>${glow('hg', '#ff3b3b', 0.55)}<radialGradient id="bgv" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="#2a1030"/><stop offset="1" stop-color="#0c0a18"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#bgv)"/><circle cx="960" cy="540" r="${f(420 + 120 * pk)}" fill="url(#hg)"/>` + L.drum(960, 540, tt, 70, 140, '#ff6a5a');
  g += `<g transform="translate(960 540) scale(${f(sc)}) translate(-960 -540)"><path d="${heart}" fill="${OL}" transform="translate(960 545) scale(1.06) translate(-960 -545)"/><path d="${heart}" fill="#e8302a"/><path d="M 900 452 C 880 462 868 490 880 520" stroke="#ffffff" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.45"/><path d="M 960 470 L 960 640" stroke="#b01e1a" stroke-width="5" opacity="0.4"/></g>`;
  U.svg('dk', g + grain, { z: 2 });
  let words = ''; beats.forEach((b, i) => { if (t > b) { const a = clamp((t - b) / 0.12), s = 1.6 - 0.6 * ease.out(a); words += `<div style="${TXT(130, i === 2 ? COL.yellow : '#fff')};position:absolute;left:${[260, 1300, 760][i]}px;top:${[220, 300, 780][i]}px;transform:rotate(${[-8, 7, -3][i]}deg) scale(${f(s)});opacity:${f(a)};text-shadow:0 8px 0 #000,0 0 30px rgba(255,59,59,.6)">BOOM</div>`; } });
  U.html('bm', `<div style="position:relative;width:1920px;height:1080px">${words}</div>`, { left: '0px', top: '0px' }); chrome(U, t, info, H0); } });

// ---- the apartment hallway at night: warm wall lamps, patterned wallpaper, the hero's door, a runner rug
const FLOOR = 860, DOOR = { x: 760, y: 200, w: 400, h: FLOOR - 200 };
function hallway(tt, o = {}) {
  let back = `<defs><linearGradient id="wp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a5a"/><stop offset="1" stop-color="#5a3a6a"/></linearGradient>${glow('wl', '#ffc27a', 0.6)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="url(#wp)"/>`;
  for (let x = -600; x < 2520; x += 90) for (let y = 0; y < FLOOR; y += 90) back += `<path d="M ${x + 45} ${y + 20} l 14 25 l -14 25 l -14 -25 Z" fill="#6a4a7a" opacity="0.55"/>`;
  back += `<rect x="-600" y="${FLOOR - 160}" width="3120" height="160" fill="#2a1e44"/><rect x="-600" y="${FLOOR - 166}" width="3120" height="10" fill="#7a5a8a"/>`;
  for (const x of [300, 1620]) back += `<ellipse cx="${x}" cy="300" rx="260" ry="260" fill="url(#wl)"/><path d="M ${x - 40} 280 L ${x + 40} 280 L ${x + 26} 330 L ${x - 26} 330 Z" fill="#ffd27a"/><rect x="${x - 6}" y="330" width="12" height="30" fill="#2a1e44"/>`;
  // door + frame + number; light spills out when open
  let mid = `<rect x="${DOOR.x - 26}" y="${DOOR.y - 26}" width="${DOOR.w + 52}" height="${DOOR.h + 26}" fill="#e8dcc8"/>`;
  if (o.open) mid += `<rect x="${DOOR.x}" y="${DOOR.y}" width="${DOOR.w}" height="${DOOR.h}" fill="#fff0c8"/><path d="M ${DOOR.x} ${DOOR.y} L ${DOOR.x + 150} ${DOOR.y + 50} L ${DOOR.x + 150} ${FLOOR - 40} L ${DOOR.x} ${FLOOR}" fill="#8a4a2e"/><path d="M ${DOOR.x + DOOR.w} ${FLOOR} L ${DOOR.x + DOOR.w + 420} ${FLOOR + 260} L ${DOOR.x - 220} ${FLOOR + 260} L ${DOOR.x} ${FLOOR} Z" fill="#fff0c8" opacity="0.25"/>`;
  else mid += `<rect x="${DOOR.x}" y="${DOOR.y}" width="${DOOR.w}" height="${DOOR.h}" fill="#a8583a"/><rect x="${DOOR.x + 50}" y="${DOOR.y + 60}" width="${DOOR.w - 100}" height="200" rx="8" fill="#94482e"/><rect x="${DOOR.x + 50}" y="${DOOR.y + 320}" width="${DOOR.w - 100}" height="260" rx="8" fill="#94482e"/><circle cx="${DOOR.x + DOOR.w - 50}" cy="${DOOR.y + 320}" r="15" fill="#ffd23f"/><rect x="${DOOR.x + DOOR.w / 2 - 40}" y="${DOOR.y + 20}" width="80" height="30" rx="4" fill="#ffd23f"/><text x="${DOOR.x + DOOR.w / 2}" y="${DOOR.y + 44}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="22" fill="#2a1e44">4B</text>`;
  if (o.knock) mid += `<g stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="${f(o.knock)}"><path d="M ${DOOR.x + 120} ${DOOR.y + 300} l -40 -20 M ${DOOR.x + 120} ${DOOR.y + 340} l -50 0 M ${DOOR.x + 120} ${DOOR.y + 380} l -40 20"/></g>`;
  let floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#4a3048"/><path d="M 600 ${FLOOR} L 1320 ${FLOOR} L 1700 1400 L 220 1400 Z" fill="#b0304a"/><path d="M 640 ${FLOOR + 20} L 1280 ${FLOOR + 20} L 1640 1400 L 280 1400 Z" fill="none" stroke="#ffd23f" stroke-width="5" opacity="0.6"/>`;
  return { back, mid, floor, FLOOR, bg: '#3a2a5a', blur: 2, reflOp: 0.08, tex: 0.22 };
}
const SUIT = { top: '#1c1e26', bottom: '#14161c', scarf: '#c8352e' };
const suits = (k = 1) => [
  { x: 520, y: FLOOR + 30, h: 380, pose: { ...P_STAND, aR: [40, 120] }, outfit: { ...SUIT, cap: undefined }, face: 'neutral', flip: false, look: 0.6, extra: (c) => `<rect x="${f(c.hands[1][0] - 10)}" y="${f(c.hands[1][1] - 60)}" width="70" height="90" rx="6" fill="#d9d2c0" stroke="${OL}" stroke-width="3"/>` },
  { x: 1400, y: FLOOR + 30, h: 390, pose: { ...P_STAND, aL: [8, 0], aR: [8, 0] }, outfit: SUIT, face: 'smile', flip: true, look: -0.6, extra: (c) => `<rect x="${f(c.head[0] - c.R * 1.1)}" y="${f(c.head[1] - c.R * 0.35)}" width="${f(c.R * 2.2)}" height="${f(c.R * 0.42)}" rx="${f(c.R * 0.2)}" fill="#0a0a0f" stroke="${OL}" stroke-width="2"/>` }];
const HALL = { z: 1.0, cx: 960, cy: 540 };
const shot = (id, body) => registerShot(id, { bg: '#3a2a5a', theme: 'dark', ui(U, t, info) { U.html('kn', '', {}); body(U, t, info, info.start + t); } });
shot('s112', (U, t, info, tt) => { const kn = t < 1.4 ? Math.max(0, Math.sin(t * 9.4)) : 0; frame(U, hallway(tt, { knock: kn }), HALL, suits()); if (kn > 0.3) U.html('kn', `<div style="${TXT(90, COL.yellow)};transform:rotate(-6deg);text-shadow:0 6px 0 #000">KNOCK KNOCK</div>`, { left: '760px', top: '140px' }); chrome(U, t, info, D27); });
shot('s113', (U, t, info, tt) => { frame(U, hallway(tt, { open: true }), { z: 1.15, cx: 960, cy: 560 }, [...suits(), { x: 960, y: FLOOR + 10, h: 360, pose: P_STAND, outfit: HERO, face: 'worried', flip: false, look: 0, shadow: false }]); label(U, 'l1', 'OFFER · "A JOB"', 0.4, t, 1280, 260); const no = info.w('You say no', 3.8); if (t > no) label(U, 'l2', 'ANSWER · NO', no, t, 1280, 350, { color: COL.red }); else label(U, 'l2', '', 99, t, 0, 0); chrome(U, t, info, D27); });
shot('s114', (U, t, info, tt) => { const k = ease.out(clamp(t / 0.8)); const S = hallway(tt, { open: true }); S.front = `<g transform="translate(${f(1180 + (1 - k) * 200)} ${f(FLOOR + 30 - (1 - k) * 160)}) rotate(${f(-8 - (1 - k) * 40)})"><rect x="-150" y="-80" width="300" height="160" rx="10" fill="#f4f1ea" stroke="${OL}" stroke-width="4"/><rect x="-110" y="-44" width="160" height="16" fill="#1c1e26"/><rect x="-110" y="-2" width="220" height="10" fill="#9aa3ad"/><rect x="-110" y="22" width="180" height="10" fill="#9aa3ad"/><circle cx="105" cy="-36" r="16" fill="#c8352e"/></g>`;
  frame(U, S, { z: 1.1, cx: 960, cy: 620 }, []); label(U, 'l1', 'SURPRISED · NO', 1.2, t, 1280, 260, { color: COL.red }); chrome(U, t, info, D27); });
