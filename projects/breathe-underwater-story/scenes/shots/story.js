// Story version: all 88 shots. 3D environments only; every character and prop is 2D (char2d / props2d) drawn at projected points.
// Hero: a girl in a red T-shirt (CAST.her). Friend: a boy with a blue cap (CAST.cap). Cousin: a small boy in a blue hoodie.
import { registerShot, THREE, ease, clamp, cam, toStage, E } from '/engine/api.js';
import { person } from '../lib/char2d.js';
import { CAST, breathe, P_STAND, P_FLOAT, P_POINT, P_HIPS, P_PRESENT, P_THINK, P_SHRUG, P_TIRED, P_PHONE, P_RUN, P_SWIM, P_SHIVER } from '../lib/people.js';
import { proj } from '../lib/stage.js';
import * as P2 from '../lib/props2d.js';
import { cards } from '../lib/cards.js';
import { roomShot, torsoShot, gillShot, labShot, wardShot, depthShot, plate, tag, dots } from '../lib/shotkit.js';

const f = (n) => n.toFixed(1);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let CID = 0;

// ---------------------------------------------------------------- drawing helpers
// a 2D character at a world feet point; returns the char2d result (svg, head, R, mouth) without drawing it
function fig(st, feet, h, pose, outfit, o = {}) {
  const v = new THREE.Vector3(...feet); const dz = -v.clone().applyMatrix4(st.camera.matrixWorldInverse).z; if (dz <= 0.05) return null;
  const p = toStage(st.camera, v); const ppm = (E.H / 2) / (Math.tan((st.camera.fov * Math.PI) / 360) * dz);
  const c = person(p.x, p.y, h * ppm, pose, { ...(typeof outfit === 'string' ? CAST[outfit] : outfit), ...o }); c.dz = dz; return c;
}
// draw a character; clipY hides everything below a stage line (water surface or ice edge); extra(c) adds svg
function draw(U, key, c, o = {}) {
  if (!c) return null;
  let g = c.svg + (o.extra ? o.extra(c) : '');
  if (o.clipY != null) { const id = 'cp' + ++CID; g = `<defs><clipPath id="${id}"><rect x="-600" y="-600" width="3120" height="${f(o.clipY + 600)}"/></clipPath></defs><g clip-path="url(#${id})">${g}</g>`; }
  U.svg(key, g, { z: o.z ?? 5 + Math.round(10 / c.dz) });
  return c;
}
const put = (U, st, key, feet, h, pose, outfit, o = {}, d = {}) => draw(U, key, fig(st, feet, h, pose, outfit, o), d);
const top = (c) => [c.head[0], c.head[1] - c.R * 1.3];
// speech bubble with its tail at tip (stage px), appearing at t0 (shot time) until `until`
function bubble(U, key, tip, text, t0, t, o = {}) {
  if (t < t0 || (o.until != null && t >= o.until)) { U.svg(key, '', { z: 40 }); return; }
  const a = clamp((t - t0) / 0.18), fs = o.fs || 46, w = Math.min(1500, text.length * fs * 0.56 + 90), h = fs + 58;
  const side = o.side ?? 1; let bx = side > 0 ? tip[0] - 70 : tip[0] - w + 70; bx = Math.max(30, Math.min(1890 - w, bx));
  const by = Math.max(24, tip[1] - h - 80), tx = Math.max(bx + h / 2 + 30, Math.min(bx + w - h / 2 - 30, tip[0] + (side > 0 ? 60 : -60)));
  const tri = (s) => `<path d="M ${f(tx - 28)} ${f(by + h - 6)} L ${f(tip[0])} ${f(tip[1])} L ${f(tx + 28)} ${f(by + h - 6)} Z" ${s}/>`;
  const sc = 0.6 + 0.4 * ease.out(a);
  U.svg(key, `<g opacity="${f(a)}" transform="translate(${f(tip[0])} ${f(tip[1])}) scale(${sc.toFixed(3)}) translate(${f(-tip[0])} ${f(-tip[1])})">` +
    tri('fill="#fff" stroke="#1b1410" stroke-width="6" stroke-linejoin="round"') +
    `<rect x="${f(bx)}" y="${f(by)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2)}" fill="#fff" stroke="#1b1410" stroke-width="6"/>` + tri('fill="#fff" transform="translate(0 -5)"') +
    `<text x="${f(bx + w / 2)}" y="${f(by + h / 2 + fs * 0.36)}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="${fs}" fill="#1b1410">${esc(text)}</text></g>`, { z: 40 });
}
// a sequence of lines from one speaker, each replacing the last: [[text, phrase, fallback], ...]
function says(U, key, tip, lines, t, info, o = {}) {
  let cur = null; for (const [text, ph, fb] of lines) { const a = info.w(ph, fb); if (t >= a) cur = [text, a]; }
  if (cur) bubble(U, key, tip, cur[0], cur[1], t, o); else U.svg(key, '', { z: 40 });
}
// ripples on a flat surface at world p (expanding rings from t0)
function ripple(st, p, t, t0, o = {}) {
  if (t < t0) return ''; let g = '';
  const q = proj(st, p); if (!q.ok) return '';
  for (let i = 0; i < 3; i++) {
    const k = (t - t0 - i * 0.35) / 2.2; if (k <= 0 || k > 1) continue; const r = (o.r || 0.4) + k * (o.grow || 2.2);
    const qx = proj(st, [p[0] + r, p[1], p[2]]), qz = proj(st, [p[0], p[1], p[2] + r]);
    g += `<ellipse cx="${f(q.x)}" cy="${f(q.y)}" rx="${f(Math.abs(qx.x - q.x))}" ry="${f(Math.max(3, Math.abs(qz.y - q.y)))}" fill="none" stroke="${o.col || '#e8f6ff'}" stroke-width="${f(5 * (1 - k) + 1)}" opacity="${f(0.9 * (1 - k))}"/>`;
  }
  return g;
}
// a burst of droplets thrown up from world p at t0
function splash(st, p, t, t0, scale = 1) {
  const k = (t - t0) / 0.9; if (k < 0 || k > 1) return ''; const q = proj(st, p); if (!q.ok) return ''; let g = '';
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI - Math.PI, sp = (0.6 + ((i * 37) % 10) / 12) * scale; const x = q.x + Math.cos(a) * sp * k * 1.4 * q.ppm * 0.5, y = q.y + (Math.sin(a) * sp * k * 1.8 - 2.6 * k * k * scale) * q.ppm * 0.5 * -1; g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f((0.035 + 0.02 * (i % 3)) * q.ppm)}" fill="#e8f6ff" stroke="#1b1410" stroke-width="2" opacity="${f(1 - k)}"/>`; }
  return g;
}
// water flowing into (or out of) the mouth
const stream = (outflow, t) => (c) => { let q = ''; const sc = c.R / 46; for (let i = 0; i < 18; i++) { const ph = (t * 0.5 + i / 18) % 1; const k = outflow ? ph : 1 - ph; const x = c.mouth[0] + 24 * sc + k * 300 * sc, y = c.mouth[1] + Math.sin(i * 1.7 + t) * 16 * sc * k + k * 30 * sc; q += `<circle cx="${f(x)}" cy="${f(y)}" r="${f((3 + 3 * (1 - k)) * sc)}" fill="#d6f2f6" opacity="${(0.8 * (1 - 0.6 * k)).toFixed(2)}"/>`; } return q; };
const bubbles = dots('bubbles'), heat = dots('heat');
// falling particles across the frame (snow or leaves), deterministic in absolute time
function fall(U, key, tt, kind) {
  let g = ''; const n = kind === 'snow' ? 90 : 26;
  for (let i = 0; i < n; i++) {
    const sp = 40 + (i % 5) * 18, x = ((i * 211.7) % 1980) - 30 + Math.sin(tt * 0.8 + i) * 30, y = ((i * 97.3 + tt * sp) % 1160) - 40;
    g += kind === 'snow' ? `<circle cx="${f(x)}" cy="${f(y)}" r="${2 + (i % 4)}" fill="#fff" opacity="0.85"/>` : `<ellipse cx="${f(x)}" cy="${f(y)}" rx="12" ry="6" transform="rotate(${f((tt * 90 + i * 40) % 360)} ${f(x)} ${f(y)})" fill="${['#d9762b', '#c9452f', '#e0b44a'][i % 3]}" stroke="#1b1410" stroke-width="2"/>`;
  }
  U.svg(key, g, { z: 30 });
}
const shade = (U, op, col = '#000', z = 25) => U.svg('shade', op > 0 ? `<rect width="1920" height="1080" fill="${col}" opacity="${op.toFixed(3)}"/>` : '', { z });
// poses
const walk = (tt, sp = 7) => { const s = Math.sin(tt * sp); return { ...P_STAND, lean: 3, aL: [12 - s * 24, 12], aR: [12 + s * 24, 12], lL: [4 + s * 24, 8], lR: [4 - s * 24, 8] }; };
const run = (tt) => { const s = Math.sin(tt * 11); return { ...P_RUN, aL: [40 + s * 45, 80], aR: [40 - s * 45, 80], lL: [10 + s * 34, 34], lR: [10 - s * 34, 34] }; };
const wave = (tt, base = P_FLOAT) => ({ ...base, aR: [160, 30 + 28 * Math.sin(tt * 9)] });
const UP = { lean: 0, aL: [165, 20], aR: [165, 20], lL: [8, 16], lR: [12, 24], head: -12 };
const swimP = (tt) => ({ ...P_SWIM, lL: [10 + 14 * Math.sin(tt * 4), 20], lR: [6 - 14 * Math.sin(tt * 4), 10] });

// a generic shot: o.cam = [from, to] camera keys, or fn(t, info) -> camera; o.ui(U, t, info, S, st)
function sh(id, set, look, o) {
  registerShot(id, {
    set, look, badge: o.badge ?? false,
    update(W, S, t, info) {
      if (S.sw) { S.sw.visible = false; S.pierFolk.forEach((m) => (m.visible = false)); S.ring.visible = false; }
      if (typeof o.cam === 'function') cam.dolly(W.camera, 0, [[0, o.cam(t, info)]]);
      else cam.dolly(W.camera, t, [[0, o.cam[0]], [info.dur, o.cam[1] || o.cam[0], ease.inOut]]);
      if (o.shake) cam.handheld(W.camera, t, typeof o.shake === 'function' ? o.shake(t, info) : o.shake, 3);
    },
    ui(U, t, info, S, st) { o.ui(U, t, info, S, st, info.start + t); },
  });
}
const mv = (c, d) => ({ ...c, pos: c.pos.map((v, i) => v + d[i]) });

// ---------------------------------------------------------------- lake
const LAKE = { base: 'dusk', fog: { color: '#2c5560', density: 0.012 } };
const AUT = { base: 'overcast', fog: { color: '#7d8a8f', density: 0.012 } };
const HB = [-4.6, -2.4, 1.6];                      // where the hero stands on the lake bed
const FR = [-6.6, 1.17, 0.3];                      // the friend at the end of the pier
const UW_WIDE = { pos: [0.4, -1.3, 7.4], look: [-4.6, -1.4, 1.6], fov: 42 };
const UW_MID = { pos: [-2.2, -1.2, 4.4], look: [-4.6, -1.3, 1.6], fov: 40 };
const UW_CLOSE = { pos: [-3.05, -0.85, 3.5], look: [-4.6, -1.05, 1.6], fov: 36 };
const PIER = { pos: [-3.4, 2.3, 4.2], look: [-6.6, 1.9, 0.3], fov: 38 };
const her = (U, st, tt, o = {}, d = {}) => put(U, st, 'her', o.at || HB, 1.7, o.pose || breathe(P_FLOAT, { ...P_FLOAT, aL: [P_FLOAT.aL[0] + 8, P_FLOAT.aL[1]] }, tt), o.outfit || 'her', { face: o.face || 'open', rim: '#a8e4ff', look: o.look ?? -0.3, flip: o.flip ?? true }, d);
const friend = (U, st, pose, face, o = {}) => put(U, st, 'friend', o.at || FR, 1.72, pose, 'cap', { face, rim: '#ffc890', look: o.look ?? 0.6, flip: o.flip ?? false });

// s001 — she walks to the end of the pier, trips, falls in
sh('s001', 'lake', LAKE, { cam: [{ pos: [-1.2, 2.3, 7.2], look: [-6.5, 1.2, 0.2], fov: 40 }, { pos: [-1.6, 2.0, 6.4], look: [-5.6, 0.8, 0.4], fov: 40 }], shake: 0.01,
  ui(U, t, info, S, st, tt) {
    const tf = info.w('straight', 2.4) - 0.6, k = clamp((t - tf) / 0.8);
    const x = t < tf ? -10 + (t / tf) * 4.2 : -5.8 + k * 0.9, y = 1.17 - (k * k) * 2.6;
    const pose = t < tf ? walk(tt) : { ...UP, lean: 60 * k, head: 10 };
    const water = proj(st, [x, 0, 0.5]).y;
    if (t < tf + 1.0) put(U, st, 'her', [x, y, 0.5], 1.7, pose, 'her', { face: t < tf - 0.3 ? 'smile' : 'open', rim: '#ffd29a' }, { clipY: y < 1.0 ? water : null });
    else U.svg('her', '', {});
    put(U, st, 'friend', [-8.6, 1.17, -0.5], 1.72, t < tf + 0.3 ? P_STAND : P_POINT, 'cap', { face: t < tf + 0.3 ? 'smile' : 'worried', rim: '#ffc890', look: 0.6 });
    U.svg('fx', ripple(st, [-5.0, 0, 0.5], t, tf + 0.6, { r: 0.3 }) + splash(st, [-5.0, 0, 0.5], t, tf + 0.6), { z: 30 });
  } });
// s002 — "Dark." sinking, looking up at the surface
sh('s002', 'lake', LAKE, { cam: [{ pos: [-3.6, -2.1, 3.6], look: [-4.8, -0.4, 1.2], fov: 50 }],
  ui(U, t, info, S, st, tt) { her(U, st, tt, { at: [-4.8, -1.3 - t * 0.4, 1.2], pose: UP, face: 'worried' }, { extra: (c) => bubbles(c, tt) }); shade(U, 0.45); } });
// s003 — mouth open to scream, water rushes in
sh('s003', 'lake', LAKE, { cam: [UW_CLOSE, mv(UW_CLOSE, [0.25, 0, -0.3])],
  ui(U, t, info, S, st, tt) { her(U, st, tt, { face: t < info.w('scream', 1.0) ? 'worried' : 'open' }, { extra: t > info.w('water', 1.6) - 0.1 ? stream(false, t) : null }); shade(U, 0.2); } });
// s004 — nothing happens
sh('s004', 'lake', LAKE, { cam: [mv(UW_CLOSE, [0.5, 0.05, 0.3]), mv(UW_CLOSE, [0.2, 0, 0])],
  ui(U, t, info, S, st, tt) { her(U, st, tt, { face: t < info.w('choke', 1.6) ? 'open' : 'worried' }, { extra: stream(false, t) }); } });
// s005 — you just breathe: in... out...
sh('s005', 'lake', LAKE, { cam: [UW_MID, mv(UW_MID, [0.5, 0, -0.6])],
  ui(U, t, info, S, st, tt) {
    const out = t > info.w('Out', 2.8) - 0.1;
    her(U, st, tt, { face: t > info.w('Like', 3.6) ? 'smile' : 'open' }, { extra: stream(out, t) });
    if (t > info.w('In', 1.6) - 0.1) U.timeChip({ time: out ? 'OUT' : 'IN', sub: 'BREATHING LAKE WATER' }, { at: info.w('In', 1.6) - 0.1, key: 'io' });
  } });
// s006 — two metres down, standing on the bottom
sh('s006', 'lake', LAKE, { cam: [UW_WIDE, mv(UW_WIDE, [-0.6, -0.1, -1.2])],
  ui(U, t, info, S, st, tt) { her(U, st, tt, { pose: breathe(P_STAND, { ...P_STAND, aL: [18, 10], aR: [18, 10] }, tt), face: 'smile' }, { extra: (c) => bubbles(c, tt) }); U.timeChip({ time: '2 m down', sub: 'STANDING ON THE BOTTOM' }, { at: 0.4, key: 'd' }); } });
// s007 — the friend is losing it
sh('s007', 'lake', LAKE, { cam: [PIER, mv(PIER, [-0.4, -0.1, -0.5])], shake: 0.012,
  ui(U, t, info, S, st, tt) {
    const c = friend(U, st, { ...P_POINT, aL: [40 + 20 * Math.sin(tt * 6), 120] }, 'worried', { look: 0.6 });
    if (c) says(U, 'b1', top(c), [["She's been under for a minute!", 'been', 1.4], ['Two minutes!', 'Two minutes', 2.8], ['THREE!', 'Three', 3.6]], t, info);
    U.svg('fx', ripple(st, [-4.6, 0, 1.6], t, 0, { r: 0.6, grow: 1.4 }), { z: 4 });
  } });
// s008 — you wave; he does not wave back
sh('s008', 'lake', LAKE, { cam: (t, info) => (t < info.w('He', 1.8) - 0.1 ? { pos: [-3.0, -1.6, 4.2], look: [-4.9, -0.6, 1.3], fov: 44 } : { ...PIER, pos: [-4.2, 2.1, 3.4], fov: 36 }),
  ui(U, t, info, S, st, tt) {
    if (t < info.w('He', 1.8) - 0.1) { her(U, st, tt, { pose: wave(tt, P_STAND), face: 'smile' }); U.svg('friend', '', {}); }
    else { U.svg('her', '', {}); friend(U, st, P_STAND, 'worried', { look: 0.7 }); }
  } });
// s009 — the title over the lake
sh('s009', 'lake', LAKE, { cam: [{ pos: [8, 3.0, 18], look: [-9, 0.6, 1], fov: 38 }, { pos: [6, 2.6, 15], look: [-9, 0.6, 1], fov: 38 }],
  ui(U, t, info) {
    const a = clamp((t - 0.2) / 0.6), b = clamp((t - info.w('Not', 2.4)) / 0.5);
    U.html('ttl', `<div style="width:1920px;text-align:center;opacity:${a}"><div style="font:900 112px Inter;color:#fff;letter-spacing:-.02em;text-shadow:0 8px 40px rgba(0,0,0,.6)">WHAT IF YOU COULD<br>BREATHE UNDERWATER?</div>
      <div style="font:700 44px Inter;color:#ffd29a;margin-top:26px;opacity:${b}">Not with gills. With your own lungs.</div></div>`, { left: '0px', top: '300px' });
  } });

// ---------------------------------------------------------------- bathroom
const BATH = { pos: [0.3, 1.6, 4.2], look: [0, 0.9, 0], fov: 46 };
const tub = (U, st, n, t, w = 2.2) => { const q = proj(st, [-0.6, 0, -1.2]); U.svg('tub', P2.bathtub(q.x, q.y, w * q.ppm, { bubbles: n, t }), { z: 3 }); return q; };
sh('s011', 'bathroom', 'golden', { cam: [BATH, mv(BATH, [0, -0.1, -0.5])],
  ui(U, t, info, S, st, tt) {
    const bub = t > info.w('Bubbles', 4.4) ? 16 : 3; tub(U, st, bub, tt);
    U.timeStack({ date: 'Night one', time: 'The bathtub test' }, { at: 0.2 });
    const knock = info.w('knocks', 1.9);
    const c = put(U, st, 'mum', [1.5, 0, 0.4], 1.68, t > knock && t < knock + 0.8 ? { ...P_STAND, aR: [100, 60 + 30 * Math.sin(tt * 18)] } : P_THINK, 'mum', { face: 'worried', flip: true, look: -0.7, rim: '#ffd29a' });
    if (t > knock && t < knock + 1.2) U.svg('knock', `<text x="1500" y="300" font-family="Inter" font-weight="900" font-size="60" fill="#fff" stroke="#1b1410" stroke-width="3" opacity="${f(1 - (t - knock) / 1.2)}">KNOCK KNOCK</text>`, { z: 30 }); else U.svg('knock', '', {});
    if (c) says(U, 'b1', top(c), [['Why is it so quiet in there?', 'Why', 2.6]], t, info, { side: -1 });
  } });
sh('s012', 'bathroom', 'golden', { cam: [{ pos: [-0.3, 1.5, 2.4], look: [-0.6, 0.55, -1.2], fov: 44 }],
  ui(U, t, info, S, st, tt) { const q = tub(U, st, 22, tt); bubble(U, 'b1', [q.x, q.y - 2.2 * q.ppm * 0.42], 'Fine!', 0.05, t, { fs: 64 }); } });

// ---------------------------------------------------------------- the arithmetic (room, lungs, cards)
roomShot('s013', { cam: 'wide', pose: P_PRESENT, face: 'smile' });
roomShot('s014', { cam: 'airjar', show: ['air'], dots: 'two hundred', ui: (U, t, info) => plate(U, '209 mL', 'oxygen in 1 litre of air', info.w('two hundred', 1.0)) });
roomShot('s015', { cam: 'waterjar', show: ['water'], ui: (U, t, info) => plate(U, '≈ 6 mL', 'oxygen in 1 litre of water', info.w('six', 1.2)) });
roomShot('s016', { cam: 'jars', show: ['jars'], ui: (U, t, info) => plate(U, '36×', 'less oxygen per litre in water', info.w('thirty-six', 0.8)) });
cards({
  s010: { kind: 'statement', text: 'How would it actually work?', who: 'her', pose: 'present', face: 'smile' },
  s017: { kind: 'hero', kicker: 'SITTING STILL', value: '250 mL', label: 'of oxygen burned every minute', at: 'two hundred', who: 'her', pose: 'present', face: 'neutral' },
  s021: { kind: 'calc', kicker: 'WATER NEEDED PER MINUTE', lines: [['250 mL of oxygen', null], ['÷ 5.8 mL per L of water', 'hundred'], ['÷ ¼ grabbed by lungs', 'seventy'], ['= 172 L / min', 'litres']], result: true },
  s024: { kind: 'hero', kicker: 'WATER VS AIR', value: '≈ 800×', label: 'denser', at: 'eight hundred', who: 'her', pose: 'think', face: 'worried' },
  s028: { kind: 'hero', kicker: 'BREATHING TEST · ALL-OUT', value: '140 L/min', label: 'healthy young men, short test only', at: 'Healthy', who: 'cap', pose: 'present', face: 'smile' },
  s040: { kind: 'bars', title: 'HOW MUCH OXYGEN IS PULLED OUT', bars: [['FISH GILLS · UP TO', 85, '%', 'eighty-five'], ['YOUR LUNGS · AT BEST', 25, '%', 'lungs']], max: 100, highlight: 0 },
  s043: { kind: 'statement', text: 'No more big gulps.', who: 'her', pose: 'shrug', face: 'smile' },
  s049: { kind: 'hero', kicker: 'ONE SAFETY GUIDE', value: '≈ 25×', label: 'faster heat loss than in air', at: 'twenty-five', who: 'herSuit', pose: 'think', face: 'worried' },
  s050: { kind: 'bars', title: 'HOW MUCH FASTER? SOURCES DISAGREE', bars: [['LOW ESTIMATE', 4, '×', 'four'], ['SAFETY GUIDE', 25, '×', 'Other'], ['HIGH ESTIMATE', 32, '×', 'thirty-two']], highlight: 1 },
  s062: { kind: 'statement', text: 'Nobody knows.', sub: 'Nobody has ever tested it.', who: 'herSuit', pose: 'shrug', face: 'neutral' },
  s082: { kind: 'hero', kicker: '1989 · PHILADELPHIA', value: '3', label: 'premature babies · ventilator still helping', at: 'three', who: 'doctor', pose: 'present', face: 'neutral' },
  s084: { kind: 'hero', kicker: '1996 STUDY', value: '13', label: 'babies in the study', at: 'thirteen', who: 'doctor', pose: 'present', face: 'neutral' },
  s085: { kind: 'hero', kicker: 'BLOOD OXYGEN, WITHIN AN HOUR', value: '+138%', label: 'blood oxygen · not breathing underwater', at: 'thirty-eight', who: 'doctor', pose: 'think', face: 'smile' },
  s086: { kind: 'statement', text: 'The first time a liquid helped humans breathe.', who: 'her', pose: 'present', face: 'smile' },
});
torsoShot('s018', { bigBreath: true, ui: (U, t, info) => plate(U, '≈ 6 L', 'of air a minute, on land', info.w('six', 0.6)) });
torsoShot('s019', { saline: true, face: 'worried' });
torsoShot('s020', { saline: true, glow: 'quarter', ui: (U, t, info) => plate(U, '¼', 'of the oxygen grabbed, at best', info.w('quarter', 2.0)) });
roomShot('s022', { cam: 'wide', pose: P_SHRUG, face: 'worried', push: 0.18 });
roomShot('s023', { cam: 'buckets', buckets: [0, 17, 'seventeen'], ui: (U, t, info) => plate(U, '17', 'big 10-litre buckets, every minute', info.w('seventeen', 0.6)) });
roomShot('s025', { cam: 'wide', pose: P_TIRED, face: 'worried', push: 0.25, ui: (U, t, info) => U.statement("It's a workout.", { at: info.w('workout', 2.6), pos: 'tl', key: 'wk' }) });
roomShot('s026', { cam: 'scale', show: ['scale'], crates: [0, 6, 'hundred'], ui: (U, t, info) => plate(U, '172 kg', 'of water through your throat', info.w('kilos', 1.6)) });
roomShot('s027', { cam: 'scale', show: ['scale'], crates: 6, push: 0.2, ui: (U) => U.timeChip({ time: 'every minute', sub: '172 KG OF WATER' }, { at: 0.1, key: 'em' }) });
roomShot('s029', { cam: 'bars', who: false, bars: [140], barAt: ['forty'], ui: (U, t, info) => plate(U, '140 L/min', 'all-out, short test', info.w('forty', 0.4)) });
roomShot('s030', { cam: 'bars', who: false, bars: [140, 172], barAt: ['You', 'more'], ui: (U, t, info) => { plate(U, '140 L/min', 'all-out, short test', 0.1); plate(U, '172 L/min', 'you, sitting still', info.w('more', 0.8), { key: 'p2', pos: 'tr' }); } });

// ---------------------------------------------------------------- back in the lake
sh('s031', 'lake', LAKE, { cam: [UW_WIDE, mv(UW_WIDE, [-0.8, 0, -1.4])],
  ui(U, t, info, S, st, tt) { her(U, st, tt, { pose: breathe(P_TIRED, { ...P_TIRED, lean: 26 }, tt, 3), face: 'worried' }); U.timeChip({ time: '10:00', sub: 'ON THE BOTTOM' }, { at: 0.3, key: 'tc' }); } });
sh('s032', 'lake', LAKE, { cam: [mv(UW_CLOSE, [0.3, 0, 0.4]), UW_CLOSE], shake: 0.02,
  ui(U, t, info, S, st, tt) { her(U, st, tt, { pose: breathe(P_TIRED, { ...P_TIRED, lean: 26 }, tt, 2.5), face: 'worried' }, { extra: (c) => heat(c, tt) }); } });
sh('s033', 'lake', LAKE, { cam: [{ pos: [-1.6, -2.0, 5.6], look: [-4.6, -1.0, 1.6], fov: 46 }],
  ui(U, t, info, S, st, tt) { const k = ease.inOut(clamp(t / info.dur)); her(U, st, tt, { at: [-4.6, -2.4 + k * 1.6, 1.6], pose: { ...UP, lL: [8 + 16 * Math.sin(tt * 8), 20], lR: [8 - 16 * Math.sin(tt * 8), 20] }, face: 'worried' }, { extra: (c) => bubbles(c, tt) }); } });
sh('s034', 'lake', LAKE, { cam: [{ pos: [-2.0, 0.55, 4.6], look: [-4.6, 0.35, 1.6], fov: 36 }, { pos: [-2.4, 0.5, 4.0], look: [-4.6, 0.35, 1.6], fov: 36 }],
  ui(U, t, info, S, st, tt) {
    const y = -1.25 + 0.05 * Math.sin(tt * 2); const water = proj(st, [-4.6, 0, 1.6]).y;
    her(U, st, tt, { at: [-4.6, y, 1.6], pose: { ...P_FLOAT, aL: [70, 40], aR: [70, 40] }, face: t < info.w('amazing', 1.6) ? 'open' : 'smile', look: -0.4 }, { clipY: water });
    U.svg('fx', ripple(st, [-4.6, 0, 1.6], (t % 2.4), 0, { r: 0.35, grow: 1.2 }), { z: 30 });
  } });

// ---------------------------------------------------------------- the fish trick
const watcher = (U, st, tt, face = 'open') => put(U, st, 'her', [2.3, 0.1, -3.4], 1.7, breathe(P_FLOAT, { ...P_FLOAT, aL: [78, 48] }, tt), 'her', { face, flip: true, look: -0.6, rim: '#bfe8ff' });
gillShot('s035', { ui: (U, t, info, S, st) => watcher(U, st, info.start + t, 'smile') });
gillShot('s036', { cam: { pos: [0.9, 1.0, 2.5], look: [0.1, 0.75, 0], fov: 34 }, ui: (U, t, info, S, st) => { tag(U, S, 'nb', [0.9, 0.8, 0.1], 'NO "IN AND OUT"', info.w('breathe', 1.2)); } });
gillShot('s037', { path: true, ui: (U, t, info, S) => { tag(U, S, 'ow', [1.0, 0.8, 0.1], 'IN AT THE MOUTH', info.w('mouth', 0.8)); tag(U, S, 'ow2', [0.3, 0.55, 0.2], 'OUT THE SIDES · ONE WAY', info.w('One way', 3.0)); } });
gillShot('s038', { fish: false, arch: true, ui: (U, t, info) => plate(U, '⇄', 'blood flows against the water', info.w('opposite', 1.2)) });
gillShot('s039', { fish: false, arch: true, ui: (U, t, info) => plate(U, 'O₂', 'grabbed the whole way along', info.w('grabbing', 0.6)) });
torsoShot('s041', { face: 'worried', ui: (U, t, info, S) => tag(U, S, 'pipe', [0, 2.75, 0.2], 'SAME PIPE IN AND OUT', 0.3) });
torsoShot('s042', { saline: true, stale: 'old', ui: (U, t, info) => plate(U, 'OLD + NEW', 'stale water mixes back in', info.w('mixes', 2.0)) });
// s044 — swimming slowly, mouth open, beside a trout
sh('s044', 'lake', LAKE, { cam: [{ pos: [-2.5, -1.3, 5.2], look: [-5.2, -1.5, 1.6], fov: 40 }, { pos: [-1.6, -1.3, 5.0], look: [-4.2, -1.5, 1.6], fov: 40 }],
  ui(U, t, info, S, st, tt) {
    const x = -6.4 + t * 0.5; const fq = proj(st, [x + 1.4, -1.5, 2.3]);
    U.svg('trout', P2.fish(fq.x, fq.y, 0.6 * fq.ppm, { t: tt }), { z: 12 });
    put(U, st, 'her', [x, -2.35, 1.6], 1.7, swimP(tt), 'her', { face: 'open', rim: '#a8e4ff' });
  } });
// s045 — an hour down; the friend calls it your fish face
sh('s045', 'lake', LAKE, { cam: (t, info) => (t < info.w('friend', 1.9) - 0.1 ? UW_MID : { pos: [-2.2, 1.4, 6.6], look: [-5.4, 1.1, 0.8], fov: 42 }),
  ui(U, t, info, S, st, tt) {
    const cut = info.w('friend', 1.9) - 0.1;
    if (t < cut) { her(U, st, tt, { face: 'open', pose: swimP(tt), at: [-4.6, -1.7, 1.6] }); U.timeChip({ time: '1 hour', sub: 'DOWN AT A TIME' }, { at: 0.2, key: 'tc' }); U.svg('friend', '', {}); U.svg('b1', '', {}); return; }
    U.html('tc', '', {});
    const water = proj(st, [-4.4, 0, 1.6]).y;
    her(U, st, tt, { at: [-4.4, -1.25, 1.6], pose: { ...P_FLOAT, aL: [70, 40], aR: [70, 40] }, face: 'open', look: -0.5 }, { clipY: water });
    const c = friend(U, st, P_HIPS, 'smile', { at: [-6.3, 1.17, 0.2], look: 0.6 });
    if (c) bubble(U, 'b1', top(c), 'Fish face!', info.w('fish face', cut + 1.2), t, { side: -1 });
  } });

// ---------------------------------------------------------------- the cold
sh('s046', 'lake', AUT, { cam: [{ pos: [8, 3.0, 18], look: [-9, 0.6, 1], fov: 38 }, { pos: [6.5, 2.7, 15.5], look: [-9, 0.6, 1], fov: 38 }],
  ui(U, t, info, S, st, tt) { fall(U, 'leaves', tt, 'leaves'); U.timeStack({ date: 'Autumn', time: 'First swim since summer' }, { at: 0.3 }); } });
sh('s047', 'lake', AUT, { cam: [UW_CLOSE, mv(UW_CLOSE, [0.3, 0, -0.2])], shake: 0.03,
  ui(U, t, info, S, st, tt) {
    const g = info.w('gasps', 2.6);
    her(U, st, tt, { pose: UP, at: [-4.6, -2.2 + 0.4 * clamp(1 - t), 1.6], face: t > g - 0.1 ? 'open' : 'worried' }, { extra: t > g - 0.1 ? (c) => bubbles(c, tt * 2) : null });
    shade(U, clamp(1 - t / 0.5) * 0.9, '#e8f6ff');
    plate(U, 'COLD SHOCK', 'a gasp you cannot stop', info.w('cold shock', 4.0));
  } });
sh('s048', 'lake', AUT, { cam: [UW_MID, mv(UW_MID, [0.4, 0, -0.4])],
  ui(U, t, info, S, st, tt) { her(U, st, tt, { face: 'worried', pose: breathe(P_SHIVER, { ...P_SHIVER, lean: 9 }, tt, 0.4) }, { extra: (c) => heat(c, tt) }); plate(U, 'HEAT', 'pours out into the water', info.w('heat', 0.6)); } });
sh('s051', 'lake', AUT, { cam: [UW_CLOSE], shake: 0.02,
  ui(U, t, info, S, st, tt) { her(U, st, tt, { face: 'worried', pose: breathe(P_SHIVER, { ...P_SHIVER, lean: 9 }, tt, 0.3) }); U.timeChip({ time: 'minutes', sub: 'UNTIL YOUR HANDS GO NUMB' }, { at: 0.3, key: 'tc' }); } });
torsoShot('s052', { saline: true, face: 'worried', ui: (U, t, info, S) => tag(U, S, 'cw', [0.5, 2.0, 0.3], 'COLD LAKE WATER', info.w('cold', 1.0)) });
sh('s053', 'lake', AUT, { cam: [{ pos: [-3.4, 2.1, 5.0], look: [-7.0, 1.8, 0.3], fov: 38 }, { pos: [-3.9, 2.0, 4.4], look: [-7.0, 1.8, 0.3], fov: 38 }],
  ui(U, t, info, S, st, tt) {
    put(U, st, 'her', [-7.6, 1.17, 0.6], 1.7, t < info.w('not wrong', 3.8) ? P_HIPS : P_SHRUG, 'herSuit', { face: t < info.w('not wrong', 3.8) ? 'smile' : 'neutral', rim: '#ffc890', look: 0.6 });
    const c = friend(U, st, P_POINT, 'smile', { at: [-6.0, 1.17, 0.2], flip: true, look: -0.6 });
    if (c) bubble(U, 'b1', top(c), 'You look like a seal.', info.w('seal', 2.6), t, { side: 1, until: info.w('not wrong', 4.2) });
  } });

// ---------------------------------------------------------------- how deep?
depthShot('s054', { d: 3, who: 'herSuit', face: 'open' });
depthShot('s055', { d: [3, 12], who: 'herSuit', face: 'open', pose: UP });
depthShot('s056', { d: [10, 20], who: 'herSuit', face: 'neutral', ui: (U, t, info) => plate(U, '+1 atm', 'every 10 m of water', info.w('atmosphere', 2.0)) });
depthShot('s057', { d: 30, who: 'herSuit', face: 'worried', ui: (U, t, info) => plate(U, '4×', 'the pressure at the surface', info.w('four', 1.8)) });
depthShot('s058', { d: 30, who: 'diver', face: 'neutral', ui: (U, t, info) => plate(U, 'NARCOSIS', 'a danger for divers breathing air', info.w('narcosis', 2.4)) });
depthShot('s059', { d: 30, who: 'diver', face: 'worried', extra: (c, t, info) => heat(c, info.start + t) });
depthShot('s060', { d: [30, 14], who: 'diver', face: 'worried', pose: UP, extra: (c, t, info) => bubbles(c, info.start + t), ui: (U, t, info) => plate(U, 'THE BENDS', 'bubbles in the blood after rising too fast', info.w('bends', 3.8)) });
depthShot('s061', { d: 30, who: 'herSuit', face: 'neutral', pose: P_THINK, ui: (U, t, info) => plate(U, '?', 'breathing water at 30 m', info.w('Would', 3.6)) });
depthShot('s063', { d: [30, 6], who: 'herSuit', face: 'smile', pose: UP });

// ---------------------------------------------------------------- the ice
const WIN = { base: 'overcast', fog: { color: '#c9d3da', density: 0.012 } };
const UNDER_ICE = { base: 'overcast', sky: { type: 'flat', color: '#0b1a22' }, bg: '#0b1a22', fog: { color: '#0e2430', density: 0.16 } };
const HOLE = [-4, 0, -3];
const HERO_W = [2.5, 0, 3];
// the hole in the ice is covered by a 2D ice patch until the cousin falls through
const cover = (st) => { const q = proj(st, [HOLE[0], 0.03, HOLE[2]]), qx = proj(st, [HOLE[0] + 1.0, 0.03, HOLE[2]]), qz = proj(st, [HOLE[0], 0.03, HOLE[2] + 1.0]); return `<ellipse cx="${f(q.x)}" cy="${f(q.y)}" rx="${f(Math.abs(qx.x - q.x) + 4)}" ry="${f(Math.abs(qz.y - q.y) + 4)}" fill="#d9e8ef"/>`; };
const crack = (st, k) => { let g = ''; for (let i = 0; i < 7; i++) { let p = [HOLE[0], 0.03, HOLE[2]], d = ''; const a = i * 0.9 + 0.3; for (let j = 0; j <= 5; j++) { const r = j * 0.45 * k; const q = proj(st, [HOLE[0] + Math.cos(a + (j % 2 ? 0.3 : -0.3)) * r, 0.03, HOLE[2] + Math.sin(a) * r]); d += (j ? ' L ' : 'M ') + f(q.x) + ' ' + f(q.y); } g += `<path d="${d}" fill="none" stroke="#1b1410" stroke-width="3" opacity="0.8"/>`; } return g; };
const kids = (U, st, tt, o = {}) => {
  if (!o.gone) put(U, st, 'cousin', [HOLE[0] - 0.2, 0.02, HOLE[2] - 0.2], 1.2, o.pose || walk(tt, 5), 'cousin', { face: o.face || 'smile', rim: '#ffffff' });
  else U.svg('cousin', '', {});
  put(U, st, 'kid2', [-1.6, 0.02, -6.0], 1.3, o.kidPose || P_POINT, 'hood', { face: o.kidFace || 'smile', flip: true, look: -0.6 });
};
const sign = (U, st, p = [-1.0, 0, -0.6], h = 0.9) => { const q = proj(st, p); if (q.ok) U.svg('sign', P2.sign(q.x, q.y, h * q.ppm, 'THIN ICE'), { z: 4 }); };
sh('s064', 'winter', WIN, { cam: [{ pos: [5, 3.0, 11], look: [-3.5, 0.6, -2.5], fov: 42 }, { pos: [4.2, 2.6, 9.6], look: [-3.5, 0.6, -2.5], fov: 42 }],
  ui(U, t, info, S, st, tt) { U.svg('cov', cover(st), { z: 2 }); kids(U, st, tt); sign(U, st); put(U, st, 'her', HERO_W, 1.7, P_STAND, 'heroWinter', { face: 'smile', flip: true, look: -0.6 }); fall(U, 'snow', tt, 'snow'); U.timeStack({ date: 'January', time: 'Morning' }, { at: 0.3 }); } });
sh('s065', 'winter', WIN, { cam: [{ pos: [-1.2, 1.7, 1.8], look: [-4.1, 0.6, -3.1], fov: 40 }], shake: (t, info) => (t > info.w('crack', 0.2) ? 0.05 : 0.005),
  ui(U, t, info, S, st, tt) {
    const c0 = info.w('crack', 0.2); U.svg('cov', cover(st) + (t > c0 ? crack(st, clamp((t - c0) / 0.4)) : ''), { z: 2 });
    kids(U, st, tt, { pose: t > c0 ? P_SHIVER : walk(tt, 5), face: t > c0 ? 'worried' : 'smile' }); fall(U, 'snow', tt, 'snow');
    shade(U, t > c0 ? clamp(1 - (t - c0) / 0.4) * 0.8 : 0, '#ffffff');
  } });
sh('s066', 'winter', WIN, { cam: [{ pos: [0.6, 2.0, 4.6], look: [-4, 0.5, -3], fov: 40 }, { pos: [0.2, 1.9, 4.0], look: [-4, 0.4, -3], fov: 40 }],
  ui(U, t, info, S, st, tt) {
    const g = info.w('gone', 4.4);
    U.svg('cov', t < g ? cover(st) + crack(st, 1) : ripple(st, HOLE, t, g, { r: 0.4, grow: 0.5, col: '#d9f2ff' }) + splash(st, HOLE, t, g, 0.7), { z: 2 });
    sign(U, st, [-1.4, 0, -0.4], 0.9);
    if (t < g) put(U, st, 'cousin', [HOLE[0] - 0.2, 0.02, HOLE[2] - 0.2], 1.2, P_SHIVER, 'cousin', { face: 'worried', rim: '#ffffff' }); else U.svg('cousin', '', {});
    if (t > info.w('signs', 2.4)) U.svg('ring', (() => { const q = proj(st, [-1.4, 0, -0.4]); return `<circle cx="${f(q.x)}" cy="${f(q.y - 1.25 * q.ppm)}" r="${f(0.65 * q.ppm)}" fill="none" stroke="#e2553f" stroke-width="8"/>`; })(), { z: 6 });
    fall(U, 'snow', tt, 'snow');
  } });
sh('s067', 'winter', WIN, { cam: [{ pos: [3.5, 1.55, 4.7], look: [2.5, 1.45, 3], fov: 30 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', HERO_W, 1.7, P_STAND, 'heroWinter', { face: 'worried', flip: true, look: -0.8 }); fall(U, 'snow', tt, 'snow'); } });
sh('s068', 'winter', WIN, { cam: [{ pos: [4.0, 2.4, 6.5], look: [-1.0, 0.6, -0.5], fov: 44 }, { pos: [0.5, 2.2, 3.5], look: [-4, 0.3, -3], fov: 44 }],
  ui(U, t, info, S, st, tt) {
    const j = info.w('jump', 1.4), u = info.w('under', 2.0), k = clamp(t / j);
    const p = t < j ? [HERO_W[0] + (HOLE[0] - HERO_W[0]) * k, 0.02, HERO_W[2] + (HOLE[2] - HERO_W[2]) * k] : [HOLE[0], 0.02 - 2.2 * clamp((t - j) / (u - j + 0.2)) ** 2, HOLE[2]];
    const edge = proj(st, [HOLE[0], 0, HOLE[2] + 0.9]).y;
    put(U, st, 'her', p, 1.7, t < j ? run(tt) : UP, 'heroWinter', { face: 'worried', flip: true, look: -0.6 }, { clipY: t < j ? null : edge });
    U.svg('cov', ripple(st, HOLE, t, j + 0.1, { r: 0.3, grow: 0.5, col: '#d9f2ff' }) + splash(st, HOLE, t, j + 0.1, 0.8), { z: 30 });
    fall(U, 'snow', tt, 'snow');
    const b = info.w('black', 3.0);
    shade(U, clamp((t - b + 0.3) / 0.5) * 0.93, '#04090c', 35);
    if (t > b) U.html('frz', `<div style="width:1920px;text-align:center;font:900 90px Inter;color:#cfe7f2;opacity:${clamp((t - info.w('Freezing', b + 1)) / 0.4)}">Freezing.</div>`, { left: '0px', top: '470px' }, { z: 40 });
  } });
const UI_CAM = { pos: [-1.8, -2.3, 0.2], look: [-4.4, -1.6, -3.4], fov: 46 };
sh('s069', 'winter', UNDER_ICE, { cam: [UI_CAM, mv(UI_CAM, [-0.6, 0, -0.6])],
  ui(U, t, info, S, st, tt) {
    const gr = info.w('grab', 3.4), k = ease.inOut(clamp(t / gr));
    put(U, st, 'cousin', [-5.2, -2.0 + 0.1 * Math.sin(tt * 7), -4.2], 1.2, { ...UP, lL: [10 + 30 * Math.sin(tt * 10), 30], lR: [10 - 30 * Math.sin(tt * 10), 30] }, 'cousin', { face: 'open', rim: '#9fd3ea', flip: true }, { extra: (c) => bubbles(c, tt * 1.6) });
    put(U, st, 'her', [-3.0 - 1.4 * k, -2.4, -2.0 - 1.6 * k], 1.7, t < gr ? swimP(tt) : { ...P_SWIM, aR: [120, 20] }, 'heroWinter', { face: 'worried', rim: '#9fd3ea', flip: true, look: -0.6 });
    plate(U, 'COLD SHOCK', 'the gasp reflex', info.w('cold shock', 2.2));
  } });
sh('s070', 'winter', UNDER_ICE, { cam: [{ pos: [-7.5, -2.6, -6.5], look: [-10.5, 0, -9.5], fov: 52 }],
  ui(U, t, info, S, st, tt) { put(U, st, 'her', [-9.8, -2.1, -9.2], 1.7, UP, 'heroWinter', { face: 'worried', rim: '#9fd3ea', look: 0.2 }); shade(U, 0.25); } });
sh('s071', 'winter', UNDER_ICE, { cam: (t, info) => { const s = info.w('see it', 2.8), k = ease.inOut(clamp((t - s + 0.6) / 1.4)); const a = [-10.5, 0, -9.5], b = HOLE; return { pos: [-6.2, -2.7, -5.0], look: a.map((v, i) => v + (b[i] - v) * k + (i === 0 ? Math.sin(t * 1.1) * 0.6 * (1 - k) : 0)), fov: 52 }; },
  ui(U, t, info, S, st, tt) {
    const s = info.w('see it', 2.8), q = proj(st, [HOLE[0], 0.02, HOLE[2]]), qx = proj(st, [HOLE[0] + 0.9, 0.02, HOLE[2]]), qz = proj(st, [HOLE[0], 0.02, HOLE[2] + 0.9]);
    const a = clamp((t - s) / 0.8);
    U.svg('light', q.ok && a > 0 ? `<defs><radialGradient id="lg71"><stop offset="0" stop-color="#e9f3f6"/><stop offset="0.6" stop-color="#9fb6bf"/><stop offset="1" stop-color="#9fb6bf" stop-opacity="0"/></radialGradient></defs><ellipse cx="${f(q.x)}" cy="${f(q.y)}" rx="${f(Math.abs(qx.x - q.x) * 1.4)}" ry="${f(Math.max(10, Math.abs(qz.y - q.y)) * 1.4)}" fill="url(#lg71)" opacity="${f(a)}"/>` : '', { z: 3 });
  } });
sh('s072', 'winter', WIN, { cam: [{ pos: [-1.0, 1.6, 1.4], look: [-4, 0.4, -3], fov: 40 }, { pos: [-0.6, 1.8, 2.0], look: [-3.6, 0.5, -2.6], fov: 40 }],
  ui(U, t, info, S, st, tt) {
    const o = info.w('out', 1.6), k = ease.out(clamp(t / o)); const edge = proj(st, [HOLE[0], 0, HOLE[2] + 0.9]).y;
    if (t < o) put(U, st, 'cousin', [HOLE[0], -1.2 + 1.2 * k, HOLE[2]], 1.2, UP, 'cousin', { face: 'open' }, { clipY: edge });
    else put(U, st, 'cousin', [HOLE[0] + 1.3, 0.02, HOLE[2] + 0.6], 1.2, P_SHIVER, 'cousin', { face: 'worried', rim: '#ffffff' });
    put(U, st, 'her', [HOLE[0] - 0.2, -1.1, HOLE[2] + 0.1], 1.7, { ...UP, aL: [120, 20], aR: [120, 20] }, 'heroWinter', { face: 'open', look: 0.4 }, { clipY: edge });
    U.svg('cov', ripple(st, HOLE, t % 2.2, 0, { r: 0.3, grow: 0.5, col: '#d9f2ff' }), { z: 30 });
    fall(U, 'snow', tt, 'snow');
    U.timeChip({ time: '6 minutes', sub: 'UNDER THE ICE, THEY SAY' }, { at: info.w('Six', 2.6), key: 'tc' });
  } });
const BLANKET = { ...CAST.cousin, top: '#c9ced6', top2: '#eef1f4', hood: true, sleeves: 'long' };
sh('s073', 'winter', WIN, { cam: [{ pos: [1.6, 1.6, 4.8], look: [-1.3, 0.9, -0.5], fov: 40 }, { pos: [1.0, 1.5, 3.9], look: [-1.3, 0.8, -0.5], fov: 40 }],
  ui(U, t, info, S, st, tt) {
    const tk = info.w('talking', 3.2);
    put(U, st, 'para2', [-2.6, 0.02, -1.2], 1.78, P_THINK, 'paramedic', { face: 'neutral', look: 0.6 });
    put(U, st, 'cousin', [-1.5, 0.02, -0.5], 1.2, breathe(P_SHIVER, { ...P_SHIVER, lean: 9 }, tt, 0.25), BLANKET, { face: t < tk ? 'worried' : 'smile', rim: '#ffffff', look: 0.5 });
    put(U, st, 'para', [-0.4, 0.02, -0.2], 1.78, { ...P_PRESENT, aR: [70, 60] }, 'paramedic', { face: 'smile', flip: true, look: -0.6 });
    fall(U, 'snow', tt, 'snow');
  } });
const DUO = { pos: [0.9, 1.55, 4.8], look: [1.1, 1.3, 1.4], fov: 36 };
const duo = (U, st, tt, ff = 'neutral', hf = 'neutral', fp = P_STAND) => {
  const h = put(U, st, 'her', [0.3, 0.02, 1.3], 1.7, breathe(P_SHIVER, { ...P_SHIVER, lean: 8 }, tt, 0.35), 'heroWinter', { face: hf, look: 0.6 });
  const fr = put(U, st, 'friend', [1.9, 0.02, 1.6], 1.72, fp, { ...CAST.cap, sleeves: 'long', top: '#3a6a4f' }, { face: ff, flip: true, look: -0.7 });
  fall(U, 'snow', tt, 'snow'); return [h, fr];
};
sh('s074', 'winter', WIN, { cam: [DUO, mv(DUO, [0.2, 0, -0.6])], ui(U, t, info, S, st, tt) { duo(U, st, tt, 'neutral', 'smile', P_THINK); } });
sh('s075', 'winter', WIN, { cam: [mv(DUO, [0.2, 0, -0.6]), mv(DUO, [0.3, 0, -1.0])],
  ui(U, t, info, S, st, tt) {
    const l = info.w('Liar', 5.4); const [h, fr] = duo(U, st, tt, t < l ? 'neutral' : 'smile', t < info.w('held', 2.8) ? 'neutral' : 'smile', t < l ? P_THINK : P_HIPS);
    if (fr) { const hd = info.w('held', 2.8); if (t < hd) bubble(U, 'b1', top(fr), 'How were you down there for six minutes?', info.w('How', 0.2), t, { side: -1, fs: 40 }); else bubble(U, 'b1', top(fr), 'Liar.', l, t, { side: -1, fs: 56 }); }
    if (h) bubble(U, 'b2', top(h), 'I held my breath.', info.w('held', 2.8), t, { side: 1, fs: 40, until: l });
  } });

// ---------------------------------------------------------------- the message
const ROOM_N = { pos: [0, 1.5, 4.4], look: [0, 1.1, 0], fov: 44 };
const MSG = ['We saw what you did', 'under the ice.', "You're not the only one."];
sh('s076', 'bedroom', 'night', { cam: [ROOM_N, mv(ROOM_N, [0, 0, -0.6])],
  ui(U, t, info, S, st, tt) {
    const q = proj(st, [-1.6, 0, -1.0]); U.svg('bed', P2.bed(q.x, q.y, 2.0 * q.ppm), { z: 3 });
    const c = put(U, st, 'her', [-0.1, 0, 0.5], 1.7, P_PHONE, 'her', { face: t < info.w('We saw', 2.0) ? 'neutral' : 'worried', rim: '#a8c4ff' });
    const bz = info.w('buzzes', 1.0);
    if (c && t > bz && t < bz + 1.2) U.svg('buzz', [0, 1, 2].map((i) => `<path d="M ${f(c.head[0] + 70 + i * 16)} ${f(c.head[1] + 40)} q 12 18 0 36" fill="none" stroke="#ffd29a" stroke-width="5" opacity="${f(Math.abs(Math.sin(t * 20)))}"/>`).join(''), { z: 30 }); else U.svg('buzz', '', {});
    const sh0 = info.w('Unknown', 1.6);
    if (t > sh0) { const n = t > info.w('under the ice', 3.2) ? 2 : t > info.w('We saw', 2.2) ? 1 : 0; const k = ease.out(clamp((t - sh0) / 0.35)); U.svg('ph', `<g transform="translate(0 ${f((1 - k) * 300)})">${P2.phone(1560, 1010, 760, MSG.slice(0, n))}</g>`, { z: 35 }); }
  } });
sh('s077', 'bedroom', 'night', { cam: [mv(ROOM_N, [0, 0, -0.8])],
  ui(U, t, info, S, st, tt) { shade(U, 0.55, '#000', 20); const k = 1 + 0.04 * t; U.svg('ph', `<g transform="translate(960 1060) scale(${k.toFixed(3)}) translate(-960 -1060)">${P2.phone(960, 1060, 1000, MSG.slice(0, t > info.w('only', 0.5) - 0.2 ? 3 : 2))}</g>`, { z: 35 }); } });

// ---------------------------------------------------------------- could it be real?
labShot('s078', { cam: 'wide', people: [['sciA', 'scientist', [-0.8, 0, 0.6], P_THINK, 'neutral', false], ['sciB', 'scientist', [1.4, 0, 0.9], P_PRESENT, 'smile', true]] });
labShot('s079', { cam: 'tank', pfc: true, ui: (U) => U.timeStack({ date: '1960s', time: 'Mice breathing liquid', place: 'packed with oxygen' }, { at: 0.3 }) });
wardShot('s080', { ui: (U) => U.timeStack({ date: '1989', time: 'Philadelphia' }, { at: 0.1 }) });
wardShot('s081', { cam: [{ pos: [3, 2.0, 10], look: [0, 3, -4], fov: 40 }, { pos: [2, 1.8, 8.5], look: [0, 3, -4], fov: 40 }] });
torsoShot('s083', { saline: true, bigBreath: true, who: false, ui: (U, t, info) => plate(U, 'EASIER', 'to inflate', info.w('easier', 0.6)) });

// ---------------------------------------------------------------- ending
sh('s087', 'lake', LAKE, { cam: [{ pos: [-1.2, 1.5, 7.2], look: [-5.4, 0.8, 1.0], fov: 40 }, { pos: [-1.8, 1.4, 6.2], look: [-5.4, 0.8, 1.0], fov: 40 }],
  ui(U, t, info, S, st, tt) {
    const water = proj(st, [-4.2, 0, 1.8]).y;
    her(U, st, tt, { at: [-4.2, -1.2, 1.8], pose: wave(tt, P_FLOAT), face: 'smile', look: 0.3, flip: false }, { clipY: water });
    friend(U, st, P_HIPS, 'smile', { at: [-6.4, 1.17, 0.0] });
    U.svg('fx', ripple(st, [-4.2, 0, 1.8], t % 2.4, 0, { r: 0.35, grow: 1.2 }), { z: 30 });
    U.title({ title: 'Where would you go first?', kicker: 'Tell us in the comments' }, { at: 0.3, key: 'cta' });
  } });
registerShot('s088', { bg: '#120f0d', theme: 'dark',
  ui(U, t, info) {
    U.svg('bg', `<defs><radialGradient id="e88"><stop offset="0" stop-color="#2a3550"/><stop offset="1" stop-color="#0b0d14"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#e88)"/>`, { z: 1 });
    const k = ease.out(clamp(t / 0.6)); U.svg('ph', `<g transform="translate(0 ${f((1 - k) * 200)})">${P2.phone(520, 960, 780, MSG, { from: 'Unknown number' })}</g>`, { z: 5 });
    const a = clamp((t - 0.5) / 0.5), b = clamp((t - info.w('next time', 1.4)) / 0.5);
    U.html('end', `<div style="width:1000px;color:#fff"><div style="font:600 30px 'IBM Plex Mono';letter-spacing:.3em;color:#ffd29a;opacity:${b}">NEXT TIME</div>
      <div style="font:900 96px Inter;line-height:1.02;letter-spacing:-.02em;margin:14px 0 40px;opacity:${b}">Who sent<br>that message?</div>
      <div style="display:inline-block;background:#e2553f;border-radius:14px;padding:22px 44px;font:900 46px Inter;opacity:${a};transform:scale(${(0.9 + 0.1 * a + 0.03 * Math.sin(t * 5)).toFixed(3)})">SUBSCRIBE</div></div>`, { left: '860px', top: '300px' });
  } });
