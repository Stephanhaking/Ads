// Set: an MRI research room: pale blue walls, a big white MRI scanner (a thick ring with a bed sliding in), a control
// window with monitors glowing, soft ceiling panels. People, screens and text are 2D. Scanner centred at x = 0, z = -1.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('mriroom', async (W) => {
  W.shadowArea([0, 1, 0], 6); W.fogScale(0.1);
  W.add(K.box(12, 0.1, 9, K.mat('#d9e2e8', { rough: 0.5 }), [0, -0.05, 0]));
  W.add(K.box(12, 3.4, 0.2, K.mat('#c9dcea', { rough: 0.9 }), [0, 1.7, -3.4])); W.add(K.box(0.2, 3.4, 9, K.mat('#d4e4ef', { rough: 0.9 }), [-5, 1.7, 1]));
  W.add(K.box(12, 0.1, 9, K.mat('#f4f6f8'), [0, 3.4, 1])); for (const x of [-2.5, 0, 2.5]) W.add(K.box(1.4, 0.04, 1.4, K.glowMat('#ffffff', 1.3), [x, 3.34, 0]));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.45, 24, 48), K.mat('#f4f6f8', { rough: 0.35 })); ring.position.set(0, 1.2, -1.2); W.add(ring);
  W.add(K.box(2.4, 2.3, 1.0, K.mat('#eef1f4', { rough: 0.4 }), [0, 1.15, -1.7]));
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.58, 40), K.mat('#2a3340', { rough: 0.6 })); hole.position.set(0, 1.2, -0.74); W.add(hole);
  W.add(K.box(0.7, 0.12, 2.6, K.mat('#dfe5ea', { rough: 0.4 }), [0, 0.86, 0.3])); W.add(K.box(0.5, 0.8, 1.6, K.mat('#b9c4cc', { rough: 0.5 }), [0, 0.4, 0.8]));
  W.add(K.box(2.6, 1.1, 0.05, K.glowMat('#9fd0ff', 0.6), [3.4, 1.8, -3.28]));
  for (let i = 0; i < 3; i++) W.add(K.box(0.55, 0.35, 0.03, K.glowMat(['#7dffb0', '#ffd29a', '#9fd0ff'][i], 1.4), [2.7 + i * 0.7, 1.75, -3.24]));
  const l = new THREE.PointLight('#ffffff', 24, 10, 1.4); l.position.set(0, 3.0, 1.5); W.add(l);
  return {};
});
