// Set: Bo's garage turned into a headquarters at night: concrete floor (y = 0), breeze-block walls, a half-open
// roll-up door at the back (z = -4) showing the night street, a workbench with tools, a big whiteboard on the left
// wall (x = -3.9), a hanging bulb and a string of fairy lights, a car tyre stack, a folding table at the origin.
// The laptop, chairs, crisps and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('garage', async (W) => {
  W.shadowArea([0, 1, 0], 7); W.fogScale(0.1);
  W.add(K.box(9, 0.1, 10, K.mat('#8c8a84', { rough: 0.9 }), [0, -0.05, 0]));
  for (const [x, z, w, d] of [[-4, 0, 0.2, 10], [4, 0, 0.2, 10]]) W.add(K.box(w, 3, d, K.mat('#b9b4aa', { rough: 1 }), [x, 1.5, z]));
  for (let i = 0; i < 12; i++) for (const x of [-3.88, 3.88]) W.add(K.box(0.02, 0.02, 10, K.mat('#9a958c'), [x, 0.2 + i * 0.25, 0]));
  W.add(K.box(8, 1.4, 0.15, K.mat('#6a7078', { rough: 0.6 }), [0, 2.3, -4])); for (let i = 0; i < 6; i++) W.add(K.box(8, 0.03, 0.17, K.mat('#5a6068'), [0, 1.7 + i * 0.22, -4]));
  W.add(K.box(8, 1.6, 0.1, K.mat('#0c1220'), [0, 0.8, -4.6])); for (let i = 0; i < 3; i++) W.add(K.sphere(0.15, K.glowMat('#ffd29a', 1.6), [-3 + i * 3, 1.6, -9], 10));
  W.add(K.box(8, 0.1, 10, K.mat('#9a958c'), [0, 3.0, 0]));
  W.add(K.box(0.05, 1.3, 2.4, K.mat('#f6f6f2', { rough: 0.4 }), [-3.86, 1.6, -0.5])); W.add(K.box(0.07, 1.4, 2.5, K.mat('#c9ced3'), [-3.88, 1.6, -0.5]));
  W.add(K.box(2.4, 0.08, 0.7, K.mat('#8a5a32'), [2.6, 0.9, -3.4])); W.add(K.box(2.4, 1.2, 0.05, K.mat('#6a4a2a'), [2.6, 1.6, -3.76]));
  for (let i = 0; i < 6; i++) W.add(K.box(0.04, 0.3, 0.04, K.mat(['#c43a2a', '#2f6fdb', '#e0b44a'][i % 3]), [1.7 + i * 0.32, 1.7, -3.7]));
  for (let i = 0; i < 4; i++) W.add(K.cyl(0.38, 0.38, 0.22, K.mat('#1e1e22', { rough: 0.9 }), [3.2, 0.12 + i * 0.23, 1.6], null, 18));
  W.add(K.box(1.6, 0.05, 0.9, K.mat('#d9d4c8', { rough: 0.6 }), [0, 0.74, 0])); for (const [x, z] of [[-0.7, -0.38], [0.7, -0.38], [-0.7, 0.38], [0.7, 0.38]]) W.add(K.box(0.04, 0.72, 0.04, K.mat('#3a3d42'), [x, 0.36, z]));
  W.add(K.cyl(0.01, 0.01, 0.6, K.mat('#222'), [0, 2.7, 0])); W.add(K.sphere(0.09, K.glowMat('#fff2d6', 2.2), [0, 2.36, 0], 12));
  for (let i = 0; i < 14; i++) W.add(K.sphere(0.035, K.glowMat(['#ffd29a', '#ff9ab0', '#9fd0ff'][i % 3], 2.0), [-3.8, 2.75 - Math.sin(i / 13 * Math.PI) * 0.25, -4 + i * 0.6], 6));
  const l = new THREE.PointLight('#ffe2b0', 18, 9, 1.4); l.position.set(0, 2.3, 0); W.add(l);
  return {};
});
