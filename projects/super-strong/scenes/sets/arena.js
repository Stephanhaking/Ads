// Set: a strongman competition stage: a dark hall, a raised black stage (top at y = 0.6) with a rubber lifting
// platform at the origin, banners, spotlight cones, rows of crowd silhouettes in front. The lifter and bar are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('arena', async (W) => {
  W.shadowArea([0, 1, 0], 10); W.fogScale(0.3);
  W.add(K.box(80, 0.1, 80, K.mat('#1a1b20', { rough: 0.9 }), [0, -0.05, 0])); W.add(K.box(16, 0.6, 9, K.mat('#22242a', { rough: 0.6 }), [0, 0.3, -1]));
  W.add(K.box(3.6, 0.06, 2.6, K.mat('#3a3d42', { rough: 1 }), [0, 0.63, 0])); W.add(K.box(1.2, 0.07, 2.6, K.mat('#8a6a3a', { rough: 0.8 }), [0, 0.64, 0]));
  W.add(K.box(30, 12, 0.3, K.mat('#14151a'), [0, 6, -8])); for (let i = 0; i < 3; i++) W.add(K.box(4, 7, 0.1, K.mat(['#c43a2a', '#e0b44a', '#2f6fdb'][i], { rough: 0.9 }), [-6 + i * 6, 6.5, -7.8]));
  for (let i = 0; i < 4; i++) { const cone = new THREE.Mesh(new THREE.ConeGeometry(2.6, 10, 24, 1, true), K.mat('#fff2c0', { opacity: 0.08, side: 'double' })); cone.position.set(-6 + i * 4, 5.6, 0); W.add(cone); W.add(K.cyl(0.4, 0.5, 0.6, K.glowMat('#fff6d6', 2.2), [-6 + i * 4, 10.8, 0], null, 12)); }
  for (let row = 0; row < 4; row++) for (let i = 0; i < 26; i++) { const h = 1.1 + ((i * 7 + row * 3) % 5) * 0.08; W.add(K.rbox(0.5, h, 0.4, K.mat('#0c0d10', { rough: 1 }), [-13 + i + (row % 2) * 0.5, h / 2 + row * 0.35, 6 + row * 1.2])); W.add(K.sphere(0.2, K.mat('#0c0d10'), [-13 + i + (row % 2) * 0.5, h + 0.2 + row * 0.35, 6 + row * 1.2], 10)); }
  const l = new THREE.PointLight('#ffffff', 40, 20, 1.4); l.position.set(0, 8, 3); W.add(l);
  return {};
});
