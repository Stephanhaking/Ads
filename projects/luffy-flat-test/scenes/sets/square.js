// Set: a busy city square at night: a wide paved plaza (y = 0) with a fountain at (8, 0, -6), a road crossing along X at
// z = 6 (asphalt with lane lines), shopfronts with warm windows all around, street lamps, and a gas-main crater area at
// (0, 0, 6) (drawn 2D). Buses, cars, the crater, the rubber road and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('square', async (W) => {
  W.shadowArea([0, 0, 0], 24);
  W.add(K.ground({ color: '#5a5650', size: 600 })); W.add(K.box(80, 0.03, 8, K.mat('#2a2c30', { rough: 0.9 }), [0, 0.015, 6])); for (let i = -10; i <= 10; i++) W.add(K.box(2, 0.04, 0.15, K.mat('#e8e2c8'), [i * 4, 0.035, 6]));
  for (let i = 0; i < 12; i++) W.add(K.box(80, 0.02, 0.08, K.mat('#4a4640'), [0, 0.012, -26 + i * 2.4]));
  W.add(K.cyl(3, 3.2, 0.7, K.mat('#9a948a'), [8, 0.35, -6], null, 24)); W.add(K.cyl(2.7, 2.7, 0.1, K.mat('#4f8aa0', { rough: 0.1 }), [8, 0.66, -6], null, 24)); W.add(K.cyl(0.4, 0.5, 2.0, K.mat('#9a948a'), [8, 1.4, -6], null, 12));
  for (let i = 0; i < 12; i++) { const x = -44 + i * 8; W.add(K.box(7.6, 12 + (i % 3) * 4, 6, K.mat(['#5a4a40', '#4a4f5a', '#6a5a48'][i % 3], { rough: 1, flat: true }), [x, 6 + (i % 3) * 2, -24])); for (let k = 0; k < 6; k++) W.add(K.box(1.5, 1.6, 0.1, K.glowMat(k % 3 ? '#ffd29a' : '#ffb070', 1.1), [x - 2.6 + (k % 3) * 2.6, 3 + Math.floor(k / 3) * 4, -20.95])); }
  for (let i = 0; i < 8; i++) { W.add(K.box(0.15, 5, 0.15, K.mat('#22252b'), [-21 + i * 6, 2.5, 1.6])); W.add(K.sphere(0.3, K.glowMat('#ffe2a8', 2.0), [-21 + i * 6, 5.1, 1.6], 10)); }
  const moon = new THREE.DirectionalLight('#9fb4e0', 0.6); moon.position.set(-20, 30, 20); W.add(moon);
  const l = new THREE.PointLight('#ffd29a', 20, 30, 1.2); l.position.set(0, 8, 0); W.add(l);
  return {};
});
