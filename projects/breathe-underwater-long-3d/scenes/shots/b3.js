// Shots s138-s188: the human case (hospital exterior, cards; no infant imagery), down (depth column), where it stands, ending.
import { registerShot, THREE, ease, clamp, cam } from '/engine/api.js';
import { place, breathe, P_STAND, P_PRESENT, P_THINK, P_SHRUG, P_POINT, P_FLOAT } from '../lib/people.js';
import { cards } from '../lib/cards.js';
import { torsoShot, roomShot, plate } from './b1.js';
import { drawSwimmer } from './s002.js';
import { floatSwimmer } from '../lib/swimmer.js';
const V = (...a) => new THREE.Vector3(...a);

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
wardShot('s138', { ui: (U, t, info) => { U.title({ title: 'The human case', kicker: 'Chapter 7' }, { at: 0.1, out: 1.8 }); U.timeStack({ date: '1989', time: 'Philadelphia', place: 'three very premature babies' }, { at: info.w('Three', 2) }); } });
wardShot('s140', { cam: [{ pos: [2, 1.8, 9], look: [0, 2.6, -2], fov: 36 }, { pos: [1.4, 1.8, 8], look: [0, 2.6, -2], fov: 36 }], ui: (U) => U.pin(V(0, 3.6, -0.8), 'JEFFERSON MEDICAL COLLEGE', { style: 'tag', at: 0.3, dir: 'up', leader: 40 }) });
torsoShot('s144', { saline: true, pose: P_PRESENT, ui: (U, t, info, S) => { U.pin(V(0.05, 2.7, 0), 'LUNGS FILLED WITH LIQUID', { style: 'tag', at: 0.3, dir: 'right', leader: 70, key: 'a' }); U.pin(V(0.05, 3.0, 0), '+ VENTILATOR STILL PUSHES GAS', { style: 'tag', at: info.w('ventilator', 2), dir: 'left', leader: 70, key: 'b' }); } });

// ---------------------------------------------------------------- room (1996 numbers, where it stands)
const R = { at: [2.35, 0, -0.7] };
roomShot('s146', { cam: 'wide', show: ['jars'], ui: (U) => U.title({ title: '1996', kicker: 'The LiquiVent study group' }, { at: 0.1 }) });
roomShot('s148', { cam: 'bars', show: [], bars: [], ...R, pose: P_THINK, ui: (U, t, info) => U.timeStack({ date: 'New England Journal of Medicine', time: 'within an hour', place: 'LiquiVent study group · 1996' }, { at: 0.3 }) });
roomShot('s150', { cam: 'bars', show: [], bars: [138, 61], barMax: 160, barAt: [null, 'Compliance'], ...R, pose: P_POINT, face: 'smile', ui: (U) => { U.pin(V(-1.05, 2.7, 0), '+138 % OXYGEN TENSION', { style: 'tag', at: 0.1, dir: 'right', leader: 50, key: 'a' }); U.pin(V(-0.35, 1.8, 0), '+61 % COMPLIANCE', { style: 'tag', at: 0.6, dir: 'right', leader: 50, key: 'b' }); } });
roomShot('s152', { cam: 'wide', show: ['jars'], pose: P_SHRUG, face: 'smile', ui: (U, t, info) => U.stat({ value: 'Best result', label: 'in this film', kicker: 'NEJM 1996' }, { style: 'plate', at: 0.3, pos: 'tl' }) });
roomShot('s154', { cam: 'wide', show: ['jars'], pose: P_THINK, ui: (U, t, info) => U.compare({ a: { title: 'A ward', sub: 'premature lungs' }, b: { title: 'A lake', sub: 'an adult swimmer' } }, { times: [0.3, info.w('adult', 1.6)], pos: 'tl' }) });
roomShot('s156', { cam: 'jars', show: ['jars'], pose: P_THINK, face: 'worried', ui: (U, t, info) => { U.statement('Not established.', { at: 0.3, out: info.w('Now take her down', 4.6) - 0.3, sub: 'a healthy adult, breathing liquid for hours', pos: { x: 900, y: 150, ax: 0.5, ay: 0 } }); U.title({ title: 'Down', kicker: 'Chapter 8' }, { at: info.w('Now take her down', 4.6) }); } });
roomShot('s166', { cam: 'wide', show: [], pose: P_PRESENT, ui: (U, t, info) => { U.stat({ value: '~10 m/min', label: 'ascent, or slower', kicker: 'STANDARD ADVICE' }, { style: 'plate', at: 0.3, pos: 'tl', key: 'a' }); U.stat({ value: 'O2', label: 'dive rules cap its pressure', kicker: 'THE THIRD PROBLEM' }, { style: 'plate', at: info.w('Oxygen', 4.5), pos: 'tr', key: 'b' }); } });
roomShot('s168', { cam: 'bars', show: [], bars: [140], barMax: 160, barAt: ['one point four'], ...R, ui: (U, t, info) => U.pin(V(-1.05, 2.5, 0), '1.4 ATA · NITROX LIMIT (EPA REGION 10)', { style: 'tag', at: info.w('one point four', 3), dir: 'right', leader: 50 }) });
roomShot('s175', { cam: 'wide', show: ['jars'], push: 0.04, pose: P_PRESENT, ui: (U, t, info) => { U.title({ title: 'Where it stands', kicker: 'Monday 26 October 2026' }, { at: 0.2 }); } });
roomShot('s177', { cam: 'jars', show: ['jars'], ui: (U) => U.stat({ value: 250, label: 'mL of oxygen / minute · resting adult', kicker: 'KNOWN' }, { style: 'plate', at: 0.2, pos: 'tl' }) });
roomShot('s179', { cam: 'buckets', show: [], buckets: 54, at: [-3.4, 0, 1.6], pose: P_POINT, ui: (U, t, info) => { U.stat({ value: 54, label: 'L/min · fish-like extraction', kicker: 'KNOWN' }, { style: 'plate', at: 0.2, pos: 'tr', key: 'a' }); U.stat({ value: 'Mice · rats', label: 'have breathed liquid', kicker: 'KNOWN' }, { style: 'plate', at: info.w('Mice', 3), pos: 'tl', key: 'b' }); } });
roomShot('s181', { cam: 'jars', show: ['jars'], pose: P_THINK, face: 'worried', ui: (U) => U.statement('A healthy adult, for hours?', { at: 0.2, sub: 'NOT KNOWN', pos: { x: 900, y: 150, ax: 0.5, ay: 0 } }) });
roomShot('s183', { cam: 'wide', show: ['jars'], pose: P_SHRUG, face: 'worried', ui: (U, t, info) => { U.statement('Pressure on a water breather?', { at: 0.2, sub: 'NOT KNOWN', pos: { x: 900, y: 150, ax: 0.5, ay: 0 } }); } });
roomShot('s185', { cam: 'wide', show: ['jars'], push: -0.05, pose: P_STAND, face: 'smile', ui: (U, t, info) => U.statement('A calculation. Not a finding.', { at: info.w('This is a calculation', 2), pos: { x: 900, y: 150, ax: 0.5, ay: 0 } }) });

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
depthShot('s157', { d: [0, 10], ui: (U, t, info) => U.statement('+1 atmosphere every 10 m', { at: info.w('one atmosphere', 1), pos: { x: 960, y: 900, ax: 0.5, ay: 1 } }) });
depthShot('s158', { d: [10, 20] });
depthShot('s159', { d: [20, 30], face: 'neutral', ui: (U, t, info) => U.stat({ value: '4 atm', label: 'at 30 m · our sum', kicker: 'TOTAL' }, { style: 'plate', at: info.w('four atmospheres', 1.5), pos: 'tl', key: 'b' }) });
depthShot('s160', { d: 30, who: 'diver', pose: P_STAND, face: 'neutral', ui: (U, t, info) => U.list({ kicker: 'On air at depth', items: [{ title: 'The gas itself' }, { title: 'The bends' }], numbered: true }, { times: [info.w('gas itself', 2.6), 99], pos: 'tl' }) });
depthShot('s162', { d: 30, who: 'diver', pose: P_STAND, face: 'worried', camZ: 4.2, ui: (U) => U.title({ title: 'The bends', kicker: 'Problem two' }, { at: 0.1 }) });
depthShot('s163', { d: 30, who: 'diver', pose: P_STAND, face: 'neutral', camZ: 4.4, extra: dots('n2'), ui: (U) => U.statement('More nitrogen into the blood', { at: 0.3, pos: { x: 960, y: 900, ax: 0.5, ay: 1 } }) });
depthShot('s164', { d: [30, 8], who: 'diver', pose: P_SHRUG, face: 'worried', camZ: 4.6, extra: dots('bubbles'), ui: (U, t, info) => U.statement('Too fast: bubbles. Joint pain.', { at: info.w('bubbles', 1.5), pos: { x: 960, y: 900, ax: 0.5, ay: 1 } }) });
depthShot('s170', { d: [30, 60], who: 'diver', pose: P_STAND, face: 'neutral', ui: (U, t, info) => U.statement('≈ 60 m on air: the oxygen limit', { at: info.w('sixty', 1), sub: 'our arithmetic', pos: { x: 960, y: 900, ax: 0.5, ay: 1 } }) });
depthShot('s171', { d: 30, face: 'open', ui: (U, t, info) => U.statement('But she is not breathing air.', { at: info.w('But she', 3), pos: { x: 960, y: 900, ax: 0.5, ay: 1 } }) });
depthShot('s172', { d: 30, face: 'worried', camZ: 4.4, pose: P_THINK, ui: (U) => U.title({ title: 'Pressure?', kicker: 'On a water breather' }, { at: 0.2 }) });
depthShot('s173', { d: [30, 12], face: 'worried', camZ: 4.6, extra: dots('bubbles'), ui: (U, t, info) => U.list({ kicker: 'Open questions', items: [{ title: 'Nitrogen into her blood?' }, { title: 'Bubbles on the way up?' }] }, { times: [0.3, info.w('bubble', 2)], pos: 'tl' }) });

// ---------------------------------------------------------------- ending on the lake
function lakeEnd(id, o) {
  registerShot(id, { set: 'lake', look: { base: 'dusk', fog: { color: '#2c5560', density: 0.012 } },
    update(W, S, t, info) { floatSwimmer(S.sw, [-5, -3.1, 4, 0.5], info.start + t); S.sw.visible = false; S.pierFolk.forEach((m) => (m.visible = false)); S.ring.visible = false;
      cam.dolly(W.camera, t, [[0, o.cam[0]], [info.dur, o.cam[1], ease.inOut]]); },
    ui(U, t, info, S, st) { drawSwimmer(U, S, st, info.start + t); o.ui?.(U, t, info); } });
}
lakeEnd('s186', { cam: [{ pos: [8, 3.0, 18], look: [-9, 0.4, 1], fov: 38 }, { pos: [-0.5, -1.9, 10.5], look: [-5.5, -2.2, 4], fov: 40 }] });
lakeEnd('s187', { cam: [{ pos: [-1.5, -2.2, 8.5], look: [-5, -2.4, 4], fov: 38 }, { pos: [-2.3, -2.2, 7.6], look: [-5, -2.4, 4], fov: 38 }], ui: (U) => U.stat({ value: '6 L/min', label: 'of air', kicker: 'ON LAND' }, { style: 'plate', at: 0.2, pos: 'tl' }) });
lakeEnd('s188', { cam: [{ pos: [-2.3, -2.2, 7.6], look: [-5, -2.4, 4], fov: 38 }, { pos: [6, 2.8, 16], look: [-8, 0.6, 1], fov: 38 }], ui: (U, t, info) => { U.stat({ value: '172 L/min', label: 'of water', kicker: 'UNDER WATER' }, { style: 'plate', at: 0.1, pos: 'tl', out: 3.2 }); U.statement('The lungs were built for the first.', { at: info.w('The lungs', 2.5), pos: { x: 960, y: 900, ax: 0.5, ay: 1 } }); } });

// ---------------------------------------------------------------- cards
cards({
  s139: { kind: 'list', kicker: 'Weeks of gestation', items: ['28', '24', '23'], times: ['Twenty-eight', 'twenty-four', 'twenty-three'] },
  s141: { kind: 'source', kicker: 'J PEDIATR 1990;117:106-111', title: 'Liquid ventilation of human preterm neonates', sub: 'Greenspan et al.' },
  s142: { kind: 'stat', kicker: 'A REVIEW REPORTS', value: 'Improved', label: 'lung compliance', who: 'doctor', pose: 'present', side: 'right' },
  s143: { kind: 'statement', text: 'Partial liquid ventilation.', sub: 'J Pediatr, 1990', who: 'doctor', pose: 'point', side: 'right' },
  s145: { kind: 'statement', text: 'Not liquid alone.' },
  s147: { kind: 'stat', kicker: 'LIQUIVENT STUDY GROUP', value: 13, label: 'infants with severe respiratory distress', who: 'doctor', pose: 'present', side: 'right' },
  s149: { kind: 'bars', title: 'WITHIN AN HOUR (NEJM 1996)', bars: [['ARTERIAL O2 TENSION', 138, ' %', 'hundred and thirty-eight', '+138 %']], max: 160 },
  s151: { kind: 'statement', text: 'No adverse events clearly attributable.', sub: 'NEJM 1996', who: 'doctor', pose: 'present', face: 'smile', side: 'right' },
  s153: { kind: 'source', kicker: 'THE FOOTNOTE · A REVIEW', title: 'Other trials failed to show less illness', sub: 'partial liquid ventilation in acute respiratory failure' },
  s155: { kind: 'statement', text: 'Not a healthy lung. Not open water.', who: 'her', pose: 'think', face: 'worried', side: 'right' },
  s161: { kind: 'source', kicker: 'DIVING TRAINING ARTICLE (TDI/SDI)', title: 'Inert-gas narcosis', sub: 'second only to oxygen toxicity in hazard for an air diver', who: 'diver', pose: 'present', side: 'right' },
  s165: { kind: 'list', kicker: 'In severe cases', items: ['Stroke', 'Paralysis'], times: ['stroke', 'paralysis'] },
  s167: { kind: 'title', kicker: 'Regional dive plan', text: 'U.S. EPA' },
  s169: { kind: 'calc', kicker: 'A QUOTED NOAA MANUAL: 1.6', lines: [['air: 21 % oxygen', 'twenty-one'], ['× pressure', 'Multiply'], ['limit 1.4-1.6 atm', 'pressure']], result: true },
  s174: { kind: 'statement', text: 'Not published, as far as we could find.', sub: 'unclear what the answer would be', who: 'her', pose: 'shrug', face: 'worried', side: 'right' },
  s176: { kind: 'stat', kicker: 'KNOWN', value: '36×', label: 'less oxygen in water than in air', who: 'her', pose: 'present', side: 'right' },
  s178: { kind: 'stat', kicker: 'KNOWN', value: '172 L', label: 'water a minute · nearly 500 breaths', who: 'her', pose: 'shrug', face: 'worried', side: 'right' },
  s180: { kind: 'list', kicker: 'Known · then not known', items: [{ title: 'Premature infants', sub: 'partial liquid ventilation' }, { title: 'What is not known' }], times: ['Premature', 'not known'], who: 'her', pose: 'think', side: 'right' },
  s182: { kind: 'statement', text: 'How much could a human lung extract?', sub: 'NOT KNOWN', who: 'her', pose: 'think', face: 'worried', side: 'right' },
  s184: { kind: 'list', kicker: 'Where the answers sit', items: ['Kylstra and Clark papers', 'The Greenspan paper', 'The LiquiVent trial', 'Gill physiology textbooks'], times: ['Kylstra', 'Greenspan', 'LiquiVent', 'Textbooks'] },
});
