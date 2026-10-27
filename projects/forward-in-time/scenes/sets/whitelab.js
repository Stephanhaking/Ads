// Set: a clean modern physics lab: white walls and floor, long white benches, shelves of equipment boxes, a blue accent
// wall with a laser-table look. Atomic clocks and scientists are 2D. Bench top at y = 0.95 along z = 0.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('whitelab', async (W) => {
  W.shadowArea([0, 1, 0], 7); W.fogScale(0.1);
  W.add(K.box(14, 0.1, 10, K.mat('#e6e9ec', { rough: 0.5 }), [0, -0.05, 0]));
  W.add(K.box(14, 3.6, 0.2, K.mat('#f6f7f8', { rough: 0.8 }), [0, 1.8, -3.6])); W.add(K.box(0.2, 3.6, 10, K.mat('#2f6fdb', { rough: 0.8 }), [-6, 1.8, 1]));
  W.add(K.box(14, 0.1, 10, K.mat('#ffffff', { rough: 0.9 }), [0, 3.6, 1]));
  for (const x of [-3, 0, 3]) W.add(K.box(2.0, 0.04, 0.5, K.glowMat('#ffffff', 1.5), [x, 3.54, 0]));
  const bench = K.mat('#fafafa', { rough: 0.4 }), leg = K.mat('#8a929a', { rough: 0.4, metal: 0.5 });
  W.add(K.box(4.4, 0.06, 1.0, bench, [0, 0.95, 0])); for (const [x, z] of [[-2.1, -0.4], [2.1, -0.4], [-2.1, 0.4], [2.1, 0.4]]) W.add(K.box(0.06, 0.92, 0.06, leg, [x, 0.46, z]));
  W.add(K.box(8, 0.06, 0.9, bench, [0, 0.95, -3.1]));
  for (const y of [1.9, 2.6]) { W.add(K.box(7, 0.05, 0.4, K.mat('#d9dde0'), [0, y, -3.4])); for (let i = 0; i < 9; i++) W.add(K.box(0.5, 0.35, 0.3, K.mat(['#c9ced6', '#2f3e52', '#e0b44a'][i % 3], { rough: 0.5 }), [-3.2 + i * 0.8, y + 0.2, -3.4])); }
  const l = new THREE.PointLight('#ffffff', 24, 10, 1.4); l.position.set(0, 3.2, 1); W.add(l);
  return {};
});
