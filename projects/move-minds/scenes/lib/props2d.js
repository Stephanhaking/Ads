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
// command module capsule (bottom-centre x, y; height h)
export function capsule(x, y, h) {
  const w = h * 1.1; return `<path d="M ${f(x - w / 2)} ${f(y)} L ${f(x - w * 0.12)} ${f(y - h)} L ${f(x + w * 0.12)} ${f(y - h)} L ${f(x + w / 2)} ${f(y)} Z" fill="#d9dde0" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>` +
    rr(x - w / 2 - 6, y - 10, w + 12, 18, 9, '#8a6a4a', `stroke="${OUT}" stroke-width="4"`) + `<circle cx="${f(x)}" cy="${f(y - h * 0.5)}" r="${f(h * 0.1)}" fill="#3a4b5e" stroke="${OUT}" stroke-width="3"/>`;
}
// a sugar cube (bottom-centre x, y; size s) with a few glowing atoms
export function sugarCube(x, y, s, atoms = 2, t = 0) {
  const d = s * 0.3; let g = `<path d="M ${f(x - s / 2)} ${f(y - s)} L ${f(x - s / 2 + d)} ${f(y - s - d)} L ${f(x + s / 2 + d)} ${f(y - s - d)} L ${f(x + s / 2)} ${f(y - s)} Z" fill="#ffffff" stroke="${OUT}" stroke-width="5"/>`;
  g += `<path d="M ${f(x + s / 2)} ${f(y - s)} L ${f(x + s / 2 + d)} ${f(y - s - d)} L ${f(x + s / 2 + d)} ${f(y - d)} L ${f(x + s / 2)} ${f(y)} Z" fill="#dfe4e8" stroke="${OUT}" stroke-width="5"/>`;
  g += rr(x - s / 2, y - s, s, s, 4, '#f4f6f8', `stroke="${OUT}" stroke-width="5" fill-opacity="0.55"`);
  for (let i = 0; i < atoms; i++) { const ax = x - s * 0.15 + i * s * 0.35 + Math.sin(t * 2 + i) * s * 0.05, ay = y - s * 0.5 + Math.cos(t * 1.7 + i * 2) * s * 0.15; g += `<circle cx="${f(ax)}" cy="${f(ay)}" r="${f(s * 0.06)}" fill="#e2553f" stroke="${OUT}" stroke-width="3"/><circle cx="${f(ax)}" cy="${f(ay)}" r="${f(s * 0.14)}" fill="#e2553f" opacity="0.25"/>`; }
  return g;
}
// a calendar page (bottom-centre x, y; height h)
export function calendar(x, y, h, top = 'EXAMS', big = 'MON') {
  const w = h * 0.8; return rr(x - w / 2, y - h, w, h, 10, '#ffffff', `stroke="${OUT}" stroke-width="5"`) + rr(x - w / 2, y - h, w, h * 0.28, 10, '#e2553f', `stroke="${OUT}" stroke-width="5"`) +
    `<text x="${f(x)}" y="${f(y - h * 0.8)}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${f(h * 0.15)}" fill="#fff">${top}</text><text x="${f(x)}" y="${f(y - h * 0.25)}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${f(h * 0.3)}" fill="${OUT}">${big}</text>`;
}

// ---- stop-time props
export function ball(x, y, r, col = '#e2553f', o = {}) { // centre x, y
  let g = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${col}" stroke="${OUT}" stroke-width="${f(Math.max(3, r * 0.08))}"/>`;
  g += `<path d="M ${f(x - r)} ${f(y)} Q ${f(x)} ${f(y - r * 0.35)} ${f(x + r)} ${f(y)}" fill="none" stroke="${shade(col, 0.7)}" stroke-width="${f(r * 0.08)}"/>`;
  g += `<ellipse cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.4)}" rx="${f(r * 0.25)}" ry="${f(r * 0.15)}" fill="#fff" opacity="0.45"/>`;
  if (o.streak) for (let i = 0; i < 3; i++) g += `<line x1="${f(x - r * (1.4 + i * 0.5))}" y1="${f(y - r * 0.4 + i * r * 0.4)}" x2="${f(x - r * (2.6 + i * 0.6))}" y2="${f(y - r * 0.4 + i * r * 0.4)}" stroke="#fff" stroke-width="${f(r * 0.1)}" stroke-linecap="round" opacity="0.7"/>`;
  return g;
}
// delivery van, side view, nose to -x (bottom-centre x, y; length L)
export function van(x, y, L, o = {}) {
  const h = L * 0.5, c = o.col || '#f2f2ee'; let g = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(L * 0.5)}" ry="${f(h * 0.06)}" fill="#000" opacity="0.25"/>`;
  g += `<path d="M ${f(x + L * 0.5)} ${f(y - h * 0.15)} L ${f(x + L * 0.5)} ${f(y - h)} L ${f(x - L * 0.18)} ${f(y - h)} Q ${f(x - L * 0.32)} ${f(y - h * 0.98)} ${f(x - L * 0.42)} ${f(y - h * 0.6)} L ${f(x - L * 0.5)} ${f(y - h * 0.5)} L ${f(x - L * 0.5)} ${f(y - h * 0.15)} Z" fill="${c}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  g += `<path d="M ${f(x - L * 0.2)} ${f(y - h * 0.92)} L ${f(x - L * 0.29)} ${f(y - h * 0.92)} L ${f(x - L * 0.39)} ${f(y - h * 0.6)} L ${f(x - L * 0.2)} ${f(y - h * 0.6)} Z" fill="#3a4b5e" stroke="${OUT}" stroke-width="3"/>`;
  g += rr(x - L * 0.1, y - h * 0.85, L * 0.5, h * 0.4, 6, o.stripe || '#2f6fdb') + `<text x="${f(x + L * 0.15)}" y="${f(y - h * 0.57)}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${f(h * 0.17)}" fill="#fff">${o.label || 'DELIVERY'}</text>`;
  for (const wx of [-0.3, 0.3]) g += `<circle cx="${f(x + wx * L)}" cy="${f(y - h * 0.15)}" r="${f(h * 0.17)}" fill="#22242a" stroke="${OUT}" stroke-width="4"/><circle cx="${f(x + wx * L)}" cy="${f(y - h * 0.15)}" r="${f(h * 0.07)}" fill="#9aa3ad"/>`;
  g += `<circle cx="${f(x - L * 0.48)}" cy="${f(y - h * 0.4)}" r="${f(h * 0.05)}" fill="#ffe2b0" stroke="${OUT}" stroke-width="2"/>`;
  return g;
}
export function bird(x, y, s, flap = 0) { const k = Math.sin(flap) * 0.6; return `<path d="M ${f(x - s)} ${f(y - s * k)} Q ${f(x - s * 0.5)} ${f(y - s * 0.4)} ${f(x)} ${f(y)} Q ${f(x + s * 0.5)} ${f(y - s * 0.4)} ${f(x + s)} ${f(y - s * k)}" fill="none" stroke="${OUT}" stroke-width="${f(s * 0.18)}" stroke-linecap="round"/>`; }
// bicycle, side view (bottom-centre x, y; wheelbase w)
export function bike(x, y, w, col = '#2f6fdb') {
  const r = w * 0.32; let g = '';
  for (const s of [-0.5, 0.5]) g += `<circle cx="${f(x + s * w)}" cy="${f(y - r)}" r="${f(r)}" fill="none" stroke="${OUT}" stroke-width="${f(w * 0.05)}"/>`;
  g += `<path d="M ${f(x - w * 0.5)} ${f(y - r)} L ${f(x - w * 0.05)} ${f(y - r)} L ${f(x - w * 0.15)} ${f(y - r * 2.1)} M ${f(x - w * 0.05)} ${f(y - r)} L ${f(x + w * 0.35)} ${f(y - r * 2.1)} L ${f(x + w * 0.5)} ${f(y - r)} M ${f(x - w * 0.15)} ${f(y - r * 2.1)} L ${f(x + w * 0.35)} ${f(y - r * 2.1)}" fill="none" stroke="${col}" stroke-width="${f(w * 0.06)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  return g;
}
// laser beam between two stage points, with a glow
export function beam(x1, y1, x2, y2, col = '#7dff8a', w = 6) { return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${col}" stroke-width="${f(w * 4)}" opacity="0.18" stroke-linecap="round"/><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="round"/>`; }
// crystal block (centre x, y; size s), glow k 0..1, optional stripes image inside
export function crystal(x, y, s, k = 0, stripes = false) {
  let g = `<path d="M ${f(x - s * 0.6)} ${f(y - s * 0.4)} L ${f(x - s * 0.3)} ${f(y - s * 0.6)} L ${f(x + s * 0.6)} ${f(y - s * 0.6)} L ${f(x + s * 0.3)} ${f(y - s * 0.4)} Z" fill="#cfe9f2" stroke="${OUT}" stroke-width="4"/>`;
  g += rr(x - s * 0.6, y - s * 0.4, s * 0.9, s * 0.8, 4, `rgba(170,220,240,${(0.55 + 0.35 * k).toFixed(2)})`, `stroke="${OUT}" stroke-width="4"`);
  g += `<path d="M ${f(x + s * 0.3)} ${f(y - s * 0.4)} L ${f(x + s * 0.6)} ${f(y - s * 0.6)} L ${f(x + s * 0.6)} ${f(y + s * 0.2)} L ${f(x + s * 0.3)} ${f(y + s * 0.4)} Z" fill="#9fc7d6" stroke="${OUT}" stroke-width="4"/>`;
  if (k > 0) g += `<rect x="${f(x - s * 0.55)}" y="${f(y - s * 0.12)}" width="${f(s * 0.8)}" height="${f(s * 0.24)}" fill="#7dff8a" opacity="${(0.5 * k).toFixed(2)}"/>`;
  if (stripes) for (let i = 0; i < 3; i++) g += rr(x - s * 0.45 + i * s * 0.25, y - s * 0.25, s * 0.1, s * 0.5, 2, '#7dff8a', 'opacity="0.9"');
  return g;
}
export function laserBox(x, y, h, col = '#2a2d33') { const w = h * 1.8; return rr(x - w / 2, y - h, w, h, 6, col, `stroke="#000" stroke-width="3"`) + `<circle cx="${f(x + w / 2)}" cy="${f(y - h / 2)}" r="${f(h * 0.18)}" fill="#7dff8a"/>`; }
// notebook page with handwritten rules (centre x, y; width w)
export function notebook(x, y, w, lines = [], o = {}) {
  const h = w * 1.25; let g = rr(x - w / 2, y - h / 2, w, h, 12, '#fffdf6', `stroke="${OUT}" stroke-width="5"`);
  for (let i = 0; i < 12; i++) g += `<line x1="${f(x - w * 0.44)}" y1="${f(y - h * 0.32 + i * h * 0.07)}" x2="${f(x + w * 0.44)}" y2="${f(y - h * 0.32 + i * h * 0.07)}" stroke="#bfd6ef" stroke-width="2"/>`;
  g += `<line x1="${f(x - w * 0.34)}" y1="${f(y - h * 0.48)}" x2="${f(x - w * 0.34)}" y2="${f(y + h * 0.48)}" stroke="#e2553f" stroke-width="2"/>`;
  g += `<text x="${f(x - w * 0.3)}" y="${f(y - h * 0.38)}" font-family="'Comic Sans MS', 'Patrick Hand', cursive" font-weight="700" font-size="${f(w * 0.075)}" fill="#1f3a8a">${o.title || 'RULES'}</text>`;
  lines.forEach((l, i) => { g += `<text x="${f(x - w * 0.3)}" y="${f(y - h * 0.25 + i * h * 0.14)}" font-family="'Comic Sans MS', 'Patrick Hand', cursive" font-size="${f(w * 0.06)}" fill="#1f3a8a">${l}</text>`; });
  return g;
}

// ---- invisible props
export function floatEyes(x, y, R, o = {}) { // centre between the eyes, head radius R
  const dx = R * 0.36, rx = R * 0.26, ry = R * 0.32, lx = (o.look || 0) * rx * 0.4; let g = '';
  for (const s of [-1, 1]) g += `<ellipse cx="${f(x + s * dx)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="#fff" stroke="${OUT}" stroke-width="${f(R * 0.05)}"/><circle cx="${f(x + s * dx + lx)}" cy="${f(y + ry * 0.15)}" r="${f(rx * 0.5)}" fill="#4f6fa8"/><circle cx="${f(x + s * dx + lx)}" cy="${f(y + ry * 0.15)}" r="${f(rx * 0.26)}" fill="#111"/><circle cx="${f(x + s * dx + lx - rx * 0.15)}" cy="${f(y - ry * 0.05)}" r="${f(rx * 0.1)}" fill="#fff"/>`;
  if (o.shades) g += `<path d="M ${f(x - dx - rx * 1.3)} ${f(y - ry * 0.7)} L ${f(x + dx + rx * 1.3)} ${f(y - ry * 0.7)} L ${f(x + dx + rx * 1.1)} ${f(y + ry * 0.7)} Q ${f(x + dx)} ${f(y + ry * 1.0)} ${f(x + dx * 0.25)} ${f(y + ry * 0.2)} L ${f(x - dx * 0.25)} ${f(y + ry * 0.2)} Q ${f(x - dx)} ${f(y + ry * 1.0)} ${f(x - dx - rx * 1.1)} ${f(y + ry * 0.7)} Z" fill="#15161b" stroke="${OUT}" stroke-width="${f(R * 0.05)}"/><line x1="${f(x - dx - rx * 0.8)}" y1="${f(y - ry * 0.4)}" x2="${f(x - dx)}" y2="${f(y - ry * 0.4)}" stroke="#fff" stroke-width="${f(R * 0.04)}" opacity="0.6"/>`;
  return g;
}
export function toothbrush(x, y, L, a = 0) { return `<g transform="rotate(${f(a)} ${f(x)} ${f(y)})">${rr(x - L / 2, y - L * 0.04, L, L * 0.08, L * 0.04, '#2f6fdb', `stroke="${OUT}" stroke-width="3"`)}${rr(x + L * 0.3, y - L * 0.13, L * 0.2, L * 0.09, 3, '#ffffff', `stroke="${OUT}" stroke-width="3"`)}</g>`; }
// glass frog on a leaf (centre x, y; length L): translucent green body, visible bones, a small red heart, eyes
export function glassFrog(x, y, L, o = {}) {
  const k = o.clear ?? 0; let g = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(L * 0.5)}" ry="${f(L * 0.28)}" fill="#b8f0a8" opacity="${f(0.85 - 0.35 * k)}" stroke="#4f8a5b" stroke-width="4"/>`;
  g += `<path d="M ${f(x - L * 0.35)} ${f(y)} L ${f(x + L * 0.35)} ${f(y)}" stroke="#f4f1ea" stroke-width="${f(L * 0.03)}" opacity="0.8"/>`;
  g += `<circle cx="${f(x + L * 0.05)}" cy="${f(y + L * 0.04)}" r="${f(L * 0.07)}" fill="#e2553f" opacity="${f(1 - 0.85 * k)}"/>`;
  g += `<ellipse cx="${f(x - L * 0.08)}" cy="${f(y + L * 0.08)}" rx="${f(L * 0.12)}" ry="${f(L * 0.07)}" fill="#9a3a2a" opacity="${f(0.4 + 0.5 * k)}"/>`;
  for (const s of [-1, 1]) g += `<circle cx="${f(x + L * 0.38)}" cy="${f(y - L * 0.16 + s * L * 0.1)}" r="${f(L * 0.08)}" fill="#e0e8c0" stroke="${OUT}" stroke-width="3"/><circle cx="${f(x + L * 0.4)}" cy="${f(y - L * 0.16 + s * L * 0.1)}" r="${f(L * 0.04)}" fill="#111"/>`;
  for (const [dx, dy] of [[-0.4, 0.25], [-0.25, 0.3], [0.25, 0.3], [0.35, 0.25]]) g += `<line x1="${f(x + dx * L)}" y1="${f(y + L * 0.1)}" x2="${f(x + dx * L * 1.2)}" y2="${f(y + dy * L)}" stroke="#8fd08a" stroke-width="${f(L * 0.04)}" stroke-linecap="round"/>`;
  return g;
}
export function bottle(x, y, h, col = '#f2d23a', label = 'YELLOW 5') { const w = h * 0.4; return rr(x - w / 2, y - h * 0.8, w, h * 0.8, w * 0.2, col, `stroke="${OUT}" stroke-width="4"`) + rr(x - w * 0.2, y - h, w * 0.4, h * 0.22, 4, '#ffffff', `stroke="${OUT}" stroke-width="4"`) + rr(x - w * 0.42, y - h * 0.6, w * 0.84, h * 0.25, 4, '#ffffff') + `<text x="${f(x)}" y="${f(y - h * 0.44)}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${f(w * 0.17)}" fill="${OUT}">${label}</text>`; }
// metamaterial cloak: concentric rings of little boards around a copper cylinder (centre x, y; radius r)
export function cloak(x, y, r, t = 0, o = {}) {
  let g = ''; for (let k = 0; k < 10; k++) { const rk = r * (0.35 + k * 0.065), n = 12 + k * 3; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; g += `<rect x="${f(x + Math.cos(a) * rk - 4)}" y="${f(y + Math.sin(a) * rk * 0.45 - 8)}" width="8" height="16" fill="${k % 2 ? '#3f8a4a' : '#2f6a3a'}" stroke="#c9a14a" stroke-width="1"/>`; } }
  g += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 0.22)}" ry="${f(r * 0.1)}" fill="#c87a3a" stroke="${OUT}" stroke-width="3"/>`;
  if (o.waves) for (let i = 0; i < 6; i++) { const yy = y - r * 0.4 + i * r * 0.16, ph = (t * 120) % 80; let d = `M ${f(x - r * 1.8 + ph)} ${f(yy)}`; for (let s = 0; s < 18; s++) { const xx = x - r * 1.8 + ph + s * r * 0.2; const bend = Math.abs(xx - x) < r * 0.9 ? (yy < y ? -1 : 1) * (r * 0.5 - Math.abs(yy - y)) * 0.5 * Math.cos((xx - x) / (r * 0.9) * Math.PI / 2) : 0; d += ` L ${f(xx)} ${f(yy + bend)}`; } g += `<path d="${d}" fill="none" stroke="#7fc4ff" stroke-width="4" opacity="0.8"/>`; }
  return g;
}
// thermal camera with a screen showing a glowing figure (centre x, y; width w)
let TID = 0;
export function thermalCam(x, y, w, glow = 1) {
  const id = 'thg' + ++TID;
  const h = w * 0.7; let g = rr(x - w / 2, y - h / 2, w, h, w * 0.06, '#22242a', `stroke="${OUT}" stroke-width="5"`);
  g += `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="#ffd25a"/><stop offset="0.7" stop-color="#ff7a2a"/><stop offset="1" stop-color="#7a1fa8"/></radialGradient></defs>`;
  g += rr(x - w * 0.42, y - h * 0.38, w * 0.84, h * 0.76, 8, '#1a0a3a');
  if (glow > 0) g += `<g opacity="${f(glow)}"><ellipse cx="${f(x)}" cy="${f(y - h * 0.16)}" rx="${f(w * 0.08)}" ry="${f(w * 0.09)}" fill="url(#${id})"/><rect x="${f(x - w * 0.1)}" y="${f(y - h * 0.06)}" width="${f(w * 0.2)}" height="${f(h * 0.4)}" rx="${f(w * 0.05)}" fill="url(#${id})"/></g>`;
  g += `<text x="${f(x - w * 0.38)}" y="${f(y - h * 0.26)}" font-family="IBM Plex Mono" font-size="${f(w * 0.05)}" fill="#ffd25a">37°C</text>`;
  return g;
}
// a dog, side view, facing +x (bottom-centre x, y; length L)
export function dog(x, y, L, o = {}) {
  const c = o.col || '#c98a4a', h = L * 0.55; let g = `<ellipse cx="${f(x)}" cy="${f(y - h * 0.55)}" rx="${f(L * 0.36)}" ry="${f(h * 0.22)}" fill="${c}" stroke="${OUT}" stroke-width="4"/>`;
  for (const dx of [-0.25, -0.12, 0.15, 0.28]) g += rr(x + dx * L - L * 0.035, y - h * 0.45, L * 0.07, h * 0.45, L * 0.03, shade(c, 0.85), `stroke="${OUT}" stroke-width="3"`);
  g += `<circle cx="${f(x + L * 0.38)}" cy="${f(y - h * 0.82)}" r="${f(h * 0.2)}" fill="${c}" stroke="${OUT}" stroke-width="4"/><ellipse cx="${f(x + L * 0.53)}" cy="${f(y - h * 0.76)}" rx="${f(h * 0.13)}" ry="${f(h * 0.09)}" fill="${c}" stroke="${OUT}" stroke-width="3"/><circle cx="${f(x + L * 0.62)}" cy="${f(y - h * 0.78)}" r="${f(h * 0.04)}" fill="#111"/>`;
  g += `<path d="M ${f(x + L * 0.3)} ${f(y - h * 0.95)} q ${f(-L * 0.08)} ${f(h * 0.1)} ${f(-L * 0.04)} ${f(h * 0.32)}" fill="${shade(c, 0.7)}" stroke="${OUT}" stroke-width="3"/><circle cx="${f(x + L * 0.42)}" cy="${f(y - h * 0.86)}" r="${f(h * 0.03)}" fill="#111"/>`;
  g += `<path d="M ${f(x - L * 0.34)} ${f(y - h * 0.62)} q ${f(-L * 0.12)} ${f(-h * (o.wag ? 0.35 : 0.2))} ${f(-L * 0.14)} ${f(-h * 0.45)}" fill="none" stroke="${c}" stroke-width="${f(L * 0.05)}" stroke-linecap="round"/>`;
  if (o.sniff) for (let i = 0; i < 3; i++) g += `<path d="M ${f(x + L * 0.68 + i * 12)} ${f(y - h * 0.8)} q 8 -10 0 -20" fill="none" stroke="#fff" stroke-width="3" opacity="0.7"/>`;
  return g;
}

// ---- fly props
// pedal-powered aircraft, side-ish view (centre x, y; span w): very long thin wing, a small pod, pusher propeller
export function pedalPlane(x, y, w, t = 0) {
  let g = `<path d="M ${f(x - w / 2)} ${f(y)} Q ${f(x)} ${f(y - w * 0.03)} ${f(x + w / 2)} ${f(y)} L ${f(x + w / 2)} ${f(y + w * 0.012)} Q ${f(x)} ${f(y - w * 0.015)} ${f(x - w / 2)} ${f(y + w * 0.012)} Z" fill="#e8f2f8" stroke="${OUT}" stroke-width="3"/>`;
  for (let i = -6; i <= 6; i++) g += `<line x1="${f(x + i * w * 0.07)}" y1="${f(y - w * 0.012)}" x2="${f(x + i * w * 0.07)}" y2="${f(y + w * 0.008)}" stroke="#9fb0bd" stroke-width="2"/>`;
  g += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y + w * 0.12)}" stroke="${OUT}" stroke-width="3"/><ellipse cx="${f(x)}" cy="${f(y + w * 0.14)}" rx="${f(w * 0.035)}" ry="${f(w * 0.045)}" fill="#cfe6ef" fill-opacity="0.7" stroke="${OUT}" stroke-width="3"/>`;
  g += `<circle cx="${f(x)}" cy="${f(y + w * 0.135)}" r="${f(w * 0.012)}" fill="#111"/>`;
  const pa = (t * 20) % (Math.PI * 2); g += `<line x1="${f(x - w * 0.05 * Math.cos(pa))}" y1="${f(y + w * 0.14 - w * 0.05 * Math.sin(pa))}" x2="${f(x + w * 0.05 * Math.cos(pa))}" y2="${f(y + w * 0.14 + w * 0.05 * Math.sin(pa))}" stroke="#e2553f" stroke-width="4" opacity="0.8"/>`;
  g += `<line x1="${f(x)}" y1="${f(y + w * 0.04)}" x2="${f(x + w * 0.22)}" y2="${f(y + w * 0.06)}" stroke="${OUT}" stroke-width="2"/><path d="M ${f(x + w * 0.2)} ${f(y + w * 0.02)} L ${f(x + w * 0.26)} ${f(y + w * 0.02)} L ${f(x + w * 0.26)} ${f(y + w * 0.08)} Z" fill="#e8f2f8" stroke="${OUT}" stroke-width="2"/>`;
  return g;
}
// wingsuit flyer seen from above-behind (centre x, y; span w)
export function wingsuit(x, y, w, col = '#e2553f', a = 0) {
  return `<g transform="rotate(${f(a)} ${f(x)} ${f(y)})"><path d="M ${f(x)} ${f(y - w * 0.35)} L ${f(x + w * 0.5)} ${f(y + w * 0.05)} L ${f(x + w * 0.12)} ${f(y + w * 0.1)} L ${f(x + w * 0.1)} ${f(y + w * 0.45)} L ${f(x)} ${f(y + w * 0.3)} L ${f(x - w * 0.1)} ${f(y + w * 0.45)} L ${f(x - w * 0.12)} ${f(y + w * 0.1)} L ${f(x - w * 0.5)} ${f(y + w * 0.05)} Z" fill="${col}" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><circle cx="${f(x)}" cy="${f(y - w * 0.32)}" r="${f(w * 0.07)}" fill="#1b1410"/><path d="M ${f(x - w * 0.45)} ${f(y + w * 0.06)} L ${f(x + w * 0.45)} ${f(y + w * 0.06)}" stroke="#ffd29a" stroke-width="3" opacity="0.6"/></g>`;
}
// jet flames from a point, pointing down-back
export function jetFlame(x, y, L, t = 0, a = 160) { const k = 0.85 + 0.15 * Math.sin(t * 40 + x); return `<g transform="rotate(${f(a)} ${f(x)} ${f(y)})"><path d="M ${f(x - L * 0.12)} ${f(y)} Q ${f(x)} ${f(y + L * k)} ${f(x + L * 0.12)} ${f(y)} Z" fill="#ffb24a" opacity="0.9"/><path d="M ${f(x - L * 0.06)} ${f(y)} Q ${f(x)} ${f(y + L * 0.6 * k)} ${f(x + L * 0.06)} ${f(y)} Z" fill="#fff4c8"/></g>`; }
// big telescope (pivot x, y; length L; angle in degrees from horizontal)
export function telescope(x, y, L, a = 35) { return `<g transform="rotate(${f(-a)} ${f(x)} ${f(y)})">${rr(x - L * 0.2, y - L * 0.08, L, L * 0.16, L * 0.05, '#e9e4da', `stroke="${OUT}" stroke-width="5"`)}${rr(x + L * 0.75, y - L * 0.1, L * 0.08, L * 0.2, 6, '#2f3e52', `stroke="${OUT}" stroke-width="4"`)}</g>` + `<path d="M ${f(x - L * 0.15)} ${f(y + L * 0.7)} L ${f(x)} ${f(y)} L ${f(x + L * 0.15)} ${f(y + L * 0.7)}" fill="none" stroke="${OUT}" stroke-width="${f(L * 0.03)}"/>`; }

// ---- move-minds props
// side-view car (bottom-centre x, y; length L); o.col body colour, o.rust adds rust patches, o.glow a telekinesis glow
export function car2d(x, y, L, o = {}) {
  const h = L * 0.36, c = o.col || '#4f6f7a'; let g = '';
  if (o.glow) g += `<ellipse cx="${f(x)}" cy="${f(y - h * 0.5)}" rx="${f(L * 0.62)}" ry="${f(h * 0.85)}" fill="#b98aff" opacity="${f(0.22 * o.glow)}"/><ellipse cx="${f(x)}" cy="${f(y - h * 0.5)}" rx="${f(L * 0.56)}" ry="${f(h * 0.72)}" fill="none" stroke="#c9a2ff" stroke-width="${f(L * 0.012)}" opacity="${f(0.7 * o.glow)}"/>`;
  g += `<path d="M ${f(x - L * 0.5)} ${f(y - h * 0.18)} L ${f(x - L * 0.5)} ${f(y - h * 0.5)} Q ${f(x - L * 0.48)} ${f(y - h * 0.58)} ${f(x - L * 0.36)} ${f(y - h * 0.6)} L ${f(x - L * 0.22)} ${f(y - h * 0.62)} L ${f(x - L * 0.1)} ${f(y - h * 0.98)} L ${f(x + L * 0.2)} ${f(y - h * 0.98)} L ${f(x + L * 0.32)} ${f(y - h * 0.62)} L ${f(x + L * 0.46)} ${f(y - h * 0.58)} Q ${f(x + L * 0.5)} ${f(y - h * 0.5)} ${f(x + L * 0.5)} ${f(y - h * 0.18)} Z" fill="${c}" stroke="${OUT}" stroke-width="${f(Math.max(2, L * 0.012))}" stroke-linejoin="round"/>`;
  g += `<path d="M ${f(x - L * 0.17)} ${f(y - h * 0.64)} L ${f(x - L * 0.08)} ${f(y - h * 0.9)} L ${f(x + L * 0.04)} ${f(y - h * 0.9)} L ${f(x + L * 0.04)} ${f(y - h * 0.64)} Z M ${f(x + L * 0.08)} ${f(y - h * 0.64)} L ${f(x + L * 0.08)} ${f(y - h * 0.9)} L ${f(x + L * 0.18)} ${f(y - h * 0.9)} L ${f(x + L * 0.27)} ${f(y - h * 0.64)} Z" fill="#3a4b5e" stroke="${OUT}" stroke-width="${f(Math.max(1.5, L * 0.008))}"/>`;
  if (o.rust) g += `<circle cx="${f(x - L * 0.3)}" cy="${f(y - h * 0.35)}" r="${f(h * 0.12)}" fill="#8a4a2a" opacity="0.7"/><circle cx="${f(x + L * 0.35)}" cy="${f(y - h * 0.4)}" r="${f(h * 0.09)}" fill="#8a4a2a" opacity="0.7"/>`;
  for (const wx of [-0.3, 0.3]) g += `<circle cx="${f(x + wx * L)}" cy="${f(y - h * 0.17)}" r="${f(h * 0.19)}" fill="#22242a" stroke="${OUT}" stroke-width="${f(Math.max(2, L * 0.01))}"/><circle cx="${f(x + wx * L)}" cy="${f(y - h * 0.17)}" r="${f(h * 0.08)}" fill="#9aa3ad"/>`;
  return g;
}
// a small frog seen from the side, legs dangling (centre x, y; length L)
export function frog(x, y, L, t = 0) {
  const k = Math.sin(t * 3) * 0.1; let g = `<g transform="rotate(${f(k * 20)} ${f(x)} ${f(y)})">`;
  for (const s of [-1, 1]) g += `<path d="M ${f(x - L * 0.25)} ${f(y + L * 0.1)} L ${f(x - L * 0.4 + s * L * 0.05)} ${f(y + L * 0.45)} L ${f(x - L * 0.3 + s * L * 0.08)} ${f(y + L * 0.7)}" fill="none" stroke="#4f9a3a" stroke-width="${f(L * 0.08)}" stroke-linecap="round"/><path d="M ${f(x + L * 0.2)} ${f(y + L * 0.12)} L ${f(x + L * 0.25 + s * L * 0.04)} ${f(y + L * 0.4)}" fill="none" stroke="#4f9a3a" stroke-width="${f(L * 0.07)}" stroke-linecap="round"/>`;
  g += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(L * 0.42)}" ry="${f(L * 0.24)}" fill="#6cc04a" stroke="${OUT}" stroke-width="${f(L * 0.03)}"/><ellipse cx="${f(x)}" cy="${f(y + L * 0.08)}" rx="${f(L * 0.3)}" ry="${f(L * 0.12)}" fill="#d8f0a8"/>`;
  g += `<circle cx="${f(x + L * 0.28)}" cy="${f(y - L * 0.2)}" r="${f(L * 0.1)}" fill="#fff" stroke="${OUT}" stroke-width="${f(L * 0.025)}"/><circle cx="${f(x + L * 0.31)}" cy="${f(y - L * 0.2)}" r="${f(L * 0.05)}" fill="#111"/>`;
  g += `<path d="M ${f(x + L * 0.2)} ${f(y + L * 0.02)} Q ${f(x + L * 0.32)} ${f(y + L * 0.08)} ${f(x + L * 0.4)} ${f(y - L * 0.02)}" fill="none" stroke="${OUT}" stroke-width="${f(L * 0.02)}"/>`;
  return g + '</g>';
}
// a robot arm on a base (base bottom-centre x, y; size s px ~ arm length), a1/a2 joint angles in degrees, holding a cup at the end if o.cup
export function robotArm(x, y, s, a1 = -60, a2 = 70, o = {}) {
  const rad = (d) => (d * Math.PI) / 180, j1 = [x, y - s * 0.22], e = [j1[0] + Math.cos(rad(a1)) * s * 0.5, j1[1] + Math.sin(rad(a1)) * s * 0.5], hnd = [e[0] + Math.cos(rad(a1 + a2)) * s * 0.45, e[1] + Math.sin(rad(a1 + a2)) * s * 0.45];
  const seg = (a, b, w) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${OUT}" stroke-width="${f(w + 8)}" stroke-linecap="round"/><line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="#d9dee3" stroke-width="${f(w)}" stroke-linecap="round"/>`;
  let g = rr(x - s * 0.14, y - s * 0.22, s * 0.28, s * 0.22, 8, '#3a3f46', `stroke="${OUT}" stroke-width="4"`) + seg(j1, e, s * 0.1) + seg(e, hnd, s * 0.08);
  for (const p of [j1, e]) g += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(s * 0.07)}" fill="#2f6fdb" stroke="${OUT}" stroke-width="4"/>`;
  g += `<path d="M ${f(hnd[0] - s * 0.06)} ${f(hnd[1] - s * 0.05)} L ${f(hnd[0] - s * 0.06)} ${f(hnd[1] + s * 0.06)} M ${f(hnd[0] + s * 0.06)} ${f(hnd[1] - s * 0.05)} L ${f(hnd[0] + s * 0.06)} ${f(hnd[1] + s * 0.06)}" stroke="${OUT}" stroke-width="${f(s * 0.025)}" stroke-linecap="round"/>`;
  if (o.cup) g += cup(hnd[0], hnd[1] + s * 0.08, s * 0.14, o.steam ?? 0);
  return g;
}
export function cup(x, y, h, t = 0) {
  const w = h * 0.8; let g = `<path d="M ${f(x - w / 2)} ${f(y - h)} L ${f(x + w / 2)} ${f(y - h)} L ${f(x + w * 0.4)} ${f(y)} L ${f(x - w * 0.4)} ${f(y)} Z" fill="#f4f1ea" stroke="${OUT}" stroke-width="3"/><path d="M ${f(x + w / 2)} ${f(y - h * 0.8)} q ${f(w * 0.35)} ${f(h * 0.2)} 0 ${f(h * 0.5)}" fill="none" stroke="${OUT}" stroke-width="3"/><rect x="${f(x - w / 2 + 3)}" y="${f(y - h + 2)}" width="${f(w - 6)}" height="${f(h * 0.12)}" fill="#6a3a1a"/>`;
  if (t) for (let i = 0; i < 3; i++) g += `<path d="M ${f(x - w * 0.2 + i * w * 0.2)} ${f(y - h * 1.1)} q ${f(-w * 0.15)} ${f(-h * 0.3)} 0 ${f(-h * 0.6)} q ${f(w * 0.15)} ${f(-h * 0.3)} 0 ${f(-h * 0.6)}" fill="none" stroke="#fff" stroke-width="3" opacity="${f(0.5 + 0.3 * Math.sin(t * 3 + i))}"/>`;
  return g;
}
// a wheelchair, side view (bottom-centre x, y; height h of the seat back)
export function wheelchair(x, y, h) {
  const r = h * 0.42; return `<circle cx="${f(x - h * 0.1)}" cy="${f(y - r)}" r="${f(r)}" fill="none" stroke="#2a2d33" stroke-width="${f(h * 0.06)}"/><circle cx="${f(x - h * 0.1)}" cy="${f(y - r)}" r="${f(r * 0.85)}" fill="none" stroke="#9aa3ad" stroke-width="${f(h * 0.02)}"/><circle cx="${f(x + h * 0.42)}" cy="${f(y - h * 0.08)}" r="${f(h * 0.08)}" fill="#2a2d33"/><path d="M ${f(x - h * 0.35)} ${f(y - h)} L ${f(x - h * 0.3)} ${f(y - h * 0.45)} L ${f(x + h * 0.32)} ${f(y - h * 0.45)} L ${f(x + h * 0.42)} ${f(y - h * 0.16)}" fill="none" stroke="#2a2d33" stroke-width="${f(h * 0.05)}" stroke-linejoin="round"/>`;
}
// over-ear headphones drawn on a character's head (c = person result)
export function headphones(c, col = '#e2553f') { const [hx, hy] = c.head, R = c.R; return `<path d="M ${f(hx - R * 1.05)} ${f(hy)} Q ${f(hx)} ${f(hy - R * 1.9)} ${f(hx + R * 1.05)} ${f(hy)}" fill="none" stroke="#22242a" stroke-width="${f(R * 0.16)}"/>` + [-1, 1].map((s) => `<rect x="${f(hx + s * R * 1.02 - R * 0.2)}" y="${f(hy - R * 0.3)}" width="${f(R * 0.4)}" height="${f(R * 0.62)}" rx="${f(R * 0.14)}" fill="${col}" stroke="${OUT}" stroke-width="${f(R * 0.06)}"/>`).join(''); }
// a flat skipping stone (centre x, y; length L)
export function stone(x, y, L) { return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(L / 2)}" ry="${f(L * 0.16)}" fill="#8a8580" stroke="${OUT}" stroke-width="2"/>`; }
