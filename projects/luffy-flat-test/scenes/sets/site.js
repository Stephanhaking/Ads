// Set: a construction site at midday: dirt ground (y = 0), a half-built concrete frame building (columns + floor slabs)
// at z = -8, scaffolding, a tower crane (mast at (-10, 0, -14), jib along +X at y = 30), stacked steel beams and orange
// barriers. The falling beam, the giant fist and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('site', async (W) => {
  W.shadowArea([0, 0, -4], 24);
  W.add(K.ground({ color: '#9a7a5a', size: 500 }));
  const conc = K.mat('#b9b4aa', { rough: 0.95, flat: true });
  for (let fl = 0; fl < 4; fl++) { W.add(K.box(20, 0.4, 10, conc, [4, fl * 4 + 0.2, -10])); if (fl < 3) for (let i = 0; i < 5; i++) for (const z of [-14.5, -5.5]) W.add(K.box(0.6, 4, 0.6, conc, [-5 + i * 4.5, fl * 4 + 2.2, z])); }
  const yel = K.mat('#f2c230', { rough: 0.5, flat: true });
  W.add(K.box(1.4, 32, 1.4, yel, [-10, 16, -14])); W.add(K.box(40, 1.2, 1.2, yel, [6, 31, -14])); W.add(K.box(8, 1.2, 1.2, yel, [-16, 31, -14])); W.add(K.box(3, 3, 3, K.mat('#2a2d33'), [-17, 29, -14]));
  W.add(K.box(0.05, 16, 0.05, K.mat('#222'), [12, 23, -14]));
  for (let i = 0; i < 6; i++) W.add(K.box(8, 0.3, 0.4, K.mat('#8a3a2a', { rough: 0.7 }), [6, 0.15 + i * 0.3, 4]));
  for (let i = 0; i < 8; i++) W.add(K.box(1.2, 0.8, 0.2, K.mat(i % 2 ? '#e2703a' : '#f4f1ea'), [-6 + i * 1.6, 0.4, 7]));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) W.add(K.box(0.08, 4, 0.08, K.mat('#8a8f96', { metal: 0.6 }), [-6 + i * 2, j * 4 + 2, -4.5]));
  const sun = new THREE.DirectionalLight('#fff2d6', 2.6); sun.position.set(30, 60, 20); W.add(sun);
  return {};
});
