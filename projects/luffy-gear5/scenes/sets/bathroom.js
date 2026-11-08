// Set: a small morning bathroom: light-blue tiles, a sink with a wide mirror on the back wall (z = -1.6, mirror centre
// y = 1.55), a towel rail, a window with soft daylight on the left (x = -1.9), a tiled floor (y = 0). People are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('bathroom', async (W) => {
  W.shadowArea([0, 1, 0], 4); W.fogScale(0.05);
  W.add(K.box(5, 0.1, 5, K.mat('#d9dee2', { rough: 0.4 }), [0, -0.05, 0.5]));
  W.add(K.box(5, 2.8, 0.1, K.mat('#bfe0ea', { rough: 0.35 }), [0, 1.4, -1.7])); W.add(K.box(0.1, 2.8, 5, K.mat('#cfe8ef', { rough: 0.35 }), [-2, 1.4, 0.5]));
  for (let i = 0; i < 18; i++) W.add(K.box(0.012, 2.8, 0.11, K.mat('#a8cbd6'), [-2.2 + i * 0.27, 1.4, -1.64])); for (let j = 0; j < 10; j++) W.add(K.box(5, 0.012, 0.11, K.mat('#a8cbd6'), [0, j * 0.28, -1.64]));
  W.add(K.box(1.4, 0.9, 0.05, K.mat('#dfe9ee', { metal: 0.9, rough: 0.05 }), [0, 1.6, -1.62])); W.add(K.box(1.5, 1.0, 0.03, K.mat('#9aa3ad'), [0, 1.6, -1.64]));
  W.add(K.box(1.0, 0.18, 0.5, K.mat('#f6f6f2', { rough: 0.3 }), [0, 0.86, -1.35])); W.add(K.box(0.3, 0.86, 0.3, K.mat('#f6f6f2'), [0, 0.43, -1.4]));
  W.add(K.box(0.6, 0.04, 0.04, K.mat('#c9ced3', { metal: 0.8 }), [1.4, 1.2, -1.6])); W.add(K.box(0.5, 0.8, 0.05, K.mat('#e2553f', { rough: 0.9 }), [1.4, 0.85, -1.58]));
  W.add(K.box(0.05, 1.0, 1.0, K.glowMat('#fff6e0', 1.4), [-1.94, 1.8, 0.2]));
  const l = new THREE.PointLight('#fff6e8', 10, 7, 1.4); l.position.set(0, 2.5, 1); W.add(l);
  return {};
});
