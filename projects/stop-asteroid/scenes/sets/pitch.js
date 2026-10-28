// Set: a school football pitch at night: wide grass with white lines (centre circle at the origin, halfway line along
// X), two goals at x = +-30, floodlight masts switched off, the school building (with a few lit windows) behind the
// far touchline (z = -30), the town's lights beyond; ground y = 0. The friends, the rock and stars are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('pitch', async (W) => {
  W.shadowArea([0, 0, 0], 20);
  W.add(K.ground({ color: '#2f5a32', size: 600 }));
  const line = K.mat('#e8ece4', { rough: 0.8 });
  W.add(K.box(0.12, 0.01, 40, line, [0, 0.01, 0])); for (const x of [-30, 30]) W.add(K.box(0.12, 0.01, 40, line, [x, 0.01, 0])); for (const z of [-20, 20]) W.add(K.box(60, 0.01, 0.12, line, [0, 0.01, z]));
  const ring = new THREE.Mesh(new THREE.RingGeometry(9.1, 9.25, 64), line); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.012; W.add(ring);
  for (const x of [-30, 30]) { for (const z of [-3.66, 3.66]) W.add(K.box(0.12, 2.44, 0.12, line, [x, 1.22, z])); W.add(K.box(0.12, 0.12, 7.44, line, [x, 2.44, 0])); }
  for (const [x, z] of [[-34, -24], [34, -24], [-34, 24], [34, 24]]) { W.add(K.box(0.5, 18, 0.5, K.mat('#4a4f58'), [x, 9, z])); W.add(K.box(3, 1.6, 0.4, K.mat('#2a2d33'), [x, 18, z])); }
  W.add(K.box(70, 12, 12, K.mat('#5a5048', { rough: 1, flat: true }), [0, 6, -42])); for (let i = 0; i < 24; i++) if (i % 3) W.add(K.box(1.6, 1.6, 0.1, K.glowMat(i % 4 ? '#ffd29a' : '#9fd0ff', 0.9), [-32 + i * 2.8, 3 + (i % 2) * 4, -35.9]));
  for (let i = 0; i < 40; i++) W.add(K.box(6 + (i % 4) * 3, 8 + (i % 5) * 5, 6, K.mat('#141824', { rough: 1 }), [-200 + i * 10, 6, -120 - (i % 3) * 20]));
  const moon = new THREE.DirectionalLight('#9fb4e0', 0.9); moon.position.set(-20, 40, 30); W.add(moon);
  return {};
});
