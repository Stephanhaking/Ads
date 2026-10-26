// s001 — "Two metres under a lake." 2D stickman style: dusk sky and pier, then the view sinks under the water to the swimmer.
import { registerShot, ease, clamp, prog, E } from '/engine/api.js';
import { stick, grad, POSE_FLOAT } from '../lib/stick2d.js';

const WATER = 560;                       // world y of the waterline at the start
function scene(t, dur) {
  const k = ease.inOut(clamp(t / dur));
  const cy = 640 * k;                    // camera sinks by 640 px
  const wave = (x, a, ph) => Math.sin(x * 0.012 + t * 1.6 + ph) * a;
  const surf = Array.from({ length: 49 }, (_, i) => `${i * 40},${f1(WATER + wave(i * 40, 5, 0))}`).join(' ');
  // pier: deck at y=470, posts to the bed, X braces under water
  let pier = `<rect x="150" y="466" width="1180" height="16" fill="#6b5240"/>`;
  for (let x = 160; x < 1320; x += 34) pier += `<rect x="${x}" y="470" width="3" height="12" fill="#3d2d22"/>`;
  for (let x = 170; x <= 1300; x += 160) {
    pier += `<rect x="${x - 9}" y="482" width="18" height="${1700 - 482}" fill="#2a2018"/>`;
    if (x < 1290) pier += `<line x1="${x + 9}" y1="640" x2="${x + 151}" y2="1000" stroke="#2a2018" stroke-width="8"/><line x1="${x + 151}" y1="640" x2="${x + 9}" y2="1000" stroke="#2a2018" stroke-width="8"/>`;
    pier += `<rect x="${x - 4}" y="396" width="8" height="72" fill="#3d2d22"/>`;
  }
  pier += `<rect x="150" y="394" width="1180" height="8" fill="#3d2d22"/>`;
  const lamp = (x) => `<rect x="${x - 4}" y="330" width="8" height="140" fill="#1a1410"/><circle cx="${x}" cy="326" r="130" fill="url(#lampG)"/><circle cx="${x}" cy="326" r="12" fill="#ffe7b0"/>`;
  // bank + pines
  let bank = `<polygon points="0,${WATER - 40} 160,${WATER - 70} 190,${WATER} 0,${WATER}" fill="#1c2a24"/>`;
  for (let i = 0; i < 16; i++) { const x = 6 + i * 26, h = 120 + (i * 37) % 90; bank += `<polygon points="${x},${WATER - 70} ${x + 24},${WATER - 70 - h} ${x + 48},${WATER - 70}" fill="#15221e"/>`; }
  const sky = `<rect x="-50" y="-700" width="2100" height="${WATER + 700}" fill="url(#sky)"/><ellipse cx="1550" cy="${WATER - 20}" rx="520" ry="150" fill="url(#sun)"/><polygon points="700,${WATER} 1000,${WATER - 70} 1300,${WATER - 40} 1600,${WATER - 90} 1920,${WATER - 30} 1920,${WATER}" fill="#3b2f4d"/>`;
  const water = `<rect x="-50" y="${WATER}" width="2100" height="1400" fill="url(#water)"/><polygon points="${surf} 1960,${WATER + 40} -40,${WATER + 40}" fill="#8fd0d8" opacity="0.22"/>`;
  let rays = ''; for (let i = 0; i < 6; i++) { const x = 200 + i * 320 + Math.sin(t * 0.5 + i) * 20; rays += `<polygon points="${x},${WATER} ${x + 90},${WATER} ${x + 330},1500 ${x + 150},1500" fill="#bfeaf0" opacity="0.045"/>`; }
  let motes = ''; for (let i = 0; i < 26; i++) motes += `<circle cx="${(i * 197) % 1920}" cy="${WATER + 60 + ((i * 131 + t * 14) % 900)}" r="${1.5 + (i % 3)}" fill="#d9f4f6" opacity="0.28"/>`;
  // swimmer: floating, breathing (arms lift slightly), mouth open
  const br = 0.5 - 0.5 * Math.cos((t / 4.5) * Math.PI * 2);
  const pose = { ...POSE_FLOAT, aL: [POSE_FLOAT.aL[0] - 3 * br, POSE_FLOAT.aL[1]], aR: [POSE_FLOAT.aR[0] + 3 * br, POSE_FLOAT.aR[1]] };
  const sw = stick(1020, 1010 + Math.sin(t * 0.9) * 8 - 6 * br, 1.15, pose, { mouthOpen: true, look: -0.4 });
  const defs = `<defs>${grad('sky', [[0, '#141a3c'], [0.55, '#5d4a78'], [1, '#e8906a']])}${grad('water', [[0, '#2f6670'], [0.35, '#12353f'], [1, '#050d14']])}
    <radialGradient id="lampG"><stop offset="0" stop-color="#ffd9a0" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
    <radialGradient id="sun"><stop offset="0" stop-color="#ffb070" stop-opacity="0.8"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></radialGradient></defs>`;
  const world = `${sky}${bank}${water}${rays}${pier}${lamp(330)}${lamp(1000)}${motes}${sw}`;
  return `${defs}<g transform="translate(0 ${f1(-cy)})">${world}</g>`;
}
const f1 = (n) => n.toFixed(1);
registerShot('s001', {
  bg: '#07101a',
  ui(U, t, info) {
    U.svg('scene', scene(t, info.dur), { z: 1 });
    U.timeStack({ date: 'Day one', time: 'Dusk', place: '2 m down · hypothetical' }, { at: 0.4 });
  },
});
