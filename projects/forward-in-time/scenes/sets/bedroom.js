// Set: a bedroom at night: dark blue walls, wood floor, a window with moonlight, a desk lamp glow. Bed/phone/people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('bedroom', async (W) => {
  W.shadowArea([0, 1, 0], 5); W.fogScale(0.1);
  W.add(K.box(8, 0.1, 6, K.mat('#6e4a32', { rough: 0.85 }), [0, -0.05, 0]));
  W.add(K.box(8, 3.2, 0.15, K.mat('#26324f', { rough: 0.9 }), [0, 1.6, -2.4])); W.add(K.box(0.15, 3.2, 6, K.mat('#2b3858', { rough: 0.9 }), [-3.6, 1.6, 0]));
  W.add(K.box(1.4, 1.3, 0.05, K.glowMat('#a8c4ff', 0.8), [1.2, 1.9, -2.3]));
  for (const [w, h, x, y] of [[1.6, 0.08, 1.2, 2.58], [1.6, 0.08, 1.2, 1.22], [0.08, 1.4, 0.44, 1.9], [0.08, 1.4, 1.96, 1.9], [0.06, 1.3, 1.2, 1.9]]) W.add(K.box(w, h, 0.08, K.mat('#e9e4da'), [x, y, -2.28]));
  for (let i = 0; i < 5; i++) W.add(K.box(0.5, 0.7, 0.02, K.mat(['#e2553f', '#e0b44a', '#4f8a5b', '#2f6fdb', '#d9c7b5'][i]), [-2.6 + i * 0.6, 2.0, -2.31]));
  const moon = new THREE.PointLight('#a8c4ff', 14, 8, 1.5); moon.position.set(1.2, 1.9, -1.5); W.add(moon);
  const lamp = new THREE.PointLight('#ffd29a', 10, 5, 1.6); lamp.position.set(-2.0, 1.2, -1.2); W.add(lamp);
  return {};
});
