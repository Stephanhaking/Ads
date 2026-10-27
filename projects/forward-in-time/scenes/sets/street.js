// Set: a small-town street in daylight: pavement, road, a row of shop and house fronts, a few trees. Bus stop, dentist sign,
// queue and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('street', async (W) => {
  W.shadowArea([0, 0, 0], 16);
  W.add(K.ground({ color: '#5d6a4a', size: 600 }));
  W.add(K.plaza(80, 6, { color: '#cfc8bb', tile: 1.5 }));
  const road = new THREE.Mesh(new THREE.PlaneGeometry(80, 7), K.mat('#4a4c52', { rough: 0.95 })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.01, 6.5); road.receiveShadow = true; W.add(road);
  for (let i = 0; i < 20; i++) W.add(K.box(1.6, 0.012, 0.15, K.mat('#f2efe8'), [-38 + i * 4, 0.02, 6.5]));
  W.add(K.box(80, 0.15, 0.25, K.mat('#9a948a'), [0, 0.07, 3.0]));
  const cols = ['#d9ccb4', '#e8b4a0', '#a9c4d6', '#e6d39a', '#c9d6b0', '#d9b8d0'];
  for (let i = 0; i < 9; i++) { const b = K.building({ w: 7.5, h: 6 + (i % 3) * 2.2, d: 8, wall: cols[i % cols.length], roofType: i % 2 ? 'gable' : 'flat', seed: i + 3 }); b.position.set(-30 + i * 7.6, 0, -7); W.add(b); }
  for (let i = 0; i < 4; i++) { const t = K.tree({ h: 5, seed: i }); t.position.set(-30 + i * 18, 0, -2.2); W.add(t); }
  return {};
});
