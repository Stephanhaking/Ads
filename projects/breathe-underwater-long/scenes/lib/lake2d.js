// 2D lake world (dusk): sky, pine bank, pier with lamps, water with rays and motes, the swimmer, two onlookers on the pier.
// world(t, o) returns SVG in world coordinates; view(cx, cy, zoom, inner) frames it like a camera (cx,cy = world point at screen centre).
import { stick, grad, POSE_FLOAT, POSE_STAND } from './stick2d.js';
export const WATER = 560;
const f1 = (n) => n.toFixed(1);
// ids are prefixed per shot: a gradient referenced from a hidden earlier shot's <svg> would not render
export const DEFS = (p) => `<defs>${grad(p + 'sky', [[0, '#141a3c'], [0.55, '#5d4a78'], [1, '#e8906a']])}${grad(p + 'water', [[0, '#2f6670'], [0.5, '#1b4a55'], [1, '#0c2a33']])}
  <radialGradient id="${p}lampG"><stop offset="0" stop-color="#ffd9a0" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
  <radialGradient id="${p}sun"><stop offset="0" stop-color="#ffb070" stop-opacity="0.8"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></radialGradient>
  <radialGradient id="${p}glowS"><stop offset="0" stop-color="#9fe0ff" stop-opacity="0.35"/><stop offset="1" stop-color="#9fe0ff" stop-opacity="0"/></radialGradient></defs>`;
export const SWIM = [1500, 1000];        // swimmer head-top position in world
export function breath(tt) { return 0.5 - 0.5 * Math.cos((tt / 4.5) * Math.PI * 2); }
export function world(t, o = {}) {
  const tt = o.tt ?? t, p = o.p || '';
  const wave = (x) => Math.sin(x * 0.012 + tt * 1.6) * 5;
  const surf = Array.from({ length: 61 }, (_, i) => `${i * 40 - 200},${f1(WATER + wave(i * 40))}`).join(' ');
  let pier = `<rect x="150" y="466" width="1180" height="16" fill="#6b5240"/>`;
  for (let x = 160; x < 1320; x += 34) pier += `<rect x="${x}" y="470" width="3" height="12" fill="#3d2d22"/>`;
  for (let x = 170; x <= 1300; x += 160) {
    pier += `<rect x="${x - 9}" y="482" width="18" height="1220" fill="#2a2018"/>`;
    if (x < 1290) pier += `<line x1="${x + 9}" y1="640" x2="${x + 151}" y2="1000" stroke="#2a2018" stroke-width="8"/><line x1="${x + 151}" y1="640" x2="${x + 9}" y2="1000" stroke="#2a2018" stroke-width="8"/>`;
    pier += `<rect x="${x - 4}" y="396" width="8" height="72" fill="#3d2d22"/>`;
  }
  pier += `<rect x="150" y="394" width="1180" height="8" fill="#3d2d22"/>`;
  const lamp = (x) => `<rect x="${x - 4}" y="330" width="8" height="140" fill="#1a1410"/><circle cx="${x}" cy="326" r="130" fill="url(#${p}lampG)"/><circle cx="${x}" cy="326" r="12" fill="#ffe7b0"/>`;
  let bank = `<polygon points="-300,${WATER - 40} 160,${WATER - 70} 190,${WATER} -300,${WATER}" fill="#1c2a24"/>`;
  for (let i = 0; i < 20; i++) { const x = -300 + i * 26, h = 120 + (i * 37) % 90; bank += `<polygon points="${x},${WATER - 60} ${x + 24},${WATER - 60 - h} ${x + 48},${WATER - 60}" fill="#15221e"/>`; }
  const sky = `<rect x="-400" y="-900" width="2900" height="${WATER + 900}" fill="url(#${p}sky)"/><ellipse cx="1550" cy="${WATER - 20}" rx="520" ry="150" fill="url(#${p}sun)"/><polygon points="700,${WATER} 1000,${WATER - 70} 1300,${WATER - 40} 1600,${WATER - 90} 2300,${WATER - 30} 2300,${WATER}" fill="#3b2f4d"/>`;
  const water = `<rect x="-400" y="${WATER}" width="2900" height="1500" fill="url(#${p}water)"/><polygon points="${surf} 2300,${WATER + 40} -200,${WATER + 40}" fill="#8fd0d8" opacity="0.22"/>`;
  let rays = ''; for (let i = 0; i < 8; i++) { const x = 100 + i * 300 + Math.sin(tt * 0.5 + i) * 20; rays += `<polygon points="${x},${WATER} ${x + 90},${WATER} ${x + 330},1600 ${x + 150},1600" fill="#bfeaf0" opacity="0.045"/>`; }
  let motes = ''; for (let i = 0; i < 40; i++) motes += `<circle cx="${(i * 197) % 2300 - 100}" cy="${f1(WATER + 60 + ((i * 131 + tt * 14) % 1000))}" r="${1.5 + (i % 3)}" fill="#d9f4f6" opacity="0.28"/>`;
  // onlookers on the pier end, looking down
  const folk = o.folk === false ? '' : stick(1180, 300, 0.62, { ...POSE_STAND, lean: 8, head: 10 }, { look: -0.6, rim: '#ffb070' }) + stick(1260, 296, 0.64, { ...POSE_STAND, lean: 6, aR: [40, 70], head: 8 }, { look: -0.8, rim: '#ffb070' });
  const b = breath(tt);
  const pose = { ...POSE_FLOAT, aL: [POSE_FLOAT.aL[0] - 4 * b, POSE_FLOAT.aL[1]], aR: [POSE_FLOAT.aR[0] + 4 * b, POSE_FLOAT.aR[1]], lean: POSE_FLOAT.lean - 3 * b };
  const sx = SWIM[0] + Math.sin(tt * 0.35) * 10, sy = SWIM[1] + Math.sin(tt * 0.9) * 8 - 8 * b;
  const out = {};
  const sw = `<circle cx="${sx}" cy="${sy + 140}" r="260" fill="url(#${p}glowS)"/>` + stick(sx, sy, 1.0, pose, { mouthOpen: true, look: -0.4, out });
  if (o.out) Object.assign(o.out, out, { x: sx, y: sy, b });
  return `${sky}${bank}${water}${rays}${pier}${lamp(330)}${lamp(1000)}${folk}${motes}${sw}${o.extra || ''}`;
}
export const view = (cx, cy, z, inner) => `<g transform="translate(960 540) scale(${z}) translate(${f1(-cx)} ${f1(-cy)})">${inner}</g>`;
