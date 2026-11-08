// "Simple figure" body, after the user's style reference: a big round black head, a jacket drawn as one soft block,
// sleeves to round mitten hands, slim trouser legs, small black feet, and one pale outline around the whole figure.
// Same pose format and return contract as char2d.person. Our own drawing (shapes, faces, hair and palette are ours).
const rad = (d) => (d * Math.PI) / 180;
const at = (p, a, l) => [p[0] + Math.sin(rad(a)) * l, p[1] + Math.cos(rad(a)) * l];
const f = (n) => n.toFixed(1);
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * k)))); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); };
const INK = '#0c0c12';
// tapered capsule A -> B (polygon + round ends)
function tube(A, B, wa, wb, fill, extra = '') {
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const p = [[A[0] + nx * wa / 2, A[1] + ny * wa / 2], [B[0] + nx * wb / 2, B[1] + ny * wb / 2], [B[0] - nx * wb / 2, B[1] - ny * wb / 2], [A[0] - nx * wa / 2, A[1] - ny * wa / 2]];
  return `<g fill="${fill}" ${extra}><path d="M ${p.map((q) => `${f(q[0])} ${f(q[1])}`).join(' L ')} Z"/><circle cx="${f(A[0])}" cy="${f(A[1])}" r="${f(wa / 2)}"/><circle cx="${f(B[0])}" cy="${f(B[1])}" r="${f(wb / 2)}"/></g>`;
}
const filters = new Set();
function outlineDef(col, w) {
  const id = 'ol' + col.replace(/[^0-9a-z]/gi, '') + Math.round(w * 10);
  return [id, `<filter id="${id}" x="-15%" y="-10%" width="130%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="${f(w)}" result="d"/><feFlood flood-color="${col}"/><feComposite in2="d" operator="in" result="o"/><feGaussianBlur in="o" stdDeviation="${f(w * 1.2)}" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`];
}
export function personRef(x, y, h, pose, o = {}) {
  const s = h / 340, side = o.flip ? -1 : 1;
  const top = o.top || '#e2553f', topS = shade(top, 0.78), topH = shade(top, 1.15), bot = o.bottom || '#283552', foot = INK;
  const W = o.broad ? 1.12 : 1;
  // skeleton: legs 112, torso 118, head R 50 (head ~ 0.3 of the height, like the reference's big heads)
  const hip = [x, y - (pose.sit ? 64 : 124) * s];
  const neck = at(hip, 180 - pose.lean * side, 100 * s);
  const R = 47 * s, hc = at(neck, 180 - (pose.lean + pose.head * 0.6) * side, R * 0.62);
  const tilt = rad(-pose.lean * side), cs = Math.cos(tilt), sn = Math.sin(tilt);
  const rot = (dx, dy, o0 = neck) => [o0[0] + dx * cs - dy * sn, o0[1] + dx * sn + dy * cs];
  const shL = rot(-27 * s * W, 12 * s), shR = rot(27 * s * W, 12 * s);
  const arm = (sh, a, sgn) => { const e = at(sh, sgn * (a[0] + 4) * side, 46 * s); const hd = at(e, sgn * (a[1] + 4) * side, 44 * s); return [sh, e, hd]; };
  const AL = arm(shL, pose.aL, -1), AR = arm(shR, pose.aR, 1);
  const hipL = rot(-12 * s, 0, hip), hipR = rot(12 * s, 0, hip);
  const leg = (h0, a, sgn) => { if (pose.sit) { const k = at(h0, side * (90 - sgn * 4), 58 * s); return [h0, k, at(k, side * 6, 58 * s)]; } const k = at(h0, sgn * (a[0] + 2) * side, 63 * s); const ft = at(k, sgn * (a[0] + 2) * side - sgn * a[1] * side * 0.3, 61 * s); return [h0, k, ft]; };
  const LL = leg(hipL, pose.lL, -1), LR = leg(hipR, pose.lR, 1);
  // legs: slim trousers (or shorts + bare ink legs), small rounded feet
  const legSvg = (P) => { let q = '';
    if (o.shorts) q += tube(P[0], P[1], 13 * s, 11 * s, INK) + tube(P[1], P[2], 11 * s, 10 * s, INK) + tube(P[0], [P[0][0] + (P[1][0] - P[0][0]) * 0.6, P[0][1] + (P[1][1] - P[0][1]) * 0.6], 22 * s, 20 * s, bot);
    else q += tube(P[0], P[1], 12.5 * s, 11.5 * s, bot) + tube(P[1], P[2], 11.5 * s, 11 * s, bot);
    const ft = P[2]; q += `<ellipse cx="${f(ft[0] + side * 6 * s)}" cy="${f(ft[1] + 2 * s)}" rx="${f(11 * s)}" ry="${f(6.5 * s)}" fill="${foot}"/>`;
    return q; };
  // arms: sleeve (long) or short sleeve + ink forearm; round mitten hand
  const armSvg = (P) => { let q = ''; const long = o.sleeves !== 'short';
    if (long) q += tube(P[0], P[1], 16 * s, 15 * s, top) + tube(P[1], P[2], 15 * s, 14 * s, top) + tube(P[0], P[1], 5 * s, 4 * s, topH, `opacity="0.35" transform="translate(${f(side * 4 * s)} ${f(-1 * s)})"`);
    else q += tube(P[1], P[2], 11 * s, 10 * s, INK) + tube(P[0], P[1], 11 * s, 11 * s, INK) + tube(P[0], [P[0][0] + (P[1][0] - P[0][0]) * 0.6, P[0][1] + (P[1][1] - P[0][1]) * 0.6], 21 * s, 19 * s, top);
    const ang = Math.atan2(P[2][1] - P[1][1], P[2][0] - P[1][0]), hx = P[2][0] + Math.cos(ang) * 5 * s, hy = P[2][1] + Math.sin(ang) * 5 * s;
    q += `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(8.5 * s)}" fill="${INK}"/>`;
    return q; };
  // torso: one soft jacket block (rounded shoulders, straight sides, slight flare at the hem)
  const tp = (dx, dy) => rot(dx, dy);
  const torso = () => { const T = 100, a = tp(-29 * W * s, 16 * s), b = tp(29 * W * s, 16 * s), c = tp(30 * W * s, (T + 4) * s), d = tp(-30 * W * s, (T + 4) * s), tl = tp(-12 * s, 0), tr = tp(12 * s, 0), ql = tp(-29 * W * s, 1 * s), qr = tp(29 * W * s, 1 * s), cr = tp(30 * W * s, (T + 9) * s), cl = tp(-30 * W * s, (T + 9) * s), br = tp(24 * W * s, (T + 9) * s), bl = tp(-24 * W * s, (T + 9) * s);
    let q = `<path d="M ${f(tl[0])} ${f(tl[1])} L ${f(tr[0])} ${f(tr[1])} Q ${f(qr[0])} ${f(qr[1])} ${f(b[0])} ${f(b[1])} L ${f(c[0])} ${f(c[1])} Q ${f(cr[0])} ${f(cr[1])} ${f(br[0])} ${f(br[1])} L ${f(bl[0])} ${f(bl[1])} Q ${f(cl[0])} ${f(cl[1])} ${f(d[0])} ${f(d[1])} L ${f(a[0])} ${f(a[1])} Q ${f(ql[0])} ${f(ql[1])} ${f(tl[0])} ${f(tl[1])} Z" fill="${top}"/>`;
    const sd = -side, e1 = tp(sd * 29 * W * s, 16 * s), e2 = tp(sd * 30 * W * s, 104 * s), e3 = tp(sd * 19 * s, 109 * s), e4 = tp(sd * 19 * s, 18 * s);
    q += `<path d="M ${f(e1[0])} ${f(e1[1])} L ${f(e2[0])} ${f(e2[1])} L ${f(e3[0])} ${f(e3[1])} L ${f(e4[0])} ${f(e4[1])} Z" fill="${topS}" opacity="0.6"/>`;
    if (o.hood) { const h1 = tp(-24 * s, 6 * s), h2 = tp(24 * s, 6 * s), hm = tp(0, 26 * s); q += `<path d="M ${f(h1[0])} ${f(h1[1])} Q ${f(hm[0])} ${f(hm[1])} ${f(h2[0])} ${f(h2[1])}" stroke="${topS}" stroke-width="${f(9 * s)}" fill="none" stroke-linecap="round"/>`;
      for (const dx of [-7, 7]) { const p1 = tp(dx * s, 22 * s), p2 = tp(dx * s, 46 * s); q += `<line x1="${f(p1[0])}" y1="${f(p1[1])}" x2="${f(p2[0])}" y2="${f(p2[1])}" stroke="#f4f4f4" stroke-width="${f(2.4 * s)}" stroke-linecap="round"/>`; }
      const k1 = tp(-17 * s, 68 * s), k2 = tp(17 * s, 68 * s), k3 = tp(21 * s, 92 * s), k4 = tp(-21 * s, 92 * s); q += `<path d="M ${f(k1[0])} ${f(k1[1])} L ${f(k2[0])} ${f(k2[1])} L ${f(k3[0])} ${f(k3[1])} L ${f(k4[0])} ${f(k4[1])} Z" fill="${topS}" opacity="0.5"/>`; }
    else { const z1 = tp(0, 14 * s), z2 = tp(0, 108 * s); q += `<line x1="${f(z1[0])}" y1="${f(z1[1])}" x2="${f(z2[0])}" y2="${f(z2[1])}" stroke="${topS}" stroke-width="${f(2.2 * s)}" opacity="0.7"/>`; }
    return q; };
  // head: big ink circle, white eyes with half lids, hair / cap
  const head = () => { let q = '';
    if (o.hair === 'ponytail') { const pt = [hc[0] - side * R * 0.9, hc[1] - R * 0.1]; q += `<path d="M ${f(pt[0])} ${f(pt[1])} q ${f(-side * 26 * s)} ${f(16 * s)} ${f(-side * 12 * s)} ${f(58 * s)} q ${f(side * 12 * s)} ${f(-22 * s)} ${f(side * 20 * s)} ${f(-56 * s)} z" fill="${INK}"/>`; }
    q += `<circle cx="${f(hc[0])}" cy="${f(hc[1])}" r="${f(R)}" fill="${INK}"/>`;
    if (o.hair === 'short') { let d = ''; const n = 7; for (let i = 0; i <= n; i++) { const a = Math.PI * (1.08 + 0.84 * i / n), r = R * (i % 2 ? 1.2 : 0.96), sw = side * R * 0.12; d += `${i ? 'L' : 'M'} ${f(hc[0] + Math.cos(a) * r + (i % 2 ? sw : 0))} ${f(hc[1] + Math.sin(a) * r)} `; } q += `<path d="${d} Z" fill="${INK}" stroke-linejoin="round"/>`; }
    if (o.hair === 'curly') for (let i = 0; i < 7; i++) { const a = Math.PI * (1.1 + 0.8 * i / 6); q += `<circle cx="${f(hc[0] + Math.cos(a) * R * 0.95)}" cy="${f(hc[1] + Math.sin(a) * R * 0.95)}" r="${f(R * 0.26)}" fill="${INK}"/>`; }
    const k = R / 46, lx = (o.look || 0) * 6 * s, ey = hc[1] - 2 * k, face = o.face || 'neutral';
    for (const dx of [-15, 15]) { const ex = hc[0] + dx * k + lx;
      if (face === 'smile') { q += `<path d="M ${f(ex - 8 * k)} ${f(ey + 2 * k)} q ${f(8 * k)} ${f(-11 * k)} ${f(16 * k)} 0" stroke="#fff" stroke-width="${f(4 * k)}" fill="none" stroke-linecap="round"/>`; continue; }
      const ry = (face === 'open' ? 11.5 : 10) * k; q += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(9.5 * k)}" ry="${f(ry)}" fill="#fff"/><circle cx="${f(ex + lx * 0.35)}" cy="${f(ey + (face === 'open' ? 1.5 : 4) * k)}" r="${f(4 * k)}" fill="${INK}"/>`;
      if (face === 'neutral' || face === 'bored') q += `<rect x="${f(ex - 10 * k)}" y="${f(ey - ry - 2 * k)}" width="${f(20 * k)}" height="${f(ry * (face === 'bored' ? 1.1 : 0.75))}" fill="${INK}"/><line x1="${f(ex - 9 * k)}" y1="${f(ey - ry * (face === 'bored' ? -0.1 : 0.25))}" x2="${f(ex + 9 * k)}" y2="${f(ey - ry * (face === 'bored' ? -0.1 : 0.25))}" stroke="#fff" stroke-width="${f(1.6 * k)}" opacity="0.5"/>`;
      if (face === 'worried') q += `<line x1="${f(ex - 9 * k)}" y1="${f(ey - 15 * k + (dx < 0 ? 4 : -4) * k)}" x2="${f(ex + 9 * k)}" y2="${f(ey - 15 * k + (dx < 0 ? -4 : 4) * k)}" stroke="#fff" stroke-width="${f(3.2 * k)}" stroke-linecap="round"/>`; }
    const my = hc[1] + 20 * k, mx = hc[0] + lx;
    if (face === 'open') q += `<ellipse cx="${f(mx)}" cy="${f(my)}" rx="${f(7 * k)}" ry="${f(9 * k)}" fill="#fff"/>`;
    else if (face === 'smile') q += `<path d="M ${f(mx - 12 * k)} ${f(my - 4 * k)} q ${f(12 * k)} ${f(12 * k)} ${f(24 * k)} 0" stroke="#fff" stroke-width="${f(4 * k)}" fill="none" stroke-linecap="round"/>`;
    else q += `<line x1="${f(mx - 7 * k)}" y1="${f(my)}" x2="${f(mx + 7 * k)}" y2="${f(my)}" stroke="#fff" stroke-width="${f(3 * k)}" stroke-linecap="round"/>`;
    if (o.cap) { const c = o.cap, c2 = shade(c, 0.75); q += `<path d="M ${f(hc[0] - R * 1.0)} ${f(hc[1] - R * 0.2)} A ${f(R)} ${f(R * 0.95)} 0 0 1 ${f(hc[0] + R * 1.0)} ${f(hc[1] - R * 0.2)} Z" fill="${c}"/><path d="M ${f(hc[0] + side * R * 0.3)} ${f(hc[1] - R * 0.26)} L ${f(hc[0] + side * R * 1.55)} ${f(hc[1] - R * 0.14)} Q ${f(hc[0] + side * R * 1.2)} ${f(hc[1] - R * 0.38)} ${f(hc[0] + side * R * 0.7)} ${f(hc[1] - R * 0.4)} Z" fill="${c2}"/>`; }
    return { svg: q, mouth: [mx, my] }; };
  const back = side > 0 ? AL : AR, front = side > 0 ? AR : AL;
  let g = legSvg(side > 0 ? LL : LR) + legSvg(side > 0 ? LR : LL) + armSvg(back) + torso() + armSvg(front);
  const H = head(); g += H.svg;
  const [id, def] = outlineDef(o.rim || '#dcecff', Math.max(1.5, 4.2 * s));
  return { svg: `<g><defs>${def}</defs><g filter="url(#${id})">${g}</g></g>`, head: hc, R, mouth: H.mouth, shL, shR, hands: [AL[2], AR[2]] };
}
