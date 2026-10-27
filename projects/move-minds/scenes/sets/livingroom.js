// Set: a warm living room / home lab: wooden floor, cream walls, a big window with daylight, a sofa, a bookshelf, a
// lamp, a table by the window (top at y = 0.75, centred at (0, 0, 0)). The woman, wheelchair, robot arm and cup are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('livingroom', async (W) => {
  W.shadowArea([0, 1, 0], 8); W.fogScale(0.1);
  W.add(K.box(14, 0.1, 12, K.mat('#a8754a', { rough: 0.7 }), [0, -0.05, 0])); W.add(K.box(14, 3.2, 0.2, K.mat('#efe3cc', { rough: 0.95 }), [0, 1.6, -3]));
  W.add(K.box(0.2, 3.2, 12, K.mat('#e8dcc4', { rough: 0.95 }), [-5, 1.6, 2])); W.add(K.box(3.2, 1.9, 0.05, K.glowMat('#dff2ff', 1.1), [1.8, 1.7, -2.88]));
  for (const x of [0.2, 1.8, 3.4]) W.add(K.box(0.1, 2.0, 0.1, K.mat('#f6f2ea'), [x, 1.7, -2.84])); W.add(K.box(3.4, 0.1, 0.12, K.mat('#f6f2ea'), [1.8, 0.75, -2.84]));
  W.add(K.box(1.6, 0.06, 0.9, K.mat('#7a5232', { rough: 0.5 }), [0, 0.75, 0])); for (const [x, z] of [[-0.7, -0.38], [0.7, -0.38], [-0.7, 0.38], [0.7, 0.38]]) W.add(K.box(0.06, 0.72, 0.06, K.mat('#5a3a22'), [x, 0.36, z]));
  W.add(K.rbox(2.6, 0.5, 0.9, K.mat('#4f7a8a', { rough: 0.9 }), [-3.2, 0.35, -2.2])); W.add(K.rbox(2.6, 0.7, 0.25, K.mat('#4f7a8a', { rough: 0.9 }), [-3.2, 0.8, -2.6]));
  W.add(K.box(1.4, 2.4, 0.4, K.mat('#6a4a30'), [-4.6, 1.2, 0.6], [0, 90, 0])); for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) W.add(K.box(0.3, 0.32, 0.08 + (j % 3) * 0.02, K.mat(['#c43a2a', '#2f6fdb', '#e0b44a', '#4f8a5b'][(i + j) % 4]), [-4.45, 0.4 + i * 0.55, 0.05 + j * 0.2]));
  W.add(K.cyl(0.02, 0.02, 1.5, K.mat('#222'), [3.6, 0.75, -1.8])); W.add(K.cyl(0.15, 0.3, 0.3, K.glowMat('#ffe6b0', 1.2), [3.6, 1.6, -1.8], null, 16));
  const sun = new THREE.DirectionalLight('#fff4e0', 2.2); sun.position.set(3, 6, -8); W.add(sun);
  return {};
});
