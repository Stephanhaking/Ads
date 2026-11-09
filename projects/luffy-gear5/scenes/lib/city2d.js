// 2.5D flat city (our own drawing): each building is a front face plus a darker side face receding toward a vanishing
// point, with window grids on both faces (side windows skewed in perspective), a roof ledge and rooftop clutter.
// city() stacks several depth layers: far = pale, hazy and simple; near = saturated and detailed; fog between layers.
// All in stage px; deterministic (seeded), so it renders identically every frame.
const f = (n) => n.toFixed(1);
const hx = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mix = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
const rnd = (seed) => { let s = seed % 2147483647 || 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
const quad = (p, fill, extra = '') => `<path d="M ${p.map((q) => `${f(q[0])} ${f(q[1])}`).join(' L ')} Z" fill="${fill}" ${extra}/>`;

// one building. x = left of the front face, base = ground y, w/h = front size, o.vp = [vx, vy] vanishing point,
// o.depth = side depth factor (0..0.5), o.col / o.side / o.win / o.lit colours, o.style 'office'|'apartment'|'tower'
export function building(x, base, w, h, o = {}) {
  const R = rnd(o.seed || 1), vp = o.vp || [960, 420], dk = o.depth ?? 0.18, top = base - h;
  const col = o.col || '#8a6a7a', side = o.side || mix(col, '#000000', 0.32), win = o.win || mix(col, '#000000', 0.45), lit = o.lit || '#ffd27a', litP = o.litP ?? 0.18;
  const right = x + w / 2 < vp[0];   // left of the vanishing point -> we see its right side
  const ex = right ? x + w : x, toV = (px, py) => [px + (vp[0] - px) * dk, py + (vp[1] - py) * dk];
  const sT = toV(ex, top), sB = toV(ex, base);
  let g = '';
  // side face + its windows (skewed)
  g += quad([[ex, top], sT, sB, [ex, base]], side);
  const rows = Math.max(2, Math.floor(h / (o.rowH || 46))), sc = Math.max(1, Math.round(Math.abs(sT[0] - ex) / 34));
  for (let r = 0; r < rows - 1; r++) for (let c = 0; c < sc; c++) { const u0 = (c + 0.25) / sc, u1 = (c + 0.75) / sc, v0 = (r + 0.3) / rows, v1 = (r + 0.75) / rows;
    const P = (u, v) => { const ax = ex + (sT[0] - ex) * u, ay = top + (sT[1] - top) * u, bx = ex + (sB[0] - ex) * u, by = base + (sB[1] - base) * u; return [ax + (bx - ax) * v, ay + (by - ay) * v]; };
    if (r < rows - 1) g += quad([P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], R() < litP * 0.7 ? mix(lit, side, 0.3) : mix(win, side, 0.4)); }
  // front face
  g += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="${col}"/>`;
  const st = o.style || 'apartment';
  if (st === 'tower') { for (let y = top + 18; y < base - 10; y += 22) g += `<rect x="${f(x + 6)}" y="${f(y)}" width="${f(w - 12)}" height="9" fill="${win}" opacity="0.8"/>`; g += `<rect x="${f(x + w * 0.62)}" y="${f(top)}" width="${f(w * 0.08)}" height="${f(h)}" fill="#ffffff" opacity="0.08"/>`; }
  else { const cols = Math.max(2, Math.floor(w / (o.colW || 44))), cw = w / cols, rh = h / rows;
    for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols; c++) { const wx = x + c * cw + cw * 0.22, wy = top + r * rh + rh * 0.28, ww = cw * 0.56, wh = rh * (st === 'office' ? 0.58 : 0.48);
      const on = R() < litP; g += `<rect x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="${f(wh)}" fill="${on ? lit : win}"/>`;
      if (st === 'apartment' && r % 2 === 1 && o.balcony !== false) g += `<rect x="${f(wx - cw * 0.08)}" y="${f(wy + wh)}" width="${f(ww + cw * 0.16)}" height="${f(rh * 0.12)}" fill="${mix(col, '#ffffff', 0.12)}"/>`; }
    if (st === 'office') for (let c = 1; c < cols; c++) g += `<rect x="${f(x + c * cw - 2)}" y="${f(top)}" width="4" height="${f(h)}" fill="${mix(col, '#ffffff', 0.1)}"/>`; }
  // roof ledge + clutter, and a soft light edge on the lit side
  g += `<rect x="${f(x - 4)}" y="${f(top - 8)}" width="${f(w + 8)}" height="10" fill="${mix(col, '#ffffff', 0.15)}"/>` + quad([[ex, top - 8], toV(ex, top - 8), toV(ex, top + 2), [ex, top + 2]], mix(side, '#ffffff', 0.1));
  if (o.roof !== false && R() < 0.7) { const bx = x + w * (0.15 + R() * 0.5); g += `<rect x="${f(bx)}" y="${f(top - 30)}" width="${f(Math.min(60, w * 0.25))}" height="22" fill="${mix(col, '#000000', 0.2)}"/>`; if (R() < 0.4) g += `<rect x="${f(bx + 70)}" y="${f(top - 54)}" width="4" height="46" fill="${mix(col, '#000000', 0.4)}"/>`; }
  g += `<rect x="${f(right ? x : x + w - 6)}" y="${f(top)}" width="6" height="${f(h)}" fill="#ffffff" opacity="0.07"/>`;
  return g;
}
// a layered skyline. o: { vp, ground, fog (haze colour), pal [colours], lit, litP, layers: [{n, y0, hmin, hmax, wmin, wmax, haze, seed, depth, style}] }
export function city(o = {}) {
  const vp = o.vp || [960, 420], fog = o.fog || '#c9d3dc', pal = o.pal || ['#8a6a7a', '#7a8698', '#9a7a6a', '#6a7a8a'];
  const L = o.layers || [
    { n: 9, x0: -700, x1: 2600, hmin: 380, hmax: 720, wmin: 160, wmax: 260, haze: 0.72, seed: 3, depth: 0.08, style: 'tower', litP: 0.05 },
    { n: 7, x0: -600, x1: 2500, hmin: 260, hmax: 520, wmin: 200, wmax: 320, haze: 0.45, seed: 7, depth: 0.14, style: 'office' },
    { n: 5, x0: -500, x1: 2400, hmin: 200, hmax: 420, wmin: 260, wmax: 420, haze: 0.18, seed: 11, depth: 0.2, style: 'apartment' }];
  let g = '';
  L.forEach((ly, li) => { const R = rnd(ly.seed || li + 1), base = (ly.base ?? o.ground ?? 800), span = (ly.x1 - ly.x0) / ly.n; const items = [];
    for (let i = 0; i < ly.n; i++) { const w = ly.wmin + R() * (ly.wmax - ly.wmin), h = ly.hmin + R() * (ly.hmax - ly.hmin), x = ly.x0 + i * span + R() * span * 0.35; items.push([x, w, h, i]); }
    // draw outer buildings first so ones nearer the vanishing point overlap correctly
    items.sort((a, b) => Math.abs(b[0] + b[1] / 2 - vp[0]) - Math.abs(a[0] + a[1] / 2 - vp[0]));
    for (const [x, w, h, i] of items) { const c = mix(pal[(i + li) % pal.length], fog, ly.haze);
      g += building(x, base, w, h, { vp, depth: ly.depth, col: c, side: mix(mix(pal[(i + li) % pal.length], '#000000', 0.35), fog, ly.haze), win: mix(mix(pal[(i + li) % pal.length], '#000000', 0.5), fog, ly.haze * 0.9), lit: mix(o.lit || '#ffd27a', fog, ly.haze * 0.8), litP: ly.litP ?? o.litP ?? 0.15, style: ly.style, seed: (ly.seed || 1) * 100 + i, roof: li > 0 }); }
    g += `<rect x="-1200" y="-600" width="4400" height="${f(base + 600)}" fill="${fog}" opacity="${f(ly.fogAfter ?? 0.12)}"/>`; });
  return g;
}
