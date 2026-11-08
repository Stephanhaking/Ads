// Effects and 2D props for the rubber-powers pilot (original art only; nothing from One Piece).
const f = (n) => n.toFixed(1);
const OUT = '#1b1410';

// A stretched rubber arm from shoulder S to hand H (screen px). w0 = normal arm thickness, L0 = normal arm length in px.
// Volume is kept (rubber's Poisson ratio is close to 0.5): thickness = w0 / sqrt(L / L0). sleeve = hoodie colour.
// spring easing with overshoot (0..1 -> 0..1, overshoots ~15% then settles)
export const springOut = (k) => (k >= 1 ? 1 : 1 - Math.exp(-6 * k) * Math.cos(11 * k));
// A stretched rubber arm from shoulder S to hand H (screen px). w0 = arm thickness at rest, L0 = arm length at rest.
// Thickness drops as it stretches (rubber keeps its volume), never to a hairline. o.wob = wobble amplitude (px), o.ph = phase
// (pass time), o.smear = 0..1 motion smear, o.grab = wrap the fingers round the target, o.sleeve = cuff colour.
export function stretchArm(S, H, w0, L0, o = {}) {
  const dx = H[0] - S[0], dy = H[1] - S[1], Ln = Math.hypot(dx, dy) || 1, ratio = Math.max(1, Ln / L0);
  const w = Math.max(w0 * 0.6, w0 * 1.3 / Math.sqrt(ratio)), nx = -dy / Ln, ny = dx / Ln, sag = o.sag ?? Math.min(60, Ln * 0.05);
  const wob = o.wob ?? 0, ph = o.ph ?? 0, N = 28, pts = [];
  for (let i = 0; i <= N; i++) { const u = i / N, env = Math.sin(Math.PI * u), off = sag * 4 * u * (1 - u) + wob * env * Math.sin(u * Math.PI * 3 - ph * 18); pts.push([S[0] + dx * u + nx * off, S[1] + dy * u + ny * off]); }
  const d = 'M ' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L ');
  let g = '';
  if (o.smear) g += `<path d="${d}" fill="none" stroke="#ffffff" stroke-width="${f(w * 3.2)}" stroke-linecap="round" opacity="${f(0.18 * o.smear)}"/>`;
  g += `<path d="${d}" fill="none" stroke="${o.rim || '#e4f0ff'}" stroke-width="${f(w + 7)}" opacity="0.9" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += `<path d="${d}" fill="none" stroke="#14141c" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += `<path d="${d}" fill="none" stroke="#6a6a86" stroke-width="${f(w * 0.2)}" stroke-linecap="round" opacity="0.6" transform="translate(${f(-nx * w * 0.26)} ${f(-ny * w * 0.26)})"/>`;
  // stretch rings: spacing grows with the stretch
  const nR = Math.min(14, Math.floor(ratio * 2)); for (let i = 1; i < nR; i++) { const u = i / nR, j = Math.round(u * N), p = pts[j], q = pts[Math.min(N, j + 1)], tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) || 1, ex = -ty / tl * w * 0.48, ey = tx / tl * w * 0.48; g += `<line x1="${f(p[0] + ex)}" y1="${f(p[1] + ey)}" x2="${f(p[0] - ex)}" y2="${f(p[1] - ey)}" stroke="#3a3a50" stroke-width="${f(Math.max(1.5, w * 0.12))}" stroke-linecap="round"/>`; }
  // cuff at the shoulder
  const cx = S[0] + dx * Math.min(0.2, 46 / Ln), cy = S[1] + dy * Math.min(0.2, 46 / Ln);
  g += `<line x1="${f(S[0])}" y1="${f(S[1])}" x2="${f(cx)}" y2="${f(cy)}" stroke="${o.rim || '#e4f0ff'}" stroke-width="${f(w0 * 1.05 + 6)}" stroke-linecap="round"/><line x1="${f(S[0])}" y1="${f(S[1])}" x2="${f(cx)}" y2="${f(cy)}" stroke="${o.sleeve || '#6f8fbf'}" stroke-width="${f(w0 * 1.05)}" stroke-linecap="round"/>`;
  // hand: a fist, or fingers wrapped round the target
  const last = pts[N], prev = pts[N - 2], ang = Math.atan2(last[1] - prev[1], last[0] - prev[0]) * 180 / Math.PI, fr = w0 * 0.85, sq = 1 + Math.min(0.3, (ratio - 1) * 0.04);
  if (o.grab) g += `<g transform="translate(${f(last[0])} ${f(last[1])}) rotate(${f(ang)})"><path d="M ${f(-fr * 0.4)} ${f(-fr * 1.1)} A ${f(fr * 1.1)} ${f(fr * 1.1)} 0 1 1 ${f(-fr * 0.4)} ${f(fr * 1.1)}" fill="none" stroke="#14141c" stroke-width="${f(fr * 0.9)}" stroke-linecap="round"/></g>`;
  else g += `<g transform="translate(${f(last[0])} ${f(last[1])}) rotate(${f(ang)}) scale(${f(sq)} ${f(1 / sq)})"><circle cx="${f(fr * 0.2)}" cy="0" r="${f(fr)}" fill="#14141c" stroke="${o.rim || '#e4f0ff'}" stroke-width="3.5"/><path d="M ${f(fr * 0.5)} ${f(-fr * 0.45)} q ${f(fr * 0.35)} ${f(fr * 0.45)} 0 ${f(fr * 0.9)}" fill="none" stroke="#3a3a50" stroke-width="3" stroke-linecap="round"/></g>`;
  if (o.lines) for (let i = 1; i < 4; i++) { const p = pts[Math.round(i / 4 * N)]; g += `<line x1="${f(p[0] + nx * (w + 16))}" y1="${f(p[1] + ny * (w + 16))}" x2="${f(p[0] + nx * (w + 54))}" y2="${f(p[1] + ny * (w + 54))}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`; }
  return g;
}
// approximate shoulders of a char2d person (c = person() result); side +1 = the figure's right as seen on screen
export const shoulder = (c, side = 1) => (c.shR ? (side > 0 ? (c.shR[0] > c.shL[0] ? c.shR : c.shL) : (c.shR[0] > c.shL[0] ? c.shL : c.shR)) : [c.head[0] + side * c.R * 0.72, c.head[1] + c.R * 1.45]);

// Gear-5 look on a figure: white cloud hair, a white glow and drifting steam; t = seconds
export function gear5(c, t, k = 1) {
  const [hx, hy] = c.head, R = c.R; let g = `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(R * 2.4)}" fill="#ffffff" opacity="${f(0.12 * k)}"/>`;
  for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.95 + (i / 8) * Math.PI * 0.9, r = R * (1.05 + 0.18 * Math.sin(t * 6 + i)); g += `<circle cx="${f(hx + Math.cos(a) * r)}" cy="${f(hy + Math.sin(a) * r - R * 0.15)}" r="${f(R * (0.38 + 0.08 * Math.sin(t * 4 + i * 2)))}" fill="#f4f1ff" opacity="${f(k)}"/>`; }
  for (let i = 0; i < 6; i++) { const ph = (t * 0.6 + i / 6) % 1; g += `<circle cx="${f(hx + Math.sin(i * 2.3 + t) * R * 1.6)}" cy="${f(hy - R * 1.2 - ph * R * 3)}" r="${f(R * (0.18 + ph * 0.3))}" fill="#ffffff" opacity="${f((1 - ph) * 0.5 * k)}"/>`; }
  return g;
}
// steam rising off a figure (Gear 2)
export function steam(c, t, k = 1) { let g = ''; for (let i = 0; i < 10; i++) { const ph = (t * 0.8 + i / 10) % 1, x = c.head[0] + Math.sin(i * 1.7) * c.R * 1.8, y = c.head[1] + c.R * (3 - ph * 5); g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(c.R * (0.25 + ph * 0.4))}" fill="#ff9a8a" opacity="${f((1 - ph) * 0.45 * k)}"/>`; } return g; }
// heartbeat "drum" rings around a point
export function drum(x, y, t, bpm = 120, r0 = 60, col = '#ffffff') { const ph = (t * bpm / 60) % 1; let g = ''; for (let i = 0; i < 2; i++) { const p = (ph + i * 0.5) % 1; g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r0 + p * r0 * 3)}" fill="none" stroke="${col}" stroke-width="${f(8 * (1 - p))}" opacity="${f(0.7 * (1 - p))}"/>`; } return g; }
// a jagged lightning bolt from (x1, y1) to (x2, y2)
export function bolt(x1, y1, x2, y2, seed = 1, w = 8) { let d = `M ${f(x1)} ${f(y1)}`; const n = 9; let s = seed; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647 - 0.5); for (let i = 1; i < n; i++) { const k = i / n; d += ` L ${f(x1 + (x2 - x1) * k + r() * 90)} ${f(y1 + (y2 - y1) * k + r() * 30)}`; } d += ` L ${f(x2)} ${f(y2)}`; return `<path d="${d}" fill="none" stroke="#9fd0ff" stroke-width="${w * 4}" opacity="0.35" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="${w}" stroke-linejoin="round"/>`; }
// a city bus, side view (bottom-centre x, y; length L); o.rubber = 0..1 squash/wobble
export function bus(x, y, L, o = {}) { const h = L * 0.3, sq = o.rubber || 0, sy = 1 - 0.25 * sq, sx = 1 + 0.12 * sq; let g = `<g transform="translate(${f(x)} ${f(y)}) scale(${f(sx)} ${f(sy)}) translate(${f(-x)} ${f(-y)})">`;
  g += `<rect x="${f(x - L / 2)}" y="${f(y - h)}" width="${f(L)}" height="${f(h * 0.86)}" rx="${f(h * 0.12)}" fill="#e2553f" stroke="${OUT}" stroke-width="5"/>`; for (let i = 0; i < 7; i++) g += `<rect x="${f(x - L * 0.44 + i * L * 0.125)}" y="${f(y - h * 0.9)}" width="${f(L * 0.1)}" height="${f(h * 0.32)}" rx="6" fill="#bfe0f0" stroke="${OUT}" stroke-width="3"/>`;
  for (const k of [-0.32, 0.32]) g += `<circle cx="${f(x + k * L)}" cy="${f(y - h * 0.12)}" r="${f(h * 0.16)}" fill="#22242a" stroke="${OUT}" stroke-width="4"/>`; return g + '</g>'; }
// a forklift, side view (bottom-centre x, y; height h)
export function forklift(x, y, h) { return `<rect x="${f(x - h * 0.5)}" y="${f(y - h * 0.55)}" width="${f(h * 0.8)}" height="${f(h * 0.4)}" rx="8" fill="#f2c230" stroke="${OUT}" stroke-width="4"/><path d="M ${f(x - h * 0.3)} ${f(y - h * 0.55)} L ${f(x - h * 0.3)} ${f(y - h)} L ${f(x + h * 0.15)} ${f(y - h)} L ${f(x + h * 0.15)} ${f(y - h * 0.55)}" fill="none" stroke="${OUT}" stroke-width="5"/><rect x="${f(x + h * 0.3)}" y="${f(y - h * 1.1)}" width="${f(h * 0.06)}" height="${f(h)}" fill="#3a3d42"/><rect x="${f(x + h * 0.3)}" y="${f(y - h * 0.12)}" width="${f(h * 0.45)}" height="${f(h * 0.05)}" fill="#3a3d42"/>` + [-0.3, 0.15].map((k) => `<circle cx="${f(x + k * h)}" cy="${f(y - h * 0.12)}" r="${f(h * 0.12)}" fill="#22242a"/>`).join(''); }
// a small quadcopter drone (centre x, y; size s), with a red light blinking at time t
export function drone(x, y, s, t = 0) { return `<rect x="${f(x - s * 0.25)}" y="${f(y - s * 0.1)}" width="${f(s * 0.5)}" height="${f(s * 0.2)}" rx="${f(s * 0.06)}" fill="#2a2d33"/>` + [-0.5, 0.5].map((k) => `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + k * s)}" y2="${f(y - s * 0.12)}" stroke="#2a2d33" stroke-width="${f(s * 0.05)}"/><ellipse cx="${f(x + k * s)}" cy="${f(y - s * 0.16)}" rx="${f(s * 0.28)}" ry="${f(s * 0.04)}" fill="#9aa3ad" opacity="0.7"/>`).join('') + `<circle cx="${f(x)}" cy="${f(y + s * 0.06)}" r="${f(s * 0.05)}" fill="${Math.sin(t * 8) > 0 ? '#ff3b3b' : '#5a1010'}"/>`; }
// a steel I-beam (centre x, y; length L; angle a deg)
export function beam(x, y, L, a = 0) { const h = L * 0.07; return `<g transform="rotate(${f(a)} ${f(x)} ${f(y)})"><rect x="${f(x - L / 2)}" y="${f(y - h / 2)}" width="${f(L)}" height="${f(h)}" fill="#8a3a2a" stroke="${OUT}" stroke-width="4"/><rect x="${f(x - L / 2)}" y="${f(y - h * 0.15)}" width="${f(L)}" height="${f(h * 0.3)}" fill="#6a2a1e"/></g>`; }
// a giant inflated fist (centre x, y; radius r)
export function bigFist(x, y, r) { let g = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#0b0b10" stroke="#ffd6a0" stroke-width="${f(r * 0.04)}"/>`; for (let i = 0; i < 4; i++) g += `<path d="M ${f(x - r * 0.6 + i * r * 0.4)} ${f(y - r * 0.85)} q ${f(r * 0.2)} ${f(-r * 0.2)} ${f(r * 0.38)} 0" fill="none" stroke="#3a3a44" stroke-width="${f(r * 0.05)}"/>`; return g + `<ellipse cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" rx="${f(r * 0.25)}" ry="${f(r * 0.12)}" fill="#ffffff" opacity="0.18"/>`; }
