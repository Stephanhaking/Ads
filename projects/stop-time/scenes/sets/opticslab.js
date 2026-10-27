// Set: a dark optics laboratory: black optical table with a hole grid, black curtains, dim blue work lights.
// Lasers, crystal, camera and scientists are 2D. Table top at y = 0.9, centred at the origin.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('opticslab', async (W) => {
  W.shadowArea([0, 1, 0], 6); W.fogScale(0.15);
  W.add(K.box(14, 0.1, 10, K.mat('#1b1e24', { rough: 0.7 }), [0, -0.05, 0]));
  W.add(K.box(14, 3.4, 0.2, K.mat('#121318', { rough: 1 }), [0, 1.7, -3.2])); W.add(K.box(0.2, 3.4, 10, K.mat('#15171c', { rough: 1 }), [-6, 1.7, 1]));
  for (let i = 0; i < 14; i++) W.add(K.box(0.4, 3.2, 0.12, K.mat(i % 2 ? '#101116' : '#16181e', { rough: 1 }), [-6 + i * 0.9, 1.6, -3.05]));
  const holes = K.canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#2a2d33'; g.fillRect(0, 0, w, h); g.fillStyle = '#16181c'; for (let x = 8; x < w; x += 16) for (let y = 8; y < h; y += 16) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); } }, { repeat: [3, 2] });
  W.add(K.box(3.6, 0.12, 1.6, K.mat('#ffffff', { map: holes, rough: 0.4, metal: 0.3 }), [0, 0.86, 0]));
  for (const [x, z] of [[-1.6, -0.65], [1.6, -0.65], [-1.6, 0.65], [1.6, 0.65]]) W.add(K.box(0.2, 0.8, 0.2, K.mat('#3a3d44', { rough: 0.5 }), [x, 0.4, z]));
  W.add(K.box(1.2, 1.8, 0.6, K.mat('#2a2d33', { rough: 0.6 }), [3.8, 0.9, -2.4])); for (let i = 0; i < 5; i++) W.add(K.box(0.08, 0.04, 0.02, K.glowMat(['#7dffb0', '#e0b44a', '#7fc4ff'][i % 3], 2), [3.5 + i * 0.12, 1.5, -2.09]));
  const l1 = new THREE.PointLight('#5f8cff', 26, 9, 1.4); l1.position.set(-2, 2.6, 1.5); W.add(l1);
  const l2 = new THREE.PointLight('#ffffff', 16, 7, 1.4); l2.position.set(1, 2.4, 1); W.add(l2);
  return {};
});
