// Set: a high-field magnet lab: a grey hall, a huge vertical cylindrical magnet (2.4 m tall) on a platform with a glowing
// bore at the top, thick cable bundles on the floor, a control desk with monitors, yellow-black safety lines.
// The magnet's bore is centred at (0, 2.6, 0); the frog is 2D. Floor y = 0.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('magnetlab', async (W) => {
  W.shadowArea([0, 1, 0], 10); W.fogScale(0.1);
  W.add(K.box(30, 0.1, 30, K.mat('#8a8f94', { rough: 0.7 }), [0, -0.05, 0])); W.add(K.box(30, 8, 0.3, K.mat('#b4b9bd', { rough: 0.9 }), [0, 4, -8])); W.add(K.box(0.3, 8, 30, K.mat('#a9aeb2', { rough: 0.9 }), [-9, 4, 0]));
  for (let i = 0; i < 6; i++) W.add(K.box(0.6, 0.6, 30, K.mat('#6a6f74', { rough: 0.6 }), [-6 + i * 3, 7.6, 0]));
  W.add(K.box(4, 0.4, 4, K.mat('#4a5058', { rough: 0.6 }), [0, 0.2, 0]));
  W.add(K.cyl(1.0, 1.0, 2.2, K.mat('#2f5f9a', { rough: 0.35 }), [0, 1.5, 0], null, 40)); W.add(K.cyl(1.08, 1.08, 0.18, K.mat('#c9ced3', { rough: 0.3 }), [0, 2.62, 0], null, 40));
  W.add(K.cyl(0.18, 0.18, 0.2, K.glowMat('#cfe6ff', 1.2), [0, 2.65, 0], null, 24)); W.add(K.cyl(1.08, 1.08, 0.18, K.mat('#c9ced3', { rough: 0.3 }), [0, 0.5, 0], null, 40));
  W.add(K.box(0.3, 2.6, 0.3, K.mat('#c9ced3'), [1.6, 1.7, 1.6])); W.add(K.box(3.4, 0.12, 0.12, K.mat('#e0b44a'), [0, 2.9, 1.6]));
  for (let i = 0; i < 5; i++) W.add(K.cyl(0.09, 0.09, 6, K.mat(['#1e1e22', '#c43a2a', '#1e1e22', '#2a4a8a', '#1e1e22'][i], { rough: 0.6 }), [-3.5 - i * 0.25, 0.1, 1.5], [90, 0, 70], 10));
  W.add(K.box(3.4, 0.9, 1.0, K.mat('#d9dcdf', { rough: 0.5 }), [-5, 0.45, -4])); for (let i = 0; i < 3; i++) W.add(K.box(0.9, 0.6, 0.05, K.glowMat(['#7dffb0', '#9fd0ff', '#ffd29a'][i], 1.2), [-6 + i, 1.3, -4.3]));
  for (let i = 0; i < 12; i++) W.add(K.box(0.6, 0.02, 0.2, K.mat(i % 2 ? '#1e1e22' : '#f2c230'), [-3.3 + i * 0.6, 0.01, 2.6]));
  const l = new THREE.PointLight('#ffffff', 30, 16, 1.4); l.position.set(0, 6, 3); W.add(l);
  return {};
});
