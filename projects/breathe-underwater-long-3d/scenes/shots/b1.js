// Shots s006-s071: cold open close, litany, setting, the first breath, the weight of water, dead space.
// Sets: room (table, jars, buckets, scale, bars), torso (bronchial tree), gill, lake. Cards come from lib/cards.js.
import { registerShot, THREE, ease, clamp, cam, prog } from '/engine/api.js';
import { place, breathe, P_STAND, P_PRESENT, P_THINK, P_SHRUG, P_POINT, P_FLOAT } from '../lib/people.js';
import { cards } from '../lib/cards.js';
import { drawSwimmer } from './s002.js';
import { floatSwimmer } from '../lib/swimmer.js';

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
  S.airDots.forEach((d, i) => (d.visible = !o.dots || i < Math.round(lerp(0, 60, clamp((t - info.w(o.dots, 0.3)) / 1.4)))));
}
function roomShot(id, o) {
  registerShot(id, {
    set: 'room', look: 'golden', badge: false,
    update(W, S, t, info) { room(W, S, t, info, o); },
    ui(U, t, info, S, st) {
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
}
function torsoShot(id, o) {
  registerShot(id, {
    set: 'torso', look: 'clay', badge: 'SIMULATION',
    update(W, S, t, info) { torso(W, S, t, info, o); },
    ui(U, t, info, S, st) {
      if (o.who !== false) place(U, st, 'her', [2.35, 0, 0.9], 1.7, breathe(o.pose || P_PRESENT, { ...(o.pose || P_PRESENT), lean: 3 }, info.start + t), 'her', { face: o.face || 'neutral', flip: true, look: -0.7, rim: '#ffd29a' });
      o.ui?.(U, t, info, S, st);
    },
  });
}
const tag = (U, S, key, p, text, at, sub) => U.pin(new THREE.Vector3(...p), text, { style: 'tag', at, sub, leader: 90, dir: 'right', key });
const plate = (U, value, label, at, o = {}) => U.stat({ value, label, kicker: o.kicker, sub: o.sub, countFrom: o.from }, { style: 'plate', at, countDur: 1, pos: o.pos || 'tl', key: o.key });

// ---------------------------------------------------------------- lake extras
registerShot('s006', { set: 'lake', look: { base: 'dusk', fog: { color: '#2c5560', density: 0.012 } },
  update(W, S, t, info) { floatSwimmer(S.sw, [-5, -3.1, 4, 0.5], info.start + t); S.sw.visible = false; S.pierFolk.forEach((m) => (m.visible = false)); const h = S.sw.headWorld(new THREE.Vector3());
    cam.dolly(W.camera, t, [[0, { pos: [h.x + 1.6, h.y, h.z + 1.6], look: [h.x, h.y - 0.2, h.z], fov: 36 }], [info.dur, { pos: [h.x + 1.1, h.y, h.z + 1.1], look: [h.x, h.y - 0.2, h.z], fov: 36 }]]); },
  ui(U, t, info, S, st) { drawSwimmer(U, S, st, info.start + t); } });
registerShot('s012', { set: 'lake', look: 'dusk',
  update(W, S, t, info) { S.sw.visible = false; S.pierFolk.forEach((m) => (m.visible = false)); cam.dolly(W.camera, t, [[0, { pos: [2, 2.2, 6.5], look: [-12, 1.4, 0], fov: 38 }], [info.dur, { pos: [-1, 2.0, 5.5], look: [-16, 1.4, 0], fov: 38 }, ease.inOut]]); },
  ui(U, t, info) { U.title({ title: 'Could a human really do it?', kicker: 'The question' }, { at: info.w('Could', 2.2) }); } });
registerShot('s038', { set: 'lake', look: 'dusk',
  update(W, S, t, info) { S.sw.visible = false; S.pierFolk.forEach((m) => (m.visible = false)); cam.dolly(W.camera, t, [[0, { pos: [-1.2, 2.3, 5.2], look: [-5.4, 1.9, 0.4], fov: 34 }], [info.dur, { pos: [-1.8, 2.2, 4.4], look: [-5.4, 1.9, 0.4], fov: 34 }]]); },
  ui(U, t, info, S, st) { place(U, st, 'her', [-5.4, 1.2, 0.6], 1.7, P_THINK, 'her', { face: 'worried', rim: '#ffc890', look: -0.5 }); U.pin(new THREE.Vector3(-5.4, 3.3, 0.6), 'HOW MUCH WATER?', { style: 'tag', at: 0.4, dir: 'right', leader: 70 }); } });

// ---------------------------------------------------------------- gill teaser
registerShot('s009', { set: 'gill', look: 'studio', badge: 'SIMULATION',
  update(W, S, t, info) { S.arch.visible = false; S.dots.forEach((d) => (d.visible = false)); S.fish.rotation.y = -0.5 + 0.35 * ease.inOut(clamp(t / info.dur)); S.gillArc.scale.setScalar(1 + 0.08 * Math.sin(t * 6));
    cam.dolly(W.camera, t, [[0, { pos: [0.6, 1.1, 3.2], look: [0, 0.75, 0], fov: 34 }], [info.dur, { pos: [0.6, 1.0, 2.7], look: [0.2, 0.75, 0], fov: 34 }]]); },
  ui(U, t, info, S) { U.pin(S.gillArc.getWorldPosition(new THREE.Vector3()), 'GILLS', { style: 'tag', at: info.w('plumbing', 1.2), dir: 'right', leader: 80 }); } });

// ---------------------------------------------------------------- torso shots
torsoShot('s010', { from: -40, to: 40, glow: 'never', ui: (U, t, info, S) => tag(U, S, 'tr', [0.1, 2.7, 0], 'NEVER BUILT FOR WATER', info.w('never', 0.6)) });
torsoShot('s018', { dive: true, who: false, ui: (U, t, info) => U.title({ title: 'Setting', kicker: 'Chapter 1' }, { at: 0.2 }) });
torsoShot('s019', { ui: (U, t, info) => plate(U, 250, 'mL of oxygen / minute', info.w('two hundred', 1), { kicker: 'AT REST', from: 0 }) });
torsoShot('s022', { glow: 'Hold on', face: 'smile', pose: P_POINT, ui: (U, t, info, S) => { plate(U, 250, 'mL / minute', 0.2, { kicker: 'REMEMBER' }); tag(U, S, 'hold', [0.6, 1.5, 0.3], 'HOLD ON TO THAT', info.w('Hold on', 2.5)); } });
torsoShot('s025', { glow: 'Resting', ui: (U, t, info) => plate(U, '5-8', 'litres of air / minute', info.w('five to eight', 2), { kicker: 'RESTING BREATHING' }) });
torsoShot('s026', { ui: (U) => plate(U, 6, 'litres of air / minute', 0.05, { kicker: 'CALL IT' }) });
torsoShot('s027', { glow: 'Two', ui: (U) => plate(U, 250, 'mL of oxygen', 0.1, { kicker: 'EXTRACTED' }) });
torsoShot('s028', { r: [6.6, 8.2], h: [2.4, 2.8], face: 'smile', pose: P_STAND });
torsoShot('s057', { target: [0, 2.6, 0], r: [3.4, 3.0], h: [2.8, 2.7], who: false, ui: (U, t, info, S) => tag(U, S, 'min', [0.05, 2.8, 0], 'EVERY MINUTE', 0.2) });
torsoShot('s058', { dive: true, who: false });
torsoShot('s059', { glow: 'same pipes', ui: (U, t, info, S) => tag(U, S, 'pipe', [0.05, 2.6, 0], 'IN AND OUT · SAME PIPE', info.w('same pipes', 1)) });
torsoShot('s060', { glow: 'dead space', ui: (U, t, info, S) => { tag(U, S, 'ds', [0.05, 2.55, 0], 'DEAD SPACE', info.w('dead space', 1.5), 'about 150 mL of a 500 mL breath'); } });
torsoShot('s061', { glow: 'That', who: false, ui: (U, t, info, S) => tag(U, S, 'v', [0.05, 2.55, 0], '150 mL · THE AIRWAYS', 0.3) });
torsoShot('s062', { stale: 'stale', face: 'worried', ui: (U, t, info, S) => tag(U, S, 'st', [0.05, 2.55, 0], 'STALE', info.w('stale', 1)) });
torsoShot('s063', { stale: 'The textbook', pose: P_THINK, ui: (U, t, info) => plate(U, 'lower', 'oxygen pressure in the lung', info.w('lower', 2), { kicker: 'THAN OUTSIDE' }) });
torsoShot('s064', { ui: (U) => plate(U, 500, 'mL in', 0.1, { kicker: 'ONE BREATH' }) });
torsoShot('s065', { stale: 'stale', ui: (U) => plate(U, 150, 'mL stale', 0.1, { kicker: 'OF IT' }) });
torsoShot('s066', { glow: 'reach', face: 'smile', ui: (U) => plate(U, 350, 'mL reach the air sacs', 0.1, { kicker: 'FRESH' }) });
torsoShot('s068', { bigBreath: true, pose: P_SHRUG, face: 'open', ui: (U) => plate(U, 'max', 'the biggest breath', 0.3, { kicker: 'VITAL CAPACITY' }) });

// ---------------------------------------------------------------- room shots
roomShot('s008', { cam: 'jars', show: ['jars'], push: 0.15, ui: (U, t, info) => { U.pin(new THREE.Vector3(-0.6, 1.75, 0.05), 'AIR', { style: 'tag', at: info.w('air', 0.4), dir: 'left', leader: 60, key: 'a' }); U.pin(new THREE.Vector3(0.6, 1.75, 0.05), 'LAKE', { style: 'tag', at: info.w('lake', 1.5), dir: 'right', leader: 60, key: 'b' }); } });
roomShot('s014', { cam: 'wide', show: ['jars'], ui: (U, t, info) => U.list({ kicker: 'Built on', items: [{ title: 'Physiology textbooks' }, { title: 'Diving manuals' }, { title: 'Clinical reviews' }, { title: 'Old laboratory reports' }] }, { times: ['physiology', 'diving', 'clinical', 'laboratory'].map((p, i) => info.w(p, 0.5 + i)) , pos: 'cl' }) });
roomShot('s016', { cam: 'jars', show: ['jars'], pose: P_POINT, ui: (U, t, info) => U.statement('Every number: a named source, or arithmetic we show.', { at: 0.3, pos: { x: 760, y: 170, ax: 0.5, ay: 0 } }) });
roomShot('s023', { cam: 'airjar', show: ['air'], dots: 'twenty', ui: (U, t, info) => U.pin(new THREE.Vector3(-0.6, 1.72, 0.05), '20.9 % OXYGEN', { style: 'tag', at: info.w('twenty point', 2), dir: 'right', leader: 70, sub: 'FAO fisheries manual' }) });
roomShot('s024', { cam: 'airjar', show: ['air'], push: 0.2, ui: (U, t, info) => plate(U, 209, 'mL of oxygen per litre of air', 0.2, { from: 0 }) });
roomShot('s029', { cam: 'jars', show: ['jars'], face: 'open', ui: (U, t, info) => U.title({ title: 'The first breath', kicker: 'Chapter 2' }, { at: 0.3, out: 2.6 }) });
roomShot('s032', { cam: 'waterjar', show: ['jars'], ui: (U, t, info) => U.pin(new THREE.Vector3(0.6, 1.72, 0.05), '8.3 mg O2 PER LITRE', { style: 'tag', at: info.w('eight point', 1), dir: 'left', leader: 70, sub: 'air-saturated, 25 °C' }) });
roomShot('s035', { cam: 'airjar', show: ['jars'], push: 0.25, ui: (U) => plate(U, 209, 'mL per litre · air', 0.1) });
roomShot('s036', { cam: 'jars', show: ['jars'], pose: P_SHRUG, face: 'worried', ui: (U, t, info) => { plate(U, 5.8, 'mL per litre · water', 0.1, { key: 'w' }); U.stat({ value: '36×', label: 'less oxygen in water', kicker: 'RATIO' }, { style: 'plate', at: info.w('thirty-six', 2.2), pos: 'tr', key: 'r' }); } });
roomShot('s037', { cam: 'wide', show: ['jars'], push: -0.1, ui: (U) => U.statement('Colder or warmer: the gap stays huge.', { at: 0.4, pos: { x: 760, y: 170, ax: 0.5, ay: 0 } }) });
roomShot('s039', { cam: 'buckets', show: [], buckets: [0, 43, 'forty-three'], at: [-3.4, 0, 1.6], pose: P_PRESENT, ui: (U, t, info) => U.stat({ value: 43, label: 'litres of water / minute', kicker: 'IF SHE TOOK EVERY MOLECULE', countFrom: 0 }, { style: 'plate', at: info.w('forty-three', 4), pos: 'tr', countDur: 1.6 }) });
roomShot('s040', { cam: 'buckets', show: [], buckets: 43, at: [-3.4, 0, 1.6], pose: P_POINT, ui: (U, t, info) => U.statement('The floor. It cannot go lower.', { at: 0.3, sub: 'Physics', pos: { x: 760, y: 170, ax: 0.5, ay: 0 } }) });
roomShot('s044', { cam: 'buckets', show: [], buckets: 43, at: [-3.4, 0, 1.6], pose: P_THINK, ui: (U, t, info) => { const st = [['250', 'Two hundred'], ['÷ 5.8', 'five point'], ['÷ 0.25', 'quarter']]; let s = ''; for (const [x, p] of st) if (t >= info.w(p, 1)) s += x + ' '; U.html('calc', `<div style="font:800 76px 'IBM Plex Mono';color:#fff;background:rgba(18,14,11,.8);padding:18px 30px;border-radius:14px">${s}</div>`, { left: '820px', top: '120px' }); } });
roomShot('s045', { cam: 'buckets', show: [], buckets: [43, 172, 'One hundred'], at: [-3.4, 0, 1.6], pose: P_SHRUG, face: 'open', ui: (U, t, info) => U.stat({ value: 172, label: 'litres of water / minute', kicker: 'AT REST', countFrom: 43 }, { style: 'hero', at: 0.2, countDur: 1.4 }) });
roomShot('s046', { cam: 'buckets', show: [], buckets: [172, 308, 'stingy'], at: [-3.4, 0, 1.6], pose: P_SHRUG, face: 'worried', ui: (U, t, info) => U.stat({ value: '300+', label: 'litres at the stingy end', kicker: 'ONE SEVENTH' }, { style: 'plate', at: info.w('more than', 1.5), pos: 'tr' }) });
roomShot('s048', { cam: 'bars', show: [], bars: [140], barAt: ['forty'], at: [2.35, 0, -0.7], ui: (U, t, info) => U.pin(new THREE.Vector3(-1.05, 2.4, 0), '140 L/min · MEN (MEAN MAX)', { style: 'tag', at: 0.5, dir: 'right', leader: 60 }) });
roomShot('s050', { cam: 'bars', show: [], bars: [140, 100], barAt: ['forty', 'Seventy'], at: [2.35, 0, -0.7], ui: (U, t, info) => U.pin(new THREE.Vector3(-0.35, 2.0, 0), '100 L/min · WOMEN (70-120)', { style: 'tag', at: 0.3, dir: 'right', leader: 60 }) });
roomShot('s052', { cam: 'scale', show: ['scale'], crates: 1, at: [1.15, 0, 0.35], ui: (U) => U.title({ title: 'The weight of water', kicker: 'Chapter 3' }, { at: 0.2 }) });
roomShot('s053', { cam: 'scale', show: ['scale'], crates: 6, at: [1.15, 0, 0.35], pose: P_SHRUG, face: 'open', ui: (U, t, info) => U.stat({ value: '~800×', label: 'denser than air', kicker: 'WATER' }, { style: 'plate', at: info.w('eight hundred', 0.8), pos: 'tr' }) });
roomShot('s055', { cam: 'scale', show: ['scale'], crates: 1, at: [1.15, 0, 0.35], pose: P_POINT, ui: (U) => U.stat({ value: '1 kg', label: 'one litre of water' }, { style: 'plate', at: 0.3, pos: 'tr' }) });
roomShot('s056', { cam: 'scale', show: ['scale'], crates: [1, 6, 'hundred and seventy-two kilograms'], at: [1.15, 0, 0.35], pose: P_SHRUG, face: 'worried', ui: (U, t, info) => U.stat({ value: 172, label: 'kg of water through the throat · every minute', countFrom: 1 }, { style: 'plate', at: info.w('hundred and seventy-two kilograms', 2), pos: 'tr', countDur: 1.8 }) });
roomShot('s067', { cam: 'buckets', show: [], buckets: 172, at: [-3.4, 0, 1.6], pose: P_SHRUG, face: 'worried', ui: (U, t, info) => U.stat({ value: 491, label: 'breaths a minute (172 ÷ 0.35)', kicker: 'TIDAL BREATHS', countFrom: 15 }, { style: 'hero', at: info.w('nearly five hundred', 3.5), countDur: 1.6 }) });
roomShot('s070', { cam: 'bars', show: [], bars: [39 * 4], barMax: 200, barAt: ['forty'], at: [2.35, 0, -0.7], pose: P_TIRED_SAFE(), ui: (U, t, info) => U.stat({ value: '~39', label: 'full breaths a minute', kicker: 'BIGGEST BREATH' }, { style: 'plate', at: info.w('forty', 1.2), pos: 'tr' }) });
roomShot('s071', { cam: 'scale', show: ['scale'], crates: 1, at: [1.15, 0, 0.35], pose: P_SHRUG, face: 'worried', ui: (U, t, info) => { U.stat({ value: '4.5 kg', label: 'of lake, every breath' }, { style: 'plate', at: 0.3, pos: 'tr' }); U.statement('Not a pace a person holds.', { at: info.w('Neither', 3.5), pos: { x: 960, y: 900, ax: 0.5, ay: 1 } }); } });
function P_TIRED_SAFE() { return { lean: 18, aL: [8, 2], aR: [8, 2], lL: [8, 10], lR: [8, 10], head: 16 }; }

// ---------------------------------------------------------------- cards
cards({
  s007: { kind: 'hero', kicker: 'Resting adult', value: '250', label: 'millilitres of oxygen / minute', sub: 'standard physiology teaching', who: 'her', face: 'open', pose: 'present', side: 'right' },
  s011: { kind: 'compare', a: { title: '1960s', sub: 'Mice in a tank' }, b: { title: 'Philadelphia', sub: 'Premature babies in hospital' }, times: ['mice', 'Philadelphia'] },
  s013: { kind: 'statement', text: 'What would it cost her, minute by minute?', who: 'her', pose: 'think', face: 'worried', side: 'right' },
  s015: { kind: 'statement', text: 'A calculation, not a prediction.', sub: 'And the unknowns are many.' },
  s017: { kind: 'list', items: ['The number', 'The water', 'The fish', 'The liquid'], numbered: true, times: ['number', 'water', 'fish', 'liquid'], who: 'her', pose: 'present', face: 'smile', side: 'right' },
  s020: { kind: 'source', kicker: 'SOURCE TYPE', title: 'Standard physiology teaching', sub: 'Resting oxygen use of an adult' },
  s021: { kind: 'calc', kicker: 'EXAM-PREP REFERENCE', lines: [['3.5 mL / kg / min', 'three and a half'], ['× 70 kg', 'seventy'], ['= 245 mL / min', 'seventy-kilogram']], result: true },
  s030: { kind: 'statement', text: 'Not much.', sub: 'says the sensor maker', who: 'her', pose: 'shrug', face: 'worried', side: 'right' },
  s031: { kind: 'calc', kicker: 'SENSOR-MAKER WHITE PAPER', lines: [['Air-saturated water', 'air-saturated'], ['at 25 °C', 'twenty-five']] },
  s033: { kind: 'calc', kicker: 'CONVERT', lines: [['8.3 mg / L', 'Convert'], ['→ 5.8 mL / L', 'five point']], result: true },
  s034: { kind: 'source', kicker: 'OUR CONVERSION', title: '8.3 mg ÷ 1.429 mg/mL ≈ 5.8 mL', sub: 'oxygen density at 0 °C, 1 atm (standard value)' },
  s041: { kind: 'source', kicker: 'ARXIV PAPER · LUNG VENTILATION IN MAMMALS', title: 'Exhaled air: 16-18 % oxygen', sub: 'arXiv 2005.12362' },
  s042: { kind: 'bars', title: 'OXYGEN IN THE AIR (%)', bars: [['GOING IN', 21, ' %', 'going in'], ['COMING OUT', 17, ' %', 'drop']], who: 'her', pose: 'point', side: 'right' },
  s043: { kind: 'statement', text: 'A seventh to a quarter.', sub: 'Take the generous end: a quarter · our arithmetic', who: 'her', pose: 'think', side: 'right' },
  s047: { kind: 'source', kicker: 'MONASH UNIVERSITY · PHYSIOLOGY MODULE', title: 'Maximum voluntary ventilation', sub: 'healthy young men: mean about 140 L/min' },
  s049: { kind: 'bars', title: 'MAXIMUM VOLUNTARY VENTILATION (L/min)', bars: [['MEN · MEAN', 140, '', 'Range'], ['MEN · TOP', 180, '', 'hundred and eighty'], ['WOMEN · MEAN', 100, '', 'women']] },
  s051: { kind: 'bars', title: 'LITRES A MINUTE', bars: [['HER NEED · AT REST', 172, '', 'resting need'], ['MAX · YOUNG MEN', 140, '', 'short test']], highlight: 0, who: 'her', pose: 'shrug', face: 'worried', side: 'right' },
  s054: { kind: 'statement', text: '≈ 830 times denser', sub: 'course notes, via a flashcard set' },
  s069: { kind: 'list', kicker: 'Lung volumes', items: [{ title: 'Total lung capacity', sub: 'about 6 litres' }, { title: 'Vital capacity', sub: '4.6-4.8 litres (sources differ)' }], times: ['Total', 'vital'], who: 'her', pose: 'present', side: 'right' },
});

export { torsoShot, roomShot, plate, tag };
