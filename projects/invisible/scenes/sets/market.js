// Set: a night market: a street lined with food stalls (striped awnings, counters, steam), strings of warm bulbs overhead,
// lanterns, and a dark alley turning off between two buildings at x = 6. People, dog and devices are 2D. Street along X.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('market', async (W) => {
  W.shadowArea([0, 0, 0], 16);
  W.add(K.ground({ color: '#3a3532', size: 400 }));
  for (const s of [-1, 1]) for (let i = 0; i < 7; i++) { const x = -14 + i * 4.2; if (s > 0 && i === 5) continue; const b = K.building({ w: 4, h: 7 + (i % 3) * 2, d: 6, wall: ['#7a4a3a', '#5a4a6a', '#6a5a3a'][i % 3], seed: i + (s > 0 ? 9 : 0), lit: 0.5 }); b.position.set(x, 0, s * 8); W.add(b); }
  const aw = ['#e2553f', '#e0b44a', '#4f8a5b', '#2f6fdb'];
  for (let i = 0; i < 7; i++) { const x = -12 + i * 3.6; W.add(K.box(2.6, 0.95, 1.0, K.mat('#6e4527', { rough: 0.7 }), [x, 0.48, -3.4])); const a = K.box(3.0, 0.08, 1.6, K.mat(aw[i % 4], { rough: 0.8 }), [x, 2.4, -3.2]); a.rotation.x = 0.25; W.add(a); for (const dx of [-1.4, 1.4]) W.add(K.cyl(0.04, 0.04, 2.4, K.mat('#2a2d33'), [x + dx, 1.2, -2.5], null, 8)); }
  for (let i = 0; i < 60; i++) { const x = -15 + i * 0.5; W.add(K.sphere(0.06, K.glowMat(['#ffd29a', '#ff9a7a', '#fff2c8'][i % 3], 2.6), [x, 4.0 - 0.35 * Math.abs(Math.sin(i * 0.3)), 0])); }
  for (let i = 0; i < 5; i++) { const l = new THREE.PointLight('#ffcf8a', 22, 9, 1.6); l.position.set(-12 + i * 6, 3.6, -1.5); W.add(l); }
  // the alley: a narrow dark gap at x = 6 on the far side, with a single cold lamp
  W.add(K.box(2.2, 0.02, 10, K.mat('#24211f'), [7.1, 0.01, 12])); const al = new THREE.PointLight('#9fbfff', 6, 6, 1.6); al.position.set(7, 3, 13); W.add(al);
  return {};
});
