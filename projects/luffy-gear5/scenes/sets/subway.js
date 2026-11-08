// Set: a busy subway station at rush hour: a long platform (y = 0) along X with a yellow safety line, tracks sunk at
// z = -4.5, white tiled walls with a red stripe, square columns, a wide staircase coming down from street level at
// x = -6 (steps from y = 0 up to y = 4, going toward -X), a metal handrail at x = 2 (y = 1.0, along X), ceiling strip
// lights, a train waiting on the far track. People and signs are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('subway', async (W) => {
  W.shadowArea([0, 1, 0], 18); W.fogScale(0.2);
  W.add(K.box(80, 0.2, 9, K.mat('#9a968e', { rough: 0.8 }), [0, -0.1, 0.5])); W.add(K.box(80, 0.02, 0.4, K.mat('#f2c230'), [0, 0.01, -3.6]));
  W.add(K.box(80, 1.2, 4, K.mat('#3a3630', { rough: 1 }), [0, -1.1, -6])); for (const z of [-5.2, -6.8]) W.add(K.box(80, 0.12, 0.12, K.mat('#8a8f96', { metal: 0.6, rough: 0.3 }), [0, -0.44, z]));
  W.add(K.box(80, 5, 0.3, K.mat('#eef0ee', { rough: 0.5 }), [0, 2.5, 5])); W.add(K.box(80, 0.4, 0.32, K.mat('#c8352a'), [0, 1.6, 4.84]));
  for (let i = 0; i < 40; i++) W.add(K.box(0.02, 5, 0.32, K.mat('#d8dcd8'), [-40 + i * 2, 2.5, 4.84]));
  W.add(K.box(80, 5, 0.3, K.mat('#e6e8e6', { rough: 0.6 }), [0, 2.5, -8.5])); W.add(K.box(80, 0.4, 0.32, K.mat('#c8352a'), [0, 1.8, -8.34]));
  for (let i = -5; i <= 5; i++) W.add(K.box(0.6, 4.6, 0.6, K.mat('#c9ccd0', { rough: 0.5 }), [i * 6 + 3, 2.3, -2.6]));
  W.add(K.box(80, 0.2, 14, K.mat('#5a5e66'), [0, 4.7, -1.5])); for (let i = 0; i < 14; i++) W.add(K.box(3, 0.05, 0.3, K.glowMat('#fff6e0', 1.6), [-36 + i * 6, 4.58, 0.5]));
  for (let s = 0; s < 14; s++) W.add(K.box(0.45, 0.3 * (s + 1), 3.2, K.mat('#8f8b84', { rough: 0.9 }), [-6 - s * 0.45, 0.15 * (s + 1), 3.1]));
  W.add(K.box(6.4, 0.06, 0.06, K.mat('#b8bec6', { metal: 0.8, rough: 0.2 }), [-9.0, 2.9, 1.48], [0, 0, 33])); W.add(K.box(8, 0.06, 0.06, K.mat('#b8bec6', { metal: 0.8, rough: 0.2 }), [2, 1.0, 2.2]));
  for (let i = 0; i < 5; i++) W.add(K.box(0.05, 1.0, 0.05, K.mat('#b8bec6', { metal: 0.8 }), [-1.8 + i * 1.9, 0.5, 2.2]));
  const train = K.mat('#2f6fdb', { rough: 0.4 }); W.add(K.box(40, 3, 3, train, [6, 1.2, -6])); for (let i = 0; i < 12; i++) W.add(K.box(1.6, 1.1, 0.05, K.glowMat('#fff2c8', 1.0), [-12 + i * 3.2, 1.8, -4.47]));
  const l = new THREE.PointLight('#fff4e0', 22, 18, 1.4); l.position.set(0, 4, 0); W.add(l);
  return {};
});
