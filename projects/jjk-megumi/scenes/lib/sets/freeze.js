// FLAT 2D — the frozen-food warehouse (Day 9 cold test; Day 14 runaway forklift + Gear 2). Our own design: icy blue
// walls, orange-and-blue racking full of boxes, frost, cold strip lights, a strip-curtain door, low mist, a yellow forklift.
import { registerShot, clamp, ease } from '/engine/api.js';
import { CAST, P_STAND, P_TIRED, P_RUN } from '../people.js';
import { hud, label, caption, punch, speedLines, COL } from '../hud.js';
import { frame, pan, glow } from '../flat2d.js';
import * as L from '../luffy.js';

const f = (n) => n.toFixed(1);
const HERO = { ...CAST.heroHoodie };
const ST = { off: { text: 'RUBBER · IDLE', on: false } }, G2 = { text: 'GEAR 2 · ON', on: true, color: COL.red };
const D9 = { day: 9, time: '5:30 AM', status: { text: 'TEMP · −20 °C', on: true, color: '#4fa8ff' } }, D14 = { day: 14, time: '2:15 PM', status: ST.off };
const BRK = { ...D14, status: { text: 'BRAKES · FAILED', on: true, color: COL.red } };
const chrome = (U, t, info, d) => { hud(U, d); caption(U, info, t); };
const lab = (U, t, items) => items.forEach(([txt, t0, x, y, c], i) => label(U, 'L' + i, txt, t0, t, x, y, c ? { color: c } : {}));
const TXT = (px, col = '#fff') => `font:900 ${px}px Inter;letter-spacing:-.01em;line-height:1.04;color:${col}`;
const walk = (tt, sp = 5) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };

const FLOOR = 820;
function rack(x, w, top, cols) { let g = `<rect x="${x}" y="${top}" width="14" height="${FLOOR - top}" fill="#2a6fe0"/><rect x="${x + w - 14}" y="${top}" width="14" height="${FLOOR - top}" fill="#2a6fe0"/>`;
  for (let y = top + 20; y < FLOOR - 40; y += 150) { g += `<rect x="${x}" y="${y + 120}" width="${w}" height="14" fill="#ff7a2a"/>`; for (let i = 0; i < cols; i++) { const bw = (w - 40) / cols - 10, bh = 70 + ((i * 31 + y) % 40), bx = x + 20 + i * (bw + 10); if ((i * 7 + y) % 5 !== 0) g += `<rect x="${f(bx)}" y="${y + 120 - bh}" width="${f(bw)}" height="${bh}" fill="${(i + y) % 3 ? '#e8b77e' : '#d9a066'}"/><rect x="${f(bx)}" y="${y + 120 - bh}" width="${f(bw)}" height="10" fill="#f4d4a4"/><rect x="${f(bx + bw * 0.4)}" y="${y + 120 - bh}" width="${f(bw * 0.2)}" height="${bh}" fill="#c48a52" opacity="0.5"/>`; } }
  return g; }
function freezer(tt) {
  let back = `<defs><linearGradient id="fw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fa6d8"/><stop offset="1" stop-color="#cfe8f8"/></linearGradient>${glow('cl', '#e8f6ff', 0.8)}</defs><rect x="-900" y="-400" width="3720" height="${FLOOR + 400}" fill="url(#fw)"/>`;
  back += `<rect x="-900" y="-400" width="3720" height="420" fill="#3d5f94"/>`;
  for (let x = -800; x < 2720; x += 420) back += `<ellipse cx="${x + 110}" cy="40" rx="300" ry="140" fill="url(#cl)" opacity="0.6"/><rect x="${x}" y="22" width="220" height="14" rx="7" fill="#f4fbff"/>`;
  back += rack(-600, 520, 120, 4) + rack(1500, 620, 120, 5);
  // strip-curtain door in the far wall
  back += `<rect x="560" y="300" width="380" height="${FLOOR - 300}" fill="#24406e"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${566 + i * 42}" y="304" width="36" height="${FLOOR - 304}" fill="#bfe4ff" opacity="0.45"/>`).join('')}<rect x="540" y="280" width="420" height="24" fill="#ffd23f"/><rect x="580" y="230" width="340" height="40" rx="6" fill="#14203a"/><text x="750" y="260" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="26" fill="#7ad8ff">−20 °C · FREEZER 3</text>`;
  back += `<rect x="-900" y="0" width="3720" height="${FLOOR}" fill="#eaf6ff" opacity="0.2"/>`;
  let mid = rack(1020, 420, 220, 3);
  for (let i = 0; i < 30; i++) mid += `<circle cx="${(i * 197 + tt * 6) % 2400 - 300}" cy="${200 + ((i * 89 + tt * 4) % 560)}" r="${2 + (i % 3)}" fill="#ffffff" opacity="0.6"/>`;   // ice crystals
  let floor = `<rect x="-900" y="${FLOOR}" width="3720" height="700" fill="#b9d4e8"/><rect x="-900" y="${FLOOR}" width="3720" height="8" fill="#8fb4d0"/><rect x="-900" y="${FLOOR + 120}" width="3720" height="16" fill="#ffd23f"/>`;
  for (let i = 0; i < 5; i++) floor += `<ellipse cx="${-200 + i * 520}" cy="${FLOOR + 40}" rx="420" ry="40" fill="#ffffff" opacity="0.35"/>`;   // low mist
  return { back, mid, floor, FLOOR, bg: '#6fa6d8', blur: 4, reflOp: 0.08 };
}
function forklift(x, y, h, o = {}) {   // flat yellow forklift facing left; (x, y) = bottom centre
  const s = h / 300; const p = (dx, dy) => `${f(x + dx * s)} ${f(y + dy * s)}`;
  let g = `<g>`;
  g += `<path d="M ${p(-120, -10)} L ${p(-120, -150)} L ${p(-20, -150)} L ${p(-20, -260)} L ${p(90, -260)} L ${p(130, -120)} L ${p(150, -120)} L ${p(150, -10)} Z" fill="#ffc21a" stroke="#b9dcff" stroke-width="3"/>`;
  g += `<path d="M ${p(-10, -250)} L ${p(80, -250)} L ${p(112, -150)} L ${p(-10, -150)} Z" fill="#9fe0ff" opacity="0.7"/><rect x="${p(-160, -300).split(' ')[0]}" y="${p(-160, -300).split(' ')[1]}" width="${f(16 * s)}" height="${f(300 * s)}" fill="#2a2d33"/><rect x="${p(-240, -24).split(' ')[0]}" y="${p(-240, -24).split(' ')[1]}" width="${f(100 * s)}" height="${f(12 * s)}" fill="#2a2d33"/>`;
  g += `<rect x="${p(-120, -150).split(' ')[0]}" y="${p(-120, -150).split(' ')[1]}" width="${f(270 * s)}" height="${f(18 * s)}" fill="#e09a10"/>`;
  for (const k of [-70, 100]) g += `<circle cx="${f(x + k * s)}" cy="${f(y - 34 * s)}" r="${f(36 * s)}" fill="#1a1d22" stroke="#b9dcff" stroke-width="3"/><circle cx="${f(x + k * s)}" cy="${f(y - 34 * s)}" r="${f(14 * s)}" fill="#8a8f96"/>`;
  if (o.warn) g += `<circle cx="${f(x + 40 * s)}" cy="${f(y - 270 * s)}" r="${f(12 * s)}" fill="${Math.sin(o.warn * 12) > 0 ? '#ff3b3b' : '#6a1010'}"/><circle cx="${f(x + 40 * s)}" cy="${f(y - 270 * s)}" r="${f(40 * s)}" fill="#ff3b3b" opacity="${Math.sin(o.warn * 12) > 0 ? 0.25 : 0}"/>`;
  return g + '</g>';
}
const breath = (c, t) => { let g = ''; for (let k = 0; k < 4; k++) { const ph = (t * 0.6 + k / 4) % 1; g += `<circle cx="${f(c.mouth[0] + c.R * (0.6 + ph * 2))}" cy="${f(c.mouth[1] - ph * c.R)}" r="${f(c.R * (0.2 + ph * 0.5))}" fill="#ffffff" opacity="${f(0.6 * (1 - ph))}"/>`; } return g; };
const boxes = (c, n) => { let g = ''; for (let k = 0; k < n; k++) { const x = c.head[0] - c.R * 1.4 + Math.sin(k * 1.7) * c.R * 0.15, y = c.head[1] - c.R * (2.2 + k * 1.15); g += `<rect x="${f(x)}" y="${f(y)}" width="${f(c.R * 2.8)}" height="${f(c.R * 1.1)}" fill="#e8b77e" stroke="#b9dcff" stroke-width="3"/><rect x="${f(x + c.R * 1.2)}" y="${f(y)}" width="${f(c.R * 0.4)}" height="${f(c.R * 1.1)}" fill="#c48a52" opacity="0.5"/>`; } return g; };
const HX = 820, H = (pose, face, o = {}) => ({ x: o.x ?? HX, y: o.y ?? FLOOR + 40, h: o.h || 360, pose, outfit: { ...HERO, ...(o.outfit || {}) }, face, flip: o.flip ?? false, look: o.look ?? 0.5, extra: o.extra, pre: o.pre });
const WIDE = { z: 1, cx: 960, cy: 520 }, MED = { z: 1.5, cx: HX + 60, cy: 560 }, CU = { z: 2.0, cx: HX + 30, cy: 520 };
export { freezer, forklift, FLOOR };
