// Set: a snowy Russian city on a winter morning: wide snowy street along X, five-storey concrete apartment blocks
// with rows of windows on both sides, bare birch trees, parked cars as snowy lumps, a low pale sun; ground y = 0.
// The meteor streak, glass shards and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('snowcity', async (W) => {
  W.shadowArea([0, 0, 0], 30);
  W.add(K.ground({ color: '#eef2f6', size: 800 })); W.add(K.box(400, 0.02, 10, K.mat('#c9ced6', { rough: 0.8 }), [0, 0.01, 0]));
  const blk = K.mat('#c8c2b6', { rough: 1, flat: true }), win = K.mat('#4a5a6e', { rough: 0.2 });
  for (let i = -5; i <= 5; i++) for (const z of [-16, 16]) { const x = i * 26; W.add(K.box(22, 15, 10, blk, [x, 7.5, z])); W.add(K.box(22.4, 0.4, 10.4, K.mat('#9a948a'), [x, 15.2, z]));
    for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) W.add(K.box(1.3, 1.4, 0.05, win, [x - 9 + c * 2.6, 1.8 + r * 2.8, z + (z < 0 ? 5.03 : -5.03)])); }
  for (let i = 0; i < 18; i++) { const x = -110 + i * 13, z = (i % 2 ? 9 : -9); W.add(K.cyl(0.12, 0.18, 6, K.mat('#efece4', { rough: 0.8 }), [x, 3, z], null, 8)); for (let k = 0; k < 4; k++) W.add(K.cyl(0.03, 0.05, 2.4, K.mat('#5a5048'), [x + (k - 1.5) * 0.4, 5.4, z], [0, 0, (k - 1.5) * 18], 5)); }
  for (let i = 0; i < 10; i++) W.add(K.rbox(4, 1.4, 1.8, K.mat('#f4f6f8', { rough: 0.9 }), [-60 + i * 12, 0.7, i % 2 ? 6 : -6], null, 0.5));
  const sun = new THREE.DirectionalLight('#ffe8d0', 1.8); sun.position.set(80, 20, -60); W.add(sun);
  return {};
});
