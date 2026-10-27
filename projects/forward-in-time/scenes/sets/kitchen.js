// Set: a bright family kitchen by day: checker floor, counters and wall cabinets, a fridge, a window over the sink, and a
// kitchen island at the centre (top at y = 0.95). Food, notebooks and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('kitchen', async (W) => {
  W.shadowArea([0, 1, 0], 7); W.fogScale(0.1);
  const chk = K.canvasTex(256, 256, (g, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#2f3e52' : '#eef0f2'; g.fillRect(i * 64, j * 64, 64, 64); } }, { repeat: [6, 5] });
  W.add(K.box(14, 0.1, 10, K.mat('#ffffff', { map: chk, rough: 0.5 }), [0, -0.05, 0]));
  W.add(K.box(14, 3.4, 0.2, K.mat('#f3e3b8', { rough: 0.9 }), [0, 1.7, -3.6])); W.add(K.box(0.2, 3.4, 10, K.mat('#f6ead0', { rough: 0.9 }), [-6, 1.7, 1]));
  W.add(K.box(14, 0.1, 10, K.mat('#fbf8f0', { rough: 0.9 }), [0, 3.4, 1]));
  const cab = K.mat('#4f8a7b', { rough: 0.6 }), top = K.mat('#e9e4da', { rough: 0.4 });
  W.add(K.box(9, 0.9, 0.7, cab, [-0.5, 0.45, -3.15])); W.add(K.box(9.1, 0.06, 0.75, top, [-0.5, 0.93, -3.12]));
  for (let i = 0; i < 6; i++) W.add(K.box(0.02, 0.8, 0.02, K.mat('#2f5a50'), [-4.5 + i * 1.5, 0.45, -2.79]));
  W.add(K.box(9, 0.8, 0.4, cab, [-0.5, 2.5, -3.3]));
  W.add(K.box(1.8, 1.1, 0.05, K.glowMat('#dff1ff', 1.3), [1.6, 1.75, -3.49]));
  W.add(K.box(1.0, 2.1, 0.8, K.mat('#dfe4e8', { rough: 0.3, metal: 0.2 }), [4.6, 1.05, -3.0]));
  W.add(K.box(4.6, 2.6, 0.05, K.mat('#f7d36b', { rough: 0.8 }), [-3.2, 1.75, -3.47]));
  // island
  W.add(K.box(3.0, 0.9, 1.2, K.mat('#c9744a', { rough: 0.7 }), [0, 0.45, 0])); W.add(K.box(3.2, 0.06, 1.35, K.mat('#f4f1ea', { rough: 0.35 }), [0, 0.95, 0]));
  for (const x of [-0.9, 0.9]) { W.add(K.cyl(0.18, 0.18, 0.06, K.mat('#2f3e52'), [x, 0.7, 0.95], null, 18)); W.add(K.cyl(0.03, 0.03, 0.68, K.mat('#2f3e52'), [x, 0.34, 0.95], null, 8)); }
  const l = new THREE.PointLight('#fff4dc', 26, 10, 1.4); l.position.set(0, 3.0, 0.8); W.add(l);
  return {};
});
