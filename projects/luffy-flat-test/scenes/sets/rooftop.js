// Set: a city rooftop in a thunderstorm at night: flat gravel roof (y = 0) with a low parapet, air-conditioning units,
// a water tank, and the next building (x = 9) taller, with a lightning rod at (9, 9, 0); city lights below and around.
// Lightning, rain and the hero are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('rooftop', async (W) => {
  W.shadowArea([0, 0, 0], 12);
  W.add(K.box(16, 0.2, 14, K.mat('#4a4c52', { rough: 1 }), [0, -0.1, 0])); for (const [x, z, w, d] of [[0, 7, 16, 0.3], [0, -7, 16, 0.3], [-8, 0, 0.3, 14]]) W.add(K.box(w, 0.8, d, K.mat('#5a5c62'), [x, 0.4, z]));
  for (let i = 0; i < 3; i++) W.add(K.box(1.4, 1.0, 1.0, K.mat('#8a8f96', { rough: 0.6 }), [-4 + i * 2, 0.5, -4]));
  W.add(K.cyl(1.0, 1.0, 2.2, K.mat('#6a5040', { rough: 0.9 }), [-5, 2.6, 3], null, 16)); for (const [x, z] of [[-5.6, 2.4], [-4.4, 2.4], [-5.6, 3.6], [-4.4, 3.6]]) W.add(K.box(0.1, 1.5, 0.1, K.mat('#3a3d42'), [x, 0.75, z]));
  W.add(K.box(6, 9, 10, K.mat('#2a2d36', { rough: 1, flat: true }), [11, 4.5 - 0.1, 0])); W.add(K.box(0.08, 2.0, 0.08, K.mat('#c9ced3', { metal: 0.9 }), [9, 9.9, 0]));
  for (let i = 0; i < 40; i++) { const x = -60 + (i % 10) * 13, z = -20 - Math.floor(i / 10) * 18, h = 8 + (i * 7) % 20; W.add(K.box(8, h, 8, K.mat('#1a1d26', { rough: 1 }), [x, h / 2 - 12, z])); for (let k = 0; k < 4; k++) W.add(K.box(1, 1, 0.1, K.glowMat(k % 2 ? '#ffd29a' : '#9fd0ff', 0.9), [x - 2 + k * 1.3, -10 + (k * 3 + i) % h, z + 4.05])); }
  const moon = new THREE.DirectionalLight('#8fa4d0', 0.7); moon.position.set(-10, 20, 10); W.add(moon);
  return {};
});
