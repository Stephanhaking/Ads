// Flat 2D art for "What If You Became Sukuna? Nobody Survives 7 Days" (our own designs; nothing traced from the manga/anime).
// Richer than the earlier sets: buildings have cornices, window frames and sills, balconies, rooftop tanks and antennas,
// lit windows that flicker, shop fronts with awnings; skylines come in parallax layers that drift with the shot time
// (o.t = seconds into the shot) so every frame moves. Theme: red sky and a red moon, a torii/temple for the "King",
// the hero in Sukuna blue. Effects: Dismantle slashes (thin white core, red glow), cut lines left on things, the Fuga
// fire arrow, the open Shrine (no dome: fine lines everywhere inside a radius), face marks that deepen day by day.
import { glow } from '../flat2d.js';
const f = (n) => n.toFixed(1);
export const RED = '#ff2e3a', RED2 = '#b8121e', BLUE = '#2f6fe0', BLUE2 = '#1f4fb0', GOLD = '#ffd23f';
export const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255, c = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, '0'); return '#' + c(r) + c(g) + c(b); };
let UID = 0; const uid = (p) => p + (UID++ % 99999);
const stars = (n, x0, x1, y0, y1, seed = 1, lt = 0) => [...Array(n)].map((_, i) => `<circle cx="${f(x0 + rnd(i + seed) * (x1 - x0))}" cy="${f(y0 + rnd(i * 3 + seed) * (y1 - y0))}" r="${f(1.3 + rnd(i * 7) * 2)}" fill="#fff" opacity="${f((0.35 + rnd(i * 5) * 0.5) * (0.75 + 0.25 * Math.sin(lt * 3 + i)))}"/>`).join('');

// ---------- sky, moon, clouds ----------
export function sky(top, bot, y0 = -300, y1 = 900) { const id = uid('sk'); return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-800" y="${y0}" width="3520" height="${y1 - y0}" fill="url(#${id})"/>`; }
export function moon(x, y, R, lt = 0, o = {}) { const id = uid('mn'), c = o.col || RED;
  let g = `<defs>${glow(id + 'g', c, 0.55)}<radialGradient id="${id}d" cx="0.38" cy="0.35" r="0.75"><stop offset="0" stop-color="${o.light || '#ff8a7a'}"/><stop offset="0.7" stop-color="${c}"/><stop offset="1" stop-color="${RED2}"/></radialGradient></defs>`;
  g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(R * 2.6)}" fill="url(#${id}g)" opacity="${f(0.75 + 0.1 * Math.sin(lt * 1.5))}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(R)}" fill="url(#${id}d)"/>`;
  [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.13], [-0.05, 0.38, 0.1], [0.35, -0.35, 0.08]].forEach(([dx, dy, r]) => { g += `<circle cx="${f(x + dx * R)}" cy="${f(y + dy * R)}" r="${f(r * R)}" fill="${RED2}" opacity="0.35"/>`; });
  // thin clouds sliding across the face
  for (let i = 0; i < 3; i++) { const cx = x - R * 1.8 + ((lt * (18 + i * 9) + i * R * 1.3) % (R * 3.6)), cy = y - R * 0.4 + i * R * 0.45; g += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(R * (0.9 - i * 0.15))}" ry="${f(R * 0.07)}" fill="${o.cloud || '#2a0a14'}" opacity="0.55"/>`; }
  return g; }
export function clouds(n, y0, y1, lt, col = '#fff', op = 0.5, seed = 3, sp = 14) { let g = ''; for (let i = 0; i < n; i++) { const w = 220 + rnd(i + seed) * 360, x = -700 + ((rnd(i * 5 + seed) * 3400 + lt * sp * (0.6 + rnd(i) * 0.8)) % 3400), y = y0 + rnd(i * 9 + seed) * (y1 - y0);
  g += `<g opacity="${f(op)}"><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w / 2)}" ry="${f(w * 0.11)}" fill="${col}"/><ellipse cx="${f(x - w * 0.15)}" cy="${f(y - w * 0.08)}" rx="${f(w * 0.22)}" ry="${f(w * 0.12)}" fill="${col}"/><ellipse cx="${f(x + w * 0.12)}" cy="${f(y - w * 0.1)}" rx="${f(w * 0.17)}" ry="${f(w * 0.1)}" fill="${col}"/></g>`; } return g; }
export function birds(n, y0, lt, col = '#15181e', seed = 2) { let g = ''; for (let i = 0; i < n; i++) { const x = -300 + ((rnd(i + seed) * 2600 + lt * (60 + i * 8)) % 2600), y = y0 + rnd(i * 3 + seed) * 160 + Math.sin(lt * 2 + i) * 10, w = Math.sin(lt * 9 + i * 2) * 8;
  g += `<path d="M ${f(x - 14)} ${f(y - w)} Q ${f(x - 6)} ${f(y - 6)} ${f(x)} ${f(y)} Q ${f(x + 6)} ${f(y - 6)} ${f(x + 14)} ${f(y - w)}" stroke="${col}" stroke-width="3" fill="none" stroke-linecap="round"/>`; } return g; }

// ---------- buildings ----------
// one detailed building: x = left, base = ground y, w, h. o.col body colour, o.night (lit windows), o.seed, o.lt (shot
// time for flicker), o.roof: 'tank' | 'antenna' | 'ac' | 'none', o.shop (awning colour), o.balc (balconies), o.win (style)
export function bldg(x, base, w, h, o = {}) { const col = o.col || '#c8a07a', s = o.seed || 1, lt = o.lt || 0, night = !!o.night, id = uid('b');
  const top = base - h, light = shade(col, 1.18), dark = shade(col, 0.72);
  let g = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${light}"/><stop offset="0.55" stop-color="${col}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>`;
  g += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="url(#${id})"/>`;
  // floor bands
  const fh = o.fh || 64, floors = Math.max(1, Math.floor((h - (o.shop ? 110 : 30)) / fh));
  for (let r = 1; r <= floors; r++) g += `<rect x="${f(x)}" y="${f(top + 24 + r * fh - 6)}" width="${f(w)}" height="4" fill="${dark}" opacity="0.45"/>`;
  // cornice + parapet
  g += `<rect x="${f(x - 8)}" y="${f(top - 6)}" width="${f(w + 16)}" height="16" fill="${shade(col, 0.6)}"/><rect x="${f(x - 4)}" y="${f(top + 10)}" width="${f(w + 8)}" height="6" fill="${light}" opacity="0.6"/>`;
  // windows
  const cw = o.cw || 52, cols = Math.max(1, Math.floor((w - 24) / cw)), pad = (w - cols * cw) / 2;
  for (let r = 0; r < floors; r++) for (let c = 0; c < cols; c++) { const wx = x + pad + c * cw + 10, wy = top + 30 + r * fh, ww = cw - 20, wh = fh - 26, k = s * 97 + r * 13 + c * 7;
    let fill; if (night) { const on = rnd(k) > 0.45, fl = rnd(k * 3) > 0.93 ? (Math.floor(lt * 1.3 + rnd(k) * 5) % 2) : 1; fill = on && fl ? (rnd(k * 5) > 0.35 ? '#ffd27a' : '#bfe4ff') : shade(col, 0.42); }
    else fill = rnd(k) > 0.85 ? '#5a7a9a' : '#9fd0f0';
    g += `<rect x="${f(wx - 3)}" y="${f(wy - 3)}" width="${f(ww + 6)}" height="${f(wh + 6)}" fill="${shade(col, 0.55)}"/><rect x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="${f(wh)}" fill="${fill}" ${night && fill === '#ffd27a' ? 'opacity="0.95"' : ''}/>`;
    if (!night) g += `<path d="M ${f(wx + ww * 0.2)} ${f(wy + wh)} L ${f(wx + ww * 0.75)} ${f(wy)} L ${f(wx + ww)} ${f(wy)} L ${f(wx + ww * 0.45)} ${f(wy + wh)} Z" fill="#fff" opacity="0.28"/>`;
    g += `<rect x="${f(wx)}" y="${f(wy + wh / 2 - 1.5)}" width="${f(ww)}" height="3" fill="${shade(col, 0.55)}"/><rect x="${f(wx - 6)}" y="${f(wy + wh + 2)}" width="${f(ww + 12)}" height="6" fill="${light}"/>`;
    if (night && fill === '#ffd27a' && rnd(k * 11) > 0.7) g += `<rect x="${f(wx + ww * 0.15)}" y="${f(wy + wh * 0.3)}" width="${f(ww * 0.25)}" height="${f(wh * 0.7)}" fill="#c88a3a" opacity="0.6"/>`; }
  if (o.balc) for (let r = 1; r < floors; r += 2) for (let c = 0; c < cols; c += 2) { const bx = x + pad + c * cw + 4, by = top + 30 + r * fh + fh - 30; g += `<rect x="${f(bx)}" y="${f(by)}" width="${f(cw - 8)}" height="22" fill="none" stroke="${shade(col, 0.45)}" stroke-width="3"/>${[0.25, 0.5, 0.75].map((q) => `<line x1="${f(bx + (cw - 8) * q)}" y1="${f(by)}" x2="${f(bx + (cw - 8) * q)}" y2="${f(by + 22)}" stroke="${shade(col, 0.45)}" stroke-width="2"/>`).join('')}`; }
  // shop front
  if (o.shop) { const sy = base - 100; g += `<rect x="${f(x)}" y="${f(sy)}" width="${f(w)}" height="100" fill="${shade(col, 0.5)}"/><rect x="${f(x + 14)}" y="${f(sy + 30)}" width="${f(w - 28)}" height="66" fill="${night ? '#ffe8a8' : '#bfe4ff'}" opacity="${night ? 0.85 : 0.9}"/>`;
    const n = Math.max(3, Math.floor(w / 36)); for (let i = 0; i < n; i++) g += `<path d="M ${f(x - 6 + i * (w + 12) / n)} ${f(sy)} L ${f(x - 6 + (i + 1) * (w + 12) / n)} ${f(sy)} L ${f(x - 6 + (i + 1) * (w + 12) / n)} ${f(sy + 26)} Q ${f(x - 6 + (i + 0.5) * (w + 12) / n)} ${f(sy + 36)} ${f(x - 6 + i * (w + 12) / n)} ${f(sy + 26)} Z" fill="${i % 2 ? '#fff' : o.shop}"/>`; }
  // rooftop
  const rf = o.roof || ['tank', 'antenna', 'ac', 'none'][Math.floor(rnd(s * 5) * 4)];
  if (rf === 'tank') { const tx = x + w * (0.2 + rnd(s) * 0.4); g += `<rect x="${f(tx)}" y="${f(top - 70)}" width="12" height="64" fill="${shade(col, 0.4)}"/><rect x="${f(tx + 50)}" y="${f(top - 70)}" width="12" height="64" fill="${shade(col, 0.4)}"/><path d="M ${f(tx - 6)} ${f(top - 70)} L ${f(tx + 68)} ${f(top - 70)} L ${f(tx + 64)} ${f(top - 136)} Q ${f(tx + 31)} ${f(top - 160)} ${f(tx - 2)} ${f(top - 136)} Z" fill="${shade(col, 0.55)}"/><line x1="${f(tx - 4)}" y1="${f(top - 100)}" x2="${f(tx + 66)}" y2="${f(top - 100)}" stroke="${shade(col, 0.35)}" stroke-width="3"/>`; }
  if (rf === 'antenna') { const ax = x + w * (0.3 + rnd(s * 2) * 0.4); g += `<line x1="${f(ax)}" y1="${f(top - 6)}" x2="${f(ax)}" y2="${f(top - 160)}" stroke="${shade(col, 0.4)}" stroke-width="5"/><line x1="${f(ax - 24)}" y1="${f(top - 110)}" x2="${f(ax + 24)}" y2="${f(top - 110)}" stroke="${shade(col, 0.4)}" stroke-width="4"/><circle cx="${f(ax)}" cy="${f(top - 164)}" r="6" fill="${RED}" opacity="${f(0.4 + 0.6 * (Math.sin(lt * 4 + s) > 0 ? 1 : 0))}"/>`; }
  if (rf === 'ac') for (let i = 0; i < 2; i++) { const ax = x + 20 + i * Math.min(90, w * 0.4); g += `<rect x="${f(ax)}" y="${f(top - 40)}" width="60" height="34" rx="4" fill="${shade(col, 0.6)}"/><circle cx="${f(ax + 30)}" cy="${f(top - 23)}" r="11" fill="${shade(col, 0.4)}"/><line x1="${f(ax + 30 + Math.cos(lt * 12 + i) * 10)}" y1="${f(top - 23 + Math.sin(lt * 12 + i) * 10)}" x2="${f(ax + 30 - Math.cos(lt * 12 + i) * 10)}" y2="${f(top - 23 - Math.sin(lt * 12 + i) * 10)}" stroke="${light}" stroke-width="3"/></g>`.replace('</g>', ''); }
  return g; }
// far silhouettes (simple, many) for depth
function far(base, lt, col, seed, night, drift) { let g = ''; const off = -lt * drift; for (let i = 0; i < 22; i++) { const w = 90 + rnd(i + seed) * 140, h = 160 + rnd(i * 3 + seed) * 340, x = -800 + i * 160 + off;
  g += `<rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h)}" fill="${col}"/>`; if (rnd(i * 7 + seed) > 0.6) g += `<rect x="${f(x + w / 2 - 2)}" y="${f(base - h - 50)}" width="4" height="50" fill="${col}"/>`;
  if (night) for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) if (rnd(i * 31 + r * 7 + c + seed) > 0.72) g += `<rect x="${f(x + 14 + c * (w - 30) / 3)}" y="${f(base - h + 24 + r * 40)}" width="10" height="14" fill="#ffd27a" opacity="0.55"/>`; }
  return g; }
// a full skyline in three layers: o.night, o.tint (far colour), o.cols (mid palette), lt = shot time (parallax drift)
export function skyline(base, lt, o = {}) { const night = o.night ?? true, seed = o.seed || 7;
  if (o.s && o.s !== 1) return `<g transform="translate(960 ${base}) scale(${o.s}) translate(-960 ${-base})">${skyline(base, lt, { ...o, s: 1 })}</g>`;
  let g = far(base - 40, lt, o.tint || (night ? '#1a1430' : '#9ab0c8'), seed, night, 3);
  const pal = o.cols || (night ? ['#3a3550', '#40304a', '#2e3a56', '#4a3a48'] : ['#d8b48a', '#c88a6a', '#a8b8c8', '#e0c8a0', '#b89a8a']);
  const off = -lt * 7; let x = -760 + off, i = 0;
  while (x < 2700) { const w = 170 + rnd(i * 3 + seed) * 170, h = 260 + rnd(i * 5 + seed) * 330;
    g += bldg(x, base, w, h, { col: pal[i % pal.length], night, seed: i + seed * 10, lt, balc: rnd(i + seed) > 0.6, shop: o.shops && rnd(i * 2 + seed) > 0.4 ? ['#e8452e', '#2f86e0', '#4fd06a', '#e0b44a'][i % 4] : null });
    x += w + 10 + rnd(i * 11) * 30; i++; }
  return g; }

// ---------- the King: torii, temple, red realm ----------
export function torii(x, y, s = 1, col = '#c8202e') { return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-120" y="-300" width="26" height="300" fill="${col}"/><rect x="94" y="-300" width="26" height="300" fill="${col}"/><rect x="-128" y="-14" width="42" height="14" fill="#15181e"/><rect x="86" y="-14" width="42" height="14" fill="#15181e"/>
<rect x="-150" y="-252" width="300" height="20" fill="${col}"/><rect x="-12" y="-296" width="24" height="44" fill="${col}"/><path d="M -190 -312 Q 0 -294 190 -312 L 200 -336 Q 0 -316 -200 -336 Z" fill="#15181e"/><path d="M -176 -296 Q 0 -280 176 -296 L 176 -312 Q 0 -296 -176 -312 Z" fill="${col}"/></g>`; }
export function temple(x, y, s = 1, col = '#1a0a10', lit = 0.6) { return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-180" y="-150" width="360" height="150" fill="${col}"/>${[-120, -40, 40, 120].map((d) => `<rect x="${d - 22}" y="-120" width="44" height="90" fill="#ff8a5a" opacity="${lit}"/>`).join('')}
<path d="M -290 -150 Q -150 -170 -120 -230 L 120 -230 Q 150 -170 290 -150 L 260 -140 Q 0 -160 -260 -140 Z" fill="${col}"/><rect x="-110" y="-270" width="220" height="44" fill="${col}"/><path d="M -200 -262 Q -100 -280 -80 -330 L 80 -330 Q 100 -280 200 -262 Z" fill="${col}"/><rect x="-6" y="-370" width="12" height="44" fill="${col}"/></g>`; }
// the red realm behind lore cards and the title image: red sky, moon, temple, torii, a still pond with reflections
export function realm(tt, o = {}) { const FLOOR = 860, lt = o.t || 0;
  let back = sky('#2a0610', '#7a1420', -300, FLOOR) + stars(30, -400, 2300, -250, 300, 9, lt) + moon(1400, 280, 150, lt) + clouds(5, 120, 520, lt, '#3a0a16', 0.6, 4, 10);
  back += `<path d="M -800 ${FLOOR - 120} Q 200 ${FLOOR - 260} 700 ${FLOOR - 160} T 2720 ${FLOOR - 200} L 2720 ${FLOOR} L -800 ${FLOOR} Z" fill="#2a0810"/>` + temple(560, FLOOR - 80, 1.1) ;
  let mid = torii(1260 - lt * 6, FLOOR, 1.5) + [...Array(8)].map((_, i) => { const x = -200 + ((rnd(i) * 2400 + lt * 30) % 2400), y = 200 + ((rnd(i * 3) * 700 + lt * 50) % 700); return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="8" ry="4" fill="#ff8a9a" opacity="0.7" transform="rotate(${f(lt * 80 + i * 40)} ${f(x)} ${f(y)})"/>`; }).join('');
  const floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#1a050a"/><ellipse cx="1400" cy="${FLOOR + 120}" rx="140" ry="26" fill="${RED}" opacity="0.35"/><g opacity="0.25">${[...Array(6)].map((_, i) => `<rect x="${-600 + i * 520 + Math.sin(lt + i) * 20}" y="${FLOOR + 40 + i * 30}" width="260" height="4" fill="#ff8a7a"/>`).join('')}</g>`;
  return { bg: '#2a0610', back, mid, floor, FLOOR, blur: 1.2, vig: 0.65, reflect: false, tex: 0.2 };
}

// ---------- effects ----------
// a Dismantle slash from (x1,y1) to (x2,y2), drawn to k (0..1); after k = 1 it fades (fade 0..1)
export function slash(x1, y1, x2, y2, k = 1, fade = 0, w = 1) { if (k <= 0 || fade >= 1) return ''; const x = x1 + (x2 - x1) * Math.min(1, k), y = y1 + (y2 - y1) * Math.min(1, k), op = 1 - fade;
  return `<g opacity="${f(op)}"><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y)}" stroke="${RED}" stroke-width="${f(18 * w)}" opacity="0.28" stroke-linecap="round"/><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y)}" stroke="#ff8a8a" stroke-width="${f(7 * w)}" opacity="0.6" stroke-linecap="round"/><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y)}" stroke="#fff" stroke-width="${f(2.6 * w)}" stroke-linecap="round"/>${k < 1 ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(10 * w)}" fill="#fff"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(26 * w)}" fill="${RED}" opacity="0.35"/>` : ''}</g>`; }
// a bundle of slashes in a zone (for the Shrine and big moments): n lines, seeded, appearing over k
export function slashes(cx, cy, rx, ry, n, k, lt, seed = 1, o = {}) { let g = ''; for (let i = 0; i < n; i++) { const t0 = rnd(i + seed) * 0.8, kk = (k - t0) / 0.15; if (kk <= 0) continue; const a = rnd(i * 3 + seed) * Math.PI, L = (o.len || 160) * (0.5 + rnd(i * 5 + seed)), x = cx + (rnd(i * 7 + seed) * 2 - 1) * rx, y = cy + (rnd(i * 9 + seed) * 2 - 1) * ry;
  g += slash(x - Math.cos(a) * L / 2, y - Math.sin(a) * L / 2, x + Math.cos(a) * L / 2, y + Math.sin(a) * L / 2, kk, o.keep ? 0 : Math.max(0, (kk - 2) / 3), o.w || 0.6); } return g; }
// a clean cut line left behind on a surface
export const cutLine = (x1, y1, x2, y2, op = 1) => `<g opacity="${f(op)}"><line x1="${f(x1)}" y1="${f(y1 + 2)}" x2="${f(x2)}" y2="${f(y2 + 2)}" stroke="#fff" stroke-width="2" opacity="0.5"/><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#15181e" stroke-width="3"/></g>`;
// the Fuga fire arrow: head at (x, y), pointing along angle a (deg), length L, flickering flames
export function fuga(x, y, a, L, lt, s = 1) { const fl = (i) => 0.8 + 0.2 * Math.sin(lt * 30 + i * 2);
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(s)})"><path d="M 0 0 L ${f(-L)} -46 Q ${f(-L * 0.7)} 0 ${f(-L)} 46 Z" fill="#ff6a2a" opacity="0.45"/><path d="M 0 0 L ${f(-L * 0.8)} ${f(-26 * fl(1))} Q ${f(-L * 0.55)} 0 ${f(-L * 0.8)} ${f(26 * fl(2))} Z" fill="#ffb03a"/><path d="M 0 0 L ${f(-L * 0.5)} -10 L ${f(-L * 0.5)} 10 Z" fill="#fff6c8"/>
<path d="M 40 0 L -30 -40 L -10 0 L -30 40 Z" fill="#ffd23f"/><path d="M 40 0 L -8 -18 L 2 0 L -8 18 Z" fill="#fff"/>${[...Array(6)].map((_, i) => `<circle cx="${f(-L * (0.2 + i * 0.14))}" cy="${f(Math.sin(lt * 20 + i) * 30)}" r="${f(8 - i)}" fill="#ffb03a" opacity="0.8"/>`).join('')}</g>`; }
// the open Shrine: no barrier; a red ring on the ground of radius R (ellipse), fine lines everywhere inside
export function shrine(cx, gy, R, k, lt, o = {}) { if (k <= 0) return ''; const ry = R * (o.ry ?? 0.22);
  let g = `<ellipse cx="${f(cx)}" cy="${f(gy)}" rx="${f(R * Math.min(1, k * 1.5))}" ry="${f(ry * Math.min(1, k * 1.5))}" fill="${RED}" opacity="0.14"/><ellipse cx="${f(cx)}" cy="${f(gy)}" rx="${f(R * Math.min(1, k * 1.5))}" ry="${f(ry * Math.min(1, k * 1.5))}" fill="none" stroke="#ff6a5a" stroke-width="5" stroke-dasharray="26 12" opacity="0.9"/>`;
  g += slashes(cx, gy - R * 0.25, R * 0.85, R * 0.35, o.n || 70, k, lt, o.seed || 5, { len: R * 0.3, w: 0.55 }); return g; }
// face marks (our own design): thin red stripes under the eyes, deepening with lvl 1..4. c = person() result
export function marks(c, lvl = 1, lt = 0) { if (!c || !c.head || lvl <= 0) return ''; const [hx, hy] = c.head, R = c.R || 40, col = '#ff3a4a', op = 0.75 + 0.2 * Math.sin(lt * 3);
  let g = `<g opacity="${f(op)}" stroke="${col}" stroke-linecap="round" fill="none">`;
  const st = (dx, dy, w, sw = 0.1) => `<path d="M ${f(hx + dx * R - w * R / 2)} ${f(hy + dy * R)} q ${f(w * R / 2)} ${f(R * 0.04)} ${f(w * R)} 0" stroke-width="${f(R * sw)}"/>`;
  for (const sd of [-1, 1]) { g += st(sd * 0.42, 0.2, 0.36); if (lvl >= 2) g += st(sd * 0.42, 0.36, 0.3); if (lvl >= 3) g += st(sd * 0.7, 0.52, 0.22, 0.08); }
  if (lvl >= 2) g += `<path d="M ${f(hx - R * 0.12)} ${f(hy - R * 0.55)} l ${f(R * 0.12)} ${f(R * 0.14)} l ${f(R * 0.12)} ${f(-R * 0.14)}" stroke-width="${f(R * 0.07)}"/>`;
  if (lvl >= 4) g += st(0, 0.78, 0.5, 0.06);
  return g + '</g>'; }
// marks along the arms (day 7): short red bands on both arms between shoulder and hand
export function armMarks(c, lt = 0) { if (!c || !c.shL || !c.hands) return ''; let g = ''; [[c.shL, c.hands[0]], [c.shR, c.hands[1]]].forEach(([a, b]) => { for (let i = 1; i < 5; i++) { const q = i / 5, x = a[0] + (b[0] - a[0]) * q, y = a[1] + (b[1] - a[1]) * q; g += `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#ff3a4a" opacity="${f(0.7 + 0.25 * Math.sin(lt * 3 + i))}"/>`; } }); return g; }
// two raised fingers glow at a hand point
export const fingers = (p, lt = 0, k = 1) => p ? `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(26 + 6 * Math.sin(lt * 8))}" fill="${RED}" opacity="${f(0.3 * k)}"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="9" fill="#fff" opacity="${f(0.9 * k)}"/>` : '';

// ---------- props ----------
export function loaf(x, y, s = 1, slices = 0, thick = false) { let g = `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-130" y="-8" width="300" height="12" rx="4" fill="#d8c8a8"/>`;
  if (!slices) g += `<path d="M -110 0 L -110 -60 Q -110 -104 -60 -104 L 60 -104 Q 110 -104 110 -60 L 110 0 Z" fill="#d8944a"/><path d="M -110 -50 L 110 -50 L 110 0 L -110 0 Z" fill="#e8d8b8" opacity="0.5"/><path d="M -84 -76 l 20 -16 M -24 -76 l 20 -16 M 36 -76 l 20 -16" stroke="#a86a2a" stroke-width="6"/>`;
  else { const n = slices, sw = thick ? 26 : 9; for (let i = 0; i < n; i++) { const sx = -110 + i * (thick ? 30 + (i % 3) * 6 : 20), tilt = thick ? (rnd(i) - 0.5) * 10 : 0; g += `<g transform="rotate(${f(tilt)} ${f(sx)} 0)"><path d="M ${f(sx)} 0 L ${f(sx)} -74 Q ${f(sx)} -100 ${f(sx + sw / 2)} -102 Q ${f(sx + sw)} -100 ${f(sx + sw)} -74 L ${f(sx + sw)} 0 Z" fill="#f2e2c0" stroke="#c88a4a" stroke-width="4"/></g>`; } }
  return g + '</g>'; }
export function fridge(x, y, rules = 0, k = 1) { let g = `<g transform="translate(${f(x)} ${f(y)})"><rect x="0" y="-560" width="240" height="560" rx="16" fill="#e8eef4"/><rect x="0" y="-380" width="240" height="6" fill="#b8c4d0"/><rect x="200" y="-520" width="12" height="100" rx="5" fill="#9aa3ad"/><rect x="200" y="-340" width="12" height="120" rx="5" fill="#9aa3ad"/>`;
  if (rules) { g += `<rect x="24" y="-520" width="160" height="${f(40 + rules * 40)}" fill="#fff8c8" transform="rotate(-3 100 -500)"/><circle cx="104" cy="-516" r="8" fill="${RED}"/>`; for (let i = 0; i < rules; i++) g += `<rect x="40" y="${f(-484 + i * 40)}" width="${f(120 * Math.min(1, Math.max(0, k * rules - i)))}" height="8" rx="3" fill="#2a2d3a" transform="rotate(-3 100 -500)"/><text x="30" y="${f(-474 + i * 40)}" font-family="Inter" font-weight="900" font-size="18" fill="${RED}" transform="rotate(-3 100 -500)">${i + 1}</text>`; }
  return g + '</g>'; }
export function dog(x, y, s = 1, lt = 0, o = {}) { const bark = o.bark ? Math.max(0, Math.sin(lt * 9)) : 0, fl = o.flip ? -1 : 1;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s * fl)} ${f(s)})"><rect x="-60" y="-80" width="110" height="46" rx="22" fill="#a8743a"/><rect x="-52" y="-40" width="14" height="40" rx="6" fill="#8a5a2a"/><rect x="28" y="-40" width="14" height="40" rx="6" fill="#8a5a2a"/><path d="M -58 -70 q -30 ${f(-20 + Math.sin(lt * 14) * 14)} -36 -40" stroke="#a8743a" stroke-width="12" fill="none" stroke-linecap="round"/>
<g transform="rotate(${f(-bark * 12)} 50 -86)"><circle cx="66" cy="-96" r="30" fill="#a8743a"/><path d="M 50 -118 q -18 6 -14 36" fill="#6a4020"/><rect x="74" y="-${f(86 - bark * 4)}" width="34" height="${f(18 + bark * 10)}" rx="8" fill="#a8743a"/><circle cx="106" cy="-86" r="6" fill="#15181e"/><circle cx="70" cy="-102" r="4.5" fill="#15181e"/></g>${bark > 0.5 ? `<path d="M 130 -120 l 24 -14 M 134 -96 l 28 0 M 130 -72 l 24 14" stroke="#15181e" stroke-width="5" stroke-linecap="round"/>` : ''}</g>`; }
export function bike(x, y, s = 1, o = {}) { return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><circle cx="-90" cy="-60" r="58" fill="none" stroke="#2a2d3a" stroke-width="10"/><circle cx="90" cy="-60" r="58" fill="none" stroke="#2a2d3a" stroke-width="10"/><path d="M -90 -60 L -20 -60 L 40 -150 L -50 -150 Z M -20 -60 L -50 -170 M 40 -150 L 90 -60 M 40 -150 L 50 -190" stroke="${o.col || '#e05a8a'}" stroke-width="12" fill="none" stroke-linejoin="round"/><rect x="-74" y="-182" width="50" height="12" rx="6" fill="#2a2d3a"/><rect x="30" y="-196" width="44" height="10" rx="5" fill="#2a2d3a"/></g>`; }
// a heavy steel chain lock: o.cut = 0..1 the two halves part
export function chain(x, y, s = 1, cut = 0, lt = 0) { let g = `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">`; for (let i = 0; i < 9; i++) { const side = i < 4.5 ? -1 : 1, dx = side * cut * 40, dy = cut * (Math.abs(i - 4) * 6); g += `<ellipse cx="${f(-160 + i * 40 + dx)}" cy="${f(dy)}" rx="24" ry="14" fill="none" stroke="${i % 2 ? '#8a93a8' : '#b8c0d0'}" stroke-width="9" transform="rotate(${i % 2 ? 0 : 0} ${f(-160 + i * 40)} 0)"/>`; }
  g += `<rect x="160" y="-26" width="56" height="52" rx="8" fill="#e8452e"/><path d="M 172 -26 q 16 -36 32 0" stroke="#b8c0d0" stroke-width="8" fill="none"/>`; return g + '</g>'; }
export function dumpster(x, y, s = 1, burn = 0, lt = 0) { let g = `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><path d="M -150 0 L -170 -150 L 170 -150 L 150 0 Z" fill="#2f7a4a"/><rect x="-176" y="-170" width="352" height="22" rx="6" fill="#256a3e"/><rect x="-120" y="-120" width="240" height="8" fill="#1f5a34"/><circle cx="-110" cy="6" r="14" fill="#15181e"/><circle cx="110" cy="6" r="14" fill="#15181e"/>`;
  if (burn) for (let i = 0; i < 7; i++) { const fx = -140 + i * 46, h = (60 + rnd(i) * 80) * burn * (0.8 + 0.2 * Math.sin(lt * 14 + i)); g += `<path d="M ${f(fx - 26)} -168 Q ${f(fx - 10)} ${f(-168 - h * 0.6)} ${f(fx)} ${f(-168 - h)} Q ${f(fx + 14)} ${f(-168 - h * 0.6)} ${f(fx + 26)} -168 Z" fill="${i % 2 ? '#ffb03a' : '#ff6a2a'}"/>`; }
  return g + '</g>'; }
export function lampPost(x, gy, h = 520, ang = 0, on = 1, col = '#ffe8a8') { return `<g transform="rotate(${f(ang)} ${f(x)} ${f(gy)})"><rect x="${f(x - 7)}" y="${f(gy - h)}" width="14" height="${f(h)}" fill="#4a5060"/><rect x="${f(x - 16)}" y="${f(gy - 26)}" width="32" height="26" fill="#3a4050"/><path d="M ${f(x)} ${f(gy - h)} q 0 -30 50 -30 l 30 0" stroke="#4a5060" stroke-width="10" fill="none"/><path d="M ${f(x + 50)} ${f(gy - h - 30)} l 60 0 l -10 20 l -40 0 Z" fill="#3a4050"/><ellipse cx="${f(x + 80)}" cy="${f(gy - h - 8)}" rx="26" ry="8" fill="${col}" opacity="${f(on)}"/>${on ? `<path d="M ${f(x + 80)} ${f(gy - h - 8)} L ${f(x - 120)} ${f(gy)} L ${f(x + 280)} ${f(gy)} Z" fill="${col}" opacity="${f(0.13 * on)}"/>` : ''}</g>`; }
export function bus(x, y, s = 1, col = '#e0b44a') { return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><rect x="-300" y="-250" width="600" height="220" rx="26" fill="${col}"/><rect x="-300" y="-90" width="600" height="20" fill="${shade(col, 0.75)}"/>${[...Array(5)].map((_, i) => `<rect x="${-270 + i * 104}" y="-226" width="88" height="90" rx="8" fill="#bfe4ff"/>`).join('')}<rect x="244" y="-226" width="40" height="150" rx="6" fill="#9fd0f0"/><circle cx="-180" cy="-30" r="42" fill="#15181e"/><circle cx="180" cy="-30" r="42" fill="#15181e"/><circle cx="-180" cy="-30" r="16" fill="#8a93a8"/><circle cx="180" cy="-30" r="16" fill="#8a93a8"/><rect x="290" y="-70" width="16" height="22" fill="#fff4b0"/></g>`; }
export function crane(x, gy, s = 1, cut = 0) { let g = `<g transform="translate(${f(x)} ${f(gy)}) scale(${f(s)})"><path d="M -30 0 L -30 -520 L 30 -520 L 30 0" fill="none" stroke="#e0a43a" stroke-width="8"/>`; for (let i = 0; i < 10; i++) g += `<line x1="-30" y1="${-i * 52}" x2="30" y2="${-(i + 1) * 52}" stroke="#e0a43a" stroke-width="5"/>`;
  g += `<g transform="rotate(${f(cut * 18)} -30 -520) translate(${f(cut * 30)} ${f(cut * 40)})"><path d="M -200 -520 L 420 -520 L 420 -560 L -200 -560 Z" fill="none" stroke="#e0a43a" stroke-width="7"/>${[...Array(12)].map((_, i) => `<line x1="${-200 + i * 52}" y1="-520" x2="${-200 + (i + 1) * 52}" y2="-560" stroke="#e0a43a" stroke-width="4"/>`).join('')}<line x1="380" y1="-520" x2="380" y2="-330" stroke="#2a2d3a" stroke-width="3"/><rect x="364" y="-334" width="32" height="24" fill="#2a2d3a"/></g><rect x="-50" y="-40" width="100" height="40" fill="#3a3f4a"/></g>`; return g; }

// ---------- sets (return { bg, back, mid, floor, FLOOR, ... }); o.t = shot-local time for drift ----------
// the flat: kitchen with a big window onto a detailed city; o.time 'morning' | 'night' | 'dawn' | 'dark' (lights off)
export function apartment(tt, o = {}) { const FLOOR = 860, lt = o.t || 0, time = o.time || 'morning', night = time === 'night' || time === 'dark';
  const wall = time === 'dark' ? '#1c2236' : time === 'night' ? '#4a4060' : '#e8d4b0';
  let back = `<rect x="-800" y="-300" width="3520" height="${FLOOR + 300}" fill="${wall}"/>`;
  // window with the city
  const wx = 760, wy = 120, ww = 980, wh = 470, id = uid('aw');
  back += `<defs><clipPath id="${id}"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}"/></clipPath></defs><g clip-path="url(#${id})">`;
  back += time === 'morning' ? sky('#8ac8f0', '#ffe2b0', wy, wy + wh) + clouds(4, wy + 40, wy + 200, lt, '#fff', 0.8, 5, 20) + `<circle cx="${wx + 200}" cy="${wy + 120}" r="54" fill="#fff2c0"/>` + birds(4, wy + 60, lt)
    : time === 'dawn' ? sky('#2a3a6a', '#ff9a6a', wy, wy + wh) : sky('#0a0a1e', '#2a1030', wy, wy + wh) + stars(20, wx, wx + ww, wy, wy + 200, 3, lt) + moon(wx + 760, wy + 110, 60, lt);
  back += `<g transform="translate(${wx - 300} 0) scale(0.75) translate(0 ${(wy + wh) / 0.75 - (wy + wh)})">${skyline((wy + wh + 40), lt, { night, seed: 11 })}</g>`;
  back += `</g><rect x="${wx - 16}" y="${wy - 16}" width="${ww + 32}" height="${wh + 32}" fill="none" stroke="${night ? '#6a6080' : '#f8f4ec'}" stroke-width="26"/><rect x="${wx + ww / 2 - 8}" y="${wy}" width="16" height="${wh}" fill="${night ? '#6a6080' : '#f8f4ec'}"/><rect x="${wx - 40}" y="${wy + wh + 14}" width="${ww + 80}" height="20" fill="${night ? '#5a5070' : '#f0e8d8'}"/>`;
  // shelves + plant
  back += `<rect x="120" y="260" width="380" height="16" fill="#8a5a3a"/><rect x="160" y="200" width="40" height="60" fill="#e05a5a"/><rect x="220" y="214" width="34" height="46" fill="#3fb8e0"/><path d="M 380 260 q -30 -80 0 -110 q 30 30 0 110 Z M 380 260 q 40 -60 70 -60 q -10 40 -70 60 Z" fill="#4fa06a"/><rect x="360" y="230" width="44" height="30" fill="#c86a4a"/>`;
  if (time === 'morning') back += `<path d="M ${wx} ${wy + wh} L ${wx - 400} ${FLOOR} L ${wx + ww - 200} ${FLOOR} L ${wx + ww} ${wy + wh} Z" fill="#fff6d8" opacity="0.18"/>`;
  let mid = `<rect x="-200" y="${FLOOR - 250}" width="1200" height="250" fill="${night ? '#3a3448' : '#5a7aa0'}"/><rect x="-220" y="${FLOOR - 270}" width="1240" height="26" rx="6" fill="${night ? '#5a5468' : '#e8e2d4'}"/>${[0, 1, 2, 3].map((i) => `<rect x="${-170 + i * 290}" y="${FLOOR - 220}" width="260" height="190" rx="8" fill="none" stroke="${night ? '#2a2438' : '#4a6a90'}" stroke-width="5"/><rect x="${-60 + i * 290}" y="${FLOOR - 140}" width="40" height="8" rx="4" fill="#c8ccd4"/>`).join('')}`;
  mid += fridge(1820, FLOOR, o.list || 0, o.listK ?? 1);
  if (o.cut) mid += cutLine(o.cut[0], o.cut[1], o.cut[2], o.cut[3]);
  let floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="${night ? '#2a2436' : '#b07a5a'}"/>`; for (let x = -800; x < 2720; x += 130) floor += `<line x1="${x}" y1="${FLOOR}" x2="${x - 120}" y2="1500" stroke="#000" stroke-width="3" opacity="0.08"/>`;
  return { bg: wall, back, mid, floor, FLOOR, blur: 1.2, reflOp: 0.05, tex: 0.16, vig: night ? 0.7 : 0.45 };
}
// bathroom with a big mirror (the film draws the reflection inside MIRROR)
export function bathroom(tt, o = {}) { const FLOOR = 870, lt = o.t || 0; let back = `<rect x="-800" y="-300" width="3520" height="${FLOOR + 300}" fill="#cfe2e6"/>`;
  for (let y = 0; y < FLOOR; y += 70) for (let x = -800; x < 2720; x += 70) back += `<rect x="${x + 3}" y="${y + 3}" width="64" height="64" fill="#e4f0f2"/>`;
  back += `<rect x="600" y="140" width="720" height="500" rx="24" fill="#8a96a0"/><rect x="620" y="160" width="680" height="460" rx="14" fill="#a8c8d8"/><path d="M 700 160 L 820 160 L 640 460 L 620 460 L 620 280 Z" fill="#fff" opacity="0.25"/><path d="M 1180 620 L 1300 420 L 1300 520 L 1240 620 Z" fill="#fff" opacity="0.18"/>`;
  back += [...Array(5)].map((_, i) => `<circle cx="${700 + i * 130}" cy="110" r="22" fill="#fff8d8"/><circle cx="${700 + i * 130}" cy="110" r="40" fill="#fff8d8" opacity="${f(0.25 + 0.05 * Math.sin(lt * 2 + i))}"/>`).join('');
  let mid = `<path d="M 640 ${FLOOR - 220} L 1280 ${FLOOR - 220} L 1240 ${FLOOR - 140} L 680 ${FLOOR - 140} Z" fill="#f4f8fa"/><rect x="900" y="${FLOOR - 140}" width="120" height="140" fill="#e4ecf0"/><rect x="940" y="${FLOOR - 270}" width="16" height="50" fill="#b8c4d0"/><path d="M 948 ${FLOOR - 270} q 0 -20 40 -20" stroke="#b8c4d0" stroke-width="12" fill="none"/>`;
  mid += `<rect x="1460" y="${FLOOR - 420}" width="16" height="420" fill="#9aa3ad"/><rect x="1440" y="${FLOOR - 430}" width="260" height="14" rx="6" fill="#9aa3ad"/><rect x="1490" y="${FLOOR - 400}" width="190" height="260" rx="10" fill="#3fb8e0" opacity="0.8"/>`;
  const floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#8aa0a8"/>${[...Array(30)].map((_, i) => `<line x1="${-800 + i * 120}" y1="${FLOOR}" x2="${-900 + i * 120}" y2="1500" stroke="#fff" stroke-width="3" opacity="0.15"/>`).join('')}`;
  return { bg: '#cfe2e6', back, mid, floor, FLOOR, MIRROR: [620, 160, 680, 460], blur: 1.2, reflOp: 0.06, tex: 0.14, vig: 0.4 };
}
// the park by day: city behind, trees that sway, a path, a bike rack
export function park(tt, o = {}) { const FLOOR = 870, lt = o.t || 0;
  let back = sky('#7ac0f0', '#e8f4ff', -300, FLOOR) + clouds(6, -100, 300, lt, '#fff', 0.85, 8, 18) + birds(5, 60, lt);
  back += skyline(FLOOR - 140, lt, { night: false, seed: 21, shops: false, s: 0.72 });
  back += `<rect x="-800" y="${FLOOR - 150}" width="3520" height="160" fill="#6ab06a"/>`;
  let mid = ''; for (let i = 0; i < 6; i++) { const x = -500 + i * 520, sw = Math.sin(lt * 1.6 + i) * 6; mid += `<rect x="${x - 16}" y="${FLOOR - 300}" width="32" height="300" fill="#6a4a2a"/><g transform="rotate(${f(sw)} ${x} ${FLOOR - 300})"><circle cx="${x}" cy="${FLOOR - 400}" r="130" fill="#3f8a4a"/><circle cx="${x - 80}" cy="${FLOOR - 340}" r="90" fill="#4fa05a"/><circle cx="${x + 90}" cy="${FLOOR - 350}" r="96" fill="#4a9a52"/><circle cx="${x + 30}" cy="${FLOOR - 470}" r="70" fill="#5ab066"/></g>`; }
  mid += `<g transform="translate(1520 ${FLOOR})">${[0, 1, 2, 3].map((i) => `<path d="M ${i * 70} 0 L ${i * 70} -90 Q ${i * 70 + 30} -130 ${i * 70 + 60} -90 L ${i * 70 + 60} 0" stroke="#8a93a8" stroke-width="8" fill="none"/>`).join('')}</g>`;
  let floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#5aa05a"/><path d="M -800 ${FLOOR + 60} Q 960 ${FLOOR + 20} 2720 ${FLOOR + 90} L 2720 ${FLOOR + 200} Q 960 ${FLOOR + 130} -800 ${FLOOR + 170} Z" fill="#e0d0a8"/>`;
  return { bg: '#7ac0f0', back, mid, floor, FLOOR, blur: 2, reflect: false, tex: 0.16, vig: 0.4 };
}
// a city crossing by day: detailed shop fronts, zebra crossing, traffic light, a bus that passes (o.busX)
export function crossing(tt, o = {}) { const FLOOR = 860, lt = o.t || 0;
  let back = sky('#8ac8f0', '#f0f4ff', -300, FLOOR) + clouds(5, -150, 200, lt, '#fff', 0.8, 12, 16);
  back += skyline(FLOOR - 60, lt * 0.5, { night: false, seed: 33, shops: true, s: 0.9 });
  let mid = `<rect x="1580" y="${FLOOR - 520}" width="18" height="520" fill="#3a3f4a"/><rect x="1554" y="${FLOOR - 640}" width="70" height="170" rx="10" fill="#2a2d3a"/><circle cx="1589" cy="${FLOOR - 610}" r="20" fill="${o.green ? '#3a3a3a' : RED}"/><circle cx="1589" cy="${FLOOR - 555}" r="20" fill="#3a3a3a"/><circle cx="1589" cy="${FLOOR - 500}" r="20" fill="${o.green ? '#4fd06a' : '#3a3a3a'}"/>`;
  if (o.busX != null) mid += bus(o.busX, FLOOR + 40, 1.1);
  let floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#4a4e5e"/><rect x="-800" y="${FLOOR}" width="3520" height="30" fill="#9a9ea8"/>` + [...Array(12)].map((_, i) => `<rect x="${200 + i * 110}" y="${FLOOR + 60}" width="70" height="200" fill="#f4f4f4" opacity="0.9" transform="skewX(-20)"/>`).join('');
  return { bg: '#8ac8f0', back, mid, floor, FLOOR, blur: 2, reflect: false, tex: 0.15, vig: 0.4 };
}
// the hallway at 3 a.m.: dim, doors with numbers, the neighbour's door at the right
export function hall(tt, o = {}) { const FLOOR = 870, lt = o.t || 0; let back = `<rect x="-800" y="-300" width="3520" height="${FLOOR + 300}" fill="#1e2236"/><rect x="-800" y="${FLOOR - 300}" width="3520" height="8" fill="#2a2f48"/>`;
  [[200, '3A'], [1300, '3B']].forEach(([x, n]) => { back += `<rect x="${x}" y="${FLOOR - 560}" width="320" height="560" fill="#3a2f4a"/><rect x="${x + 20}" y="${FLOOR - 540}" width="280" height="540" fill="#4a3a5a"/><circle cx="${x + 260}" cy="${FLOOR - 270}" r="12" fill="#c8a84a"/><text x="${x + 160}" y="${FLOOR - 600}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="40" fill="#8a8aa8">${n}</text>`; });
  back += `<rect x="1300" y="${FLOOR - 8}" width="320" height="8" fill="#ffe8a8" opacity="${f(0.5 + 0.3 * Math.sin(lt * 4))}"/>`;
  const fl = 0.75 + 0.25 * (Math.sin(lt * 17) > -0.6 ? 1 : 0.2);
  let mid = `<rect x="880" y="40" width="160" height="16" fill="#3a3f5a"/><ellipse cx="960" cy="64" rx="60" ry="10" fill="#fff4c8" opacity="${f(fl)}"/><path d="M 960 64 L 600 ${FLOOR} L 1320 ${FLOOR} Z" fill="#fff4c8" opacity="${f(0.06 * fl)}"/>`;
  const floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#2a2436"/><rect x="-800" y="${FLOOR + 40}" width="3520" height="300" fill="#3a2a3a" opacity="0.5"/>`;
  return { bg: '#1e2236', back, mid, floor, FLOOR, blur: 1.2, reflOp: 0.05, tex: 0.2, vig: 0.75 };
}
// the empty car park at 5 a.m.: dawn sky, city far away, lamps, concrete posts, a dumpster
export function lot(tt, o = {}) { const FLOOR = 880, lt = o.t || 0;
  let back = sky('#1a2450', '#ff9a6a', -300, FLOOR) + stars(20, -400, 2300, -250, 120, 5, lt) + clouds(4, 120, 380, lt, '#ffb08a', 0.35, 14, 12);
  back += skyline(FLOOR - 180, lt * 0.4, { night: true, seed: 41, s: 0.55, cols: ['#2a2a48', '#34304e', '#2a3450'] });
  back += `<rect x="-800" y="${FLOOR - 190}" width="3520" height="200" fill="#3a3a4e"/>`;
  let mid = lampPost(-100, FLOOR, 560, 0, 0.6) + lampPost(2000, FLOOR, 560, 0, 0.6);
  let floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#4a4a58"/>` + [...Array(14)].map((_, i) => `<line x1="${-600 + i * 260}" y1="${FLOOR + 30}" x2="${-680 + i * 260}" y2="${FLOOR + 260}" stroke="#e8e0a0" stroke-width="7" opacity="0.6"/>`).join('');
  return { bg: '#1a2450', back, mid, floor, FLOOR, blur: 2, reflect: false, tex: 0.18, vig: 0.55 };
}
// a concrete post (bollard); o.cut 0..1 the top slides off along the cut
export function post(x, gy, cut = 0, mark = false) { const y0 = gy - 260; let g = `<rect x="${f(x - 46)}" y="${f(gy - 130)}" width="92" height="130" fill="#a8a8b0"/><rect x="${f(x - 46)}" y="${f(gy - 130)}" width="20" height="130" fill="#c8c8d0"/>`;
  g += `<g transform="translate(${f(cut * 70)} ${f(cut * cut * 40)}) rotate(${f(cut * 14)} ${f(x)} ${f(gy - 130)})"><rect x="${f(x - 46)}" y="${f(y0)}" width="92" height="130" fill="#a8a8b0"/><rect x="${f(x - 46)}" y="${f(y0)}" width="20" height="130" fill="#c8c8d0"/><rect x="${f(x - 46)}" y="${f(y0 + 20)}" width="92" height="16" fill="#e0b44a"/></g>`;
  if (mark) g += `<rect x="${f(x - 56)}" y="${f(gy - 134)}" width="112" height="6" fill="#fff" opacity="0.8"/>`; return g; }
// the bus stop at night: shelter, ad panel, bench, buildings with lit windows, a street lamp (o.lampAng = falling)
export function busStop(tt, o = {}) { const FLOOR = 870, lt = o.t || 0;
  let back = sky('#0a0c22', '#2a1a3a', -300, FLOOR) + stars(30, -400, 2300, -250, 200, 17, lt) + moon(300, 120, 50, lt, { col: '#e83a4a' });
  back += skyline(FLOOR - 20, lt * 0.6, { night: true, seed: 51, shops: true, s: 0.78 });
  let mid = `<g transform="translate(900 ${FLOOR})"><rect x="-320" y="-400" width="640" height="20" fill="#5a6070"/><rect x="-310" y="-380" width="10" height="380" fill="#5a6070"/><rect x="300" y="-380" width="10" height="380" fill="#5a6070"/><rect x="-300" y="-380" width="600" height="300" fill="#bfe4ff" opacity="0.14"/><rect x="40" y="-360" width="240" height="260" fill="#ffe8a8" opacity="0.85"/><rect x="60" y="-340" width="200" height="120" fill="${RED}" opacity="0.7"/><text x="160" y="-180" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#2a2d3a">SALE</text><rect x="-280" y="-130" width="280" height="16" rx="6" fill="#8a93a8"/><rect x="-260" y="-114" width="10" height="114" fill="#5a6070"/><rect x="-30" y="-114" width="10" height="114" fill="#5a6070"/></g>`;
  mid += lampPost(1500, FLOOR, 560, o.lampAng || 0, o.lampAng ? 0.4 : 1);
  let floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="#2a2e3e"/><rect x="-800" y="${FLOOR}" width="3520" height="36" fill="#4a4e5e"/>` + [...Array(10)].map((_, i) => `<rect x="${-500 + i * 300 - (lt * 40) % 300}" y="${FLOOR + 170}" width="140" height="10" fill="#e8e0a0" opacity="0.45"/>`).join('');
  return { bg: '#0a0c22', back, mid, floor, FLOOR, blur: 1.8, reflect: false, tex: 0.18, vig: 0.6 };
}
// the quarry: terraced rock walls, a crane, an old sign, the gate, gravel, chalk circles. o.time 'day'|'sunset'|'night'|'dawn'
export function quarry(tt, o = {}) { const FLOOR = 880, lt = o.t || 0, time = o.time || 'day';
  const SK = { day: ['#7ab8e8', '#f0e8d0'], sunset: ['#4a3a7a', '#ff9a5a'], night: ['#12040a', '#5a1020'], dawn: ['#3a4a7a', '#ffc89a'] }[time];
  let back = sky(SK[0], SK[1], -300, FLOOR) + (time === 'night' ? stars(40, -400, 2300, -250, 300, 23, lt) + moon(1380, 200, o.moonR || 120, lt) : time === 'day' ? clouds(4, -100, 200, lt, '#fff', 0.8, 2, 14) + birds(3, 40, lt) : clouds(4, 0, 300, lt, time === 'sunset' ? '#ffb08a' : '#ffd0b0', 0.5, 6, 10));
  const rock = time === 'night' ? ['#3a1a22', '#2a1218', '#4a2228'] : ['#b89a7a', '#a08060', '#c8aa88'];
  back += `<path d="M -800 ${FLOOR - 120} L -800 140 L -300 160 L -280 300 L 200 320 L 220 460 L 700 480 L 720 620 L 1200 640 L 1220 760 L 2720 760 L 2720 ${FLOOR - 120} Z" fill="${rock[0]}"/><path d="M -800 140 L -300 160 L -300 180 L -800 170 Z M -280 300 L 200 320 L 200 340 L -280 324 Z M 220 460 L 700 480 L 700 500 L 220 484 Z M 720 620 L 1200 640 L 1200 660 L 720 644 Z" fill="${rock[2]}"/>`;
  back += `<path d="M 1300 ${FLOOR - 120} L 1500 320 L 1900 260 L 2720 300 L 2720 ${FLOOR - 120} Z" fill="${rock[1]}"/>`;
  if (o.cut) back += [...Array(26)].map((_, i) => cutLine(-600 + rnd(i) * 2200, 160 + rnd(i * 3) * 500, -600 + rnd(i) * 2200 + 120 + rnd(i * 5) * 200, 160 + rnd(i * 3) * 500 + (rnd(i * 7) - 0.5) * 120, 0.7)).join('');
  let mid = crane(1700, FLOOR - 60, 1, o.craneCut || 0) + `<g transform="translate(260 ${FLOOR - 40})${o.cut ? ' rotate(8)' : ''}"><rect x="-8" y="-200" width="16" height="200" fill="#5a4a3a"/><rect x="160" y="-200" width="16" height="200" fill="#5a4a3a"/><rect x="-30" y="-330" width="230" height="140" fill="${time === 'night' ? '#6a5a4a' : '#e8d8b0'}"/><text x="85" y="-270" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="34" fill="#2a2d3a">QUARRY</text><text x="85" y="-226" text-anchor="middle" font-family="IBM Plex Mono" font-weight="800" font-size="26" fill="${RED2}">NO ENTRY</text></g>`;
  if (o.gate) mid += `<g transform="translate(${o.gate} ${FLOOR})"><rect x="-10" y="-220" width="20" height="220" fill="#6a6a78"/><rect x="200" y="-220" width="20" height="220" fill="#6a6a78"/>${[...Array(6)].map((_, i) => `<line x1="${10 + i * 32}" y1="-200" x2="${10 + i * 32}" y2="-20" stroke="#8a8a98" stroke-width="5"/>`).join('')}<rect x="10" y="-200" width="190" height="10" fill="#8a8a98"/><rect x="10" y="-30" width="190" height="10" fill="#8a8a98"/></g>`;
  let floor = `<rect x="-800" y="${FLOOR}" width="3520" height="600" fill="${time === 'night' ? '#2a1418' : '#c8b498'}"/>` + [...Array(80)].map((_, i) => `<circle cx="${f(-700 + rnd(i) * 3300)}" cy="${f(FLOOR + 10 + rnd(i * 3) * 400)}" r="${f(3 + rnd(i * 5) * 5)}" fill="${time === 'night' ? '#4a2228' : '#a89478'}"/>`).join('');
  if (o.chalk) floor += `<ellipse cx="960" cy="${FLOOR + 90}" rx="760" ry="120" fill="none" stroke="#fff" stroke-width="7" opacity="0.8" stroke-dasharray="40 14"/><ellipse cx="960" cy="${FLOOR + 90}" rx="420" ry="66" fill="none" stroke="#fff" stroke-width="7" opacity="0.8"/>`;
  return { bg: SK[0], back, mid, floor, FLOOR, blur: 1.6, reflect: false, tex: 0.2, vig: time === 'night' ? 0.7 : 0.45 };
}
// a phone with a map: a red circle of radius r (meters label) around a point; o.pin = quarry pin
export function mapCard(lt, o = {}) { let g = `<rect width="1920" height="1080" fill="#1a1020"/><rect x="560" y="50" width="800" height="980" rx="64" fill="#15181e"/><rect x="590" y="100" width="740" height="880" rx="24" fill="#e8e4d8"/>`;
  const id = uid('mp'); g += `<defs><clipPath id="${id}"><rect x="590" y="100" width="740" height="880" rx="24"/></clipPath></defs><g clip-path="url(#${id})" transform="translate(${f(-lt * 6)} ${f(-lt * 4)})">`;
  for (let i = 0; i < 14; i++) g += `<line x1="${560 + i * 70}" y1="60" x2="${520 + i * 70}" y2="1080" stroke="#fff" stroke-width="${i % 4 ? 8 : 18}"/><line x1="560" y1="${80 + i * 72}" x2="1400" y2="${120 + i * 72}" stroke="#fff" stroke-width="${i % 3 ? 8 : 16}"/>`;
  for (let i = 0; i < 30; i++) g += `<rect x="${600 + rnd(i) * 700}" y="${120 + rnd(i * 3) * 820}" width="${30 + rnd(i * 5) * 40}" height="${30 + rnd(i * 7) * 40}" fill="#d0c8b8"/>`;
  g += `<path d="M 1000 100 Q 1100 400 1300 500" stroke="#9fd0f0" stroke-width="30" fill="none"/><rect x="600" y="700" width="220" height="160" rx="20" fill="#b8d8a0"/>`;
  const cx = o.cx || 960, cy = o.cy || 540, r = o.r || 120; g += `<circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="${RED}" opacity="0.18"/><circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="none" stroke="${RED}" stroke-width="6" stroke-dasharray="20 10"/><circle cx="${cx}" cy="${cy}" r="10" fill="${RED}"/>`;
  if (o.pin) g += `<g transform="translate(${o.pin[0]} ${o.pin[1]})"><path d="M 0 0 C -30 -40 -40 -60 -40 -80 A 40 40 0 1 1 40 -80 C 40 -60 30 -40 0 0 Z" fill="${BLUE}"/><circle cx="0" cy="-80" r="16" fill="#fff"/></g>`;
  g += `</g><rect x="590" y="100" width="740" height="90" fill="#15181e" opacity="0.85"/><text x="630" y="160" font-family="IBM Plex Mono" font-weight="800" font-size="34" fill="#fff">${o.title || 'MAP'}</text>`;
  return g; }
