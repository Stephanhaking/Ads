// "Simple figure" body, after the user's style reference: a big round black head, a jacket drawn as one soft block,
// sleeves to round mitten hands, slim trouser legs, small black feet, and one pale outline around the whole figure.
// Same pose format and return contract as char2d.person. Our own drawing (shapes, faces, hair and palette are ours).
const rad = (d) => (d * Math.PI) / 180;
const at = (p, a, l) => [p[0] + Math.sin(rad(a)) * l, p[1] + Math.cos(rad(a)) * l];
const f = (n) => n.toFixed(1);
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * k)))); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); };
const INK = '#050507';
// tapered capsule A -> B (polygon + round ends)
function tube(A, B, wa, wb, fill, extra = '') {
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const p = [[A[0] + nx * wa / 2, A[1] + ny * wa / 2], [B[0] + nx * wb / 2, B[1] + ny * wb / 2], [B[0] - nx * wb / 2, B[1] - ny * wb / 2], [A[0] - nx * wa / 2, A[1] - ny * wa / 2]];
  return `<g fill="${fill}" ${extra}><path d="M ${p.map((q) => `${f(q[0])} ${f(q[1])}`).join(' L ')} Z"/><circle cx="${f(A[0])}" cy="${f(A[1])}" r="${f(wa / 2)}"/><circle cx="${f(B[0])}" cy="${f(B[1])}" r="${f(wb / 2)}"/></g>`;
}
const filters = new Set();
function outlineDef(col, w) {
  const id = 'ol' + col.replace(/[^0-9a-z]/gi, '') + Math.round(w * 10);
  return [id, `<filter id="${id}" x="-15%" y="-10%" width="130%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="${f(w)}" result="d"/><feFlood flood-color="${col}"/><feComposite in2="d" operator="in" result="o"/><feMorphology in="SourceAlpha" operator="dilate" radius="${f(w * 2.2)}" result="d2"/><feFlood flood-color="${col}" flood-opacity="0.35"/><feComposite in2="d2" operator="in" result="o2"/><feGaussianBlur in="o2" stdDeviation="${f(w * 1.4)}" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`];
}
export function personRef(x, y, h, pose, o = {}) {
  const s = h / 340, side = o.flip ? -1 : 1;
  const top = o.top || '#e2553f', topS = shade(top, 0.78), topH = shade(top, 1.15), bot = o.bottom || '#283552', foot = INK;
  const W = o.broad ? 1.12 : 1;
  // skeleton (reference-style proportions): head diameter ~0.32 of the height, A-line coat ~0.36, stick legs ~0.34
  const hip = [x, y - (pose.sit ? 70 : 118) * s];
  const neck = at(hip, 180 - pose.lean * side, 112 * s);
  const R = 54 * s, hc = at(neck, 180 - (pose.lean + pose.head * 0.6) * side, R * 0.78);
  const tilt = rad(pose.lean * side), cs = Math.cos(tilt), sn = Math.sin(tilt);
  const rot = (dx, dy, o0 = neck) => [o0[0] + dx * cs - dy * sn, o0[1] + dx * sn + dy * cs];
  const shL = rot(-21 * s * W * side, 14 * s), shR = rot(21 * s * W * side, 14 * s);
  const arm = (sh, a, sgn) => { const e = at(sh, sgn * (a[0] + 6) * side, 52 * s); const hd = at(e, sgn * (a[1] + 4) * side, 50 * s); return [sh, e, hd]; };
  const AL = arm(shL, pose.aL, -1), AR = arm(shR, pose.aR, 1);
  const hipL = rot(-11 * s * side, 0, hip), hipR = rot(11 * s * side, 0, hip);
  const leg = (h0, a, sgn) => { if (pose.sit) { const k = at(h0, side * (90 - sgn * 4), 60 * s); return [h0, k, at(k, side * 6, 60 * s)]; } const k = at(h0, sgn * (a[0] + 5) * side, 60 * s); const ft = at(k, sgn * (a[0] + 5) * side - sgn * a[1] * side * 0.3, 58 * s); return [h0, k, ft]; };
  const LL = leg(hipL, pose.lL, -1), LR = leg(hipR, pose.lR, 1);
  const legCol = o.shorts ? INK : shade(bot, 0.55);
  // legs: thin dark sticks, small ink feet pointing outward
  const legSvg = (P, sgn) => { let q = tube(P[0], P[1], 10 * s, 9.5 * s, legCol) + tube(P[1], P[2], 9.5 * s, 9 * s, legCol);
    const ft = P[2], dir = pose.sit ? side : sgn * side; q += `<ellipse cx="${f(ft[0] + dir * 6 * s)}" cy="${f(ft[1] + 1 * s)}" rx="${f(10.5 * s)}" ry="${f(6 * s)}" fill="${INK}"/>`;
    return q; };
  // arms: thin coat-colour sleeves, small round ink hands
  const armSvg = (P) => { let q = tube(P[0], P[1], 15 * s, 14 * s, top) + tube(P[1], P[2], 14 * s, 13 * s, top);
    const ang = Math.atan2(P[2][1] - P[1][1], P[2][0] - P[1][0]), hx = P[2][0] + Math.cos(ang) * 4 * s, hy = P[2][1] + Math.sin(ang) * 4 * s;
    q += `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(8 * s)}" fill="${INK}"/>`;
    return q; };
  // torso: A-line coat (narrow shoulders, wider flat hem), one shaded side
  const tp = (dx, dy) => rot(dx, dy);
  const torso = () => { const T = 120, n1 = tp(-10 * s, 0), n2 = tp(10 * s, 0), s1 = tp(-22 * W * s, 10 * s), s2 = tp(22 * W * s, 10 * s), b1 = tp(-33 * W * s, T * s), b2 = tp(33 * W * s, T * s), q1 = tp(-21 * W * s, 1 * s), q2 = tp(21 * W * s, 1 * s);
    let q = `<path d="M ${f(n1[0])} ${f(n1[1])} L ${f(n2[0])} ${f(n2[1])} Q ${f(q2[0])} ${f(q2[1])} ${f(s2[0])} ${f(s2[1])} L ${f(b2[0])} ${f(b2[1])} L ${f(b1[0])} ${f(b1[1])} L ${f(s1[0])} ${f(s1[1])} Q ${f(q1[0])} ${f(q1[1])} ${f(n1[0])} ${f(n1[1])} Z" fill="${top}" stroke="${topS}" stroke-width="${f(1.5 * s)}" stroke-linejoin="round"/>`;
    const sd = -side, e1 = tp(sd * 22 * W * s, 10 * s), e2 = tp(sd * 33 * W * s, T * s), e3 = tp(sd * 22 * W * s, T * s), e4 = tp(sd * 15 * W * s, 12 * s);
    q += `<path d="M ${f(e1[0])} ${f(e1[1])} L ${f(e2[0])} ${f(e2[1])} L ${f(e3[0])} ${f(e3[1])} L ${f(e4[0])} ${f(e4[1])} Z" fill="${topS}" opacity="0.45"/>`;
    if (o.scarf) { const a1 = tp(-14 * s, 4 * s), a2 = tp(14 * s, 4 * s), t1 = tp(4 * s, 8 * s), t2 = tp(8 * s, 46 * s), t3 = tp(15 * s, 44 * s); q += `<path d="M ${f(a1[0])} ${f(a1[1])} L ${f(a2[0])} ${f(a2[1])}" stroke="${o.scarf}" stroke-width="${f(8 * s)}" stroke-linecap="round"/><path d="M ${f(t1[0])} ${f(t1[1])} L ${f(t2[0])} ${f(t2[1])} L ${f(t3[0])} ${f(t3[1])} Z" fill="${o.scarf}"/>`; }
    if (o.hood) { for (const dx of [-6, 6]) { const p1 = tp(dx * s, 16 * s), p2 = tp(dx * s * 1.2, 40 * s); q += `<line x1="${f(p1[0])}" y1="${f(p1[1])}" x2="${f(p2[0])}" y2="${f(p2[1])}" stroke="#f4f4f4" stroke-width="${f(2.2 * s)}" stroke-linecap="round"/>`; } }
    return q; };
  // head: big ink circle, white eyes with half lids, hair / cap
  const head = () => { let q = '';
    if (o.hair === 'ponytail') { const pt = [hc[0] - side * R * 0.9, hc[1] - R * 0.1]; q += `<path d="M ${f(pt[0])} ${f(pt[1])} q ${f(-side * 26 * s)} ${f(16 * s)} ${f(-side * 12 * s)} ${f(58 * s)} q ${f(side * 12 * s)} ${f(-22 * s)} ${f(side * 20 * s)} ${f(-56 * s)} z" fill="${INK}"/>`; }
    q += `<circle cx="${f(hc[0])}" cy="${f(hc[1])}" r="${f(R)}" fill="${INK}"/>`;
    if (o.hair === 'short') { let d = ''; const n = 7; for (let i = 0; i <= n; i++) { const a = Math.PI * (1.08 + 0.84 * i / n), r = R * (i % 2 ? 1.2 : 0.96), sw = side * R * 0.12; d += `${i ? 'L' : 'M'} ${f(hc[0] + Math.cos(a) * r + (i % 2 ? sw : 0))} ${f(hc[1] + Math.sin(a) * r)} `; } q += `<path d="${d} Z" fill="${INK}" stroke-linejoin="round"/>`; }
    if (o.hair === 'curly') for (let i = 0; i < 7; i++) { const a = Math.PI * (1.1 + 0.8 * i / 6); q += `<circle cx="${f(hc[0] + Math.cos(a) * R * 0.95)}" cy="${f(hc[1] + Math.sin(a) * R * 0.95)}" r="${f(R * 0.26)}" fill="${INK}"/>`; }
    const k = R / 46, lx = (o.look || 0) * 6 * s, ey = hc[1] - 1 * k, face = o.face || 'neutral';
    for (const dx of [-15, 15]) { const ex = hc[0] + dx * k + lx, rx = 8.5 * k;
      if (face === 'smile' || face === 'closed') { q += `<path d="M ${f(ex - rx)} ${f(ey + 1 * k)} q ${f(rx)} ${f(face === 'smile' ? -9 * k : 6 * k)} ${f(rx * 2)} 0" stroke="#fff" stroke-width="${f(3.4 * k)}" fill="none" stroke-linecap="round"/>`; continue; }
      if (face === 'open') q += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(rx)}" ry="${f(rx * 1.1)}" fill="#fff"/><circle cx="${f(ex + lx * 0.35)}" cy="${f(ey + 1 * k)}" r="${f(3.6 * k)}" fill="${INK}"/>`;
      else q += `<path d="M ${f(ex - rx)} ${f(ey - 1.5 * k)} L ${f(ex + rx)} ${f(ey - 1.5 * k)} A ${f(rx)} ${f(rx * 0.95)} 0 0 1 ${f(ex - rx)} ${f(ey - 1.5 * k)} Z" fill="#fff"/><circle cx="${f(ex + lx * 0.35)}" cy="${f(ey + 3 * k)}" r="${f(3.4 * k)}" fill="${INK}"/>`;
      if (face === 'worried') q += `<line x1="${f(ex - 9 * k)}" y1="${f(ey - 13 * k + (dx < 0 ? 4 : -4) * k)}" x2="${f(ex + 9 * k)}" y2="${f(ey - 13 * k + (dx < 0 ? -4 : 4) * k)}" stroke="#fff" stroke-width="${f(3 * k)}" stroke-linecap="round"/>`; }
    const my = hc[1] + 17 * k, mx = hc[0] + lx;
    if (face === 'open') q += `<ellipse cx="${f(mx)}" cy="${f(my)}" rx="${f(7 * k)}" ry="${f(9 * k)}" fill="#fff"/>`;
    else if (face === 'smile') q += `<path d="M ${f(mx - 12 * k)} ${f(my - 4 * k)} q ${f(12 * k)} ${f(12 * k)} ${f(24 * k)} 0" stroke="#fff" stroke-width="${f(4 * k)}" fill="none" stroke-linecap="round"/>`;
    else q += `<line x1="${f(mx - 7 * k)}" y1="${f(my)}" x2="${f(mx + 7 * k)}" y2="${f(my)}" stroke="#fff" stroke-width="${f(3 * k)}" stroke-linecap="round"/>`;
    if (o.cap) { const c = o.cap, c2 = shade(c, 0.75); q += `<path d="M ${f(hc[0] - R * 1.0)} ${f(hc[1] - R * 0.2)} A ${f(R)} ${f(R * 0.95)} 0 0 1 ${f(hc[0] + R * 1.0)} ${f(hc[1] - R * 0.2)} Z" fill="${c}"/><path d="M ${f(hc[0] + side * R * 0.3)} ${f(hc[1] - R * 0.26)} L ${f(hc[0] + side * R * 1.55)} ${f(hc[1] - R * 0.14)} Q ${f(hc[0] + side * R * 1.2)} ${f(hc[1] - R * 0.38)} ${f(hc[0] + side * R * 0.7)} ${f(hc[1] - R * 0.4)} Z" fill="${c2}"/>`; }
    return { svg: q, mouth: [mx, my] }; };
  const back = side > 0 ? AL : AR, front = side > 0 ? AR : AL, skip = (A) => (o.noArm === 'R' && A === AR) || (o.noArm === 'L' && A === AL);
  let g = legSvg(LL, -1) + legSvg(LR, 1) + (skip(back) ? '' : armSvg(back)) + torso() + (skip(front) ? '' : armSvg(front));
  const H = head(); g += H.svg;
  const [id, def] = outlineDef(o.rim || '#dcecff', Math.max(1.3, 3 * s));
  return { svg: `<g><defs>${def}</defs><g filter="url(#${id})">${g}</g></g>`, head: hc, R, mouth: H.mouth, shL, shR, hands: [AL[2], AR[2]] };
}
