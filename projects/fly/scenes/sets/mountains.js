// Set: high mountains: steep rocky peaks with snow caps, a cliff edge (exit point) in the foreground at y = 40, a deep
// green valley below. The wingsuit flyer is 2D. Exit point at (0, 40, 0); the valley floor at y = -200.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('mountains', async (W) => {
  const valley = K.ground({ color: '#3f6a3a', size: 6000 }); valley.position.y = -200; W.add(valley);
  const rock = K.mat('#7a7468', { rough: 1, flat: true }), snow = K.mat('#f4f6f8', { rough: 0.9, flat: true });
  const R = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const r = R(4);
  for (let i = 0; i < 26; i++) { const h = 180 + r() * 260, rad = 60 + r() * 80; const x = (r() - 0.5) * 1600, z = -200 - r() * 1200; const m = new THREE.Mesh(new THREE.ConeGeometry(rad, h, 7), rock); m.position.set(x, -200 + h / 2, z); W.add(m); const s = new THREE.Mesh(new THREE.ConeGeometry(rad * 0.32, h * 0.3, 7), snow); s.position.set(x, -200 + h * 0.86, z); W.add(s); }
  const cliff = new THREE.Mesh(new THREE.ConeGeometry(60, 260, 6), rock); cliff.position.set(-30, -90, 20); W.add(cliff);
  const pil = new THREE.Mesh(new THREE.CylinderGeometry(5, 30, 240, 7), rock); pil.position.set(-2, -82, 2); W.add(pil);
  W.add(K.box(8, 2, 8, K.mat('#6a645a', { rough: 1, flat: true }), [-2, 39, 2]));
  const sun = new THREE.DirectionalLight('#fff2d6', 2.4); sun.position.set(100, 160, 80); W.add(sun);
  return {};
});
