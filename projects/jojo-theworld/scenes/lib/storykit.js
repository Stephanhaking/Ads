// Story helpers shared by the story-style films: 2D characters at projected points, speech bubbles, clipping at a water/ice
// line, ripples, splashes, falling snow/leaves, walk/run/wave poses and a generic shot wrapper (sh).
import { registerShot, THREE, ease, clamp, cam, toStage, E } from '/engine/api.js';
import { person } from './char2d.js';
import { CAST, breathe, P_STAND, P_FLOAT, P_POINT, P_HIPS, P_PRESENT, P_THINK, P_SHRUG, P_TIRED, P_PHONE, P_RUN, P_SWIM, P_SHIVER } from './people.js';
import { proj } from './stage.js';
import * as P2 from './props2d.js';
import { plate, tag, dots } from './shotkit.js';

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
      if (S.jarAir) { S.jarAir.visible = S.jarWater.visible = S.scale.visible = false; S.buckets.count = 0; S.bars.forEach((b) => (b.visible = false)); S.crates.forEach((c) => (c.visible = false)); }
      if (typeof o.cam === 'function') cam.dolly(W.camera, 0, [[0, o.cam(t, info)]]);
      else cam.dolly(W.camera, t, [[0, o.cam[0]], [info.dur, o.cam[1] || o.cam[0], ease.inOut]]);
      if (o.shake) cam.handheld(W.camera, t, typeof o.shake === 'function' ? o.shake(t, info) : o.shake, 3);
    },
    ui(U, t, info, S, st) { o.ui(U, t, info, S, st, info.start + t); },
  });
}
const mv = (c, d) => ({ ...c, pos: c.pos.map((v, i) => v + d[i]) });


export { f, esc, fig, draw, put, top, bubble, says, ripple, splash, stream, bubbles, heat, fall, shade, walk, run, wave, UP, swimP, sh, mv, plate, tag, dots, proj, P2, CAST, breathe, ease, clamp, THREE, registerShot, cam };
export { P_STAND, P_FLOAT, P_POINT, P_HIPS, P_PRESENT, P_THINK, P_SHRUG, P_TIRED, P_PHONE, P_RUN, P_SWIM, P_SHIVER };
