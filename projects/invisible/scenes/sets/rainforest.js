// Set: a rainforest at night: dark undergrowth, big broad leaves (flat planes), tree trunks, hanging vines, mist and
// a cool moonlight. The glass frog and its leaf are 2D. Focus leaf near the origin at y = 1.2.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('rainforest', async (W) => {
  W.shadowArea([0, 1, 0], 8);
  W.add(K.ground({ color: '#1f3326', size: 300 }));
  const leafM = (c) => K.mat(c, { rough: 0.6, side: 'double' });
  const R = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const r = R(5);
  for (let i = 0; i < 26; i++) { const t = K.cyl(0.18 + r() * 0.3, 0.25 + r() * 0.3, 14, K.mat('#3a2e22', { rough: 1 }), [(r() - 0.5) * 30, 7, -4 - r() * 20], null, 10); W.add(t); }
  for (let i = 0; i < 140; i++) { const s = 0.4 + r() * 1.4; const leaf = new THREE.Mesh(new THREE.CircleGeometry(s, 10), leafM(['#2f6a3a', '#3f8a4a', '#24553a', '#4f9a5a'][i % 4])); leaf.scale.set(0.55, 1, 1); leaf.position.set((r() - 0.5) * 18, r() * 4.5, -1 - r() * 10); leaf.rotation.set(-0.6 + r() * 1.2, r() * 3, r() * 3); W.add(leaf); }
  for (let i = 0; i < 18; i++) W.add(K.mesh(K.capsuleBetween([(r() - 0.5) * 16, 8, -2 - r() * 8], [(r() - 0.5) * 16, 2 + r() * 3, -2 - r() * 8], 0.03), K.mat('#2a4a2e')));
  const big = new THREE.Mesh(new THREE.CircleGeometry(0.9, 16), leafM('#4f9a5a')); big.scale.set(1.4, 0.7, 1); big.rotation.x = -1.2; big.position.set(0, 1.15, 0); W.add(big);
  const moon = new THREE.DirectionalLight('#a8c8ff', 1.6); moon.position.set(-4, 10, 6); W.add(moon);
  const glow = new THREE.PointLight('#8fffc8', 6, 5, 1.6); glow.position.set(0.5, 2, 1.5); W.add(glow);
  return {};
});
