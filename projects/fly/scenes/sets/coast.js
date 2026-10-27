// Set: a coast: calm blue sea along -Z, tall white chalk cliffs on the left, a sandy beach on the right with a few
// wooden groynes. Aircraft, wingsuit and jet-suit flyers are 2D. Sea level y = 0; beach at x > 10, cliffs at x < -20.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('coast', async (W) => {
  W.shadowArea([10, 0, 0], 30);
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), K.mat('#3f7fa8', { rough: 0.2 })); sea.rotation.x = -Math.PI / 2; W.add(sea);
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(200, 60), K.mat('#e6d3a3', { rough: 1 })); sand.rotation.x = -Math.PI / 2; sand.rotation.z = -0.05; sand.position.set(60, 0.15, 30); W.add(sand);
  for (let i = 0; i < 8; i++) W.add(K.box(0.4, 0.8, 12, K.mat('#6e4527', { rough: 0.9 }), [20 + i * 12, 0.4, 14]));
  for (let i = 0; i < 12; i++) { const c = K.box(30, 40 + (i % 4) * 8, 40, K.mat(i % 3 ? '#f2f0e6' : '#e6e2d4', { rough: 1 }), [-40 - i * 6, 15, 20 - i * 45]); c.rotation.y = 0.2 + (i % 3) * 0.1; W.add(c); }
  for (let i = 0; i < 12; i++) { const g = K.box(30, 2, 40, K.mat('#6f9a4a', { rough: 1 }), [-40 - i * 6, 36 + (i % 4) * 4, 20 - i * 45]); g.rotation.y = 0.2 + (i % 3) * 0.1; W.add(g); }
  const sun = new THREE.DirectionalLight('#fff2d6', 2.4); sun.position.set(60, 80, 40); W.add(sun);
  return {};
});
