// Set: an empty supermarket car park at night: dark asphalt (y = 0) with faded white bays, tall sodium lamps casting
// orange pools, a closed supermarket facade at z = -20 with a lit sign strip, a few parked cars as low boxes, trees as
// dark cones. The drone, the van and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
import { flatten } from '../lib/flatten.js';
registerSet('parking', async (W) => {
  W.shadowArea([0, 0, 0], 20);
  W.add(K.ground({ color: '#26282e', size: 500 }));
  for (let i = -8; i <= 8; i++) for (const z of [-6, 6]) W.add(K.box(0.1, 0.01, 4.6, K.mat('#c9ccd0'), [i * 2.6, 0.01, z]));
  for (const [x, z] of [[-14, -2], [0, 3], [14, -2]]) { W.add(K.box(0.2, 9, 0.2, K.mat('#3a3d42'), [x, 4.5, z])); W.add(K.box(1.2, 0.3, 0.5, K.glowMat('#ffb45a', 2.0), [x, 9, z])); const l = new THREE.PointLight('#ffa040', 30, 16, 1.6); l.position.set(x, 8.5, z); W.add(l); }
  W.add(K.box(50, 7, 6, K.mat('#4a4c56', { rough: 1, flat: true }), [0, 3.5, -22])); W.add(K.box(18, 1.4, 0.2, K.glowMat('#e2553f', 1.6), [0, 6, -18.9])); for (let i = 0; i < 6; i++) W.add(K.box(3.2, 2.6, 0.1, K.glowMat('#2a3a50', 0.6), [-14 + i * 5.6, 1.4, -18.9]));
  for (const [x, z, c] of [[-10.4, 6, '#8a3a3a'], [7.8, -6, '#3a5a7a'], [13, 6, '#6a6f7a']]) { W.add(K.rbox(1.9, 1.0, 4.2, K.mat(c, { rough: 0.5 }), [x, 0.6, z], null, 0.2)); W.add(K.rbox(1.6, 0.6, 2.2, K.mat('#1e2430', { rough: 0.2 }), [x, 1.3, z - 0.2], null, 0.2)); }
  for (let i = 0; i < 10; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5, 7), K.mat('#16241c', { rough: 1, flat: true })); c.position.set(-30 + i * 6.5, 2.5, 14); W.add(c); }
  const moon = new THREE.DirectionalLight('#7f90c0', 0.5); moon.position.set(10, 30, 20); W.add(moon);
  flatten(W);
  return {};
});
