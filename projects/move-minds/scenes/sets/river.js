// Set: a river in a city at night: dark water (y = 0) along X, a stone arch bridge across it at x = 0, a paved
// embankment path on the near side (z = 6..10, y = 1.2) with glowing lamp posts, city blocks with lit windows beyond.
// The star, stones and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('river', async (W) => {
  W.shadowArea([0, 1, 8], 16);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(800, 40), K.mat('#12243a', { rough: 0.15 })); water.rotation.x = -Math.PI / 2; W.add(water);
  const stone = K.mat('#6a6560', { rough: 0.95, flat: true });
  W.add(K.box(800, 1.2, 20, K.mat('#4a4642', { rough: 1 }), [0, 0.6, 30])); W.add(K.box(800, 1.2, 40, K.mat('#4a4642', { rough: 1 }), [0, 0.6, -40]));
  W.add(K.box(800, 0.4, 0.3, stone, [0, 1.4, 20.2]));
  for (let i = -6; i <= 6; i++) { W.add(K.box(0.15, 3.4, 0.15, K.mat('#202226'), [i * 9, 2.9, 21])); W.add(K.sphere(0.28, K.glowMat('#ffd29a', 2.0), [i * 9, 4.7, 21], 12)); }
  W.add(K.box(8, 1.2, 42, stone, [0, 5.2, 0])); W.add(K.box(8, 1.0, 0.4, stone, [0, 6.3, 20])); W.add(K.box(8, 1.0, 0.4, stone, [0, 6.3, -20]));
  for (const z of [-10, 10]) W.add(K.box(6, 5, 4, stone, [0, 2.5, z]));
  const R = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const r = R(5);
  for (let i = 0; i < 40; i++) { const w = 8 + r() * 10, h = 10 + r() * 34, x = -200 + i * 10 + r() * 4, z = -70 - r() * 50; W.add(K.box(w, h, 10, K.mat('#1c2030', { rough: 1 }), [x, h / 2, z])); for (let k = 0; k < 6; k++) if (r() < 0.6) W.add(K.box(1.2, 1.4, 0.1, K.glowMat(r() < 0.5 ? '#ffd29a' : '#9fd0ff', 1.0), [x - w / 2 + 1.5 + r() * (w - 3), 3 + r() * (h - 6), z + 5.1])); }
  const moon = new THREE.DirectionalLight('#9fb4e0', 0.8); moon.position.set(-20, 40, 30); W.add(moon);
  return {};
});
