// Set: an outdoor basketball court at dawn: green-blue court (y = 0) with white lines, a hoop at x = 12, chain-link fence
// around, a punching bag hanging from a steel frame at (0, 0, 0) (bag bottom y = 0.8, top y = 2.0), apartment blocks
// behind, low orange sun. People are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('court', async (W) => {
  W.shadowArea([0, 0, 0], 16);
  W.add(K.ground({ color: '#5a6a5e', size: 400 })); W.add(K.box(30, 0.04, 16, K.mat('#2f6f6a', { rough: 0.8 }), [0, 0.02, 0]));
  const line = K.mat('#f2f2ec'); W.add(K.box(30, 0.05, 0.1, line, [0, 0.03, 8])); W.add(K.box(30, 0.05, 0.1, line, [0, 0.03, -8])); W.add(K.box(0.1, 0.05, 16, line, [0, 0.03, 0]));
  W.add(K.box(0.2, 3.4, 0.2, K.mat('#3a3d42'), [13.2, 1.7, 0])); W.add(K.box(0.1, 1.1, 1.8, K.mat('#f2f2f2'), [13.0, 3.2, 0])); W.add(K.cyl(0.24, 0.24, 0.04, K.mat('#e2553f'), [12.7, 3.0, 0], null, 16));
  W.add(K.box(0.15, 2.6, 0.15, K.mat('#3a3d42'), [-0.8, 1.3, 0])); W.add(K.box(0.15, 2.6, 0.15, K.mat('#3a3d42'), [0.8, 1.3, 0])); W.add(K.box(1.75, 0.15, 0.15, K.mat('#3a3d42'), [0, 2.6, 0]));
  W.add(K.cyl(0.32, 0.32, 1.2, K.mat('#c43a2a', { rough: 0.7 }), [0, 1.4, 0], null, 18)); W.add(K.box(0.03, 0.6, 0.03, K.mat('#888'), [0, 2.3, 0]));
  for (let i = -8; i <= 8; i++) { W.add(K.box(0.06, 3.5, 0.06, K.mat('#8a8f96'), [i * 2, 1.75, -10])); } W.add(K.box(34, 3.5, 0.02, K.mat('#9aa0a6', { opacity: 0.3 }), [0, 1.75, -10]));
  for (let i = 0; i < 6; i++) W.add(K.box(10, 14 + (i % 3) * 6, 8, K.mat(['#b88a6a', '#a87a5e', '#c89a7a'][i % 3], { rough: 1, flat: true }), [-30 + i * 12, 7 + (i % 3) * 3, -26]));
  const sun = new THREE.DirectionalLight('#ffbe86', 2.4); sun.position.set(-40, 12, -20); W.add(sun);
  return {};
});
