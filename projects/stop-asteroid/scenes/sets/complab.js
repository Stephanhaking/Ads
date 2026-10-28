// Set: a school computer lab after dark: rows of desks (top y = 0.75) with monitors glowing blue/green (orbit plots),
// a big projector screen on the back wall (z = -5) glowing, blinds on the windows (x = 6) with city light, a ceiling
// with lights off; desks along z = -2.5, 0, 2.5. People, plots and text are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('complab', async (W) => {
  W.shadowArea([0, 1, 0], 8); W.fogScale(0.1);
  W.add(K.box(14, 0.1, 14, K.mat('#5a6270', { rough: 0.8 }), [0, -0.05, 0])); W.add(K.box(14, 3.2, 0.2, K.mat('#c8ccd2', { rough: 0.95 }), [0, 1.6, -5.2]));
  W.add(K.box(0.2, 3.2, 14, K.mat('#bcc2ca', { rough: 0.95 }), [-6, 1.6, 0])); W.add(K.box(0.2, 3.2, 14, K.mat('#bcc2ca', { rough: 0.95 }), [6, 1.6, 0]));
  for (let i = 0; i < 3; i++) { W.add(K.box(2.4, 1.6, 0.05, K.glowMat('#1a3a5a', 1.0), [6 - 0.12, 1.7, -3 + i * 3], [0, 90, 0])); for (let k = 0; k < 10; k++) W.add(K.box(0.04, 0.05, 2.4, K.mat('#d9dce0'), [5.86, 1.0 + k * 0.15, -3 + i * 3])); }
  W.add(K.box(4.4, 2.2, 0.05, K.glowMat('#2a4a6a', 1.2), [0, 1.9, -5.06]));
  for (const z of [-2.5, 0, 2.5]) { W.add(K.box(8, 0.06, 0.9, K.mat('#e6e2d8', { rough: 0.5 }), [0, 0.75, z])); W.add(K.box(8, 0.72, 0.05, K.mat('#9aa0a8'), [0, 0.36, z + 0.42]));
    for (let i = 0; i < 4; i++) { const x = -3 + i * 2; W.add(K.box(0.6, 0.38, 0.04, K.glowMat(i % 2 ? '#2a6a4a' : '#2a4a7a', 1.3), [x, 1.05, z - 0.2])); W.add(K.box(0.62, 0.4, 0.03, K.mat('#22252b'), [x, 1.05, z - 0.23])); W.add(K.box(0.06, 0.12, 0.06, K.mat('#22252b'), [x, 0.84, z - 0.22])); } }
  W.add(K.box(14, 0.1, 14, K.mat('#9aa0a8'), [0, 3.2, 0]));
  const l = new THREE.PointLight('#7fb0ff', 10, 10, 1.4); l.position.set(0, 2.2, -2); W.add(l);
  return {};
});
