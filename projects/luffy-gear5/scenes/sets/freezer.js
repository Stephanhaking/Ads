// Set: a frozen-food warehouse: polished concrete floor (y = 0), tall steel racking with stacked boxes along x = +-5,
// a loading ramp at z = -10 rising toward -Z, big strip lights, frost on the walls, a forklift parked at (3, 0, -6).
// Breath, boxes being carried and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
import { flatten } from '../lib/flatten.js';
registerSet('freezer', async (W) => {
  W.shadowArea([0, 0, -4], 16); W.fogScale(0.3);
  W.add(K.box(16, 0.1, 30, K.mat('#b9c2c8', { rough: 0.25 }), [0, -0.05, -6])); W.add(K.box(16, 8, 0.3, K.mat('#dfe8ee', { rough: 0.9 }), [0, 4, -21]));
  for (const x of [-7.5, 7.5]) W.add(K.box(0.3, 8, 30, K.mat('#d6e2ea', { rough: 0.9 }), [x, 4, -6]));
  const steel = K.mat('#2f6fdb', { rough: 0.5 }), box = K.mat('#c8a27a', { rough: 0.9, flat: true });
  for (const x of [-5, 5]) for (let i = 0; i < 6; i++) { W.add(K.box(0.15, 6, 0.15, steel, [x - 1, 3, -18 + i * 4])); W.add(K.box(0.15, 6, 0.15, steel, [x + 1, 3, -18 + i * 4])); for (let lv = 0; lv < 3; lv++) { W.add(K.box(2.2, 0.1, 4, K.mat('#e2703a'), [x, 1 + lv * 2, -16 + i * 4])); W.add(K.box(1.8, 0.8, 3.4, box, [x, 1.45 + lv * 2, -16 + i * 4])); } }
  const ramp = K.box(5, 0.2, 6, K.mat('#8a9096', { rough: 0.6 }), [0, 0.8, -13]); ramp.rotation.x = 0.28; W.add(ramp);
  W.add(K.box(1.2, 1.2, 2.2, K.mat('#f2c230', { rough: 0.5 }), [3, 0.8, -6])); W.add(K.box(0.1, 2.6, 0.1, K.mat('#2a2d33'), [3.5, 1.3, -7]));
  for (let i = 0; i < 6; i++) W.add(K.box(0.4, 0.05, 6, K.glowMat('#eef6ff', 1.5), [0, 7.8, -18 + i * 5]));
  const l = new THREE.PointLight('#e8f2ff', 24, 20, 1.4); l.position.set(0, 7, -6); W.add(l);
  flatten(W);
  return {};
});
