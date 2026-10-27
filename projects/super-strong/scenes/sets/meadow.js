// Set: a meadow at beetle scale (macro): damp brown soil (y = 0), giant grass blades and clover leaves towering around,
// a dung pat, pebbles, out-of-focus wildflowers far away. Scale: 1 unit = 1 cm of the real meadow; the beetle (2D) is
// about 1 unit long; the thread runs along +x from the origin.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('meadow', async (W) => {
  W.shadowArea([0, 0, 0], 12);
  W.add(K.ground({ color: '#6a4f36', size: 600 }));
  const R = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const r = R(9);
  const greens = ['#4f8a3a', '#5f9a44', '#3f7a32', '#6aa44c'];
  for (let i = 0; i < 160; i++) { const a = r() * Math.PI * 2, d = 4 + r() * 60, h = 6 + r() * 22; const b = new THREE.Mesh(new THREE.ConeGeometry(0.35 + r() * 0.3, h, 3), K.mat(greens[i % 4], { rough: 0.8, flat: true })); b.position.set(Math.cos(a) * d, h / 2, Math.sin(a) * d - 6); b.rotation.set((r() - 0.5) * 0.4, r() * 3, (r() - 0.5) * 0.4); W.add(b); }
  for (let i = 0; i < 10; i++) { const x = (r() - 0.5) * 40, z = -6 - r() * 30; for (let k = 0; k < 3; k++) { const leaf = new THREE.Mesh(new THREE.CircleGeometry(2.2, 18), K.mat('#5aa04a', { rough: 0.7, side: 'double' })); leaf.position.set(x + Math.cos(k * 2.1) * 2, 7 + r() * 3, z + Math.sin(k * 2.1) * 2); leaf.rotation.x = -Math.PI / 2 + 0.3; W.add(leaf); } W.add(K.cyl(0.2, 0.2, 8, K.mat('#4f8a3a'), [x, 4, z], null, 6)); }
  const pat = new THREE.Mesh(new THREE.SphereGeometry(6, 24, 12), K.mat('#4a3424', { rough: 1 })); pat.scale.y = 0.35; pat.position.set(-9, 0, -4); W.add(pat);
  for (let i = 0; i < 30; i++) W.add(K.sphere(0.2 + r() * 0.6, K.mat(['#8a8580', '#a09a90', '#6a655e'][i % 3], { rough: 1, flat: true }), [(r() - 0.5) * 30, 0.1, (r() - 0.5) * 20], 8));
  for (let i = 0; i < 14; i++) W.add(K.sphere(1.6, K.mat(['#f2d23a', '#f4f1ea', '#c86a8a'][i % 3], { rough: 0.8 }), [(r() - 0.5) * 120, 18 + r() * 8, -60 - r() * 40], 12));
  const sun = new THREE.DirectionalLight('#fff2d6', 2.4); sun.position.set(30, 50, 20); W.add(sun);
  return {};
});
