// Flat 2D sets and props for the Star Platinum video (our own designs; nothing traced from the manga/anime): the Stand as
// a tall glowing blue-and-purple figure, a nightstand with a glass, a supermarket aisle with a tin tower, a boxing gym with
// a heavy bag, a drain grate, a whiteboard, a hill with a school crossing, a hedge and a delivery van.
import { glow } from '../flat2d.js';
import { personRef } from '../body2.js';
const f = (n) => n.toFixed(1);
export const OL = '#b9dcff', AURA = '#8f7cff', CYAN = '#7fe3ff';
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// the Stand: a tall figure (h ~1.35x the hero) standing just behind and above the user, glowing; op = how visible
export function stand(x, y, h, pose, tt, o = {}) {
  const op = o.op ?? 0.85, bob = Math.sin(tt * 2.2) * 6;
  const c = personRef(x, y - 30 + bob, h, pose, { top: '#5b4bc8', bottom: '#3a2f8a', hair: 'short', broad: true, face: o.face || 'neutral', flip: o.flip, rim: CYAN, look: o.look ?? 0.4 });
  const id = 'sa' + Math.floor(rnd(x + y) * 1e6);
  const aura = `<defs>${glow(id, AURA, 0.55)}</defs><ellipse cx="${f(x)}" cy="${f(y - h * 0.55)}" rx="${f(h * 0.42)}" ry="${f(h * 0.62)}" fill="url(#${id})" opacity="${f(op)}"/>`;
  let wisps = ''; for (let i = 0; i < 6; i++) { const a = rnd(i + 3) * Math.PI * 2, r = h * (0.32 + 0.08 * Math.sin(tt * 3 + i)); wisps += `<circle cx="${f(x + Math.cos(a + tt * 0.6) * r)}" cy="${f(y - h * 0.55 + Math.sin(a + tt * 0.6) * r * 1.3)}" r="${f(6 + 4 * rnd(i))}" fill="${CYAN}" opacity="${f(0.35 * op)}"/>`; }
  return { svg: aura + wisps + `<g opacity="${f(op)}">${c.svg}</g>`, hands: c.hands, head: c.head };
}
// motion streaks behind a fast hand (from a to b)
export const streak = (x1, y1, x2, y2, n = 5, col = CYAN) => [...Array(n)].map((_, i) => { const k = i / n; return `<line x1="${f(x1 + (x2 - x1) * k)}" y1="${f(y1 + (y2 - y1) * k + (i - n / 2) * 10)}" x2="${f(x2)}" y2="${f(y2 + (i - n / 2) * 10)}" stroke="${col}" stroke-width="${f(10 - i * 1.5)}" stroke-linecap="round" opacity="${f(0.15 + 0.1 * i)}"/>`; }).join('');

// a glass (x, y = bottom centre); rot in degrees
export const glass = (x, y, rot = 0, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s})"><path d="M -26 -86 L 26 -86 L 20 0 L -20 0 Z" fill="#cfefff" fill-opacity="0.45" stroke="${OL}" stroke-width="4"/><path d="M -22 -50 L 22 -50 L 19 -4 L -19 -4 Z" fill="#7fc8ff" opacity="0.55"/></g>`;
// a nightstand with a lamp and an alarm clock reading `time`; glass state k: 0 on top, 0..1 falling, -1 none
export function nightstand(x, floor, time, k = 0) {
  let g = `<rect x="${x - 110}" y="${floor - 200}" width="220" height="200" rx="10" fill="#8a5a3a"/><rect x="${x - 120}" y="${floor - 214}" width="240" height="22" rx="6" fill="#a8704a"/><rect x="${x - 80}" y="${floor - 150}" width="160" height="10" rx="5" fill="#6a4228"/>`;
  g += `<rect x="${x + 30}" y="${floor - 262}" width="74" height="46" rx="8" fill="#15181e"/><text x="${x + 67}" y="${floor - 230}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="24" fill="#ff5a4a">${time}</text>`;
  if (k >= 0) { const fall = Math.min(1, k), gx = x - 50 - fall * 60, gy = floor - 214 + fall * fall * 190; g += glass(gx, gy, -fall * 70); }
  return g;
}
// supermarket aisle: shelves with products, a tin tower at tx; o.fall 0..1 (tins flying apart), o.fixed = all neat again
export function aisle(tt, o = {}) {
  const FLOOR = 830, cols = ['#e2553f', '#ffd23f', '#3fb8e0', '#4fd06a', '#e05a8a', '#f4f1ea'];
  let back = `<rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#e8eef2"/>`;
  for (let x = -600; x < 2520; x += 300) back += `<rect x="${x}" y="40" width="220" height="14" rx="7" fill="#ffffff"/>`;
  for (const sx of [-500, 240, 1660]) { back += `<rect x="${sx}" y="160" width="620" height="${FLOOR - 160}" fill="#c8d0d8"/>`;
    for (let r = 0; r < 4; r++) { const y = 260 + r * 150; back += `<rect x="${sx}" y="${y + 90}" width="620" height="14" fill="#8a98a8"/>`;
      for (let i = 0; i < 9; i++) { const c = cols[(i * 7 + r * 3 + (sx > 1000 ? 2 : 0)) % 6], hh = 60 + (i * 13 + r * 7) % 30; back += `<rect x="${sx + 14 + i * 66}" y="${y + 90 - hh}" width="54" height="${hh}" rx="5" fill="${c}"/>`; } } }
  back += `<rect x="900" y="80" width="420" height="70" rx="10" fill="#e2553f"/><text x="1110" y="128" text-anchor="middle" font-family="Inter" font-weight="900" font-size="38" fill="#fff">OFFER · TOMATOES</text>`;
  // the tin tower (rows 8..1), tower base at x 1100
  const tin = (x, y, r = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(r)})"><rect x="-22" y="-52" width="44" height="52" rx="5" fill="#d8402e" stroke="#7a2418" stroke-width="3"/><rect x="-22" y="-38" width="44" height="22" fill="#f4f1ea"/><circle cx="0" cy="-27" r="7" fill="#d8402e"/></g>`;
  let mid = ''; const fall = o.fixed ? 0 : (o.fall || 0);
  let n = 0; for (let row = 0; row < 8; row++) { const cnt = 8 - row; for (let i = 0; i < cnt; i++) { n++; const bx = 1100 + (i - (cnt - 1) / 2) * 48, by = FLOOR - row * 52;
      const dx = (rnd(n) - 0.3) * 420 * fall, dy = -Math.sin(fall * Math.PI) * (120 + 160 * rnd(n + 9)) + fall * fall * (FLOOR - by) * 0.9;
      mid += tin(bx + dx, Math.min(FLOOR, by + dy), (rnd(n + 4) - 0.5) * 360 * fall); } }
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#cfd6dc"/>` + [...Array(14)].map((_, i) => `<rect x="${-600 + i * 240}" y="${FLOOR}" width="4" height="600" fill="#b8c0c8"/>`).join('');
  return { back, mid, floor, front: '', FLOOR, bg: '#e8eef2', blur: 2.5, reflOp: 0.1, tex: 0.16 };
}
// a trolley (x = handle side)
export const trolley = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><path d="M -10 -150 L 20 -150 L 50 -40 L 220 -40 L 250 -130 L 30 -130" fill="none" stroke="#8a98a8" stroke-width="8" stroke-linejoin="round"/><path d="M 40 -130 L 240 -130 L 215 -50 L 60 -50 Z" fill="#cfd8e0" fill-opacity="0.35" stroke="#8a98a8" stroke-width="4"/><circle cx="70" cy="-12" r="12" fill="#2a2d3a"/><circle cx="200" cy="-12" r="12" fill="#2a2d3a"/></g>`;
// boxing gym: dark brick, ring ropes, a heavy bag at bx; o.burst 0..1 = bag split, sand pouring
export function boxing(tt, o = {}) {
  const FLOOR = 840, bx = o.bx || 1200, burst = o.burst || 0;
  let back = `<defs>${glow('bxl', '#ffe0a0', 0.6)}</defs><rect x="-600" y="-300" width="3120" height="${FLOOR + 300}" fill="#3a2430"/>`;
  for (let y = -300; y < FLOOR; y += 60) for (let x = -600 + ((y / 60) % 2) * 60; x < 2520; x += 120) back += `<rect x="${x}" y="${y}" width="114" height="54" rx="3" fill="#4a2c36" opacity="0.8"/>`;
  back += `<ellipse cx="${bx}" cy="40" rx="600" ry="260" fill="url(#bxl)"/><rect x="${bx - 60}" y="20" width="120" height="16" rx="6" fill="#fff2c8"/>`;
  back += `<rect x="-600" y="560" width="3120" height="10" fill="#e2553f" opacity="0.7"/><rect x="-600" y="640" width="3120" height="10" fill="#e8ecf2" opacity="0.5"/><rect x="-600" y="720" width="3120" height="10" fill="#3f6db3" opacity="0.6"/>`;
  back += `<rect x="200" y="300" width="380" height="120" rx="10" fill="#15181e"/><text x="390" y="378" text-anchor="middle" font-family="Inter" font-weight="900" font-size="56" fill="#ffd23f">BOXING</text>`;
  let mid = `<line x1="${bx}" y1="0" x2="${bx}" y2="260" stroke="#9aa3ad" stroke-width="6"/>`;
  const sw = Math.sin(tt * 9) * (o.hit ? 7 : 1.5);
  if (burst < 0.5) mid += `<g transform="rotate(${f(sw)} ${bx} 0)"><rect x="${bx - 80}" y="260" width="160" height="380" rx="60" fill="#a8302a" stroke="#5a1814" stroke-width="5"/><rect x="${bx - 80}" y="330" width="160" height="20" fill="#5a1814" opacity="0.5"/>${burst > 0 ? `<path d="M ${bx - 10} 400 l 20 60 l -16 50 l 20 60" stroke="#15181e" stroke-width="8" fill="none"/>` : ''}</g>`;
  else mid += `<path d="M ${bx - 80} 260 q 80 -30 160 0 l -20 200 q -60 40 -120 0 z" fill="#a8302a" stroke="#5a1814" stroke-width="5"/>`;
  let sand = ''; if (burst > 0) { const k = Math.min(1, burst * 1.4); sand += `<ellipse cx="${bx}" cy="${FLOOR}" rx="${f(60 + 520 * k)}" ry="${f(14 + 40 * k)}" fill="#d8b878"/>`;
    for (let i = 0; i < 26; i++) { const yy = 460 + ((i * 47 + tt * 600) % (FLOOR - 460)); sand += `<circle cx="${f(bx + (rnd(i) - 0.5) * 60 * k)}" cy="${f(yy)}" r="${f(4 + 4 * rnd(i + 5))}" fill="#d8b878" opacity="${f(k)}"/>`; } }
  const floor = `<rect x="-600" y="${FLOOR}" width="3120" height="600" fill="#5a3a2a"/>` + [...Array(30)].map((_, i) => `<rect x="${-600 + i * 110}" y="${FLOOR}" width="3" height="600" fill="#3a2418"/>`).join('');
  return { back, mid, floor: floor + sand, front: '', FLOOR, bg: '#3a2430', blur: 2.5, reflOp: 0.06, tex: 0.2 };
}
// a drain grate in the pavement (x, y = centre)
export const grate = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><rect x="-110" y="-26" width="220" height="52" rx="6" fill="#15181e" stroke="#5a6070" stroke-width="5"/>${[...Array(7)].map((_, i) => `<rect x="${-96 + i * 30}" y="-20" width="14" height="40" rx="3" fill="#3a3e48"/>`).join('')}</g>`;
export const keys = (x, y, r = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(r)})"><circle cx="0" cy="0" r="16" fill="none" stroke="#ffd23f" stroke-width="5"/><rect x="12" y="-5" width="46" height="10" rx="3" fill="#cfd8e0"/><rect x="44" y="4" width="6" height="10" fill="#cfd8e0"/></g>`;
export const ring = (x, y) => `<g transform="translate(${f(x)} ${f(y)})"><circle cx="0" cy="0" r="12" fill="none" stroke="#ffd23f" stroke-width="5"/><circle cx="0" cy="-12" r="5" fill="#cfefff"/></g>`;
export const coin = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="13" fill="#d8b84a" stroke="#8a7020" stroke-width="3"/>`;
// a whiteboard with handwritten lines; k = how much is written (0..1)
export function whiteboard(x, y, lines, k = 1) {
  let g = `<rect x="${x - 360}" y="${y - 230}" width="720" height="460" rx="10" fill="#f8faf8" stroke="#8a98a8" stroke-width="8"/><rect x="${x - 360}" y="${y + 230}" width="720" height="16" fill="#8a98a8"/>`;
  const tot = lines.reduce((a, l) => a + l.length, 0); let shown = Math.round(tot * k);
  lines.forEach((l, i) => { const s = l.slice(0, Math.max(0, shown)); shown -= l.length; g += `<text x="${x - 320}" y="${y - 150 + i * 78}" font-family="Kalam, Inter" font-weight="800" font-size="46" fill="${i === lines.length - 1 ? '#c8352e' : '#1f3a8a'}">${s}</text>`; });
  return g;
}
// a hill street sloping down to a school crossing; o.van = progress 0..1 down the hill; o.hedge true
export function hill(tt, o = {}) {
  const FLOOR = 860;
  let back = `<defs><linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a9ae8"/><stop offset="1" stop-color="#cfe8f6"/></linearGradient></defs><rect x="-900" y="-500" width="3720" height="${FLOOR + 500}" fill="url(#hs)"/>`;
  for (let i = 0; i < 9; i++) { const x = -700 + i * 330, h = 160 + (i * 53) % 140, y = 120 + i * 62; back += `<rect x="${x}" y="${y - h}" width="280" height="${h + 40}" fill="${['#e8a07a', '#c8d0e0', '#f2d58a', '#a8c8a0'][i % 4]}"/><path d="M ${x - 10} ${y - h} L ${x + 140} ${y - h - 70} L ${x + 290} ${y - h} Z" fill="#8a4a3a"/>${[0, 1].map((j) => `<rect x="${x + 40 + j * 120}" y="${y - h + 40}" width="70" height="60" fill="#5a7aa8" opacity="0.7"/>`).join('')}`; }
  const road = `<path d="M -900 160 L 900 ${FLOOR - 40} L 2820 ${FLOOR - 40} L 2820 ${FLOOR + 600} L -900 ${FLOOR + 600} Z" fill="#4a4e5a"/><path d="M -900 120 L 900 ${FLOOR - 80} L 2820 ${FLOOR - 80} L 2820 ${FLOOR - 40} L 900 ${FLOOR - 40} L -900 160 Z" fill="#9aa3ad"/>`;
  const zebra = [...Array(6)].map((_, i) => `<rect x="${1380 + i * 70}" y="${FLOOR - 36}" width="44" height="120" fill="#f4f1ea"/>`).join('');
  const hedge = `<g>${[...Array(6)].map((_, i) => `<circle cx="${1880 + i * 70}" cy="${FLOOR - 100 + (i % 2) * 12}" r="${70 + (i % 3) * 8}" fill="${i % 2 ? '#3f8a4a' : '#4fa05a'}"/>`).join('')}</g>`;
  const sign = `<g><rect x="1290" y="${FLOOR - 330}" width="10" height="290" fill="#5a6070"/><polygon points="1295,${FLOOR - 420} 1365,${FLOOR - 300} 1225,${FLOOR - 300}" fill="#e2553f" stroke="#fff" stroke-width="6"/><text x="1295" y="${FLOOR - 322}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="22" fill="#fff">SCHOOL</text></g>`;
  return { back: back, mid: road + zebra + sign, floor: hedge, front: '', FLOOR, bg: '#5a9ae8', blur: 3, reflect: false, tex: 0.18 };
}
// position of the van on the hill at progress p (0 top-left .. 1 at the crossing), and the van itself
export const vanAt = (p) => { const x = -500 + p * 1900; return x < 900 ? [x, 200 + (x + 900) * 0.3667, 20.1] : [x, 860, 0]; };
export function van(x, y, rot = 0, s = 1) {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s})"><rect x="-200" y="-190" width="330" height="160" rx="14" fill="#f4f6f8" stroke="#3a3e48" stroke-width="5"/><path d="M 130 -150 L 190 -150 L 230 -80 L 230 -30 L 130 -30 Z" fill="#f4f6f8" stroke="#3a3e48" stroke-width="5"/><path d="M 140 -140 L 182 -140 L 214 -84 L 140 -84 Z" fill="#8ac8f0"/><rect x="-180" y="-150" width="250" height="40" fill="#3f6db3"/><text x="-55" y="-120" text-anchor="middle" font-family="Inter" font-weight="900" font-size="26" fill="#fff">PARCELS</text><circle cx="-120" cy="-24" r="34" fill="#2a2d3a"/><circle cx="160" cy="-24" r="34" fill="#2a2d3a"/><circle cx="-120" cy="-24" r="12" fill="#9aa3ad"/><circle cx="160" cy="-24" r="12" fill="#9aa3ad"/></g>`;
}
// a lollipop sign held at (x, y)
export const lollipop = (x, y) => `<g><rect x="${x - 4}" y="${y - 160}" width="8" height="200" fill="#e8ecf2"/><circle cx="${x}" cy="${y - 200}" r="50" fill="#fff" stroke="#e2553f" stroke-width="10"/><text x="${x}" y="${y - 190}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="26" fill="#15181e">STOP</text></g>`;
// a bird frozen or flying
export const bird = (x, y, tt, frozen) => { const w = frozen ? 0.4 : Math.sin(tt * 12); return `<path d="M ${f(x - 30)} ${f(y - 10 * w)} Q ${f(x - 12)} ${f(y - 20 * w - 4)} ${f(x)} ${f(y)} Q ${f(x + 12)} ${f(y - 20 * w - 4)} ${f(x + 30)} ${f(y - 10 * w)}" stroke="#2a2d3a" stroke-width="5" fill="none" stroke-linecap="round"/>`; };
