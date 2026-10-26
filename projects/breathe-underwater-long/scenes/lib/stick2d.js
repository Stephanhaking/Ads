// 2D stickman toolkit (SVG strings). Style: flat colour scenes, black round-headed stick figures, a thin warm rim light on one side,
// white dot eyes. All functions are pure and deterministic in t. Coordinates are the 1920x1080 stage; y grows downward.
const rad = (d) => (d * Math.PI) / 180;
// point at distance len from p, angle in degrees measured from straight DOWN (+ = toward +x)
const along = (p, a, len) => [p[0] + Math.sin(rad(a)) * len, p[1] + Math.cos(rad(a)) * len];
const f = (n) => n.toFixed(1);
const line = (a, b, w, c, extra = '') => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

// pose angles (deg from down): body lean; arms [shoulder, elbow] x2; legs [hip, knee] x2; head tilt
export const POSE_FLOAT = { lean: 6, aL: [-62, -40], aR: [58, 36], lL: [-8, -22], lR: [14, 36], head: -4 };
export const POSE_STAND = { lean: 0, aL: [-8, -4], aR: [8, 4], lL: [-5, -5], lR: [5, 5], head: 0 };

// one stick figure. (x, y) = top of the head centre; s = scale (1 => ~330 px tall). Returns SVG.
export function stick(x, y, s = 1, pose = POSE_STAND, o = {}) {
  const body = o.color || '#0b0b10', rim = o.rim === false ? null : (o.rim || '#ff9a3c'), w = (o.width || 15) * s;
  const R = 34 * s, neck = [x, y + R + 6 * s];
  const hipP = along(neck, pose.lean, 128 * s);
  const shoulder = along(neck, pose.lean, 10 * s);
  const eL = along(shoulder, pose.aL[0], 70 * s), wL = along(eL, pose.aL[1], 66 * s);
  const eR = along(shoulder, pose.aR[0], 70 * s), wR = along(eR, pose.aR[1], 66 * s);
  const kL = along(hipP, pose.lL[0], 96 * s), fL = along(kL, pose.lL[1], 92 * s);
  const kR = along(hipP, pose.lR[0], 96 * s), fR = along(kR, pose.lR[1], 92 * s);
  const segs = [[neck, hipP], [shoulder, eL], [eL, wL], [shoulder, eR], [eR, wR], [hipP, kL], [kL, fL], [hipP, kR], [kR, fR]];
  const hc = [x + Math.sin(rad(pose.head)) * 2, y + R];
  let out = '';
  if (rim) { // rim light: warm outline offset toward the light (upper right)
    out += segs.map(([a, b]) => line([a[0] + 3 * s, a[1] - 3 * s], [b[0] + 3 * s, b[1] - 3 * s], w + 5 * s, rim, 'opacity="0.9"')).join('');
    out += `<circle cx="${f(hc[0] + 3 * s)}" cy="${f(hc[1] - 3 * s)}" r="${f(R + 3 * s)}" fill="${rim}" opacity="0.9"/>`;
  }
  out += segs.map(([a, b]) => line(a, b, w, body)).join('');
  out += `<circle cx="${f(hc[0])}" cy="${f(hc[1])}" r="${f(R)}" fill="${body}"/>`;
  const ex = (o.look || 0) * 4 * s; // eyes shift a little toward the look direction
  out += `<circle cx="${f(hc[0] - 11 * s + ex)}" cy="${f(hc[1] - 4 * s)}" r="${f(6.5 * s)}" fill="#fff"/><circle cx="${f(hc[0] + 11 * s + ex)}" cy="${f(hc[1] - 4 * s)}" r="${f(6.5 * s)}" fill="#fff"/>`;
  if (o.mouthOpen) out += `<ellipse cx="${f(hc[0] + ex)}" cy="${f(hc[1] + 16 * s)}" rx="${f(8 * s)}" ry="${f(6 * s)}" fill="#fff"/>`;
  else out += `<path d="M ${f(hc[0] - 9 * s + ex)} ${f(hc[1] + 14 * s)} q ${f(9 * s)} ${f(7 * s)} ${f(18 * s)} 0" stroke="#fff" stroke-width="${f(3 * s)}" fill="none" stroke-linecap="round"/>`;
  return `<g>${out}</g>`;
}

// linear gradient helper
export const grad = (id, stops, vertical = true) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" ${a != null ? `stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
