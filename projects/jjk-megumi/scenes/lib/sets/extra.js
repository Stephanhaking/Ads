// FLAT 2D — the remaining shots in the series look: s008 (close-up of the hand, subway blurred behind), s009 (the
// heartbeat "BOOM" card) and the apartment hallway with the two people in suits (s112–s114).
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND } from '../people.js';
import { hud, label, caption, COL } from '../hud.js';
import { frame, glow } from '../flat2d.js';
import { GRAIN } from '../textures.js';
import * as L from '../luffy.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie }, OL = '#b9dcff', INK = '#00000d';
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const H0 = { day: 1, time: '7:58 AM', status: { text: 'RUBBER · IDLE', on: false } };
const D27 = { day: 27, time: '9:10 PM', status: { text: 'RUBBER · IDLE', on: false } };
const grain = `<defs><pattern id="gx" width="256" height="256" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="256" height="256"/></pattern></defs><rect width="1920" height="1080" fill="url(#gx)" opacity="0.07" style="mix-blend-mode:overlay"/>`;

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

export { hallway, FLOOR };
