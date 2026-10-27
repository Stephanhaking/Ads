// 2D props in the same flat style as the characters: solid fills, a darker outline, a soft highlight on the light side.
// Every function returns an SVG string; (x, y) is the bottom-centre of the prop on the stage unless noted, h its height in px.
const f = (n) => n.toFixed(1);
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * k)))); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); };
const OUT = '#1b1410';
const rr = (x, y, w, h, r, fill, o = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${fill}" ${o}/>`;

// glass jar with a lid; water fill and glowing oxygen dots
export function jar(x, y, h, o = {}) {
  const w = h * 0.78, s = h / 300, X = x - w / 2, Y = y - h;
  let g = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w * 0.55)}" ry="${f(10 * s)}" fill="#000" opacity="0.18"/>`;
  g += rr(X, Y + 22 * s, w, h - 22 * s, 26 * s, 'rgba(210,236,245,0.28)', `stroke="${OUT}" stroke-width="${f(5 * s)}"`);
  if (o.water) g += rr(X + 6 * s, Y + 70 * s, w - 12 * s, h - 76 * s, 20 * s, '#3d8fa8', 'opacity="0.78"') + `<rect x="${f(X + 6 * s)}" y="${f(Y + 70 * s)}" width="${f(w - 12 * s)}" height="${f(10 * s)}" fill="#8fd0e0" opacity="0.8"/>`;
  const n = o.dots ?? 0;
  for (let i = 0; i < n; i++) { const dx = ((i * 37) % 100) / 100, dy = ((i * 61) % 100) / 100; g += `<circle cx="${f(X + 24 * s + dx * (w - 48 * s))}" cy="${f(Y + 60 * s + dy * (h - 90 * s))}" r="${f(7 * s)}" fill="#7fd0ff" stroke="#e8f8ff" stroke-width="${f(2 * s)}"/>`; }
  g += `<path d="M ${f(X + 14 * s)} ${f(Y + 40 * s)} L ${f(X + 14 * s)} ${f(y - 30 * s)}" stroke="#fff" stroke-width="${f(7 * s)}" stroke-linecap="round" opacity="0.45"/>`;
  g += rr(X - 8 * s, Y, w + 16 * s, 30 * s, 8 * s, '#5b6168', `stroke="${OUT}" stroke-width="${f(5 * s)}"`) + rr(X - 2 * s, Y + 4 * s, w + 4 * s, 7 * s, 3 * s, '#9aa1a8');
  if (o.label) g += `<rect x="${f(x - 70 * s)}" y="${f(Y + h * 0.45)}" width="${f(140 * s)}" height="${f(40 * s)}" rx="${f(6 * s)}" fill="#f4ecdc" stroke="${OUT}" stroke-width="${f(3 * s)}"/><text x="${f(x)}" y="${f(Y + h * 0.45 + 28 * s)}" text-anchor="middle" font-family="Archivo, Inter" font-weight="800" font-size="${f(24 * s)}" fill="${OUT}">${o.label}</text>`;
  return g;
}
// one bucket (front view); x, y = bottom centre
export function bucket(x, y, h, col = '#3f8fbf') {
  const s = h / 100, w = 86 * s;
  return `<path d="M ${f(x - w / 2)} ${f(y - h)} L ${f(x + w / 2)} ${f(y - h)} L ${f(x + w * 0.38)} ${f(y)} L ${f(x - w * 0.38)} ${f(y)} Z" fill="${col}" stroke="${OUT}" stroke-width="${f(4 * s)}" stroke-linejoin="round"/>` +
    `<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w / 2)}" ry="${f(10 * s)}" fill="${shade(col, 0.55)}" stroke="${OUT}" stroke-width="${f(4 * s)}"/><ellipse cx="${f(x)}" cy="${f(y - h + 3 * s)}" rx="${f(w * 0.4)}" ry="${f(6 * s)}" fill="#6fc2e0"/>` +
    `<path d="M ${f(x - w / 2)} ${f(y - h)} Q ${f(x)} ${f(y - h - 46 * s)} ${f(x + w / 2)} ${f(y - h)}" stroke="${OUT}" stroke-width="${f(4 * s)}" fill="none"/>` +
    `<path d="M ${f(x - w * 0.34)} ${f(y - h * 0.8)} L ${f(x - w * 0.28)} ${f(y - h * 0.15)}" stroke="#fff" stroke-width="${f(5 * s)}" opacity="0.35" stroke-linecap="round"/>`;
}
// platform scale with a dial and stacked crates; x, y = bottom centre of the platform
export function scale(x, y, h, o = {}) {
  const s = h / 300; let g = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(150 * s)}" ry="${f(14 * s)}" fill="#000" opacity="0.2"/>`;
  g += rr(x - 140 * s, y - 34 * s, 280 * s, 34 * s, 10 * s, '#5e6670', `stroke="${OUT}" stroke-width="${f(5 * s)}"`);
  g += rr(x + 104 * s, y - 280 * s, 20 * s, 250 * s, 6 * s, '#4b525a', `stroke="${OUT}" stroke-width="${f(4 * s)}"`);
  g += `<circle cx="${f(x + 114 * s)}" cy="${f(y - 290 * s)}" r="${f(56 * s)}" fill="#f4ecdc" stroke="${OUT}" stroke-width="${f(5 * s)}"/>`;
  const a = -2.2 + Math.min(1, (o.k ?? 0)) * 4.4; g += `<line x1="${f(x + 114 * s)}" y1="${f(y - 290 * s)}" x2="${f(x + 114 * s + Math.sin(a) * 42 * s)}" y2="${f(y - 290 * s - Math.cos(a) * 42 * s)}" stroke="#d7443b" stroke-width="${f(5 * s)}" stroke-linecap="round"/>`;
  if (o.readout) g += `<text x="${f(x + 114 * s)}" y="${f(y - 255 * s)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${f(20 * s)}" fill="${OUT}">${o.readout}</text>`;
  const n = o.crates ?? 0;
  for (let i = 0; i < n; i++) { const cx = x - 50 * s + (i % 2) * 100 * s - (i % 2 ? 0 : 0), cy = y - 34 * s - Math.floor(i / 2) * 76 * s; g += rr(cx - 46 * s, cy - 74 * s, 92 * s, 74 * s, 6 * s, '#c9955a', `stroke="${OUT}" stroke-width="${f(4 * s)}"`) + `<path d="M ${f(cx - 40 * s)} ${f(cy - 37 * s)} L ${f(cx + 40 * s)} ${f(cy - 37 * s)}" stroke="${shade('#c9955a', 0.7)}" stroke-width="${f(4 * s)}"/>`; }
  return g;
}
// a bar (x = centre, y = base)
export function bar(x, y, w, h, col, label) {
  return rr(x - w / 2, y - h, w, h, 10, col, `stroke="${OUT}" stroke-width="5"`) + rr(x - w / 2 + 8, y - h + 8, 10, Math.max(0, h - 16), 5, '#fff', 'opacity="0.25"') + (label ? `<text x="${f(x)}" y="${f(y - h - 16)}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="${f(Math.max(22, w * 0.34))}" fill="#fff" stroke="${OUT}" stroke-width="5" paint-order="stroke">${label}</text>` : '');
}
// trout in side view (nose toward +x unless flip); x, y = body centre; L = length px
export function fish(x, y, L, o = {}) {
  const s = L / 600, sg = o.flip ? -1 : 1, T = (dx, dy) => `${f(x + sg * dx * s)} ${f(y + dy * s)}`;
  const wig = Math.sin((o.t || 0) * 5) * 14;
  let g = `<g>`;
  g += `<path d="M ${T(-250, 0)} L ${T(-320, -70 + wig)} L ${T(-300, 0)} L ${T(-320, 70 + wig)} Z" fill="#7d8a55" stroke="${OUT}" stroke-width="${f(6 * s)}" stroke-linejoin="round"/>`;
  g += `<path d="M ${T(-260, 0)} C ${T(-180, -95)} ${T(160, -110)} ${T(300, -10)} Q ${T(314, 0)} ${T(296, 12)} C ${T(150, 95)} ${T(-180, 85)} ${T(-260, 0)} Z" fill="#9aa86a" stroke="${OUT}" stroke-width="${f(6 * s)}"/>`;
  g += `<path d="M ${T(-240, 20)} C ${T(-120, 80)} ${T(150, 80)} ${T(290, 0)} C ${T(150, 95)} ${T(-180, 85)} ${T(-240, 20)} Z" fill="#e8e2cc"/>`;
  g += `<path d="M ${T(-230, 4)} C ${T(-80, 16)} ${T(120, 14)} ${T(260, -4)}" stroke="#c97a8a" stroke-width="${f(14 * s)}" opacity="0.55" fill="none"/>`;
  for (let i = 0; i < 22; i++) g += `<circle cx="${f(x + sg * (-200 + (i * 47) % 420) * s)}" cy="${f(y + (-70 + (i * 29) % 60) * s)}" r="${f(6 * s)}" fill="#2f3324"/>`;
  g += `<path d="M ${T(-40, -92)} L ${T(20, -150)} L ${T(70, -100)} Z" fill="#7d8a55" stroke="${OUT}" stroke-width="${f(5 * s)}" stroke-linejoin="round"/>`;
  g += `<path d="M ${T(30, 60)} L ${T(0, 115)} L ${T(80, 70)} Z" fill="#7d8a55" stroke="${OUT}" stroke-width="${f(5 * s)}" stroke-linejoin="round"/>`;
  const gc = o.gill ? '#4a8cff' : OUT; g += `<path d="M ${T(150, -60)} Q ${T(115, 0)} ${T(150, 62)}" stroke="${gc}" stroke-width="${f((o.gill ? 10 : 6) * s)}" fill="none" stroke-linecap="round"/>`;
  g += `<circle cx="${f(x + sg * 235 * s)}" cy="${f(y - 22 * s)}" r="${f(20 * s)}" fill="#fff" stroke="${OUT}" stroke-width="${f(4 * s)}"/><circle cx="${f(x + sg * 240 * s)}" cy="${f(y - 22 * s)}" r="${f(11 * s)}" fill="${OUT}"/>`;
  g += `<path d="M ${T(285, 10)} Q ${T(268, 22)} ${T(250, 18)}" stroke="${OUT}" stroke-width="${f(5 * s)}" fill="none"/>`;
  return g + `</g>`;
}
// gill arch diagram: filaments with opposed flows (water in blue one way, blood in red the other); x, y = centre; W = width px
export function gills(x, y, W, t = 0) {
  const s = W / 900; let g = rr(x - 470 * s, y - 230 * s, 940 * s, 460 * s, 30 * s, 'rgba(10,20,26,0.72)', `stroke="#9fd8ea" stroke-width="${f(3 * s)}" opacity="1"`);
  g += `<path d="M ${f(x - 380 * s)} ${f(y - 90 * s)} Q ${f(x)} ${f(y - 200 * s)} ${f(x + 380 * s)} ${f(y - 90 * s)}" stroke="#d9a58e" stroke-width="${f(26 * s)}" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i <= 18; i++) { const u = i / 18, px = x - 380 * s + u * 760 * s, py = y - 90 * s - Math.sin(u * Math.PI) * 55 * s; g += `<path d="M ${f(px)} ${f(py)} L ${f(px)} ${f(py + 150 * s)}" stroke="#e0635a" stroke-width="${f(16 * s)}" stroke-linecap="round"/><path d="M ${f(px - 4 * s)} ${f(py + 10 * s)} L ${f(px - 4 * s)} ${f(py + 140 * s)}" stroke="#fff" stroke-width="${f(3 * s)}" opacity="0.4"/>`; }
  const arrow = (y0, dir, col, lbl) => { let q = ''; for (let i = 0; i < 4; i++) { const ph = ((t * 0.5 + i / 4) % 1); const ax = x + dir * (-420 + ph * 840) * s; q += `<path d="M ${f(ax - dir * 50 * s)} ${f(y0)} L ${f(ax)} ${f(y0)}" stroke="${col}" stroke-width="${f(12 * s)}" stroke-linecap="round"/><path d="M ${f(ax)} ${f(y0 - 18 * s)} L ${f(ax + dir * 26 * s)} ${f(y0)} L ${f(ax)} ${f(y0 + 18 * s)} Z" fill="${col}"/>`; } return q + `<text x="${f(x + dir * -400 * s)}" y="${f(y0 + 48 * s)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${f(26 * s)}" fill="${col}">${lbl}</text>`; };
  g += arrow(y + 120 * s, 1, '#5fb4ff', 'WATER →') + arrow(y + 185 * s, -1, '#ff6b5e', '← BLOOD');
  return g;
}
// bronchial tree diagram from projected segments: segs [{a:[x,y], b:[x,y], w}], sacs [{c:[x,y], r}]; style flags
export function lungs(segs, sacs, o = {}) {
  const air = o.stale ? '#8c8f96' : '#4a8cff', sac = o.saline ? '#bfe3ef' : '#f2a6a0';
  let g = '';
  for (const c of sacs) g += `<circle cx="${f(c.c[0] + 3)}" cy="${f(c.c[1] - 3)}" r="${f(c.r + 2)}" fill="#ffd2a0" opacity="0.6"/>`;
  for (const c of sacs) g += `<circle cx="${f(c.c[0])}" cy="${f(c.c[1])}" r="${f(c.r)}" fill="${sac}" stroke="${OUT}" stroke-width="3"/><circle cx="${f(c.c[0] - c.r * 0.35)}" cy="${f(c.c[1] - c.r * 0.35)}" r="${f(c.r * 0.25)}" fill="#fff" opacity="0.45"/>`;
  for (const sg of segs) g += `<line x1="${f(sg.a[0])}" y1="${f(sg.a[1])}" x2="${f(sg.b[0])}" y2="${f(sg.b[1])}" stroke="${OUT}" stroke-width="${f(sg.w + 6)}" stroke-linecap="round"/>`;
  for (const sg of segs) g += `<line x1="${f(sg.a[0])}" y1="${f(sg.a[1])}" x2="${f(sg.b[0])}" y2="${f(sg.b[1])}" stroke="${air}" stroke-width="${f(sg.w)}" stroke-linecap="round"/>`;
  if (o.glow) for (const sg of segs) g += `<line x1="${f(sg.a[0])}" y1="${f(sg.a[1])}" x2="${f(sg.b[0])}" y2="${f(sg.b[1])}" stroke="#bfe0ff" stroke-width="${f(sg.w * 0.35)}" stroke-linecap="round" opacity="${o.glow}"/>`;
  return g;
}
// lab props
export function gauge(x, y, r, atm = 0) {
  let g = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r + 8)}" fill="#8f979e" stroke="${OUT}" stroke-width="5"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#f4ecdc"/>`;
  for (let i = 0; i <= 8; i++) { const a = (-135 + i * 33.75) * Math.PI / 180; g += `<line x1="${f(x + Math.sin(a) * r * 0.78)}" y1="${f(y - Math.cos(a) * r * 0.78)}" x2="${f(x + Math.sin(a) * r * 0.92)}" y2="${f(y - Math.cos(a) * r * 0.92)}" stroke="${OUT}" stroke-width="3"/>`; }
  const a = (-135 + (Math.min(160, atm) / 160) * 270) * Math.PI / 180;
  g += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.sin(a) * r * 0.8)}" y2="${f(y - Math.cos(a) * r * 0.8)}" stroke="#d7443b" stroke-width="6" stroke-linecap="round"/><circle cx="${f(x)}" cy="${f(y)}" r="7" fill="${OUT}"/>`;
  return g + `<text x="${f(x)}" y="${f(y + r * 0.55)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${f(r * 0.22)}" fill="${OUT}">${Math.round(atm)} atm</text>`;
}
export function chamber(x, y, w) {
  const h = w * 0.62; return rr(x - w / 2, y - h, w, h, h / 2, '#a6afb7', `stroke="${OUT}" stroke-width="6"`) + rr(x - w / 2 + 14, y - h + 12, w - 28, 14, 7, '#fff', 'opacity="0.35"') +
    `<circle cx="${f(x)}" cy="${f(y - h / 2)}" r="${f(h * 0.26)}" fill="#bfe0ea" stroke="${OUT}" stroke-width="6"/>` + [-0.42, 0.42].map((k) => rr(x + k * w - 8, y - h - 6, 16, h + 12, 6, '#7d868e', `stroke="${OUT}" stroke-width="4"`)).join('');
}
export function mouse(x, y, s, o = {}) {
  return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(34 * s)}" ry="${f(20 * s)}" fill="#efe9df" stroke="${OUT}" stroke-width="${f(3 * s)}"/><circle cx="${f(x + 30 * s)}" cy="${f(y - 8 * s)}" r="${f(15 * s)}" fill="#efe9df" stroke="${OUT}" stroke-width="${f(3 * s)}"/>` +
    `<circle cx="${f(x + 26 * s)}" cy="${f(y - 24 * s)}" r="${f(8 * s)}" fill="#f2b8b4" stroke="${OUT}" stroke-width="${f(2.5 * s)}"/><circle cx="${f(x + 37 * s)}" cy="${f(y - 10 * s)}" r="${f(3 * s)}" fill="${OUT}"/>` +
    `<path d="M ${f(x - 32 * s)} ${f(y + 4 * s)} q ${f(-24 * s)} ${f(6 * s)} ${f(-30 * s)} ${f(-14 * s)}" stroke="#e7a9a4" stroke-width="${f(4 * s)}" fill="none" stroke-linecap="round"/>`;
}
export function tank(x, y, w, o = {}) {
  const h = w * 0.6, liq = o.pfc ? '#f2efe2' : '#bfe7f0';
  let g = rr(x - w / 2 + 6, y - h * 0.82, w - 12, h * 0.82 - 6, 10, liq, 'opacity="0.8"');
  if (o.mice !== false) [[-0.25, 0.12, 0.9], [0.12, 0.22, 0.8], [0.3, 0.1, 0.85]].forEach(([dx, dy, k], i) => { g += mouse(x + dx * w, y - h * (0.25 + dy) + Math.sin((o.t || 0) * 2 + i) * 3, (w / 420) * k); });
  for (let i = 0; i < (o.co2 || 0); i++) g += `<circle cx="${f(x - w * 0.4 + ((i * 53) % 80) / 100 * w)}" cy="${f(y - 20 - ((i * 37) % 40) / 100 * h)}" r="7" fill="#7d6a6a" stroke="${OUT}" stroke-width="2"/>`;
  g += rr(x - w / 2, y - h, w, h, 12, 'rgba(210,236,245,0.18)', `stroke="${OUT}" stroke-width="6"`) + rr(x - w / 2 + 14, y - h + 14, 12, h - 28, 6, '#fff', 'opacity="0.35"');
  return g;
}
export function flask(x, y, h, liq = '#f2efe2') {
  const r = h * 0.32; return `<path d="M ${f(x - h * 0.08)} ${f(y - h)} L ${f(x - h * 0.08)} ${f(y - 2 * r)} A ${f(r)} ${f(r)} 0 1 0 ${f(x + h * 0.08)} ${f(y - 2 * r)} L ${f(x + h * 0.08)} ${f(y - h)} Z" fill="rgba(210,236,245,0.25)" stroke="${OUT}" stroke-width="6"/>` +
    `<path d="M ${f(x - r * 0.92)} ${f(y - r * 0.9)} A ${f(r * 0.92)} ${f(r * 0.92)} 0 0 0 ${f(x + r * 0.92)} ${f(y - r * 0.9)} Z" fill="${liq}" opacity="0.9"/>`;
}
export function thermometer(x, y, h, level = 1) {
  const w = h * 0.1; return rr(x - w / 2, y - h, w, h, w / 2, '#f4f8fa', `stroke="${OUT}" stroke-width="5"`) + rr(x - w * 0.2, y - 20 - (h - 40) * level, w * 0.4, (h - 40) * level + 10, w * 0.2, '#d7443b') +
    `<circle cx="${f(x)}" cy="${f(y - 10)}" r="${f(w * 0.85)}" fill="#d7443b" stroke="${OUT}" stroke-width="5"/>`;
}
export function lungPair(x, y, h, col = '#ec8f8a') {
  const w = h * 0.42; return [-1, 1].map((sx) => `<path d="M ${f(x + sx * 8)} ${f(y - h * 0.82)} C ${f(x + sx * w * 1.6)} ${f(y - h * 0.9)} ${f(x + sx * w * 1.5)} ${f(y)} ${f(x + sx * w * 0.5)} ${f(y - h * 0.05)} C ${f(x + sx * 8)} ${f(y - h * 0.1)} ${f(x + sx * 8)} ${f(y - h * 0.5)} ${f(x + sx * 8)} ${f(y - h * 0.82)} Z" fill="${col}" stroke="${OUT}" stroke-width="5"/>`).join('') +
    rr(x - h * 0.05, y - h, h * 0.1, h * 0.3, h * 0.05, '#f2d0c8', `stroke="${OUT}" stroke-width="4"`);
}
export { shade };

// ---- story props
export function bathtub(x, y, w, o = {}) {
  const h = w * 0.36; let g = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w * 0.52)}" ry="${f(h * 0.12)}" fill="#000" opacity="0.18"/>`;
  g += `<path d="M ${f(x - w / 2)} ${f(y - h)} L ${f(x + w / 2)} ${f(y - h)} L ${f(x + w * 0.44)} ${f(y - h * 0.12)} Q ${f(x)} ${f(y + h * 0.05)} ${f(x - w * 0.44)} ${f(y - h * 0.12)} Z" fill="#f4f6f8" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>`;
  g += rr(x - w / 2 - 10, y - h - 14, w + 20, 22, 11, '#ffffff', `stroke="${OUT}" stroke-width="5"`);
  g += rr(x - w * 0.46, y - h + 8, w * 0.92, 18, 9, '#7cc6e0', 'opacity="0.9"');
  for (let i = 0; i < (o.bubbles || 0); i++) { const k = ((o.t || 0) * 0.8 + i / (o.bubbles || 1)) % 1; g += `<circle cx="${f(x - w * 0.2 + ((i * 47) % 40) / 100 * w)}" cy="${f(y - h - 6 - k * 120)}" r="${f(6 + 6 * k)}" fill="none" stroke="#dff6ff" stroke-width="3" opacity="${f(1 - k)}"/>`; }
  for (const sx of [-0.36, 0.36]) g += rr(x + sx * w - 10, y - 18, 20, 22, 6, '#c9a14a', `stroke="${OUT}" stroke-width="4"`);
  return g;
}
export function bed(x, y, w) {
  const h = w * 0.42; return rr(x - w / 2, y - h * 0.55, w, h * 0.55, 14, '#7a5a40', `stroke="${OUT}" stroke-width="6"`) + rr(x - w / 2 + 8, y - h * 0.78, w - 16, h * 0.3, 18, '#3f5f9e', `stroke="${OUT}" stroke-width="5"`) +
    rr(x - w / 2 + 18, y - h * 0.95, w * 0.26, h * 0.22, 16, '#f4ecdc', `stroke="${OUT}" stroke-width="5"`) + rr(x - w / 2 - 6, y - h * 1.15, 26, h * 1.15, 10, '#6e4527', `stroke="${OUT}" stroke-width="5"`);
}
export function sign(x, y, h, text, col = '#e0b44a') {
  const w = h * 1.1; return rr(x - 6, y - h * 1.6, 12, h * 1.6, 5, '#6e4527', `stroke="${OUT}" stroke-width="4"`) + rr(x - w / 2, y - h * 1.6, w, h * 0.7, 10, col, `stroke="${OUT}" stroke-width="5"`) +
    `<text x="${f(x)}" y="${f(y - h * 1.6 + h * 0.46)}" text-anchor="middle" font-family="Archivo, Inter" font-weight="900" font-size="${f(h * 0.2)}" fill="${OUT}">${text}</text>`;
}
// phone screen with a message bubble (stage-space card)
export function phone(x, y, h, lines = [], o = {}) {
  const w = h * 0.5; let g = rr(x - w / 2, y - h, w, h, w * 0.14, '#16171c', `stroke="#ffd29a" stroke-width="4"`) + rr(x - w / 2 + 10, y - h + 28, w - 20, h - 56, 12, '#0f2233');
  g += `<text x="${f(x)}" y="${f(y - h + 64)}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${f(w * 0.08)}" fill="#9fb3c8">${o.from || 'Unknown number'}</text>`;
  lines.forEach((l, i) => { g += rr(x - w / 2 + 22, y - h + 90 + i * (w * 0.2), w - 44, w * 0.16, 14, '#2f6fdb') + `<text x="${f(x - w / 2 + 36)}" y="${f(y - h + 90 + i * (w * 0.2) + w * 0.105)}" font-family="Inter" font-weight="600" font-size="${f(w * 0.062)}" fill="#fff">${l}</text>`; });
  return g;
}

// ---- forward-in-time props
// round wall clock; (x, y) is the CENTRE, r the radius; hours/minutes as numbers (minutes may be fractional)
export function wallClock(x, y, r, hh = 3, mm = 0) {
  let g = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#f7f3ea" stroke="${OUT}" stroke-width="${f(Math.max(4, r * 0.08))}"/>`;
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g += `<line x1="${f(x + Math.sin(a) * r * 0.78)}" y1="${f(y - Math.cos(a) * r * 0.78)}" x2="${f(x + Math.sin(a) * r * 0.9)}" y2="${f(y - Math.cos(a) * r * 0.9)}" stroke="${OUT}" stroke-width="${f(r * 0.05)}" stroke-linecap="round"/>`; }
  const am = (mm / 60) * Math.PI * 2, ah = (((hh % 12) + mm / 60) / 12) * Math.PI * 2;
  g += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.sin(ah) * r * 0.5)}" y2="${f(y - Math.cos(ah) * r * 0.5)}" stroke="${OUT}" stroke-width="${f(r * 0.09)}" stroke-linecap="round"/>`;
  g += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.sin(am) * r * 0.74)}" y2="${f(y - Math.cos(am) * r * 0.74)}" stroke="${OUT}" stroke-width="${f(r * 0.06)}" stroke-linecap="round"/>`;
  return g + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.07)}" fill="#e2553f"/>`;
}
// lab atomic clock: a rack box with a glowing digital readout (bottom-centre x, y; height h)
export function atomicClock(x, y, h, text = '12:00:00.000000', o = {}) {
  const w = h * 1.5; let g = rr(x - w / 2, y - h, w, h, h * 0.06, o.col || '#c9ced6', `stroke="${OUT}" stroke-width="5"`);
  g += rr(x - w * 0.42, y - h * 0.82, w * 0.84, h * 0.3, 8, '#0c1a14', `stroke="${OUT}" stroke-width="3"`);
  g += `<text x="${f(x)}" y="${f(y - h * 0.6)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${f(h * 0.13)}" fill="#7dffb0">${text}</text>`;
  for (let i = 0; i < 4; i++) g += `<circle cx="${f(x - w * 0.3 + i * w * 0.2)}" cy="${f(y - h * 0.3)}" r="${f(h * 0.05)}" fill="${['#e2553f', '#e0b44a', '#4f8a5b', '#2f6fdb'][i]}" stroke="${OUT}" stroke-width="3"/>`;
  if (o.label) g += `<text x="${f(x)}" y="${f(y - h * 0.08)}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="${f(h * 0.1)}" fill="${OUT}">${o.label}</text>`;
  return g;
}
// side view airliner, nose to +x (centre x, y; length L)
export function plane(x, y, L, o = {}) {
  const h = L * 0.13, c = o.col || '#f4f6f8'; let g = '';
  g += `<path d="M ${f(x - L * 0.1)} ${f(y)} L ${f(x - L * 0.32)} ${f(y + h * 1.9)} L ${f(x - L * 0.2)} ${f(y + h * 1.9)} L ${f(x + L * 0.08)} ${f(y)} Z" fill="${shade(c, 0.85)}" stroke="${OUT}" stroke-width="4"/>`;
  g += `<path d="M ${f(x - L * 0.5)} ${f(y - h * 0.3)} L ${f(x - L * 0.47)} ${f(y - h * 2.2)} L ${f(x - L * 0.38)} ${f(y - h * 2.2)} L ${f(x - L * 0.3)} ${f(y - h * 0.4)} Z" fill="${o.tail || '#e2553f'}" stroke="${OUT}" stroke-width="4"/>`;
  g += `<path d="M ${f(x - L * 0.5)} ${f(y - h * 0.5)} Q ${f(x - L * 0.5)} ${f(y + h * 0.5)} ${f(x - L * 0.35)} ${f(y + h * 0.5)} L ${f(x + L * 0.38)} ${f(y + h * 0.5)} Q ${f(x + L * 0.5)} ${f(y + h * 0.45)} ${f(x + L * 0.5)} ${f(y)} Q ${f(x + L * 0.47)} ${f(y - h * 0.5)} ${f(x + L * 0.35)} ${f(y - h * 0.5)} Z" fill="${c}" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 12; i++) g += `<circle cx="${f(x - L * 0.3 + i * L * 0.055)}" cy="${f(y - h * 0.1)}" r="${f(h * 0.12)}" fill="#3a4b5e"/>`;
  g += `<path d="M ${f(x + L * 0.42)} ${f(y - h * 0.35)} L ${f(x + L * 0.47)} ${f(y - h * 0.2)} L ${f(x + L * 0.41)} ${f(y - h * 0.2)} Z" fill="#3a4b5e"/>`;
  g += `<path d="M ${f(x - L * 0.05)} ${f(y + h * 0.2)} L ${f(x - L * 0.22)} ${f(y + h * 0.75)} L ${f(x - L * 0.12)} ${f(y + h * 0.75)} L ${f(x + L * 0.06)} ${f(y + h * 0.2)} Z" fill="${shade(c, 0.75)}" stroke="${OUT}" stroke-width="4"/>`;
  g += rr(x - L * 0.17, y + h * 0.55, L * 0.12, h * 0.45, h * 0.2, '#9aa3ad', `stroke="${OUT}" stroke-width="3"`);
  return g;
}
// GPS-like satellite (centre x, y; span w), slowly rotating panels
export function satellite(x, y, w, t = 0) {
  const b = w * 0.16; let g = '';
  for (const s of [-1, 1]) { g += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + s * w * 0.18)}" y2="${f(y)}" stroke="${OUT}" stroke-width="4"/>`; const px = s > 0 ? x + w * 0.18 : x - w * 0.5; g += rr(px, y - b * 0.55, w * 0.32, b * 1.1, 4, '#2f4f8f', `stroke="${OUT}" stroke-width="4"`); for (let i = 1; i < 4; i++) g += `<line x1="${f(px + i * w * 0.08)}" y1="${f(y - b * 0.55)}" x2="${f(px + i * w * 0.08)}" y2="${f(y + b * 0.55)}" stroke="#8fb0e8" stroke-width="2"/>`; }
  g += rr(x - b * 0.7, y - b * 0.9, b * 1.4, b * 1.8, 6, '#e0b44a', `stroke="${OUT}" stroke-width="5"`);
  g += `<circle cx="${f(x)}" cy="${f(y + b * 1.15)}" r="${f(b * 0.35)}" fill="#c9ced6" stroke="${OUT}" stroke-width="3"/>`;
  return `<g transform="rotate(${f(Math.sin(t * 0.3) * 6)} ${f(x)} ${f(y)})">${g}</g>`;
}
// space station: truss with solar arrays and modules (centre x, y; span w)
export function station(x, y, w) {
  let g = rr(x - w * 0.5, y - w * 0.012, w, w * 0.024, 3, '#9aa3ad', `stroke="${OUT}" stroke-width="3"`);
  for (const s of [-0.42, -0.3, 0.3, 0.42]) for (const d of [-1, 1]) { g += rr(x + s * w - w * 0.045, d > 0 ? y + w * 0.015 : y - w * 0.2, w * 0.09, w * 0.185, 3, '#3f5f8f', `stroke="${OUT}" stroke-width="3"`); }
  g += rr(x - w * 0.16, y - w * 0.035, w * 0.32, w * 0.07, w * 0.03, '#eceef0', `stroke="${OUT}" stroke-width="4"`);
  g += rr(x - w * 0.03, y - w * 0.12, w * 0.06, w * 0.24, w * 0.025, '#e2e5e8', `stroke="${OUT}" stroke-width="4"`);
  for (const s of [-0.12, 0.12]) g += rr(x + s * w - w * 0.03, y - w * 0.05, w * 0.06, w * 0.1, 3, '#d9a14a', `stroke="${OUT}" stroke-width="3"`);
  return g;
}
// small spaceship, nose to +x (centre x, y; length L), with an engine glow
export function ship(x, y, L, t = 0, o = {}) {
  const h = L * 0.22; let g = '';
  if (o.glow !== false) { const k = 0.8 + 0.2 * Math.sin(t * 20); g += `<ellipse cx="${f(x - L * 0.56)}" cy="${f(y)}" rx="${f(L * 0.18 * k)}" ry="${f(h * 0.3)}" fill="#8fd8ff" opacity="0.85"/><ellipse cx="${f(x - L * 0.53)}" cy="${f(y)}" rx="${f(L * 0.09 * k)}" ry="${f(h * 0.16)}" fill="#ffffff"/>`; }
  for (const s of [-1, 1]) g += `<path d="M ${f(x - L * 0.2)} ${f(y + s * h * 0.4)} L ${f(x - L * 0.48)} ${f(y + s * h * 1.3)} L ${f(x - L * 0.38)} ${f(y + s * h * 0.4)} Z" fill="#e2553f" stroke="${OUT}" stroke-width="4"/>`;
  g += `<path d="M ${f(x - L * 0.48)} ${f(y - h * 0.5)} L ${f(x + L * 0.2)} ${f(y - h * 0.5)} Q ${f(x + L * 0.5)} ${f(y - h * 0.3)} ${f(x + L * 0.52)} ${f(y)} Q ${f(x + L * 0.5)} ${f(y + h * 0.3)} ${f(x + L * 0.2)} ${f(y + h * 0.5)} L ${f(x - L * 0.48)} ${f(y + h * 0.5)} Z" fill="#eceef0" stroke="${OUT}" stroke-width="5"/>`;
  g += `<path d="M ${f(x + L * 0.18)} ${f(y - h * 0.38)} Q ${f(x + L * 0.38)} ${f(y - h * 0.3)} ${f(x + L * 0.42)} ${f(y - h * 0.05)} L ${f(x + L * 0.18)} ${f(y - h * 0.05)} Z" fill="#7fc4ff" stroke="${OUT}" stroke-width="3"/>`;
  return g;
}
export function pizza(x, y, w) {
  const h = w * 0.22; let g = `<ellipse cx="${f(x)}" cy="${f(y - h * 0.4)}" rx="${f(w * 0.52)}" ry="${f(h * 0.55)}" fill="#f2efe8" stroke="${OUT}" stroke-width="4"/>`;
  g += `<ellipse cx="${f(x)}" cy="${f(y - h * 0.5)}" rx="${f(w * 0.45)}" ry="${f(h * 0.45)}" fill="#e0a24a" stroke="${OUT}" stroke-width="4"/><ellipse cx="${f(x)}" cy="${f(y - h * 0.52)}" rx="${f(w * 0.38)}" ry="${f(h * 0.36)}" fill="#e2553f"/>`;
  for (let i = 0; i < 7; i++) g += `<ellipse cx="${f(x + Math.cos(i * 2.3) * w * 0.24)}" cy="${f(y - h * 0.52 + Math.sin(i * 2.3) * h * 0.22)}" rx="${f(w * 0.045)}" ry="${f(h * 0.08)}" fill="#a83a2a"/>`;
  for (let i = 0; i < 3; i++) g += `<path d="M ${f(x - w * 0.15 + i * w * 0.15)} ${f(y - h * 1.1)} q ${f(w * 0.04)} ${f(-h * 0.5)} 0 ${f(-h)} q ${f(-w * 0.04)} ${f(-h * 0.5)} 0 ${f(-h)}" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.7"/>`;
  return g;
}
export function busStop(x, y, h) {
  const w = h * 0.9; return rr(x - w / 2, y - h, 10, h, 4, '#4a5560', `stroke="${OUT}" stroke-width="3"`) + rr(x + w / 2 - 10, y - h, 10, h, 4, '#4a5560', `stroke="${OUT}" stroke-width="3"`) +
    rr(x - w / 2 - 10, y - h - 14, w + 20, 24, 8, '#2f6fdb', `stroke="${OUT}" stroke-width="4"`) + rr(x - w / 2 + 14, y - h * 0.85, w - 28, h * 0.6, 6, '#cfe6ef', `opacity="0.55" stroke="${OUT}" stroke-width="3"`) +
    rr(x - w * 0.3, y - h * 0.42, w * 0.6, h * 0.06, 4, '#7a5232', `stroke="${OUT}" stroke-width="3"`) + `<circle cx="${f(x + w / 2 + 30)}" cy="${f(y - h * 1.05)}" r="${f(h * 0.12)}" fill="#e0b44a" stroke="${OUT}" stroke-width="4"/><text x="${f(x + w / 2 + 30)}" y="${f(y - h * 1.0)}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${f(h * 0.13)}" fill="${OUT}">BUS</text>`;
}
// cockpit frame drawn over the whole stage (window opening in the middle), with a control panel at the bottom
export function cockpit(t = 0, o = {}) {
  const hull = '#2a2f38', edge = '#11141a';
  let g = `<path d="M 0 0 L 1920 0 L 1920 1080 L 0 1080 Z M 260 120 Q 960 40 1660 120 L 1780 640 Q 960 700 140 640 Z" fill="${hull}" fill-rule="evenodd" stroke="${edge}" stroke-width="10"/>`;
  g += `<line x1="960" y1="70" x2="960" y2="680" stroke="${hull}" stroke-width="26"/>`;
  g += `<path d="M 0 760 Q 960 640 1920 760 L 1920 1080 L 0 1080 Z" fill="#363c47" stroke="${edge}" stroke-width="8"/>`;
  for (let i = 0; i < 14; i++) { const x = 220 + i * 110, on = Math.sin(t * 3 + i * 1.7) > 0; g += `<circle cx="${x}" cy="${820 + (i % 2) * 40}" r="14" fill="${on ? ['#7dffb0', '#e0b44a', '#e2553f', '#7fc4ff'][i % 4] : '#1b1f26'}" stroke="${edge}" stroke-width="3"/>`; }
  if (o.speed) g += rr(760, 860, 400, 120, 14, '#0c1a14', `stroke="${edge}" stroke-width="5"`) + `<text x="960" y="905" text-anchor="middle" font-family="IBM Plex Mono" font-size="28" fill="#7dffb0" letter-spacing="3">SPEED</text><text x="960" y="955" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="44" fill="#7dffb0">${o.speed}</text>`;
  return g;
}
