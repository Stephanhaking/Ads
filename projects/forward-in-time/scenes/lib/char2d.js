// 2D "clothed stickman" character drawn in SVG, composited over the 3D set (characters always face the camera, like
// hand-animated stickman channels). Black round head with white oval eyes and a white mouth; thin black arms with round hands;
// clothes as flat two-tone shapes (top with sleeves, optional hood and drawstrings, trousers or shorts, shoes); optional
// ponytail and cap; a thin rim light on the light side. Pure functions of the pose; (x, y) = feet-centre on stage, h = height px.
const rad = (d) => (d * Math.PI) / 180;
const at = (p, a, l) => [p[0] + Math.sin(rad(a)) * l, p[1] + Math.cos(rad(a)) * l]; // a = degrees from straight down, + toward +x
const f = (n) => n.toFixed(1);
const L = (a, b, w, c, o = '') => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round" ${o}/>`;
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * k)))); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); };

export const P_STAND = { lean: 0, aL: [12, 8], aR: [12, 8], lL: [4, 0], lR: [4, 0], head: 0 };
export const P_FLOAT = { lean: 4, aL: [70, 48], aR: [64, 40], lL: [10, 24], lR: [16, 40], head: -4 };
export const P_POINT = { lean: 6, aL: [10, 6], aR: [80, 84], lL: [5, 0], lR: [6, 0], head: 10 };
export const P_HIPS = { lean: 0, aL: [40, 150], aR: [40, 150], lL: [6, 0], lR: [6, 0], head: 6 };

// o: {top, top2 (shadow), sleeves:'short'|'long', hood, bottom, shorts, shoes, hair:'ponytail', cap, face:'open'|'smile'|'worried'|'neutral', rim, look (-1..1), flip}
export function person(x, y, h, pose = P_STAND, o = {}) {
  const s = h / 340, w = 11 * s, side = o.flip ? -1 : 1;
  const top = o.top || '#e2553f', topS = o.top2 || shade(top, 0.72), bot = o.bottom || '#283552', botS = shade(bot, 0.75), shoe = o.shoes || '#15161b', rim = o.rim || '#ffd2a0';
  // skeleton (y up the screen = negative)
  const hip = [x, y - 158 * s];
  const neck = at(hip, 180 - pose.lean * side, 112 * s); // torso goes up
  const R = 46 * s, hc = at(neck, 180 - (pose.lean + pose.head) * side, R + 6 * s);
  const shL = [neck[0] - 26 * s, neck[1] + 12 * s], shR = [neck[0] + 26 * s, neck[1] + 12 * s];
  const arm = (sh, a, sgn) => { const e = at(sh, sgn * a[0] * side, 54 * s); const hnd = at(e, sgn * a[1] * side, 52 * s); return [sh, e, hnd]; };
  const AL = arm(shL, pose.aL, -1), AR = arm(shR, pose.aR, 1);
  const leg = (dx, a, sgn) => { const h0 = [hip[0] + dx, hip[1]]; const k = at(h0, sgn * a[0] * side, 78 * s); const ft = at(k, sgn * a[0] * side - sgn * a[1] * side * 0.3 + a[1] * 0.0, 76 * s); return [h0, k, ft]; };
  const LL = leg(-14 * s, pose.lL, -1), LR = leg(14 * s, pose.lR, 1);
  let g = '';
  // rim helper: draws the same stroke offset toward the light (upper right), under the shape
  const rimL = (a, b, ww) => L([a[0] + 2.5 * s, a[1] - 2.5 * s], [b[0] + 2.5 * s, b[1] - 2.5 * s], ww + 4 * s, rim, 'opacity="0.95"');
  // ponytail behind the head
  if (o.hair === 'ponytail') { const pt = [hc[0] - side * R * 0.8, hc[1] - R * 0.1]; g += `<path d="M ${f(pt[0])} ${f(pt[1])} q ${f(-side * 34 * s)} ${f(20 * s)} ${f(-side * 18 * s)} ${f(78 * s)} q ${f(side * 18 * s)} ${f(-30 * s)} ${f(side * 26 * s)} ${f(-74 * s)} z" fill="#0b0b10" stroke="${rim}" stroke-width="${f(2.5 * s)}"/>`; g += `<circle cx="${f(pt[0])}" cy="${f(pt[1])}" r="${f(8 * s)}" fill="${top}"/>`; }
  // back arm + back leg first (the side away from the light)
  const limb = (pts, ww) => rimL(pts[0], pts[1], ww) + rimL(pts[1], pts[2], ww) + L(pts[0], pts[1], ww, '#0b0b10') + L(pts[1], pts[2], ww, '#0b0b10');
  const legCloth = (pts, full) => { let q = L(pts[0], pts[1], 30 * s, bot) + L([pts[0][0] + 7 * s, pts[0][1]], [pts[1][0] + 7 * s, pts[1][1]], 9 * s, botS, 'opacity="0.55"'); if (full) q += L(pts[1], pts[2], 26 * s, bot) + L([pts[1][0] + 6 * s, pts[1][1]], [pts[2][0] + 6 * s, pts[2][1]], 8 * s, botS, 'opacity="0.55"'); return q; };
  const foot = (pts) => { const p = pts[2]; return `<ellipse cx="${f(p[0] + side * 9 * s)}" cy="${f(p[1] + 4 * s)}" rx="${f(20 * s)}" ry="${f(10 * s)}" fill="${shoe}" stroke="${rim}" stroke-width="${f(1.5 * s)}"/>`; };
  const hand = (pts) => `<circle cx="${f(pts[2][0])}" cy="${f(pts[2][1])}" r="${f(9 * s)}" fill="#0b0b10"/>`;
  const sleeve = (pts, long) => L(pts[0], long ? pts[1] : at(pts[0], Math.atan2(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]) * 180 / Math.PI, 34 * s), 24 * s, top) + (long ? L(pts[1], pts[2], 20 * s, top) + L(at(pts[1], Math.atan2(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]) * 180 / Math.PI, 40 * s), pts[2], 22 * s, topS) : '');
  g += limb(LL, w) + legCloth(LL, !o.shorts) + foot(LL);
  g += limb(LR, w) + legCloth(LR, !o.shorts) + foot(LR);
  g += limb(AL, w) + sleeve(AL, o.sleeves === 'long') + hand(AL);
  // torso cloth: shoulders to hips, slightly wider at the chest, a shadow strip on the far side
  const tp = [shL, shR, [hip[0] + 30 * s, hip[1] + 6 * s], [hip[0] - 30 * s, hip[1] + 6 * s]];
  const body = `M ${f(tp[0][0] - 6 * s)} ${f(tp[0][1])} Q ${f(neck[0])} ${f(neck[1] - 6 * s)} ${f(tp[1][0] + 6 * s)} ${f(tp[1][1])} L ${f(tp[2][0] + 4 * s)} ${f(tp[2][1])} Q ${f(hip[0])} ${f(hip[1] + 14 * s)} ${f(tp[3][0] - 4 * s)} ${f(tp[3][1])} Z`;
  g += `<path d="${body}" fill="${rim}" transform="translate(${f(2.5 * s)} ${f(-2.5 * s)})"/><path d="${body}" fill="${top}"/>`;
  g += `<path d="M ${f(tp[0][0] - 6 * s)} ${f(tp[0][1])} L ${f(tp[3][0] - 4 * s)} ${f(tp[3][1])} L ${f(tp[3][0] + 14 * s)} ${f(tp[3][1])} L ${f(tp[0][0] + 8 * s)} ${f(tp[0][1] + 10 * s)} Z" fill="${topS}" opacity="0.8"/>`;
  if (o.hood) g += `<path d="M ${f(neck[0] - 30 * s)} ${f(neck[1] + 8 * s)} Q ${f(neck[0])} ${f(neck[1] + 34 * s)} ${f(neck[0] + 30 * s)} ${f(neck[1] + 8 * s)}" stroke="${topS}" stroke-width="${f(10 * s)}" fill="none" stroke-linecap="round"/>` + L([neck[0] - 7 * s, neck[1] + 22 * s], [neck[0] - 7 * s, neck[1] + 54 * s], 3 * s, '#f4f4f4') + L([neck[0] + 7 * s, neck[1] + 22 * s], [neck[0] + 7 * s, neck[1] + 50 * s], 3 * s, '#f4f4f4');
  else g += `<path d="M ${f(neck[0] - 14 * s)} ${f(neck[1] + 2 * s)} Q ${f(neck[0])} ${f(neck[1] + 16 * s)} ${f(neck[0] + 14 * s)} ${f(neck[1] + 2 * s)}" fill="#0b0b10"/>`;
  g += limb(AR, w) + sleeve(AR, o.sleeves === 'long') + hand(AR);
  // head + face
  g += `<circle cx="${f(hc[0] + 3 * s)}" cy="${f(hc[1] - 3 * s)}" r="${f(R + 2 * s)}" fill="${rim}"/><circle cx="${f(hc[0])}" cy="${f(hc[1])}" r="${f(R)}" fill="#0b0b10"/>`;
  const lx = (o.look || 0) * 9 * s, ey = hc[1] - 6 * s, face = o.face || 'neutral';
  for (const dx of [-15, 15]) {
    const ex = hc[0] + dx * s + lx;
    if (face === 'smile') g += `<path d="M ${f(ex - 8 * s)} ${f(ey + 2 * s)} q ${f(8 * s)} ${f(-12 * s)} ${f(16 * s)} 0" stroke="#fff" stroke-width="${f(4.5 * s)}" fill="none" stroke-linecap="round"/>`;
    else g += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(8.5 * s)}" ry="${f((face === 'open' ? 12 : 10.5) * s)}" fill="#fff"/>`;
    if (face === 'worried' || face === 'angry') g += ''; if (face === 'worried') g += L([ex - 9 * s, ey - 17 * s + (dx < 0 ? 4 : -4) * s], [ex + 9 * s, ey - 17 * s + (dx < 0 ? -4 : 4) * s], 3.5 * s, '#fff'); // inner ends raised
  }
  const my = hc[1] + 22 * s, mx = hc[0] + lx;
  if (face === 'open') g += `<ellipse cx="${f(mx)}" cy="${f(my)}" rx="${f(9 * s)}" ry="${f(11 * s)}" fill="#fff"/>`;
  else if (face === 'smile') g += `<path d="M ${f(mx - 14 * s)} ${f(my - 4 * s)} q ${f(14 * s)} ${f(14 * s)} ${f(28 * s)} 0" stroke="#fff" stroke-width="${f(4.5 * s)}" fill="none" stroke-linecap="round"/>`;
  else g += L([mx - 10 * s, my], [mx + 10 * s, my], 4 * s, '#fff');
  if (o.cap) { const c = o.cap, cs = shade(c, 0.75); g += `<path d="M ${f(hc[0] - R * 1.02)} ${f(hc[1] - R * 0.18)} A ${f(R * 1.02)} ${f(R * 1.0)} 0 0 1 ${f(hc[0] + R * 1.02)} ${f(hc[1] - R * 0.18)} Z" fill="${c}"/><path d="M ${f(hc[0] + side * R * 0.2)} ${f(hc[1] - R * 0.2)} q ${f(side * R * 0.9)} ${f(-R * 0.05)} ${f(side * R * 1.25)} ${f(R * 0.18)} l ${f(-side * R * 0.2)} ${f(R * 0.12)} z" fill="${cs}"/><circle cx="${f(hc[0])}" cy="${f(hc[1] - R * 1.0)}" r="${f(4 * s)}" fill="${cs}"/>`; }
  return { svg: `<g>${g}</g>`, head: hc, R, mouth: [mx, my] };
}
