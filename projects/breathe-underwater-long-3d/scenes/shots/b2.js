// Shots s072-s137: what happens today (drowning, schematic only), the fish, the second way (liquid; 1960s lab), the third way (cold).
import { registerShot, THREE, ease, clamp, cam } from '/engine/api.js';
import { place, breathe, P_STAND, P_PRESENT, P_THINK, P_SHRUG, P_POINT, P_SHIVER } from '../lib/people.js';
import { cards } from '../lib/cards.js';
import { torsoShot, roomShot, plate, tag } from './b1.js';
import { floatSwimmer } from '../lib/swimmer.js';
const V = (...a) => new THREE.Vector3(...a);

// ---------------------------------------------------------------- torso (schematic, no victim shown)
torsoShot('s074', { target: [0, 2.7, 0], r: [3.6, 3.2], h: [2.9, 2.8], pose: P_THINK, face: 'worried', ui: (U, t, info, S) => { U.ring(V(0, 2.95, 0), { r: 40, color: '#e2553f', at: info.w('clamps', 1.5) }); tag(U, S, 'lg', [0.05, 2.95, 0], 'THROAT CLAMPS SHUT', info.w('clamps', 1.5), 'laryngospasm'); } });
torsoShot('s075', { target: [0, 2.4, 0], r: [4.4, 4.0], h: [2.7, 2.6], who: false, ui: (U, t, info, S) => { U.ring(V(0, 2.95, 0), { r: 40, color: '#e2553f', at: 0.1 }); tag(U, S, 'cl', [0.05, 2.95, 0], 'AIRWAY CLOSED · LITTLE WATER IN', 0.4); } });
torsoShot('s077', { saline: false, glow: 'relaxes', face: 'worried', ui: (U, t, info, S) => tag(U, S, 'op', [0.05, 2.8, 0], 'THROAT RELAXES · WATER GOES IN', info.w('relaxes', 1)) });
torsoShot('s079', { target: [0.9, 1.5, 0], r: [3.4, 3.0], h: [1.9, 1.8], who: false, ui: (U, t, info, S) => tag(U, S, 'dm', [1.0, 1.7, 0.2], 'BUT IT DOES DAMAGE', 0.2) });
torsoShot('s080', { target: [0.9, 1.5, 0], r: [4.4, 3.6], h: [2.0, 1.9], collapse: 'collapse', face: 'worried', ui: (U, t, info, S) => { tag(U, S, 'sf', [1.0, 1.75, 0.2], 'SURFACTANT', info.w('surfactant', 1.5), 'a thin film that keeps the sacs open'); } });
torsoShot('s081', { target: [0.9, 1.5, 0], r: [3.6, 3.4], h: [1.9, 1.9], collapsed: true, who: false, ui: (U, t, info, S) => tag(U, S, 'nx', [1.0, 1.6, 0.2], 'OXYGEN CAN NO LONGER CROSS', 0.2) });
torsoShot('s099', { glow: 'dead-end', pose: P_POINT, ui: (U, t, info, S) => tag(U, S, 'de', [0.05, 2.6, 0], 'A DEAD-END SAC', info.w('dead-end', 1)) });
torsoShot('s100', { glow: 'same', who: false, ui: (U, t, info, S) => tag(U, S, 'sp', [0.05, 2.6, 0], 'SAME PIPE IN · SAME PIPE OUT', 0.2) });
torsoShot('s101', { pose: P_SHRUG, face: 'smile', ui: (U, t, info) => U.compare({ a: { title: 'Lung', sub: 'tidal · dead end' }, b: { title: 'Gills', sub: 'one-way · better extraction' } }, { times: [info.w('Change her', 2), info.w('gills', 3.5)], pos: 'tl' }) });
torsoShot('s113', { saline: true, pose: P_THINK, ui: (U, t, info, S) => tag(U, S, 'or', [0.05, 2.6, 0], 'SALINE-FILLED LUNG · OUR READING', info.w('Our reading', 2)) });
torsoShot('s126', { pose: P_SHIVER, face: 'worried', ui: (U, t, info) => { U.title({ title: 'The third way', kicker: 'Chapter 6' }, { at: 0.2, out: 2.6 }); plate(U, 'colder', 'lower breathing rate', info.w('lowered', 3.5), { kicker: 'IN THE ANIMALS' }); } });
torsoShot('s128', { face: 'smile', ui: (U, t, info) => { const k = clamp((t - info.w('fall', 2)) / 2); plate(U, Math.round(250 - 100 * k), 'mL of oxygen / minute', 0.2, { kicker: 'IF DEMAND FELL' }); } });

// ---------------------------------------------------------------- room
roomShot('s083', { cam: 'wide', show: ['jars'], pose: P_SHRUG, ui: (U, t, info) => U.statement('Fresh or salt: a minor difference.', { at: 0.3, pos: { x: 960, y: 150, ax: 0.5, ay: 0 } }) });
roomShot('s085', { cam: 'wide', show: ['jars'], pose: P_PRESENT, ui: (U, t, info) => U.list({ kicker: 'She would need', items: [{ title: 'A way to avoid the damage' }, { title: 'A way to move far more water' }], numbered: true }, { times: [info.w('avoid', 2.5), 4.4], pos: 'tl' }) });
roomShot('s086', { cam: 'buckets', show: [], buckets: 172, at: [-3.4, 0, 1.6], pose: P_POINT, ui: (U, t, info) => U.title({ title: 'The fish', kicker: 'Chapter 4' }, { at: info.w('Fish', 4.5) }) });
roomShot('s092', { cam: 'bars', show: [], bars: [85, 80], barMax: 100, barAt: [null, 'eighty'], at: [2.35, 0, -0.7], ui: (U) => U.pin(V(-0.35, 2.5, 0), '80 % · SCHOOL RESOURCE', { style: 'tag', at: 0.3, dir: 'right', leader: 60 }) });
roomShot('s094', { cam: 'bars', show: [], bars: [85, 80, 70, 90], barMax: 100, barAt: [null, null, null, 'ninety'], at: [2.35, 0, -0.7], pose: P_POINT, face: 'smile', ui: (U, t, info) => U.pin(V(-0.35, 2.5, 0), 'TAKE EIGHTY', { style: 'tag', at: info.w('Take eighty', 2.8), dir: 'right', leader: 60 }) });
roomShot('s095', { cam: 'buckets', show: [], buckets: [172, 54, 'fifty-four'], at: [-3.4, 0, 1.6], pose: P_SHRUG, face: 'smile', ui: (U, t, info) => U.stat({ value: 54, label: 'litres / minute with fish-like extraction (250 ÷ 5.8 ÷ 0.8)', kicker: 'AT 80 %', countFrom: 172 }, { style: 'plate', at: info.w('fifty-four', 4.5), pos: 'tr', countDur: 1.4 }) });

// ---------------------------------------------------------------- gill
function gillShot(id, o) {
  registerShot(id, { set: 'gill', look: 'studio', badge: 'SIMULATION',
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
    },
    ui(U, t, info, S, st) { o.ui?.(U, t, info, S, st); } });
}
const ARCH = { pos: [0.2, 1.4, 4.6], look: [0, 0.7, 0.8], fov: 34 };
gillShot('s087', { ui: (U, t, info) => U.list({ kicker: 'Two tricks', items: [{ title: 'One: opposed flow' }, { title: 'Two: one-way water' }], numbered: false }, { times: [info.w('One', 1.4), 99], pos: 'tl' }) });
gillShot('s088', { arch: true, cam: ARCH, ui: (U, t, info) => { U.pin(V(-0.4, 0.35, 1.0), 'WATER →', { style: 'tag', at: 0.4, dir: 'left', leader: 50, key: 'w' }); U.pin(V(0.5, 0.3, 0.85), '← BLOOD', { style: 'tag', at: 0.9, dir: 'right', leader: 50, key: 'b' }); } });
gillShot('s089', { arch: true, cam: { pos: [-0.6, 1.1, 3.4], look: [0, 0.6, 0.9], fov: 34 }, ui: (U, t, info) => U.statement('Richest blood meets richest water.', { at: 0.4, pos: { x: 960, y: 140, ax: 0.5, ay: 0 } }) });
gillShot('s090', { arch: true, cam: ARCH, ui: (U, t, info) => U.pin(V(0, 0.95, 0.9), 'SOURCES DIFFER: 70-90 %', { style: 'tag', at: info.w('Sources differ', 3.6), dir: 'right', leader: 60 }) });
gillShot('s096', { path: true, cam: { pos: [1.6, 1.4, 2.6], look: [0.6, 0.75, 0], fov: 34 }, ui: (U, t, info) => U.pin(V(1.3, 0.85, 0), 'ONE WAY', { style: 'tag', at: info.w('one way', 2.8), dir: 'right', leader: 60 }) });
gillShot('s097', { path: true, cam: { pos: [1.2, 1.6, 2.2], look: [0.5, 0.75, 0.2], fov: 36 }, ui: (U, t, info) => { U.pin(V(1.4, 0.8, 0), 'IN THE MOUTH', { style: 'tag', at: 0.3, dir: 'up', leader: 40, key: 'a' }); U.pin(V(0.35, 0.72, 0.7), 'OUT THE SIDE', { style: 'tag', at: info.w('out the side', 1.8), dir: 'right', leader: 50, key: 'b' }); U.statement('No dead space.', { at: info.w('No dead space', 3), pos: { x: 960, y: 900, ax: 0.5, ay: 1 } }); } });
gillShot('s112', { arch: true, cam: ARCH, ui: (U, t, info) => U.pin(V(0.3, 0.2, 1.0), 'CO2 LEAVES EASILY', { style: 'tag', at: 0.4, dir: 'right', leader: 60 }) });

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
    },
    ui(U, t, info, S, st) {
      for (const [k, who, at, pose, face, flip] of o.people || []) place(U, st, k, at, 1.75, pose, who, { face, flip, rim: '#fff1d6', look: flip ? -0.6 : 0.6 });
      o.ui?.(U, t, info, S, st);
    } });
}
const SCI = [['sciA', 'scientist', [-2.0, 0, -0.7], P_POINT, 'neutral', false], ['sciB', 'scientist', [2.3, 0, -0.6], P_THINK, 'neutral', true]];
labShot('s105', { cam: 'wide', people: SCI, ui: (U, t, info) => U.timeStack({ date: 'Early 1960s', time: 'Duke University', place: 'per a Gizmodo history' }, { at: 0.4 }) });
labShot('s106', { cam: 'chamber', atm: [0, 160, 'hundred and sixty'], ui: (U, t, info, S) => U.pin(S.dial.getWorldPosition(V()), '160 ATMOSPHERES', { style: 'tag', at: info.w('hundred and sixty', 4), dir: 'right', leader: 60 }) });
labShot('s107', { cam: 'tank', noMice: true, dim: true, co2: 'Carbon', atm: 160, ui: (U, t, info) => U.statement('Carbon dioxide had built up.', { at: info.w('Carbon', 1.6), pos: { x: 960, y: 140, ax: 0.5, ay: 0 } }) });
labShot('s109', { cam: 'tank', o2: true, atm: 160, ui: (U) => U.pin(V(0.2, 1.75, -1.5), 'ENOUGH OXYGEN', { style: 'tag', at: 0.2, dir: 'right', leader: 60 }) });
labShot('s110', { cam: 'tank', co2: 'did not', atm: 160, ui: (U, t, info) => U.pin(V(0.2, 1.5, -1.3), 'CO2 NOT CLEARED', { style: 'tag', at: info.w('carbon', 1), dir: 'right', leader: 60 }) });
labShot('s115', { cam: 'flasks', people: [['sciB', 'scientist', [3.0, 0, -0.4], P_PRESENT, 'smile', true]], ui: (U, t, info) => { U.timeStack({ date: 'Mid-1960s', time: 'Clark and Gollan', place: 'per a Gizmodo history' }, { at: 0.4 }); U.pin(V(2.2, 1.6, -1.6), 'PERFLUOROCARBON', { style: 'tag', at: info.w('perfluorocarbon', 5), dir: 'left', leader: 60 }); } });
labShot('s116', { cam: 'flasks', o2: true, ui: (U) => U.pin(V(2.2, 1.55, -1.6), 'DISSOLVES BOTH GASES', { style: 'tag', at: 0.3, dir: 'left', leader: 60 }) });
labShot('s117', { cam: 'tank', pfc: true, atm: 1, ui: (U, t, info) => U.pin(V(0.2, 1.75, -1.5), 'NORMAL PRESSURE · 1 ATM', { style: 'tag', at: 0.4, dir: 'right', leader: 60 }) });
labShot('s120', { cam: 'thermo', pfc: true, cold: 'colder', ui: (U, t, info) => plate(U, 'colder', 'liquid → lower breathing rate', info.w('lower', 1.8), { kicker: 'ENCYCLOPEDIA MIRROR' }) });
labShot('s122', { cam: 'flasks', pfc: true, ui: (U, t, info) => U.pin(V(2.2, 1.6, -1.6), 'DENSER · MORE VISCOUS THAN AIR', { style: 'tag', at: 0.4, dir: 'left', leader: 60 }) });
labShot('s124', { cam: 'lungs', lungs: true, people: [['sciA', 'scientist', [-2.2, 0, -0.2], P_POINT, 'neutral', false]], ui: (U, t, info) => { U.pin(V(0.2, 1.1, -1.1), 'MOUSE LUNG', { style: 'tag', at: info.w('tiny', 0.8), dir: 'right', leader: 60, key: 'a' }); U.pin(V(-1.2, 1.9, -1.1), 'ADULT LUNG', { style: 'tag', at: info.w('volume', 3), dir: 'left', leader: 60, key: 'b' }); } });

// ---------------------------------------------------------------- the cold (overcast lake, at the surface)
function coldShot(id, o) {
  registerShot(id, { set: 'lake', look: 'overcast',
    update(W, S, t, info) { floatSwimmer(S.sw, [-5, -3.1, 4, 0.5], info.start + t); S.sw.visible = false; S.pierFolk.forEach((m) => (m.visible = false));
      const c = o.cam; cam.dolly(W.camera, t, [[0, c[0]], [info.dur, c[1], ease.inOut]]); cam.handheld(W.camera, t, 0.01, 4); },
    ui(U, t, info, S, st) { const shake = o.shiver ? Math.sin((info.start + t) * 40) * 2 : 0;
      place(U, st, 'her', [-5 + shake * 0.003, -1.35, 4], 1.7, o.pose || P_SHIVER, 'her', { face: o.face || 'worried', rim: '#dfe8ee', look: -0.3 });
      o.ui?.(U, t, info, S, st); } });
}
const SURF = [{ pos: [-1.2, 0.35, 9.2], look: [-5, 0.1, 4], fov: 36 }, { pos: [-2.2, 0.3, 7.6], look: [-5, 0.1, 4], fov: 36 }];
coldShot('s129', { cam: SURF, shiver: true, ui: (U) => U.statement('For a human, the cold is not kind.', { at: 0.3, pos: { x: 960, y: 140, ax: 0.5, ay: 0 } }) });
coldShot('s132', { cam: [{ pos: [-2.6, 0.3, 6.4], look: [-5, 0.2, 4], fov: 34 }, { pos: [-3.3, 0.3, 5.6], look: [-5, 0.25, 4], fov: 34 }], pose: P_SHRUG, face: 'open', ui: (U, t, info) => U.pin(V(-5, 0.6, 4), 'COLD SHOCK · A GASP', { style: 'tag', at: info.w('cold shock', 2.5), dir: 'right', leader: 70 }) });
coldShot('s136', { cam: [{ pos: [-2.4, 0.4, 7.2], look: [-5, 0.1, 4], fov: 34 }, { pos: [0, 3.5, 11], look: [-5, 0, 4], fov: 38 }], shiver: true, ui: (U) => U.statement('Not for long.', { at: 2.5, pos: { x: 960, y: 140, ax: 0.5, ay: 0 } }) });

// ---------------------------------------------------------------- cards
cards({
  s072: { kind: 'title', kicker: 'Chapter 3b · This film is hypothetical', text: 'What happens today' },
  s073: { kind: 'source', kicker: 'CLINICAL UPDATE ON DROWNING', title: 'Two paths when water is inhaled', sub: 'Relias / clinical reviews' },
  s076: { kind: 'bars', title: 'THROAT CLAMPS SHUT (% OF VICTIMS)', bars: [['ONE SOURCE', 20, ' %', 'Another', '10-20 %'], ['ANOTHER', 15, ' %', 'under', '< 10-15 %']] },
  s078: { kind: 'stat', kicker: 'TYPICALLY ASPIRATED', value: '2-4', label: 'millilitres per kilogram', sub: 'clinical reviews', who: 'doctor', pose: 'present', side: 'right' },
  s082: { kind: 'compare', a: { title: 'Fresh water', sub: 'older teaching: one injury' }, b: { title: 'Salt water', sub: 'older teaching: another' }, times: ['fresh', 'salt'] },
  s084: { kind: 'list', kicker: 'The chain', items: ['Collapse', 'Falling oxygen', 'Rising carbon dioxide', 'The heart'], numbered: true, times: ['Collapse', 'falling', 'rising', 'heart'] },
  s091: { kind: 'bars', title: 'OXYGEN EXTRACTED BY GILLS', bars: [['TEXTBOOK', 85, ' %', 'eighty-five']], max: 100 },
  s093: { kind: 'bars', title: 'OXYGEN EXTRACTED BY GILLS', bars: [['TEXTBOOK', 85, ' %', null], ['SCHOOL', 80, ' %', null], ['NHM LONDON', 70, ' %', 'seventy']], max: 100 },
  s098: { kind: 'source', kicker: 'ANIMAL-PHYSIOLOGY TEXT', title: 'One-way flow cuts the cost of moving water', sub: 'continuous, unidirectional flow past the gills', who: 'her', pose: 'point', side: 'right' },
  s102: { kind: 'statement', text: 'A different animal.', sub: 'A far better extraction', who: 'her', pose: 'shrug', face: 'smile', side: 'right' },
  s103: { kind: 'statement', text: 'Not a lung anymore.', sub: 'Nothing here says it is impossible' },
  s104: { kind: 'statement', text: 'Not known.', sub: 'Whether any human body could be rebuilt that way', who: 'her', pose: 'think', face: 'worried', side: 'right' },
  s108: { kind: 'compare', a: { title: 'Minutes', sub: 'Gizmodo history' }, b: { title: 'Up to about an hour', sub: 'another account · rodents and dogs' }, times: ['minutes', 'hour'] },
  s111: { kind: 'source', kicker: 'FAO FISHERIES MANUAL', title: 'CO2 is far more soluble in water than oxygen', sub: 'one volume of CO2 dissolves in an equal volume of water' },
  s114: { kind: 'statement', text: 'The sources do not test that.', sub: 'our reading: the same dead-end sac, a liquid that barely moves' },
  s118: { kind: 'list', kicker: 'Per the Gizmodo history', items: [{ title: 'Rats', sub: 'up to 20 hours' }, { title: 'Cats', sub: 'weeks' }], times: ['Rats', 'Cats'], who: 'scientist', pose: 'present', side: 'right' },
  s119: { kind: 'source', kicker: 'OLDER ENCYCLOPEDIA MIRROR', title: 'One detail that matters', sub: 'secondary source' },
  s121: { kind: 'statement', text: 'The third way.', sub: 'First, the cost', who: 'her', pose: 'present', face: 'smile', side: 'right' },
  s123: { kind: 'statement', text: 'Mice are not people.', sub: 'PFC raises the effort of breathing · Wikipedia, liquid breathing' },
  s125: { kind: 'statement', text: 'Not shown at adult size.', sub: 'the sources here do not say', who: 'her', pose: 'shrug', face: 'worried', side: 'right' },
  s127: { kind: 'calc', kicker: 'DEMAND', lines: [['less oxygen needed', 'Demand'], ['→ fewer litres', 'sum']], result: true },
  s130: { kind: 'stat', kicker: 'BOATING-SAFETY GUIDE', value: '25×', label: 'faster heat loss in water than in air', sub: 'same temperature' },
  s131: { kind: 'bars', title: 'HOW MUCH FASTER (SOURCES DIFFER)', bars: [['NY STATE', 4, '×', 'four'], ['INSURER', 20, '×', 'twenty'], ['GUIDE', 25, '×', null], ['SAR TASK FORCE', 32, '×', 'thirty-two']], max: 32 },
  s133: { kind: 'source', kicker: 'BOATING GUIDE', title: 'Water inhaled in the gasp', sub: 'can cause unconsciousness within minutes', who: 'her', pose: 'shrug', face: 'worried', side: 'right' },
  s134: { kind: 'source', kicker: 'NEW YORK STATE BOATING GUIDE', title: 'Hands and legs go numb within minutes', sub: 'hypothermia comes later' },
  s135: { kind: 'stat', kicker: 'ONE EXPERT AVERAGE', value: '~1 hour', label: 'to hypothermia', sub: 'depends on temperature, clothing, body type' },
  s137: { kind: 'statement', text: 'Not shown.', sub: 'whether a human could be chilled safely while breathing liquid', who: 'her', pose: 'think', face: 'worried', side: 'right' },
});
