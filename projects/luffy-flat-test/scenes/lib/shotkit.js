// Shared shot helpers for the story version (room table, classroom lung tree, underwater fish, 1960s lab, hospital, depth).
// Extracted from the documentary build (projects/breathe-underwater-long-3d/scenes/shots/b1-b3.js) so both films share them.
import { registerShot, THREE, ease, clamp, cam } from '/engine/api.js';
import { place, breathe, P_STAND, P_PRESENT, P_THINK, P_SHRUG, P_POINT, P_FLOAT, P_SHIVER } from './people.js';
import { proj } from './stage.js';
import * as P2 from './props2d.js';
const V = (...a) => new THREE.Vector3(...a);
const lerp = (a, b, k) => a + (b - a) * k;
const L3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
// ---------------------------------------------------------------- room (table set)
const RCAM = {
  wide: { pos: [0, 2.3, 5.8], look: [0, 1.2, 0], fov: 40 }, jars: { pos: [0, 1.62, 2.3], look: [0, 1.25, 0], fov: 36 },
  airjar: { pos: [-0.45, 1.5, 1.55], look: [-0.6, 1.25, 0], fov: 34 }, waterjar: { pos: [0.75, 1.5, 1.55], look: [0.6, 1.25, 0], fov: 34 },
  buckets: { pos: [0.4, 3.6, 7.4], look: [0, 0.4, 2.4], fov: 42 }, scale: { pos: [4.4, 1.9, 4.3], look: [2.6, 0.7, 1.2], fov: 38 }, bars: { pos: [0, 2.0, 3.9], look: [0, 1.45, 0], fov: 38 },
};
function room(W, S, t, info, o) {
  const c = RCAM[o.cam || 'wide'], k = ease.inOut(clamp(t / info.dur)), push = o.push ?? 0.1;
  const pos = L3(c.pos, L3(c.pos, c.look, push), k);
  cam.dolly(W.camera, 0, [[0, { pos, look: c.look, fov: c.fov }]]);
  const vis = o.show || [];
  S.jarAir.visible = S.jarWater.visible = vis.includes('jars') || vis.includes('air');
  if (!vis.includes('jars')) S.jarWater.visible = vis.includes('water');
  if (vis.includes('air') && !vis.includes('jars')) S.jarAir.visible = true;
  S.scale.visible = vis.includes('scale');
  // buckets: [from, to, phrase] grows toward `to` from the phrase; or a number
  let n = 0; if (Array.isArray(o.buckets)) { const a = info.w(o.buckets[2], 0.5); n = Math.round(lerp(o.buckets[0], o.buckets[1], ease.out(clamp((t - a) / 1.6)))); } else n = o.buckets || 0;
  S.buckets.count = Math.min(320, n);
  // crates on the scale: count (0..6)
  const cr = Array.isArray(o.crates) ? Math.round(lerp(o.crates[0], o.crates[1], ease.out(clamp((t - info.w(o.crates[2], 0.5)) / 2)))) : (o.crates ?? 6);
  S.crates.forEach((m, i) => (m.visible = i < cr));
  // bars: values in the same unit, max 200 -> 1.8 m
  S.bars.forEach((b, i) => { const v = o.bars?.[i]; b.visible = v != null; if (v != null) b.scale.y = Math.max(0.01, (v / (o.barMax || 200)) * 1.8 * ease.out(clamp((t - info.w(o.barAt?.[i], 0.3 + i * 0.5)) / 1.0))); });
  // oxygen dots glow in the air jar
  const nd = !o.dots ? 34 : Math.round(lerp(0, 34, clamp((t - info.w(o.dots, 0.3)) / 1.4)));
  S._p = { air: S.jarAir.visible, water: S.jarWater.visible, dots: nd, buckets: S.buckets.count, crates: S.scale.visible ? cr : -1, bars: S.bars.map((b) => (b.visible ? b.scale.y : 0)) };
  S.jarAir.visible = S.jarWater.visible = S.scale.visible = false; S.buckets.count = 0; S.bars.forEach((b) => (b.visible = false));
}
// draw the room props in 2D at their 3D positions (far to near)
const BARC = ['#4a8cff', '#e2553f', '#e0b44a', '#4f8a5b'];
function roomProps(U, st, p) {
  let g = '';
  if (p.buckets) { const items = []; for (let i = 0; i < p.buckets; i++) items.push([-2.6 + (i % 20) * 0.28, 0, 1.2 + Math.floor(i / 20) * 0.3]); items.sort((a, b) => a[2] - b[2]); for (const w of items) { const q = proj(st, w); if (q.ok) g += P2.bucket(q.x, q.y, 0.26 * q.ppm); } }
  p.bars.forEach((hm, i) => { if (!hm) return; const q = proj(st, [-1.05 + i * 0.7, 0.99, 0]), q2 = proj(st, [-1.05 + i * 0.7, 0.99 + hm, 0]); if (q.ok) g += P2.bar(q.x, q.y, 0.36 * q.ppm, q.y - q2.y, BARC[i]); });
  if (p.air) { const q = proj(st, [-0.6, 0.99, 0.05]); if (q.ok) g += P2.jar(q.x, q.y, 0.68 * q.ppm, { dots: p.dots, label: 'AIR' }); }
  if (p.water) { const q = proj(st, [0.6, 0.99, 0.05]); if (q.ok) g += P2.jar(q.x, q.y, 0.68 * q.ppm, { water: true, dots: 2, label: 'LAKE' }); }
  if (p.crates >= 0) { const q = proj(st, [2.6, 0, 1.2]); if (q.ok) g += P2.scale(q.x, q.y, (1.0 * q.ppm / 280) * 300, { crates: p.crates, k: p.crates / 6 }); }
  U.svg('props', g, { z: 3 });
}
function roomShot(id, o) {
  registerShot(id, {
    set: 'room', look: 'golden', badge: false,
    update(W, S, t, info) { room(W, S, t, info, o); },
    ui(U, t, info, S, st) {
      if (S._p) roomProps(U, st, S._p);
      if (o.who !== false) place(U, st, 'her', o.at || [1.95, 0, 0.95], 1.7, breathe(o.pose || P_PRESENT, { ...(o.pose || P_PRESENT), lean: (o.pose || P_PRESENT).lean + 2 }, info.start + t), 'her', { face: o.face || 'smile', flip: true, look: -0.6, rim: '#ffd29a' });
      o.ui?.(U, t, info, S, st);
    },
  });
}
// ---------------------------------------------------------------- torso (bronchial tree)
function torso(W, S, t, info, o) {
  const k = ease.inOut(clamp(t / info.dur));
  if (o.dive) cam.dolly(W.camera, t, [[0, { pos: [0, 2.2, 6.0], look: [0, 2.1, 0], fov: 34 }], [info.dur, { pos: [0.2, 2.15, 1.4], look: [0, 1.9, 0], fov: 40 }, ease.inOut]]);
  else cam.orbit(W.camera, t, { target: o.target || [0.5, 1.8, 0], radius: o.r || [6.6, 5.8], height: o.h || [2.4, 2.1], from: o.from ?? -18, to: o.to ?? 14, dur: info.dur, fov: 34 });
  const stale = o.stale ? clamp((t - info.w(o.stale, 0.5)) / 1.5) : 0;
  const glow = o.glow ? clamp((t - info.w(o.glow, 0.3)) / 1) : 0;
  S.airway.color.set(new THREE.Color('#4a8cff').lerp(new THREE.Color('#7d8088'), stale));
  S.airway.emissive?.set('#2f6fdb'); S.airway.emissiveIntensity = 0.35 * glow;
  const br = 1 + (o.bigBreath ? 0.28 * ease.inOut(clamp((t - 0.3) / 1.6)) : 0.04 * Math.sin((info.start + t) * 1.4));
  // collapse: sacs shrink one by one from the phrase on; collapsed: already shrunk
  const ca = o.collapse ? info.w(o.collapse, 1) : null;
  S.sacs.forEach((s, i) => { let k = 1; if (o.collapsed) k = 0.55; else if (ca != null) k = 1 - 0.45 * ease.inOut(clamp((t - ca - (i % 12) * 0.25) / 0.8)); s.scale.setScalar(br * k); });
  S.sac.color.set(o.saline ? '#bfe3ef' : '#e3e1dc');
  S._t2 = { stale: stale > 0.5, glow: glow * 0.8, saline: !!o.saline, k: S.sacs.map((m) => m.scale.x) };
}
function torsoShot(id, o) {
  registerShot(id, {
    set: 'torso', look: 'golden', badge: 'SIMULATION',
    update(W, S, t, info) { torso(W, S, t, info, o); },
    ui(U, t, info, S, st) {
      if (S._t2) { const segs = S.segs.map((g) => { const a = proj(st, g.a), b = proj(st, g.b); return { a: [a.x, a.y], b: [b.x, b.y], w: 2 * g.r * a.ppm }; }); const sacs = S.sacPts.map((c, i) => { const q = proj(st, c.c); return { c: [q.x, q.y], r: c.r * q.ppm * S._t2.k[i] }; }); U.svg('tree', P2.lungs(segs, sacs, S._t2), { z: 3 }); }
      if (o.who !== false) place(U, st, 'her', [2.35, 0, 0.9], 1.7, breathe(o.pose || P_PRESENT, { ...(o.pose || P_PRESENT), lean: 3 }, info.start + t), 'her', { face: o.face || 'neutral', flip: true, look: -0.7, rim: '#ffd29a' });
      o.ui?.(U, t, info, S, st);
    },
  });
}
const tag = (U, S, key, p, text, at, sub) => U.pin(new THREE.Vector3(...p), text, { style: 'tag', at, sub, leader: 90, dir: 'right', key });
const plate = (U, value, label, at, o = {}) => U.stat({ value, label, kicker: o.kicker, sub: o.sub, countFrom: o.from }, { style: 'plate', at, countDur: 1, pos: o.pos || 'tl', key: o.key });

// ---------------------------------------------------------------- gill
function gillShot(id, o) {
  registerShot(id, { set: 'gill', look: { base: 'day', sky: { type: 'flat', color: '#2f7f92' }, bg: '#2f7f92', fog: { color: '#2f7f92', density: 0.05 } }, badge: 'SIMULATION',
    update(W, S, t, info) {
      S.arch.visible = !!o.arch; S.fish.visible = o.fish !== false;
      S.fish.rotation.y = o.fishYaw ?? (-0.35 + 0.2 * ease.inOut(clamp(t / info.dur)));
      // opposed flows: arrows slide along their direction
      S.flowW.forEach((a, i) => (a.position.x = -0.6 + i * 0.6 + ((t * 0.4) % 0.6) - 0.3));
      S.flowB.forEach((b, i) => (b.position.x = 0.6 - i * 0.6 - ((t * 0.4) % 0.6) + 0.3));
      // one-way water path dots (or CO2 dots leaving)
      S.dots.forEach((d, i) => { d.visible = !!o.path; if (o.path) d.position.copy(S.path.getPoint(((t * 0.35 + i / S.dots.length) % 1))); });
      const c = o.cam || { pos: [0.6, 1.1, 3.2], look: [0, 0.75, 0], fov: 34 };
      cam.dolly(W.camera, t, [[0, c], [info.dur, { ...c, pos: c.pos.map((v, i) => v + (c.look[i] - v) * 0.12) }, ease.inOut]]);
      S._g = { arch: S.arch.visible, fish: S.fish.visible, path: !!o.path }; S.arch.visible = S.fish.visible = false; S.dots.forEach((d) => (d.visible = false));
    },
    ui(U, t, info, S, st) {
      let g = ''; const tt = info.start + t;
      if (S._g.fish) { const q = proj(st, [0, 0.75, 0]); g += P2.fish(q.x, q.y, 2.15 * q.ppm, { gill: true, t: tt }); }
      if (S._g.path) S.dots.forEach((d) => { const q = proj(st, d.position); if (q.ok) g += `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${(0.03 * q.ppm).toFixed(1)}" fill="#bfeaff" stroke="#1b1410" stroke-width="2"/>`; });
      U.svg('gfish', g, { z: 3 });
      if (S._g.arch) U.svg('garch', P2.gills(960, 600, 1100, tt), { z: 4 });
      o.ui?.(U, t, info, S, st);
    } });
}
// ---------------------------------------------------------------- lab
const LCAM = { wide: { pos: [0.4, 2.3, 4.6], look: [0, 1.4, -1.4], fov: 40 }, chamber: { pos: [-1.0, 1.9, 1.0], look: [-1.8, 1.7, -1.4], fov: 36 },
  tank: { pos: [0.6, 1.6, 0.4], look: [0.2, 1.25, -1.5], fov: 36 }, flasks: { pos: [1.9, 1.7, 0.4], look: [1.9, 1.3, -1.6], fov: 36 },
  thermo: { pos: [2.2, 1.9, 0.6], look: [2.6, 1.6, -1.7], fov: 36 }, lungs: { pos: [-0.3, 1.75, 1.3], look: [-0.3, 1.3, -1.1], fov: 36 } };
function labShot(id, o) {
  registerShot(id, { set: 'lab', look: 'studio', badge: 'RECONSTRUCTION',
    update(W, S, t, info) {
      const c = LCAM[o.cam || 'wide'];
      cam.dolly(W.camera, t, [[0, c], [info.dur, { ...c, pos: c.pos.map((v, i) => v + (c.look[i] - v) * (o.push ?? 0.1)) }, ease.inOut]]);
      // gauge: atm from..to (0..160 maps -135..+135 deg)
      const atm = Array.isArray(o.atm) ? o.atm[0] + (o.atm[1] - o.atm[0]) * ease.inOut(clamp((t - info.w(o.atm[2], 0.5)) / 2)) : (o.atm ?? 0);
      S.needle.rotation.z = -((-135 + (atm / 160) * 270) * Math.PI) / 180;
      S.mice.forEach((m, i) => { m.visible = !o.noMice; m.position.y = 0.12 + 0.01 * Math.sin((info.start + t) * 2 + i); });
      S.liquid.material.color.set(o.pfc ? '#f2efe2' : '#bfe7f0');
      S.lungs.visible = !!o.lungs;
      const cold = o.cold ? ease.inOut(clamp((t - info.w(o.cold, 0.4)) / 2.2)) : 0; S.column.scale.y = 1 - 0.65 * cold;
      // gas dots around the tank: o2 in (blue), co2 piling up (grey)
      S.o2.forEach((d, i) => { d.visible = !!o.o2; if (o.o2) { const ph = (t * 0.4 + i / 30) % 1; d.position.set(0.2 + Math.cos(i * 2.1) * 0.6 * (1 - ph), 1.5 - ph * 0.3, -1.5 + Math.sin(i * 2.1) * 0.4 * (1 - ph)); } });
      S.co2.forEach((d, i) => { const n = o.co2 ? Math.round(30 * clamp((t - info.w(o.co2, 0.3)) / 2.5)) : 0; d.visible = i < n; if (d.visible) d.position.set(0.2 + Math.cos(i * 1.7) * 0.32, 1.12 + (i % 6) * 0.06, -1.5 + Math.sin(i * 1.7) * 0.2); });
      W.sun && (W.sun.intensity = o.dim ? 0.3 : W.look.sun.intensity);
      S._l = { atm, cold, pfc: !!o.pfc, mice: !o.noMice, lungs: !!o.lungs, o2: !!o.o2, co2: S.co2.filter((d) => d.visible).length };
      S.props.flat().forEach((p) => (p.visible = false)); S.o2.forEach((d) => (d.visible = false)); S.co2.forEach((d) => (d.visible = false));
    },
    ui(U, t, info, S, st) {
      const L = S._l, tt = info.start + t; let g = '';
      const at = (p) => proj(st, p);
      let q = at([-2.2, 1.0, -1.6]); if (q.ok) g += P2.chamber(q.x, q.y, 1.4 * q.ppm);
      const qd = at([-1.25, 2.2, -1.25]), qp = at([-1.25, 1.5, -1.4]); if (qd.ok) g += `<line x1="${qd.x.toFixed(1)}" y1="${qd.y.toFixed(1)}" x2="${qp.x.toFixed(1)}" y2="${qp.y.toFixed(1)}" stroke="#1b1410" stroke-width="${(0.05 * qd.ppm).toFixed(1)}"/>` + P2.gauge(qd.x, qd.y, 0.24 * qd.ppm, L.atm);
      q = at([0.2, 1.0, -1.5]); if (q.ok) g += P2.tank(q.x, q.y, 1.0 * q.ppm, { pfc: L.pfc, mice: L.mice, co2: L.co2, t: tt });
      q = at([1.5, 1.0, -1.6]); if (q.ok) g += P2.jar(q.x, q.y, 0.5 * q.ppm, { water: true });
      q = at([2.2, 1.0, -1.6]); if (q.ok) g += P2.flask(q.x, q.y, 0.62 * q.ppm, L.pfc ? '#f2efe2' : '#f2efe2');
      q = at([2.8, 1.0, -1.7]); if (q.ok) g += P2.thermometer(q.x, q.y, 1.3 * q.ppm, 0.85 - 0.6 * L.cold);
      if (L.lungs) { q = at([-0.85, 1.0, -1.1]); g += P2.lungPair(q.x, q.y, 0.6 * q.ppm); q = at([0.15, 1.0, -1.1]); g += P2.lungPair(q.x, q.y, 0.1 * q.ppm); }
      if (L.o2) S.o2.forEach((d) => { const r = at(d.position); g += `<circle cx="${r.x.toFixed(1)}" cy="${r.y.toFixed(1)}" r="${(0.03 * r.ppm).toFixed(1)}" fill="#7fd0ff" stroke="#1b1410" stroke-width="2"/>`; });
      U.svg('labprops', g, { z: 3 });
      for (const [k, who, at, pose, face, flip] of o.people || []) place(U, st, k, at, 1.75, pose, who, { face, flip, rim: '#fff1d6', look: flip ? -0.6 : 0.6 });
      o.ui?.(U, t, info, S, st);
    } });
}
// ---------------------------------------------------------------- hospital exterior
function wardShot(id, o) {
  registerShot(id, { set: 'ward', look: 'night', badge: false,
    update(W, S, t, info) { const c = o.cam || [{ pos: [0, 2.2, 14], look: [0, 3, -4], fov: 40 }, { pos: [0, 2.0, 11.5], look: [0, 3, -4], fov: 40 }]; cam.dolly(W.camera, t, [[0, c[0]], [info.dur, c[1], ease.inOut]]); },
    ui(U, t, info, S, st) {
      const walk = Math.sin((info.start + t) * 3) * 6;
      place(U, st, 'docA', [-1.6 + t * 0.15, 0, 2.2], 1.75, { ...P_STAND, aL: [12 + walk, 8], aR: [12 - walk, 8] }, 'doctor', { face: 'neutral', rim: '#ffd8a8' });
      place(U, st, 'docB', [1.4, 0, 1.6], 1.72, P_THINK, 'doctor', { face: 'neutral', flip: true, rim: '#ffd8a8', look: -0.5 });
      o.ui?.(U, t, info, S, st);
    } });
}
// ---------------------------------------------------------------- depth
function depthShot(id, o) {
  registerShot(id, { set: 'depth', look: { base: 'dusk', sky: { type: 'flat', color: '#0f3340' }, bg: '#0f3340', fog: { color: '#1f5260', density: 0.03 } }, badge: 'SIMULATION',
    update(W, S, t, info) {
      const d = Array.isArray(o.d) ? o.d[0] + (o.d[1] - o.d[0]) * ease.inOut(clamp(t / info.dur)) : o.d; S._d = d;
      W.scene.fog && W.scene.fog.color.set(new THREE.Color('#2a6676').lerp(new THREE.Color('#04121a'), clamp(d / 70)));
      if (W.scene.background?.isColor) W.scene.background.copy(W.scene.fog.color);
      S.fill.position.set(-1, -d + 2, 3);
      cam.dolly(W.camera, 0, [[0, { pos: [-0.4, -d + (o.camUp ?? 0.6), o.camZ ?? 6.5], look: [0.2, -d + 0.2, 0], fov: 38 }]]);
      S.motes.forEach((m, i) => (m.position.y += 0)); // static motes; the camera moves past them
    },
    ui(U, t, info, S, st) {
      const d = S._d, who = o.who || 'her';
      const feet = [-0.6, -d - 0.85, 0];
      place(U, st, 'p', feet, 1.75, breathe(o.pose || P_FLOAT, { ...(o.pose || P_FLOAT), aL: [(o.pose || P_FLOAT).aL[0] + 6, (o.pose || P_FLOAT).aL[1]] }, info.start + t), who, { face: o.face || 'open', rim: '#a8e4ff', look: 0.4 }, o.extra ? (c) => o.extra(c, t, info) : null);
      U.timeChip({ time: `${Math.round(d)} m deep`, sub: `${(1 + d / 10).toFixed(1)} atm total` }, { at: 0.1, key: 'depth' });
      o.ui?.(U, t, info, S, st);
    } });
}
const dots = (kind) => (c, t) => { const s = c.R / 46; let q = ''; for (let i = 0; i < 16; i++) { const ph = (t * 0.6 + i / 16) % 1; const x = c.head[0] + (Math.sin(i * 2.3) * 70 + (kind === 'bubbles' ? 0 : -ph * 60)) * s; const y = c.head[1] + (120 + (kind === 'bubbles' ? -ph * 260 : Math.cos(i) * 40)) * s; q += kind === 'bubbles' ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(6 + 6 * ph) * s}" fill="none" stroke="#dff6ff" stroke-width="${2 * s}" opacity="${1 - ph}"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${5 * s}" fill="#e0b44a" opacity="0.85"/>`; } return q; };

export { roomShot, torsoShot, gillShot, labShot, wardShot, depthShot, plate, tag, dots, roomProps, V };
