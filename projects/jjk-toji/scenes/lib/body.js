// "Pro" 2D character body: same pose format and return contract as char2d.person ({svg, head, R, mouth} + shoulders and
// hands), but with real proportions (head ~1/5.5 of the height, long legs), a shaped torso (shoulders, chest, waist, hips),
// tapered limbs with elbows and knees, mitten hands with a thumb, shoes with soles, clothes that wrap the limbs (sleeves,
// cuffs, trouser legs, hoodie with hood, pocket and drawstrings), two-tone shading and a rim light. Original design.
const rad = (d) => (d * Math.PI) / 180;
const at = (p, a, l) => [p[0] + Math.sin(rad(a)) * l, p[1] + Math.cos(rad(a)) * l];
const f = (n) => n.toFixed(1);
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * k)))); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); };
const SKIN = '#0b0b10';
// tapered capsule from A (width wa) to B (width wb)
function tube(A, B, wa, wb, fill, extra = '') {
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const p = [[A[0] + nx * wa / 2, A[1] + ny * wa / 2], [B[0] + nx * wb / 2, B[1] + ny * wb / 2], [B[0] - nx * wb / 2, B[1] - ny * wb / 2], [A[0] - nx * wa / 2, A[1] - ny * wa / 2]];
  return `<g fill="${fill}" ${extra}><path d="M ${p.map((q) => `${f(q[0])} ${f(q[1])}`).join(' L ')} Z"/><circle cx="${f(A[0])}" cy="${f(A[1])}" r="${f(wa / 2)}"/><circle cx="${f(B[0])}" cy="${f(B[1])}" r="${f(wb / 2)}"/></g>`;
}
export function personPro(x, y, h, pose, o = {}) {
  const s = h / 340, side = o.flip ? -1 : 1, rim = o.rim || '#ffd2a0', ro = [side * 3 * s, -3 * s];
  const top = o.top || '#e2553f', topS = o.top2 || shade(top, 0.7), topH = shade(top, 1.12), bot = o.bottom || '#283552', botS = shade(bot, 0.72), shoe = o.shoes || '#15161b';
  const SW = o.broad ? 1.18 : 1;
  // skeleton
  const hip = [x, y - (pose.sit ? 86 : 162) * s];
  const neck = at(hip, 180 - pose.lean * side, 104 * s);
  const R = 31 * s, hc = at(neck, 180 - (pose.lean + pose.head) * side, R + 10 * s);
  const tilt = rad(-pose.lean * side), cs = Math.cos(tilt), sn = Math.sin(tilt);
  const rot = (dx, dy, o0 = neck) => [o0[0] + dx * cs - dy * sn, o0[1] + dx * sn + dy * cs];
  const shL = rot(-33 * s * SW, 11 * s), shR = rot(33 * s * SW, 11 * s);
  const arm = (sh, a, sgn) => { const e = at(sh, sgn * a[0] * side, 58 * s); const hd = at(e, sgn * a[1] * side, 54 * s); return [sh, e, hd]; };
  const AL = arm(shL, pose.aL, -1), AR = arm(shR, pose.aR, 1);
  const hipL = rot(-16 * s, 0, hip), hipR = rot(16 * s, 0, hip);
  const leg = (h0, a, sgn) => { if (pose.sit) { const k = at(h0, side * (90 - sgn * 4), 80 * s); return [h0, k, at(k, side * 6, 80 * s)]; } const k = at(h0, sgn * a[0] * side, 82 * s); const ft = at(k, sgn * a[0] * side - sgn * a[1] * side * 0.3, 80 * s); return [h0, k, ft]; };
  const LL = leg(hipL, pose.lL, -1), LR = leg(hipR, pose.lR, 1);
  const R2 = (svgf) => svgf(ro[0], ro[1], rim) ;
  let g = '';
  // ---- legs (trousers or shorts) + shoes
  const legSvg = (P) => { let q = '';
    const thigh = (dx, dy, c, extra) => tube([P[0][0] + dx, P[0][1] + dy], [P[1][0] + dx, P[1][1] + dy], 34 * s, 27 * s, c, extra), shin = (dx, dy, c, extra, full) => tube([P[1][0] + dx, P[1][1] + dy], [P[2][0] + dx, P[2][1] + dy], full ? 27 * s : 16 * s, full ? 22 * s : 13 * s, c, extra);
        if (o.shorts) { q += tube(P[1], P[2], 16 * s, 13 * s, SKIN) + tube(P[0], [P[0][0] + (P[1][0] - P[0][0]) * 0.75, P[0][1] + (P[1][1] - P[0][1]) * 0.75], 36 * s, 32 * s, bot); }
    else { q += thigh(0, 0, bot) + shin(0, 0, bot, '', true) + tube([P[0][0] + side * 8 * s, P[0][1] + 6 * s], [P[1][0] + side * 6 * s, P[1][1]], 6 * s, 5 * s, shade(bot, 1.45), 'opacity="0.55"') + tube([P[1][0] + side * 5 * s, P[1][1] + 4 * s], [P[2][0] + side * 4 * s, P[2][1] - 12 * s], 5 * s, 4 * s, shade(bot, 1.45), 'opacity="0.45"') + tube([P[2][0], P[2][1] - 12 * s], P[2], 24 * s, 23 * s, botS); }
    const ft = P[2], dir = side; q += `<path d="M ${f(ft[0] - dir * 10 * s)} ${f(ft[1] - 9 * s)} Q ${f(ft[0] + dir * 6 * s)} ${f(ft[1] - 15 * s)} ${f(ft[0] + dir * 22 * s)} ${f(ft[1] - 4 * s)} Q ${f(ft[0] + dir * 27 * s)} ${f(ft[1] + 3 * s)} ${f(ft[0] + dir * 18 * s)} ${f(ft[1] + 5 * s)} L ${f(ft[0] - dir * 12 * s)} ${f(ft[1] + 5 * s)} Q ${f(ft[0] - dir * 15 * s)} ${f(ft[1] - 2 * s)} ${f(ft[0] - dir * 10 * s)} ${f(ft[1] - 9 * s)} Z" fill="${shoe}" stroke="${rim}" stroke-width="${f(1.4 * s)}"/><rect x="${f(Math.min(ft[0] - dir * 12 * s, ft[0] + dir * 19 * s))}" y="${f(ft[1] + 1.5 * s)}" width="${f(31 * s)}" height="${f(3.5 * s)}" rx="${f(1.5 * s)}" fill="#e8e8e8"/>`;
    return q; };
  // ---- arms (sleeves wrap the limb), mitten hand with thumb
  const armSvg = (P, sgn) => { let q = ''; const long = o.sleeves === 'long';
    if (long) { q += tube(P[0], P[1], 27 * s, 23 * s, top) + tube(P[1], P[2], 23 * s, 20 * s, top) + tube([P[1][0] + (P[2][0] - P[1][0]) * 0.8, P[1][1] + (P[2][1] - P[1][1]) * 0.8], P[2], 21 * s, 21 * s, topS) + tube(P[0], P[1], 7 * s, 6 * s, topH, 'opacity="0.35" transform="translate(' + f(side * 5 * s) + ' ' + f(-2 * s) + ')"'); }
    else { q += tube(P[0], P[1], 17 * s, 15 * s, SKIN) + tube(P[1], P[2], 15 * s, 13 * s, SKIN) + tube(P[0], [P[0][0] + (P[1][0] - P[0][0]) * 0.6, P[0][1] + (P[1][1] - P[0][1]) * 0.6], 29 * s, 26 * s, top); }
    const H = P[2], ang = Math.atan2(P[2][1] - P[1][1], P[2][0] - P[1][0]); const hx = H[0] + Math.cos(ang) * 8 * s, hy = H[1] + Math.sin(ang) * 8 * s;
    q += `<ellipse cx="${f(hx)}" cy="${f(hy)}" rx="${f(12 * s)}" ry="${f(13.5 * s)}" transform="rotate(${f(ang * 180 / Math.PI - 90)} ${f(hx)} ${f(hy)})" fill="${SKIN}"/><circle cx="${f(hx - side * sgn * 8 * s)}" cy="${f(hy - 6 * s)}" r="${f(5.5 * s)}" fill="${SKIN}"/>`;
    return q; };
  // ---- torso
  const tp = (dx, dy) => rot(dx, dy);
  const torsoPath = (ox = 0, oy = 0) => { const P = [tp(-35 * SW * s, 6 * s), tp(35 * SW * s, 6 * s), tp(33 * SW * s, 52 * s), tp(28 * s, 86 * s), tp(30 * s, 110 * s), tp(-30 * s, 110 * s), tp(-28 * s, 86 * s), tp(-33 * SW * s, 52 * s)].map((p) => [p[0] + ox, p[1] + oy]); const n = tp(0, -4 * s);
    return `M ${f(P[0][0])} ${f(P[0][1])} Q ${f(n[0] + ox)} ${f(n[1] + oy)} ${f(P[1][0])} ${f(P[1][1])} Q ${f(P[1][0] + 6 * s)} ${f(P[1][1] + 26 * s)} ${f(P[2][0])} ${f(P[2][1])} L ${f(P[3][0])} ${f(P[3][1])} L ${f(P[4][0])} ${f(P[4][1])} L ${f(P[5][0])} ${f(P[5][1])} L ${f(P[6][0])} ${f(P[6][1])} L ${f(P[7][0])} ${f(P[7][1])} Q ${f(P[0][0] - 6 * s)} ${f(P[0][1] + 26 * s)} ${f(P[0][0])} ${f(P[0][1])} Z`; };
  const torso = () => { let q = `<path d="${torsoPath()}" fill="${top}"/>`;
    const sd = -side; const a = tp(sd * 35 * SW * s, 6 * s), b = tp(sd * 30 * s, 110 * s), c = tp(sd * 17 * s, 110 * s), d = tp(sd * 18 * SW * s, 10 * s); q += `<path d="M ${f(a[0])} ${f(a[1])} L ${f(b[0])} ${f(b[1])} L ${f(c[0])} ${f(c[1])} L ${f(d[0])} ${f(d[1])} Z" fill="${topS}" opacity="0.75"/>`;
    const hb = [tp(-30 * s, 101 * s), tp(30 * s, 101 * s), tp(30 * s, 110 * s), tp(-30 * s, 110 * s)]; q += `<path d="M ${hb.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L ')} Z" fill="${topS}"/>`;
    if (o.hood) { const h1 = tp(-20 * s, -2 * s), h2 = tp(20 * s, -2 * s), hm = tp(0, 26 * s); q += `<path d="M ${f(h1[0])} ${f(h1[1])} Q ${f(hm[0])} ${f(hm[1])} ${f(h2[0])} ${f(h2[1])}" stroke="${topS}" stroke-width="${f(11 * s)}" fill="none" stroke-linecap="round"/>`;
      for (const dx of [-7, 7]) { const p1 = tp(dx * s, 18 * s), p2 = tp(dx * s * 1.1, 48 * s); q += `<line x1="${f(p1[0])}" y1="${f(p1[1])}" x2="${f(p2[0])}" y2="${f(p2[1])}" stroke="#f4f4f4" stroke-width="${f(2.6 * s)}" stroke-linecap="round"/><circle cx="${f(p2[0])}" cy="${f(p2[1])}" r="${f(2.6 * s)}" fill="#f4f4f4"/>`; }
      const k1 = tp(-17 * s, 72 * s), k2 = tp(17 * s, 72 * s), k3 = tp(21 * s, 96 * s), k4 = tp(-21 * s, 96 * s); q += `<path d="M ${f(k1[0])} ${f(k1[1])} L ${f(k2[0])} ${f(k2[1])} L ${f(k3[0])} ${f(k3[1])} L ${f(k4[0])} ${f(k4[1])} Z" fill="${topS}" opacity="0.55"/>`; }
    else { const c1 = tp(-12 * s, 0), c2 = tp(12 * s, 0), cm = tp(0, 14 * s); q += `<path d="M ${f(c1[0])} ${f(c1[1])} Q ${f(cm[0])} ${f(cm[1])} ${f(c2[0])} ${f(c2[1])} Z" fill="${SKIN}"/>`; }
    const hl = tp(side * 20 * SW * s, 14 * s), hl2 = tp(side * 22 * s, 48 * s); q += `<line x1="${f(hl[0])}" y1="${f(hl[1])}" x2="${f(hl2[0])}" y2="${f(hl2[1])}" stroke="${topH}" stroke-width="${f(5 * s)}" stroke-linecap="round" opacity="0.5"/>`;
    return q; };
  // ---- head
  const head = () => { let q = '';
    if (o.hair === 'ponytail') { const pt = [hc[0] - side * R * 0.85, hc[1] - R * 0.15]; q += `<path d="M ${f(pt[0])} ${f(pt[1])} q ${f(-side * 24 * s)} ${f(14 * s)} ${f(-side * 13 * s)} ${f(56 * s)} q ${f(side * 13 * s)} ${f(-22 * s)} ${f(side * 19 * s)} ${f(-53 * s)} z" fill="${SKIN}" stroke="${rim}" stroke-width="${f(2 * s)}"/><circle cx="${f(pt[0])}" cy="${f(pt[1])}" r="${f(6 * s)}" fill="${top}"/>`; }
    q += tube(neck, hc, 16 * s, 16 * s, SKIN);
    q += `<circle cx="${f(hc[0])}" cy="${f(hc[1])}" r="${f(R)}" fill="${SKIN}"/>`;
    if (o.hair === 'short') { const pts = []; const n = 9; for (let i = 0; i <= n; i++) { const a = Math.PI * (1.12 + 0.76 * i / n); const r = i % 2 ? R * (1.24 + 0.06 * (i % 3)) : R * 0.98; const sw = side * R * 0.18 * Math.sin(Math.PI * i / n); pts.push(`${f(hc[0] + Math.cos(a) * r + (i % 2 ? sw : 0))},${f(hc[1] + Math.sin(a) * r)}`); } q += `<path d="M ${pts.join(' L ')} Q ${f(hc[0])} ${f(hc[1] - R * 0.55)} ${pts[0]} Z" fill="${SKIN}" stroke="${rim}" stroke-width="${f(1.2 * s)}" stroke-linejoin="round" stroke-opacity="0.6"/>`; }
    const k = R / 46, lx = (o.look || 0) * 7 * s, ey = hc[1] - 4 * s, face = o.face || 'neutral';
    for (const dx of [-14, 14]) { const ex = hc[0] + dx * k + lx;
      if (face === 'smile') q += `<path d="M ${f(ex - 7 * k)} ${f(ey + 2 * k)} q ${f(7 * k)} ${f(-11 * k)} ${f(14 * k)} 0" stroke="#fff" stroke-width="${f(4.2 * k)}" fill="none" stroke-linecap="round"/>`;
      else q += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(8 * k)}" ry="${f((face === 'open' ? 11.5 : 10) * k)}" fill="#fff"/><circle cx="${f(ex + lx * 0.3)}" cy="${f(ey + 1.5 * k)}" r="${f(3.4 * k)}" fill="${SKIN}"/>`;
      if (face === 'worried') q += `<line x1="${f(ex - 9 * k)}" y1="${f(ey - 16 * k + (dx < 0 ? 4 : -4) * k)}" x2="${f(ex + 9 * k)}" y2="${f(ey - 16 * k + (dx < 0 ? -4 : 4) * k)}" stroke="#fff" stroke-width="${f(3.4 * k)}" stroke-linecap="round"/>`; }
    const my = hc[1] + 20 * k, mx = hc[0] + lx;
    if (face === 'open') q += `<ellipse cx="${f(mx)}" cy="${f(my)}" rx="${f(8 * k)}" ry="${f(10 * k)}" fill="#fff"/>`;
    else if (face === 'smile') q += `<path d="M ${f(mx - 13 * k)} ${f(my - 4 * k)} q ${f(13 * k)} ${f(13 * k)} ${f(26 * k)} 0" stroke="#fff" stroke-width="${f(4.2 * k)}" fill="none" stroke-linecap="round"/>`;
    else q += `<line x1="${f(mx - 9 * k)}" y1="${f(my)}" x2="${f(mx + 9 * k)}" y2="${f(my)}" stroke="#fff" stroke-width="${f(3.8 * k)}" stroke-linecap="round"/>`;
    if (o.cap) { const c = o.cap, cs2 = shade(c, 0.75); q += `<path d="M ${f(hc[0] - R * 1.02)} ${f(hc[1] - R * 0.18)} A ${f(R * 1.02)} ${f(R * 1.0)} 0 0 1 ${f(hc[0] + R * 1.02)} ${f(hc[1] - R * 0.18)} Z" fill="${c}"/><path d="M ${f(hc[0] + side * R * 0.2)} ${f(hc[1] - R * 0.22)} L ${f(hc[0] + side * R * 1.7)} ${f(hc[1] - R * 0.1)} L ${f(hc[0] + side * R * 0.9)} ${f(hc[1] - R * 0.32)} Z" fill="${cs2}"/>`; }
    return { svg: q, mouth: [mx, my] }; };
  // draw order: legs, back arm, torso, front arm, head
  const back = side > 0 ? [AL, -1] : [AR, 1], front = side > 0 ? [AR, 1] : [AL, -1];
  g += legSvg(side > 0 ? LL : LR) + legSvg(side > 0 ? LR : LL) + armSvg(back[0], back[1]) + torso() + armSvg(front[0], front[1]);
  const H = head(); g += H.svg;
  const fid = 'rim' + rim.replace(/[^0-9a-z]/gi, '');
  const rimSvg = `<defs><filter id="${fid}" x="-10%" y="-10%" width="120%" height="120%"><feFlood flood-color="${rim}"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs><g transform="translate(${f(ro[0])} ${f(ro[1])})" filter="url(#${fid})">${g}</g>`;
  return { svg: `<g>${rimSvg}${g}</g>`, head: hc, R, mouth: H.mouth, shL, shR, hands: [AL[2], AR[2]] };
}
