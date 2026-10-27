// Set: an old observatory on a grassy hilltop at dawn: a round stone building with a white dome (with a slit), a paved
// terrace with a railing, a valley of mist below, distant hills. Inside view: the telescope is 2D. Terrace at y = 0, centre (0, 0, 0).
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('observatory', async (W) => {
  W.shadowArea([0, 0, -3], 14);
  const hill = new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), K.mat('#6f9a4a', { rough: 1 })); hill.scale.y = 0.14; hill.position.set(0, -8.4, -6); W.add(hill);
  const mist = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), K.mat('#e8eef4', { opacity: 0.85, rough: 1 })); mist.rotation.x = -Math.PI / 2; mist.position.y = -6; W.add(mist);
  for (let i = 0; i < 9; i++) { const h = new THREE.Mesh(new THREE.SphereGeometry(40 + (i % 3) * 15, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(['#7f9ab0', '#8fa9bd', '#a4b8c8'][i % 3], { rough: 1 })); h.scale.y = 0.35; h.position.set(-200 + i * 50, -6, -180 - (i % 2) * 60); W.add(h); }
  W.add(K.cyl(9, 9, 0.2, K.mat('#bdb5a6', { rough: 0.9 }), [0, -0.1, -2], null, 48));
  W.add(K.cyl(3.4, 3.4, 4.2, K.mat('#d9cdb8', { rough: 0.95 }), [0, 2.1, -5], null, 40));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(3.6, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), K.mat('#f2f2ee', { rough: 0.35, metal: 0.2 })); dome.position.set(0, 4.2, -5); W.add(dome);
  W.add(K.box(0.9, 3.0, 0.3, K.mat('#2a2d33'), [0, 6.0, -1.75]));
  W.add(K.box(1.3, 2.2, 0.2, K.mat('#6e4527', { rough: 0.8 }), [0, 1.1, -1.6]));
  for (let i = 0; i < 24; i++) { const a = -0.6 + (i / 23) * 1.2 + Math.PI / 2; W.add(K.cyl(0.04, 0.04, 1.0, K.mat('#4a4d55', { metal: 0.5 }), [Math.cos(a) * 8.6, 0.5, -2 + Math.sin(a) * 8.6], null, 6)); }
  const rail = new THREE.Mesh(new THREE.TorusGeometry(8.6, 0.04, 6, 64, 1.2), K.mat('#4a4d55', { metal: 0.5 })); rail.rotation.x = -Math.PI / 2; rail.rotation.z = Math.PI / 2 - 0.6 - Math.PI / 2 + Math.PI; rail.position.set(0, 1.0, -2); W.add(rail);
  const sun = new THREE.DirectionalLight('#ffd2a0', 2.2); sun.position.set(30, 12, 20); W.add(sun);
  return {};
});
