// Flat vehicles in the series style (our own drawing): side views with flat colour blocks, a top highlight, light-blue
// windows, ink tyres with a pale outline. (x, y) = bottom centre on the ground, L = length. o.rubber 0..1 squash/wobble.
const f = (n) => n.toFixed(1);
const OL = '#b9dcff';
const wheel = (x, y, r) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#0c0d12" stroke="${OL}" stroke-width="3"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.42)}" fill="#9aa3ad"/>`;
const squash = (x, y, o, g) => { const k = o.rubber || 0; return k ? `<g transform="translate(${f(x)} ${f(y)}) scale(${f(1 + 0.12 * k)} ${f(1 - 0.25 * k)}) translate(${f(-x)} ${f(-y)})">${g}</g>` : g; };
export function bus(x, y, L, o = {}) { const h = L * 0.3, x0 = x - L / 2, col = o.col || '#e8452e';
  let g = `<rect x="${f(x0)}" y="${f(y - h)}" width="${f(L)}" height="${f(h * 0.84)}" rx="${f(h * 0.12)}" fill="${col}" stroke="${OL}" stroke-width="3"/><rect x="${f(x0)}" y="${f(y - h)}" width="${f(L)}" height="${f(h * 0.1)}" rx="${f(h * 0.08)}" fill="#ffffff" opacity="0.25"/>`;
  for (let i = 0; i < 7; i++) g += `<rect x="${f(x0 + L * 0.05 + i * L * 0.128)}" y="${f(y - h * 0.86)}" width="${f(L * 0.1)}" height="${f(h * 0.32)}" rx="5" fill="#a8e4ff"/><rect x="${f(x0 + L * 0.05 + i * L * 0.128)}" y="${f(y - h * 0.86)}" width="${f(L * 0.03)}" height="${f(h * 0.32)}" fill="#ffffff" opacity="0.5"/>`;
  g += `<rect x="${f(x0)}" y="${f(y - h * 0.42)}" width="${f(L)}" height="${f(h * 0.08)}" fill="#ffd23f"/><rect x="${f(x0 + L * 0.9)}" y="${f(y - h * 0.86)}" width="${f(L * 0.08)}" height="${f(h * 0.6)}" rx="4" fill="#7ac8f0"/>`;
  g += wheel(x0 + L * 0.2, y - h * 0.14, h * 0.17) + wheel(x0 + L * 0.8, y - h * 0.14, h * 0.17);
  return squash(x, y, o, g); }
export function car(x, y, L, o = {}) { const h = L * 0.36, x0 = x - L / 2, col = o.col || '#3a6ad0';
  let g = `<path d="M ${f(x0)} ${f(y - h * 0.22)} L ${f(x0)} ${f(y - h * 0.55)} Q ${f(x0 + L * 0.04)} ${f(y - h * 0.62)} ${f(x0 + L * 0.18)} ${f(y - h * 0.62)} L ${f(x0 + L * 0.3)} ${f(y - h)} L ${f(x0 + L * 0.72)} ${f(y - h)} L ${f(x0 + L * 0.84)} ${f(y - h * 0.62)} L ${f(x0 + L)} ${f(y - h * 0.58)} L ${f(x0 + L)} ${f(y - h * 0.22)} Z" fill="${col}" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`;
  g += `<path d="M ${f(x0 + L * 0.33)} ${f(y - h * 0.92)} L ${f(x0 + L * 0.5)} ${f(y - h * 0.92)} L ${f(x0 + L * 0.5)} ${f(y - h * 0.64)} L ${f(x0 + L * 0.24)} ${f(y - h * 0.64)} Z" fill="#a8e4ff"/><path d="M ${f(x0 + L * 0.53)} ${f(y - h * 0.92)} L ${f(x0 + L * 0.7)} ${f(y - h * 0.92)} L ${f(x0 + L * 0.79)} ${f(y - h * 0.64)} L ${f(x0 + L * 0.53)} ${f(y - h * 0.64)} Z" fill="#a8e4ff"/>`;
  g += `<rect x="${f(x0 + L * 0.94)}" y="${f(y - h * 0.5)}" width="${f(L * 0.05)}" height="${f(h * 0.1)}" fill="#ffe7a0"/><rect x="${f(x0 + L * 0.01)}" y="${f(y - h * 0.5)}" width="${f(L * 0.04)}" height="${f(h * 0.1)}" fill="#ff5a4a"/>`;
  g += wheel(x0 + L * 0.22, y - h * 0.18, h * 0.2) + wheel(x0 + L * 0.78, y - h * 0.18, h * 0.2);
  return squash(x, y, o, g); }
export function van(x, y, L, o = {}) { const h = L * 0.42, x0 = x - L / 2, col = o.col || '#1f2330';
  let g = `<path d="M ${f(x0)} ${f(y - h * 0.18)} L ${f(x0)} ${f(y - h)} L ${f(x0 + L * 0.74)} ${f(y - h)} L ${f(x0 + L * 0.92)} ${f(y - h * 0.58)} L ${f(x0 + L)} ${f(y - h * 0.52)} L ${f(x0 + L)} ${f(y - h * 0.18)} Z" fill="${col}" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`;
  g += `<path d="M ${f(x0 + L * 0.76)} ${f(y - h * 0.94)} L ${f(x0 + L * 0.9)} ${f(y - h * 0.6)} L ${f(x0 + L * 0.76)} ${f(y - h * 0.6)} Z" fill="#6a7a90"/><rect x="${f(x0 + L * 0.94)}" y="${f(y - h * 0.46)}" width="${f(L * 0.05)}" height="${f(h * 0.08)}" fill="#ffe7a0"/>`;
  g += wheel(x0 + L * 0.2, y - h * 0.16, h * 0.17) + wheel(x0 + L * 0.8, y - h * 0.16, h * 0.17);
  return g; }
// quadcopter drone (centre x, y; size s) with a blinking red light
export function drone(x, y, s, t = 0) { return `<g><rect x="${f(x - s * 0.26)}" y="${f(y - s * 0.1)}" width="${f(s * 0.52)}" height="${f(s * 0.2)}" rx="${f(s * 0.07)}" fill="#1c1f26" stroke="${OL}" stroke-width="2.5"/>` + [-0.5, 0.5].map((k) => `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + k * s)}" y2="${f(y - s * 0.12)}" stroke="#1c1f26" stroke-width="${f(s * 0.05)}"/><ellipse cx="${f(x + k * s)}" cy="${f(y - s * 0.16)}" rx="${f(s * 0.3)}" ry="${f(s * 0.045)}" fill="#c9d3dc" opacity="0.6"/>`).join('') + `<circle cx="${f(x)}" cy="${f(y + s * 0.07)}" r="${f(s * 0.05)}" fill="${Math.sin(t * 8) > 0 ? '#ff3b3b' : '#5a1010'}"/><circle cx="${f(x)}" cy="${f(y + s * 0.07)}" r="${f(s * 0.16)}" fill="#ff3b3b" opacity="${Math.sin(t * 8) > 0 ? 0.25 : 0}"/></g>`; }
