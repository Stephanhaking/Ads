// Set: city rooftops at night: flat roofs at different heights, water towers, antennas, AC units, a skyline with lit
// windows, a big moon glow. Silhouettes of the others are 2D. Main roof (where the camera looks up from) at y = 6 near x = 0..10, z = -6.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('rooftops', async (W) => {
  W.shadowArea([4, 6, -6], 18);
  W.add(K.ground({ color: '#1a1c24', size: 600 }));
  const blocks = [[-2, 7, -7, 6, 14], [5, 9, -8, 5, 18], [11, 6.5, -7, 6, 13], [17, 10, -9, 5, 20], [-8, 8.5, -8, 5, 17]];
  for (const [x, w, z, d, h] of blocks) { const b = K.building({ w, h, d, wall: ['#3a3f52', '#40384a', '#353a48'][Math.abs(x) % 3], seed: x + 50, lit: 0.45 }); b.position.set(x, 0, z); W.add(b); }
  for (const [x, z, h] of [[-2, -7, 14], [11, -7, 13]]) { W.add(K.cyl(0.9, 0.9, 1.6, K.mat('#6a4a3a', { rough: 0.9 }), [x + 1.5, h + 2.2, z], null, 16)); for (const dx of [-0.6, 0.6]) W.add(K.cyl(0.05, 0.05, 1.4, K.mat('#2a2d33'), [x + 1.5 + dx, h + 0.7, z], null, 6)); W.add(K.cyl(0.95, 0.4, 0.5, K.mat('#5a3a2a'), [x + 1.5, h + 3.25, z], null, 16)); }
  for (const [x, z, h] of [[5, -8, 18], [17, -9, 20]]) { W.add(K.cyl(0.03, 0.03, 3, K.mat('#8a929a'), [x, h + 1.5, z], null, 6)); W.add(K.sphere(0.08, K.glowMat('#e2553f', 2.5), [x, h + 3.05, z])); }
  for (let i = 0; i < 18; i++) { const b = K.building({ w: 8, h: 20 + (i * 17) % 40, d: 8, wall: '#2a2e3a', seed: i + 80, lit: 0.6 }); b.position.set(-60 + i * 8, 0, -60); W.add(b); }
  const moon = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 24), new THREE.MeshBasicMaterial({ color: '#fff2d6', fog: false })); moon.position.set(30, 60, -150); W.add(moon);
  const ml = new THREE.DirectionalLight('#a8c0ff', 1.2); ml.position.set(20, 40, 10); W.add(ml);
  return {};
});
